import { forwardRef } from 'react'
import { values, why } from '../content/copy'

/**
 * Act 5 — The Standard.
 *
 * It is not a section you scroll down to. The mark's black stem has just filled
 * the screen, and this page is already sitting on that black: the last stretch
 * of the pinned run only brings the copy in. So the component draws nothing of
 * its own background — it lives on the fill — and every element carries a
 * `--i` index that the stage uses to stagger it on, one after another, the way
 * a build lands on a slide.
 *
 * The six values are the brand's own; the lead borrows `why.title`, which
 * already says the thing this act exists to say.
 *
 * The cards are deliberately not the hairline grid this used to be. Each value
 * is its own object: a numbered plate with a gold index, a rule that grows out
 * of it, and the name set in the display face — so the six read as a series
 * with an order, not six cells of a table.
 */
const Standard = forwardRef(function Standard(_props, ref) {
  return (
    <div className="standard" ref={ref} aria-label="The ORYX standard">
      <div className="standard-inner">
        <p className="standard-eyebrow" data-std style={{ '--i': 0 }}>
          The Standard
        </p>
        <h2 className="standard-title" data-std style={{ '--i': 1 }}>
          {why.title}
        </h2>
        <p className="standard-lead" data-std style={{ '--i': 2 }}>
          {why.body}
        </p>

        <ul className="standard-grid">
          {values.map((v, i) => (
            <li className="std-card" key={v.k} data-std style={{ '--i': i + 3 }}>
              <span className="std-card-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="std-card-rule" aria-hidden="true" />
              <h3 className="std-card-k">{v.k}</h3>
              <p className="std-card-d">{v.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})

export default Standard
