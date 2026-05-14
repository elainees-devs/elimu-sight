import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@shared/lib/axios'
import { useAuthStore } from '@stores/auth-store'
import { useSchoolStore } from '@stores/school-store'
import type { ApiResponse } from '@shared/types/api'
import type { Insight } from '@shared/types/common'

export function useGenerateInsight() {
  const schoolId = useSchoolStore((s) => s.schoolId)

  return useMutation({
    mutationFn: async (params: { type: string; classId?: string; studentId?: string; subjectId?: string }) => {
      const sid = schoolId ?? useAuthStore.getState().user?.schoolId
      if (!sid) throw new Error('School ID required')

      const { type, classId, studentId, subjectId } = params

      if ((type === 'CLASS_PERFORMANCE' || type === 'TERM_ANALYSIS' || type === 'RECOMMENDATION') && classId) {
        const res = await apiClient.post<ApiResponse<Insight>>('/ai/generate/class', { classId, schoolId: sid })
        return res.data.data
      }

      if ((type === 'STUDENT_PERFORMANCE' || type === 'PREDICTION') && studentId) {
        const res = await apiClient.post<ApiResponse<Insight>>('/ai/generate/student', { studentId, schoolId: sid })
        return res.data.data
      }

      if (type === 'SUBJECT_TREND' && subjectId) {
        const res = await apiClient.post<ApiResponse<Insight>>('/ai/generate/subject', { subjectId, schoolId: sid })
        return res.data.data
      }

      throw new Error(`Cannot generate ${type} insight: missing required IDs`)
    },
  })
}
