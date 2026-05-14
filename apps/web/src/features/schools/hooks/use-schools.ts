import { useQuery } from '@tanstack/react-query'
import { schoolClient } from '../api/school-client'

export function useSchools() {
  return useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const res = await schoolClient.list()
      return res.data.data
    },
  })
}
