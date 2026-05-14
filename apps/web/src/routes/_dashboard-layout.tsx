import { Outlet, useNavigate } from '@tanstack/react-router'
import { ProtectedRoute } from '@router/protected-route'
import { useAuthStore } from '@stores/auth-store'
import { useUIStore } from '@stores/ui-store'
import { useLogout } from '@features/auth'
import { ROUTES } from '@shared/config/routes'

const navItems = [
  { label: 'Overview', to: ROUTES.DASHBOARD },
  { label: 'Analytics', to: ROUTES.ANALYTICS },
  { label: 'Students', to: ROUTES.STUDENTS },
  { label: 'Assessments', to: ROUTES.ASSESSMENTS },
  { label: 'Insights', to: ROUTES.INSIGHTS },
  { label: 'Classes', to: ROUTES.CLASSES },
  { label: 'Subjects', to: ROUTES.SUBJECTS },
  { label: 'Teachers', to: ROUTES.TEACHERS },
  { label: 'Schools', to: ROUTES.SCHOOLS },
  { label: 'Settings', to: ROUTES.SETTINGS },
]

export function DashboardLayout() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const logout = useLogout()

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } flex-shrink-0 overflow-y-auto border-r bg-white transition-all duration-300`}
        >
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="h-8 w-8 rounded-lg bg-blue-600" />
            <span className="text-lg font-bold text-gray-900">ElimuSight</span>
          </div>
          <nav className="mt-4 space-y-1 px-3">
            {navItems.map((item) => (
              <button
                key={item.to}
                onClick={() => navigate({ to: item.to })}
                className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.fullName}</span>
              <button
                onClick={() => logout.mutate()}
                className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
