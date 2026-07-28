import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import VideoBackdrop from '../components/VideoBackdrop'
import { film } from '../content/media'
import { technology } from '../content/copy'

/**
 * Copy left, film open on the right.
 *
 * This used to be the odd screen out: a cream section holding its footage in a
 * small framed plate while every neighbour ran film full-bleed with light type.
 * It now shares the family treatment — background film, offwhite text — and
 * keeps its own identity through composition instead: a hard left column with a
 * numbered list, leaving the right of the frame to the footage.
 */
export default function Technology() {
  return (
    <SectionShell
      id="technology"
      index={2}
      tone="cool"
      className="tech"
      bg={<VideoBackdrop src={film.platform.src} className="section-bg" />}
    >
      <div className="tech-grid">
        <div className="tech-copy">
          <p className="eyebrow" data-reveal>{technology.eyebrow}</p>
          <SplitText as="h2" className="tech-title" text={technology.title} start="top 82%" />
          <p className="lead" data-reveal>{technology.body}</p>

          <ol className="ruled-list">
            {technology.points.map((p, i) => (
              <li key={p} data-reveal>
                <span className="ruled-index">{String(i + 1).padStart(2, '0')}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="tech-meta" aria-hidden="true">
          <span className="tech-live"><i /> Live</span>
          <span>Operations dashboard</span>
        </p>
      </div>
    </SectionShell>
  )
}
