import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import CtaButton from '../components/CtaButton'
import VideoBackdrop from '../components/VideoBackdrop'
import { contact, services } from '../content/copy'
import { film } from '../content/media'

/**
 * The invitation, and a look through the doors.
 *
 * A single "Start a request" button gave no sense of what starting involves,
 * which is the moment most enquiries are abandoned. The three routes are now
 * shown as living plates — the same environments the gateway opens into — so
 * pressing one is a continuation rather than a leap. Each goes straight to its
 * own journey with the service already chosen.
 */
export default function Contact({ onRequest }) {
  return (
    <SectionShell
      id="contact"
      index={9}
      tone="cream"
      className="start"
      bg={<VideoBackdrop src={film.facility.src} className="section-bg" />}
    >
      <div className="start-grid">
        <div className="start-lead halo">
          <p className="eyebrow" data-reveal>{contact.eyebrow}</p>
          <SplitText as="h2" className="start-title" text={contact.title} start="top 84%" />
          <p className="lead" data-reveal>{contact.body}</p>

          <div className="start-actions" data-reveal>
            <CtaButton variant="solid" onClick={() => onRequest?.('')}>
              Start a request
            </CtaButton>
            <span className="start-hint">Four questions. About a minute.</span>
          </div>
        </div>

        <div className="start-doors">
          {services.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="start-door"
              data-reveal="right"
              style={{ '--i': i }}
              onClick={() => onRequest?.(s.id)}
              aria-label={`Start a ${s.title.toLowerCase()} request`}
            >
              <VideoBackdrop src={film[s.id]?.src} tone="territory" className="start-door-film" />
              <span className="start-door-body">
                <span className="start-door-name">{s.title}</span>
                <span className="start-door-go" aria-hidden="true">→</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
