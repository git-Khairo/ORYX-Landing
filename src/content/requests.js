/**
 * Everything the request form needs that is not a layout decision.
 *
 * ── TO GO LIVE, FILL IN THREE THINGS ─────────────────────────────────
 * 1. `email` on each service below. One address per service. It is what the
 *    site shows, and what the mail-app fallback writes to.
 * 2. `mail.emailjs` below, if EmailJS is the sender you choose. Until the
 *    three keys are filled in, the form opens the visitor's own mail app with
 *    the request already written, addressed to the right service. Nothing is
 *    lost in the meantime; it is simply one more click for the visitor.
 * 3. `social` links at the bottom.
 *
 * `npm run check:claims` lists whichever of these are still placeholders, and
 * stops listing them the moment they are filled in.
 *
 * ── EmailJS, in short ────────────────────────────────────────────────
 * Create one email service at emailjs.com, and THREE templates, one for each
 * ORYX service. In each template type the real inbox into the "To email"
 * field. Do not use a {{variable}} there. The ids and the public key below
 * are visible to anyone who opens the site, so if the recipient came from the
 * page, anybody could use ORYX's mail account to send mail to any address.
 * With the address fixed inside EmailJS, the worst a stranger can do is send
 * ORYX a message.
 *
 * A template can use these variables:
 *   {{service}} {{sub_service}} {{name}} {{email}} {{company}} {{phone}} {{note}}
 * Set its "Reply to" field to {{reply_to}} so answering goes to the visitor.
 * Then paste the service id and the public key below, and each template id
 * beside its service further down.
 *
 * The sender is one small function, `src/lib/sendRequest.js`. Swapping EmailJS
 * for another provider later means editing that file and nothing else.
 */
import { sectors } from './workforce.js'
import { services as renovationServices } from './renovation.js'

export const mail = {
  provider: 'emailjs',
  emailjs: { serviceId: '', publicKey: '' },
}

/* The five things Transport sells, named once. The Transport footer reads this
   list too, so the form and the page cannot drift apart. */
export const transportServices = [
  { id: 'scheduled', label: 'Scheduled routes', icon: 'calendar' },
  { id: 'on-demand', label: 'On-demand transport', icon: 'bolt' },
  { id: 'between-sites', label: 'Transfers between sites', icon: 'swap' },
  { id: 'specialist', label: 'Specialist handling', icon: 'box' },
  { id: 'cross-border', label: 'Cross-border transport', icon: 'globe' },
]

export const requestServices = [
  {
    id: 'transport',
    label: 'Transport & Logistics',
    cta: 'Book a vehicle',
    email: 'dispatch@oryx.example',
    templateId: '',
    subLabel: 'Type of transport',
    subs: transportServices.map(({ id, label }) => ({ id, label })),
  },
  {
    id: 'workforce',
    label: 'Workforce',
    cta: 'Request staff',
    email: 'people@oryx.example',
    templateId: '',
    subLabel: 'Sector',
    subs: sectors.map((s) => ({ id: s.id, label: s.name })),
  },
  {
    id: 'renovation',
    label: 'Renovation',
    cta: 'Book a property check',
    email: 'projects@oryx.example',
    templateId: '',
    subLabel: 'Type of work',
    subs: renovationServices.map((s) => ({ id: s.id, label: s.name })),
  },
]

/* The inbox shown in each service page's footer, read from the list above so
   there is one place to change it. */
export const emailFor = (id) => requestServices.find((s) => s.id === id)?.email || ''

export const ctaFor = (id) => requestServices.find((s) => s.id === id)?.cta || 'Request a service'

/* Leave `href` empty until the account exists. An empty one renders the icon
   without a link, so the footer never ships a dead or wrong address. */
export const social = [
  { id: 'instagram', label: 'Instagram', href: '' },
  { id: 'linkedin', label: 'LinkedIn', href: '' },
  { id: 'facebook', label: 'Facebook', href: '' },
]
