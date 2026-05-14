import { useParams } from '@tanstack/react-router'

export function AssessmentDetailPage() {
  const { assessmentId } = useParams({ from: '/dashboard/assessments/$assessmentId' })
  return <h1 className="text-2xl font-bold text-gray-900">Assessment: {assessmentId}</h1>
}
