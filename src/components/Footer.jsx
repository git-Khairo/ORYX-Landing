import OryxMark, { Wordmark } from './OryxMark'
import { brand, journey, services } from '../content/copy'
import { scrollToId } from '../lib/scrollTo'

/**
 * The page had no footer at all — the closing statement simply ran out.
 *
 * It lives inside the statement section rather than as its own screen: with
 * full-screen paging, a footer that owned a whole viewport would make the last
 * gesture of the page land on legal text. Here the statement holds the room and
 * the footer sits at its foot, where a footer belongs.
 */
export default function Footer({ onRequest }) {
  const year = new Date().getFullYear()

  return (
    <footer className="site-foot">
      <div className="site-foot-grid">
        <div className="site-foot-brand">
          <span className="site-foot-mark">
            <OryxMark size={22} strokeWidth={2.6} />
            <Wordmark />
          </span>
          <p>{brand.promise}</p>
          <button type="button" className="site-foot-cta" onClick={() => onRequest?.('')}>
            Start a request <i aria-hidden="true">→</i>
          </button>
        </div>

        <nav className="site-foot-col" aria-label="Services">
          <h3>Services</h3>
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => onRequest?.(s.id)}>{s.title}</button>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="site-foot-col" aria-label="Sections">
          <h3>The journey</h3>
          <ul>
            {journey.slice(1, 6).map((j) => (
              <li key={j.id}>
                <button type="button" onClick={() => scrollToId(j.id)}>{j.label}</button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-foot-col">
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:hello@oryx.example">hello@oryx.example</a></li>
            <li><a href="tel:+31000000000">+31 (0)00 000 0000</a></li>
            <li className="site-foot-place">Netherlands</li>
          </ul>
        </div>
      </div>

      <div className="site-foot-base">
        <span>© {year} {brand.name}. All rights reserved.</span>
        <span className="site-foot-legal">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </span>
        <span className="site-foot-tag">{brand.tagline}</span>
      </div>
    </footer>
  )
}
