import { useParams } from '@tanstack/react-router'
import { useAdminSchoolDetail } from '@features/admin'
import { StatusBadge } from '@features/admin/components/status-badge'
import { MetricCard } from '@features/admin/components/metric-card'

export function TenantDetailPage() {
  const { schoolId } = useParams({ from: '/dashboard/admin/tenants/$schoolId' })
  const { data: school, isLoading } = useAdminSchoolDetail(schoolId)

  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
  }

  if (!school) {
    return <p className="text-gray-500">School not found</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
          <p className="mt-1 text-gray-600">{school.email} &middot; {school.phone}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={school.subscriptionPlan} />
          <StatusBadge status={school.isActive ? 'active' : 'inactive'} />
        </div>
      </div>

      {school.address && (
        <p className="text-sm text-gray-500">Address: {school.address}</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Users" value={school._count.users} />
        <MetricCard label="Students" value={school._count.students} />
        <MetricCard label="Classes" value={school._count.classes} />
        <MetricCard label="Assessments" value={school._count.assessments} />
        <MetricCard label="Insights" value={school._count.insights} />
      </div>
    </div>
  )
}
