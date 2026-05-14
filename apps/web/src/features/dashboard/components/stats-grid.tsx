import { StatCard } from '@shared/components/data-display/stat-card'
import type { DashboardStats } from '../types'

interface StatsGridProps {
  stats: DashboardStats | null
  isLoading?: boolean
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard label="Total Students" value={stats.totalStudents} />
      <StatCard label="Total Teachers" value={stats.totalTeachers} />
      <StatCard label="Total Classes" value={stats.totalClasses} />
      <StatCard label="Assessments" value={stats.totalAssessments} />
      <StatCard label="Average Score" value={`${stats.averageScore}%`} />
      <StatCard
        label="At Risk"
        value={stats.atRiskCount}
        trend={{ value: stats.atRiskCount, isPositive: false }}
      />
    </div>
  )
}
