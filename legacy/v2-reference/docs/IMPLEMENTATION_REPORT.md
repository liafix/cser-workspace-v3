# Implementation Report — Candidate MVP V2

## Classification

The repository is a **functional, persisted and security-hardened candidate MVP V2** intended for portfolio and interview demonstration with fictional data.

It is not approved for real enterprise data and is not an official ESET product.

## Audit issues fixed

### Build and reproducibility

- the TypeScript compiler is included under `vendor/typescript`;
- build scripts no longer depend on a globally installed `tsc`;
- a lockfile and GitHub Actions verification workflow are included;
- Dockerfile builds using the vendored compiler;
- seed is automatically ensured at runtime.

Docker itself was unavailable in the execution environment, so the image definition was not executed here.

### Domain correctness

- deterministic seed entities are produced with valid related tasks, evidence, verification and risk-acceptance records;
- the seed gate reports zero invalid state combinations;
- the primary Azure workload uses the correct Azure connection;
- Cloud Operations list and detail access are limited to assigned findings;
- assignment requires an eligible Cloud Operations member, due date, remediation summary and generated task;
- review requires clean evidence and a completed checklist;
- critical verification is independent;
- final resolution is limited to analyst/manager roles;
- risk acceptance requires manager approval, owner, control, reason and expiration.

### Concurrency and replay safety

- mutable versioned resources require `If-Match`;
- missing precondition returns `428`;
- stale version returns `412`;
- idempotency hashes method, route and normalized body;
- a repeated identical request replays its recorded response;
- the same key with a different request returns `409`;
- workflow result and idempotency record are committed in the same transaction.

### Application security

- production refuses a missing or weak signing secret;
- production demo mode requires explicit opt-in;
- Secure cookies are enabled by production defaults;
- CSRF, origin checking and rate limiting are implemented;
- malformed JSON returns `400`;
- security headers include HSTS in production, frame denial, no-sniff, strict referrer and permission policy;
- audit update/delete operations are blocked by database triggers.

### API and operations

- liveness and readiness endpoints;
- protected operational metrics;
- documented OpenAPI 3.1 contract for core endpoints;
- structured problem responses;
- correlation IDs;
- persisted enablement operations;
- persisted and audited business-impact assumptions;
- saved-view and notification API seams.

### Frontend behavior

- integration sync and enablement execution send resource versions;
- ROI scenario changes can be saved and audited;
- metric cards support Enter and Space activation;
- core linked action rows support keyboard activation;
- version conflicts show recovery-oriented messages.

## Automated verification result

At final packaging:

- deterministic seed: passed;
- database invariants: passed;
- audit immutability: passed;
- automated release tests: 13 passed, 0 failed;
- HTTP smoke test: passed;
- TypeScript build: passed.

## Remaining deviations

The current runtime still differs from the authoritative target architecture:

| Target | Current V2 |
|---|---|
| Vite-bundled React | React UMD runtime with TypeScript-compiled application code |
| React Router | compact hash router |
| Redux Toolkit / RTK Query | local state and typed-compatible request boundary |
| NestJS | hardened Node HTTP REST application |
| PostgreSQL + Prisma | transactional Node SQLite with migrations |
| Redis + BullMQ | persisted deterministic operations without distributed queue |
| MinIO/S3 | safe structured evidence notes |
| OIDC/Keycloak | signed fictional demo sessions |
| OpenTelemetry stack | structured logs, counters and health endpoints |

These are documented, not hidden.

## Browser QA limitation

A Chromium process was present, but headless navigation did not complete within the execution environment. Playwright and axe packages were not installed and network installation was unavailable. Therefore:

- API and source behavior were tested;
- TypeScript was compiled;
- HTTP pages were smoke-tested;
- a final interactive browser, keyboard and responsive review is still required on the deployment machine.

## Before real enterprise use

1. Migrate UI to standard Vite/React packages with locally bundled runtime.
2. Migrate API to NestJS with generated OpenAPI client.
3. Migrate persistence to PostgreSQL/Prisma and add database-role isolation.
4. Replace demo identity with OIDC/SSO.
5. Add Redis/BullMQ for restart-safe asynchronous jobs.
6. Add S3/MinIO evidence files, scanning and retention.
7. Add Playwright, axe, load and penetration testing.
8. Add managed telemetry, backup/restore and incident runbooks.
9. Confirm real product/provider contracts through discovery.
