import { useCallback, useEffect, useId, useRef, useState } from 'react'
import WorldShell, { Media } from './WorldShell'
import { useMeasured } from '../../lib/useMeasured'
import { film, gallery } from '../../content/media'
import { services as svcs, route, tools, clients, faq, totals } from '../../content/renovation'
import { ctaFor, emailFor } from '../../content/requests'
import { cardImage } from '../../lib/cardImage'
import { SoundToggle } from '../Sound'
import { Social } from '../../sections/Footer'
import Sheet from '../Sheet'
import Icon from '../Icon'
import PhotoBand from '../PhotoBand'
import { ui } from '../../content/ui'
import { fmt, plural, brochure } from '../../i18n/core'
import LangSwitch from '../LangSwitch'

/**
 * Renovation — "The Sheet."
 *
 * Rebuilt against the ORYX source document *Property Care / Structure*, an
 * extract of the real copy files. That document replaced this page's contents
 * wholesale, so what used to be here — a five-layer axonometric that assembled
 * a fit-out on scroll, a twelve-week Gantt, a materials swatch strip and a set
 * of figures — is gone. None of it appears in the source, and a building going
 * up from nothing argued directly against the source's own differentiator:
 * *conserve what has value, repair what is necessary, replace only as a last
 * resort.*
 *
 * What replaced it is a catalogue: nine services, sixty-five works, and a
 * publication gate. So the page became a drawing sheet rather than a
 * construction, and it carries two devices.
 *
 * **The fork.** One section drawn once and marked up three ways, because the
 * decision a client actually makes is maintain, improve or transform. The
 * source puts that decision before the catalogue — "start with the right
 * decision for the property, not a long list of trades" — so the page does
 * too.
 *
 * **The schedule.** All sixty-five works on one continuous ruled sheet.
 * Nothing on it expands, nothing is hidden behind a control, and nothing has a
 * second height — so the page-jump this project has twice had to correct
 * cannot occur here at all.
 *
 * ── The line that must not be blurred ────────────────────────────────
 * The source is explicit that ORYX Property Care (work delivered as complete
 * packages) and ORYX Workforce (people the client manages) must never be
 * blurred on the site. That is why this page carries a cross-link to Workforce
 * and why it deliberately shares none of that world's shapes: no card grid, no
 * expanding shelf, no search, no disclosure.
 *
 * ── What may not be said ─────────────────────────────────────────────
 * The eight blocked claims, and the safe interim wording the source supplies
 * for each, are documented in full at the top of the Renovation block in
 * `copy.js`. Read it before adding anything here.
 */
/* ═══ A little life ═══════════════════════════════════════════════════
   The sheet draws itself as it is read: heading rules, dimension marks and
   corner marks are pulled in by a pen, the nine pictures develop like a print,
   and the seven steps get ticked off.

   Why this does not hang off `is-in`: `useReveal` carries a backstop that
   marks EVERYTHING revealed after two and a half seconds, which is right for
   content and wrong for decoration. Anything below the fold would have drawn
   itself long before anybody scrolled down to watch it.

   So this keeps its own observer, and the contract is the same as the rest of
   the project: the END state is the default. Every line is drawn and every
   picture is at full colour in the plain CSS. An element is only un-drawn
   (`is-wait`) by this observer's own first report, and only when that report
   says it is off screen. If the observer never fires, nothing is ever hidden.
   If it fires once, it demonstrably works and will fire again on the way in.

   Reduced motion skips all of it, and the stylesheet ignores these classes
   under `.is-still` as well, in case the setting changes mid-visit. */
function useSheetLife(anchor) {
  useEffect(() => {
    const scroller = anchor.current?.closest('.world-scroll')
    const world = scroller?.closest('.world')
    if (!scroller || !world) return
    if (typeof IntersectionObserver !== 'function') return
    if (world.classList.contains('is-still')) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const marks = [...scroller.querySelectorAll('[data-draw]')]
    const steps = [...scroller.querySelectorAll('.r-steps > li')]
    const timers = new Set()
    const reported = new WeakSet()

    /* The pictures need a slow, staggered filter transition once, and the
       quick one from `shared.css` for hover ever after. A class that lives
       for the length of the develop is the only way to have both. */
    const develop = (el) => {
      el.classList.add('is-developing')
      const t = setTimeout(() => {
        el.classList.remove('is-developing')
        timers.delete(t)
      }, 2800)
      timers.add(t)
    }

    const draw = new IntersectionObserver(
      (entries) => {
        const view = scroller.getBoundingClientRect()
        entries.forEach((e) => {
          const el = e.target
          const first = !reported.has(el)
          reported.add(el)

          if (e.isIntersecting) {
            draw.unobserve(el)
            if (!el.classList.contains('is-wait')) return
            if (el.matches('.cards')) develop(el)
            el.classList.remove('is-wait')
            return
          }
          if (!first) return
          /* Already on screen, only inside the trigger margin: leave it drawn.
             Un-drawing something a visitor can see would be a flicker. */
          const r = e.boundingClientRect
          if (r.top < view.bottom && r.bottom > view.top) {
            draw.unobserve(el)
            return
          }
          el.classList.add('is-wait')
        })
      },
      /* The same margin `useReveal` uses, so a line starts drawing as the
         block it belongs to arrives. */
      { root: scroller, rootMargin: '0px 0px -12% 0px', threshold: 0 },
    )
    marks.forEach((el) => draw.observe(el))

    /* A step is done once its top has climbed past the middle of the screen.
       Steps that cross together (a whole row does, on a desktop) are ticked
       one after another, in reading order. One way only: a tick that came
       off again on the way back up would read as the job being undone. */
    const tick = new IntersectionObserver(
      (entries) => {
        let n = 0
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          tick.unobserve(e.target)
          e.target.style.setProperty('--tick-d', `${n * 170}ms`)
          e.target.classList.add('is-done')
          n += 1
        })
      },
      { root: scroller, rootMargin: '0px 0px -42% 0px', threshold: 0 },
    )
    steps.forEach((el) => tick.observe(el))

    return () => {
      draw.disconnect()
      tick.disconnect()
      timers.forEach(clearTimeout)
      marks.forEach((el) => el.classList.remove('is-wait', 'is-developing'))
    }
  }, [anchor])
}

export default function RenovationWorld({ service, onClose, onRequest, onSwitch }) {
  const { world } = service
  const shots = gallery[service.id] || []
  const nav = useMeasured('--r-nav-h')

  /* Which service popup is open. It used to live inside the schedule; the
     photo band further down opens the same popups, so it sits here and both
     are handed the opener. */
  const [sheetId, setSheetId] = useState(null)
  const openedSvc = sheetId ? svcs.find((x) => x.id === sheetId) : null
  useSheetLife(nav)

  return (
    <WorldShell service={service} onClose={onClose}>
      {/* ── Its own navigation ────────────────────────────────────────
          A drawing sheet's header strip, not a website nav: sheet reference on
          the left, sections through the middle, revision and scale on the
          right, all boxed in ruled cells. Anyone who has held a construction
          drawing recognises this before they read it.

          The destinations are new because the sections are — and two of the
          four links used to point at the same anchor while a third pointed at
          a section that no longer exists. */}
      <header className="r-nav" ref={nav}>
        {/* First in the markup and last on screen (the CSS places it in the
            grid's second row). It cannot go last in the markup: the meta cell
            is styled through `:last-child`, and a sibling after it would take
            its left rule away. */}
        <Tape />
        <button type="button" className="r-nav-cell r-nav-mark" onClick={onClose}>
          <i aria-hidden="true" />
          <span>
            <b>{ui.renovation.unit}</b>
            <em>{ui.renovation.back}</em>
          </span>
        </button>

        <nav className="r-nav-cell r-nav-links" aria-label={ui.renovation.sections}>
          <a href="#r-scenarios">{ui.renovation.navDecision}</a>
          <a href="#r-schedule">{ui.renovation.navSchedule}</a>
          <a href="#r-route">{ui.renovation.navRoute}</a>
          <a href="#r-trust">{ui.renovation.navTrust}</a>
        </nav>

        <div className="r-nav-cell r-nav-sound">
          <LangSwitch />
          <SoundToggle bare />
        </div>

        <dl className="r-nav-cell r-nav-meta">
          <div><dt>{ui.renovation.metaSheet}</dt><dd>03</dd></div>
          <div><dt>{ui.renovation.metaServices}</dt><dd>{String(totals.services).padStart(2, '0')}</dd></div>
          <div><dt>{ui.renovation.metaWorks}</dt><dd>{totals.works}</dd></div>
        </dl>
      </header>

      {/* ── Opening ───────────────────────────────────────────────────── */}
      <header className="r-open">
        <Media clip={film.renovation} />
        <div className="r-open-copy">
          <p className="world-eyebrow" data-reveal>
            {service.index} / {service.title}
          </p>
          {/* `--len`, the longest word in letters, keeps a long German or
              Dutch word on one line on a phone; see world-shell.css. */}
          <h2 data-reveal style={{ '--len': Math.max(...world.headline.split(/\s+/).map((w) => w.length)) }}>
            {world.headline.split('\n').map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="world-promise" data-reveal>{service.promise}</p>
          {/* The source's own four beats, in its order. */}
          <ol className="r-beats" data-reveal>
            {world.beats.map((b) => <li key={b}>{b}</li>)}
          </ol>
        </div>
      </header>

      {/* ── The decision, before the list ─────────────────────────────── */}
      <Fork world={world} />

      {/* ── The schedule ──────────────────────────────────────────────── */}
      <Schedule onOpen={setSheetId} />

      {/* ── The scrub ─────────────────────────────────────────────────
          The one claim on this page a visitor can check by hand. */}
      <section className="r-scrub-block">
        <div className="r-scrub-intro" data-draw>
          <Dim n="3.3" />
          <p className="world-kicker" data-reveal>{ui.renovation.beforeAfter}</p>
          <p className="world-lede" data-reveal>{world.lede}</p>
        </div>
        <Scrub before={shots[0]} after={shots[2]} />
        {/* Said on the page, not only in a code comment. The pair is a matched
            illustration made to the brief, not a photograph of an ORYX
            project — and a before/after slider is read as evidence, which is
            precisely what it must not be until a real job has been shot. The
            source's gate says the same thing about client cases: consent,
            accuracy and publication period first, anonymised until then. */}
        <p className="r-scrub-note" data-reveal>{ui.renovation.scrubNote}</p>
      </section>

      {/* ── The route ─────────────────────────────────────────────────
          Seven steps. The claim the source makes about them is the part worth
          printing: the route does not change with the service — only the scope
          of step three does. That is what makes it a route rather than a list
          of things that happen to be done. */}
      <section className="r-process" id="r-route">
        <div className="r-process-head" data-draw>
          <Dim n="3.4" />
          <p className="world-kicker" data-reveal>{ui.renovation.processKicker}</p>
          <h3 data-reveal>{ui.renovation.processHead}</h3>
          <p className="world-lede" data-reveal>{world.routeLine}</p>
        </div>
        {/* The wrapper exists to carry the corner marks: a list may only hold
            list items, so the marks cannot go inside it. */}
        <div className="r-framed">
          <Programme steps={route} />
          <Corners />
        </div>

        {/* The two named methods, drawn. Named, and explicitly not sold as
            software: the source permits the names and forbids the product, so
            these are a booklet and a paper scale, with the descriptions turned
            into the labels on them. */}
        <div className="r-tools">
          {tools.map((t, i) => (
            <figure className="r-tool" key={t.k} data-reveal style={{ '--i': i }}>
              {i === 0 ? <Passport /> : <Meter phases={world.beats} />}
              <figcaption>
                <p className="r-tool-k">{t.k}</p>
                {/* Not in Dutch, where the name above already is it. */}
                {!t.k.includes(t.nl) && <p className="r-tool-nl">{fmt(ui.renovation.inDutch, { name: t.nl })}</p>}
                <p className="r-tool-d">{t.d}</p>
              </figcaption>
            </figure>
          ))}
          <p className="r-tools-note">{world.toolsNote}</p>
        </div>
      </section>

      {/* ── The services, in pictures ──────────────────────────────────
          A break in the reading: the nine service photographs drifting past,
          each opening its popup. */}
      <PhotoBand
        items={svcs.map((x) => ({ id: x.id, label: x.name, icon: x.id, img: cardImage(`renovation/${x.id}`) }))}
        onOpen={setSheetId}
        label={ui.renovation.band}
      />

      {/* ── Who we work for ────────────────────────────────────────────
          Six tiles: an icon and a name each, and the sentence about them only
          on hover or tap. Six paragraphs in a row were the wall this replaced. */}
      <section className="r-who">
        <div className="r-who-head" data-draw>
          <Dim n="3.5" />
          <p className="world-kicker" data-reveal>{ui.renovation.clientsKicker}</p>
          <h3 data-reveal>{ui.renovation.clientsHead}</h3>
        </div>
        <div className="r-framed">
          <Clients items={clients} />
          <Corners />
        </div>
      </section>

      {/* ── Straight answers ───────────────────────────────────────────
          The promise in one line, then the five questions the source wrote to
          close the gap between promise and evidence. The answers are the
          approved wording and stay word for word; they open one at a time
          rather than standing as a wall. */}
      <section className="r-trust" id="r-trust">
        <div className="r-trust-say" data-draw>
          <Dim n="3.6" />
          <p className="world-kicker" data-reveal>{ui.renovation.trustKicker}</p>
          <h3 data-reveal>{ui.renovation.trustHead}</h3>
          <p className="r-trust-line" data-reveal>{world.trust.line}</p>
        </div>
        <div className="r-framed">
          <Answers items={faq} />
          <Corners />
        </div>
      </section>

      <RenovationFooter service={service} onClose={onClose} onRequest={onRequest} onSwitch={onSwitch} />

      {openedSvc && (
        <ServiceSheet
          svc={openedSvc}
          onClose={() => setSheetId(null)}
          onRequest={() => onRequest('renovation', openedSvc.id)}
        />
      )}
    </WorldShell>
  )
}

/* ═══ The tape measure ════════════════════════════════════════════════
   Reading progress, as the ruler along the bottom edge of the header strip.

   It lives INSIDE the header on purpose. `--r-nav-h` is measured from that
   element, so the tape is counted in it and anything that offsets itself from
   the bar clears the tape as well, with nothing to remember.

   The scale is an inline SVG and not a repeating gradient: a hundred
   percentage stops land on fractions of a pixel, and a gradient paints those
   as ticks of uneven weight. `crispEdges` snaps each line to a whole pixel.

   Nothing here runs JavaScript. The marker and the run behind it read
   `--scrolled`, which the shell already writes on every scroll frame. */
const TICKS = Array.from({ length: 101 }, (_, i) => i)
const TENS = [10, 20, 30, 40, 50, 60, 70, 80, 90]

function Tape() {
  return (
    <div className="r-tape" aria-hidden="true">
      <div className="r-tape-in">
        <span className="r-tape-run" />
        <svg className="r-tape-scale" width="100%" height="100%" focusable="false">
          {TICKS.map((i) => {
            const kind = i % 10 === 0 ? 'is-ten' : i % 5 === 0 ? 'is-five' : ''
            /* Odd ticks are dropped on narrow screens, where a hundred of them
               would be under four pixels apart. */
            const odd = i % 2 ? 'is-odd' : ''
            return (
              <line
                key={i}
                className={`${kind} ${odd}`.trim() || undefined}
                x1={`${i}%`}
                x2={`${i}%`}
                y1="0"
                y2={kind === 'is-ten' ? 9 : kind === 'is-five' ? 6 : 3.5}
              />
            )
          })}
          {TENS.map((n) => (
            <text key={n} x={`${n}%`} dx="3" y="11.5">{n}</text>
          ))}
        </svg>
        <span className="r-tape-at" />
      </div>
    </div>
  )
}

/* ═══ Dimension mark ═════════════════════════════════════════════════
   The thin line with a slash at each end that a drawing uses to say how big
   something is. It stands in the gutter beside a section's heading block and
   measures it, and the figure on it is the section's number on this sheet
   (sheet 03, so 3.1 to 3.6). Decoration only: a screen reader never meets it. */
function Dim({ n }) {
  return (
    <span className="r-dim" aria-hidden="true">
      <b>{n}</b>
      <i />
    </span>
  )
}

/* ═══ Corner marks ═══════════════════════════════════════════════════
   Four small L shapes just outside a block, the way a detail is registered on
   a sheet. Each is two strokes that grow out of the corner, so the block looks
   pencilled in rather than faded in. */
function Corners() {
  return (
    <span className="r-corners" aria-hidden="true" data-draw>
      <i /><i /><i /><i />
    </span>
  )
}

/* ═══ The fork ═══════════════════════════════════════════════════════
   One building, drawn once, marked up three ways.

   ── Why this and not three panels in a row ───────────────────────────
   Three boxes side by side read as three stages, and these are three
   alternatives. Two things stop the misreading, and neither is a caption.

   The options run DOWN a scale labelled *less intervention* to *more*. This
   page draws process left-to-right — the numbered route does — so the
   vertical is the one axis here that has never meant time.

   And the three mark-up layers sit on ONE drawing and displace one another:
   you cannot see two at once, which is what "alternative" means. Steps
   coexist; alternatives compete for a single space. The building underneath
   never changes, because the thing being decided about is the same property.

   ── Why it does not sell the biggest job ─────────────────────────────
   Each layer marks a different DEPTH — envelope, then the fabric inside it,
   then the structure and the plan — rather than accumulating on the last one,
   so "and then also" has nowhere to start. And the note under the plate, which
   spans it and governs all three, is the source's own line: replace only as a
   last resort. The figure's last word is *last resort*. */
function Fork({ world }) {
  const [live, setLive] = useState('maintain')
  const uid = useId().replace(/:/g, '')

  return (
    <section className="r-fork" id="r-scenarios" data-scenario={live}>
      <div className="r-fork-inner">
        <div className="r-fork-head" data-draw>
          <Dim n="3.1" />
          <p className="world-kicker" data-reveal>{ui.renovation.decision}</p>
          <h3 data-reveal>{world.forkHead}</h3>
          <p className="world-lede" data-reveal>{world.forkLede}</p>
        </div>

        {/* One property in at the top, one plan out at the bottom. The foot bar
            is the load-bearing one: all three options land in the same place,
            and a sequence has no reason to re-join. */}
        <div className="r-fork-datum r-fork-datum--top">
          <p className="r-fork-dk">{world.forkTop.k}</p>
          <p className="r-fork-dv">{world.forkTop.v}</p>
          <p className="r-fork-dn">{world.forkTop.n}</p>
        </div>

        <div className="r-fork-choose">
          <p className="r-fork-lim" aria-hidden="true">{ui.renovation.less}</p>
          <fieldset className="r-fork-rail">
            <legend className="sr-only">{ui.renovation.chooseLegend}</legend>
            {world.scenarios.map((s) => (
              <label className="r-fork-opt" key={s.id}>
                <input
                  type="radio"
                  name={`${uid}-scenario`}
                  value={s.id}
                  checked={live === s.id}
                  onChange={() => setLive(s.id)}
                />
                <span className="r-fork-box">
                  <span className="r-fork-on">{s.n}</span>
                  <span className="r-fork-ok">{s.k}</span>
                  <span className="r-fork-od">{s.od}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <p className="r-fork-lim" aria-hidden="true">{ui.renovation.more}</p>
          <p className="r-fork-set">{world.forkSet}</p>
        </div>

        <figure className="r-fork-stage">
          <Section scenarios={world.scenarios} />
          <Corners />
        </figure>

        {/* All three panels occupy one grid cell, so the box is always as tall
            as the tallest and nothing below moves when the choice changes. */}
        <div className="r-fork-read">
          {world.scenarios.map((s) => (
            <div className="r-fork-panel" key={s.id} aria-hidden={s.id !== live}>
              <p className="r-fork-over">{fmt(ui.renovation.scenario, { k: s.k })}</p>
              <p className="r-fork-claim">{s.claim}</p>
              <p className="r-fork-body">{s.body}</p>
              <div className="r-fork-marks">
                <p className="r-fork-mh">{ui.renovation.marks}</p>
                <ul role="list">
                  {s.marks.map((m) => (
                    <li key={m.t}>
                      {m.t}
                      {/* A bracketed numeral on a drawing is a detail
                          reference — a citation, never a rank. It says only
                          which service the work is written under. */}
                      <span className="r-fork-ref">[{m.ref}]</span>
                      {m.st && (
                        <span className="r-fork-st">
                          {m.st}
                          <span className="sr-only">. {ui.renovation.qualifiedNote}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="r-fork-cav">{s.cav}</p>
            </div>
          ))}
        </div>

        <div className="r-fork-datum r-fork-datum--foot">
          <p className="r-fork-dk">{world.forkFoot.k}</p>
          <p className="r-fork-dv">{world.forkFoot.v}</p>
          <p className="r-fork-dn">{world.forkFoot.n}</p>
        </div>
      </div>
    </section>
  )
}

/* ── The drawing ──────────────────────────────────────────────────────
   A section through a four-storey block, in the sheet's own line weights:
   1px context, 1.4px fabric, 2.4px mark-up. `vector-effect: non-scaling-stroke`
   in the CSS keeps those literal device pixels at every rendered width.

   Everything repetitive is generated. Nine openings, fourteen ground ticks and
   six partitions written by hand would drift the first time one moved, and the
   three mark-up layers have to agree with the fabric exactly or the figure
   stops being one building. */
const BAYS = [224, 360, 496]        // opening centres
const LEVELS = [384, 308, 232]      // floor slab tops, ground up
const OPEN_W = 62
const OPEN_H = 40
const WALL_L = 150
const WALL_R = 570

/* No `live` prop: which layer shows is decided in CSS from `data-scenario` on
   the section, so this component draws all three every time and never needs to
   know which is current. That is also what makes the figure complete before
   any JavaScript runs. */
function Section({ scenarios }) {
  const openings = LEVELS.flatMap((L) => BAYS.map((x) => ({ x: x - OPEN_W / 2, y: L - 54 })))

  return (
    <svg className="r-fork-svg" viewBox="0 0 720 460" role="img"
         aria-labelledby="r-fork-title">
      <title id="r-fork-title">{ui.renovation.sectionTitle}</title>

      <defs>
        {/* Deep Brown, never sand: sand measures 1.77:1 on this ground and the
            hatch would simply not be there. */}
        <pattern id="r-fork-hatch" width="5" height="5"
                 patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0,0 V5" stroke="var(--fill-strong)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Context — never changes, never marked. */}
      <g className="r-fork-ctx">
        <path className="is-datum" d="M24,384 H696" />
        {Array.from({ length: 14 }, (_, i) => 60 + i * 48).map((x) => (
          <path key={x} d={`M${x},384 l-10,12`} />
        ))}
        <path d="M112,384 V210" strokeDasharray="4 6" />
        <path d="M608,384 V210" strokeDasharray="4 6" />
        <text x="26" y="376">{ui.renovation.datum}</text>
      </g>

      {/* Fabric — identical in all three states. The same building. */}
      <g className="r-fork-fab">
        <rect className="is-soft" x="142" y="394" width="436" height="34" />
        <rect className="is-solid" x={WALL_L} y="156" width="16" height="238" />
        <rect className="is-solid" x="554" y="156" width="16" height="238" />
        {LEVELS.map((y) => <rect key={y} x={WALL_L} y={y} width="420" height="10" />)}
        <polygon className="is-solid" points="138,163 360,71 582,163 570,156 360,84 150,156" />
        {openings.map((o) => (
          <g key={`${o.x}-${o.y}`}>
            <rect x={o.x} y={o.y} width={OPEN_W} height={OPEN_H} />
            <path d={`M${o.x + OPEN_W / 2},${o.y} V${o.y + OPEN_H}`} />
          </g>
        ))}
        <rect x="336" y="100" width="48" height="36" />
        {/* Non-load-bearing partitions get the lighter line — a real drawing
            convention, and they are what Transform cuts. */}
        {[292, 428].map((x) =>
          LEVELS.map((L) => (
            <rect className="is-part" key={`${x}-${L}`} x={x} y={L - 66} width="8" height="66" />
          )),
        )}
      </g>

      {/* ── Maintain · the envelope ─────────────────────────────────── */}
      <g className="r-fork-mk r-fork-mk--maintain">
        <polygon className="is-heavy" points="138,163 360,71 582,163 570,156 360,84 150,156" />
        <path className="is-heavy" d={`M${WALL_L},156 V394`} />
        <path className="is-heavy" d={`M${WALL_R},156 V394`} />
        <path className="is-heavy" d="M138,163 H582" />
        {openings.concat([{ x: 336, y: 100, w: 48, h: 36 }]).map((o, i) => (
          <rect className="is-heavy" key={i}
                x={o.x - 3} y={o.y - 3}
                width={(o.w || OPEN_W) + 6} height={(o.h || OPEN_H) + 6} />
        ))}
        <text className="r-fork-depth" x="596" y="118">{scenarios[0].depth}</text>
      </g>

      {/* ── Improve · the fabric inside it ──────────────────────────── */}
      <g className="r-fork-mk r-fork-mk--improve">
        <rect className="is-hatch" x="166" y="156" width="9" height="238" />
        <rect className="is-hatch" x="545" y="156" width="9" height="238" />
        <polygon className="is-hatch" points="150,156 360,84 570,156 570,166 360,96 150,166" />
        <rect className="is-hatch" x="166" y="374" width="388" height="10" />
        {openings.map((o) => (
          <rect className="is-glass" key={`g${o.x}-${o.y}`}
                x={o.x + 5} y={o.y + 5} width={OPEN_W - 10} height={OPEN_H - 10} />
        ))}
        {/* The riser sits in the pier BETWEEN bays, not through them.
            At x=470 it ran straight down the middle of the third bay's
            openings (which span 465-527) and crossed its own glazing marks;
            the gap between bay two and bay three is 391-465, so 450 is solid
            wall. The branches stop at 400 for the same reason — bay two's
            opening ends at 391. A services drawing that runs a duct through a
            window is not a services drawing. */}
        <path className="is-run" d="M450,378 V170" />
        {[351, 275, 199].map((y) => (
          <path className="is-run" key={y} d={`M450,${y} H400`} />
        ))}
        <text className="r-fork-depth" x="596" y="118">{scenarios[1].depth}</text>
      </g>

      {/* ── Transform · the structure and the plan ──────────────────── */}
      <g className="r-fork-mk r-fork-mk--transform">
        <rect className="is-cut" x="292" y="308" width="136" height="10" />
        <path className="is-cut" d="M292,308 L428,318 M428,308 L292,318" />
        {[292, 428].map((x) => (
          <g key={x}>
            <rect className="is-cut" x={x} y="242" width="8" height="66" />
            <path className="is-cut" d={`M${x},242 L${x + 8},308 M${x + 8},242 L${x},308`} />
          </g>
        ))}
        <rect className="is-cut" x="310" y="318" width="100" height="66" />
        {/* The added volume is drawn as an ADDITION, not as a removal. It was
            dashed in the same notation as the demolished slab and the X'd
            partitions, which said the roof was being taken away — the opposite
            of "Extension". New work gets a solid outline and a light fill;
            dashed-and-crossed stays reserved for what is removed. */}
        <rect className="is-add" x="150" y="116" width="420" height="40" />
        <text className="r-fork-depth" x="596" y="118">{scenarios[2].depth}</text>
      </g>
    </svg>
  )
}

/* ═══ The schedule of works ═══════════════════════════════════════════
   Nine services as nine cards, and one popup for whichever is opened.

   ── What this replaced ───────────────────────────────────────────────
   All sixty-five works printed on one ruled sheet with an index rail beside
   it. It was faithful to a real schedule of works and it was four screens of
   small type, which is a document and not a page. The sixty-five lines still
   exist, word for word: nine at a time in the popups, and all together in the
   downloadable brochures.

   ── The condition still travels with the work ────────────────────────
   Twelve works carry a condition, and that has to stay visible wherever the
   work is named, because an unmarked regulated work reads as something ORYX
   simply does. Every conditional work carries its tag in the popup, all eight
   under service 08 included, and the line under the grid says what no tag
   means. No status is invented for any service: the source assigns an
   explicit label to service 08 alone. */
const CONDS = ui.renovation.conds

function Schedule({ onOpen }) {
  const uid = useId().replace(/:/g, '')

  return (
    <section className="r-sched" id="r-schedule" aria-labelledby={`${uid}-h`}>
      <div className="r-sched-head" data-reveal data-draw>
        <Dim n="3.2" />
        <p className="world-kicker">{ui.renovation.schedKicker}</p>
        <h3 id={`${uid}-h`}>{ui.renovation.schedHead}</h3>
        <p className="world-lede">{ui.renovation.schedLede}</p>
      </div>

      {/* `data-draw` is what lets the nine pictures develop like a print as the
          grid arrives. See `useSheetLife`. */}
      <ul className="cards" role="list" data-reveal data-draw>
        {svcs.map((s) => {
          const img = cardImage(`renovation/${s.id}`)
          return (
            <li key={s.id}>
              <button type="button" className="card" onClick={() => onOpen(s.id)} aria-haspopup="dialog">
                <span className="card-img">
                  {img && <img src={img.src} alt="" loading="lazy" />}
                  <span className="card-n">{s.no}</span>
                  <span className="card-i"><Icon name={s.id} size={20} /></span>
                </span>
                <span className="card-body">
                  <span className="card-k">{s.name}</span>
                  <span className="card-c">
                    {plural(s.works.length, ui.renovation.works)}
                    {s.cond && <span className="card-tag"> / {CONDS[s.cond].k}</span>}
                  </span>
                  <span className="card-go"><span>{ui.common.view}</span><Icon name="arrow" size={14} /></span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="cards-note" data-reveal>
        {fmt(ui.renovation.cardsNote, { services: totals.services, works: totals.works, marked: totals.conditional })}
      </p>

    </section>
  )
}

function ServiceSheet({ svc, onClose, onRequest }) {
  const img = cardImage(`renovation/${svc.id}`)
  const used = [...new Set(svc.works.map((w) => w.s || svc.cond).filter(Boolean))]

  return (
    <Sheet
      tone="renovation"
      label={svc.name}
      image={img}
      onClose={onClose}
      actions={
        <>
          {/* The link first and the button last, on purpose. The focus trap
              wraps on the last control, and Safari does not tab to links by
              default, so a link in last place let Tab walk out of the popup. */}
          <a className="btn" {...brochure(`renovation-${svc.id}`)}>
            <Icon name="download" size={16} /> {ui.common.downloadBrochure}
          </a>
          <button type="button" className="btn btn--fill" onClick={onRequest}>
            {ctaFor('renovation')} <Icon name="arrow" size={16} />
          </button>
        </>
      }
    >
      <div className="sheet-head">
        <span className="sheet-badge"><Icon name={svc.id} size={24} /></span>
        <ul className="sheet-stats" role="list">
          <li><b>{svc.no}</b>{fmt(ui.renovation.of, { n: String(totals.services).padStart(2, '0') })}</li>
          <li><b>{svc.works.length}</b>{plural(svc.works.length, ui.renovation.worksWord)}</li>
        </ul>
      </div>
      <p className="sheet-lede">{svc.sub}</p>

      <h4 className="sheet-h">{ui.renovation.covers}</h4>
      <ul className="sheet-works" role="list">
        {svc.works.map((w) => {
          /* A service-level condition applies to every work under it. */
          const cond = w.s || svc.cond
          return (
            <li className="sheet-work" key={w.t}>
              <Icon name="check" size={16} />
              <span className="sheet-work-k">{w.t}</span>
              <span className="sheet-work-d">{w.d}</span>
              {cond && <span className="sheet-work-tag">{CONDS[cond].k}</span>}
            </li>
          )
        })}
      </ul>

      {used.map((c) => (
        <p className="sheet-note" key={c}><b>{CONDS[c].k}.</b> {CONDS[c].d}</p>
      ))}
      {svc.note && <p className="sheet-note">{svc.note}</p>}
    </Sheet>
  )
}

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

  /* ── The slider shows itself ───────────────────────────────────────
     A before/after that sits still looks like a photograph with a line on it.
     So the first time it is properly on screen the handle leans once to each
     side and comes back to where it started, about 1.6 seconds in all, and
     then never again.

     `at` is React state, so the nudge animates that state and not a CSS
     property: the image clip, the handle and the range input all read the one
     value and cannot disagree. The latest value is mirrored into a ref so the
     nudge starts from wherever the handle really is.

     It gives way at once. A touch, a drag, focus or a key press cancels it
     mid-swing and leaves the handle where the visitor put it. Under reduced
     motion it is not set up at all. */
  const atNow = useRef(at)
  atNow.current = at
  const nudge = useRef({ raf: 0, timer: 0, guard: 0, io: null, spent: false })

  const stopNudge = useCallback(() => {
    const n = nudge.current
    n.spent = true
    if (n.raf) cancelAnimationFrame(n.raf)
    if (n.timer) clearTimeout(n.timer)
    if (n.guard) clearTimeout(n.guard)
    n.io?.disconnect()
    n.raf = 0
    n.timer = 0
    n.guard = 0
    n.io = null
  }, [])

  useEffect(() => {
    const el = box.current
    const n = nudge.current
    if (!el || n.spent) return
    const scroller = el.closest('.world-scroll')
    if (!scroller || typeof IntersectionObserver !== 'function') return
    if (el.closest('.world')?.classList.contains('is-still')) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const run = () => {
      n.timer = 0
      const from = atNow.current
      /* Nine points each way, less if the handle is parked near an edge, so
         the swing is always symmetrical and always lands back on `from`. */
      const amp = Math.max(0, Math.min(9, from, 100 - from))
      let t0 = 0
      const step = (now) => {
        if (!t0) t0 = now
        const t = Math.min(1, (now - t0) / 1600)
        /* Eased time through one full sine: out to the right, back through
           the start, out to the left, home. The ease gives it a standing
           start and a soft landing, which a bare sine does not have. A sine
           ease and not a cubic one: cubic bunches both peaks into the middle
           and the swing across becomes a flick, while this puts them at one
           third and two thirds of the way. */
        const u = (1 - Math.cos(Math.PI * t)) / 2
        if (t < 1) {
          setAt(from + amp * Math.sin(u * Math.PI * 2))
          n.raf = requestAnimationFrame(step)
        } else {
          n.raf = 0
          setAt(from)
        }
      }
      n.raf = requestAnimationFrame(step)
      /* Frames stop arriving in a tab that is not being painted, and the swing
         would then sit wherever it had got to. A plain timer still fires there,
         so it takes the handle home if the frames never finish the job. */
      n.guard = setTimeout(() => {
        n.guard = 0
        if (!n.raf) return
        cancelAnimationFrame(n.raf)
        n.raf = 0
        setAt(from)
      }, 2100)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || n.spent) return
        io.disconnect()
        n.io = null
        n.spent = true
        /* A beat after it arrives, so the nudge is not lost under the
           section's own entrance. */
        n.timer = setTimeout(run, 500)
      },
      { root: scroller, threshold: 0.5 },
    )
    n.io = io
    io.observe(el)

    return () => {
      io.disconnect()
      if (n.raf) cancelAnimationFrame(n.raf)
      if (n.timer) clearTimeout(n.timer)
      if (n.guard) clearTimeout(n.guard)
      n.raf = 0
      n.timer = 0
      n.guard = 0
      n.io = null
    }
  }, [])

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
        stopNudge()
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e.clientX)
      }}
      onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && onPointerMove(e)}
    >
      <img className="r-scrub-after" src={after.src} alt={after.alt || ui.renovation.afterAlt} loading="lazy" />
      <div className="r-scrub-before-wrap" aria-hidden="true">
        <img className="r-scrub-before" src={before.src} alt="" loading="lazy" />
      </div>

      <span className="r-scrub-tag r-scrub-tag--before" aria-hidden="true">{ui.renovation.before}</span>
      <span className="r-scrub-tag r-scrub-tag--after" aria-hidden="true">{ui.renovation.after}</span>

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
        onChange={(e) => {
          stopNudge()
          setAt(Number(e.target.value))
        }}
        /* Focus and keys belong to the visitor from the first moment. */
        onFocus={stopNudge}
        onKeyDown={stopNudge}
        aria-label={ui.renovation.reveal}
      />
    </div>
  )
}

/* ═══ The works programme ════════════════════════════════════════════
   The seven steps as a programme chart, the drawing a contractor hands a
   client: each step a bar that starts a little after the one before it and
   steps down the sheet. At rest a step is its number and its name; the
   sentence about it opens on tap, or on hover where there is a pointer.

   The list keeps the `r-steps` class and each bar keeps the `r-step-mark`,
   because that is what `useSheetLife` ticks off as the visitor scrolls. */
function Programme({ steps }) {
  const [open, setOpen] = useState(null)
  const uid = useId().replace(/:/g, '')
  return (
    <ol className="r-steps r-prog" role="list" style={{ '--n': steps.length }}>
      {steps.map((st, i) => {
        const isOpen = open === i
        /* `data-open`, never a class: the reveal system adds `is-in` to this
           element from outside React, and a React-written className would wipe
           it and hide the row for good. The same goes for the client tiles and
           the answers below. */
        return (
          <li key={st.n} data-reveal style={{ '--i': i }} data-open={isOpen ? '' : undefined}>
            <button
              type="button"
              className="r-prog-btn"
              aria-expanded={isOpen}
              aria-controls={`${uid}-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="r-step-n">{st.n}</span>
              <span className="r-step-k">{st.k}</span>
              <span className="r-prog-track" aria-hidden="true">
                <span className="r-prog-bar" />
                <span className="r-step-mark">
                  <i className="r-step-brush" />
                  <svg className="r-step-tick" viewBox="0 0 24 24" focusable="false">
                    <path d="M3.5 12 C6 14 8 16.5 9.5 19 C12 13 15.5 8 20.5 4" pathLength="1" />
                  </svg>
                </span>
              </span>
              <Icon name="chevron" size={14} className="r-prog-chev" />
            </button>
            <div className="r-step-d" id={`${uid}-${i}`} aria-hidden={!isOpen}>
              <p>{st.d}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/* The ORYX mark as a vector, traced from `public/mark.png` and scaled into a
   box 41.6 wide and 100 high, so a drawing can place it with one transform
   and fill it in its own ink. */
const MARK_D = 'M38.84 2.96c-.04 5.3-.65 11.7-1.98 20.96c-.33 2.44-.61 4.45-.57 4.47c.04 .04 1.26-1.24 2.72-2.83l2.64-2.88l-.11-3.53c-.18-5.32-.96-11.26-2.14-16.38l-.54-2.31l-.02 2.5zM2 3.92c-1.29 5.93-1.77 9.7-1.94 14.9l-.11 3.57l.55 .59c.31 .33 1.5 1.76 2.64 3.18c2 2.48 2.09 2.55 1.98 1.85c-1.18-7.58-2.16-17.23-2.31-22.98l-.13-4.33l-.68 3.22zM.18 25.14c0 .78 .65 8.04 .94 10.55l.22 1.79l4.25 4.12c2.35 2.27 4.2 3.97 4.1 3.77c-1.07-2.57-2.99-8.96-3.7-12.37c-.5-2.46-.41-2.29-3.25-5.56c-.89-1.02-1.81-2.11-2.09-2.4l-.46-.55l-.02 .65zM39.74 26.75c-3.86 4.23-4.01 4.44-4.16 5.38c-.24 1.61-1.72 7.13-2.81 10.41l-1.07 3.25l1.77-1.59c.98-.87 2.87-2.55 4.2-3.72c1.33-1.16 2.46-2.22 2.51-2.35c.24-.55 1.55-13.11 1.37-13.27c-.04-.02-.85 .81-1.81 1.89zM1.85 40.33c0 .52 1.81 7.45 2.5 9.57c.92 2.83 .94 2.88 4.51 6.23c7.86 7.43 7.89 7.47 6.97 5.64c-.35-.7-3.25-8.19-4.18-10.85c-.92-2.62-.76-2.38-3.92-5.4c-4.2-3.97-5.88-5.47-5.88-5.19zM36.41 43.53c-4.81 4.23-5.77 5.29-6.28 6.86c-.61 1.85-3.18 8.74-4.05 10.87c-.43 1.02-.76 1.89-.76 1.94c0 .06 .52-.41 1.16-1.04c.63-.61 2.85-2.62 4.94-4.47c4.79-4.25 5.19-4.73 5.99-7.23c1.05-3.27 2.62-9.82 2.35-9.78c-.06 0-1.57 1.29-3.35 2.85zM6.82 57.12c2.94 7.62 6.67 14.03 12.09 20.74c1.98 2.46 2.98 3.62 6.3 7.28l1.02 1.13l-3.05 3.25l-3.07 3.27l-1.4-1.15c-.78-.63-2.72-2.24-4.29-3.57c-3.94-3.35-3.7-3.29-5.43-1.37c-1.79 2-1.72 2.18 2.33 5.73c1.55 1.37 3.86 3.48 5.14 4.7c3.66 3.51 3.7 3.51 6.51 .43c2-2.22 4.79-5.01 8.24-8.28c1.35-1.28 2.44-2.44 2.44-2.61c0-.54-1-1.77-4.18-5.19c-1.76-1.87-3.51-3.77-3.92-4.27l-.76-.87l1.11-1.98c.63-1.07 1.68-2.79 2.37-3.83c2.59-3.84 7.97-14.81 6.99-14.21c-.65 .39-10.57 9.26-11.11 9.91c-.33 .43-1.13 1.66-1.76 2.75c-.65 1.11-1.24 2.03-1.31 2.09c-.22 .13-1.31-1.26-2.05-2.59c-1-1.81-1.13-1.98-5.4-5.84c-2.26-2.05-4.82-4.45-5.73-5.32l-1.61-1.59l.54 1.39z'

/* The Property Passport as a booklet with tabbed pages: what goes in it,
   written on the tabs. Decorative; the caption beside it carries the words. */
const PASSPORT_TABS = ui.renovation.passportTabs
function Passport() {
  return (
    <svg className="r-draw r-draw--passport" viewBox="0 0 300 200" aria-hidden="true" focusable="false">
      <g className="r-draw-ink">
        {[0, 1, 2].map((k) => (
          <rect key={k} x={40 + k * 6} y={26 - k * 6} width="150" height="150" className="r-draw-page" />
        ))}
        <rect x="52" y="14" width="150" height="150" className="r-draw-cover" />
        <path d={MARK_D} transform="translate(116.6 44) scale(0.5)" className="r-draw-mark" />
        <text x="127" y="112" textAnchor="middle" className="r-draw-t">{ui.renovation.passport[0]}</text>
        <text x="127" y="126" textAnchor="middle" className="r-draw-t">{ui.renovation.passport[1]}</text>
        {/* The Dutch name, under the title in every language but Dutch,
            where the title already is it. */}
        {ui.renovation.passport.join('').toUpperCase() !== 'OBJECTPASPOORT' && (
          <text x="127" y="146" textAnchor="middle" className="r-draw-s">OBJECTPASPOORT</text>
        )}
      </g>
      <g className="r-draw-tabs">
        {PASSPORT_TABS.map((t, i) => (
          <g key={t} transform={`translate(202 ${20 + i * 20})`}>
            <path d="M0 0 h72 v16 h-72 z" className="r-draw-tab" />
            <text x="8" y="11" className="r-draw-tab-t">{t}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

/* The Disruption Meter as a scale drawn on paper: who is affected down the
   side, the four phases across the top, and a hand-drawn level in each cell.
   The levels are an illustration of the idea and say so. The source approves
   the name and forbids presenting it as software, so nothing here is a gauge,
   a needle or a number. */
const METER_ROWS = ui.renovation.meterRows
const METER_LEVELS = [
  [1, 2, 3, 1],
  [1, 1, 3, 2],
  [2, 2, 3, 1],
]
function Meter({ phases = [] }) {
  const cols = phases.slice(0, 4)
  const x0 = 100, cw = 60, y0 = 46, rh = 34
  return (
    <svg className="r-draw r-draw--meter" viewBox="0 0 360 200" aria-hidden="true" focusable="false">
      <g className="r-draw-ink">
        <rect x="18" y="14" width="330" height="158" className="r-draw-sheet" />
        {cols.map((p, c) => (
          <text key={p} x={x0 + c * cw + cw / 2} y="36" textAnchor="middle" className="r-draw-s">{p.toUpperCase()}</text>
        ))}
        {METER_ROWS.map((r, i) => (
          <g key={r}>
            <text x="28" y={y0 + i * rh + 21} className="r-draw-s">{r.toUpperCase()}</text>
            <path d={`M${x0} ${y0 + i * rh + 30} H${x0 + cols.length * cw}`} className="r-draw-rule" />
            {cols.map((p, c) => {
              const lvl = METER_LEVELS[i]?.[c] ?? 1
              return Array.from({ length: lvl }, (_, k) => (
                <rect key={k} x={x0 + c * cw + 12 + k * 12} y={y0 + i * rh + 8} width="8" height="16" className={`r-draw-lvl r-draw-lvl--${lvl}`} />
              ))
            })}
          </g>
        ))}
        <text x="28" y="164" className="r-draw-s r-draw-note">{ui.renovation.meterNote}</text>
      </g>
    </svg>
  )
}

/* Six tiles for the six kinds of client. Icon and name at rest; the sentence
   about them slides up over the tile on tap, or on hover where there is a
   pointer. The icon for each is matched by position in the source list. */
const CLIENT_ICONS = ['building', 'people', 'civic', 'office', 'property', 'heritage']
function Clients({ items }) {
  const [open, setOpen] = useState(null)
  const uid = useId().replace(/:/g, '')
  return (
    <ul className="r-clients" role="list">
      {items.map((c, i) => {
        const isOpen = open === i
        return (
          <li key={c.k} data-reveal style={{ '--i': i }} data-open={isOpen ? '' : undefined}>
            <button
              type="button"
              className="r-client"
              aria-expanded={isOpen}
              aria-controls={`${uid}-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="r-client-i"><Icon name={CLIENT_ICONS[i] || 'building'} size={24} /></span>
              <span className="r-client-k">{c.k}</span>
              <span className="r-client-more">{isOpen ? ui.renovation.close : ui.renovation.clientMore}</span>
            </button>
            <div className="r-client-d" id={`${uid}-${i}`} aria-hidden={!isOpen}>
              <p>{c.d}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* The five questions, one open at a time. The first is open on arrival so the
   block does not read as empty. The answers are the approved wording. */
function Answers({ items }) {
  const [open, setOpen] = useState(0)
  const uid = useId().replace(/:/g, '')
  return (
    <div className="r-faq">
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={f.q} data-reveal style={{ '--i': i }} className="r-q" data-open={isOpen ? '' : undefined}>
            <h4>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${uid}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{f.q}</span>
                <Icon name="chevron" size={16} />
              </button>
            </h4>
            <div className="r-a" id={`${uid}-${i}`} aria-hidden={!isOpen}>
              <p>{f.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * The title block.
 *
 * The bottom corner of every construction drawing carries one of these, and
 * reproducing it makes the footer the most recognisable object on the page —
 * neither of the other two services could borrow it. Above it sits the intake
 * the source says every route on the site should end at, and the cross-link to
 * Workforce that keeps the two offers from blurring.
 */
function RenovationFooter({ service, onClose, onRequest, onSwitch }) {
  const year = new Date().getFullYear()
  return (
    <footer className="r-foot">
      <div className="r-foot-ask">
        <h3>{service.world.prompt}</h3>
        {/* The source's own intake, and the six fields it asks for. The line
            this replaced promised "the date the building comes back into
            service", which is a delivery-date commitment made before anyone
            has seen the property — and the gate blocks exactly that class of
            claim. */}
        <p>{service.world.check.d}</p>
        <button type="button" className="r-foot-cta" onClick={() => onRequest(service.id)}>
          {ctaFor(service.id)} <i aria-hidden="true"><Icon name="arrow" size={16} /></i>
        </button>

        {/* The separation the source requires, stated where somebody who has
            read the whole schedule and wants the other thing will find it. */}
        <div className="r-cross">
          <p className="r-cross-k">{service.world.cross.k}</p>
          <p className="r-cross-d">{service.world.cross.d}</p>
          {onSwitch && (
            <button type="button" className="r-cross-go" onClick={() => onSwitch('workforce')}>
              {service.world.cross.cta} <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* The title block itself. */}
      <div className="r-titleblock">
        <div className="r-tb-row">
          <dl className="r-tb-cell r-tb-wide">
            <dt>{ui.renovation.tb.client}</dt>
            {/* Terse, the way a real title block is. The six groups are named
                in full in the Clients section. */}
            <dd>{ui.renovation.tb.clientD}</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>{ui.renovation.tb.discipline}</dt>
            <dd>{ui.renovation.tb.disciplineD}</dd>
          </dl>
        </div>
        <div className="r-tb-row">
          <dl className="r-tb-cell">
            <dt>{ui.renovation.tb.drawn}</dt>
            <dd>{ui.renovation.unit}</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>{ui.renovation.tb.checked}</dt>
            <dd>{ui.renovation.tb.checkedD}</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>{ui.renovation.tb.date}</dt>
            <dd>{year}</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>{ui.renovation.tb.sheet}</dt>
            <dd>03 / 03</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>{ui.renovation.tb.rev}</dt>
            <dd>C</dd>
          </dl>
        </div>
        <div className="r-tb-row">
          <dl className="r-tb-cell r-tb-wide">
            <dt>{ui.renovation.tb.project}</dt>
            <dd>{ui.renovation.tb.projectD}</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>{ui.renovation.tb.contact}</dt>
            <dd><a href={`mailto:${emailFor('renovation')}`}>{emailFor('renovation')}</a></dd>
          </dl>
        </div>
      </div>

      <div className="r-foot-end">
        <button type="button" className="r-foot-back" onClick={onClose}>
          <Icon name="back" size={16} /> {ui.common.allServices}
        </button>
        <Social />
      </div>
    </footer>
  )
}
