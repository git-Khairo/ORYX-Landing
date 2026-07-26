import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { journey } from '../content/copy'
import { scrollToId } from '../lib/scrollTo'

/**
 * Right-edge rail marking the 11 journey stages. Tracks the section whose start
 * is closest above the viewport centre (polled on the GSAP ticker); clicking a
 * node scrolls to it.
 */
export default function ProgressRail() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const check = () => {
      const mid = window.innerHeight * 0.5
      let current = 0
      journey.forEach((j, i) => {
        const el = document.getElementById(j.id)
        if (el && el.getBoundingClientRect().top <= mid) current = i
      })
      setActive((prev) => (prev === current ? prev : current))
    }
    gsap.ticker.add(check)
    check()
    return () => gsap.ticker.remove(check)
  }, [])

  return (
    <nav className="rail" aria-label="Journey progress">
      {journey.map((j, i) => (
        <button
          key={j.id}
          className={`rail-node ${i === active ? 'is-active' : ''}`}
          onClick={() => scrollToId(j.id)}
          aria-label={`Go to ${j.label}`}
          aria-current={i === active ? 'true' : undefined}
        >
          <span className="rail-dot" />
          <span className="rail-label">{j.label}</span>
        </button>
      ))}
    </nav>
  )
}
