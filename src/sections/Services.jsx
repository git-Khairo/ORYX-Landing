import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { services } from '../content/copy'
import ServiceIcon from '../components/illustrations/ServiceIcon'
import { prefersReduced } from '../lib/useLenis'

/**
 * The three services merged into ONE horizontal-scroll showcase. The section is
 * tall; an inner sticky stage pins to the viewport while a horizontal track is
 * translated by scroll progress — so scrolling down slides the panels sideways.
 * Driven by getBoundingClientRect on the GSAP ticker (robust everywhere), with
 * a per-panel parallax as each one passes centre. Falls back to vertical stack
 * for reduced motion.
 */
export default function Services() {
  const section = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    if (prefersReduced) return
    const sec = section.current
    const tr = track.current
    if (!sec || !tr) return

    const update = () => {
      const total = sec.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-sec.getBoundingClientRect().top, 0), total)
      const p = total > 0 ? scrolled / total : 0
      const maxX = tr.scrollWidth - window.innerWidth
      const x = -p * maxX
      tr.style.transform = `translate3d(${x}px,0,0)`

      // per-panel parallax + focus as it crosses screen centre
      const panels = tr.querySelectorAll('.svc-panel')
      const cx = window.innerWidth / 2
      panels.forEach((panel) => {
        const r = panel.getBoundingClientRect()
        const pc = r.left + r.width / 2
        const d = (pc - cx) / window.innerWidth // ~ -1..1
        const inner = panel.querySelector('.svc-panel-inner')
        if (inner) {
          inner.style.transform = `translateX(${d * -40}px)`
          inner.style.opacity = String(gsap.utils.clamp(0.25, 1, 1 - Math.abs(d) * 1.1))
        }
      })
    }
    gsap.ticker.add(update)
    update()
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <section id="services" className="services" ref={section} data-section="3">
      <div className="services-sticky">
        <header className="services-head">
          <span className="eyebrow">What we do</span>
          <span className="services-count">03 Services</span>
        </header>

        <div className="services-track" ref={track}>
          <div className="svc-cover">
            <div className="svc-cover-inner">
              <h2 className="svc-cover-title">One partner.<br />Every operation.</h2>
              <p className="svc-cover-sub">Scroll to move through what ORYX takes off your plate — cleaning, delivery and facility management, run as one.</p>
              <span className="svc-scroll-hint">Scroll →</span>
            </div>
          </div>

          {services.map((s, i) => (
            <article className="svc-panel" key={s.id}>
              <span className="svc-ghost">{String(i + 1).padStart(2, '0')}</span>
              <div className="svc-panel-inner">
                <ServiceIcon id={s.id} />
                <p className="svc-kicker">{s.eyebrow}</p>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-pillar">{s.pillar}</p>
                <p className="svc-body">{s.body}</p>
                <ul className="svc-features">
                  {s.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
