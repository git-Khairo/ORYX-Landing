import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import VideoBackdrop from '../components/VideoBackdrop'
import { process } from '../content/copy'
import { film } from '../content/media'

/**
 * A track, not a stack.
 *
 * The four steps are a sequence that ends in the customer stopping having to
 * think, so they run left to right along a single spine with the numerals
 * sitting on it like stations. A vertical list of ruled rows read as four
 * separate facts; a track reads as one movement with a destination — and the
 * last station is deliberately marked, because arriving is the point.
 */
export default function Process() {
  return (
    <SectionShell
      id="process"
      index={8}
      tone="sand"
      className="process"
      bg={<VideoBackdrop src={film.people.src} className="section-bg" />}
    >
      <div className="process-lead halo">
        <p className="eyebrow" data-reveal>{process.eyebrow}</p>
        <SplitText as="h2" className="process-title" text={process.title} />
        <p className="lead" data-reveal>{process.body}</p>
      </div>

      <ol className="track">
        <span className="track-spine" aria-hidden="true" />
        {process.steps.map((s, i) => (
          <li
            className={`station ${i === process.steps.length - 1 ? 'is-last' : ''}`}
            key={s.n}
            data-reveal="up"
          >
            <span className="station-node" aria-hidden="true" />
            <span className="station-n">{s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
