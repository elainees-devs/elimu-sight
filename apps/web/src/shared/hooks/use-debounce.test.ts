import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './use-debounce'

describe('useDebounce', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('updates after delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'hello' },
    })

    rerender({ value: 'world' })
    expect(result.current).toBe('hello')

    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe('world')
  })

  it('cancels previous timer on rapid updates', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    act(() => { vi.advanceTimersByTime(100) })

    rerender({ value: 'c' })
    act(() => { vi.advanceTimersByTime(300) })

    expect(result.current).toBe('c')
  })
})
