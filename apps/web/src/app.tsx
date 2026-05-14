import { AppProviders } from '@providers/app-providers'
import { Router } from '@router/index'

export function App() {
  return (
    <AppProviders>
      <Router />
    </AppProviders>
  )
}
