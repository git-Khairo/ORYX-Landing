import { useEffect, useRef, useState } from 'react'
import { useScroll } from '../lib/useScrollStore'
import { scrollToId } from '../lib/scrollTo'
import { useOverlayOpen } from '../lib/useOverlay'
import OryxMark, { Wordmark } from './OryxMark'
import { brand } from '../content/copy'
import { catalog } from '../content/catalog'

/**
 * A floating pill — the AI-Studio nav shape, rebuilt in ORYX materials.
 *
 * Wordmark inside the pill on the left, a short set of links in the middle, one
 * filled action on the right. The bar is fixed and centred; it belongs to the
 * top of the page and to the intent to go back up, so it retires while reading
 * down and returns on scroll-up.
 *
 * Services is a menu rather than a link, because the services are not a place
 * on the page — they are three panels that open over it. Choosing one opens the
 * same panel a card press opens, so there is one service page, reachable two
 * ways.
 */
const LINKS = [
  { id: 'standard', label: 'The Standard' },
  { id: 'how', label: 'How it works' },
  { id: 'statement', label: 'ORYX' },
]

export default function Nav({ onContact, onOpenService }) {
  const scrolled = useScroll((s) => s.progress > 0.015)
  const overlay = useOverlayOpen()
  // The bar stays put for the whole page now. It only stands down for a
  // full-screen overlay, which covers it anyway and must not leave a focusable
  // bar behind it.
  const hidden = overlay

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // A menu that cannot be dismissed by looking away is a trap: close on outside
  // press and on Escape, and whenever the bar itself retires.
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    if (hidden) setMenuOpen(false)
  }, [hidden])

  return (
    <header
      className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}
      aria-hidden={overlay || undefined}
    >
      <div className="nav-pill">
        <button className="nav-logo" onClick={() => scrollToId('hero')} aria-label={`${brand.name} — back to top`}>
          <OryxMark size={20} strokeWidth={2.8} className="nav-mark" />
          <Wordmark />
        </button>

        <nav className="nav-links" aria-label="Sections">
          <div className="nav-menu" ref={menuRef}>
            <button
              className={`nav-link nav-link--menu ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              Services
              <i className="nav-caret" aria-hidden="true" />
            </button>

            {menuOpen && (
              <div className="nav-dropdown" role="menu">
                {catalog.map((s) => (
                  <button
                    key={s.id}
                    role="menuitem"
                    className="nav-dropdown-item"
                    onClick={() => {
                      setMenuOpen(false)
                      onOpenService?.(s.id)
                    }}
                  >
                    <span className="nav-dropdown-title">{s.title}</span>
                    <span className="nav-dropdown-sub">{s.pillar}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {LINKS.map((l) => (
            <button key={l.id} className="nav-link" onClick={() => scrollToId(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>

        <button className="nav-cta" onClick={onContact}>
          Get Started
        </button>
      </div>
    </header>
  )
}
