# Research & Technical Decisions

This document captures technical evaluations, trade-off analyses, and architecture decisions made during the evolution of ElimuSight.

## Technology Evaluations

| Decision | Chosen | Alternatives Considered | Rationale |
|---|---|---|---|
| Frontend Framework | React 18 | Vue, Svelte, Angular | Ecosystem maturity, TanStack suite, hiring pool |
| Backend Framework | Express 5 | Fastify, Hono, NestJS | Ecosystem, middleware pattern, team familiarity |
| ORM | Prisma 5 | Drizzle, TypeORM, Kysely | Schema-first, migration tooling, type safety |
| AI Framework | FastAPI | Flask, Django | Async-native, Pydantic integration, OpenAPI auto-docs |
| State Management | TanStack Query + Zustand | Redux, RTK Query, SWR | Separation of server/client state, minimal boilerplate |
| Validation (backend) | Joi | Zod, Yup, Ajv | Mature, extensible, abortEarly:false support |
| Validation (frontend) | Zod | Joi, Yup | Runtime + TypeScript inference (z.infer) |
| Styling | Tailwind CSS | CSS Modules, Styled Components | Utility-first, design token system, bundle size |
| Routing | TanStack Router v1 | React Router v6/v7 | First-class TypeScript inference, code-based route tree |

## Architecture Decisions

See [Architectural Trade-offs](architecture/architectural-trade-offs.md) for detailed analysis.

### Key Decisions

1. **Layered Modular Monolith** — not microservices. Simplifies deployment, avoids distributed system complexity at current scale.
2. **API Backend as AI Proxy** — frontend never calls AI service directly. Backend handles auth, data fetching, persistence, circuit breaker.
3. **Separate AI Service (Python)** — not embedding AI in Node.js. Python has superior ML/LLM ecosystem (scikit-learn, OpenAI SDK, numpy).
4. **Rule Engine + ML + LLM** — 3-layer intelligence with fallbacks. Rule engine always runs; ML and LLM are feature-gated.
5. **Multi-tenant via school_id** — not database-per-tenant. Simpler ops at current scale; row-level isolation via middleware.
