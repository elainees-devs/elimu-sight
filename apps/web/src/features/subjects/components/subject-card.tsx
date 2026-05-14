import { Card, CardBody } from '@shared/components/ui/card'
import type { Subject } from '@shared/types/common'

interface SubjectCardProps {
  subject: Subject
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Card>
      <CardBody>
        <h3 className="font-semibold text-gray-900">{subject.name}</h3>
        {subject.code && (
          <p className="text-sm text-gray-500">Code: {subject.code}</p>
        )}
        {subject.description && (
          <p className="mt-1 text-sm text-gray-600">{subject.description}</p>
        )}
      </CardBody>
    </Card>
  )
}
