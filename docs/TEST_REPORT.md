# Test Report

## Executed in the generation environment

| Check | Result |
|---|---|
| V3 repository structural verification | Passed |
| JSON parsing | Passed |
| V3 runtime CDN/UMD scan | Passed |
| TypeScript/TSX syntax transpilation | Passed |
| V2 reference `npm run verify` | Recorded during final packaging |
| ZIP integrity | Recorded during final packaging |

## Authored but not executable in the generation environment

- domain unit tests;
- React Testing Library component test;
- NestJS API integration test;
- Playwright golden remediation;
- tenant isolation;
- role denial;
- URL filter persistence;
- mobile enablement wizard;
- axe serious/critical violation gates;
- PostgreSQL seed invariant check;
- Docker build and health checks.

## Reason

The environment could not resolve the npm registry and did not provide Docker, PostgreSQL or an installed browser. No test is reported as passed unless it was actually executed.
