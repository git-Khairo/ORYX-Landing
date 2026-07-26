/**
 * Statement illustration (dark section) — a minimal gold constellation with a
 * faint horizon line. Transparent background so the charcoal section shows.
 */
const STARS = [
  [180, 200], [340, 320], [520, 180], [610, 360], [760, 260],
  [900, 420], [1040, 240], [1180, 380], [1320, 200], [1420, 420],
  [700, 520], [980, 560], [260, 480],
]
const LINKS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
  [3, 10], [5, 11], [1, 12],
]

export default function Constellation({ className = '' }) {
  return (
    <svg viewBox="0 0 1600 900" className={`illus ${className}`} preserveAspectRatio="xMidYMid slice">
      <g stroke="#c9a66b" strokeOpacity="0.28" strokeWidth="1">
        {LINKS.map(([a, b], i) => (
          <line key={i} x1={STARS[a][0]} y1={STARS[a][1]} x2={STARS[b][0]} y2={STARS[b][1]} />
        ))}
      </g>
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 3.6 : 2.2} fill="#e6c98a" opacity={0.7} />
      ))}
      {/* faint horizon */}
      <line x1="0" y1="720" x2="1600" y2="720" stroke="#c9a66b" strokeOpacity="0.16" />
      <path d="M0 720 C 420 690, 900 742, 1600 706" fill="none" stroke="#c9a66b" strokeOpacity="0.1" />
    </svg>
  )
}
