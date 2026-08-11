import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { brand } from '../content/copy'

/**
 * O.I.F.M.G resolving into ORYX Integration Facility Management Group.
 *
 * Set as five columns rather than one unfolding line. The initial sits on top,
 * its word directly beneath it, and each pair arrives in turn — so the
 * relationship between letter and word is shown by alignment instead of having
 * to be inferred from a word growing sideways out of a letter.
 *
 * The earlier version animated `width: auto` on inline spans, which reflowed
 * the whole line on every frame: the letters slid around while the words grew,
 * and nothing ever sat still long enough to be read.
 */
export default function InitialsReveal({ play, reduced }) {
  const root = useRef(null)

  useEffect(() => {
    if (!play) return
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.ir-col', { opacity: 1 })
        gsap.set('.ir-word', { opacity: 1, y: 0 })
        gsap.set('.ir-rule', { scaleX: 1 })
        return
      }

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.ir-initial', { yPercent: 108, duration: 0.85, stagger: 0.06 })
        .from('.ir-rule', { scaleX: 0, duration: 0.7, stagger: 0.06 }, 0.5)
        .from('.ir-word', { opacity: 0, y: 12, duration: 0.7, stagger: 0.07 }, 0.62)
    }, root)
    return () => ctx.revert()
  }, [play, reduced])

  return (
    <h1 className="initials" ref={root} aria-label={brand.full}>
      {brand.expansion.map((word) => (
        <span className="ir-col" key={word} aria-hidden="true">
          <span className="ir-mask">
            <span className="ir-initial">{word[0]}</span>
          </span>
          <span className="ir-rule" />
          <span className="ir-word">{word}</span>
        </span>
      ))}
    </h1>
  )
}
