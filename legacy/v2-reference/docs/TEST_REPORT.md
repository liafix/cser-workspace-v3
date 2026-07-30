# Test Report — Candidate MVP V2

## Release command

```bash
npm run verify
```

## Final result

```text
TypeScript build: passed
Seed generation: passed
Database invariant checks: passed
Audit immutability check: passed
Automated release tests: 13 passed, 0 failed
HTTP smoke test: passed
```

## Automated release cases

1. unsafe production secret is rejected;
2. liveness, readiness and OpenAPI are available;
3. deterministic workload/finding totals are correct;
4. tenant list and guessed-object isolation;
5. Cloud Operations assigned-object scope;
6. Cloud Operations cannot assign;
7. malformed JSON returns 400;
8. missing `If-Match` returns 428;
9. stale `If-Match` returns 412;
10. idempotent replay and request-hash conflict;
11. structured manager risk acceptance;
12. critical remediation golden path and separation of duties;
13. enablement operation versioning and persistence;
14. documented ROI baseline and audited assumption persistence;
15. database audit update/delete triggers.

The Node test runner reports 13 tests because the cases above are grouped into 12 named subtests plus the enclosing release suite.

## Seed invariants

Expected and observed value: zero.

- verified/resolved finding without passed verification;
- assigned workflow finding without task;
- review-ready finding without clean evidence;
- accepted-risk finding without acceptance record;
- cross-tenant workload/finding relationship;
- cross-tenant task/finding relationship;
- provider/connection mismatch;
- assigned finding without owner or SLA.

## Scale baseline

```text
tenants: 2
workloads: 10,000
findings: 2,500
remediation tasks: deterministic, state-dependent
evidence: deterministic, state-dependent
verifications: deterministic, state-dependent
audit records: 520+ before workflow tests
```

## Not executed in this environment

- Docker image build/run, because Docker is not installed;
- Playwright browser E2E, because Playwright is not installed and dependency installation is unavailable;
- axe automation;
- Chrome/Firefox/WebKit matrix;
- external dependency/container scanning;
- production load testing;
- independent penetration testing.

These limitations prevent a claim of production readiness for real security data.
