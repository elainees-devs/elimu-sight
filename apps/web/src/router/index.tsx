import { useMemo } from 'react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './route-tree'

export function Router() {
  const router = useMemo(() => createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultStaleTime: 30_000,
  }), [])

  return <RouterProvider router={router} />
}
