import { type ReactNode, useEffect } from 'react'
import { useAuthStore } from '@stores/auth-store'
import { apiClient } from '@shared/lib/axios'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { token, setAuth, setLoading, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    apiClient
      .get('/auth/me')
      .then((res) => {
        const user = res.data.data
        const refreshToken = useAuthStore.getState().refreshToken ?? ''
        setAuth(token, refreshToken, user)
      })
      .catch(() => {
        clearAuth()
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}
