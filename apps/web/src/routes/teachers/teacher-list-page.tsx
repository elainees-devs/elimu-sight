import { useState } from 'react'
import { useAuthStore } from '@stores/auth-store'
import { useTeachers, useCreateTeacher, TeacherTable, teacherSchema } from '@features/teachers'
import type { TeacherFormData } from '@features/teachers'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button, Modal, Spinner } from "@elimu-sight/ui"
import { EmptyState } from '@shared/components/data-display/empty-state'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@elimu-sight/ui"

export function TeacherListPage() {
  const schoolId = useAuthStore((s) => s.user?.schoolId) ?? ''
  const { data: teachers, isLoading } = useTeachers()
  const createTeacher = useCreateTeacher(schoolId)

  const [createOpen, setCreateOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  })

  const onSubmit = (data: TeacherFormData) => {
    createTeacher.mutate(data, {
      onSuccess: () => {
        setCreateOpen(false)
        reset()
      },
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        subtitle="Manage teachers in your school"
        actions={
          <Button onClick={() => setCreateOpen(true)}>New Teacher</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : teachers && teachers.length > 0 ? (
        <TeacherTable data={teachers} isLoading={isLoading} />
      ) : (
        <EmptyState
          title="No teachers found"
          description="Get started by adding your first teacher."
          action={<Button onClick={() => setCreateOpen(true)}>Add Teacher</Button>}
        />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Teacher">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <Button type="submit" disabled={createTeacher.isPending}>
            {createTeacher.isPending ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
