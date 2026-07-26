import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import OryxMark from '../components/illustrations/OryxMark'
import { discover } from '../content/copy'

export default function Discover() {
  return (
    <SectionShell id="discover" index={1} tone="cream">
      <div className="discover-grid">
        <figure className="discover-art" data-reveal="left">
          <OryxMark />
          <figcaption>The Oryx — our brand character</figcaption>
        </figure>
        <div className="col halo">
          <p className="eyebrow" data-reveal>{discover.eyebrow}</p>
          <SplitText as="h2" className="title-xl" text={discover.title} />
          <p className="lead" data-reveal>{discover.body}</p>
          <p className="mt" data-reveal style={{ color: 'var(--taupe)' }}>{discover.aim}</p>
        </div>
      </div>
    </SectionShell>
  )
}
