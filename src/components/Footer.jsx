import OryxMark, { Wordmark } from './OryxMark'
import { brand, services } from '../content/copy'

/**
 * A slim full-width bar at the foot of the closing statement.
 *
 * It used to be a four-column grid that owned most of a screen — which is why
 * the statement could not fit one viewport and had to be scrolled to rather
 * than zoomed into. Reduced to a single frosted strip, it sits under the
 * statement inside the same screen, so the closing frame can zoom straight to
 * the finished page, footer and all. The blur runs the whole width.
 */
export default function Footer({ onRequest }) {
  const year = new Date().getFullYear()

  return (
    <footer className="site-foot">
      <div className="site-foot-bar">
        <span className="site-foot-mark">
          <OryxMark size={20} strokeWidth={2.6} />
          <Wordmark />
        </span>

        <nav className="site-foot-links" aria-label="Services">
          {services.map((s) => (
            <button key={s.id} type="button" onClick={() => onRequest?.(s.id)}>
              {s.title}
            </button>
          ))}
          <a href="mailto:hello@oryx.example">Contact</a>
        </nav>

        <button type="button" className="site-foot-cta" onClick={() => onRequest?.('')}>
          Start a request <i aria-hidden="true">→</i>
        </button>
      </div>

      <div className="site-foot-base">
        <span>© {year} {brand.name}. All rights reserved.</span>
        <span className="site-foot-tag">{brand.tagline}</span>
      </div>
    </footer>
  )
}
