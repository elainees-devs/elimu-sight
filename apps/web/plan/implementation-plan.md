# ElimuSight Frontend — Implementation Plan

## Phase 1 — Foundation (~30 files)

### 1.1 Project Config
- `package.json` — dependencies: react, react-dom, @tanstack/react-router, @tanstack/react-query, @tanstack/react-query-devtools, zustand, axios, react-hook-form, @hookform/resolvers, zod, clsx, tailwind-merge, class-variance-authority, recharts, date-fns
- `tsconfig.json` — strict, path aliases (`@/` → `src/`, `@features/` → `src/features/`, etc.)
- `tsconfig.node.json` — for vite.config.ts
- `vite.config.ts` — react plugin, path aliases, proxy `/api` → backend
- `tailwind.config.ts` — v3, content paths, custom theme
- `postcss.config.js` — tailwind + autoprefixer
- `index.html` — Vite entry
- `.env.example` — `VITE_API_URL`, `VITE_AI_SERVICE_URL`
- `.prettierrc` — tailwind plugin, single quotes

### 1.2 Shared Libs
- `src/shared/lib/cn.ts` — clsx + tailwind-merge
- `src/shared/lib/axios.ts` — Axios instance with token interceptor, schoolId header, error normalization
- `src/shared/lib/query-client.ts` — TanStack QueryClient with defaults (staleTime: 30s, gcTime: 5min)
- `src/shared/lib/utils.ts` — formatDate, formatNumber, generateInitials, etc.
- `src/shared/lib/constants.ts` — ROLE_LABELS, EXAM_TYPE_LABELS, GENDER_LABELS (mirroring backend constants)
- `src/shared/lib/formatters.ts` — date-fns wrappers

### 1.3 Shared Types
- `src/shared/types/api.ts` — `ApiResponse<T>`, `ApiPaginatedResponse<T>`, `ApiError`
- `src/shared/types/common.ts` — role enums, gender type, subscription plans
- `src/shared/types/pagination.ts` — `PaginationParams`, `PaginationMeta`
- `src/shared/types/navigation.ts` — `NavItem`, `NavGroup`

### 1.4 Shared Schemas
- `src/shared/schemas/common-schemas.ts` — `uuidSchema`, `emailSchema`, `paginationParamsSchema`

### 1.5 Config
- `src/shared/config/routes.ts` — path constants: `LOGIN = '/auth/login'`, `DASHBOARD = '/dashboard'`, etc.
- `src/shared/config/api-config.ts` — `API_BASE_URL`, `AI_API_URL`, timeout values
- `src/shared/config/app-config.ts` — feature flags, app name

### 1.6 Entry Points
- `src/styles/globals.css` — tailwind directives, base layer styles
- `src/vite-env.d.ts` — Vite client types + ImportMetaEnv
- `src/main.tsx` — `ReactDOM.createRoot`
- `src/app.tsx` — `<AppProviders><Router /></AppProviders>`

### 1.7 Providers (in order)
1. `src/providers/query-provider.tsx` — QueryClientProvider + Devtools
2. `src/providers/auth-provider.tsx` — bootstraps auth on mount (calls `/auth/me`, populates auth-store)
3. `src/providers/app-providers.tsx` — composition root with proper nesting

### 1.8 Router (TanStack programmatic)
- `src/router/index.ts` — `createRouter` from route tree, export
- `src/router/route-tree.tsx` — RootRoute → IndexRoute, AuthLayout → Login/Register, DashboardLayout → all dashboard routes, NotFound
- `src/router/protected-route.tsx` — checks auth-store, redirects to /auth/login if not authenticated, optional role check

---

## Phase 2 — Auth System (~18 files)

### 2.1 Stores
- `src/stores/auth-store.ts` — Zustand: `token`, `refreshToken`, `user`, `isAuthenticated`, `isLoading`, `role`, actions: `setAuth`, `clearAuth`, `setUser`, `setLoading`
- `src/stores/school-store.ts` — Zustand: `schoolId`, `schoolName`, actions
- `src/stores/ui-store.ts` — Zustand: `sidebarOpen`, `theme`
- `src/stores/index.ts` — re-exports

### 2.2 Feature: auth
- `types/index.ts` — LoginResponse, RegisterInput, AuthUser (camelCase matching mapper output: id, schoolId, fullName, email, role, isActive, createdAt)
- `schemas/auth-schema.ts` — loginSchema (email, password min 8), registerSchema (fullName, email, password, schoolId, role)
- `api/auth-client.ts` — login(email, password) → POST /api/v1/auth/login, register(data) → POST /api/v1/auth/register, refresh(refreshToken) → POST /api/v1/auth/refresh, logout() → POST /api/v1/auth/logout, getMe() → GET /api/v1/auth/me
- `hooks/use-login.ts` — useMutation, stores token + user in auth-store on success
- `hooks/use-logout.ts` — useMutation, calls logout API, clears auth-store
- `hooks/use-register.ts` — useMutation
- `hooks/use-current-user.ts` — useQuery wrapping GET /auth/me
- `components/login-form.tsx` — React Hook Form + Zod, email+password, loading state, error display
- `components/register-form.tsx` — React Hook Form + Zod, all register fields
- `index.ts` — barrel exports

### 2.3 Routes
- `routes/_auth-layout.tsx` — centered card layout with logo
- `routes/auth/login-page.tsx` — composes LoginForm
- `routes/auth/register-page.tsx` — composes RegisterForm

---

## Phase 3 — Shared UI System (~40 files)

### 3.1 UI Primitives
Each: typed, accessible, styled with `cn()` + CVA variants, no business logic
- Button (variant: primary/secondary/ghost/danger, size: sm/md/lg)
- Input (label, error, helper text)
- Textarea
- Select (with label, options)
- Label
- Badge (variant, size)
- Card (header, body, footer)
- Modal (overlay, close, focus trap, escape key)
- Table (semantic, sortable headers)
- Spinner (size variants)
- Avatar (initials, size, fallback)
- Dropdown (Menu, Item, trigger)
- Pagination (page numbers, prev/next, ellipsis)
- Tabs (list, panel, active indicator)
- `index.ts` — barrel

### 3.2 Data Display
- DataTable — generic table with sorting, empty state, loading skeleton
- StatCard — metric display with icon, label, trend
- EmptyState — illustration, title, description, action
- PageHeader — title, subtitle, breadcrumbs, actions slot
- `index.ts`

### 3.3 Feedback
- Toast — success/error/warning/info, auto-dismiss, stack
- Alert — inline banner with variant
- ConfirmDialog — modal with confirm/cancel callback
- ErrorBoundary — catches render errors, fallback UI, retry
- `index.ts`

### 3.4 Chart Wrappers (Recharts)
Each: responsive container, typed data prop, configurable
- BarChart
- LineChart
- PieChart
- AreaChart
- `index.ts`

### 3.5 Shared Hooks
- `use-debounce` — debounce a value
- `use-media-query` — responsive breakpoints
- `use-local-storage` — persist to localStorage
- `use-toggle` — boolean toggle
- `use-click-outside` — detect outside click
- `use-intersection-observer` — lazy loading trigger
- `index.ts`

---

## Phase 4 — Landing Page (~12 files)

### 4.1 Feature: landing
- Navbar — sticky, logo, nav links, "Get Started" CTA, mobile hamburger
- HeroSection — headline, subtitle, primary CTA buttons
- FeaturesSection — 3x3 feature card grid
- HowItWorksSection — numbered steps
- TestimonialsSection — quote cards (optional)
- CtaSection — final banner with CTA
- Footer — links, social, copyright
- `use-landing-scroll` — scroll-aware nav behavior
- `index.tsx` — LandingPage composing all sections

### 4.2 Routes
- `routes/__root.tsx` — RootRoute with Outlet, ErrorBoundary, scroll restoration
- `routes/index.tsx` — renders LandingPage (no layout wrapper)
- `routes/errors/not-found-page.tsx` — 404 with link home
- `routes/errors/error-page.tsx` — generic error with retry

---

## Phase 5 — Dashboard Layout (~7 files)

### 5.1
- `routes/_dashboard-layout.tsx` — sidebar (nav items, school context, user menu), header (breadcrumb, search, notifications, profile), main content area with Outlet
- Sidebar navigation items derived from route config
- Responsive: collapsible sidebar, mobile drawer

### 5.2 Dashboard Pages
- `routes/dashboard/overview-page.tsx` — stats grid, recent activity, quick actions
- `routes/dashboard/analytics-page.tsx` — charts placeholder
- `routes/dashboard/settings-page.tsx` — user/profile settings

---

## Phase 6 — Feature Modules (~80 files)

Each feature follows the same pattern:

```
features/{domain}/
├── types/index.ts         — TS interfaces matching API response DTOs
├── schemas/{schema}.ts    — Zod schemas for forms (mirroring backend Joi)
├── api/{client}.ts        — Axios CRUD methods, typed
├── hooks/{hooks}.ts       — TanStack Query hooks (useQuery, useMutation)
├── components/            — domain-specific components
└── index.ts               — barrel exports
```

### Implementation order (each is a separate commit):
1. **schools** — list, create, edit, details
2. **classes** — list, create, edit (by schoolId param)
3. **subjects** — list, create, edit
4. **teachers** — list, create
5. **students** — list, detail, create, edit, delete, transfer, activate/deactivate
6. **assessments** — list, create, edit, delete, score input
7. **insights** — list, detail, generate, refresh
8. **analytics** — performance chart, risk matrix, trends, summary stats
9. **dashboard** — stats grid, recent activity, quick actions, alerts

---

## API Contract Reference

All Express API endpoints at `/api/v1/`:

| Method | Path | Purpose |
|--------|------|---------|
| POST | /auth/login | Login → `{ token, refreshToken, user }` |
| POST | /auth/register | Register → `User` |
| POST | /auth/refresh | Refresh token → `{ token, refreshToken }` |
| POST | /auth/logout | Revoke refresh tokens |
| GET | /auth/me | Current user |
| GET | /schools | List schools |
| POST | /schools | Create school |
| PATCH | /schools/:id | Update school |
| DELETE | /schools/:id | Soft delete |
| GET | /classes/school/:schoolId | Classes by school |
| GET | /classes/:id | Class by ID |
| POST | /classes | Create class |
| PATCH | /classes/:id | Update class |
| GET | /students | Students by school (with filters) |
| GET | /students/:id | Student by ID |
| POST | /students | Create student |
| PATCH | /students/:id | Update student |
| DELETE | /students/:id | Delete student |
| PATCH | /students/:id/transfer | Transfer class |
| GET | /subjects | List subjects |
| POST | /subjects | Create subject |
| GET | /assessments/school/:schoolId | List assessments |
| POST | /assessments | Create assessment |
| PATCH | /assessments/school/:schoolId/:id | Update |
| DELETE | /assessments/school/:schoolId/:id | Delete |
| POST | /ai/generate/* | AI insight generation |
| POST | /insights/crud | Create insight |
| GET | /insights/crud/:id | Get insight by ID |
| POST | /insights/query/bulk-generate | Bulk generate |

**Standard response shape:**
```typescript
// Single item
{ success: true, message: string, data: T }

// Paginated list
{ success: true, message: string, data: T[], meta: { page, limit, total, totalPages } }

// Error
{ success: false, message: string, errors?: unknown }
```

**Response DTO fields (camelCase):**
- User: id, schoolId, fullName, email, role, assignedClassId?, isActive, createdAt, updatedAt
- School: id, name, email, phone, address?, subscriptionPlan, isActive, createdAt, updatedAt, deletedAt?
- Class: id, name, level, stream, academicYear, schoolId, classTeacherId?, createdAt, updatedAt
- Student: id, schoolId, classId, admissionNumber?, fullName, gender?, dateOfBirth?, guardianName?, guardianPhone?, isActive, createdAt, updatedAt
- Subject: id, schoolId, name, code?, description?, createdAt, updatedAt
- Assessment: id, schoolId, classId, studentId, subjectId, createdBy, term, examType, score, totalMarks, grade, remarks, createdAt
- Insight: id, schoolId, classId, studentId, subjectId, type?, title?, summary?, data?, confidenceScore?, generatedBy?, period?, createdAt, updatedAt

**User roles:** `ADMIN`, `HEADTEACHER`, `TEACHER`, `ACCOUNTANT`
