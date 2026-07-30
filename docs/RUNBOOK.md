# Runbook

## API not ready

1. Check `DATABASE_URL`.
2. Confirm PostgreSQL health.
3. Run `prisma migrate deploy`.
4. Inspect API structured logs and correlation ID.

## Seed reset

Only in a clearly labelled demo environment:

```bash
pnpm db:reset
pnpm db:seed
pnpm db:verify
```

## Provider degraded

The mock adapter intentionally preserves cached fictional workload data and displays freshness. Retry only through the versioned integration command.

## Rollback

Revert the application image and use a reviewed backward-compatible database migration strategy. Never delete audit history as a routine rollback step.
