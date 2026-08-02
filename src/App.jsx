import { useState } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import ContactGateway from './components/ContactGateway'
import './styles/components.css'
import './styles/sections.css'

import Preloader from './components/Preloader'
import Nav from './components/Nav'

import ServiceDetail from './components/ServiceDetail'
import Cinema from './sections/Cinema'
import HowItWorks from './sections/HowItWorks'
import Statement from './sections/Statement'

/**
 * The site is one continuous scroll-scrubbed sequence rather than a stack of
 * self-contained screens:
 *
 *   loader → [Acts 1–4] the mark, the ring assembling around it, the turn
 *   through the services, the rush into the fill → [Act 5] the standard →
 *   [Act 6] how it works, travelling horizontally → [Act 7] the last frame
 *   opens into the closing statement.
 *
 * `useSmoothScroll` owns the scroll spine (Lenis + ScrollTrigger). The old
 * snap-pager, progress rail and per-section backdrop are gone: paging fought
 * scrubbing for the same gesture, and only one of them can win.
 */
export default function App() {
  useSmoothScroll()

  // The contact experience is an overlay, not a place on the page — the nav and
  // the closing statement can hand straight into it without losing position.
  // `null` = closed; a service id or '' (undecided) = open.
  const [request, setRequest] = useState(null)
  // Which service has been opened out to the full screen; null = none.
  const [openService, setOpenService] = useState(null) // { id, rect }
  const openRequest = (serviceId = '') => setRequest(serviceId)

  return (
    <>
      <Preloader />
      <Nav
        onContact={() => openRequest()}
        /* No card was pressed, so there is no rect to grow from — the panel
           falls back to its own entrance. */
        onOpenService={(id) => setOpenService({ id, rect: null })}
      />

      <main className="content-layer">
        {/* Acts 1–5: the mark, the ring, the zoom, and The Standard — which is
            revealed by the transition itself rather than scrolled to. */}
        <Cinema
          onOpenService={(id, rect) => setOpenService({ id, rect })}
          onContact={() => openRequest()}
        />
        <HowItWorks />
        {/* Scroll budget for Act 7: the frame's zoom is scrubbed against this. */}
        <div id="how-zoom" className="how-zoom" aria-hidden="true" />
        <Statement onRequest={openRequest} />
      </main>

      {openService && (
        <ServiceDetail
          serviceId={openService.id}
          originRect={openService.rect}
          onClose={() => setOpenService(null)}
          onRequest={(id) => {
            setOpenService(null)
            // Ids match the journeys in `copy.js`, so the request opens on this
            // service's own question flow rather than the undecided one.
            openRequest(id)
          }}
        />
      )}

      {request !== null && (
        <ContactGateway initialService={request} onClose={() => setRequest(null)} />
      )}
    </>
  )
}
