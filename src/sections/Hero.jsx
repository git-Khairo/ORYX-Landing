import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FilmStage from '../components/FilmStage'
import InitialsReveal from '../components/InitialsReveal'
import { acts, brand } from '../content/copy'
import { promo } from '../content/media'
import { usePrefersReduced } from '../lib/usePrefersReduced'
import { useScrollLock, useEscape } from '../lib/useOverlay'

/**
 * The opening film: five shots, about twenty seconds, then a card that waits.
 *
 * One GSAP timeline owns the sequence, and it deliberately ends one shot early.
 * The last act — the mark, the slogan and the way in — has no `hold` and is not
 * on the timeline at all: the film runs out into it and stops. Nothing dismisses
 * itself, because the end card is a door rather than a frame, and a door that
 * closes while you are reaching for it is worse than no door.
 *
 * It is an intro, not a section. The film sits over a locked page and is
 * unmounted when dismissed, so there is no scrolling back up to it. The skip
 * control is present from the first frame for anyone who does not want the
 * twenty seconds.
 *
 * ── Two modes ────────────────────────────────────────────────────────────
 * Setting `promo.src` in `media.js` replaces all of the above with one edited
 * video followed by the same end card. The five-shot sequence stays in the
 * file until that video exists, because deleting it first would leave the site
 * with no intro at all in the meantime — it is scaffolding with a removal date,
 * not a second supported path. Once the promo is in, `acts`, `FilmStage`,
 * `InitialsReveal` and everything under `PlayedSequence` come out.
 */
export default function Hero({ onFinish }) {
  return promo.src ? <PromoFilm onFinish={onFinish} /> : <PlayedSequence onFinish={onFinish} />
}

/**
 * The single-file intro: one video, then the card.
 *
 * The video's own `ended` event advances to the end card rather than a timer,
 * so re-cutting the promo to a different length needs no code change. A timer
 * would have to be kept in step with the export by hand, and would drift on any
 * connection slow enough to stall playback mid-shot.
 */
function PromoFilm({ onFinish }) {
  const reduced = usePrefersReduced()
  const [done, setDone] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const dismissed = useRef(false)
  const video = useRef(null)

  useScrollLock(!reduced)
  useEscape(!reduced, () => dismiss())

  const dismiss = () => {
    if (dismissed.current) return
    dismissed.current = true
    video.current?.pause()
    setLeaving(true)
    setTimeout(() => onFinish?.(), 620)
  }

  useEffect(() => {
    if (reduced) onFinish?.()
  }, [reduced, onFinish])

  useEffect(() => {
    const v = video.current
    if (!v || reduced) return

    /* Muted video is normally allowed to autoplay, but "normally" is not
       "always" — a data-saver setting or a backgrounded tab will still refuse
       it. A refusal must not skip the film: the poster holds the frame and the
       first gesture starts it, the same way the soundtrack is armed. Jumping
       to the end card on refusal was throwing the promo away for anyone whose
       browser happened to be strict. */
    let off = () => {}
    v.play?.().catch(() => {
      const kick = () => { off(); v.play?.().catch(() => {}) }
      const evs = ['pointerdown', 'keydown', 'touchstart', 'wheel']
      evs.forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }))
      off = () => evs.forEach((e) => window.removeEventListener(e, kick))
    })
    return () => off()
  }, [reduced])

  if (reduced) return null

  return (
    <section
      className={`hero ${leaving ? 'is-leaving' : ''} ${done ? 'is-end' : ''}`}
      id="hero"
      aria-label="Introduction"
    >
      <div className="hero-promo" aria-hidden="true">
        {!done && (
          <video
            ref={video}
            src={promo.src}
            poster={promo.poster || undefined}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            onEnded={() => setDone(true)}
            /* A missing or undecodable file must not strand the visitor behind
               a black screen with a skip link as the only way out. */
            onError={() => setDone(true)}
          />
        )}
      </div>

      <div className="hero-copy shell">
        {done && (
          <div className="hero-end">
            <span className="hero-end-mark" aria-hidden="true" />
            <p className="hero-end-word">{brand.full}</p>
            <p className="hero-end-slogan">{brand.slogan}</p>
            <button type="button" className="hero-enter" onClick={dismiss}>
              Enter worlds <i aria-hidden="true">→</i>
            </button>
          </div>
        )}
      </div>

      <div className="hero-foot">
        {!done && (
          <button type="button" className="hero-cue" onClick={dismiss}>
            <span>Skip intro</span>
            <i aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  )
}

function PlayedSequence({ onFinish }) {
  const reduced = usePrefersReduced()
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const root = useRef(null)
  const master = useRef(null)
  /* A ref, not the `leaving` state: a visitor who skips while something else is
     also handing over would otherwise trigger the handover twice. Read live,
     this is idempotent however it is reached. */
  const dismissed = useRef(false)

  const act = acts[index]

  /* The finale is one shot carrying four beats, so it runs a phase rather than
     handing off to another act. There is no end card any more — the card *is*
     this shot, once the footage has gone.

       mark   the mark settles onto the animal's horns
       brief   a short line about the company reads over the held frame
       horns   the mark fades up on the animal's horns and holds
       travel  the transform, all at once: the footage goes to the dark
               ground, the mark shrinks into the middle, and the copy and
               the way in come up beneath it
       door    the resting state the transform lands in

     Timers rather than a scroll or a tween, because each beat has to land at a
     fixed moment in a fixed-length shot. */
  const [phase, setPhase] = useState('mark')
  const ended = phase === 'door'
  /* The centred end layout has to be in place *before* the mark is measured
     against its slot, not after. `.hero.is-end` recentres `.hero-copy`, so
     applying it only at `door` meant the slot was measured while the copy was
     still bottom-left — the mark travelled to where the slot used to be and
     the layout then jumped out from under it. That is why it never landed. */
  const centred = phase === 'travel' || phase === 'door'
  const dark = centred

  useEffect(() => {
    if (act.kind !== 'finale') {
      setPhase('mark')
      return
    }
    /* Reduced motion resolves straight to the door: the mark in place, the copy
       up, the button live. Waiting on tweens that will never run would leave a
       visitor staring at a frozen frame with no way forward. */
    if (reduced) {
      setPhase('door')
      return
    }
    setPhase('mark')
    /* Two moments, not five. The horns beat stands alone — the logo IS the
       horns for a breath — and then the entire transform happens at once:
       dark, shrink, copy. `door` follows travel by only the beat the end
       copy's own entrance needs to start under the still-moving mark.

       Timed to the clip, which runs 3.56 s and holds its last frame: the
       brief reads over the sun rising, and the mark lands at 4.0, after the
       freeze, onto a head that has stopped moving. */
    const t = [
      setTimeout(() => setPhase('brief'), 2600),
      setTimeout(() => setPhase('horns'), 4000),
      setTimeout(() => setPhase('travel'), 5800),
      setTimeout(() => setPhase('door'), 6100),
    ]
    return () => t.forEach(clearTimeout)
  }, [index, act.kind, reduced])

  useScrollLock(!reduced)
  useEscape(!reduced, () => dismiss())

  /* Leave on the chevron wipe, not a fade. The gateway is already mounted
     underneath, so this reads as a cut from the last frame straight into the
     next section — the page is not arriving, it is being uncovered. The timeout
     matches the animation so the unmount lands as the wipe clears. */
  const dismiss = () => {
    if (dismissed.current) return
    dismissed.current = true
    master.current?.kill()
    setLeaving(true)
    setTimeout(() => onFinish?.(), 620)
  }

  useEffect(() => {
    if (reduced) {
      /* Reduced motion gets no film. A twenty-second sequence is precisely what
         this setting is asking not to be shown, and a static title card between
         the visitor and the site would be a gate with nothing behind it. */
      onFinish?.()
      return
    }

    /* Each shot is a label on one clock. `.call()` flips the state that swaps
       the copy and tells the stage which plate is live.

       There is no `onComplete`: the timeline runs to the end card and stops
       there. That is the whole difference from every earlier version of this
       film — it finishes, but it does not leave. */
    const tl = gsap.timeline()
    let at = 0
    acts.forEach((a, i) => {
      tl.call(() => setIndex(i), null, at)
      at += a.hold
    })
    tl.to({}, { duration: at })

    master.current = tl
    return () => tl.kill()
  }, [reduced, onFinish])

  /**
   * The type comes and goes inside the shot, not with it.
   *
   * A slideshow is a picture with a caption: the words arrive when the picture
   * arrives and leave when it leaves. A film runs the picture on its own for a
   * beat, brings a title up over it, takes the title away, and only then cuts.
   * Those two gaps of nothing-but-footage are what the eye reads as film.
   *
   * The finale is exempt. It runs its own phases and ends on a door that has
   * to stay up, because it is asking for a click.
   */
  useEffect(() => {
    if (reduced || act.kind !== 'plate' || act.text !== 'letters') return
    const ctx = gsap.context(() => {
      /* Out before the edit. The entrance is InitialsReveal's own, letter by
         letter; the only job left here is taking the block away in time for
         the cut, so the words never ride through an edit they do not belong
         to. */
      gsap.to('.hero-letters', {
        opacity: 0,
        y: -10,
        duration: 0.5,
        ease: 'power2.in',
        delay: act.hold - 0.9,
      })
    }, root)
    return () => ctx.revert()
  }, [index, reduced, act.hold, act.kind, act.text])

  return (
    <section
      className={`hero ${leaving ? 'is-leaving' : ''} ${dark ? 'is-dark' : ''} ${centred ? 'is-end' : ''}`}
      id="hero"
      aria-label="Introduction"
    >
      <FilmStage
        activeId={act.film}
        enter={act.enter}
        cam={act.cam}
        hold={act.hold}
        phase={phase}
        reduced={reduced}
      />

      {/* The shot's text is announced once, not letter by letter. */}
      <p className="sr-only" aria-live="polite">
        {act.line} {act.sub}
      </p>

      <div className="hero-copy shell" ref={root} key={act.id}>
        {/* A single line under a shot. `aria-hidden` because the live region
            above has already announced it — a sighted reader sees it once and
            a screen reader should hear it once. Remounts with `.hero-copy`
            (keyed on the act), so the entrance plays per shot. */}
        {act.kind === 'plate' && act.text === 'line' && (
          <p className="hero-line" aria-hidden="true">{act.line}</p>
        )}

        {/* The push carries the name itself: O·R·Y·X unfolding into the
            slogan. Not wrapped in `data-act-in` — InitialsReveal runs its own
            entrance, letter by letter, and a generic fade over the top of it
            would blur the one animation this component exists to do. */}
        {act.kind === 'plate' && act.text === 'letters' && (
          <div className="hero-letters">
            <InitialsReveal play reduced={reduced} />
          </div>
        )}

        {/* The finale's brief — a line about the company over the held sunset
            frame. Mounted through `travel` with an exit class rather than
            unmounted at the phase flip, so it fades out under the moving mark
            instead of vanishing on the exact frame the travel starts. */}
        {act.kind === 'finale' && ['brief', 'horns', 'travel'].includes(phase) && (
          <p className={`hero-brief ${phase === 'travel' ? 'is-out' : ''}`}>
            {act.sub}
          </p>
        )}

        {/* The way in, under the mark that has just travelled down to meet it.
            `.hero-end-slot` is an empty box for the mark to land in rather than
            a second mark — the point of the beat is that there is only ever
            one, and it never blinks out and back. */}
        {act.kind === 'finale' && (phase === 'travel' || ended) && (
          <div className={`hero-end ${ended ? 'is-open' : ''}`}>
            <span className="hero-end-slot" aria-hidden="true" />
            <p className="hero-end-word">{brand.full}</p>
            <p className="hero-end-slogan">{brand.slogan}</p>
            <button type="button" className="hero-enter" onClick={dismiss}>
              Enter worlds <i aria-hidden="true">→</i>
            </button>
          </div>
        )}
      </div>

      <div className="hero-foot">
        {/* Present from the first frame, and gone once the door is up — by then
            the way in is the button in the middle of the screen, and offering
            two of them is offering a choice that does not exist. */}
        {!ended && (
          <button type="button" className="hero-cue" onClick={dismiss}>
            <span>Skip intro</span>
            <i aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  )
}
