# ElimuSight

> AI-Powered School Intelligence Platform

A multi-tenant SaaS platform that transforms raw school data into actionable intelligence. Built for the CBC (Competency-Based Curriculum) framework with AI-powered insights, analytics, and school management tools.

## Architecture

```
├── apps/
│   ├── web/              # React + TanStack Router frontend
│   ├── api/              # Express.js + Prisma + PostgreSQL backend
│   └── ai-service/       # Python FastAPI AI microservice
├── packages/             # Shared packages (monorepo scaffolding)
├── infra/                # Docker, nginx, Terraform configs
└── .github/workflows/    # CI/CD pipelines
```

## Repo Overview

| App | Stack | Description |
|-----|-------|-------------|
| `apps/web` | React 18, TanStack Router, TanStack Query, Tailwind CSS | School dashboard, analytics, admin panel |
| `apps/api` | Express.js, Prisma, PostgreSQL, JWT | REST API, auth, role-based access, audit logging |
| `apps/ai-service` | FastAPI, OpenAI, scikit-learn | Rule engine, ML trends, LLM-powered insight generation |

## Quick Start

```bash
cp apps/api/.env.example apps/api/.env
docker compose up
```

See each app's README for detailed setup:

- [Web Frontend](apps/web/README.md)
- [API Backend](apps/api/README.md)
- [AI Service](apps/ai-service/README.md)

## Roles

| Role | Scope |
|------|-------|
| `SUPER_ADMIN` | Platform-wide — manage tenants, users, billing, audit |
| `ADMIN` | Single school — manage classes, teachers, students |
| `HEADTEACHER` | Single school — academic oversight |
| `TEACHER` | Assigned classes — assessments, insights |
| `ACCOUNTANT` | Single school — financial data |

## Key Features

- Multi-tenant school management
- CBC assessment tracking and analytics
- AI-generated student performance insights
- Super admin dashboard (platform-wide management)
- Audit logging for all admin actions
- Role-based access control
- JWT + refresh token authentication
