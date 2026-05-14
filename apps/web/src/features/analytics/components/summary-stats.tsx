import { StatCard } from '@shared/components/data-display/stat-card'
import type { SummaryStats as SummaryStatsType } from '../types'

interface SummaryStatsProps {
  stats: SummaryStatsType | null
}

export function SummaryStats({ stats }: SummaryStatsProps) {
  if (!stats) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Students" value={stats.totalStudents} />
      <StatCard label="Average Score" value={`${stats.averageScore}%`} />
      <StatCard label="Pass Rate" value={`${stats.passRate}%`} />
      <StatCard label="At Risk" value={stats.atRiskCount} />
    </div>
  )
}
