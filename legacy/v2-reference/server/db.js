'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

function resolveDbPath() {
  const requested = process.env.CSER_DB_PATH || path.join(__dirname, '..', 'data', 'cser.db');
  return path.resolve(process.cwd(), requested);
}

function openDatabase() {
  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    PRAGMA synchronous = NORMAL;
  `);
  return db;
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);
  const applied = new Set(db.prepare('SELECT version FROM schema_migrations').all().map(row => row.version));
  const migrations = [
    [1, `
      CREATE TABLE tenants (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        settings_json TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE memberships (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        user_id TEXT NOT NULL REFERENCES users(id),
        role TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(tenant_id, user_id)
      );
      CREATE TABLE cloud_connections (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        provider TEXT NOT NULL,
        alias TEXT NOT NULL,
        external_scope_id TEXT NOT NULL,
        status TEXT NOT NULL,
        freshness_status TEXT NOT NULL,
        last_sync_at TEXT,
        last_successful_sync_at TEXT,
        circuit_state TEXT NOT NULL DEFAULT 'CLOSED',
        mode TEXT NOT NULL DEFAULT 'HEALTHY',
        object_count INTEGER NOT NULL DEFAULT 0,
        error_code TEXT,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE workloads (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        connection_id TEXT NOT NULL REFERENCES cloud_connections(id),
        provider TEXT NOT NULL,
        external_id TEXT NOT NULL,
        name TEXT NOT NULL,
        scope_alias TEXT NOT NULL,
        environment TEXT NOT NULL,
        region TEXT NOT NULL,
        os_family TEXT NOT NULL,
        os_version TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        protection_status TEXT NOT NULL,
        asset_criticality TEXT NOT NULL,
        internet_exposure INTEGER NOT NULL DEFAULT 0,
        owner_user_id TEXT,
        owner_team TEXT,
        tags_json TEXT NOT NULL DEFAULT '[]',
        risk_score INTEGER NOT NULL DEFAULT 0,
        finding_count INTEGER NOT NULL DEFAULT 0,
        highest_severity TEXT NOT NULL DEFAULT 'NONE',
        last_seen_at TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(tenant_id, provider, external_id)
      );
      CREATE TABLE findings (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        workload_id TEXT NOT NULL REFERENCES workloads(id),
        rule_key TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        severity TEXT NOT NULL,
        confidence TEXT NOT NULL,
        status TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        risk_explanation_json TEXT NOT NULL DEFAULT '[]',
        assignee_user_id TEXT,
        assignee_team TEXT,
        due_at TEXT,
        first_seen_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL,
        resolved_at TEXT,
        accepted_until TEXT,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE remediation_tasks (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        finding_id TEXT NOT NULL REFERENCES findings(id),
        owner_user_id TEXT,
        owner_team TEXT,
        state TEXT NOT NULL,
        summary TEXT NOT NULL,
        checklist_json TEXT NOT NULL DEFAULT '[]',
        due_at TEXT,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(tenant_id, finding_id)
      );
      CREATE TABLE comments (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        finding_id TEXT NOT NULL REFERENCES findings(id),
        author_user_id TEXT NOT NULL REFERENCES users(id),
        body TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE evidence (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        finding_id TEXT NOT NULL REFERENCES findings(id),
        task_id TEXT REFERENCES remediation_tasks(id),
        uploaded_by_user_id TEXT NOT NULL REFERENCES users(id),
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        original_name TEXT,
        mime_type TEXT,
        size INTEGER,
        sha256 TEXT,
        structured_note TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE verifications (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        finding_id TEXT NOT NULL REFERENCES findings(id),
        verifier_user_id TEXT NOT NULL REFERENCES users(id),
        method TEXT NOT NULL,
        result TEXT NOT NULL,
        notes TEXT NOT NULL,
        verified_at TEXT NOT NULL
      );
      CREATE TABLE risk_acceptances (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        finding_id TEXT NOT NULL REFERENCES findings(id),
        approved_by_user_id TEXT NOT NULL REFERENCES users(id),
        reason TEXT NOT NULL,
        business_owner TEXT NOT NULL,
        compensating_control TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(tenant_id, finding_id)
      );
      CREATE TABLE enablement_plans (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        connection_id TEXT NOT NULL REFERENCES cloud_connections(id),
        created_by_user_id TEXT NOT NULL REFERENCES users(id),
        state TEXT NOT NULL,
        scope_json TEXT NOT NULL,
        targets_json TEXT NOT NULL,
        exclusions_json TEXT NOT NULL,
        auto_enable_new INTEGER NOT NULL DEFAULT 0,
        auto_enable_existing INTEGER NOT NULL DEFAULT 0,
        preview_json TEXT NOT NULL DEFAULT '{}',
        validated_at TEXT,
        progress INTEGER NOT NULL DEFAULT 0,
        result_json TEXT NOT NULL DEFAULT '{}',
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE integration_operations (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        connection_id TEXT NOT NULL REFERENCES cloud_connections(id),
        plan_id TEXT REFERENCES enablement_plans(id),
        operation_type TEXT NOT NULL,
        state TEXT NOT NULL,
        progress INTEGER NOT NULL DEFAULT 0,
        result_json TEXT NOT NULL DEFAULT '{}',
        error_code TEXT,
        correlation_id TEXT NOT NULL,
        created_by_user_id TEXT NOT NULL REFERENCES users(id),
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE saved_views (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        user_id TEXT NOT NULL REFERENCES users(id),
        entity_type TEXT NOT NULL,
        name TEXT NOT NULL,
        query_json TEXT NOT NULL,
        is_default INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE impact_assumptions (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        name TEXT NOT NULL,
        scenario TEXT NOT NULL,
        values_json TEXT NOT NULL,
        created_by_user_id TEXT NOT NULL REFERENCES users(id),
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(tenant_id, scenario)
      );
      CREATE TABLE notifications (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        user_id TEXT NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        severity TEXT NOT NULL,
        read_at TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE audit_events (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        actor_user_id TEXT,
        actor_role TEXT,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        before_hash TEXT,
        after_hash TEXT,
        safe_diff_json TEXT NOT NULL DEFAULT '{}',
        reason TEXT,
        correlation_id TEXT NOT NULL,
        request_id TEXT NOT NULL,
        idempotency_key TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE idempotency_records (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        key TEXT NOT NULL,
        route TEXT NOT NULL,
        request_hash TEXT NOT NULL,
        response_status INTEGER NOT NULL,
        response_body_json TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(tenant_id, key, route)
      );
      CREATE INDEX idx_workloads_tenant_status ON workloads(tenant_id, protection_status);
      CREATE INDEX idx_workloads_filters ON workloads(tenant_id, provider, environment, risk_score DESC);
      CREATE INDEX idx_workloads_updated ON workloads(tenant_id, updated_at DESC);
      CREATE INDEX idx_findings_filters ON findings(tenant_id, status, severity, risk_score DESC);
      CREATE INDEX idx_findings_workload ON findings(tenant_id, workload_id);
      CREATE INDEX idx_findings_assignee ON findings(tenant_id, assignee_user_id, status);
      CREATE INDEX idx_tasks_owner ON remediation_tasks(tenant_id, owner_user_id, state);
      CREATE INDEX idx_evidence_finding ON evidence(tenant_id, finding_id, created_at DESC);
      CREATE INDEX idx_verification_finding ON verifications(tenant_id, finding_id, verified_at DESC);
      CREATE INDEX idx_operations_tenant ON integration_operations(tenant_id, created_at DESC);
      CREATE INDEX idx_audit_tenant_time ON audit_events(tenant_id, created_at DESC);
      CREATE TRIGGER audit_events_no_update BEFORE UPDATE ON audit_events BEGIN SELECT RAISE(ABORT, 'AUDIT_IMMUTABLE'); END;
      CREATE TRIGGER audit_events_no_delete BEFORE DELETE ON audit_events BEGIN SELECT RAISE(ABORT, 'AUDIT_IMMUTABLE'); END;
    `]
  ];

  for (const [version, sql] of migrations) {
    if (applied.has(version)) continue;
    db.exec('BEGIN IMMEDIATE');
    try {
      db.exec(sql);
      db.prepare('INSERT INTO schema_migrations(version, applied_at) VALUES (?, ?)').run(version, new Date().toISOString());
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
}

module.exports = { openDatabase, migrate, resolveDbPath };
