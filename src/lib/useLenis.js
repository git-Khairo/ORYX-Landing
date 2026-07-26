import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { setScroll } from './useScrollStore'
import { getReady, subscribeReady } from './useAppReady'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Sets up Lenis smooth scrolling and pushes normalized scroll progress into the
 * shared store every frame (which the 3D scene reads). Reveal animations use
 * IntersectionObserver, so no ScrollTrigger position-sync is needed here.
 * Respects prefers-reduced-motion by disabling smoothing.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReduced) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setScroll({ progress: max > 0 ? window.scrollY / max : 0, velocity: 0 })
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    window.__lenis = lenis

    lenis.on('scroll', ({ scroll, limit, velocity }) => {
      setScroll({
        progress: limit > 0 ? scroll / limit : 0,
        velocity: velocity || 0,
      })
    })

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Hold scroll locked until the preloader curtain lifts.
    if (!getReady()) lenis.stop()
    const unsubReady = subscribeReady(() => {
      if (getReady()) lenis.start()
    })

    return () => {
      unsubReady()
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])
}

export { prefersReduced }
