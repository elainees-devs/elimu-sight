# Dashboard Design Plan — Role-Based Dashboards

## Current State

- Single shared dashboard — all 4 roles see the identical layout, nav, and pages
- `ProtectedRoute` supports `allowedRoles` prop but it's never used
- Nav sidebar is hardcoded in `_dashboard-layout.tsx` — every link shown to every user
- Dashboard components (`StatsGrid`, `QuickActions`, `RecentActivity`, `AlertsWidget`) exist but are **never rendered** — `overview-page.tsx` is a placeholder
- Backend has **no dashboard routes** — only insight analytics endpoints exist
- Frontend analytics feature module is fully structured (hooks, API client, types, components) but no backend serves its endpoints

---

## Role Definitions & Capabilities

| Role | Scope | Primary Actions |
|---|---|---|
| **ADMIN** | School-wide | Full CRUD on all entities, user management, settings, billing |
| **HEADTEACHER** | School-wide (no system config) | View all data, manage assessments/teachers/students, view insights |
| **TEACHER** | Own assigned class only | View own class students, create assessments, view insights |
| **ACCOUNTANT** | School-wide (financial only) | View fees/billing data, no student/assessment management |

---

## Implementation Phases

### Phase 1 — Wire Existing Components (minimal effort)

**Goal:** Replace placeholder overview page with the existing `StatsGrid`, `QuickActions`, `RecentActivity`, `AlertsWidget`.

**Files to change:**
- `apps/web/src/routes/dashboard/overview-page.tsx` — compose existing dashboard components, pass data from hooks

**Backend (new):**
- `apps/api/src/routes/dashboard.route.ts` — `GET /dashboard/stats?schoolId=...`, `GET /dashboard/recent-activity?schoolId=...`
- `apps/api/src/controllers/dashboard.controller.ts`
- `apps/api/src/services/dashboard.service.ts` — aggregate queries across schools/users/classes/students/assessments

**Acceptance:** All roles see a live overview with real stats. Same data for everyone — no role filtering yet.

---

### Phase 2 — Role-Based Access Control

**Goal:** Restrict route access and sidebar visibility per role.

#### 2a. Route protection

**Files to change:**
- `apps/web/src/router/route-tree.tsx` — wrap each dashboard route with `allowedRoles`
- `apps/web/src/routes/_dashboard-layout.tsx` — pass `allowedRoles` to `<ProtectedRoute>`

**Route access matrix:**

| Route | ADMIN | HEADTEACHER | TEACHER | ACCOUNTANT |
|---|---|---|---|---|
| `/dashboard` (overview) | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/analytics` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/students/*` | ✅ | ✅ | ✅ (own class) | ❌ |
| `/dashboard/assessments/*` | ✅ | ✅ | ✅ (own class) | ❌ |
| `/dashboard/insights/*` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/classes/*` | ✅ | ✅ | ✅ (own) | ❌ |
| `/dashboard/subjects` | ✅ | ✅ | ✅ | ❌ |
| `/dashboard/teachers` | ✅ | ✅ | ❌ | ❌ |
| `/dashboard/schools` | ✅ | ❌ | ❌ | ❌ |
| `/dashboard/settings` | ✅ | ✅ | ✅ | ✅ |

#### 2b. Role-based sidebar

**Files to change:**
- `apps/web/src/routes/_dashboard-layout.tsx` — filter `navItems` by `user.role` using `NavItem.roles`

**Nav item visibility by role:**

| Nav Item | ADMIN | HEADTEACHER | TEACHER | ACCOUNTANT |
|---|---|---|---|---|
| Overview | ✅ | ✅ | ✅ | ✅ |
| Analytics | ✅ | ✅ | ✅ | ✅ |
| Students | ✅ | ✅ | ✅ (own class) | ❌ |
| Assessments | ✅ | ✅ | ✅ (own class) | ❌ |
| Insights | ✅ | ✅ | ✅ | ✅ |
| Classes | ✅ | ✅ | ✅ (own) | ❌ |
| Subjects | ✅ | ✅ | ✅ | ❌ |
| Teachers | ✅ | ✅ | ❌ | ❌ |
| Schools | ✅ | ❌ | ❌ | ❌ |
| Settings | ✅ | ✅ | ✅ | ✅ |

---

### Phase 3 — Role-Scoped Data

**Goal:** Each role sees only the data they should see.

#### 3a. Dashboard overview per role

| Role | Stats shown | Quick actions |
|---|---|---|
| **ADMIN** | Total Students, Teachers, Classes, Assessments, Avg Score, At Risk | Add Student, New Assessment, View Insights, Manage Classes, Manage Teachers, School Settings |
| **HEADTEACHER** | Same as ADMIN (school-wide view) | Add Student, New Assessment, View Insights, Manage Classes |
| **TEACHER** | My Students, My Assessments, Class Avg Score, At Risk (own class) | New Assessment, View Insights, View My Class |
| **ACCOUNTANT** | Total Students, Active Classes, Fee Collection Rate, Outstanding Fees | View Reports, Export Data |

**Backend changes:**
- `dashboard.service.ts` — accept `role` and `userId`/`assignedClassId` query params; scope queries accordingly
  - TEACHER: filter stats by `assigned_class_id`
  - ACCOUNTANT: return financial stats (new table/endpoint)
- Optionally create `GET /api/v1/dashboard/teacher-stats?schoolId=...&classId=...`

#### 3b. Data scoping in all feature routes

Each feature's backend should filter by role:
- `GET /students` — TEACHER sees only students in `assigned_class_id`
- `GET /assessments` — TEACHER sees only assessments for their class
- `GET /teachers` — TEACHER cannot access at all
- `GET /schools` — only ADMIN can access

#### 3c. Frontend data-scoping

- `useDashboardStats(schoolId)` → add optional `classId` param for TEACHER
- `usePerformanceAnalytics`, `useRiskAnalysis`, `useTrends` — similar role-scoped params
- Feature list pages (students, assessments, classes) — pass `classId` when user is TEACHER

---

### Phase 4 — Accountant Dashboard (new)

**Goal:** Build a distinct financial overview for ACCOUNTANT role.

**New files:**
- `apps/web/src/features/finance/` — new feature module
  - `types/index.ts` — `FeeSummary`, `OutstandingBalance`, `CollectionRate`
  - `api/finance-client.ts` — fee/collection endpoints
  - `hooks/use-fee-summary.ts`
  - `components/fee-summary-card.tsx`
  - `components/collection-rate-chart.tsx`
  - `components/outstanding-list.tsx`
  - `index.ts`
- `apps/api/src/controllers/finance.controller.ts`
- `apps/api/src/services/finance.service.ts`
- `apps/api/src/routes/finance.route.ts` — `GET /finance/summary?schoolId=...`

---

### Phase 5 — Teacher Dashboard (assigned class focus)

**Goal:** TEACHER sees their class as the primary context.

**Changes:**
- On login, TEACHER is redirected to `/dashboard/classes/{assignedClassId}` instead of generic `/dashboard`
- Class-level stats replace school-wide stats in overview
- Quick actions pre-filtered to the teacher's class
- Student list and assessment creation default to the teacher's `assignedClassId`

---

## Sidebar Implementation

Update `navItems` in `_dashboard-layout.tsx` to include role-based filtering:

```typescript
import type { Role } from '@shared/types/common'

interface NavItemConfig {
  label: string
  to: string
  roles: Role[]
}

const navItems: NavItemConfig[] = [
  { label: 'Overview', to: ROUTES.DASHBOARD, roles: ['ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT'] },
  { label: 'Analytics', to: ROUTES.ANALYTICS, roles: ['ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT'] },
  { label: 'Students', to: ROUTES.STUDENTS, roles: ['ADMIN', 'HEADTEACHER', 'TEACHER'] },
  { label: 'Assessments', to: ROUTES.ASSESSMENTS, roles: ['ADMIN', 'HEADTEACHER', 'TEACHER'] },
  { label: 'Insights', to: ROUTES.INSIGHTS, roles: ['ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT'] },
  { label: 'Classes', to: ROUTES.CLASSES, roles: ['ADMIN', 'HEADTEACHER', 'TEACHER'] },
  { label: 'Subjects', to: ROUTES.SUBJECTS, roles: ['ADMIN', 'HEADTEACHER', 'TEACHER'] },
  { label: 'Teachers', to: ROUTES.TEACHERS, roles: ['ADMIN', 'HEADTEACHER'] },
  { label: 'Schools', to: ROUTES.SCHOOLS, roles: ['ADMIN'] },
  { label: 'Settings', to: ROUTES.SETTINGS, roles: ['ADMIN', 'HEADTEACHER', 'TEACHER', 'ACCOUNTANT'] },
]
```

Filter in component:

```typescript
const userRole = user?.role
const visibleItems = navItems.filter((item) => item.roles.includes(userRole))
```

---

## Backend Implementation

### New dashboard service (`apps/api/src/services/dashboard.service.ts`)

```typescript
async getSchoolStats(schoolId: string, role?: string, classId?: string): Promise<DashboardStats>
async getRecentActivity(schoolId: string, role?: string, classId?: string): Promise<RecentActivity[]>
async getTeacherStats(schoolId: string, classId: string): Promise<TeacherDashboardStats>
async getAccountantStats(schoolId: string): Promise<AccountantDashboardStats>
```

### New routes

| Method | Path | Roles |
|---|---|---|
| GET | `/api/v1/dashboard/stats?schoolId=&role=&classId=` | All authenticated |
| GET | `/api/v1/dashboard/recent-activity?schoolId=&role=&classId=` | All authenticated |
| GET | `/api/v1/dashboard/teacher-stats?schoolId=&classId=` | TEACHER |
| GET | `/api/v1/dashboard/accountant-stats?schoolId=` | ACCOUNTANT |

### Wire in `app.ts`

```typescript
import dashboardRoute from '@routes/dashboard.route'
app.use('/api/v1/dashboard', authenticateMiddleware, dashboardRoute)
```

---

## File Change Summary

### Frontend

| File | Phase | Change |
|---|---|---|
| `apps/web/src/routes/dashboard/overview-page.tsx` | 1 | Compose StatsGrid, QuickActions, RecentActivity, AlertsWidget with real data hooks |
| `apps/web/src/routes/_dashboard-layout.tsx` | 2b | Filter nav items by user role |
| `apps/web/src/router/protected-route.tsx` | 2a | Already supports `allowedRoles` — no change needed |
| `apps/web/src/router/route-tree.tsx` | 2a | Add `allowedRoles` to each route |
| `apps/web/src/features/dashboard/types/index.ts` | 3a | Add `TeacherDashboardStats`, `AccountantDashboardStats` types |
| `apps/web/src/features/dashboard/api/dashboard-client.ts` | 3a | Add role-scoped params |
| `apps/web/src/features/dashboard/hooks/use-dashboard-stats.ts` | 3a | Accept optional `classId` param |
| `apps/web/src/features/dashboard/components/stats-grid.tsx` | 3a | Accept role-specific stat sets |
| `apps/web/src/features/dashboard/components/quick-actions.tsx` | 3a | Filter actions by role |
| `apps/web/src/features/finance/*` (new) | 4 | Accountant-specific finance module |

### Backend

| File | Phase | Change |
|---|---|---|
| `apps/api/src/services/dashboard.service.ts` (new) | 1 | Aggregate school stats from users/classes/students/assessments |
| `apps/api/src/controllers/dashboard.controller.ts` (new) | 1 | Handle dashboard requests |
| `apps/api/src/routes/dashboard.route.ts` (new) | 1 | Register dashboard endpoints |
| `apps/api/src/app.ts` | 1 | Mount dashboard routes |
| `apps/api/src/controllers/*.route.ts` | 3b | Add role-based query filtering |
| `apps/api/src/services/finance.service.ts` (new) | 4 | Accountant financial data |
| `apps/api/src/controllers/finance.controller.ts` (new) | 4 | Handle finance requests |
| `apps/api/src/routes/finance.route.ts` (new) | 4 | Register finance endpoints |

---

## Effort Estimate

| Phase | Description | Effort |
|---|---|---|
| 1 | Wire existing components + basic backend dashboard endpoints | Medium (2-3 days) |
| 2 | Role-based route protection + sidebar filtering | Small (1 day) |
| 3 | Role-scoped data on frontend and backend | Medium (2-3 days) |
| 4 | Accountant-specific dashboard + finance module | Large (3-4 days) |
| 5 | Teacher-scoped dashboard with class-first context | Medium (2 days) |
| **Total** | | **~10-13 days** |
