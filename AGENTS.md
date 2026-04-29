<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repository Guide

## Direction

Atelier is a frontend workspace for a blog first, then additional frontend projects. Build it as a pnpm monorepo with a shared Tailwind CSS foundation.

The first product app is the blog. Future apps should follow the same harness instead of creating one-off project structures.

## Current State

This repository currently starts from a root-level Next.js app (`app/`, `public/`, `next.config.ts`, `postcss.config.mjs`, and related files). Treat that layout as transitional while the monorepo harness is being assembled.

When migrating the app, move product code deliberately into `apps/blog` and update scripts/configuration in the same change. Do not leave two competing app entrypoints unless the task explicitly requires a staged migration.

## Target Structure

- `apps/blog`: primary blog application.
- `apps/*`: future frontend applications.
- `packages/ui`: shared React UI components and layout primitives.
- `packages/tailwind-config`: shared Tailwind CSS configuration, tokens, and presets when needed.
- `packages/tsconfig`: shared TypeScript configuration.
- `packages/eslint-config`: shared ESLint configuration.
- `packages/content`: shared content parsing or content-domain utilities if the blog needs them.

Root-level files should orchestrate the workspace: package manager metadata, shared scripts, lint/typecheck/build coordination, and repository documentation.

## Package Manager

Use `pnpm` for installs, scripts, and workspace operations. Do not introduce `npm`, `yarn`, or `bun` lockfiles.

Prefer root workspace scripts for common tasks. As the harness matures, keep commands like these available from the repository root:

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test` when tests exist

If a verification command is missing, either add it when that is part of the task or clearly mention the gap before finishing.

## Next.js

Before editing any Next.js code, read the relevant local documentation under `node_modules/next/dist/docs/`. This repo uses a newer Next.js version, so memory of older Next.js conventions is not enough.

Use the App Router and current documented APIs unless the existing code establishes a different pattern. Check local docs before changing routing, metadata, fonts, caching, server actions, config files, or build/runtime behavior.

## Tailwind CSS

Use Tailwind CSS as the default styling system. This repository uses Tailwind v4, so prefer the current v4 configuration and CSS-first patterns documented by the installed packages.

Keep app-specific styling inside the owning app. Promote repeated tokens, layout primitives, and reusable components into shared packages only after the repetition is real.

Global CSS should stay small and intentional: resets, theme tokens, base typography, and truly global behavior. Avoid broad page-specific selectors in global files.

## Monorepo Boundaries

Apps may import shared packages. Shared packages must not import from apps.

Keep `packages/ui` presentation-focused. It can expose accessible components, layout primitives, and visual building blocks, but it should not depend on blog-specific routing, content loading, or app data.

Keep configuration packages boring and explicit. Prefer small shared configs over hidden behavior.

When adding a new app, follow the existing app structure, scripts, Tailwind setup, TypeScript config, lint config, and naming conventions.

## Frontend Standards

Build actual product surfaces, not placeholder landing pages, unless the task asks for marketing content.

Use semantic HTML, accessible labels, keyboard-friendly controls, and responsive layouts. Prefer predictable, workmanlike UI structure for tools and content-heavy pages.

Use shared components and tokens where they exist. If no shared component exists yet, build locally first and extract only when a second real use appears.

## Agent Workflow

Read the relevant files before making changes. Follow existing patterns before introducing new ones.

Keep changes scoped to the requested task. Do not perform broad refactors, dependency swaps, or file moves unless they are necessary for the task.

Update this file when repository conventions change. AGENTS.md should remain the source of truth for how humans and agents work in this repo.

Do not manually edit generated files or lockfiles except through the appropriate tool. For dependency changes, use `pnpm`.

Run the relevant verification commands before finishing. If verification cannot be run, say why and describe the remaining risk.
