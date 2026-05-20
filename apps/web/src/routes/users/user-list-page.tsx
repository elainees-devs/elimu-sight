import { useState } from 'react'
import { useAuthStore } from '@stores/auth-store'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, UserTable, createUserSchema } from '@features/users'
import type { CreateUserInput } from '@features/users'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button } from '@shared/components/ui/button'
import { Modal } from '@shared/components/ui/modal'
import { ConfirmDialog } from '@shared/components/feedback/confirm-dialog'
import { Spinner } from '@shared/components/ui/spinner'
import { EmptyState } from '@shared/components/data-display/empty-state'
import { Input } from '@shared/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function UserListPage() {
  const schoolId = useAuthStore((s) => s.user?.schoolId) ?? ''
  const { data: users, isLoading } = useUsers()
  const createUser = useCreateUser(schoolId)
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const [createOpen, setCreateOpen] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  })

  const onSubmit = (data: CreateUserInput) => {
    createUser.mutate(data, {
      onSuccess: () => {
        setCreateOpen(false)
        reset()
      },
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage users in your school"
        actions={
          <Button onClick={() => setCreateOpen(true)}>New User</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : users && users.length > 0 ? (
        <UserTable data={users} isLoading={isLoading} />
      ) : (
        <EmptyState
          title="No users found"
          description="Get started by adding your first user."
          action={<Button onClick={() => setCreateOpen(true)}>Add User</Button>}
        />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              {...register('role')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="TEACHER">Teacher</option>
              <option value="ACCOUNTANT">Accountant</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
          </div>
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
