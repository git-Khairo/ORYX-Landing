import { prefersReduced } from './useLenis'
import { animateScrollTo } from './scrollEngine'
import { getLenis } from './useSmoothScroll'

/* Long on purpose. These jumps cross a pinned, scrubbed sequence, and at a
   snappy 1.1s the acts flicked past as a blur — the travel *is* the thing worth
   seeing, so it is given time to be watched. */
const DURATION = 2.4

/* A slow start, a long glide, a soft arrival — closer to a camera move than to
   a UI transition. */
const EASE = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Smoothly scroll to an element id. */
export function scrollToId(id, offset = 0) {
  const el = document.getElementById(id)
  if (!el) return

  // Lenis owns the scroll position while it is running, so hand the trip to it
  // rather than driving `window.scrollTo` underneath it: two animators writing
  // scroll on the same frames fight, and the page judders or stalls outright.
  // The pager that this used to have to lock out is gone.
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: DURATION, easing: EASE })
    return
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset
  animateScrollTo(top, { duration: prefersReduced ? 0 : DURATION })
}
