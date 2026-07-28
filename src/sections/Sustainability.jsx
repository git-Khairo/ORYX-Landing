import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import VideoBackdrop from '../components/VideoBackdrop'
import { sustainability } from '../content/copy'
import { film } from '../content/media'

/**
 * Scale contrast is the whole composition here.
 *
 * The copy is held compact in the upper left, and the three measures run across
 * the foot at display scale — big enough that the numerals read as the
 * section's subject rather than as a caption under a paragraph. The previous
 * version set them at heading size in a tidy row, which made them look like
 * decoration for the text above; now the text is the annotation and the figures
 * are the statement.
 */
export default function Sustainability() {
  return (
    <SectionShell
      id="sustainability"
      index={7}
      tone="leaf"
      className="sustain"
      bg={<VideoBackdrop src={film.city.src} className="section-bg" />}
    >
      <div className="sustain-frame">
        <div className="sustain-lead halo">
          <p className="eyebrow" data-reveal>{sustainability.eyebrow}</p>
          <SplitText as="h2" className="sustain-title" text={sustainability.title} start="top 82%" />
          <p className="lead" data-reveal>{sustainability.body}</p>
        </div>

        <dl className="measures">
          {sustainability.stats.map((s) => (
            <div className="measure" key={s.l} data-reveal="up">
              <dt className="measure-n">{s.n}</dt>
              <dd className="measure-l">{s.l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </SectionShell>
  )
}
