import { brand } from '../content/copy'

/**
 * A bar, not a pill.
 *
 * The glass pill belonged to a different design language — soft, floating,
 * rounded — and nothing else on the site speaks it any more. The gateway and
 * the footer are flat, ruled and typographic, with sand kept for accents and
 * slashes doing the separating, so the navigation is built the same way.
 *
 * It has no background of its own. The gateway is height-locked to exactly one
 * screen and the doors run its full height; an opaque bar would eat into that
 * composition and push the doors' titles down. A soft scrim at the very top of
 * the frame carries the legibility instead, which costs no layout at all.
 */
export default function Nav() {
  return (
    <header className="nav">
      <a className="nav-mark" href="#work">
        <i aria-hidden="true" />
        <span>{brand.full}</span>
      </a>

      {/* Slash-separated, the way the descriptor and the legal line are. Two
          items only — the three services are the page directly below, and a
          menu pointing at what is already on screen is furniture. */}
      <nav className="nav-links" aria-label="Primary">
        <a href="#work">Services</a>
        <span aria-hidden="true">/</span>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  )
}
