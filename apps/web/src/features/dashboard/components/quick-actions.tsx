import { useNavigate } from '@tanstack/react-router'
import { Card, CardBody, CardHeader } from '@shared/components/ui/card'
import { ROUTES } from '@shared/config/routes'

const actions = [
  { label: 'Add Student', to: ROUTES.STUDENTS },
  { label: 'New Assessment', to: ROUTES.ASSESSMENT_CREATE },
  { label: 'View Insights', to: ROUTES.INSIGHTS },
  { label: 'Manage Classes', to: ROUTES.CLASSES },
]

export function QuickActions() {
  const navigate = useNavigate()

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
              onClick={() => navigate({ to: action.to })}
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
