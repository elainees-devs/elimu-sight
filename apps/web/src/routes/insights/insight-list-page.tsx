import { useNavigate } from '@tanstack/react-router'
import { useSchoolStore } from '@stores/school-store'
import { useSchoolInsights, useGenerateInsight, InsightList, InsightGenerator } from '@features/insights'
import { useQueryClient } from '@tanstack/react-query'

export function InsightListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const schoolId = useSchoolStore((s) => s.schoolId) ?? ''
  const { data, isLoading } = useSchoolInsights(schoolId)
  const generateInsight = useGenerateInsight()

  const insights = data?.insights ?? []

  const handleGenerate = (params: { type: string; classId?: string; studentId?: string; subjectId?: string }) => {
    generateInsight.mutate(params, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['insights', 'school', schoolId] })
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <p className="mt-1 text-gray-600">AI-generated performance insights and recommendations</p>
      </div>

      <InsightGenerator onGenerate={handleGenerate} isLoading={generateInsight.isPending} />

      <InsightList
        insights={insights}
        isLoading={isLoading}
        onInsightClick={(insight) => navigate({ to: `/dashboard/insights/${insight.id}` })}
      />
    </div>
  )
}
