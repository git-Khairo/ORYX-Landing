import { useState } from 'react'
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
  const [openId, setOpenId] = useState(null)
  /* Once this is true the film is unmounted, not hidden — there is no path
     back to it short of reloading, which is exactly the intent. */
  const [introDone, setIntroDone] = useState(false)
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

  const request = (serviceId, subId) =>
    setReq({
      service: services.some((s) => s.id === serviceId) ? serviceId : '',
      sub: subId || '',
    })

  return (
    <SoundProvider>
      {/* Only once the film has gone. While the intro is up the page beneath
          is locked, so a link promising to jump into it would be a dead end —
          the intro's own control is the way through, and it is reachable by
          keyboard from the first frame. */}
      {introDone && <a className="skip-link" href="#work">Skip to services</a>}
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
        />
      )}

      {req && <RequestPage preset={req} onClose={() => setReq(null)} />}
    </SoundProvider>
  )
}
