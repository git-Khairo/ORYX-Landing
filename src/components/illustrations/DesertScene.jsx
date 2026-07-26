/**
 * A richer illustrated desert scene (not line-art): layered dunes with warm
 * gradients, a soft sun, an orbital ring, and film grain. Themeable per section
 * via `variant`. Self-contained SVG — scales crisply, no external assets.
 */
const VARIANTS = {
  dawn: { sky: ['#fbf9f5', '#f4efe6', '#efe6d6'], sun: '#e8c88a', sun2: '#d9b877', d1: ['#e9dcc2', '#e2d2b4'], d2: ['#dcc9a6', '#cbb488'], d3: ['#c9a66b', '#b48a50'], ring: '#b48a50' },
  leaf: { sky: ['#fbf9f5', '#f1efe4', '#e7ecd9'], sun: '#c2cc98', sun2: '#9aa876', d1: ['#e6e4cf', '#dcdcbe'], d2: ['#cdd0a6', '#bcc492'], d3: ['#9aa86a', '#7d8a5f'], ring: '#7d8a5f' },
  cool: { sky: ['#fbfaf8', '#efedea', '#e5e2dc'], sun: '#d3cdc2', sun2: '#b9b3a6', d1: ['#e4e1da', '#d9d5cc'], d2: ['#cfcabf', '#bdb7aa'], d3: ['#a89f90', '#8a8478'], ring: '#8a8478' },
  deep: { sky: ['#f6efe2', '#efe2cd', '#e6d4b6'], sun: '#e0b878', sun2: '#c99a52', d1: ['#e4d3b2', '#d8c39a'], d2: ['#cdb488', '#b99a63'], d3: ['#b48a50', '#9a723c'], ring: '#9a723c' },
}

export default function DesertScene({ className = '', variant = 'dawn' }) {
  const v = VARIANTS[variant] || VARIANTS.dawn
  const id = variant // unique-enough suffix per variant
  return (
    <svg viewBox="0 0 1600 900" className={`desert-scene ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={v.sky[0]} />
          <stop offset="0.62" stopColor={v.sky[1]} />
          <stop offset="1" stopColor={v.sky[2]} />
        </linearGradient>
        <radialGradient id={`sun-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={v.sun} stopOpacity="0.9" />
          <stop offset="0.55" stopColor={v.sun2} stopOpacity="0.42" />
          <stop offset="1" stopColor={v.sun2} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`d1-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={v.d1[0]} /><stop offset="1" stopColor={v.d1[1]} />
        </linearGradient>
        <linearGradient id={`d2-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={v.d2[0]} /><stop offset="1" stopColor={v.d2[1]} />
        </linearGradient>
        <linearGradient id={`d3-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={v.d3[0]} /><stop offset="1" stopColor={v.d3[1]} />
        </linearGradient>
        <filter id={`grain-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill={`url(#sky-${id})`} />
      <circle cx="560" cy="430" r="360" fill={`url(#sun-${id})`} />
      <ellipse cx="560" cy="430" rx="250" ry="250" fill="none" stroke={v.ring} strokeOpacity="0.3" />

      <path d="M0 560 C 380 500, 620 590, 900 552 C 1180 516, 1360 560, 1600 534 L1600 900 L0 900 Z" fill={`url(#d1-${id})`} />
      <path d="M0 660 C 300 600, 700 690, 1020 636 C 1280 592, 1460 648, 1600 628 L1600 900 L0 900 Z" fill={`url(#d2-${id})`} />
      <path d="M0 740 C 360 690, 760 770, 1080 726 C 1340 690, 1480 740, 1600 724 L1600 900 L0 900 Z" fill={`url(#d3-${id})`} />

      <rect width="1600" height="900" filter={`url(#grain-${id})`} opacity="0.06" />
    </svg>
  )
}
