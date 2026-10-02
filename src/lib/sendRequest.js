import { mail, requestServices } from '../content/requests'
import { getLang, LANG_NAMES } from '../i18n/core'

/**
 * Send one request to the address of the service it is about.
 *
 * The site is static, so something has to do the sending. EmailJS is the
 * first choice and is called over its REST endpoint, which avoids adding its
 * SDK as a dependency for one POST. If its keys are not filled in yet, or the
 * call fails, the request falls back to the visitor's own mail app with
 * everything already written. That fallback is not an error path to be
 * ashamed of: it is what makes the form usable on day one, before any account
 * has been set up.
 *
 * Returns `{ via: 'emailjs' | 'mailto' }`, and for mailto the link itself, so the
 * page can offer it again if no mail app opened. The form words its confirmation
 * differently for each, because only one of them has actually sent anything.
 */
const ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

const ready = (service) => {
  const k = mail.emailjs
  return mail.provider === 'emailjs' && k.serviceId && k.publicKey && service.templateId
}

/* Long enough for a slow connection, short enough that nobody is left looking
   at "Sending" for ever. */
const TIMEOUT_MS = 12000

const asText = (f, service, sub) =>
  [
    `Service: ${service.label}`,
    `${service.subLabel}: ${sub?.label || '-'}`,
    '',
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Company: ${f.company || '-'}`,
    `Phone: ${f.phone || '-'}`,
    /* The labels stay English for the team; the visitor's own words, and the
       service names, arrive in the language they used the site in. */
    `Language: ${LANG_NAMES[getLang()]}`,
    '',
    'Note:',
    f.note || '-',
  ].join('\n')

export async function sendRequest(fields, { signal } = {}) {
  const service = requestServices.find((s) => s.id === fields.service)
  if (!service) throw new Error('Unknown service')
  const sub = service.subs.find((s) => s.id === fields.sub)

  if (ready(service)) {
    /* Two ways out of a request that will not finish: our own timer, and the
       page closing. Only the first should fall through to the mail app. */
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)
    const onAbort = () => ac.abort()
    signal?.addEventListener('abort', onAbort)
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        signal: ac.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: mail.emailjs.serviceId,
          /* One template per service, each with its inbox fixed inside
             EmailJS. The recipient is never sent from here. */
          template_id: service.templateId,
          user_id: mail.emailjs.publicKey,
          template_params: {
            service: service.label,
            sub_service: sub?.label || '',
            name: fields.name,
            email: fields.email,
            reply_to: fields.email,
            company: fields.company,
            phone: fields.phone,
            note: fields.note,
            language: LANG_NAMES[getLang()],
          },
        }),
      })
      if (res.ok) return { via: 'emailjs' }
    } catch {
      /* Offline, blocked, timed out or misconfigured. The mail app still works. */
    } finally {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    }
  }

  /* The visitor closed the page while it was sending. Opening their mail app
     over whatever they went back to would come from nowhere. */
  if (signal?.aborted) return { via: 'closed' }

  const subject = `${service.label} request: ${sub?.label || 'general'}`
  const href = `mailto:${service.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(asText(fields, service, sub))}`
  window.location.href = href
  return { via: 'mailto', to: service.email, href }
}
