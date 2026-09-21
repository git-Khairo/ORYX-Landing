import { useEffect, useId, useMemo, useState } from 'react'
import WorldShell, { Media } from './WorldShell'
import { useMeasured } from '../../lib/useMeasured'
import { film } from '../../content/media'
import { sectors, roles, serviceLines, totals } from '../../content/workforce'
import { ctaFor, emailFor } from '../../content/requests'
import { cardImage } from '../../lib/cardImage'
import { useEscape } from '../../lib/useOverlay'
import { SoundToggle } from '../Sound'
import { Social } from '../../sections/Footer'
import Sheet from '../Sheet'
import Icon from '../Icon'

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
            <a href="#w-axes">How it works</a>
            <a href="#w-method">Method</a>
            <a href="#w-trust">Trust</a>
          </nav>

          <div className="w-nav-r">
            <SoundToggle bare />
            <button type="button" className="w-nav-cta" onClick={() => onRequest(service.id)}>
              {ctaFor(service.id)}
            </button>
          </div>
        </div>
      </header>

      <header className="w-open">
        <Media clip={film.workforce} />
        <div className="w-open-copy">
          <p className="world-eyebrow" data-reveal>
            {service.index} / {service.title}
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
      <Register onRequest={onRequest} />

      {/* ── The two axes ──────────────────────────────────────────────
          The one place the four ways of supplying people are laid out. A
          separate "Four ways to work with us" section used to follow it and
          said the same thing again as four cards, so it was removed. */}
      <Axes copy={world.axes} />

      {/* ── Method ────────────────────────────────────────────────────
          Three triplets from the source, in its order. Cadence rather than
          process: the previous page ran a seven-step journey — Source, Screen,
          Verify, Match, Deploy, Monitor, Develop — which appears nowhere in
          this document and was invented for the earlier proposal. */}
      <section className="w-method" id="w-method">
        <div className="w-method-head">
          <div className="w-stick">
            <p className="world-kicker" data-reveal>Method</p>
            <h3 data-reveal>How we fill a role</h3>
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
   Twelve sectors as twelve cards, and one popup for whichever is opened.

   ── What this replaced ───────────────────────────────────────────────
   A tab bar with a panel under it that printed every role in the chosen
   sector by name. It was complete and it was a wall: up to forty-nine lines
   of type before a reader had decided the sector was even theirs.

   The page now only answers "is my sector here". A card is a picture, an
   icon, a name and a count. What the sector contains is one click away in a
   popup, and the full list with a sentence on every role is a brochure the
   reader can download and keep. Three depths, and nobody is made to read the
   third to get past the first.

   ── Search survives ──────────────────────────────────────────────────
   With 307 roles behind twelve cards, a reader who knows the job title needs
   a way straight to it. Results are names only. Picking one opens the popup
   for its sector with that role marked.

   ── No scroll-linked motion ──────────────────────────────────────────
   Entrance reveal only. Nothing here slices an opacity out of `--p`. */
const STATUS = { req: 'On request', qc: 'Qualification required' }
const SHOWN = 6

function Register({ onRequest }) {
  const [openId, setOpenId] = useState(null)
  const [mark, setMark] = useState(null)
  const [q, setQ] = useState('')
  const uid = useId().replace(/:/g, '')

  const query = q.trim().toLowerCase()
  const searching = query.length >= 2

  /* Built once. `where` is singular by construction: no role id appears in
     two groups, because the five occupations the source writes twice ship
     under sector-qualified ids. */
  const { index, where } = useMemo(() => {
    const idx = []
    const w = {}
    sectors.forEach((s) => {
      s.groups.forEach((g) => {
        g.roles.forEach((id) => {
          const [t, d, st] = roles[id]
          idx.push({ id, t, st, tn: t.toLowerCase(), dn: d.toLowerCase() })
          w[id] = { sid: s.id, short: s.short, gname: g.name }
        })
      })
    })
    return { index: idx, where: w }
  }, [])

  /* Title hits above description hits, alphabetical within each. Capped, with
     the cap stated, so a cut-off list never reads as the whole answer. */
  const CAP = 24
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

  /* Escape clears the search before it closes the page. */
  useEscape(Boolean(q) && !openId, () => setQ(''))

  const status = searching
    ? `${hits.length} role${hits.length === 1 ? '' : 's'} matching ${q.trim()}`
    : `${totals.sectors} sectors, ${totals.roles} roles.`
  const [announced, setAnnounced] = useState(status)
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(status), 350)
    return () => clearTimeout(t)
  }, [status])

  const openSector = (sid, roleId = null) => {
    setMark(roleId)
    setOpenId(sid)
  }
  const cur = sectors.find((s) => s.id === openId) || null

  return (
    <section className="w-reg-wrap" id="w-sectors" aria-labelledby={`${uid}-h`} data-reveal>
      <div className="w-reg-head">
        <p className="world-kicker">What the register covers</p>
        <h3 id={`${uid}-h`}>Twelve sectors</h3>
        <p className="world-line">
          Pick your sector to see the roles we supply, or search for a job title.
        </p>
      </div>

      <div className="w-find">
        <span className="w-find-tag" aria-hidden="true"><Icon name="search" size={16} /></span>
        <label className="sr-only" htmlFor={`${uid}-find`}>
          Search all {totals.roles} roles
        </label>
        <input
          id={`${uid}-find`}
          className="w-find-in"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a job title, for example forklift, welder, carpenter"
        />
        {q && (
          <button type="button" className="w-find-clear" onClick={() => setQ('')}>
            Clear
          </button>
        )}
      </div>
      <p className="sr-only" role="status">{announced}</p>

      {searching && (
        <div className="w-results" role="region" aria-label="Search results">
          {hits.length === 0 ? (
            <p className="w-reg-none">
              Nothing matches “{q.trim()}”. Try a shorter word, or open a sector below.
            </p>
          ) : (
            <ul className="w-hits" role="list">
              {hits.slice(0, CAP).map((r) => (
                <li key={r.id}>
                  <button type="button" className="w-hit" onClick={() => openSector(where[r.id].sid, r.id)}>
                    <span className="w-hit-t">{r.t}</span>
                    <span className="w-hit-crumb">{where[r.id].short}</span>
                    <Icon name="arrow" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {hits.length > CAP && (
            <p className="w-reg-more">
              Showing {CAP} of {hits.length}. Type a little more to narrow it down.
            </p>
          )}
        </div>
      )}

      <ul className="cards" role="list">
        {sectors.map((s, i) => {
          const img = cardImage(`workforce/${s.id}`)
          return (
            <li key={s.id}>
              <button type="button" className="card" onClick={() => openSector(s.id)} aria-haspopup="dialog">
                <span className="card-img">
                  {img && <img src={img.src} alt="" loading="lazy" />}
                  {/* Positional, never `s.no`. The source numbers skip 08,
                      because Security is cut, and a grid that skips a number
                      invites the one question this page cannot answer. */}
                  <span className="card-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="card-i"><Icon name={s.id} size={20} /></span>
                </span>
                <span className="card-body">
                  <span className="card-k">{s.short}</span>
                  <span className="card-c">{count(s)} roles</span>
                  <span className="card-go"><span>View</span><Icon name="arrow" size={14} /></span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {cur && (
        <SectorSheet
          sector={cur}
          mark={mark}
          onClose={() => setOpenId(null)}
          onRequest={() => onRequest('workforce', cur.id)}
        />
      )}
    </section>
  )
}

/* The popup for one sector. Group names, a handful of role names in each and
   a count of the rest, which are in the brochure with a sentence apiece. */
function SectorSheet({ sector, mark, onClose, onRequest }) {
  const img = cardImage(`workforce/${sector.id}`)
  const flagged = sector.groups.some((g) => g.roles.some((id) => roles[id][2]))

  return (
    <Sheet
      tone="workforce"
      label={sector.name}
      image={img}
      onClose={onClose}
      actions={
        <>
          {/* The link first and the button last, on purpose. The focus trap
              wraps on the last control, and Safari does not tab to links by
              default, so a link in last place let Tab walk out of the popup. */}
          <a className="btn" href={`/brochures/workforce-${sector.id}.pdf`} download>
            <Icon name="download" size={16} /> Download brochure
          </a>
          <button type="button" className="btn btn--fill" onClick={onRequest}>
            {ctaFor('workforce')} <Icon name="arrow" size={16} />
          </button>
        </>
      }
    >
      <div className="sheet-head">
        <span className="sheet-badge"><Icon name={sector.id} size={24} /></span>
        <ul className="sheet-stats" role="list">
          <li><b>{count(sector)}</b>roles</li>
          <li><b>{sector.groups.length}</b>groups</li>
        </ul>
      </div>
      <p className="sheet-lede">{sector.blurb}</p>

      <h4 className="sheet-h">Roles we supply</h4>
      <ul className="sheet-groups" role="list">
        {sector.groups.map((g) => {
          /* A role reached from search is always among the ones shown. */
          const ids = mark && g.roles.includes(mark)
            ? [mark, ...g.roles.filter((id) => id !== mark)]
            : g.roles
          const more = ids.length - SHOWN
          return (
            <li className="sheet-group" key={g.id}>
              <p className="sheet-group-k">{g.name} <span>{g.roles.length}</span></p>
              <ul className="sheet-chips" role="list">
                {ids.slice(0, SHOWN).map((id) => (
                  <li key={id} className={id === mark ? 'is-hit' : ''}>{roles[id][0]}</li>
                ))}
                {more > 0 && <li className="is-more">and {more} more</li>}
              </ul>
            </li>
          )
        })}
      </ul>

      <p className="sheet-note">
        The brochure lists every role in this sector with a line on what it covers.
        {flagged && ` Some roles are marked "${STATUS.req}" or "${STATUS.qc}" there. Those are confirmed for each assignment.`}
      </p>
    </Sheet>
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
          <button type="button" className="w-foot-cta" onClick={() => onRequest(service.id)}>
            {ctaFor(service.id)} <i aria-hidden="true"><Icon name="arrow" size={16} /></i>
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
              <li><a href={`mailto:${emailFor('workforce')}`}>{emailFor('workforce')}</a></li>
              <li>{world.submitNote}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-foot-base">
        <span>© {year} ORYX Workforce, a service of ORYX GROUP</span>
        <Social />
        <button type="button" className="w-foot-back" onClick={onClose}>
          All ORYX services
        </button>
      </div>
    </footer>
  )
}
