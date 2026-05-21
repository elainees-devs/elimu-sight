import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/auth-store'
import { useClasses, useCreateClass, ClassTable, ClassForm } from '@features/classes'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button, Modal, Spinner } from "@elimu-sight/ui"
import { EmptyState } from '@shared/components/data-display/empty-state'
import { ROUTES } from '@shared/config/routes'

export function ClassListPage() {
  const navigate = useNavigate()
  const schoolId = useAuthStore((s) => s.user?.schoolId) ?? ''
  const { data: classes, isLoading } = useClasses(schoolId)
  const createClass = useCreateClass(schoolId)

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        subtitle="Manage classes in your school"
        actions={
          <Button onClick={() => setCreateOpen(true)}>New Class</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : classes && classes.length > 0 ? (
        <ClassTable
          data={classes}
          isLoading={isLoading}
          onRowClick={(classItem) => navigate({ to: ROUTES.CLASS_DETAIL(classItem.id) })}
        />
      ) : (
        <EmptyState
          title="No classes found"
          description="Get started by creating your first class."
          action={<Button onClick={() => setCreateOpen(true)}>Create Class</Button>}
        />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Class">
        <ClassForm
          onSubmit={(data) => {
            createClass.mutate(data, {
              onSuccess: () => setCreateOpen(false),
            })
          }}
          isLoading={createClass.isPending}
        />
      </Modal>
    </div>
  )
}
