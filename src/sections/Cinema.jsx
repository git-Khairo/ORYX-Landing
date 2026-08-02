import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { brand } from '../content/copy'
import { prefersReduced } from '../lib/useLenis'
import { useAppReady } from '../lib/useAppReady'
import { setCinema, phase, ACT } from '../lib/useCinemaProgress'
import MarqueeHeadline from '../components/MarqueeHeadline'
import ServiceCarousel3D from '../components/three/ServiceCarousel3D'
import Standard from './Standard'
import '../styles/hero3d.css'
import '../styles/cinema.css'

/**
 * Acts 1–4 — the pinned opening.
 *
 * A tall scroll region whose inner stage is pinned for its whole length, so the
 * page appears to hold still while scroll scrubs the 3D sequence: the mark
 * alone, the ring assembling around it, the turn through the services, and the
 * final rush into the fill.
 *
 * This component owns exactly one number. ScrollTrigger writes master progress
 * into the cinema store on every update and the R3F scene reads it per frame —
 * no React state in the hot path, so scrubbing costs nothing in re-renders. The
 * DOM furniture (eyebrow, tagline, fill wipe) is driven from the same progress
 * through cheap style writes on refs.
 */
export default function Cinema({ onOpenService, onContact }) {
  const root = useRef(null)
  const stage = useRef(null)
  const fill = useRef(null)
  const marquee = useRef(null)
  const atmos = useRef(null)
  const darkRef = useRef(false)
  const ember = useRef(null)
  const standard = useRef(null)
  const ready = useAppReady()
  // Reduced motion gets the static composition, no pin and no scrub.
  const [staticMode] = useState(prefersReduced)

  useEffect(() => {
    if (!ready || staticMode) return

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage.current,
        pinSpacing: false,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          setCinema(p)

          const tMorph = phase(p, ...ACT.morph)
          const tZoom = phase(p, ...ACT.zoom)

          if (marquee.current) marquee.current.style.opacity = tMorph.toFixed(3)
          // Present from the first frame — the hero is inset and sits on it —
          // and only stands down for the zoom.
          if (atmos.current) atmos.current.style.opacity = (1 - tZoom).toFixed(3)

          if (fill.current) {
            // Hold at nothing until the mark is genuinely close, then commit.
            const o = Math.max(0, (tZoom - 0.55) / 0.45)
            fill.current.style.opacity = o.toFixed(3)
          }

          // The Standard is already on the fill; this stretch only builds its
          // copy on. Each element reads `--t` and its own `--i` to decide how
          // far through its own slot it is, which gives a staggered build
          // without a timeline to keep in sync with the scrub.
          const tStd = phase(p, ...ACT.standard)
          // The nav is permanent now, so it has to survive the act it is over.
          // A class on the root rather than React state: this runs every scroll
          // frame, and re-rendering the bar that often to change two colours
          // would be absurd. Guarded so the class is only touched on a change.
          const onDark = tStd > 0.3
          if (onDark !== darkRef.current) {
            darkRef.current = onDark
            document.documentElement.classList.toggle('tone-dark', onDark)
          }

          if (standard.current) {
            standard.current.style.setProperty('--t', tStd.toFixed(4))
            standard.current.style.opacity = tStd > 0 ? '1' : '0'
            standard.current.style.pointerEvents = tStd > 0.6 ? 'auto' : 'none'
          }
        },
      })
      return () => st.kill()
    }, root)

    return () => {
      ctx.revert()
      document.documentElement.classList.remove('tone-dark')
      darkRef.current = false
    }
  }, [ready, staticMode])

  // The ember tracks the cursor. It is a DOM layer, not part of the WebGL
  // scene, so it gets its own eased follow: read the pointer, chase it a little
  // each frame, and write the position as CSS variables the gradient centres
  // on. Eased so the glow trails the cursor like light with weight rather than
  // snapping to it, and it holds still (last position) when the pointer leaves.
  useEffect(() => {
    if (staticMode) return
    const el = ember.current
    if (!el) return
    let raf = 0
    const target = { x: 50, y: 58 }
    const cur = { x: 50, y: 58 }
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 100
      target.y = (e.clientY / window.innerHeight) * 100
    }
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.055
      cur.y += (target.y - cur.y) * 0.055
      el.style.setProperty('--ex', `${cur.x.toFixed(2)}%`)
      el.style.setProperty('--ey', `${cur.y.toFixed(2)}%`)
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [staticMode])

  return (
    <section
      id="hero"
      className={`cinema ${staticMode ? 'is-static' : ''}`}
      ref={root}
      aria-label={`${brand.name} — ${brand.tagline}`}
    >
      {/* The Standard has no section of its own to jump to — it is a moment
          inside this pinned run — so the nav anchors on a marker sitting at the
          scroll depth where its build begins. */}
      <span id="standard" className="cinema-anchor" aria-hidden="true" />

      <div className="cinema-stage" ref={stage}>
        {/* The world the ring turns in — and, now that the hero is inset, the
            field it floats on. Deliberately not the hero's language: where the
            hero is warm paper with flowing rails, this is a dark technical
            field with a measured dot grid and a slow ember behind it. Two
            different places, one palette. */}
        <div className="cinema-atmos" ref={atmos} aria-hidden="true">
          <span className="cinema-atmos-ember" ref={ember} />
          <span className="cinema-atmos-grid" />
          <span className="cinema-atmos-grain" />
          <span className="cinema-atmos-vignette" />
        </div>

        {/* The marquee is the ring's backdrop, not the hero's — behind the hero
            it ran straight through the headline. It arrives with the ring. */}
        <div className="cinema-marquee" ref={marquee}>
          <MarqueeHeadline />
        </div>

        <div className="cinema-canvas">
          <ServiceCarousel3D
            onOpen={onOpenService}
            onContact={onContact}
            /* "Explore services" opens the first service rather than scrolling
               somewhere — the services are panels, not a place on the page. */
            onExplore={() => onOpenService?.('cleaning', null)}
          />
        </div>

        {/* Act 1 lives in the canvas now: the hero *is* the brand card, one
            element that reflows into a card as the ring opens and whose mark is
            the same node that later fills the screen. See `BrandCard`. */}

        {/* The wipe the mark opens into, and the page that is already on it. */}
        <div className="cinema-fill" ref={fill} aria-hidden="true" />
        <div className="cinema-standard" ref={standard}>
          <Standard />
        </div>
      </div>
    </section>
  )
}
