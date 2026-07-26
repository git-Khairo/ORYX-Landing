import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import Constellation from '../components/illustrations/Constellation'
import { statement, keywords, brand } from '../content/copy'

export default function Statement() {
  return (
    <SectionShell id="statement" index={10} tone="dark" className="statement" bg={<Constellation className="section-bg" />}>
      <div className="col--center">
        <p className="eyebrow" data-reveal>{statement.eyebrow}</p>
        <p className="statement-body" data-reveal>{statement.body}</p>
        <SplitText as="h2" className="statement-close" text={statement.close} start="top 85%" />
        <div className="keywords" data-reveal>
          {keywords.slice(0, 8).map((k) => (
            <span key={k}>{k}</span>
          ))}
        </div>
        <p className="statement-foot" data-reveal>
          {brand.name} · {brand.category}
        </p>
      </div>
    </SectionShell>
  )
}
