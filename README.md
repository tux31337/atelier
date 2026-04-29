# Atelier

A pnpm monorepo for frontend projects. The blog is the first app; future apps share the same harness instead of one-off scaffolds.

> Korean: see [README.ko.md](./README.ko.md). Working rules live in [AGENTS.md](./AGENTS.md) and [CLAUDE.md](./CLAUDE.md).

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript strict mode
- Tailwind CSS v4 (CSS-first)
- pnpm workspaces

## Layout

```txt
apps/
  blog/                 # primary blog app

packages/
  ui/                   # shared React components and layout primitives
  tailwind-config/      # shared Tailwind tokens and preset
  tsconfig/             # shared tsconfig bases
  eslint-config/        # shared ESLint configs
  content/              # content parsing utilities (when needed)
```

## Status

Transitional. The Next.js app still lives at the repo root (`app/`, `public/`, `next.config.ts`, `postcss.config.mjs`) and is being migrated into `apps/blog`. The `packages/*` directories have not been created yet, and `pnpm-workspace.yaml` does not yet declare workspace globs.

## Common scripts

Run from the repo root:

```bash
pnpm dev        # development server
pnpm build      # production build
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit (to be wired up)
pnpm test       # tests (to be added)
```

## Conventions (short version)

- Use `pnpm`. Do not introduce `npm`, `yarn`, or `bun` lockfiles.
- Apps may import shared packages; shared packages must not import from apps.
- Read `node_modules/next/dist/docs/` before changing Next.js routing, metadata, fonts, caching, server actions, or config — Next 16 has breaking changes versus older versions.
- Tailwind v4 CSS-first only. Do not regress to a `tailwind.config.{js,ts}`.
- Conventional Commits for commit messages.

See [AGENTS.md](./AGENTS.md) for the full guide.
