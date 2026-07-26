/**
 * Minimal emblem of the oryx's iconic long ringed horns — an elegant, abstract
 * stand-in for the brand character (kept deliberately simple/graphic rather than
 * a figurative drawing). Inherits `currentColor`. A realistic oryx image can be
 * dropped in later once available.
 */
export default function OryxMark({ className = '' }) {
  const lu = (u) => [192 - 40 * u, 402 - 356 * u] // left horn centerline point
  const ru = (u) => [208 + 40 * u, 402 - 356 * u] // right horn centerline point
  const ticks = [0.14, 0.28, 0.42, 0.56, 0.7, 0.82]
  return (
    <svg viewBox="0 0 400 440" className={`oryx-mark ${className}`} fill="none"
         stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      {/* subtle head crown */}
      <path d="M188 404 C 194 396, 206 396, 212 404" strokeWidth="4" />
      {/* the two long horns */}
      <path d="M192 402 C 184 292, 168 150, 152 46" />
      <path d="M208 402 C 216 292, 232 150, 248 46" />
      {/* horn rings */}
      {ticks.map((u, i) => {
        const [lx, ly] = lu(u)
        const [rx, ry] = ru(u)
        return (
          <g key={i} strokeWidth="3" opacity="0.75">
            <line x1={lx - 8} y1={ly + 3} x2={lx + 8} y2={ly - 2} />
            <line x1={rx - 8} y1={ry - 2} x2={rx + 8} y2={ry + 3} />
          </g>
        )
      })}
    </svg>
  )
}
