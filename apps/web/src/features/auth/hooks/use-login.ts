import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@stores/auth-store'
import { useSchoolStore } from '@stores/school-store'
import { authClient } from '../api/auth-client'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const setSchool = useSchoolStore((s) => s.setSchool)

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authClient.login(email, password),
    onSuccess: (res) => {
      const { token, refreshToken, user } = res.data.data
      setAuth(token, refreshToken, user)
      if (user.schoolId) {
        setSchool(user.schoolId, '')
      }
      navigate({ to: '/dashboard' })
    },
  })
}
