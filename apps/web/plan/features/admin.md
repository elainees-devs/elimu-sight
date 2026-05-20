# ADMIN (School Admin) UI — Implementation Plan

## Overview

The ADMIN role is a school-level administrative role. Unlike HEADTEACHER (who focuses on academic oversight), the ADMIN manages school configuration: school profile, user accounts, class/subject setup, and student enrollment. Unlike SUPER_ADMIN (who manages the entire platform), ADMIN is scoped to a single school.

ADMIN sits between SUPER_ADMIN (platform owner) and HEADTEACHER (academic lead):

```
SUPER_ADMIN ──┬── ADMIN (school config, users, classes, subjects)
              └── HEADTEACHER (academic oversight, teachers, reports)
                   └── TEACHER (classroom: assessments, students)
                        └── ACCOUNTANT (reports, financial)
```

ADMIN already has broad access but **lacks a distinct identity** — it shares the same dashboard as HEADTEACHER, has no admin-specific KPIs, and has several backend security gaps.

---

## Current State Audit

### What Works ✅

| Area | Status | Notes |
|------|--------|-------|
| Route access | ✅ Proper | 17 routes accessible (all non-admin routes) |
| Sidebar nav | ✅ Proper | 10 items visible; Admin section hidden |
| Dashboard stats | ✅ Working | School-wide stats via `GET /dashboard/stats` |
| Analytics page | ✅ Working | Full analytics for the school |
| List students | ✅ Working | Full school student list |
| CRUD students | ✅ Working | Create, update, delete, activate/deactivate, transfer class |
| List classes | ✅ Working | Full school class list |
| CRUD classes | ✅ Working | Create, update, delete |
| List subjects | ✅ Working | Full school subject list |
| CRUD subjects | ✅ Working | Create, update, delete |
| Assign class-subjects | ✅ Working | Assign/remove/replace/sync/archive subjects on classes |
| List assessments | ✅ Working | Full school assessment list |
| CRUD assessments | ✅ Working | Create, update, delete |
| List insights | ✅ Working | Full school insight list |
| AI generation | ✅ Working | Generate class/student/subject insights |
| List teachers | ✅ Working | Teacher list page |
| CRUD teachers | ✅ Working | Create (via auth/register), detail, update, assign class |
| Quick actions | ✅ Working | 6 actions (Add Student, New Assessment, View Insights, Manage Classes, Manage Teachers, School Settings) |
| Settings page | ✅ Working | Read-only profile info |
| School CRUD (backend) | ✅ Working | Routes exist for list, detail, create, update, delete |
| Auth | ✅ Working | Login, register, token refresh, logout |

### What's Missing / Broken ❌

#### 🔴 High Priority — Security

| Gap | Location | Impact |
|-----|----------|--------|
| `POST /schools` has NO `authorize()` | `school.route.ts:17` | Any authenticated user (TEACHER, ACCOUNTANT) can create a school |
| `DELETE /schools/:id` has NO `authorize()` | `school.route.ts:30` | Any user with school access can delete a school |
| All `/api/v1/insights/*` routes have NO `authorize()` | `insight.crud.route.ts`, `insight.query.route.ts`, `insight.analytics.route.ts` | Any role (ACCOUNTANT) can create/delete/bulk-generate insights |
| `PATCH /users/:id` schema allows role upgrade to `SUPER_ADMIN` | `user.schema.ts` — `RoleValues` includes `"SUPER_ADMIN"` | ADMIN user could PATCH another user's role to SUPER_ADMIN (no service-level guard) |
| `GET /schools/email/:email` has NO `authorize()` | `school.route.ts:12` | Any authenticated user can look up any school by email |
| `GET /dashboard/stats` has NO `authorize()` | `dashboard.route.ts` | Any authenticated user can get school stats |
| `GET /teachers/` has NO `authorize()` | `teacher.route.ts:7` | Any authenticated user can list all teachers |

#### 🟡 Medium Priority — Feature Gaps

| Gap | Details | Notes |
|-----|---------|-------|
| Dashboard is identical to HEADTEACHER | Same stats, same layout, no admin-specific KPIs | Would benefit from admin-specific cards: total users, pending actions, recent signups |
| No user management page | ADMIN can't list/manage school users (teachers, admins, accountants) | Only SUPER_ADMIN has `/admin/users`. ADMIN has `PATCH /users/:id` but no list page |
| No school profile editing UI | Backend `PATCH /schools/:id` exists, but no frontend form wired | The `SchoolForm` component exists but `school-detail-page` is likely unwired |
| No class-subject assignment UI | Backend has full class-subject CRUD, but no frontend page | ADMIN must use API directly to assign subjects to classes |
| No student bulk operations | No bulk import, bulk class transfer, or bulk activate/deactivate | Only single-student operations |
| No enrollment dashboard widget | No "students added this week/month" or "enrollment trends" | Useful admin KPI |
| No school activity log | No audit log of who created/updated/deleted what in the school | SUPER_ADMIN has `/admin/audit-logs`; school-level lacks this |
| Registration allows anyone to sign up as ADMIN | `register-form.tsx` offers ADMIN as a selectable role | No approval workflow; anyone can claim admin access to a school |
| Settings page is read-only | Shows profile info but no editable fields | ADMIN can't change their name or other profile fields |
| No school-level performance comparison | Can't compare classes or subjects within the school | HEADTEACHER would also benefit from this |

#### 🔵 Low Priority — Polish

| Gap | Details |
|-----|---------|
| No ADMIN seed user | No dedicated `admin@school.com` / `admin123` seed account |
| Sidebar "Schools" link shows for ADMIN | ADMIN sees Schools in sidebar but the school list page may not be fully wired |
| No dashboard "Create School" flow | No guided school creation wizard |
| No ADMIN-specific onboarding | No first-run experience for new admin users |
| No user role management UI | ADMIN can't promote/demote users between TEACHER/ACCOUNTANT roles |

---

## Implementation Phases

### Phase 0 — Backend Security Fixes

**Goal:** Close privilege escalation and missing authorization gaps.

| File | Change |
|------|--------|
| `apps/api/src/routes/school.route.ts` | Add `authorize("SUPER_ADMIN")` to `POST /` (create school). Add `authorize("ADMIN", "HEADTEACHER")` to `DELETE /:id`. |
| `apps/api/src/routes/insights/insight.crud.route.ts` | Add `authorize("ADMIN", "HEADTEACHER")` to POST, PATCH, DELETE |
| `apps/api/src/routes/insights/insight.query.route.ts` | Add `authorize("ADMIN", "HEADTEACHER")` to POST `/bulk-generate`, POST `/archive` |
| `apps/api/src/routes/insights/insight.analytics.route.ts` | Add `authorize("ADMIN", "HEADTEACHER", "TEACHER", "ACCOUNTANT")` to read endpoints |
| `apps/api/src/routes/dashboard.route.ts` | Add `authorize()` to stats and recent-activity (all roles except public) |
| `apps/api/src/routes/teacher.route.ts` | Add `authorize("ADMIN", "HEADTEACHER")` to `GET /` |
| `apps/api/src/services/user.service.ts` | Add check: prevent setting role to `"SUPER_ADMIN"` unless caller is SUPER_ADMIN |
| `apps/api/src/schemas/user.schema.ts` | Remove `"SUPER_ADMIN"` from `updateUserSchema` role valid values |

### Phase 1 — School Profile Management

**Goal:** Wire up existing school CRUD backend with frontend forms.

| File | Change |
|------|--------|
| `apps/web/src/features/schools/hooks/use-create-school.ts` | **New** — mutation hook for creating a school |
| `apps/web/src/features/schools/hooks/use-update-school.ts` | **New** — mutation hook for updating a school |
| `apps/web/src/features/schools/hooks/use-delete-school.ts` | **New** — mutation hook for deleting a school |
| `apps/web/src/features/schools/index.ts` | Export new hooks |
| `apps/web/src/routes/schools/school-detail-page.tsx` | Wire up `useSchool`, `useUpdateSchool`, `SchoolForm` with edit section |
| `apps/web/src/routes/schools/school-list-page.tsx` | Wire up create modal with `SchoolForm`, delete confirm dialog |

### Phase 2 — School User Management

**Goal:** ADMIN can view and manage users within their school.

| File | Change |
|------|--------|
| `apps/web/src/features/users/` | **New feature** — user management for school admin |
| `apps/web/src/features/users/types/index.ts` | Types for user list, create, update |
| `apps/web/src/features/users/schemas/user-schema.ts` | Zod schemas for user operations |
| `apps/web/src/features/users/api/user-client.ts` | API calls (reuse `GET /users`, `PATCH /users/:id`, `DELETE /users/:id`) |
| `apps/web/src/features/users/hooks/use-users.ts` | Hook to list users by school |
| `apps/web/src/features/users/components/user-table.tsx` | Table showing users with role badges, status |
| `apps/web/src/features/users/components/user-create-modal.tsx` | Create user form (TEACHER, ACCOUNTANT roles) |
| `apps/web/src/routes/users/user-list-page.tsx` | **New route**: `/dashboard/users` — list, create, deactivate users |
| `apps/web/src/router/route-tree.tsx` | Register route with `authorize("ADMIN")` |
| `apps/web/src/routes/_dashboard-layout.tsx` | Add "Users" nav item for ADMIN role |

### Phase 3 — Class-Subject Assignment UI

**Goal:** ADMIN can visually assign subjects to classes.

| File | Change |
|------|--------|
| `apps/web/src/features/class-subjects/` | **New feature** — frontend for class-subject operations |
| API client: wrap `POST /class-subjects`, `DELETE /:id`, `PUT /class/:classId/replace` |
| Hook: `useClassSubjects(classId)` to list subjects for a class |
| Hook: `useAssignSubject`, `useRemoveSubject`, `useReplaceSubjects` |
| Component: `ClassSubjectManager` — checkboxes/select with current subjects, add/remove |
| `apps/web/src/routes/classes/class-detail-page.tsx` | Add `ClassSubjectManager` section |

### Phase 4 — ADMIN-Specific Dashboard

**Goal:** Give ADMIN a distinct overview with relevant KPIs.

| File | Change |
|------|--------|
| `apps/web/src/features/dashboard/components/stats-grid.tsx` | Add admin-specific cards when `role === "ADMIN"`: total users, new students this month, pending items |
| `apps/web/src/features/dashboard/components/quick-actions.tsx` | Already done (6 actions for ADMIN) — verify alignment |
| `apps/web/src/routes/dashboard/overview-page.tsx` | Add admin-specific alerts: low teacher count, unassigned classes, etc. |
| `apps/api/src/controllers/dashboard.controller.ts` | Optionally add admin-specific stats endpoint or extend existing one |

### Phase 5 — Student Bulk Operations

**Goal:** ADMIN can bulk import, transfer, and manage students.

| File | Change |
|------|--------|
| `apps/api/src/routes/student.route.ts` | Add `POST /bulk-create`, `POST /bulk-transfer` |
| `apps/api/src/services/student.service.ts` | Add bulk operations with validation |
| `apps/web/src/features/students/hooks/use-bulk-create-students.ts` | Mutation hook |
| `apps/web/src/features/students/components/bulk-import-modal.tsx` | CSV/file upload modal |

### Phase 6 — School Activity Log

**Goal:** ADMIN can see who did what in their school.

| File | Change |
|------|--------|
| `apps/api/src/routes/audit.route.ts` | **New route**: `GET /audit/school/:schoolId` — filtered audit logs |
| `apps/api/src/controllers/audit.controller.ts` | **New controller** — query audit_logs table |
| `apps/web/src/features/audit/` | **New feature** — audit log viewer page |
| `apps/web/src/routes/dashboard/audit-page.tsx` | **New route**: `/dashboard/audit` |

### Phase 7 — Settings Page Enhancement

**Goal:** ADMIN can edit their profile and manage school-level preferences.

| File | Change |
|------|--------|
| `apps/web/src/routes/dashboard/settings-page.tsx` | Add editable profile form (name, email). Add school-level settings section |

---

## Rollup: Full File Change List

### Backend (API)

| File | Phase | Change |
|------|-------|--------|
| `apps/api/src/routes/school.route.ts` | 0 | Add `authorize()` to POST and DELETE |
| `apps/api/src/routes/insights/*.route.ts` | 0 | Add `authorize()` to all routes |
| `apps/api/src/routes/dashboard.route.ts` | 0 | Add `authorize()` |
| `apps/api/src/routes/teacher.route.ts` | 0 | Add `authorize()` to GET / |
| `apps/api/src/services/user.service.ts` | 0 | Guard against SUPER_ADMIN role promotion |
| `apps/api/src/schemas/user.schema.ts` | 0 | Remove SUPER_ADMIN from update schema |
| `apps/api/src/routes/student.route.ts` | 5 | Add bulk endpoints |
| `apps/api/src/services/student.service.ts` | 5 | Add bulk logic |
| `apps/api/src/routes/audit.route.ts` | 6 | New route for school audit logs |
| `apps/api/src/controllers/audit.controller.ts` | 6 | New controller |

### Frontend (Web)

| File | Phase | Change |
|------|-------|--------|
| `apps/web/src/features/schools/hooks/*` | 1 | 3 new mutation hooks |
| `apps/web/src/routes/schools/school-detail-page.tsx` | 1 | Wire edit form |
| `apps/web/src/routes/schools/school-list-page.tsx` | 1 | Wire create/delete |
| `apps/web/src/features/users/**/*` | 2 | New feature (types, api, hooks, components) |
| `apps/web/src/routes/users/user-list-page.tsx` | 2 | New route page |
| `apps/web/src/features/class-subjects/**/*` | 3 | New feature |
| `apps/web/src/features/dashboard/components/stats-grid.tsx` | 4 | Admin-specific cards |
| `apps/web/src/routes/dashboard/overview-page.tsx` | 4 | Admin-specific alerts |
| `apps/web/src/features/students/hooks/*` | 5 | Bulk operation hooks |
| `apps/web/src/features/audit/**/*` | 6 | New feature |
| `apps/web/src/routes/dashboard/audit-page.tsx` | 6 | New route page |
| `apps/web/src/routes/dashboard/settings-page.tsx` | 7 | Editable profile |
| `apps/web/src/router/route-tree.tsx` | 2, 6 | Register new routes |
| `apps/web/src/routes/_dashboard-layout.tsx` | 2 | Add nav items |
| `apps/web/src/shared/config/routes.ts` | 2, 3, 6 | Add route constants |
