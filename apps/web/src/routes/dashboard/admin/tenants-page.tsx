import { useState } from 'react'
import { useAdminSchools, useCreateSchool, useDeleteSchool } from '@features/admin'
import { StatusBadge } from '@features/admin/components/status-badge'
import { useNavigate } from '@tanstack/react-router'

export function TenantListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useAdminSchools({ page: String(page), limit: '20', search })
  const createSchool = useCreateSchool()
  const deleteSchool = useDeleteSchool()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', subscriptionPlan: 'FREE' })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createSchool.mutateAsync(form)
    setShowCreate(false)
    setForm({ name: '', email: '', phone: '', address: '', subscriptionPlan: 'FREE' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools / Tenants</h1>
          <p className="mt-1 text-gray-600">Manage all schools on the platform</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showCreate ? 'Cancel' : 'Add School'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="School name"
              className="rounded-lg border px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Email"
              type="email"
              className="rounded-lg border px-3 py-2 text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              placeholder="Phone"
              className="rounded-lg border px-3 py-2 text-sm"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <input
              placeholder="Address"
              className="rounded-lg border px-3 py-2 text-sm"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={form.subscriptionPlan}
              onChange={(e) => setForm({ ...form, subscriptionPlan: e.target.value })}
            >
              <option value="FREE">Free</option>
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create School
          </button>
        </form>
      )}

      <div className="flex items-center gap-2">
        <input
          placeholder="Search schools..."
          className="w-full max-w-sm rounded-lg border px-3 py-2 text-sm"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 font-medium text-gray-600">Plan</th>
              <th className="px-4 py-3 font-medium text-gray-600">Users</th>
              <th className="px-4 py-3 font-medium text-gray-600">Students</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No schools found</td></tr>
            ) : (
              data?.data.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{school.name}</td>
                  <td className="px-4 py-3 text-gray-600">{school.email}</td>
                  <td className="px-4 py-3"><StatusBadge status={school.subscriptionPlan} /></td>
                  <td className="px-4 py-3 text-gray-600">{school._count.users}</td>
                  <td className="px-4 py-3 text-gray-600">{school._count.students}</td>
                  <td className="px-4 py-3"><StatusBadge status={school.isActive ? 'active' : 'inactive'} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate({ to: `/dashboard/admin/tenants/${school.id}` })}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => { if (confirm('Deactivate this school?')) deleteSchool.mutate(school.id) }}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {data.meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
            disabled={page >= data.meta.totalPages}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
