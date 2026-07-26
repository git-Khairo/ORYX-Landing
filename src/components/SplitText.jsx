import { Fragment, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReduced } from '../lib/useLenis'

/**
 * Splits a heading into words and reveals them with a masked, staggered rise
 * when the heading scrolls into view. Driven by getBoundingClientRect polled on
 * the GSAP ticker (robust everywhere). `as` picks the tag (h1/h2).
 */
export default function SplitText({ text, as = 'h2', className = '' }) {
  const ref = useRef(null)
  const Tag = as

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll('.word > span')
    gsap.set(words, { yPercent: prefersReduced ? 0 : 118, opacity: prefersReduced ? 0 : 1 })

    let done = false
    const check = () => {
      if (done) return
      const top = el.getBoundingClientRect().top
      const vh = window.innerHeight
      if (top < vh * 0.9 && top > -vh) {
        done = true
        gsap.ticker.remove(check)
        gsap.to(words, {
          yPercent: 0,
          opacity: 1,
          duration: prefersReduced ? 0.4 : 1.0,
          ease: 'power4.out',
          stagger: prefersReduced ? 0.02 : 0.06,
        })
      }
    }
    gsap.ticker.add(check)
    check()
    return () => gsap.ticker.remove(check)
  }, [text])

  const words = String(text).split(' ')
  return (
    <Tag ref={ref} className={`splittext ${className}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word">
            <span>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  )
}
