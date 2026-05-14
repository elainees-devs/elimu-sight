import { describe, it, expect, beforeEach } from 'vitest'
import { useSchoolStore } from './school-store'

describe('school-store', () => {
  beforeEach(() => {
    useSchoolStore.setState({ schoolId: null, schoolName: null })
  })

  it('starts with null values', () => {
    const state = useSchoolStore.getState()
    expect(state.schoolId).toBeNull()
    expect(state.schoolName).toBeNull()
  })

  it('setSchool sets id and name', () => {
    useSchoolStore.getState().setSchool('school-1', 'Test School')
    const state = useSchoolStore.getState()
    expect(state.schoolId).toBe('school-1')
    expect(state.schoolName).toBe('Test School')
  })

  it('clearSchool resets state', () => {
    useSchoolStore.getState().setSchool('school-1', 'Test School')
    useSchoolStore.getState().clearSchool()
    expect(useSchoolStore.getState().schoolId).toBeNull()
    expect(useSchoolStore.getState().schoolName).toBeNull()
  })
})
