import { keywords } from '../content/copy'
import OryxMark from './OryxMark'

/**
 * The band of giant type that drifts sideways behind the carousel — AI Studio's
 * scrolling headline, rebuilt in Instrument Serif and ORYX keywords. Words are
 * separated by the horn glyph rather than a bullet, so even the divider is the
 * brand.
 *
 * The track is duplicated once and translated by exactly -50%, which makes the
 * loop seamless: the copy hands off to its clone the instant the first run
 * leaves the frame. Pure CSS, GPU-only transform, and it pauses under
 * prefers-reduced-motion via the stylesheet.
 */
function Track() {
  return (
    <span className="marquee-run" aria-hidden="true">
      {keywords.map((word) => (
        <span className="marquee-word" key={word}>
          {word}
          <OryxMark size="0.62em" className="marquee-sep" />
        </span>
      ))}
    </span>
  )
}

export default function MarqueeHeadline() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-viewport">
        <Track />
        <Track />
      </div>
    </div>
  )
}
