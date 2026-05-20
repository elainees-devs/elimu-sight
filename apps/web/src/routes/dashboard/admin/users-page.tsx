import { useState } from 'react'
import { useAdminUsers, useCreateUser, useDeactivateUser } from '@features/admin'
import { StatusBadge } from '@features/admin/components/status-badge'

export function AdminUserListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const { data, isLoading } = useAdminUsers({ page: String(page), limit: '20', search, role: roleFilter })
  const createUser = useCreateUser()
  const deactivateUser = useDeactivateUser()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    schoolId: '', fullName: '', email: '', password: '', role: 'TEACHER', assignedClassId: '',
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createUser.mutateAsync({ ...form, assignedClassId: form.assignedClassId || null })
    setShowCreate(false)
    setForm({ schoolId: '', fullName: '', email: '', password: '', role: 'TEACHER', assignedClassId: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Users</h1>
          <p className="mt-1 text-gray-600">Manage all users across schools</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showCreate ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <input placeholder="Full name" className="rounded-lg border px-3 py-2 text-sm" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            <input placeholder="Email" type="email" className="rounded-lg border px-3 py-2 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input placeholder="Password" type="password" className="rounded-lg border px-3 py-2 text-sm" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <input placeholder="School ID" className="rounded-lg border px-3 py-2 text-sm" value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })} required />
            <select className="rounded-lg border px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="ADMIN">Admin</option>
              <option value="HEADTEACHER">Head Teacher</option>
              <option value="TEACHER">Teacher</option>
              <option value="ACCOUNTANT">Accountant</option>
            </select>
            <input placeholder="Class ID (optional)" className="rounded-lg border px-3 py-2 text-sm" value={form.assignedClassId} onChange={(e) => setForm({ ...form, assignedClassId: e.target.value })} />
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Create User
          </button>
        </form>
      )}

      <div className="flex items-center gap-2">
        <input
          placeholder="Search users..."
          className="w-full max-w-sm rounded-lg border px-3 py-2 text-sm"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
        >
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="HEADTEACHER">Head Teacher</option>
          <option value="TEACHER">Teacher</option>
          <option value="ACCOUNTANT">Accountant</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 font-medium text-gray-600">Role</th>
              <th className="px-4 py-3 font-medium text-gray-600">School</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : data?.data.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
            ) : (
              data?.data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3"><StatusBadge status={user.role} /></td>
                  <td className="px-4 py-3 text-gray-600">{user.schoolName || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={user.isActive ? 'active' : 'inactive'} /></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { if (confirm('Deactivate this user?')) deactivateUser.mutate(user.id) }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Deactivate
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
    </div>
  )
}
