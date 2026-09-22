import { useEffect, useId, useMemo, useRef, useState } from 'react'
import WorldShell, { Media } from './WorldShell'
import { useMeasured } from '../../lib/useMeasured'
import { film } from '../../content/media'
import { sectors, roles, serviceLines, totals } from '../../content/workforce'
import { ctaFor, emailFor } from '../../content/requests'
import { cardImage } from '../../lib/cardImage'
import { useEscape } from '../../lib/useOverlay'
import { useSeen, seenClass } from '../../lib/useSeen'
import { usePrefersReduced } from '../../lib/usePrefersReduced'
import CrewScene from './workforce/CrewScene'
import PhotoBand from '../PhotoBand'
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
 * ── The idea the page has to get across ──────────────────────────────
 * The job and the way of hiring are two separate choices: any role can be
 * supplied as temporary staff, on secondment, as a permanent hire or inside a
 * project team. A diagram used to argue that in text. The request builder now
 * lets the visitor make the two choices, which says the same thing faster.
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

  /* Which sector popup is open, and which role in it is marked. It used to
     live inside the register. The photo strip further down opens the same
     popups, so the state sits here and both are handed the opener. */
  const [sheet, setSheet] = useState(null)
  const openSector = (id, mark = null) => setSheet({ id, mark })
  const openedSector = sheet ? sectors.find((s) => s.id === sheet.id) : null

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
            <a href="#w-crew">Crew</a>
            <a href="#w-sectors">Sectors</a>
            <a href="#w-ways">Ways to hire</a>
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
            <div key={f.l}><dt>{f.l}</dt><dd><CountUp value={f.n} /></dd></div>
          ))}
        </dl>
        <p className="w-strip-note" data-reveal>{world.stripNote}</p>
      </header>

      {/* ── The promise, drawn ────────────────────────────────────────
          "From one skilled worker to a complete project crew", shown as one
          worker becoming twelve as the page scrolls. It comes straight after
          the opening because it is the opening's own sentence made visible. */}
      <CrewScene />

      {/* ── The register ──────────────────────────────────────────────
          The signature. Twelve sectors, forty-one groups and every one of the
          307 roles by name, with the sentence that tells two similar titles
          apart. "We staff construction" is a claim anyone can make; "Formwork
          carpenter — formwork, striking, supports and concrete preparation" is
          not. */}
      <Register onOpenSector={openSector} popupOpen={Boolean(sheet)} />

      {/* ── Four ways to hire ─────────────────────────────────────────
          The job and the way of hiring are two separate choices, and any role
          can be supplied four ways. A diagram argued that in text, then a
          three-step request builder had the visitor act it out, and neither
          earned its space. Four situations do the same job in a glance. */}
      <Situations onRequest={onRequest} />

      {/* ── The sectors, in pictures ──────────────────────────────────── */}
      <SectorBand onOpen={openSector} />

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

        <MethodSteps steps={world.method} />
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

        <Holds holds={world.trust.holds} />
      </section>

      <WorkforceFooter service={service} onClose={onClose} onRequest={onRequest} />

      {openedSector && (
        <SectorSheet
          sector={openedSector}
          mark={sheet.mark}
          onClose={() => setSheet(null)}
          onRequest={() => onRequest('workforce', openedSector.id)}
        />
      )}
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

function Register({ onOpenSector, popupOpen }) {
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
  useEscape(Boolean(q) && !popupOpen, () => setQ(''))

  const status = searching
    ? `${hits.length} role${hits.length === 1 ? '' : 's'} matching ${q.trim()}`
    : `${totals.sectors} sectors, ${totals.roles} roles.`
  const [announced, setAnnounced] = useState(status)
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(status), 350)
    return () => clearTimeout(t)
  }, [status])

  const openSector = onOpenSector

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



/* The twelve sectors as a drifting band of their photographs. */
function SectorBand({ onOpen }) {
  const items = sectors.map((sec) => ({
    id: sec.id,
    label: sec.short,
    icon: sec.id,
    img: cardImage(`workforce/${sec.id}`),
  }))
  return <PhotoBand items={items} onOpen={onOpen} label="The twelve sectors in pictures" />
}

/* ═══ Four ways to hire ══════════════════════════════════════════════
   Each of the four service lines, introduced by the situation it answers.
   The situations are written here and not in the content file: they are the
   page's own framing of the four lines, and the lines themselves are read from
   the data, so a renamed line renames its tile.

   Plain situations only. Nothing here says how fast ORYX responds or that
   anyone is standing by, which the claims rules forbid. */
const SITUATIONS = [
  { n: '01', say: 'Two people are off sick this week.', img: 'cleaning' },
  { n: '02', say: 'A nine-month project needs a fitter.', img: 'technical' },
  { n: '03', say: 'We want to hire someone, not borrow them.', img: 'manufacturing' },
  { n: '04', say: 'A whole crew for a new site.', img: 'property' },
]

function Situations({ onRequest }) {
  const tiles = SITUATIONS.map((sit) => ({ ...sit, line: serviceLines.find((l) => l.n === sit.n) })).filter((t) => t.line)
  return (
    <section className="w-ways" id="w-ways">
      <div className="w-ways-head">
        <p className="world-kicker" data-reveal>Four ways to hire</p>
        <h3 data-reveal>Which one sounds like your week?</h3>
        <p className="world-line" data-reveal>
          Any role in the register can be supplied in any of these four ways.
          The job stays the same, and only the way you hire changes.
        </p>
      </div>

      <ul className="w-ways-grid" role="list">
        {tiles.map((t, i) => {
          const img = cardImage(`workforce/${t.img}`)
          return (
            <li key={t.n} data-reveal style={{ '--i': i }}>
              {/* The whole tile is the button, so the request form opens with
                  this way of hiring already noted. Spans throughout, because a
                  button may hold phrasing content only. */}
              <button
                type="button"
                className="w-way"
                onClick={() => onRequest('workforce', '', `How: ${t.line.k}`)}
              >
                <span className="w-way-img">
                  {img && <img src={img.src} alt="" loading="lazy" />}
                  <span className="w-way-n">{t.n}</span>
                </span>
                <span className="w-way-body">
                  <span className="w-way-say">{t.say}</span>
                  <span className="w-way-k">{t.line.k}</span>
                  <span className="w-way-d">{t.line.d}</span>
                  <span className="w-way-go">{ctaFor('workforce')} this way<Icon name="arrow" size={14} /></span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* A figure that counts up to itself the first time it is seen.

   The real number is what a screen reader gets, always. The visible one starts
   as the real number too, so if nothing ever runs the strip is simply correct.
   It is driven by a timer and not by `requestAnimationFrame`: a frame callback
   does not fire in a tab that is not being painted, and a count stranded at 40
   of 307 would be a wrong number printed on the page. The last step sets the
   true value outright, whatever the steps before it managed. */
function CountUp({ value }) {
  const target = parseInt(value, 10)
  const ref = useRef(null)
  const state = useSeen(ref, { margin: '-4%' })
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (state !== 'seen' || Number.isNaN(target)) return
    const DURATION = 1300
    const t0 = performance.now()
    const id = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / DURATION)
      setShown(String(Math.round(target * (1 - (1 - k) ** 3))))
      if (k === 1) { clearInterval(id); setShown(value) }
    }, 32)
    return () => { clearInterval(id); setShown(value) }
  }, [state, target, value])

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{state === 'wait' ? '0' : shown}</span>
    </span>
  )
}

/* The three method steps, with a line that fills as they are read.

   Measured against the list and not the section, which is the lesson from
   Transport's route: a section is taller than its list, so a line tied to the
   section finishes early and then sits there. One scroll listener, throttled
   to a frame, writes one number onto the list and one index into state.

   Until that listener has run the steps are all lit, which is also how they
   stay for a visitor who prefers reduced motion. "Not yet reached" is a style
   that only exists once the list is being tracked. */
function MethodSteps({ steps }) {
  const list = useRef(null)
  const reduced = usePrefersReduced()
  const [live, setLive] = useState(null)

  useEffect(() => {
    const ol = list.current
    const scroller = ol?.closest('.world-scroll')
    if (!ol || !scroller || reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const r = ol.getBoundingClientRect()
      const h = scroller.clientHeight
      const span = 0.25 * h + r.height
      const p = span > 0 ? Math.min(1, Math.max(0, (0.8 * h - r.top) / span)) : 1
      ol.style.setProperty('--run', p.toFixed(4))
      setLive(Math.min(steps.length - 1, Math.floor(p * steps.length * 1.0001)) - (p === 0 ? 1 : 0))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [steps.length, reduced])

  const tracking = live !== null
  return (
    <ol className={`w-steps ${tracking ? 'is-tracking' : ''}`} role="list" ref={list}>
      <span className="w-steps-line" aria-hidden="true"><i /></span>
      {steps.map((m, i) => (
        /* `data-lit`, never a class. The page's reveal system marks an element
           as shown by ADDING the class `is-in` to it from outside React. When
           React changes a `className` it writes the whole attribute, which
           wiped that mark: the step faded back out the moment it lit, and the
           reveal observer had already stopped watching it, so it never came
           back, scrolling up included. A data attribute leaves the class list
           alone. Never put a changing `className` on a `data-reveal` element. */
        <li key={m.k} data-reveal style={{ '--i': i }} data-lit={!tracking || i <= live ? '' : undefined}>
          <span className="w-step-n">{String(i + 1).padStart(2, '0')}</span>
          <span className="w-step-body">
            <span className="w-step-k">{m.k}</span>
            <span className="w-step-d">{m.d}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

/* The four things ORYX holds itself to, as a checklist that ticks itself, and
   beside it a document being stamped. The sentences are unchanged. Finished is
   the resting state: ticked and stamped unless the list is known to be off
   screen and waiting to be seen. */
function Holds({ holds }) {
  const ref = useRef(null)
  const state = useSeen(ref)
  return (
    <div className={`w-holds-wrap ${seenClass(state)}`} ref={ref}>
      <ul className="w-holds" role="list">
        {holds.map((h, i) => (
          <li key={h} style={{ '--i': i }}>
            <svg className="w-hold-box" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <rect x="1.5" y="1.5" width="17" height="17" />
              <path d="M5 10.5l3.4 3.4L15.2 6.4" pathLength="1" />
            </svg>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <svg className="w-doc" viewBox="0 0 220 150" aria-hidden="true" focusable="false">
        <path className="w-doc-sheet" d="M18 8h130l34 34v100H18z" />
        <path className="w-doc-fold" d="M148 8v34h34" />
        <circle className="w-doc-photo" cx="48" cy="46" r="13" />
        <path className="w-doc-photo" d="M30 76c2-10 9-14 18-14s16 4 18 14" />
        <path className="w-doc-rule" d="M80 36h52M80 50h40M80 64h58M32 96h118M32 110h96M32 124h108" />
        <g className="w-doc-stamp">
          <rect x="76" y="84" width="140" height="42" />
          <text x="146" y="101" textAnchor="middle">CHECKED FOR</text>
          <text x="146" y="117" textAnchor="middle">THIS ASSIGNMENT</text>
        </g>
      </svg>
    </div>
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
