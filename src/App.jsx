import { useState } from 'react'
import Nav from './components/Nav'
import ServiceWorld from './components/ServiceWorld'
import Hero from './sections/Hero'
import Work from './sections/Work'
import Footer from './sections/Footer'
import { services } from './content/copy'
import './styles/nav.css'
import './styles/hero.css'
import './styles/work.css'
/* One shell, three worlds. `service.css` is gone with the single-template
   component it styled — see ServiceWorld. */
import './styles/world-shell.css'
import './styles/world-transport.css'
import './styles/world-workforce.css'
import './styles/world-renovation.css'
import './styles/footer.css'

/**
 * Three surfaces — the opening film, the working screen, the close — plus the
 * service world that opens over all of them.
 */
export default function App() {
  const [openId, setOpenId] = useState(null)
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
      <a className="skip-link" href="#work">Skip the intro</a>
      <Nav />
      <Hero />
      <Work onOpenService={open} />
      <Footer onOpenService={open} />

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
