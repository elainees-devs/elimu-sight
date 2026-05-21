# Progress Tracking

## 2026-05-20 — Monorepo Restructure

### Completed
- ✅ Root `.gitignore` hardened (comprehensive ignores)
- ✅ Root `package.json` created
- ✅ `turbo.json` build pipeline config
- ✅ `tsconfig.base.json` shared TypeScript config
- ✅ `.prettierrc` shared formatting config
- ✅ `docs/` directory structure created (architecture, specs, plans, decisions, diagrams, guides, audit)
- ✅ `.plans/` → `docs/` migration (architecture, audit, plans)
- ✅ `apps/api/docs/` → `docs/` migration (system design, trade-offs, ERD)
- ✅ `apps/ai-service/docs/` → `docs/diagrams/` migration (3-layer, AI pipeline, architecture)
- ✅ `apps/web/workflow/` → `docs/guides/` migration (user flow)
- ✅ `prp.md` → `docs/specs/prp.md`
- ✅ Docs hub files created (README.md, research.md, plan.md, progress.md)
- ✅ Root README.md updated to reflect new structure

## 2026-05-21 — Phase 1 Safety Cleanup

### Completed
- ✅ Removed dead `packages/types/` directory (was empty, real types live in `shared/types/`)
- ✅ Added `.gitkeep` to `infra/docker/` (ensures directory is tracked)
- ✅ Created root `tests/` directory scaffold with `.gitkeep`
- ✅ Removed deprecated empty `apps/web/workflow/` directory
- ✅ Fixed AI route prefix mismatch (ai.service.ts → /api/v1/insights/*)
- ✅ Fixed auth middleware to use env.JWT_SECRET (not process.env)
- ✅ Added workspaces config to root package.json

## 2026-05-21 — Phase 2 Shared Layer Adoption

### Completed
- ✅ Migrated web app to @elimu-sight/types and @elimu-sight/ui
- ✅ Moved UI components from web to packages/ui/
- ✅ Wired @elimu-sight/types into API backend
- ✅ Wired @elimu-sight/utils into web app

## 2026-05-21 — Phase 3 Feature Isolation & Cleanup

### Completed
- ✅ Removed dead SQL DDL file (apps/api/prisma/ddl/tables.sql)
- ✅ Removed unused deps: winston-daily-rotate-file, pg, @types/joi, @types/pg

## 2026-05-21 — Architecture Alignment (Plans + Config Packages)

### Completed
- ✅ Created `plans/` root directory with `implementation/` and `archive/` subdirectories
- ✅ Moved plan files from `docs/plans/` to `plans/implementation/` (initial-api-plan.md, initial-ai-service-plan.md)
- ✅ Removed empty `docs/plans/` directory
- ✅ Created missing `plans/implementation/initial-plan.md` (initial project roadmap)
- ✅ Created missing `plans/implementation/verdict.md` (architecture audit verdict)
- ✅ Created `packages/config/` with `eslint-preset.js`, `tsconfig.base.json`, `package.json`
- ✅ Updated `docs/README.md` links to point to new `plans/implementation/` paths

## 2026-05-21 — Production Hardening Phase (P0 Fixes)

### Completed
- ✅ **Fixed `validateSchoolAccess` middleware** — role-based roles no longer short-circuit the `school_id` comparison, preventing cross-tenant data access
- ✅ **Fixed analytics controller** — `schoolId` now sourced from JWT `req.user.schoolId` instead of unsanitized query param
- ✅ **Fixed `schoolIdParamSchema` mismatch** — created `schoolIdInParamsSchema` for routes using `:schoolId` param (class.route, assessment.route) where `schoolIdParamSchema` expected `{ id }` instead
- ✅ **Fixed subject-client.ts** — added missing `schoolId` to `create()` payload (was causing 400 errors on every subject creation)
- ✅ **Fixed student/subject list routes** — `GET /students` and `GET /subjects` now fall back to `req.user?.schoolId` since routes lack `:schoolId` param
- ✅ **Fixed `useLogout`** — added `queryClient.clear()` to prevent stale cached data after logout
- ✅ **Fixed `PaginationParams` duplication** — insight services now import from `@elimu-sight/types` instead of redefining locally
- ✅ **Fixed `APP_NAME` duplication** — web `app-config.ts` now imports from `@elimu-sight/types`
- ✅ **Fixed `user-client.ts` inline type** — now uses shared `ApiPaginatedResponse<User>`
- ✅ **Fixed `mappers/index.ts`** — removed unused `toSubjectId` import
- ✅ **Removed dead code** — `useCurrentUser` hook and export removed (never imported anywhere)
- ✅ **Zero `any` types** confirmed across all source code

## Known Issues

| Issue | Priority | Notes |
|---|---|---|
| `.env` files in git history (now gitignored) | P0 | Needs `git-filter-repo` to scrub |
| Analytics page backend endpoints now exist (controller + routes) | P1 | Frontend calls may still need verification |
| No integration/E2E tests | P2 | Scaffold created at `tests/` |
| `infra/terraform/main.tf` is commented out | P2 | Placeholder only |
