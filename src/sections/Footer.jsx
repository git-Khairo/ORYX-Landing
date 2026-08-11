import { brand } from '../content/copy'
import { footerFilm } from '../content/media'

/**
 * One surface, not two.
 *
 * The sign-off, the links and the legal line all sit on the same film — a
 * white block underneath was a second footer stacked on the first, and it cut
 * the page off at the join. Now the footage runs the full height and the three
 * rows just get quieter as they descend.
 */
export default function Footer({ onOpenService }) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" id="contact">
      <div className="footer-film" aria-hidden="true">
        {footerFilm.src && (
          <video src={footerFilm.src} muted loop autoPlay playsInline preload="none" />
        )}
      </div>
      <div className="footer-blur" aria-hidden="true" />
      <div className="footer-veil" aria-hidden="true" />

      <div className="footer-inner">
        <div className="footer-band-copy shell">
          <img className="footer-logo" src="/logo.png" alt="" />
          <p className="footer-band-line">{brand.tagline}</p>
          <p className="footer-band-sub">{brand.full}</p>
        </div>

        <div className="footer-bar shell">
          <span className="footer-mark">{brand.name}</span>

          <a className="footer-contact" href="mailto:hello@oryx.example">
            hello@oryx.example
          </a>

          <button type="button" className="footer-cta" onClick={() => onOpenService?.('')}>
            Start a request <i aria-hidden="true">→</i>
          </button>
        </div>

        <div className="footer-base shell">
          <span>© {year} {brand.name}. All rights reserved.</span>
          <span className="footer-legal">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </span>
          <span className="footer-place">{brand.region}</span>
        </div>
      </div>
    </footer>
  )
}
