import { useState } from 'react'
import { services } from '../content/copy'
import { film } from '../content/media'
import VideoBackdrop from '../components/VideoBackdrop'
import ServiceWorld from '../components/ServiceWorld'
import { useSectionReveal } from '../lib/useSectionReveal'

/**
 * Three living territories, not three cards.
 *
 * The viewport is divided into three worlds that respond to attention: the one
 * under the cursor takes more room, its film lightens, its detail line opens,
 * and the other two go quiet. Pressing one grows it into the full experience
 * from where it already stands.
 *
 * This replaces a sticky stage that pinned for four viewports and translated a
 * horizontal track. That construction fought the pager for control of the
 * scroll and was the reason this section never settled. One screen, no pinning,
 * no sub-stops — depth now lives behind a press instead of behind a scroll.
 */
export default function Services({ onRequest }) {
  const ref = useSectionReveal()
  const [hovered, setHovered] = useState(null)
  const [open, setOpen] = useState(null)

  const openService = services.find((s) => s.id === open) || null

  return (
    <>
      <section id="services" className="services" ref={ref} data-section="3" data-stops={1}>
        <header className="services-head">
          <span className="eyebrow" data-reveal>What we do</span>
          <span className="services-count" data-reveal>Three services. One agreement.</span>
        </header>

        <div className="territories">
          {services.map((s) => {
            const active = hovered === s.id
            const dimmed = hovered !== null && !active
            return (
              <button
                key={s.id}
                type="button"
                className={`territory ${active ? 'is-active' : ''} ${dimmed ? 'is-dim' : ''}`}
                onClick={() => setOpen(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(s.id)}
                onBlur={() => setHovered(null)}
                aria-label={`${s.title}. ${s.pillar}. Open this service.`}
              >
                <VideoBackdrop src={film[s.id]?.src} tone="territory" className="territory-film" />

                <span className="territory-body">
                  <span className="territory-index">{s.eyebrow}</span>
                  <span className="territory-name">{s.title}</span>
                  <span className="territory-promise">{s.pillar}</span>

                  {/* Opens only for the territory being looked at. */}
                  <span className="territory-detail">
                    <span>{s.detail}</span>
                  </span>

                  <span className="territory-open">
                    Open <i aria-hidden="true">↗</i>
                  </span>
                  <span className="territory-rule" aria-hidden="true" />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {openService && (
        <ServiceWorld
          service={openService}
          onClose={() => setOpen(null)}
          onRequest={(id) => {
            setOpen(null)
            onRequest?.(id)
          }}
        />
      )}
    </>
  )
}
