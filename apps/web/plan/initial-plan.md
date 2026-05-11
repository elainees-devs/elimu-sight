# ElimuSight Frontend Architecture Plan

## Overview

Enterprise-grade React + TypeScript frontend for the ElimuSight AI-powered school intelligence platform. Connects to a Node.js/Express/Prisma backend API and a Python FastAPI AI service.

## Tech Stack

| Layer | Choice |
|-------|--------|
| UI Library | React 18+ |
| Language | TypeScript (strict) |
| Build Tool | Vite |
| Routing | TanStack Router (programmatic) |
| Server State | TanStack Query |
| Client State | Zustand |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Styling | TailwindCSS v3.x |
| Charts | Recharts |
| Dates | date-fns |
| Utilities | clsx, tailwind-merge, class-variance-authority |

## Architecture Style

- **Feature-based modular monolith** — domain-driven frontend structure
- **Clean separation of concerns** — pages compose feature components
- **Enterprise React patterns** — providers, custom hooks, typed API layer
- **SaaS-ready** — multi-school scoping, role-based access, caching

## Folder Structure

```
web/
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   └── og-image.png
└── src/
    ├── main.tsx                          # App entry point
    ├── app.tsx                           # Root component
    ├── vite-env.d.ts
    ├── styles/
    │   └── globals.css                   # Tailwind directives + base styles
    ├── providers/
    │   ├── app-providers.tsx             # Composition root for all providers
    │   ├── auth-provider.tsx             # Auth session bootstrapper
    │   └── query-provider.tsx            # TanStack Query provider + devtools
    ├── router/
    │   ├── index.ts                      # Router instance export
    │   ├── route-tree.tsx                # Route tree definition
    │   └── protected-route.tsx           # Auth + role guard
    ├── routes/
    │   ├── __root.tsx                    # Root layout (all routes)
    │   ├── _auth-layout.tsx              # Public/auth layout (login, register)
    │   ├── _dashboard-layout.tsx         # Authenticated dashboard layout
    │   ├── index.tsx                     # Landing / redirect page
    │   ├── auth/
    │   │   ├── login-page.tsx
    │   │   └── register-page.tsx
    │   ├── dashboard/
    │   │   ├── overview-page.tsx
    │   │   ├── analytics-page.tsx
    │   │   └── settings-page.tsx
    │   ├── students/
    │   │   ├── student-list-page.tsx
    │   │   └── student-detail-page.tsx
    │   ├── assessments/
    │   │   ├── assessment-list-page.tsx
    │   │   ├── assessment-create-page.tsx
    │   │   └── assessment-detail-page.tsx
    │   ├── insights/
    │   │   ├── insight-list-page.tsx
    │   │   └── insight-detail-page.tsx
    │   ├── classes/
    │   │   ├── class-list-page.tsx
    │   │   └── class-detail-page.tsx
    │   ├── subjects/
    │   │   └── subject-list-page.tsx
    │   ├── teachers/
    │   │   └── teacher-list-page.tsx
    │   ├── schools/
    │   │   ├── school-list-page.tsx
    │   │   └── school-detail-page.tsx
    │   └── errors/
    │       ├── not-found-page.tsx
    │       └── error-page.tsx
    ├── features/
    │   ├── auth/
    │   │   ├── index.ts
    │   │   ├── api/auth-client.ts
    │   │   ├── components/login-form.tsx, register-form.tsx
    │   │   ├── hooks/use-login.ts, use-logout.ts, use-register.ts, use-current-user.ts
    │   │   ├── schemas/auth-schema.ts
    │   │   └── types/index.ts
    │   ├── students/
    │   │   ├── index.ts
    │   │   ├── api/student-client.ts
    │   │   ├── components/student-card.tsx, student-table.tsx, student-form.tsx
    │   │   ├── hooks/use-students.ts, use-student.ts, use-create-student.ts, use-update-student.ts, use-delete-student.ts
    │   │   ├── schemas/student-schema.ts
    │   │   └── types/index.ts
    │   ├── assessments/
    │   │   ├── index.ts
    │   │   ├── api/assessment-client.ts
    │   │   ├── components/assessment-card.tsx, assessment-table.tsx, assessment-form.tsx, score-input.tsx
    │   │   ├── hooks/use-assessments.ts, use-create-assessment.ts, use-update-assessment.ts, use-delete-assessment.ts
    │   │   ├── schemas/assessment-schema.ts
    │   │   └── types/index.ts
    │   ├── insights/
    │   │   ├── index.ts
    │   │   ├── api/insight-client.ts
    │   │   ├── components/insight-card.tsx, insight-list.tsx, insight-generator.tsx
    │   │   ├── hooks/use-insights.ts, use-generate-insight.ts, use-refresh-insight.ts
    │   │   ├── schemas/insight-schema.ts
    │   │   └── types/index.ts
    │   ├── analytics/
    │   │   ├── index.ts
    │   │   ├── api/analytics-client.ts
    │   │   ├── components/performance-chart.tsx, risk-matrix.tsx, trend-chart.tsx, summary-stats.tsx
    │   │   ├── hooks/use-performance-analytics.ts, use-risk-analysis.ts, use-trends.ts
    │   │   ├── schemas/analytics-schema.ts
    │   │   └── types/index.ts
    │   ├── subjects/
    │   │   ├── index.ts
    │   │   ├── api/subject-client.ts
    │   │   ├── components/subject-card.tsx, subject-form.tsx
    │   │   ├── hooks/use-subjects.ts, use-create-subject.ts
    │   │   ├── schemas/subject-schema.ts
    │   │   └── types/index.ts
    │   ├── classes/
    │   │   ├── index.ts
    │   │   ├── api/class-client.ts
    │   │   ├── components/class-card.tsx, class-table.tsx, class-form.tsx
    │   │   ├── hooks/use-classes.ts, use-class.ts, use-create-class.ts
    │   │   ├── schemas/class-schema.ts
    │   │   └── types/index.ts
    │   ├── teachers/
    │   │   ├── index.ts
    │   │   ├── api/teacher-client.ts
    │   │   ├── components/teacher-card.tsx, teacher-table.tsx
    │   │   ├── hooks/use-teachers.ts, use-create-teacher.ts
    │   │   ├── schemas/teacher-schema.ts
    │   │   └── types/index.ts
    │   ├── schools/
    │   │   ├── index.ts
    │   │   ├── api/school-client.ts
    │   │   ├── components/school-card.tsx, school-form.tsx
    │   │   ├── hooks/use-school.ts, use-schools.ts
    │   │   ├── schemas/school-schema.ts
    │   │   └── types/index.ts
    │   └── dashboard/
    │       ├── index.ts
    │       ├── api/dashboard-client.ts
    │       ├── components/stats-grid.tsx, recent-activity.tsx, quick-actions.tsx, alerts-widget.tsx
    │       ├── hooks/use-dashboard-stats.ts
    │       ├── schemas/dashboard-schema.ts
    │       └── types/index.ts
    ├── shared/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── index.ts
    │   │   │   ├── button.tsx
    │   │   │   ├── input.tsx
    │   │   │   ├── modal.tsx
    │   │   │   ├── table.tsx
    │   │   │   ├── card.tsx
    │   │   │   ├── badge.tsx
    │   │   │   ├── select.tsx
    │   │   │   ├── textarea.tsx
    │   │   │   ├── spinner.tsx
    │   │   │   ├── label.tsx
    │   │   │   ├── avatar.tsx
    │   │   │   ├── dropdown.tsx
    │   │   │   ├── pagination.tsx
    │   │   │   └── tabs.tsx
    │   │   ├── charts/
    │   │   │   ├── index.ts
    │   │   │   ├── bar-chart.tsx
    │   │   │   ├── line-chart.tsx
    │   │   │   ├── pie-chart.tsx
    │   │   │   └── area-chart.tsx
    │   │   ├── data-display/
    │   │   │   ├── index.ts
    │   │   │   ├── data-table.tsx
    │   │   │   ├── stat-card.tsx
    │   │   │   ├── empty-state.tsx
    │   │   │   └── page-header.tsx
    │   │   └── feedback/
    │   │       ├── index.ts
    │   │       ├── toast.tsx
    │   │       ├── alert.tsx
    │   │       ├── confirm-dialog.tsx
    │   │       └── error-boundary.tsx
    │   ├── hooks/
    │   │   ├── index.ts
    │   │   ├── use-debounce.ts
    │   │   ├── use-media-query.ts
    │   │   ├── use-local-storage.ts
    │   │   ├── use-toggle.ts
    │   │   ├── use-click-outside.ts
    │   │   └── use-intersection-observer.ts
    │   ├── lib/
    │   │   ├── axios.ts               # Axios instance with interceptors
    │   │   ├── query-client.ts         # TanStack Query client config
    │   │   ├── utils.ts               # General utility functions
    │   │   ├── constants.ts           # App-wide constants
    │   │   ├── formatters.ts          # Date, number, grade formatters
    │   │   └── cn.ts                  # Tailwind class merge utility
    │   ├── schemas/
    │   │   └── common-schemas.ts      # Shared Zod schemas (pagination, UUID, etc.)
    │   ├── types/
    │   │   ├── api.ts                 # API response/request types
    │   │   ├── common.ts              # Shared domain types
    │   │   ├── pagination.ts          # Pagination types
    │   │   └── navigation.ts          # Nav item types
    │   └── config/
    │       ├── routes.ts              # Route path constants
    │       ├── api-config.ts          # API base URLs, timeouts
    │       └── app-config.ts          # Feature flags, app settings
    └── stores/
        ├── index.ts
        ├── auth-store.ts              # Auth session (token, user, role)
        ├── school-store.ts            # Active school context
        └── ui-store.ts                # Sidebar state, theme prefs
```

## Architectural Decisions

### 1. Feature-Based Domain Architecture

Each backend domain gets a self-contained feature folder. Each owns its API client, components, hooks, schemas, and types — encapsulating all domain logic. This creates domain-driven frontend modules that are independently testable.

### 2. Route Pages vs. Feature Components

Route pages (in `routes/`) are thin composition layers — they import feature components and assemble them into pages. This keeps routing concerns separate from business logic.

### 3. TanStack Router (Programmatic)

We use programmatic route tree definition (`router/route-tree.tsx`), NOT file-based routing. This avoids TanStack Router's dot-notation file naming convention, letting us keep kebab-case throughout. Pathless layout routes (`_auth-layout.tsx`, `_dashboard-layout.tsx`) provide shared UI chrome.

### 4. Dual API Layer

| Backend | Base URL | Purpose |
|---------|----------|---------|
| Express API | `/api/v1/*` | CRUD, auth, business logic |
| FastAPI AI Service | direct or proxied | AI insight generation |

The Axios client (`shared/lib/axios.ts`) handles both via configurable base URLs and auth token injection.

### 5. State Architecture

| Concern | Tool | Purpose |
|---------|------|---------|
| Server state | TanStack Query | Caching, refetching, optimistic updates |
| Client state | Zustand | Auth session, school scope, UI prefs |
| Form state | React Hook Form + Zod | Local form state + schema validation |

### 6. Auth System

- **`stores/auth-store.ts`** — token storage, user session, role
- **`providers/auth-provider.tsx`** — bootstraps auth on load, token refresh
- **`router/protected-route.tsx`** — route guard enforcing auth + roles

### 7. Shared UI System

Custom-built with React + TailwindCSS v3 + `class-variance-authority`. No shadcn/ui. Components are:
- Presentational only — no business logic
- Styled via Tailwind utility classes composed through `cn()` helper
- Organized into: **ui/** (primitives), **charts/** (Recharts wrappers), **data-display/** (composite), **feedback/** (user-facing)

### 8. SaaS Scalability

- **School-scoped data** — Axios interceptor injects `schoolId` from `school-store`
- **Role-based access** — route guards + component-level visibility
- **Caching** — TanStack Query with stale times, background refetching
- **Lazy loading ready** — feature modules ready for code splitting

## Backend API Routes (for reference)

All mounted under `/api/v1/`:

| Endpoint | Domain |
|----------|--------|
| `/auth/*` | Register, login, refresh, logout, me |
| `/schools/*` | School CRUD |
| `/classes/*` | Class management |
| `/students/*` | Student CRUD, transfer, statistics |
| `/subjects/*` | Subject management |
| `/users/*` | User management |
| `/class-subjects/*` | Class-subject assignments |
| `/assessments/*` | Assessment CRUD |
| `/ai/*` | AI insight generation (class, student, subject, bulk, refresh) |
| `/insights/crud/*` | Insight CRUD |
| `/insights/query/*` | Insight queries |
| `/insights/analytics/*` | Insight analytics |

## Prisma Models (frontend types mirror these)

schools, users, teachers, classes, class_subjects, students, subjects, assessments, insights, ai_logs, refresh_tokens

## User Roles

`ADMIN`, `HEADTEACHER`, `TEACHER`

## Setup Commands

```bash
# From monorepo root:
cd apps/web

# Initialize Vite project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install react react-dom
npm install @tanstack/react-router
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand
npm install axios
npm install react-hook-form @hookform/resolvers zod
npm install clsx tailwind-merge class-variance-authority
npm install recharts
npm install date-fns

# Install dev dependencies
npm install -D typescript @types/react @types/react-dom
npm install -D vite @vitejs/plugin-react
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D @tanstack/router-vite-plugin
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier prettier-plugin-tailwindcss
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Initialize TailwindCSS v3
npx tailwindcss init -p --ts
```
