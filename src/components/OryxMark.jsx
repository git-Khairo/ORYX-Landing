/**
 * The ORYX brand mark — the supplied logo at `public/logo.png`.
 *
 * The asset is a black silhouette on a transparent ground, but the mark has to
 * sit on cream, on charcoal and on gold cards, so it cannot be drawn as a plain
 * <img>: it would be a black shape on every one of them. Instead the PNG is
 * used as a **mask** over `currentColor`, which gives back exactly the
 * behaviour the old inline SVG had — the mark inherits the colour of whatever
 * it is placed in, and every existing call site keeps working unchanged.
 *
 * `draw` previously dashed the SVG strokes on. A raster has no strokes to dash,
 * so the equivalent reveal is a wipe: the mark is uncovered from its foot over
 * the same duration.
 */
const SRC = '/logo.png'
const ASPECT = 306 / 459 // the asset's own proportions

export default function OryxMark({
  size = 40,
  className = '',
  draw = false,
  duration = 1.1,
  // Accepted and ignored: call sites pass a stroke weight for the old line
  // mark, and should not all have to change because the asset did.
  strokeWidth,
}) {
  void strokeWidth

  const style = {
    // aspect-ratio rather than a computed width, so `size` may be a number of
    // pixels or any CSS length ("0.62em" for the marquee separator).
    height: typeof size === 'number' ? `${size}px` : size,
    aspectRatio: String(ASPECT),
    display: 'inline-block',
    backgroundColor: 'currentColor',
    WebkitMaskImage: `url(${SRC})`,
    maskImage: `url(${SRC})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    ...(draw
      ? { animation: `oryx-wipe ${duration}s cubic-bezier(0.16,1,0.3,1) forwards` }
      : null),
  }

  return <span aria-hidden="true" className={`oryx-mark-img ${className}`} style={style} />
}

/** The wordmark, at the identity's own tracking. */
export function Wordmark({ className = '' }) {
  return <span className={`oryx-wordmark ${className}`}>ORYX</span>
}
