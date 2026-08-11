import { useState } from 'react'
import { services, pillars } from '../content/copy'
import { portal } from '../content/media'

/**
 * One screen, split two-thirds / one-third.
 *
 * Left: the three services as full-width rows rather than vertical doors. A row
 * gives the title a whole line to be read on and puts the index, the name and
 * the way in on one baseline — a door forced all of that into a narrow column
 * and turned every title into two cramped lines. The film arrives as a band
 * behind the open row.
 *
 * Right: vision, mission and values, as a numbered list where the open item
 * takes the height from the other two.
 */
export default function Work({ onOpenService }) {
  const [active, setActive] = useState(services[0].id)
  /* One panel is always open, starting with the first. Three collapsed heads
     left most of the column as dead white space, and the section has a full
     screen height to fill either way — so the choice is not "open or closed"
     but "which one", and something always has to be answering that. */
  const [open, setOpen] = useState(pillars[0].id)

  return (
    <section className="work" id="work" aria-label="Services, vision, mission and values">
      <div className="work-grid">
        <div className="rows">
          {services.map((s) => {
            const isOn = active === s.id
            return (
              <button
                key={s.id}
                type="button"
                className={`row ${isOn ? 'is-on' : ''}`}
                onClick={() => onOpenService?.(s.id)}
                onMouseEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                aria-label={`${s.title}. ${s.promise} Open this service.`}
              >
                {/* Always playing, never a still that swaps in on hover —
                    footage that only starts on approach announces itself as a
                    trick. Different clips from the opening film, so the page
                    is not showing the same six seconds twice. */}
                <span className="row-film" aria-hidden="true">
                  {portal[s.id]?.src && (
                    <video
                      src={portal[s.id].src}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="auto"
                    />
                  )}
                </span>

                <span className="row-line">
                  <span className="row-index">{s.index}</span>
                  <span className="row-title">{s.title}</span>
                  <span className="row-go" aria-hidden="true">→</span>
                </span>

                <span className="row-detail">
                  <span>
                    <span className="row-promise">{s.promise}</span>
                    <span className="row-body">{s.body}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="pillars">
          {pillars.map((p, i) => {
            const isOpen = open === p.id
            return (
              <section
                key={p.id}
                className={`pillar ${isOpen ? 'is-open' : ''}`}
                /* Opens under the pointer, but closes back to nothing when it
                   leaves — so hover is a preview and the click is the choice
                   that sticks. */
                onMouseEnter={() => setOpen(p.id)}
              >
                <h3>
                  <button
                    type="button"
                    className="pillar-head"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(p.id)}
                  >
                    <span className="pillar-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pillar-label">{p.label}</span>
                    <i className="pillar-arrow" aria-hidden="true" />
                  </button>
                </h3>

                <div className="pillar-panel">
                  <div className="pillar-inner">
                    <p className="pillar-headline">{p.headline}</p>
                    <dl className="pillar-points">
                      {p.points.map((pt) => (
                        <div key={pt.k}>
                          <dt>{pt.k}</dt>
                          <dd>{pt.d}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </section>
  )
}
