import { useParams } from '@tanstack/react-router'

export function InsightDetailPage() {
  const { insightId } = useParams({ from: '/dashboard/insights/$insightId' })
  return <h1 className="text-2xl font-bold text-gray-900">Insight: {insightId}</h1>
}
