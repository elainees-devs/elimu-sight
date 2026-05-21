# ElimuSight API — Initial Engineering Review Plan

> Generated: 2026-05-10
> Mode: Build — Full Review + Implementation

---

## 1. Current Architecture Analysis

### Stack
| Component | Technology | Status |
|-----------|-----------|--------|
| Runtime | Node.js + TypeScript + Express 5 | ✅ Running |
| Database | PostgreSQL + Prisma ORM 5 | ✅ Migrated |
| Auth | JWT + bcrypt + Refresh Token Rotation | ✅ Enhanced |
| Validation | Joi | ✅ Working |
| Logging | Winston + Morgan + Request IDs | ✅ Configured |
| Security | Rate Limiting, CORS, Helmet, Body Limit | ✅ Hardened |
| AI Integration | Axios → Python FastAPI (stub) | ⚠️ Routes empty |
| Testing | None | ❌ Missing |
| Docker | None | ❌ Missing |
| CI/CD | None | ❌ Missing |

### Architecture Pattern
- **Layered Modular Monolith**: Routes → Middlewares → Controllers → Services → Prisma → PostgreSQL
- **Tenant Isolation**: `school_id` scoping on all queries (enhanced in prior session)
- **DTO Pattern**: Mappers with Joi schema validation at boundaries

### Previous Improvements (5 commits from prior session)
- Env validation, `.env.example`, express-rate-limit
- Winston logger, response helpers, request ID middleware, graceful shutdown
- Rate limiting (3 tiers), CORS hardening, Helmet config, 1MB body limit
- Tenant access on insight routes, scoped email lookup, auth context with schoolId
- Prisma schema fixes: `deleted_at`, composite indexes, cascade deletes, unique constraint, Decimal fix
- Pagination on ALL insight endpoints, parallel AI bulk gen, N+1 fix
- Refresh token rotation, logout, RBAC middleware

---

## 2. Detected Strengths

| # | Strength |
|---|----------|
| S1 | Clean layered architecture with clear separation of concerns |
| S2 | Strong DTO/Mapper pattern — DB ↔ API boundary enforced with Joi |
| S3 | UUID primary keys throughout — distributed-friendly |
| S4 | Soft delete pattern on users, students, schools, insights |
| S5 | Centralized error handling via `ApiError` + middleware |
| S6 | Pagination exists on ALL list endpoints (enhanced) |
| S7 | Refresh token rotation with revocation implemented |
| S8 | Winston structured logging with request correlation IDs |
| S9 | Rate limiting on global, auth, and AI tiers |
| S10 | Tenant isolation via `school_id` on all models + middleware |

---

## 3. Remaining Weaknesses

### 3.1 AI Service — Not Wired (HIGH Priority)

| Issue | Details | Severity |
|-------|---------|----------|
| `ai.controller.ts` | Empty file — no AI endpoints | **High** |
| `ai.route.ts` | Empty file — no AI routes | **High** |
| `ai.schema.ts` | Empty file — no AI validation | **High** |
| `InsightAIService` | Not connected to any route/controller | **High** |
| AI retry strategy | No exponential backoff (fires instantly) | **Medium** |
| AI circuit breaker | None — cascading failures | **Medium** |
| AI response validation | Assumes structure, no schema check | **Medium** |
| AI cost/token tracking | Non-existent | **Medium** |

**Files**: `src/controllers/ai.controller.ts`, `src/routes/ai.route.ts`, `src/schemas/ai.schema.ts`, `src/ai/ai.service.ts`

### 3.2 Assessment Route Inconsistency (MEDIUM Priority)

| Issue | Details | Severity |
|-------|---------|----------|
| Mixed prefixes | `/school/:schoolId/assessments` and bare `/assessments` | **Medium** |
| Mount point confusion | Router mounted at `/api/v1/assessments` but paths start with `/school/:schoolId/assessments` | **Medium** |
| Missing `validateSchoolAccess` | Some assessment endpoints lack it | **Medium** |

**Files**: `src/routes/assessment.route.ts`, `src/controllers/assessment.controller.ts`

### 3.3 Missing Testing Infrastructure (CRITICAL Priority)

| Issue | Details | Severity |
|-------|---------|----------|
| Zero tests | `src/tests/` is empty | **Critical** |
| No test framework | Jest/Vitest not installed | **Critical** |
| No test DB setup | No test config or seeding | **High** |
| No npm test | Script echoes "no test specified" | **High** |

**Files**: `package.json`, `src/tests/`

### 3.4 Missing DevOps Infrastructure (HIGH Priority)

| Issue | Details | Severity |
|-------|---------|----------|
| No Dockerfile | Cannot containerize | **High** |
| No docker-compose.yml | No local orchestration | **High** |
| No CI/CD | No automated pipeline | **High** |
| No health check improvements | Basic health only (no DB check) | **Medium** |
| Prisma migrations not run | Schema changes exist without migration | **Medium** |

**Files**: `Dockerfile`, `docker-compose.yml`, `.github/workflows/`, `src/app.ts`

### 3.5 Remaining Code Quality Issues (LOW Priority)

| Issue | Details |
|-------|---------|
| `any` in service `where` clauses | Services still use `any` for Prisma where |
| `InsightService` pass-through facade | Delegates but adds minimal value |
| JWT utility vs middleware inconsistency | `jwt.ts` utility exists but middleware uses `jsonwebtoken` directly |
| `confidence_score` Decimal type | Prisma schema uses `Decimal(5,2)` but should be `Int` |
| `morgan("dev")` always runs | Even in production where `morgan("combined")` also runs |

### 3.6 Missing Production Features

| Feature | Status |
|---------|--------|
| Metrics endpoint (Prometheus) | ❌ Missing |
| Sentry/APM error tracking | ❌ Missing |
| Database migration for schema changes | ❌ Not run |
| PM2/process manager config | ❌ Missing |
| API documentation (OpenAPI/Swagger) | ❌ Missing |
| Audit logging | ❌ Missing |
| Rate limit by tenant (not just global) | ❌ Missing |

---

## 4. Risk Assessment

| Risk | Prob | Impact | Priority |
|------|------|--------|----------|
| AI service unavailable crashes API (no circuit breaker) | Med | High | **P0** |
| Zero test coverage causes regressions | High | High | **P0** |
| Cannot deploy without Docker | High | Med | **P1** |
| No CI/CD slows development | High | Med | **P1** |
| Assessment route bugs in production | Med | Med | **P1** |
| No monitoring in production | Med | High | **P1** |

---

## 5. Prioritized Implementation Roadmap

### Phase A — AI Service Wiring (HIGH)
- Complete `ai.controller.ts`, `ai.route.ts`, `ai.schema.ts`
- Wire `InsightAIService` to routes
- Add AI request validation
- **Risk**: Low | **Impact**: High | **Est**: 1-2 commits

### Phase B — AI Service Resilience (MEDIUM)
- Add exponential backoff to retry logic
- Add circuit breaker
- Add AI response schema validation
- **Risk**: Low | **Impact**: High | **Est**: 1 commit

### Phase C — Fix Assessment Routes (MEDIUM)
- Normalize assessment route structure
- Add `validateSchoolAccess` to assessment endpoints
- **Risk**: Low | **Impact**: Medium | **Est**: 1 commit

### Phase D — Testing Infrastructure (CRITICAL)
- Add Jest + ts-jest
- Create test DB config and helpers
- Write first service unit tests
- Update `npm test` script
- **Risk**: Low | **Impact**: Critical | **Est**: 2-3 commits

### Phase E — DevOps Setup (HIGH)
- Create Dockerfile (multi-stage)
- Create docker-compose.yml (API + PostgreSQL)
- Add GitHub Actions CI pipeline
- Add health check improvements (DB ping)
- **Risk**: Low | **Impact**: High | **Est**: 2-3 commits

### Phase F — Polish & Hardening (LOW)
- Fix `morgan` double-logging in production
- Add proper health check with DB connectivity
- Clean up remaining `any` types in services
- **Risk**: Low | **Impact**: Low | **Est**: 1 commit

---

## 6. Execution Order

```
Phase A  →  AI Service Wiring
Phase B  →  AI Service Resilience  
Phase C  →  Fix Assessment Routes
Phase D  →  Testing Infrastructure
Phase E  →  DevOps Setup
Phase F  →  Polish & Hardening
```

Each phase produces one or more isolated git commits.

---

## 7. Key Clarifications Needed

1. **AI API Contract**: What endpoints does the Python FastAPI service expose and what's the request/response schema?
2. **Test Preferences**: Jest or Vitest? Unit vs integration focus?
3. **Deployment Target**: Where will this run? (Kubernetes, VM, serverless?)
4. **Monitoring**: Any existing APM tools (Sentry, DataDog, New Relic)?
5. **DB Migration**: Should I run `prisma migrate dev` to generate migration files for the schema changes?
