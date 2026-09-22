import { useEffect, useRef, useState } from 'react'
import { useSmoothProgress } from '../../../lib/useReveal'
import { roles } from '../../../content/workforce'

/**
 * The crew scene: one worker, then a flex pool, then a complete project crew.
 *
 * The page promise is "From one skilled worker to a complete flex pool or
 * project crew", and everywhere else on the page that is a sentence. Here it is
 * a drawing: a scaffold in front of a building, twelve marked positions, and
 * people stepping into them one at a time as the visitor scrolls.
 *
 * It is an ILLUSTRATION of how a crew is put together, and the copy says so.
 * It must never read as people standing by. The count is the size of the crew
 * in this drawing and nothing else, so no sentence here pairs a number with
 * anything that sounds like a pool ORYX holds.
 *
 * Built the way Transport's Load is built: a tall section, a sticky frame, and
 * one smoothed number (`--p`, 0 to 1) written by `useSmoothProgress`. Each
 * person slices their own window out of it in CSS, so the sequence costs no
 * per-element JavaScript and cannot fall out of step with the scroll.
 */

/* ── The twelve positions ──────────────────────────────────────────────
   Ids from the Property and Construction sector in `workforce.js`. The name a
   visitor reads comes from the register, so the scene and the register cannot
   disagree. `fallback` is what is shown if an id is ever renamed or removed:
   the label goes slightly stale instead of the page crashing.

   Every word here is ten letters or fewer on purpose. The labels sit three
   across on a 360px phone, where a cell holds about ninety pixels of heavy
   capitals, and a twelve letter word such as "Groundworker" is wider than
   that. The stylesheet breaks an overlong word before it lets one overflow,
   so a longer name is ugly here and never broken layout. */
const CREW = [
  { id: 'carpenter', fallback: 'Carpenter' },
  { id: 'concrete-worker', fallback: 'Concrete worker' },
  { id: 'demolition-worker', fallback: 'Demolition worker' },
  { id: 'bricklayer', fallback: 'Bricklayer' },
  { id: 'masonry-assistant', fallback: 'Masonry assistant' },
  { id: 'plasterer', fallback: 'Plasterer' },
  { id: 'tiler', fallback: 'Tiler' },
  { id: 'glazier', fallback: 'Glazier' },
  { id: 'painter', fallback: 'Painter' },
  { id: 'cladding-installer', fallback: 'Cladding installer' },
  { id: 'roofer', fallback: 'Roofer' },
  /* Last, always. The supervisor arrives once there is a crew to supervise. */
  { id: 'working-foreman', fallback: 'Working foreman', lead: true },
]

const nameOf = ({ id, fallback }) => {
  const record = roles?.[id]
  return Array.isArray(record) && typeof record[0] === 'string' && record[0]
    ? record[0]
    : fallback
}

/* ── The plan ──────────────────────────────────────────────────────────
   A front view on a 720 by 430 sheet: the ground, and two scaffold levels
   above it. Three people on the ground, four on each level, and the
   supervisor on the ground to the right of the scaffold, where somebody
   running a site would actually stand. */
const GROUND = 396
const LEVEL_1 = 272
const LEVEL_2 = 148
const STANDARDS = [60, 190, 320, 450, 580]
const SPOTS = [
  [125, GROUND], [255, GROUND], [385, GROUND],
  [125, LEVEL_1], [255, LEVEL_1], [385, LEVEL_1], [515, LEVEL_1],
  [125, LEVEL_2], [255, LEVEL_2], [385, LEVEL_2], [515, LEVEL_2],
  [650, GROUND],
]

/* ── The timing ────────────────────────────────────────────────────────
   Stated once, here, and handed to the stylesheet as custom properties, so
   the counter and the drawing read the same numbers and cannot drift apart.

   The first person is on the plan from the start. The other eleven each get a
   window of `DUR`, starting `STEP` apart, and everything has landed by `HOLD`
   so the complete crew stands still for the last tenth of the scroll. */
const START = 0.04
const DUR = 0.11
const HOLD = 0.9
const STEP = (HOLD - DUR - START) / Math.max(1, CREW.length - 2)

/* -1 for the first person: their window closed before the scroll began, so
   they are simply there. */
const startOf = (i) => (i === 0 ? -1 : Number((START + (i - 1) * STEP).toFixed(4)))

/* A position counts as filled once its person is most of the way in. Counting
   at the first pixel of movement would let the number run ahead of the drawing. */
const headCount = (p) => {
  const arrived = Math.floor((p - START - DUR * 0.6) / STEP) + 1
  return 1 + Math.min(CREW.length - 1, Math.max(0, arrived))
}

const labelFor = (n) => {
  if (n <= 1) return 'One skilled worker'
  if (n < 5) return 'A small team'
  if (n < CREW.length) return 'A flex pool'
  return 'A complete project crew'
}

const pad = (n) => String(n).padStart(2, '0')

/* ── When the scene does not move ──────────────────────────────────────
   Reduced motion, and a viewport too short to hold the sticky frame (a phone
   on its side). The stylesheet collapses the section under the same query;
   this exists because the counter is text, and text cannot be set from CSS.
   Keep the two in step if either changes. */
const FLAT = '(prefers-reduced-motion: reduce), (max-height: 540px)'

function useFlat() {
  const [flat, setFlat] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(FLAT).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(FLAT)
    const onChange = (e) => setFlat(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return flat
}

export default function CrewScene() {
  const section = useRef(null)
  const flat = useFlat()

  /* Starts at the END state, not the beginning. If the scroll hook never runs
     (no scroller found, an effect that throws) the visitor is left looking at
     the complete crew, which is the true picture, and not at one person and
     eleven empty marks. The hook lowers it on its first call, which happens
     long before this section is on screen. */
  const [count, setCount] = useState(CREW.length)

  /* React drops a set to the value it already holds, so calling this on every
     frame re-renders only when somebody actually arrives or leaves. */
  useSmoothProgress(section, (p) => setCount(headCount(p)))

  const shown = flat ? CREW.length : count
  const label = labelFor(shown)

  return (
    <section
      className={`wc ${flat ? 'is-flat' : ''}`}
      id="w-crew"
      ref={section}
      aria-labelledby="w-crew-title"
      style={{ '--wc-dur': DUR }}
    >
      <div className="wc-sticky">
        <header className="wc-head">
          <p className="world-kicker" id="w-crew-title">How a crew is built</p>
          <p className="wc-line">
            An illustration: one skilled worker first, then the trades around
            them, and a foreman last.
          </p>
        </header>

        {/* Hidden from assistive technology. The value depends on how far the
            page happens to be scrolled, which means nothing when read aloud;
            the sentence above and the list below carry the same information
            in a form that does not move. */}
        <div className="wc-count" aria-hidden="true">
          <span className="wc-cap">In this drawing</span>
          {/* Keyed, so each change remounts the node and replays its small
              settle. A transform only: the number is never invisible. */}
          <span className="wc-n" key={shown}>{shown}</span>
          <span className="wc-label" key={label}>{label}</span>
        </div>

        <div className="wc-scene" aria-hidden="true">
          <svg viewBox="0 0 720 430" preserveAspectRatio="xMidYMid meet" focusable="false">
            {/* The building the scaffold stands against. Thin, because it is
                context: the people are the subject. */}
            <path className="wc-build" d="M100 396 V34 H540 V396 M90 34 H550" />
            <path
              className="wc-build wc-detail"
              d="M168 310 H212 V366 H168 Z M428 310 H472 V366 H428 Z M298 396 V330 H342 V396
                 M168 186 H212 V242 H168 Z M298 186 H342 V242 H298 Z M428 186 H472 V242 H428 Z
                 M168 62 H212 V118 H168 Z M298 62 H342 V118 H298 Z M428 62 H472 V118 H428 Z"
            />

            {/* Scaffold: standards, one guard rail per level, two braces. */}
            <path className="wc-tube" d={STANDARDS.map((x) => `M${x} ${GROUND} V84`).join(' ')} />
            <path className="wc-tube" d={`M54 ${LEVEL_1 - 44} H586 M54 ${LEVEL_2 - 44} H586`} />
            <path
              className="wc-tube wc-detail"
              d={`M450 ${GROUND} L580 ${LEVEL_1} M60 ${LEVEL_1} L190 ${LEVEL_2}`}
            />
            {/* A small stack of blocks in the one bay nobody stands in. */}
            <path
              className="wc-tube wc-detail"
              d="M492 396 V378 H540 V396 M492 387 H540 M508 378 V387 M524 387 V396"
            />

            <path className="wc-deck" d={`M54 ${LEVEL_1} H586 M54 ${LEVEL_2} H586`} />
            <path className="wc-ground" d={`M12 ${GROUND} H708`} />

            {/* To the right of the decks, clear of the supervisor's head. The
                ground needs no label. */}
            <g className="wc-detail">
              <text className="wc-tag" x="598" y={LEVEL_2 + 4}>Level 2</text>
              <text className="wc-tag" x="598" y={LEVEL_1 + 4}>Level 1</text>
            </g>

            {CREW.map((person, i) => {
              const [x, y] = SPOTS[i] || SPOTS[SPOTS.length - 1]
              return (
                /* Two groups, deliberately. The outer one places the position
                   with an SVG attribute; the inner one carries the CSS
                   transform. A CSS transform replaces a transform attribute on
                   the same element, and with the feet at the local origin the
                   person scales up from where they stand with no
                   `transform-box` to depend on. */
                <g
                  className="wc-pos"
                  key={person.id}
                  transform={`translate(${x} ${y})`}
                  style={{ '--s': startOf(i) }}
                >
                  {/* The mark is always drawn: an empty position is part of
                      the picture. The sand bar fills it as the person lands. */}
                  <path className="wc-mark" d="M-19 3 V8 H19 V3" />
                  <path className="wc-fill" d="M-19 8 H19" />
                  <text className="wc-num wc-detail" x="0" y="21">{pad(i + 1)}</text>

                  <g className="wc-person">
                    <Figure lead={person.lead} />
                  </g>
                </g>
              )
            })}
          </svg>
        </div>

        {/* The same twelve, as words. Real content, so it is a real list. */}
        <ol className="wc-roles" aria-label="The roles in this example crew">
          {CREW.map((person, i) => (
            <li
              key={person.id}
              className={[
                'wc-role',
                person.lead ? 'wc-role--lead' : '',
                i < shown ? 'is-on' : '',
              ].join(' ')}
            >
              <span className="wc-role-n" aria-hidden="true">{pad(i + 1)}</span>
              <span className="wc-role-k">{nameOf(person)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/**
 * One person, drawn around their own feet at 0,0.
 *
 * The ORYX uniform is a black vest and a black helmet, and black kit on a
 * near-black page is invisible. So the figure is drawn in light outline, the
 * vest and helmet are filled Oryx Black, and the vest trim, its two reflective
 * strips and the helmet badge are sand: black kit edged in gold.
 *
 * The supervisor is the one white shape in the drawing: a white shirt, no
 * vest, and a tablet. That is the whole of how they are told apart, so nobody
 * else gets any white.
 *
 * The helmet is a chamfered crown, not a dome. Nothing in the brand is
 * rounded except a true circle, and the head is the circle.
 */
function Figure({ lead }) {
  return (
    <g className={`wc-fig ${lead ? 'wc-fig--lead' : ''}`}>
      <path className="wc-leg" d="M-11 -36 H-2 V0 H-11 Z M2 -36 H11 V0 H2 Z" />
      <path className="wc-shirt" d="M-22 -71 H-16 V-42 H-22 Z M16 -71 H22 V-42 H16 Z" />
      <path className="wc-shirt" d="M-16 -72 H16 L13 -36 H-13 Z" />

      {lead ? (
        <>
          <path className="wc-collar" d="M-5 -72 L0 -65 L5 -72 M0 -65 V-38" />
          <rect className="wc-tablet" x="7" y="-62" width="17" height="23" />
          <path className="wc-tablet-l" d="M10.5 -55.5 H20.5 M10.5 -50.5 H20.5 M10.5 -45.5 H17" />
        </>
      ) : (
        <>
          <path className="wc-vest" d="M-13 -72 H-5 L0 -64 L5 -72 H13 L11.5 -38 H-11.5 Z" />
          <path className="wc-strip" d="M-10.9 -57 H10.9 M-10.5 -47 H10.5" />
        </>
      )}

      <circle className="wc-head" cx="0" cy="-80" r="7.5" />
      <path className="wc-hat" d="M-9.5 -84 L-8 -91 L-4 -95 H4 L8 -91 L9.5 -84 Z" />
      <path className="wc-brim" d="M-11 -84 H11" />
      <rect className="wc-badge" x="-2" y="-92" width="4" height="4" />
    </g>
  )
}
