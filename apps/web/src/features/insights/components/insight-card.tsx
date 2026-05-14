import { Card, CardBody } from '@shared/components/ui/card'
import { Badge } from '@shared/components/ui/badge'
import type { Insight } from '@shared/types/common'
import { formatDate } from '@shared/lib/formatters'

interface InsightCardProps {
  insight: Insight
  onClick?: () => void
}

export function InsightCard({ insight, onClick }: InsightCardProps) {
  return (
    <Card className={onClick ? 'cursor-pointer hover:shadow-md' : ''} onClick={onClick}>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              {insight.title || 'Untitled Insight'}
            </h3>
            {insight.summary && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{insight.summary}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">{formatDate(insight.createdAt)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {insight.type && <Badge>{insight.type}</Badge>}
            {insight.confidenceScore !== undefined && (
              <span className="text-xs text-gray-500">
                {Math.round(insight.confidenceScore)}% confidence
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
