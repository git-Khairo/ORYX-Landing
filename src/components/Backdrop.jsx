import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import VideoBackdrop from './VideoBackdrop'
import { film } from '../content/media'

/**
 * The fixed film layer behind the whole page.
 *
 * It carries the opening frame's footage and retires once the hero is behind
 * you — the sculpture and the cream take over from there, and the service films
 * are section-owned rather than global.
 *
 * Opacity is written straight to the node on the GSAP ticker instead of through
 * state: this reads scroll every frame, and routing that through React would
 * re-render the tree sixty times a second for one number.
 */
export default function Backdrop() {
  const wrap = useRef(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return

    let current = 1
    const update = () => {
      const vh = window.innerHeight
      // Full strength across the hero, gone by the time the next section has
      // fully arrived. Measured off real scroll so it survives section resizes.
      const target = 1 - gsap.utils.clamp(0, 1, (window.scrollY - vh * 0.15) / (vh * 0.7))
      current += (target - current) * 0.12
      el.style.opacity = String(current)
      el.style.visibility = current < 0.01 ? 'hidden' : 'visible'
    }
    gsap.ticker.add(update)
    update()
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <div className="backdrop-layer" aria-hidden="true">
      <div className="backdrop-film" ref={wrap}>
        <VideoBackdrop src={film.hero.src} tone="hero" />
      </div>
    </div>
  )
}
