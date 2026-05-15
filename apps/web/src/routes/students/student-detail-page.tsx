import { useParams, useNavigate } from '@tanstack/react-router'
import { useStudent, useUpdateStudent, StudentCard, StudentForm } from '@features/students'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button } from '@shared/components/ui/button'
import { Spinner } from '@shared/components/ui/spinner'
import { EmptyState } from '@shared/components/data-display/empty-state'
import { ROUTES } from '@shared/config/routes'

export function StudentDetailPage() {
  const { studentId } = useParams({ from: '/dashboard/students/$studentId' })
  const navigate = useNavigate()
  const { data: student, isLoading } = useStudent(studentId)
  const updateStudent = useUpdateStudent(studentId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!student) {
    return (
      <EmptyState
        title="Student not found"
        description="The student you're looking for doesn't exist or has been removed."
        action={<Button onClick={() => navigate({ to: ROUTES.STUDENTS })}>Back to Students</Button>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={student.fullName}
        subtitle="View and edit student details"
        actions={
          <Button variant="ghost" onClick={() => navigate({ to: ROUTES.STUDENTS })}>
            Back
          </Button>
        }
      />

      <StudentCard student={student} />

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit Student</h2>
        <StudentForm
          onSubmit={(data) => {
            updateStudent.mutate(data)
          }}
          defaultValues={{
            fullName: student.fullName,
            gender: student.gender,
            dateOfBirth: student.dateOfBirth,
            guardianName: student.guardianName,
            guardianPhone: student.guardianPhone,
          }}
          isLoading={updateStudent.isPending}
        />
      </div>
    </div>
  )
}
