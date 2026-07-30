# CSER Workspace V3 — ESET Candidate Edition
## Completion, Migration, Verification and Deployment Plan for an AI Development Agent

**Document type:** Authoritative Plan Mode implementation specification  
**Version:** 1.0  
**Date:** 29 July 2026  
**Prepared for:** Dušan Cabala / DCZ WebAgentúra  
**Input application:** `CSER_Workspace_Candidate_MVP_V2_FINAL.zip`  
**Primary audit:** `CSER_Workspace_Production_Readiness_Audit_and_Improvement_Plan.md`  
**Execution status:** PLAN MODE ONLY — do not implement until the user explicitly requests execution with this plan and the V2 ZIP attached.

---

# 0. PLAN MODE CONTRACT

## 0.1 Purpose of this document

This document defines the complete migration and completion path from the current functional CSER Workspace Candidate MVP V2 into:

> **CSER Workspace V3 — ESET Candidate Edition**

V3 must be a polished, reproducible, modern React/TypeScript full-stack candidate application that can be safely and honestly shown to ESET as evidence of frontend and full-stack engineering ability.

The target is not a fictional claim of a complete enterprise CNAPP platform. The target is a professionally engineered candidate MVP that:

- uses a real local React/Vite dependency graph;
- uses strict TypeScript;
- has a typed API;
- uses NestJS;
- uses PostgreSQL and Prisma;
- enforces tenant isolation and domain rules;
- passes browser E2E and accessibility tests;
- builds and starts through Docker Compose;
- has a stable public demo deployment;
- retains the accepted premium UX;
- uses only fictional data and mock provider adapters;
- does not claim official ESET affiliation.

## 0.2 Agent role during execution

The execution agent must act as:

- Principal React/TypeScript Engineer
- Senior NestJS Backend Engineer
- PostgreSQL/Prisma Data Architect
- Product Security Engineer
- Enterprise UX Engineer
- Accessibility Engineer
- QA Automation Lead
- DevOps Engineer
- Technical Writer

## 0.3 Plan Mode prohibition

Before the user explicitly starts execution, the agent must not:

- generate the final V3 application;
- replace V2 files;
- perform a production deployment;
- claim that V3 exists;
- fabricate tests;
- silently reinterpret this plan as approval to implement.

## 0.4 Execution command expected later

The user will later provide:

1. this V3 plan;
2. the V2 ZIP;
3. an explicit instruction to enter execution mode.

Only then may the agent create the V3 repository and final ZIP.

---

# 1. EXECUTIVE OBJECTIVE

## 1.1 Final deliverable

Produce a final ZIP named:

```text
CSER_Workspace_V3_ESET_Candidate_Edition_FINAL.zip
```

The ZIP must contain a complete repository that can be installed, migrated, seeded, tested, built and started from a clean environment.

## 1.2 Product positioning

V3 may be described as:

> Independent React/TypeScript full-stack cloud-security candidate MVP using fictional Azure, AWS and GCP data.

V3 must not be described as:

- an official ESET product;
- a clone of ESET PROTECT;
- a real cloud scanner;
- a production deployment handling customer data;
- a guaranteed revenue or cost-saving system;
- a platform connected to ESET internal systems.

## 1.3 Primary candidate proof

V3 must demonstrate that the candidate can:

- build a modern React SPA;
- use TypeScript correctly;
- structure a data-heavy enterprise interface;
- design typed API contracts;
- implement complex workflows;
- integrate frontend and backend;
- model data in PostgreSQL;
- enforce authorization;
- test real browser interactions;
- design accessible UI;
- deploy a stable demo;
- document technical decisions honestly.

---

# 2. AUTHORITATIVE SOURCE ORDER

When sources conflict, use this order:

1. Legal, ethical and truth-boundary rules in the technical and ROI documents.
2. This V3 plan.
3. V2 production-readiness audit.
4. Original Production MVP implementation plan.
5. V2 source code and database behavior.
6. Official documentation for chosen dependencies.
7. Execution-time user instructions.
8. Agent inference.

The agent must not silently preserve a V2 behavior that conflicts with a V3 domain rule.

---

# 3. CURRENT V2 BASELINE

## 3.1 Current repository shape

The V2 repository currently contains:

```text
src/app.tsx
src/globals.d.ts
server/index.js
server/db.js
scripts/seed.js
scripts/verify-invariants.js
tests/app.test.js
public/*
data/cser.db
docs/*
vendor/typescript/*
```

## 3.2 Current strengths to preserve

Preserve the following product and UX assets:

- independent CSER Workspace identity;
- accepted dark premium visual direction;
- landing page concept;
- Security Overview layout;
- Workload Inventory flow;
- Findings Explorer;
- Finding Detail;
- remediation workflow;
- independent verification;
- risk acceptance;
- Integration Health;
- Permissions Inspector;
- Audit Explorer;
- Business Impact and Adoption calculator;
- deterministic Northstar and BluePeak demo scenarios;
- visible fictional-data disclaimer;
- ROI formulas and scenario boundaries;
- golden-path demo narrative;
- provider mock-state concept;
- database invariant checks.

## 3.3 Current weaknesses to eliminate

The V3 execution must eliminate these V2 weaknesses:

- UMD React runtime;
- external unpkg runtime dependency;
- custom JSX global declarations;
- weakened `noImplicitAny`;
- extensive `any`;
- single-file frontend;
- custom hash routing;
- custom server-state hooks;
- untyped manual API client;
- Node built-in HTTP monolith;
- SQLite source-of-truth database;
- manually constructed OpenAPI document;
- manually parsed request bodies;
- incomplete browser testing;
- no executed axe tests;
- no verified Docker build;
- no real dependency graph;
- no normal dependency lock resolution;
- no PostgreSQL migrations;
- no Prisma data model;
- no standard NestJS module boundaries.

## 3.4 V2 disposition

The current V2 must be preserved as:

```text
legacy/v2-reference/
```

or as a Git tag/branch:

```text
prototype-v2
```

Do not use V2 runtime code as the final implementation foundation when it would preserve architectural defects.

V2 should serve as:

- UX reference;
- domain behavior reference;
- seed scenario reference;
- wording reference;
- regression comparison;
- migration input.

---

# 4. V3 SCOPE DECISION

## 4.1 Mandatory V3 scope

V3 must include:

1. Premium public landing page
2. Demo authentication launcher
3. Tenant context
4. Role-based permissions
5. Security Overview
6. Workload Inventory
7. Workload Detail
8. Findings Explorer
9. Finding Detail
10. Explicit remediation commands
11. Remediation Board
12. Evidence notes and evidence metadata
13. Independent verification
14. Risk acceptance
15. Protection Enablement Wizard
16. Integration Health
17. Permissions Inspector
18. Business Impact and Adoption
19. Audit Explorer
20. Notifications
21. Saved views
22. Health endpoints
23. OpenAPI
24. PostgreSQL migrations
25. Deterministic seed
26. Invariant verification
27. Unit, integration and browser tests
28. Accessibility verification
29. Docker Compose
30. Public deployment profile
31. Complete documentation

## 4.2 V3 production-hardening seams

V3 must define interfaces and documentation for:

- OIDC identity;
- Redis/BullMQ async operations;
- MinIO/S3 evidence storage;
- OpenTelemetry;
- external provider adapters.

These may use candidate-safe implementations or adapters in V3, but the architecture must make later replacement explicit.

## 4.3 Deferred after V3

Unless execution capacity clearly permits, defer:

- real Keycloak realm operation;
- real Redis queue;
- real MinIO upload;
- real cloud provider credentials;
- real ESET APIs;
- Kubernetes;
- Helm;
- malware scanning;
- autonomous remediation;
- real billing;
- real enterprise identity federation.

These must not block V3 candidate submission.

---

# 5. TARGET ARCHITECTURE

## 5.1 Architecture style

Use a modular monorepo:

```text
cser-workspace-v3/
├─ apps/
│  ├─ web/
│  └─ api/
├─ packages/
│  ├─ contracts/
│  ├─ domain/
│  ├─ ui/
│  ├─ config/
│  └─ testing/
├─ prisma/
├─ tests/
├─ docs/
├─ infra/
└─ .github/workflows/
```

Use a modular monolith, not distributed microservices.

## 5.2 Required runtime stack

### Workspace

- Node.js active LTS supported by all selected packages
- pnpm workspace
- committed `pnpm-lock.yaml`
- Corepack configuration
- deterministic scripts

### Frontend

- React
- Vite
- TypeScript strict
- React Router
- TanStack Query or RTK Query
- Redux Toolkit only for genuine cross-route UI state
- React Hook Form
- Zod
- TanStack Table
- TanStack Virtual
- Radix/shadcn-compatible accessible primitives
- Recharts or an equivalent lightweight chart library
- date-fns
- Lucide icons
- token-based CSS/Tailwind CSS

### Backend

- NestJS
- TypeScript strict
- REST API
- generated OpenAPI
- DTO/schema validation
- Prisma
- PostgreSQL
- structured logging
- correlation IDs
- explicit authorization guards
- typed exception model

### Testing

- Vitest
- React Testing Library
- MSW
- Nest testing utilities
- Supertest
- Playwright
- axe integration
- optional k6 smoke/performance scripts

### Delivery

- Dockerfile for web
- Dockerfile for API
- Docker Compose
- PostgreSQL container
- GitHub Actions
- public frontend deployment
- persistent API and database deployment

## 5.3 Server state decision

Preferred:

```text
TanStack Query
```

Use it for:

- API caching;
- background refetch;
- cancellation;
- retries;
- stale data;
- invalidation;
- optimistic conflict recovery.

Redux Toolkit is allowed for:

- current demo identity context if necessary;
- global UI preferences;
- command palette;
- cross-route selection state.

Do not copy server resources into a second Redux source of truth.

## 5.4 Authentication decision

V3 must support two modes.

### Demo mode

- seeded demo identities;
- server-issued HTTP-only session;
- role derived from membership;
- explicit `DEMO_MODE=true`;
- visible demo banner;
- no arbitrary client-side role mutation;
- role switch creates a new server session and audit event.

### Production adapter mode

- OIDC interface;
- documented subject-to-user mapping;
- disabled unless configured;
- no requirement for a fully deployed Keycloak instance before candidate submission.

## 5.5 Deployment decision

Recommended candidate deployment:

```text
Vercel:
  apps/web

Persistent API host:
  apps/api

Managed PostgreSQL:
  database
```

Acceptable API hosts:

- Railway
- Render
- Fly.io
- Hostinger VPS
- another persistent Node container host

Preferred all-in-one local and technical-review environment:

```text
Docker Compose:
  web
  api
  postgres
```

Do not use SQLite in public V3 deployment.

---

# 6. REPOSITORY STRUCTURE

```text
CSER_Workspace_V3_ESET_Candidate_Edition/
├─ apps/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  │  ├─ App.tsx
│  │  │  │  ├─ router.tsx
│  │  │  │  ├─ providers.tsx
│  │  │  │  └─ error-boundary.tsx
│  │  │  ├─ api/
│  │  │  │  ├─ client.ts
│  │  │  │  ├─ errors.ts
│  │  │  │  └─ query-keys.ts
│  │  │  ├─ auth/
│  │  │  ├─ features/
│  │  │  │  ├─ overview/
│  │  │  │  ├─ workloads/
│  │  │  │  ├─ findings/
│  │  │  │  ├─ remediation/
│  │  │  │  ├─ enablement/
│  │  │  │  ├─ integrations/
│  │  │  │  ├─ permissions/
│  │  │  │  ├─ analytics/
│  │  │  │  ├─ audit/
│  │  │  │  ├─ notifications/
│  │  │  │  └─ saved-views/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ styles/
│  │  │  ├─ utils/
│  │  │  └─ test/
│  │  ├─ public/
│  │  ├─ index.html
│  │  ├─ vite.config.ts
│  │  └─ package.json
│  └─ api/
│     ├─ src/
│     │  ├─ main.ts
│     │  ├─ app.module.ts
│     │  ├─ common/
│     │  ├─ auth/
│     │  ├─ tenants/
│     │  ├─ users/
│     │  ├─ memberships/
│     │  ├─ workloads/
│     │  ├─ findings/
│     │  ├─ remediation/
│     │  ├─ evidence/
│     │  ├─ verifications/
│     │  ├─ risk-acceptance/
│     │  ├─ enablement/
│     │  ├─ integrations/
│     │  ├─ permissions/
│     │  ├─ analytics/
│     │  ├─ audit/
│     │  ├─ notifications/
│     │  ├─ saved-views/
│     │  └─ health/
│     ├─ test/
│     └─ package.json
├─ packages/
│  ├─ contracts/
│  ├─ domain/
│  ├─ ui/
│  ├─ config/
│  └─ testing/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  ├─ seed.ts
│  └─ verify-invariants.ts
├─ tests/
│  ├─ e2e/
│  ├─ accessibility/
│  ├─ performance/
│  └─ security/
├─ infra/
│  ├─ docker/
│  ├─ nginx/
│  └─ deployment/
├─ docs/
├─ .github/workflows/
├─ docker-compose.yml
├─ pnpm-workspace.yaml
├─ package.json
├─ pnpm-lock.yaml
└─ README.md
```

---

# 7. MIGRATION STRATEGY

## 7.1 Migration principle

Use controlled vertical replacement.

Do not attempt to convert the V2 single file line-by-line into the final architecture.

For each feature:

1. identify V2 behavior;
2. define typed contract;
3. implement domain rule;
4. implement NestJS endpoint;
5. implement Prisma persistence;
6. implement React feature;
7. write tests;
8. compare visual and functional behavior;
9. remove dependence on legacy code.

## 7.2 Legacy preservation

Place V2 reference artifacts outside runtime:

```text
docs/legacy-v2/
```

Include:

- V2 screenshots;
- V2 route list;
- V2 schema summary;
- V2 known-good demo flow;
- V2 audit summary.

Do not ship the V2 database as the V3 production database.

## 7.3 No dual-write requirement

V3 is a candidate application using fictional data. A live zero-downtime production migration is not required.

Use:

- fresh PostgreSQL migrations;
- deterministic regenerated seed;
- optional script to map selected V2 records for regression comparison.

## 7.4 Visual migration

The accepted visual concept is a reference, not a pixel-perfect constraint.

Preserve:

- dark navy premium theme;
- technical spacing;
- refined cards;
- clear severity colors;
- data density;
- polished landing page;
- cloud/security visual identity.

Improve:

- responsive behavior;
- keyboard interaction;
- focus states;
- semantic controls;
- table accessibility;
- loading and conflict UX;
- mobile wizard;
- reduced motion.

---

# 8. TYPE SYSTEM

## 8.1 Strict compiler rules

Required:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "useUnknownInCatchVariables": true,
  "noFallthroughCasesInSwitch": true,
  "noImplicitOverride": true
}
```

No custom global declaration may turn React or JSX into `any`.

## 8.2 Type boundaries

Create explicit types for:

- session;
- tenant;
- membership;
- user;
- workload;
- finding;
- remediation task;
- evidence;
- verification;
- risk acceptance;
- enablement plan;
- integration operation;
- saved view;
- impact assumption;
- audit event;
- paginated response;
- problem details;
- conflict response.

## 8.3 Unknown handling

Use `unknown` for:

- caught errors;
- external provider payloads;
- untrusted JSON;
- configuration parsing.

Validate before use.

## 8.4 Generated API types

Generate or derive frontend types from:

- OpenAPI;
- shared Zod schemas;
- or a controlled shared contracts package.

Do not manually duplicate DTO shapes without drift checks.

---

# 9. DOMAIN MODEL

## 9.1 Core entities

### Tenant

- id
- key
- name
- status
- settings
- retention policy
- timestamps

### User

- id
- external subject
- email
- display name
- status
- timestamps

### Membership

- id
- tenant ID
- user ID
- role
- status
- timestamps

### CloudConnection

- id
- tenant ID
- provider
- alias
- external scope ID
- status
- freshness status
- last sync
- circuit state
- version
- timestamps

### Workload

- id
- tenant ID
- connection ID
- provider
- external ID
- name
- scope alias
- environment
- region
- OS
- eligibility
- protection status
- asset criticality
- internet exposure
- owner
- tags
- provider hash
- last seen
- version
- timestamps

### Finding

- id
- tenant ID
- workload ID
- rule key
- title
- description
- severity
- confidence
- state
- risk score
- risk explanation
- assignee
- team
- SLA policy
- due date
- first seen
- last seen
- resolved date
- version
- timestamps

### RemediationTask

- id
- tenant ID
- finding ID
- owner
- team
- state
- summary
- checklist
- due date
- version
- timestamps

### Evidence

V3 candidate implementation must support:

- structured note;
- evidence type;
- author;
- status;
- optional attachment metadata seam;
- hash;
- timestamps.

A real object upload may be deferred, but the contract must allow later storage.

### Verification

- finding ID
- verifier
- method
- result
- notes
- verified time

### RiskAcceptance

- finding ID
- approver
- reason
- business owner
- compensating control
- expiration
- timestamps

### EnablementPlan

- connection
- scope
- targets
- exclusions
- automatic enable flags
- preview
- state
- version

### IntegrationOperation

- connection
- type
- state
- progress
- result
- error
- idempotency key
- correlation ID

### AuditEvent

Append-only API behavior.

Fields:

- actor
- role
- tenant
- action
- entity
- entity ID
- before hash
- after hash
- safe diff
- reason
- correlation ID
- request ID
- idempotency key
- timestamp

---

# 10. PRISMA AND POSTGRESQL RULES

## 10.1 Tenant ownership

Every tenant-owned table must contain `tenantId`.

Every repository query must require tenant context.

Do not create unscoped helpers such as:

```ts
findById(id)
```

Prefer:

```ts
findByIdForTenant(tenantId, id)
```

## 10.2 Constraints

Implement:

- unique tenant key;
- unique membership per tenant/user;
- unique workload provider external ID per tenant;
- unique idempotency route/key per tenant;
- version fields;
- required state dependencies where possible;
- indexes on tenant/state/severity/provider/due date;
- foreign keys;
- no cascade deletion of audit.

## 10.3 Transactions

The following must be one transaction:

- finding state mutation;
- task side effects;
- verification;
- audit event;
- idempotency result;
- version increment.

## 10.4 PostgreSQL defense in depth

Investigate and document optional row-level security.

RLS is not a substitute for application authorization.

If RLS is implemented:

- set tenant context per transaction;
- test tenant escape;
- document connection-pool implications.

## 10.5 Migrations

Required:

```text
prisma migrate deploy
prisma migrate dev
prisma db seed
```

The repository must start from an empty PostgreSQL database.

---

# 11. AUTHENTICATION AND AUTHORIZATION

## 11.1 Demo users

Seed:

| User | Role | Tenant |
|---|---|---|
| Sofia Marin | Security Analyst | Northstar |
| Lukas Novak | Cloud Operations | Northstar |
| Petra Horak | Security Manager | Northstar |
| Martin Sykora | Read-only Auditor | Northstar |
| Alex Reed | Platform Admin | Northstar |
| Nina Carter | Security Analyst | BluePeak |

## 11.2 Required permission checks

Every protected mutation evaluates:

1. authenticated user;
2. active membership;
3. tenant context;
4. permission;
5. object tenant ownership;
6. assignment scope;
7. current state;
8. separation of duties;
9. version;
10. idempotency.

## 11.3 Cloud Operations object scope

Cloud Operations may read:

- assigned findings;
- findings belonging to assigned tasks;
- related workloads required to complete assigned work.

Cloud Operations must not receive a tenant-wide unrestricted finding list unless product requirements explicitly permit it.

## 11.4 Security Analyst

Can:

- triage;
- assign;
- define SLA;
- request changes;
- verify work by another actor;
- resolve verified findings.

Cannot:

- self-verify own critical remediation;
- bypass tenant scope;
- mutate audit.

## 11.5 Security Manager

Can:

- accept risk;
- configure assumptions;
- view analytics;
- set policy.

Risk acceptance requires:

- reason;
- business owner;
- compensating control;
- expiration.

## 11.6 Auditor

Read-only.

No mutation endpoint may rely only on hidden UI.

---

# 12. STATE MACHINES

## 12.1 Finding states

```text
OPEN
TRIAGED
ASSIGNED
IN_PROGRESS
READY_FOR_REVIEW
VERIFIED
RESOLVED
ACCEPTED_RISK
DEFERRED
FALSE_POSITIVE
```

## 12.2 Explicit command API

Do not expose a generic arbitrary transition endpoint.

Implement:

```text
POST /findings/:id/triage
POST /findings/:id/assign
POST /findings/:id/start-remediation
POST /findings/:id/request-review
POST /findings/:id/verify
POST /findings/:id/resolve
POST /findings/:id/accept-risk
POST /findings/:id/defer
POST /findings/:id/false-positive
POST /findings/:id/reopen
```

## 12.3 Assignment guard

Required:

- analyst permission;
- `TRIAGED` state;
- assignee or team;
- due date;
- SLA;
- remediation summary;
- task created atomically.

## 12.4 Request review guard

Required:

- Cloud Operations object access;
- task in progress;
- clean structured evidence;
- completed required checklist;
- remediation summary;
- reviewer separation rule.

## 12.5 Verification guard

Required:

- verification permission;
- ready-for-review state;
- verifier differs from remediation author for critical severity;
- result;
- notes.

## 12.6 Resolve guard

Required:

- analyst permission;
- verified state;
- passed verification;
- no blocking task;
- valid version.

## 12.7 Risk acceptance guard

Required:

- manager permission;
- reason;
- owner;
- control;
- expiration;
- approval audit.

Expired acceptance must be detectable by scheduled or request-time maintenance and returned to a review-required state.

---

# 13. IDEMPOTENCY AND CONCURRENCY

## 13.1 Version precondition

Every mutable versioned endpoint requires:

```text
If-Match
```

Responses:

- missing → `428 Precondition Required`;
- mismatch → `412 Precondition Failed`;
- valid → mutate and return new ETag.

## 13.2 Idempotency

Every non-trivial mutation requires:

```text
Idempotency-Key
```

Record:

- tenant;
- route;
- method;
- normalized request hash;
- response status;
- response body;
- expiration.

Rules:

- same key + same request → replay;
- same key + different request → `409 Conflict`;
- business mutation and idempotency result must be atomic;
- concurrent duplicate requests must not double-create side effects.

## 13.3 Conflict UI

The frontend must show:

- item changed by another session;
- current server version;
- reload option;
- compare/reapply option where practical;
- no silent overwrite.

---

# 14. API DESIGN

## 14.1 Error format

Use Problem Details.

```json
{
  "type": "https://cser.example/problems/precondition-required",
  "title": "Resource version is required",
  "status": 428,
  "code": "PRECONDITION_REQUIRED",
  "detail": "Send the current ETag in If-Match.",
  "correlationId": "cor_...",
  "fieldErrors": []
}
```

## 14.2 Required endpoint groups

### Session

```text
GET  /api/v1/me
GET  /api/v1/me/permissions
POST /api/v1/demo/switch-identity
POST /api/v1/logout
```

### Overview

```text
GET /api/v1/overview
GET /api/v1/overview/activity
GET /api/v1/overview/my-actions
```

### Workloads

```text
GET /api/v1/workloads
GET /api/v1/workloads/:id
GET /api/v1/workloads/:id/findings
```

### Findings

```text
GET  /api/v1/findings
GET  /api/v1/findings/:id
GET  /api/v1/findings/:id/timeline
POST /api/v1/findings/:id/triage
POST /api/v1/findings/:id/assign
POST /api/v1/findings/:id/start-remediation
POST /api/v1/findings/:id/request-review
POST /api/v1/findings/:id/verify
POST /api/v1/findings/:id/resolve
POST /api/v1/findings/:id/accept-risk
POST /api/v1/findings/:id/defer
POST /api/v1/findings/:id/false-positive
POST /api/v1/findings/:id/comments
```

### Enablement

```text
GET  /api/v1/enablement-plans
POST /api/v1/enablement-plans
GET  /api/v1/enablement-plans/:id
PATCH /api/v1/enablement-plans/:id
POST /api/v1/enablement-plans/:id/validate
POST /api/v1/enablement-plans/:id/preview
POST /api/v1/enablement-plans/:id/execute
GET  /api/v1/integration-operations/:id
POST /api/v1/integration-operations/:id/retry
```

### Integrations

```text
GET  /api/v1/integrations
GET  /api/v1/integrations/:id
GET  /api/v1/integrations/:id/health
POST /api/v1/integrations/:id/sync
```

### Analytics

```text
GET  /api/v1/analytics/impact
GET  /api/v1/analytics/impact/scenarios
POST /api/v1/analytics/impact/scenarios
POST /api/v1/analytics/impact/calculate
```

### Audit

```text
GET /api/v1/audit
GET /api/v1/audit/:id
```

### Saved views

```text
GET    /api/v1/saved-views
POST   /api/v1/saved-views
PATCH  /api/v1/saved-views/:id
DELETE /api/v1/saved-views/:id
```

### Health

```text
GET /health/live
GET /health/ready
GET /metrics
GET /api/docs
GET /api/openapi.json
```

---

# 15. FRONTEND ROUTES

```text
/
/about
/login
/app/overview
/app/workloads
/app/workloads/:workloadId
/app/findings
/app/findings/:findingId
/app/remediation
/app/enablement
/app/enablement/new
/app/enablement/:planId
/app/integrations
/app/permissions
/app/analytics/impact
/app/audit
/app/notifications
/app/settings/saved-views
```

Use React Router loaders only when they simplify the architecture. Server data remains under TanStack Query/RTK Query.

---

# 16. FRONTEND FEATURE REQUIREMENTS

## 16.1 Landing page

Preserve the premium hero direction.

Required:

- CSER independent identity;
- concise value proposition;
- live-looking but fictional UI preview;
- CTA to enter demo;
- architecture CTA;
- disclaimer;
- Azure/AWS/GCP mention;
- keyboard and mobile usability;
- no official ESET branding.

## 16.2 Login/demo launcher

Required:

- role cards;
- tenant;
- capability summary;
- disclaimer;
- secure session creation;
- loading and error states.

## 16.3 Overview

Metric cards must be semantic buttons or links.

Each card routes to a filtered list.

Required:

- protected workloads;
- unprotected workloads;
- critical findings;
- MTTR;
- integration health;
- top findings;
- provider distribution;
- risk trend;
- remediation impact;
- latest activity;
- freshness.

No metric may be hard-coded separately from backend data.

## 16.4 Workload Inventory

Required:

- server-side filtering;
- server-side sort;
- cursor or stable offset pagination;
- virtualized rows where measured;
- URL-persisted filters;
- saved views;
- provider/environment/protection/risk filters;
- accessible row actions;
- mobile compact view;
- loading, empty, stale and error states.

## 16.5 Findings Explorer

Required:

- severity;
- confidence;
- provider;
- workload;
- assignee;
- SLA;
- risk score;
- state;
- bulk assignment where authorized;
- detail drawer or full route;
- URL filters;
- keyboard navigation.

## 16.6 Finding Detail

Required sections:

- overview;
- current vs recommended configuration;
- evidence;
- remediation;
- verification;
- related;
- audit.

Show:

- version conflict status;
- assignment;
- SLA;
- actor;
- evidence notes;
- verifier;
- state timeline.

## 16.7 Remediation Board

Required views:

- my work;
- team work;
- ready for review;
- overdue;
- recently verified.

Use real command endpoints.

## 16.8 Enablement Wizard

Steps:

1. provider;
2. connection;
3. permission precheck;
4. eligible workloads;
5. targets;
6. exclusions;
7. auto-enable options;
8. preview;
9. execute;
10. operation status.

Required:

- draft persistence;
- step validation;
- resume;
- stale plan validation;
- idempotent execution;
- partial failure;
- retry;
- accessible progress.

## 16.9 Integration Health

Show:

- provider;
- state;
- last successful sync;
- freshness;
- item count;
- error class;
- retry;
- correlation ID;
- operation history.

## 16.10 Permissions Inspector

Show:

- role;
- effective permissions;
- tenant scope;
- missing permission explanation;
- why a button is disabled.

## 16.11 Business Impact

Preserve transparent formulas.

Required:

- conservative/base/growth;
- editable assumptions;
- save scenario;
- audit update;
- customer value;
- vendor value;
- formula explanation;
- disclaimer.

## 16.12 Audit Explorer

Required:

- server pagination;
- filters;
- detail route/drawer;
- actor;
- action;
- entity;
- correlation ID;
- safe diff;
- read-only behavior.

---

# 17. DESIGN SYSTEM AND ACCESSIBILITY

## 17.1 Visual principles

- premium dark enterprise interface;
- restrained blue/cyan accent;
- clear severity semantics;
- high data density without clutter;
- consistent 8-point spacing;
- subtle borders;
- limited glow;
- no decorative animation that harms performance.

## 17.2 Accessibility requirements

Target WCAG 2.2 AA where practical.

Required:

- semantic landmarks;
- skip link;
- heading hierarchy;
- native buttons and links;
- visible focus;
- no color-only meaning;
- dialog focus trap;
- focus return;
- keyboard tables;
- aria-live for async states;
- error summaries;
- reduced motion;
- chart text summaries;
- 200% zoom review;
- mobile wizard test.

## 17.3 No clickable generic containers

Prohibited:

```tsx
<div onClick={...}>
```

for primary interactions.

Use:

- button;
- anchor;
- table action button;
- accessible composite widget only when justified.

---

# 18. PROVIDER MOCK ADAPTERS

## 18.1 Contract

```ts
interface CloudProviderAdapter {
  listWorkloads(...): Promise<NormalizedWorkloadPage>;
  getWorkload(...): Promise<NormalizedWorkload>;
  listIndicators(...): Promise<ProviderIndicator[]>;
  getHealth(...): Promise<IntegrationHealth>;
  validatePermissions(...): Promise<PermissionValidationResult>;
  previewEnablement(...): Promise<EnablementPreview>;
  executeEnablement(...): Promise<IntegrationOperation>;
  getOperation(...): Promise<IntegrationOperation>;
  retryOperation(...): Promise<IntegrationOperation>;
}
```

## 18.2 Implementations

- AzureMockAdapter
- AwsMockAdapter
- GcpMockAdapter

## 18.3 Modes

- healthy;
- slow;
- stale;
- offline;
- auth error;
- rate limited;
- partial failure;
- retry success;
- retry failure.

Adapters must be deterministic for tests.

---

# 19. SEED DATA

## 19.1 Required volume

- 2 tenants;
- 6 users;
- 6 memberships;
- 9 connections;
- at least 10,000 workloads;
- at least 2,500 findings;
- domain-consistent tasks;
- evidence;
- verification;
- accepted risk;
- audit events;
- metric snapshots;
- enablement plans;
- operation history.

## 19.2 Invariant-first generation

Never assign random states without histories.

Generate through domain seed factories:

```text
createOpenFinding
createTriagedFinding
createAssignedFinding
createInProgressFinding
createReadyForReviewFinding
createVerifiedFinding
createResolvedFinding
createAcceptedRiskFinding
```

## 19.3 Required zero violations

- resolved without passed verification;
- ready for review without clean evidence;
- assigned without assignee;
- assigned without SLA;
- active workflow without task;
- accepted risk without structured record;
- cross-tenant foreign key;
- provider/connection mismatch.

---

# 20. ROI AND ANALYTICS

## 20.1 Truth boundary

All financial values remain illustrative.

Display:

> Illustrative scenario based on editable assumptions. It is not an ESET forecast, price, margin, churn estimate or guaranteed saving.

## 20.2 Formula tests

Test exact expected scenario outputs retained from V2 documentation.

## 20.3 Persistence

Manager/admin may save named assumption sets.

Every save records:

- actor;
- tenant;
- before;
- after;
- version;
- audit.

## 20.4 No breach-cost valuation

Do not calculate:

- avoided breach loss;
- guaranteed incident reduction;
- official ESET revenue.

---

# 21. SECURITY REQUIREMENTS

## 21.1 Mandatory controls

- secure environment validation;
- no default production secret;
- secure cookies;
- same-site policy;
- CSRF when cookie auth is used;
- strict CORS;
- origin validation;
- rate limiting;
- DTO whitelist;
- tenant repositories;
- object authorization;
- separation of duties;
- version precondition;
- idempotency;
- CSP;
- HSTS on production;
- Referrer-Policy;
- Permissions-Policy;
- sanitized output;
- safe CSV;
- no secrets committed;
- dependency scanning;
- secret scanning.

## 21.2 Security test requirements

- tenant escape;
- IDOR;
- role escalation;
- self-verification;
- missing If-Match;
- stale If-Match;
- idempotency mismatch;
- CSRF;
- origin rejection;
- malformed JSON;
- mass assignment;
- rate limit;
- audit mutation attempt;
- cross-tenant saved view;
- cross-tenant audit;
- unsafe comments/XSS.

---

# 22. TEST STRATEGY

## 22.1 Unit

- risk score;
- state guards;
- permission evaluator;
- ROI formulas;
- freshness;
- SLA;
- request hashing;
- safe diff;
- provider normalization.

## 22.2 Frontend component

- metric link;
- filter bar;
- table keyboard behavior;
- finding action panel;
- conflict dialog;
- wizard validation;
- permission explanation;
- stale banner;
- impact calculator;
- error boundary.

## 22.3 API integration

- auth;
- membership;
- tenant scope;
- list filters;
- assignment transaction;
- evidence;
- review;
- verification;
- resolution;
- risk acceptance;
- audit;
- saved views;
- enablement;
- idempotency;
- optimistic locking.

## 22.4 Browser E2E

Required:

### E2E-01 Golden remediation

Analyst → assign → Operations → evidence → review → second analyst → verify → resolve → audit.

### E2E-02 Tenant isolation

BluePeak user cannot read Northstar finding.

### E2E-03 Role denial

Cloud Operations cannot accept risk or resolve.

### E2E-04 Conflict

Two browser contexts edit the same finding; stale action receives conflict UI.

### E2E-05 Enablement

Wizard → partial failure → retry → success.

### E2E-06 URL filters

Filters survive reload and direct navigation.

### E2E-07 Mobile wizard

Complete the core wizard at a mobile viewport.

### E2E-08 Accessibility smoke

Run axe against:

- landing;
- login;
- overview;
- workload list;
- finding detail;
- wizard;
- analytics.

## 22.5 Manual accessibility

Document:

- keyboard golden path;
- focus order;
- focus return;
- zoom 200%;
- reduced motion;
- color-independent severity.

## 22.6 Performance

Measure:

- 10k workload list query;
- first page render;
- filter response;
- overview;
- audit query;
- bulk assignment;
- frontend bundle size.

---

# 23. DOCKER AND LOCAL DELIVERY

## 23.1 Docker Compose services

Mandatory:

```text
postgres
api
web
```

Optional profile:

```text
redis
minio
```

## 23.2 Clean startup

From a clean machine:

```bash
corepack enable
pnpm install --frozen-lockfile
docker compose up --build
pnpm prisma:migrate
pnpm prisma:seed
pnpm verify
```

Create a simpler documented command where possible.

## 23.3 Health checks

Docker must use:

- PostgreSQL health;
- API readiness;
- web health.

## 23.4 Verification requirement

The agent must actually execute:

```bash
docker build
docker compose up
```

when Docker is available.

If Docker is not available, the result must be labelled unverified and execution must not claim Docker readiness.

---

# 24. PUBLIC DEPLOYMENT PLAN

## 24.1 Recommended profile

### Web

Vercel:

- Vite build;
- SPA rewrites;
- environment variable for API base URL;
- no server persistence.

### API

Persistent container host:

- NestJS;
- HTTPS;
- configured CORS;
- production secrets;
- managed PostgreSQL.

### Database

Managed PostgreSQL.

## 24.2 Deployment verification

Verify:

- anonymous landing;
- demo sign-in;
- session across requests;
- CORS;
- secure cookie behavior;
- API health;
- database persistence after restart;
- reset strategy;
- rate limit;
- logs;
- no exposed secrets.

## 24.3 Vercel-only mode

Do not make Vercel-only deployment the primary target unless the API is intentionally adapted to a serverless runtime and tested with managed PostgreSQL.

---

# 25. CI/CD

## 25.1 Pull request workflow

Run:

1. install frozen lockfile;
2. lint;
3. typecheck;
4. unit;
5. component;
6. API integration;
7. Prisma migration check;
8. invariant check;
9. OpenAPI generation/drift;
10. build;
11. dependency audit;
12. secret scan;
13. Playwright;
14. axe;
15. artifact upload.

## 25.2 Main/release workflow

Add:

- Docker image build;
- container scan;
- deployment gate;
- smoke test;
- release ZIP artifact;
- test report artifact.

## 25.3 No fabricated pass

The final report must distinguish:

- passed;
- skipped;
- unavailable;
- failed;
- not implemented.

---

# 26. DOCUMENTATION

Required:

```text
README.md
docs/ARCHITECTURE.md
docs/ASSUMPTIONS.md
docs/API.md
docs/DATA_MODEL.md
docs/THREAT_MODEL.md
docs/DEMO_SCRIPT.md
docs/DEPLOYMENT.md
docs/RUNBOOK.md
docs/TEST_REPORT.md
docs/IMPLEMENTATION_REPORT.md
docs/MIGRATION_REPORT.md
docs/TRACEABILITY_MATRIX.md
docs/PRODUCTION_BOUNDARIES.md
docs/adr/*
```

## 26.1 README content

- product summary;
- disclaimer;
- screenshots;
- stack;
- quick start;
- demo identities;
- golden path;
- tests;
- architecture;
- deployment;
- limitations;
- repository map.

## 26.2 Demo script

Produce:

- 90-second recruiter flow;
- 7-minute product demo;
- 15-minute technical walkthrough.

---

# 27. PHASED EXECUTION PLAN

## Phase 0 — Repository intake and V2 freeze

Tasks:

- extract ZIP;
- run V2 verification;
- record V2 baseline;
- preserve screenshots;
- create migration matrix;
- create requirements traceability;
- identify assets to reuse.

Gate:

- V2 baseline is reproducible;
- all deviations are documented.

## Phase 1 — Monorepo and dependency foundation

Tasks:

- initialize pnpm workspace;
- create web/api/packages;
- configure TypeScript;
- add lint/format;
- add Vite;
- add NestJS;
- add Prisma;
- add Docker Compose;
- add environment validation;
- add CI skeleton.

Gate:

- clean install;
- web and API start;
- PostgreSQL connects;
- strict TypeScript clean.

## Phase 2 — Contracts, auth and tenancy

Tasks:

- shared contracts;
- Problem Details;
- session;
- demo identities;
- membership;
- tenant context;
- permission guards;
- tenant repositories;
- negative tests.

Gate:

- tenant escape tests pass;
- role switch is server-backed.

## Phase 3 — PostgreSQL schema and seed

Tasks:

- Prisma models;
- migrations;
- deterministic factories;
- 10k workloads;
- 2.5k findings;
- valid histories;
- invariant verifier.

Gate:

- empty migration succeeds;
- seed is deterministic;
- zero invariant violations.

## Phase 4 — React shell and design system

Tasks:

- landing;
- login;
- app shell;
- navigation;
- route layout;
- tokens;
- reusable components;
- accessibility primitives;
- responsive shell.

Gate:

- local React bundle;
- no unpkg;
- no `any` escape hatch;
- keyboard navigation works.

## Phase 5 — Overview and inventory

Tasks:

- overview API;
- workload list;
- filters;
- URL state;
- saved views;
- detail;
- provider health.

Gate:

- counts reconcile;
- 10k query target;
- browser filter test passes.

## Phase 6 — Findings and remediation

Tasks:

- findings API;
- detail;
- explicit commands;
- tasks;
- comments;
- evidence notes;
- verification;
- risk acceptance;
- audit.

Gate:

- golden API workflow;
- role-negative tests;
- conflict tests;
- audit transaction.

## Phase 7 — Enablement and operations

Tasks:

- wizard;
- draft;
- validation;
- preview;
- execute;
- operation state;
- partial failure;
- retry.

Gate:

- E2E partial failure/retry passes.

## Phase 8 — Analytics and audit

Tasks:

- impact scenarios;
- persistence;
- formula tests;
- audit filters;
- audit detail;
- notifications.

Gate:

- exact scenario outputs;
- audit pagination;
- disclaimer visible.

## Phase 9 — Browser and accessibility gate

Tasks:

- Playwright;
- axe;
- keyboard;
- mobile;
- conflict;
- screenshot QA;
- Firefox/WebKit smoke where available.

Gate:

- no serious/critical axe findings;
- golden flow passes;
- mobile wizard passes.

## Phase 10 — Docker and deployment

Tasks:

- build images;
- compose start;
- migration;
- seed;
- Vercel frontend;
- persistent API;
- PostgreSQL;
- production configuration;
- smoke.

Gate:

- stable public URL;
- persistence after restart;
- no default secrets;
- health green.

## Phase 11 — Final packaging

Tasks:

- final verify;
- documentation;
- screenshots;
- test report;
- implementation report;
- migration report;
- ZIP;
- SHA-256.

Gate:

- all V3 Definition of Done items classified.

---

# 28. PRIORITY BACKLOG

## P0 — mandatory before ESET presentation

- Vite React local bundle
- strict TypeScript
- React Router
- typed API
- NestJS
- PostgreSQL
- Prisma migrations
- tenant authorization
- explicit finding commands
- idempotency
- If-Match
- deterministic valid seed
- Playwright golden path
- axe
- Docker build verification
- public deployment
- truthful README

## P1 — strong candidate polish

- saved views
- notification read state
- advanced integration operation UI
- audit detail
- conflict reapply UX
- performance measurements
- multi-browser smoke
- screenshot regression
- customer-value scenario
- export

## P2 — production hardening extensions

- OIDC/Keycloak
- Redis/BullMQ
- MinIO/S3
- OpenTelemetry
- advanced rate limits
- RLS
- backup automation
- malware scan integration seam

---

# 29. MIGRATION FILE MAP

| V2 file | V3 destination/action |
|---|---|
| `src/app.tsx` | Use only as UX reference; split into feature modules |
| `src/globals.d.ts` | Delete; use real React typings |
| `server/index.js` | Replace with NestJS modules/controllers/services |
| `server/db.js` | Replace with Prisma/PostgreSQL repositories |
| `scripts/seed.js` | Port logic into typed domain seed factories |
| `scripts/verify-invariants.js` | Port to Prisma invariant verifier |
| `tests/app.test.js` | Split into unit, API integration and E2E |
| `public/*` | Preserve visual assets; rebuild through Vite |
| `data/cser.db` | Do not use as V3 source of truth |
| `docs/*` | Update and retain useful product content |
| `vendor/typescript/*` | Remove; install normal dependency |

---

# 30. ACCEPTANCE TEST MATRIX

| Requirement | Test |
|---|---|
| Local React bundle | offline/local build starts without CDN |
| Strict TS | `pnpm typecheck` |
| PostgreSQL | migration + seed + restart persistence |
| Tenant isolation | API and Playwright negative tests |
| Role rules | analyst/ops/manager/auditor tests |
| Assignment guard | missing owner/SLA/task fails |
| Review guard | missing evidence/checklist fails |
| Verification | self-verification fails |
| Resolve guard | unverified resolve fails |
| If-Match | missing 428, stale 412 |
| Idempotency | replay and mismatch tests |
| Audit | mutation plus audit in same transaction |
| Accessibility | axe + keyboard |
| Mobile | wizard E2E |
| Docker | compose build/start/health |
| Deployment | public smoke and persistence |
| ROI | exact scenario tests |
| Disclaimer | landing, login, app footer, README |

---

# 31. DEFINITION OF DONE

## 31.1 Architecture

- [ ] pnpm workspace
- [ ] React/Vite
- [ ] local dependencies
- [ ] strict TypeScript
- [ ] NestJS
- [ ] PostgreSQL
- [ ] Prisma
- [ ] generated OpenAPI
- [ ] typed client
- [ ] Docker Compose

## 31.2 Functional

- [ ] landing
- [ ] demo login
- [ ] roles
- [ ] tenants
- [ ] overview
- [ ] workloads
- [ ] findings
- [ ] remediation
- [ ] evidence note
- [ ] verification
- [ ] risk acceptance
- [ ] enablement
- [ ] integration health
- [ ] permissions
- [ ] analytics
- [ ] audit
- [ ] saved views
- [ ] notifications

## 31.3 Domain integrity

- [ ] zero seed invariant violation
- [ ] explicit commands
- [ ] required side effects
- [ ] task lifecycle
- [ ] separation of duties
- [ ] expiration behavior
- [ ] versioning
- [ ] idempotency

## 31.4 Security

- [ ] no default production secret
- [ ] secure cookie
- [ ] CORS
- [ ] CSRF
- [ ] origin validation
- [ ] rate limit
- [ ] tenant isolation
- [ ] object authorization
- [ ] DTO validation
- [ ] CSP
- [ ] dependency scan
- [ ] secret scan

## 31.5 Quality

- [ ] lint
- [ ] typecheck
- [ ] unit
- [ ] component
- [ ] integration
- [ ] contract
- [ ] E2E
- [ ] axe
- [ ] mobile
- [ ] build
- [ ] Docker
- [ ] public smoke

## 31.6 Delivery

- [ ] README
- [ ] architecture
- [ ] threat model
- [ ] demo script
- [ ] deployment guide
- [ ] runbook
- [ ] test report
- [ ] implementation report
- [ ] migration report
- [ ] traceability
- [ ] final ZIP
- [ ] SHA-256
- [ ] stable demo URL

---

# 32. STOP CONDITIONS

The execution agent must stop and report rather than silently downgrade when:

- npm/pnpm dependencies cannot be installed;
- PostgreSQL cannot be started or accessed;
- Vite cannot be built;
- Playwright cannot run and no CI alternative is available;
- Docker cannot be verified;
- public deployment cannot be completed;
- a required domain guard cannot be implemented;
- the user requests an unsafe real-cloud integration without credentials or authorization.

The report must state:

- blocker;
- affected requirement;
- attempted resolution;
- safe fallback;
- impact on readiness label.

---

# 33. FINAL READINESS LABEL

The agent may use:

> **Submission-ready ESET Candidate MVP**

only when:

- Vite/local React is implemented;
- strict TypeScript passes;
- PostgreSQL/Prisma is implemented;
- NestJS API is implemented;
- E2E golden path passes;
- axe gate passes;
- Docker is verified;
- public demo works;
- no critical/high known defect remains.

The agent may use:

> **Production-ready for real enterprise data**

only after additional real-world discovery, identity, security review, operational review, backup/restore and penetration testing.

V3 is a candidate engineering artifact, not a claim of real ESET production approval.

---

# 34. FINAL EXECUTION COMMAND

When the user later attaches this plan and the V2 ZIP, use:

> Enter execution mode and implement `CSER Workspace V3 — ESET Candidate Edition` according to `CSER_Workspace_V3_ESET_Candidate_Edition_Completion_Migration_Plan.md`. Treat the plan as authoritative. Preserve the accepted product UX and fictional-data disclaimer, but replace the V2 UMD/SQLite/manual-server architecture with a real Vite React strict-TypeScript frontend, NestJS typed REST API, PostgreSQL/Prisma persistence, explicit domain commands, Playwright browser tests, axe accessibility checks, verified Docker Compose and a deployment-ready configuration. Do not silently downgrade requirements. Run every available gate, fix defects, and deliver the final repository, ZIP, SHA-256, test evidence, migration report and honest readiness classification.

---

# 35. PLAN COMPLETION CHECK

This planning document is complete when it provides the execution agent with:

- current-state baseline;
- target architecture;
- exact migration decisions;
- feature scope;
- data model;
- API plan;
- authorization rules;
- state machines;
- UI requirements;
- test strategy;
- deployment strategy;
- phased backlog;
- release gates;
- Definition of Done;
- truth boundaries;
- final execution command.

No V3 application code is generated during Plan Mode.
