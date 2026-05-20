import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/auth-store'
import { useAssessments, AssessmentTable } from '@features/assessments'
import type { Assessment } from '@shared/types/common'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button } from '@shared/components/ui/button'
import { Spinner } from '@shared/components/ui/spinner'
import { EmptyState } from '@shared/components/data-display/empty-state'
import { ROUTES } from '@shared/config/routes'

export function AssessmentListPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const schoolId = user?.schoolId ?? ''
  const classId = user?.role === 'TEACHER' ? user?.assignedClassId : undefined
  const { data, isLoading } = useAssessments(schoolId, { classId })

  const assessments = (data as { data?: Assessment[] } | undefined)?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        subtitle="View and manage student assessments"
        actions={
          <Button onClick={() => navigate({ to: ROUTES.ASSESSMENT_CREATE })}>New Assessment</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : assessments.length > 0 ? (
        <AssessmentTable
          data={assessments}
          isLoading={isLoading}
          onRowClick={(assessment) => navigate({ to: ROUTES.ASSESSMENT_DETAIL(assessment.id) })}
        />
      ) : (
        <EmptyState
          title="No assessments found"
          description="Get started by creating your first assessment."
          action={<Button onClick={() => navigate({ to: ROUTES.ASSESSMENT_CREATE })}>Create Assessment</Button>}
        />
      )}
    </div>
  )
}
