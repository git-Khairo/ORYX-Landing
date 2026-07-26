import { useScrollTilt } from '../lib/useScrollTilt'

/**
 * A card that rotates in 3D as it scrolls through the viewport (Active
 * Theory-style). The outer element owns the tilt transform; the inner element
 * receives the card styling, so scroll-reveal and hover transforms on the
 * inner never fight the tilt.
 */
export default function TiltCard({ className = '', children, max, axis, lift, ...rest }) {
  const ref = useScrollTilt({ max, axis, lift })
  return (
    <div className="tilt-card" ref={ref}>
      <div className={className} {...rest}>
        {children}
      </div>
    </div>
  )
}
