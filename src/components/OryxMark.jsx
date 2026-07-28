/**
 * The ORYX brand mark.
 *
 * An abstract line silhouette: two long horns sweeping back over a head
 * profile, reduced to the fewest strokes that still read as alert. It is a
 * mark, not a mascot — it never speaks and never performs.
 *
 * Taken from the brand system rather than re-drawn, so the site and the
 * identity cannot drift apart. `draw` animates the strokes on as if a route
 * line were forming the mark, which is what the opening moment uses.
 */
export default function OryxMark({
  size = 40,
  className = '',
  draw = false,
  duration = 1.1,
  strokeWidth = 2.2,
}) {
  const style = draw
    ? {
        strokeDasharray: 140,
        strokeDashoffset: 140,
        animation: `oryx-draw ${duration}s cubic-bezier(0.16,1,0.3,1) forwards`,
      }
    : undefined

  const delayed = (delay) => (style ? { ...style, animationDelay: delay } : undefined)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`oryx-mark-svg ${className}`}
    >
      <path d="M23 41 Q35 24 52 7" style={style} />
      <path d="M15 38 Q28 20 41 5" style={delayed('0.08s')} />
      <path d="M23 41 Q16 47 17 55 Q18 61 27 61" style={delayed('0.16s')} />
      <path d="M15 38 L23 41" style={delayed('0.22s')} />
    </svg>
  )
}

/** The wordmark, at the identity's own tracking. */
export function Wordmark({ className = '' }) {
  return <span className={`oryx-wordmark ${className}`}>ORYX</span>
}
