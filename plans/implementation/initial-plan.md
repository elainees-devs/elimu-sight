# ElimuSight — Initial Project Plan

> Generated: 2026-05-01
> Status: Superseded by detailed plans

---

## 1. Vision

AI-Powered School Intelligence Platform for the CBC (Competency-Based Curriculum) framework. Transform raw school data into actionable intelligence.

## 2. High-Level Architecture

- **Frontend**: React 18 SPA with TanStack Router, TanStack Query, Zustand, Tailwind CSS
- **Backend API**: Node.js + Express 5 + Prisma ORM + PostgreSQL
- **AI Service**: Python FastAPI microservice (rule engine, LLM, ML)
- **Deployment**: Docker Compose (dev), cloud (production)

## 3. Implementation Phases

### Phase 0 — Foundation
- Monorepo setup with Turborepo
- Shared TypeScript configs
- Package workspaces (`types`, `ui`, `utils`, `config`)
- Docker Compose orchestration

### Phase 1 — Core Backend
- Authentication (JWT + refresh tokens)
- Multi-tenant School CRUD
- Student, Class, Subject, Assessment management
- Prisma schema with soft deletes, composite indexes

### Phase 2 — Frontend
- Dashboard, Analytics, Student/Class/Assessment pages
- Role-based routing and access control
- TanStack Query cache strategy
- Shared UI component library

### Phase 3 — AI Integration
- Python FastAPI service with rule engine
- LLM integration (OpenAI) for insight generation
- ML trend analysis
- Circuit breaker + retry in API backend

### Phase 4 — DevOps & Testing
- Docker images for all services
- CI/CD pipeline (GitHub Actions)
- Jest unit tests (API)
- Pytest unit + integration tests (AI service)

### Phase 5 — Production Hardening
- Sentry error tracking
- Prometheus metrics
- Rate limiting, security headers
- Audit logging
- Pagination on all list endpoints

## 4. Key Milestones

| Milestone | Target |
|-----------|--------|
| Monorepo scaffolded | Week 1 |
| Auth + School CRUD working | Week 2 |
| Student/Assessment CRUD | Week 3 |
| Frontend MVP pages | Week 4 |
| AI service MVP | Week 5 |
| Docker + CI setup | Week 6 |
| Production hardening | Week 7 |

## 5. Design Principles

- **Layered modular monolith** — clear separation: routes → controllers → services → data
- **Tenant isolation** — all queries scoped by `school_id`
- **DTO pattern** — mappers and validation at API boundaries
- **API as AI proxy** — frontend never calls AI service directly
- **Feature flags** — LLM and ML gated behind env flags
- **Graceful degradation** — rule engine works without LLM/ML
