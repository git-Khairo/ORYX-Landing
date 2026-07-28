import { useScroll } from '../lib/useScrollStore'
import { scrollToId } from '../lib/scrollTo'
import { useOverlayOpen } from '../lib/useOverlay'
import OryxMark, { Wordmark } from './OryxMark'
import { brand } from '../content/copy'

/**
 * A single hairline row: wordmark left, one action right.
 *
 * The bar is fixed, so on a page of full-screen sections it would otherwise sit
 * permanently on top of whatever you just landed on. It belongs to the top of
 * the page and to the intent to go back up — visible at the top, visible when
 * you scroll up, out of the way the rest of the time.
 *
 * Mark plus wordmark, both taken from the brand system rather than redrawn, so
 * the lockup here is the same object as the one in the footer and the request
 * gateway.
 */
export default function Nav({ onContact }) {
  const scrolled = useScroll((s) => s.progress > 0.015)
  const scrolledPast = useScroll((s) => s.scroll > 120 && s.direction === 1)
  // A full-screen overlay owns the page; the page's own chrome retires.
  const overlay = useOverlayOpen()
  const hidden = scrolledPast || overlay

  return (
    <header
      className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}
      aria-hidden={overlay || undefined}
    >
      <button className="nav-logo" onClick={() => scrollToId('hero')} aria-label={`${brand.name} — back to top`}>
        <OryxMark size={20} strokeWidth={2.8} className="nav-mark" />
        <Wordmark />
      </button>

      <button className="nav-cta" onClick={onContact}>
        Start a request
      </button>
    </header>
  )
}
