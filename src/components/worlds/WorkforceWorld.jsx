import { useRef, useState } from 'react'
import WorldShell, { Media } from './WorldShell'
import { useSmoothProgress } from '../../lib/useReveal'
import { film, portal, gallery } from '../../content/media'

/**
 * Workforce — "The Roster."
 *
 * Staffing is measured in shifts and people, so the page is built out of both.
 * Its spine is a timetable: the day runs down the left in real clock times and
 * each block is a section. Its second device is a crew grid that assembles
 * badge by badge as you scroll — people arriving, which is literally the
 * service being described.
 *
 * Where Transport moves sideways along a line, this page stacks and fills in
 * place. Nothing here travels; things turn up.
 */
export default function WorkforceWorld({ service, onClose, onRequest }) {
  const { world } = service
  const shots = gallery[service.id] || []

  return (
    <WorldShell service={service} onClose={onClose}>
      {/* ── Its own navigation ────────────────────────────────────────
          A site board, not a masthead. It was an editorial header — tall,
          centred, serif, scrolling away — which suited a magazine and not a
          page about crews and shift patterns. Sticky, because this is a tool:
          you should be able to reach any domain from anywhere in it. */}
      <header className="w-nav">
        <div className="w-nav-inner">
          <button type="button" className="w-nav-mark" onClick={onClose}>
            <i aria-hidden="true" />
            <span className="w-nav-word">ORYX</span>
            <span className="w-nav-unit">Workforce</span>
          </button>

          <nav className="w-nav-links" aria-label="Workforce sections">
            <a href="#w-sectors">Sectors</a>
            <a href="#w-levels">Levels</a>
            <a href="#w-solutions">Solutions</a>
            <a href="#w-shift">Shift</a>
            <a href="#w-cover">Cover</a>
            <a href="#w-compliance">Compliance</a>
          </nav>

          <button type="button" className="w-nav-cta" onClick={onRequest}>
            Request crew
          </button>
        </div>
      </header>

      {/* ── Opening ───────────────────────────────────────────────────── */}
      <header className="w-open">
        <Media clip={film.workforce} />
        <div className="w-open-copy">
          <p className="world-eyebrow" data-reveal>
            {service.index} · {service.title}
          </p>
          <h2 data-reveal>
            {world.headline.split('\n').map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="world-promise" data-reveal>{service.promise}</p>
        </div>

        {/* The same idea as Transport's manifest: four facts a site manager
            would ask for, before any body copy. */}
        <dl className="w-strip" data-reveal>
          <div><dt>Sectors</dt><dd>Nine, from construction to general labour</dd></div>
          <div><dt>Notice</dt><dd>48 hours</dd></div>
          <div><dt>Cover</dt><dd>Same day</dd></div>
          <div><dt>Levels</dt><dd>General to supervisory</dd></div>
        </dl>
      </header>

      {/* ── The sectors ───────────────────────────────────────────────
          The signature, and the page's centre of gravity. Nine sectors with
          the real role catalogue behind each — which is the difference between
          claiming to staff construction and naming formwork carpenters. */}
      <Sectors sectors={world.sectors} />

      {/* ── The levels ────────────────────────────────────────────────
          Five grades, drawn as a ladder rather than a table, because the
          proposal's point is that a worker moves up through them — a table
          would say these are five kinds of person. */}
      <section className="w-levels" id="w-levels">
        <div className="w-levels-head">
          <p className="world-kicker" data-reveal>How we grade people</p>
          <h3 data-reveal>Five levels, and a way up</h3>
          <p className="world-line" data-reveal>
            Every worker is placed at a level, and every level is a claim we
            have checked. A worker moves up through training and experience —
            which is the difference between a workforce and a list of names.
          </p>
        </div>

        <ol className="w-ladder">
          {world.levels.map((l, i) => (
            <li className="w-rung" key={l.k} data-reveal style={{ '--i': i, '--of': world.levels.length }}>
              <span className="w-rung-n">{l.n}</span>
              <span className="w-rung-body">
                <span className="w-rung-k">ORYX {l.k}</span>
                <span className="w-rung-d">{l.d}</span>
                <span className="w-rung-ex">{l.ex}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The shift ─────────────────────────────────────────────────
          The timetable is the layout, not an illustration of one. */}
      <section className="w-shift" id="w-shift">
        {/* The grid item stays full-height and an inner wrapper does the
            sticking. A sticky grid *item* has nowhere to travel, because with
            the item sized to its own content the containing block and the
            element are the same box. */}
        <div className="w-shift-intro">
          <div className="w-stick">
            <p className="world-kicker" data-reveal>A shift, end to end</p>
            <p className="world-lede" data-reveal>{world.lede}</p>
          </div>
        </div>

        <ol className="w-blocks">
          {world.shift.map((s) => (
            <li className="w-block" key={s.k} data-reveal>
              <span className="w-block-t">{s.t}</span>
              <span className="w-block-body">
                <span className="w-block-k">{s.k}</span>
                <span className="w-block-d">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The deployment ────────────────────────────────────────────
          A plan of one site with the whole shift posted on it. */}
      <Deployment posts={world.posts} />

      {/* ── The solutions ─────────────────────────────────────────────
          Five ways to buy the same people. The examples carry this section:
          "a flexible pool" is an abstraction, "5–20 workers depending on
          weekly volume" is an offer you can price. */}
      <section className="w-solutions" id="w-solutions">
        <div className="w-solutions-head">
          <p className="world-kicker" data-reveal>How you buy it</p>
          <h3 data-reveal>Five ways to take people on</h3>
        </div>

        <ol className="w-models">
          {world.solutions.map((m, i) => (
            <li className={`w-model ${m.lead ? 'is-lead' : ''}`} key={m.k} data-reveal style={{ '--i': i }}>
              <span className="w-model-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="w-model-k">{m.k}</span>
              <span className="w-model-d">{m.d}</span>
              <span className="w-model-ex">{m.ex}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── How we place people ─────────────────────────────────────── */}
      <section className="w-process" id="w-process">
        <div className="w-process-head">
          <div className="w-stick">
            <p className="world-kicker" data-reveal>How we place people</p>
            <h3 data-reveal>From brief to first shift</h3>
          </div>
        </div>
        <ol className="w-steps">
          {world.process.map((st, i) => (
            <li key={st.k} data-reveal style={{ '--i': i }}>
              <span className="w-step-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="w-step-body">
                <span className="w-step-k">{st.k}</span>
                <span className="w-step-d">{st.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── The quote ─────────────────────────────────────────────────
          The only social proof on the site. Attributed to a role and a sector
          rather than a person — what a facilities buyer finds credible, and it
          survives not having a name cleared for use. */}
      <figure className="w-quote">
        <blockquote data-reveal>
          <p>{world.quote.line}</p>
        </blockquote>
        <figcaption data-reveal>
          <span className="w-quote-who">{world.quote.who}</span>
          <span className="w-quote-where">{world.quote.where}</span>
        </figcaption>
      </figure>

      {/* ── Interlude ─────────────────────────────────────────────────── */}
      <section className="w-interlude">
        <Media clip={portal.workforce} />
        <p className="w-interlude-line" data-reveal>{service.body}</p>
      </section>

      {/* ── Cover ─────────────────────────────────────────────────────
          The day and the week in one section. They were two, and both were
          answering "when" — a 24-hour dial beside a seven-day grid says one
          thing twice at two scales. Together they are a single claim about
          coverage, with the figures that back it. */}
      <section className="w-cover" id="w-cover">
        <div className="w-cover-head">
          <p className="world-kicker" data-reveal>Covered, day and week</p>
          <p className="world-line" data-reveal>
            Shifts overlap at handover and run through the night. The one a
            rectangular rota cannot draw is the one that crosses midnight —
            which is why the day is a dial and the week is a grid.
          </p>
        </div>

        <div className="w-cover-grid">
          <figure className="w-dial" data-reveal>
            <svg viewBox="0 0 460 460" role="img" aria-label="Shift coverage across a 24-hour day">
              <g transform="rotate(-90 230 230)">
                {world.dial.map((s, i) => {
                  const hours = (s.t - s.f + 24) % 24 || 24
                  return (
                    <g key={s.k}>
                      <circle className="w-dial-rail" cx="230" cy="230" r={96 + i * 22} pathLength="24" />
                      <circle
                        className="w-dial-arc"
                        cx="230" cy="230" r={96 + i * 22}
                        pathLength="24"
                        style={{ '--hours': hours, '--from': -s.f, '--i': i }}
                      />
                    </g>
                  )
                })}
              </g>

              {[0, 6, 12, 18].map((h) => {
                const a = (h / 24) * Math.PI * 2 - Math.PI / 2
                return (
                  <text
                    key={h}
                    className="w-dial-h"
                    x={230 + Math.cos(a) * 212}
                    y={230 + Math.sin(a) * 212 + 5}
                  >
                    {String(h).padStart(2, '0')}
                  </text>
                )
              })}

              <text className="w-dial-c" x="230" y="222">24/7</text>
              <text className="w-dial-s" x="230" y="248">COVERED</text>
            </svg>

            <figcaption>
              <ul className="w-dial-key">
                {world.dial.map((s, i) => (
                  <li key={s.k} style={{ '--i': i }}>
                    <span className="w-dial-swatch" aria-hidden="true" />
                    <span className="w-dial-k">{s.k}</span>
                    <span className="w-dial-t">
                      {String(s.f).padStart(2, '0')}–{String(s.t).padStart(2, '0')}
                    </span>
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>

          <div className="w-cover-side">
            <div className="w-grid" data-reveal>
              <div className="w-grid-days" aria-hidden="true">
                <span />
                {world.roster.days.map((d, i) => (
                  <span key={i} className="w-day">{d}</span>
                ))}
              </div>

              {world.roster.rows.map((row) => (
                <div className="w-grid-row" key={row.r}>
                  <span className="w-grid-r">{row.r}</span>
                  {row.c.map((level, i) => (
                    <span
                      key={i}
                      className={`w-cell w-cell--${level}`}
                      style={{ '--i': i }}
                      aria-hidden="true"
                    />
                  ))}
                  <span className="sr-only">
                    {row.r}: {row.c.filter((n) => n === 2).length} days full crew,{' '}
                    {row.c.filter((n) => n === 1).length} reduced,{' '}
                    {row.c.filter((n) => n === 0).length} not staffed.
                  </span>
                </div>
              ))}

              <ul className="w-key" aria-hidden="true">
                {world.roster.key.map((k) => (
                  <li key={k.n}>
                    <span className={`w-cell w-cell--${k.n}`} />
                    {k.k}
                  </li>
                ))}
              </ul>
            </div>

            <ul className="w-figs">
              {world.figures.map((f) => (
                <li key={f.l} data-reveal>
                  <span className="w-fig-n">{f.n}</span>
                  <span className="w-fig-l">{f.l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── The services ──────────────────────────────────────────────── */}
      {/* ── The principle ─────────────────────────────────────────────
          Replaces a five-item services catalogue that the nine sectors above
          had made redundant.

          Categories, not a matrix. The proposal's certificate table is
          deliberately not published here: its own section 22 requires legal
          validation first, and whether a given certificate is mandatory turns
          on the machine, the site, the risk class and current Dutch law.
          Naming what we check is honest; publishing what the law requires,
          before anyone has validated it, is a liability. */}
      <section className="w-compliance" id="w-compliance">
        <div className="w-compliance-say">
          <p className="world-kicker" data-reveal>Quality and compliance</p>
          <p className="w-compliance-line" data-reveal>{world.compliance.line}</p>
          <p className="w-compliance-d" data-reveal>{world.compliance.d}</p>
        </div>

        <ul className="w-checks">
          {world.compliance.checks.map((c, i) => (
            <li key={c.k} data-reveal style={{ '--i': i }}>
              <span className="w-check-k">{c.k}</span>
              <span className="w-check-d">{c.d}</span>
            </li>
          ))}
        </ul>
      </section>

      <WorkforceFooter service={service} onClose={onClose} onRequest={onRequest} />
    </WorldShell>
  )
}

/**
 * The sectors, one tab each.
 *
 * This is the page's answer to Transport's route line: the thing that could
 * not move to another service. Staffing is four different trades wearing one
 * word, and the differences that matter — what a crew is cleared for, what
 * they turn up wearing — are exactly what a single "workforce" page flattens
 * away.
 *
 * Real tabs, not styled buttons: `role="tablist"` with arrow-key roving focus,
 * because a keyboard user should move between four panels with two keys rather
 * than tabbing through every control inside each one.
 */
function Sectors({ sectors }) {
  const [live, setLive] = useState(0)
  const tabs = useRef([])

  /* Left/right move, Home/End jump. Focus follows selection, which is the
     right pattern when switching costs nothing — the panel is already
     rendered and there is no request behind it. */
  const onKey = (e) => {
    const last = sectors.length - 1
    const to =
      e.key === 'ArrowRight' ? (live === last ? 0 : live + 1)
      : e.key === 'ArrowLeft' ? (live === 0 ? last : live - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null
    if (to === null) return
    e.preventDefault()
    setLive(to)
    tabs.current[to]?.focus()
  }

  const d = sectors[live]

  return (
    <section className="w-sectors" id="w-sectors">
      <div className="w-sectors-head">
        <p className="world-kicker" data-reveal>Where our people work</p>
        <h3 data-reveal>Nine sectors, one agreement</h3>
      </div>

      <div className="w-sector-body">
        <div className="w-tabs" role="tablist" aria-label="Workforce sectors" onKeyDown={onKey}>
        {sectors.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={i === live}
            aria-controls={`panel-${t.id}`}
            /* Only the selected tab is in the tab order; the arrows do the
               rest. Four tabs each holding a stop would make the keyboard
               path through this section four times longer than it needs. */
            tabIndex={i === live ? 0 : -1}
            ref={(n) => { tabs.current[i] = n }}
            className={`w-tab ${i === live ? 'is-live' : ''}`}
            onClick={() => setLive(i)}
          >
            <span className="w-tab-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="w-tab-k">{t.k}</span>
          </button>
        ))}
        </div>

      {/* One panel, swapped. `key` on the wrapper restarts the entrance each
          time, so switching tabs reads as new material arriving rather than
          text quietly replacing itself in place. */}
      <div
        className="w-panel"
        role="tabpanel"
        id={`panel-${d.id}`}
        aria-labelledby={`tab-${d.id}`}
        key={d.id}
      >
        <div className="w-panel-lead">
          <p className="w-domain-name">{d.k}</p>
          <p className="w-domain-n">{d.n}</p>
          <p className="w-domain-d">{d.d}</p>
          <p className="w-domain-who"><span>For</span> {d.who}</p>
        </div>

        <div className="w-panel-cols">
          <div>
            <h4>Roles</h4>
            <ul className="w-ticks">
              {d.roles.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <div>
            <h4>Checked before deployment</h4>
            <ul className="w-ticks">
              {d.cleared.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}

/**
 * The site, in plan, with every post covered.
 *
 * Transport draws a lorry because what it moves is objects. This is the third
 * attempt at the counterpart, and the first two failed the same way: a building
 * elevation filling with light put the architecture on screen and the people in
 * a caption, and a muster of figures counted heads without saying what any of
 * them were for.
 *
 * A plan says the thing the service actually sells. Not how many people — which
 * anyone can quote — but which positions, held at the same time, on one site,
 * with one of them named. The zones are geometry and live here; the posts are
 * content and live in `copy.js` with their own coordinates, so moving one is an
 * edit to two numbers.
 *
 * Drawn flat in the page's own two colours, for the same reason as the lorry:
 * nothing in a stock library is this site with this crew on it.
 */
function Deployment({ posts }) {
  const section = useRef(null)
  useSmoothProgress(section)

  const of = posts.length
  const total = posts.reduce((n, p) => n + p.n, 0)

  /* Four zones behind one outline: back of house across the top, the hall in
     the middle, the entrance along the bottom, a service spine down the right.

     Deliberately wide — 900 × 460 in a 1120 × 600 frame. The drawing is always
     height-constrained inside a sticky viewport, so a squarer plan simply
     rendered smaller and left a third of the row empty either side. A floor
     plate is wider than it is deep in any case. */
  const B = { l: 110, r: 1010, t: 70, b: 530 }
  const spine = 760

  return (
    <section className="w-deploy" ref={section} style={{ '--of': of }}>
      <div className="w-deploy-sticky">
        <div className="w-deploy-head">
          <p className="world-kicker">Where everyone stands</p>
          <p className="world-line">
            A shift is not a headcount, it is a set of positions — one site,
            every post filled and named, one of them holding the radio.
          </p>
        </div>

        <div className="w-deploy-scene">
          <svg
            viewBox="0 0 1120 600"
            role="img"
            aria-label={`Plan of a distribution site showing ${of} crew posts and ${total} people deployed across inbound, pick and pack, dispatch and yard`}
          >
            <rect
              className="w-plan-shell"
              x={B.l}
              y={B.t}
              width={B.r - B.l}
              height={B.b - B.t}
            />

            {/* Each division is two runs with a gap between them, and the gap is
                the doorway. A plan with unbroken walls has no way through it,
                which is the first thing that reads as wrong. */}
            <g className="w-plan-wall">
              <path d={`M${B.l} 225 H330`} />
              <path d={`M430 225 H${spine}`} />
              <path d={`M${B.l} 415 H300`} />
              <path d={`M400 415 H${spine}`} />
              <path d={`M${spine} ${B.t} V260`} />
              <path d={`M${spine} 350 V${B.b}`} />
            </g>

            {/* The ways in, marked on the outside wall. */}
            <g className="w-plan-door">
              <path d={`M480 ${B.b} H580`} />
              <path d={`M${B.r} 410 V500`} />
            </g>

            <g className="w-plan-zone">
              <text x={B.l + 16} y={B.t + 26}>INBOUND</text>
              <text x={B.l + 16} y={251}>PICK &amp; PACK</text>
              <text x={B.l + 16} y={441}>DISPATCH</text>
              <text x={spine + 16} y={B.t + 26}>YARD</text>
            </g>

            {posts.map((p, i) => (
              <g
                className={`w-post ${p.lead ? 'is-lead' : ''} ${p.rove ? 'is-rove' : ''}`}
                key={p.k}
                style={{ '--i': i }}
              >
                {/* The ring is the ground that post covers, not decoration —
                    which is why the roving pair's is dashed and the rest are
                    solid. */}
                <circle className="w-post-ring" cx={p.x} cy={p.y} r="22" />
                <circle className="w-post-dot" cx={p.x} cy={p.y} r="5.5" />
                <text className="w-post-k" x={p.x + 34} y={p.y - 2}>{p.k}</text>
                <text className="w-post-n" x={p.x + 34} y={p.y + 17}>
                  {p.r} · {p.n}
                </text>
              </g>
            ))}
          </svg>

          <p className="w-deploy-total">
            <span className="w-deploy-n">{total}</span>
            <span className="w-deploy-l">posted, one site</span>
          </p>
        </div>
      </div>
    </section>
  )
}
/**
 * This site's own footer.
 *
 * Editorial: one large serif sign-off holding the page, a short column of
 * links beside it, and a quiet legal line. Where Transport's footer is a
 * dense operational directory, this one is mostly air — the same difference
 * that runs through both pages from the top.
 */
function WorkforceFooter({ service, onClose, onRequest }) {
  const year = new Date().getFullYear()
  return (
    <footer className="w-foot">
      <div className="w-foot-main">
        <div className="w-foot-say">
          <h3>{service.world.prompt}</h3>
          <p>
            Tell us the site, the standard and the shifts. We will come back
            with names, numbers and a start date.
          </p>
          <button type="button" className="w-foot-cta" onClick={onRequest}>
            Request crew <i aria-hidden="true">→</i>
          </button>
        </div>

        <div className="w-foot-cols">
          {/* The sectors, from the same array the tabs read — a directory that
              restates them by hand is a directory that goes stale the next time
              one changes, which is exactly how Event crew and Front of house
              survived down here after being removed everywhere else. */}
          <div>
            <h4>Sectors</h4>
            <ul>
              {service.world.sectors.map((s) => (
                <li key={s.id}>{s.k}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Ways to take people on</h4>
            <ul>
              {service.world.solutions.map((m) => (
                <li key={m.k}>{m.k}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Talk to us</h4>
            <ul>
              <li><a href="mailto:people@oryx.example">people@oryx.example</a></li>
              <li>Mon–Fri · 08:00–18:00</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-foot-base">
        <span>© {year} ORYX Workforce Solutions — a service of ORYX GROUP</span>
        <button type="button" className="w-foot-back" onClick={onClose}>
          All ORYX services
        </button>
      </div>
    </footer>
  )
}
