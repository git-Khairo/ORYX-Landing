import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { brand } from '../content/copy'
import { requestServices } from '../content/requests'
import { sendRequest } from '../lib/sendRequest'
import {
  useScrollLock,
  useEscape,
  useFocusTrap,
  usePauseBackgroundVideo,
} from '../lib/useOverlay'
import { usePrefersReduced } from '../lib/usePrefersReduced'
import { SoundToggle } from '../components/Sound'
import Slogan from '../components/Slogan'
import Icon from '../components/Icon'

/**
 * The request page.
 *
 * Every "request" button on the site used to close whatever was open and
 * scroll the home page down to an email address. Now they all open this: one
 * page, one form, and the request goes to the inbox of the service it is
 * about.
 *
 * It is built the way the service pages are: a full-screen dialog portalled to
 * `body`, with the page behind locked, focus trapped and Escape closing it. It
 * sits above them, so a visitor who opens it from inside Workforce closes it
 * and is back where they were reading.
 *
 * The second dropdown is the point of the form. It does not exist until a
 * service is chosen, and its options are that service's own list: the five
 * kinds of transport, the twelve workforce sectors, or the nine kinds of
 * property work. They are read from the same data the pages are built from,
 * so the form cannot offer something the site does not describe.
 *
 * `preset` is `{ service, sub }`. A button inside a service page passes its
 * service, and a button inside a detail popup passes the sub-service too, so
 * nobody is asked to pick again what they were just looking at.
 */
const EMPTY = { name: '', email: '', company: '', phone: '', service: '', sub: '', note: '', site: '' }

const STEPS = [
  { icon: 'note', k: 'You send the request', d: 'A few details are enough to start.' },
  { icon: 'mail', k: 'It reaches the right team', d: 'Each service has its own inbox, so nothing is passed around.' },
  { icon: 'phone', k: 'They contact you', d: 'To agree the details and the next step with you.' },
]

/* What was typed, kept for as long as the tab is open. Escape and the Close
   button both unmount this page, and a long note lost to one stray key press is
   the kind of thing that ends a request. It is cleared only when a request has
   really been sent. */
let draft = null

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function RequestPage({ preset, onClose }) {
  const reduced = usePrefersReduced()
  const trap = useFocusTrap(true)
  const scroller = useRef(null)
  const uid = useId().replace(/:/g, '')

  useScrollLock(true)
  useEscape(true, onClose)
  usePauseBackgroundVideo(true, scroller)

  const [f, setF] = useState(() => {
    const base = { ...EMPTY, ...(draft || {}) }
    /* A button inside a service page names its service, and that wins over
       whatever the draft had. With no preset the draft's own choice stands. */
    if (preset?.service) {
      const same = preset.service === base.service
      base.service = preset.service
      base.sub = preset.sub || (same ? base.sub : '')
    }
    /* A note handed in by the page that opened the form, such as the role and
       the way of hiring chosen in the Workforce request builder. It goes first
       and anything already typed is kept underneath it. */
    if (preset?.note && !base.note.includes(preset.note)) {
      base.note = base.note ? `${preset.note}\n\n${base.note}` : preset.note
    }
    return base
  })
  /* Never the hidden trap field. If an autofill tool ever wrote into it, a
     remembered value would silently drop every later request as well. */
  useEffect(() => { draft = { ...f, site: '' } }, [f])

  /* Stops a send that is still in flight when the page closes. */
  const closing = useRef(null)
  useEffect(() => {
    closing.current = new AbortController()
    return () => closing.current?.abort()
  }, [])
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | sent | failed
  const [sent, setSent] = useState(null)

  const service = requestServices.find((s) => s.id === f.service) || null

  const set = (k) => (e) => {
    const v = e.target.value
    setF((p) => (k === 'service' ? { ...p, service: v, sub: '' } : { ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Please add your name.'
    if (!f.email.trim()) e.email = 'Please add your email address.'
    else if (!isEmail(f.email.trim())) e.email = 'That email address does not look complete.'
    if (f.phone.trim() && f.phone.replace(/\D/g, '').length < 6) e.phone = 'That phone number looks too short.'
    if (!f.service) e.service = 'Please choose a service.'
    else if (!f.sub) e.sub = 'Please choose one option.'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (state === 'sending') return
    /* A field no person can see. Anything that fills it in is a script. */
    if (f.site) { setSent({ via: 'emailjs' }); setState('sent'); return }

    const e = validate()
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }

    setState('sending')
    try {
      const res = await sendRequest({
        ...f,
        name: f.name.trim(),
        email: f.email.trim(),
        company: f.company.trim(),
        phone: f.phone.trim(),
        note: f.note.trim(),
      }, { signal: closing.current?.signal })
      if (res.via === 'closed') return
      setSent(res)
      setState('sent')
      if (res.via !== 'mailto') draft = null
    } catch {
      setState('failed')
    }
  }

  /* The confirmation replaces the form, so move focus to it. Otherwise a
     keyboard user is left on a button that no longer exists. */
  const done = useRef(null)
  useEffect(() => {
    if (state === 'sent') done.current?.focus()
    /* And back again. Returning to the form unmounts the button that was
       pressed, which would otherwise drop focus onto the page behind. `sent`
       is null on first mount, so this never fights the trap's first focus. */
    else if (state === 'idle' && sent) document.getElementById(`${uid}-name`)?.focus()
  }, [state])

  const field = (k, label, icon, props = {}, optional = false) => (
    <div className={`req-field ${errors[k] ? 'is-bad' : ''}`}>
      <label htmlFor={`${uid}-${k}`}>
        <Icon name={icon} size={16} />
        <span>{label}</span>
        {optional && <em>Optional</em>}
      </label>
      <input
        id={`${uid}-${k}`}
        value={f[k]}
        onChange={set(k)}
        aria-invalid={errors[k] ? 'true' : undefined}
        aria-describedby={errors[k] ? `${uid}-${k}-e` : undefined}
        {...props}
      />
      {errors[k] && <p className="req-err" id={`${uid}-${k}-e`}>{errors[k]}</p>}
    </div>
  )

  return createPortal(
    <div
      className={`req ${reduced ? 'is-still' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-h`}
    >
      <div className="req-shell" ref={trap}>
        <header className="req-bar">
          <button type="button" className="req-mark" onClick={onClose}>
            <i aria-hidden="true" />
            <span>{brand.full}</span>
          </button>
          <div className="req-bar-r">
            <SoundToggle />
            {/* The word is hidden on a phone, so the name is set here too. */}
            <button type="button" className="req-close" onClick={onClose} aria-label="Close">
              <span>Close</span>
              <Icon name="close" size={16} />
            </button>
          </div>
        </header>

        <div className="req-scroll" ref={scroller}>
          <div className="req-grid">
            <aside className="req-side">
              <p className="req-kicker">Request a service</p>
              <h2 id={`${uid}-h`}>Tell us what you need</h2>
              <p className="req-lede">
                Choose the service, add a few details and send. Your request goes
                straight to the team that handles it.
              </p>

              <ol className="req-steps" role="list">
                {STEPS.map((s, i) => (
                  <li key={s.k}>
                    <span className="req-step-i"><Icon name={s.icon} size={20} /></span>
                    <span className="req-step-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="req-step-k">{s.k}</span>
                    <span className="req-step-d">{s.d}</span>
                  </li>
                ))}
              </ol>

              <Slogan className="req-slogan" />
            </aside>

            {state === 'sent' ? (
              <div className="req-done" tabIndex={-1} ref={done}>
                <span className="req-done-i"><Icon name={sent?.via === 'mailto' ? 'mail' : 'check'} size={28} /></span>
                {sent?.via === 'mailto' ? (
                  <>
                    <h3>One more step</h3>
                    <p>
                      Your mail app should have opened with the request already
                      written and addressed to{' '}
                      <a className="req-link" href={sent.href}>{sent.to}</a>. Press
                      send there to finish. If nothing opened, use that link to
                      try again, or go back and copy what you wrote.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>Request sent</h3>
                    <p>
                      Thank you, {f.name.trim().split(' ')[0]}. Your request is with
                      the {service?.label} team, and they will contact you at{' '}
                      {f.email.trim()} to agree the details.
                    </p>
                  </>
                )}
                <div className="req-done-actions">
                  <button type="button" className="req-submit" onClick={onClose}>
                    Back to the site <i aria-hidden="true"><Icon name="arrow" size={16} /></i>
                  </button>
                  {sent?.via === 'mailto' ? (
                    /* Nothing has been sent yet as far as the page can tell,
                       so going back keeps every field as it was. */
                    <button type="button" className="req-ghost" onClick={() => setState('idle')}>
                      Back to my request
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="req-ghost"
                      onClick={() => { setF({ ...EMPTY }); setErrors({}); setState('idle') }}
                    >
                      Send another request
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form className="req-form" onSubmit={submit} noValidate>
                <div className="req-row">
                  {field('name', 'Full name', 'user', { type: 'text', autoComplete: 'name', required: true })}
                  {field('email', 'Email', 'mail', { type: 'email', autoComplete: 'email', inputMode: 'email', required: true })}
                </div>
                <div className="req-row">
                  {field('company', 'Company', 'building', { type: 'text', autoComplete: 'organization' }, true)}
                  {field('phone', 'Phone', 'phone', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' }, true)}
                </div>

                <div className={`req-field ${errors.service ? 'is-bad' : ''}`}>
                  <label htmlFor={`${uid}-service`}>
                    <Icon name="layers" size={16} />
                    <span>Service</span>
                  </label>
                  <div className="req-select">
                    <select
                      id={`${uid}-service`}
                      value={f.service}
                      onChange={set('service')}
                      required
                      aria-invalid={errors.service ? 'true' : undefined}
                      aria-describedby={errors.service ? `${uid}-service-e` : undefined}
                    >
                      <option value="">Choose a service</option>
                      {requestServices.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  {errors.service && <p className="req-err" id={`${uid}-service-e`}>{errors.service}</p>}
                </div>

                {/* Only once a service is chosen, and keyed on it so the list
                    and its entrance are fresh for each one. */}
                {service && (
                  <div className={`req-field req-field--sub ${errors.sub ? 'is-bad' : ''}`} key={service.id}>
                    <label htmlFor={`${uid}-sub`}>
                      <Icon name="list" size={16} />
                      <span>{service.subLabel}</span>
                    </label>
                    <div className="req-select">
                      <select
                        id={`${uid}-sub`}
                        value={f.sub}
                        onChange={set('sub')}
                        required
                        aria-invalid={errors.sub ? 'true' : undefined}
                        aria-describedby={errors.sub ? `${uid}-sub-e` : undefined}
                      >
                        <option value="">Choose one</option>
                        {service.subs.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    {errors.sub && <p className="req-err" id={`${uid}-sub-e`}>{errors.sub}</p>}
                  </div>
                )}

                <div className="req-field">
                  <label htmlFor={`${uid}-note`}>
                    <Icon name="note" size={16} />
                    <span>Note</span>
                    <em>Optional</em>
                  </label>
                  <textarea
                    id={`${uid}-note`}
                    rows={4}
                    value={f.note}
                    onChange={set('note')}
                    placeholder="Anything that helps us understand the job: dates, location, numbers."
                  />
                </div>

                {/* Hidden from people and from assistive technology alike. */}
                <div className="req-trap" aria-hidden="true">
                  <label htmlFor={`${uid}-site`}>Website</label>
                  <input id={`${uid}-site`} tabIndex={-1} autoComplete="off" value={f.site} onChange={set('site')} />
                </div>

                {state === 'failed' && (
                  <p className="req-fail" role="alert">
                    The request could not be sent just now. Please try again
                    {service ? `, or write to ${service.email}` : ''}.
                  </p>
                )}

                <div className="req-foot">
                  <button type="submit" className="req-submit" disabled={state === 'sending'}>
                    {state === 'sending' ? 'Sending' : 'Send request'}
                    <i aria-hidden="true"><Icon name="arrow" size={16} /></i>
                  </button>
                  <p className="req-small">
                    Your details are used only to answer this request.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
