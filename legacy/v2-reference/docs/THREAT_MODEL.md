# Threat Model

## Protected assets

- tenant-scoped workload data;
- finding workflow;
- evidence metadata;
- verification decisions;
- membership and role data;
- audit history;
- model assumptions.

## Main threats and controls

| Threat | Implemented control | Production follow-up |
|---|---|---|
| Tenant escape / IDOR | Tenant-scoped queries, object tenant checks, negative tests | PostgreSQL RLS and penetration test |
| Privilege escalation | API permission map, deny-by-default route checks | OIDC claims mapping and policy engine |
| CSRF | CSRF token derived from signed session | Origin checks and hardened proxy policy |
| Session forgery | HMAC-signed HTTP-only cookie | OIDC and key rotation |
| Duplicate commands | Required idempotency key and persistent record | Redis/distributed coordination |
| Stale overwrite | If-Match optimistic version | Consistent ETag contract |
| Audit tampering | No audit mutation API; same transaction as state change | Separate DB role/WORM export |
| Critical self-verification | Evidence author check | Formal separation-of-duties policy |
| Stored XSS | React output encoding, JSON validation, CSP | Rich-text allowlist if introduced |
| Upload abuse | No binary upload in candidate runtime | Signed URLs, MIME limits, malware scanning |
| CSV injection | No CSV export in this release | Neutralize formula prefixes before export |
| Query abuse | Maximum page sizes and indexed filters | Distributed rate limiting and load test |

## Residual risks

- SQLite is not the recommended multi-instance production store.
- Demo sessions are not enterprise identity.
- CDN-hosted React is a deployment dependency.
- Browser security regression testing could not be automated in the execution environment.
