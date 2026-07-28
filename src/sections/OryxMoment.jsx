import { useSectionReveal } from '../lib/useSectionReveal'
import VideoBackdrop from '../components/VideoBackdrop'
import { film } from '../content/media'

/**
 * The full-bleed interlude that breaks the reading rhythm — one line of type
 * over one moving image, nothing else on the screen.
 *
 * This was an illustrated desert: a sun, three dune curves, an orbital ring.
 * The image is now the city these operations actually run in, shot from above.
 */
export default function OryxMoment() {
  const ref = useSectionReveal()
  return (
    <section id="beyond" className="oryx-moment" ref={ref} data-stops={1} aria-label="Beyond service">
      <VideoBackdrop src={film.aerial.src} tone="cinematic" className="oryx-moment-bg" />
      <div className="oryx-moment-inner">
        <p className="eyebrow" data-reveal style={{ color: 'var(--offwhite)' }}>The ORYX</p>
        <h2 className="oryx-moment-title" data-reveal>Beyond service.</h2>
        <p className="oryx-moment-sub" data-reveal>
          Reliable. Sustainable. Always ready — across every floor, every route and every
          building you trust us with.
        </p>
      </div>
    </section>
  )
}
