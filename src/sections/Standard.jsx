import { forwardRef, useState } from 'react'
import { values, why } from '../content/copy'

/**
 * Act 5 — The Standard.
 *
 * It is not a section you scroll down to. The mark's black stem has just filled
 * the screen, and this page is already sitting on that black: the last stretch
 * of the pinned run only brings the copy in. So the component draws nothing of
 * its own background — it lives on the fill — and every element carries a `--i`
 * index the stage uses to stagger it on, one after another, like a slide build.
 *
 * The six values are the brand's own. They are a numbered list on the left; the
 * right column holds the section's fixed header — which stays put for every
 * item — with the hovered (or focused) value opened out beneath it. One thing
 * is read at a time, in an order, which is what a "standard" is.
 */
const Standard = forwardRef(function Standard(_props, ref) {
  const [active, setActive] = useState(0)
  const current = values[active]

  return (
    <div className="standard" ref={ref} aria-label="The ORYX standard">
      <div className="standard-inner">
        <div className="standard-split">
          {/* Left: the six, as a list you move down. */}
          <ul className="standard-list" role="list">
            {values.map((v, i) => (
              <li key={v.k} data-std style={{ '--i': i + 2 }}>
                <button
                  type="button"
                  className={`std-item ${i === active ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                >
                  <span className="std-item-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="std-item-k">{v.k}</span>
                  <span className="std-item-line" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          {/* Right: the fixed header, held constant for every item, and the
              active value opened out beneath it. */}
          <div className="standard-right">
            <header className="standard-head">
              <p className="standard-eyebrow" data-std style={{ '--i': 0 }}>
                The Standard
              </p>
              <h2 className="standard-title" data-std style={{ '--i': 1 }}>
                {why.title}
              </h2>
            </header>

            {/* Keyed by index so it remounts and re-plays its fade each time the
                selection changes. */}
            <div className="standard-detail" data-std style={{ '--i': 2 }}>
              <div className="std-detail-body" key={active}>
                <span className="std-detail-n">
                  {String(active + 1).padStart(2, '0')} / {String(values.length).padStart(2, '0')}
                </span>
                <h3 className="std-detail-k">{current.k}</h3>
                <p className="std-detail-d">{current.d}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Standard
