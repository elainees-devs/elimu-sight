import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/auth-store'
import { useCreateAssessment, AssessmentForm } from '@features/assessments'
import { useStudents } from '@features/students'
import { useSubjects } from '@features/subjects'
import type { Student } from '@shared/types/common'
import type { Subject } from '@shared/types/common'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button } from '@shared/components/ui/button'
import { Spinner } from '@shared/components/ui/spinner'
import { EmptyState } from '@shared/components/data-display/empty-state'
import { ROUTES } from '@shared/config/routes'

export function AssessmentCreatePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const schoolId = user?.schoolId ?? ''
  const classId = user?.role === 'TEACHER' ? user?.assignedClassId : undefined
  const createAssessment = useCreateAssessment(schoolId)
  const { data: studentsData, isLoading: studentsLoading } = useStudents({ schoolId, classId })
  const { data: subjects, isLoading: subjectsLoading } = useSubjects()

  const students = ((studentsData as { data?: Student[] } | undefined)?.data ?? []) as Student[]
  const studentClassMap = new Map(students.map((s) => [s.id, s.classId]))
  const subjectList = (subjects ?? []) as Subject[]

  if (studentsLoading || subjectsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (students.length === 0 || subjectList.length === 0) {
    return (
      <EmptyState
        title="Missing data"
        description="You need at least one student and one subject to create an assessment."
        action={<Button onClick={() => navigate({ to: ROUTES.ASSESSMENTS })}>Back</Button>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Assessment"
        subtitle="Record a new student assessment"
        actions={
          <Button variant="ghost" onClick={() => navigate({ to: ROUTES.ASSESSMENTS })}>
            Back
          </Button>
        }
      />

      <div className="rounded-lg border bg-white p-6">
        <AssessmentForm
          onSubmit={(data) => {
            createAssessment.mutate(
              { ...data, schoolId, classId: studentClassMap.get(data.studentId) ?? classId ?? '' },
              { onSuccess: () => navigate({ to: ROUTES.ASSESSMENTS }) },
            )
          }}
          isLoading={createAssessment.isPending}
          students={students.map((s) => ({ value: s.id, label: s.fullName }))}
          subjects={subjectList.map((s) => ({ value: s.id, label: s.name }))}
        />
      </div>
    </div>
  )
}
