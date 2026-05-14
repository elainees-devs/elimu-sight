import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToggle } from './use-toggle'

describe('useToggle', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })

  it('defaults to false', () => {
    const { result } = renderHook(() => useToggle())
    expect(result.current[0]).toBe(false)
  })

  it('toggle flips value', () => {
    const { result } = renderHook(() => useToggle(false))
    act(() => { result.current[1]() })
    expect(result.current[0]).toBe(true)
    act(() => { result.current[1]() })
    expect(result.current[0]).toBe(false)
  })

  it('setValue sets to specific value', () => {
    const { result } = renderHook(() => useToggle(false))
    act(() => { result.current[2](true) })
    expect(result.current[0]).toBe(true)
  })
})
