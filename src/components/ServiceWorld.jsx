import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { film, portal, gallery, closing } from '../content/media'
import { brand } from '../content/copy'
import { usePrefersReduced } from '../lib/usePrefersReduced'
import {
  useScrollLock,
  useEscape,
  useFocusTrap,
  usePauseBackgroundVideo,
} from '../lib/useOverlay'

/**
 * The expanded service — a full landing page, not a panel.
 *
 * It opens over the home page rather than routing away from it, so closing
 * returns the visitor to the exact row they came from. But everything inside
 * behaves like a page in its own right: a full-height opening frame, sections
 * that alternate light and dark, a film interlude at the halfway mark, and a
 * closing frame that fills the screen.
 *
 * Two clips per service do real work here. `film[id]` opens it and `portal[id]`
 * — the one running in the row behind — returns as the interlude, so the world
 * is visibly built from the same material as the row that launched it.
 */
export default function ServiceWorld({ service, onClose, onRequest }) {
  const reduced = usePrefersReduced()
  const scroller = useRef(null)
  const progress = useRef(null)
  const trap = useFocusTrap(true)
  const [entered, setEntered] = useState(false)

  useScrollLock(true)
  useEscape(true, onClose)
  usePauseBackgroundVideo(true, scroller)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const update = () => {
      const max = el.scrollHeight - el.clientHeight
      if (progress.current) {
        progress.current.style.transform = `scaleX(${max > 0 ? el.scrollTop / max : 0})`
      }
    }
    el.addEventListener('scroll', update, { passive: true })
    update()
    return () => el.removeEventListener('scroll', update)
  }, [])

  /* Only the film currently on screen decodes. Three full-screen clips in one
     scroller, all playing at once, is the other half of the scroll cost. */
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
    el.querySelectorAll('.world-film').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  /* No scroll-reveal here, deliberately.
     A `gsap.from({opacity: 0})` fired by an observer leaves every element
     invisible until its group happens to trigger — and on a section taller
     than the viewport that trigger is unreliable, which is exactly how two
     sections ended up rendering as blank white screens. Content on a page this
     long is worth more visible than animated. The opening frame still gets its
     entrance because it is always on screen at mount. */
  useEffect(() => {
    if (reduced || !entered) return
    const ctx = gsap.context(() => {
      gsap.from('[data-open-in]', {
        y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.2,
      })
    }, scroller)
    return () => ctx.revert()
  }, [entered, reduced])

  const { world } = service
  const openClip = film[service.id]
  const midClip = portal[service.id]
  const shots = gallery[service.id] || []
  const closeClip = closing[service.id] || film[service.id]

  return createPortal(
    <div
      className={`world world--${service.id} ${entered ? 'is-in' : ''}`}
      /* Each service tints its own page. The accent is data, not CSS, so the
         three worlds stay one component and adding a fourth service does not
         mean writing a fourth stylesheet. */
      style={{ '--accent': service.accent, '--tint': service.tint }}
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
          {/* ── Opening: a full screen of film ─────────────────────────── */}
          <header className="world-open">
            <Media clip={openClip} />
            <div className="world-open-copy">
              <p className="world-eyebrow" data-open-in>{service.index} · Service</p>
              <h2 data-open-in>{service.title}</h2>
              <p className="world-promise" data-open-in>{service.promise}</p>
            </div>
            <span className="world-scroll-cue" aria-hidden="true" />
          </header>

          {/* ── What it is: statement beside a photograph ─────────────── */}
          <section className="world-split world-split--tint">
            <div className="world-split-copy">
              <p className="world-kicker">What it is</p>
              <p className="world-lede">{world.lede}</p>
            </div>
            <figure className="world-shot">
              <img src={shots[0]?.src} alt={shots[0]?.alt || ''} loading="lazy" />
            </figure>
          </section>

          {/* ── What it is, as a grid ──────────────────────────────────── */}
          <section className="world-grid-block">
            <div className="world-cards">
              {world.definition.map((it, i) => (
                <article className="world-card" key={it.k}>
                  <span className="world-card-n">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{it.k}</h3>
                  <p>{it.d}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── Film interlude ─────────────────────────────────────────── */}
          <section className="world-interlude">
            <Media clip={midClip} />
            <p className="world-interlude-line">{service.body}</p>
          </section>

          {/* ── Proof + audience, on one frame ─────────────────────────
              Previously two separate bands — a flat colour strip of numerals,
              then a list of sectors beside a photograph. Neither carried a
              screen on its own. Merged: the photograph is the ground, the
              figures sit on it as a row, and the sectors run underneath as
              chips rather than as another two-column table of prose. */}
          <section className="world-proof">
            <div className="world-proof-inner">
              <ul className="world-figs">
                {world.figures.map((f) => (
                  <li key={f.l}>
                    <span className="world-fig-n">{f.n}</span>
                    <span className="world-fig-l">{f.l}</span>
                  </li>
                ))}
              </ul>

              <div className="world-for">
                <p className="world-for-line">{world.audience.line}</p>
                <ul className="world-chips">
                  {world.audience.items.map((it) => (
                    <li key={it.k}>
                      <span>{it.k}</span>
                      <small>{it.d}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── What's inside: list beside a framed photograph ─────────
              Was a coloured block followed by a separate full-bleed image
              strip — a band of colour, then a band of picture, neither
              explaining the other. One white section now, the list carrying
              the detail and the photograph held in a frame beside it. */}
          <section className="world-inside-block">
            <div className="world-inside-copy">
              <p className="world-kicker">What&rsquo;s inside</p>
              <p className="world-line">
                Everything below sits under one agreement, with one point of contact.
              </p>
              <ol className="world-inside">
                {world.inside.map((it, i) => (
                  <li key={it.k}>
                    <span className="world-inside-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="world-inside-body">
                      <span className="world-inside-k">{it.k}</span>
                      <span className="world-inside-d">{it.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <figure className="world-inside-shot">
              <img src={shots[2]?.src} alt={shots[2]?.alt || ''} loading="lazy" />
            </figure>
          </section>

          {/* ── Closing frame ──────────────────────────────────────────── */}
          <section className="world-close">
            <Media clip={closeClip} />
            <div className="world-close-copy">
              <h3>{world.prompt}</h3>
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
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Film or still — `film.oryx` is an image, so both have to be handled. */
function Media({ clip }) {
  if (!clip?.src) return <div className="world-film" aria-hidden="true" />
  return (
    <div className="world-film" aria-hidden="true">
      {clip.kind === 'image' ? (
        <img src={clip.src} alt="" />
      ) : (
        <video src={clip.src} muted loop autoPlay playsInline preload="none" tabIndex={-1} />
      )}
    </div>
  )
}
