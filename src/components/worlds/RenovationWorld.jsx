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
export default function RenovationWorld({ service, onClose, onRequest }) {
  const { world } = service
  const shots = gallery[service.id] || []
  const nav = useMeasured('--r-nav-h')

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
        <button type="button" className="r-nav-cell r-nav-mark" onClick={onClose}>
          <i aria-hidden="true" />
          <span>
            <b>ORYX Projects</b>
            <em>Return to group</em>
          </span>
        </button>

        <nav className="r-nav-cell r-nav-links" aria-label="Renovation sections">
          <a href="#r-scenarios">Decision</a>
          <a href="#r-schedule">Schedule</a>
          <a href="#r-route">Route</a>
          <a href="#r-trust">Trust</a>
        </nav>

        <div className="r-nav-cell r-nav-sound">
          <SoundToggle bare />
        </div>

        <dl className="r-nav-cell r-nav-meta">
          <div><dt>Sheet</dt><dd>03</dd></div>
          <div><dt>Services</dt><dd>{String(totals.services).padStart(2, '0')}</dd></div>
          <div><dt>Works</dt><dd>{totals.works}</dd></div>
        </dl>
      </header>

      {/* ── Opening ───────────────────────────────────────────────────── */}
      <header className="r-open">
        <Media clip={film.renovation} />
        <div className="r-open-copy">
          <p className="world-eyebrow" data-reveal>
            {service.index} / {service.title}
          </p>
          <h2 data-reveal>
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
      <Schedule onRequest={onRequest} />

      {/* ── The scrub ─────────────────────────────────────────────────
          The one claim on this page a visitor can check by hand. */}
      <section className="r-scrub-block">
        <div className="r-scrub-intro">
          <p className="world-kicker" data-reveal>Before, and after</p>
          <p className="world-lede" data-reveal>{world.lede}</p>
        </div>
        <Scrub before={shots[0]} after={shots[2]} />
        {/* Said on the page, not only in a code comment. The pair is a matched
            illustration made to the brief, not a photograph of an ORYX
            project — and a before/after slider is read as evidence, which is
            precisely what it must not be until a real job has been shot. The
            source's gate says the same thing about client cases: consent,
            accuracy and publication period first, anonymised until then. */}
        <p className="r-scrub-note" data-reveal>
          Illustration of a typical scope, not a photograph of a completed ORYX
          project. Project photographs follow once clients give written consent.
        </p>
      </section>

      {/* ── The route ─────────────────────────────────────────────────
          Seven steps. The claim the source makes about them is the part worth
          printing: the route does not change with the service — only the scope
          of step three does. That is what makes it a route rather than a list
          of things that happen to be done. */}
      <section className="r-process" id="r-route">
        <div className="r-process-head">
          <p className="world-kicker" data-reveal>How a project runs</p>
          <h3 data-reveal>Seven steps on every project</h3>
          <p className="world-lede" data-reveal>{world.routeLine}</p>
        </div>
        <ol className="r-steps" role="list">
          {route.map((s, i) => (
            <li key={s.n} data-reveal style={{ '--i': i }}>
              <span className="r-step-n">{s.n}</span>
              <span className="r-step-k">{s.k}</span>
              <span className="r-step-d">{s.d}</span>
            </li>
          ))}
        </ol>

        {/* The two named methods. Named, described, and explicitly not sold as
            software — the source permits the names and forbids the product. */}
        <div className="r-tools">
          {tools.map((t) => (
            <div className="r-tool" key={t.k} data-reveal>
              <p className="r-tool-k">{t.k}</p>
              <p className="r-tool-nl">In Dutch: {t.nl}</p>
              <p className="r-tool-d">{t.d}</p>
            </div>
          ))}
          <p className="r-tools-note">{world.toolsNote}</p>
        </div>
      </section>

      {/* ── Who arrives, and what they ask ────────────────────────────── */}
      <section className="r-who">
        <div className="r-who-head">
          <p className="world-kicker" data-reveal>Clients</p>
          <h3 data-reveal>Who we work for</h3>
        </div>
        <ul className="r-clients" role="list">
          {clients.map((c, i) => (
            <li key={c.k} data-reveal style={{ '--i': i }}>
              <span className="r-client-k">{c.k}</span>
              <span className="r-client-d">{c.d}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Trust ─────────────────────────────────────────────────────
          The publication discipline, stated as the page's own rule rather than
          as an apology, and then the FAQ — which the source describes as
          "answers written to close the gap between promise and evidence".
          Every one of them narrows a claim, which is precisely why they can be
          published while the claims matrix is still open. */}
      <section className="r-trust" id="r-trust">
        <div className="r-trust-say">
          <p className="world-kicker" data-reveal>What we promise</p>
          <p className="r-trust-line" data-reveal>{world.trust.line}</p>
          <p className="r-trust-d" data-reveal>{world.trust.d}</p>
        </div>
        <dl className="r-faq">
          {faq.map((f, i) => (
            <div key={f.q} data-reveal style={{ '--i': i }}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <RenovationFooter service={service} onClose={onClose} onRequest={onRequest} />
    </WorldShell>
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
        <div className="r-fork-head">
          <p className="world-kicker" data-reveal>The decision</p>
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
          <p className="r-fork-lim" aria-hidden="true">Less intervention</p>
          <fieldset className="r-fork-rail">
            <legend className="sr-only">
              Choose a scenario. These are three alternatives for the same
              property, not three stages of one job. One is chosen, and the
              other two are not done afterwards.
            </legend>
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
          <p className="r-fork-lim" aria-hidden="true">More intervention</p>
          <p className="r-fork-set">{world.forkSet}</p>
        </div>

        <figure className="r-fork-stage">
          <Section scenarios={world.scenarios} />
        </figure>

        {/* All three panels occupy one grid cell, so the box is always as tall
            as the tallest and nothing below moves when the choice changes. */}
        <div className="r-fork-read">
          {world.scenarios.map((s) => (
            <div className="r-fork-panel" key={s.id} aria-hidden={s.id !== live}>
              <p className="r-fork-over">Scenario: {s.k}</p>
              <p className="r-fork-claim">{s.claim}</p>
              <p className="r-fork-body">{s.body}</p>
              <div className="r-fork-marks">
                <p className="r-fork-mh">What the drawing marks</p>
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
                          <span className="sr-only">
                            . Carried out or supervised by a qualified
                            specialist where required.
                          </span>
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

      {/* Outside the plate and spanning it, so it visibly governs all three. */}
      <div className="r-fork-note">
        <p>{world.forkNote}</p>
        <p className="r-fork-nk">{world.forkNoteKey}</p>
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
      <title id="r-fork-title">
        Section through a four-storey block. Maintain marks the outer envelope;
        Improve marks the fabric inside it; Transform marks the structure and
        the plan itself. The building drawn is the same in all three.
      </title>

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
        <text x="26" y="376">DATUM</text>
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
const CONDS = {
  project: { k: 'Project basis', d: 'Confirmed for each project after property, risk, partner and qualification checks.' },
  qualified: { k: 'Qualified specialist', d: 'Carried out or supervised by a qualified specialist where required.' },
}

function Schedule({ onRequest }) {
  const [openId, setOpenId] = useState(null)
  const uid = useId().replace(/:/g, '')
  const cur = svcs.find((s) => s.id === openId) || null

  return (
    <section className="r-sched" id="r-schedule" aria-labelledby={`${uid}-h`}>
      <div className="r-sched-head" data-reveal>
        <p className="world-kicker">Schedule of works</p>
        <h3 id={`${uid}-h`}>Nine services</h3>
        <p className="world-lede">
          Open a service to see the work it covers.
        </p>
      </div>

      <ul className="cards" role="list" data-reveal>
        {svcs.map((s) => {
          const img = cardImage(`renovation/${s.id}`)
          return (
            <li key={s.id}>
              <button type="button" className="card" onClick={() => setOpenId(s.id)} aria-haspopup="dialog">
                <span className="card-img">
                  {img && <img src={img.src} alt="" loading="lazy" />}
                  <span className="card-n">{s.no}</span>
                  <span className="card-i"><Icon name={s.id} size={20} /></span>
                </span>
                <span className="card-body">
                  <span className="card-k">{s.name}</span>
                  <span className="card-c">
                    {s.works.length} works
                    {s.cond && <span className="card-tag"> / {CONDS[s.cond].k}</span>}
                  </span>
                  <span className="card-go"><span>View</span><Icon name="arrow" size={14} /></span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="cards-note" data-reveal>
        {totals.services} services and {totals.works} works in all. ORYX organises
        delivery of every work. {totals.conditional} of them are marked, because they
        are confirmed for each project or carried out by a qualified specialist.
      </p>

      {cur && (
        <ServiceSheet
          svc={cur}
          onClose={() => setOpenId(null)}
          onRequest={() => onRequest('renovation', cur.id)}
        />
      )}
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
          <a className="btn" href={`/brochures/renovation-${svc.id}.pdf`} download>
            <Icon name="download" size={16} /> Download brochure
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
          <li><b>{svc.no}</b>of {String(totals.services).padStart(2, '0')}</li>
          <li><b>{svc.works.length}</b>works</li>
        </ul>
      </div>
      <p className="sheet-lede">{svc.sub}</p>

      <h4 className="sheet-h">What it covers</h4>
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
 * The title block.
 *
 * The bottom corner of every construction drawing carries one of these, and
 * reproducing it makes the footer the most recognisable object on the page —
 * neither of the other two services could borrow it. Above it sits the intake
 * the source says every route on the site should end at, and the cross-link to
 * Workforce that keeps the two offers from blurring.
 */
function RenovationFooter({ service, onClose, onRequest }) {
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
        </div>
      </div>

      {/* The title block itself. */}
      <div className="r-titleblock">
        <div className="r-tb-row">
          <dl className="r-tb-cell r-tb-wide">
            <dt>Client</dt>
            {/* Terse, the way a real title block is. The six groups are named
                in full in the Clients section. */}
            <dd>Housing, public sector, commercial and heritage property</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>Discipline</dt>
            <dd>Maintenance, renovation and heritage restoration</dd>
          </dl>
        </div>
        <div className="r-tb-row">
          <dl className="r-tb-cell">
            <dt>Drawn</dt>
            <dd>ORYX Projects</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>Checked</dt>
            <dd>Contracts</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>Date</dt>
            <dd>{year}</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>Sheet</dt>
            <dd>03 / 03</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>Rev</dt>
            <dd>C</dd>
          </dl>
        </div>
        <div className="r-tb-row">
          <dl className="r-tb-cell r-tb-wide">
            <dt>Project</dt>
            <dd>ORYX Projects, a service of ORYX GROUP</dd>
          </dl>
          <dl className="r-tb-cell">
            <dt>Contact</dt>
            <dd><a href={`mailto:${emailFor('renovation')}`}>{emailFor('renovation')}</a></dd>
          </dl>
        </div>
      </div>

      <div className="r-foot-end">
        <button type="button" className="r-foot-back" onClick={onClose}>
          <Icon name="back" size={16} /> All ORYX services
        </button>
        <Social />
      </div>
    </footer>
  )
}
