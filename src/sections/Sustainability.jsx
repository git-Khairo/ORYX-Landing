import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import GrowthContours from '../components/illustrations/GrowthContours'
import { sustainability } from '../content/copy'

export default function Sustainability() {
  return (
    <SectionShell id="sustainability" index={7} tone="leaf" bg={<GrowthContours className="section-bg" />}>
      <div className="col halo">
        <p className="eyebrow" data-reveal>{sustainability.eyebrow}</p>
        <SplitText as="h2" className="title-xl" text={sustainability.title} start="top 82%" />
        <p className="lead" data-reveal>{sustainability.body}</p>
        <div className="stat-row">
          {sustainability.stats.map((s) => (
            <div className="stat" key={s.l} data-reveal="up">
              <div className="n">{s.n}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
