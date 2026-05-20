import { useAdminOverview } from '@features/admin'
import { MetricCard } from '@features/admin/components/metric-card'
import { StatusBadge } from '@features/admin/components/status-badge'
import { useAuthStore } from '@stores/auth-store'

export function AdminOverviewPage() {
  const user = useAuthStore((s) => s.user)
  const { data: overview, isLoading } = useAdminOverview()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Platform overview — welcome back, {user?.fullName?.split(' ')[0] ?? 'Admin'}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : overview ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total Schools" value={overview.totalSchools} />
            <MetricCard label="Active Schools" value={overview.activeSchools} />
            <MetricCard label="Total Users" value={overview.totalUsers} />
            <MetricCard label="Total Students" value={overview.totalStudents} />
            <MetricCard label="Assessments" value={overview.totalAssessments} />
            <MetricCard label="AI Insights" value={overview.totalInsights} />
            <MetricCard label="AI Requests" value={overview.aiRequests} />
            <MetricCard
              label="System Health"
              value={<StatusBadge status={overview.systemHealth} />}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
