import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import TechGrid from '../components/illustrations/TechGrid'
import { technology } from '../content/copy'

export default function Technology() {
  return (
    <SectionShell id="technology" index={2} tone="cool" bg={<TechGrid className="section-bg" />}>
      <div className="col col--right halo">
        <p className="eyebrow" data-reveal>{technology.eyebrow}</p>
        <SplitText as="h2" className="title-xl" text={technology.title} start="top 82%" />
        <p className="lead" data-reveal>{technology.body}</p>
        <ul className="point-list">
          {technology.points.map((p) => (
            <li key={p} data-reveal="right">{p}</li>
          ))}
        </ul>
      </div>
    </SectionShell>
  )
}
