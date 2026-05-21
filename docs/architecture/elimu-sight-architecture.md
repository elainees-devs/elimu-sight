# ElimuSight Architecture

> AI-Powered School Intelligence Platform — Architecture Overview

---

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React/Vite)                       │
│                     port 5173 / Vercel                          │
│                                                                  │
│  apiClient (axios)                                               │
│  baseURL: VITE_API_URL || '/api/v1'                             │
│  └─ auto-attaches JWT + X-School-Id headers                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API Backend (Node.js/Express)                  │
│                        port 5000                                │
│                                                                  │
│  Middleware pipeline:                                            │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Rate     │→ │ JWT Auth  │→ │ Role     │→ │ Validation    │  │
│  │ Limiter  │  │ (verify)  │  │ Authorize│  │ (Joi schema)  │  │
│  └──────────┘  └───────────┘  └──────────┘  └───────────────┘  │
│                                                                  │
│  AI Flow (via AIController → InsightAIService):                  │
│  1. Receive { studentId, schoolId } from frontend               │
│  2. Fetch student + assessments from PostgreSQL via Prisma      │
│  3. Call AIService (axios) → Python AI Service on :8000         │
│  4. Persist AI response to `insights` table                     │
│  5. Return saved insight to frontend                            │
│                                                                  │
│  Non-AI Flow (InsightCRUD):                                      │
│  GET/POST/PATCH/DELETE on `insights` table directly (no AI)     │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP (axios, 15s timeout, circuit breaker)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                AI Service (Python FastAPI)                        │
│                      port 8000                                   │
│                                                                  │
│  Routes (prefix: /api/v1):                                       │
│  ┌──────────────────────┬────────────────────────────────────┐   │
│  │ POST /insights/student│ → ai_engine.analyze_student()     │   │
│  │ POST /insights/class  │ → ai_engine.analyze_class()       │   │
│  │ POST /insights/subject│ → ai_engine.analyze_subject()     │   │
│  │ POST /insights/refresh│ → re-runs analysis (stub)         │   │
│  │ POST /insights/bulk   │ → queues multi-entity generation  │   │
│  │ GET  /health          │ → dependency check                │   │
│  └──────────────────────┴────────────────────────────────────┘   │
│                                                                  │
│  Internal Pipeline (ai_engine.py):                               │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐                         │
│  │ Rule    │→ │ LLM      │→ │ ML      │                         │
│  │ Engine  │  │ (OpenAI) │  │ (stats) │                         │
│  └─────────┘  └──────────┘  └─────────┘                         │
│  → Returns { title, summary, data, confidenceScore }            │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                            │
│                                                                  │
│  Tables: schools, users, students, classes, subjects,            │
│          assessments, insights, ai_logs, refresh_tokens          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack Summary

| Layer | Technology | Location |
|---|---|---|
| Frontend | React 18, TanStack Router, TanStack Query, Zustand, Tailwind CSS, Vite | `apps/web/` |
| API Backend | Node.js, Express, TypeScript, Prisma ORM | `apps/api/` |
| AI Service | Python, FastAPI, OpenAI, scikit-learn | `apps/ai-service/` |
| Database | PostgreSQL 15 | Local / Docker |

---

## Route Architecture

### Frontend Routes (TanStack Router)

```
/  (Landing Page)
└── /auth
│   ├── /auth/login        [LoginForm]
│   └── /auth/register     [RegisterForm]
└── /dashboard  (ProtectedRoute + RoleRoute)
    ├── /                    [OverviewPage]    → StatsGrid, Alerts, Activity
    ├── /analytics           [AnalyticsPage]   → Charts, Risk Matrix
    ├── /settings            [SettingsPage]    → Account/School settings
    ├── /students            [StudentListPage]
    │   └── /:id             [StudentDetailPage]
    ├── /assessments         [AssessmentListPage]
    │   ├── /new             [AssessmentCreatePage]
    │   └── /:id             [AssessmentDetailPage]
    ├── /insights            [InsightListPage] → Generator + List
    │   └── /:id             [InsightDetailPage]
    ├── /classes             [ClassListPage]
    │   └── /:id             [ClassDetailPage]
    ├── /subjects            [SubjectListPage]
    ├── /teachers            [TeacherListPage]
    └── /schools             [SchoolListPage]  → ADMIN only
        └── /:id             [SchoolDetailPage]
```

### Backend API Routes (Express)

| Prefix | Module | Key Routes |
|---|---|---|
| `/api/v1/auth` | Authentication | POST /login, POST /register, POST /refresh, POST /logout, GET /me |
| `/api/v1/schools` | Schools | CRUD |
| `/api/v1/classes` | Classes | CRUD |
| `/api/v1/students` | Students | CRUD, /class/:id, /count, /statistics, transfer |
| `/api/v1/subjects` | Subjects | CRUD |
| `/api/v1/users` | Users | CRUD |
| `/api/v1/class-subjects` | Class-Subject links | CRUD |
| `/api/v1/assessments` | Assessments | CRUD, /school/:id/count, /school/:id/exam-type/:type |
| `/api/v1/dashboard` | Dashboard stats | GET /stats, GET /recent-activity |
| `/api/v1/ai` | AI generation | POST /generate/class, /student, /subject, POST /refresh, POST /bulk, GET /health |
| `/api/v1/insights/crud` | Insight CRUD | POST /, GET /:id, PATCH /:id, DELETE /:id |
| `/api/v1/insights/query` | Insight queries | POST /bulk-generate, POST /archive, GET /school/:id, GET /schools/:id/trends |
| `/api/v1/insights/analytics` | Insight analytics | GET /classes/:id/insights, /students/:id/insights, /subjects/:id/insights, /insights/type/:type, /insights/period/:period |

---

## AI Data Flow (End-to-End)

### Example: Generate Student Insight

```
Step 1:  User clicks "Generate Insight" in [InsightGenerator] component
         ↓
Step 2:  [InsightListPage] calls generateInsight.mutate({ type: 'STUDENT_PERFORMANCE', studentId })
         ↓
Step 3:  [useGenerateInsight] maps type → endpoint:
            STUDENT_PERFORMANCE → POST /api/v1/ai/generate/student
         Body: { studentId, schoolId }
         (JWT + X-School-Id auto-attached by axios interceptor)
         ↓
Step 4:  [Express middleware chain]:
         aiRateLimiter → authenticateMiddleware (verify JWT)
         → authorize("ADMIN", "HEADTEACHER", "TEACHER")
         → validate(generateStudentInsightSchema)
         ↓
Step 5:  [AIController.generateStudentInsight]
         receives { studentId, schoolId }
         ↓
Step 6:  [InsightAIService.generateStudentInsight(studentId, schoolId)]
         6a.  Prisma: fetch student + assessments from DB
         6b.  Construct payload: { type: "STUDENT", context: { student, assessments } }
         6c.  Call AIService.generateStudentInsight(payload)
              ↓
Step 7:  [AIService] — axios POST http://localhost:8000/api/v1/insights/student
         (15s timeout, circuit breaker, 3 retries with exponential backoff)
              ↓
Step 8:  [Python FastAPI] — POST /api/v1/insights/student
         8a.  ai_engine.analyze_student()
         8b.  Rule-based risk scoring → LLM (OpenAI gpt-4o-mini) → ML trend analysis
         8c.  Returns { title, summary, data, confidenceScore }
              ↓
Step 9:  [Back to InsightAIService]
         9a.  Normalize response
         9b.  InsightCrudService.createInsight() → persist to `insights` table
         9c.  Return saved insight to controller
              ↓
Step 10: [AIController] → sendCreated(res, insight, "Student insight generated")
              ↓
Step 11: [Frontend] receives Insight object
         → queryClient.invalidateQueries(['insights', 'school', schoolId])
         → InsightList re-renders with new insight
```

---

## Route Mapping: Frontend → API → AI Service

| Frontend Hook | Calls API Route | API Body | AI Service Called |
|---|---|---|---|
| `useGenerateInsight` (CLASS_PERFORMANCE) | `POST /ai/generate/class` | `{ classId, schoolId }` | `POST /api/v1/insights/class` |
| `useGenerateInsight` (STUDENT_PERFORMANCE) | `POST /ai/generate/student` | `{ studentId, schoolId }` | `POST /api/v1/insights/student` |
| `useGenerateInsight` (SUBJECT_TREND) | `POST /ai/generate/subject` | `{ subjectId, schoolId }` | `POST /api/v1/insights/subject` |
| `useRefreshInsight` | `POST /ai/refresh` | `{ insightId }` | `POST /api/v1/insights/refresh` |
| `insightClient.generateBulk` | `POST /insights/query/bulk-generate` | `{ schoolId, classId?, subjectId? }` | ❌ DB-only placeholders |
| `insightClient.listBySchool` | `GET /insights/query/school/:id` | query params | ❌ DB query only |
| `insightClient.get` | `GET /insights/crud/:id` | — | ❌ DB query only |
| `insightClient.create` | `POST /insights/crud` | insight data | ❌ DB insert only |

### Type-to-Endpoint Mapping (in `useGenerateInsight`)

| Insight Type | API Endpoint | Required ID |
|---|---|---|
| `CLASS_PERFORMANCE` | `POST /ai/generate/class` | `classId` |
| `TERM_ANALYSIS` | `POST /ai/generate/class` | `classId` |
| `RECOMMENDATION` | `POST /ai/generate/class` | `classId` |
| `STUDENT_PERFORMANCE` | `POST /ai/generate/student` | `studentId` |
| `PREDICTION` | `POST /ai/generate/student` | `studentId` |
| `SUBJECT_TREND` | `POST /ai/generate/subject` | `subjectId` |

---

## Why the API Backend is a Required Proxy

The frontend **cannot** call the AI service directly:

| Concern | API Backend Handles | AI Service Has |
|---|---|---|
| Authentication | JWT verify, token expiry | None |
| Authorization | Role check (ADMIN/HEADTEACHER/TEACHER) | None |
| Rate limiting | Per-route (ai: 20 requests/15 min) | None |
| Validation | Joi schema validation before processing | Pydantic (no auth context) |
| Data fetching | Prisma queries for student/class/assessment data | No database access |
| Persistence | Saves AI results to `insights` table | Pure computation layer |
| Error handling | Circuit breaker (5 failures, 30s cooldown), 3 retries with exponential backoff, fallback values | No resilience |
| Multi-tenancy | `X-School-Id` header isolation per school | No tenant isolation |

---

## Key Architectural Decisions

### Frontend → Backend Communication
- All frontend API calls go through a single Axios instance (`apiClient`)
- `apiClient` auto-attaches `Authorization: Bearer <token>` from Zustand auth store
- `apiClient` auto-attaches `X-School-Id` header from Zustand school store
- 30s request timeout
- 401 response → auto-clears auth store → redirects to login

### Backend → AI Service Communication
- HTTP calls via Axios (not direct import — different language runtimes)
- 15s timeout per request
- Circuit breaker: 5 consecutive failures triggers 30s cooldown
- Retry: 3 attempts with exponential backoff (1s-8s jittered delay)
- Retries only on 5xx and 429 status codes
- Joi validation of AI service response before persisting
- Graceful fallback to rule-based values if AI service is unreachable

### State Management
- **Server state**: TanStack Query — caching, background refetching, cache invalidation on mutations
- **Client state**: Zustand with localStorage persistence for auth tokens and school context
- No server state is duplicated in Zustand

### Route Protection
- `ProtectedRoute` — checks `isAuthenticated`, redirects to `/auth/login` if not
- `RoleRoute` — checks `user.role` against `allowedRoles`, shows "Access Denied" if unauthorized
- Sidebar nav items filtered by role in `_dashboard-layout.tsx`

---

## Cache Strategy

| Query Key | Stale Time | gcTime | Refetch on Mount |
|---|---|---|---|
| `['dashboard', 'stats', ...]` | 30s | 5 min | Yes |
| `['dashboard', 'recent-activity', ...]` | 30s | 5 min | Yes |
| `['students', ...]` | 60s | 5 min | Yes |
| `['assessments', ...]` | 30s | 5 min | Yes |
| `['classes', ...]` | 5 min | 10 min | No (static) |
| `['subjects', ...]` | 5 min | 10 min | No (static) |
| `['insights', ...]` | 2 min | 5 min | Yes |
| `['analytics', ...]` | 60s | 5 min | Yes |

---

## Database Schema

```
schools ──┬── users (JWT auth, role-based)
          ├── teachers (linked 1:1 to users)
          ├── classes (level, stream, academic_year, class_teacher)
          ├── subjects (name, code)
          ├── class_subjects (junction: class ↔ subject, with teacher)
          ├── students (admission_number, class_id, guardian)
          ├── assessments (student_id, subject_id, score, exam_type, term)
          ├── insights (AI-generated: title, summary, confidence, type)
          ├── ai_logs (request/response audit trail)
          └── refresh_tokens (JWT rotation)
```

---

## Project Structure

```
elimu-sight/
├── apps/
│   ├── api/                    # Node.js Express backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # Prisma migrations
│   │   └── src/
│   │       ├── ai/             # AI service HTTP client (circuit breaker, retry)
│   │       ├── config/         # Environment config
│   │       ├── controllers/    # Express route handlers
│   │       ├── mappers/        # DTO transformation (DB ↔ API)
│   │       ├── middlewares/    # Auth, validation, rate limiting, role
│   │       ├── routes/         # Route definitions
│   │       ├── schemas/        # Joi validation schemas
│   │       ├── services/       # Business logic
│   │       │   ├── insights/   # Insight CRUD, AI orchestration, analytics
│   │       │   └── ...
│   │       ├── types/          # Express type extensions
│   │       └── utils/          # Prisma client, JWT, logger, errors
│   │
│   ├── web/                    # React frontend
│   │   └── src/
│   │       ├── features/       # Domain modules (auth, dashboard, students, etc.)
│   │       │   └── {domain}/
│   │       │       ├── api/    # Axios API client
│   │       │       ├── components/  # UI components
│   │       │       ├── hooks/  # TanStack Query hooks
│   │       │       ├── schemas/# Zod validation
│   │       │       ├── types/  # TypeScript interfaces
│   │       │       └── index.ts
│   │       ├── providers/      # React context providers
│   │       ├── router/         # TanStack Router setup + guards
│   │       ├── routes/         # Page components per route
│   │       ├── shared/         # Reusable config, hooks, lib, schemas, types
│   │       ├── stores/         # Zustand stores
│   │       └── styles/         # Tailwind globals
│   │
│   └── ai-service/             # Python FastAPI AI service
│       └── app/
│           ├── api/routes.py   # FastAPI route definitions
│           ├── core/           # Config, settings
│           ├── services/       # AI engine, LLM, ML
│           ├── schemas/        # Pydantic request/response models
│           └── utils/          # Cache, prompts
│
├── packages/
│   ├── ui/                     # Shared UI components (React + Tailwind)
│   │   └── src/
│   │       ├── button.tsx, card.tsx, input.tsx, etc.
│   │       └── index.ts
│   ├── utils/                  # Shared utility functions
│   │   └── src/
│   │       └── index.ts       # capitalize, truncate, pluralize, generateInitials
│   └── config/                 # Shared config (eslint, tsconfig)
│       ├── eslint-preset.js
│       └── tsconfig.base.json
│
├── shared/
│   └── types/                  # Global type definitions
│       └── src/
│           ├── index.ts
│           ├── common.ts       # User, School, Class, Student, etc.
│           ├── api.ts          # ApiResponse, ApiPaginatedResponse
│           ├── pagination.ts   # PaginationParams, PaginationMeta
│           └── constants.ts    # ROLES, SUBSCRIPTION_PLANS, etc.
│
├── infra/                      # Deployment configs
│   ├── docker/
│   ├── nginx/
│   └── terraform/
│
├── scripts/                    # Deploy/migrate scripts
├── tests/                      # Integration/E2E tests (scaffold)
├── docs/                       # Single source of truth for knowledge
├── docker-compose.yml
├── turbo.json
├── tsconfig.base.json
└── package.json
```

---

## Deployment

| Service | Hosting | Port (Dev) | Port (Docker) |
|---|---|---|---|---|
| Frontend | Vercel (SPA) / Docker nginx | 5173 | 80 |
| API Backend | Render / Railway / VPS | 5000 | 3000 |
| AI Service | Render / Railway / VPS | 8000 | 8000 |
| PostgreSQL | Render / AWS RDS / Docker | 5432 | 5432 |

### Vite Proxy (Development)
In dev mode, Vite proxies `/api/v1` to the backend at `localhost:5000`. This avoids CORS issues during development. In production, the frontend is served from a CDN and makes direct API calls to the backend's public URL.

### Environment Variables

**`apps/web/.env`**
```env
VITE_API_URL=/api/v1
VITE_AI_SERVICE_URL=http://localhost:8000
```

**`apps/api/.env`**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/elimu_db
JWT_SECRET=...
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
AI_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

**`apps/ai-service/.env`**
```env
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://user:pass@localhost:5432/elimu_db
```
