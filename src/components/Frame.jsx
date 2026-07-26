import { brand } from '../content/copy'

/**
 * A subtle fixed viewport frame with corner ticks and mono corner labels — a
 * quiet "futuristic / instrument" signal that stays out of the way. Purely
 * decorative.
 */
export default function Frame() {
  return (
    <div className="frame" aria-hidden="true">
      <span className="frame-corner tl" />
      <span className="frame-corner tr" />
      <span className="frame-corner bl" />
      <span className="frame-corner br" />
      <span className="frame-label frame-bl">EST · NETHERLANDS</span>
      <span className="frame-label frame-br">{brand.tagline}</span>
    </div>
  )
}
