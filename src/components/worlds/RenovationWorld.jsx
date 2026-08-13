import { useCallback, useEffect, useRef, useState } from 'react'
import WorldShell, { Media, WorldClose } from './WorldShell'
import { film, portal, gallery, closing } from '../../content/media'

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
      {/* ── Opening ───────────────────────────────────────────────────── */}
      <header className="r-open">
        <Media clip={film.renovation} />
        <div className="r-open-copy">
          <p className="world-eyebrow" data-reveal>{service.index} · Service</p>
          <h2 data-reveal>{service.title}</h2>
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
      <section className="r-plan-block">
        <div className="r-plan-head">
          <p className="world-kicker" data-reveal>Drawn before it is built</p>
          <p className="world-line" data-reveal>
            Every partition, service run and finish agreed on paper first, so the
            programme has something to be measured against.
          </p>
        </div>

        <figure className="r-plan" data-reveal>
          <svg viewBox="0 0 860 460" role="img" aria-label="Floor plan of a commercial fit-out">
            <path className="r-plan-shell" d={world.plan.shell} pathLength="1" />
            {world.plan.walls.map((d, i) => (
              <path className="r-plan-wall" key={d} d={d} pathLength="1" style={{ '--i': i }} />
            ))}
            {world.plan.rooms.map((r, i) => (
              <text
                className="r-plan-room"
                key={r.k}
                x={r.x}
                y={r.y}
                style={{ '--i': i }}
              >
                {r.k}
              </text>
            ))}
            {/* A dimension line, because a plan without one is a diagram. */}
            <g className="r-plan-dim">
              <path d="M40 442 H820" />
              <path d="M40 436 V448" />
              <path d="M820 436 V448" />
              <text x="430" y="432">1 240 m²</text>
            </g>
          </svg>
        </figure>
      </section>

      {/* ── The programme ─────────────────────────────────────────────
          Twelve weeks, five phases, and visible overlap. The overlap is the
          product: trades running into each other is what one accountable
          programme buys, and what a queue of separate contractors cannot. */}
      <section className="r-programme">
        <div className="r-prog-head">
          <p className="world-kicker" data-reveal>One programme, one date</p>
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

      {/* ── The layers ────────────────────────────────────────────────── */}
      <Layers layers={world.layers} />

      {/* ── The specification ─────────────────────────────────────────
          Real finish names against real colour, so the strip is a
          specification rather than a row of decorative squares. */}
      <section className="r-materials">
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
          <article className="r-define-card" key={it.k} data-reveal>
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
          {world.figures.map((f) => (
            <li key={f.l} data-reveal>
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
      <section className="r-inside-block">
        <p className="world-kicker" data-reveal>What&rsquo;s inside</p>
        <ol className="r-inside">
          {world.inside.map((it, i) => (
            <li key={it.k} data-reveal>
              <span className="r-inside-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="r-inside-k">{it.k}</span>
              <span className="r-inside-d">{it.d}</span>
            </li>
          ))}
        </ol>
      </section>

      <WorldClose
        service={service}
        clip={closing.renovation}
        onClose={onClose}
        onRequest={onRequest}
      />
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
    <section className="r-layers" ref={section}>
      <div className="r-layers-sticky">
        <p className="world-kicker">In the order it is built</p>

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
    </section>
  )
}
