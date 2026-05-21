import { useParams, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/auth-store'
import { useAssessments, useUpdateAssessment, useDeleteAssessment, AssessmentCard, AssessmentForm } from '@features/assessments'
import { useStudents } from '@features/students'
import { useSubjects } from '@features/subjects'
import type { Assessment, Student, Subject } from "@elimu-sight/types"
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button, Spinner } from "@elimu-sight/ui"
import { EmptyState } from '@shared/components/data-display/empty-state'
import { ConfirmDialog } from '@shared/components/feedback/confirm-dialog'
import { ROUTES } from '@shared/config/routes'
import { useState } from 'react'

export function AssessmentDetailPage() {
  const { assessmentId } = useParams({ from: '/dashboard/assessments/$assessmentId' })
  const navigate = useNavigate()
  const schoolId = useAuthStore((s) => s.user?.schoolId) ?? ''
  const { data, isLoading } = useAssessments(schoolId)
  const updateAssessment = useUpdateAssessment(schoolId)
  const deleteAssessment = useDeleteAssessment(schoolId)
  const { data: studentsData } = useStudents({ schoolId })
  const { data: subjects } = useSubjects()

  const [deleteOpen, setDeleteOpen] = useState(false)

  const assessments = (data as { data?: Assessment[] } | undefined)?.data ?? []
  const assessment = assessments.find((a) => a.id === assessmentId)
  const studentList = ((studentsData as { data?: Student[] } | undefined)?.data ?? []) as Student[]
  const subjectList = (subjects ?? []) as Subject[]

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!assessment) {
    return (
      <EmptyState
        title="Assessment not found"
        description="The assessment you're looking for doesn't exist or has been removed."
        action={<Button onClick={() => navigate({ to: ROUTES.ASSESSMENTS })}>Back to Assessments</Button>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${assessment.examType} - Term ${assessment.term}`}
        subtitle="View and edit assessment details"
        actions={
          <div className="flex gap-2">
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete</Button>
            <Button variant="ghost" onClick={() => navigate({ to: ROUTES.ASSESSMENTS })}>
              Back
            </Button>
          </div>
        }
      />

      <AssessmentCard assessment={assessment} />

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit Assessment</h2>
        <AssessmentForm
          onSubmit={(data) => {
            updateAssessment.mutate(
              { id: assessmentId, data },
              { onSuccess: () => navigate({ to: ROUTES.ASSESSMENTS }) },
            )
          }}
          defaultValues={{
            studentId: assessment.studentId,
            subjectId: assessment.subjectId,
            term: assessment.term,
            examType: assessment.examType,
            score: assessment.score,
            totalMarks: assessment.totalMarks,
            grade: assessment.grade,
            remarks: assessment.remarks,
          }}
          isLoading={updateAssessment.isPending}
          students={studentList.map((s) => ({ value: s.id, label: s.fullName }))}
          subjects={subjectList.map((s) => ({ value: s.id, label: s.name }))}
        />
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteAssessment.mutate(assessmentId, {
            onSuccess: () => navigate({ to: ROUTES.ASSESSMENTS }),
          })
        }}
        title="Delete Assessment"
        message="Are you sure you want to delete this assessment? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteAssessment.isPending}
      />
    </div>
  )
}
