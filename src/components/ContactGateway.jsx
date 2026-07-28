import { useEffect, useState } from 'react'
import VideoBackdrop from './VideoBackdrop'
import CtaButton from './CtaButton'
import OryxMark from './OryxMark'
import { services, journeys, brand } from '../content/copy'
import { film } from '../content/media'
import { useScrollLock, useEscape, useFocusTrap } from '../lib/useOverlay'

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/

/**
 * The contact experience.
 *
 * Pressing contact never lands on a form. It opens a gateway with one question
 * — which service — answered by walking into one of three environments rather
 * than picking from a dropdown. Then a journey shaped to that service: one
 * question per screen, structured answers, a summary you can edit, and only at
 * the end the question of who you are.
 *
 * Closing keeps every answer. Leaving to go and check something is not a
 * punishment, and coming back should not mean starting again.
 */
export default function ContactGateway({ initialService = '', onClose }) {
  const [serviceId, setServiceId] = useState(initialService || '')
  const [hovered, setHovered] = useState(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [details, setDetails] = useState({ name: '', company: '', email: '', note: '' })
  const [errors, setErrors] = useState({})
  const [reviewing, setReviewing] = useState(false)
  const [sent, setSent] = useState(false)
  const [entered, setEntered] = useState(false)

  const trap = useFocusTrap(true)
  useScrollLock(true)
  useEscape(true, onClose)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const service = services.find((s) => s.id === serviceId) || null
  const steps = service ? journeys[service.id] : []
  const index = Math.min(step, Math.max(steps.length - 1, 0))
  const current = steps[index]
  const progress = reviewing ? 1 : steps.length ? (index + 1) / (steps.length + 1) : 0

  const validate = () => {
    const next = {}
    if (!details.name.trim()) next.name = 'We need a name to reply to.'
    if (!details.company.trim()) next.company = 'Tell us which company this is for.'
    if (!EMAIL.test(details.email)) next.email = 'That email address does not look complete.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const advance = () => {
    if (current?.kind === 'details') {
      if (!validate()) return
      setReviewing(true)
      return
    }
    setStep(index + 1)
  }

  const back = () => {
    if (reviewing) return setReviewing(false)
    if (index === 0) return setServiceId('')
    setStep(index - 1)
  }

  const canContinue = current?.kind === 'single' ? Boolean(answers[current.id]) : true

  const labelFor = (stepDef) => {
    const value = answers[stepDef.id]
    if (stepDef.kind === 'details') {
      return [details.name, details.company, details.email].filter(Boolean).join(' · ')
    }
    if (Array.isArray(value)) {
      if (!value.length) return 'Nothing selected'
      return value
        .map((v) => stepDef.options.find((o) => o.value === v)?.label)
        .filter(Boolean)
        .join(', ')
    }
    return stepDef.options?.find((o) => o.value === value)?.label || 'Not answered'
  }

  return (
    <div
      className={`gateway ${entered ? 'is-in' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Request a service from ORYX"
    >
      <div className="gateway-shell" ref={trap}>
        <header className="gateway-head">
          <span className="gateway-mark">
            <OryxMark size={20} strokeWidth={2.8} />
            <span>{sent ? 'Request sent' : 'New request'}</span>
          </span>
          <button type="button" className="gateway-close" onClick={onClose} aria-label="Close. Your answers are kept.">
            Close <i aria-hidden="true">✕</i>
          </button>
        </header>

        {/* ── Success ─────────────────────────────────────────────────── */}
        {sent ? (
          <div className="gateway-body gateway-done">
            <p className="sw-marker">Received</p>
            <h2>Thank you, {details.name.split(' ')[0]}.</h2>
            <p className="gateway-done-lede">
              Your {service?.title.toLowerCase()} request is prepared. An ORYX partner will come
              back with a written operational answer — not a brochure.
            </p>
            <p className="form-note">
              Demo only: nothing was transmitted. Wire this to your CRM or inbox to go live.
            </p>
            <div className="sw-close-actions">
              <CtaButton variant="solid" onClick={onClose}>Close</CtaButton>
            </div>
          </div>
        ) : !service ? (
          /* ── The doors ─────────────────────────────────────────────── */
          <div className="gateway-body gateway-doors">
            <h2 className="gateway-question">What can we make ready for you?</h2>
            <div className="doors">
              {services.map((s, i) => {
                const active = hovered === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`door ${active ? 'is-active' : ''} ${hovered && !active ? 'is-dim' : ''}`}
                    style={{ '--door-delay': `${0.08 + i * 0.07}s` }}
                    onClick={() => {
                      setServiceId(s.id)
                      setStep(0)
                    }}
                    onMouseEnter={() => setHovered(s.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(s.id)}
                    onBlur={() => setHovered(null)}
                    aria-label={`${s.title}. ${s.pillar}. Start this request.`}
                  >
                    <VideoBackdrop src={film[s.id]?.src} tone="territory" className="door-film" />
                    <span className="door-body">
                      <span className="territory-index">{s.eyebrow}</span>
                      <span className="door-name">{s.title}</span>
                      <span className="territory-promise">{s.pillar}</span>
                      <span className="territory-open">Start here <i aria-hidden="true">→</i></span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* ── The journey ───────────────────────────────────────────── */
          <div className="gateway-body">
            <div className="gateway-progress">
              <span className="gateway-progress-track">
                <span className="gateway-progress-fill" style={{ transform: `scaleX(${progress})` }} />
              </span>
              <div className="gateway-progress-meta">
                <span className="sw-marker">{service.title}</span>
                <span className="gateway-count">
                  {reviewing
                    ? 'Summary'
                    : `${String(index + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`}
                </span>
              </div>
            </div>

            <div className="gateway-stage" key={reviewing ? 'summary' : current.id}>
              {reviewing ? (
                <div className="journey-step">
                  <h2 className="gateway-question">Does this look right?</h2>
                  <dl className="summary">
                    {steps.map((s, i) => (
                      <div className="summary-row" key={s.id}>
                        <dt>{s.prompt}</dt>
                        <dd>{labelFor(s)}</dd>
                        <button type="button" onClick={() => { setReviewing(false); setStep(i) }}>
                          Edit
                        </button>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : current.kind === 'details' ? (
                <div className="journey-step">
                  <h2 className="gateway-question">{current.prompt}</h2>
                  <p className="journey-help">{current.help}</p>
                  <div className="journey-fields">
                    {[
                      { k: 'name', label: 'Name', autoComplete: 'name' },
                      { k: 'company', label: 'Company', autoComplete: 'organization' },
                      { k: 'email', label: 'Email', autoComplete: 'email', type: 'email' },
                    ].map((f) => (
                      <div className="field" key={f.k}>
                        <label htmlFor={`g-${f.k}`}>{f.label}</label>
                        <input
                          id={`g-${f.k}`}
                          type={f.type || 'text'}
                          autoComplete={f.autoComplete}
                          value={details[f.k]}
                          onChange={(e) => setDetails((d) => ({ ...d, [f.k]: e.target.value }))}
                        />
                        {errors[f.k] && <span className="err">{errors[f.k]}</span>}
                      </div>
                    ))}
                    <div className="field">
                      <label htmlFor="g-note">Anything else we should know? (optional)</label>
                      <textarea
                        id="g-note"
                        rows={3}
                        value={details.note}
                        onChange={(e) => setDetails((d) => ({ ...d, note: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="journey-step">
                  <h2 className="gateway-question">{current.prompt}</h2>
                  {current.help && <p className="journey-help">{current.help}</p>}
                  <div className={`choices ${current.kind === 'multi' ? 'is-multi' : ''}`}>
                    {current.options.map((o) => {
                      const value = answers[current.id]
                      const chosen =
                        current.kind === 'multi'
                          ? Array.isArray(value) && value.includes(o.value)
                          : value === o.value
                      return (
                        <button
                          key={o.value}
                          type="button"
                          className={`choice ${chosen ? 'is-chosen' : ''}`}
                          aria-pressed={chosen}
                          onClick={() => {
                            if (current.kind === 'multi') {
                              setAnswers((a) => {
                                const list = Array.isArray(a[current.id]) ? a[current.id] : []
                                return {
                                  ...a,
                                  [current.id]: list.includes(o.value)
                                    ? list.filter((v) => v !== o.value)
                                    : [...list, o.value],
                                }
                              })
                            } else {
                              setAnswers((a) => ({ ...a, [current.id]: o.value }))
                              // A single-choice answer IS the gesture to move on.
                              window.setTimeout(() => setStep((s) => s + 1), 260)
                            }
                          }}
                        >
                          <span className="choice-label">{o.label}</span>
                          {o.hint && <span className="choice-hint">{o.hint}</span>}
                          <span className="choice-tick" aria-hidden="true">✓</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <footer className="gateway-foot">
              <button type="button" className="sw-text-action" onClick={back}>
                ← {reviewing ? 'Back to questions' : index === 0 ? 'Choose another service' : 'Back'}
              </button>
              {reviewing ? (
                <CtaButton variant="solid" onClick={() => setSent(true)}>Send request</CtaButton>
              ) : (
                <CtaButton variant="solid" onClick={advance} disabled={!canContinue}>
                  {current.kind === 'details' ? 'Review' : 'Continue'}
                </CtaButton>
              )}
            </footer>
          </div>
        )}
      </div>
    </div>
  )
}
