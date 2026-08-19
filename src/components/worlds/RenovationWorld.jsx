import { useCallback, useEffect, useRef, useState } from 'react'
import WorldShell, { Media } from './WorldShell'
import { film, portal, gallery } from '../../content/media'

/**
 * Renovation — "The Build-Up."
 *
 * The service is a transformation with a date on it, so the page is built
 * around two things you cannot get from prose: a before-and-after you operate
 * yourself, and the building going up in the order it actually goes up.
 *
 * The scrub slider is the centrepiece because it is the one claim on the site a
 * visitor can verify by hand. The layer stack underneath it assembles as you
 * scroll — shell, services, partitions, finish — so the section is read in
 * construction sequence rather than as four equal bullets.
 *
 * Transport travels and Workforce assembles in place; this page builds upward.
 */
export default function RenovationWorld({ service, onClose, onRequest }) {
  const { world } = service
  const shots = gallery[service.id] || []

  return (
    <WorldShell service={service} onClose={onClose}>
      {/* ── Its own navigation ────────────────────────────────────────
          A drawing sheet's header strip, not a website nav: sheet reference on
          the left, sections through the middle, revision and scale on the
          right, all boxed in ruled cells. Anyone who has held a construction
          drawing recognises this before they read it. */}
      <header className="r-nav">
        <button type="button" className="r-nav-cell r-nav-mark" onClick={onClose}>
          <i aria-hidden="true" />
          <span>
            <b>ORYX Projects</b>
            <em>Return to group</em>
          </span>
        </button>

        <nav className="r-nav-cell r-nav-links" aria-label="Renovation sections">
          <a href="#r-build">Drawing</a>
          <a href="#r-programme">Programme</a>
          <a href="#r-build">Build-up</a>
          <a href="#r-spec">Specification</a>
        </nav>

        <dl className="r-nav-cell r-nav-meta">
          <div><dt>Sheet</dt><dd>03</dd></div>
          <div><dt>Rev</dt><dd>C</dd></div>
          <div><dt>Scale</dt><dd>1:50</dd></div>
        </dl>
      </header>

      {/* ── Opening ───────────────────────────────────────────────────── */}
      <header className="r-open">
        <Media clip={film.renovation} />
        <div className="r-open-copy">
          <p className="world-eyebrow" data-reveal>
            {service.index} · {service.title}
          </p>
          {/* The headline carries the opening, not the service name — the name
              is already in the eyebrow above it and in the navigation. */}
          <h2 data-reveal>
            {world.headline.split('\n').map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="world-promise" data-reveal>{service.promise}</p>
        </div>
      </header>

      {/* ── The scrub ─────────────────────────────────────────────────── */}
      <section className="r-scrub-block">
        <div className="r-scrub-intro">
          <p className="world-kicker" data-reveal>Before, and after</p>
          <p className="world-lede" data-reveal>{world.lede}</p>
        </div>
        <Scrub before={shots[0]} after={shots[2]} />
      </section>

      {/* ── The drawing ───────────────────────────────────────────────
          A floor plan that draws itself. Transport gets a map and Workforce a
          rota; this is the document this trade actually works from, and no
          other page on the site could carry it. */}
      {/* ── The programme ─────────────────────────────────────────────
          Twelve weeks, five phases, and visible overlap. The overlap is the
          product: trades running into each other is what one accountable
          programme buys, and what a queue of separate contractors cannot. */}
      <section className="r-programme" id="r-programme">
        <div className="r-prog-head">
          <p className="world-kicker" data-reveal>Programme · Gantt</p>
          <h3 className="r-prog-h" data-reveal>One programme, one date</h3>
          <p className="world-line" data-reveal>
            Phases overlap on purpose. A queue of separate contractors cannot do
            this — it is the whole reason to hold the trades under one contract.
          </p>
        </div>

        <div className="r-gantt" data-reveal style={{ '--weeks': world.programme.weeks }}>
          <div className="r-gantt-scale" aria-hidden="true">
            {Array.from({ length: world.programme.weeks }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          {world.programme.phases.map((p, i) => (
            <div className="r-gantt-row" key={p.k}>
              <span className="r-gantt-k">{p.k}</span>
              <span className="r-gantt-track" aria-hidden="true">
                {/* Grid line numbers are placed here, as plain integers.
                    `grid-column: calc(var(--f) + 1) / ...` in the stylesheet
                    parsed as invalid and every bar collapsed to zero width —
                    grid line positions do not accept calc() of a custom
                    property. */}
                <span
                  className="r-gantt-bar"
                  style={{ gridColumn: `${p.f + 1} / ${p.t + 1}`, '--i': i }}
                />
              </span>
              <span className="sr-only">
                {p.k}: weeks {p.f + 1} to {p.t}.
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How a job runs ────────────────────────────────────────────
          Four notes on the sheet: survey, programme, build, hand back. Same
          question the other two services answer, asked in drawing language. */}
      <section className="r-process" id="r-process">
        <div className="r-process-head">
          <p className="world-kicker" data-reveal>How a job runs</p>
          <h3 data-reveal>Survey to handover</h3>
        </div>
        <ol className="r-steps">
          {world.process.map((st, i) => (
            <li key={st.k} data-reveal style={{ '--i': i }}>
              <span className="r-step-n">{`N${i + 1}`}</span>
              <span className="r-step-k">{st.k}</span>
              <span className="r-step-d">{st.d}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The layers ────────────────────────────────────────────────── */}
      <Layers layers={world.layers} />

      {/* ── The specification ─────────────────────────────────────────
          Real finish names against real colour, so the strip is a
          specification rather than a row of decorative squares. */}
      <section className="r-materials" id="r-spec">
        <p className="world-kicker" data-reveal>Specified, not improvised</p>
        <ul className="r-swatches">
          {world.materials.map((m, i) => (
            <li key={m.k} data-reveal style={{ '--i': i }}>
              <span className="r-swatch" style={{ background: m.c }} aria-hidden="true" />
              <span className="r-swatch-k">{m.k}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── What it is ────────────────────────────────────────────────── */}
      <section className="r-define">
        {world.definition.map((it, i) => (
          <article className="r-define-card" key={it.k} data-reveal style={{ '--i': i }}>
            <span className="r-define-n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{it.k}</h3>
            <p>{it.d}</p>
          </article>
        ))}
      </section>

      {/* ── Interlude ─────────────────────────────────────────────────── */}
      <section className="r-interlude">
        <Media clip={portal.renovation} />
        <p className="r-interlude-line" data-reveal>{service.body}</p>
      </section>

      {/* ── Proof and audience ────────────────────────────────────────── */}
      <section className="r-proof">
        <ul className="r-figs">
          {world.figures.map((f, i) => (
            <li key={f.l} data-reveal style={{ '--i': i }}>
              <span className="r-fig-n">{f.n}</span>
              <span className="r-fig-l">{f.l}</span>
            </li>
          ))}
        </ul>

        <div className="r-for" data-reveal>
          <p className="r-for-line">{world.audience.line}</p>
          <dl className="r-sectors">
            {world.audience.items.map((it) => (
              <div key={it.k}>
                <dt>{it.k}</dt>
                <dd>{it.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── What's inside ─────────────────────────────────────────────── */}
      <RenovationFooter service={service} onClose={onClose} onRequest={onRequest} />
    </WorldShell>
  )
}

/**
 * Drag to reveal. The one claim on this site the visitor can test by hand.
 *
 * Pointer events rather than mouse and touch handled separately, and a range
 * input underneath rather than a bare div: the slider has to be operable from
 * the keyboard, and a native range gives that plus the correct semantics for
 * nothing. The visible handle is drawn by CSS on top of it.
 */
function Scrub({ before, after }) {
  const [at, setAt] = useState(52)
  const frame = useRef(null)
  const box = useRef(null)

  const move = useCallback((clientX) => {
    const el = box.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const p = ((clientX - r.left) / r.width) * 100
    setAt(Math.min(100, Math.max(0, p)))
  }, [])

  const onPointerMove = useCallback(
    (e) => {
      if (frame.current) return
      const x = e.clientX
      frame.current = requestAnimationFrame(() => {
        frame.current = null
        move(x)
      })
    },
    [move],
  )

  useEffect(() => () => frame.current && cancelAnimationFrame(frame.current), [])

  if (!before || !after) return null

  return (
    <div
      className="r-scrub"
      ref={box}
      style={{ '--at': `${at}%` }}
      data-reveal
      /* Dragging anywhere on the image works, not only on the handle — a
         6px target is a mouse-only interaction pretending to be a general one. */
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e.clientX)
      }}
      onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && onPointerMove(e)}
    >
      <img className="r-scrub-after" src={after.src} alt={after.alt || 'After renovation'} loading="lazy" />
      <div className="r-scrub-before-wrap" aria-hidden="true">
        <img className="r-scrub-before" src={before.src} alt="" loading="lazy" />
      </div>

      <span className="r-scrub-tag r-scrub-tag--before" aria-hidden="true">Before</span>
      <span className="r-scrub-tag r-scrub-tag--after" aria-hidden="true">After</span>

      <span className="r-scrub-handle" aria-hidden="true">
        <i />
      </span>

      <input
        className="r-scrub-input"
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={at}
        onChange={(e) => setAt(Number(e.target.value))}
        aria-label="Reveal the finished space"
      />
    </div>
  )
}

/**
 * The building, going up in the order it goes up.
 *
 * Each layer is pinned into a stack and slides into place as its turn arrives,
 * so the section reads as construction sequence rather than as four bullets
 * that happen to be numbered. The active layer is tracked in state because
 * there are only four transitions here — unlike the transport marker, this does
 * not need to update on every frame.
 */
function Layers({ layers }) {
  const section = useRef(null)
  const [live, setLive] = useState(0)

  useEffect(() => {
    const el = section.current
    if (!el) return
    const scroller = el.closest('.world-scroll')
    if (!scroller) return

    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const h = scroller.clientHeight
      const span = r.height - h
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0

      /* Two readings of the same scroll. `--p` is continuous and drives the
         separation, so the drawing pulls apart smoothly; `live` is quantised
         and drives which label is lit, because a label cannot be 40% lit.
         Written straight to the element — putting a continuous value through
         React state would re-render the section on every frame. */
      el.style.setProperty('--p', p.toFixed(4))
      setLive(Math.min(layers.length - 1, Math.floor(p * layers.length)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [layers.length])

  return (
    <section className="r-layers" id="r-build" ref={section}>
      <div className="r-layers-sticky">
        <div className="r-layers-head">
          <p className="world-kicker">In the order it is built</p>
          <p className="world-line">
            A commercial floor, pulled apart. Each plate is a stage of the works
            and a point where something gets signed off — the order is not a
            preference, it is what closing a ceiling over an untested service
            run costs to undo.
          </p>
        </div>

        <div className="r-build">
          <Axo layers={layers} live={live} />

          <ol className="r-stack">
          {layers.map((l, i) => (
            <li
              key={l.k}
              className={`r-layer ${i <= live ? 'is-built' : ''} ${
                i === live ? 'is-live' : ''
              }`}
              style={{ '--i': i, '--of': layers.length }}
            >
              <span className="r-layer-n">{l.n}</span>
              <span className="r-layer-k">{l.k}</span>
              <span className="r-layer-d">{l.d}</span>
            </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/**
 * The build-up, drawn.
 *
 * A dimetric projection: plan coordinates in 0–1 go through `iso()` and come
 * back as screen points, so every layer's motif is authored as if on a flat
 * plan and the projection is applied once. Hand-writing the diamonds would
 * have meant recomputing four corners for every line on every plate.
 *
 * The separation is CSS, not JavaScript — each plate reads `--p` off the
 * section and lifts by its own index, which keeps the whole animation on the
 * compositor and off the main thread.
 */
const W = 300
const K = 0.54
/* The base y sets where the stack sits at rest, and it has to leave headroom:
   the top plate lifts by `4 × --lift` as the section scrolls, so the space
   above the drawing is not padding, it is the travel. 208 is the lowest this
   can go and still keep the finishes plate inside the box at full separation —
   it was 250, which parked the whole drawing too far down its own frame and
   left a gap under the heading. */
const iso = (u, v) => [360 + (u - v) * W, 208 + (u + v) * W * K]
const pt = (u, v) => iso(u, v).join(',')
const line = (u1, v1, u2, v2) => `M${pt(u1, v1)} L${pt(u2, v2)}`

function Axo({ layers, live }) {
  const plate = [pt(0, 0), pt(1, 0), pt(1, 1), pt(0, 1)].join(' ')

  /* One motif per plate, authored in plan space. Five identical diamonds
     would separate beautifully and say nothing about what happens on each. */
  const motifs = [
    /* 01 Slab — the bare structural grid, columns marked. */
    <g key="slab" className="r-axo-slab">
      {[0.25, 0.5, 0.75].map((u) => <path key={`u${u}`} d={line(u, 0, u, 1)} />)}
      {[0.25, 0.5, 0.75].map((v) => <path key={`v${v}`} d={line(0, v, 1, v)} />)}
      {[[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]].map(([u, v]) => (
        <circle key={`${u}-${v}`} cx={iso(u, v)[0]} cy={iso(u, v)[1]} r="5" />
      ))}
    </g>,

    /* 02 Services — runs crossing the floor, drawn heavier than the grid
       because on a real drawing they are the thing being coordinated. */
    <g key="svc" className="r-axo-svc">
      <path d={line(0.08, 0.2, 0.92, 0.2)} />
      <path d={line(0.08, 0.5, 0.92, 0.5)} />
      <path d={line(0.08, 0.8, 0.92, 0.8)} />
      <path className="r-axo-riser" d={line(0.15, 0.2, 0.15, 0.8)} />
      <path className="r-axo-riser" d={line(0.85, 0.2, 0.85, 0.8)} />
    </g>,

    /* 03 Partitions — walls with height, so this plate reads as the one that
       builds upward. Each is a plan line extruded by a fixed screen offset. */
    <g key="part" className="r-axo-part">
      {[[0.4, 0, 0.4, 0.62], [0.4, 0.62, 1, 0.62], [0, 0.35, 0.4, 0.35]].map(([a, b, c, d], i) => {
        const [x1, y1] = iso(a, b)
        const [x2, y2] = iso(c, d)
        const h = 26
        return (
          <polygon
            key={i}
            points={`${x1},${y1} ${x2},${y2} ${x2},${y2 - h} ${x1},${y1 - h}`}
          />
        )
      })}
    </g>,

    /* 04 Ceiling — a tile grid, the densest plate, which is what a ceiling
       looks like from above and reads as at a glance. */
    <g key="ceil" className="r-axo-ceil">
      {Array.from({ length: 7 }, (_, i) => (i + 1) / 8).map((u) => (
        <path key={`u${u}`} d={line(u, 0, u, 1)} />
      ))}
      {Array.from({ length: 7 }, (_, i) => (i + 1) / 8).map((v) => (
        <path key={`v${v}`} d={line(0, v, 1, v)} />
      ))}
    </g>,

    /* 05 Finishes — furniture blocks, the only filled shapes in the drawing,
       because this is the only plate that is about the room being used. */
    <g key="fin" className="r-axo-fin">
      {[[0.1, 0.08, 0.3, 0.26], [0.55, 0.08, 0.9, 0.3], [0.1, 0.68, 0.34, 0.92], [0.6, 0.66, 0.9, 0.92]].map(
        ([a, b, c, d], i) => (
          <polygon key={i} points={[pt(a, b), pt(c, b), pt(c, d), pt(a, d)].join(' ')} />
        )
      )}
    </g>,
  ]

  return (
    <figure className="r-axo" data-reveal>
      <svg viewBox="0 0 720 596" role="img" aria-label="Exploded axonometric of a commercial floor: slab, services, partitions, ceiling, finishes">
        {/* Bottom plate first, so the ones above overlap it as they should. */}
        {layers.map((l, i) => (
          <g
            key={l.k}
            className={`r-axo-layer ${i <= live ? 'is-built' : ''} ${i === live ? 'is-live' : ''}`}
            style={{ '--i': layers.length - 1 - i }}
          >
            <polygon className="r-axo-plate" points={plate} />
            {motifs[i]}
            <text className="r-axo-n" x={iso(1, 0)[0] + 16} y={iso(1, 0)[1]}>
              {l.n}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}

/**
 * This site's own footer — a title block.
 *
 * The bottom-right corner of every construction drawing carries one: client,
 * project, scale, drawn by, checked, date, sheet number. Reproducing it here
 * makes the footer the single most recognisable thing on the page, and it is
 * an object neither of the other two services could borrow.
 */
function RenovationFooter({ service, onClose, onRequest }) {
  const year = new Date().getFullYear()
  return (
    <footer className="r-foot">
      <div className="r-foot-ask">
        <h3>{service.world.prompt}</h3>
        <p>
          A survey, then a written programme: scope, phasing, and the date the
          building comes back into service.
        </p>
        <button type="button" className="r-foot-cta" onClick={onRequest}>
          Request a survey <i aria-hidden="true">→</i>
        </button>
      </div>

      {/* The title block itself. */}
      <div className="r-titleblock">
        <div className="r-tb-row">
          <div className="r-tb-cell r-tb-wide">
            <dt>Client</dt>
            <dd>Commercial landlords, occupiers and facility teams</dd>
          </div>
          <div className="r-tb-cell">
            <dt>Discipline</dt>
            <dd>Strip-out · Fit-out · Services</dd>
          </div>
        </div>
        <div className="r-tb-row">
          <div className="r-tb-cell">
            <dt>Drawn</dt>
            <dd>ORYX Projects</dd>
          </div>
          <div className="r-tb-cell">
            <dt>Checked</dt>
            <dd>Contracts</dd>
          </div>
          <div className="r-tb-cell">
            <dt>Date</dt>
            <dd>{year}</dd>
          </div>
          <div className="r-tb-cell">
            <dt>Sheet</dt>
            <dd>03 / 03</dd>
          </div>
          <div className="r-tb-cell">
            <dt>Rev</dt>
            <dd>C</dd>
          </div>
        </div>
        <div className="r-tb-row">
          <div className="r-tb-cell r-tb-wide">
            <dt>Project</dt>
            <dd>ORYX Projects — a service of ORYX GROUP</dd>
          </div>
          <div className="r-tb-cell">
            <dt>Contact</dt>
            <dd><a href="mailto:projects@oryx.example">projects@oryx.example</a></dd>
          </div>
        </div>
      </div>

      <button type="button" className="r-foot-back" onClick={onClose}>
        ← All ORYX services
      </button>
    </footer>
  )
}
