# Super Admin Dashboard — Implementation Plan

## Overview

Production-grade Super Admin dashboard for the ElimuSight multi-tenant school SaaS platform. Provides platform-wide visibility, centralized tenant management, analytics, billing oversight, infrastructure monitoring, AI usage insights, security management, audit logging, and communication management.

## Architecture

```
apps/web/src/features/admin/          # Frontend module
  ├── api/                            # API client
  ├── components/                     # UI components
  ├── hooks/                          # React Query hooks
  ├── pages/                          # Page components
  └── types/                          # TypeScript types

apps/api/src/
  ├── routes/admin.route.ts           # Route definitions
  ├── controllers/admin.controller.ts # Request handling
  ├── services/admin.service.ts       # Business logic
  ├── schemas/admin.schema.ts         # Joi validation
```

All admin routes mounted under `/api/v1/admin/`, all gated by `authorize("SUPER_ADMIN")`.

## Frontend Routes

All under `/dashboard/admin/*`, protected by `SUPER_ADMIN` role.

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard/admin` | AdminOverview | Platform KPIs, charts, health status |
| `/dashboard/admin/tenants` | TenantList | Schools data table with CRUD |
| `/dashboard/admin/tenants/:id` | TenantDetail | Single school stats & management |
| `/dashboard/admin/users` | AdminUserList | Platform-wide user management |
| `/dashboard/admin/ai` | AIAnalytics | AI usage trends & per-school breakdown |
| `/dashboard/admin/health` | SystemHealth | Service status, uptime, response times |
| `/dashboard/admin/security` | SecurityAudit | Audit log table with filters & stats |
| `/dashboard/admin/billing` | Billing | Subscription plans & revenue overview |
| `/dashboard/admin/announcements` | Announcements | Platform announcement CRUD |
| `/dashboard/admin/support` | SupportTickets | Support ticket management |

## Database — New Models

### `audit_logs`
Track every admin action and system event.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| school_id | UUID? | FK → schools |
| user_id | UUID? | FK → users |
| action | String | e.g. `USER_CREATED`, `SCHOOL_UPDATED` |
| resource | String | e.g. `users`, `schools`, `subscriptions` |
| resource_id | UUID? | ID of affected resource |
| details | Json? | Arbitrary payload |
| ip_address | String? | |
| user_agent | String? | |
| created_at | DateTime | |

### `announcements`
Platform-wide communications.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| title | String | |
| body | String | |
| priority | announcement_priority | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| status | announcement_status | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| created_by | UUID | FK → users |
| published_at | DateTime? | |
| created_at | DateTime | |
| updated_at | DateTime | |

### `support_tickets`
School support requests.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| school_id | UUID | FK → schools |
| subject | String | |
| description | String | |
| status | ticket_status | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| priority | ticket_priority | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| assigned_to | UUID? | FK → users (admin assignee) |
| created_by | UUID | FK → users |
| resolved_at | DateTime? | |
| created_at | DateTime | |
| updated_at | DateTime | |

### Enums (PostgreSQL)

```sql
CREATE TYPE announcement_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE announcement_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
```

## Backend API Endpoints

All endpoints are `SUPER_ADMIN` only.

### Overview & Health

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/overview` | Platform KPIs: schools, users, students, assessments, AI insights counts, system health |
| GET | `/admin/health` | DB status, API uptime, memory, response time |

### Tenant Management

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/schools` | All schools with stats — paginated, filterable |
| GET | `/admin/schools/:id` | Single school detail + full stats |
| POST | `/admin/schools` | Create school (admin bypass) |
| PATCH | `/admin/schools/:id` | Update name, subscription_plan, is_active |
| DELETE | `/admin/schools/:id` | Soft delete |

### User Management

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/users` | All platform users — paginated, filterable by role/school/status/search |
| GET | `/admin/users/:id` | Single user detail |
| POST | `/admin/users` | Create user for any school |
| PATCH | `/admin/users/:id` | Update role, school, is_active |
| DELETE | `/admin/users/:id` | Deactivate |

### AI Analytics

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/analytics/ai-usage` | AI request volume, model distribution, top schools |
| GET | `/admin/analytics/ai-usage/trends` | Daily/weekly AI usage over time |
| GET | `/admin/analytics/insights` | Insight generation stats per school |

### Security & Audit

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/audit-logs` | Paginated audit trail — filterable by action, resource, user, date range |
| GET | `/admin/audit-logs/stats` | Summary stats |
| GET | `/admin/security/overview` | Failed logins, role changes |

### Billing

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/billing/overview` | Schools per plan count |
| PATCH | `/admin/billing/schools/:id/plan` | Change subscription plan |

### Announcements

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/announcements` | List with pagination + status filter |
| POST | `/admin/announcements` | Create (DRAFT or PUBLISHED) |
| PATCH | `/admin/announcements/:id` | Update or change status |
| DELETE | `/admin/announcements/:id` | Hard delete |

### Support Tickets

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/admin/support-tickets` | List with status/priority filters |
| GET | `/admin/support-tickets/:id` | Full detail |
| PATCH | `/admin/support-tickets/:id` | Update status, priority, assignment |

## Frontend Components

### New Shared Components

| Component | Description |
|-----------|-------------|
| `MetricCard` | KPI display card with trend arrow, icon, value |
| `StatusBadge` | Color-coded status for services/plans/tickets |
| `HealthIndicator` | Green/yellow/red status dot |
| `SubscriptionBadge` | Plan-specific colors |
| `AuditLogTable` | Specialized with action-type coloring + expandable details |

### Reusable Patterns (existing)

- **DataTable** — Generic sortable/ filterable table
- **StatCard** — Metric display (already exists, extend as needed)
- **Modal** — Create/edit forms
- **Charts** — Recharts-based (LineChart, BarChart, PieChart, AreaChart)
- **Card** — Info display cards
- **Badge** — Status labels
- **Pagination** — Page navigation

## Audit Logging Middleware

A reusable middleware/utility `logAudit(action, resource, details)` writes to `audit_logs` table. Wired into existing routes:

```typescript
// Usage in any controller after successful mutation:
await logAudit({
  action: 'USER_CREATED',
  resource: 'users',
  resourceId: newUser.id,
  schoolId: input.schoolId,
  userId: req.user!.id,
  details: { role: input.role },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
})
```

## Implementation Phases

### Phase 1 — Foundation
1. Add new Prisma models: `audit_logs`, `announcements`, `support_tickets`
2. Create migration
3. Generate Prisma client
4. Create admin route, controller, service skeletons
5. Implement `/admin/overview` endpoint
6. Implement `/admin/health` endpoint
7. Create `logAudit` utility

### Phase 2 — Tenant & User Management
1. Implement `/admin/schools/*` endpoints
2. Implement `/admin/users/*` endpoints
3. Frontend: Overview page
4. Frontend: Tenant list + detail pages
5. Frontend: Platform users page

### Phase 3 — Analytics & Monitoring
1. Implement `/admin/analytics/*` endpoints
2. Frontend: AI Analytics page
3. Frontend: System Health page

### Phase 4 — Security & Compliance
1. Implement `/admin/audit-logs/*` endpoints
2. Implement `/admin/security/*` endpoints
3. Frontend: Security & Audit page

### Phase 5 — Billing, Communications, Support
1. Implement `/admin/billing/*` endpoints
2. Implement `/admin/announcements/*` endpoints
3. Implement `/admin/support-tickets/*` endpoints
4. Frontend: Billing page
5. Frontend: Announcements page
6. Frontend: Support Tickets page

### Phase 6 — Polish & Integration
1. Wire audit logging middleware into existing routes
2. Add admin nav items to sidebar (SUPER_ADMIN only)
3. Register admin routes in route tree
4. Test all endpoints
5. Performance optimization (pagination, query optimization)

## Key Patterns

- **Backend**: Joi schemas → mappers → services → controllers → routes with middleware
- **Frontend**: Feature module with `api/`, `hooks/`, `components/`, `types/`, `pages/`, `index.ts`
- **Auth**: All admin routes use `authorize("SUPER_ADMIN")`
- **Charts**: Recharts via existing `shared/components/charts/` wrappers
- **Tables**: Existing `DataTable` generic component
- **Forms**: React Hook Form + Zod schemas
- **API client**: Axios, same interceptor pattern as other features
