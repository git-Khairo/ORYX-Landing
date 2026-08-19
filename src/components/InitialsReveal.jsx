import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { brand } from '../content/copy'

/**
 * O · R · Y · X resolving into Our Reliability, Your eXcellence.
 *
 * The slogan is a backronym of the name, so the film can do the one thing a
 * static lockup cannot: show where it comes from. Each letter of ORYX rises,
 * draws a rule under itself, and hands down the word it stands for.
 *
 * Set as four columns rather than one unfolding line. The letter sits on top,
 * its word directly beneath it, and each pair arrives in turn — so the
 * relationship between letter and word is carried by alignment instead of
 * having to be inferred from a word growing sideways out of a letter. An
 * earlier version animated `width: auto` on inline spans, which reflowed the
 * line on every frame: the letters slid around while the words grew, and
 * nothing sat still long enough to be read.
 */
export default function InitialsReveal({ play, reduced }) {
  const root = useRef(null)

  useEffect(() => {
    if (!play) return
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.ir-initial', { yPercent: 0 })
        gsap.set('.ir-word', { opacity: 1, y: 0 })
        gsap.set('.ir-rule', { scaleX: 1 })
        return
      }

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.ir-initial', { yPercent: 108, duration: 0.85, stagger: 0.09 })
        .from('.ir-rule', { scaleX: 0, duration: 0.7, stagger: 0.09 }, 0.5)
        .from('.ir-word', { opacity: 0, y: 12, duration: 0.7, stagger: 0.1 }, 0.62)
    }, root)
    return () => ctx.revert()
  }, [play, reduced])

  return (
    <h2 className="initials" ref={root} aria-label={`ORYX — ${brand.slogan}`}>
      {brand.letters.map(({ k, w }) => (
        <span className="ir-col" key={k} aria-hidden="true">
          <span className="ir-mask">
            <span className="ir-initial">{k}</span>
          </span>
          <span className="ir-rule" />
          <span className="ir-word">{w}</span>
        </span>
      ))}
    </h2>
  )
}
