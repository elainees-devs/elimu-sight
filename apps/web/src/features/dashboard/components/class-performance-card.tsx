import { Card, CardBody, CardHeader, Spinner, Badge } from "@elimu-sight/ui"
import type { ClassPerformance } from '../types'

interface ClassPerformanceCardProps {
  data: ClassPerformance | null | undefined
  isLoading?: boolean
}

export function ClassPerformanceCard({ data, isLoading }: ClassPerformanceCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Class Performance</h3>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        </CardBody>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Class Performance</h3>
        </CardHeader>
        <CardBody>
          <p className="py-4 text-center text-sm text-gray-500">No performance data available</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Class Performance</h3>
        <p className="text-sm text-gray-500">{data.totalStudents} students</p>
      </CardHeader>
      <CardBody>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="mb-3 text-sm font-medium text-green-700">Top Performers</h4>
            {data.topPerformers.length === 0 ? (
              <p className="text-sm text-gray-500">No assessments yet</p>
            ) : (
              <div className="space-y-2">
                {data.topPerformers.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2">
                    <span className="text-sm font-medium text-gray-900">{s.fullName}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">{s.averageScore}%</Badge>
                      <span className="text-xs text-gray-500">{s.assessmentCount} assessments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-red-700">Needs Improvement</h4>
            {data.bottomPerformers.length === 0 ? (
              <p className="text-sm text-gray-500">No assessments yet</p>
            ) : (
              <div className="space-y-2">
                {data.bottomPerformers.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                    <span className="text-sm font-medium text-gray-900">{s.fullName}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger">{s.averageScore}%</Badge>
                      <span className="text-xs text-gray-500">{s.assessmentCount} assessments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
