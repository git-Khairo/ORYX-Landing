import { useCallback, useEffect, useRef } from 'react'
import { catalog, sectors, partnerModel, photo } from '../content/catalog'
import { useScrollLock, useEscape, useFocusTrap } from '../lib/useOverlay'
import { getLenis } from '../lib/useSmoothScroll'
import OryxMark from './OryxMark'
import CurvedLines from './CurvedLines'
import '../styles/detail.css'

/**
 * A service, opened out to the full screen.
 *
 * The card the visitor pressed grows into this: it takes the whole viewport,
 * carries the same eyebrow and title, and lists everything the service actually
 * covers. The expansion is a CSS animation on mount rather than a scrubbed one,
 * because this is a response to a press — it should feel immediate and it must
 * not depend on where the page happens to be in the scroll.
 *
 * While it is open the page beneath must not move: Lenis is stopped and the
 * shared overlay flag is set, which the nav already watches so its pill retires
 * out of the way.
 */
export default function ServiceDetail({ serviceId, originRect, onClose, onRequest }) {
  const service = catalog.find((s) => s.id === serviceId) || null
  const active = Boolean(service)
  const closeBtn = useRef(null)
  const close = useCallback(() => onClose?.(), [onClose])

  // Scroll lock, Escape and the focus trap are the three things every overlay on
  // this page needs and gets wrong separately, so they live in one module.
  useScrollLock(active)
  useEscape(active, close)
  const trap = useFocusTrap(active)

  // Lenis keeps its own scroll position and would fight the body lock, so it is
  // parked for as long as the panel is up.
  useEffect(() => {
    if (!active) return
    const lenis = getLenis()
    lenis?.stop()
    return () => lenis?.start()
  }, [active])

  if (!service) return null

  // FLIP: the panel is full-screen, and the entrance starts by mapping that
  // full-screen box exactly onto the card that was pressed, then releasing it.
  // With `transform-origin: 0 0` the maths is just a translate to the card's
  // corner and a scale by its share of the viewport.
  const origin = originRect
    ? {
        '--sx': (originRect.w / window.innerWidth).toFixed(4),
        '--sy': (originRect.h / window.innerHeight).toFixed(4),
        '--tx': `${Math.round(originRect.x)}px`,
        '--ty': `${Math.round(originRect.y)}px`,
      }
    : null

  return (
    <div
      className={`detail ${origin ? 'has-origin' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={service.title}
      ref={trap}
      style={origin}
    >
      {/* The shell is what animates; scrolling happens on this inner layer, so
          the close control (a sibling) cannot be scrolled away with the copy.
          `data-lenis-prevent` is Lenis's documented opt-out: it calls
          preventDefault on wheel events even while stopped, which would
          otherwise block any nested scroller. */}
      <div className="detail-scroll" data-lenis-prevent>
        <div className="detail-panel">
          <CurvedLines className="detail-lines" />

          <header className="detail-head">
            <div className="detail-head-l">
              <span className="detail-eyebrow">{service.eyebrow}</span>
              <h2 className="detail-title">{service.title}</h2>
              <p className="detail-pillar">{service.pillar}</p>
            </div>
            <OryxMark size={34} className="detail-mark" />
          </header>

          <p className="detail-lede">{service.lede}</p>

          {service.image && (
            <figure className="detail-hero">
              <img
                src={photo(service.image.id, 1600)}
                alt={service.image.alt}
                loading="eager"
              />
            </figure>
          )}

          <div className="detail-groups">
            {service.groups.map((g, gi) => (
              <section className="detail-group" key={g.name} style={{ '--i': gi }}>
                <h3 className="detail-group-name">{g.name}</h3>
                <ul className="detail-list">
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* The same two things are true of every service, so they are stated
              once here rather than repeated into all ten entries. */}
          {service.gallery?.length > 0 && (
            <div className="detail-gallery">
              {service.gallery.map((g) => (
                <figure key={g.id}>
                  {/* Not lazy: these sit in a nested scroller, where the browser's
                      lazy-loading heuristics do not reliably fire — verified
                      empty even once scrolled into view. Two images per panel,
                      and the panel only mounts when opened. */}
                  <img src={photo(g.id, 900)} alt={g.alt} />
                </figure>
              ))}
            </div>
          )}

          <section className="detail-partner">
            <h3 className="detail-partner-title">{partnerModel.title}</h3>
            <p className="detail-partner-lede">{partnerModel.lede}</p>
            <ul className="detail-partner-list">
              {partnerModel.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>

          <section className="detail-sectors">
            <h3 className="detail-group-name">Sectors we serve</h3>
            <ul className="detail-chips">
              {sectors.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          <div className="detail-actions">
            <button className="detail-cta" onClick={() => onRequest?.(service.id)}>
              Start a request
            </button>
        </div>
        </div>
      </div>

      <button className="detail-close" onClick={close} ref={closeBtn} aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
