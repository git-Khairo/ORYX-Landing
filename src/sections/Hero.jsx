import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { brand } from '../content/copy'
import { scrollToId } from '../lib/scrollTo'
import { prefersReduced } from '../lib/useLenis'
import { useAppReady } from '../lib/useAppReady'

/**
 * The opening frame.
 *
 * Built around one idea: the wordmark and the sculpture occupy the same centre,
 * so the horns rise through the type rather than sitting beside it. Everything
 * else is pushed to the edges — a rule and a label at the top, a measured band
 * of pillars along the foot — which leaves the middle of the screen almost
 * empty and lets the sculpture own it.
 *
 * The entrance is one authored moment, not five: the wordmark unmasks upward
 * from its own baseline while the edge furniture fades in beneath it.
 */
export default function Hero() {
  const root = useRef(null)
  const ready = useAppReady()

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.from('[data-intro]', { opacity: 0, duration: 0.4, stagger: 0.04 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from('.hero-mark span', {
        yPercent: 118,
        duration: 1.5,
        stagger: 0.075,
      })
        .from('.hero-rule', { scaleY: 0, duration: 1.1, transformOrigin: 'top center' }, 0.15)
        .from('.hero-category', { opacity: 0, y: -12, duration: 0.9 }, 0.35)
        .from('.hero-ready', { opacity: 0, y: 18, duration: 1.1 }, 0.55)
        .from('.hero-promise', { opacity: 0, y: 18, duration: 1.1 }, 0.68)
        .from('.hero-foot > *', { opacity: 0, y: 14, duration: 1, stagger: 0.06 }, 0.8)
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="hero" data-section="0" className="section hero tone-cream" ref={root}>
      <span className="hero-grain" aria-hidden="true" />
      <span className="hero-vignette" aria-hidden="true" />

      <div className="section-inner">
        <span className="hero-rule" aria-hidden="true" />
        <p className="hero-category">{brand.category}</p>

        {/* Split per letter so the mark can unmask stroke by stroke. */}
        <h1 className="hero-mark" aria-label={brand.name}>
          {brand.name.split('').map((letter, i) => (
            <i key={i} aria-hidden="true">
              <span>{letter}</span>
            </i>
          ))}
        </h1>

        <p className="hero-ready">{brand.tagline}</p>
        <p className="hero-promise">{brand.promise}</p>
      </div>

      <div className="hero-foot">
        <div className="hero-pillars">
          {brand.pillars.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
        <button className="scroll-cue" onClick={() => scrollToId('discover')} aria-label="Scroll to begin">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
