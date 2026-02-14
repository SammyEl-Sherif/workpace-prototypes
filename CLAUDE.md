# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WorkPace Prototypes is a full-stack Next.js 15 application (React 18, TypeScript) that integrates with Notion, OpenAI, Stripe, and Supabase. It uses npm workspaces with the main app in `src/` and a published design system in `design-system/`.

**Node.js ^22.0.0, npm ^9 or ^10 required.**

## Common Commands

### Development

```bash
./scripts/setup-local.sh          # Initial setup
./scripts/dev.sh db:start         # Start local database
./scripts/dev.sh dev              # Start dev server (localhost:3000)
npm run dev                       # Alt: start dev server
```

### Build & Check

```bash
npm run build                     # Build the src workspace
npm run check                     # Lint + type check (parallel)
npm run lint                      # Run all linters (ESLint + Stylelint)
npm run format                    # Format code (Prettier + Stylelint fix)
```

### Testing

```bash
npm run test                      # Run all tests (parallel, watch mode in dev)
cd src && npx jest --ci --runInBand  # Run tests in CI mode (single run)
cd src && npx jest path/to/file   # Run a single test file
```

### Supabase Database

```bash
npm run supabase:diff:local       # Generate migration from schema changes
npm run supabase:push             # Push migrations to remote
npm run supabase:reset            # Reset local database
```

### Design System

```bash
cd design-system && npm run start # Run Storybook
cd design-system && npm run build # Build the design system
```

## Architecture

### Directory Layout

- `src/pages/` — Next.js pages router (routes) and API routes (`pages/api/`)
- `src/modules/` — Feature modules (smart components with business logic)
- `src/components/` — Reusable UI components
- `src/layout/` — Layout components (MainLayout, AppPageLayout, PageHeader)
- `src/hooks/` — Custom React hooks (per-feature data fetching & state)
- `src/contexts/` — React Context providers (UserInfo, FeatureFlags, Apps)
- `src/apis/routes/` — Client-side API endpoint wrappers
- `src/apis/controllers/` — Server-side service layer (business logic)
- `src/db/` — Database layer (connection pool, SQL file loader, query executor)
- `src/db/sql/` — Raw SQL query files organized by feature
- `src/server/utils/` — Server utilities (auth middleware, SSR wrappers)
- `src/interfaces/` — TypeScript type definitions
- `design-system/` — Published npm package `@workpace/design-system`
- `supabase/schemas/` — Declarative SQL schema files

### Data Flow

```
Pages (SSR via getServerSideProps + withPageRequestWrapper)
  → Client hooks fetch from API routes
    → API routes (pages/api/*) use withApiAuth middleware
      → Controllers/Services (apis/controllers/*)
        → Database layer (db/index.ts → SQL files → Supabase PostgreSQL)
```

### Layout System

- **MainLayout**: Wraps all pages except landing and signin. Provides fixed navbar (72px), optional SubNavbar (+48px), and AuthOverlay for protected routes. Content offset via `padding-top` (never spacer divs).
- **AppPageLayout**: Required for all `/apps/*` routes. Provides breadcrumbs, page title, consistent spacing, and max-width container.
- **PageHeader**: Opt-in page title component for standard pages.

### Authentication

NextAuth.js with Supabase adapter. Protected API routes use `withApiAuth`. Protected pages use `withPageRequestWrapper` for SSR and `AuthOverlay` for client-side gating.

### State Management

React Context API (UserInfo, FeatureFlags, Apps contexts) + custom hooks per feature. No Redux/Zustand.

## Code Style

### Formatting (enforced by Prettier + Husky pre-commit)

- Single quotes, no semicolons, 2-space indent, 100 char print width

### Import Order

1. External libraries
2. `@workpace/design-system`
3. Internal imports (`@/` aliases)
4. Styles

### SCSS

Import design tokens: `@use '@workpace/design-system/dist/design-tokens' as *;`

## Critical Rules

### Design System

- **Always** import from the published package: `import { Button } from '@workpace/design-system'`
- **Never** import from `design-system/src/` or relative paths into design-system source
- Browse `design-system/src/components/` as reference/documentation only
- Available: Button, Badge, Card, Text, InputField, Select, Loading, Box, Divider, Icons
- Components used in 2+ places should go in the design system (ask before creating)

### Design Tokens (SCSS)

- Colors: `$color-{neutral|primary|success|warning|error|info|active|accent}-{50-900}`
- Spacing: `$size-{25|50|75|100|125|150|200|250|300|400|500|600|700|800|900}`
- **Do not invent token names.** Common mistakes: `$color-danger-*` (use `$color-error-*`), `$color-gray-*` (use `$color-neutral-*`), `$color-red-*` (use `$color-error-*`)

### Supabase / Database

- Schema changes go in declarative SQL files under `supabase/schemas/`
- **Never** write migration files by hand — generate with `npm run supabase:diff:local`
- **Never** use MCP tools for DDL/schema changes (read-only queries only)
- Schema files apply in alphabetical order — shared functions must be in `_functions.sql` (underscore prefix sorts first)
- New schema files **must** be added to `schema_paths` in `supabase/config.toml`
- Verify dependency ordering: referenced tables must sort before referencing tables

### Layouts

- **Never** use spacer divs for navbar offset — always `padding-top`
- **Always** use `AppPageLayout` for `/apps/*` routes
- Public pages (no auth): add pathname to `shouldShowOverlay` exclusion in MainLayout
