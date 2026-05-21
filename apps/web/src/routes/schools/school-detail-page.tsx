import { useParams, useNavigate } from '@tanstack/react-router'
import { useSchool, useUpdateSchool, SchoolCard, SchoolForm } from '@features/schools'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button, Spinner } from "@elimu-sight/ui"
import { EmptyState } from '@shared/components/data-display/empty-state'
import { ROUTES } from '@shared/config/routes'

export function SchoolDetailPage() {
  const { schoolId } = useParams({ from: '/dashboard/schools/$schoolId' })
  const navigate = useNavigate()
  const { data: school, isLoading } = useSchool(schoolId)
  const updateSchool = useUpdateSchool(schoolId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!school) {
    return (
      <EmptyState
        title="School not found"
        description="The school you're looking for doesn't exist or has been removed."
        action={<Button onClick={() => navigate({ to: ROUTES.SCHOOLS })}>Back to Schools</Button>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={school.name}
        subtitle="View and edit school details"
        actions={
          <Button variant="ghost" onClick={() => navigate({ to: ROUTES.SCHOOLS })}>
            Back
          </Button>
        }
      />

      <SchoolCard school={school} />

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit School</h2>
        <SchoolForm
          onSubmit={(data) => {
            updateSchool.mutate(data)
          }}
          defaultValues={{
            name: school.name,
            email: school.email,
            phone: school.phone,
            address: school.address,
          }}
          isLoading={updateSchool.isPending}
        />
      </div>
    </div>
  )
}
