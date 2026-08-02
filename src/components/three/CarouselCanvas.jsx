import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { CARDS, ServiceCardFace } from './ServiceCarousel3D'
import BrandCard from '../BrandCard'
import { getCinema, phase, ACT } from '../../lib/useCinemaProgress'

/**
 * Acts 1–4, as one continuous function of scroll.
 *
 * Nothing animates on its own clock: every frame reads the master cinema
 * progress and derives the whole stage from it, so the sequence scrubs forwards
 * and backwards in step with the wheel.
 *
 * The brand station is not a card that appears — it is the hero, which becomes
 * one. It sits outside the ring group so it can be full-screen while the ring
 * is still collapsed to its axis, and its DOM element is *resized in pixels*
 * rather than scaled, so its contents reflow from a hero's arrangement to a
 * card's instead of being squashed. Once the morph is done it takes station 0
 * and rides the ring like any other card.
 */
const DISTANCE_FACTOR = 2.5
/** drei's `<Html transform>` maps 1 CSS pixel to `distanceFactor / 400` world
 *  units. Everything that has to agree between DOM pixels and the 3D scene goes
 *  through this, so the two can never drift apart. */
const PX_TO_WORLD = DISTANCE_FACTOR / 400
const CARD_PX = { w: 210, h: 286 } // must match `.svc-card` in CSS

/**
 * Sized from the ring's own contents rather than picked by eye: with eleven
 * stations a fixed radius would overlap every card with its neighbour. The
 * chord between adjacent stations is 2R·sin(π/N), so solving that for a
 * comfortable gap keeps the spacing right whatever the catalogue length.
 */
const CARD_W_WORLD = CARD_PX.w * PX_TO_WORLD
const CARD_COUNT_TOTAL = CARDS.length + 1 // services + the brand station
const RADIUS = Math.max(
  1.15,
  (CARD_W_WORLD * 1.5) / (2 * Math.sin(Math.PI / CARD_COUNT_TOTAL)),
)
/**
 * Shared by every station, and deliberately drei's own default.
 *
 * `zIndexRange` is [nearest, farthest] — the FIRST value is what a card gets
 * when it is closest to the camera. Passing these the other way round paints
 * the back of the ring over its front, which is what was burying the brand card
 * behind a mirrored service card.
 *
 * The span also has to be enormous. drei interpolates z across the camera's
 * whole near..far range and floors the result, so over a ring only ~2 units
 * deep a small range like [40, 0] rounds every card to the same integer and
 * the ordering collapses again.
 */
const CARD_Z_RANGE = [16777271, 0]

function Stage({ onOpen, onContact, onExplore }) {
  const ring = useRef()
  const brand = useRef() // the 3D group carrying the brand station
  const brandEl = useRef() // its DOM element
  const logoEl = useRef() // the one <img> that survives the whole sequence
  const faces = useRef([])
  const aim = useRef({ x: 0, y: 0 }) // eased pointer, for the mark's lean

  useFrame(({ camera, pointer }) => {
    const p = getCinema().p
    const tMorph = phase(p, ...ACT.morph)
    const tRotate = phase(p, ...ACT.rotate)
    const tZoom = phase(p, ...ACT.zoom)

    // ── The ring ────────────────────────────────────────────────────────────
    const spin = -tRotate * Math.PI * 2
    if (ring.current) {
      ring.current.rotation.y = spin
      ring.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, tMorph))
    }

    // ── The brand station: hero → card ──────────────────────────────────────
    if (brand.current && brandEl.current) {
      // Act 1 covers the frustum exactly, expressed in the DOM's own units.
      const dist = Math.abs(camera.position.z)
      const heroH = 2 * dist * Math.tan(((camera.fov * Math.PI) / 180) / 2)
      const heroW = heroH * camera.aspect
      const w = Math.round(THREE.MathUtils.lerp(heroW / PX_TO_WORLD, CARD_PX.w, tMorph))
      const h = Math.round(THREE.MathUtils.lerp(heroH / PX_TO_WORLD, CARD_PX.h, tMorph))

      const el = brandEl.current
      el.style.width = `${w}px`
      el.style.height = `${h}px`
      el.style.setProperty('--m', tMorph.toFixed(4))

      // Rides station 0 once it has become a card; centred before that.
      brand.current.position.set(
        Math.sin(spin) * RADIUS * tMorph,
        0,
        Math.cos(spin) * RADIUS * tMorph,
      )
      brand.current.rotation.y = spin

      // ── The zoom ──────────────────────────────────────────────────────────
      // The same <img>, grown from the solid stem below where the horns cross.
      // Growing from the centre would drive the zoom through the gap between
      // them and tear the fill open.
      if (logoEl.current) {
        const s = 1 + tZoom * tZoom * 120
        logoEl.current.style.setProperty('--zoom', s.toFixed(3))

        // ── 3D → 2D ────────────────────────────────────────────────────────
        // The mark is a stack of layers in Act 1 and a single flat image by the
        // time it is a card. Both the gap between layers and the yaw ease to
        // zero over the first third of the morph, and at zero gap every layer
        // lands on the same plane — so it *becomes* the 2D image rather than
        // being swapped for it. There is no cross-fade and no seam.
        const flat = Math.min(tMorph / 0.34, 1)
        const solid = 1 - flat * flat * (3 - 2 * flat) // smoothstep
        // Depth is a share of the mark's current pixel height, so it holds its
        // proportions as the hero shrinks instead of thinning out.
        const logoPx = h * (0.62 + (0.34 - 0.62) * tMorph)
        logoEl.current.style.setProperty('--depth', `${(solid * logoPx * 0.0055).toFixed(3)}px`)
        // A slow turn while it is still an object, plus a lean toward the
        // pointer — a dimensional thing that ignores you reads as a picture of
        // a dimensional thing. Both settle square to the camera exactly as it
        // flattens, so the handoff to 2D is still face-on.
        //
        // `pointer` is R3F's own normalised -1..1 over the canvas, so this needs
        // no listener of its own and costs nothing when the cursor is still.
        // It is eased rather than applied raw, or the mark snaps about.
        aim.current.x += (pointer.x - aim.current.x) * 0.06
        aim.current.y += (pointer.y - aim.current.y) * 0.06

        const yaw = solid * (11 * Math.sin(performance.now() / 2600) + aim.current.x * 16)
        const pitch = solid * (-aim.current.y * 11)
        logoEl.current.style.setProperty('--yaw', `${yaw.toFixed(2)}deg`)
        logoEl.current.style.setProperty('--pitch', `${pitch.toFixed(2)}deg`)
      }
      // Let the mark escape its own card once it starts to rush the lens.
      el.style.setProperty('--card-overflow', tZoom > 0.001 ? 'visible' : 'hidden')
      // The card itself gets out of the way; the mark does not.
      el.style.setProperty('--card-face', (1 - tZoom).toFixed(3))
    }

    // ── The service cards ───────────────────────────────────────────────────
    for (const item of faces.current) {
      if (!item?.el) continue
      const f = Math.cos(item.theta + spin)
      const o = tMorph * (1 - tZoom)
      item.el.style.opacity = o.toFixed(3)
      item.el.style.transform = `scale(${(0.88 + 0.12 * Math.max(f, 0)).toFixed(3)})`
      // Only the card actually facing the viewer takes presses, so a click can
      // never land on one edge-on or behind. With four stations 90° apart the
      // front card owns ±45°, and 0.72 is just inside that — tight enough that
      // two cards are never live at once, wide enough that the front one does
      // not have to be centred to the degree before it can be pressed.
      item.el.style.pointerEvents = f > 0.72 ? 'auto' : 'none'
    }

    camera.position.z = THREE.MathUtils.lerp(6.4, 5.4, tMorph) - tZoom * 1.6
    camera.updateProjectionMatrix()
  })

  return (
    <>
      {/* Station 0 — outside the ring, because it has to be a full screen while
          the ring is still a point. */}
      <group ref={brand}>
        <Html
          transform
          distanceFactor={DISTANCE_FACTOR}
          zIndexRange={CARD_Z_RANGE}
          className="svc-card-html brand-card-html"
        >
          <BrandCard
            cardRef={brandEl}
            logoRef={logoEl}
            onContact={onContact}
            onExplore={onExplore}
          />
        </Html>
      </group>

      {/* Stations 1..3 — the services. */}
      <group ref={ring}>
        {CARDS.map((card, i) => {
          const theta = ((i + 1) / CARD_COUNT_TOTAL) * Math.PI * 2
          return (
            <group
              key={card.id}
              position={[Math.sin(theta) * RADIUS, 0, Math.cos(theta) * RADIUS]}
              rotation={[0, theta, 0]}
            >
              <Html
                transform
                distanceFactor={DISTANCE_FACTOR}
                zIndexRange={CARD_Z_RANGE}
                className="svc-card-html"
              >
                <div
                  className="svc-card-fade"
                  ref={(el) => {
                    faces.current[i] = { el, theta }
                  }}
                >
                  <ServiceCardFace card={card} onOpen={onOpen} />
                </div>
              </Html>
            </group>
          )
        })}
      </group>
    </>
  )
}

export default function CarouselCanvas({ onOpen, onContact, onExplore }) {
  return (
    <Canvas
      className="svc-canvas is-ready"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.4], fov: 40 }}
    >
      <Stage onOpen={onOpen} onContact={onContact} onExplore={onExplore} />
    </Canvas>
  )
}
