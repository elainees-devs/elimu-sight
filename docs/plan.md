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
- [ ] Security hardening — `.gitignore`, secrets management, CSRF, CSP
- [ ] Backend integration tests
- [ ] Web app CI/CD
- [ ] Containerized web app

### Phase 2 — Growth
- [ ] E2E tests (Playwright)
- [ ] Payment integration (Stripe)
- [ ] Redis caching layer
- [ ] Background job processing for AI tasks
- [ ] Analytics backend endpoints (currently missing — frontend calls non-existent routes)
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
| Analytics page calls non-existent `/analytics/*` endpoints | P1 | Reported |
| JWT expiry hardcoded "1d" ignores env var | P2 | Reported |
| Assessment URL pattern inconsistent with other resources | P2 | Reported |
| AuthProvider race condition on refresh token | P2 | Reported |
| Web `.env` is empty — no `VITE_API_URL` for production | P2 | Reported |
