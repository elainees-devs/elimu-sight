import { useParams } from '@tanstack/react-router'

export function ClassDetailPage() {
  const { classId } = useParams({ from: '/dashboard/classes/$classId' })
  return <h1 className="text-2xl font-bold text-gray-900">Class: {classId}</h1>
}
