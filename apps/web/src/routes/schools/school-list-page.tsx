import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSchools, useCreateSchool, useDeleteSchool, SchoolCard, SchoolForm } from '@features/schools'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button, Modal } from "@elimu-sight/ui"
import { ConfirmDialog } from '@shared/components/feedback/confirm-dialog'
import { Spinner } from "@elimu-sight/ui"
import { EmptyState } from '@shared/components/data-display/empty-state'
import { Pagination } from "@elimu-sight/ui"
import { ROUTES } from '@shared/config/routes'

export function SchoolListPage() {
  const navigate = useNavigate()
  const { data, isLoading, page, totalPages, setPage } = useSchools()
  const createSchool = useCreateSchool()
  const deleteSchool = useDeleteSchool()

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const schools = data?.schools ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schools"
        subtitle="Manage all schools in the system"
        actions={
          <Button onClick={() => setCreateOpen(true)}>New School</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : schools.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schools.map((school) => (
              <div key={school.id} className="group relative">
                <SchoolCard
                  school={school}
                  onClick={() => navigate({ to: ROUTES.SCHOOL_DETAIL(school.id) })}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteTarget(school.id)
                  }}
                  className="absolute right-2 top-2 hidden rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 group-hover:block"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState
          title="No schools found"
          description="Get started by creating your first school."
          action={<Button onClick={() => setCreateOpen(true)}>Create School</Button>}
        />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New School">
        <SchoolForm
          onSubmit={(data) => {
            createSchool.mutate(data, {
              onSuccess: () => setCreateOpen(false),
            })
          }}
          isLoading={createSchool.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteSchool.mutate(deleteTarget, {
              onSuccess: () => setDeleteTarget(null),
            })
          }
        }}
        title="Delete School"
        message="Are you sure you want to delete this school? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteSchool.isPending}
      />
    </div>
  )
}
