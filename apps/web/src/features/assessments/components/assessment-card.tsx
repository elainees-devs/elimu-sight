import { Card, CardBody, Badge } from "@elimu-sight/ui"
import type { Assessment } from "@elimu-sight/types"
import { formatDate } from '@shared/lib/formatters'

interface AssessmentCardProps {
  assessment: Assessment
  onClick?: () => void
}

export function AssessmentCard({ assessment, onClick }: AssessmentCardProps) {
  return (
    <Card className={onClick ? 'cursor-pointer hover:shadow-md' : ''} onClick={onClick}>
      <CardBody>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {assessment.examType} - Term {assessment.term}
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {assessment.score}/{assessment.totalMarks}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(assessment.createdAt)}
            </p>
          </div>
          <Badge>{assessment.grade}</Badge>
        </div>
      </CardBody>
    </Card>
  )
}
