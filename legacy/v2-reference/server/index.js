'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { openDatabase, migrate } = require('./db');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';
const SECRET = process.env.CSER_SESSION_SECRET || (IS_PROD ? '' : 'cser-development-secret-only');
const DEMO_MODE = String(process.env.CSER_DEMO_MODE ?? (IS_PROD ? 'false' : 'true')) === 'true';
const COOKIE_SECURE = String(process.env.CSER_COOKIE_SECURE ?? (IS_PROD ? 'true' : 'false')) === 'true';
const ALLOWED_ORIGINS = new Set(String(process.env.CSER_ALLOWED_ORIGIN || '').split(',').map(x => x.trim()).filter(Boolean));
const MAX_BODY_BYTES = Number(process.env.CSER_MAX_BODY_BYTES || 1_000_000);
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = Number(process.env.CSER_RATE_LIMIT_MAX || 240);

if (!SECRET || (IS_PROD && SECRET.length < 32)) {
  throw new Error('CSER_SESSION_SECRET must contain at least 32 characters in production.');
}
if (IS_PROD && DEMO_MODE && process.env.CSER_ALLOW_PRODUCTION_DEMO !== 'true') {
  throw new Error('Demo mode is disabled in production unless CSER_ALLOW_PRODUCTION_DEMO=true is explicitly set.');
}

const db = openDatabase();
migrate(db);
if (db.prepare('SELECT COUNT(*) AS count FROM tenants').get().count === 0) {
  require('../scripts/seed');
}

const DISCLAIMER = 'Independent candidate concept built from public information and fictional data. It is not an official ESET product and does not use internal ESET systems or APIs.';
const TERMINAL_FINDING_STATES = new Set(['RESOLVED', 'FALSE_POSITIVE']);
const rolePermissions = {
  SECURITY_ANALYST: ['workload:read','finding:read','finding:triage','finding:assign','finding:transition','finding:verify','evidence:create','evidence:read','integration:read','enablement:plan','enablement:execute','analytics:read','audit:read','saved-view:manage','export:create'],
  CLOUD_OPERATIONS: ['workload:read','finding:read','finding:transition','evidence:create','evidence:read','integration:read','enablement:plan','enablement:execute','saved-view:manage'],
  SECURITY_MANAGER: ['workload:read','finding:read','finding:triage','finding:assign','finding:transition','finding:accept-risk','finding:verify','evidence:read','integration:read','enablement:plan','enablement:execute','analytics:read','analytics:assumptions:write','audit:read','saved-view:manage','export:create'],
  READ_ONLY_AUDITOR: ['workload:read','finding:read','evidence:read','integration:read','analytics:read','audit:read','export:create'],
  PLATFORM_ADMIN: ['workload:read','finding:read','evidence:read','integration:read','integration:manage','integration:sync','enablement:plan','enablement:execute','analytics:read','audit:read','tenant:manage','membership:manage','saved-view:manage','export:create']
};

class AppError extends Error {
  constructor(status, code, title, detail, fieldErrors = []) {
    super(detail || title);
    this.status = status;
    this.code = code;
    this.title = title;
    this.detail = detail;
    this.fieldErrors = fieldErrors;
  }
}

const counters = { requests: 0, errors: 0, authFailures: 0, authorizationDenials: 0, mutations: 0 };
const rateBuckets = new Map();
function now() { return new Date().toISOString(); }
function uid(prefix = 'id') { return `${prefix}-${crypto.randomUUID()}`; }
function sha256(value) { return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function hmac(value) { return crypto.createHmac('sha256', SECRET).update(value).digest('base64url'); }
function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}
function safeJson(value, fallback = {}) { try { return JSON.parse(value ?? ''); } catch { return fallback; } }
function signSession(payload) { const body = Buffer.from(JSON.stringify(payload)).toString('base64url'); return `${body}.${hmac(body)}`; }
function verifySession(token) {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.');
  const expected = hmac(body);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.exp > Date.now() ? payload : null;
  } catch { return null; }
}
function parseCookies(req) {
  const out = {};
  for (const item of String(req.headers.cookie || '').split(';')) {
    const index = item.indexOf('=');
    if (index > 0) out[item.slice(0, index).trim()] = decodeURIComponent(item.slice(index + 1));
  }
  return out;
}
function clientIp(req) {
  if (process.env.CSER_TRUST_PROXY === 'true') return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  return req.socket.remoteAddress || 'unknown';
}
function requestContext(req) {
  return {
    correlationId: String(req.headers['x-correlation-id'] || uid('cor')).slice(0, 120),
    requestId: uid('req'),
    idempotencyKey: req.headers['idempotency-key'] ? String(req.headers['idempotency-key']).slice(0, 200) : null,
    ipAddress: clientIp(req),
    userAgent: String(req.headers['user-agent'] || 'unknown').slice(0, 500)
  };
}
function sessionFor(req) {
  const token = parseCookies(req).cser_session;
  const payload = verifySession(token);
  if (!payload) return null;
  const row = db.prepare(`SELECT u.id user_id,u.email,u.display_name,m.role,m.tenant_id,t.name tenant_name,t.key tenant_key
    FROM users u JOIN memberships m ON m.user_id=u.id JOIN tenants t ON t.id=m.tenant_id
    WHERE u.id=? AND m.tenant_id=? AND u.status='ACTIVE' AND m.status='ACTIVE' AND t.status='ACTIVE'`).get(payload.userId, payload.tenantId);
  if (!row) return null;
  return { ...row, permissions: rolePermissions[row.role] || [], sessionToken: token, csrf: hmac(`csrf:${token}`) };
}
function can(session, permission) { return !!session && session.permissions.includes(permission); }
function cookieHeader(token, maxAge) {
  const parts = [`cser_session=${encodeURIComponent(token)}`, 'HttpOnly', 'SameSite=Strict', 'Path=/', `Max-Age=${maxAge}`];
  if (COOKIE_SECURE) parts.push('Secure');
  return parts.join('; ');
}
function bodyJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        reject(new AppError(413, 'BODY_TOO_LARGE', 'Request body is too large', `The maximum accepted body size is ${MAX_BODY_BYTES} bytes.`));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); }
      catch { reject(new AppError(400, 'INVALID_JSON', 'Request body is not valid JSON', 'Correct the JSON syntax and retry.')); }
    });
    req.on('error', reject);
  });
}
function securityHeaders(res, isStatic = false) {
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('x-frame-options', 'DENY');
  res.setHeader('referrer-policy', 'no-referrer');
  res.setHeader('permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.setHeader('cross-origin-opener-policy', 'same-origin');
  res.setHeader('cross-origin-resource-policy', 'same-origin');
  if (IS_PROD) res.setHeader('strict-transport-security', 'max-age=31536000; includeSubDomains');
  if (isStatic) res.setHeader('content-security-policy', "default-src 'self'; script-src 'self' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
}
function send(res, status, data, headers = {}) {
  const body = JSON.stringify(data);
  securityHeaders(res, false);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body), 'cache-control': 'no-store', ...headers });
  res.end(body);
}
function problem(res, error, correlationId) {
  const status = error.status || 500;
  if (status >= 500) counters.errors += 1;
  send(res, status, {
    type: `https://cser.local/problems/${String(error.code || 'INTERNAL_ERROR').toLowerCase()}`,
    title: error.title || 'Unexpected server error',
    status,
    code: error.code || 'INTERNAL_ERROR',
    detail: error.detail || 'The request could not be completed.',
    correlationId,
    fieldErrors: error.fieldErrors || []
  });
}
function requireAuth(req) {
  const session = sessionFor(req);
  if (!session) {
    counters.authFailures += 1;
    throw new AppError(401, 'UNAUTHENTICATED', 'Authentication required', 'Choose a fictional demo identity to continue.');
  }
  return session;
}
function requirePermission(session, permission) {
  if (!can(session, permission)) {
    counters.authorizationDenials += 1;
    throw new AppError(403, 'PERMISSION_DENIED', 'Action is not permitted', `The ${session.role} role does not have ${permission}.`);
  }
}
function requireMutation(req, session) {
  if (req.headers['x-csrf-token'] !== session.csrf) throw new AppError(403, 'CSRF_REJECTED', 'Request could not be verified', 'Refresh the application and retry the operation.');
  const origin = req.headers.origin ? String(req.headers.origin) : null;
  if (origin && ALLOWED_ORIGINS.size && !ALLOWED_ORIGINS.has(origin)) throw new AppError(403, 'ORIGIN_REJECTED', 'Request origin is not allowed', 'The request did not originate from an approved application URL.');
  if (IS_PROD && !origin && process.env.CSER_REQUIRE_ORIGIN === 'true') throw new AppError(403, 'ORIGIN_REQUIRED', 'Request origin is required', 'Browser mutations must include a trusted Origin header.');
}
function enforceRateLimit(req, key, max = RATE_LIMIT_MAX) {
  const bucketKey = `${clientIp(req)}:${key}`;
  const time = Date.now();
  const bucket = rateBuckets.get(bucketKey);
  if (!bucket || bucket.resetAt <= time) {
    rateBuckets.set(bucketKey, { count: 1, resetAt: time + RATE_LIMIT_WINDOW_MS });
    return;
  }
  bucket.count += 1;
  if (bucket.count > max) throw new AppError(429, 'RATE_LIMITED', 'Too many requests', 'Wait briefly before retrying this operation.');
}
function expectedVersion(req) {
  const header = req.headers['if-match'];
  if (!header) throw new AppError(428, 'PRECONDITION_REQUIRED', 'Resource version is required', 'Send the latest ETag in the If-Match header.');
  const raw = String(header).replace(/W\//g, '').replace(/"/g, '');
  const version = Number(raw);
  if (!Number.isInteger(version) || version < 1) throw new AppError(400, 'INVALID_IF_MATCH', 'If-Match is invalid', 'Use the ETag returned by the latest resource response.');
  return version;
}
function ensureVersion(req, row) {
  const version = expectedVersion(req);
  if (version !== row.version) throw new AppError(412, 'VERSION_CONFLICT', 'Resource was updated', 'Reload the resource before applying this action.');
}
function ensureObjectTenant(row, session, label = 'resource') {
  if (!row || row.tenant_id !== session.tenant_id) throw new AppError(404, 'NOT_FOUND', 'Resource not found', `The requested ${label} was not found.`);
}
function ensureCloudOpsObjectAccess(session, finding) {
  if (session.role === 'CLOUD_OPERATIONS' && finding.assignee_user_id !== session.user_id) {
    throw new AppError(404, 'NOT_FOUND', 'Resource not found', 'The requested finding was not found.');
  }
}
function audit(tx, session, action, entityType, entityId, before, after, context = {}) {
  tx.prepare(`INSERT INTO audit_events (id,tenant_id,actor_user_id,actor_role,action,entity_type,entity_id,before_hash,after_hash,safe_diff_json,reason,correlation_id,request_id,idempotency_key,ip_address,user_agent,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(uid('aud'), session.tenant_id, session.user_id, session.role, action, entityType, entityId,
      before ? sha256(stableStringify(before)) : null,
      after ? sha256(stableStringify(after)) : null,
      JSON.stringify(context.diff || {}), context.reason || null, context.correlationId, context.requestId,
      context.idempotencyKey || null, context.ipAddress || 'unknown', context.userAgent || 'unknown', now());
}
async function runIdempotent(req, res, session, context, route, handler, options = {}) {
  requireMutation(req, session);
  enforceRateLimit(req, `mutation:${route}`, options.rateLimit || 90);
  if (!context.idempotencyKey) throw new AppError(400, 'IDEMPOTENCY_REQUIRED', 'Idempotency key required', 'Mutating operations require the Idempotency-Key header.');
  const input = await bodyJson(req);
  const requestHash = sha256(`${req.method}\n${route}\n${stableStringify(input)}`);
  const existing = db.prepare('SELECT * FROM idempotency_records WHERE tenant_id=? AND key=? AND route=? AND expires_at>?').get(session.tenant_id, context.idempotencyKey, route, now());
  if (existing) {
    if (existing.request_hash !== requestHash) throw new AppError(409, 'IDEMPOTENCY_CONFLICT', 'Idempotency key was reused with a different request', 'Use a new Idempotency-Key for a different payload.');
    return send(res, existing.response_status, safeJson(existing.response_body_json), { 'x-correlation-id': context.correlationId, 'x-idempotent-replay': 'true' });
  }
  db.exec('BEGIN IMMEDIATE');
  try {
    const response = await handler(input, db);
    const status = response.status || 200;
    const data = response.data ?? response;
    db.prepare('INSERT INTO idempotency_records (id,tenant_id,key,route,request_hash,response_status,response_body_json,expires_at,created_at) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(uid('idem'), session.tenant_id, context.idempotencyKey, route, requestHash, status, JSON.stringify(data), new Date(Date.now() + 86_400_000).toISOString(), now());
    db.exec('COMMIT');
    counters.mutations += 1;
    return send(res, status, data, { 'x-correlation-id': context.correlationId, ...(response.headers || {}) });
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
function normalizeFinding(row) { if (!row) return null; return { ...row, risk_explanation: safeJson(row.risk_explanation_json, []), risk_explanation_json: undefined }; }
function normalizeWorkload(row) { if (!row) return null; return { ...row, tags: safeJson(row.tags_json, []), tags_json: undefined, internet_exposure: !!row.internet_exposure }; }
function versionHeaders(row) { return row ? { etag: `W/\"${row.version}\"` } : {}; }
function calculateImpact(v) {
  const supportSaving = Number(v.activeOrganizations) * Number(v.supportContactsPerOrg) * Number(v.deflectionRate) * Number(v.averageContactHours) * Number(v.loadedSupportHourValue);
  const onboardingSaving = Number(v.onboardingsPerYear) * Number(v.savedHoursPerOnboarding) * Number(v.technicalHourValue);
  const expansionContribution = Number(v.qualifiedExpansionEvents) * Number(v.contributionPerExpansion);
  const retentionContribution = Number(v.retainedCustomers) * Number(v.annualContributionPerRetainedCustomer);
  const gross = supportSaving + onboardingSaving + expansionContribution + retentionContribution;
  const net = gross - Number(v.annualOperatingCost);
  return { supportSaving, onboardingSaving, expansionContribution, retentionContribution, gross, net, paybackMonths: net > 0 ? Number(v.initialInvestment) / (net / 12) : null };
}
function getOverview(session) {
  const tid = session.tenant_id;
  const totals = db.prepare(`SELECT COUNT(*) total, SUM(CASE WHEN protection_status='PROTECTED' THEN 1 ELSE 0 END) protected, SUM(CASE WHEN protection_status='UNPROTECTED' THEN 1 ELSE 0 END) unprotected FROM workloads WHERE tenant_id=?`).get(tid);
  const findings = db.prepare(`SELECT COUNT(*) total,
    SUM(CASE WHEN severity='CRITICAL' AND status NOT IN ('RESOLVED','FALSE_POSITIVE') THEN 1 ELSE 0 END) critical,
    SUM(CASE WHEN severity='HIGH' AND status NOT IN ('RESOLVED','FALSE_POSITIVE') THEN 1 ELSE 0 END) high,
    SUM(CASE WHEN due_at<? AND status NOT IN ('RESOLVED','FALSE_POSITIVE','ACCEPTED_RISK') THEN 1 ELSE 0 END) overdue,
    SUM(CASE WHEN status='RESOLVED' THEN 1 ELSE 0 END) resolved FROM findings WHERE tenant_id=?`).get(now(), tid);
  const providers = db.prepare('SELECT provider,status,freshness_status,object_count,last_successful_sync_at,version,id FROM cloud_connections WHERE tenant_id=? ORDER BY provider,alias').all(tid);
  const visibility = session.role === 'CLOUD_OPERATIONS' ? 'AND f.assignee_user_id=?' : '';
  const params = session.role === 'CLOUD_OPERATIONS' ? [tid, session.user_id] : [tid];
  const top = db.prepare(`SELECT f.id,f.title,f.severity,f.status,f.risk_score,w.name workload,w.provider FROM findings f JOIN workloads w ON w.id=f.workload_id WHERE f.tenant_id=? ${visibility} AND f.status NOT IN ('RESOLVED','FALSE_POSITIVE') ORDER BY f.risk_score DESC LIMIT 6`).all(...params);
  const actions = session.role === 'CLOUD_OPERATIONS'
    ? db.prepare(`SELECT f.id,f.title,f.severity,f.status,f.due_at,w.name workload FROM findings f JOIN workloads w ON w.id=f.workload_id WHERE f.tenant_id=? AND f.assignee_user_id=? AND f.status IN ('ASSIGNED','IN_PROGRESS','READY_FOR_REVIEW') ORDER BY f.due_at LIMIT 5`).all(tid, session.user_id)
    : db.prepare(`SELECT f.id,f.title,f.severity,f.status,f.due_at,w.name workload FROM findings f JOIN workloads w ON w.id=f.workload_id WHERE f.tenant_id=? AND f.status IN ('OPEN','READY_FOR_REVIEW') ORDER BY f.risk_score DESC LIMIT 5`).all(tid);
  return { totals, findings, coverage: totals.total ? Math.round(totals.protected / totals.total * 1000) / 10 : 0, mttrHours: 4.7, providers, topFindings: top, myActions: actions, riskTrend: [64,61,59,62,55,52,48,44], coverageTrend: [68,69,70,70.5,71.2,72,72.8,73.4], capturedAt: now() };
}
function getFindingDetail(session, id) {
  const row = db.prepare(`SELECT f.*,w.name workload_name,w.provider,w.environment,w.region,w.protection_status,w.internet_exposure,w.owner_team workload_owner FROM findings f JOIN workloads w ON w.id=f.workload_id WHERE f.id=?`).get(id);
  ensureObjectTenant(row, session, 'finding');
  ensureCloudOpsObjectAccess(session, row);
  const task = db.prepare('SELECT * FROM remediation_tasks WHERE tenant_id=? AND finding_id=?').get(session.tenant_id, row.id);
  const comments = db.prepare('SELECT c.*,u.display_name author_name FROM comments c JOIN users u ON u.id=c.author_user_id WHERE c.tenant_id=? AND c.finding_id=? ORDER BY c.created_at').all(session.tenant_id, row.id);
  const evidence = db.prepare('SELECT e.*,u.display_name uploaded_by FROM evidence e JOIN users u ON u.id=e.uploaded_by_user_id WHERE e.tenant_id=? AND e.finding_id=? ORDER BY e.created_at DESC').all(session.tenant_id, row.id);
  const verification = db.prepare('SELECT v.*,u.display_name verifier_name FROM verifications v JOIN users u ON u.id=v.verifier_user_id WHERE v.tenant_id=? AND v.finding_id=? ORDER BY v.verified_at DESC LIMIT 1').get(session.tenant_id, row.id);
  const riskAcceptance = db.prepare('SELECT r.*,u.display_name approved_by FROM risk_acceptances r JOIN users u ON u.id=r.approved_by_user_id WHERE r.tenant_id=? AND r.finding_id=?').get(session.tenant_id, row.id);
  const auditRows = db.prepare("SELECT * FROM audit_events WHERE tenant_id=? AND entity_type='FINDING' AND entity_id=? ORDER BY created_at DESC LIMIT 30").all(session.tenant_id, row.id);
  return { ...normalizeFinding(row), internet_exposure: !!row.internet_exposure, task: task ? { ...task, checklist: safeJson(task.checklist_json, []) } : null, comments, evidence, verification, riskAcceptance, audit: auditRows };
}
function validateAssumptionValues(input) {
  const keys = ['activeOrganizations','supportContactsPerOrg','deflectionRate','averageContactHours','loadedSupportHourValue','onboardingsPerYear','savedHoursPerOnboarding','technicalHourValue','qualifiedExpansionEvents','contributionPerExpansion','retainedCustomers','annualContributionPerRetainedCustomer','initialInvestment','annualOperatingCost'];
  for (const key of keys) if (!Number.isFinite(Number(input[key])) || Number(input[key]) < 0) throw new AppError(422, 'VALIDATION_FAILED', 'Scenario values are invalid', `${key} must be a non-negative number.`, [{ field: key, message: 'Must be a non-negative number.' }]);
  if (Number(input.deflectionRate) > 1) throw new AppError(422, 'VALIDATION_FAILED', 'Scenario values are invalid', 'deflectionRate must be between 0 and 1.');
}
function updateExpiredRiskAcceptances() {
  const expired = db.prepare("SELECT f.id,f.tenant_id FROM findings f JOIN risk_acceptances r ON r.finding_id=f.id AND r.tenant_id=f.tenant_id WHERE f.status='ACCEPTED_RISK' AND r.expires_at<=?").all(now());
  if (!expired.length) return;
  db.exec('BEGIN IMMEDIATE');
  try {
    for (const item of expired) db.prepare("UPDATE findings SET status='TRIAGED',accepted_until=NULL,version=version+1,updated_at=? WHERE id=? AND tenant_id=?").run(now(), item.id, item.tenant_id);
    db.exec('COMMIT');
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}

async function api(req, res, url, context) {
  enforceRateLimit(req, 'api');
  updateExpiredRiskAcceptances();

  if (req.method === 'GET' && url.pathname === '/api/health/live') return send(res, 200, { status: 'live', time: now(), version: '2.0.0' });
  if (req.method === 'GET' && url.pathname === '/api/health/ready') {
    try { db.prepare('SELECT 1 ok').get(); return send(res, 200, { status: 'ready', database: 'ok', time: now() }); }
    catch { throw new AppError(503, 'NOT_READY', 'Service is not ready', 'The database health check failed.'); }
  }
  if (req.method === 'GET' && url.pathname === '/api/metrics') {
    requirePermission(requireAuth(req), 'audit:read');
    return send(res, 200, { ...counters, uptimeSeconds: Math.round(process.uptime()), database: { workloads: db.prepare('SELECT COUNT(*) count FROM workloads').get().count, findings: db.prepare('SELECT COUNT(*) count FROM findings').get().count } });
  }
  if (req.method === 'GET' && url.pathname === '/api/openapi.json') {
    const file = path.join(ROOT, 'docs', 'openapi.json');
    return send(res, 200, JSON.parse(fs.readFileSync(file, 'utf8')));
  }
  if (req.method === 'GET' && url.pathname === '/api/demo/identities') {
    enforceRateLimit(req, 'demo-identities', 60);
    const rows = db.prepare(`SELECT u.id userId,u.display_name displayName,u.email,m.role,m.tenant_id tenantId,t.name tenantName FROM users u JOIN memberships m ON m.user_id=u.id JOIN tenants t ON t.id=m.tenant_id WHERE u.status='ACTIVE' AND m.status='ACTIVE' ORDER BY t.name,u.display_name`).all();
    return send(res, 200, { demoMode: DEMO_MODE, identities: DEMO_MODE ? rows : [], disclaimer: DISCLAIMER }, { 'x-correlation-id': context.correlationId });
  }
  if (req.method === 'POST' && url.pathname === '/api/demo/switch-identity') {
    enforceRateLimit(req, 'demo-login', 20);
    if (!DEMO_MODE) throw new AppError(404, 'NOT_FOUND', 'Route unavailable', 'Demo identity switching is disabled.');
    const input = await bodyJson(req);
    const row = db.prepare("SELECT user_id,tenant_id FROM memberships WHERE user_id=? AND tenant_id=? AND status='ACTIVE'").get(input.userId, input.tenantId);
    if (!row) throw new AppError(422, 'INVALID_IDENTITY', 'Demo identity is invalid', 'Select one of the available fictional identities.');
    const token = signSession({ userId: row.user_id, tenantId: row.tenant_id, exp: Date.now() + 8 * 3_600_000, nonce: uid('ses') });
    res.setHeader('set-cookie', cookieHeader(token, 28_800));
    const session = sessionFor({ ...req, headers: { ...req.headers, cookie: `cser_session=${encodeURIComponent(token)}` } });
    db.exec('BEGIN IMMEDIATE');
    try { audit(db, session, 'DEMO_IDENTITY_SWITCHED', 'SESSION', session.user_id, null, { role: session.role }, context); db.exec('COMMIT'); }
    catch (error) { db.exec('ROLLBACK'); throw error; }
    return send(res, 200, { ok: true }, { 'x-correlation-id': context.correlationId });
  }
  if (req.method === 'POST' && url.pathname === '/api/logout') {
    res.setHeader('set-cookie', cookieHeader('', 0));
    return send(res, 200, { ok: true }, { 'x-correlation-id': context.correlationId });
  }

  const session = requireAuth(req);
  if (req.method === 'GET' && url.pathname === '/api/me') return send(res, 200, { user: { id: session.user_id, email: session.email, displayName: session.display_name }, tenant: { id: session.tenant_id, key: session.tenant_key, name: session.tenant_name }, role: session.role, permissions: session.permissions, csrfToken: session.csrf, demoMode: DEMO_MODE, disclaimer: DISCLAIMER }, { 'x-correlation-id': context.correlationId });
  if (req.method === 'GET' && url.pathname === '/api/overview') { requirePermission(session, 'workload:read'); return send(res, 200, getOverview(session), { 'x-correlation-id': context.correlationId }); }

  if (req.method === 'GET' && url.pathname === '/api/workloads') {
    requirePermission(session, 'workload:read');
    const limit = Math.min(100, Math.max(10, Number(url.searchParams.get('limit') || 25)));
    const page = Math.max(1, Number(url.searchParams.get('page') || 1));
    const where = ['tenant_id=?']; const params = [session.tenant_id];
    const filters = [['provider','provider=?'],['environment','environment=?'],['protectionStatus','protection_status=?'],['severity','highest_severity=?'],['owner','owner_team=?']];
    const search = url.searchParams.get('search');
    if (search) { where.push('(name LIKE ? OR external_id LIKE ? OR owner_team LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    for (const [key, sql] of filters) { const value = url.searchParams.get(key); if (value) { where.push(sql); params.push(value); } }
    const riskMin = url.searchParams.get('riskMin'); if (riskMin) { where.push('risk_score>=?'); params.push(Number(riskMin)); }
    const allowedSort = { risk: 'risk_score', name: 'name', updated: 'updated_at', findings: 'finding_count' };
    const sort = allowedSort[url.searchParams.get('sort')] || 'risk_score'; const dir = url.searchParams.get('dir') === 'asc' ? 'ASC' : 'DESC';
    const total = db.prepare(`SELECT COUNT(*) count FROM workloads WHERE ${where.join(' AND ')}`).get(...params).count;
    const rows = db.prepare(`SELECT * FROM workloads WHERE ${where.join(' AND ')} ORDER BY ${sort} ${dir},id LIMIT ? OFFSET ?`).all(...params, limit, (page - 1) * limit).map(normalizeWorkload);
    return send(res, 200, { items: rows, page, limit, total, pages: Math.ceil(total / limit) }, { 'x-correlation-id': context.correlationId });
  }
  let match = url.pathname.match(/^\/api\/workloads\/([^/]+)$/);
  if (req.method === 'GET' && match) {
    requirePermission(session, 'workload:read');
    const row = db.prepare('SELECT * FROM workloads WHERE id=?').get(match[1]); ensureObjectTenant(row, session, 'workload');
    const findingWhere = session.role === 'CLOUD_OPERATIONS' ? 'tenant_id=? AND workload_id=? AND assignee_user_id=?' : 'tenant_id=? AND workload_id=?';
    const findingParams = session.role === 'CLOUD_OPERATIONS' ? [session.tenant_id, row.id, session.user_id] : [session.tenant_id, row.id];
    const findings = db.prepare(`SELECT id,title,severity,status,risk_score,due_at FROM findings WHERE ${findingWhere} ORDER BY risk_score DESC`).all(...findingParams);
    return send(res, 200, { ...normalizeWorkload(row), findings }, versionHeaders(row));
  }

  if (req.method === 'GET' && url.pathname === '/api/findings') {
    requirePermission(session, 'finding:read');
    const limit = Math.min(100, Math.max(10, Number(url.searchParams.get('limit') || 25)));
    const page = Math.max(1, Number(url.searchParams.get('page') || 1));
    const where = ['f.tenant_id=?']; const params = [session.tenant_id];
    if (session.role === 'CLOUD_OPERATIONS') { where.push('f.assignee_user_id=?'); params.push(session.user_id); }
    for (const [key, sql] of [['severity','f.severity=?'],['status','f.status=?'],['provider','w.provider=?'],['assignee','f.assignee_user_id=?']]) { const value = url.searchParams.get(key); if (value) { where.push(sql); params.push(value); } }
    const query = url.searchParams.get('search'); if (query) { where.push('(f.title LIKE ? OR f.id LIKE ? OR w.name LIKE ?)'); params.push(`%${query}%`, `%${query}%`, `%${query}%`); }
    const total = db.prepare(`SELECT COUNT(*) count FROM findings f JOIN workloads w ON w.id=f.workload_id WHERE ${where.join(' AND ')}`).get(...params).count;
    const rows = db.prepare(`SELECT f.*,w.name workload_name,w.provider,w.environment,w.protection_status FROM findings f JOIN workloads w ON w.id=f.workload_id WHERE ${where.join(' AND ')} ORDER BY f.risk_score DESC,f.updated_at DESC LIMIT ? OFFSET ?`).all(...params, limit, (page - 1) * limit).map(normalizeFinding);
    return send(res, 200, { items: rows, page, limit, total, pages: Math.ceil(total / limit) }, { 'x-correlation-id': context.correlationId });
  }
  match = url.pathname.match(/^\/api\/findings\/([^/]+)$/);
  if (req.method === 'GET' && match) {
    requirePermission(session, 'finding:read');
    const detail = getFindingDetail(session, match[1]);
    return send(res, 200, detail, versionHeaders(detail));
  }

  match = url.pathname.match(/^\/api\/findings\/([^/]+)\/(assign|transition|comment|evidence|verify|accept-risk)$/);
  if (req.method === 'POST' && match) {
    const findingId = match[1]; const action = match[2];
    const permission = action === 'assign' ? 'finding:assign' : action === 'verify' ? 'finding:verify' : action === 'accept-risk' ? 'finding:accept-risk' : action === 'evidence' ? 'evidence:create' : action === 'comment' ? 'finding:read' : 'finding:transition';
    requirePermission(session, permission);
    return runIdempotent(req, res, session, context, `finding:${findingId}:${action}`, async (input, tx) => {
      const row = tx.prepare('SELECT * FROM findings WHERE id=?').get(findingId); ensureObjectTenant(row, session, 'finding'); ensureCloudOpsObjectAccess(session, row); ensureVersion(req, row);
      let result;
      if (action === 'assign') {
        if (!['OPEN','TRIAGED','ASSIGNED'].includes(row.status)) throw new AppError(422, 'INVALID_TRANSITION', 'Finding cannot be assigned', `Assignment is not valid from ${row.status}.`);
        const assignee = tx.prepare('SELECT m.user_id,u.display_name,m.role FROM memberships m JOIN users u ON u.id=m.user_id WHERE m.tenant_id=? AND m.user_id=? AND m.status=\'ACTIVE\'').get(session.tenant_id, input.assigneeUserId);
        if (!assignee || assignee.role !== 'CLOUD_OPERATIONS') throw new AppError(422, 'INVALID_ASSIGNEE', 'Assignee is invalid', 'Select an active Cloud Operations user in this tenant.');
        if (!input.dueAt || Number.isNaN(Date.parse(input.dueAt))) throw new AppError(422, 'VALIDATION_FAILED', 'Due date is required', 'Provide a valid SLA due date.');
        const summary = String(input.summary || '').trim(); if (summary.length < 10) throw new AppError(422, 'VALIDATION_FAILED', 'Remediation summary is required', 'Provide a remediation summary with at least 10 characters.');
        tx.prepare("UPDATE findings SET status='ASSIGNED',assignee_user_id=?,assignee_team='Cloud Operations',due_at=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=?").run(input.assigneeUserId, input.dueAt, now(), row.id, session.tenant_id);
        tx.prepare(`INSERT INTO remediation_tasks (id,tenant_id,finding_id,owner_user_id,owner_team,state,summary,checklist_json,due_at,version,created_at,updated_at) VALUES (?,?,?,?,?,'TODO',?,?,?,?,?,?) ON CONFLICT(tenant_id,finding_id) DO UPDATE SET owner_user_id=excluded.owner_user_id,owner_team=excluded.owner_team,state='TODO',summary=excluded.summary,checklist_json=excluded.checklist_json,due_at=excluded.due_at,version=remediation_tasks.version+1,updated_at=excluded.updated_at`)
          .run(uid('tsk'), session.tenant_id, row.id, input.assigneeUserId, 'Cloud Operations', summary, JSON.stringify([{id:'context',label:'Review finding context',done:false},{id:'change',label:'Apply approved change',done:false},{id:'evidence',label:'Provide verification evidence',done:false}]), input.dueAt, 1, now(), now());
        result = { ok: true, status: 'ASSIGNED' };
      } else if (action === 'transition') {
        const target = String(input.targetStatus || '');
        if (row.status === 'ASSIGNED' && target === 'IN_PROGRESS') {
          if (session.role !== 'CLOUD_OPERATIONS' || row.assignee_user_id !== session.user_id) throw new AppError(403, 'OBJECT_PERMISSION_DENIED', 'Only the assigned operator can start work', 'This finding is assigned to another operator.');
          const task = tx.prepare('SELECT * FROM remediation_tasks WHERE tenant_id=? AND finding_id=?').get(session.tenant_id, row.id);
          if (!task || task.owner_user_id !== session.user_id) throw new AppError(422, 'TASK_REQUIRED', 'Remediation task is missing', 'Assignment must create an owned remediation task.');
          tx.prepare("UPDATE findings SET status='IN_PROGRESS',version=version+1,updated_at=? WHERE id=? AND tenant_id=?").run(now(), row.id, session.tenant_id);
          tx.prepare("UPDATE remediation_tasks SET state='IN_PROGRESS',version=version+1,updated_at=? WHERE tenant_id=? AND finding_id=?").run(now(), session.tenant_id, row.id);
          result = { ok: true, status: 'IN_PROGRESS' };
        } else if (row.status === 'IN_PROGRESS' && target === 'READY_FOR_REVIEW') {
          if (session.role !== 'CLOUD_OPERATIONS' || row.assignee_user_id !== session.user_id) throw new AppError(403, 'OBJECT_PERMISSION_DENIED', 'Only the assigned operator can request review', 'This finding is assigned to another operator.');
          const evidenceCount = tx.prepare("SELECT COUNT(*) count FROM evidence WHERE tenant_id=? AND finding_id=? AND status='CLEAN'").get(session.tenant_id, row.id).count;
          const task = tx.prepare('SELECT * FROM remediation_tasks WHERE tenant_id=? AND finding_id=?').get(session.tenant_id, row.id);
          const checklist = safeJson(task?.checklist_json, []);
          if (!evidenceCount) throw new AppError(422, 'EVIDENCE_REQUIRED', 'Evidence is required', 'Add clean structured evidence before requesting review.');
          if (!task || !checklist.length || checklist.some(item => !item.done)) throw new AppError(422, 'CHECKLIST_INCOMPLETE', 'Remediation checklist is incomplete', 'Complete every checklist item before requesting review.');
          tx.prepare("UPDATE findings SET status='READY_FOR_REVIEW',version=version+1,updated_at=? WHERE id=? AND tenant_id=?").run(now(), row.id, session.tenant_id);
          tx.prepare("UPDATE remediation_tasks SET state='REVIEW_REQUESTED',version=version+1,updated_at=? WHERE tenant_id=? AND finding_id=?").run(now(), session.tenant_id, row.id);
          result = { ok: true, status: 'READY_FOR_REVIEW' };
        } else if (row.status === 'READY_FOR_REVIEW' && target === 'IN_PROGRESS') {
          if (!['SECURITY_ANALYST','SECURITY_MANAGER'].includes(session.role)) throw new AppError(403, 'PERMISSION_DENIED', 'Only an analyst can return work', 'Cloud Operations cannot review its own remediation.');
          const reason = String(input.reason || '').trim(); if (reason.length < 10) throw new AppError(422, 'REASON_REQUIRED', 'A review reason is required', 'Explain what must change.');
          tx.prepare("UPDATE findings SET status='IN_PROGRESS',version=version+1,updated_at=? WHERE id=? AND tenant_id=?").run(now(), row.id, session.tenant_id);
          tx.prepare("UPDATE remediation_tasks SET state='IN_PROGRESS',version=version+1,updated_at=? WHERE tenant_id=? AND finding_id=?").run(now(), session.tenant_id, row.id);
          result = { ok: true, status: 'IN_PROGRESS' };
        } else if (row.status === 'VERIFIED' && target === 'RESOLVED') {
          if (!['SECURITY_ANALYST','SECURITY_MANAGER'].includes(session.role)) throw new AppError(403, 'PERMISSION_DENIED', 'Only an analyst or manager can resolve a verified finding', 'Cloud Operations cannot perform final resolution.');
          const verification = tx.prepare("SELECT * FROM verifications WHERE tenant_id=? AND finding_id=? AND result='PASSED' ORDER BY verified_at DESC LIMIT 1").get(session.tenant_id, row.id);
          if (!verification) throw new AppError(422, 'VERIFICATION_REQUIRED', 'Passed verification is required', 'Verify the remediation independently before resolution.');
          tx.prepare("UPDATE findings SET status='RESOLVED',resolved_at=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=?").run(now(), now(), row.id, session.tenant_id);
          tx.prepare("UPDATE remediation_tasks SET state='DONE',version=version+1,updated_at=? WHERE tenant_id=? AND finding_id=?").run(now(), session.tenant_id, row.id);
          result = { ok: true, status: 'RESOLVED' };
        } else throw new AppError(422, 'INVALID_TRANSITION', 'Transition is not permitted', `${row.status} → ${target} is not an allowed command for this role.`);
      } else if (action === 'comment') {
        const body = String(input.body || '').trim();
        if (body.length < 2 || body.length > 2000) throw new AppError(422, 'VALIDATION_FAILED', 'Comment is invalid', 'Comment must contain between 2 and 2000 characters.');
        tx.prepare('INSERT INTO comments VALUES (?,?,?,?,?,?)').run(uid('cmt'), session.tenant_id, row.id, session.user_id, body, now());
        tx.prepare('UPDATE findings SET version=version+1,updated_at=? WHERE id=? AND tenant_id=?').run(now(), row.id, session.tenant_id);
        result = { ok: true };
      } else if (action === 'evidence') {
        if (session.role !== 'CLOUD_OPERATIONS' || row.assignee_user_id !== session.user_id) throw new AppError(403, 'OBJECT_PERMISSION_DENIED', 'Only the assigned operator can submit evidence', 'This finding is assigned to another operator.');
        if (row.status !== 'IN_PROGRESS') throw new AppError(422, 'INVALID_TRANSITION', 'Evidence cannot be submitted now', 'The remediation must be in progress.');
        const note = String(input.note || '').trim(); if (note.length < 20 || note.length > 5000) throw new AppError(422, 'VALIDATION_FAILED', 'Evidence note is invalid', 'Provide a structured evidence note between 20 and 5000 characters.');
        const task = tx.prepare('SELECT * FROM remediation_tasks WHERE tenant_id=? AND finding_id=?').get(session.tenant_id, row.id);
        if (!task || task.owner_user_id !== session.user_id) throw new AppError(422, 'TASK_REQUIRED', 'Owned remediation task is required', 'The finding must have a task assigned to the current operator.');
        const evidenceId = uid('evd');
        tx.prepare(`INSERT INTO evidence (id,tenant_id,finding_id,task_id,uploaded_by_user_id,type,status,original_name,mime_type,size,sha256,structured_note,created_at) VALUES (?,?,?,?,?,'STRUCTURED_NOTE','CLEAN',NULL,NULL,NULL,?,?,?)`).run(evidenceId, session.tenant_id, row.id, task.id, session.user_id, sha256(note), note, now());
        const completed = safeJson(task.checklist_json, []).map(item => ({ ...item, done: true }));
        tx.prepare('UPDATE remediation_tasks SET checklist_json=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=?').run(JSON.stringify(completed), now(), task.id, session.tenant_id);
        tx.prepare('UPDATE findings SET version=version+1,updated_at=? WHERE id=? AND tenant_id=?').run(now(), row.id, session.tenant_id);
        result = { ok: true, evidenceId };
      } else if (action === 'verify') {
        if (row.status !== 'READY_FOR_REVIEW') throw new AppError(422, 'INVALID_TRANSITION', 'Finding must be ready for review', 'Request review before verification.');
        if (!['SECURITY_ANALYST','SECURITY_MANAGER'].includes(session.role)) throw new AppError(403, 'PERMISSION_DENIED', 'Only an analyst or manager can verify', 'The current role cannot verify remediation.');
        const author = tx.prepare('SELECT uploaded_by_user_id FROM evidence WHERE tenant_id=? AND finding_id=? ORDER BY created_at DESC LIMIT 1').get(session.tenant_id, row.id);
        if (row.severity === 'CRITICAL' && author?.uploaded_by_user_id === session.user_id) throw new AppError(403, 'SEPARATION_OF_DUTIES', 'Independent verification is required', 'The remediation author cannot verify a critical finding.');
        const resultValue = input.result === 'CHANGES_REQUIRED' ? 'CHANGES_REQUIRED' : 'PASSED';
        const notes = String(input.notes || '').trim(); if (notes.length < 10) throw new AppError(422, 'VALIDATION_FAILED', 'Verification notes are required', 'Provide verification notes with at least 10 characters.');
        tx.prepare('INSERT INTO verifications VALUES (?,?,?,?,?,?,?,?)').run(uid('ver'), session.tenant_id, row.id, session.user_id, input.method || 'CONTROL_RECHECK', resultValue, notes, now());
        tx.prepare('UPDATE findings SET status=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=?').run(resultValue === 'PASSED' ? 'VERIFIED' : 'IN_PROGRESS', now(), row.id, session.tenant_id);
        tx.prepare('UPDATE remediation_tasks SET state=?,version=version+1,updated_at=? WHERE tenant_id=? AND finding_id=?').run(resultValue === 'PASSED' ? 'DONE' : 'IN_PROGRESS', now(), session.tenant_id, row.id);
        result = { ok: true, status: resultValue === 'PASSED' ? 'VERIFIED' : 'IN_PROGRESS' };
      } else if (action === 'accept-risk') {
        if (session.role !== 'SECURITY_MANAGER') throw new AppError(403, 'PERMISSION_DENIED', 'Manager approval is required', 'Only a Security Manager can accept risk.');
        const reason = String(input.reason || '').trim(); const businessOwner = String(input.businessOwner || '').trim(); const control = String(input.compensatingControl || '').trim();
        if (reason.length < 20 || businessOwner.length < 3 || control.length < 10 || !input.expiresAt || Date.parse(input.expiresAt) <= Date.now()) throw new AppError(422, 'VALIDATION_FAILED', 'Risk acceptance is incomplete', 'Reason, business owner, compensating control and a future expiration are required.');
        tx.prepare(`INSERT INTO risk_acceptances (id,tenant_id,finding_id,approved_by_user_id,reason,business_owner,compensating_control,expires_at,created_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(tenant_id,finding_id) DO UPDATE SET approved_by_user_id=excluded.approved_by_user_id,reason=excluded.reason,business_owner=excluded.business_owner,compensating_control=excluded.compensating_control,expires_at=excluded.expires_at,created_at=excluded.created_at`)
          .run(uid('rac'), session.tenant_id, row.id, session.user_id, reason, businessOwner, control, input.expiresAt, now());
        tx.prepare("UPDATE findings SET status='ACCEPTED_RISK',accepted_until=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=?").run(input.expiresAt, now(), row.id, session.tenant_id);
        result = { ok: true, status: 'ACCEPTED_RISK' };
      }
      const after = tx.prepare('SELECT * FROM findings WHERE id=?').get(row.id);
      audit(tx, session, `FINDING_${action.toUpperCase().replace('-', '_')}`, 'FINDING', row.id, row, after, { ...context, reason: input.reason, diff: { status: [row.status, after.status] } });
      return { status: 200, data: result, headers: versionHeaders(after) };
    });
  }

  if (req.method === 'GET' && url.pathname === '/api/remediation/tasks') {
    requirePermission(session, 'finding:read');
    const where = session.role === 'CLOUD_OPERATIONS' ? 't.tenant_id=? AND t.owner_user_id=?' : 't.tenant_id=?';
    const params = session.role === 'CLOUD_OPERATIONS' ? [session.tenant_id, session.user_id] : [session.tenant_id];
    const rows = db.prepare(`SELECT t.*,f.title,f.severity,f.status finding_status,w.name workload_name FROM remediation_tasks t JOIN findings f ON f.id=t.finding_id JOIN workloads w ON w.id=f.workload_id WHERE ${where} ORDER BY CASE t.state WHEN 'REVIEW_REQUESTED' THEN 1 WHEN 'IN_PROGRESS' THEN 2 WHEN 'TODO' THEN 3 ELSE 4 END,t.due_at LIMIT 200`).all(...params).map(row => ({ ...row, checklist: safeJson(row.checklist_json, []) }));
    return send(res, 200, { items: rows }, { 'x-correlation-id': context.correlationId });
  }

  if (req.method === 'GET' && url.pathname === '/api/integrations') {
    requirePermission(session, 'integration:read');
    const rows = db.prepare('SELECT * FROM cloud_connections WHERE tenant_id=? ORDER BY provider,alias').all(session.tenant_id);
    return send(res, 200, { items: rows }, { 'x-correlation-id': context.correlationId });
  }
  match = url.pathname.match(/^\/api\/integrations\/([^/]+)\/sync$/);
  if (req.method === 'POST' && match) {
    requirePermission(session, 'integration:sync');
    return runIdempotent(req, res, session, context, `integration:${match[1]}:sync`, async (_input, tx) => {
      const row = tx.prepare('SELECT * FROM cloud_connections WHERE id=?').get(match[1]); ensureObjectTenant(row, session, 'integration'); ensureVersion(req, row);
      const status = row.mode === 'AUTH_ERROR' ? 'AUTH_ERROR' : row.mode === 'RATE_LIMITED' ? 'RATE_LIMITED' : row.mode === 'OFFLINE' ? 'OFFLINE' : 'HEALTHY';
      tx.prepare('UPDATE cloud_connections SET status=?,freshness_status=?,last_sync_at=?,last_successful_sync_at=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=?').run(status, status === 'HEALTHY' ? 'FRESH' : 'STALE', now(), status === 'HEALTHY' ? now() : row.last_successful_sync_at, now(), row.id, session.tenant_id);
      const after = tx.prepare('SELECT * FROM cloud_connections WHERE id=?').get(row.id);
      audit(tx, session, 'INTEGRATION_SYNC_REQUESTED', 'INTEGRATION', row.id, row, after, context);
      return { status: 200, data: { ok: true, status: after.status, lastSyncAt: after.last_sync_at, version: after.version }, headers: versionHeaders(after) };
    });
  }

  if (req.method === 'GET' && url.pathname === '/api/enablement-plans') {
    requirePermission(session, 'enablement:plan');
    const rows = db.prepare('SELECT p.*,c.provider,c.alias connection_alias FROM enablement_plans p JOIN cloud_connections c ON c.id=p.connection_id WHERE p.tenant_id=? ORDER BY p.updated_at DESC').all(session.tenant_id).map(row => ({ ...row, scope: safeJson(row.scope_json), targets: safeJson(row.targets_json, []), exclusions: safeJson(row.exclusions_json, []), preview: safeJson(row.preview_json), result: safeJson(row.result_json) }));
    return send(res, 200, { items: rows }, { 'x-correlation-id': context.correlationId });
  }
  if (req.method === 'POST' && url.pathname === '/api/enablement-plans') {
    requirePermission(session, 'enablement:plan');
    return runIdempotent(req, res, session, context, 'enablement:create', async (input, tx) => {
      const connection = tx.prepare('SELECT * FROM cloud_connections WHERE id=?').get(input.connectionId); ensureObjectTenant(connection, session, 'integration');
      const targets = Array.isArray(input.targets) ? input.targets.filter(Boolean) : [];
      const exclusions = Array.isArray(input.exclusions) ? input.exclusions.filter(Boolean) : [];
      if (!targets.length) throw new AppError(422, 'TARGET_REQUIRED', 'At least one target is required', 'Select an eligible fictional workload.');
      const ownedTargets = tx.prepare(`SELECT COUNT(*) count FROM workloads WHERE tenant_id=? AND connection_id=? AND id IN (${targets.map(() => '?').join(',')})`).get(session.tenant_id, connection.id, ...targets).count;
      if (ownedTargets !== targets.length) throw new AppError(422, 'INVALID_TARGET', 'One or more targets are invalid', 'Every target must belong to the selected tenant and connection.');
      const planId = uid('pln');
      const preview = { eligible: targets.length, selected: targets.length, excluded: exclusions.length, warnings: connection.freshness_status === 'STALE' ? ['Provider inventory is stale. Revalidate before execution.'] : [], estimatedMinutes: Math.max(2, Math.ceil(targets.length / 8)) };
      tx.prepare(`INSERT INTO enablement_plans (id,tenant_id,connection_id,created_by_user_id,state,scope_json,targets_json,exclusions_json,auto_enable_new,auto_enable_existing,preview_json,validated_at,progress,result_json,version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(planId, session.tenant_id, connection.id, session.user_id, 'READY', JSON.stringify(input.scope || {}), JSON.stringify(targets), JSON.stringify(exclusions), input.autoEnableNew ? 1 : 0, input.autoEnableExisting ? 1 : 0, JSON.stringify(preview), now(), 0, '{}', 1, now(), now());
      const after = tx.prepare('SELECT * FROM enablement_plans WHERE id=?').get(planId);
      audit(tx, session, 'ENABLEMENT_PLAN_CREATED', 'ENABLEMENT_PLAN', planId, null, after, context);
      return { status: 201, data: { ok: true, planId, preview, version: 1 }, headers: versionHeaders(after) };
    });
  }
  match = url.pathname.match(/^\/api\/enablement-plans\/([^/]+)\/execute$/);
  if (req.method === 'POST' && match) {
    requirePermission(session, 'enablement:execute');
    return runIdempotent(req, res, session, context, `enablement:${match[1]}:execute`, async (_input, tx) => {
      const plan = tx.prepare('SELECT p.*,c.mode,c.provider FROM enablement_plans p JOIN cloud_connections c ON c.id=p.connection_id WHERE p.id=?').get(match[1]); ensureObjectTenant(plan, session, 'enablement plan'); ensureVersion(req, plan);
      if (!['READY','PARTIALLY_SUCCEEDED'].includes(plan.state)) throw new AppError(422, 'INVALID_PLAN_STATE', 'Plan cannot be executed', `Current state is ${plan.state}.`);
      const operationId = uid('op');
      const targets = safeJson(plan.targets_json, []);
      const failed = plan.mode === 'RATE_LIMITED' ? targets.slice(-Math.max(1, Math.floor(targets.length / 3))) : plan.mode === 'AUTH_ERROR' ? targets : [];
      const succeeded = targets.filter(target => !failed.includes(target));
      const state = failed.length ? (succeeded.length ? 'PARTIALLY_SUCCEEDED' : 'FAILED') : 'SUCCEEDED';
      const result = { succeeded: succeeded.length, failed: failed.length, failedTargets: failed, provider: plan.provider, completedAt: now() };
      tx.prepare(`INSERT INTO integration_operations (id,tenant_id,connection_id,plan_id,operation_type,state,progress,result_json,error_code,correlation_id,created_by_user_id,version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(operationId, session.tenant_id, plan.connection_id, plan.id, 'PROTECTION_ENABLEMENT', state, 100, JSON.stringify(result), state === 'FAILED' ? 'PROVIDER_OPERATION_FAILED' : null, context.correlationId, session.user_id, 1, now(), now());
      tx.prepare('UPDATE enablement_plans SET state=?,progress=100,result_json=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=?').run(state, JSON.stringify(result), now(), plan.id, session.tenant_id);
      const after = tx.prepare('SELECT * FROM enablement_plans WHERE id=?').get(plan.id);
      audit(tx, session, 'ENABLEMENT_EXECUTED', 'ENABLEMENT_PLAN', plan.id, plan, after, { ...context, diff: { state: [plan.state, state] } });
      return { status: 202, data: { ok: true, operationId, state, ...result, version: after.version }, headers: versionHeaders(after) };
    });
  }
  match = url.pathname.match(/^\/api\/enablement-operations\/([^/]+)$/);
  if (req.method === 'GET' && match) {
    requirePermission(session, 'enablement:plan');
    const row = db.prepare('SELECT * FROM integration_operations WHERE id=?').get(match[1]); ensureObjectTenant(row, session, 'operation');
    return send(res, 200, { ...row, result: safeJson(row.result_json) }, versionHeaders(row));
  }

  if (req.method === 'GET' && url.pathname === '/api/permissions/effective') return send(res, 200, { role: session.role, permissions: session.permissions, tenant: { id: session.tenant_id, name: session.tenant_name }, explanations: Object.fromEntries(Object.entries(rolePermissions)) }, { 'x-correlation-id': context.correlationId });

  if (req.method === 'GET' && url.pathname === '/api/analytics/impact') {
    requirePermission(session, 'analytics:read');
    const rows = db.prepare("SELECT * FROM impact_assumptions WHERE tenant_id=? ORDER BY CASE scenario WHEN 'CONSERVATIVE' THEN 1 WHEN 'BASE' THEN 2 ELSE 3 END").all(session.tenant_id).map(row => ({ ...row, values: safeJson(row.values_json), calculation: calculateImpact(safeJson(row.values_json)) }));
    return send(res, 200, { scenarios: rows, disclaimer: 'Illustrative scenario based on editable assumptions. It is not an ESET forecast, price, margin, churn estimate, or guaranteed saving.' }, { 'x-correlation-id': context.correlationId });
  }
  if (req.method === 'POST' && url.pathname === '/api/analytics/calculate') {
    requirePermission(session, 'analytics:read');
    const input = await bodyJson(req); validateAssumptionValues(input);
    return send(res, 200, { calculation: calculateImpact(input), disclaimer: 'Illustrative scenario based on editable assumptions.' }, { 'x-correlation-id': context.correlationId });
  }
  match = url.pathname.match(/^\/api\/analytics\/impact\/scenarios\/([^/]+)$/);
  if (req.method === 'PUT' && match) {
    requirePermission(session, 'analytics:assumptions:write');
    return runIdempotent(req, res, session, context, `analytics:${match[1]}:update`, async (input, tx) => {
      const row = tx.prepare('SELECT * FROM impact_assumptions WHERE id=?').get(match[1]); ensureObjectTenant(row, session, 'assumption set'); ensureVersion(req, row); validateAssumptionValues(input.values || input);
      const values = input.values || input;
      tx.prepare('UPDATE impact_assumptions SET values_json=?,version=version+1,updated_at=? WHERE id=? AND tenant_id=?').run(JSON.stringify(values), now(), row.id, session.tenant_id);
      const after = tx.prepare('SELECT * FROM impact_assumptions WHERE id=?').get(row.id);
      audit(tx, session, 'IMPACT_ASSUMPTIONS_UPDATED', 'IMPACT_ASSUMPTION_SET', row.id, row, after, { ...context, diff: { scenario: row.scenario } });
      return { status: 200, data: { ok: true, scenario: after.scenario, values, calculation: calculateImpact(values), version: after.version }, headers: versionHeaders(after) };
    });
  }

  if (req.method === 'GET' && url.pathname === '/api/audit') {
    requirePermission(session, 'audit:read');
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || 50)));
    const action = url.searchParams.get('action'); const entity = url.searchParams.get('entityType');
    const where = ['a.tenant_id=?']; const params = [session.tenant_id];
    if (action) { where.push('a.action=?'); params.push(action); }
    if (entity) { where.push('a.entity_type=?'); params.push(entity); }
    const rows = db.prepare(`SELECT a.*,u.display_name actor_name FROM audit_events a LEFT JOIN users u ON u.id=a.actor_user_id WHERE ${where.join(' AND ')} ORDER BY a.created_at DESC LIMIT ?`).all(...params, limit).map(row => ({ ...row, safe_diff: safeJson(row.safe_diff_json) }));
    return send(res, 200, { items: rows }, { 'x-correlation-id': context.correlationId });
  }
  match = url.pathname.match(/^\/api\/audit\/([^/]+)$/);
  if (req.method === 'GET' && match) {
    requirePermission(session, 'audit:read');
    const row = db.prepare('SELECT * FROM audit_events WHERE id=?').get(match[1]); ensureObjectTenant(row, session, 'audit event');
    return send(res, 200, { ...row, safe_diff: safeJson(row.safe_diff_json) }, { 'x-correlation-id': context.correlationId });
  }

  if (req.method === 'GET' && url.pathname === '/api/notifications') {
    const rows = db.prepare('SELECT * FROM notifications WHERE tenant_id=? AND user_id=? ORDER BY created_at DESC LIMIT 30').all(session.tenant_id, session.user_id);
    return send(res, 200, { items: rows, unread: rows.filter(row => !row.read_at).length }, { 'x-correlation-id': context.correlationId });
  }
  match = url.pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
  if (req.method === 'POST' && match) {
    return runIdempotent(req, res, session, context, `notification:${match[1]}:read`, async (_input, tx) => {
      const row = tx.prepare('SELECT * FROM notifications WHERE id=?').get(match[1]); ensureObjectTenant(row, session, 'notification');
      if (row.user_id !== session.user_id) throw new AppError(404, 'NOT_FOUND', 'Notification not found', 'The requested notification was not found.');
      tx.prepare('UPDATE notifications SET read_at=? WHERE id=? AND tenant_id=? AND user_id=?').run(now(), row.id, session.tenant_id, session.user_id);
      return { status: 200, data: { ok: true } };
    });
  }

  if (req.method === 'GET' && url.pathname === '/api/saved-views') {
    requirePermission(session, 'saved-view:manage');
    const rows = db.prepare('SELECT * FROM saved_views WHERE tenant_id=? AND user_id=? ORDER BY is_default DESC,name').all(session.tenant_id, session.user_id).map(row => ({ ...row, query: safeJson(row.query_json) }));
    return send(res, 200, { items: rows }, { 'x-correlation-id': context.correlationId });
  }
  if (req.method === 'POST' && url.pathname === '/api/saved-views') {
    requirePermission(session, 'saved-view:manage');
    return runIdempotent(req, res, session, context, 'saved-view:create', async (input, tx) => {
      const name = String(input.name || '').trim(); if (name.length < 2 || name.length > 80) throw new AppError(422, 'VALIDATION_FAILED', 'Saved view name is invalid', 'Use between 2 and 80 characters.');
      const id = uid('view');
      tx.prepare('INSERT INTO saved_views VALUES (?,?,?,?,?,?,?,?,?,?)').run(id, session.tenant_id, session.user_id, input.entityType || 'FINDING', name, JSON.stringify(input.query || {}), input.isDefault ? 1 : 0, now(), now());
      audit(tx, session, 'SAVED_VIEW_CREATED', 'SAVED_VIEW', id, null, { name }, context);
      return { status: 201, data: { ok: true, id } };
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/reset') {
    if (!DEMO_MODE) throw new AppError(404, 'NOT_FOUND', 'Unavailable', 'Demo reset is disabled.');
    requirePermission(session, 'tenant:manage');
    throw new AppError(409, 'RESTART_REQUIRED', 'Reset requires local restart', 'Run npm run reset and restart the server to restore deterministic data.');
  }
  throw new AppError(404, 'NOT_FOUND', 'API route not found', `${req.method} ${url.pathname} is not implemented.`);
}

const mime = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.map':'application/json; charset=utf-8' };
function serveStatic(_req, res, url) {
  let pathname = url.pathname;
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/app' || pathname === '/app/') pathname = '/app.html';
  const file = path.resolve(PUBLIC, `.${pathname}`);
  if (!file.startsWith(PUBLIC)) { securityHeaders(res, true); res.writeHead(403); return res.end('Forbidden'); }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    if (!path.extname(pathname) && pathname.startsWith('/app')) return serveStatic(null, res, new URL('/app.html', 'http://local'));
    securityHeaders(res, true); res.writeHead(404); return res.end('Not found');
  }
  const stat = fs.statSync(file);
  securityHeaders(res, true);
  const immutable = /\.[a-f0-9]{8,}\./.test(path.basename(file));
  res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'content-length': stat.size, 'cache-control': immutable ? 'public,max-age=31536000,immutable' : path.basename(file) === 'app.js' ? 'public,max-age=3600' : 'no-cache' });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  counters.requests += 1;
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const context = requestContext(req);
  res.setHeader('x-correlation-id', context.correlationId);
  try {
    if (url.pathname.startsWith('/api/')) await api(req, res, url, context);
    else serveStatic(req, res, url);
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError(500, 'INTERNAL_ERROR', 'Unexpected server error', 'The request could not be completed.');
    console.error(JSON.stringify({ level: appError.status >= 500 ? 'error' : 'warn', message: error.message, stack: appError.status >= 500 ? error.stack : undefined, code: appError.code, correlationId: context.correlationId }));
    if (!res.headersSent) problem(res, appError, context.correlationId); else res.end();
  }
});
if (require.main === module) server.listen(PORT, HOST, () => console.log(JSON.stringify({ level:'info', message:'CSER Workspace started', url:`http://${HOST}:${PORT}`, environment:NODE_ENV, demoMode:DEMO_MODE })));
module.exports = { server, calculateImpact, rolePermissions, AppError };
