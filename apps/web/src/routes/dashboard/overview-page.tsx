import { useAuthStore } from '@stores/auth-store'
import { useDashboardStats, useRecentActivity } from '@features/dashboard'
import { StatsGrid } from '@features/dashboard/components/stats-grid'
import { QuickActions } from '@features/dashboard/components/quick-actions'
import { RecentActivity } from '@features/dashboard/components/recent-activity'
import { AlertsWidget } from '@features/dashboard/components/alerts-widget'

export function OverviewPage() {
  const user = useAuthStore((s) => s.user)
  const classId = user?.role === 'TEACHER' ? user?.assignedClassId : undefined
  const { data: stats, isLoading: statsLoading } = useDashboardStats(classId)
  const { data: activities, isLoading: activityLoading } = useRecentActivity(classId)

  const role = user?.role

  const scope = role === 'TEACHER' ? 'Class' : 'School'

  const alerts = [
    ...(stats && stats.atRiskCount > 0
      ? [{ type: 'warning' as const, message: `${stats.atRiskCount} student(s) at risk of low performance` }]
      : []),
    ...(stats && stats.averageScore < 50
      ? [{ type: 'error' as const, message: `${scope} average score is ${stats.averageScore}% — below target` }]
      : []),
    ...(stats && stats.averageScore >= 50
      ? [{ type: 'info' as const, message: `Overall ${scope.toLowerCase()} average score is ${stats.averageScore}%` }]
      : []),
    ...(role === 'ADMIN' && stats && stats.totalTeachers === 0
      ? [{ type: 'warning' as const, message: 'No teachers added yet — set up your teaching staff' }]
      : []),
    ...(role === 'ADMIN' && stats && stats.totalClasses === 0
      ? [{ type: 'warning' as const, message: 'No classes created yet — start by adding classes' }]
      : []),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'TEACHER' ? 'My Class Overview' : user?.role === 'ADMIN' ? 'School Administration' : 'Dashboard Overview'}
        </h1>
        <p className="mt-1 text-gray-600">
          Welcome back, {user?.fullName?.split(' ')[0] ?? 'User'}
        </p>
      </div>

      <StatsGrid stats={stats ?? null} isLoading={statsLoading} role={user?.role} />

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions user={user} />
        <AlertsWidget alerts={alerts} isLoading={statsLoading} />
      </div>

      <RecentActivity activities={activities ?? []} isLoading={activityLoading} />
    </div>
  )
}
