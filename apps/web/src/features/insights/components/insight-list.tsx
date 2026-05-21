import { InsightCard } from './insight-card'
import { EmptyState } from '@shared/components/data-display/empty-state'
import { Spinner } from "@elimu-sight/ui"
import type { Insight } from "@elimu-sight/types"

interface InsightListProps {
  insights: Insight[]
  isLoading?: boolean
  onInsightClick?: (insight: Insight) => void
}

export function InsightList({ insights, isLoading, onInsightClick }: InsightListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (!insights.length) {
    return (
      <EmptyState
        title="No insights yet"
        description="Generate insights to see them here."
      />
    )
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onClick={() => onInsightClick?.(insight)}
        />
      ))}
    </div>
  )
}
