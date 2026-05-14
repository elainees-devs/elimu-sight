import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@stores/auth-store'
import { useSchoolStore } from '@stores/school-store'
import { authClient } from '../api/auth-client'

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const clearSchool = useSchoolStore((s) => s.clearSchool)

  return useMutation({
    mutationFn: () => authClient.logout(),
    onSettled: () => {
      clearAuth()
      clearSchool()
    },
  })
}
