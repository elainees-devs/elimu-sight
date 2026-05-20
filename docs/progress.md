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

## Known Issues

| Issue | Priority | Notes |
|---|---|---|
| `.env` files committed (now gitignored but in history) | P0 | Needs `git-filter-repo` |
| Analytics page calls non-existent backend endpoints | P1 | Frontend will 404 |
| No web app Dockerfile | P2 | |
| No integration/E2E tests | P2 | |
