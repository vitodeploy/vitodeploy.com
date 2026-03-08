# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing/docs website for VitoDeploy (vitodeploy.com) — a self-hosted server management tool. Built with Next.js 16, statically exported and deployed to Netlify.

## Commands

- `bun run dev` — Start dev server (Turbopack)
- `bun run build` — Static export + generate RSS feeds
- `bun run lint` — ESLint
- `bun run typecheck` — TypeScript check (`tsc --noEmit`)
- `bun run format` — Prettier format all TS/TSX files

Package manager is **bun** (uses `bun.lock`).

## Architecture

**Static export site** (`output: "export"` in next.config.mjs) — no server-side features, no API routes. Deployed to Netlify (`out/` directory).

### Content System

All content lives in `content/`:

- **Docs** (`content/docs/{version}/`): Versioned documentation (1.x, 2.x, 3.x). Default version is 3.x. Markdown/MDX files. Sidebar structure is hardcoded in `lib/docs.ts` (not file-system derived).
- **Blog** (`content/blog/`): Posts use `YYYY-MM-DD-slug/index.mdx` naming convention. Can also be standalone `.mdx`/`.md` files with date prefix.

### Key Modules

- `lib/docs.ts` — Doc loading, sidebar config, version routing. Sidebar items defined inline per version.
- `lib/docs-config.ts` — Version constants (`VERSIONS`, `DEFAULT_VERSION`), URL helpers, slug parsing. Default version URLs omit the version prefix (`/docs/foo` vs `/docs/2.x/foo`).
- `lib/blog.ts` — Blog post loading, author data, excerpt extraction.
- `lib/mdx.ts` — MDX compilation with remark-gfm, remark-directive, custom callout plugin, rehype-pretty-code (Shiki with vesper/github-light themes).
- `lib/remark-callout.ts` — Custom remark plugin for callout directives.
- `scripts/generate-rss.ts` — Post-build script generating RSS and Atom feeds into `out/`.

### Routes

- `/` — Landing page (hero, features, contributors, testimonials)
- `/blog` and `/blog/[slug]` — Blog listing and posts
- `/docs/[...slug]` — Versioned docs (catch-all route handles version parsing)

### UI

- **shadcn/ui** (radix-nova style, Tailwind v4, CSS variables for theming)
- `components/ui/` — shadcn primitives
- `components/` — Site-specific components (navbar, footer, MDX components, docs sidebar, etc.)
- `components/landing/` — Landing page sections
- Path alias: `@/*` maps to project root

## Code Style

- No semicolons, double quotes, trailing commas (es5), 2-space indent
- Prettier with `prettier-plugin-tailwindcss` (uses `cn()` and `cva()` for class sorting)
- ESLint: next/core-web-vitals + next/typescript
