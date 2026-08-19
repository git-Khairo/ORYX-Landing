import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { film } from '../content/media'

/**
 * The two middle shots of the film, from one plate.
 *
 * `day` — the push has landed on the animal's head and the mark fades up
 * exactly where its horns are. It stays there. The whole point of the shot is
 * the equivalence, and a mark that immediately flies off to become a logo
 * spends that idea in the same second it makes it.
 *
 * `sunset` — the identical photograph under a warm grade, with the sun rising
 * inside the V the horns make. Because it is the same file rather than a
 * second animal shot at dusk, the cut between the two reads as a time-lapse
 * jump on one frame; two different animals would never have matched, which is
 * why this is composited rather than sourced.
 *
 * The mark is painted from `mark.png` as a CSS mask, so it can be any colour —
 * sand against the day plate, and darker against the sun so the disc reads
 * through it.
 *
 * Everything sits inside `.origin-plate`, a fixed 3:2 box scaled to cover the
 * viewport, so the photograph, the mark and the sun scale as one object and
 * stay in register at every window size.
 */
export default function OryxOrigin({ play, reduced, variant = 'day' }) {
  const root = useRef(null)
  const sunset = variant === 'sunset'

  useEffect(() => {
    if (!play) return

    /* Reduced motion gets the resolved frame of whichever shot this is. The
       composition carries the idea on its own; only the arrival is dropped. */
    if (reduced) {
      const ctx = gsap.context(() => {
        gsap.set('.origin-mark', { opacity: 1 })
        if (sunset) gsap.set('.origin-sun', { opacity: 1, y: 0 })
      }, root)
      return () => ctx.revert()
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      if (sunset) {
        /* The mark is already established from the shot before, so it is up
           immediately — fading it in again would restate a fact the audience
           was just given. The sun is the only new thing here. */
        tl.set('.origin-mark', { opacity: 1 })
        tl.fromTo(
          '.origin-sun',
          { opacity: 0, y: '38%', scale: 0.7 },
          { opacity: 1, y: '0%', scale: 1, duration: 3.2, ease: 'power2.out' },
          0.5,
        )
      } else {
        /* Dim first, then hardening — the mark arrives as part of the animal
           rather than as a graphic laid over it. */
        tl.fromTo(
          '.origin-mark',
          { opacity: 0 },
          { opacity: 0.55, duration: 1.1, ease: 'power2.out' },
          0.5,
        )
        tl.to('.origin-mark', { opacity: 1, duration: 0.9, ease: 'power2.inOut' }, 2.1)
      }
    }, root)

    return () => ctx.revert()
  }, [play, reduced, sunset])

  const clip = sunset ? film.oryxSun : film.oryx

  return (
    <div
      className={`origin ${sunset ? 'origin--sunset' : 'origin--day'}`}
      ref={root}
      aria-hidden="true"
    >
      <div className="origin-plate">
        <div className="origin-photo">
          <img src={clip.src} alt="" />
          {/* Graded to the brand before anything is drawn on top: the source is
              a warm daylight photograph and the film is near-black. */}
          <span className="origin-grade" />
        </div>

        {/* Behind the mark, so the horns are read against the disc rather than
            the disc floating in front of them. */}
        {sunset && <span className="origin-sun" />}

        <span className="origin-mark" />
      </div>
    </div>
  )
}
