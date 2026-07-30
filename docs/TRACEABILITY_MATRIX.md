# Traceability Matrix

| Requirement | Source location | Implementation | Planned verification |
|---|---|---|---|
| Local React/Vite | V3 plan §5, §27 | `apps/web` | Vite build, offline runtime scan |
| Strict TypeScript | V3 plan §8 | `tsconfig.base.json` | `pnpm typecheck` |
| NestJS typed API | V3 plan §5, §14 | `apps/api` | build + Supertest |
| PostgreSQL/Prisma | V3 plan §9–10 | `prisma/schema.prisma` | migration/seed/invariants |
| Tenant isolation | V3 plan §11, §21 | auth/services | API and E2E negative tests |
| Explicit commands | V3 plan §12 | findings controller/service | domain and E2E golden path |
| If-Match/idempotency | V3 plan §13 | common security/findings | conflict/replay tests |
| Accessibility | V3 plan §17, §22 | semantic frontend | axe + keyboard review |
| Docker | V3 plan §23 | Dockerfiles/Compose | compose build and health |
| Public deployment | V3 plan §24 | Vercel/API profiles | public smoke and restart persistence |
