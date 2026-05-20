import { useState } from 'react'
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@features/admin'
import { StatusBadge } from '@features/admin/components/status-badge'

export function AnnouncementsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const { data, isLoading } = useAnnouncements({ page: String(page), limit: '20', status: statusFilter })
  const createAnnouncement = useCreateAnnouncement()
  const updateAnnouncement = useUpdateAnnouncement()
  const deleteAnnouncement = useDeleteAnnouncement()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', priority: 'MEDIUM', status: 'DRAFT' })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createAnnouncement.mutateAsync(form)
    setShowCreate(false)
    setForm({ title: '', body: '', priority: 'MEDIUM', status: 'DRAFT' })
  }

  const handlePublish = (id: string) => {
    updateAnnouncement.mutate({ id, data: { status: 'PUBLISHED' } })
  }

  const handleArchive = (id: string) => {
    updateAnnouncement.mutate({ id, data: { status: 'ARCHIVED' } })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-1 text-gray-600">Platform-wide communications</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showCreate ? 'Cancel' : 'New Announcement'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <input
              placeholder="Title"
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Body"
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
            <div className="flex gap-3">
              <select
                className="rounded-lg border px-3 py-2 text-sm"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <select
                className="rounded-lg border px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Create
          </button>
        </form>
      )}

      <div className="flex items-center gap-2">
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
        ) : data?.data.length === 0 ? (
          <p className="text-center text-gray-500">No announcements found</p>
        ) : (
          data?.data.map((a) => (
            <div key={a.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{a.title}</h3>
                    <StatusBadge status={a.priority} />
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{a.body}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span>By {a.creatorName}</span>
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    {a.publishedAt && <span>Published: {new Date(a.publishedAt).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {a.status === 'DRAFT' && (
                    <button
                      onClick={() => handlePublish(a.id)}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Publish
                    </button>
                  )}
                  {a.status === 'PUBLISHED' && (
                    <button
                      onClick={() => handleArchive(a.id)}
                      className="text-sm text-yellow-600 hover:underline"
                    >
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => { if (confirm('Delete this announcement?')) deleteAnnouncement.mutate(a.id) }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {data.meta.totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))} disabled={page >= data.meta.totalPages} className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  )
}
