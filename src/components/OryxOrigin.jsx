import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { film } from '../content/media'

/**
 * The origin shot — the whole identity argued in five seconds.
 *
 * The animal is on screen with the mark sitting exactly where its horns are.
 * Then the mark hardens, detaches, and rises out of the head into the logo
 * while the animal falls back into the dark. Nature → abstraction, which is the
 * story the identity board tells across four panels, told here in one move.
 *
 * The mark is painted, not placed: `mark.png` — logo.png trimmed to its alpha bounds — is used as a CSS mask so the
 * shape can be any colour and can travel from sand to white mid-move. An
 * `<img>` could not change colour, and an inline SVG would mean maintaining a
 * second copy of the mark that could drift from the real asset.
 *
 * Everything sits inside `.origin-plate` — a fixed 3:2 box scaled to cover the
 * viewport — so the photograph and the mark scale as one object and the
 * alignment holds at every window size. Positioning the mark against the
 * viewport instead would let the two drift apart the moment the aspect changed.
 *
 * The recede is applied to `.origin-photo`, never to the plate, because the
 * plate is also the mark's coordinate system: dimming or scaling it would drag
 * the mark down with the animal.
 */
export default function OryxOrigin({ play, reduced }) {
  const root = useRef(null)

  /**
   * Work out where the mark has to travel to, and write it onto the element.
   *
   * The start position is fixed by the photograph — the mark has to sit on the
   * animal's horns, so it is as large and as high as the plate makes it, with
   * its tips cropped off the top exactly as the real horns are. The end
   * position is fixed by the frame — centred, whole, at a size that reads as a
   * logo. Getting from one to the other needs the mark's rendered height
   * divided by the viewport's, and `calc()` cannot divide two lengths, so it is
   * measured here instead of approximated in CSS.
   */
  useEffect(() => {
    const measure = () => {
      const mark = root.current?.querySelector('.origin-mark')
      if (!mark) return

      /* Measure the untravelled box, whatever the animation is currently
         doing, then put `--t` back so a run in progress is not disturbed. */
      const held = mark.style.getPropertyValue('--t')
      mark.style.setProperty('--t', '0')
      const r = mark.getBoundingClientRect()
      if (held) mark.style.setProperty('--t', held)
      else mark.style.removeProperty('--t')

      if (!r.height) return
      const vw = window.innerWidth
      const vh = window.innerHeight

      /* Tall enough to carry the page, short enough to leave the copy room. */
      const scale = Math.min(1, (vh * 0.46) / r.height)

      mark.style.setProperty('--end-scale', String(scale))
      mark.style.setProperty('--dx', `${vw / 2 - (r.left + r.width / 2)}px`)
      mark.style.setProperty('--dy', `${vh * 0.43 - (r.top + r.height / 2)}px`)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [play])

  useEffect(() => {
    if (!play) return
    /* Reduced motion gets the resolved frame: mark detached and centred, animal
       already dark. The story is in the composition as much as in the movement,
       so the end state still tells it. */
    if (reduced) {
      gsap.set('.origin-mark', { '--t': 1, opacity: 1 })
      gsap.set('.origin-photo', { opacity: 0.22 })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      /* 1 — the mark is the horns. Dim, sand, sitting in the animal's own horn
         line so the eye reads one object rather than two. */
      tl.fromTo(
        '.origin-mark',
        { opacity: 0 },
        { opacity: 0.5, duration: 0.9, ease: 'power2.out' },
        0.15,
      )

      /* 2 — it hardens. Nothing moves; only the weight changes. That is what
         makes the next beat read as the mark leaving the animal rather than as
         a second shape fading up over it. */
      tl.to('.origin-mark', { opacity: 1, duration: 0.7, ease: 'power2.inOut' }, 1.25)

      /* 3 — detach. One tween on `--t` drives position, scale and colour
         together, so the move cannot fall out of step with the grade. */
      tl.to('.origin-mark', { '--t': 1, duration: 2.2, ease: 'expo.inOut' }, 1.95)

      /* The animal goes on the same beat. It does not fade out — it falls back
         into the dark, which keeps it present underneath the mark. */
      tl.to(
        '.origin-photo',
        { opacity: 0.22, scale: 1.07, duration: 2.5, ease: 'expo.inOut' },
        1.95,
      )
    }, root)

    return () => ctx.revert()
  }, [play, reduced])

  return (
    <div className="origin" ref={root} aria-hidden="true">
      <div className="origin-plate">
        <div className="origin-photo">
          <img src={film.oryx.src} alt="" />
          {/* Graded to the brand before anything is drawn on top: the source is
              a warm daylight photograph and the film is near-black. */}
          <span className="origin-grade" />
        </div>
        <span className="origin-mark" />
      </div>
    </div>
  )
}
