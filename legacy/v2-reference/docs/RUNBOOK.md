# Operational Runbook — Candidate MVP V2

## Build and release gate

```bash
npm run verify
```

## Health

```text
GET /api/health/live
GET /api/health/ready
GET /api/metrics       # requires audit:read permission
GET /api/openapi.json
```

## Start

```bash
npm run build
npm start
```

## Restore deterministic demo data

Stop the application, then:

```bash
npm run reset
npm run verify:seed
npm start
```

## Version conflict

A `412 VERSION_CONFLICT` means another session changed the resource. Reload the detail, review the new state and retry with the latest ETag.

A `428 PRECONDITION_REQUIRED` means the client did not send `If-Match`.

## Idempotency conflict

A `409 IDEMPOTENCY_CONFLICT` means a key was reused with a different request. Generate a new key only for a genuinely new command.

## Provider degraded state

1. Inspect Integration Health.
2. Record the correlation ID.
3. Confirm freshness and cached-data warning.
4. Retry only when the UI permits it.
5. Do not infer that fictional demo status represents a real cloud provider.

## Backup

The current database is `data/cser.db` or `CSER_DB_PATH`.

- use an SQLite-aware backup process;
- encrypt the backup;
- include a restore test;
- do not edit audit rows;
- for real data, migrate to managed PostgreSQL.

## Security incident

1. Stop public access or writes.
2. Preserve logs, database and correlation IDs.
3. Rotate the session secret.
4. Disable demo mode.
5. Investigate tenant/object authorization paths.
6. Restore from a verified backup only when needed.
7. Document the event and remediation.
