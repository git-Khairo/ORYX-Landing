import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import { SoundProvider } from './components/Sound'
import ServiceWorld from './components/ServiceWorld'
import Hero from './sections/Hero'
import Work from './sections/Work'
import Footer from './sections/Footer'
import RequestPage from './sections/RequestPage'
import { services } from './content/copy'
import './styles/nav.css'
import './styles/cursor.css'
import './styles/hero.css'
import './styles/work.css'
/* One shell, three worlds. `service.css` is gone with the single-template
   component it styled — see ServiceWorld. */
import './styles/world-shell.css'
import './styles/world-transport.css'
import './styles/world-workforce.css'
/* The Workforce crew scene keeps its styles beside it by name. */
import './styles/wf-crew.css'
import './styles/world-renovation.css'
/* Last, so the per-service identities win any tie with the shared world
   styles they are overriding. */
import './styles/world-identity.css'
import './styles/footer.css'
/* The pieces every surface shares: the sound switch, the detail popup, the
   card grids and the request page. After the worlds, so a popup carrying a
   `world--<id>` class still gets its own layout from here. */
import './styles/shared.css'
import './styles/request.css'
import { ui } from './content/ui'
import { switchLanguage, takeCarry } from './i18n/boot'
import { LangContext } from './i18n/context'

/**
 * The site is two surfaces and an intro.
 *
 * The film is no longer the first section of a scrollable page — it is an
 * overlay that plays over a locked page and then leaves for good. That is a
 * deliberate difference: a hero you can scroll back up to is a section, and a
 * visitor who returns to the top mid-read gets twenty seconds of titles they
 * did not ask for. Held as an intro, the film is a thing that happens once,
 * can be dismissed at any point, and cannot be stumbled back into.
 */
export default function App() {
  /* Set by a language switch on the page before this one; null on an
     ordinary visit. */
  const [carry] = useState(takeCarry)
  const [openId, setOpenId] = useState(() => carry?.open ?? null)
  /* Once this is true the film is unmounted, not hidden — there is no path
     back to it short of reloading, which is exactly the intent. A visitor who
     has just switched language has already seen it. */
  const [introDone, setIntroDone] = useState(Boolean(carry))

  /* Back to where the reading was: on the home page underneath, and inside
     the service page if one was open. That page mounts and lays itself out
     over a few frames, so its panel is retried until it is tall enough. */
  useEffect(() => {
    if (carry?.y) window.scrollTo(0, carry.y)
    if (!carry?.wy) return
    let tries = 0
    const id = setInterval(() => {
      const panel = document.querySelector('.world-scroll')
      if (panel && panel.scrollHeight - panel.clientHeight >= carry.wy) {
        /* Instant: the panel scrolls smoothly by default, and a page that
           glides down from the top after the load reads as a jump. */
        panel.scrollTo({ top: carry.wy, behavior: 'instant' })
        clearInterval(id)
      } else if (++tries > 40) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [carry])

  const switchTo = (lang) => switchLanguage(lang, { open: openId })
  const service = services.find((s) => s.id === openId) || null

  /* The request page. `null` is closed; otherwise `{ service, sub }`, either
     of which may be empty. It opens over whatever is already on screen, so a
     visitor inside a service page closes the form and is back where they were
     reading, not dropped at the foot of the home page. */
  const [req, setReq] = useState(null)

  /* `Work` and the footer's service links send a real service id. Anything
     that is not a service id is a request to get in touch, which now means
     the request page. */
  const open = (id) => {
    if (services.some((s) => s.id === id)) setOpenId(id)
    else setReq({})
  }

  const request = (serviceId, subId, note) =>
    setReq({
      service: services.some((s) => s.id === serviceId) ? serviceId : '',
      sub: subId || '',
      /* Only ever a string. The service buttons pass their click event through
         as an extra argument in places, and an event object must not end up in
         a text field. */
      note: typeof note === 'string' ? note : '',
    })

  return (
    <LangContext.Provider value={switchTo}>
    <SoundProvider>
      {/* Only once the film has gone. While the intro is up the page beneath
          is locked, so a link promising to jump into it would be a dead end —
          the intro's own control is the way through, and it is reachable by
          keyboard from the first frame. */}
      {introDone && <a className="skip-link" href="#work">{ui.app.skip}</a>}
      {/* The chrome stays mounted underneath the film so the page is already
          there the instant the intro clears — nothing has to load in behind it. */}
      <Cursor />
      <Nav onRequest={() => request()} />
      {/* `warm` gates the door films. The gateway itself stays mounted under
          the intro so the page is there the instant the wipe clears — but its
          three 1080p door clips were mounting with `autoPlay` too, decoding
          underneath the film for its whole runtime. That was the intro's
          stutter. The films arrive when the intro goes. */}
      <Work onOpenService={open} warm={introDone} />
      <Footer onOpenService={open} />

      {!introDone && <Hero onFinish={() => setIntroDone(true)} />}

      {service && (
        <ServiceWorld
          key={service.id}
          service={service}
          onClose={() => setOpenId(null)}
          onRequest={request}
          onSwitch={open}
        />
      )}

      {req && <RequestPage preset={req} onClose={() => setReq(null)} />}
    </SoundProvider>
    </LangContext.Provider>
  )
}
