import { useQuery } from '@tanstack/react-query'
import { subjectClient } from '../api/subject-client'

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await subjectClient.list()
      return res.data.data
    },
  })
}
