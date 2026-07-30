'use strict';
const { openDatabase, migrate, resolveDbPath } = require('../server/db');
const db = openDatabase(); migrate(db);
const checks = [
  ['verified/resolved findings without passed verification', `SELECT COUNT(*) count FROM findings f WHERE f.status IN ('VERIFIED','RESOLVED') AND NOT EXISTS (SELECT 1 FROM verifications v WHERE v.tenant_id=f.tenant_id AND v.finding_id=f.id AND v.result='PASSED')`],
  ['assigned workflow findings without a remediation task', `SELECT COUNT(*) count FROM findings f WHERE f.status IN ('ASSIGNED','IN_PROGRESS','READY_FOR_REVIEW','VERIFIED','RESOLVED','DEFERRED') AND NOT EXISTS (SELECT 1 FROM remediation_tasks t WHERE t.tenant_id=f.tenant_id AND t.finding_id=f.id)`],
  ['review-ready findings without clean evidence', `SELECT COUNT(*) count FROM findings f WHERE f.status IN ('READY_FOR_REVIEW','VERIFIED','RESOLVED') AND NOT EXISTS (SELECT 1 FROM evidence e WHERE e.tenant_id=f.tenant_id AND e.finding_id=f.id AND e.status='CLEAN')`],
  ['accepted-risk findings without structured acceptance', `SELECT COUNT(*) count FROM findings f WHERE f.status='ACCEPTED_RISK' AND NOT EXISTS (SELECT 1 FROM risk_acceptances r WHERE r.tenant_id=f.tenant_id AND r.finding_id=f.id)`],
  ['cross-tenant workload/finding relationships', `SELECT COUNT(*) count FROM findings f JOIN workloads w ON w.id=f.workload_id WHERE f.tenant_id<>w.tenant_id`],
  ['cross-tenant task/finding relationships', `SELECT COUNT(*) count FROM remediation_tasks t JOIN findings f ON f.id=t.finding_id WHERE t.tenant_id<>f.tenant_id`],
  ['workload provider/connection mismatches', `SELECT COUNT(*) count FROM workloads w JOIN cloud_connections c ON c.id=w.connection_id WHERE w.tenant_id<>c.tenant_id OR w.provider<>c.provider`],
  ['assigned findings without owner or SLA', `SELECT COUNT(*) count FROM findings WHERE status IN ('ASSIGNED','IN_PROGRESS','READY_FOR_REVIEW','VERIFIED','RESOLVED') AND (assignee_user_id IS NULL OR due_at IS NULL)`]
];
let failures = 0;
for (const [name, sql] of checks) {
  const count = Number(db.prepare(sql).get().count);
  console.log(`${count === 0 ? 'PASS' : 'FAIL'}  ${name}: ${count}`);
  if (count !== 0) failures += 1;
}
const totals = {
  tenants: db.prepare('SELECT COUNT(*) count FROM tenants').get().count,
  workloads: db.prepare('SELECT COUNT(*) count FROM workloads').get().count,
  findings: db.prepare('SELECT COUNT(*) count FROM findings').get().count,
  tasks: db.prepare('SELECT COUNT(*) count FROM remediation_tasks').get().count,
  evidence: db.prepare('SELECT COUNT(*) count FROM evidence').get().count,
  verifications: db.prepare('SELECT COUNT(*) count FROM verifications').get().count,
  audits: db.prepare('SELECT COUNT(*) count FROM audit_events').get().count
};
console.log(`Database: ${resolveDbPath()}`);
console.log(`Totals: ${JSON.stringify(totals)}`);
if (totals.tenants !== 2 || totals.workloads !== 10000 || totals.findings !== 2500) {
  console.error('FAIL  deterministic seed totals do not match the documented baseline.');
  failures += 1;
}
// Verify that audit mutation triggers are active without persisting a change.
try {
  db.exec('BEGIN');
  const row = db.prepare('SELECT id FROM audit_events LIMIT 1').get();
  db.prepare('UPDATE audit_events SET action=? WHERE id=?').run('TAMPERED', row.id);
  db.exec('ROLLBACK');
  console.error('FAIL  audit update was not blocked.');
  failures += 1;
} catch (error) {
  try { db.exec('ROLLBACK'); } catch {}
  if (String(error.message).includes('AUDIT_IMMUTABLE')) console.log('PASS  audit update is blocked by database trigger.');
  else { console.error(`FAIL  unexpected audit immutability result: ${error.message}`); failures += 1; }
}
if (failures) process.exit(1);
console.log('Seed and database invariants passed.');
