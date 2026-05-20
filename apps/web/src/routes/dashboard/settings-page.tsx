import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@stores/auth-store'
import { useSchoolStore } from '@stores/school-store'
import { apiClient } from '@shared/lib/axios'
import { Card, CardBody, CardHeader } from '@shared/components/ui/card'
import { Badge } from '@shared/components/ui/badge'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { PageHeader } from '@shared/components/data-display/page-header'
import type { ApiResponse } from '@shared/types/api'
import type { User } from '@shared/types/common'

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const schoolName = useSchoolStore((s) => s.schoolName)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')

  const updateProfile = useMutation({
    mutationFn: (data: { fullName?: string; email?: string }) =>
      apiClient.patch<ApiResponse<User>>('/users/me', data),
    onSuccess: (res) => {
      setUser(res.data.data)
      setEditing(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: { fullName?: string; email?: string } = {}
    if (fullName !== user?.fullName) data.fullName = fullName
    if (email !== user?.email) data.email = email
    if (Object.keys(data).length === 0) {
      setEditing(false)
      return
    }
    updateProfile.mutate(data)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account and school settings" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Profile</h3>
            {!editing && (
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="ghost" type="button" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
              {updateProfile.isError && (
                <p className="text-sm text-red-600">Failed to update profile</p>
              )}
            </form>
          ) : (
            <dl className="divide-y">
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user?.fullName ?? '-'}</dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user?.email ?? '-'}</dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 sm:col-span-2 sm:mt-0">
                  <Badge>{user?.role ?? '-'}</Badge>
                </dd>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">School</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{schoolName ?? '-'}</dd>
              </div>
            </dl>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
