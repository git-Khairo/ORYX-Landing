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
 * One continuous horizontal journey — the process, the scattered board, and the
 * closing statement, all in a single pinned scroll.
 *
 * A camera travels a world far wider than the screen; the world is translated
 * by the inverse of the camera, so moving the camera moves the world. The
 * camera's route has three characters, blended into one scrub:
 *
 *   · through the process it runs dead straight, left to right — a track
 *   · into the scattered frames it starts to weave up and down — the S — and
 *     the frames are strewn off that line, so it threads between them
 *   · at the far end it parks on the Statement frame and scales the world into
 *     it, so the last frame *is* the closing section, opening where it sits
 *
 * The lit curved lines from the hero run behind the whole thing, fixed to the
 * stage, so the frames drift over the same rails the opening used.
 */
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
const smooth = (t) => t * t * (3 - 2 * t)

/** Placeholder photo per step, in order. */
const STEP_PHOTOS = [5025639, 3184292, 2760241, 3862632]

/** World layout. x is in viewport-widths, y a fraction of viewport height
 *  (0.5 = centre). The camera visits these left to right. */
const X_INTRO = 0.5
const STEPS_X = [1.08, 1.68, 2.28, 2.88] // a tight row
const X_STEPS_END = STEPS_X[STEPS_X.length - 1]

/** The scattered frames — deliberately different sizes, strewn above and below
 *  the weave rather than sat on it, and packed close together. */
const FRAMES = [
  { id: 1267338, label: 'Delivery', x: 3.55, y: 0.34, w: 0.2 },
  { id: 4239146, label: 'Cleaning', x: 3.92, y: 0.68, w: 0.13 },
  { id: 906494, label: 'Logistics', x: 4.32, y: 0.42, w: 0.25 },
  { id: 5025639, label: 'The people', x: 4.74, y: 0.7, w: 0.15 },
  { id: 2760241, label: 'Facility', x: 5.08, y: 0.3, w: 0.22 },
  { id: 3862632, label: 'Technology', x: 5.44, y: 0.62, w: 0.11 },
  { id: 4481259, label: 'Distribution', x: 5.72, y: 0.44, w: 0.17 },
]

const X_STMT = 6.5
const STMT_W = 0.42 // statement frame width as a fraction of the viewport
const SF = 1 / STMT_W // world scale that brings the statement frame to full bleed

const AMP = 0.16 // vertical weave amplitude (fraction of viewport height)
const P_STEPS = 0.3 // progress the straight run ends
const P_SCATTER = 0.76 // progress the weave ends and the zoom begins

export default function FlowScene({ onRequest }) {
  const root = useRef(null)
  const stage = useRef(null)
  const world = useRef(null)
  const frameEls = useRef([])

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
          const p = self.progress
          const vw = window.innerWidth
          const vh = window.innerHeight

          let camX
          let camY = 0.5
          let s = 1

          if (p < P_STEPS) {
            // Straight run through the process.
            camX = lerp(X_INTRO, X_STEPS_END, p / P_STEPS)
          } else if (p < P_SCATTER) {
            // The weave: horizontal march + a sine S through the scattered frames.
            const l = (p - P_STEPS) / (P_SCATTER - P_STEPS)
            camX = lerp(X_STEPS_END, X_STMT, smooth(l))
            camY = 0.5 + AMP * Math.sin(l * Math.PI * 2.4)
          } else {
            // Park on the Statement and scale the world into it.
            const l = (p - P_SCATTER) / (1 - P_SCATTER)
            camX = X_STMT
            s = 1 + (SF - 1) * smooth(l)
          }

          const bx = vw / 2 - s * camX * vw
          const by = vh / 2 - s * camY * vh
          w.style.transform = `translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px) scale(${s.toFixed(4)})`

          // Emphasis on the scattered frames: the one the camera is passing
          // reads as the subject, the rest recede.
          for (const item of frameEls.current) {
            if (!item?.el) continue
            const d = Math.hypot(bx + item.x * vw - vw / 2, by + item.y * vh - vh / 2) / vw
            item.el.style.setProperty('--e', clamp(1.14 - d * 0.5, 0.76, 1.14).toFixed(3))
            item.el.style.opacity = clamp(1.2 - d * 0.8, 0.42, 1).toFixed(3)
          }
        },
      })
      return () => st.kill()
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="how" className="flow" ref={root} aria-label="How it works">
      <div className="flow-stage" ref={stage}>
        {/* The hero's lit rails, fixed behind the moving world. */}
        <CurvedLines className="flow-lines" />

        <div className="flow-world" ref={world}>
          {/* Intro */}
          <div className="flow-item flow-intro" style={pos(X_INTRO, 0.5)}>
            <p className="eyebrow">{process.eyebrow}</p>
            <h2 className="flow-title">{process.title}</h2>
            <p className="flow-lead">{process.body}</p>
          </div>

          {/* The four process steps, in a straight row. */}
          {process.steps.map((s, i) => (
            <article className="flow-item flow-step" key={s.n} style={pos(STEPS_X[i], 0.5)}>
              <img className="flow-step-photo" src={photo(STEP_PHOTOS[i], 600)} alt="" draggable="false" />
              <span className="flow-step-n">{s.n}</span>
              <h3 className="flow-step-t">{s.t}</h3>
              <p className="flow-step-d">{s.d}</p>
            </article>
          ))}

          {/* The scattered frames. */}
          {FRAMES.map((f, i) => (
            <figure
              className="flow-item flow-frame"
              key={f.id}
              ref={(el) => {
                frameEls.current[i] = { el, x: f.x, y: f.y }
              }}
              style={{ ...pos(f.x, f.y), '--w': `${f.w * 100}vw` }}
            >
              <img src={photo(f.id, 900)} alt="" draggable="false" />
              <figcaption>{f.label}</figcaption>
            </figure>
          ))}

          {/* The last frame IS the closing page: the real Statement, authored
              full-viewport and shown small until the zoom scales the world so it
              fills the screen. It carries its own footer, so the zoom lands on
              the finished page — there is nothing to scroll down to. */}
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

/** Position helper: centre an item at world (x in vw-units, y in vh fraction). */
function pos(x, y) {
  return { left: `${x * 100}vw`, top: `${y * 100}vh` }
}
