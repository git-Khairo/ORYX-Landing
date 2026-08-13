import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FilmStage from '../components/FilmStage'
import InitialsReveal from '../components/InitialsReveal'
import { acts } from '../content/copy'
import { usePrefersReduced } from '../lib/usePrefersReduced'

/**
 * The opening film: one screen, six shots, about twenty-one seconds.
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

  /* Copy enters on its own beat while the film underneath is already cutting —
     the text arriving a fraction after the picture is what stops a cut looking
     like a slide change. */
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-act-in]', {
        y: 26,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        delay: 0.28,
      })
    }, root)
    return () => ctx.revert()
  }, [index, reduced])

  return (
    <section className="hero" id="hero" aria-label="Introduction">
      <FilmStage activeId={act.film} enter={act.enter} reduced={reduced} />

      {/* The shot's text is announced once, not letter by letter. */}
      <p className="sr-only" aria-live="polite">
        {act.line} {act.sub}
      </p>

      {/* Type sits directly on the film. Legibility comes from a soft dark
          gradient at the foot of the frame, not from a box behind the words. */}
      <div className="hero-copy shell" ref={root} key={act.id}>
        {act.kind === 'origin' && (
          <>
            {/* No logo here — the film is currently *making* the logo out of
                the animal's horns. Printing a second copy underneath would
                give the trick away before it lands. */}
            <h1 className="hero-mark display-xl" data-act-in>{act.line}</h1>
            <p className="hero-slogan" data-act-in>{act.sub}</p>
          </>
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

        {act.kind === 'outro' && (
          <>
            {/* The mark returns alone. It opened the film as a pair of horns
                and closes it as itself, so the sequence lands where it began
                with the animal no longer needed to explain it. */}
            <span className="hero-mark-glyph" data-act-in aria-hidden="true" />
            <h2 className="hero-outro" data-act-in>{act.line}</h2>
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
