/* `Route` still runs its own effect — it measures the stops list rather than
   the section, so it does not share the loading scene's driver. */
import { useEffect, useRef, useState } from 'react'
import WorldShell, { Media } from './WorldShell'
import { film, portal, gallery, closing } from '../../content/media'
import { useSmoothProgress } from '../../lib/useReveal'

/**
 * Transport & Logistics — "The Route."
 *
 * The page is a journey, so it is built as one. A route line runs down the left
 * edge and the sections are stops on it; scrolling moves a marker along the
 * line and lights each waypoint as it is reached. Everything else follows from
 * that decision: content arrives from the right like passing scenery, times and
 * figures are set in tabular numerals so they line up as a read-out, and the
 * proof-of-delivery card stamps itself when it comes into view.
 *
 * What makes this page *this* page is lateral motion and a line. Workforce has
 * neither — it assembles, in place, on a grid.
 */
export default function TransportWorld({ service, onClose, onRequest }) {
  const { world } = service
  const shots = gallery[service.id] || []

  return (
    <WorldShell service={service} onClose={onClose}>
      {/* ── Its own navigation ────────────────────────────────────────
          A dispatch portal's bar: dense, full width, condensed uppercase, with
          a live status chip. Nothing about it is shared with the other two
          services beyond the wordmark. */}
      <header className="t-nav">
        <div className="t-nav-inner">
          <button type="button" className="t-nav-mark" onClick={onClose}>
            <i aria-hidden="true" />
            <span className="t-nav-word">ORYX</span>
            <span className="t-nav-unit">Dispatch</span>
          </button>

          <nav className="t-nav-links" aria-label="Transport sections">
            <a href="#t-network">Network</a>
            <a href="#t-route">Schedule</a>
            <a href="#t-load">Services</a>
            <a href="#t-coverage">Coverage</a>
          </nav>

          <span className="t-nav-status">
            <i aria-hidden="true" />
            Live · 24/7
          </span>
        </div>
        <span className="t-nav-progress" aria-hidden="true" />
      </header>

      {/* ── Opening: film, with the consignment strip across the foot ─── */}
      <header className="t-open">
        <Media clip={film.transport} />
        <div className="t-open-copy">
          <p className="world-eyebrow" data-reveal>{service.index} · Service</p>
          <h2 data-reveal>{service.title}</h2>
          <p className="world-promise" data-reveal>{service.promise}</p>
        </div>

        {/* A manifest, not a decoration: the same four facts a dispatcher would
            read off a consignment, set in the tabular figures the rest of the
            page uses. It tells you what kind of page this is before a word of
            body copy is read. */}
        <dl className="t-manifest" data-reveal>
          <div><dt>Origin</dt><dd>Depot · Randstad</dd></div>
          <div><dt>Service</dt><dd>Scheduled · On demand</dd></div>
          <div><dt>Cover</dt><dd>24 / 7</dd></div>
          <div><dt>Proof</dt><dd>Signed · Timestamped</dd></div>
        </dl>
      </header>

      {/* ── The network ───────────────────────────────────────────────
          A map. Nothing else on the site is a map, and no other service could
          use one — which is exactly the job: the page should be recognisable
          as Transport from across the room, before a word is read. */}
      <NetworkMap map={world.map} />

      {/* ── The route ─────────────────────────────────────────────────── */}
      <Route stops={world.route} lede={world.lede} shot={shots[0]} />

      {/* ── What it is, as a load ─────────────────────────────────────
          The four things this service is, as four crates going onto a lorry
          that then drives out of frame. A four-up card grid said "reference
          table"; this says what the service actually does with them. */}
      <Load items={world.definition} />

      {/* ── Interlude ─────────────────────────────────────────────────── */}
      <section className="t-interlude">
        <Media clip={portal.transport} />
        <p className="t-interlude-line" data-reveal>{service.body}</p>
      </section>

      {/* ── The board ─────────────────────────────────────────────────
          Figures set as a departure board, which is the one place on this site
          where a row of numerals is the native form rather than a stylistic
          choice. */}
      <section className="t-board" id="t-coverage">
        <ul className="t-figs">
          {world.figures.map((f) => (
            <li key={f.l} data-reveal>
              <span className="t-fig-n">{f.n}</span>
              <span className="t-fig-l">{f.l}</span>
            </li>
          ))}
        </ul>

        <div className="t-for" data-reveal>
          <p className="t-for-line">{world.audience.line}</p>
          <ul className="t-chips">
            {world.audience.items.map((it) => (
              <li key={it.k}>
                <span>{it.k}</span>
                <small>{it.d}</small>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What's inside, against the proof-of-delivery card ──────────── */}
      <section className="t-inside-block" id="t-included">
        <div className="t-inside-copy">
          <p className="world-kicker" data-reveal>The services</p>
          <h3 className="t-inside-head" data-reveal>Five things we run for you</h3>
          <p className="world-line" data-reveal>
            Every one of them sits under one agreement, with one point of contact.
          </p>
          <ol className="t-inside">
            {world.inside.map((it, i) => (
              <li key={it.k} data-reveal>
                <span className="t-inside-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="t-inside-body">
                  <span className="t-inside-k">{it.k}</span>
                  <span className="t-inside-d">{it.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <Pod shot={shots[2]} />
      </section>

      <TransportFooter service={service} onClose={onClose} onRequest={onRequest} />
    </WorldShell>
  )
}

/**
 * This site's own footer.
 *
 * A logistics operator's: a dispatch strip across the top with the number you
 * actually ring, then dense columns of coverage and depots, then a legal line.
 * It has nothing structurally in common with the other two services' footers —
 * that is the point.
 */
function TransportFooter({ service, onClose, onRequest }) {
  return (
    <footer className="t-foot">
      <div className="t-foot-call">
        <Media clip={closing.transport} />
        <div className="t-foot-call-inner">
          <p className="t-foot-prompt">{service.world.prompt}</p>
          <div className="t-foot-actions">
            <button type="button" className="t-foot-cta" onClick={onRequest}>
              Book a collection <i aria-hidden="true">→</i>
            </button>
            <a className="t-foot-tel" href="tel:+310000000000">+31 (0)00 000 0000</a>
          </div>
        </div>
      </div>

      <div className="t-foot-cols">
        <div>
          <h4>Services</h4>
          <ul>
            <li>Scheduled routes</li>
            <li>On demand</li>
            <li>Between sites</li>
            <li>Specialist handling</li>
          </ul>
        </div>
        <div>
          <h4>Coverage</h4>
          <ul>
            <li>Randstad</li>
            <li>Nationwide</li>
            <li>Cross-border</li>
          </ul>
        </div>
        <div>
          <h4>Depots</h4>
          <ul className="t-foot-mono">
            <li>Rotterdam · Port</li>
            <li>Den Haag · Cross-dock</li>
            <li>Amsterdam · Hub</li>
            <li>Eindhoven · Drop</li>
          </ul>
        </div>
        <div>
          <h4>Dispatch</h4>
          <ul className="t-foot-mono">
            <li>Mon–Sun · 24 hours</li>
            <li>Exception cover · always</li>
            <li>dispatch@oryx.example</li>
          </ul>
        </div>
      </div>

      <div className="t-foot-base">
        <span>ORYX Dispatch — a service of ORYX GROUP</span>
        <button type="button" className="t-foot-back" onClick={onClose}>
          ← All ORYX services
        </button>
      </div>
    </footer>
  )
}

/**
 * The load: four crates, a lorry, and a departure.
 *
 * Drawn rather than photographed, because no stock library has the four things
 * this service sells sitting in the back of one van. It is authored as flat
 * geometry in the brand's two colours so it belongs to the page instead of
 * looking like clip art dropped onto it.
 *
 * One scroll-driven number, `--p`, runs the whole scene: crates fly in and
 * stack over the first two-thirds of it, then the lorry pulls right and leaves.
 * Each crate's own progress is sliced out of `--p` in CSS with `clamp()`, so
 * the sequencing costs no extra JavaScript and nothing can fall out of step.
 */
function Load({ items }) {
  const section = useRef(null)
  const [live, setLive] = useState(-1)

  /* Smoothed, not raw. Wheel and trackpad scroll arrive in lumps, and a scene
     reading the raw value steps with them however carefully it is eased. */
  useSmoothProgress(section, (p) => {
    setLive(Math.min(items.length - 1, Math.floor((p / 0.62) * items.length)))
  })

  return (
    <section className="t-load" id="t-load" ref={section}>
      <div className="t-load-sticky">
        <p className="world-kicker">What it is</p>

        <div className="t-load-scene" aria-hidden="true">
          <svg viewBox="120 160 1000 250">
            {/* The road. One line, because the lorry needs something to be on
                and anything more would start competing with the map above. */}
            <path className="t-road" d="M60 378 H1180" />
            <path className="t-road-dash" d="M60 378 H1180" />

            {/* Everything that travels sits in one group, so the departure is
                a single transform rather than nine synchronised ones. */}
            <g className="t-rig">
              {/* Trailer: open-topped, so the load is visible inside it. */}
              <path className="t-trailer" d="M250 200 V340 H700 V200" />
              <path className="t-trailer-floor" d="M244 340 H706" />

              {/* Cab */}
              <path
                className="t-cab"
                d="M706 340 V236 H772 L812 286 V340 Z"
              />
              <path className="t-glass" d="M716 246 H768 L800 288 H716 Z" />

              <g className="t-wheel"><circle cx="330" cy="348" r="30" /><circle className="t-hub" cx="330" cy="348" r="11" /></g>
              <g className="t-wheel"><circle cx="620" cy="348" r="30" /><circle className="t-hub" cx="620" cy="348" r="11" /></g>
              <g className="t-wheel"><circle cx="770" cy="348" r="30" /><circle className="t-hub" cx="770" cy="348" r="11" /></g>


              {/* The crates. Stacked two by two in the bed; each flies in from
                  up and to the right, which is the direction a crate would come
                  from if it were being swung in off a dock. */}
              {items.slice(0, 4).map((it, i) => {
                const col = i % 2
                const row = i < 2 ? 1 : 0
                const x = 300 + col * 190
                const y = 210 + row * 68
                return (
                  <g className="t-crate" key={it.k} style={{ '--i': i }}>
                    <rect x={x} y={y} width="170" height="62" />
                    <path d={`M${x} ${y} L${x + 170} ${y + 62}`} />
                    <path d={`M${x + 170} ${y} L${x} ${y + 62}`} />
                    <text x={x + 85} y={y + 37}>{it.k}</text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* The scene shows what is loaded; the list says what each one means. */}
        <ol className="t-load-list">
          {items.map((it, i) => (
            <li key={it.k} className={i <= live ? 'is-on' : ''}>
              <span className="t-load-k">{it.k}</span>
              <span className="t-load-d">{it.d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/**
 * The network, drawn as a map.
 *
 * Hand-authored SVG rather than a chart library or a real tile map: it needs to
 * be five nodes and one route in two brand colours, and anything that renders
 * actual cartography would drag in a hundred kilobytes, a network request and a
 * palette nobody chose. The grid behind it is the only thing suggesting
 * geography, and that is enough — this is a diagram of a service, not an atlas.
 *
 * The route draws itself once on reveal and a marker runs it on a loop, so the
 * section reads as live without pretending to be live data.
 */
function NetworkMap({ map }) {
  if (!map) return null
  return (
    <section className="t-map-block" id="t-network">
      <div className="t-map-head">
        <p className="world-kicker" data-reveal>The network</p>
        <p className="world-line" data-reveal>
          Fixed routes across the Randstad, and capacity to anywhere else in the
          country on the same agreement.
        </p>
      </div>

      <figure className="t-map" data-reveal>
        <svg viewBox="0 0 1180 340" role="img" aria-label="Route network across the Netherlands">
          <defs>
            <pattern id="t-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 H0 V40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>

          <rect className="t-map-grid" width="1180" height="340" fill="url(#t-grid)" />

          {/* Laid twice: a dim full-length track so the whole network is
              always legible, and the drawn route on top of it. */}
          <path className="t-map-track" d={map.path} />
          <path className="t-map-route" d={map.path} pathLength="1" />
          <path className="t-map-runner" d={map.path} pathLength="1" />

          {map.nodes.map((n, i) => (
            <g className="t-map-node" key={n.k} style={{ '--i': i }}>
              <circle cx={n.x} cy={n.y} r="6" />
              {/* Stacked clear of the pin: the sub-label baseline used to land
                  on the circle itself, so the two lines and the node all
                  collided at every stop. */}
              <text x={n.x} y={n.y - 32} className="t-map-k">{n.k}</text>
              <text x={n.x} y={n.y - 16} className="t-map-s">{n.s}</text>
            </g>
          ))}
        </svg>
      </figure>
    </section>
  )
}

/**
 * The signature device: a line, and a marker that travels it as you scroll.
 *
 * The marker is driven by a CSS variable written on every scroll frame rather
 * than by React state — this updates at frame rate, and re-rendering a section
 * this size that often is the difference between a marker that tracks the
 * scroll and one that lags a beat behind it.
 */
function Route({ stops, lede, shot }) {
  const section = useRef(null)
  const list = useRef(null)
  const [live, setLive] = useState(0)

  useEffect(() => {
    const el = section.current
    const ol = list.current
    if (!el || !ol) return
    const scroller = el.closest('.world-scroll')
    if (!scroller) return

    let frame = 0
    const update = () => {
      frame = 0
      /* Measured against the list of stops, not the section that contains it.
         Against the section the run finished about halfway down — the section
         is taller than its list, so the marker hit the last stop and then sat
         there for another screenful of scrolling. Tying it to the list means
         the line fills exactly as the stops are passed, which is the only
         reading of the device that makes sense. */
      const r = ol.getBoundingClientRect()
      const h = scroller.clientHeight
      /* Starts as the list rises past three-quarters of the screen, completes
         as its foot clears the halfway mark. */
      const span = 0.3 * h + r.height
      const p = span > 0 ? Math.min(1, Math.max(0, (0.75 * h - r.top) / span)) : 0
      el.style.setProperty('--run', String(p))
      setLive(Math.min(stops.length - 1, Math.floor(p * stops.length)))
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
  }, [stops.length])

  return (
    <section className="t-route" id="t-route" ref={section}>
      <div className="t-route-intro">
        <p className="world-kicker" data-reveal>What it is</p>
        <p className="world-lede" data-reveal>{lede}</p>
        {shot && (
          <figure className="t-route-shot" data-reveal>
            <img src={shot.src} alt={shot.alt || ''} loading="lazy" />
          </figure>
        )}
      </div>

      <ol className="t-stops" ref={list}>
        {/* The line itself, and the travelling marker on it. */}
        <span className="t-line" aria-hidden="true">
          <span className="t-line-run" />
          <span className="t-marker" />
        </span>

        {stops.map((s, i) => (
          <li
            key={s.k}
            className={`t-stop ${i <= live ? 'is-passed' : ''} ${
              i === live ? 'is-live' : ''
            }`}
          >
            <span className="t-stop-dot" aria-hidden="true" />
            <span className="t-stop-t">{s.t}</span>
            <span className="t-stop-body">
              <span className="t-stop-k">{s.k}</span>
              <span className="t-stop-d">{s.d}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** The proof of delivery, which stamps itself once it is on screen. Every other
 *  page claims its accountability in a sentence; this one shows the artefact. */
function Pod({ shot }) {
  return (
    <figure className="t-pod" data-reveal>
      {shot && <img src={shot.src} alt={shot.alt || ''} loading="lazy" />}
      <figcaption className="t-pod-stamp" aria-hidden="true">
        <span className="t-pod-mark">Delivered</span>
        <span className="t-pod-meta">Signed · 11:20 · Proof returned</span>
      </figcaption>
    </figure>
  )
}
