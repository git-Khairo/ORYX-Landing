import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import TiltCard from '../components/TiltCard'
import ConvergenceLines from '../components/illustrations/ConvergenceLines'
import { why } from '../content/copy'

export default function WhyOryx() {
  return (
    <SectionShell id="why" index={6} tone="cream" bg={<ConvergenceLines className="section-bg" />}>
      <div className="col--center halo" style={{ maxWidth: '820px', margin: '0 auto' }}>
        <p className="eyebrow" data-reveal>{why.eyebrow}</p>
        <SplitText as="h2" className="title-xl" text={why.title} />
        <p className="lead" data-reveal>{why.body}</p>
      </div>

      <div className="card-grid" style={{ maxWidth: '1120px', margin: '3.5rem auto 0' }}>
        {why.advantages.map((a, i) => (
          <TiltCard className="glass-card" key={a.k} data-reveal="up" max={16} lift={-70}>
            <span className="card-index">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="card-k">{a.k}</h3>
            <p className="card-d">{a.d}</p>
          </TiltCard>
        ))}
      </div>
    </SectionShell>
  )
}
