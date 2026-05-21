import { Card, CardBody, CardHeader } from "@elimu-sight/ui"
import { Alert } from '@shared/components/feedback/alert'

interface AlertWidgetItem {
  type: 'warning' | 'error' | 'info'
  message: string
}

interface AlertsWidgetProps {
  alerts: AlertWidgetItem[]
  isLoading?: boolean
}

export function AlertsWidget({ alerts, isLoading }: AlertsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Alerts</h3>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No alerts</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <Alert key={i} variant={alert.type}>
                {alert.message}
              </Alert>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
