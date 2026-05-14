# ElimuSight User Flow Workflow

> Complete user journey maps for all roles through the ElimuSight platform.

---

## Actors & Symbols

| Symbol | Meaning |
|---|---|
| `→` | Navigates to |
| `⟳` | System redirect |
| `⛔` | Access denied |
| `✅` | Success state |
| `❌` | Error / edge case |

### Roles

- **A** — ADMIN (school owner/manager)
- **H** — HEADTEACHER
- **T** — TEACHER
- **C** — ACCOUNTANT

---

## 1. Authentication Flow

```
[Landing Page]  ──click "Sign In"──→  [Login Page]
                                         │
                              enter email + password
                                         │
                                    [POST /auth/login]
                                         │
                          ┌────────────────┴────────────────┐
                          ✅ Success                         ❌ Failure
                          │                                  │
                    setAuth(token, user)              "Invalid credentials"
                    setSchool(schoolId)                    retry
                          │                                  │
                     [Dashboard]                        [Login Page]
                     (role-dependent)                   (error shown)
```

### 1a. Role-Based Post-Login Redirect

| Role | Landing Page |
|---|---|
| ADMIN | `/dashboard/overview` — full stats, all nav items |
| HEADTEACHER | `/dashboard/overview` — school-wide stats, management nav items |
| TEACHER | `/dashboard` — class-scoped overview, limited nav |
| ACCOUNTANT | `/dashboard` — financial summary, analytics |

### 1b. Session Restore (Page Refresh)

```
[App mount]
     │
token in localStorage? ──No──→ setLoading(false) → [Landing / Login]
     │
    Yes
     │
[GET /auth/me]
     │
 ┌───┴───┐
 ✅ 200   ❌ 401/403
 │        │
setAuth   clearAuth()
 │        │
[Stays]   [Redirect to /auth/login]
```

### 1c. Token Refresh

```
[API call returns 401]
     │
clearAuth()  ←  Axios response interceptor
     │
[Redirect to /auth/login]
     │
User re-enters credentials
```

### 1d. Logout

```
[Dashboard header] ──click "Sign out"──→ [POST /auth/logout]
                                            │
                                      clearAuth(), clearSchool()
                                            │
                                      [Redirect to /]
```

---

## 2. Registration Flow

```
[Landing Page] ──click "Get Started"──→ [Register Page]
                                           │
                              enter name, email, password, school
                                           │
                                    [POST /auth/register]
                                           │
                              ┌────────────┴────────────┐
                              ✅ Created                 ❌ Duplicate email
                              │                          │
                         auto-login                 "Email already in use"
                         → [Dashboard]              retry on [Register Page]
```

---

## 3. Dashboard Overview Flow

```
[Dashboard /]  ──any role──→  [Overview Page]
                                  │
                          [GET /dashboard/stats]
                          [GET /dashboard/recent-activity]
                                  │
                    ┌─────────────┼─────────────┐
                    │             │              │
              [StatsGrid]   [QuickActions]  [RecentActivity]
              [AlertsWidget]
```

### 3a. Stats Grid

| Stat | ADMIN | HEADTEACHER | TEACHER | ACCOUNTANT |
|---|---|---|---|---|
| Total Students | ✅ School-wide | ✅ School-wide | ✅ Own class | ✅ School-wide |
| Total Teachers | ✅ | ✅ | ❌ | ❌ |
| Total Classes | ✅ | ✅ | ✅ Own class | ✅ Active classes |
| Assessments | ✅ | ✅ | ✅ Own class | ❌ |
| Average Score | ✅ | ✅ | ✅ Own class | ❌ |
| At Risk Count | ✅ | ✅ | ✅ Own class | ❌ |

### 3b. Quick Actions

| Action | A | H | T | C |
|---|---|---|---|---|
| Add Student | ✅ | ✅ | ❌ | ❌ |
| New Assessment | ✅ | ✅ | ✅ | ❌ |
| View Insights | ✅ | ✅ | ✅ | ✅ |
| Manage Classes | ✅ | ✅ | ✅ | ❌ |

### 3c. Alerts Widget

```
┌─ Alerts ─────────────────────────────┐
│ ⚠️ 3 student(s) at risk of failing    │  ← warning if atRiskCount > 0
│ ❌ School avg score is 38% (below 50) │  ← error if averageScore < 50
│ ℹ️ Overall avg score is 72%           │  ← info if averageScore >= 50
└───────────────────────────────────────┘
```

---

## 4. Student Management Flow

```
[Sidebar → "Students"]
     │
[GET /api/v1/students]   (TEACHER: ?classId=xxx)
     │
[Student List Page]
     │
 ├──click row──→ [Student Detail]  →  [PATCH /students/:id]  →  edit fields
 │                                   [DELETE /students/:id]  →  soft delete (is_active=false)
 │
 ├──click "Add"──→ [Create Student Form]  →  [POST /students]  →  redirect to detail
 │                                                                 (ADMIN / HEADTEACHER only)
 │
 └──search/filter──→ [GET /students?search=&classId=&isActive=]
```

### Role Restrictions

| Action | A | H | T | C |
|---|---|---|---|---|
| View list | ✅ All | ✅ All | ✅ Own class | ⛔ |
| View detail | ✅ | ✅ | ✅ Own class | ⛔ |
| Create | ✅ | ✅ | ❌ | ⛔ |
| Edit | ✅ | ✅ | ❌ | ⛔ |
| Delete (soft) | ✅ | ✅ | ❌ | ⛔ |
| Transfer class | ✅ | ✅ | ❌ | ⛔ |

### Edge Cases

- **Empty list**: Shows `EmptyState` with "No students found" + CTA to add one
- **404**: Shows "Student not found" error
- **Admission number conflict**: Backend returns 400 "Admission number already exists"

---

## 5. Assessment Management Flow

```
[Sidebar → "Assessments"]
     │
[GET /api/v1/assessments/school/:schoolId]
     │
[Assessment List Page]  ──filter by exam type──→  [GET .../exam-type/:examType]
     │
 ├──click row──→ [Assessment Detail]
 │
 ├──click "New Assessment"──→ [Create Assessment Form]
 │                              ├─ Select student (dropdown)
 │                              ├─ Select subject (dropdown)
 │                              ├─ Enter score / total marks
 │                              ├─ Select term, exam type
 │                              └─ Submit → [POST /assessments]
 │                                            → redirect to detail
 │
 └──edit──→ [PATCH /assessments/school/:schoolId/:id]
```

### Role Restrictions

| Action | A | H | T | C |
|---|---|---|---|---|
| View list | ✅ | ✅ | ✅ Own class | ⛔ |
| View detail | ✅ | ✅ | ✅ Own class | ⛔ |
| Create | ✅ | ✅ | ✅ Own class | ⛔ |
| Edit | ✅ | ✅ | ❌ | ⛔ |
| Delete | ✅ | ✅ | ❌ | ⛔ |

### Score Input

```
┌─ Score ─────────────────────────────────┐
│ Score:    [____85____]  /  [__100__]    │
│ Grade:    A                              │  ← auto-calculated
│ Remarks:  [Excellent performance...]     │
└──────────────────────────────────────────┘
```

---

## 6. Class Management Flow

```
[Sidebar → "Classes"]
     │
[GET /api/v1/classes/school/:schoolId]
     │
[Class List Page]
     │
 ├──click card/row──→ [Class Detail]
 │                      ├─ Students in this class
 │                      ├─ Assessments for this class
 │                      └─ Class subjects
 │
 └──click "Add Class"──→ [Create Class Form]
                           ├─ Level (e.g., Grade 7)
                           ├─ Stream (e.g., East)
                           ├─ Academic Year
                           ├─ Class Teacher (dropdown)
                           └─ Submit → [POST /classes]
```

### Role Restrictions

| Action | A | H | T | C |
|---|---|---|---|---|
| View list | ✅ | ✅ | ✅ Own class | ⛔ |
| View detail | ✅ | ✅ | ✅ Own class | ⛔ |
| Create | ✅ | ✅ | ❌ | ⛔ |
| Assign teacher | ✅ | ✅ | ❌ | ⛔ |

---

## 7. Subject Management Flow

```
[Sidebar → "Subjects"]
     │
[GET /api/v1/subjects/school/:schoolId]
     │
[Subject List Page]
     │
 └──click "Add Subject"──→ [Create Subject Form]
                             ├─ Name (e.g., Mathematics)
                             ├─ Code (e.g., MATH)
                             ├─ Description
                             └─ Submit → [POST /subjects]
```

### Role Restrictions

| Action | A | H | T | C |
|---|---|---|---|---|
| View list | ✅ | ✅ | ✅ | ⛔ |
| Create | ✅ | ✅ | ❌ | ⛔ |

---

## 8. Teacher Management Flow

```
[Sidebar → "Teachers"]
     │
[GET /api/v1/users/school/:schoolId?role=TEACHER]
     │
[Teacher List Page]
     │
 └──click "Add Teacher"──→ [Create Teacher Form]
                             ├─ Full Name
                             ├─ Email
                             ├─ Password
                             ├─ Assigned Class (optional)
                             └─ Submit → [POST /users (role=TEACHER)]
```

### Role Restrictions

| Action | A | H | T | C |
|---|---|---|---|---|
| View list | ✅ | ✅ | ⛔ | ⛔ |
| Create | ✅ | ✅ | ⛔ | ⛔ |
| Edit | ✅ | ✅ | ⛔ | ⛔ |
| Deactivate | ✅ | ✅ | ⛔ | ⛔ |

---

## 9. School Management Flow

```
[Sidebar → "Schools"]
     │
[GET /api/v1/schools]
     │
[School List Page]  ──click──→  [School Detail]
                                   ├─ School info (name, email, phone)
                                   ├─ Subscription plan
                                   └─ Edit → [PATCH /schools/:id]
```

### Role Restrictions

| Action | A | H | T | C |
|---|---|---|---|---|
| View list | ✅ | ⛔ | ⛔ | ⛔ |
| View detail | ✅ | ⛔ | ⛔ | ⛔ |
| Edit | ✅ | ⛔ | ⛔ | ⛔ |

---

## 10. Insights Flow

```
[Sidebar → "Insights"]
     │
[GET /api/v1/insights/query/school/:schoolId]
     │
[Insight List Page]  ──filter by type/period──→  [.../type/:type | .../period/:period]
     │
 ├──click insight──→ [Insight Detail]
 │
 └──"Generate Insights"──→ [Insight Generator]
                              ├─ Select scope: Class / Student / Subject
                              ├─ Click "Generate"
                              ├─ [POST /api/v1/ai/generate/class]  (or student/subject)
                              ├─ ⏳ Loading state
                              └─ ✅ Insight generated → list refreshes
```

### Role Restrictions

| Action | A | H | T | C |
|---|---|---|---|---|
| View list | ✅ | ✅ | ✅ | ✅ |
| View detail | ✅ | ✅ | ✅ | ✅ |
| Generate (AI) | ✅ | ✅ | ✅ | ⛔ |
| Bulk generate | ✅ | ✅ | ⛔ | ⛔ |
| Archive | ✅ | ✅ | ⛔ | ⛔ |

---

## 11. Analytics Flow

```
[Sidebar → "Analytics"]
     │
[Analytics Page]
     │
 ├── [GET /analytics/summary?schoolId=]  →  SummaryStats (total, avg, pass rate, at risk)
 ├── [GET /analytics/performance?schoolId=]  →  PerformanceData (by subject)
 ├── [GET /analytics/risk-matrix?schoolId=]  →  RiskData (per student)
 └── [GET /analytics/trends?schoolId=]  →  TrendData (over time)
```

*All analytics components currently exist in the frontend but have no matching backend endpoints.*

### Role Restrictions

| Action | A | H | T | C |
|---|---|---|---|---|
| View analytics | ✅ | ✅ | ✅ Own class | ✅ |

---

## 12. Settings Flow

```
[Sidebar → "Settings"]
     │
[Settings Page]
     │
 ├── Profile: Name, Email, Password
 ├── School: Name, Address, Phone (ADMIN only)
 └── Subscription: Plan, Billing (ADMIN only)
```

### Role Restrictions

| Action | A | H | T | C |
|---|---|---|---|---|
| View settings | ✅ | ✅ | ✅ | ✅ |
| Edit profile | ✅ | ✅ | ✅ | ✅ |
| Edit school | ✅ | ⛔ | ⛔ | ⛔ |
| Subscription | ✅ | ⛔ | ⛔ | ⛔ |

---

## 13. Teacher-Tailored Flow

```
[TEACHER Login]
     │
[GET /dashboard/stats?classId={assigned_class_id}]
     │
[Overview Page]
 ├─ "My Class Overview" heading
 ├─ Stats scoped to assigned class only
 ├─ Quick Actions: New Assessment, View Insights, View My Class
 ├─ Alerts for own class
 └─ Recent activity for own class
```

TEACHER's `assignedClassId` is stored in the user object from login and used to scope all data queries. If a TEACHER has no `assignedClassId`, they see an empty state prompting them to contact an administrator.

---

## 14. Accountant-Tailored Flow

```
[ACCOUNTANT Login]
     │
[Dashboard]
 ├─ Can access: Overview, Analytics, Insights, Settings
 ├─ Cannot access: Students, Assessments, Classes, Subjects, Teachers, Schools (sidebar hidden, routes blocked)
 └─ Future: Fee summary, collection rate, outstanding balance widgets
```

The ACCOUNTANT role currently sees the same `StatsGrid` as other roles. Phase 4 (from the design plan) will add dedicated finance components: `FeeSummaryCard`, `CollectionRateChart`, `OutstandingList`.

---

## 15. Error Pages

| Route | Component | Trigger |
|---|---|---|
| Any invalid path | `NotFoundPage` | Unknown route |
| Any route error | `ErrorPage` (root) / route-level `errorComponent` | Render failure, API error |
| `/dashboard/*` (unauthorized role) | `RoleRoute` → "Access Denied" | User role not in `allowedRoles` |
| Auth routes (unauthenticated) | `ProtectedRoute` → redirect to `/auth/login` | Missing/invalid token |

---

## 16. Data Flow Summary

```
[User Action]
     ↓
[React Component]  ──calls──→  [React Query Hook]
     ↓                                  ↓
[TanStack Query]          [Axios API Client]  ──→  [Express Backend]
(cache, refetch,            (attaches token,         ↓
 invalidation)               schoolId headers)    [Controller]
                                                     ↓
                                                  [Service]
                                                     ↓
                                                 [Prisma ORM]
                                                     ↓
                                               [PostgreSQL]
                                                     ↓
                                               [JSON Response]
                                                     ↓
[Component re-renders with new data]
```

### Cache Strategy

| Query Key | Stale Time | gcTime | Refetch on Mount |
|---|---|---|---|
| `['dashboard', 'stats', ...]` | 30s | 5 min | Yes |
| `['dashboard', 'recent-activity', ...]` | 30s | 5 min | Yes |
| `['students', ...]` | 60s | 5 min | Yes |
| `['assessments', ...]` | 30s | 5 min | Yes |
| `['classes', ...]` | 5 min | 10 min | No (static data) |
| `['subjects', ...]` | 5 min | 10 min | No (static data) |
| `['insights', ...]` | 2 min | 5 min | Yes |
| `['analytics', ...]` | 60s | 5 min | Yes |

### Mutation Cache Invalidation

| Mutation | Invalidates |
|---|---|
| Create/Update/Delete student | `['students', ...]`, `['dashboard', 'stats', ...]` |
| Create/Update/Delete assessment | `['assessments', ...]`, `['dashboard', ...]`, `['analytics', ...]` |
| Create/Update/Delete class | `['classes', ...]`, `['dashboard', 'stats', ...]` |
| Create/Update/Delete subject | `['subjects', ...]` |
| Generate insight | `['insights', ...]` |
| Update school settings | `['schools', ...]` |

---

## 17. Navigation Map

```
/  (Landing Page)
└── /auth
│   ├── /auth/login
│   └── /auth/register
└── /dashboard  (Protected - all roles)
    ├── /  (Overview)  [A, H, T, C]
    ├── /analytics  [A, H, T, C]
    ├── /settings  [A, H, T, C]
    ├── /students  [A, H, T]
    │   └── /students/:id
    ├── /assessments  [A, H, T]
    │   ├── /assessments/new
    │   └── /assessments/:id
    ├── /insights  [A, H, T, C]
    │   └── /insights/:id
    ├── /classes  [A, H, T]
    │   └── /classes/:id
    ├── /subjects  [A, H, T]
    ├── /teachers  [A, H]
    └── /schools  [A]
        └── /schools/:id
```

*Square brackets show allowed roles per route.*
