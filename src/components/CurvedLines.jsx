/**
 * The hero's background illustration: a bundle of long curves sweeping left to
 * right, like routes crossing a map — with light running along them.
 *
 * Each curve is drawn twice. The first pass is the static rail. The second is a
 * short dash of brighter amber that travels the same path, which is what makes
 * the field feel powered rather than printed.
 *
 * The travelling dash relies on `pathLength="1"`: it renormalises every path to
 * a length of 1 regardless of its real geometry, so one set of dash values
 * works for all of them and the timing does not have to be hand-tuned per
 * curve. Without it each dash would need its own numbers measured from the
 * path, and they would break the moment a curve changed.
 *
 * It is drawn once and used at both scales — full-bleed behind the hero, and
 * again inside the logo card — because the card is meant to read as the hero
 * shrunk down, and it can only do that if it is made of the same parts.
 * `preserveAspectRatio="none"` lets the same paths stretch to fill a wide hero
 * or a narrow card without needing two drawings.
 */
const LINES = [
  { d: 'M-40 250 Q 240 120 520 190 T 1080 120', o: 0.55, dur: 9, delay: 0 },
  { d: 'M-40 300 Q 260 180 540 250 T 1080 190', o: 0.4, dur: 11, delay: 1.4 },
  { d: 'M-40 355 Q 250 250 560 315 T 1080 265', o: 0.3, dur: 13, delay: 3.1 },
  { d: 'M-40 200 Q 280 90 560 140 T 1080 60', o: 0.35, dur: 10, delay: 2.2 },
  { d: 'M-40 410 Q 270 330 570 380 T 1080 340', o: 0.22, dur: 14, delay: 4.6 },
  { d: 'M-40 150 Q 300 40 600 96 T 1080 20', o: 0.26, dur: 12, delay: 5.8 },
  { d: 'M-40 460 Q 300 400 620 435 T 1080 400', o: 0.2, dur: 15, delay: 0.7 },
  { d: 'M-40 275 Q 210 210 520 232 T 1080 155', o: 0.3, dur: 8.5, delay: 6.4 },
  { d: 'M-40 330 Q 320 285 640 300 T 1080 230', o: 0.24, dur: 12.5, delay: 3.8 },
  { d: 'M-40 385 Q 230 300 540 350 T 1080 300', o: 0.28, dur: 10.5, delay: 7.6 },
]

export default function CurvedLines({ className = '' }) {
  return (
    <svg
      className={`curved-lines ${className}`}
      viewBox="0 0 1040 480"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Fades both ends so the lines arrive from off-frame and leave again,
            rather than starting and stopping inside the composition. */}
        <linearGradient id="cl-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.22" stopColor="currentColor" stopOpacity="1" />
          <stop offset="0.78" stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {LINES.map((l, i) => (
        <g key={i}>
          <path
            d={l.d}
            stroke="url(#cl-fade)"
            strokeWidth="1.25"
            strokeOpacity={l.o}
            vectorEffect="non-scaling-stroke"
          />
          {/* The light. A wide, soft pass and a narrow, bright one on the same
              dash — cheaper and crisper than an SVG blur filter, which would be
              re-rasterised every frame for all ten curves. */}
          <path
            className="cl-pulse cl-pulse--glow"
            d={l.d}
            pathLength="1"
            strokeWidth="5"
            vectorEffect="non-scaling-stroke"
            style={{ '--dur': `${l.dur}s`, '--delay': `${-l.delay}s` }}
          />
          <path
            className="cl-pulse cl-pulse--core"
            d={l.d}
            pathLength="1"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
            style={{ '--dur': `${l.dur}s`, '--delay': `${-l.delay}s` }}
          />
        </g>
      ))}
    </svg>
  )
}
