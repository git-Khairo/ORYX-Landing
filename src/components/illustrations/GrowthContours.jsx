/**
 * Sustainability section illustration — abstract topographic contour lines
 * (like elevation / growth rings) in sage tones. Geometric, calm, on-brand.
 */
export default function GrowthContours({ className = '' }) {
  // stacked wavy contour lines
  const lines = Array.from({ length: 11 }).map((_, i) => {
    const y = 120 + i * 66
    const amp = 26 + (i % 3) * 14
    return `M-20 ${y} C 300 ${y - amp}, 560 ${y + amp}, 860 ${y - amp * 0.6} S 1400 ${y + amp}, 1620 ${y - amp * 0.4}`
  })
  return (
    <svg viewBox="0 0 1600 900" className={`illus ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="gc-glow" cx="0.72" cy="0.3" r="0.5">
          <stop offset="0" stopColor="#c2cc98" stopOpacity="0.5" />
          <stop offset="1" stopColor="#c2cc98" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#gc-glow)" />
      <g fill="none" stroke="#7d8a5f">
        {lines.map((d, i) => (
          <path key={i} d={d} strokeWidth={i % 2 ? 1 : 1.6} strokeOpacity={0.18 + (i / lines.length) * 0.28} />
        ))}
      </g>
      {/* a couple of closed contour "islands" for depth */}
      <g fill="none" stroke="#7d8a5f" strokeOpacity="0.4">
        <ellipse cx="1150" cy="300" rx="120" ry="80" transform="rotate(-12 1150 300)" />
        <ellipse cx="1150" cy="300" rx="70" ry="46" transform="rotate(-12 1150 300)" />
        <ellipse cx="1150" cy="300" rx="26" ry="18" transform="rotate(-12 1150 300)" />
      </g>
    </svg>
  )
}
