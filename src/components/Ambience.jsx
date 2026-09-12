import { useEffect, useRef, useState } from 'react'
import { usePrefersReduced } from '../lib/usePrefersReduced'

/** Where to put the file: `public/audio/theme.mp3`. Anything under `public/`
    is served from the site root, so that path is what the browser asks for.
    Change this one string to use a different name or format. */
const TRACK = '/audio/theme.mp3'

/** Background music is background: loud enough to notice, quiet enough to read
    over. Full volume on a looping bed is the single most common way this goes
    wrong. */
const VOLUME = 0.22
const FADE_MS = 1400

/**
 * Site-wide background music, and the control for turning it off.
 *
 * Three things this has to get right, none of which are optional:
 *
 * **Autoplay may or may not be allowed, and both have to work.** The music is
 * meant to run under the opening film, so it tries to start the moment the page
 * does. Chrome permits that once a site has media engagement and blocks it on a
 * cold visit — so a refusal is expected, not an error. When it is refused the
 * component waits for the first gesture of any kind and starts then, rather
 * than flipping the control to off and claiming the visitor chose silence.
 *
 * **It has to be switchable, visibly.** A sound toggle that only appears on
 * hover is a sound toggle nobody finds. This one is always on screen, and the
 * choice is remembered, so a visitor who turned it off once does not have to
 * do it again on the next page load.
 *
 * **It has to fade.** Cutting a music bed dead on a click sounds like a fault;
 * a short ramp reads as intended. The ramp is done by hand on `volume` rather
 * than with the Web Audio API, which would mean an AudioContext, a graph and a
 * second set of autoplay rules for one gain node.
 *
 * If the file is missing the control hides itself rather than sitting there
 * doing nothing — which is also what makes it safe to ship this before the
 * track exists.
 */
export default function Ambience({ armed = true }) {
  const reduced = usePrefersReduced()
  const el = useRef(null)
  const fade = useRef(0)

  /* Off by default; on is remembered. It used to autoplay for anyone who had
     not said no, and was turned off on request — three times. A visitor who
     wants the music turns it on with the control, and that sticks.

     A new key on purpose. The old `oryx.sound` was written on every mount,
     so every browser that ever opened the site holds an "on" it never chose;
     reading it would bring the music straight back for exactly the people
     who asked for it to stop. Only an explicit toggle writes this one. */
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem('oryx.music') === 'on'
    } catch {
      return false
    }
  })
  const toggle = () => {
    const next = !on
    setOn(next)
    try {
      localStorage.setItem('oryx.music', next ? 'on' : 'off')
    } catch {
      /* Private browsing. The preference is lost on reload; the site is not. */
    }
  }
  const [missing, setMissing] = useState(false)

  /* Where the ramp is headed. Held in a ref because the fade runs outside
     React and has to be recoverable from anywhere — see the visibility guard
     below, which is the whole reason this is not just a local variable. */
  const target = useRef(0)

  /* Ramp `volume` toward a target over FADE_MS, cancelling any ramp already
     running so rapid clicking cannot stack two of them.

     The `document.hidden` branch is not an optimisation, it is a correctness
     fix. `requestAnimationFrame` does not run in a background tab, so a fade
     started while hidden never advances and the volume sits wherever it
     started — which for a fade-in is silence. The audio plays, the control
     says "Sound on", and nothing comes out, permanently. Open the site in a
     background tab and that is exactly what used to happen. Nobody is
     listening to a fade they cannot hear, so hidden means jump. */
  const rampTo = (to) => {
    const a = el.current
    if (!a) return
    target.current = to
    cancelAnimationFrame(fade.current)

    if (document.hidden) {
      a.volume = to
      if (to === 0) a.pause()
      return
    }

    const from = a.volume
    const t0 = performance.now()
    const step = (t) => {
      const k = Math.min(1, (t - t0) / FADE_MS)
      a.volume = from + (to - from) * k
      if (k < 1) fade.current = requestAnimationFrame(step)
      else if (to === 0) a.pause()
    }
    fade.current = requestAnimationFrame(step)
  }

  /* Settle the volume whenever the tab comes back, in case a ramp was stranded
     mid-flight while it was away. */
  useEffect(() => {
    const settle = () => {
      const a = el.current
      if (!a || document.hidden) return
      if (Math.abs(a.volume - target.current) > 0.001) {
        cancelAnimationFrame(fade.current)
        a.volume = target.current
      }
    }
    document.addEventListener('visibilitychange', settle)
    return () => document.removeEventListener('visibilitychange', settle)
  }, [])

  useEffect(() => {
    const a = el.current
    if (!a || !armed || reduced) return
    if (!on) { rampTo(0); return }

    let off = () => {}

    const start = () => {
      a.volume = 0
      return a.play().then(() => { rampTo(VOLUME); return true }, () => false)
    }

    /* Try immediately, because the film is the point of the soundtrack and
       waiting for the visitor to click something means the whole promo plays
       silent. Chrome will allow this outright once the site has enough media
       engagement, and blocks it on a cold first visit.

       When it is blocked, do not give up and do not flip the control to off —
       arm the very first gesture instead, wherever it lands. Skip, Enter
       worlds, a scroll, a key: any of them satisfies the policy, and the music
       comes in the moment one happens. */
    start().then((ok) => {
      if (ok) return
      const kick = () => { off(); start() }
      const evs = ['pointerdown', 'keydown', 'touchstart', 'wheel']
      evs.forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }))
      off = () => evs.forEach((e) => window.removeEventListener(e, kick))
    })

    return () => {
      off()
      cancelAnimationFrame(fade.current)
    }
  }, [armed, on, reduced])

  /* Nothing to control if the track is not there, and nothing to control if the
     visitor has asked the system for reduced motion — that preference is set by
     people who do not want media starting on its own. */
  if (missing || reduced) return null

  return (
    <>
      <audio
        ref={el}
        src={TRACK}
        loop
        preload="auto"
        onError={() => setMissing(true)}
      />

      <button
        type="button"
        className={`sound ${on ? 'is-on' : ''}`}
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? 'Turn background music off' : 'Turn background music on'}
      >
        {/* Four bars that move while it plays and settle flat when it does not
            — the state is legible without reading the label. */}
        <span className="sound-eq" aria-hidden="true">
          <i style={{ '--i': 0 }} />
          <i style={{ '--i': 1 }} />
          <i style={{ '--i': 2 }} />
          <i style={{ '--i': 3 }} />
        </span>
        <span className="sound-l">{on ? 'Sound on' : 'Sound off'}</span>
      </button>
    </>
  )
}
