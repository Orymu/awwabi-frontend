import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref and an `inView` flag that flips to true the first time the
 * element scrolls into the viewport. Used for scroll-triggered reveals.
 *
 * Respects `prefers-reduced-motion`: when the user opts out of motion, the
 * element is reported as in view immediately so no animation plays.
 *
 * @param {object} [options]
 * @param {number} [options.threshold=0.35] - fraction visible before firing
 * @param {string} [options.rootMargin='0px 0px -10% 0px'] - viewport margin
 * @param {boolean} [options.once=true] - stop observing after first reveal
 * @returns {[React.RefObject<HTMLElement>, boolean]}
 */
export default function useInView({
  threshold = 0.35,
  rootMargin = '0px 0px -10% 0px',
  once = true,
} = {}) {
  const ref = useRef(null)
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

  return [ref, inView]
}
