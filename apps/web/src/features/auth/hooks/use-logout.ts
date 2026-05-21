import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@stores/auth-store'
import { useSchoolStore } from '@stores/school-store'
import { authClient } from '../api/auth-client'

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const clearSchool = useSchoolStore((s) => s.clearSchool)

  return useMutation({
    mutationFn: () => authClient.logout(),
    onSettled: () => {
      queryClient.clear()
      clearAuth()
      clearSchool()
    },
  })
}
