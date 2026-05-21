# ElimuSight — Engineering Documentation Hub

> **Single source of truth** for all engineering knowledge, architecture decisions, and system documentation.

## Quick Links

| Document | Description |
|---|---|
| [Architecture Overview](architecture/elimu-sight-architecture.md) | System design, data flow, route mapping |
| [System Design](architecture/system-design.md) | Layered architecture analysis |
| [Architectural Trade-offs](architecture/architectural-trade-offs.md) | Design decisions and consequences |
| [Full Codebase Audit](audit/full-codebase-audit.md) | Security, performance, quality review |
| [PRD / Spec](specs/prp.md) | Product requirements |
| [API Plan](../plans/implementation/initial-api-plan.md) | Backend evolution plan |
| [AI Service Plan](../plans/implementation/initial-ai-service-plan.md) | AI service evolution plan |
| [User Flow](guides/user-flow.md) | Frontend user journeys |

## Repository Structure

```
elimu-sight/
├── apps/
│   ├── web/              # React 18 + TanStack Router frontend
│   ├── api/              # Express 5 + Prisma + PostgreSQL backend
│   └── ai-service/       # Python FastAPI AI microservice
├── packages/             # Shared packages
├── shared/               # Shared types
├── infra/                # Docker, nginx, Terraform
├── scripts/              # Build and deploy scripts
├── docs/                 # ← You are here
└── tests/                # Integration and E2E tests
```

## Setup

```bash
cp apps/api/.env.example apps/api/.env
docker compose up
```

See each app's README for detailed setup.
