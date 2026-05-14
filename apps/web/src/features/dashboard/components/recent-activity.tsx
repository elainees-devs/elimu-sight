import { Card, CardBody, CardHeader } from '@shared/components/ui/card'
import { timeAgo } from '@shared/lib/formatters'
import type { RecentActivity as RecentActivityType } from '../types'

interface RecentActivityProps {
  activities: RecentActivityType[]
  isLoading?: boolean
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
                </div>
                <span className="text-xs text-gray-400">{timeAgo(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
