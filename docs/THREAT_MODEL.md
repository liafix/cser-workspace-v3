# Threat Model

## Assets

Tenant data, findings, remediation evidence, session identity, audit history, integration state and business-impact assumptions.

## Primary threats and controls

| Threat | Source control |
|---|---|
| Tenant escape / IDOR | tenant-scoped Prisma queries and negative tests |
| Privilege escalation | server permissions and object scope |
| Self-verification | separation-of-duties domain guard |
| Lost update | mandatory `If-Match` design |
| Duplicate command | idempotency key plus request hash |
| CSRF | CSRF token, same-site cookie and origin validation |
| Stored XSS | React output escaping, DTO validation and future sanitization review |
| Audit tampering | no audit mutation API; DB hardening remains required |
| Secret leakage | runtime environment validation and no committed credentials |
| Provider outage | stale/degraded states and deterministic adapters |

## Residual risk

The source has not undergone dependency scanning, browser security testing, Docker execution or penetration testing in this environment. It is a candidate artifact, not a production security certification.
