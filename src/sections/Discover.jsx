import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import Horns from '../components/Horns'
import VideoBackdrop from '../components/VideoBackdrop'
import { discover } from '../content/copy'
import { film } from '../content/media'

/**
 * The introduction, and the sculpture's first appearance.
 *
 * Copy holds the left third against a graded film of people at work; the
 * sculpture occupies the right, drifting against the scroll. The two are on
 * different depth planes on purpose — that separation is what keeps the object
 * from reading as decoration sitting on a photograph.
 */
export default function Discover() {
  return (
    <SectionShell
      id="discover"
      index={1}
      tone="cream"
      bg={<VideoBackdrop src={film.people.src} />}
    >
      <Horns align="right" />

      <div className="col halo discover-col">
        <p className="eyebrow" data-reveal>{discover.eyebrow}</p>
        <SplitText as="h2" className="title-xl" text={discover.title} />
        <p className="lead" data-reveal>{discover.body}</p>
        <p className="discover-aim" data-reveal>{discover.aim}</p>
      </div>
    </SectionShell>
  )
}
