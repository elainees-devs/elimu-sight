# ElimuSight AI Service — Full Review & Improvement Plan

> Generated: 2026-05-11
> Mode: Deep Review + Incremental Implementation Plan
> Scope: `apps/ai-service/` (Python FastAPI) + integration with `apps/api/` (Node.js Express)

---

## 1. System Overview

### Current Architecture Summary

The ElimuSight AI Service is a **Python FastAPI** service intended to be the intelligence layer of the platform. It is co-located in a monorepo with a **Node.js/Express API** (the main backend) and a **React frontend**. The Node.js API acts as the orchestrator — it fetches data from PostgreSQL via Prisma, sends structured payloads to the AI Service, and persists AI-generated insights.

### Service Responsibilities

- **Rule Engine** (partially implemented): Deterministic analysis of student assessment data — risk scoring, flagging, basic insights
- **ML Service** (stub): Supposed to provide predictive modeling
- **LLM Service** (stub): Supposed to generate natural language explanations via OpenAI
- **API Layer**: Expose `/ai/health` and `/ai/analyze` endpoints

### Request Lifecycle

```
Client → Node.js API → AI Service (FastAPI) → Rule Engine → Response → Node.js persists to DB
```

The Node.js API (`apps/api/src/services/insights/insight.ai.service.ts`) orchestrates:
1. Fetches data from Prisma (student, class, subject data)
2. Calls AI Service endpoints (`/insights/class`, `/insights/student`, `/insights/subject`, `/insights/refresh`, `/insights/bulk`)
3. Validates AI response against a Joi schema (circuit breaker + retry + exponential backoff)
4. Persists the generated insight to the database

### Current AI Pipeline Lifecycle (at the Python service level)

```
POST /ai/analyze → StudentRequest → analyze_student() → rules engine → format response
```

### Key Integration Points

- Node.js `AIService` sends `{ type: "CLASS"|"STUDENT"|"SUBJECT", context: {...} }` to Python AI Service
- Python AI Service currently only has `/ai/analyze` accepting `StudentRequest` format
- **Mismatch**: Node.js expects endpoints that don't exist in Python, and Python has endpoints the Node.js side never calls

---

## 2. Current Strengths

| # | Strength | Location |
|---|----------|----------|
| S1 | Clean monolithic structure with logical directory organization | `app/` with core, schemas, services, utils |
| S2 | README documents the 3-layer system concept clearly | `README.md` |
| S3 | Architecture docs show clear intent | `docs/` directory |
| S4 | requirements.txt is pinned with specific versions | `requirements.txt` |
| S5 | .gitignore properly excludes Python artifacts, venv, env files | `.gitignore` |
| S6 | FastAPI selected — modern, async-native, well-suited for AI workloads | `main.py` |
| S7 | Rule engine logic is deterministic and simple | `services/ai_engine.py` |
| S8 | Multi-persona insight generation concept (teacher/parent/student) | `ai_engine.py:generate_insight()` |
| S9 | StudentRequest schema has basic field validation | `schemas/student.py` |

### Node.js API Strengths (complementary)

| # | Strength |
|---|----------|
| N1 | Circuit breaker pattern implemented in `AIService` |
| N2 | Exponential backoff with jitter for AI retries |
| N3 | Joi schema validation for AI request inputs |
| N4 | Joi schema validation for AI response outputs |
| N5 | Graceful fallback values when AI response has missing fields |
| N6 | `Promise.allSettled` for parallel bulk AI generation |
| N7 | Winston structured JSON logging with request correlation IDs |
| N8 | Three-tier rate limiting (global, auth, AI-specific) |
| N9 | Helmet security headers, CORS hardening, body size limits |
| N10 | Graceful shutdown with Prisma disconnect |
| N11 | Tenant isolation via `school_id` on all queries |
| N12 | Jest test infrastructure with unit tests for AI service, responses, schemas |
| N13 | Refresh token rotation with revocation |

---

## 3. Identified Weaknesses

### 3.1 CRITICAL — Bugs & Broken Code

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| B1 | **Typo: `pyandtic` instead of `pydantic`** | **CRITICAL** | `schemas/student.py:1` imports `from pyandtic import BaseModel` — will raise `ModuleNotFoundError` at runtime. |
| B2 | **Bug: `format_ai_response` uses literal `"status"` string** | **HIGH** | `utils/helper.py:29` returns `"status": "status"` instead of `"status": status` — parameter ignored. |
| B3 | **`calculate_confidence_score` computes average, not confidence** | **MEDIUM** | `utils/helper.py:17` computes `sum(scores)/len(scores)` which duplicates the average. |
| B4 | **Access to `student.class_id` but schema has no `class_id`** | **HIGH** | `ai_engine.py:20,70` access `student.class_id` but `StudentRequest` schema has no `class_id` field. |
| B5 | **Empty critical files** | **CRITICAL** | `core/config.py`, `schemas/ai.py`, `services/llm_service.py`, `services/ml_service.py`, `utils/http.py` are all empty (0 bytes). |

### 3.2 SECURITY

| # | Issue | Severity |
|---|-------|----------|
| SE1 | No CORS configuration | HIGH |
| SE2 | No input sanitization / prompt injection protection | HIGH |
| SE3 | No rate limiting — vulnerable to abuse and cost spikes | HIGH |
| SE4 | Secrets in .env not loaded (empty .env + empty config.py) | MEDIUM |
| SE5 | No authentication on AI endpoints | HIGH |
| SE6 | No request size limiting — DoS via large payloads | MEDIUM |
| SE7 | No security headers | MEDIUM |

### 3.3 PERFORMANCE

| # | Issue | Severity |
|---|-------|----------|
| P1 | Sync routes in async framework (`def` not `async def`) | MEDIUM |
| P2 | No caching — every request re-computes | HIGH |
| P3 | No connection pooling for external services | MEDIUM |
| P4 | Repeated calculations (scores iterated twice) | LOW |
| P5 | No async I/O for external calls | MEDIUM |

### 3.4 RELIABILITY & RESILIENCE

| # | Issue | Severity |
|---|-------|----------|
| R1 | No retry logic | HIGH |
| R2 | No circuit breaker | HIGH |
| R3 | No timeout configuration | HIGH |
| R4 | No fallback mechanisms | MEDIUM |
| R5 | No dependency-aware health check | LOW |
| R6 | No graceful degradation | MEDIUM |

### 3.5 MAINTAINABILITY

| # | Issue | Severity |
|---|-------|----------|
| M1 | Config management missing (config.py is empty) | CRITICAL |
| M2 | Basic logging — no JSON format, no correlation IDs | MEDIUM |
| M3 | No global exception handler | HIGH |
| M4 | No request/response middleware (IDs, timing) | MEDIUM |
| M5 | No type hints on service functions | MEDIUM |

### 3.6 API DESIGN

| # | Issue | Severity |
|---|-------|----------|
| A1 | Endpoint mismatch with Node.js consumer | CRITICAL |
| A2 | No API versioning | LOW |
| A3 | Buggy response format | MEDIUM |
| A4 | No OpenAPI customization | LOW |
| A5 | No response model schemas | MEDIUM |

### 3.7 AI/LLM ENGINEERING

| # | Issue | Severity |
|---|-------|----------|
| L1 | LLM service is empty (core feature missing) | CRITICAL |
| L2 | No prompt templates | HIGH |
| L3 | No prompt versioning | MEDIUM |
| L4 | No token tracking / cost monitoring | HIGH |
| L5 | No cost controls (max tokens, budget) | HIGH |
| L6 | No structured output validation — hallucination risk | HIGH |
| L7 | No model abstraction — hardcoded to OpenAI | MEDIUM |
| L8 | No fallback model | MEDIUM |
| L9 | No deterministic output controls (temperature, seed) | MEDIUM |

### 3.8 OBSERVABILITY

| # | Issue | Severity |
|---|-------|----------|
| O1 | No structured JSON logging | HIGH |
| O2 | No request correlation IDs | HIGH |
| O3 | No Prometheus metrics | HIGH |
| O4 | No Sentry/error tracking | HIGH |
| O5 | No audit logging | MEDIUM |
| O6 | No performance monitoring | MEDIUM |

### 3.9 DEVOPS

| # | Issue | Severity |
|---|-------|----------|
| D1 | No Dockerfile for AI service | CRITICAL |
| D2 | AI service not in root docker-compose.yml | HIGH |
| D3 | No CI pipeline for AI service | HIGH |
| D4 | No Docker health check | LOW |
| D5 | No production server config (gunicorn/uvicorn workers) | MEDIUM |

### 3.10 TESTING

| # | Issue | Severity |
|---|-------|----------|
| T1 | Zero tests in AI service | CRITICAL |
| T2 | No test framework (pytest not in requirements) | CRITICAL |
| T3 | No AI response tests | HIGH |
| T4 | No integration tests | HIGH |
| T5 | No schema tests | MEDIUM |

### 3.11 DATA VALIDATION

| # | Issue | Severity |
|---|-------|----------|
| V1 | No field constraints (score/total_marks accept any float) | MEDIUM |
| V2 | No Pydantic validators for cross-field validation | MEDIUM |
| V3 | No enum validation for exam_type | LOW |
| V4 | No response model validation | HIGH |

### 3.12 COST OPTIMIZATION

| # | Issue | Severity |
|---|-------|----------|
| C1 | No caching of AI responses | HIGH |
| C2 | No token budgeting | HIGH |
| C3 | No model tier selection | MEDIUM |
| C4 | No batching for bulk operations | MEDIUM |

### 3.13 TECHNICAL DEBT

| # | Issue | Severity |
|---|-------|----------|
| TD1 | llm_service.py and ml_service.py are empty stubs | MEDIUM |
| TD2 | schemas/ai.py is empty | MEDIUM |
| TD3 | utils/http.py is empty | LOW |
| TD4 | core/config.py is empty | HIGH |
| TD5 | Plain text docs (no Mermaid diagrams, no ADRs) | LOW |

---

## 4. Risk Matrix

| ID | Risk | Severity | Likelihood | Business Impact | Priority |
|----|------|----------|------------|----------------|----------|
| B1 | `pyandtic` ImportError — service won't start | Critical | Certain | Service completely down | **P0** |
| B4 | `class_id` AttributeError on /analyze | Critical | Certain | Endpoint broken | **P0** |
| B2 | `format_ai_response` wrong status field | High | Certain | Incorrect API responses | **P0** |
| D1 | No Dockerfile for AI service | Critical | Certain | Cannot deploy | **P0** |
| D2 | AI service not in docker-compose | Critical | Certain | No local orchestration | **P0** |
| A1 | Endpoint mismatch with Node.js consumer | Critical | Certain | AI features broken end-to-end | **P0** |
| L1 | LLM service missing — core feature absent | Critical | Certain | No AI-generated text | **P0** |
| M1 | No config management | Critical | Certain | Environment misconfiguration | **P0** |
| T1 | Zero tests | Critical | Certain | Regression risk | **P1** |
| SE3 | No rate limiting | High | Medium | Cost spike / abuse | **P1** |
| R1 | No retry logic | High | Medium | Transient failures cause errors | **P1** |
| O1 | No structured logging | High | Medium | Debugging impossible in production | **P1** |
| D3 | No CI pipeline | High | Medium | Quality regressions | **P1** |
| L4 | No token tracking | High | Medium | Unbounded costs | **P2** |
| P2 | No caching | Medium | Low | Unnecessary recomputation | **P2** |

---

## 5. Stepwise Improvement Plan

### Phase 0 — Bug Fixes (P0 — Must Fix Immediately)

| Step | Fix | Files |
|------|-----|-------|
| 0.1 | Fix `pyandtic` → `pydantic` import | `schemas/student.py` |
| 0.2 | Fix `format_ai_response` status param | `utils/helper.py` |
| 0.3 | Add `class_id` to `StudentRequest` schema | `schemas/student.py`, `services/ai_engine.py` |
| 0.4 | Fix `calculate_confidence_score` to measure actual confidence | `utils/helper.py` |

### Phase 1 — Foundation: Config, Logging, Error Handling (P0)

| Step | Change | Files |
|------|--------|-------|
| 1.1 | Implement `core/config.py` with Pydantic `Settings` | `core/config.py`, `main.py` |
| 1.2 | Upgrade logging to structured JSON with correlation IDs | `core/logging.py`, `main.py` |
| 1.3 | Add global exception handler middleware | `main.py` |
| 1.4 | Add CORS middleware | `main.py` |

### Phase 2 — API Alignment with Node.js Consumer (P0)

| Step | Change | Files |
|------|--------|-------|
| 2.1 | Add `/insights/class`, `/insights/student`, `/insights/subject` endpoints | `routes.py`, `ai_engine.py` (refactor) |
| 2.2 | Add `/insights/refresh` and `/insights/bulk` endpoints | `routes.py` |
| 2.3 | Create request/response Pydantic models for insights | `schemas/ai.py` |
| 2.4 | Add `/api/v1/` version prefix | `routes.py` |

### Phase 3 — LLM Service (P0)

| Step | Change | Files |
|------|--------|-------|
| 3.1 | Implement OpenAI client with configurable model/temp/seed | `services/llm_service.py` |
| 3.2 | Create prompt templates module with versioning | new `services/prompts.py` |
| 3.3 | Add Pydantic response models for LLM outputs | `schemas/ai.py` |
| 3.4 | Add retry + timeout + token tracking | `services/llm_service.py` |
| 3.5 | Implement multi-persona generation | `services/prompts.py` |
| 3.6 | Wire LLM into analysis pipeline | `services/ai_engine.py` |

### Phase 4 — ML Service Stub (P1)

| Step | Change | Files |
|------|--------|-------|
| 4.1 | Implement ML service base class | `services/ml_service.py` |
| 4.2 | Add basic risk prediction placeholder | `services/ml_service.py` |
| 4.3 | Integrate ML into pipeline | `services/ai_engine.py` |

### Phase 5 — Resilience (P1)

| Step | Change | Files |
|------|--------|-------|
| 5.1 | Add retry decorator with exponential backoff | `utils/http.py` |
| 5.2 | Add circuit breaker for OpenAI calls | `services/llm_service.py` |
| 5.3 | Add timeout configuration | `core/config.py` |
| 5.4 | Add fallback mechanism for LLM unavailability | `services/ai_engine.py` |
| 5.5 | Add dependency-aware health check | `routes.py` |

### Phase 6 — Security (P1)

| Step | Change | Files |
|------|--------|-------|
| 6.1 | Add rate limiting middleware | `main.py` |
| 6.2 | Add input sanitization | new `utils/sanitize.py` |
| 6.3 | Add security headers | `main.py` |
| 6.4 | Add request size limiting | `main.py` |

### Phase 7 — Testing (P1)

| Step | Change | Files |
|------|--------|-------|
| 7.1 | Add pytest + pytest-asyncio | `requirements.txt` |
| 7.2 | Add unit tests for rule engine | new `tests/` directory |
| 7.3 | Add unit tests for schemas | new `tests/` directory |
| 7.4 | Add unit tests for LLM service (mock OpenAI) | new `tests/` directory |
| 7.5 | Add integration tests for API endpoints | new `tests/` directory |
| 7.6 | Add test fixtures and factories | new `tests/` directory |

### Phase 8 — Performance & Caching (P2)

| Step | Change | Files |
|------|--------|-------|
| 8.1 | Add in-memory cache for repeated analyses | new `services/cache.py` |
| 8.2 | Convert routes to async | `routes.py` |
| 8.3 | Add Redis cache support (configurable) | `core/config.py`, `services/cache.py` |

### Phase 9 — Observability (P2)

| Step | Change | Files |
|------|--------|-------|
| 9.1 | Add Prometheus metrics endpoint | `main.py`, `requirements.txt` |
| 9.2 | Add request timing/logging middleware | `core/logging.py` |
| 9.3 | Add Sentry integration | `main.py`, `requirements.txt` |

### Phase 10 — DevOps (P0 - P1)

| Step | Change | Files |
|------|--------|-------|
| 10.1 | Create production Dockerfile (multi-stage) | new `Dockerfile` |
| 10.2 | Add AI service to root docker-compose.yml | `docker-compose.yml` |
| 10.3 | Add GitHub Actions CI workflow for AI service | `.github/workflows/ci.yml` |
| 10.4 | Add Docker health checks | `Dockerfile` |
| 10.5 | Add uvicorn production config | new `gunicorn.conf.py` |

### Phase 11 — Schema Hardening (P2)

| Step | Change | Files |
|------|--------|-------|
| 11.1 | Add field validators (positive scores, score <= total_marks) | `schemas/student.py` |
| 11.2 | Add enum constraints for exam_type | `schemas/student.py` |
| 11.3 | Add strict Pydantic response models | `schemas/ai.py` |
| 11.4 | Add ConfigDict for strict mode | `schemas/*.py` |

### Phase 12 — Cost Optimization (P2)

| Step | Change | Files |
|------|--------|-------|
| 12.1 | Implement semantic caching for LLM responses | `services/llm_service.py` |
| 12.2 | Add token budget management | `core/config.py` |
| 12.3 | Add model tier selection | `services/llm_service.py` |
| 12.4 | Add request deduplication | `services/ai_engine.py` |

### Phase 13 — Documentation (P3)

| Step | Change | Files |
|------|--------|-------|
| 13.1 | Update README with accurate architecture | `README.md` |
| 13.2 | Add Mermaid architecture diagrams | `docs/` |
| 13.3 | Add OpenAPI documentation customizations | `routes.py` |
| 13.4 | Add ADR for key decisions | `docs/adr/` |

---

## 6. Git Commit Strategy

```
# Phase 0 — Bug Fixes
fix(ai-service): fix pyandtic import typo to pydantic
fix(ai-service): fix format_ai_response using literal "status" string
fix(ai-service): add class_id field to StudentRequest schema
fix(ai-service): fix calculate_confidence_score to measure variance

# Phase 1 — Foundation
feat(ai-service): add Pydantic Settings config with env validation
feat(ai-service): add structured JSON logging with correlation IDs
feat(ai-service): add global exception handler and CORS middleware

# Phase 2 — API Alignment
feat(ai-service): add insight generation endpoints matching Node.js contract
feat(ai-service): refactor ai_engine to support multiple insight types
feat(ai-service): add request/response Pydantic models for insights API

# Phase 3 — LLM Service
feat(ai-service): implement OpenAI LLM service with prompt management
feat(ai-service): add structured LLM output validation with Pydantic
feat(ai-service): add multi-persona insight prompts

# Phase 4 — ML Service
feat(ai-service): implement ML service base with risk prediction placeholder

# Phase 5 — Resilience
feat(ai-service): add retry decorator with exponential backoff
feat(ai-service): add circuit breaker for OpenAI dependencies
feat(ai-service): add dependency-aware health check endpoint

# Phase 6 — Security
feat(ai-service): add rate limiting middleware
feat(ai-service): add input sanitization and security headers

# Phase 7 — Testing
test(ai-service): add pytest config and test infrastructure
test(ai-service): add unit tests for rule engine, schemas, LLM service
test(ai-service): add integration tests for API endpoints

# Phase 8 — Performance
perf(ai-service): add in-memory caching for repeated analyses
perf(ai-service): convert routes to async for non-blocking I/O

# Phase 9 — Observability
feat(ai-service): add Prometheus metrics endpoint
feat(ai-service): add request timing and logging middleware

# Phase 10 — DevOps
docker(ai-service): create production Dockerfile with multi-stage build
docker(ai-service): add AI service to root docker-compose.yml
ci(ai-service): add GitHub Actions CI workflow

# Phase 11 — Schema Hardening
feat(ai-service): add Pydantic validators and enum constraints
feat(ai-service): add strict response model validation

# Phase 12 — Cost Optimization
perf(ai-service): add semantic caching for LLM responses
perf(ai-service): add token budget management and model tiers

# Phase 13 — Documentation
docs(ai-service): update README with accurate setup and architecture
docs(ai-service): add Mermaid diagrams and OpenAPI customization
```

---

## 7. Clarification Questions

**Q1**: The `StudentRequest` schema lacks `class_id` but the engine uses it. Should `class_id` be added to the schema? What other fields from the Node.js side might need support?

**Q2**: LLM prompts generate 3 personas (teacher, parent, student). Any specific requirements for tone, length, language, or content per persona?

**Q3**: For the ML service — is there an existing model/dataset, or should this remain a placeholder stub?

**Q4**: Deployment targets? (Kubernetes, single VM, serverless?) This affects Dockerfile and scaling design.

**Q5**: OpenAI model preference? (gpt-4, gpt-4o-mini, etc.)

**Q6**: Expected scale? (requests/second, number of schools, concurrent users)

**Q7**: Any existing monitoring stack? (Sentry, DataDog, Prometheus/Grafana?)

---

## 8. Execution Order

```
Phase 0  →  Bug Fixes (P0)
Phase 1  →  Foundation: Config, Logging, Error Handling (P0)
Phase 2  →  API Alignment with Node.js (P0)
Phase 3  →  LLM Service Implementation (P0)
Phase 10 →  DevOps: Docker + docker-compose (P0)
Phase 5  →  Resilience & Reliability (P1)
Phase 6  →  Security Hardening (P1)
Phase 7  →  Testing Infrastructure (P1)
Phase 4  →  ML Service Stub (P1)
Phase 8  →  Performance & Caching (P2)
Phase 9  →  Observability (P2)
Phase 11 →  Schema & Validation Hardening (P2)
Phase 12 →  Cost Optimization (P2)
Phase 13 →  Documentation (P3)
```

---

## 9. Rollback Considerations

- **Phase 2 (API Alignment)**: Keep existing `/ai/analyze` endpoint; add new endpoints alongside. Old endpoint can be deprecated.
- **Phase 3 (LLM Service)**: LLM is additive — rule engine continues to work without it. An `ENABLE_LLM` feature flag can control activation.
- **Phase 10 (DevOps)**: Docker and CI are additive — they don't change application code.

### Breaking Changes
- Phase 0.2: `format_ai_response` status field fix — consumers relying on `"status": "status"` will need updating
- Phase 11: Schema hardening may reject previously accepted but invalid data

---

## 10. Summary of Impact

| Metric | Before | After |
|--------|--------|-------|
| Working endpoints | 2 (1 broken) | 7+ |
| Config management | None | Pydantic Settings with env validation |
| Logging | Text-based | Structured JSON with correlation IDs |
| Error handling | Unhandled exceptions | Global handler with consistent responses |
| Security | No protection | Rate limiting, CORS, input sanitization |
| LLM integration | Missing | Full OpenAI integration with prompt management |
| ML integration | Missing | Clean abstraction for future model deployment |
| Resilience | None | Retries, circuit breaker, timeouts, fallbacks |
| Testing | None | pytest suite with unit + integration tests |
| Docker | None | Multi-stage build in compose |
| CI/CD | None | GitHub Actions automated testing |
| Observability | None | Metrics, tracing, request logging |
| Caching | None | In-memory + Redis-ready caching |
| Cost controls | None | Token tracking, budget management, model tiers |
