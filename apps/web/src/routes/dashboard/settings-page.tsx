import { useAuthStore } from '@stores/auth-store'
import { useSchoolStore } from '@stores/school-store'
import { Card, CardBody, CardHeader } from '@shared/components/ui/card'
import { Badge } from '@shared/components/ui/badge'
import { PageHeader } from '@shared/components/data-display/page-header'

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const schoolName = useSchoolStore((s) => s.schoolName)

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account and school settings" />

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Profile</h3>
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>
    </div>
  )
}
