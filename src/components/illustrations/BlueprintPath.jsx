/**
 * Process section illustration — a blueprint step-path: numbered nodes joined by
 * a dashed route over a faint technical grid. Geometric, on-brand.
 */
const STEPS = [
  [230, 640], [640, 430], [1010, 560], [1360, 300],
]

export default function BlueprintPath({ className = '' }) {
  const d = `M${STEPS[0][0]} ${STEPS[0][1]} C 430 560, 480 470, ${STEPS[1][0]} ${STEPS[1][1]} S 900 640, ${STEPS[2][0]} ${STEPS[2][1]} S 1260 360, ${STEPS[3][0]} ${STEPS[3][1]}`
  return (
    <svg viewBox="0 0 1600 900" className={`illus ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="bp-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M80 0 L0 0 0 80" fill="none" stroke="#8a8478" strokeOpacity="0.14" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#bp-grid)" />

      {/* route */}
      <path d={d} fill="none" stroke="#b48a50" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="2 10" strokeLinecap="round" />

      {/* nodes */}
      {STEPS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="26" fill="#f4efe6" stroke="#b48a50" strokeOpacity="0.6" />
          <circle cx={x} cy={y} r="5" fill="#b48a50" />
          <text x={x} y={y - 40} textAnchor="middle" fontFamily="monospace" fontSize="22" fill="#9a723c" opacity="0.7">
            {String(i + 1).padStart(2, '0')}
          </text>
        </g>
      ))}
    </svg>
  )
}
