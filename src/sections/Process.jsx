import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import TiltCard from '../components/TiltCard'
import BlueprintPath from '../components/illustrations/BlueprintPath'
import { process } from '../content/copy'

export default function Process() {
  return (
    <SectionShell id="process" index={8} tone="sand" bg={<BlueprintPath className="section-bg" />}>
      <div className="col--center halo" style={{ maxWidth: '760px', margin: '0 auto' }}>
        <p className="eyebrow" data-reveal>{process.eyebrow}</p>
        <SplitText as="h2" className="title-xl" text={process.title} />
        <p className="lead" data-reveal>{process.body}</p>
      </div>

      <div className="card-grid" style={{ maxWidth: '1000px', margin: '3.5rem auto 0' }}>
        {process.steps.map((s) => (
          <TiltCard className="glass-card step-card" key={s.n} data-reveal="up" max={12} axis="y" lift={-50}>
            <span className="card-index">STEP {s.n}</span>
            <h3 className="card-k">{s.t}</h3>
            <p className="card-d">{s.d}</p>
          </TiltCard>
        ))}
      </div>
    </SectionShell>
  )
}
