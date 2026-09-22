import { useEffect, useState } from 'react'
import { usePrefersReduced } from './usePrefersReduced'

/**
 * Has this element been seen yet, in a way that is safe to hang motion on.
 *
 * `useReveal` cannot be used for this. Its backstop timer marks every
 * `[data-reveal]` element as revealed after two and a half seconds, which is
 * right for content and wrong for a flourish: a tick that draws itself further
 * down the page would have drawn, unseen, long before anyone scrolled to it.
 *
 * Three states, and the order they can happen in is the point:
 *   'idle'  nothing is known. The element shows its finished state. This is
 *           also the whole story under reduced motion, or if the observer
 *           never reports at all, so nothing is ever left half drawn.
 *   'wait'  the observer's first report says the element is off screen. Only
 *           now is it allowed to be un-drawn, because only now is it certain
 *           that nobody is looking at it.
 *   'seen'  it has come into view. The motion plays once and stays finished.
 *
 * The observer is rooted on the service page's own scroller, because those
 * pages do not scroll the window.
 */
export function useSeen(ref, { margin = '-12%' } = {}) {
  const reduced = usePrefersReduced()
  const [state, setState] = useState('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return
    const root = el.closest('.world-scroll')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('seen')
          io.disconnect()
        } else {
          setState((s) => (s === 'idle' ? 'wait' : s))
        }
      },
      { root, rootMargin: `0px 0px ${margin} 0px`, threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, reduced, margin])

  return state
}

export const seenClass = (state) => (state === 'wait' ? 'is-wait' : state === 'seen' ? 'is-seen' : '')
