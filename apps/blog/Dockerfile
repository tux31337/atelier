# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /repo

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/blog/package.json apps/blog/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/tailwind-config/package.json packages/tailwind-config/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile --filter @atelier/blog...

FROM base AS builder
COPY --from=deps /repo ./
COPY . .
RUN pnpm -F @atelier/blog build

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /repo/apps/blog/public ./apps/blog/public
COPY --from=builder --chown=nextjs:nodejs /repo/apps/blog/.next/static ./apps/blog/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/blog/.next/standalone ./

USER nextjs
EXPOSE 3000

CMD ["node", "apps/blog/server.js"]
