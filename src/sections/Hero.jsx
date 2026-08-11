import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FilmStage from '../components/FilmStage'
import InitialsReveal from '../components/InitialsReveal'
import { acts, brand } from '../content/copy'
import { usePrefersReduced } from '../lib/usePrefersReduced'

const TOTAL = acts.reduce((sum, a) => sum + a.hold, 0)

/**
 * The opening film: one screen, six acts, about nineteen seconds.
 *
 * The sequence runs itself and then stops — it does not loop. Looping would
 * make it wallpaper; ending makes it an introduction, and the page below is the
 * reward for having watched. A visitor who already knows the company can skip
 * out at any point, and one who arrives mid-scroll never sees it hijack them.
 */
export default function Hero({ onFinish }) {
  const reduced = usePrefersReduced()
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const copyRef = useRef(null)

  const act = acts[index]

  // Advance on the act's own hold. A chain of timeouts rather than one master
  // timeline, so a skip lands cleanly on the next act with nothing left running.
  useEffect(() => {
    if (done) return
    if (reduced) {
      // Reduced motion gets the last frame and the page, not nineteen seconds
      // of cuts it did not ask for.
      setIndex(acts.length - 1)
      setDone(true)
      onFinish?.()
      return
    }
    if (index >= acts.length - 1) {
      const end = setTimeout(() => {
        setDone(true)
        onFinish?.()
        handOver()
      }, act.hold * 1000)
      return () => clearTimeout(end)
    }
    const next = setTimeout(() => setIndex((i) => i + 1), act.hold * 1000)
    return () => clearTimeout(next)
  }, [index, done, reduced, act.hold, onFinish])

  // Each act's copy enters on its own; the film underneath is already cutting.
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-act-in]', {
        y: 26,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
      })
    }, copyRef)
    return () => ctx.revert()
  }, [index, reduced])

  /**
   * The film hands the page over when it ends.
   *
   * Only if the visitor has not already taken control: if they scrolled during
   * the intro they have made their own decision about where to be, and yanking
   * them back is worse than not helping at all.
   */
  const handOver = () => {
    if (window.scrollY > 8) return
    document
      .getElementById('work')
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const skip = () => {
    setIndex(acts.length - 1)
    setDone(true)
    onFinish?.()
    handOver()
  }

  return (
    <section className="hero" id="hero" aria-label="Introduction">
      <FilmStage activeId={act.film} reduced={reduced} />

      {/* The act's text is announced once, not letter by letter. */}
      <p className="sr-only" aria-live="polite">
        {act.kind === 'initials' ? brand.full : act.line}
      </p>

      {/* Type sits directly on the film. Legibility comes from a soft dark
          gradient at the foot of the frame, not from a box behind the words. */}
      <div className="hero-copy shell" ref={copyRef} key={act.id}>
        {act.kind === 'brand' && (
          <>
            <img className="hero-logo" src="/logo.png" alt="" data-act-in />
            <h1 className="hero-mark" data-act-in>{act.line}</h1>
            <p className="hero-sub" data-act-in>{act.sub}</p>
          </>
        )}

        {act.kind === 'initials' && (
          <>
            <InitialsReveal play={!reduced} reduced={reduced} />
            <p className="hero-sub" data-act-in>{act.sub}</p>
          </>
        )}

        {act.kind === 'service' && (
          <>
            <span className="hero-index label" data-act-in>{act.index}</span>
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
            {/* The mark opens the film and closes it — the same object either
                side of the story, so the sequence returns to where it began. */}
            <img className="hero-logo" src="/logo.png" alt="" data-act-in />
            <h2 className="hero-outro" data-act-in>{act.line}</h2>
            <p className="hero-sub" data-act-in>{act.sub}</p>
          </>
        )}
      </div>

      <div className="hero-foot">
        <ol className="acts" aria-hidden="true">
          {acts.map((a, i) => (
            <li
              key={a.id}
              className={`act-tick ${i === index ? 'is-live' : ''} ${i < index ? 'is-past' : ''}`}
              style={{ '--hold': `${a.hold}s` }}
            />
          ))}
        </ol>

        {done ? (
          <a className="hero-cue" href="#work">
            <span>Continue</span>
            <i aria-hidden="true" />
          </a>
        ) : (
          <button type="button" className="hero-skip" onClick={skip}>
            Skip intro
          </button>
        )}
      </div>
    </section>
  )
}

export { TOTAL as HERO_DURATION }
