import { useState } from 'react'
import { useLenis } from './lib/useLenis'
import { usePager } from './lib/usePager'
import ContactGateway from './components/ContactGateway'
import './styles/components.css'
import './styles/sections.css'

import Backdrop from './components/Backdrop'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import ProgressRail from './components/ProgressRail'

import Hero from './sections/Hero'
import Discover from './sections/Discover'
import Technology from './sections/Technology'
import Services from './sections/Services'
import OryxMoment from './sections/OryxMoment'
import WhyOryx from './sections/WhyOryx'
import Sustainability from './sections/Sustainability'
import Process from './sections/Process'
import Contact from './sections/Contact'
import Statement from './sections/Statement'

export default function App() {
  useLenis()
  usePager()

  // The contact experience is an overlay, not a place on the page — a service
  // world can hand straight into it without the visitor losing their position.
  // `null` = closed; a service id or '' (undecided) = open.
  const [request, setRequest] = useState(null)
  const openRequest = (serviceId = '') => setRequest(serviceId)

  return (
    <>
      <Preloader />
      <Backdrop />
      <Nav onContact={() => openRequest()} />
      <ProgressRail />

      <main className="content-layer">
        <Hero />
        <Discover />
        <Technology />
        <Services onRequest={openRequest} />
        <OryxMoment />
        <WhyOryx />
        <Sustainability />
        <Process />
        <Contact onRequest={openRequest} />
        <Statement onRequest={openRequest} />
      </main>

      {request !== null && (
        <ContactGateway initialService={request} onClose={() => setRequest(null)} />
      )}
    </>
  )
}
