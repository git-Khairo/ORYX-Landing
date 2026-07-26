/**
 * Why-ORYX illustration — many fine lines converging to one point: the four
 * pillars (technology, European quality, Arabic hospitality, sustainability)
 * becoming a single experience. Abstract, on-brand.
 */
const CX = 800
const CY = 300
const N = 30

export default function ConvergenceLines({ className = '' }) {
  const rays = Array.from({ length: N }).map((_, i) => {
    const a = (i / N) * Math.PI * 2
    const r = 640 + (i % 4) * 40
    return {
      x1: CX + Math.cos(a) * r,
      y1: CY + Math.sin(a) * r,
      x2: CX + Math.cos(a) * 46,
      y2: CY + Math.sin(a) * 46,
      o: 0.08 + (i % 5) * 0.03,
    }
  })
  return (
    <svg viewBox="0 0 1600 900" className={`illus ${className}`} preserveAspectRatio="xMidYMid slice">
      <g stroke="#b48a50">
        {rays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} strokeWidth="1" strokeOpacity={r.o} />
        ))}
      </g>
      <g fill="none" stroke="#b48a50">
        <circle cx={CX} cy={CY} r="46" strokeOpacity="0.5" />
        <circle cx={CX} cy={CY} r="90" strokeOpacity="0.28" />
        <circle cx={CX} cy={CY} r="150" strokeOpacity="0.14" />
      </g>
      <circle cx={CX} cy={CY} r="6" fill="#b48a50" />
    </svg>
  )
}
