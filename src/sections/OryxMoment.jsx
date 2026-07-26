import { useSectionReveal } from '../lib/useSectionReveal'
import DesertScene from '../components/illustrations/DesertScene'

/**
 * A full-bleed illustrated interlude — the "bigger oryx moment" — that breaks
 * the reading rhythm with a cinematic desert scene and a single line.
 */
export default function OryxMoment() {
  const ref = useSectionReveal()
  return (
    <section className="oryx-moment" ref={ref} aria-label="Beyond service">
      <DesertScene className="oryx-moment-bg" />
      <div className="oryx-moment-inner">
        <p className="eyebrow" data-reveal style={{ color: 'var(--offwhite)' }}>The ORYX</p>
        <h2 className="oryx-moment-title" data-reveal>Beyond service.</h2>
        <p className="oryx-moment-sub" data-reveal>
          Reliable. Sustainable. Always ready — the way the desert’s most dependable traveller has always been.
        </p>
      </div>
    </section>
  )
}
