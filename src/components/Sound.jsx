import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { usePrefersReduced } from '../lib/usePrefersReduced'

/** Where to put the file: `public/audio/theme.mp3`. Anything under `public/`
    is served from the site root, so that path is what the browser asks for.
    Change this one string to use a different name or format. */
const TRACK = '/audio/theme.mp3'

/** Background music is background: loud enough to notice, quiet enough to read
    over. */
const VOLUME = 0.22
const FADE_MS = 1400

const SoundContext = createContext(null)

/**
 * Site-wide background music: one player, many switches.
 *
 * The control used to be a single pill fixed to the bottom-left corner at
 * `z-index: 60`. The service pages sit at 100 and the intro at 90, so it was
 * underneath both, which is why it vanished the moment a service opened. It is
 * now split in two. This provider owns the one `<audio>` element and the
 * remembered choice. `SoundToggle` is a plain button that can be dropped into
 * any bar on the site, and every copy of it drives the same player.
 *
 * What the player has to get right is unchanged:
 *
 * Autoplay may or may not be allowed, and both have to work. A refusal is
 * expected on a cold visit, so the player waits for the first gesture of any
 * kind and starts then.
 *
 * Every visit starts silent, and only the switch starts it.
 *
 * It fades. Cutting a music bed dead on a click sounds like a fault.
 *
 * If the file is missing, every toggle hides itself.
 */
export function SoundProvider({ children }) {
  const reduced = usePrefersReduced()
  const el = useRef(null)
  const fade = useRef(0)
  const target = useRef(0)

  /* Off on every visit. It used to remember "on" across visits, and a site
     that starts playing music on its own is exactly what nobody wants, so the
     switch is the only way it starts. */
  const [on, setOn] = useState(false)
  const [missing, setMissing] = useState(false)

  const toggle = () => {
    const next = !on
    /* Started here, inside the click, and not only in the effect below. Safari
       allows a sound to start only while the click that asked for it is still
       running; the effect runs a moment later, after React has committed, and
       Safari refused it every time. So the switch showed "Sound on" and
       nothing played. Chrome allows either. The effect still runs afterwards
       and does the fade; a second `play()` on a playing element is harmless. */
    const a = el.current
    if (next && a) {
      a.volume = 0
      a.play().catch(() => {})
    }
    setOn(next)
  }

  /* Ramp `volume` toward a target, cancelling any ramp already running.
     `requestAnimationFrame` does not run in a background tab, so a fade
     started while hidden would never advance. Hidden means jump. */
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
    if (!a || reduced) return
    if (!on) { rampTo(0); return }

    let off = () => {}
    const start = () => {
      a.volume = 0
      return a.play().then(() => { rampTo(VOLUME); return true }, () => false)
    }

    /* Try at once. When the browser refuses, arm the very first gesture
       instead, wherever it lands. */
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
  }, [on, reduced])

  /* Nothing to control if the track is not there, or if the visitor has asked
     the system for reduced motion. */
  const available = !missing && !reduced

  return (
    <SoundContext.Provider value={{ on, toggle, available }}>
      {!reduced && (
        <audio ref={el} src={TRACK} loop preload="auto" onError={() => setMissing(true)} />
      )}
      {children}
    </SoundContext.Provider>
  )
}

/**
 * The switch. Four bars that move while the music plays and settle flat when
 * it does not, so the state is legible without reading the label.
 *
 * `bare` drops the text label for bars that are short of room. The
 * `aria-label` still says what it is and what state it is in.
 */
export function SoundToggle({ className = '', bare = false }) {
  const ctx = useContext(SoundContext)
  if (!ctx || !ctx.available) return null
  const { on, toggle } = ctx
  return (
    <button
      type="button"
      className={`sound ${on ? 'is-on' : ''} ${bare ? 'sound--bare' : ''} ${className}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn background music off' : 'Turn background music on'}
    >
      <span className="sound-eq" aria-hidden="true">
        <i style={{ '--i': 0 }} />
        <i style={{ '--i': 1 }} />
        <i style={{ '--i': 2 }} />
        <i style={{ '--i': 3 }} />
      </span>
      {!bare && <span className="sound-l">{on ? 'Sound on' : 'Sound off'}</span>}
    </button>
  )
}
