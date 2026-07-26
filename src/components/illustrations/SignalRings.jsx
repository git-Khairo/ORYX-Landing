/**
 * Contact illustration — concentric signal rings radiating from a point, with a
 * few connection nodes: reaching out / staying in touch. Abstract, on-brand.
 */
const CX = 1200
const CY = 470

export default function SignalRings({ className = '' }) {
  const rings = [60, 130, 210, 300, 400, 510]
  const nodes = [
    [CX, CY], [CX - 130, CY - 60], [CX - 300, CY + 40], [CX - 210, CY + 200],
  ]
  return (
    <svg viewBox="0 0 1600 900" className={`illus ${className}`} preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="#b48a50">
        {rings.map((r, i) => (
          <circle key={i} cx={CX} cy={CY} r={r} strokeWidth="1.2" strokeOpacity={0.42 - i * 0.06} />
        ))}
      </g>
      <g stroke="#b48a50" strokeOpacity="0.3" strokeWidth="1">
        {nodes.slice(1).map(([x, y], i) => (
          <line key={i} x1={CX} y1={CY} x2={x} y2={y} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 7 : 4.5} fill="#b48a50" />
      ))}
    </svg>
  )
}
