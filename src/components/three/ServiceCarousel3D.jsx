import { Component, Suspense, useMemo, useRef, useState, lazy } from 'react'
import { catalog, photo } from '../../content/catalog'
import { prefersReduced } from '../../lib/useLenis'
import OryxMark from '../OryxMark'

/**
 * The hero's 3D coverflow — borrowed in structure from getlayers' "AI Studio"
 * template, but skinned entirely in the ORYX brand: glossy cream/gold cards
 * rotating through a centre focal point on a slow, continuous loop.
 *
 * The WebGL canvas is loaded lazily and only mounted after the app is
 * interactive, so three.js never sits on the critical path. When the visitor
 * has asked for reduced motion — or the browser cannot give us a context — the
 * whole thing degrades to a plain static fan of the same cards (see the
 * `.svc-fallback` markup below), which carries the identical content.
 */

/**
 * The service stations. One more station sits on the ring than appears here —
 * the brand card — which is not in this list because it is the hero itself, one
 * persistent element that reflows into a card as the ring assembles. It is
 * owned by `BrandCard`.
 */
export const CARDS = catalog.map((s) => ({
  id: s.id,
  eyebrow: s.eyebrow,
  title: s.title,
  pillar: s.pillar,
  image: s.image,
  tone: 'paper',
}))

/**
 * The DOM face of a single card — identical whether drawn flat or in 3D.
 *
 * It is a <button> rather than an <article> so the whole face is one hit target
 * and reachable from the keyboard. Only the card facing the camera receives
 * pointer events (the stage sets that per frame), so a press can never land on
 * a card the visitor cannot actually see.
 */
export function ServiceCardFace({ card, onOpen }) {
  return (
    <button
      type="button"
      className={`svc-card svc-card--${card.tone}`}
      data-card={card.id}
      onClick={(e) => {
        // Hand up where the card actually is on screen. The card lives inside a
        // 3D transform, but getBoundingClientRect still reports its real
        // projected box — which is what lets the panel grow from exactly here.
        const r = e.currentTarget.getBoundingClientRect()
        onOpen?.(card.id, { x: r.left, y: r.top, w: r.width, h: r.height })
      }}
      aria-label={`${card.title}. ${card.pillar}. Open details.`}
    >
      {/* A band of the service's own photography. The cards were correct but
          inert as pure type; an image gives each one a subject before a word of
          it is read. It is masked into the card rather than sitting in a box,
          so the card still reads as one object. */}
      {card.image && (
        <img
          className="svc-card-photo"
          src={photo(card.image.id, 400)}
          alt=""
          draggable="false"
        />
      )}

      <div className="svc-card-top">
        <span className="svc-card-eyebrow">{card.eyebrow}</span>
        <span className="svc-card-glyph" aria-hidden="true">
          <OryxMark size={26} />
        </span>
      </div>
      <h3 className="svc-card-title">
        {card.title.split('\n').map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </h3>
      <p className="svc-card-pillar">{card.pillar}</p>
    </button>
  )
}

/** Static, no-WebGL rendering: a fanned deck that keeps the same content. */
function StaticFan({ onOpen }) {
  return (
    <div className="svc-fallback" aria-hidden="false">
      {CARDS.slice(0, 4).map((card, i) => (
        <div className="svc-fallback-slot" key={card.id} style={{ '--i': i }}>
          <ServiceCardFace card={card} onOpen={onOpen} />
        </div>
      ))}
    </div>
  )
}

// The R3F scene lives in its own chunk so three.js is never in the main bundle.
const CanvasScene = lazy(() => import('./CarouselCanvas'))

/**
 * If WebGL cannot start — no context, a lost device, an ancient browser, or the
 * in-app preview pane which has no rAF/WebGL — we do not want a blank hero. This
 * boundary catches the throw and shows the same static fan the reduced-motion
 * path uses, so the content is always present regardless of the renderer.
 */
class CanvasBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return <StaticFan onOpen={this.props.onOpen} />
    return this.props.children
  }
}

export default function ServiceCarousel3D({ onOpen, onContact, onExplore }) {
  // `mounted` gates the canvas so it appears only client-side and only once the
  // browser has painted the fallback first — no layout jump, no SSR mismatch.
  const [mounted, setMounted] = useState(false)
  const holder = useRef(null)

  useMemo(() => {
    if (typeof window === 'undefined') return
    if (prefersReduced) return // reduced motion keeps the static fan
    // Defer to idle so the hero text animates first, then the ring fades in.
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMounted(true), { timeout: 1200 })
      : window.setTimeout(() => setMounted(true), 400)
    return id
  }, [])

  return (
    <div className="svc-stage" ref={holder}>
      {prefersReduced || !mounted ? (
        <StaticFan onOpen={onOpen} />
      ) : (
        <CanvasBoundary onOpen={onOpen}>
          <Suspense fallback={<StaticFan onOpen={onOpen} />}>
            <CanvasScene onOpen={onOpen} onContact={onContact} onExplore={onExplore} />
          </Suspense>
        </CanvasBoundary>
      )}
    </div>
  )
}
