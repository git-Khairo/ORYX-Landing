import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { brand } from '../../content/copy'
import { usePrefersReduced } from '../../lib/usePrefersReduced'
import {
  useScrollLock,
  useEscape,
  useFocusTrap,
  usePauseBackgroundVideo,
} from '../../lib/useOverlay'
import { useReveal, useScrollProgress } from '../../lib/useReveal'

/**
 * What the three service worlds share — and deliberately, that is only the
 * chrome.
 *
 * The previous version put all three services through one template and tinted
 * it three colours, which meant opening Renovation after Transport felt like
 * changing the lighting on a room you were already standing in. The brief was
 * for three pages that are different, so the shell holds the frame — the
 * portal, the bar, the scroll container, the scroll lock, the focus trap — and
 * hands the whole scrolling body to whichever world was asked for.
 *
 * Everything below the bar is the world's own: its own sections, its own
 * skeleton, its own signature device.
 */
export default function WorldShell({ service, onClose, children }) {
  const reduced = usePrefersReduced()
  const scroller = useRef(null)
  const progress = useRef(null)
  const trap = useFocusTrap(true)

  useScrollLock(true)
  useEscape(true, onClose)
  usePauseBackgroundVideo(true, scroller)
  useScrollProgress(scroller, '--scrolled', progress)
  useReveal(scroller, [service.id])

  /* The entrance is a CSS animation on mount, not a class toggled from a
     `requestAnimationFrame`. The old approach started the overlay at
     `opacity: 0` and depended on a frame callback to make it visible, which
     fails badly rather than gracefully: if that frame is delayed — a throttled
     background tab is enough — the overlay sits there transparent while still
     trapping focus and swallowing clicks. An animation cannot get stuck
     half-applied, and needs no JavaScript to finish. */

  /* Only the film currently on screen decodes. Several full-screen clips in one
     scroller, all playing at once, is most of the cost of scrolling this. */
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target.querySelector('video')
          if (!v) return
          if (e.isIntersecting) v.play?.().catch(() => {})
          else v.pause?.()
        })
      },
      { root: el, threshold: 0.01 },
    )
    el.querySelectorAll('[data-film]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [service.id])

  return createPortal(
    <div
      className={`world world--${service.id} ${reduced ? 'is-still' : ''}`}
      /* Each world sits in its own light — three near-blacks a degree apart in
         temperature. The accent stays sand for all three: the layouts do the
         differentiating, so the palette does not have to. */
      style={{ '--accent': service.accent, '--tone': service.tone }}
      role="dialog"
      aria-modal="true"
      aria-label={`${service.title}. ${service.promise}`}
    >
      <div className="world-shell" ref={trap}>
        <div className="world-bar">
          <span className="world-progress" ref={progress} aria-hidden="true" />
          <div className="world-bar-inner">
            <button type="button" className="world-back" onClick={onClose}>
              <i aria-hidden="true">←</i> All services
            </button>
            <span className="world-brand">{brand.name}</span>
            <span className="world-index">{service.index}</span>
          </div>
        </div>

        <div className="world-scroll" ref={scroller}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Film or still — the origin plate is an image, so both have to be handled. */
export function Media({ clip, className = '' }) {
  if (!clip?.src) return <div className={`world-film ${className}`} aria-hidden="true" />
  return (
    <div className={`world-film ${className}`} data-film aria-hidden="true">
      {clip.kind === 'image' ? (
        <img src={clip.src} alt="" />
      ) : (
        <video src={clip.src} muted loop playsInline preload="none" tabIndex={-1} />
      )}
    </div>
  )
}

/** The closing frame. Identical in all three worlds because it is the handover,
 *  not the page — the argument is over by here and the only job left is to make
 *  the next step obvious. */
export function WorldClose({ service, clip, onClose, onRequest }) {
  return (
    <section className="world-close">
      <Media clip={clip} />
      <div className="world-close-copy">
        <h3>{service.world.prompt}</h3>
        <p>
          A short conversation, then a written operational answer — scope,
          schedule and cost, in plain numbers.
        </p>
        <div className="world-actions">
          <button type="button" className="world-cta" onClick={onRequest}>
            Start a request <i aria-hidden="true">→</i>
          </button>
          <button type="button" className="world-text-action" onClick={onClose}>
            ← All services
          </button>
        </div>
      </div>
    </section>
  )
}
