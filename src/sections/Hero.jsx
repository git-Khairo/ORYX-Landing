import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FilmStage from '../components/FilmStage'
import InitialsReveal from '../components/InitialsReveal'
import { acts } from '../content/copy'
import { usePrefersReduced } from '../lib/usePrefersReduced'
import { useScrollLock, useEscape } from '../lib/useOverlay'

/**
 * The opening film: one screen, six shots, about twenty-four seconds.
 *
 * One GSAP timeline owns the whole sequence. It replaces a chain of
 * `setTimeout`s, and the difference is the entire brief: independent timers
 * gave every shot its own clock, and a page where six things each start
 * themselves is a carousel no matter how it is styled. A single timeline has
 * one clock, so the film can overlap its own cuts and stay in step with the
 * chevron wipe underneath it.
 *
 * It is an intro, not a section. The film sits over a locked page and leaves
 * for good when it is dismissed — there is no scrolling back up to it, because
 * it is unmounted rather than hidden. A hero you can return to is a section,
 * and a visitor who scrolls back to the top mid-read should not be handed
 * twenty seconds of titles they did not ask for.
 *
 * It plays once and then hands over. Looping would make it a gate the visitor
 * has to think their way out of; ending makes it an introduction that finishes
 * the way a title sequence finishes, and the page is simply there afterwards.
 * The skip control is present from the first frame for anyone who does not
 * want the twenty-four seconds.
 */
export default function Hero({ onFinish }) {
  const reduced = usePrefersReduced()
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const root = useRef(null)
  const master = useRef(null)
  /* A ref, not the `leaving` state: the timeline's `onComplete` closes over the
     state as it was when the effect ran, so a visitor who skips and then has
     the film finish underneath them would hand over twice. A ref is read live
     and makes this idempotent however it is reached. */
  const dismissed = useRef(false)

  const act = acts[index]

  /* The page underneath must not move while the film is up, and Escape should
     get you out of it the way it gets you out of anything else full-screen. */
  useScrollLock(!reduced)
  useEscape(!reduced, () => dismiss())

  /* Leave on the chevron wipe, not a fade. The gateway is already mounted
     underneath, so this reads as a cut from the last frame of the film
     straight into the next section — the page is not arriving, it is being
     uncovered. The timeout matches the animation so the unmount lands exactly
     as the wipe clears. */
  const dismiss = () => {
    if (dismissed.current) return
    dismissed.current = true
    master.current?.kill()
    setLeaving(true)
    setTimeout(() => onFinish?.(), 620)
  }

  useEffect(() => {
    if (reduced) {
      /* Reduced motion gets no film at all. A looping twenty-four second
         sequence is precisely what this setting is asking not to be shown, and
         a static title card standing between the visitor and the site would be
         a gate with nothing behind it. */
      onFinish?.()
      return
    }

    /* One pass, then out. `onComplete` runs the same dismissal the skip button
       does, so the film ending and the visitor cutting it short land in exactly
       the same place — there is only one way this component leaves. */
    const tl = gsap.timeline({ onComplete: () => dismiss() })

    /* Each shot is a label on one timeline. `.call()` flips the React state
       that swaps the copy and tells the stage which clip is live; the stage
       runs the wipe from there. Nothing here waits on anything else. */
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
   * This is the difference between a film and a slideshow, and it is not the
   * transition. A slideshow is a picture with a caption: the words arrive when
   * the picture arrives and leave when it leaves, every time, so every shot is
   * a slide. A film runs the picture on its own for a beat, brings a title up
   * over it, takes the title away, and only then cuts.
   *
   * So the copy lands a third of a second after the cut and is gone most of a
   * second before the next one. Those two gaps are the whole point: they are
   * moments of nothing but footage, and they are what the eye reads as film.
   */
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      /* Short shots get a quicker entrance. A montage cut at under two seconds
         cannot afford a third of a second of delay and most of a second of
         easing before its title is legible. */
      const quick = act.hold < 2.4
      const delay = quick ? 0.16 : 0.34
      const dur = quick ? 0.5 : 0.8
      const stagger = quick ? 0.04 : 0.07

      const tl = gsap.timeline()
      tl.fromTo(
        '[data-act-in]',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: dur, ease: 'expo.out', stagger },
        delay,
      )

      /* Out before the edit — but only when the shot is long enough to hold
         the title still for a moment first. On the montage shots the exit
         would land within a frame or two of the entrance finishing, so the
         words would flash rather than read; there the title rides the cut,
         which is what a fast montage does anyway.

         `.initials` runs its own entrance and carries no `data-act-in`, so it
         has to be named here or the letters would sit on screen while the line
         under them faded. */
      const settled = delay + dur + stagger * 2
      const exit = act.hold - 0.75
      /* 0.6s of stillness is the floor. At 0.4 the montage shots cleared it by
         a hundredth of a second and the title began leaving on the frame it
         finished arriving — a flash, not a read. */
      if (exit > settled + 0.6) {
        tl.to(
          ['[data-act-in]', '.initials'],
          { opacity: 0, y: -10, duration: 0.5, ease: 'power2.in' },
          exit,
        )
      }
    }, root)
    return () => ctx.revert()
  }, [index, reduced, act.hold])

  return (
    <section
      className={`hero ${leaving ? 'is-leaving' : ''}`}
      id="hero"
      aria-label="Introduction"
    >
      <FilmStage
        activeId={act.film}
        enter={act.enter}
        cam={act.cam}
        hold={act.hold}
        reduced={reduced}
      />

      {/* The shot's text is announced once, not letter by letter. */}
      <p className="sr-only" aria-live="polite">
        {act.line} {act.sub}
      </p>

      {/* Type sits directly on the film. Legibility comes from a soft dark
          gradient at the foot of the frame, not from a box behind the words. */}
      <div className="hero-copy shell" ref={root} key={act.id}>
        {/* The establishing shot, and the only place the group is named at
            full size. */}
        {act.kind === 'brand' && (
          <>
            <h1 className="hero-mark display-xl" data-act-in>{act.line}</h1>
            <p className="hero-descriptor label" data-act-in>{act.sub}</p>
          </>
        )}

        {/* The finale. No printed wordmark and no title — the shot is busy
            building the mark out of the animal's horns, and setting a second
            copy of it in type underneath would give the reveal away before it
            lands. Only the slogan, and only once the mark has arrived. */}
        {act.kind === 'origin' && (
          <p className="hero-slogan hero-slogan--end" data-act-in>{act.sub}</p>
        )}

        {act.kind === 'initials' && (
          <>
            {/* Not wrapped in `data-act-in` — this shot runs its own entrance,
                letter by letter, and the generic copy stagger would fade the
                whole block in over the top of it. */}
            <InitialsReveal play reduced={reduced} />
            <p className="hero-descriptor label" data-act-in>{act.sub}</p>
          </>
        )}

        {act.kind === 'service' && (
          <>
            <span className="hero-index label label-sand" data-act-in>{act.index}</span>
            <h2 className="hero-service" data-act-in>
              {act.line.split('\n').map((l) => (
                <span key={l}>{l}</span>
              ))}
            </h2>
            <p className="hero-sub" data-act-in>{act.sub}</p>
          </>
        )}

      </div>

      {/* No progress indicator of any kind. Segmented ticks read as a carousel
          and even a single playhead invites the viewer to watch the clock
          rather than the film — the only control here is the way out. */}
      <div className="hero-foot">
        {/* The only way out, and present from the first frame. It is a button
            rather than a link to `#work`: there is nothing to scroll to while
            the film is up, and an anchor would promise a journey down the page
            that the locked scroll underneath cannot deliver. */}
        <button type="button" className="hero-cue" onClick={dismiss}>
          <span>Skip intro</span>
          <i aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
