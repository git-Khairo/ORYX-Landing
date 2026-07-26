import { useLenis } from './lib/useLenis'
import './styles/components.css'
import './styles/sections.css'

import Scene from './three/Scene'
import Preloader from './components/Preloader'
import Frame from './components/Frame'
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

  return (
    <>
      <Preloader />
      <Scene />
      <Frame />
      <Nav />
      <ProgressRail />

      <main className="content-layer">
        <Hero />
        <Discover />
        <Technology />
        <Services />
        <OryxMoment />
        <WhyOryx />
        <Sustainability />
        <Process />
        <Contact />
        <Statement />
      </main>
    </>
  )
}
