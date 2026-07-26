/**
 * Minimal line pictograms for the three services. Inherit currentColor.
 */
export default function ServiceIcon({ id, className = '' }) {
  const common = {
    className: `svc-icon ${className}`,
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  if (id === 'cleaning') {
    return (
      <svg {...common}>
        {/* sparkle / shine — cleanliness */}
        <path d="M32 10 C 34 22, 42 30, 54 32 C 42 34, 34 42, 32 54 C 30 42, 22 34, 10 32 C 22 30, 30 22, 32 10 Z" />
        <path d="M50 12 C 51 15, 53 17, 56 18 C 53 19, 51 21, 50 24 C 49 21, 47 19, 44 18 C 47 17, 49 15, 50 12 Z" />
        <circle cx="15" cy="49" r="2.4" />
      </svg>
    )
  }
  if (id === 'delivery') {
    return (
      <svg {...common}>
        {/* parcel + motion */}
        <path d="M20 22 L36 15 L52 22 L52 40 L36 47 L20 40 Z" />
        <path d="M20 22 L36 29 L52 22 M36 29 L36 47" />
        <path d="M6 27 H14 M4 34 H12 M8 41 H15" />
      </svg>
    )
  }
  // facility
  return (
    <svg {...common}>
      {/* building + managed check */}
      <path d="M14 54 V20 L32 12 L50 20 V54" />
      <path d="M14 54 H50" />
      <path d="M23 30 H27 M37 30 H41 M23 40 H27 M37 40 H41" />
      <path d="M40 46 l3 3 l6 -7" />
    </svg>
  )
}
