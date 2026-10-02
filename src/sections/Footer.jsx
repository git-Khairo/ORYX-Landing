import { brand, services } from '../content/copy'
import { social } from '../content/requests'
import Slogan from '../components/Slogan'
import Icon from '../components/Icon'
import { ui } from '../content/ui'
import LangSwitch from '../components/LangSwitch'

/* The three accounts, as icons. An entry with no `href` yet renders as a plain
   icon and not as a link, so the footer never ships a dead address. Exported
   because each service page has its own footer and carries the same row. */
export function Social({ className = '' }) {
  return (
    <ul className={`social ${className}`} role="list">
      {social.map((s) => (
        <li key={s.id}>
          {s.href ? (
            <a href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.label}>
              <Icon name={s.id} size={18} />
            </a>
          ) : (
            <span title={s.label}>
              <Icon name={s.id} size={18} title={s.label} />
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

/**
 * The other bookend.
 *
 * The gateway runs the group's name down its right-hand edge; this runs it
 * down the left. The two face each other across the page, so the site opens
 * and closes on the same gesture.
 *
 * The services are quiet links in a column here, not a numbered index. They
 * were set as one before (full-width rows, names in display capitals) and it
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
            <Slogan className="foot-line" />
            <div className="foot-actions">
              <button type="button" className="foot-cta" onClick={() => onOpenService?.('')}>
                {ui.footer.start} <i aria-hidden="true"><Icon name="arrow" size={16} /></i>
              </button>
              <a className="foot-mail" href="mailto:hello@oryx.example">
                hello@oryx.example
              </a>
            </div>
          </div>

          <nav className="foot-cols" aria-label={ui.footer.label}>
            <div>
              <h4>{ui.footer.services}</h4>
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
              <h4>{ui.footer.group}</h4>
              <ul>
                <li><a href="#work">{ui.footer.purpose}</a></li>
                <li><a href="#work">{ui.footer.vision}</a></li>
                <li><a href="#work">{ui.footer.mission}</a></li>
                <li><a href="#work">{ui.footer.values}</a></li>
              </ul>
            </div>

            <div>
              <h4>{ui.footer.contact}</h4>
              <ul>
                <li><a href="mailto:hello@oryx.example">hello@oryx.example</a></li>
                <li><a href="tel:+310000000000">+31 (0)00 000 0000</a></li>
                <li>{ui.footer.hours}</li>
                <li>{brand.region}</li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="foot-base">
          <span>© {year} {brand.full}</span>
          <span className="foot-legal">
            <a href="#privacy">{ui.footer.privacy}</a>
            <span aria-hidden="true">/</span>
            <a href="#terms">{ui.footer.terms}</a>
          </span>
          {/* Where the descriptor line used to close the row. The descriptor is
              already on the purpose panel at the top of the page, so here the
              three accounts take its place at the right-hand end. */}
          <LangSwitch variant="list" />
          <Social />
        </div>
      </div>
    </footer>
  )
}
