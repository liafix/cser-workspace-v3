# Security Policy

CSER Workspace is an independent candidate project with fictional data. Do not connect it to real enterprise cloud accounts or store real security evidence in the current release.

## Reporting

Report a vulnerability privately to the repository owner. Include:

- affected route or component;
- reproduction steps;
- tenant/role used;
- expected and actual behavior;
- correlation ID when available.

Do not publish real credentials or exploit a public demo beyond the minimum needed to demonstrate the issue.

## Current supported release

- Candidate MVP V2: supported for portfolio demonstration.
- Real enterprise production use: not supported.

## High-risk areas

- tenant isolation and IDOR;
- role escalation;
- finding transition guards;
- evidence handling;
- idempotency replay;
- optimistic locking;
- audit integrity;
- demo authentication configuration.
