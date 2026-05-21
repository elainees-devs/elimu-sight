import { Card, CardBody } from "@elimu-sight/ui"
import type { Class } from "@elimu-sight/types"

interface ClassCardProps {
  classItem: Class
  onClick?: () => void
}

export function ClassCard({ classItem, onClick }: ClassCardProps) {
  return (
    <Card className={onClick ? 'cursor-pointer hover:shadow-md' : ''} onClick={onClick}>
      <CardBody>
        <h3 className="font-semibold text-gray-900">{classItem.name}</h3>
        <p className="text-sm text-gray-600">
          {classItem.level} - {classItem.stream}
        </p>
        <p className="text-xs text-gray-500">Academic Year: {classItem.academicYear}</p>
      </CardBody>
    </Card>
  )
}
