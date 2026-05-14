import { BarChart } from '@shared/components/charts/bar-chart'
import type { PerformanceData } from '../types'

interface PerformanceChartProps {
  data: PerformanceData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance by Subject</h3>
      <BarChart
        data={data.map((d) => ({ subject: d.subject, averageScore: d.averageScore }))}
        xKey="subject"
        yKey="averageScore"
      />
    </div>
  )
}
