import { LineChart } from '@shared/components/charts/line-chart'
import type { TrendData } from '../types'

interface TrendChartProps {
  data: TrendData[]
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance Trend</h3>
      <LineChart
        data={data.map((d) => ({ period: d.period, score: d.score }))}
        xKey="period"
        yKey="score"
      />
    </div>
  )
}
