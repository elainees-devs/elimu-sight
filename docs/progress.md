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

## Known Issues

| Issue | Priority | Notes |
|---|---|---|
| `.env` files in git history (now gitignored) | P0 | Needs `git-filter-repo` to scrub |
| Analytics page backend endpoints now exist (controller + routes) | P1 | Frontend calls may still need verification |
| No integration/E2E tests | P2 | Scaffold created at `tests/` |
| `infra/terraform/main.tf` is commented out | P2 | Placeholder only |
