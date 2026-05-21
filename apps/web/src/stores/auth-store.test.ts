import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth-store'
import type { User } from "@elimu-sight/types"

const mockUser: User = {
  id: '1',
  schoolId: 'school-1',
  fullName: 'John Doe',
  email: 'john@example.com',
  role: 'ADMIN',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
}

describe('auth-store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
    })
  })

  it('starts with loading state', () => {
    const state = useAuthStore.getState()
    expect(state.isLoading).toBe(true)
    expect(state.isAuthenticated).toBe(false)
  })

  it('setAuth sets token and user', () => {
    useAuthStore.getState().setAuth('token-123', 'refresh-123', mockUser)
    const state = useAuthStore.getState()
    expect(state.token).toBe('token-123')
    expect(state.refreshToken).toBe('refresh-123')
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
  })

  it('setUser updates user', () => {
    useAuthStore.getState().setAuth('token-123', 'refresh-123', mockUser)
    const updated = { ...mockUser, fullName: 'Jane Doe' }
    useAuthStore.getState().setUser(updated)
    expect(useAuthStore.getState().user?.fullName).toBe('Jane Doe')
  })

  it('clearAuth resets state', () => {
    useAuthStore.getState().setAuth('token-123', 'refresh-123', mockUser)
    useAuthStore.getState().clearAuth()
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.refreshToken).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
  })

  it('setLoading updates loading state', () => {
    useAuthStore.getState().setLoading(false)
    expect(useAuthStore.getState().isLoading).toBe(false)
  })
})
