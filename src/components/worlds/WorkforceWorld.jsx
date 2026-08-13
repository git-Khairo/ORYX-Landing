import WorldShell, { Media, WorldClose } from './WorldShell'
import { film, portal, gallery, closing } from '../../content/media'

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
      {/* ── Opening ───────────────────────────────────────────────────── */}
      <header className="w-open">
        <Media clip={film.workforce} />
        <div className="w-open-copy">
          <p className="world-eyebrow" data-reveal>{service.index} · Service</p>
          <h2 data-reveal>{service.title}</h2>
          <p className="world-promise" data-reveal>{service.promise}</p>
        </div>
      </header>

      {/* ── The shift ─────────────────────────────────────────────────
          The timetable is the layout, not an illustration of one. Times sit in
          their own gutter and the blocks hang off them, so the page is read the
          way a rota is read. */}
      <section className="w-shift">
        <div className="w-shift-intro">
          <p className="world-kicker" data-reveal>A shift, end to end</p>
          <p className="world-lede" data-reveal>{world.lede}</p>
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

      {/* ── The crew ──────────────────────────────────────────────────
          Badges rather than cards: an ID badge is the object this service
          actually hands over, and it carries a role and a name for what the
          role covers without needing a paragraph. They stagger in as the grid
          is reached, so the crew assembles while you read it. */}
      <section className="w-crew">
        <div className="w-crew-head">
          <p className="world-kicker" data-reveal>Who turns up</p>
          <p className="world-line" data-reveal>
            Vetted, inducted and insured before they reach your door.
          </p>
        </div>

        <ul className="w-badges">
          {world.crew.map((c, i) => (
            <li className="w-badge" key={c.r} data-reveal style={{ '--i': i }}>
              <span className="w-badge-strip" aria-hidden="true" />
              <span className="w-badge-r">{c.r}</span>
              <span className="w-badge-n">{c.n}</span>
              <span className="w-badge-mark" aria-hidden="true" />
            </li>
          ))}
        </ul>

        <figure className="w-crew-shot" data-reveal>
          <img src={shots[0]?.src} alt={shots[0]?.alt || ''} loading="lazy" />
        </figure>
      </section>

      {/* ── The day ───────────────────────────────────────────────────
          A dial. The rest of this page is rectangles — a shift timetable, a
          badge wall, a week rota — and a fourth grid would have been the
          fourth way of saying the same thing. A clock is the one shape that
          reads as "hours covered" on sight, and it is the only circular thing
          on the site, so the page cannot be confused with any other. */}
      <section className="w-day-block">
        <div className="w-day-head">
          <p className="world-kicker" data-reveal>A day, covered</p>
          <p className="world-line" data-reveal>
            Shifts overlap at handover and run through the night. The one
            rectangular rota cannot draw is the one that crosses midnight.
          </p>
        </div>

        <figure className="w-dial" data-reveal>
          <svg viewBox="0 0 460 460" role="img" aria-label="Shift coverage across a 24-hour day">
            {/* Rotated so hour zero is at the top; SVG circles start at three
                o'clock, which would put midnight on the right. */}
            <g transform="rotate(-90 230 230)">
              {world.dial.map((s, i) => {
                /* Hours the shift runs, wrapping past midnight when it has to. */
                const hours = (s.t - s.f + 24) % 24 || 24
                return (
                  <g key={s.k}>
                    <circle
                      className="w-dial-rail"
                      cx="230" cy="230" r={96 + i * 22}
                      pathLength="24"
                    />
                    <circle
                      className="w-dial-arc"
                      cx="230" cy="230" r={96 + i * 22}
                      /* pathLength 24 makes one unit of the dash pattern equal
                         one hour, so the arc is authored in the same units as
                         the data and needs no trigonometry. */
                      pathLength="24"
                      style={{ '--hours': hours, '--from': -s.f, '--i': i }}
                    />
                  </g>
                )
              })}
            </g>

            {/* Quarter marks, so the ring positions can be read as times. */}
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

          <ul className="w-dial-key">
            {world.dial.map((s, i) => (
              <li key={s.k} style={{ '--i': i }}>
                <span className="w-dial-swatch" aria-hidden="true" />
                <span className="w-dial-k">{s.k}</span>
                <span className="w-dial-t">
                  {String(s.f).padStart(2, '0')}:00 — {String(s.t).padStart(2, '0')}:00
                </span>
              </li>
            ))}
          </ul>
        </figure>
      </section>

      {/* ── The week ──────────────────────────────────────────────────
          A rota, rendered as a rota. Transport has a map; this page has the
          grid every operations manager already reads, which is the fastest way
          to say "staffing" without saying it. The uneven shape is the honest
          part — cover is not flat across a week, and showing that is more
          convincing than claiming full coverage everywhere. */}
      <section className="w-roster">
        <div className="w-roster-head">
          <p className="world-kicker" data-reveal>A week of cover</p>
          <p className="world-line" data-reveal>
            Agreed once, then held — including the weekend shifts most rotas
            quietly leave thin.
          </p>
        </div>

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
                  /* The visual grid is decorative repetition; the sentence is
                     what a screen reader should get. */
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
      </section>

      {/* ── What it is ────────────────────────────────────────────────── */}
      <section className="w-define">
        {world.definition.map((it) => (
          <article className="w-define-row" key={it.k} data-reveal>
            <h3>{it.k}</h3>
            <p>{it.d}</p>
          </article>
        ))}
      </section>

      {/* ── Interlude ─────────────────────────────────────────────────── */}
      <section className="w-interlude">
        <Media clip={portal.workforce} />
        <p className="w-interlude-line" data-reveal>{service.body}</p>
      </section>

      {/* ── Proof and audience ────────────────────────────────────────── */}
      <section className="w-proof">
        <ul className="w-figs">
          {world.figures.map((f) => (
            <li key={f.l} data-reveal>
              <span className="w-fig-n">{f.n}</span>
              <span className="w-fig-l">{f.l}</span>
            </li>
          ))}
        </ul>

        <div className="w-for" data-reveal>
          <p className="w-for-line">{world.audience.line}</p>
          <dl className="w-sectors">
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
      <section className="w-inside-block">
        <div className="w-inside-copy">
          <p className="world-kicker" data-reveal>What&rsquo;s inside</p>
          <p className="world-line" data-reveal>
            Everything below sits under one agreement, with one point of contact.
          </p>
          <ol className="w-inside">
            {world.inside.map((it, i) => (
              <li key={it.k} data-reveal>
                <span className="w-inside-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="w-inside-body">
                  <span className="w-inside-k">{it.k}</span>
                  <span className="w-inside-d">{it.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* shots[1], not shots[2]: the third workforce photograph is dominated
            by a hi-vis orange vest, the one saturated primary in the whole
            library, and at this size it pulled the eye straight off the page
            and out of the palette. */}
        <figure className="w-inside-shot" data-reveal>
          <img src={shots[1]?.src} alt={shots[1]?.alt || ''} loading="lazy" />
        </figure>
      </section>

      <WorldClose
        service={service}
        clip={closing.workforce}
        onClose={onClose}
        onRequest={onRequest}
      />
    </WorldShell>
  )
}
