import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { process } from '../content/copy'
import { photo } from '../content/catalog'
import CurvedLines from '../components/CurvedLines'
import Statement from './Statement'
import { prefersReduced } from '../lib/useLenis'
import '../styles/flowscene.css'

/**
 * One continuous horizontal journey — intro, four process steps, and the
 * closing statement, all in a single pinned scroll.
 *
 * The camera travels a waypoint path: it moves directly to each step and
 * centres on it, so every step is always fully visible when the camera arrives.
 * The alternating Y positions of the waypoints produce the S-shape: the path
 * arcs above and below the midline between steps, weaving through them rather
 * than flying past them.
 */
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)

const STEP_PHOTOS = [5025639, 3184292, 2760241, 3862632]

/**
 * Step world positions. The camera centres on each one when it arrives, so the
 * step is always exactly in the middle of the screen at that moment. Alternating
 * Y values give the S-shape; the values stay moderate so nothing clips.
 */
const STEPS = [
  { x: 1.1,  y: 0.38 },
  { x: 1.78, y: 0.62 },
  { x: 2.46, y: 0.36 },
  { x: 3.14, y: 0.64 },
]

const X_INTRO = 0.5
const X_STMT  = 3.9
const STMT_W  = 0.42
const SF      = 1 / STMT_W

/**
 * Camera waypoints. Each waypoint records the world position the camera centres
 * on and the scroll-progress fraction at which it arrives. The camera eases
 * between consecutive waypoints using smooth-step so each transition accelerates
 * out and decelerates in rather than moving at a constant rate.
 */
const P_ZOOM = 0.74  // progress at which the zoom phase starts

const WAYPOINTS = [
  { x: X_INTRO,    y: 0.5,         p: 0    },
  { x: STEPS[0].x, y: STEPS[0].y,  p: 0.13 },
  { x: STEPS[1].x, y: STEPS[1].y,  p: 0.28 },
  { x: STEPS[2].x, y: STEPS[2].y,  p: 0.43 },
  { x: STEPS[3].x, y: STEPS[3].y,  p: 0.58 },
  { x: X_STMT,     y: 0.5,         p: P_ZOOM },
]

export default function FlowScene({ onRequest }) {
  const root  = useRef(null)
  const stage = useRef(null)
  const world = useRef(null)

  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage.current,
        pinSpacing: false,
        scrub: true,
        onUpdate: (self) => {
          const w = world.current
          if (!w) return
          const p   = self.progress
          const vw  = window.innerWidth
          const vh  = window.innerHeight

          let camX = X_INTRO
          let camY = 0.5
          let s    = 1

          if (p < P_ZOOM) {
            // Find the active waypoint segment and ease through it.
            let i = 0
            while (i < WAYPOINTS.length - 2 && p >= WAYPOINTS[i + 1].p) i++
            const w0 = WAYPOINTS[i]
            const w1 = WAYPOINTS[i + 1]
            const t  = (p - w0.p) / (w1.p - w0.p)
            const st = smooth(t)
            camX = lerp(w0.x, w1.x, st)
            camY = lerp(w0.y, w1.y, st)
          } else {
            // Parked at the statement; scale the world into it.
            const l = (p - P_ZOOM) / (1 - P_ZOOM)
            camX = X_STMT
            camY = 0.5
            s    = 1 + (SF - 1) * smooth(l)
          }

          const bx = vw / 2 - s * camX * vw
          const by = vh / 2 - s * camY * vh
          w.style.transform = `translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px) scale(${s.toFixed(4)})`
        },
      })
      return () => st.kill()
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="how" className="flow" ref={root} aria-label="How it works">
      <div className="flow-stage" ref={stage}>
        <CurvedLines className="flow-lines" />

        <div className="flow-world" ref={world}>
          {/* Intro */}
          <div className="flow-item flow-intro" style={pos(X_INTRO, 0.5)}>
            <p className="eyebrow">{process.eyebrow}</p>
            <h2 className="flow-title">{process.title}</h2>
            <p className="flow-lead">{process.body}</p>
          </div>

          {/* The four process steps. Each one is placed at the world coordinate
              the camera will centre on, so it is always perfectly visible. */}
          {process.steps.map((s, i) => (
            <article
              className="flow-item flow-step"
              key={s.n}
              style={pos(STEPS[i].x, STEPS[i].y)}
            >
              <img className="flow-step-photo" src={photo(STEP_PHOTOS[i], 900)} alt="" draggable="false" />
              <span className="flow-step-n">{s.n}</span>
              <h3 className="flow-step-t">{s.t}</h3>
              <p className="flow-step-d">{s.d}</p>
            </article>
          ))}

          {/* The statement — the one and only closing frame. World zoom brings
              it to exactly 1:1, so it becomes the finished page. */}
          <div className="flow-item flow-stmt" style={pos(X_STMT, 0.5)}>
            <div className="flow-stmt-canvas">
              <Statement onRequest={onRequest} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function pos(x, y) {
  return { left: `${x * 100}vw`, top: `${y * 100}vh` }
}
