/* `Route` still runs its own effect — it measures the stops list rather than
   the section, so it does not share the loading scene's driver. */
import { useEffect, useRef, useState } from 'react'
import WorldShell, { Media } from './WorldShell'
import { film, gallery, closing } from '../../content/media'
import { clients } from '../../content/copy'
import { useSmoothProgress } from '../../lib/useReveal'
import { ctaFor, emailFor, transportServices } from '../../content/requests'
import { cardImage } from '../../lib/cardImage'
import { SoundToggle } from '../Sound'
import { Social } from '../../sections/Footer'
import Icon from '../Icon'
import { ui } from '../../content/ui'
import LangSwitch from '../LangSwitch'

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
          A dispatch portal's bar: dense, full width, tracked capitals, with
          a live status chip. Nothing about it is shared with the other two
          services beyond the wordmark. */}
      <header className="t-nav">
        <div className="t-nav-inner">
          <button type="button" className="t-nav-mark" onClick={onClose}>
            <i aria-hidden="true" />
            <span className="t-nav-word">ORYX</span>
            <span className="t-nav-unit">{ui.transport.unit}</span>
          </button>

          <nav className="t-nav-links" aria-label={ui.transport.sections}>
            <a href="#t-network">{ui.transport.navNetwork}</a>
            <a href="#t-route">{ui.transport.navSchedule}</a>
            <a href="#t-load">{ui.transport.navServices}</a>
            <a href="#t-coverage">{ui.transport.navCoverage}</a>
          </nav>

          {/* Was "Live · 24/7", which is a staffed-cover claim and blocked by
              the publication gate — see the note on `figures` in copy.js. The
              badge describes the consignment instead, which is what the dot
              beside it is actually reporting. */}
          <div className="t-nav-r">
            <span className="t-nav-status">
              <i aria-hidden="true" />
              {ui.transport.status}
            </span>
            <LangSwitch />
            <SoundToggle bare />
            {/* Full label for anyone who can see or hear it; the short one only
                on the narrowest phones, as in the home page's bar. */}
            <button type="button" className="t-nav-cta" onClick={() => onRequest(service.id)} aria-label={ctaFor(service.id)}>
              <span className="world-cta-full">{ctaFor(service.id)}</span>
              <span className="world-cta-short" aria-hidden="true">{ui.nav.requestShort}</span>
            </button>
          </div>
        </div>
        <span className="t-nav-progress" aria-hidden="true" />
      </header>

      {/* ── Opening: film, with the consignment strip across the foot ─── */}
      <header className="t-open">
        <Media clip={film.transport} />
        <div className="t-open-copy">
          <p className="world-eyebrow" data-reveal>
            {service.index} / {service.title}
          </p>
          {/* The headline carries the opening, not the service name — the name
              is already in the eyebrow above it and in the navigation. */}
          {/* `--len`, the longest word in letters, keeps a long German or
              Dutch word on one line on a phone; see world-shell.css. */}
          <h2 data-reveal style={{ '--len': Math.max(...world.headline.split(/\s+/).map((w) => w.length)) }}>
            {world.headline.split('\n').map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="world-promise" data-reveal>{service.promise}</p>
        </div>

        {/* A manifest, not a decoration: the same four facts a dispatcher would
            read off a consignment, set in the tabular figures the rest of the
            page uses. It tells you what kind of page this is before a word of
            body copy is read. */}
        <dl className="t-manifest" data-reveal>
          {ui.transport.manifest.map((m) => (
            <div key={m.dt}><dt>{m.dt}</dt><dd>{m.dd}</dd></div>
          ))}
        </dl>
      </header>

      {/* ── The network ───────────────────────────────────────────────
          A map. Nothing else on the site is a map, and no other service could
          use one — which is exactly the job: the page should be recognisable
          as Transport from across the room, before a word is read. */}
      <NetworkMap map={world.map} />

      {/* Road markings between the main sections. Decoration only: ten pixels
          of tarmac whose centre line slides as the page is scrolled. There is
          none under the opening frame, because the manifest hangs off its foot
          there, and none beside the client tape, which is already a dark band
          of its own. */}
      <Lane />

      {/* ── The route ─────────────────────────────────────────────────── */}
      {/* A generated ORYX picture takes over from the stock still as soon as
          one is dropped in `src/assets/cards/transport/`. */}
      <Route stops={world.route} lede={world.lede} shot={cardImage('transport/route') || shots[0]} />

      {/* Outside the loading scene, not in it. The scene is sticky and has a
          road of its own. */}
      <Lane />

      {/* ── What it is, as a load ─────────────────────────────────────
          The four things this service is, as four crates going onto a lorry
          that then drives out of frame. A four-up card grid said "reference
          table"; this says what the service actually does with them. */}
      <Load items={world.definition} />

      <Lane />

      {/* ── How it runs ───────────────────────────────────────────────
          The page shows what happens on the day but never says how a job
          starts. Four steps, in dispatch language, numbered like a manifest. */}
      <section className="t-process" id="t-process">
        <div className="t-process-head">
          <p className="world-kicker" data-reveal>{ui.transport.processKicker}</p>
          <h3 data-reveal>{ui.transport.processHead}</h3>
        </div>
        <ol className="t-steps">
          {world.process.map((st, i) => (
            <li key={st.k} data-reveal style={{ '--i': i }}>
              <span className="t-step-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="t-step-k">{st.k}</span>
              <span className="t-step-d">{st.d}</span>
            </li>
          ))}
        </ol>
      </section>

      <Lane />

      {/* ── The board ─────────────────────────────────────────────────
          Figures set as a departure board, which is the one place on this site
          where a row of numerals is the native form rather than a stylistic
          choice. */}
      <section className="t-board" id="t-coverage">
        <ul className="t-figs">
          {world.figures.map((f, j) => (
            <li key={f.l} data-reveal>
              <SplitFlap value={f.n} order={j} />
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

      {/* ── Who it runs for ───────────────────────────────────────────
          A tape, because a client list on a dispatch page should behave like
          the board in an operations room: always moving, never demanding to be
          read. It renders sector names until real logos are dropped into
          `/public/clients/` — see `clients` in copy.js. */}
      <section className="t-tape" aria-label={ui.transport.clients}>
        <div className="t-tape-rail">
          {/* Two identical runs. The loop is a translate of exactly -50%, so
              the second copy is under the pointer at the instant the first
              leaves — one copy would show a gap on every pass. */}
          {[0, 1].map((copy) => (
            <ul className="t-tape-run" key={copy} aria-hidden={copy === 1}>
              {clients.map((c) => (
                <li key={c.name}>
                  {c.logo ? (
                    <img src={c.logo} alt={c.name} loading="lazy" />
                  ) : (
                    <span>{c.name}</span>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ── What's inside, against the proof-of-delivery card ──────────── */}
      <section className="t-inside-block" id="t-included">
        <div className="t-inside-copy">
          <p className="world-kicker" data-reveal>{ui.transport.servicesKicker}</p>
          <h3 className="t-inside-head" data-reveal>{ui.transport.servicesHead}</h3>
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

        <Pod shot={cardImage('transport/proof') || shots[2]} />
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
            <button type="button" className="t-foot-cta" onClick={() => onRequest(service.id)}>
              {ctaFor(service.id)} <i aria-hidden="true"><Icon name="arrow" size={16} /></i>
            </button>
            <a className="t-foot-tel" href="tel:+310000000000">+31 (0)00 000 0000</a>
          </div>
        </div>
      </div>

      <div className="t-foot-cols">
        <div>
          <h4>{ui.transport.footServices}</h4>
          <ul>
            {transportServices.map((t) => <li key={t.id}>{t.label}</li>)}
          </ul>
        </div>
        <div>
          <h4>{ui.transport.footCoverage}</h4>
          <ul>
            {ui.transport.coverage.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div>
          <h4>{ui.transport.footNetwork}</h4>
          <ul className="t-foot-mono">
            {service.world.map.nodes.map((n) => <li key={n.k}>{n.k}</li>)}
          </ul>
        </div>
        <div>
          <h4>{ui.transport.footDispatch}</h4>
          <ul className="t-foot-mono">
            {/* The one cleared 24/7 wording. "Mon–Sun · 24 hours" and
                "Exception cover · always" both promised a person on the end of
                it, which the gate blocks until it is evidenced. */}
            <li>{ui.common.submitAnytime}</li>
            <li><a href={`mailto:${emailFor('transport')}`}>{emailFor('transport')}</a></li>
          </ul>
        </div>
      </div>

      <div className="t-foot-base">
        <span>{ui.transport.footBase}</span>
        <Social />
        <button type="button" className="t-foot-back" onClick={onClose}>
          <Icon name="back" size={16} /> {ui.common.allServices}
        </button>
      </div>
    </footer>
  )
}

/**
 * Mark an element the first time the visitor actually reaches it.
 *
 * `useReveal` cannot be the trigger for anything that is meant to be watched.
 * Its backstop adds `is-in` to every element two and a half seconds after the
 * page opens, which is right for its job, content must never be lost, but it
 * means that by the time anyone scrolls this far the class has been there for
 * a while and whatever hung off it has already played to an empty room.
 *
 * So this adds `is-seen` when the element really crosses into view, and keeps
 * the same promise a different way: the resting styles are the finished ones,
 * and nothing here ever hides anything on its own account.
 *
 * `arm` is for entrances that need a starting pose, an undrawn line or a stamp
 * still in the air. The pose is the class `is-armed`, and the only thing that
 * ever sets it is the observer's own callback. An observer that never reports
 * never arms anything, so a dead one costs the animation and not the drawing.
 * One that has reported once is alive, and will report the crossing too. The
 * trigger is a line across the scroller and not a share of the element, since
 * a share is what goes unreached on an element taller than the screen.
 */
function useSeen(ref, { arm = false, margin = '-12%' } = {}) {
  useEffect(() => {
    const el = ref.current
    const root = el?.closest('.world-scroll')
    if (!el || !root || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1]
        if (!e.isIntersecting) {
          if (arm) el.classList.add('is-armed')
          return
        }
        if (arm) {
          /* Already in view on the first report, so it was never armed. Take
             the pose and commit it with a style flush before letting go, or
             there is no starting value to move from. A flush and not a frame
             callback: a frame that never comes would leave it armed. */
          el.classList.add('is-armed')
          void el.getBoundingClientRect()
          el.classList.remove('is-armed')
        }
        el.classList.add('is-seen')
        io.disconnect()
      },
      { root, rootMargin: `0px 0px ${margin} 0px`, threshold: 0 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      /* Armed only ever while an observer is alive to disarm it. */
      el.classList.remove('is-armed')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/**
 * Road markings, as a divider.
 *
 * An empty element on purpose. The dashes are a CSS background and their slide
 * reads `--scrolled`, which WorldShell already writes on the root, so a strip
 * of road costs no JavaScript and no listener of its own.
 */
function Lane() {
  return <div className="t-lane" aria-hidden="true" />
}

/**
 * A figure set as split-flap tiles, the way a departure board sets one.
 *
 * Two copies of the value, and the split matters. The real one is plain text a
 * screen reader gets at all times; the tiles are a drawing of it and are hidden
 * from assistive technology, because read aloud they would be "one, zero,
 * zero, per cent" plus every digit each tile turns through.
 *
 * Each tile holds its final character in normal flow and hangs the characters
 * it turns through above it, out of sight. At rest nothing is transformed, so
 * the tile shows the right character with no animation at all. The flip is CSS
 * hung off `is-seen`, and it is never armed: a starting pose for a figure would
 * be a wrong figure, and no entrance is worth the risk of one being left up.
 * The board turns through its drum from the true value back to the true value,
 * which is what a real one does when it refreshes.
 */
function SplitFlap({ value, order = 0 }) {
  const text = String(value)
  const el = useRef(null)
  useSeen(el)
  return (
    <span className="t-fig-n" ref={el}>
      <span className="sr-only">{text}</span>
      <span className="t-flaps" aria-hidden="true">
        {[...text].map((ch, i) => {
          /* Later tiles turn for longer and start later, so a figure settles
             from left to right and the three figures settle in order. */
          const turns = 4 + i * 2 + order
          return (
            <span
              className="t-flap"
              key={i}
              style={{ '--n': turns, '--d': `${order * 140 + i * 90}ms` }}
            >
              <span className="t-flap-reel">
                <span className="t-flap-run">
                  {flapRun(ch, turns).map((c, k) => <span key={k}>{c}</span>)}
                </span>
                <span className="t-flap-set">{ch}</span>
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}

/* The characters a tile turns through on its way to `ch`. A real board does
   not shuffle, it advances through its drum in order, so a digit counts up to
   itself. Anything that is not a digit is treated as the card after the 9.
   Fixed rather than random, so two renders can never disagree. */
function flapRun(ch, turns) {
  const end = /\d/.test(ch) ? Number(ch) : 10
  return Array.from({ length: turns }, (_, k) => String((((end - turns + k) % 10) + 10) % 10))
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
        <p className="world-kicker">{ui.transport.whatItIs}</p>

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
 * The route draws itself once on reveal and a small ORYX van drives it on a
 * loop, so the section reads as a network in use without pretending to be live
 * data. The van is a drawing of the service, not a position report.
 *
 * The van follows the route with CSS `offset-path`, fed the same path string
 * the route is drawn from, so the two cannot disagree. It is CSS rather than
 * SVG `animateMotion` because CSS can be told to stop: reduced motion, the
 * `is-still` flag and an off-screen map all park or pause it from the
 * stylesheet, where a SMIL animation would need script to be halted.
 *
 * Each pin pulses as the van reaches it. Van and pins run the same duration and
 * start from the same class change, so all a pin needs is how far along the
 * route it sits, which is measured once on mount.
 *
 * The draw-in and the van both start from `is-seen`, not from `is-in`. See
 * `useSeen` for why: the map is a screen below the fold, and hung off `is-in`
 * the route had usually finished drawing before anyone arrived to watch.
 */
function NetworkMap({ map }) {
  const figure = useRef(null)
  const track = useRef(null)
  const nodes = map?.nodes || []

  /* Guessed from x first, so the pins are already close to right on the first
     paint and stay sensible if the measurement below cannot run. */
  const [at, setAt] = useState(() => guessStops(nodes))

  useSeen(figure, { arm: true, margin: '-16%' })

  useEffect(() => {
    const measured = track.current && measureStops(track.current, nodes)
    if (measured) setAt(measured)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  /* The loop is paused while the map is off screen. It is one small group, but
     an animation nobody can see should not be asking for frames. Van and pins
     pause and resume from the same class, so they cannot drift apart.
     `classList`, not React state: `useReveal` and `useSeen` put their classes
     on this same figure the same way, and a className written by React would
     wipe them. */
  useEffect(() => {
    const el = figure.current
    const root = el?.closest('.world-scroll')
    if (!el || !root || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle('is-away', !e.isIntersecting),
      { root, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!map) return null

  const hubIndex = Math.max(0, nodes.findIndex((n) => n.hub))
  const hub = nodes[hubIndex]

  return (
    <section className="t-map-block" id="t-network">
      <div className="t-map-head">
        <p className="world-kicker" data-reveal>{ui.transport.networkKicker}</p>
        <p className="world-line" data-reveal>{ui.transport.networkLine}</p>
      </div>

      <figure className="t-map" data-reveal ref={figure}>
        <svg viewBox="0 0 1180 340" role="img" aria-label={ui.transport.mapLabel}>
          <defs>
            <pattern id="t-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 H0 V40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>

          <rect className="t-map-grid" width="1180" height="340" fill="url(#t-grid)" />

          {/* Laid twice: a dim full-length track so the whole network is
              always legible, and the drawn route on top of it. The track is
              also the one that gets measured, because it carries no
              `pathLength` to confuse a reading in real units. */}
          <path className="t-map-track" d={map.path} ref={track} />
          <path className="t-map-route" d={map.path} pathLength="1" />

          {/* The van. Drawn around its own origin and facing +x, because that
              origin is the point `offset-path` carries along the route and +x
              is the direction `offset-rotate: auto` turns to face. It sits
              before the pins in the markup so it passes behind them: a pin
              that pulses as the van arrives has to stay in view to be seen
              doing it.

              `--route` is the path from the data. `--hub` is how far along it
              the home hub sits, which is where the van parks when motion is
              off; `--hx` and `--hy` say the same thing in plain coordinates
              for a browser with no `offset-path`. */}
          <g
            className="t-map-van"
            aria-hidden="true"
            style={{
              '--route': `path('${map.path}')`,
              '--hub': at[hubIndex] ?? 0,
              '--hx': `${hub?.x ?? 0}px`,
              '--hy': `${hub?.y ?? 0}px`,
            }}
          >
            <g className="t-map-van-body">
              <path className="t-van-shell" d="M-17 5 V-8 H8 L14 -1 L17 0 V5 Z" />
              <path className="t-van-stripe" d="M-11 4.4 H-5 L3 -7.4 H-3 Z" />
              <path className="t-van-glass" d="M8.6 -6.4 L12.6 -1.6 H8.6 Z" />
              <circle className="t-van-wheel" cx="-9" cy="5" r="3" />
              <circle className="t-van-wheel" cx="10" cy="5" r="3" />
            </g>
          </g>

          {nodes.map((n, i) => (
            <g className="t-map-node" key={n.k} style={{ '--i': i, '--at': at[i] ?? 0 }}>
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

/* How far along the route each city sits, 0 to 1, read off x alone. Close
   enough for a first paint on a route that runs left to right. */
function guessStops(nodes) {
  if (nodes.length < 2) return nodes.map(() => 0)
  const x0 = nodes[0].x
  const span = nodes[nodes.length - 1].x - x0 || 1
  return nodes.map((n) => Math.min(1, Math.max(0, (n.x - x0) / span)))
}

/* The same fractions, measured. The cities lie on the path but the path does
   not say where, so it is walked: one coarse pass shared by every city, then a
   fine pass around each city's nearest coarse point. A few hundred
   `getPointAtLength` calls, once. Returns null where the geometry API is
   missing, and the guess above stands. */
function measureStops(path, nodes) {
  const total = path.getTotalLength?.() || 0
  if (!total || !nodes.length) return null

  const COARSE = 160
  const step = total / COARSE
  const pts = Array.from({ length: COARSE + 1 }, (_, k) => path.getPointAtLength(k * step))
  const gap = (p, n) => (p.x - n.x) ** 2 + (p.y - n.y) ** 2

  return nodes.map((n) => {
    let k = 0
    pts.forEach((p, j) => {
      if (gap(p, n) < gap(pts[k], n)) k = j
    })
    const from = Math.max(0, (k - 1) * step)
    const to = Math.min(total, (k + 1) * step)
    let best = k * step
    let bestGap = gap(pts[k], n)
    for (let l = from; l <= to; l += step / 16) {
      const g = gap(path.getPointAtLength(l), n)
      if (g < bestGap) {
        bestGap = g
        best = l
      }
    }
    return Number((best / total).toFixed(4))
  })
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

      /* Pin the line to the first and last dot, measured.
         CSS can put its top on the first dot easily enough — that offset is a
         constant — but its foot cannot be expressed at all: `bottom` counts up
         from the container, and the distance from there to the last dot's
         centre is whatever the last stop's content happens to make it. Left to
         CSS the line overshot by 55–120px and the marker parked below
         "Delivered" rather than on it. Two numbers, written here, and the line
         spans dot-centre to dot-centre exactly. */
      const dots = ol.querySelectorAll('.t-stop-dot')
      if (dots.length > 1) {
        const first = dots[0].getBoundingClientRect()
        const last = dots[dots.length - 1].getBoundingClientRect()
        const top = first.top + first.height / 2 - r.top
        ol.style.setProperty('--line-top', `${top}px`)
        ol.style.setProperty('--line-h', `${last.top + last.height / 2 - r.top - top}px`)
      }
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
        <p className="world-kicker" data-reveal>{ui.transport.whatItIs}</p>
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

/* The recipient's signature: an abstract scrawl, deliberately nobody's name.
   One continuous stroke, so it can be drawn from one end to the other the way
   a pen would travel: a tall first loop, a run of humps, a second tall letter,
   then the underline swept back beneath it and out to the right. */
const SIGNATURE =
  'M10 50 C 16 22, 30 6, 40 16 C 50 28, 30 62, 20 58 C 10 52, 40 34, 56 36 ' +
  'C 66 38, 54 56, 64 52 C 74 48, 76 34, 84 38 C 92 42, 82 56, 94 50 ' +
  'C 104 44, 104 30, 114 36 C 124 42, 110 58, 124 52 C 140 44, 146 20, 156 10 ' +
  'C 162 4, 166 14, 160 28 C 154 44, 146 62, 158 56 C 170 50, 178 40, 192 40 ' +
  'C 160 52, 110 66, 58 70 C 120 74, 190 66, 232 50'

/** The proof of delivery, which is signed and then stamped once it is on
 *  screen. Every other page claims its accountability in a sentence; this one
 *  shows the artefact.
 *
 *  The order is the order it happens in at a door: the signature is written
 *  first and the stamp comes down as the pen lifts. Both hang off one class on
 *  the signature, and the sequence between them is two delays in the
 *  stylesheet. It is the signature that is watched and not the figure, because
 *  it sits at the foot of a tall photograph: triggered by the figure's top edge
 *  it would be written and stamped before it had scrolled into view.
 *
 *  The signature is laid twice, a wide dark stroke under a thin light one. The
 *  photograph behind it runs from a bright floor to black workwear inside the
 *  width of the scrawl, and ink in either tone alone disappears over half of
 *  it. It comes before the stamp in the markup so the stamp lands over its
 *  tail on a narrow screen, as a real one would. */
function Pod({ shot }) {
  const sign = useRef(null)
  useSeen(sign, { arm: true, margin: '-8%' })
  return (
    <figure className="t-pod" data-reveal>
      {shot && <img src={shot.src} alt={shot.alt || ''} loading="lazy" />}
      <svg className="t-pod-sign" ref={sign} viewBox="0 0 240 80" aria-hidden="true" focusable="false">
        <path className="t-pod-sign-halo" d={SIGNATURE} pathLength="1" />
        <path className="t-pod-sign-ink" d={SIGNATURE} pathLength="1" />
      </svg>
      <figcaption className="t-pod-stamp" aria-hidden="true">
        <span className="t-pod-mark">{ui.transport.delivered}</span>
        <span className="t-pod-meta">{ui.transport.deliveredMeta}</span>
      </figcaption>
    </figure>
  )
}
