import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { prefersReduced } from './useLenis'
import { setScroll } from './useScrollStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * The live Lenis instance, for anything that needs to *drive* scroll rather
 * than read it — anchor links, mainly. Going through Lenis matters: a raw
 * `window.scrollTo` loop and Lenis would each be writing scroll position on the
 * same frames and fight over it.
 */
let lenisInstance = null
export const getLenis = () => lenisInstance

/**
 * The page's scroll spine — Lenis for buttery smoothing, GSAP ScrollTrigger for
 * every scrubbed/pinned act. This replaces the old snap-pager wholesale: there
 * is no wheel hijacking and no jump-to-section, only continuous scroll that the
 * acts read from.
 *
 * Lenis drives ScrollTrigger.update on every scroll and is itself ticked by the
 * GSAP clock, so smoothing and scrubbing share one heartbeat and never drift.
 * We also feed the shared scroll store here, so the pill nav (is-scrolled /
 * is-hidden) keeps working without the retired passive listener.
 *
 * Under prefers-reduced-motion we mount nothing: native scroll, no smoothing,
 * and the acts fall back to their static layouts.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    lenisInstance = lenis

    // `direction` is intentionally not passed: the store derives it from the
    // change in `scroll`, with a dead-zone that stops sub-pixel jitter from
    // strobing the nav.
    lenis.on('scroll', ({ scroll, velocity, progress }) => {
      ScrollTrigger.update()
      setScroll({ scroll, progress: progress ?? 0, velocity: velocity ?? 0 })
    })

    const onRaf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    // Layout images/fonts settle after paint; make ScrollTrigger re-measure.
    const refresh = () => ScrollTrigger.refresh()
    const t = setTimeout(refresh, 600)
    window.addEventListener('load', refresh)

    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(onRaf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}
