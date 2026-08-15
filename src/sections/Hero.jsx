import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FilmStage from '../components/FilmStage'
import InitialsReveal from '../components/InitialsReveal'
import { acts } from '../content/copy'
import { usePrefersReduced } from '../lib/usePrefersReduced'

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
 * It loops. That makes the hero a running promo rather than a one-time
 * introduction, so two things follow from it: the film never hands the page
 * over by itself — an auto-scroll firing on every repeat would drag a reader
 * out of whatever they were looking at — and the way down is a control that is
 * always present rather than one that appears at the end.
 */
export default function Hero({ onFinish }) {
  const reduced = usePrefersReduced()
  const [index, setIndex] = useState(0)
  const root = useRef(null)

  const act = acts[index]

  useEffect(() => {
    if (reduced) {
      /* Reduced motion gets one resolved frame and nothing that repeats. A
         looping film is precisely what this setting is asking not to see. */
      setIndex(acts.length - 1)
      onFinish?.()
      return
    }

    /* The film loops. It therefore never "finishes", so it also never takes the
       page over on its own — an auto-scroll that fired every twenty-one seconds
       would yank a reader out of whatever they had scrolled to. Going down is
       the visitor's decision now, and the control in the corner is always
       there to make it. */
    const tl = gsap.timeline({ repeat: -1 })
    onFinish?.()

    /* Each shot is a label on one timeline. `.call()` flips the React state
       that swaps the copy and tells the stage which clip is live; the stage
       runs the wipe from there. Nothing here waits on anything else. */
    let at = 0
    acts.forEach((a, i) => {
      tl.call(() => setIndex(i), null, at)
      at += a.hold
    })
    tl.to({}, { duration: at })

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
    <section className="hero" id="hero" aria-label="Introduction">
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
        {/* One control, always present. With the film looping there is no
            "skip to the end" left to offer — there is only the way down, and
            it should not appear and disappear depending on where the loop
            happens to be. */}
        <a className="hero-cue" href="#work">
          <span>Continue</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
