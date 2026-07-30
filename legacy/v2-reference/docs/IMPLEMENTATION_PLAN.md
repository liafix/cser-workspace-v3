# Cloud Security Exposure & Remediation Workspace
## Production-MVP Implementation Plan for an AI Development Agent

**Short name:** CSER Workspace  
**Document type:** Authoritative implementation blueprint and execution specification  
**Version:** 1.0  
**Date:** 29 July 2026  
**Prepared for:** Dušan Cabala / DCZ WebAgentúra  
**Intended use:** Input for an AI coding agent that must design, implement, test, package, document, and prepare a production-grade candidate MVP  
**Primary source documents:**
1. `Cloud_Security_Exposure_Remediation_Workspace_Technicka_Dokumentacia.docx`
2. `Cloud_Security_Exposure_Remediation_Workspace_ROI_Business_Case.docx`

---

# 0. EXECUTION CONTRACT

## 0.1 Agent role

Act simultaneously as:

- Principal Full-Stack Architect
- Senior React and TypeScript Engineer
- Senior NestJS Backend Engineer
- Product Security Engineer
- Cloud Security UX Designer
- QA Automation Lead
- DevOps and Observability Engineer
- Technical Writer

The objective is not to generate a visual mock-up, static dashboard, superficial prototype, or partially connected interface. The objective is to produce the strongest practical implementation of the Cloud Security Exposure & Remediation Workspace that can credibly be described as a **production-MVP candidate**.

## 0.2 Mission

Build a complete, functional, independently branded, multi-tenant cloud-security operations workspace that:

1. Normalizes fictional AWS, Azure, and GCP workloads.
2. Shows protection coverage and cloud-security findings.
3. Helps analysts prioritize findings.
4. Assigns remediation responsibility and SLA.
5. Records work, comments, evidence, and review.
6. Enforces independent verification for critical findings.
7. Simulates cloud-protection enablement through a reliable wizard.
8. Exposes provider integration health, freshness, retries, and degraded states.
9. Implements RBAC, tenant isolation, object-level authorization, audit, idempotency, and optimistic locking.
10. Calculates transparent product-adoption and business-impact scenarios.
11. Demonstrates professional React, TypeScript, API, testing, accessibility, security, and delivery practices relevant to an enterprise frontend role.

## 0.3 Non-negotiable truth boundary

The application is an independent candidate project.

It must never:

- claim to be an ESET product;
- use internal ESET APIs, internal product screenshots, proprietary code, private schemas, or confidential workflows;
- copy the visual design of ESET PROTECT;
- use the ESET logo as the product logo;
- claim access to real ESET customers, revenue, churn, support, pricing, or product telemetry;
- scan real cloud infrastructure;
- present fictional findings as real security incidents;
- implement a malware engine, endpoint protection engine, exploit scanner, or autonomous threat response;
- promise prevention of incidents or guaranteed financial savings.

The following disclaimer must remain visible in the login/demo launcher, application footer, About page, README, and documentation:

> Independent candidate concept built from public information and fictional data. It is not an official ESET product and does not use internal ESET systems or APIs.

## 0.4 No-shortcut rule

The agent must not silently simplify the approved architecture.

The following substitutions are prohibited without an explicit documented blocker and user approval:

- PHP or server-rendered templates instead of React/TypeScript;
- JSON files, localStorage, or in-memory arrays as the authoritative database;
- a single untyped endpoint instead of explicit REST contracts;
- frontend-only role hiding instead of server-side authorization;
- hard-coded fake metrics without a documented formula and source inputs;
- non-persistent buttons or workflows;
- static screenshots presented as UI;
- “production-ready” claims without passing the required gates;
- bypassing PostgreSQL, Prisma migrations, tenant-scoped repositories, audit, idempotency, or automated tests;
- replacing real application state transitions with simple text changes;
- using mocked success responses for actions that are expected to persist.

A safe mock-provider layer is required because real cloud and ESET integrations are intentionally out of scope. Mocking external boundaries is allowed. Mocking the internal business workflow is not.

## 0.5 Working behavior for the AI agent

The agent must:

1. Read this document fully before changing files.
2. Create a traceability checklist mapping every requirement to implementation and tests.
3. Inspect the repository before making architectural decisions.
4. Preserve working code and avoid destructive rewrites unless justified.
5. Implement vertical slices rather than disconnected pages.
6. Keep the application runnable after every major phase.
7. Run lint, typecheck, unit, integration, E2E, accessibility, and build checks.
8. Fix discovered defects rather than merely listing them.
9. Never fabricate a successful test result or deployment.
10. Record intentional deviations in `docs/IMPLEMENTATION_REPORT.md`.
11. Stop and clearly explain any blocker that makes a mandatory Definition of Done item impossible.
12. Package the final repository only after verification.

---

# 1. PRODUCT DEFINITION

## 1.1 One-sentence explanation

CSER Workspace is a multi-tenant operations console that shows which fictional cloud workloads are insufficiently protected, prioritizes the associated security findings, assigns remediation work, records evidence, requires verification, and measures protection coverage, operational performance, and modelled business impact.

## 1.2 Core problem

Enterprise security teams frequently work across:

- multiple cloud providers;
- cloud inventories;
- security findings;
- email;
- spreadsheets;
- ticket systems;
- support conversations;
- audit exports;
- separate onboarding and permissions flows.

The workspace creates one coherent flow:

```text
Discover → Prioritize → Assign → Remediate → Verify → Learn
```

## 1.3 Product value

### For an enterprise customer

- less manual triage;
- clear ownership;
- explicit SLAs;
- repeatable remediation;
- evidence and independent verification;
- faster reporting;
- better understanding of integration and permission failures;
- improved coverage visibility.

### For a product vendor

- faster onboarding;
- higher completion of protection activation;
- clearer self-service troubleshooting;
- fewer repeat support contacts;
- stronger product adoption signals;
- better renewal proof;
- qualified expansion signals based on coverage gaps;
- stronger enterprise demonstrations.

## 1.4 MVP outcome

The completed MVP must let a reviewer perform this real persisted journey:

1. Log in as a Security Analyst.
2. Open Security Overview.
3. Click the unprotected-workloads metric.
4. Filter Azure production workloads with critical risk.
5. Open a critical finding.
6. Review normalized evidence and remediation guidance.
7. Assign the finding to Cloud Operations.
8. Set an SLA and create a remediation task.
9. Switch to Cloud Operations.
10. Start work, add a comment, upload or generate safe demo evidence, and request review.
11. Switch to a different Security Analyst.
12. Verify the remediation.
13. Resolve the finding.
14. Inspect the immutable audit history.
15. Open the CWP Enablement Wizard.
16. Select a provider, scope, targets, exclusions, and automatic-enable behavior.
17. Run permission precheck.
18. Preview the plan.
19. Execute a simulated asynchronous operation.
20. Observe progress, partial failure, retry, and final outcome.
21. Open Business Impact & Adoption.
22. Change model assumptions and see transparent recalculation.
23. Confirm that all values are explicitly labelled as illustrative.

---

# 2. SOURCE HIERARCHY AND DECISION RULES

## 2.1 Source precedence

When information conflicts, use this order:

1. Legal, ethical, and truth-boundary requirements in the source documents.
2. This implementation plan.
3. The technical documentation.
4. The ROI and Business Case.
5. Official documentation of the selected libraries and platforms.
6. Explicit user instructions issued after this plan.
7. Agent inference.

Do not use third-party tutorials as the source of truth for security-sensitive implementation.

## 2.2 Assumption policy

Every assumption must be classified as one of:

- `SOURCE_DERIVED`
- `IMPLEMENTATION_DECISION`
- `DEMO_ONLY`
- `REQUIRES_REAL_DISCOVERY`

Store the assumption register in:

```text
docs/ASSUMPTIONS.md
```

Every assumption must include:

- ID;
- description;
- category;
- reason;
- impact;
- validation method;
- whether it blocks the candidate demo;
- whether it blocks a real production rollout.

---

# 3. SCOPE

## 3.1 Must-have MVP modules

1. Authentication and demo identity
2. Tenant context and memberships
3. Security Overview
4. Workload Inventory
5. Workload Detail
6. Findings Explorer
7. Finding Detail
8. Remediation workflow
9. Evidence and verification
10. CWP Enablement Wizard
11. Permissions Inspector
12. Integration Health
13. Audit Explorer
14. Business Impact & Adoption
15. Saved views
16. Notification centre
17. User preferences
18. Demo data reset
19. Operational health endpoint
20. Documentation and test suite

## 3.2 Should-have modules

- CSV export;
- PDF-style printable report generated from HTML;
- bulk assignment;
- bulk defer;
- bulk risk acceptance with strict permissions;
- comments and mentions;
- provider-specific indicator details;
- compact mobile read-only views;
- keyboard command palette;
- visual regression snapshots;
- simple email notification adapter that logs messages in demo mode.

## 3.3 Deferred modules

- real AWS/Azure/GCP API credentials;
- real cloud scans;
- real ESET API integration;
- autonomous remediation;
- production billing;
- SIEM ingestion;
- incident response automation;
- GraphQL production API;
- Kubernetes production deployment;
- advanced machine learning;
- real malware analysis;
- customer-facing marketplace;
- full enterprise policy editor.

## 3.4 Explicit non-goals

- building a clone of ESET PROTECT;
- rebuilding a full CSPM or CNAPP platform;
- replacing cloud-provider security consoles;
- ingesting real secrets;
- providing security guarantees;
- valuing avoided breaches;
- making official statements about ESET revenue or retention.

## 3.5 Scope-cut order

If time is constrained, cut in this order:

1. command palette;
2. PDF export;
3. mentions;
4. advanced saved-view sharing;
5. secondary charts;
6. optional notification channels;
7. non-golden-path bulk actions.

Never cut:

- tenant isolation;
- object authorization;
- state-machine guards;
- audit;
- idempotency;
- critical-finding verification;
- persisted workflow;
- error states;
- core E2E tests;
- disclaimer;
- source-of-truth database.

---

# 4. SUCCESS CRITERIA

## 4.1 Candidate success

The project must visibly prove:

- strong React and TypeScript architecture;
- ability to work with data-heavy enterprise UI;
- proper API integration;
- clear component boundaries;
- complex form and wizard implementation;
- robust state and cache management;
- error, loading, empty, stale, and degraded states;
- accessibility;
- responsive behavior;
- testing discipline;
- backend and database understanding;
- security awareness;
- product and business reasoning.

## 4.2 Production-MVP qualification

The label “production-MVP candidate” is permitted only when all of the following are true:

- no critical or high-severity known application defect remains;
- all required workflows persist to PostgreSQL;
- server-side authorization is enforced;
- tenant escape tests pass;
- critical transition guards pass;
- the OpenAPI contract is generated and validated;
- the database can be migrated from empty state;
- seed and reset scripts are deterministic;
- Docker Compose starts the system;
- CI-equivalent checks pass locally;
- E2E golden path passes;
- accessibility checks have no serious or critical automated finding on golden-path screens;
- dependency and secret scans do not reveal unresolved critical findings;
- README and runbooks are complete;
- the application clearly identifies demo limitations.

---

# 5. TECHNICAL ARCHITECTURE

## 5.1 Architectural style

Use a modular monorepo with:

- a React SPA;
- a NestJS REST API;
- a PostgreSQL database;
- Redis for queues and rate-limit coordination;
- S3-compatible object storage for evidence;
- provider mock adapters;
- an optional separate worker process using the same backend codebase.

The domain remains a modular monolith. Do not split domain modules into networked microservices unless a concrete deployment requirement appears.

## 5.2 Required stack

### Runtime and package management

- Active Node.js LTS available in the execution environment
- `pnpm`
- workspace lockfile committed
- reproducible scripts

### Frontend

- React 19
- TypeScript strict
- Vite
- React Router
- Redux Toolkit
- RTK Query
- React Hook Form
- Zod
- TanStack Table
- TanStack Virtual
- Radix-based or shadcn-style accessible primitives
- Recharts
- date-fns
- Lucide or equivalent consistent icon library
- CSS variables and Tailwind CSS or an equally maintainable token-based styling layer

### Backend

- NestJS
- TypeScript strict
- REST
- OpenAPI/Swagger
- class-validator or Zod-based request validation with one consistent strategy
- Prisma
- PostgreSQL
- BullMQ
- Redis
- structured logging
- correlation IDs

### Authentication

Preferred local implementation:

- Keycloak container with realm import;
- OIDC Authorization Code flow with PKCE;
- JWT validation in the API using JWKS;
- seeded demo users and roles.

Permitted fallback:

- a clearly labelled `AUTH_MODE=demo` adapter using secure, signed, HTTP-only cookies;
- demo mode must be impossible to enable accidentally in a production environment;
- the API must still enforce roles, tenant, and object permissions.

### Storage

- MinIO in Docker Compose;
- signed upload/download URL abstraction;
- hash metadata;
- file-type and size restrictions;
- safe demo malware-scan seam.

### Observability

- OpenTelemetry instrumentation seam;
- structured JSON logs;
- request ID and correlation ID;
- `/health/live`;
- `/health/ready`;
- `/metrics` or equivalent;
- Sentry-compatible error boundary seam;
- Prometheus-compatible backend metrics where feasible.

### Testing

- Vitest
- React Testing Library
- MSW
- Supertest or Nest testing tools
- Testcontainers when environment permits
- Playwright
- axe integration
- k6 scripts
- optional visual regression snapshots

## 5.3 Repository layout

Use this baseline:

```text
cser-workspace/
├─ apps/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  ├─ routes/
│  │  │  ├─ features/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ store/
│  │  │  ├─ services/
│  │  │  ├─ styles/
│  │  │  ├─ test/
│  │  │  └─ main.tsx
│  │  ├─ public/
│  │  └─ vite.config.ts
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ common/
│  │  │  ├─ config/
│  │  │  ├─ auth/
│  │  │  ├─ tenants/
│  │  │  ├─ users/
│  │  │  ├─ integrations/
│  │  │  ├─ workloads/
│  │  │  ├─ findings/
│  │  │  ├─ remediation/
│  │  │  ├─ enablement/
│  │  │  ├─ permissions/
│  │  │  ├─ audit/
│  │  │  ├─ analytics/
│  │  │  ├─ notifications/
│  │  │  ├─ jobs/
│  │  │  └─ main.ts
│  │  └─ test/
│  └─ worker/
│     └─ src/
├─ packages/
│  ├─ contracts/
│  ├─ domain/
│  ├─ ui/
│  ├─ config/
│  ├─ provider-adapters/
│  ├─ provider-mocks/
│  ├─ testing/
│  └─ eslint-config/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed/
├─ infra/
│  ├─ docker/
│  ├─ keycloak/
│  ├─ nginx/
│  ├─ prometheus/
│  └─ grafana/
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ ASSUMPTIONS.md
│  ├─ THREAT_MODEL.md
│  ├─ API.md
│  ├─ DATA_MODEL.md
│  ├─ DEMO_SCRIPT.md
│  ├─ DEPLOYMENT.md
│  ├─ RUNBOOK.md
│  ├─ IMPLEMENTATION_REPORT.md
│  ├─ TEST_REPORT.md
│  ├─ TRACEABILITY_MATRIX.md
│  └─ adr/
├─ tests/
│  ├─ e2e/
│  ├─ performance/
│  └─ security/
├─ .github/workflows/
├─ docker-compose.yml
├─ .env.example
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md
```

## 5.4 Dependency rules

1. React components may call only typed frontend services/hooks.
2. Frontend code may not import Prisma, provider SDKs, or backend modules.
3. Controllers perform transport concerns only.
4. Domain rules belong in domain services or pure domain functions.
5. Repositories enforce tenant context by construction.
6. Provider adapters map external formats to normalized domain contracts.
7. Analytics reads from read models and snapshots.
8. Transactional workflow tables remain the source of truth.
9. The UI must never make authorization decisions that are not repeated by the API.
10. Shared contracts must not leak database implementation details.

---

# 6. DOMAIN GLOSSARY

| Term | Meaning |
|---|---|
| Tenant | Fictional customer organization isolated from all other organizations |
| Cloud connection | Configured provider scope for AWS, Azure, or GCP |
| Workload | Normalized VM or supported cloud compute asset |
| Protection coverage | Ratio of eligible workloads with active protection |
| Finding | A fictional security exposure or configuration issue |
| Risk score | Transparent prioritization score; not a real vendor detection score |
| Remediation task | Assigned work required to correct a finding |
| Evidence | Safe file or structured note proving a demo remediation action |
| Verification | Independent review confirming remediation |
| Enablement plan | Wizard-generated plan to simulate enabling protection |
| Provider adapter | Interface isolating provider-specific data from the domain |
| Freshness | Age and timestamp of the latest provider projection |
| SLA | Due date and escalation policy for a finding |
| Risk acceptance | Manager-approved decision to tolerate a risk temporarily |
| Saved view | Persisted filter/sort/column configuration |
| Audit event | Append-only record of sensitive activity |
| Expansion signal | Modelled product-adoption indicator, not a confirmed sale |

---

# 7. USER ROLES AND AUTHORIZATION

## 7.1 Roles

### Security Analyst

Can:

- read tenant workloads and findings;
- triage;
- set severity within allowed rules;
- assign findings;
- set SLA;
- create remediation tasks;
- request changes;
- verify work not performed by the same user;
- resolve verified findings;
- export permitted data.

Cannot:

- manage tenant identity settings;
- approve own remediation evidence for a critical finding;
- access other tenants.

### Cloud Operations

Can:

- read assigned workloads and findings;
- start remediation;
- add comments;
- upload evidence;
- request review;
- view provider health relevant to assigned work.

Cannot:

- verify their own critical work;
- accept risk;
- manage roles;
- access unrelated tenants.

### Security Manager

Can:

- view all tenant metrics;
- configure SLA policies;
- approve risk acceptance;
- set expiration;
- reopen expired risk acceptances;
- view business-impact assumptions;
- export reports.

Cannot:

- bypass audit;
- access other tenants unless explicitly assigned.

### Read-only Auditor

Can:

- read findings;
- read evidence metadata;
- read verification;
- read audit;
- export audit-approved reports.

Cannot:

- mutate any business object;
- upload;
- sync providers;
- change assumptions.

### Platform Admin

Can:

- configure tenant;
- manage memberships;
- configure cloud connections;
- trigger sync;
- inspect permission requirements;
- view operational diagnostics.

Cannot:

- silently alter completed remediation history;
- delete audit;
- verify findings solely because of the admin role.

## 7.2 Permissions

Implement fine-grained permissions such as:

```text
workload:read
finding:read
finding:triage
finding:assign
finding:transition
finding:accept-risk
finding:verify
evidence:create
evidence:read
integration:read
integration:manage
integration:sync
enablement:plan
enablement:execute
analytics:read
analytics:assumptions:write
audit:read
tenant:manage
membership:manage
saved-view:manage
export:create
```

## 7.3 Authorization evaluation

Every protected request must evaluate:

1. authenticated identity;
2. active membership;
3. tenant context;
4. required permission;
5. object tenant ownership;
6. object-level rule;
7. state-machine rule;
8. separation-of-duties rule;
9. optimistic version;
10. idempotency status.

Fail closed. Return a structured error. Never rely on UI visibility.

---

# 8. INFORMATION ARCHITECTURE AND ROUTES

## 8.1 Public routes

```text
/login
/about
/privacy-demo
```

## 8.2 Authenticated routes

```text
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
/app/settings/profile
/app/settings/views
/app/admin/tenant
/app/admin/members
```

## 8.3 App shell

Desktop:

- left navigation rail;
- global tenant switcher only for explicitly multi-tenant demo admin;
- global search;
- notification centre;
- user menu;
- environment/demo label;
- content header;
- route-level breadcrumbs;
- main content;
- optional right contextual drawer.

Tablet:

- collapsible sidebar;
- retained table controls;
- drawers instead of fixed secondary panels.

Mobile:

- read-optimized;
- bottom or drawer navigation;
- tables converted to compact virtualized rows;
- complex bulk actions limited but not silently removed;
- wizard remains fully usable;
- audit and analytics may use stacked layouts.

---

# 9. DESIGN SYSTEM

## 9.1 Brand direction

Create an independent product identity:

**Name:** CSER Workspace  
**Optional visual mark:** abstract shield/grid/cloud intersection  
**Tone:** enterprise, calm, precise, technical  
**Do not:** imitate ESET branding, colors, logo, typography, or screenshots.

Suggested palette:

- deep navy application chrome;
- neutral near-white work surface;
- cyan or blue primary action;
- teal success;
- amber warning;
- red critical;
- violet informational accent;
- strong neutral text contrast.

## 9.2 Tokens

Define tokens for:

- surfaces;
- text;
- border;
- focus;
- semantic severity;
- semantic workflow status;
- provider accents;
- spacing;
- radius;
- shadow;
- typography;
- motion duration;
- z-index.

## 9.3 Component families

Required reusable components:

- `AppShell`
- `PageHeader`
- `MetricCard`
- `SeverityBadge`
- `StatusBadge`
- `ProviderBadge`
- `FreshnessIndicator`
- `DataGrid`
- `FilterBar`
- `SavedViewSelector`
- `BulkActionBar`
- `Timeline`
- `AuditTimeline`
- `PermissionGate`
- `PermissionExplanation`
- `ErrorState`
- `EmptyState`
- `StaleDataBanner`
- `DegradedModeBanner`
- `Skeleton`
- `ConfirmDialog`
- `ReasonDialog`
- `EvidenceUploader`
- `StepWizard`
- `OperationProgress`
- `RiskScoreExplanation`
- `SlaIndicator`
- `RoleSwitcher` for demo only
- `ModelAssumptionField`
- `ScenarioComparison`
- `GlobalSearchDialog`

## 9.4 Interaction requirements

- full keyboard navigation;
- visible focus;
- no color-only meaning;
- destructive actions require confirmation;
- risk acceptance requires reason and expiration;
- disabled controls explain missing permission;
- loading does not block unrelated screen regions;
- background refresh does not destroy user selection;
- stale data remains readable with a freshness warning;
- toasts supplement, not replace, persistent error feedback.

---

# 10. SCREEN-BY-SCREEN UX SPECIFICATION

## 10.1 Login and Demo Launcher

Purpose:

- authenticate;
- explain the independent concept;
- select one of the seeded demo identities when demo mode is enabled.

Must show:

- disclaimer;
- demo credentials;
- role explanation;
- tenant name;
- “Sign in with local OIDC”;
- optional role cards for demo mode;
- link to architecture and privacy-demo explanation.

Acceptance:

- cannot enter app without authenticated session;
- session survives reload;
- logout invalidates local session;
- role is derived from membership, not arbitrary client state;
- demo role switch creates a new authenticated demo session and audit event.

## 10.2 Security Overview

Widgets:

- eligible workloads;
- protected workloads;
- unprotected workloads;
- protection coverage;
- critical findings;
- high findings;
- overdue SLA;
- mean time to remediate;
- provider integration health;
- risk trend;
- coverage trend;
- recent critical activity;
- “needs my action” queue.

Interactions:

- each metric opens the relevant filtered route;
- URL filters are explicit;
- stale metrics show capture time;
- widget failures degrade independently;
- role-specific call to action.

Acceptance:

- metrics reconcile with seed data;
- click-through filters match counts;
- no hard-coded chart values;
- loading and partial failure states exist.

## 10.3 Workload Inventory

Columns:

- workload name;
- provider;
- external scope alias;
- environment;
- region;
- operating system;
- eligibility;
- protection status;
- finding count;
- highest severity;
- risk score;
- owner;
- last sync;
- tags.

Filters:

- search;
- provider;
- environment;
- region;
- protection status;
- eligibility;
- severity;
- risk range;
- owner;
- tag;
- connection health;
- freshness.

Features:

- server-side pagination;
- server-side sorting;
- virtualized rows;
- selectable columns;
- URL persistence;
- saved views;
- bulk selection across current page only unless explicit “select all matching” confirmation;
- export;
- open detail.

Acceptance:

- 10,000+ deterministic rows;
- filters survive reload;
- query cancellation prevents stale response overwrite;
- bulk result lists success, skipped, and failed objects;
- tenant A never receives tenant B rows.

## 10.4 Workload Detail

Sections:

- normalized identity;
- provider information;
- protection status;
- coverage eligibility;
- tags and ownership;
- related findings;
- provider indicators;
- sync history;
- activity timeline;
- safe raw-provider fixture viewer for admin only;
- linked enablement plan.

Actions:

- assign owner;
- create saved filter from this context;
- create enablement plan if eligible and unprotected;
- navigate to related finding.

## 10.5 Findings Explorer

Columns:

- finding ID;
- title;
- severity;
- confidence;
- provider;
- workload;
- environment;
- status;
- assignee;
- SLA;
- risk score;
- last update.

Features:

- filters and saved views;
- grouping by rule or workload;
- deduplicated group indicator;
- bulk assign;
- bulk defer;
- bulk risk acceptance for manager;
- export;
- quick detail drawer;
- full detail route;
- keyboard row navigation.

Acceptance:

- bulk action authorization is checked item by item;
- unpermitted items are skipped and reported;
- critical items cannot be bulk-resolved;
- query state remains in URL.

## 10.6 Finding Detail

Header:

- ID;
- title;
- severity;
- status;
- risk score;
- SLA;
- provider;
- workload;
- assignee.

Tabs or sections:

1. Overview
2. Evidence
3. Remediation
4. Verification
5. Related
6. Audit

Overview:

- description;
- fictional rule key;
- business/security context;
- normalized evidence;
- current configuration;
- recommended configuration;
- affected assets;
- risk score explanation;
- source freshness.

Remediation:

- owner;
- due date;
- checklist;
- comments;
- task state;
- attachments;
- request-review action.

Verification:

- verifier;
- verification method;
- result;
- notes;
- separation-of-duties explanation;
- return-to-work action;
- resolve action.

Acceptance:

- all transitions use version and idempotency key;
- critical resolve requires successful verification;
- evidence author cannot be sole verifier for critical severity;
- each mutation creates audit.

## 10.7 Remediation Board

Views:

- My work;
- Team work;
- Ready for review;
- Overdue;
- Recently verified.

Use:

- list or constrained Kanban;
- statuses remain domain statuses;
- drag-and-drop is optional and must call valid transitions;
- no visual movement before backend confirmation unless rollback is implemented.

Actions:

- start;
- comment;
- attach evidence;
- request review;
- reopen;
- verify if authorized.

## 10.8 CWP Enablement Wizard

Steps:

1. Provider
2. Cloud connection and scope
3. Permission precheck
4. Eligible workloads
5. Targets
6. Exclusions
7. Auto-enable rules
8. Preview
9. Execute
10. Operation status

Requirements:

- draft autosave;
- step validation;
- resume;
- back navigation;
- no confirmed data loss;
- permission explanation;
- affected-workload count;
- warnings for stale integration data;
- idempotent execution;
- async progress;
- deterministic demo outcomes;
- partial failure;
- retry failed subset;
- cancellation only before irreversible demo stage.

Demo failure modes:

- Azure permission missing;
- AWS rate limited;
- GCP stale data;
- one workload unsupported;
- partial operation failure;
- duplicate execution request.

## 10.9 Permissions Inspector

Show:

- current role;
- effective permissions;
- tenant scope;
- object scope;
- cloud connection permission requirements;
- missing permissions;
- why an action is disabled;
- resolution guidance;
- recent permission failures.

Admin functionality:

- manage fictional memberships;
- assign predefined roles;
- preview effective permission changes;
- audit every change.

## 10.10 Integration Health

Per connection:

- provider;
- alias;
- status;
- last successful sync;
- last attempted sync;
- freshness;
- object count;
- error category;
- retry eligibility;
- circuit-breaker state;
- recent operations;
- correlation ID.

Statuses:

- HEALTHY
- DEGRADED
- OFFLINE
- AUTH_ERROR
- RATE_LIMITED
- SYNCING
- STALE
- DISABLED

Actions:

- trigger sync;
- retry;
- view troubleshooting;
- disable;
- re-enable;
- inspect fixture in demo admin mode.

## 10.11 Business Impact & Adoption

Sections:

- coverage activation;
- wizard funnel;
- time-to-enable;
- permission self-resolution;
- triage time;
- MTTR;
- SLA breach rate;
- verification rate;
- support-deflection scenario;
- onboarding-saving scenario;
- expansion contribution;
- retention contribution;
- customer capacity value;
- payback.

Requirements:

- all model inputs editable only by manager/admin;
- scenario presets;
- conservative/base/growth comparison;
- formulas visible;
- assumptions visible;
- no hidden “magic” calculation;
- values labelled illustrative;
- export includes assumptions and disclaimer;
- model changes create audit.

## 10.12 Audit Explorer

Filters:

- actor;
- tenant;
- action;
- entity;
- entity ID;
- time range;
- correlation ID;
- outcome.

Record detail:

- actor;
- role;
- tenant;
- timestamp;
- action;
- entity;
- before hash;
- after hash;
- safe diff;
- request/correlation ID;
- IP or demo placeholder;
- user agent;
- reason;
- idempotency key reference.

Audit is read-only.

---

# 11. GOLDEN-PATH SEED SCENARIO

Use deterministic identifiers.

## 11.1 Primary tenant

```text
Tenant: Northstar Industrial Systems
Tenant key: northstar
```

## 11.2 Secondary isolation tenant

```text
Tenant: BluePeak Logistics
Tenant key: bluepeak
```

## 11.3 Demo users

| User | Role | Tenant |
|---|---|---|
| Sofia Marin | Security Analyst | Northstar |
| Lukas Novak | Cloud Operations | Northstar |
| Petra Horak | Security Manager | Northstar |
| Martin Sykora | Read-only Auditor | Northstar |
| Alex Reed | Platform Admin | Northstar |
| Nina Carter | Security Analyst | BluePeak |

All names and organizations are fictional.

## 11.4 Primary workload

```text
ID: WLD-AZ-PROD-0007
Name: azure-prod-api-07
Provider: AZURE
Environment: PRODUCTION
Region: westeurope
Eligibility: ELIGIBLE
Protection status: UNPROTECTED
Risk score: 94
Owner: Platform API Team
```

## 11.5 Primary finding

```text
ID: FND-CRIT-0042
Title: Public management endpoint on production workload
Severity: CRITICAL
Confidence: HIGH
Status: OPEN
Workload: WLD-AZ-PROD-0007
Rule key: DEMO.PUBLIC_MANAGEMENT_ENDPOINT
Source: FICTIONAL_PROVIDER_INDICATOR
```

## 11.6 Golden path transitions

```text
OPEN
→ TRIAGED
→ ASSIGNED
→ IN_PROGRESS
→ READY_FOR_REVIEW
→ VERIFIED
→ RESOLVED
```

Every transition must create:

- domain event;
- audit event;
- updated version;
- timestamp;
- actor;
- correlation ID.

---

# 12. STATE MACHINES AND BUSINESS RULES

## 12.1 Finding lifecycle

### OPEN → TRIAGED

Required:

- analyst permission;
- reviewed title and context;
- severity confirmed;
- risk explanation available.

### TRIAGED → ASSIGNED

Required:

- owner;
- due date;
- SLA policy;
- remediation task.

### ASSIGNED → IN_PROGRESS

Required:

- assigned Cloud Operations actor;
- active task.

### IN_PROGRESS → READY_FOR_REVIEW

Required:

- evidence or explicit structured evidence note;
- remediation summary;
- completed required checklist;
- reviewer not identical to evidence author for critical severity.

### READY_FOR_REVIEW → VERIFIED

Required:

- analyst verification permission;
- verifier differs from remediation author for critical severity;
- verification result `PASSED`;
- verification notes.

### READY_FOR_REVIEW → IN_PROGRESS

Required:

- review result `CHANGES_REQUIRED`;
- reason.

### VERIFIED → RESOLVED

Required:

- final metrics captured;
- no unresolved blocking subtask;
- audit transaction.

### Side states

#### ACCEPTED_RISK

Required:

- manager permission;
- reason;
- business owner;
- expiration;
- compensating control;
- review date.

Expired acceptance automatically returns to `TRIAGED` or a dedicated `RISK_REVIEW_REQUIRED` state.

#### FALSE_POSITIVE

Required:

- analyst permission;
- reason;
- evidence;
- optional expiry for re-evaluation.

#### DEFERRED

Required:

- reason;
- defer-until date;
- owner;
- approval depending on severity.

## 12.2 Remediation task states

```text
TODO → IN_PROGRESS → REVIEW_REQUESTED → DONE
TODO → CANCELLED
IN_PROGRESS → BLOCKED
BLOCKED → IN_PROGRESS
REVIEW_REQUESTED → IN_PROGRESS
```

## 12.3 Enablement plan states

```text
DRAFT
→ VALIDATING
→ READY
→ QUEUED
→ EXECUTING
→ SUCCEEDED
```

Alternative terminal states:

```text
PARTIALLY_SUCCEEDED
FAILED
CANCELLED
```

Rules:

- execute only from `READY`;
- repeat execute with same idempotency key returns same operation;
- stale plan requires revalidation;
- failed subset can be retried;
- successful targets cannot be duplicated;
- permissions are checked at preview and execute time.

## 12.4 Evidence states

```text
PENDING_UPLOAD
→ QUARANTINED
→ CLEAN
```

Alternatives:

```text
REJECTED_TYPE
REJECTED_SIZE
REJECTED_SCAN
DELETED_BY_RETENTION
```

Demo scan behavior must be deterministic and clearly labelled.

## 12.5 Export states

```text
QUEUED → RUNNING → COMPLETED
QUEUED → FAILED
RUNNING → FAILED
```

## 12.6 Integration operation states

```text
PENDING → RUNNING → SUCCEEDED
PENDING → CANCELLED
RUNNING → PARTIAL
RUNNING → FAILED
```

---

# 13. RISK SCORE

## 13.1 Purpose

The score is for transparent demo prioritization only. It must not be presented as an official security-vendor algorithm.

## 13.2 Inputs

- severity base;
- confidence;
- production exposure;
- internet exposure;
- protection status;
- asset criticality;
- finding age;
- SLA breach;
- compensating control;
- duplicate count.

## 13.3 Example weighting

```text
severity:
  CRITICAL = 45
  HIGH = 32
  MEDIUM = 18
  LOW = 8

confidence:
  HIGH = 12
  MEDIUM = 6
  LOW = 2

production = +10
internet_exposed = +12
unprotected = +10
critical_asset = +8
overdue = +8
compensating_control = -10
```

Clamp to `0..100`.

## 13.4 Requirements

- pure tested function;
- explanation array returned with score;
- no opaque AI;
- score snapshot stored when a finding is triaged;
- later changes create a new score version.

---

# 14. DATA MODEL

Implement at least the following entities.

## 14.1 Identity and tenancy

### Tenant

- `id`
- `key`
- `name`
- `status`
- `settingsJson`
- `retentionPolicyJson`
- `createdAt`
- `updatedAt`

### User

- `id`
- `externalSubject`
- `email`
- `displayName`
- `status`
- `createdAt`
- `updatedAt`

### Membership

- `id`
- `tenantId`
- `userId`
- `role`
- `status`
- `createdAt`
- `updatedAt`

Unique: `(tenantId, userId)`

## 14.2 Cloud integrations

### CloudConnection

- `id`
- `tenantId`
- `provider`
- `alias`
- `externalScopeId`
- `status`
- `freshnessStatus`
- `lastSyncAt`
- `lastSuccessfulSyncAt`
- `circuitState`
- `version`
- timestamps

### IntegrationOperation

- `id`
- `tenantId`
- `connectionId`
- `type`
- `status`
- `idempotencyKey`
- `correlationId`
- `progress`
- `resultJson`
- `errorCode`
- timestamps

## 14.3 Inventory

### Workload

- `id`
- `tenantId`
- `connectionId`
- `provider`
- `externalId`
- `name`
- `scopeAlias`
- `environment`
- `region`
- `osFamily`
- `osVersion`
- `eligibility`
- `protectionStatus`
- `assetCriticality`
- `internetExposure`
- `ownerUserId`
- `ownerTeam`
- `tagsJson`
- `providerPayloadHash`
- `lastSeenAt`
- `version`
- timestamps

Unique: `(tenantId, provider, externalId)`

### WorkloadMetric

- `id`
- `tenantId`
- `workloadId`
- `metricKey`
- `value`
- `capturedAt`

## 14.4 Findings

### Finding

- `id`
- `tenantId`
- `workloadId`
- `ruleKey`
- `title`
- `description`
- `severity`
- `confidence`
- `status`
- `riskScore`
- `riskExplanationJson`
- `assigneeUserId`
- `assigneeTeam`
- `slaPolicyId`
- `dueAt`
- `firstSeenAt`
- `lastSeenAt`
- `resolvedAt`
- `acceptedUntil`
- `version`
- timestamps

### FindingIndicator

- `id`
- `tenantId`
- `findingId`
- `type`
- `normalizedValue`
- `source`
- `capturedAt`

### FindingComment

- `id`
- `tenantId`
- `findingId`
- `authorUserId`
- `body`
- timestamps

## 14.5 Remediation and evidence

### RemediationTask

- `id`
- `tenantId`
- `findingId`
- `ownerUserId`
- `ownerTeam`
- `state`
- `summary`
- `checklistJson`
- `dueAt`
- `version`
- timestamps

### Evidence

- `id`
- `tenantId`
- `findingId`
- `taskId`
- `uploadedByUserId`
- `type`
- `status`
- `objectKey`
- `originalName`
- `mimeType`
- `size`
- `sha256`
- `structuredNote`
- timestamps

### Verification

- `id`
- `tenantId`
- `findingId`
- `verifierUserId`
- `method`
- `result`
- `notes`
- `verifiedAt`

## 14.6 Enablement

### EnablementPlan

- `id`
- `tenantId`
- `connectionId`
- `createdByUserId`
- `state`
- `scopeJson`
- `targetsJson`
- `exclusionsJson`
- `autoEnableNew`
- `autoEnableExisting`
- `previewJson`
- `validatedAt`
- `version`
- timestamps

### EnablementExecution

- `id`
- `tenantId`
- `planId`
- `operationId`
- `idempotencyKey`
- `status`
- `resultJson`
- timestamps

## 14.7 Policy and permissions

### SlaPolicy

- `id`
- `tenantId`
- `name`
- `severity`
- `responseMinutes`
- `resolutionMinutes`
- `active`

### RiskAcceptance

- `id`
- `tenantId`
- `findingId`
- `approvedByUserId`
- `reason`
- `businessOwner`
- `compensatingControl`
- `expiresAt`
- timestamps

## 14.8 Views, analytics, and audit

### SavedView

- `id`
- `tenantId`
- `userId`
- `entityType`
- `name`
- `queryJson`
- `isDefault`
- timestamps

### MetricSnapshot

- `id`
- `tenantId`
- `scope`
- `metricKey`
- `valueDecimal`
- `dimensionsJson`
- `capturedAt`

### ImpactAssumptionSet

- `id`
- `tenantId`
- `name`
- `scenario`
- `valuesJson`
- `createdByUserId`
- `version`
- timestamps

### AuditEvent

- `id`
- `tenantId`
- `actorUserId`
- `actorRole`
- `action`
- `entityType`
- `entityId`
- `beforeHash`
- `afterHash`
- `safeDiffJson`
- `reason`
- `correlationId`
- `requestId`
- `idempotencyKey`
- `ipAddress`
- `userAgent`
- `createdAt`

No update and no ordinary delete endpoint.

### IdempotencyRecord

- `id`
- `tenantId`
- `key`
- `route`
- `requestHash`
- `responseStatus`
- `responseBodyJson`
- `expiresAt`
- timestamps

## 14.9 Database constraints

- tenant ID on every tenant-owned table;
- foreign keys include tenant-consistent ownership where practical;
- unique idempotency key by tenant and route;
- optimistic locking through `version`;
- audit and workflow mutation in the same transaction;
- no cascade delete of audit;
- indexes for tenant, status, severity, provider, owner, due date, updated time;
- cursor pagination for large tables;
- soft deletion only where required;
- retention job documented and tested.

---

# 15. API CONTRACT

All API responses must use a consistent envelope or a clearly documented direct-resource pattern. Errors must follow RFC 7807-style problem details or an equivalent structured format.

## 15.1 Common error fields

```json
{
  "type": "https://cser.local/problems/forbidden",
  "title": "Action is not permitted",
  "status": 403,
  "code": "PERMISSION_DENIED",
  "detail": "The current role cannot verify this critical finding.",
  "correlationId": "cor_...",
  "fieldErrors": []
}
```

## 15.2 Required headers

For mutations:

```text
Idempotency-Key
If-Match
X-Correlation-ID
```

API returns:

```text
ETag
X-Correlation-ID
```

## 15.3 Identity and session

```text
GET  /api/me
GET  /api/me/permissions
POST /api/demo/switch-identity
POST /api/logout
```

`demo/switch-identity` exists only in explicit demo mode.

## 15.4 Overview

```text
GET /api/overview
GET /api/overview/activity
GET /api/overview/my-actions
```

## 15.5 Workloads

```text
GET  /api/workloads
GET  /api/workloads/:id
GET  /api/workloads/:id/findings
GET  /api/workloads/:id/indicators
POST /api/workloads/export
```

Query parameters:

- cursor;
- limit;
- search;
- provider;
- environment;
- region;
- protectionStatus;
- eligibility;
- severity;
- riskMin;
- riskMax;
- owner;
- tag;
- freshness;
- sort.

## 15.6 Findings

```text
GET  /api/findings
GET  /api/findings/:id
GET  /api/findings/:id/timeline
POST /api/findings/:id/triage
POST /api/findings/:id/assign
POST /api/findings/:id/transition
POST /api/findings/:id/comments
POST /api/findings/:id/evidence/upload-intent
POST /api/findings/:id/evidence/complete
POST /api/findings/:id/verify
POST /api/findings/:id/accept-risk
POST /api/findings/:id/defer
POST /api/findings/:id/false-positive
POST /api/findings/bulk/assign
POST /api/findings/bulk/defer
POST /api/findings/export
```

## 15.7 Remediation

```text
GET  /api/remediation/tasks
GET  /api/remediation/tasks/:id
POST /api/remediation/tasks/:id/start
POST /api/remediation/tasks/:id/block
POST /api/remediation/tasks/:id/request-review
POST /api/remediation/tasks/:id/reopen
```

## 15.8 Enablement

```text
GET  /api/enablement-plans
POST /api/enablement-plans
GET  /api/enablement-plans/:id
PATCH /api/enablement-plans/:id
POST /api/enablement-plans/:id/validate
POST /api/enablement-plans/:id/preview
POST /api/enablement-plans/:id/execute
GET  /api/enablement-operations/:id
POST /api/enablement-operations/:id/retry-failed
POST /api/enablement-operations/:id/cancel
```

## 15.9 Integrations

```text
GET  /api/integrations
GET  /api/integrations/:id
GET  /api/integrations/:id/health
GET  /api/integrations/:id/operations
POST /api/integrations/:id/sync
POST /api/integrations/:id/retry
POST /api/integrations/:id/disable
POST /api/integrations/:id/enable
```

## 15.10 Permissions and administration

```text
GET  /api/permissions/effective
GET  /api/permissions/explanations
GET  /api/admin/members
POST /api/admin/members
PATCH /api/admin/members/:id
GET  /api/admin/roles
```

## 15.11 Analytics and ROI

```text
GET  /api/analytics/coverage
GET  /api/analytics/remediation
GET  /api/analytics/adoption
GET  /api/analytics/impact
GET  /api/analytics/impact/scenarios
POST /api/analytics/impact/scenarios
POST /api/analytics/impact/calculate
POST /api/analytics/impact/export
```

## 15.12 Audit

```text
GET /api/audit
GET /api/audit/:id
```

No mutation endpoints.

---

# 16. PROVIDER ADAPTERS

## 16.1 Contract

```text
listWorkloads(scope, cursor, filters)
  → NormalizedWorkloadPage

getWorkload(externalId)
  → NormalizedWorkload

listProviderIndicators(workloadExternalId)
  → ProviderIndicator[]

getIntegrationHealth(connectionId)
  → IntegrationHealth

validatePermissions(connectionId, requestedCapabilities)
  → PermissionValidationResult

planProtectionEnablement(targets, exclusions, options)
  → EnablementPreview

executeProtectionEnablement(plan, idempotencyKey)
  → AsyncOperation

getOperationStatus(operationId)
  → OperationStatus

retryOperation(operationId, failedTargets)
  → AsyncOperation
```

## 16.2 Mock providers

Create:

- `AzureMockAdapter`
- `AwsMockAdapter`
- `GcpMockAdapter`

Each must map distinct fixture shapes into the same normalized model.

## 16.3 Required deterministic modes

Per connection configure:

- healthy;
- slow;
- timeout;
- auth error;
- rate limited;
- stale;
- partial data;
- malformed provider record;
- mapping warning;
- command partial failure;
- operation retry success;
- operation retry failure.

The UI must expose these states honestly.

## 16.4 No direct provider access

No provider credentials, SDK calls, or outbound cloud mutations are required for the MVP.

---

# 17. SEED DATA

## 17.1 Volume

Minimum:

- 2 tenants;
- 6 users;
- 6 memberships;
- 9 cloud connections;
- 10,000+ workloads;
- 2,500+ findings;
- 300 remediation tasks;
- 80 verifications;
- 120 evidence records;
- 5 enablement plans;
- 20 integration operations;
- 90 days of metric snapshots;
- 500+ audit events.

## 17.2 Distribution

Providers:

- Azure 40%;
- AWS 35%;
- GCP 25%.

Environments:

- production 35%;
- staging 25%;
- development 30%;
- sandbox 10%.

Protection:

- protected 72%;
- unprotected 18%;
- pending 5%;
- unsupported 5%.

Finding severity:

- critical 3%;
- high 17%;
- medium 45%;
- low 35%.

## 17.3 Determinism

Use a fixed seed such as:

```text
CSER_SEED=20260729
```

The reset command must recreate identical IDs and golden-path records.

## 17.4 Safe finding catalogue

Examples:

- public management endpoint;
- storage encryption disabled;
- excessive IAM permission;
- protection agent not active;
- unsupported operating system;
- security logging disabled;
- stale workload inventory;
- missing owner;
- exposed test credential marker;
- unsupported region policy;
- overly broad network source;
- backup policy absent.

All are fictional configuration examples.

---

# 18. BUSINESS IMPACT AND ROI IMPLEMENTATION

## 18.1 Mandatory disclaimer

Every analytics screen and export must state:

> Illustrative scenario based on editable assumptions. It is not an ESET forecast, price, margin, churn estimate, or guaranteed saving.

## 18.2 Vendor-value formulas

### Support saving

```text
support_saving =
  active_organizations
  × support_contacts_per_org_per_year
  × deflection_rate
  × average_contact_hours
  × loaded_support_hour_value
```

Default shared assumptions:

```text
average_contact_hours = 0.75
loaded_support_hour_value = 40 €
```

### Onboarding saving

```text
onboarding_saving =
  onboardings_per_year
  × saved_hours_per_onboarding
  × technical_hour_value
```

Default:

```text
technical_hour_value = 55 €
```

### Expansion contribution

```text
expansion_contribution =
  qualified_expansion_events
  × contribution_per_expansion
```

### Retention contribution

```text
retention_contribution =
  retained_customers
  × annual_contribution_per_retained_customer
```

### Total vendor gross value

```text
vendor_gross_value =
  support_saving
  + onboarding_saving
  + expansion_contribution
  + retention_contribution
```

### Net annual value

```text
net_annual_value =
  vendor_gross_value
  - annual_operating_cost
```

### Simple payback months

```text
payback_months =
  initial_investment
  / (net_annual_value / 12)
```

Return `null` when net annual value is zero or negative.

## 18.3 Vendor scenarios

### Conservative

```text
active_organizations = 50
support_contacts_per_org_per_year = 12
deflection_rate = 0.10
onboardings_per_year = 15
saved_hours_per_onboarding = 4
qualified_expansion_events = 2
contribution_per_expansion = 3000
retained_customers = 0
annual_contribution_per_retained_customer = 8000
```

Expected:

```text
support_saving = 1,800 €
onboarding_saving = 3,300 €
expansion_contribution = 6,000 €
retention_contribution = 0 €
vendor_gross_value = 11,100 €
```

### Base

```text
active_organizations = 150
support_contacts_per_org_per_year = 18
deflection_rate = 0.20
onboardings_per_year = 40
saved_hours_per_onboarding = 8
qualified_expansion_events = 8
contribution_per_expansion = 5000
retained_customers = 2
annual_contribution_per_retained_customer = 15000
```

Expected:

```text
support_saving = 16,200 €
onboarding_saving = 17,600 €
expansion_contribution = 40,000 €
retention_contribution = 30,000 €
vendor_gross_value = 103,800 €
```

### Growth

```text
active_organizations = 400
support_contacts_per_org_per_year = 24
deflection_rate = 0.30
onboardings_per_year = 100
saved_hours_per_onboarding = 12
qualified_expansion_events = 25
contribution_per_expansion = 7000
retained_customers = 6
annual_contribution_per_retained_customer = 20000
```

Expected:

```text
support_saving = 86,400 €
onboarding_saving = 66,000 €
expansion_contribution = 175,000 €
retention_contribution = 120,000 €
vendor_gross_value = 447,400 €
```

Investment sensitivity defaults:

```text
initial_investment = 120,000 €
annual_operating_cost = 36,000 €
```

Expected base payback:

```text
21.2 months
```

Expected growth payback:

```text
3.5 months
```

## 18.4 Customer-value formulas

### Remediation hours saved

```text
remediation_hours_saved =
  findings_per_month
  × hours_per_finding
  × 12
  × savings_rate
```

### Remediation capacity value

```text
remediation_capacity_value =
  remediation_hours_saved
  × loaded_security_hour_value
```

### Customer total direct value

```text
customer_direct_value =
  remediation_capacity_value
  + operational_saving
  + reporting_saving
```

Scenario calibration:

#### Conservative

```text
findings_per_month = 120
hours_per_finding = 0.40
savings_rate = 0.30
loaded_security_hour_value = 50
operational_saving = 720
reporting_saving = 1350
```

Expected:

```text
remediation_hours_saved ≈ 173
remediation_capacity_value = 8,640 €
customer_direct_value = 10,710 €
```

#### Base

```text
findings_per_month = 300
hours_per_finding = 0.50
savings_rate = 0.40
loaded_security_hour_value = 60
operational_saving = 2700
reporting_saving = 5400
```

Expected:

```text
remediation_hours_saved = 720
remediation_capacity_value = 43,200 €
customer_direct_value = 51,300 €
```

#### Growth

```text
findings_per_month = 500
hours_per_finding = 0.80
savings_rate = 0.50
loaded_security_hour_value = 70
operational_saving = 9000
reporting_saving = 13500
```

Expected:

```text
remediation_hours_saved = 2,400
remediation_capacity_value = 168,000 €
customer_direct_value = 190,500 €
```

## 18.5 Product telemetry mapping

| Product function | Leading metric |
|---|---|
| Enablement wizard | completion rate, time-to-enable, failed step |
| Coverage-gap insight | eligible/unprotected count, activation rate |
| Permissions Inspector | self-resolved permission failures |
| Findings prioritization | time to triage, open critical findings |
| Remediation workflow | MTTR, SLA breaches, verification rate |
| Audit/reporting | report preparation time, export adoption |

---

# 19. SECURITY ARCHITECTURE

## 19.1 Threat model

Document at minimum:

- tenant data exposure;
- IDOR;
- privilege escalation;
- broken separation of duties;
- forged audit;
- evidence upload abuse;
- stored XSS in comments or evidence notes;
- CSRF where cookie auth is used;
- replayed mutation;
- duplicate async command;
- stale object overwrite;
- brute force;
- token leakage;
- secret leakage;
- SSRF through provider configuration;
- log injection;
- formula or CSV injection;
- mass export abuse;
- denial of service through expensive queries.

## 19.2 Required controls

- OIDC/JWT validation;
- HTTP-only secure cookies when applicable;
- same-site policy;
- CSRF defense for cookie-based mutations;
- strict CORS;
- DTO validation;
- output encoding;
- CSP;
- rate limits;
- query limits;
- cursor pagination;
- tenant-scoped repositories;
- object authorization;
- deny by default;
- idempotency;
- optimistic locking;
- append-only audit;
- signed uploads;
- file size and MIME allowlist;
- safe file-name handling;
- antivirus seam;
- no active HTML/SVG uploads;
- CSV formula neutralization;
- secrets only in environment/secret store;
- dependency scanning;
- SAST;
- secret scanning;
- container scanning.

## 19.3 Tenant isolation

Mandatory negative tests:

1. Tenant A cannot list Tenant B workloads.
2. Tenant A cannot access Tenant B finding by guessed ID.
3. Tenant A cannot mutate Tenant B finding.
4. Tenant A cannot fetch Tenant B evidence URL.
5. Tenant A cannot view Tenant B audit.
6. Tenant A cannot reuse Tenant B idempotency record.
7. Cross-tenant saved-view IDs fail.
8. Admin membership is still tenant-scoped unless explicitly global.

## 19.4 Audit guarantees

Every sensitive mutation records:

- actor;
- role;
- tenant;
- action;
- object;
- previous hash;
- new hash;
- safe diff;
- reason;
- timestamp;
- request ID;
- correlation ID;
- idempotency key.

Audit insert must share the same transaction as the state change.

---

# 20. RESILIENCE AND ERROR HANDLING

## 20.1 Required UI states

For every data surface:

- initial loading;
- background loading;
- empty;
- no filter result;
- partial data;
- stale data;
- degraded provider;
- forbidden;
- not found;
- conflict;
- validation error;
- server error;
- offline;
- retrying.

## 20.2 Required API semantics

- `400` invalid request;
- `401` unauthenticated;
- `403` unauthorized;
- `404` not found within tenant scope;
- `409` state conflict or idempotency conflict;
- `412` optimistic lock failed;
- `422` business-rule validation;
- `429` rate limit;
- `503` provider or dependency unavailable.

## 20.3 Circuit breaker

Provider adapters must support:

- closed;
- open;
- half-open.

UI must show:

- current state;
- last successful response;
- next retry;
- cached data freshness;
- manual retry eligibility.

## 20.4 Retry rules

- automatic retry only for safe reads and explicitly retryable async operations;
- exponential backoff with jitter;
- mutation retry requires idempotency key;
- no unlimited retry;
- dead-letter state after threshold;
- manual recovery documented.

---

# 21. PERFORMANCE

## 21.1 Budgets

- overview P95 under 800 ms excluding provider synchronization;
- filtered list P95 under 1.5 s for 10,000+ seeded workloads;
- provider read under 3 s or cached data shown;
- first meaningful app shell under 2.5 s on a typical broadband desktop;
- no main-thread freeze longer than 200 ms during bulk selection;
- no unbounded list rendering;
- no N+1 provider calls;
- no unpaginated audit export in browser memory.

## 21.2 Techniques

- cursor pagination;
- database indexes;
- select only required fields;
- virtualized tables;
- debounced search;
- request cancellation;
- normalized cache;
- memoized cell renderers where measured;
- prefetch next page;
- background metric snapshots;
- batch provider operations;
- async exports;
- cache freshness metadata.

---

# 22. ACCESSIBILITY

Target WCAG 2.2 AA where practical.

Mandatory:

- semantic landmarks;
- heading hierarchy;
- keyboard operation;
- visible focus;
- correct labels;
- accessible dialogs;
- focus trap;
- focus return;
- screen-reader status for async operations;
- table semantics or accessible virtualized-grid pattern;
- no color-only status;
- reduced-motion support;
- readable contrast;
- error summary in forms;
- wizard step announcement;
- charts with text summaries.

Automated axe checks do not replace manual keyboard review.

---

# 23. TEST PLAN

## 23.1 Unit tests

Test:

- risk score;
- state transitions;
- guard rules;
- permission evaluator;
- separation of duties;
- SLA calculation;
- ROI formulas;
- payback null behavior;
- provider normalization;
- freshness calculation;
- idempotency request hashing;
- safe audit diff;
- CSV neutralization.

## 23.2 Component tests

Test:

- FilterBar;
- virtualized DataGrid;
- saved views;
- PermissionGate;
- ReasonDialog;
- EvidenceUploader;
- FindingDetail;
- Wizard steps;
- error states;
- stale data banner;
- degraded provider card;
- ROI assumption fields;
- scenario comparison.

## 23.3 API integration tests

Test:

- migrations;
- tenant repository scope;
- object authorization;
- finding assignment;
- valid transitions;
- invalid transitions;
- optimistic locking;
- duplicate idempotency;
- evidence metadata;
- verification separation;
- risk acceptance;
- audit transaction;
- enablement execution;
- job retry;
- export job.

## 23.4 Contract tests

Validate:

- generated OpenAPI;
- frontend client generation;
- provider adapter contract;
- problem-details schema;
- pagination schema;
- webhook/event schema if added.

## 23.5 E2E tests

Required Playwright scenarios:

### E2E-01 Golden path

Overview → workload → finding → assign → Cloud Operations → evidence → review → analyst verification → resolve → audit.

### E2E-02 Enablement

Wizard → permission precheck → targets → exclusions → preview → execute → partial failure → retry → success.

### E2E-03 Permission denial

Cloud Operations tries to accept risk and receives a UI explanation plus API 403.

### E2E-04 Tenant isolation

BluePeak user cannot open Northstar finding URL.

### E2E-05 Stale/degraded data

Azure connection becomes degraded. Cached workloads remain visible with freshness.

### E2E-06 URL persistence

Filters survive reload and shared URL.

### E2E-07 Optimistic conflict

Two sessions edit the same finding; stale session receives conflict and recovery UI.

### E2E-08 Mobile wizard

Complete core enablement wizard on mobile viewport.

## 23.6 Security tests

- IDOR;
- tenant escape;
- privilege escalation;
- CSRF;
- stored XSS;
- unsafe upload;
- CSV injection;
- replay;
- missing idempotency;
- stale version;
- mass-assignment DTO fields;
- rate limit;
- audit immutability.

## 23.7 Performance tests

- list 10k workloads;
- filter common indexes;
- bulk assign 100 items;
- audit query;
- overview concurrent widgets;
- provider slow mode;
- async operation polling.

## 23.8 Accessibility tests

Automated on:

- login;
- overview;
- workloads;
- finding detail;
- wizard;
- analytics.

Manual:

- keyboard-only golden path;
- screen-reader spot check;
- zoom 200%;
- reduced motion.

## 23.9 Traceability

Create `docs/TRACEABILITY_MATRIX.md` with columns:

- requirement ID;
- source section;
- implementation file;
- test ID;
- status;
- evidence.

---

# 24. DEVOPS AND DELIVERY

## 24.1 Local environment

`docker compose up --build` must start:

- PostgreSQL;
- Redis;
- MinIO;
- Keycloak;
- API;
- worker;
- web;
- optional Prometheus/Grafana.

## 24.2 Required scripts

```text
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm test:a11y
pnpm test:performance
pnpm build
pnpm db:migrate
pnpm db:seed
pnpm db:reset
pnpm openapi:generate
pnpm verify
```

`pnpm verify` must run the release gate.

## 24.3 CI pipeline

Stages:

1. install with frozen lockfile;
2. lint;
3. typecheck;
4. unit;
5. component;
6. integration;
7. OpenAPI drift check;
8. build;
9. dependency audit;
10. secret scan;
11. container build;
12. image scan;
13. E2E against composed environment;
14. upload test artifacts.

## 24.4 Deployment

Produce:

- container images;
- environment documentation;
- reverse-proxy config;
- migration command;
- backup/restore notes;
- readiness/liveness probes;
- demo deployment instructions.

A public preview is desirable only when the environment supports safe deployment. Do not claim deployment if it was not performed.

## 24.5 Environment variables

Document in `.env.example`.

Never include real secrets.

Categories:

- database;
- Redis;
- OIDC;
- object storage;
- CORS;
- app URLs;
- logging;
- telemetry;
- demo mode;
- seed;
- upload limits;
- rate limits.

---

# 25. OBSERVABILITY

## 25.1 Logs

Structured fields:

- timestamp;
- level;
- service;
- environment;
- tenant ID;
- user ID;
- request ID;
- correlation ID;
- route;
- status;
- duration;
- error code.

Do not log:

- tokens;
- passwords;
- raw evidence;
- private signed URLs;
- full provider fixtures when sensitive.

## 25.2 Metrics

Backend:

- request count;
- latency;
- error rate;
- DB latency;
- queue depth;
- job success/failure;
- circuit state;
- provider operation duration;
- audit insert failure;
- authentication failure;
- authorization denial.

Product:

- wizard completion;
- time-to-enable;
- permission self-resolution;
- triage duration;
- MTTR;
- SLA breach;
- verification rate;
- protected workload activation.

## 25.3 Tracing

Trace:

- frontend request;
- API;
- repository;
- job;
- provider adapter;
- audit write.

---

# 26. IMPLEMENTATION PHASES

## Phase 0 — Discovery and repository audit

Deliver:

- source summary;
- assumption register;
- requirement IDs;
- architecture decision list;
- scope confirmation;
- dependency/version matrix;
- risk register.

Gate:

- no unresolved contradiction affecting the MVP.

## Phase 1 — Foundation

Tasks:

- monorepo;
- TypeScript strict;
- lint and formatting;
- shared config;
- Docker Compose;
- PostgreSQL;
- Prisma;
- Redis;
- MinIO;
- Keycloak/demo auth adapter;
- app shell;
- design tokens;
- API error model;
- correlation IDs;
- health endpoints;
- CI skeleton.

Gate:

- clean build;
- authenticated shell;
- first migration;
- seed user;
- health green.

## Phase 2 — Tenancy and authorization

Tasks:

- Tenant/User/Membership;
- role permissions;
- tenant context;
- repositories;
- object authorization;
- admin member management;
- tenant isolation tests.

Gate:

- negative tenant tests pass.

## Phase 3 — Provider adapters and inventory

Tasks:

- normalized contracts;
- three mock adapters;
- deterministic data generator;
- sync jobs;
- integration health;
- 10k workloads;
- workload API;
- inventory table;
- detail;
- URL filters;
- saved views;
- stale/degraded states.

Gate:

- inventory performance target;
- adapter contract tests;
- filter persistence.

## Phase 4 — Findings

Tasks:

- finding model;
- risk score;
- explorer;
- detail;
- timeline;
- comments;
- assignment;
- SLA;
- audit;
- grouping;
- bulk assign/defer.

Gate:

- finding state tests;
- tenant tests;
- overview reconciliation.

## Phase 5 — Remediation and verification

Tasks:

- tasks;
- evidence upload seam;
- scan seam;
- review;
- verification;
- separation of duties;
- resolve;
- risk acceptance;
- deferral;
- false positive;
- notifications.

Gate:

- critical finding cannot close without independent verification;
- golden path through remediation passes.

## Phase 6 — Enablement Wizard

Tasks:

- drafts;
- autosave;
- permission precheck;
- target/exclusion selection;
- preview;
- execution;
- async progress;
- partial failure;
- retry;
- audit;
- operation health.

Gate:

- E2E enablement passes;
- duplicate execution prevented.

## Phase 7 — Analytics and ROI

Tasks:

- metric snapshots;
- coverage;
- MTTR;
- SLA;
- wizard funnel;
- ROI formulas;
- scenario presets;
- editable assumptions;
- export;
- disclaimer;
- tests against expected values.

Gate:

- expected conservative/base/growth values match source model.

## Phase 8 — Security and reliability hardening

Tasks:

- threat model;
- CSRF/CORS;
- CSP;
- rate limiting;
- upload restrictions;
- CSV safety;
- optimistic conflicts;
- idempotency;
- circuit breaker;
- dead-letter;
- secret scan;
- dependency scan.

Gate:

- required security negative tests pass.

## Phase 9 — UX, accessibility, and responsive polish

Tasks:

- route error boundaries;
- widget error boundaries;
- empty states;
- loading;
- stale/degraded;
- keyboard;
- focus;
- mobile;
- high-density desktop;
- chart summaries;
- visual QA.

Gate:

- no serious/critical automated a11y issue;
- mobile wizard works;
- desktop tables are usable.

## Phase 10 — Final verification and handoff

Tasks:

- full verify;
- clean seed reset;
- clean Docker start;
- migration from empty DB;
- demo script;
- screenshots;
- test report;
- implementation report;
- source map;
- ZIP;
- deployment instructions.

Gate:

- Definition of Done matrix is complete.

---

# 27. BACKLOG WITH PRIORITIES

## P0

- architecture foundation;
- database;
- auth;
- tenant isolation;
- overview;
- inventory;
- findings;
- remediation;
- verification;
- audit;
- wizard;
- integration health;
- ROI scenarios;
- golden-path E2E;
- Docker;
- README.

## P1

- saved views;
- bulk actions;
- evidence object storage;
- async jobs;
- permissions inspector;
- notification centre;
- exports;
- performance tests;
- a11y tests.

## P2

- command palette;
- advanced report formatting;
- mention notifications;
- visual regression;
- dashboard customization;
- additional provider fixture variations.

---

# 28. ARCHITECTURE DECISION RECORDS

Create at least:

1. `ADR-001-modular-monolith.md`
2. `ADR-002-react-vite-spa.md`
3. `ADR-003-nestjs-rest-openapi.md`
4. `ADR-004-postgresql-prisma.md`
5. `ADR-005-redux-toolkit-rtk-query.md`
6. `ADR-006-oidc-auth-adapter.md`
7. `ADR-007-shared-schema-multitenancy.md`
8. `ADR-008-append-only-audit.md`
9. `ADR-009-idempotency-and-optimistic-locking.md`
10. `ADR-010-provider-adapter-layer.md`
11. `ADR-011-bullmq-background-jobs.md`
12. `ADR-012-demo-evidence-storage.md`
13. `ADR-013-transparent-risk-score.md`
14. `ADR-014-roi-scenario-boundaries.md`

Each ADR:

- context;
- decision;
- alternatives;
- consequences;
- status.

---

# 29. DOCUMENTATION DELIVERABLES

## README

Must include:

- product explanation;
- disclaimer;
- screenshots;
- architecture summary;
- prerequisites;
- quick start;
- demo accounts;
- reset;
- tests;
- environment;
- limitations;
- security statement;
- deployment;
- repository map.

## ARCHITECTURE

Must include:

- container diagram;
- component diagram;
- data flow;
- trust boundaries;
- module dependencies;
- provider adapter flow;
- async operation flow.

Use Mermaid where useful.

## THREAT MODEL

Include:

- assets;
- actors;
- trust boundaries;
- threats;
- controls;
- residual risks;
- demo limitations.

## DEMO SCRIPT

Create:

- 7–10 minute version;
- 2-minute recruiter version;
- full technical walkthrough.

## IMPLEMENTATION REPORT

Include:

- completed features;
- tests;
- deviations;
- blockers;
- known limitations;
- production hardening needed for real customer data;
- exact non-production boundaries.

## TEST REPORT

Include:

- commands;
- pass/fail;
- coverage summary;
- E2E list;
- security cases;
- performance results;
- accessibility results.

---

# 30. DEFINITION OF DONE

## 30.1 Functional

- [ ] Authenticated role-based app
- [ ] Two isolated tenants
- [ ] 10k+ workloads
- [ ] Overview metrics reconcile
- [ ] Workload filters persist
- [ ] Finding lifecycle works
- [ ] Assignment and SLA work
- [ ] Evidence persists
- [ ] Independent verification enforced
- [ ] Critical finding resolves only after verification
- [ ] Risk acceptance requires manager, reason, and expiry
- [ ] Audit is read-only and transactional
- [ ] Wizard validates, previews, executes, retries
- [ ] Integration degraded/offline states work
- [ ] ROI scenarios match expected values
- [ ] Reset returns deterministic state

## 30.2 Security

- [ ] Tenant escape tests
- [ ] IDOR tests
- [ ] Privilege escalation tests
- [ ] Separation-of-duties tests
- [ ] CSRF protection where needed
- [ ] Strict validation
- [ ] Rate limiting
- [ ] Idempotency
- [ ] Optimistic locking
- [ ] Safe upload
- [ ] CSV neutralization
- [ ] No secrets
- [ ] Dependency and image scan

## 30.3 Quality

- [ ] TypeScript strict
- [ ] No ignored type errors
- [ ] Lint clean
- [ ] Unit tests
- [ ] Component tests
- [ ] Integration tests
- [ ] Contract tests
- [ ] E2E tests
- [ ] Accessibility tests
- [ ] Performance tests
- [ ] Build clean

## 30.4 UX

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile wizard
- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Stale
- [ ] Degraded
- [ ] Permission explanation
- [ ] Keyboard navigation
- [ ] Visible focus
- [ ] Reduced motion
- [ ] No inert primary CTA

## 30.5 Delivery

- [ ] Docker Compose
- [ ] Migrations
- [ ] Seed
- [ ] Reset
- [ ] `.env.example`
- [ ] OpenAPI
- [ ] README
- [ ] ADRs
- [ ] threat model
- [ ] deployment guide
- [ ] runbook
- [ ] implementation report
- [ ] test report
- [ ] final ZIP
- [ ] public preview only if actually deployed

---

# 31. RISK REGISTER

| Risk | Severity | Mitigation |
|---|---:|---|
| Product appears to impersonate ESET | Critical | Independent branding, disclaimer, no copied UI |
| Tenant data leak | Critical | Scoped repositories, object auth, negative tests |
| Demo called production-ready without proof | High | Mandatory release gate and implementation report |
| Critical finding bypasses verification | High | State guards and transaction tests |
| Duplicate enablement operation | High | Idempotency record and unique constraint |
| Audit can be edited | High | No update/delete API; DB role and tests |
| Scope becomes full CSPM | High | Non-goals and seven core workflows |
| Too much dashboard, not enough workflow | High | Golden path must persist real transitions |
| Provider API assumptions are mistaken | Medium | Adapter contracts and mock-only boundaries |
| ROI looks like an official forecast | High | Visible disclaimers and editable assumptions |
| Large tables are slow | Medium | Server paging, indexes, virtualization |
| Keycloak blocks preview deployment | Medium | Auth adapter with explicit safe demo mode |
| File upload expands attack surface | High | Strict allowlist, size limit, signed storage, scan seam |
| Background jobs hide failures | Medium | Operation status, DLQ, retry UI, metrics |
| Agent silently downgrades stack | High | No-shortcut rule and deviation approval |
| Mobile becomes unusable | Medium | Mobile wizard and compact read views |
| Test suite becomes flaky | Medium | Deterministic seed, controlled clocks, stable selectors |

---

# 32. FINAL HANDOFF FORMAT

The AI agent must deliver:

1. Complete repository.
2. Final ZIP.
3. Exact local start command.
4. Demo credentials.
5. Database migration and seed command.
6. Test commands.
7. Build result.
8. Test report.
9. Implementation report.
10. Known limitations.
11. Screenshots.
12. Deployment URL only when deployment was genuinely completed.
13. Confirmation that no real ESET data, API, logo, or internal material is included.

The final message must distinguish:

- implemented;
- tested;
- visually reviewed;
- not implemented;
- not tested;
- production hardening still required.

---

# 33. AGENT START COMMAND

Use the following as the execution command after this plan is supplied to the coding agent:

> Implement the complete CSER Workspace according to `CSER_Workspace_AI_Agent_Production_MVP_Implementation_Plan.md`. Treat the document as the authoritative delivery specification. Do not downgrade the React/TypeScript, NestJS, PostgreSQL, multi-tenant, audit, idempotency, test, or Docker requirements without an explicit blocker and written approval. Build the application in vertical slices, keep it runnable, execute every required verification gate, fix defects, and deliver the complete repository, final ZIP, documentation, test evidence, and honest implementation report. Use only fictional data and mock provider adapters. Do not use ESET branding, internal APIs, or claims of official affiliation.

---

# 34. FINAL QUALITY QUESTION

Before declaring completion, the agent must answer with evidence:

> Is this a real, persisted, secure, tested full-stack candidate MVP, or merely an attractive prototype?

If any mandatory requirement still makes the second answer more accurate, the agent must not describe the result as production-ready.
