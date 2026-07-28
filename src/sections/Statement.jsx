import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import Horns from '../components/Horns'
import Footer from '../components/Footer'
import VideoBackdrop from '../components/VideoBackdrop'
import { statement } from '../content/copy'
import { film } from '../content/media'

/**
 * The closing frame, and the only place the sculpture is centred.
 *
 * It ran as type on flat charcoal with a keyword marquee underneath — a row of
 * adjectives ("Modern · Smart · Premium") that asserted qualities the previous
 * nine screens had just spent their time demonstrating. Cutting them leaves the
 * one line that matters standing alone, which is the whole point of a last
 * screen. The footer facts move to a hairline rule at the foot.
 */
export default function Statement({ onRequest }) {
  return (
    <SectionShell
      id="statement"
      index={10}
      tone="dark"
      className="statement"
      bg={<VideoBackdrop src={film.skyline.src} tone="dark" className="section-bg" />}
    >
      <Horns align="center" scale={0.82} className="statement-horns" />

      <div className="col--center statement-inner">
        <p className="eyebrow" data-reveal>{statement.eyebrow}</p>
        <p className="statement-body" data-reveal>{statement.body}</p>
        <SplitText as="h2" className="statement-close" text={statement.close} start="top 85%" />
      </div>

      <Footer onRequest={onRequest} />
    </SectionShell>
  )
}
