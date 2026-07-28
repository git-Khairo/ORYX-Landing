import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import VideoBackdrop from './VideoBackdrop'
import CtaButton from './CtaButton'
import { film } from '../content/media'
import { prefersReduced } from '../lib/useLenis'
import { useScrollLock, useEscape, useFocusTrap } from '../lib/useOverlay'

/**
 * The expanded service world.
 *
 * Not a route and not a page: the experience underneath is untouched and
 * leaving puts the visitor back on exactly the section they opened it from.
 * The panel's own film fills the screen, so the thing they pressed and the
 * thing that arrived are visibly the same object.
 */
export default function ServiceWorld({ service, onClose, onRequest }) {
  const scroller = useRef(null)
  const bar = useRef(null)
  const trap = useFocusTrap(true)
  const [entered, setEntered] = useState(false)

  useScrollLock(true)
  useEscape(true, onClose)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Reading progress for the hairline at the top of the world.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const update = () => {
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? el.scrollTop / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    el.addEventListener('scroll', update, { passive: true })
    update()
    return () => el.removeEventListener('scroll', update)
  }, [])

  // The headline unmasks line by line once the world has arrived.
  useEffect(() => {
    if (prefersReduced || !entered) return
    const ctx = gsap.context(() => {
      gsap.from('.sw-headline span > i', {
        yPercent: 116,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.09,
        delay: 0.12,
      })
      gsap.from('.sw-lede', { opacity: 0, y: 20, duration: 0.9, ease: 'expo.out', delay: 0.36 })
    }, scroller)
    return () => ctx.revert()
  }, [entered])

  const { world } = service

  // Portalled to <body>. Rendered in place it would live inside .content-layer
  // (z-index 2), which is a stacking context — so the nav at z-index 40 painted
  // over the whole world no matter how high the overlay's own z-index went,
  // covering the "All services" control.
  return createPortal(
    <div
      className={`service-world ${entered ? 'is-in' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${service.title}. ${service.pillar}`}
    >
      <VideoBackdrop src={film[service.id]?.src} tone="world" className="sw-film" />

      <div className="sw-shell" ref={trap}>
        <div className="sw-bar">
          <span className="sw-progress" ref={bar} aria-hidden="true" />
          <div className="sw-bar-inner">
            <button type="button" className="sw-back" onClick={onClose}>
              <i aria-hidden="true">←</i> All services
            </button>
            <span className="sw-index">{service.eyebrow}</span>
          </div>
        </div>

        <div className="sw-scroll" ref={scroller}>
          <section className="sw-open">
            <h2 className="sw-headline">
              {world.headline.split('\n').map((line) => (
                <span key={line}>
                  <i>{line}</i>
                </span>
              ))}
            </h2>
            <p className="sw-lede">{world.lede}</p>
          </section>

          {world.scenes.map((scene, i) => (
            <section className={`sw-scene sw-scene--${i % 3}`} key={scene.marker}>
              <p className="sw-marker">{scene.marker}</p>
              <div className="sw-scene-body">
                <h3>
                  {scene.title.split('\n').map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </h3>
                <p>{scene.body}</p>
                {scene.notes ? (
                  <ul className="sw-notes">
                    {scene.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}

          <section className="sw-close">
            <h3>{world.prompt}</h3>
            <p>
              A short set of questions about this service, then a written operational answer
              from our team.
            </p>
            <div className="sw-close-actions">
              <CtaButton variant="solid" onClick={() => onRequest(service.id)}>
                Start a request
              </CtaButton>
              <button type="button" className="sw-text-action" onClick={onClose}>
                ← All services
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  )
}
