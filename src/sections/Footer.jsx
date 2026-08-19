import { brand, services } from '../content/copy'

/**
 * The other bookend.
 *
 * The gateway runs the group's name down its right-hand edge; this runs it
 * down the left. The two face each other across the page, so the site opens
 * and closes on the same gesture.
 *
 * The services are quiet links in a column here, not a numbered index. They
 * were set as one before — full-width rows, names in display capitals — and it
 * made the middle of the footer the loudest thing on the page, competing with
 * the gateway that had just shown the same three doors properly. A footer is
 * somewhere you go to look something up; it should be scanned, not read.
 *
 * The sign-off carries the weight instead, and everything to the right of it
 * is a directory: small headings, small links, plenty of air.
 */
export default function Footer({ onOpenService }) {
  const year = new Date().getFullYear()

  return (
    <footer className="foot" id="contact">
      {/* Down the left edge, answering the gateway's right. */}
      <p className="foot-spine wordmark-spine" aria-hidden="true">{brand.full}</p>
      <span className="sr-only">{brand.full}</span>

      <div className="foot-body">
        <div className="foot-main">
          <div className="foot-say">
            <span className="foot-mark" aria-hidden="true" />
            <p className="foot-line">{brand.slogan}</p>
            <div className="foot-actions">
              <button type="button" className="foot-cta" onClick={() => onOpenService?.('')}>
                Start a request <i aria-hidden="true">→</i>
              </button>
              <a className="foot-mail" href="mailto:hello@oryx.example">
                hello@oryx.example
              </a>
            </div>
          </div>

          <nav className="foot-cols" aria-label="Footer">
            <div>
              <h4>Services</h4>
              <ul>
                {services.map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => onOpenService?.(s.id)}>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Group</h4>
              <ul>
                <li><a href="#work">Purpose</a></li>
                <li><a href="#work">Vision</a></li>
                <li><a href="#work">Mission</a></li>
                <li><a href="#work">Values</a></li>
              </ul>
            </div>

            <div>
              <h4>Contact</h4>
              <ul>
                <li><a href="mailto:hello@oryx.example">hello@oryx.example</a></li>
                <li><a href="tel:+310000000000">+31 (0)00 000 0000</a></li>
                <li>Mon&ndash;Fri &middot; 08:00&ndash;18:00</li>
                <li>{brand.region}</li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="foot-base">
          <span>© {year} {brand.full}</span>
          <span className="foot-legal">
            <a href="#privacy">Privacy</a>
            <span aria-hidden="true">/</span>
            <a href="#terms">Terms</a>
          </span>
          <span className="foot-place">{brand.descriptor.join(' / ')}</span>
        </div>
      </div>
    </footer>
  )
}
