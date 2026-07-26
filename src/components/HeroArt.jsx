import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReduced } from '../lib/useLenis'

/**
 * The hero illustration — a technical emblem (concentric instrument rings,
 * tick marks, orbital ellipses, a desert horizon with dune line-art) that the
 * 3D brand object nests inside. Rings rotate and the whole emblem parallaxes
 * with the pointer, opposite to the 3D object, so illustration and model feel
 * like one interacting system. Purely decorative line-art (no raster images).
 */
export default function HeroArt() {
  const ticks = useRef(null)
  const orbit = useRef(null)
  const svg = useRef(null)

  useEffect(() => {
    if (prefersReduced) return
    const mouse = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)

    let a = 0
    const tick = () => {
      a += 0.0016
      mouse.x += (target.x - mouse.x) * 0.05
      mouse.y += (target.y - mouse.y) * 0.05
      if (ticks.current) ticks.current.style.transform = `rotate(${a * 60}deg)`
      if (orbit.current) orbit.current.style.transform = `rotate(${-a * 40}deg)`
      // emblem parallax — opposite direction to the 3D object's parallax
      if (svg.current)
        svg.current.style.transform = `translate(${-mouse.x * 14}px, ${-mouse.y * 14}px)`
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div className="hero-art" aria-hidden="true">
      <svg ref={svg} viewBox="0 0 800 800" className="hero-art-svg" fill="none">
        {/* concentric instrument rings */}
        <circle cx="400" cy="400" r="190" className="ha-ring ha-dash" />
        <circle cx="400" cy="400" r="270" className="ha-ring ha-faint" />
        <circle cx="400" cy="400" r="350" className="ha-ring ha-gold" />

        {/* rotating tick ring */}
        <g ref={ticks} className="ha-rot">
          {Array.from({ length: 72 }).map((_, i) => {
            const ang = (i / 72) * Math.PI * 2
            const long = i % 6 === 0
            const r1 = long ? 330 : 342
            const r2 = 352
            return (
              <line
                key={i}
                x1={400 + Math.cos(ang) * r1}
                y1={400 + Math.sin(ang) * r1}
                x2={400 + Math.cos(ang) * r2}
                y2={400 + Math.sin(ang) * r2}
                className={long ? 'ha-tick ha-tick-long' : 'ha-tick'}
              />
            )
          })}
        </g>

        {/* orbital ellipses */}
        <g ref={orbit} className="ha-rot">
          <ellipse cx="400" cy="400" rx="360" ry="130" className="ha-orbit" transform="rotate(28 400 400)" />
          <ellipse cx="400" cy="400" rx="360" ry="130" className="ha-orbit" transform="rotate(-28 400 400)" />
        </g>

        {/* centre crosshair */}
        <line x1="400" y1="376" x2="400" y2="424" className="ha-cross" />
        <line x1="376" y1="400" x2="424" y2="400" className="ha-cross" />

        {/* desert horizon + dune line-art */}
        <line x1="60" y1="596" x2="740" y2="596" className="ha-horizon" />
        <path d="M60 596 Q 240 548 420 590 T 740 566" className="ha-dune" />
        <path d="M60 596 Q 300 574 480 596 T 740 588" className="ha-dune ha-dune-2" />
      </svg>
    </div>
  )
}
