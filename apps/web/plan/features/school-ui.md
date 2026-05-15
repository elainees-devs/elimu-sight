# School UI — Implementation Plan

## What Already Exists (no work needed)

- **`school-client.ts`** — full CRUD: `list`, `get`, `create`, `update`, `delete`
- **`use-schools.ts`** — `useQuery` fetching all schools
- **`use-school.ts`** — `useQuery` fetching a school by ID
- **`SchoolCard`** — renders school details with badge
- **`SchoolForm`** — React Hook Form + Zod, wired up, ready to use
- **Types/Schemas** — complete (`School`, `SchoolFormData`, `schoolSchema`)

## What's Missing — Implementation Order

### Step 1: Add mutation hooks (`features/schools/hooks/`)

Create three files following the exact pattern from `features/students/hooks/`:

| File | What it does |
|---|---|
| `use-create-school.ts` | `useMutation` → `schoolClient.create`, invalidates `['schools']` |
| `use-update-school.ts` | `useMutation` → `schoolClient.update(id, data)`, invalidates `['schools']` |
| `use-delete-school.ts` | `useMutation` → `schoolClient.delete(id)`, invalidates `['schools']` |

Pattern:
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { schoolClient } from '../api/school-client'

export function useCreateSchool() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: schoolClient.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schools'] }),
  })
}
```

### Step 2: Wire up `school-list-page.tsx`

Follow the `insight-list-page.tsx` pattern:

- Import `useSchools`, `useSchoolStore`, `useCreateSchool`, `useDeleteSchool`, `SchoolCard`, `SchoolForm`, navigation
- Call `useSchools()` hook, render `SchoolCard` in a grid for each school
- Add a "New School" button that opens a modal/dialog with `SchoolForm`
- Use `useCreateSchool` to handle form submission
- Use `useDeleteSchool` wrapped in a confirm dialog for removal
- Each card `onClick` navigates to `ROUTES.SCHOOL_DETAIL(school.id)`

### Step 3: Wire up `school-detail-page.tsx`

- Import `useSchool(id)`, `useUpdateSchool`, `SchoolForm`, `SchoolCard`
- Fetch school data with `useSchool(schoolId)`
- Display school info (can reuse `SchoolCard` or inline fields)
- Add an edit form section with `SchoolForm` pre-populated via `defaultValues`
- Handle update via `useUpdateSchool.mutate`

### Step 4: Register new exports in `features/schools/index.ts`

Add the three new hooks to the barrel export.

## Summary

| Item | Files to create | Files to edit |
|---|---|---|
| Mutation hooks | 3 | 1 (`index.ts`) |
| List page | 0 | 1 (`school-list-page.tsx`) |
| Detail page | 0 | 1 (`school-detail-page.tsx`) |
| **Total** | **3 new files** | **3 edits** |
