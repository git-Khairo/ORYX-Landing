import { useEffect, useId, useMemo, useRef, useState } from 'react'
import WorldShell, { Media } from './WorldShell'
import { useMeasured } from '../../lib/useMeasured'
import { film, portal } from '../../content/media'
import { sectors, roles, serviceLines, totals } from '../../content/workforce'

/**
 * Workforce — "The Register."
 *
 * Rebuilt against the ORYX source document *Workforce / Structure*, which is an
 * extract of the real copy files rather than a proposal. That document replaced
 * this page's contents wholesale, so what used to be here — a five-grade ladder,
 * a shift timetable, a coverage dial, a weekly rota and a site deployment plan —
 * is gone. None of it appears in the source. What replaced it is a catalogue:
 * twelve sectors, forty-one groups, three hundred and seven named roles.
 *
 * The page therefore stops being a brochure and becomes an instrument. Its
 * centre of gravity is a register you can search, and everything around it
 * exists to make that register mean something.
 *
 * ── The argument the page has to make ────────────────────────────────
 * The source opens by rejecting the reading its own shape invites: *two axes,
 * not one hierarchy*. Sector → group → role nests. Service line does not — it
 * says how a role is delivered, not what industry it belongs to. A reader who
 * has just browsed a three-level tree and then meets four service lines will
 * read those four as a fourth level unless something stops them. `Axes` is that
 * something, and it is why it sits between the two sections rather than
 * anywhere prettier.
 *
 * ── What may not be said ─────────────────────────────────────────────
 * The source's final page is a publication gate that clears five claims out of
 * twenty-five and marks the whole go-live decision red. The forbidden list, and
 * the reason this page names no certificate scheme, is documented in full at the
 * top of the Workforce block in `copy.js`. Read it before adding anything here.
 */
export default function WorkforceWorld({ service, onClose, onRequest }) {
  const { world } = service
  const nav = useMeasured('--w-nav-h')

  return (
    <WorldShell service={service} onClose={onClose}>
      {/* ── Its own navigation ────────────────────────────────────────
          Unchanged in construction; the destinations are new because the
          sections are. Six links became five: Levels, Shift and Cover had
          nothing left to point at. */}
      <header className="w-nav" ref={nav}>
        <div className="w-nav-inner">
          <button type="button" className="w-nav-mark" onClick={onClose}>
            <i aria-hidden="true" />
            <span className="w-nav-word">ORYX</span>
            <span className="w-nav-unit">Workforce</span>
          </button>

          <nav className="w-nav-links" aria-label="Workforce sections">
            <a href="#w-sectors">Register</a>
            <a href="#w-axes">Two axes</a>
            <a href="#w-lines">Service lines</a>
            <a href="#w-method">Method</a>
            <a href="#w-trust">Trust</a>
          </nav>

          <button type="button" className="w-nav-cta" onClick={onRequest}>
            {world.cta}
          </button>
        </div>
      </header>

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
          {/* The source's north star, and the strongest line in it. Set as a
              statement, never as a quotation: it is ORYX describing itself, and
              quotation marks with an attribution beneath would dress a
              self-description as somebody else's testimony. */}
          <p className="w-north" data-reveal>{world.northStar}</p>
          <p className="w-open-lede" data-reveal>{world.lede}</p>
        </div>

        {/* The catalogue's size, and immediately underneath it the source's own
            governing sentence. The numbers describe coverage — the taxonomy
            ORYX staffs — and the line under them is what stops a reader taking
            them as a pool of people standing by. The source is explicit that
            these counts are pre-review and expected to fall, so they are never
            presented as availability, and `stripNote` is not decoration: it is
            the condition on which printing them at all is honest. */}
        <dl className="w-strip" data-reveal>
          {world.strip.map((f) => (
            <div key={f.l}><dt>{f.l}</dt><dd>{f.n}</dd></div>
          ))}
        </dl>
        <p className="w-strip-note" data-reveal>{world.stripNote}</p>
      </header>

      {/* ── The register ──────────────────────────────────────────────
          The signature. Twelve sectors, forty-one groups and every one of the
          307 roles by name, with the sentence that tells two similar titles
          apart. "We staff construction" is a claim anyone can make; "Formwork
          carpenter — formwork, striking, supports and concrete preparation" is
          not. */}
      <Register />

      {/* ── The two axes ──────────────────────────────────────────────
          Placed here on purpose, between the register and the service lines.
          Adjacency is load-bearing: the figure exists to pre-empt a misreading
          of the section directly beneath it. If the service lines ever move,
          this moves with them. */}
      <Axes copy={world.axes} />

      {/* ── Axis two ──────────────────────────────────────────────────── */}
      <ServiceLines />

      {/* ── Interlude ─────────────────────────────────────────────────── */}
      <section className="w-interlude">
        <Media clip={portal.workforce} />
        <p className="w-interlude-line" data-reveal>{world.value}</p>
      </section>

      {/* ── Method ────────────────────────────────────────────────────
          Three triplets from the source, in its order. Cadence rather than
          process: the previous page ran a seven-step journey — Source, Screen,
          Verify, Match, Deploy, Monitor, Develop — which appears nowhere in
          this document and was invented for the earlier proposal. */}
      <section className="w-method" id="w-method">
        <div className="w-method-head">
          <div className="w-stick">
            <p className="world-kicker" data-reveal>Method</p>
            <h3 data-reveal>Move quickly.<br />Select precisely.<br />Confirm clearly.</h3>
          </div>
        </div>

        <ol className="w-steps" role="list">
          {world.method.map((m, i) => (
            <li key={m.k} data-reveal style={{ '--i': i }}>
              <span className="w-step-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="w-step-body">
                <span className="w-step-k">{m.k}</span>
                <span className="w-step-d">{m.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Trust ─────────────────────────────────────────────────────
          What replaced "Quality and compliance". The old section listed VCA,
          Code 95, ADR, IPAF, TCVT and NEN 3140 as things ORYX checks. Every one
          of those is a compliance claim, and the source's closing sentence —
          the final lending legal entity is not yet fixed — blocks every legal
          and compliance claim on the site. So the certificates are gone and the
          principle stands on its own.

          Note the direction of every line here: each one narrows what is being
          promised rather than widening it. That is the whole reason this
          section is credible where a certificate matrix would not be. */}
      <section className="w-trust" id="w-trust">
        <div className="w-trust-say">
          <p className="world-kicker" data-reveal>{world.trust.kicker}</p>
          <p className="w-trust-line" data-reveal>{world.trust.line}</p>
          <p className="w-trust-d" data-reveal>{world.trust.d}</p>
        </div>

        <ul className="w-holds" role="list">
          {world.trust.holds.map((h, i) => (
            <li key={h} data-reveal style={{ '--i': i }}>{h}</li>
          ))}
        </ul>
      </section>

      <WorkforceFooter service={service} onClose={onClose} onRequest={onRequest} />
    </WorldShell>
  )
}

/* ═══ The register ═══════════════════════════════════════════════════
   Twelve sectors as twelve tabs, and one panel showing the chosen sector's
   groups and roles.

   ── What this replaced, three times ──────────────────────────────────
   First a fixed-height frame holding a sector rail, a group strip and a
   scrolling column of roles: seventeen controls before a line of content, and
   a scroll container inside a scrolling page. Then a grid of twelve cards
   summarising the whole taxonomy twelve times over. Then twelve accordion
   rows — which worked, and which read as a dropdown to the person paying for
   it. Tabs were asked for by name.

   ── Why tabs suit this data ──────────────────────────────────────────
   A sector is a *choice*, not a list to read down: nobody wants all twelve
   open. Tabs make the choice the whole interface — every sector visible at
   once as a name and a count, and exactly one open. The bar stays put while
   the panel below it changes, so nothing moves under the cursor.

   ── The ARIA tabs pattern, with automatic activation ─────────────────
   `role="tablist"` / `role="tab"` / `role="tabpanel"`; the selected tab is
   the only one in the tab order, and Left/Right/Home/End move between them
   and select as they go. Automatic rather than manual activation because
   switching is cheap here — no fetch, no layout of consequence — and it is
   what a visitor expects from a row of names.

   ── What is deliberately not here ────────────────────────────────────
   No grid, no column counting, no scroll container, no per-role disclosure.
   One field to search, one tab per sector, one panel.

   ── No scroll-linked motion ──────────────────────────────────────────
   `useSmoothProgress` writes `--p` unconditionally, and when a section is not
   taller than `.world-scroll` it writes `"0.0000"` rather than leaving the
   property unset — so `var(--p, 1)` never falls back and anything slicing an
   opacity out of `--p` renders permanently invisible. Entrance reveal only. */
function Register() {
  const [active, setActive] = useState(sectors[0].id)
  const [q, setQ] = useState('')
  const uid = useId().replace(/:/g, '')

  const query = q.trim().toLowerCase()
  const searching = query.length >= 2

  /* Built once — the data is a static import. `where` is singular by
     construction: no role id appears in two groups, because the five
     occupations the source writes twice ship under sector-qualified ids. */
  const { index, where } = useMemo(() => {
    const idx = []
    const w = {}
    sectors.forEach((s, si) => {
      s.groups.forEach((g) => {
        g.roles.forEach((id) => {
          const [t, d, st] = roles[id]
          idx.push({ id, t, d, st, tn: t.toLowerCase(), dn: d.toLowerCase() })
          w[id] = { si, short: s.short, gid: g.id, gname: g.name }
        })
      })
    })
    return { index: idx, where: w }
  }, [])

  /* Title hits above description hits, alphabetical within each. Capped, with
     the cap stated — a silently truncated result list reads as "that is all
     there is", which for a register is the one lie it must not tell. */
  const CAP = 60
  const hits = useMemo(() => {
    if (!searching) return null
    const t = [], d = []
    for (const r of index) {
      if (r.tn.includes(query)) t.push(r)
      else if (r.dn.includes(query)) d.push(r)
    }
    const by = (a, b) => a.t.localeCompare(b.t)
    return t.sort(by).concat(d.sort(by))
  }, [index, query, searching])

  /* Left/Right/Home/End on a tab move the selection and the focus together. */
  const onTabKey = (e, i) => {
    const n = sectors.length
    let j = null
    if (e.key === 'ArrowRight') j = (i + 1) % n
    else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n
    else if (e.key === 'Home') j = 0
    else if (e.key === 'End') j = n - 1
    if (j === null) return
    e.preventDefault()
    setActive(sectors[j].id)
    document.getElementById(`${uid}-t-${sectors[j].id}`)?.focus()
  }

  const status = searching
    ? `${hits.length} role${hits.length === 1 ? '' : 's'} matching ${q.trim()}`
    : `${totals.sectors} sectors, ${totals.roles} roles.`

  /* The live region lags the state on purpose: `role="status"` is polite, but
     a screen reader still queues one announcement per keystroke. */
  const [announced, setAnnounced] = useState(status)
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(status), 350)
    return () => clearTimeout(t)
  }, [status])

  const toSector = (id) => {
    setQ('')
    setActive(sectors[where[id].si].id)
  }

  const cur = sectors.find((s) => s.id === active) ?? sectors[0]

  /* Bring the chosen tab into view when it changes — a tap, a search crumb,
     the arrow keys. On a phone the bar is a scrolling row with start-aligned
     snap points, so the tab is scrolled to the START of the row: `nearest`
     would align its far edge and the proximity snap would then pull the row
     back to the previous tab's start, leaving the chosen one half under the
     edge fade. On wider screens the bar does not scroll and this is a no-op
     horizontally. Not on mount: `block: 'nearest'` would scroll the world
     down to the register the moment it opened. */
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    document
      .getElementById(`${uid}-t-${active}`)
      ?.scrollIntoView({ block: 'nearest', inline: 'start' })
  }, [active, uid])

  return (
    <section className="w-reg-wrap" id="w-sectors" aria-labelledby={`${uid}-h`} data-reveal>
      <div className="w-reg-head">
        <p className="world-kicker">What the register covers</p>
        <h3 id={`${uid}-h`}>Twelve sectors, role by role</h3>
        <p className="world-line">
          Every role named. Not “construction labour” — a carpenter, a paver
          and a groundworker, each doing something different. Search any of the{' '}
          {totals.roles} by name, or pick a sector.
        </p>
      </div>

      {/* Tracked caps rather than a magnifier: there is no magnifier anywhere
          in this brand kit and there are tracked caps on every page of it. */}
      <div className="w-find">
        <span className="w-find-tag" aria-hidden="true">Find</span>
        <label className="sr-only" htmlFor={`${uid}-find`}>
          Search all {totals.roles} roles
        </label>
        <input
          id={`${uid}-find`}
          className="w-find-in"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          /* Escape clears the search rather than closing the whole Workforce
             world. `useEscape` listens on `window`, so without this a visitor
             pressing Escape to dismiss a query is thrown back to the gateway. */
          onKeyDown={(e) => {
            if (e.key === 'Escape' && q) {
              e.preventDefault()
              e.stopPropagation()
              setQ('')
            }
          }}
          placeholder="Role, e.g. forklift, welder, carpenter"
        />
        {q && (
          <button type="button" className="w-find-clear" onClick={() => setQ('')}>
            Clear
          </button>
        )}
      </div>
      <p id={`${uid}-status`} className="sr-only" role="status">{announced}</p>

      {searching ? (
        <div
          className="w-results"
          role="region"
          aria-label={`Search results: ${hits.length} role${hits.length === 1 ? '' : 's'} matching ${q.trim()}`}
          aria-describedby={`${uid}-legend`}
        >
          {hits.length === 0 ? (
            <p className="w-reg-none">
              No role matches “{q.trim()}”. The register covers {totals.sectors}{' '}
              sectors and {totals.roles} roles — try a shorter word, or open a
              sector below.
            </p>
          ) : (
            <ul className="w-hits" role="list">
              {hits.slice(0, CAP).map((r) => {
                const s = r.st === 'req' ? 'On request' : r.st === 'qc' ? 'Qualification required' : null
                return (
                  <li className={`w-hit ${s ? 'is-q' : ''}`} key={r.id}>
                    <p className="w-hit-t">
                      {r.t}
                      {s && <span className="w-hit-s"><span className="sr-only">Status: </span>{s}</span>}
                    </p>
                    {/* The sentence that tells two similar titles apart. It is
                        shown here, where a reader is looking at a handful of
                        results, rather than 307 times in the browse list. */}
                    <p className="w-hit-d">{r.d}</p>
                    <button type="button" className="w-hit-crumb" onClick={() => toSector(r.id)}>
                      {where[r.id].short} · {where[r.id].gname}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          {hits.length > CAP && (
            <p className="w-reg-more">
              Showing {CAP} of {hits.length}. Narrow the search to see the rest.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="w-tabs" role="tablist" aria-label="Sectors">
            {sectors.map((s, i) => {
              const on = s.id === active
              return (
                <button
                  type="button"
                  role="tab"
                  key={s.id}
                  id={`${uid}-t-${s.id}`}
                  className={`w-tab ${on ? 'is-on' : ''}`}
                  aria-selected={on}
                  aria-controls={`${uid}-p-${s.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(s.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  {/* Positional, never `s.no`. The source numbers run 01–07 and
                      09–13 because Security and Automotive are cut, and a bar
                      that skips 08 invites the one question this page cannot
                      answer. `no` stays in the data for reconciliation. */}
                  <span className="w-tab-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="w-tab-k">{s.short}</span>
                  <span className="w-tab-c">{count(s)}</span>
                </button>
              )
            })}
          </div>

          {/* Keyed on the sector so the panel remounts and its entrance plays
              on every switch. Transform only — see the CSS. */}
          <div
            className="w-panel"
            role="tabpanel"
            id={`${uid}-p-${cur.id}`}
            aria-labelledby={`${uid}-t-${cur.id}`}
            key={cur.id}
          >
            <div className="w-panel-head">
              <h4>{cur.name}</h4>
              <p className="w-panel-c">
                {count(cur)} roles in {cur.groups.length} group{cur.groups.length === 1 ? '' : 's'}
              </p>
              <p className="w-panel-blurb">{cur.blurb}</p>
            </div>
            {cur.groups.map((g) => (
              <section className="w-grp" key={g.id}>
                <h4>
                  {g.name} <span>{g.roles.length}</span>
                </h4>
                <ul className="w-roles" role="list">
                  {g.roles.map((id) => {
                    const [t, , st] = roles[id]
                    const lbl = st === 'req' ? 'On request' : st === 'qc' ? 'Qualification required' : null
                    return (
                      <li className={lbl ? 'is-q' : ''} key={id}>
                        {t}
                        {lbl && (
                          <span className="w-role-s">
                            <span className="sr-only">Status: </span>{lbl}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}

      {/* "Published" is an internal workflow word — it describes the state of a
          record in ORYX's copy files, not anything a visitor can act on. And
          the note against a qualification role has to describe the *role*
          rather than promise a check ORYX performs, because the source blocks
          every compliance claim until the lending entity is fixed. The closing
          clause is quoted from the source's own trust language and narrows the
          claim rather than widening it. */}
      <p className="w-reg-legend" id={`${uid}-legend`}>
        Most roles carry no note.{' '}
        <b>On request</b> — supplied subject to confirmation.{' '}
        <b>Qualification required</b> — the role calls for a certificate, and a
        certificate does not automatically grant authority.
      </p>
    </section>
  )
}

const count = (s) => s.groups.reduce((n, g) => n + g.roles.length, 0)



/**
 * The two axes.
 *
 * The one genuinely new illustration on the page, and the only one whose job is
 * an argument rather than an atmosphere. It exists because the section under it
 * will otherwise be misread as a fourth level of the section above it.
 *
 * ── Why it is not scroll-driven ──────────────────────────────────────
 * A figure whose entire claim is *these two things do not nest* has to be taken
 * in at once. Revealing it a piece at a time performs a sequence, and a
 * sequence is exactly the reading it exists to correct. It arrives as one
 * object and then holds still.
 *
 * ── Why there is no SVG ──────────────────────────────────────────────
 * Every string in it is data whose length nobody controls: 48-character sector
 * names, 45-character group names, "Project teams & flex pools". SVG `<text>`
 * does not wrap, and an earlier attempt needed about 1 150 units of width for
 * the four service-line labels inside a 1 120-unit box. That was never a
 * coordinate problem to be solved with a bigger viewBox — it was the wrong
 * element for a label whose length is data. There is nothing here to draw that
 * is not a border, a grid gap or two rules: three nested boxes, four sibling
 * cells, a divider with a cross on it. Removing the SVG also removes the
 * temptation to draw a connector — which is banned, because a node with four
 * lines fanning out from it *is* the drawing of a tree.
 *
 * ── The acceptance test ──────────────────────────────────────────────
 * The chosen role's name appears five times in identical type from a single CSS
 * rule: once at the bottom of the nest, once in each of the four service lines.
 * Children of a node differ from each other and from their parent; five
 * identical strings are one object seen five times. Nothing is drawn between
 * them. The nest indents and narrows; the four cells are equal and full height.
 * Two labelled rails sit at ninety degrees. Cover the caption and the figure
 * has still made its argument.
 */
function Axes({ copy }) {
  /* A real role, pulled from the register rather than typed here, so the figure
     cannot drift from the data it is describing. Chosen for length: "Carpenter"
     is nine characters and stays on one line in the narrowest cell the layout
     ever produces, which is what lets all five instances read as one shape. */
  const sector = sectors.find((s) => s.id === 'property')
  const group = sector?.groups.find((g) => g.roles.includes('carpenter'))
  const role = roles.carpenter?.[0]

  /* Three lookups by hard-coded id. If a sector, a group or a role is ever
     renamed in the data, the figure loses its example — but it must not take
     the whole world down with it, which an unguarded `roles.carpenter[0]`
     would. Rendering nothing is recoverable; a blank page is not. */
  if (!sector || !group || !role) return null

  return (
    <section className="w-axes" id="w-axes">
      <div className="w-axes-head">
        <p className="world-kicker" data-reveal>{copy.kicker}</p>
        <h3 data-reveal>{copy.line}</h3>
        <p className="world-line" data-reveal>{copy.d}</p>
      </div>

      <figure className="w-axes-fig" data-reveal>
        <span className="sr-only">
          A sector contains groups, and a group contains roles. Each of the four
          service lines below delivers that same role under a different
          contract, so they are not a fourth level of the hierarchy.
        </span>

        <p className="w-ax-axl w-ax-axl--y" aria-hidden="true">
          What the work is <i />
        </p>

        {/* Genuinely nested lists, indented by a stepped left rule. That
            containment grammar appears nowhere else in this stylesheet, so it
            cannot be confused with the peer grammar on the other side. The nest
            carries no ordinals at all — the indent does the counting, so no
            number inside the figure can be mistaken for a depth. */}
        <ol className="w-ax-nest" role="list">
          <li className="w-ax-lvl">
            <span className="w-ax-lvl-h" style={{ '--i': 0 }}>
              <span className="w-ax-n">Sector <em>{sector.groups.length} groups</em></span>
              <span className="w-ax-k">{sector.short}</span>
            </span>
            <ol role="list">
              <li className="w-ax-lvl">
                <span className="w-ax-lvl-h" style={{ '--i': 1 }}>
                  <span className="w-ax-n">Group <em>{group.roles.length} roles</em></span>
                  <span className="w-ax-k">{group.name}</span>
                </span>
                <ol role="list">
                  <li className="w-ax-lvl is-leaf">
                    <span className="w-ax-lvl-h" style={{ '--i': 2 }}>
                      <span className="w-ax-n">Role</span>
                      <span className="w-ax-k">{role}</span>
                    </span>
                  </li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>

        {/* A divider with a cross on it, in `--line` and never in sand: sand
            here would read as a connection, and the one thing that must not be
            drawn between these two halves is a line joining them. */}
        <span className="w-ax-seam" aria-hidden="true" />

        <p className="w-ax-axl w-ax-axl--x" aria-hidden="true">
          How it is delivered <i />
        </p>

        {/* A flat list of four siblings — "list, 4 items", at no depth. */}
        <ol className="w-ax-lines" role="list">
          {serviceLines.map((l) => (
            <li className="w-ax-line" key={l.n}>
              <span className="w-ax-ln">{l.n}</span>
              <span className="w-ax-lk">{l.k}</span>
              <span className="w-ax-ld">{l.fit}</span>
              <span className="w-ax-role">{role}</span>
            </li>
          ))}
        </ol>

        <figcaption className="w-ax-cap">
          <b>{totals.roles} roles <span aria-hidden="true">×</span><span className="sr-only">by</span> {serviceLines.length} service lines.</b>{' '}
          {copy.note}
        </figcaption>
      </figure>
    </section>
  )
}

/**
 * Axis two, as a section.
 *
 * Four rather than the five engagement models this page used to carry — and the
 * five were invented for the earlier proposal. Four is also the better grid:
 * five cards widowed one at every breakpoint the page has.
 */
function ServiceLines() {
  return (
    <section className="w-lines" id="w-lines">
      <div className="w-lines-head">
        <p className="world-kicker" data-reveal>Axis two · how capacity is delivered</p>
        <h3 data-reveal>Four service lines</h3>
        <p className="world-line" data-reveal>
          Every role in the register can be supplied through any of the four.
          The choice is commercial and contractual, not occupational.
        </p>
      </div>

      <ol className="w-models" role="list">
        {serviceLines.map((l, i) => (
          <li className="w-model" key={l.n} data-reveal style={{ '--i': i }}>
            <span className="w-model-n">{l.n}</span>
            <span className="w-model-k">{l.k}</span>
            <span className="w-model-d">{l.d}</span>
            <span className="w-model-ex">
              <b>Best fit</b> {l.fit}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function WorkforceFooter({ service, onClose, onRequest }) {
  const year = new Date().getFullYear()
  const { world } = service
  return (
    <footer className="w-foot">
      <div className="w-foot-main">
        <div className="w-foot-say">
          <h3>{world.prompt}</h3>
          {/* The previous line here promised "names, numbers and a start date",
              which was invented and is a response-time claim in all but name.
              The source clears exactly one 24/7 wording — that requests may be
              *submitted* around the clock, which is a fact about the form and
              not a promise about a person. */}
          <p>{world.submitNote}</p>
          <button type="button" className="w-foot-cta" onClick={onRequest}>
            {world.cta} <i aria-hidden="true">→</i>
          </button>
        </div>

        <div className="w-foot-cols">
          {/* Read from the same array the register reads. A directory retyped
              by hand is a directory that goes stale the next time a sector
              changes — which is precisely how two sectors that had been removed
              everywhere else survived down here last time. */}
          <div>
            <h4>Sectors</h4>
            <ul role="list">
              {sectors.map((s) => <li key={s.id}>{s.short}</li>)}
            </ul>
          </div>
          <div>
            <h4>Service lines</h4>
            <ul role="list">
              {serviceLines.map((l) => <li key={l.n}>{l.k}</li>)}
            </ul>
          </div>
          <div>
            <h4>Talk to us</h4>
            {/* No opening hours. "Desk open Mon–Fri · 08:00–18:00" was invented
                — the source names no hours anywhere — and any hours here read
                as a response-time promise, which is the blocked claim. */}
            <ul role="list">
              <li><a href="mailto:people@oryx.example">people@oryx.example</a></li>
              <li>{world.submitNote}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-foot-base">
        <span>© {year} ORYX Workforce — a service of ORYX GROUP</span>
        <button type="button" className="w-foot-back" onClick={onClose}>
          All ORYX services
        </button>
      </div>
    </footer>
  )
}
