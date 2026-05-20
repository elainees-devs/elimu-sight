# HEADTEACHER UI — Implementation Plan

## Overview

The HEADTEACHER role is a school-level academic leadership role. Unlike ADMIN (who manages system configuration), the HEADTEACHER focuses on academic oversight: managing teachers, monitoring student performance, generating insights, and producing school reports.

Currently, HEADTEACHER shares the same views as ADMIN with no distinct UI, dashboard, or capabilities. This plan defines what HEADTEACHER should see, do, and manage.

---

## Current State Audit

### What Works ✅

| Area | Status | Notes |
|------|--------|-------|
| Route access | ✅ Proper | 14 routes accessible, Schools/Admin blocked |
| Sidebar nav | ✅ Proper | 9 items visible, Schools/Admin hidden |
| Dashboard stats | ✅ Working | School-wide stats via `GET /dashboard/stats` |
| AI insight gen | ✅ Working | 5 endpoints accessible |
| View students | ✅ Working | Full school student list |
| View classes | ✅ Working | Full school class list |
| View subjects | ✅ Working | Full school subject list |
| View teachers | ✅ Working | Can see teacher list page |
| View assessments | ✅ Working | Full school assessment list |
| View insights | ✅ Working | Can view generated insights |
| Seed data | ✅ Working | `headteacher@elimuheights.school` / `headteacher123` |
| Auth | ✅ Working | Login, register, token refresh all work |

### What's Missing ❌

| Gap | Severity | Notes |
|-----|----------|-------|
| Dashboard is identical to ADMIN | 🔴 High | Same stats, same quick actions, no headteacher-specific view |
| No teacher management (CRUD) | 🔴 High | Can view teachers but no detail page, no edit, no class assignment |
| No role enforcement on CRUD endpoints | 🔴 High | POST/PATCH/DELETE for students, classes, subjects, teachers lack `authorize()` |
| `validateSchoolAccess` excludes HEADTEACHER | 🟡 Medium | Works by accident (school_id match), should be explicit |
| No HEADTEACHER-specific quick actions | 🟡 Medium | Same 4 buttons as everyone else |
| No school profile editing | 🟡 Medium | HEADTEACHER can't update school name, address, etc. |
| No student enrollment UI | 🟡 Medium | No "Add Student" from HEADTEACHER dashboard |
| No class/subject CRUD UI for HEADTEACHER | 🟡 Medium | Can view but no dedicated creation forms |
| No school performance reports | 🔵 Low | No term comparison, class ranking, subject breakdown |
| No unique HEADTEACHER constraint | 🔵 Low | Multiple HEADTEACHERs per school possible |
| No `headteacher_id` on `schools` model | 🔵 Low | Can't quickly identify school leadership |

---

## Implementation Phases

### Phase 0 — Backend Authorization Fixes (foundation)

**Problem:** Most CRUD endpoints have NO role enforcement. Any authenticated user can create, update, or delete resources.

**Files to change:**

| File | Change |
|------|--------|
| `apps/api/src/routes/student.route.ts` | Add `authorize("ADMIN", "HEADTEACHER")` to POST, PATCH, DELETE |
| `apps/api/src/routes/class.route.ts` | Add `authorize("ADMIN", "HEADTEACHER")` to POST, PATCH, DELETE |
| `apps/api/src/routes/subject.route.ts` | Add `authorize("ADMIN", "HEADTEACHER")` to POST, PATCH, DELETE |
| `apps/api/src/routes/class-subject.route.ts` | Add `authorize("ADMIN", "HEADTEACHER")` to POST, PATCH, DELETE |
| `apps/api/src/routes/user.route.ts` | Add `authorize("ADMIN", "HEADTEACHER")` to PATCH, DELETE |
| `apps/api/src/middlewares/validateSchoolAccess.middleware.ts` | Add `"HEADTEACHER"` to explicit role check |
| `apps/api/src/services/auth.service.ts` | Add check: only 1 HEADTEACHER per school |

**Validation middleware update:**

```typescript
// Current (line 22-23):
const hasAccess =
  user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.school_id === schoolId;

// Fixed:
const hasAccess =
  user.role === "SUPER_ADMIN" ||
  user.role === "ADMIN" ||
  user.role === "HEADTEACHER" ||
  user.school_id === schoolId;
```

---

### Phase 1 — HEADTEACHER-Specific Dashboard

**Goal:** Give HEADTEACHER a distinct overview page with school-wide academic KPIs and relevant quick actions.

#### 1a. Stats & Quick Actions

**`apps/web/src/features/dashboard/components/stats-grid.tsx`** — Add optional `role` prop:

```typescript
interface StatsGridProps {
  stats: DashboardStats | null
  isLoading?: boolean
  role?: string
}
```

When `role === "HEADTEACHER"`, show the same 6 stat cards as ADMIN (school-wide view). This already works — the distinction comes in quick actions.

**`apps/web/src/features/dashboard/components/quick-actions.tsx`** — Add `role` prop and role-based filtering:

```typescript
interface QuickActionsProps {
  role?: string
}
```

| Role | Actions |
|------|---------|
| **HEADTEACHER** | Add Student, New Assessment, View Insights, Manage Classes, Manage Teachers |
| **ADMIN** | Add Student, New Assessment, View Insights, Manage Classes, Manage Teachers, School Settings |
| **TEACHER** | New Assessment, View Insights, View My Class |
| **ACCOUNTANT** | View Reports, Export Data |

#### 1b. Overview Page Update

**`apps/web/src/routes/dashboard/overview-page.tsx`** — Pass `role` to `QuickActions`:

```typescript
const userRole = useAuthStore((s) => s.user?.role)
// ...
<QuickActions role={userRole} />
```

#### 1c. Dashboard Backend

**Current state:** `GET /api/v1/dashboard/stats` returns school-wide stats scoped by `req.user.schoolId`. HEADTEACHER already sees school-wide data (same as ADMIN). No backend changes needed for Phase 1.

#### Files Changed

| File | Change |
|------|--------|
| `apps/web/src/features/dashboard/components/stats-grid.tsx` | Add optional `role` prop (no visual change for HEADTEACHER) |
| `apps/web/src/features/dashboard/components/quick-actions.tsx` | Add `role` prop, filter actions by role |
| `apps/web/src/routes/dashboard/overview-page.tsx` | Read user role from auth store, pass to QuickActions |

---

### Phase 2 — Teacher Management

**Goal:** HEADTEACHER can create, view details, edit, and assign classes to teachers.

#### 2a. Backend

Add a `GET /teachers/:id` endpoint for teacher detail (currently only list exists).

Add `PATCH /teachers/:id` for editing teacher info (name, email).

Add `POST /teachers/:id/assign-class` for assigning a class to a teacher via `assigned_class_id` on the `users` model.

**New endpoints:**

| Method | Path | Purpose | Roles |
|--------|------|---------|-------|
| GET | `/teachers/:id` | Teacher detail | ADMIN, HEADTEACHER |
| PATCH | `/teachers/:id` | Update teacher | ADMIN, HEADTEACHER |
| POST | `/teachers/:id/assign-class` | Set `assigned_class_id` | ADMIN, HEADTEACHER |

**Files to create/change:**

| File | Change |
|------|--------|
| `apps/api/src/controllers/teacher.controller.ts` | Add `getTeacherDetail`, `updateTeacher`, `assignClass` |
| `apps/api/src/services/teacher.service.ts` | Add detail query, update logic, class assignment |
| `apps/api/src/routes/teacher.route.ts` | Register new endpoints with `authorize("ADMIN", "HEADTEACHER")` |
| `apps/api/src/schemas/teacher.schema.ts` | Add validation for update and class assignment |
| `apps/api/src/routes/index.ts` | Export teacher routes |
| `apps/api/src/app.ts` | Mount teacher routes |

#### 2b. Frontend

**New page: Teacher detail page** at `/dashboard/teachers/:id`.

Shows:
- Teacher name, email, status
- Currently assigned class
- Class assignment dropdown
- Edit name/email form

**Update existing teacher list page:**

- Each teacher row becomes clickable → navigates to detail page
- Class column shows assigned class name
- Status badge with active/inactive

**Files to create/change:**

| File | Change |
|------|--------|
| `apps/web/src/features/teachers/types/index.ts` | Add `TeacherDetail`, `TeacherUpdateInput`, `ClassAssignment` |
| `apps/web/src/features/teachers/schemas/teacher-schema.ts` | Add update schema, class assignment schema |
| `apps/web/src/features/teachers/api/teacher-client.ts` | Add `detail`, `update`, `assignClass` methods |
| `apps/web/src/features/teachers/hooks/use-teachers.ts` | Add `useTeacherDetail`, `useUpdateTeacher`, `useAssignClass` |
| `apps/web/src/features/teachers/hooks/use-create-teacher.ts` | Rename from `useCreateTeacher` for consistency |
| `apps/web/src/features/teachers/components/teacher-table.tsx` | Make rows clickable, add class column |
| `apps/web/src/features/teachers/components/teacher-detail-card.tsx` | **New** — teacher profile card |
| `apps/web/src/features/teachers/components/teacher-assign-class.tsx` | **New** — class assignment dropdown |
| `apps/web/src/features/teachers/index.ts` | Export new components/hooks |
| `apps/web/src/routes/teachers/teacher-detail-page.tsx` | **New** — teacher detail page route |
| `apps/web/src/router/route-tree.tsx` | Add `teachers/$id` route for HEADTEACHER and ADMIN |
| `apps/web/src/shared/config/routes.ts` | Add `TEACHER_DETAIL(id)` route constant |

---

### Phase 3 — Student & Academic Management

**Goal:** HEADTEACHER can manage students, classes, and subjects from dedicated UIs.

#### 3a. Student Management

Currently, HEADTEACHER can view the student list. We need the "Add Student" button on the overview page to navigate to a student creation form, and the ability to transfer/deactivate students.

**Frontend changes needed:**

| Route | Page | Status |
|-------|------|--------|
| `/dashboard/students` | StudentListPage | ✅ Exists, accessible |
| `/dashboard/students/new` | StudentCreatePage | ⬜ Not wired for HEADTEACHER |
| `/dashboard/students/:id` | StudentDetailPage | ✅ Exists, accessible |

The student creation page already exists in the codebase. HEADTEACHER already has route access. The QuickActions "Add Student" button needs to navigate to `/dashboard/students` (with create UI) or a dedicated create page.

#### 3b. Class Management

HEADTEACHER can view the class list and class details. Add ability to create new classes.

**Frontend changes:**

| File | Change |
|------|--------|
| `apps/web/src/routes/classes/class-list-page.tsx` | Add "New Class" button for ADMIN/HEADTEACHER |
| `apps/web/src/features/classes/components/class-create-form.tsx` | **New** — modal or inline form |

#### 3c. Subject Management

HEADTEACHER can view subjects. Add ability to create new subjects.

**Frontend changes:**

| File | Change |
|------|--------|
| `apps/web/src/routes/subjects/subject-list-page.tsx` | Add "New Subject" button for ADMIN/HEADTEACHER |
| `apps/web/src/features/subjects/components/subject-create-form.tsx` | **New** — modal form |

---

### Phase 4 — School Profile Editing

**Goal:** HEADTEACHER can edit their school's profile (name, address, phone).

#### 4a. Backend

The `PATCH /schools/:id` endpoint exists but has NO role check. Add `authorize("ADMIN", "HEADTEACHER")` and ensure HEADTEACHER can only edit their own school.

**File changes:**

| File | Change |
|------|--------|
| `apps/api/src/routes/school.route.ts` | Add `authorize("ADMIN", "HEADTEACHER")` to PATCH `/:id` |
| `apps/api/src/controllers/school.controller.ts` | Add school_id scoping for HEADTEACHER |

#### 4b. Frontend

**New page or settings section:**

Add a "School Profile" section to the Settings page (`/dashboard/settings`) that is visible only to ADMIN and HEADTEACHER. Shows:
- School name (editable)
- School email (editable)
- School phone (editable)
- School address (editable)

**File changes:**

| File | Change |
|------|--------|
| `apps/web/src/features/schools/api/school-client.ts` | Add `updateProfile` method |
| `apps/web/src/features/schools/hooks/use-school.ts` | Add `useUpdateSchoolProfile` mutation |
| `apps/web/src/features/schools/components/school-profile-form.tsx` | **New** — school profile edit form |
| `apps/web/src/routes/dashboard/settings-page.tsx` | Add School Profile section for ADMIN/HEADTEACHER |

---

### Phase 5 — School Performance Reports

**Goal:** HEADTEACHER can view academic performance reports for their school.

#### 5a. New Report Types

```typescript
interface SchoolPerformanceReport {
  termComparison: TermComparison[]
  classRanking: ClassRanking[]
  subjectPerformance: SubjectPerformance[]
  teacherEffectiveness: TeacherEffectiveness[]
}

interface TermComparison {
  term: string
  averageScore: number
  studentCount: number
  assessmentCount: number
}

interface ClassRanking {
  classId: string
  className: string
  averageScore: number
  studentCount: number
  trend: 'improving' | 'declining' | 'stable'
}

interface SubjectPerformance {
  subjectId: string
  subjectName: string
  averageScore: number
  passRate: number
}

interface TeacherEffectiveness {
  teacherId: string
  teacherName: string
  classAverage: number
  studentImprovement: number
  assessmentCount: number
}
```

#### 5b. Backend

**New endpoints:**

| Method | Path | Purpose | Roles |
|--------|------|---------|-------|
| GET | `/reports/school/performance` | Full school performance report | ADMIN, HEADTEACHER |
| GET | `/reports/school/term-comparison` | Term-by-term comparison | ADMIN, HEADTEACHER |
| GET | `/reports/school/class-ranking` | Class ranking by avg score | ADMIN, HEADTEACHER |
| GET | `/reports/school/subject-performance` | Subject-wise performance | ADMIN, HEADTEACHER |

**New files:**

| File | Purpose |
|------|---------|
| `apps/api/src/routes/report.route.ts` | Report endpoints with `authorize("ADMIN", "HEADTEACHER")` |
| `apps/api/src/controllers/report.controller.ts` | Request handling for reports |
| `apps/api/src/services/report.service.ts` | Aggregate queries across assessments/classes/subjects |
| `apps/api/src/schemas/report.schema.ts` | Query param validation (schoolId, term, academicYear) |

#### 5c. Frontend

**New route:** `/dashboard/reports` — accessible by ADMIN and HEADTEACHER.

**New feature module:** `apps/web/src/features/reports/`

```
features/reports/
├── types/index.ts              — SchoolPerformanceReport, TermComparison, etc.
├── api/report-client.ts        — Axios methods for report endpoints
├── hooks/use-reports.ts        — TanStack Query hooks
├── components/
│   ├── term-comparison-chart.tsx   — Bar chart comparing terms
│   ├── class-ranking-table.tsx     — Sortable class ranking table
│   ├── subject-performance-card.tsx — Subject score breakdown
│   └── performance-summary.tsx     — Overall KPIs
├── index.ts
```

**Files to create/change:**

| File | Change |
|------|--------|
| `apps/web/src/features/reports/` | **New** — full feature module |
| `apps/web/src/routes/dashboard/reports-page.tsx` | **New** — reports page |
| `apps/web/src/router/route-tree.tsx` | Add `/dashboard/reports` for ADMIN, HEADTEACHER |
| `apps/web/src/routes/_dashboard-layout.tsx` | Add "Reports" nav item for ADMIN, HEADTEACHER |
| `apps/web/src/shared/config/routes.ts` | Add `REPORTS` route constant |

---

### Phase 6 — Sidebar & Navigation Updates

**Goal:** Add "Reports" to sidebar for HEADTEACHER and ADMIN, cleanup nav ordering.

**Current nav items for HEADTEACHER:**
Overview, Analytics, Students, Assessments, Insights, Classes, Subjects, Teachers, Settings

**Updated nav items for HEADTEACHER:**
Overview, Analytics, Reports (new), Students, Assessments, Insights, Classes, Subjects, Teachers, Settings

---

## Complete File Change Summary

### Backend (apps/api)

| # | File | Phase | Change |
|---|------|-------|--------|
| 1 | `src/middlewares/validateSchoolAccess.middleware.ts` | 0 | Add `"HEADTEACHER"` to explicit role check |
| 2 | `src/routes/student.route.ts` | 0 | `authorize("ADMIN", "HEADTEACHER")` on POST/PATCH/DELETE |
| 3 | `src/routes/class.route.ts` | 0 | `authorize("ADMIN", "HEADTEACHER")` on POST/PATCH/DELETE |
| 4 | `src/routes/subject.route.ts` | 0 | `authorize("ADMIN", "HEADTEACHER")` on POST/PATCH/DELETE |
| 5 | `src/routes/class-subject.route.ts` | 0 | `authorize("ADMIN", "HEADTEACHER")` on POST/PATCH/DELETE |
| 6 | `src/routes/user.route.ts` | 0 | `authorize("ADMIN", "HEADTEACHER")` on PATCH/DELETE |
| 7 | `src/routes/school.route.ts` | 4 | `authorize("ADMIN", "HEADTEACHER")` on PATCH `/:id` |
| 8 | `src/services/auth.service.ts` | 0 | Enforce unique HEADTEACHER per school |
| 9 | `src/controllers/teacher.controller.ts` | 2 | Add detail, update, assignClass handlers |
| 10 | `src/services/teacher.service.ts` | 2 | Add detail query, update, assignment logic |
| 11 | `src/routes/teacher.route.ts` | 2 | Register new endpoints |
| 12 | `src/schemas/teacher.schema.ts` | 2 | Add validation schemas |
| 13 | `src/routes/report.route.ts` | 5 | Register report endpoints |
| 14 | `src/controllers/report.controller.ts` | 5 | Handle report requests |
| 15 | `src/services/report.service.ts` | 5 | Aggregate assessment data for reports |
| 16 | `src/schemas/report.schema.ts` | 5 | Query param validation |
| 17 | `src/routes/index.ts` | 2,5 | Export teacher & report routes |
| 18 | `src/app.ts` | 2,5 | Mount teacher & report routes |

### Frontend (apps/web)

| # | File | Phase | Change |
|---|------|-------|--------|
| 1 | `src/features/dashboard/components/quick-actions.tsx` | 1 | Add `role` prop, filter actions |
| 2 | `src/features/dashboard/components/stats-grid.tsx` | 1 | Add optional `role` prop |
| 3 | `src/routes/dashboard/overview-page.tsx` | 1 | Pass user role to QuickActions |
| 4 | `src/features/teachers/types/index.ts` | 2 | Add TeacherDetail, TeacherUpdateInput types |
| 5 | `src/features/teachers/schemas/teacher-schema.ts` | 2 | Add update + assignment schemas |
| 6 | `src/features/teachers/api/teacher-client.ts` | 2 | Add detail, update, assignClass methods |
| 7 | `src/features/teachers/hooks/use-teachers.ts` | 2 | Add detail, update, assign hooks |
| 8 | `src/features/teachers/components/teacher-table.tsx` | 2 | Make rows clickable, add class column |
| 9 | `src/features/teachers/components/teacher-detail-card.tsx` | 2 | **New** |
| 10 | `src/features/teachers/components/teacher-assign-class.tsx` | 2 | **New** |
| 11 | `src/features/teachers/index.ts` | 2 | Export new components |
| 12 | `src/routes/teachers/teacher-detail-page.tsx` | 2 | **New** |
| 13 | `src/features/reports/` (full module) | 5 | **New** — types, api, hooks, components |
| 14 | `src/routes/dashboard/reports-page.tsx` | 5 | **New** |
| 15 | `src/features/schools/api/school-client.ts` | 4 | Add updateProfile method |
| 16 | `src/features/schools/hooks/use-school.ts` | 4 | Add update profile mutation |
| 17 | `src/features/schools/components/school-profile-form.tsx` | 4 | **New** |
| 18 | `src/routes/dashboard/settings-page.tsx` | 4 | Add school profile section |
| 19 | `src/router/route-tree.tsx` | 2,5 | Add teacher detail + reports routes |
| 20 | `src/routes/_dashboard-layout.tsx` | 5 | Add "Reports" nav item |
| 21 | `src/shared/config/routes.ts` | 2,5 | Add TEACHER_DETAIL, REPORTS constants |

---

## Effort Estimate

| Phase | Description | Effort |
|-------|-------------|--------|
| 0 | Backend authorization fixes | Small (1 day) |
| 1 | HEADTEACHER-specific dashboard | Small (1 day) |
| 2 | Teacher management (detail, edit, assign) | Medium (2-3 days) |
| 3 | Student & academic management | Medium (2-3 days) |
| 4 | School profile editing | Small (1 day) |
| 5 | School performance reports | Large (3-4 days) |
| 6 | Sidebar & navigation | Small (0.5 day) |
| **Total** | | **~10-14 days** |

---

## Key Patterns

### Backend
- All new endpoints use `authorize("ADMIN", "HEADTEACHER")`
- School-scoped queries use `req.user.schoolId`
- New report endpoints aggregate from `assessments`, `classes`, `subjects` tables
- Teacher assignment updates `assigned_class_id` on `users` table

### Frontend
- New feature modules follow the existing pattern: `types/`, `schemas/`, `api/`, `hooks/`, `components/`, `index.ts`
- Route pages are thin — they compose feature components and pass route params
- Mutations invalidate related query keys on success
- Role-based UI uses the `user.role` from `useAuthStore` to conditionally show/hide elements
- Reports use Recharts (existing shared chart wrappers) for term comparison and class ranking visualizations
