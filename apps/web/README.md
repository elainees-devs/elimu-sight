# ElimuSight Web

AI-Powered School Intelligence frontend built with React, TanStack Router, TanStack Query, and Tailwind CSS.

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 |
| Routing | @tanstack/react-router v1 |
| Data Fetching | @tanstack/react-query v5 |
| State Management | Zustand (persisted) |
| Forms | react-hook-form + @hookform/resolvers + zod |
| HTTP Client | Axios |
| Styling | Tailwind CSS v3 + clsx + tailwind-merge + CVA |
| Charts | Recharts |
| Dates | date-fns |

## Project Structure

```
src/
├── app.tsx                    # App shell: <AppProviders><Router /></AppProviders>
├── main.tsx                   # Entry point, mounts to #root
├── vite-env.d.ts              # Vite env type declarations
├── features/                  # Domain feature modules
│   ├── auth/                  # Login, register, logout, current user
│   ├── analytics/             # Performance charts, risk matrix, trends
│   ├── assessments/           # CRUD, scoring
│   ├── classes/               # Class list, create, detail
│   ├── dashboard/             # Stats grid, recent activity, alerts
│   ├── insights/              # AI-generated insights, bulk generate
│   ├── schools/               # School CRUD
│   ├── students/              # Student CRUD, transfer, activate
│   ├── subjects/              # Subject list, create
│   ├── teachers/              # Teacher list, create
│   └── admin/                 # Super admin: overview, tenants, users, AI, health, security, billing, announcements, support
├── providers/                 # React context providers
│   ├── app-providers.tsx      # Composition root
│   ├── auth-provider.tsx      # Bootstraps auth on mount
│   └── query-provider.tsx     # QueryClient + devtools
├── router/
│   ├── index.tsx              # createRouter(), RouterProvider, type registration
│   ├── route-tree.tsx         # All route definitions
│   └── protected-route.tsx    # Auth guard with optional role check
├── routes/                    # Route page components
│   ├── __root.tsx             # Root layout with Outlet
│   ├── _auth-layout.tsx       # Centered card layout for auth
│   ├── _dashboard-layout.tsx  # Sidebar + header + content area
│   ├── index.tsx              # Landing page
│   ├── auth/                  # login-page, register-page
│   ├── dashboard/             # overview, analytics, settings
│   ├── schools/               # list, detail
│   ├── classes/               # list, detail
│   ├── subjects/              # list
│   ├── teachers/              # list
│   ├── students/              # list, detail
│   ├── assessments/           # list, create, detail
│   ├── insights/              # list, detail
│   ├── dashboard/admin/       # Super admin pages: overview, tenants, users, AI, health, security, billing, announcements, support
│   └── errors/                # not-found, error
├── shared/
│   ├── components/
│   │   ├── ui/                # Button, Input, Badge, Card, Modal, Table, etc.
│   │   ├── data-display/      # DataTable, StatCard, EmptyState, PageHeader
│   │   ├── feedback/          # Toast, Alert, ConfirmDialog, ErrorBoundary
│   │   └── charts/            # BarChart, LineChart, PieChart, AreaChart
│   ├── config/                # routes, api-config, app-config
│   ├── hooks/                 # useDebounce, useMediaQuery, useLocalStorage, etc.
│   ├── lib/                   # cn, axios, constants, formatters, query-client, utils
│   ├── schemas/               # common-schemas (uuid, email, pagination)
│   └── types/                 # api, common, navigation, pagination
├── stores/                    # Zustand stores
│   ├── auth-store.ts          # token, refreshToken, user, isAuthenticated
│   ├── school-store.ts        # schoolId, schoolName
│   └── ui-store.ts            # sidebarOpen, theme
└── styles/
    └── globals.css            # Tailwind directives, base layers
```

## Feature Module Pattern

Each domain follows a consistent structure:

```
features/{domain}/
├── types/index.ts         # TS interfaces matching API DTOs
├── schemas/{schema}.ts    # Zod schemas for forms
├── api/{client}.ts        # Axios CRUD methods
├── hooks/{hooks}.ts       # TanStack Query hooks
├── components/            # Domain-specific components
└── index.ts               # Barrel exports
```

## Getting Started

```bash
npm install
npm run dev        # Vite dev server on port 5173
npm run build      # Production build
npm run typecheck  # TypeScript type checking
npm run lint       # ESLint
npm run test       # Run tests with Vitest

## Testing Status

The web application uses [Vitest](https://vitest.dev/) for unit and component testing.

### Current Test Results (May 20, 2026)

```text
 RUN  v1.6.1 /home/elaine/Desktop/elimu-sight/apps/web

 Test Files  29 passed (29)
      Tests  140 passed (140)
   Duration  30.26s
```

All 140 tests across 29 files are currently passing.
npm run format     # Prettier
npm run test       # Vitest (watch mode)
npm run test:run   # Vitest (single run)
```

## Test Output

```
 ✓ src/shared/lib/utils.test.ts                  (14 tests)
 ✓ src/shared/lib/cn.test.ts                      (5 tests)
 ✓ src/shared/lib/formatters.test.ts              (5 tests)
 ✓ src/shared/lib/constants.test.ts               (6 tests)
 ✓ src/shared/schemas/common-schemas.test.ts      (8 tests)
 ✓ src/features/auth/schemas/auth-schema.test.ts  (8 tests)
 ✓ src/stores/auth-store.test.ts                  (5 tests)
 ✓ src/stores/ui-store.test.ts                    (4 tests)
 ✓ src/stores/school-store.test.ts                (3 tests)
 ✓ src/shared/components/ui/button.test.tsx       (7 tests)
 ✓ src/shared/components/ui/input.test.tsx        (6 tests)
 ✓ src/shared/components/ui/textarea.test.tsx     (3 tests)
 ✓ src/shared/components/ui/select.test.tsx       (4 tests)
 ✓ src/shared/components/ui/badge.test.tsx        (3 tests)
 ✓ src/shared/components/ui/card.test.tsx         (5 tests)
 ✓ src/shared/components/ui/modal.test.tsx        (6 tests)
 ✓ src/shared/components/ui/spinner.test.tsx      (4 tests)
 ✓ src/shared/components/ui/avatar.test.tsx       (3 tests)
 ✓ src/shared/components/ui/pagination.test.tsx   (6 tests)
 ✓ src/shared/components/ui/tabs.test.tsx         (3 tests)
 ✓ src/shared/components/data-display/stat-card.test.tsx      (3 tests)
 ✓ src/shared/components/data-display/page-header.test.tsx    (4 tests)
 ✓ src/shared/components/data-display/empty-state.test.tsx    (3 tests)
 ✓ src/shared/components/feedback/alert.test.tsx              (4 tests)
 ✓ src/shared/hooks/use-debounce.test.ts                      (3 tests)
 ✓ src/shared/hooks/use-toggle.test.ts                        (4 tests)
 ✓ src/shared/hooks/use-media-query.test.ts                   (2 tests)
 ✓ src/features/auth/components/login-form.test.tsx           (4 tests)
 ✓ src/features/auth/components/register-form.test.tsx        (3 tests)

 Test Files  29 passed (29)
      Tests  138 passed (138)
```

## API

The dev server proxies `/api/v1` to `http://localhost:3000`. Configure via `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_AI_SERVICE_URL=http://localhost:8000
```

Standard response shape:

```typescript
// Single item
{ success: true, message: string, data: T }

// Paginated list
{ success: true, message: string, data: T[], meta: { page, limit, total, totalPages } }

// Error
{ success: false, message: string, errors?: unknown }
```

## Path Aliases

| Alias | Path |
|-------|------|
| `@/` | `src/` |
| `@features/` | `src/features/` |
| `@shared/` | `src/shared/` |
| `@stores/` | `src/stores/` |
| `@providers/` | `src/providers/` |
| `@router/` | `src/router/` |
| `@routes/` | `src/routes/` |
| `@styles/` | `src/styles/` |

## Architecture Decisions

### Why React over Vue/Svelte/Angular?

React was chosen for its mature ecosystem, broad hiring pool, and seamless integration with TanStack's suite of libraries (Router, Query, Form). The component model maps naturally to the dashboard-heavy domain where many small, reusable data-display widgets compose into pages.

### Why TanStack Router over React Router v6/v7?

TanStack Router offers first-class TypeScript inference — route params, search params, and loader data are fully typed without manual generics or `useParams` casting. Its code-based route tree gives explicit control over layout nesting (auth vs. dashboard) without file-convention magic. The built-in `notFoundComponent` and `errorComponent` at each route level simplify error boundary placement.

### Why TanStack Query over SWR/RTK Query?

TanStack Query v5 provides granular stale-time/gc-time configuration per query, automatic background refetching with window focus, and first-class mutation invalidation. The `gcTime` (formerly `cacheTime`) default of 5 minutes lets users navigate between dashboard sections without refetching recently-viewed data. SWR lacks devtools; RTK Query would require pulling in Redux as a transitive dependency.

### Why Zustand over Redux/Context?

Zustand is sufficient for this application's global state (auth tokens, school context, sidebar toggle) without Redux boilerplate. The `persist` middleware handles localStorage hydration for tokens out of the box. React Context would cause unnecessary re-renders for frequently-accessed state like the sidebar toggle.

### Why React Hook Form + Zod over Formik/Yup?

Zod provides runtime validation that doubles as TypeScript type inference (`z.infer`), eliminating the need to maintain separate type and validation schemas. React Hook Form's uncontrolled inputs reduce re-render overhead compared to Formik's controlled approach, which matters in assessment forms with dozens of score fields.

### Why Tailwind over CSS Modules/Styled Components?

Tailwind's utility-first approach keeps component files self-contained and eliminates context-switching between `.tsx` and `.css` files. The `cn()` helper (clsx + tailwind-merge) provides a CVA-compatible API for component variants without runtime CSS-in-JS overhead. For a team adding new UI primitives, Tailwind's design-token system (theme colors, spacing scale) enforces consistency.

### Why feature folders instead of flat structure?

Domain grouping keeps related files (types, schemas, API client, hooks, components) colocated, making it easy to add or remove features without cross-cutting edits. A flat structure would scatter a single feature's concerns across `types/`, `schemas/`, `api/`, `hooks/`, and `components/` directories.

## Best Practices

### Code Organization
- Every feature module has a barrel `index.ts` that exports its public API. Never import from internal files across feature boundaries.
- Shared UI components are stateless and receive all data via props. Business logic lives in feature hooks.
- Route page components are thin — they compose feature components and pass route params as props. No data fetching in page components directly.

### State Management
- Server state (API data) is owned by TanStack Query, never duplicated in Zustand. Zustand only holds client-only state (auth tokens, UI preferences).
- Auth tokens are persisted to localStorage via Zustand middleware. On app mount, `AuthProvider` validates the token by calling `/auth/me`.
- School context is set on login and sent as an `X-School-Id` header via the Axios interceptor. All feature API clients derive the school ID from the store rather than requiring it as a parameter.

### Forms
- Every form has a matching Zod schema that mirrors the backend's validation rules. Schemas are colocated with the feature, not in a global schemas directory.
- Mutations invalidate the related query keys on success so lists refetch automatically.
- Optimistic updates are not used in v1 to keep the mutation logic predictable — the tradeoff is acceptable given typical form submission latency.

### Data Fetching
- Every API client returns the raw Axios response. Hooks unwrap `res.data.data` to provide clean typing.
- Query keys follow the pattern `[resource, ...params]` (e.g., `['students', { classId, page }]`) for deterministic cache keying.
- Mutations use `onSuccess` callbacks for cache invalidation rather than `onSettled` to avoid refetching on errors.

### Error Handling
- Axios interceptor catches 401 responses and clears the auth store, redirecting to login.
- Route-level error boundaries catch render errors per section.
- Forms display per-field validation errors from Zod and a top-level API error banner for server-side failures.

### TypeScript
- `strict: true` in tsconfig. No `any` in production code.
- API DTOs are defined once in `shared/types/common.ts` and reused across features. No per-feature re-declarations.
- Route params are inferred by TanStack Router via the `from` parameter in `useParams`.
- `useMemo` and `useCallback` are used sparingly — only when profiling demonstrates a re-render bottleneck.

## Hosting

### Current (Vercel)
The app is configured for Vercel deployment with zero configuration:
- Framework preset: Vite
- Output directory: `dist`
- SPA fallback: `vercel.json` rewrites all routes to `index.html`

```json
// vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Alternative Options

| Provider | Pros | Cons |
|----------|------|------|
| **Vercel** | Instant deploy from Git, edge functions, analytics | No native Node.js runtime (for SSR) |
| **Netlify** | Similar DX to Vercel, split testing | Slower build times |
| **Cloudflare Pages** | Global edge network, free tier | No server-side rendering |
| **AWS S3 + CloudFront** | Full control, low cost at scale | Manual CI/CD setup, no preview deploys |
| **Railway** | Simple Docker-based deploy | Smaller ecosystem |
| **Docker + VPS** | Full control, any infrastructure | Operational overhead |

### CI/CD
The GitHub Actions workflow (`/.github/workflows/deploy.yml`):
1. Install dependencies
2. Run `tsc --noEmit`
3. Run `npm run build`
4. Deploy to Vercel via `vercel --prod`

### Environment Variables
Set these in the hosting dashboard:
```env
VITE_API_URL=https://api.elimusight.com/api/v1
VITE_AI_SERVICE_URL=https://ai.elimusight.com
```

## Future Considerations (v2)

### Performance
- **Code splitting**: Route-level lazy loading via `@tanstack/react-router`'s native `lazy` API. Each dashboard section loads only when navigated to.
- **Virtual scrolling**: Replace flat student/assessment lists with `@tanstack/react-virtual` for schools with >1,000 records.
- **Bundle optimization**: Analyze with `vite-bundle-visualizer`. Extract chart library into a separate chunk since Recharts adds ~150 KB.
- **Image optimization**: Serve student photos through a CDN with WebP/AVIF support.

### Features
- **SSR / SSG**: Adopt Next.js or TanStack Start for SSR if SEO becomes necessary (public landing pages, report sharing).
- **Offline support**: Add a service worker with `workbox` for offline access to recently-viewed student profiles and assessments.
- **Real-time updates**: Replace polling with WebSocket connections (via `socket.io` or native `EventSource`) for live insight generation progress.
- **Role-based UI**: Implement fine-grained feature flags per role (e.g., Accountant sees financial dashboards, Teachers see only their class data).
- **Multi-language**: Add `react-i18next` with lazy-loaded translation namespaces per feature.
- **Accessibility audit**: Run `axe-core` in CI. Add skip-to-content links, aria-labels, keyboard navigation for data tables.
- **Storybook**: Build and publish a component library with Storybook for visual regression testing and team consumption.
- **E2E tests**: Add Playwright tests covering the critical auth → dashboard → CRUD flows.
- **Theming**: Extend the dark mode support beyond the current `useUIStore` toggle with a full Tailwind dark variant implementation.

### Architecture
- **Monorepo migration**: Extract shared UI primitives into `packages/ui` for versioned releases consumed by potential future apps (mobile, admin portal).
- **tRPC integration**: If the backend moves to tRPC, replace Axios calls with tRPC client for end-to-end type safety (no manual DTO types).
- **Design system**: Formalize the CVA variant system into a shared tokens package with Figma sync via `style-dictionary`.

## Security Practices

### Authentication
- **Token-based auth**: JWT tokens are stored in Zustand with `persist` middleware (localStorage). The auth store `partialize` option (auth-store.ts:40-44) explicitly whitelists only `token`, `refreshToken`, and `user` for persistence — no transient state like `isLoading` leaks to storage.
- **Token validation on mount**: `AuthProvider` (auth-provider.tsx) calls `GET /auth/me` on every full page load when a token exists. If the server returns 401, the token is discarded and the store is cleared, forcing re-login. This prevents use of stale or revoked tokens.
- **Auto-logout on 401**: The Axios response interceptor (axios.ts:29-32) listens for 401 responses on any API call and immediately clears the auth store. The `ProtectedRoute` component then detects `isAuthenticated === false` and redirects to `/auth/login`.
- **Password policy enforced client-side**: Login and registration schemas (auth-schema.ts:6,12) require minimum 8-character passwords via Zod validation. This provides immediate user feedback before the request reaches the server.
- **Role-based access**: `ProtectedRoute` (protected-route.tsx) accepts an optional `allowedRoles` array. When provided, it checks the current user's role and renders an "Access Denied" fallback instead of the protected content. This is enforced at the route level, not just hidden in the UI.

### API Security
- **Bearer token header**: The Axios request interceptor (axios.ts:16-18) attaches `Authorization: Bearer <token>` to every outgoing request automatically. Tokens are never appended manually in feature code, eliminating a common vector for accidentally sending tokens to the wrong origin.
- **Multi-tenant isolation**: The interceptor also attaches an `X-School-Id` header (axios.ts:20-22) derived from the school store. This ensures all API requests carry the school context without each feature needing to pass it explicitly, reducing the risk of one school's data leaking into another school's request.
- **Centralized base URL**: All API requests go through a single Axios instance configured with `baseURL: API_CONFIG.BASE_URL` (axios.ts:7). This prevents ad-hoc URL construction in feature code that could accidentally target the wrong environment.
- **Request timeout**: A 30-second timeout (api-config.ts:4) is set on all requests. Long-running requests don't hang indefinitely.
- **Proxy in development**: Vite's dev server proxies `/api/v1` to the backend (vite.config.ts:21-26) using `changeOrigin: true`. This means the frontend makes relative requests (`/api/v1/auth/login`) during development, avoiding CORS issues and keeping the API base URL out of client bundle source maps in cases where `.env` is accidentally committed.

### Data Validation
- **Zod at the boundary**: All user inputs pass through Zod schemas before being sent to the API. Schemas define the expected shape, types, and constraints (e.g., email format, string min length, UUID format). This catches malformed data at the UI layer rather than relying solely on server-side validation.
- **No raw user input in the URL**: Parametrized TanStack Router paths (`$studentId`, `$schoolId`) are used for dynamic segments instead of string concatenation. This prevents accidental injection of special characters into URLs.
- **Typed API contracts**: The `ApiResponse<T>` wrapper (api.ts) enforces a consistent success/error response shape. Feature code destructures `res.data.data` in hooks, never accessing `res.data` directly, which prevents assumptions about the response structure from leaking across features.

### Client-Side Secrets
- **No secrets in source code**: All environment-specific values are injected via `import.meta.env` variables (api-config.ts:2-3). The `.env.example` file serves as a template with placeholder values. The actual `.env` file is gitignored and never committed.
- **`VITE_` prefix enforced**: Only variables prefixed with `VITE_` are exposed to the client bundle. Accidental exposure of server-side secrets (e.g., `DB_PASSWORD`) is prevented by Vite's build-time check.
- **Type-safe env access**: `vite-env.d.ts` declares the `ImportMetaEnv` interface, so accessing `import.meta.env.VITE_API_URL` is type-checked. Misspelled or nonexistent environment variables produce compile-time errors.

### Cross-Site Scripting (XSS)
- **React's built-in escaping**: React's JSX escapes all string content by default. No `dangerouslySetInnerHTML` is used anywhere in the codebase.
- **No manual HTML construction**: All DOM output is through JSX components. No `document.write` or `innerHTML` assignments exist.
- **Content-Type enforcement**: The Axios instance sets `Content-Type: application/json` (axios.ts:9) by default, preventing MIME-type confusion attacks.

### Session Management
- **Limited localStorage persistence**: Only the minimum necessary state (token, refreshToken, user) is persisted to localStorage (auth-store.ts:40-44). Long-lived transient state like `isLoading` is intentionally excluded.
- **Explicit logout flow**: `useLogout` (auth/hooks/use-logout.ts) calls the server logout endpoint to revoke refresh tokens on the backend, then clears the client store. This prevents orphaned sessions.
- **No session in URL**: Auth tokens are never passed as query parameters or URL fragments. They travel exclusively in HTTP headers.
