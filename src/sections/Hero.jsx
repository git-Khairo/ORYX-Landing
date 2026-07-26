import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { brand } from '../content/copy'
import { scrollToId } from '../lib/scrollTo'
import { prefersReduced } from '../lib/useLenis'
import { useAppReady } from '../lib/useAppReady'
import HeroArt from '../components/HeroArt'

export default function Hero() {
  const root = useRef(null)
  const ready = useAppReady()

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('[data-intro]')
      gsap.from(targets, {
        y: prefersReduced ? 0 : 40,
        opacity: 0,
        duration: prefersReduced ? 0.5 : 1.2,
        ease: 'power3.out',
        stagger: 0.12,
        delay: prefersReduced ? 0 : 0.1,
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="hero" data-section="0" className="section hero tone-cream" ref={root}>
      <HeroArt />
      <div className="section-inner">
        <p className="hero-category" data-intro>{brand.category}</p>
        <h1 className="hero-title" data-intro>{brand.name}</h1>
        <p className="hero-ready" data-intro>{brand.tagline}</p>
        <p className="hero-promise" data-intro>{brand.promise}</p>
        <div className="hero-pillars" data-intro>
          {brand.pillars.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </div>
      <button className="scroll-cue" onClick={() => scrollToId('discover')} aria-label="Scroll to begin">
        <i />
        Scroll
      </button>
    </section>
  )
}
