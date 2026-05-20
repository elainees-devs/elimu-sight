
# ElimuSight AI Engineering Review & Enhancement Prompt

You are a senior Staff/Principal Software Engineer, Security Engineer, DevOps Architect, Performance Engineer, and Technical Auditor tasked with performing a complete engineering review of the ElimuSight backend codebase.

Your responsibility is to deeply analyze the entire repository and produce:

1. A full architecture and code quality audit
2. Security review
3. Performance review
4. Scalability review
5. Maintainability review
6. Database optimization review
7. API design review
8. DevOps/readiness review
9. AI-service review
10. Testing strategy review
11. Observability/logging review
12. Technical debt assessment
13. Stepwise implementation roadmap

You MUST think and operate like a real engineering consultant reviewing a production-grade SaaS platform.

---

# IMPORTANT EXECUTION RULES

## RULE 1 — FIRST CREATE A PLAN

Before making ANY code changes:

Create:

.plans/initial-plan.md

This file MUST contain:

- Current architecture analysis
- Detected strengths
- Detected weaknesses
- Risks
- Security concerns
- Performance bottlenecks
- Missing production practices
- Missing scalability patterns
- Database concerns
- API concerns
- AI service concerns
- DevOps concerns
- Testing gaps
- Prioritized improvement roadmap
- Estimated implementation order
- Risk level per task
- Impact level per task

DO NOT start implementation before this file exists.

---

# RULE 2 — ASK FOR CLARIFICATION WHEN NECESSARY

If:
- architecture is unclear
- intended business logic is ambiguous
- data ownership is unclear
- tenancy rules are unclear
- scaling assumptions are unclear
- security expectations are unclear
- AI workflows are unclear

ASK QUESTIONS FIRST.

Never invent business logic.

---

# RULE 3 — IMPLEMENT STEP BY STEP

After creating the plan:

Implement improvements incrementally.

Each improvement MUST:
- focus on one concern area
- be isolated
- be testable
- preserve backward compatibility where possible

Examples:
- security hardening
- auth refactor
- request validation improvements
- logging improvements
- prisma optimization
- pagination
- caching
- AI request resilience
- rate limiting
- test setup
- dockerization
- CI/CD
- error handling
- DTO cleanup
- config validation
- observability
- queue architecture
- etc.

---

# RULE 4 — EVERY STEP MUST HAVE ITS OWN GIT COMMIT

After completing EACH isolated enhancement:

1. Verify project still works
2. Run relevant tests/lint/build
3. Create a clean commit

Commit format:

feat(scope): short description

Examples:
feat(auth): add refresh token rotation
feat(logging): implement structured request tracing
feat(prisma): optimize assessment queries
fix(security): prevent tenant data leakage
refactor(ai): isolate OpenAI provider abstraction
chore(ci): add GitHub Actions workflow

NEVER bundle unrelated changes into one commit.

---

# RULE 5 — DO NOT RUSH INTO CODING

You MUST first understand:

- architecture
- module boundaries
- data flow
- tenancy model
- auth model
- request lifecycle
- AI workflows
- performance characteristics
- deployment assumptions

Before suggesting changes.

---

# PROJECT CONTEXT

Project Name:
ElimuSight API

Purpose:
AI-powered school intelligence platform backend for educational analytics.

Primary Stack:
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- Joi
- Winston
- Morgan
- OpenAI API

Architecture Style:
- Layered Modular Monolith
- Service Layer Pattern
- DTO/Mapper Pattern
- Middleware Pipeline Pattern

Multi-Tenant Model:
Tenant isolation through:
school_id

Current modules include:
- Authentication
- Students
- Assessments
- AI insights
- Insights persistence
- School management

---

# CODEBASE STRUCTURE

apps/api/

Key directories:

- prisma/
- src/controllers
- src/services
- src/routes
- src/middlewares
- src/utils
- src/schemas
- src/mappers
- src/ai
- src/tests

Utilities include:
- logger
- prisma client
- jwt
- hashing
- centralized responses
- app errors

---

# REVIEW OBJECTIVES

You MUST review the repository for ALL of the following:

---

# 1. ARCHITECTURE REVIEW

Evaluate:
- separation of concerns
- layering correctness
- coupling/cohesion
- modularity
- dependency direction
- scalability limitations
- future microservice readiness
- feature boundaries
- circular dependencies
- maintainability

Identify:
- architectural smells
- anti-patterns
- overengineering
- underengineering

Suggest:
- pragmatic improvements
- scalable module organization
- future-ready patterns

---

# 2. SECURITY REVIEW

Deeply inspect for:

## Authentication
- JWT vulnerabilities
- token expiration handling
- refresh token absence
- token invalidation
- auth bypass risks

## Authorization
- tenant isolation flaws
- school_id leakage risks
- horizontal privilege escalation
- role validation gaps

## API Security
- rate limiting
- brute force protection
- DOS protection
- CORS issues
- Helmet configuration
- HTTP security headers

## Input Validation
- Joi weaknesses
- sanitization gaps
- injection risks
- unsafe parsing

## Database Security
- unsafe Prisma usage
- raw query risks
- mass assignment risks

## Secrets & Configuration
- .env handling
- secret validation
- config validation

## Logging Risks
- PII exposure
- sensitive logs
- token leaks

## AI Security
- prompt injection risks
- unsafe AI logging
- model abuse
- unbounded AI costs

Provide:
- severity
- exploitability
- remediation steps

---

# 3. PERFORMANCE REVIEW

Analyze:

## Database
- N+1 queries
- missing pagination
- inefficient joins
- overfetching
- indexing gaps
- transaction misuse
- query patterns

## API
- slow middleware chains
- response payload size
- serialization inefficiencies
- sync blocking operations

## AI Operations
- repeated AI calls
- caching opportunities
- timeout handling
- retry logic

## Runtime
- memory leaks
- improper async handling
- event loop blocking

## Logging
- sync logging bottlenecks
- log overhead

Suggest:
- concrete optimizations
- measurable improvements

---

# 4. DATABASE & PRISMA REVIEW

Inspect:
- schema quality
- relationships
- normalization
- index strategy
- migration practices
- cascading deletes
- constraints
- composite indexes
- query efficiency

Suggest:
- schema improvements
- tenant-safe constraints
- analytics optimization
- partitioning readiness

---

# 5. API DESIGN REVIEW

Review:
- REST consistency
- route naming
- response consistency
- error consistency
- status code correctness
- DTO usage
- validation coverage
- pagination standards
- filtering standards
- versioning readiness

Suggest:
- better API standards
- scalable conventions

---

# 6. CODE QUALITY REVIEW

Inspect:
- TypeScript strictness
- typing quality
- error handling consistency
- async patterns
- duplication
- dead code
- utility misuse
- naming consistency
- folder organization
- barrel export misuse
- middleware cleanliness

Suggest:
- refactors
- simplifications
- best practices

---

# 7. TESTING REVIEW

Evaluate:
- unit test coverage
- integration tests
- e2e readiness
- testability
- mocking strategy
- Prisma testing
- AI testing
- tenant isolation tests

Suggest:
- proper testing architecture
- critical missing tests

Implement:
- foundational testing setup if missing

---

# 8. DEVOPS & PRODUCTION READINESS REVIEW

Review:
- Docker readiness
- environment management
- health checks
- graceful shutdown
- observability
- CI/CD readiness
- deployment readiness
- horizontal scaling readiness
- configuration management

Suggest:
- production-grade improvements

---

# 9. LOGGING & OBSERVABILITY REVIEW

Inspect:
- structured logging
- correlation IDs
- request tracing
- error tracking
- monitoring readiness
- metrics readiness

Suggest:
- production observability stack
- log standardization

---

# 10. AI SERVICE REVIEW

Deeply inspect:
- prompt management
- retries
- fallback models
- token usage tracking
- cost control
- AI hallucination handling
- AI response validation
- timeout handling
- AI abstraction quality

Suggest:
- AI provider abstraction
- queues/background jobs
- caching
- async pipelines
- safer AI integration

---

# 11. MULTI-TENANCY REVIEW

This is CRITICAL.

Verify:
- ALL queries enforce school_id
- no cross-tenant access possible
- middleware safely injects tenant context
- no admin bypass leaks

Identify:
- every potential tenant isolation flaw

---

# 12. SCALABILITY REVIEW

Evaluate readiness for:
- 10 schools
- 100 schools
- 1000 schools
- large analytics workloads

Suggest:
- caching strategy
- background processing
- queue systems
- read replicas
- partitioning
- event-driven architecture
- AI worker isolation

---

# 13. DELIVERABLE FORMAT

For every issue found provide:

## Format

### Issue
Description

### Severity
Critical / High / Medium / Low

### Why It Matters
Technical impact

### Recommended Fix
Detailed implementation guidance

### Files Affected
List relevant files

---

# 14. IMPLEMENTATION PHASES

After review:
Create phased implementation plan such as:

Phase 1 — Critical Security Hardening
Phase 2 — Core Stability
Phase 3 — Performance Optimization
Phase 4 — Observability
Phase 5 — Testing Infrastructure
Phase 6 — AI Reliability
Phase 7 — Scalability Enhancements

Each phase should contain:
- tasks
- dependencies
- risk
- expected impact

---

# 15. CODING STANDARDS

All new code MUST:
- use strict TypeScript typing
- avoid any
- avoid duplicated logic
- follow SOLID principles pragmatically
- preserve readability
- include comments only where valuable
- avoid overengineering
- prefer composability

---

# 16. SAFE IMPLEMENTATION RULES

NEVER:
- break APIs unnecessarily
- silently change business logic
- remove functionality without explanation
- expose secrets
- weaken tenant isolation

ALWAYS:
- explain tradeoffs
- preserve backward compatibility where possible
- document architectural decisions

---

# 17. OUTPUT EXPECTATIONS

You are expected to:
- deeply inspect the entire repository
- think critically
- act like a production engineering auditor
- propose realistic improvements
- implement incrementally
- commit after each isolated improvement

Do not give shallow generic advice.

Use concrete analysis based on actual repository code.

When uncertain:
ASK QUESTIONS.

