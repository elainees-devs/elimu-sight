import { Card, CardBody, Badge } from "@elimu-sight/ui"
import type { Insight } from "@elimu-sight/types"
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
