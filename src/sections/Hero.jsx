import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { brand } from '../content/copy'
import { scrollToId } from '../lib/scrollTo'
import { prefersReduced } from '../lib/useLenis'
import { useAppReady } from '../lib/useAppReady'
import MarqueeHeadline from '../components/MarqueeHeadline'
import ServiceCarousel3D from '../components/three/ServiceCarousel3D'
import '../styles/hero3d.css'

/**
 * The opening frame — rebuilt on the "AI Studio" structure, ORYX-skinned.
 *
 *   · a drifting Instrument-Serif marquee of the brand keywords sits behind
 *   · a 3D coverflow of the service cards turning through the centre
 *   · brand furniture (category, tagline, promise) frames it top and foot
 *
 * The entrance stays one authored moment: the furniture unmasks while the
 * carousel fades up from its own idle state.
 */
export default function Hero() {
  const root = useRef(null)
  const ready = useAppReady()

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.from('[data-intro]', { opacity: 0, duration: 0.4, stagger: 0.05 })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hero3d-eyebrow', { opacity: 0, y: -14, duration: 0.9 }, 0.1)
        .from('.svc-stage', { opacity: 0, y: 26, duration: 1.3 }, 0.2)
        .from('.hero3d-tagline', { opacity: 0, y: 18, duration: 1.1 }, 0.5)
        .from('.hero3d-promise', { opacity: 0, y: 16, duration: 1.1 }, 0.62)
        .from('.hero3d-cue', { opacity: 0, y: 12, duration: 0.9 }, 0.75)
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="hero" data-section="0" data-stops="1" className="section hero3d" ref={root}>
      <MarqueeHeadline />

      <div className="hero3d-head">
        <p className="hero3d-eyebrow" data-intro>{brand.category}</p>
      </div>

      <div className="hero3d-stage">
        <ServiceCarousel3D />
      </div>

      <div className="hero3d-foot">
        <p className="hero3d-tagline" data-intro>{brand.tagline}</p>
        <p className="hero3d-promise" data-intro>{brand.promise}</p>
        <button className="scroll-cue hero3d-cue" data-intro onClick={() => scrollToId('discover')} aria-label="Scroll to begin">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
