import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@stores/auth-store'
import { authClient } from '../api/auth-client'

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const res = await authClient.getMe()
      return res.data.data
    },
    enabled: !!token,
  })
}
