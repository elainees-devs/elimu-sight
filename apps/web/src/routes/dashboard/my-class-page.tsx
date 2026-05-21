import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/auth-store'
import { useClass } from '@features/classes'
import { useStudents } from '@features/students'
import { useDashboardStats, useClassPerformance } from '@features/dashboard'
import { ClassPerformanceCard } from '@features/dashboard/components/class-performance-card'
import { PageHeader } from '@shared/components/data-display/page-header'
import { EmptyState } from '@shared/components/data-display/empty-state'
import { Button, Spinner } from "@elimu-sight/ui"
import { StudentTable } from '@features/students/components/student-table'
import { StatsGrid } from '@features/dashboard/components/stats-grid'
import { ROUTES } from '@shared/config/routes'

export function MyClassPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const classId = user?.assignedClassId

  const { data: classItem, isLoading: classLoading } = useClass(classId ?? '')
  const { data: studentsResponse, isLoading: studentsLoading } = useStudents({ classId })
  const { data: stats, isLoading: statsLoading } = useDashboardStats(classId)
  const { data: classPerformance, isLoading: perfLoading } = useClassPerformance(classId ?? '')

  if (!classId) {
    return (
      <EmptyState
        title="No Class Assigned"
        description="You have not been assigned to a class yet. Contact your administrator."
        action={
          <Button onClick={() => navigate({ to: ROUTES.DASHBOARD })}>
            Back to Dashboard
          </Button>
        }
      />
    )
  }

  if (classLoading || statsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  const students = studentsResponse?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title={classItem?.name ?? 'My Class'}
        subtitle={classItem ? `${classItem.level} - ${classItem.stream} · ${classItem.academicYear}` : 'Class roster and performance'}
        actions={
          <Button variant="ghost" onClick={() => navigate({ to: ROUTES.DASHBOARD })}>
            Back
          </Button>
        }
      />

      <StatsGrid stats={stats ?? null} isLoading={statsLoading} role="TEACHER" />

      <ClassPerformanceCard data={classPerformance} isLoading={perfLoading} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Class Roster</h2>
        <StudentTable
          data={students}
          isLoading={studentsLoading}
          onRowClick={(student) => navigate({ to: ROUTES.STUDENT_DETAIL(student.id) })}
        />
      </div>
    </div>
  )
}
