import { useState } from 'react'
import SectionShell from '../components/SectionShell'
import SplitText from '../components/SplitText'
import CtaButton from '../components/CtaButton'
import SignalRings from '../components/illustrations/SignalRings'
import { contact } from '../content/copy'

const emptyErrors = {}

export default function Contact() {
  const [service, setService] = useState('cleaning')
  const [values, setValues] = useState({ name: '', company: '', email: '', details: '' })
  const [errors, setErrors] = useState(emptyErrors)
  const [sent, setSent] = useState(false)

  const update = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const err = {}
    if (!values.name.trim()) err.name = 'Please tell us your name.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) err.email = 'Enter a valid email.'
    if (!values.details.trim()) err.details = 'A few words about your needs, please.'
    return err
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    setErrors(err)
    if (Object.keys(err).length === 0) setSent(true)
  }

  const serviceLabel = contact.options.find((o) => o.id === service)?.label

  return (
    <SectionShell id="contact" index={9} tone="cream" bg={<SignalRings className="section-bg" />}>
      <div className="col halo">
        <p className="eyebrow" data-reveal>{contact.eyebrow}</p>
        <SplitText as="h2" className="title-xl" text={contact.title} start="top 84%" />
        <p className="lead" data-reveal>{contact.body}</p>

        {!sent ? (
          <>
            <div className="picker" role="group" aria-label="Choose a service" data-reveal>
              {contact.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={service === o.id ? 'is-active' : ''}
                  aria-pressed={service === o.id}
                  onClick={() => setService(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <form className="form" onSubmit={onSubmit} noValidate data-reveal>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="c-name">Name</label>
                  <input id="c-name" value={values.name} onChange={update('name')} autoComplete="name" />
                  {errors.name && <span className="err">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="c-company">Company</label>
                  <input id="c-company" value={values.company} onChange={update('company')} autoComplete="organization" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-email">Email</label>
                <input id="c-email" type="email" value={values.email} onChange={update('email')} autoComplete="email" />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="c-details">Tell us about your {serviceLabel?.toLowerCase()} needs</label>
                <textarea id="c-details" rows={4} value={values.details} onChange={update('details')} />
                {errors.details && <span className="err">{errors.details}</span>}
              </div>
              <div>
                <CtaButton variant="solid" type="submit">Request {serviceLabel}</CtaButton>
              </div>
            </form>
          </>
        ) : (
          <div className="form-success" data-reveal>
            <h3>Thank you, {values.name.split(' ')[0]}.</h3>
            <p className="mt" style={{ color: 'var(--taupe)' }}>
              Your {serviceLabel} request has been prepared. An ORYX partner will be in touch — we’re
              always ready.
            </p>
            <p className="form-note">
              Demo form — no message is actually sent. Wire it to your email/CRM to go live, or reach us at{' '}
              <a href="mailto:hello@oryx.example" style={{ color: 'var(--gold-deep)' }}>hello@oryx.example</a>.
            </p>
            <button className="mt" style={{ color: 'var(--gold-deep)', fontWeight: 600 }} onClick={() => setSent(false)}>
              ← Send another request
            </button>
          </div>
        )}
      </div>
    </SectionShell>
  )
}
