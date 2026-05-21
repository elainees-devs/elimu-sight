import { useState } from 'react'
import { useSubjects, useCreateSubject, SubjectCard, SubjectForm } from '@features/subjects'
import { PageHeader } from '@shared/components/data-display/page-header'
import { Button, Modal, Spinner } from "@elimu-sight/ui"
import { EmptyState } from '@shared/components/data-display/empty-state'

export function SubjectListPage() {
  const { data: subjects, isLoading } = useSubjects()
  const createSubject = useCreateSubject()

  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        subtitle="Manage subjects offered in your school"
        actions={
          <Button onClick={() => setCreateOpen(true)}>New Subject</Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : subjects && subjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No subjects found"
          description="Get started by creating your first subject."
          action={<Button onClick={() => setCreateOpen(true)}>Create Subject</Button>}
        />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Subject">
        <SubjectForm
          onSubmit={(data) => {
            createSubject.mutate(data, {
              onSuccess: () => setCreateOpen(false),
            })
          }}
          isLoading={createSubject.isPending}
        />
      </Modal>
    </div>
  )
}
