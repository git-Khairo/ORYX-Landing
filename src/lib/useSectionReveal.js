import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReduced } from './useLenis'

/**
 * Shared reveal behaviour for every section. Attach the returned ref to the
 * section root; any descendant with [data-reveal] animates in when it scrolls
 * into view. Reveal is driven by polling getBoundingClientRect on the GSAP
 * ticker — robust across smooth-scroll and every environment (no
 * IntersectionObserver / ScrollTrigger dependency).
 * Direction via data-reveal="up|left|right|scale". Honors reduced motion.
 */
export function useSectionReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = Array.from(root.querySelectorAll('[data-reveal]'))
    if (!items.length) return

    // Preset the hidden "from" state.
    items.forEach((el) => {
      const dir = el.getAttribute('data-reveal') || 'up'
      const from = { opacity: 0 }
      if (!prefersReduced) {
        if (dir === 'up') from.y = 42
        if (dir === 'left') from.x = -48
        if (dir === 'right') from.x = 48
        if (dir === 'scale') from.scale = 0.92
      }
      gsap.set(el, from)
    })

    const pending = new Set(items)
    const check = () => {
      const vh = window.innerHeight
      const trigger = vh * 0.86
      let localOrder = 0
      pending.forEach((el) => {
        const top = el.getBoundingClientRect().top
        if (top < trigger && top > -vh) {
          pending.delete(el)
          gsap.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: prefersReduced ? 0.4 : 1.0,
            ease: 'power3.out',
            delay: prefersReduced ? 0 : (localOrder++ % 6) * 0.07,
            overwrite: 'auto',
            // Clear the inline transform once revealed so CSS :hover transforms
            // (card lift/scale) can take over.
            clearProps: 'transform',
          })
        }
      })
      if (pending.size === 0) gsap.ticker.remove(check)
    }
    gsap.ticker.add(check)
    check() // reveal anything already in view on mount

    return () => gsap.ticker.remove(check)
  }, [])

  return ref
}
