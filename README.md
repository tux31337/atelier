# Atelier

Atelier is a pnpm monorepo for frontend projects. The blog is the first app; future apps should use the same workspace harness instead of one-off project structures.

> Korean: see [README.ko.md](./README.ko.md). Working rules live in [AGENTS.md](./AGENTS.md) and [CLAUDE.md](./CLAUDE.md).

## Stack

- Next.js 16 App Router + React 19
- TypeScript strict mode
- Tailwind CSS v4, CSS-first styling
- pnpm workspaces
- Vitest for current unit tests

## Current Layout

```txt
apps/
  blog/                 # primary blog app

docs/                   # product, architecture, and UI notes
scripts/                # utility scripts

pnpm-workspace.yaml     # workspace globs: apps/* and packages/*
package.json            # root orchestration scripts
```

The root-level Next.js app has already been moved into `apps/blog`. Root files now orchestrate the workspace rather than hosting a competing app entrypoint.

## Target Layout

```txt
apps/
  blog/

packages/
  ui/                   # shared React components and layout primitives
  tailwind-config/      # shared Tailwind tokens and presets, when repetition is real
  tsconfig/             # shared TypeScript bases
  eslint-config/        # shared ESLint flat configs
  content/              # shared content utilities, if the blog needs extraction
```

The `packages/*` directories have not been created yet. Add them deliberately as shared needs appear, starting with the smallest useful packages.

## Common Scripts

Run from the repository root:

```bash
pnpm dev        # start the blog dev server
pnpm build      # build all workspace packages with a build script
pnpm lint       # run lint across the workspace
pnpm typecheck  # run TypeScript checks across the workspace
pnpm test       # run tests across the workspace
```

On Windows, if PowerShell blocks `pnpm`, use `pnpm.cmd` or fix the local execution policy/Corepack setup.

## Current Gaps

- `packages/*` shared packages are still missing.
- Docker, Docker Compose, Nginx, and blue-green deployment files are not present yet.
- GitHub Actions or other CI/CD workflows are not present yet.
- Some documentation is intentionally lightweight and should evolve with the harness.

## Conventions

- Use `pnpm`. Do not introduce `npm`, `yarn`, or `bun` lockfiles.
- Apps may import shared packages; shared packages must not import from apps.
- Read the local Next.js docs under the installed `next/dist/docs` package before changing routing, metadata, fonts, caching, server actions, config, or deployment behavior.
- Use Tailwind CSS v4 CSS-first patterns. Do not regress to a `tailwind.config.{js,ts}` unless the repository convention changes.
- Keep app-specific styling inside the owning app until real repetition justifies extraction.
- Prefer root workspace scripts for common tasks.

## Suggested Next Work

1. Create the first shared package skeletons: `packages/ui`, `packages/tsconfig`, and `packages/eslint-config`.
2. Add a Docker build path for `apps/blog`.
3. Add a local Docker Compose setup for the blog container.
4. Add Nginx reverse proxy configuration.
5. Add a blue-green deployment script after the container/proxy shape is stable.
6. Add CI once local build, test, and container commands are reliable.
