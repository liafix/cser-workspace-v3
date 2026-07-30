# Migration to the Target Architecture

The functional runtime can be migrated without changing the product workflow.

1. Replace `server/db.js` repositories with PostgreSQL repositories.
2. Translate the schema to Prisma migrations.
3. Move HTTP routes into NestJS controllers.
4. Move business rules into NestJS domain services.
5. Generate OpenAPI and a typed frontend client.
6. Replace signed demo sessions with Keycloak or enterprise OIDC.
7. Move evidence to MinIO/S3.
8. Move async enablement and sync operations to BullMQ/Redis.
9. Replace CDN React runtime with a Vite dependency bundle.
10. Add Playwright, axe and k6 in CI.

The important domain rules already have explicit API seams and test scenarios, so the migration should be performed module-by-module rather than as a full UI rewrite.
