import { useScroll } from '../lib/useScrollStore'
import { scrollToId } from '../lib/scrollTo'
import { brand } from '../content/copy'

export default function Nav() {
  const scrolled = useScroll((s) => s.progress > 0.015)
  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <button className="nav-logo" onClick={() => scrollToId('hero')} aria-label="ORYX — back to top">
        <span className="nav-mark">◭</span>
        {brand.name}
      </button>
      <div className="nav-right">
        <span className="nav-tag">{brand.tagline}</span>
        <button className="nav-cta" onClick={() => scrollToId('contact')}>
          Contact
        </button>
      </div>
    </header>
  )
}
