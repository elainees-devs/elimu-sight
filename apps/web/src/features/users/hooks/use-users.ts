import { useQuery } from '@tanstack/react-query'
import { userClient } from '../api/user-client'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await userClient.list()
      return res.data.data
    },
  })
}
