import type { ReactNode } from 'react'
import { useAuthStore } from '@stores/auth-store'
import type { Role } from '@shared/types/common'

interface RoleRouteProps {
  children: ReactNode
  allowedRoles: Role[]
}

export function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user)
  const userRole = user?.role

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
