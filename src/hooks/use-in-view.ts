'use client'

import { useEffect, useRef, useState } from 'react'

export interface UseInViewOptions {
  /** fraction visible before firing (0-1) */
  threshold?: number
  /** viewport margin around the root */
  rootMargin?: string
  /** stop observing after the first reveal */
  once?: boolean
}

/**
 * Returns a ref and an `inView` flag that flips to true the first time the
 * element scrolls into the viewport. Used for scroll-triggered reveals.
 *
 * Respects `prefers-reduced-motion`: when the user opts out of motion, the
 * element is reported as in view immediately so no animation plays.
 */
export function useInView<T extends HTMLElement = HTMLElement>({
  threshold = 0.35,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView] as const
}
