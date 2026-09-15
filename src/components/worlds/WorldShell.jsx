import { useEffect, useRef } from 'react'

const noop = () => {}
import { createPortal } from 'react-dom'
import { usePrefersReduced } from '../../lib/usePrefersReduced'
import {
  useScrollLock,
  useEscape,
  useFocusTrap,
  usePauseBackgroundVideo,
} from '../../lib/useOverlay'
import { useReveal, useScrollProgress } from '../../lib/useReveal'

/**
 * The mechanics of a service site — and nothing else.
 *
 * This used to own the chrome as well: one bar, one back button, one closing
 * frame, shared by all three services. That is exactly what made the three
 * pages feel like one page in three colours, so the chrome has gone back to
 * the worlds. Each service now builds its own site inside here — its own
 * navigation, its own sections, its own footer — and what remains is only the
 * things that are genuinely structural and would be wrong to reimplement three
 * times: the portal, the scroll lock on the page underneath, the focus trap,
 * Escape, the scroll container, and the reveal and film-pausing observers.
 *
 * `--scrolled` (0 → 1) is written onto the root so any of the three navigations
 * can show reading progress in whatever form suits it, without this component
 * knowing what that form is.
 */
export default function WorldShell({ service, onClose, children }) {
  const reduced = usePrefersReduced()
  const root = useRef(null)
  const scroller = useRef(null)
  const trap = useFocusTrap(true)

  useScrollLock(true)
  useEscape(true, onClose)
  usePauseBackgroundVideo(true, scroller)
  useScrollProgress(scroller, '--scrolled', root)
  useReveal(scroller, [service.id])

  /* Only the film currently on screen decodes. Several full-screen clips in one
     scroller, all playing at once, is most of the cost of scrolling this.
     
     The gesture fallback is not belt-and-braces, it is the difference between a
     video and a still. These carry `preload="none"`, so nothing is fetched
     until `play()` is called — and when `play()` is refused, the old
     `.catch(() => {})` swallowed it, no request was ever made, and the section
     sat on its poster forever with `readyState: 0`. That is precisely the
     "video not showing" case: not a broken URL, a refusal nobody handled. */
  useEffect(() => {
    const el = scroller.current
    if (!el) return

    let off = () => {}
    const pending = new Set()

    const arm = () => {
      if (off !== noop) return
      const kick = () => {
        off()
        pending.forEach((v) => v.play?.().catch(() => {}))
        pending.clear()
      }
      const evs = ['pointerdown', 'keydown', 'touchstart', 'wheel']
      evs.forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }))
      off = () => {
        evs.forEach((e) => window.removeEventListener(e, kick))
        off = noop
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target.querySelector('video')
          if (!v) return
          if (e.isIntersecting) {
            v.play?.().catch(() => {
              /* Queue it and start on the first gesture, whatever that is. */
              pending.add(v)
              arm()
            })
          } else {
            pending.delete(v)
            v.pause?.()
          }
        })
      },
      { root: el, threshold: 0.01 },
    )
    el.querySelectorAll('[data-film]').forEach((n) => io.observe(n))
    return () => {
      io.disconnect()
      off()
    }
  }, [service.id])

  return createPortal(
    <div
      ref={root}
      /* The identity hangs off this class alone — type, palette rank and
         layout all come from `world--<id>`. Nothing is set inline, because an
         inline custom property beats a stylesheet and would pin every page
         back to one tone. */
      className={`world world--${service.id} ${reduced ? 'is-still' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${service.title}. ${service.promise}`}
    >
      <div className="world-shell" ref={trap}>
        <div className="world-scroll" ref={scroller}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/* The `muted` attribute, not just the property React sets. iOS Safari reads
   the attribute when it weighs a muted source for autoplay and cellular
   preload; without it the observer's `play()` above can be refused on an
   iPhone and the section shows its poster — or, with no poster, nothing. */
const muteAttr = (node) => {
  if (!node) return
  node.muted = true
  node.setAttribute('muted', '')
}

/** Film or still — the origin plate is an image, so both have to be handled. */
export function Media({ clip, className = '' }) {
  if (!clip?.src) return <div className={`world-film ${className}`} aria-hidden="true" />
  return (
    <div className={`world-film ${className}`} data-film aria-hidden="true">
      {clip.kind === 'image' ? (
        <img src={clip.src} alt="" />
      ) : (
        <video
          ref={muteAttr}
          src={clip.src}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
        />
      )}
    </div>
  )
}
