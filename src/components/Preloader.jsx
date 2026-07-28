import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { setReady } from '../lib/useAppReady'
import { prefersReduced } from '../lib/useLenis'
import { brand } from '../content/copy'

/**
 * Active Theory-style entrance: a dark, branded counter that loads 0→100, then
 * lifts like a curtain to reveal the cream hero — the same ORYX / "Always Ready."
 * lockup on both sides makes it a match-cut. Flips the shared ready signal as it
 * exits so the hero intro, smooth scroll, and 3D assembly all fire together.
 */
export default function Preloader() {
  const root = useRef(null)
  const [count, setCount] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // Lock scroll while the curtain is up.
    document.documentElement.classList.add('is-loading')

    if (prefersReduced) {
      setCount(100)
      const t = setTimeout(() => {
        document.documentElement.classList.remove('is-loading')
        setReady(true)
        setGone(true)
      }, 400)
      return () => clearTimeout(t)
    }

    // Safety net: never leave the site locked/hidden if the timeline stalls.
    // Critically this must ALSO drop `is-loading` — that class pins html and
    // body to overflow:hidden, so setting ready alone would leave a page that
    // looks finished but cannot be scrolled by any means.
    const safety = setTimeout(() => {
      document.documentElement.classList.remove('is-loading')
      setReady(true)
      setGone(true)
    }, 5000)

    const counter = { v: 0 }
    const tl = gsap.timeline()

    // Count up with a slightly organic ease, held until fonts are ready.
    tl.to(counter, {
      v: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(counter.v)),
    })

    // Brief beat at 100%, then lift the curtain.
    tl.to(root.current, {
      yPercent: -100,
      duration: 1.15,
      ease: 'expo.inOut',
      delay: 0.25,
      onStart: () => {
        document.documentElement.classList.remove('is-loading')
        setReady(true)
      },
      onComplete: () => setGone(true),
    })

    return () => {
      clearTimeout(safety)
      tl.kill()
      document.documentElement.classList.remove('is-loading')
    }
  }, [])

  if (gone) return null

  return (
    <div className="preloader" ref={root} role="status" aria-live="polite" aria-label="Loading">
      <div className="pl-center">
        <p className="pl-eyebrow">{brand.category}</p>
        <h1 className="pl-mark">{brand.name}</h1>
        <p className="pl-tag">{brand.tagline}</p>
      </div>

      <div className="pl-foot">
        <span className="pl-status">Preparing the experience</span>
        <span className="pl-count">
          {String(count).padStart(3, '0')}
          <em>%</em>
        </span>
      </div>
      <div className="pl-bar">
        <span className="pl-bar-fill" style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </div>
  )
}
