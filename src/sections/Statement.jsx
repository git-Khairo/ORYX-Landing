import SectionShell from '../components/SectionShell'
import Horns from '../components/Horns'
import Footer from '../components/Footer'
import VideoBackdrop from '../components/VideoBackdrop'
import { film } from '../content/media'
import { brand } from '../content/copy'

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
        <p className="statement-label">{brand.name} · Operational Services</p>

        <h2 className="statement-headline">Always<br />Ready.</h2>

        <p className="statement-sub">
          The operational partner for modern business.
        </p>

        <button
          type="button"
          className="statement-cta"
          onClick={() => onRequest?.('')}
        >
          Start a request <i aria-hidden="true">→</i>
        </button>
      </div>

      <Footer onRequest={onRequest} />
    </SectionShell>
  )
}
