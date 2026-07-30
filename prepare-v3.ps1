$ErrorActionPreference = "Stop"
corepack enable
pnpm install --no-frozen-lockfile
pnpm db:generate
pnpm db:migrate:dev --name initial_v3
pnpm db:seed
pnpm db:verify
pnpm typecheck
pnpm test
pnpm build
Write-Host "V3 dependencies, migration and build prepared. Commit the generated pnpm-lock.yaml and Prisma migration before deployment."
