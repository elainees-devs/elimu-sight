import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/auth-store'
import { useStudents, useCreateStudent, StudentTable, StudentForm } from '@features/students'
import type { Student } from "@elimu-sight/types"
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button, Modal, Spinner } from "@elimu-sight/ui"
import { EmptyState } from '@shared/components/data-display/empty-state'
import { ROUTES } from '@shared/config/routes'

export function StudentListPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const schoolId = user?.schoolId ?? ''
  const classId = user?.role === 'TEACHER' ? user?.assignedClassId : undefined
  const { data, isLoading } = useStudents({ schoolId, classId })
  const createStudent = useCreateStudent(schoolId, '')

  const [createOpen, setCreateOpen] = useState(false)

  const students = (data as { data?: Student[] } | undefined)?.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        subtitle="Manage students in your school"
        actions={
          <Button onClick={() => setCreateOpen(true)}>New Student</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : students.length > 0 ? (
        <StudentTable
          data={students}
          isLoading={isLoading}
          onRowClick={(student) => navigate({ to: ROUTES.STUDENT_DETAIL(student.id) })}
        />
      ) : (
        <EmptyState
          title="No students found"
          description="Get started by adding your first student."
          action={<Button onClick={() => setCreateOpen(true)}>Add Student</Button>}
        />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Student">
        <StudentForm
          onSubmit={(data) => {
            createStudent.mutate(data, {
              onSuccess: () => setCreateOpen(false),
            })
          }}
          isLoading={createStudent.isPending}
        />
      </Modal>
    </div>
  )
}
