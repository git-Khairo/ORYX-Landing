import { brand } from '../content/copy'
import { sectors } from '../content/catalog'
import { useAppReady } from '../lib/useAppReady'
import CurvedLines from './CurvedLines'

/** Layers in the mark's depth stack. Enough to read as solid at hero scale
 *  without putting a needless amount of DOM on the page. */
const LOGO_LAYERS = 16

/**
 * The brand station — hero, card and zoom, as one persistent element.
 *
 * This used to be three things: a DOM hero laid over the canvas, a separate
 * card on the ring, and a third masked element for the zoom. Each handed to the
 * next by fading, which is exactly why the card read as *a new card* rather
 * than as the hero having become one.
 *
 * So it is now a single element that never unmounts. Everything about it is a
 * function of `--m` (0 = hero, 1 = settled card):
 *
 *   · its own width and height are set in pixels by the stage, so the element
 *     genuinely reflows from a full screen down to a card rather than being
 *     squashed by a transform
 *   · the two copy blocks cross-fade, because a hero's arrangement of type and
 *     a card's are not the same arrangement at two sizes
 *   · the mark does **not** cross-fade — it is one object that travels from the
 *     hero's right-hand side to the middle of the card, which is what makes the
 *     zoom continuous: the thing that grows to fill the screen at the end is
 *     the same node that was in the hero at the start
 *   · the card's own chrome — radius, border, shadow — arrives with `--m`, so
 *     Act 1 has no card edges to give the game away
 *
 * `is-in` is set once the loader has lifted and drives the entrance: the hero
 * arrives in sequence rather than appearing fully formed, which is most of the
 * difference between a still frame and a moment.
 */
export default function BrandCard({ cardRef, logoRef, onContact, onExplore }) {
  const ready = useAppReady()

  return (
    <article
      className={`brand-card ${ready ? 'is-in' : ''}`}
      ref={cardRef}
      data-card="always-ready"
    >
      <CurvedLines className="brand-lines" />

      {/* Surface treatment. The bloom lifts the warm corner so the gradient has
          a light source rather than just a direction; the grain breaks up the
          mathematically smooth ramp, which is what otherwise reads as "a CSS
          gradient" instead of a surface. */}
      <span className="brand-bloom" aria-hidden="true" />
      <span className="brand-grain" aria-hidden="true" />

      {/* Hero arrangement: copy ranged left, mark to the right. */}
      <div className="brand-copy brand-copy--hero">
        <p className="brand-eyebrow" data-in style={{ '--d': 0 }}>
          {brand.category}
        </p>

        {/* Each word gets its own mask so the line can unmask upward from its
            own baseline, one after the next. */}
        <h1 className="brand-tagline" aria-label={brand.tagline}>
          {brand.tagline.split(' ').map((word, i) => (
            <span className="brand-line" key={i} aria-hidden="true">
              <i data-in style={{ '--d': 1 + i }}>{word}</i>
            </span>
          ))}
        </h1>

        <p className="brand-promise" data-in style={{ '--d': 3 }}>
          {brand.promise}
        </p>

        {/* The hero's only interactive elements. The card they sit on is inert
            (pointer-events are off across the whole station), so these switch
            them back on for themselves alone. */}
        <div className="brand-actions" data-in style={{ '--d': 4 }}>
          <button className="brand-btn brand-btn--primary" onClick={() => onContact?.()}>
            Start a request
          </button>
          <button className="brand-btn brand-btn--ghost" onClick={() => onExplore?.()}>
            Explore services
          </button>
        </div>
      </div>

      {/* The proof strip. The hero's lower third was empty, which read as
          unfinished rather than roomy — and the sectors are the fastest way to
          say what kind of company this is. Duplicated once and translated by
          exactly -50% so the loop is seamless. */}
      <div className="brand-proof" data-in style={{ '--d': 5 }}>
        <div className="brand-proof-viewport" aria-hidden="true">
          {[0, 1].map((run) => (
            <span className="brand-proof-run" key={run}>
              {sectors.map((s) => (
                <span className="brand-proof-item" key={s}>
                  {s}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Card arrangement: the same words, set as a card sets them. */}
      <div className="brand-copy brand-copy--card" aria-hidden="true">
        <p className="brand-card-eyebrow">{brand.name}</p>
        <div className="brand-card-foot">
          <h3 className="brand-card-title">
            {brand.tagline.split(' ').map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </h3>
          <p className="brand-card-pillar">{brand.category}</p>
        </div>
      </div>

      {/* The mark, built as a real 3D object out of stacked layers.

          It is CSS 3D rather than WebGL for a compositing reason: drei portals
          these cards into DOM *above* the canvas, so anything drawn in WebGL
          would sit behind the card's own background and never be seen. Doing
          the depth in the same medium as the card avoids that entirely.

          It also gives the flattening for free. `--depth` is the gap between
          layers; drive it to zero and every layer lands on the same plane, at
          which point the stack *is* the flat image — so the return to 2D needs
          no cross-fade and has no seam to notice. */}
      <div className="brand-logo" ref={logoRef}>
        <div className="brand-logo-stack">
          {Array.from({ length: LOGO_LAYERS }, (_, i) => (
            <img
              key={i}
              src="/logo.png"
              alt=""
              draggable="false"
              style={{ '--i': i, '--n': LOGO_LAYERS - 1 }}
            />
          ))}
        </div>
      </div>
    </article>
  )
}
