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

## Known Issues

| Issue | Priority | Notes |
|---|---|---|
| `.env` files in git history (now gitignored) | P0 | Needs `git-filter-repo` to scrub |
| Analytics page calls non-existent backend endpoints | P1 | Frontend will 404 |
| AI service route mismatch (API expects `/insights/*`, AI has `/ai/analyze`) | P1 | Integration will fail |
| No integration/E2E tests | P2 | Scaffold created at `tests/` |
| `infra/terraform/main.tf` is commented out | P2 | Placeholder only |
