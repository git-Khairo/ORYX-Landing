import { useEffect } from 'react'
import { setScroll } from './useScrollStore'

/**
 * Feeds the shared scroll store from the page's real scroll position.
 *
 * The name is historical — Lenis is gone. With the pager owning wheel input and
 * scrollEngine owning the animation, a smooth-scroll library had nothing left
 * to do except add a failure mode, and it did: its `scrollTo` stopped moving
 * the page, which froze the site because the pager had already swallowed the
 * gesture. A passive scroll listener is all this ever needed to be.
 *
 * The file keeps its path and its `prefersReduced` export because most of the
 * app imports that from here.
 */
const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useLenis() {
  useEffect(() => {
    let last = window.scrollY
    let lastTime = performance.now()

    const onScroll = () => {
      const scroll = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const now = performance.now()
      const dt = Math.max(now - lastTime, 1)

      // px/ms, roughly matching what the scene used to read from Lenis.
      const velocity = (scroll - last) / dt
      last = scroll
      lastTime = now

      setScroll({
        scroll,
        progress: max > 0 ? scroll / max : 0,
        velocity,
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

export { prefersReduced }
