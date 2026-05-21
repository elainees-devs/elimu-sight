import { Card, CardBody, CardHeader, Badge } from "@elimu-sight/ui"
import type { RiskData } from '../types'

interface RiskMatrixProps {
  data: RiskData[]
}

const riskColors = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
} as const

export function RiskMatrix({ data }: RiskMatrixProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Risk Matrix</h3>
      </CardHeader>
      <CardBody>
        {data.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No risk data available</p>
        ) : (
          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.studentId} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.studentName}</p>
                  <p className="text-xs text-gray-500">{item.reason}</p>
                </div>
                <Badge variant={riskColors[item.riskLevel]}>
                  {item.riskLevel}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
