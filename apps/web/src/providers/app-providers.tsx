import { type ReactNode } from 'react'
import { QueryProvider } from './query-provider'
import { AuthProvider } from './auth-provider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  )
}
