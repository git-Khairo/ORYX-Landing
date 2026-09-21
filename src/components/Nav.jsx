import { brand } from '../content/copy'
import { SoundToggle } from './Sound'

/**
 * A bar, not a pill.
 *
 * The glass pill belonged to a different design language (soft, floating,
 * rounded) and nothing else on the site speaks it any more. The gateway and
 * the footer are flat, ruled and typographic, with sand kept for accents and
 * slashes doing the separating, so the navigation is built the same way.
 *
 * It has no background of its own. The gateway is height-locked to exactly one
 * screen and the doors run its full height; an opaque bar would eat into that
 * composition and push the doors' titles down. A soft scrim at the very top of
 * the frame carries the legibility instead, which costs no layout at all.
 */
export default function Nav({ onRequest }) {
  return (
    <header className="nav">
      <a className="nav-mark" href="#work">
        <i aria-hidden="true" />
        <span>{brand.full}</span>
      </a>

      {/* Slash-separated, the way the descriptor and the legal line are. The
          sound switch lives here now instead of floating in a corner, and the
          request button is the one call to action the bar carries. */}
      <div className="nav-right">
        <nav className="nav-links" aria-label="Primary">
          <a href="#work">Services</a>
          <span aria-hidden="true">/</span>
          <a href="#contact">Contact</a>
        </nav>
        <SoundToggle />
        {/* The full label for anyone who can see it or hear it; the short one
            only where a phone would otherwise wrap the wordmark. */}
        <button type="button" className="nav-cta" onClick={onRequest} aria-label="Request a service">
          <span className="nav-cta-full">Request a service</span>
          <span className="nav-cta-short" aria-hidden="true">Request</span>
        </button>
      </div>
    </header>
  )
}
