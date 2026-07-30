# V3 Release Gate

V3 may be called **Submission-ready ESET Candidate MVP** only when every P0 item below has attached evidence.

- [ ] `pnpm-lock.yaml` generated and committed
- [ ] `pnpm install --frozen-lockfile`
- [ ] Prisma client generated
- [ ] initial PostgreSQL migration generated and committed
- [ ] empty database migration succeeds
- [ ] deterministic seed succeeds
- [ ] invariant verifier reports zero
- [ ] strict TypeScript typecheck passes
- [ ] lint passes
- [ ] unit/component tests pass
- [ ] API integration tests pass
- [ ] Vite and NestJS builds pass
- [ ] Playwright golden path passes
- [ ] tenant and role negative E2E pass
- [ ] conflict E2E passes
- [ ] mobile wizard passes
- [ ] axe has no serious/critical findings on core routes
- [ ] Docker images build
- [ ] Docker Compose reaches healthy state
- [ ] public web/API/PostgreSQL deployment verified
- [ ] persistence survives API restart
- [ ] no default production secret
- [ ] screenshot comparison completed against accepted concept
- [ ] final implementation and test reports updated

Until then use the label in `IMPLEMENTATION_REPORT.md`.
