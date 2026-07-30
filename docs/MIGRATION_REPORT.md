# V2 → V3 Migration Report

## Preserved

- independent CSER identity and accepted premium dark interface direction;
- overview, inventory, findings, remediation, verification, enablement, integration, permissions, audit and impact product stories;
- Northstar/BluePeak fictional tenancy;
- deterministic high-volume seed goals;
- transparent ROI formulas and disclaimer;
- V2 as a runnable regression reference.

## Replaced in V3 source

| V2 | V3 target source |
|---|---|
| UMD React via CDN | Vite-bundled local React dependencies |
| custom hash router | React Router |
| manual server-state hook | TanStack Query |
| single `app.tsx` | feature modules and app shell |
| weakened TypeScript | strict compiler policy |
| Node HTTP monolith | NestJS modules/controllers/services |
| SQLite | PostgreSQL + Prisma schema |
| manually assembled API schema | NestJS Swagger/OpenAPI generation |
| generic transition patterns | explicit finding commands |
| API-only tests | unit, integration, Playwright and axe specifications |

## Deliberately retained as seams

- signed demo session instead of an active Keycloak deployment;
- synchronous candidate-safe provider operation instead of Redis/BullMQ;
- structured evidence notes plus attachment metadata contract instead of active S3/MinIO upload;
- instrumentation interfaces without a deployed telemetry backend.

## Uncompleted infrastructure gates

The generation environment had no registry DNS, PostgreSQL, Docker or browser runtime. As a result, package installation, lockfile generation, Prisma migration generation, target builds, browser tests and Docker execution were not possible. These are explicit release blockers recorded in `RELEASE_GATE.md`.
