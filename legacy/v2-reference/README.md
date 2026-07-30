# CSER Workspace — Candidate MVP V2

**Cloud Security Exposure & Remediation Workspace** is an independently branded, persisted full-stack candidate project built with fictional Azure, AWS, and GCP data.

> Independent candidate concept built from public information and fictional data. It is not an official ESET product and does not use internal ESET systems or APIs.

## Current readiness label

This repository is a **submission-ready functional Candidate MVP V2** for a technical portfolio and interview demonstration. It is not approved for real enterprise security data and is not an exact implementation of ESET infrastructure.

## Improvements in V2

- reproducible TypeScript compiler vendored in the repository;
- deterministic database migrations and seed reset;
- 10,000 consistent workloads and 2,500 consistent findings;
- zero domain-invariant violations in the verification gate;
- API-enforced tenant and object authorization;
- Cloud Operations limited to assigned findings;
- mandatory `If-Match` optimistic locking;
- atomic request-hash idempotency with mismatch rejection;
- explicit workflow guards and required side effects;
- structured manager risk acceptance with expiration;
- database triggers blocking audit update and deletion;
- rate limiting, origin checks and production secret validation;
- `live`, `ready`, metrics and OpenAPI endpoints;
- persisted and audited ROI assumptions;
- version-aware integration sync and enablement execution UI;
- keyboard activation for dashboard metrics and core linked rows;
- expanded release tests and CI workflow.

## Functional modules

- premium landing page and authenticated application shell;
- five demo roles and two isolated fictional tenants;
- Security Overview;
- Workload Inventory and Workload Detail;
- Findings Explorer and Finding Detail;
- remediation assignment, SLA, task and checklist;
- comments and structured demo evidence;
- independent verification and guarded resolution;
- structured risk acceptance;
- provider integration health and deterministic failure modes;
- protection enablement plans and persisted operations;
- Permissions Inspector;
- append-only Audit Explorer;
- transparent business-impact scenarios;
- saved-view and notification API seams;
- responsive desktop, tablet and mobile CSS.

## Requirements

- Node.js **22.5 or newer**.
- No package registry access is required for the current runtime.
- The TypeScript compiler required by the build is included under `vendor/typescript`.

## Quick start

```bash
npm run build
npm run reset
npm start
```

Open:

```text
http://127.0.0.1:4173
```

`npm start` preserves an existing database. `npm run reset` returns the deterministic demo to its original state.

## Demo identities

| User | Role | Tenant |
|---|---|---|
| Sofia Marin | Security Analyst | Northstar Industrial Systems |
| Lukas Novak | Cloud Operations | Northstar Industrial Systems |
| Petra Horak | Security Manager | Northstar Industrial Systems |
| Martin Sykora | Read-only Auditor | Northstar Industrial Systems |
| Alex Reed | Platform Admin | Northstar Industrial Systems |
| Nina Carter | Security Analyst | BluePeak Logistics |
| Omar Hassan | Cloud Operations | BluePeak Logistics |

## Recommended golden path

1. Sign in as **Sofia Marin**.
2. Open `FND-CRIT-0042`.
3. Assign it to **Lukas Novak**, with due date and remediation summary.
4. Switch to Lukas, start work, add evidence and request review.
5. Switch back to Sofia, independently verify and resolve.
6. Open Audit Explorer.
7. Create and execute a fictional protection enablement plan.
8. Sign in as Petra and save an illustrative ROI scenario.

See `docs/DEMO_SCRIPT.md`.

## Verification

```bash
npm run verify
```

The release gate runs:

1. TypeScript compilation;
2. deterministic reset;
3. database/domain invariant checks;
4. audit immutability check;
5. 13 automated release tests;
6. HTTP smoke test.

## API and operations

- OpenAPI document: `/api/openapi.json`
- Liveness: `/api/health/live`
- Readiness: `/api/health/ready`
- Protected metrics: `/api/metrics`

## Architecture used by this deliverable

```text
React 19 UMD runtime + strict TypeScript-compiled UI
                         │
                         ▼
        hardened Node.js REST application boundary
                         │
                         ▼
       transactional SQLite source of truth and audit
                         │
                         ▼
            deterministic provider mock adapters
```

## Remaining target-architecture deviation

The authoritative target architecture specifies Vite, React Router, Redux Toolkit/RTK Query, NestJS, PostgreSQL/Prisma, Redis/BullMQ, MinIO and OIDC. These dependencies could not be installed or fully validated in the isolated execution environment.

V2 therefore concentrates on correctness and verifiable behavior in the existing runtime. It must not be described as a completed NestJS/PostgreSQL implementation. See:

- `docs/IMPLEMENTATION_REPORT.md`
- `docs/MIGRATION_TO_TARGET_ARCHITECTURE.md`
- `docs/PRODUCTION_READINESS_AUDIT.md`

## Deployment recommendation

For the current stateful runtime, use a Node 22 VPS or container host with a persistent disk and TLS reverse proxy. Vercel can host the static landing page, but the complete persisted application requires a stateful backend unless it is migrated to managed PostgreSQL/serverless APIs.

See `docs/DEPLOYMENT.md`.
