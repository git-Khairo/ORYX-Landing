import { brand } from '../content/copy'

/**
 * A compact glass pill: the mark on one side, one action on the other.
 *
 * No link list. The services are three rows filling the screen directly below
 * and the pillars are beside them — a menu here would only point at things
 * already visible.
 *
 * It floats clear of the layout, so no section reserves height for it and
 * section two runs straight up under the bar to meet the hero.
 */
export default function Nav() {
  return (
    <header className="nav">
      <a className="nav-mark" href="#hero">
        {/* Painted from the mask, not an inverted PNG — the mark is sand here
            and has to be able to change colour on hover. */}
        <i aria-hidden="true" />
        <span>{brand.name}</span>
      </a>

      <a className="nav-cta" href="#contact">
        Contact <i aria-hidden="true">→</i>
      </a>
    </header>
  )
}
