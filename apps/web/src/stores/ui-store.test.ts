import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from './ui-store'

describe('ui-store', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: true, theme: 'light' })
  })

  it('starts with sidebar open and light theme', () => {
    const state = useUIStore.getState()
    expect(state.sidebarOpen).toBe(true)
    expect(state.theme).toBe('light')
  })

  it('toggleSidebar flips sidebar', () => {
    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarOpen).toBe(false)
    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarOpen).toBe(true)
  })

  it('setSidebarOpen sets to specific value', () => {
    useUIStore.getState().setSidebarOpen(false)
    expect(useUIStore.getState().sidebarOpen).toBe(false)
  })

  it('setTheme updates theme', () => {
    useUIStore.getState().setTheme('dark')
    expect(useUIStore.getState().theme).toBe('dark')
  })
})
