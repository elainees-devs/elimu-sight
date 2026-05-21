# Product Plan & Roadmap

## Current Status

ElimuSight is in **pre-production** phase. The core features are built but require security hardening, infrastructure setup, and testing before launch.

## Feature Roadmap

### Phase 1 — MVP Launch (Current)
- [x] Authentication (JWT + refresh token rotation)
- [x] School CRUD (multi-tenant)
- [x] Class, Subject, Student CRUD
- [x] Assessment tracking (CBC)
- [x] AI insight generation (3-tier: rule engine, ML, LLM)
- [x] Insights CRUD, query, analytics
- [x] Dashboard (stats, activity, class performance)
- [x] Teacher management
- [x] Super Admin dashboard (overview, tenants, users, AI, health, security, billing, announcements, support)
- [x] Role-based access (SUPER_ADMIN, ADMIN, HEADTEACHER, TEACHER, ACCOUNTANT)
- [x] Security hardening — `.gitignore`, secrets management
- [ ] Backend integration tests
- [ ] Web app CI/CD
- [x] Containerized web app (Dockerfile + docker-compose)

### Phase 2 — Growth
- [ ] E2E tests (Playwright)
- [ ] Payment integration (Stripe)
- [ ] Redis caching layer
- [ ] Background job processing for AI tasks
- [x] Analytics backend endpoints (controllers + routes exist)
- [ ] Account lockout and password policies
- [ ] Code splitting and lazy loading

### Phase 3 — Scale
- [ ] Read replicas
- [ ] Event-driven architecture
- [ ] Mobile app API
- [ ] WhatsApp/SMS notifications
- [ ] Parent portal

## Known Issues

| Issue | Severity | Status |
|---|---|---|
| No integration/E2E tests | P2 | Unresolved |
| Assessment URL pattern inconsistent with other resources | P2 | Unresolved |
| `.env` files in git history | P0 | Needs `git-filter-repo` to scrub |
| `infra/terraform/main.tf` is commented out | P2 | Placeholder only |

### Resolved Issues

| Issue | Resolution |
|---|---|
| Analytics page calls non-existent endpoints | ✅ Backend endpoints added in commit `285436d` |
| JWT expiry hardcoded "1d" ignores env var | ✅ Fixed in commit `acc7b29` — reads from env |
| AuthProvider race condition on refresh token | ✅ Fixed in commit `7fc0c2f` |
| Web `.env` is empty | Partially addressed — VITE_API_URL and VITE_AI_SERVICE_URL exist |
| AI service route mismatch | ✅ Fixed in Phase 1 — added /api/v1 prefix |
