import { useState } from 'react'
import { useSupportTickets, useUpdateSupportTicket } from '@features/admin'
import { StatusBadge } from '@features/admin/components/status-badge'

export function SupportTicketsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const { data, isLoading } = useSupportTickets({
    page: String(page), limit: '20',
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(priorityFilter ? { priority: priorityFilter } : {}),
  })
  const updateTicket = useUpdateSupportTicket()
  const [detailId, setDetailId] = useState<string | null>(null)

  const ticket = detailId ? data?.data.find((t) => t.id === detailId) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <p className="mt-1 text-gray-600">Support ticket management</p>
      </div>

      {detailId && ticket ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{ticket.subject}</h2>
            <button onClick={() => setDetailId(null)} className="text-sm text-blue-600 hover:underline">
              Back to list
            </button>
          </div>
          <div className="mb-4 flex gap-2">
            <StatusBadge status={ticket.status} />
            <StatusBadge status={ticket.priority} />
          </div>
          <p className="mb-4 whitespace-pre-wrap text-sm text-gray-700">{ticket.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">School:</span> {ticket.schoolName}</div>
            <div><span className="text-gray-500">Created by:</span> {ticket.creatorName}</div>
            <div><span className="text-gray-500">Assigned to:</span> {ticket.assignedToName || 'Unassigned'}</div>
            <div><span className="text-gray-500">Created:</span> {new Date(ticket.createdAt).toLocaleString()}</div>
          </div>
          <div className="mt-4 flex gap-2">
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={ticket.status}
              onChange={(e) => {
                updateTicket.mutate({ id: ticket.id, data: { status: e.target.value } })
                setDetailId(null)
              }}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={ticket.priority}
              onChange={(e) => {
                updateTicket.mutate({ id: ticket.id, data: { priority: e.target.value } })
                setDetailId(null)
              }}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            >
              <option value="">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1) }}
            >
              <option value="">All priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Subject</th>
                  <th className="px-4 py-3 font-medium text-gray-600">School</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Priority</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Assigned</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : data?.data.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No tickets found</td></tr>
                ) : (
                  data?.data.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{t.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{t.schoolName}</td>
                      <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-3"><StatusBadge status={t.priority} /></td>
                      <td className="px-4 py-3 text-gray-600">{t.assignedToName || '-'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setDetailId(t.id)} className="text-sm text-blue-600 hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-600">Page {page} of {data.meta.totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))} disabled={page >= data.meta.totalPages} className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
