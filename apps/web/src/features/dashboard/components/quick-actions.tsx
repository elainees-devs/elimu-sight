import { useNavigate } from '@tanstack/react-router'
import { Card, CardBody, CardHeader } from "@elimu-sight/ui"
import { ROUTES } from '@shared/config/routes'
import type { User } from "@elimu-sight/types"

interface QuickActionsProps {
  user?: User | null
}

interface Action {
  label: string
  to: string | ((user: User) => string)
}

const roleActions: Record<string, Action[]> = {
  HEADTEACHER: [
    { label: 'Add Student', to: ROUTES.STUDENTS },
    { label: 'New Assessment', to: ROUTES.ASSESSMENT_CREATE },
    { label: 'View Insights', to: ROUTES.INSIGHTS },
    { label: 'Manage Classes', to: ROUTES.CLASSES },
    { label: 'Manage Teachers', to: ROUTES.TEACHERS },
  ],
  ADMIN: [
    { label: 'Add Student', to: ROUTES.STUDENTS },
    { label: 'New Assessment', to: ROUTES.ASSESSMENT_CREATE },
    { label: 'View Insights', to: ROUTES.INSIGHTS },
    { label: 'Manage Classes', to: ROUTES.CLASSES },
    { label: 'Manage Teachers', to: ROUTES.TEACHERS },
    { label: 'School Settings', to: ROUTES.SETTINGS },
  ],
  TEACHER: [
    { label: 'New Assessment', to: ROUTES.ASSESSMENT_CREATE },
    { label: 'View Insights', to: ROUTES.INSIGHTS },
    { label: 'View My Class', to: ROUTES.MY_CLASS },
  ],
  ACCOUNTANT: [
    { label: 'View Reports', to: ROUTES.ANALYTICS },
    { label: 'Export Data', to: ROUTES.ANALYTICS },
  ],
}

export function QuickActions({ user }: QuickActionsProps) {
  const navigate = useNavigate()
  const role = user?.role
  const actions = (role && roleActions[role]) || roleActions.HEADTEACHER

  const handleNavigate = (action: Action) => {
    const to = typeof action.to === 'function' ? action.to(user!) : action.to
    navigate({ to })
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Quick Actions</h3>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleNavigate(action)}
              className="rounded-lg border p-4 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
