# CSER Workspace
## Production Readiness Audit and Improvement Plan

**Audit date:** 29 July 2026  
**Audited artifact:** `CSER_Workspace_Production_MVP(1).zip`  
**Audit basis:** source code, database schema, deterministic seed, automated tests, HTTP smoke test, security-focused dynamic checks, technical documentation, ROI document, and authoritative AI-agent implementation plan.

---

# 1. Executive verdict

## 1.1 Final classification

The current repository is:

> **A functional, attractive, persisted full-stack candidate demo MVP using fictional data.**

It is not yet:

> **A production-ready MVP suitable for real enterprise security data or an exact implementation of the approved target architecture.**

It should currently be presented to ESET as:

> **Independent functional full-stack candidate MVP / production-oriented prototype.**

It should not currently be presented as:

> **Production-ready enterprise cloud-security platform.**

## 1.2 Why this distinction matters

The application is significantly better than a static mock-up:

- it has a real database;
- state changes persist;
- API authorization exists;
- tenant isolation is partially enforced;
- remediation, evidence, verification, audit, idempotency and optimistic-version concepts are implemented;
- deterministic seed data and automated workflow tests exist;
- the product idea, UX direction and commercial reasoning are strong.

However, the repository does not satisfy its own production-MVP gate. The authoritative plan requires PostgreSQL persistence, strict server-side authorization, mandatory transition guards, OpenAPI, migrations from an empty database, deterministic seed/reset, Docker verification, E2E browser testing, accessibility testing, dependency and secret scanning, and complete operational documentation.

The current implementation misses or only partially satisfies several of these gates.

---

# 2. Audit methodology

The audit included:

1. ZIP extraction and repository inventory.
2. Review of:
   - `README.md`
   - `docs/IMPLEMENTATION_REPORT.md`
   - `docs/MIGRATION_TO_TARGET_ARCHITECTURE.md`
   - `docs/ARCHITECTURE.md`
   - `docs/THREAT_MODEL.md`
   - `docs/TRACEABILITY_MATRIX.md`
3. Full source review of:
   - `server/index.js`
   - `server/db.js`
   - `src/app.tsx`
   - `scripts/seed.js`
   - `tests/app.test.js`
   - Docker, environment and deployment files
4. Execution of:
   - `npm run verify`
   - deterministic reset
   - TypeScript compilation
   - automated API workflow tests
   - HTTP smoke test
5. Additional dynamic checks for:
   - missing `If-Match`;
   - malformed JSON;
   - idempotency-key reuse with a different payload;
   - Cloud Operations object access;
   - invalid state transitions;
   - session cookie attributes.
6. Database-invariant checks against seeded data.

---

# 3. What is already good

## 3.1 Product and presentation

- The project solves a coherent enterprise problem.
- The workflow is understandable:
  `Discover → Prioritize → Assign → Remediate → Verify → Learn`.
- The independent-candidate disclaimer is visible.
- ESET branding and internal-product claims are avoided.
- The landing page and product UI have a clear premium technical direction.
- The project is closely aligned with a React/cloud-security frontend role.

## 3.2 Functional workflow

The verified automated path successfully performs:

1. authentication;
2. finding detail;
3. assignment;
4. remediation start;
5. evidence creation;
6. review request;
7. independent verification;
8. resolution;
9. audit confirmation.

## 3.3 Data and tenant foundation

- Two tenants exist.
- 10,000 workloads and 2,500 findings are seeded deterministically.
- Cross-tenant finding access returned `404` in the included test.
- Common list filters use parameterized SQL.
- List limits are capped.

## 3.4 Useful security concepts

- signed sessions;
- HTTP-only cookies;
- CSRF token;
- tenant checks;
- permission map;
- object checks;
- audit records;
- idempotency table;
- version field and ETag response;
- separation-of-duties concept for critical verification.

## 3.5 Honest documentation

The implementation report correctly acknowledges that:

- the target stack was not fully implemented;
- real cloud integration is absent;
- SQLite and demo sessions are not the target production architecture;
- browser regression, Docker build, dependency scanning and real load tests were not executed.

That honesty is valuable and should remain.

---

# 4. Production readiness score

| Area | Score | Assessment |
|---|---:|---|
| Product concept | 9/10 | Strong and relevant |
| Visual direction | 8/10 | Premium concept; final browser QA still required |
| Demo workflow | 7/10 | Core path works |
| Frontend architecture | 4/10 | React UI exists, but not standard Vite/typed production setup |
| Backend architecture | 5/10 | Functional REST boundary, but monolithic and weakly typed |
| Domain correctness | 4/10 | Important transition and seed inconsistencies |
| Security controls | 4/10 | Good concepts, incomplete enforcement |
| Test quality | 3/10 | Five meaningful subtests, but far below plan |
| Deployment reproducibility | 2/10 | Docker and build are not independently reproducible |
| Observability/operations | 2/10 | Minimal logs, no health/metrics/backup automation |
| Real-enterprise production readiness | 2/10 | Not suitable for real data |
| Candidate portfolio readiness | 7/10 | Good after targeted P0 fixes |

---

# 5. Critical and high-priority findings

## P0-01 — Build and Docker are not reproducible

### Evidence

- `package.json` contains no runtime or development dependencies.
- `npm run build` calls `tsc`.
- The build succeeds only because the audit environment has a globally installed TypeScript compiler.
- The official `node:22-alpine` image used in the Dockerfile does not normally include global `tsc`.
- The Dockerfile runs `npm run build` without installing TypeScript.

### Impact

A clean machine or Docker build can fail immediately.

### Required fix

- Add normal dependencies and dev dependencies.
- Use a lockfile.
- Use `npm ci` or `pnpm install --frozen-lockfile`.
- Run a real Docker build in CI.
- Do not claim Docker readiness until the image is actually built and started.

---

## P0-02 — Frontend is not a standard production React/TypeScript implementation

### Evidence

- React is loaded at runtime from unpkg.
- No Subresource Integrity is used.
- No local bundled React dependency exists.
- `tsconfig.json` has `noImplicitAny: false`.
- JSX intrinsic elements and React functions are declared as `any`.
- `src/app.tsx` uses extensive `any`.
- There is no Vite, React Router, Redux Toolkit or RTK Query implementation.

### Impact

The project does not strongly demonstrate the modern React/TypeScript engineering quality expected by the target role. Runtime availability depends on a third-party CDN.

### Required fix

- Convert to a real Vite React application.
- Install and bundle React locally.
- Enable real strict TypeScript:
  - `strict: true`
  - `noImplicitAny: true`
  - no custom `any` JSX escape hatch
- Introduce typed DTOs and API client.
- Add React Router.
- Use TanStack Query or RTK Query for server state.
- Remove CDN runtime dependency.

---

## P0-03 — Weak production secret and cookie configuration

### Evidence

- A default session secret is embedded in source.
- Docker Compose contains a predictable secret.
- Demo mode defaults to enabled.
- Session cookie lacks `Secure`.
- No environment validation stops startup with an unsafe secret.
- `CSER_ALLOWED_ORIGIN` exists in `.env.example` but is unused.
- No HSTS or production proxy policy exists.

### Impact

A mistakenly public deployment could use a known signing secret and insecure session configuration.

### Required fix

- Refuse startup in production without a strong secret.
- Disable demo mode by default in production.
- Add `Secure` based on environment/proxy.
- Rotate signing keys.
- Add trusted-proxy configuration.
- Enforce allowed origin for mutations.
- Add HSTS, Referrer-Policy and Permissions-Policy.
- Document HTTPS-only deployment.

---

## P0-04 — Optimistic locking is optional

### Dynamic audit result

A finding mutation without `If-Match` returned:

```text
HTTP 200
status: ASSIGNED
```

### Impact

Concurrent clients can silently overwrite newer state. The current implementation supports optimistic locking only when the caller voluntarily sends a version.

### Required fix

- Require `If-Match` on every mutable versioned resource.
- Return `428 Precondition Required` when absent.
- Return `412` on mismatch.
- Add two-session conflict E2E tests.
- Show conflict recovery UI.

---

## P0-05 — Idempotency semantics are incorrect and non-atomic

### Dynamic audit result

The same idempotency key was sent with two different enablement payloads.

The second request returned the first response with:

```text
x-idempotent-replay: true
```

No request-hash conflict was reported.

### Static issue

The idempotency record is stored after the business transaction commits. A process failure between commit and idempotency recording can allow a duplicate operation on retry.

### Impact

- A reused key can hide a different request.
- A crash can commit a command without storing replay protection.
- Distributed deployment would not be safe.

### Required fix

- Hash normalized request method, route and body before execution.
- If the key exists with another request hash, return `409`.
- Store the operation result and idempotency record atomically where possible.
- For asynchronous operations, create the operation and idempotency record in one transaction.
- Add replay, mismatch and crash-boundary tests.

---

## P0-06 — Authorization and state-machine loopholes

### Dynamic audit result A

Cloud Operations could read a tenant-wide unassigned triaged finding.

### Dynamic audit result B

Cloud Operations transitioned:

```text
TRIAGED → ASSIGNED
```

without providing an assignee or creating a remediation task.

The resulting finding had:

```text
status: ASSIGNED
assignee: null
task: null
```

### Dynamic audit result C

Cloud Operations could resolve a verified finding with a passed verification.

### Impact

The implementation violates the role and workflow definitions:

- Cloud Operations should primarily work with assigned findings.
- `ASSIGNED` must require an owner, SLA and remediation task.
- final resolution ownership should follow the defined domain policy.

### Required fix

Create explicit command endpoints or command handlers:

- `triageFinding`
- `assignFinding`
- `startRemediation`
- `requestReview`
- `verifyFinding`
- `resolveFinding`
- `acceptRisk`
- `deferFinding`
- `markFalsePositive`

Do not expose generic transitions that allow required side effects to be skipped.

Enforce:

- role;
- object assignment;
- state;
- required fields;
- required side effects;
- audit;
- version;
- idempotency.

---

## P0-07 — Seed data violates domain invariants

Database audit found:

| Invariant violation | Count |
|---|---:|
| VERIFIED or RESOLVED findings without passed verification | 456 |
| ASSIGNED/IN_PROGRESS/READY_FOR_REVIEW findings without remediation task | 920 |
| READY_FOR_REVIEW findings without clean evidence | 202 |
| ACCEPTED_RISK findings without structured acceptance record | 52 |

Additional facts:

- only one evidence row exists for 2,500 findings;
- 80 verification rows exist;
- many resolved or verified seed findings do not have valid histories.

### Impact

Dashboard and list data contradict the application’s own security story. An ESET reviewer can notice that state counts and details are logically inconsistent.

### Required fix

Generate entities through domain factories and transition helpers, not by assigning random statuses directly.

Every seeded state must include its required history:

- assigned → assignee, SLA and task;
- in progress → active task;
- ready for review → evidence and completed checklist;
- verified → passed verification;
- resolved → passed verification and resolution audit;
- accepted risk → reason, owner, control, expiry and approval.

Add a seed-invariant verification command.

---

## P0-08 — Browser, accessibility and visual verification are incomplete

### Evidence

The included test report confirms that browser screenshot regression, multi-browser accessibility automation and real browser QA were not completed.

The audit environment also confirmed that Chromium navigation is blocked by administrator policy, so a full independent rendered QA pass could not be completed here.

### Code-level accessibility issues found

- clickable metric cards have `role="button"` and `tabIndex`, but no Enter/Space handler;
- clickable dashboard rows and table rows are generic elements with click handlers;
- modal focus trap and focus return are absent;
- data-heavy div-based lists lack full keyboard semantics;
- chart text alternatives are incomplete;
- no automated axe test exists.

### Required fix

Run Playwright on a normal machine or CI:

- desktop;
- tablet;
- mobile;
- keyboard-only;
- axe;
- screenshot comparison;
- core role workflows;
- CDN-free offline-compatible build.

---

# 6. Medium-priority findings

## P1-01 — Malformed JSON returns 500

Dynamic test:

```text
Malformed JSON → HTTP 500 INTERNAL_ERROR
```

Expected:

```text
400 INVALID_JSON
```

Fix the error mapping and add schema validation.

## P1-02 — No real API schema validation

Request bodies are manually read and loosely checked. There is no:

- OpenAPI contract;
- DTO whitelist;
- generated client;
- schema drift test;
- structured field-level validation.

## P1-03 — Rate limiting is not implemented

The threat model lists it as future work. Public demo identity switching, search, mutation and exports need explicit limits.

## P1-04 — No health, readiness or metrics endpoints

The plan requires:

- `/health/live`
- `/health/ready`
- `/metrics`

They are absent.

## P1-05 — Analytics editing is not persisted

The UI lets authorized users edit inputs locally, but there is no save action or API mutation. The documentation implies persisted audited assumptions.

Either:

- implement audited scenario persistence; or
- label the controls “temporary calculator inputs” and remove persistence claims.

## P1-06 — Audit is only API-append-only

Audit has no mutation API, but:

- SQLite has no separate audit writer role;
- no DB trigger blocks update/delete;
- no WORM export;
- reset deletes audit;
- no integrity chain exists.

Acceptable for a demo, not for real audit claims.

## P1-07 — Evidence is only a structured note

There is no object storage, signed upload, MIME enforcement, size validation or malware scanning. The UI and docs must not imply a production evidence-upload implementation.

## P1-08 — Enablement is synchronous and incomplete

Missing:

- real async worker;
- queued/running polling;
- cancellation;
- retry failed subset endpoint;
- persisted operation entity;
- dead-letter handling;
- resume after restart.

## P1-09 — Missing planned modules

Partially or fully missing:

- saved-view API and UI;
- user preferences;
- notification read state;
- membership administration;
- audit detail;
- audit pagination/filter set;
- export jobs;
- customer-value ROI scenario;
- risk-acceptance record and expiry job;
- false-positive command;
- provider operation history;
- OpenAPI;
- typed client;
- observability.

## P1-10 — Static and operational headers need hardening

Current CSP allows:

```text
style-src 'unsafe-inline'
```

The runtime uses a third-party script origin and no integrity attribute.

Add:

- local bundles;
- nonce/hash CSP;
- HSTS;
- Referrer-Policy;
- Permissions-Policy;
- production cache policy;
- source map policy.

---

# 7. Deviation assessment

## 7.1 Current deviation

| Target plan | Current implementation | Assessment |
|---|---|---|
| React 19 + Vite | React UMD + global TypeScript compiler | Major deviation |
| Strict TypeScript | Extensive `any`, noImplicitAny disabled | Major deviation |
| React Router | Custom hash router | Moderate deviation |
| Redux Toolkit / RTK Query | Local state and custom `useAsync` | Moderate deviation |
| NestJS REST/OpenAPI | Node built-in HTTP router | Major deviation |
| PostgreSQL + Prisma | Node experimental SQLite | Major deviation |
| Redis + BullMQ | Synchronous operations | Major deviation |
| MinIO/S3 | Structured notes | Major deviation |
| OIDC/Keycloak | Signed demo cookie | Major deviation |
| Docker verified | Dockerfile unverified and likely non-reproducible | Blocker |
| Playwright/axe/k6 | Not executed | Blocker for production claim |
| OpenTelemetry | Not implemented | Major production gap |

## 7.2 Was the deviation reasonable?

It was reasonable as an emergency way to deliver a functional demo rather than an untested dependency-heavy skeleton.

It is not reasonable as the final highest-quality submission when the goal is to prove modern React/TypeScript engineering to ESET.

The current code should be treated as:

- product-flow reference;
- visual reference;
- seed-data reference;
- API-behavior prototype;
- domain-test starting point.

It should not become the permanent architecture by adding more patches indefinitely.

---

# 8. Recommended strategy for ESET

## 8.1 Do not wait for every enterprise feature

For a job application, ESET does not need:

- production Kubernetes;
- real cloud credentials;
- a real malware scanner;
- a full CNAPP;
- a completed enterprise identity rollout.

They need evidence that the candidate can:

- design a strong React UI;
- use TypeScript properly;
- integrate APIs;
- handle enterprise states;
- test behavior;
- reason about cloud workflows;
- communicate limitations honestly.

## 8.2 Minimum submission-ready V2

Before sending the demo, complete:

1. real Vite + React build;
2. true strict TypeScript;
3. reproducible dependency install and Docker build;
4. fix state-machine and role loopholes;
5. regenerate consistent seed data;
6. mandatory optimistic locking;
7. correct idempotency semantics;
8. secure production configuration;
9. Playwright golden path;
10. axe and keyboard review;
11. responsive browser screenshots;
12. truthful documentation.

This would produce a strong portfolio-grade candidate MVP even before every enterprise service is added.

## 8.3 Best possible technical version

For the strongest version, migrate to:

```text
apps/web       React 19 + Vite + TypeScript
apps/api       NestJS + OpenAPI
database       PostgreSQL + Prisma
server state   RTK Query or TanStack Query
client state   Redux Toolkit only for real cross-route UI state
tests          Vitest + RTL + Supertest + Playwright + axe
delivery       Docker Compose + CI
```

Add Redis/BullMQ, MinIO and Keycloak only after the primary workflow is correct and tested.

---

# 9. Improvement roadmap

## Phase 0 — Freeze and protect the working prototype

- tag the current version as `prototype-v1`;
- preserve screenshots and demo script;
- export the current database schema;
- add a known-limitations banner in documentation;
- rename “Production MVP” to “Functional Candidate MVP” until gates pass.

### Exit criteria

- existing demo remains recoverable;
- no ambiguity about readiness status.

---

## Phase 1 — Reproducible modern frontend

- create a Vite React TypeScript app;
- add real package dependencies;
- commit lockfile;
- bundle React locally;
- introduce React Router;
- introduce typed API contracts;
- replace `any`;
- enable full strict mode;
- split the 232-line single file into feature modules;
- implement Error Boundaries;
- retain the accepted visual system.

### Exit criteria

- clean install on an empty machine;
- clean build;
- no global tools required;
- no CDN runtime;
- no TypeScript escape-hatch declarations;
- frontend unit/component tests pass.

---

## Phase 2 — Domain correctness and security repairs

- replace generic transition endpoint with explicit commands;
- enforce assigned-only Cloud Operations access;
- require assignee, SLA and task for assignment;
- require evidence, completed checklist and summary for review;
- enforce independent verification;
- restrict final resolution;
- implement structured risk acceptance;
- implement expiry handling;
- require `If-Match`;
- repair idempotency request hashing and atomicity;
- validate origin and production cookie settings;
- implement rate limiting;
- fix malformed JSON status.

### Exit criteria

- all negative workflow tests pass;
- no invalid state can be created through API;
- security test suite covers all roles.

---

## Phase 3 — PostgreSQL/NestJS migration

- create NestJS modules by domain;
- introduce DTO/schema validation;
- generate OpenAPI;
- generate typed frontend client;
- migrate SQLite schema to Prisma/PostgreSQL;
- create versioned migrations;
- implement tenant-scoped repositories;
- add PostgreSQL row-level-security defense in depth where appropriate;
- store state and audit in one transaction;
- migrate deterministic seed using domain factories.

### Exit criteria

- migration from empty DB succeeds;
- reset is deterministic;
- invariant verification returns zero violations;
- API contract drift check passes.

---

## Phase 4 — Async operations, evidence and observability

- Redis/BullMQ operation queue;
- operation entity and progress polling;
- partial retry;
- dead-letter state;
- MinIO/S3 evidence upload;
- signed URLs;
- MIME and size limits;
- scan seam;
- health/live/ready;
- structured logs;
- metrics;
- traces;
- alert conditions;
- backup and restore scripts.

### Exit criteria

- operation survives API restart;
- failed subset retry works;
- evidence flow passes security tests;
- backup restore is demonstrated.

---

## Phase 5 — Browser quality gate

- Playwright golden path;
- tenant-negative E2E;
- role-negative E2E;
- conflict recovery E2E;
- wizard partial-failure E2E;
- mobile wizard;
- axe;
- keyboard-only audit;
- screenshot comparison against accepted concept;
- Chrome, Firefox and WebKit smoke tests where practical;
- performance measurements.

### Exit criteria

- zero serious or critical axe issues;
- core workflows pass in browser;
- no visible responsive defect;
- no inert primary CTA;
- screenshots approved.

---

## Phase 6 — Deployment and candidate packaging

Recommended public-demo architecture:

```text
Vercel or static CDN:
  React frontend

Persistent managed service or VPS:
  NestJS API
  PostgreSQL
  optional Redis
  optional MinIO
```

Alternative:

```text
Single Hostinger VPS:
  reverse proxy
  web
  API
  PostgreSQL
  Redis
  MinIO
  backups
```

Deliver:

- stable URL;
- demo accounts;
- reset strategy;
- monitoring;
- 90-second walkthrough video;
- architecture diagram;
- public GitHub repository;
- concise README;
- technical deep-dive document;
- explicit fictional-data disclaimer.

---

# 10. Required new tests

## Authentication and configuration

- production refuses default secret;
- demo mode disabled in production;
- secure cookie under HTTPS;
- logout/session expiry;
- origin rejection.

## Authorization

- Cloud Operations sees only assigned work where required;
- Cloud Operations cannot assign;
- Cloud Operations cannot resolve;
- Auditor cannot mutate;
- Admin cannot bypass verification;
- cross-tenant list/detail/mutation/evidence/audit blocked.

## State machine

- assignment without owner fails;
- assignment without SLA fails;
- review without evidence fails;
- review without completed checklist fails;
- self-verification fails;
- resolve without verification fails;
- accept risk without expiry fails;
- expired acceptance reopens.

## Concurrency

- missing `If-Match` returns 428;
- stale `If-Match` returns 412;
- same idempotency key + same payload replays;
- same idempotency key + different payload returns 409;
- transaction and idempotency are atomic.

## Seed invariants

Expected zero:

- active finding without required task;
- review-ready without evidence;
- verified/resolved without verification;
- accepted risk without acceptance record;
- cross-tenant relation mismatch.

## Browser

- login;
- overview drill-down;
- filters survive reload;
- golden remediation;
- enablement partial failure;
- mobile wizard;
- keyboard navigation;
- axe.

---

# 11. Submission recommendation

## Current version

Safe wording:

> I created an independent functional full-stack candidate MVP using fictional multi-cloud data. It demonstrates workload inventory, findings prioritization, remediation, independent verification, audit, tenant-scoped authorization and transparent product-value modelling. The current repository is a production-oriented candidate prototype, not an official ESET product or a deployment for real customer data.

## After P0 fixes

Preferred wording:

> I created and tested an independently branded React/TypeScript cloud-security workspace with a typed API, PostgreSQL persistence, tenant-scoped authorization, audited remediation workflow, deterministic provider adapters and browser-based automated tests.

## Do not claim

- official ESET feature;
- real cloud scan;
- real security assessment;
- production readiness for customer data;
- guaranteed savings;
- exact ESET architecture;
- completed Docker deployment unless verified.

---

# 12. Final recommendation

The project is worth continuing. Its product idea and visual direction are strong enough to differentiate the application.

The correct next move is not to add more superficial dashboard modules to the current dependency-free codebase.

The correct next move is:

1. preserve the working prototype;
2. rebuild the frontend as a real Vite/React/TypeScript project;
3. repair domain authorization and invariants;
4. migrate the backend and database to NestJS/PostgreSQL;
5. pass browser, accessibility and security gates;
6. deploy a truthful, stable candidate demo.

This turns the project from:

> an impressive visual and functional prototype

into:

> credible evidence that the candidate can work on a modern enterprise React platform.
