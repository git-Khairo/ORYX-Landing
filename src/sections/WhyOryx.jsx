import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import VideoBackdrop from '../components/VideoBackdrop'
import { why } from '../content/copy'
import { film } from '../content/media'

/**
 * A ledger, not a grid of equal boxes.
 *
 * The claim is "one experience, not just a service", so the six advantages are
 * read as one continuous list against a single spine — an argument you scan top
 * to bottom — with the headline held to the left like a standfirst. Each row
 * carries its own index and opens a rust rule on hover, so the section has a
 * texture to move through rather than six things to compare.
 */
export default function WhyOryx() {
  return (
    <SectionShell
      id="why"
      index={6}
      tone="cream"
      className="why"
      bg={<VideoBackdrop src={film.office.src} className="section-bg" />}
    >
      <div className="why-grid">
        <div className="why-lead halo">
          <p className="eyebrow" data-reveal>{why.eyebrow}</p>
          <SplitText as="h2" className="why-title" text={why.title} />
          <p className="lead" data-reveal>{why.body}</p>
        </div>

        <ol className="ledger">
          {why.advantages.map((a, i) => (
            <li className="ledger-row" key={a.k} data-reveal="right">
              <span className="ledger-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="ledger-body">
                <span className="ledger-k">{a.k}</span>
                <span className="ledger-d">{a.d}</span>
              </span>
              <span className="ledger-rule" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  )
}
