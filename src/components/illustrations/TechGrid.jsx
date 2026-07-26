/**
 * Technology section illustration — an abstract data network: nodes connected by
 * thin lines over a faint dot grid, with a radar sweep. Geometric, on-brand.
 */
const NODES = [
  [200, 230], [430, 150], [370, 380], [650, 270], [560, 500],
  [830, 190], [910, 410], [1130, 300], [1250, 540], [1040, 640], [730, 650],
]
const EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [3, 5], [5, 6], [4, 6],
  [6, 7], [7, 8], [6, 9], [9, 10], [4, 10], [7, 9], [10, 8],
]

export default function TechGrid({ className = '' }) {
  return (
    <svg viewBox="0 0 1600 900" className={`illus ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="tg-dots" width="46" height="46" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill="#8a8478" opacity="0.28" />
        </pattern>
        <radialGradient id="tg-fade" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0.55" stopColor="#f4efe6" stopOpacity="0" />
          <stop offset="1" stopColor="#f4efe6" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#tg-dots)" />

      {/* edges */}
      <g stroke="#b48a50" strokeWidth="1.2" strokeOpacity="0.4">
        {EDGES.map(([a, b], i) => (
          <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
      </g>

      {/* radar rings around one node */}
      <g fill="none" stroke="#b48a50" strokeOpacity="0.3">
        <circle cx={650} cy={270} r="60" />
        <circle cx={650} cy={270} r="110" strokeOpacity="0.18" />
        <circle cx={650} cy={270} r="165" strokeOpacity="0.1" />
      </g>

      {/* nodes */}
      {NODES.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i % 3 === 0 ? 7 : 4.5} fill="#b48a50" />
          {i % 3 === 0 && <circle cx={x} cy={y} r="14" fill="none" stroke="#b48a50" strokeOpacity="0.4" />}
        </g>
      ))}

      <rect width="1600" height="900" fill="url(#tg-fade)" />
    </svg>
  )
}
