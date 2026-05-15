import { useParams, useNavigate } from '@tanstack/react-router'
import { useClass, useUpdateClass, ClassCard, ClassForm } from '@features/classes'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button } from '@shared/components/ui/button'
import { Spinner } from '@shared/components/ui/spinner'
import { EmptyState } from '@shared/components/data-display/empty-state'
import { ROUTES } from '@shared/config/routes'

export function ClassDetailPage() {
  const { classId } = useParams({ from: '/dashboard/classes/$classId' })
  const navigate = useNavigate()
  const { data: classItem, isLoading } = useClass(classId)
  const updateClass = useUpdateClass(classId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!classItem) {
    return (
      <EmptyState
        title="Class not found"
        description="The class you're looking for doesn't exist or has been removed."
        action={<Button onClick={() => navigate({ to: ROUTES.CLASSES })}>Back to Classes</Button>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={classItem.name}
        subtitle="View and edit class details"
        actions={
          <Button variant="ghost" onClick={() => navigate({ to: ROUTES.CLASSES })}>
            Back
          </Button>
        }
      />

      <ClassCard classItem={classItem} />

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit Class</h2>
        <ClassForm
          onSubmit={(data) => {
            updateClass.mutate(data)
          }}
          defaultValues={{
            name: classItem.name,
            level: classItem.level,
            stream: classItem.stream,
            academicYear: classItem.academicYear,
          }}
          isLoading={updateClass.isPending}
        />
      </div>
    </div>
  )
}
