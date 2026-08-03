import { useCallback, useEffect, useRef } from 'react'
import { catalog, sectors, partnerModel, photo } from '../content/catalog'
import { useScrollLock, useEscape, useFocusTrap } from '../lib/useOverlay'
import { getLenis } from '../lib/useSmoothScroll'
import OryxMark from './OryxMark'
import '../styles/detail.css'

export default function ServiceDetail({ serviceId, originRect, onClose, onRequest }) {
  const service = catalog.find((s) => s.id === serviceId) || null
  const active = Boolean(service)
  const closeBtn = useRef(null)
  const close = useCallback(() => onClose?.(), [onClose])

  useScrollLock(active)
  useEscape(active, close)
  const trap = useFocusTrap(active)

  useEffect(() => {
    if (!active) return
    const lenis = getLenis()
    lenis?.stop()
    return () => lenis?.start()
  }, [active])

  if (!service) return null

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
      <div className="detail-scroll" data-lenis-prevent>

        {/* ── Hero: full-width background image ── */}
        {service.image && (
          <div
            className="detail-hero-band"
            style={{ backgroundImage: `url(${photo(service.image.id, 1920)})` }}
            aria-hidden="true"
          >
            <div className="detail-hero-overlay" />
            <div className="detail-hero-caption">
              <span className="detail-eyebrow">{service.eyebrow}</span>
              <h2 className="detail-title">{service.title}</h2>
              <p className="detail-pillar">{service.pillar}</p>
            </div>
          </div>
        )}

        {/* ── Lede ── */}
        <div className="detail-section">
          <OryxMark size={28} className="detail-mark" />
          <p className="detail-lede">{service.lede}</p>
        </div>

        {/* ── First gallery image — full-width band ── */}
        {service.gallery?.[0] && (
          <div
            className="detail-img-band"
            style={{ backgroundImage: `url(${photo(service.gallery[0].id, 1600)})` }}
            aria-label={service.gallery[0].alt}
          >
            <div className="detail-img-fade detail-img-fade--top" />
            <div className="detail-img-fade detail-img-fade--bot" />
          </div>
        )}

        {/* ── Service cards (groups) ── */}
        <div className="detail-section">
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
        </div>

        {/* ── Second gallery image — full-width band ── */}
        {service.gallery?.[1] && (
          <div
            className="detail-img-band detail-img-band--short"
            style={{ backgroundImage: `url(${photo(service.gallery[1].id, 1600)})` }}
            aria-label={service.gallery[1].alt}
          >
            <div className="detail-img-fade detail-img-fade--top" />
            <div className="detail-img-fade detail-img-fade--bot" />
          </div>
        )}

        {/* ── Partner model + sectors + CTA ── */}
        <div className="detail-section detail-section--dark">
          <section className="detail-partner">
            <h3 className="detail-partner-title">{partnerModel.title}</h3>
            <p className="detail-partner-lede">{partnerModel.lede}</p>
            <ul className="detail-partner-list">
              {partnerModel.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="detail-section">
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
