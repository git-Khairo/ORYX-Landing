import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FilmStage from '../components/FilmStage'
import InitialsReveal from '../components/InitialsReveal'
import { acts, brand } from '../content/copy'
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
 */
export default function Hero({ onFinish }) {
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
   * The end card is exempt — it has to stay up, because it is asking for a
   * click.
   */
  useEffect(() => {
    if (reduced || act.kind === 'end') return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo(
        '[data-act-in]',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.07 },
        0.5,
      )

      /* Out before the edit, but only when the shot is long enough to hold the
         title still first — otherwise the words flash rather than read. */
      const settled = 0.5 + 0.8 + 0.14
      const exit = act.hold - 0.9
      if (exit > settled + 0.6) {
        tl.to(
          ['[data-act-in]', '.initials'],
          { opacity: 0, y: -10, duration: 0.5, ease: 'power2.in' },
          exit,
        )
      }
    }, root)
    return () => ctx.revert()
  }, [index, reduced, act.hold, act.kind])

  return (
    <section
      className={`hero ${leaving ? 'is-leaving' : ''} ${
        act.kind === 'end' ? 'is-end' : ''
      }`}
      id="hero"
      aria-label="Introduction"
    >
      <FilmStage
        activeId={act.film}
        enter={act.enter}
        cam={act.cam}
        hold={act.hold}
        variant={act.variant}
        reduced={reduced}
      />

      {/* The shot's text is announced once, not letter by letter. */}
      <p className="sr-only" aria-live="polite">
        {act.line} {act.sub}
      </p>

      <div className="hero-copy shell" ref={root} key={act.id}>
        {/* The establishing frame and the two oryx shots all carry one line,
            set the same way — they are one continuous idea and should not
            change their voice halfway through. */}
        {(act.kind === 'plate' || act.kind === 'origin') && (
          <p className="hero-line" data-act-in>{act.sub}</p>
        )}

        {act.kind === 'initials' && (
          <>
            {/* Not wrapped in `data-act-in` — this runs its own entrance,
                letter by letter, and the generic stagger would fade the whole
                block in over the top of it. */}
            <InitialsReveal play reduced={reduced} />
            <p className="hero-descriptor label" data-act-in>{act.sub}</p>
          </>
        )}

        {/* The end card. Centred, on the bare ground, and it stays. */}
        {act.kind === 'end' && (
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
        {/* Present from the first frame, and gone on the end card — by then the
            way in is the button in the middle of the screen, and offering two
            of them is offering a choice that does not exist. */}
        {act.kind !== 'end' && (
          <button type="button" className="hero-cue" onClick={dismiss}>
            <span>Skip intro</span>
            <i aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  )
}
