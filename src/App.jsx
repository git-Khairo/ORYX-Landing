import { useState } from 'react'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Ambience from './components/Ambience'
import ServiceWorld from './components/ServiceWorld'
import Hero from './sections/Hero'
import Work from './sections/Work'
import Footer from './sections/Footer'
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

  /**
   * One entry point for both callers, and they do not pass the same thing.
   * `Work` sends a real service id; the footer's "Start a request" sends an
   * empty string, meaning "take me to contact" rather than "open service ''".
   * Resolving against the services list is what keeps that distinction honest —
   * anything that is not a service simply falls through to the contact section.
   */
  const open = (id) => {
    if (services.some((s) => s.id === id)) {
      setOpenId(id)
      return
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const request = () => {
    setOpenId(null)
    // Let the overlay unmount and the scroll lock release before moving, or the
    // restore fights the scroll and the page lands in the wrong place.
    requestAnimationFrame(() =>
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
    )
  }

  return (
    <>
      {/* Only once the film has gone. While the intro is up the page beneath
          is locked, so a link promising to jump into it would be a dead end —
          the intro's own control is the way through, and it is reachable by
          keyboard from the first frame. */}
      {introDone && <a className="skip-link" href="#work">Skip to services</a>}
      {/* The chrome stays mounted underneath the film so the page is already
          there the instant the intro clears — nothing has to load in behind it. */}
      <Cursor />
      <Nav />
      {/* Armed from the first paint, so the soundtrack runs under the opening
          film rather than starting after it. Ambience handles the case where
          the browser refuses to autoplay. */}
      <Ambience />
      <Work onOpenService={open} />
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
    </>
  )
}
