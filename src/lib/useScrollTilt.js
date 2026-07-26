import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReduced } from './useLenis'

/**
 * Active Theory-style scroll rotation for cards. Attach the returned ref to a
 * card; as it travels through the viewport it rotates in 3D — tilted as it
 * enters from below, flat at centre, tilting away as it leaves — plus a small
 * depth shift. Driven by getBoundingClientRect on the GSAP ticker (robust
 * everywhere). The card's container needs `perspective` for the 3D to read.
 *
 * @param {object} opts
 * @param {number} opts.max      max rotateX in degrees (default 14)
 * @param {number} opts.axis     'x' | 'y' (default 'x')
 * @param {number} opts.lift     max translateZ in px at the extremes (default -60)
 */
export function useScrollTilt({ max = 14, axis = 'x', lift = -60 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const center = rect.top + rect.height / 2
      // -1 (below viewport) → 0 (centre) → 1 (above viewport)
      const t = gsap.utils.clamp(-1, 1, (center - vh / 2) / (vh / 2))
      const rot = -t * max
      const z = (1 - Math.abs(t)) * lift
      const rx = axis === 'x' ? rot : 0
      const ry = axis === 'y' ? rot : 0
      el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${z}px)`
    }

    gsap.ticker.add(update)
    update()
    return () => gsap.ticker.remove(update)
  }, [max, axis, lift])

  return ref
}
