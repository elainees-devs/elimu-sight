import { useEffect, useRef, useState, type RefObject } from 'react'

export function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverInit,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return [ref, isIntersecting]
}
