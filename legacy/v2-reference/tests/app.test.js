'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cser-v2-test-'));
const dbPath = path.join(tmp, 'test.db');
const port = 4287;
const env = {
  ...process.env,
  NODE_ENV: 'test',
  CSER_DB_PATH: dbPath,
  PORT: String(port),
  HOST: '127.0.0.1',
  CSER_SESSION_SECRET: 'test-only-session-secret-not-for-production',
  CSER_DEMO_MODE: 'true',
  CSER_RATE_LIMIT_MAX: '1000'
};
let child;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function api(pathname, options = {}) {
  const res = await fetch(`http://127.0.0.1:${port}${pathname}`, options);
  const data = await res.json().catch(() => ({}));
  return { res, data };
}
async function login(userId, tenantId) {
  const { res, data } = await api('/api/demo/switch-identity', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId, tenantId })
  });
  assert.equal(res.status, 200, JSON.stringify(data));
  const cookie = res.headers.get('set-cookie').split(';')[0];
  const me = await api('/api/me', { headers: { cookie } });
  assert.equal(me.res.status, 200);
  return { cookie, me: me.data };
}
function mutationHeaders(auth, version, key, extras = {}) {
  const headers = {
    'content-type': 'application/json',
    cookie: auth.cookie,
    'x-csrf-token': auth.me.csrfToken,
    'idempotency-key': key,
    ...extras
  };
  if (version !== undefined && version !== null) headers['if-match'] = `W/\"${version}\"`;
  return headers;
}
function dbQuery(sql, ...params) {
  const db = new DatabaseSync(dbPath);
  try { return db.prepare(sql).get(...params); }
  finally { db.close(); }
}
async function setup() {
  const seed = spawnSync(process.execPath, ['scripts/seed.js', '--reset'], { cwd: root, env, encoding: 'utf8' });
  assert.equal(seed.status, 0, seed.stderr || seed.stdout);
  child = spawn(process.execPath, ['server/index.js'], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk; });
  for (let i = 0; i < 100; i += 1) {
    if (child.exitCode !== null) throw new Error(`Server exited during setup: ${stderr}`);
    try { const response = await fetch(`http://127.0.0.1:${port}/api/health/live`); if (response.ok) return; } catch {}
    await wait(50);
  }
  throw new Error(`Server did not start: ${stderr}`);
}
async function teardown() {
  if (child && child.exitCode === null) child.kill('SIGTERM');
  await wait(120);
  fs.rmSync(tmp, { recursive: true, force: true });
}

test('CSER Workspace Candidate MVP V2 release verification', async t => {
  await t.test('unsafe production startup is rejected', () => {
    const result = spawnSync(process.execPath, ['server/index.js'], {
      cwd: root,
      env: { ...process.env, NODE_ENV: 'production', CSER_SESSION_SECRET: 'short', CSER_DEMO_MODE: 'false', CSER_DB_PATH: path.join(tmp, 'unsafe.db') },
      encoding: 'utf8'
    });
    assert.notEqual(result.status, 0);
    assert.match(`${result.stderr}${result.stdout}`, /at least 32 characters/i);
  });

  await setup();
  try {
    await t.test('health, readiness, OpenAPI and deterministic baseline are available', async () => {
      const live = await api('/api/health/live');
      const ready = await api('/api/health/ready');
      const openapi = await api('/api/openapi.json');
      assert.equal(live.res.status, 200);
      assert.equal(ready.res.status, 200);
      assert.equal(openapi.res.status, 200);
      assert.equal(openapi.data.openapi, '3.1.0');
      const auth = await login('usr-sofia', 'ten-northstar');
      const overview = await api('/api/overview', { headers: { cookie: auth.cookie } });
      assert.equal(overview.res.status, 200);
      assert.equal(Number(dbQuery('SELECT COUNT(*) count FROM tenants').count), 2);
      assert.equal(Number(dbQuery('SELECT COUNT(*) count FROM workloads').count), 10000);
      assert.equal(Number(dbQuery('SELECT COUNT(*) count FROM findings').count), 2500);
    });

    await t.test('tenant isolation protects lists and guessed object IDs', async () => {
      const bluepeak = await login('usr-nina', 'ten-bluepeak');
      const detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: bluepeak.cookie } });
      assert.equal(detail.res.status, 404);
      assert.equal(detail.data.code, 'NOT_FOUND');
      const list = await api('/api/findings?limit=100', { headers: { cookie: bluepeak.cookie } });
      assert.equal(list.res.status, 200);
      assert.ok(list.data.items.length > 0);
      assert.ok(list.data.items.every(item => item.tenant_id === 'ten-bluepeak'));
    });

    await t.test('Cloud Operations receives only assigned objects and cannot assign', async () => {
      const operator = await login('usr-lukas', 'ten-northstar');
      const detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: operator.cookie } });
      assert.equal(detail.res.status, 404);
      const assign = await api('/api/findings/FND-CRIT-0042/assign', {
        method: 'POST',
        headers: mutationHeaders(operator, 1, 'operator-cannot-assign'),
        body: JSON.stringify({ assigneeUserId: 'usr-lukas', dueAt: '2026-08-02T15:00:00.000Z', summary: 'Unauthorized assignment attempt.' })
      });
      assert.equal(assign.res.status, 403);
      assert.equal(assign.data.code, 'PERMISSION_DENIED');
    });

    await t.test('malformed JSON returns 400 instead of an internal error', async () => {
      const analyst = await login('usr-sofia', 'ten-northstar');
      const detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: analyst.cookie } });
      const response = await api('/api/findings/FND-CRIT-0042/comment', {
        method: 'POST',
        headers: mutationHeaders(analyst, detail.data.version, 'malformed-json'),
        body: '{broken'
      });
      assert.equal(response.res.status, 400);
      assert.equal(response.data.code, 'INVALID_JSON');
    });

    await t.test('version preconditions are mandatory and stale writes fail', async () => {
      const analyst = await login('usr-sofia', 'ten-northstar');
      const detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: analyst.cookie } });
      const body = JSON.stringify({ assigneeUserId: 'usr-lukas', dueAt: '2026-08-02T15:00:00.000Z', summary: 'Restrict the fictional management endpoint and provide evidence.' });
      const missing = await api('/api/findings/FND-CRIT-0042/assign', { method: 'POST', headers: mutationHeaders(analyst, null, 'missing-version'), body });
      assert.equal(missing.res.status, 428);
      assert.equal(missing.data.code, 'PRECONDITION_REQUIRED');
      const stale = await api('/api/findings/FND-CRIT-0042/assign', { method: 'POST', headers: mutationHeaders(analyst, detail.data.version + 9, 'stale-version'), body });
      assert.equal(stale.res.status, 412);
      assert.equal(stale.data.code, 'VERSION_CONFLICT');
    });

    await t.test('idempotency replays the same request and rejects a different payload', async () => {
      const admin = await login('usr-alex', 'ten-northstar');
      const integrations = await api('/api/integrations', { headers: { cookie: admin.cookie } });
      const connection = integrations.data.items.find(item => item.id === 'con-az-ns');
      const headers = mutationHeaders(admin, connection.version, 'same-sync-key');
      const first = await api('/api/integrations/con-az-ns/sync', { method: 'POST', headers, body: '{}' });
      const replay = await api('/api/integrations/con-az-ns/sync', { method: 'POST', headers, body: '{}' });
      const conflict = await api('/api/integrations/con-az-ns/sync', { method: 'POST', headers, body: JSON.stringify({ different: true }) });
      assert.equal(first.res.status, 200, JSON.stringify(first.data));
      assert.equal(replay.res.status, 200);
      assert.equal(replay.res.headers.get('x-idempotent-replay'), 'true');
      assert.equal(conflict.res.status, 409);
      assert.equal(conflict.data.code, 'IDEMPOTENCY_CONFLICT');
    });

    await t.test('manager risk acceptance requires structured fields and persists them', async () => {
      const open = dbQuery("SELECT id FROM findings WHERE tenant_id='ten-northstar' AND status='OPEN' AND id<>'FND-CRIT-0042' LIMIT 1");
      assert.ok(open?.id);
      const manager = await login('usr-petra', 'ten-northstar');
      let detail = await api(`/api/findings/${open.id}`, { headers: { cookie: manager.cookie } });
      const incomplete = await api(`/api/findings/${open.id}/accept-risk`, {
        method: 'POST', headers: mutationHeaders(manager, detail.data.version, 'risk-incomplete'), body: JSON.stringify({ reason: 'too short' })
      });
      assert.equal(incomplete.res.status, 422);
      detail = await api(`/api/findings/${open.id}`, { headers: { cookie: manager.cookie } });
      const accepted = await api(`/api/findings/${open.id}/accept-risk`, {
        method: 'POST',
        headers: mutationHeaders(manager, detail.data.version, 'risk-complete'),
        body: JSON.stringify({
          reason: 'Temporary acceptance while a replacement control is scheduled and reviewed.',
          businessOwner: 'Cloud Platform Owner',
          compensatingControl: 'Restricted source ranges with increased fictional monitoring.',
          expiresAt: '2026-12-31T23:59:59.000Z'
        })
      });
      assert.equal(accepted.res.status, 200, JSON.stringify(accepted.data));
      detail = await api(`/api/findings/${open.id}`, { headers: { cookie: manager.cookie } });
      assert.equal(detail.data.status, 'ACCEPTED_RISK');
      assert.equal(detail.data.riskAcceptance.business_owner, 'Cloud Platform Owner');
    });

    await t.test('critical finding golden path persists, guards and audits every step', async () => {
      let analyst = await login('usr-sofia', 'ten-northstar');
      let detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: analyst.cookie } });
      assert.equal(detail.data.status, 'OPEN');
      let result = await api('/api/findings/FND-CRIT-0042/assign', {
        method: 'POST',
        headers: mutationHeaders(analyst, detail.data.version, 'golden-assign'),
        body: JSON.stringify({ assigneeUserId: 'usr-lukas', dueAt: '2026-08-02T15:00:00.000Z', summary: 'Restrict management access and document the approved fictional change.' })
      });
      assert.equal(result.res.status, 200, JSON.stringify(result.data));

      const operator = await login('usr-lukas', 'ten-northstar');
      detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: operator.cookie } });
      result = await api('/api/findings/FND-CRIT-0042/transition', {
        method: 'POST', headers: mutationHeaders(operator, detail.data.version, 'golden-start'), body: JSON.stringify({ targetStatus: 'IN_PROGRESS' })
      });
      assert.equal(result.res.status, 200, JSON.stringify(result.data));

      detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: operator.cookie } });
      result = await api('/api/findings/FND-CRIT-0042/transition', {
        method: 'POST', headers: mutationHeaders(operator, detail.data.version, 'golden-review-too-early'), body: JSON.stringify({ targetStatus: 'READY_FOR_REVIEW' })
      });
      assert.equal(result.res.status, 422);
      assert.equal(result.data.code, 'EVIDENCE_REQUIRED');

      detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: operator.cookie } });
      result = await api('/api/findings/FND-CRIT-0042/evidence', {
        method: 'POST',
        headers: mutationHeaders(operator, detail.data.version, 'golden-evidence'),
        body: JSON.stringify({ taskId: detail.data.task.id, note: 'Firewall access was restricted to the fictional approved operations range and the rule was rechecked.' })
      });
      assert.equal(result.res.status, 200, JSON.stringify(result.data));

      detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: operator.cookie } });
      result = await api('/api/findings/FND-CRIT-0042/transition', {
        method: 'POST', headers: mutationHeaders(operator, detail.data.version, 'golden-review'), body: JSON.stringify({ targetStatus: 'READY_FOR_REVIEW' })
      });
      assert.equal(result.res.status, 200, JSON.stringify(result.data));

      // The remediation author is not permitted to verify a critical finding.
      detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: operator.cookie } });
      result = await api('/api/findings/FND-CRIT-0042/verify', {
        method: 'POST', headers: mutationHeaders(operator, detail.data.version, 'golden-self-verify'), body: JSON.stringify({ result: 'PASSED', notes: 'Attempted self verification.' })
      });
      assert.equal(result.res.status, 403);

      analyst = await login('usr-sofia', 'ten-northstar');
      detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: analyst.cookie } });
      result = await api('/api/findings/FND-CRIT-0042/verify', {
        method: 'POST',
        headers: mutationHeaders(analyst, detail.data.version, 'golden-verify'),
        body: JSON.stringify({ result: 'PASSED', method: 'CONTROL_RECHECK', notes: 'Independent fictional control recheck passed.' })
      });
      assert.equal(result.res.status, 200, JSON.stringify(result.data));

      detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: analyst.cookie } });
      result = await api('/api/findings/FND-CRIT-0042/transition', {
        method: 'POST', headers: mutationHeaders(analyst, detail.data.version, 'golden-resolve'), body: JSON.stringify({ targetStatus: 'RESOLVED' })
      });
      assert.equal(result.res.status, 200, JSON.stringify(result.data));
      detail = await api('/api/findings/FND-CRIT-0042', { headers: { cookie: analyst.cookie } });
      assert.equal(detail.data.status, 'RESOLVED');
      assert.equal(detail.data.verification.result, 'PASSED');
      assert.ok(detail.data.audit.length >= 5);
    });

    await t.test('enablement plan execution is versioned and persisted', async () => {
      const analyst = await login('usr-sofia', 'ten-northstar');
      const create = await api('/api/enablement-plans', {
        method: 'POST',
        headers: mutationHeaders(analyst, null, 'enablement-create-v2'),
        body: JSON.stringify({ connectionId: 'con-az-ns', targets: ['WLD-AZ-PROD-0007'], exclusions: [], scope: { environment: 'PRODUCTION' }, autoEnableNew: true, autoEnableExisting: true })
      });
      assert.equal(create.res.status, 201, JSON.stringify(create.data));
      const missingVersion = await api(`/api/enablement-plans/${create.data.planId}/execute`, {
        method: 'POST', headers: mutationHeaders(analyst, null, 'enablement-no-version'), body: '{}'
      });
      assert.equal(missingVersion.res.status, 428);
      const execute = await api(`/api/enablement-plans/${create.data.planId}/execute`, {
        method: 'POST', headers: mutationHeaders(analyst, create.data.version, 'enablement-execute-v2'), body: '{}'
      });
      assert.equal(execute.res.status, 202, JSON.stringify(execute.data));
      const operation = await api(`/api/enablement-operations/${execute.data.operationId}`, { headers: { cookie: analyst.cookie } });
      assert.equal(operation.res.status, 200);
      assert.equal(operation.data.state, execute.data.state);
    });

    await t.test('ROI baseline and audited assumption persistence are correct', async () => {
      const manager = await login('usr-petra', 'ten-northstar');
      let impact = await api('/api/analytics/impact', { headers: { cookie: manager.cookie } });
      const base = impact.data.scenarios.find(item => item.scenario === 'BASE');
      assert.equal(base.calculation.supportSaving, 16200);
      assert.equal(base.calculation.onboardingSaving, 17600);
      assert.equal(base.calculation.gross, 103800);
      assert.ok(Math.abs(base.calculation.paybackMonths - 21.2389) < 0.01);
      const conservative = impact.data.scenarios.find(item => item.scenario === 'CONSERVATIVE');
      const values = { ...conservative.values, loadedSupportHourValue: 41 };
      const saved = await api(`/api/analytics/impact/scenarios/${conservative.id}`, {
        method: 'PUT', headers: mutationHeaders(manager, conservative.version, 'analytics-save-v2'), body: JSON.stringify({ values })
      });
      assert.equal(saved.res.status, 200, JSON.stringify(saved.data));
      impact = await api('/api/analytics/impact', { headers: { cookie: manager.cookie } });
      assert.equal(impact.data.scenarios.find(item => item.id === conservative.id).values.loadedSupportHourValue, 41);
      assert.ok(Number(dbQuery("SELECT COUNT(*) count FROM audit_events WHERE action='IMPACT_ASSUMPTIONS_UPDATED'").count) >= 1);
    });

    await t.test('audit rows are protected from update and delete by database triggers', () => {
      const db = new DatabaseSync(dbPath);
      const audit = db.prepare('SELECT id FROM audit_events LIMIT 1').get();
      assert.throws(() => db.prepare('UPDATE audit_events SET action=? WHERE id=?').run('TAMPER', audit.id), /AUDIT_IMMUTABLE/);
      assert.throws(() => db.prepare('DELETE FROM audit_events WHERE id=?').run(audit.id), /AUDIT_IMMUTABLE/);
      db.close();
    });
  } finally {
    await teardown();
  }
}, { timeout: 120000 });
