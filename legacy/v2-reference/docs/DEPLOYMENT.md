# Deployment Guide — Candidate MVP V2

## Current recommended target

Use a persistent Node.js 22 host:

- Hostinger VPS;
- a Linux VM;
- a container host with a persistent volume;
- another stateful Node hosting service.

## Local or VPS start

```bash
unzip CSER_Workspace_Candidate_MVP_V2.zip
cd CSER_Workspace_Candidate_MVP_V2
cp .env.example .env
npm run build
npm run reset
npm start
```

For a public fictional demo, set a long random session secret and explicitly decide whether demo identities are allowed.

Example behind a TLS reverse proxy:

```bash
NODE_ENV=production \
HOST=0.0.0.0 \
PORT=4173 \
CSER_SESSION_SECRET='replace-with-a-random-secret-longer-than-32-characters' \
CSER_DEMO_MODE=true \
CSER_ALLOW_PRODUCTION_DEMO=true \
CSER_COOKIE_SECURE=true \
CSER_ALLOWED_ORIGIN='https://your-demo.example' \
CSER_REQUIRE_ORIGIN=true \
CSER_TRUST_PROXY=true \
node server/index.js
```

The public page must continue to state that all data and provider operations are fictional.

## Docker

Create `.env` with a strong secret, then:

```bash
docker compose up --build -d
```

The Docker definition uses the vendored TypeScript compiler and a persistent data volume. Docker was not available in the build environment, so execute and verify this command before relying on the image.

## Health

```text
GET /api/health/live
GET /api/health/ready
```

## Reverse proxy requirements

- HTTPS only;
- forward original host and scheme;
- set `CSER_TRUST_PROXY=true` only behind a trusted proxy;
- preserve request body and `Origin`;
- apply request size and connection limits;
- avoid caching authenticated API responses.

## Backup

The current SQLite database is stored at `CSER_DB_PATH`.

At minimum:

1. stop writes or use an SQLite-safe backup procedure;
2. copy the database and WAL files consistently;
3. encrypt the backup;
4. test restoration;
5. define retention.

For real enterprise use, migrate to managed PostgreSQL before onboarding real data.

## Vercel

The landing page can be hosted statically. The complete stateful runtime should not use Vercel's ephemeral filesystem. Migrate the API and database before a full Vercel deployment.
