FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/domain/package.json packages/domain/package.json
RUN pnpm install --no-frozen-lockfile
FROM deps AS build
COPY . .
RUN pnpm db:generate && pnpm --filter @cser/api build
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
USER node
EXPOSE 4000
CMD ["node","apps/api/dist/main.js"]
