import { useMutation } from '@tanstack/react-query'
import { authClient } from '../api/auth-client'
import type { RegisterInput } from '../types'

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInput) => authClient.register(data),
  })
}
