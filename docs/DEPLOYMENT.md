# Deployment

## Recommended candidate profile

- `apps/web`: Vercel Vite deployment
- `apps/api`: persistent Node container host
- database: managed PostgreSQL

Set `VITE_API_BASE_URL` to the public API `/api/v1` URL and configure `ALLOWED_ORIGINS` on the API. HTTPS and a strong session secret are mandatory.

## Local Docker target

```bash
docker compose up --build
```

This command must be executed and documented before Docker readiness is claimed.

## Vercel

Deploy `apps/web` as the project root. The included `vercel.json` handles SPA rewrites. Do not place the PostgreSQL/NestJS stateful backend into a static Vercel frontend deployment without a tested serverless redesign.

## API host

Run database migration before API startup:

```bash
pnpm prisma migrate deploy
pnpm --filter @cser/api start
```

Verify `/health/live`, `/health/ready`, `/metrics` and `/api/docs`.
