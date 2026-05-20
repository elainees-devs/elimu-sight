import { useParams, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/auth-store'
import { useTeacher, useUpdateTeacher, useAssignClass, TeacherDetailCard, TeacherAssignClass } from '@features/teachers'
import { useClasses } from '@features/classes'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button } from '@shared/components/ui/button'
import { Spinner } from '@shared/components/ui/spinner'
import { EmptyState } from '@shared/components/data-display/empty-state'
import { Input } from '@shared/components/ui/input'
import type { Class } from '@shared/types/common'
import { ROUTES } from '@shared/config/routes'
import { useState } from 'react'

export function TeacherDetailPage() {
  const { teacherId } = useParams({ from: '/dashboard/teachers/$teacherId' })
  const navigate = useNavigate()
  const schoolId = useAuthStore((s) => s.user?.schoolId) ?? ''
  const { data: teacher, isLoading } = useTeacher(teacherId)
  const updateTeacher = useUpdateTeacher(teacherId)
  const assignClass = useAssignClass(teacherId)
  const { data: classes } = useClasses(schoolId)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!teacher) {
    return (
      <EmptyState
        title="Teacher not found"
        description="The teacher you're looking for doesn't exist or has been removed."
        action={<Button onClick={() => navigate({ to: ROUTES.TEACHERS })}>Back to Teachers</Button>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={teacher.fullName}
        subtitle="View and edit teacher details"
        actions={
          <Button variant="ghost" onClick={() => navigate({ to: ROUTES.TEACHERS })}>
            Back
          </Button>
        }
      />

      <TeacherDetailCard teacher={teacher} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit Teacher</h2>
          <div className="space-y-4">
            <Input
              label="Full Name"
              defaultValue={fullName || teacher.fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              defaultValue={email || teacher.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={() =>
                updateTeacher.mutate({ fullName, email }, {
                  onSuccess: () => { setFullName(''); setEmail('') },
                })
              }
              disabled={updateTeacher.isPending || (!fullName && !email)}
            >
              {updateTeacher.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <TeacherAssignClass
          currentClassId={teacher.assignedClassId}
          classes={(classes ?? []) as Class[]}
          isLoading={assignClass.isPending}
          onAssign={(classId) => assignClass.mutate(classId)}
        />
      </div>
    </div>
  )
}
