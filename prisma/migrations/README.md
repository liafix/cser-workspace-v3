# Prisma migrations

The authoritative schema is `../schema.prisma`. Generate the initial PostgreSQL migration after installing the locked dependency graph:

```bash
pnpm db:migrate:dev --name initial_v3
```

Commit the generated SQL before deployment. The migration was not fabricated in the generation sandbox because PostgreSQL and the npm registry were unavailable. This is an explicit release blocker, not a hidden completed gate.
