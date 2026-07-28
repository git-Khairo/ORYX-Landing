import { prefersReduced } from './useLenis'
import { animateScrollTo } from './scrollEngine'
import { lockPager } from './pagerLock'

const DURATION = 1.1

/** Smoothly scroll to an element id. */
export function scrollToId(id, offset = 0) {
  const el = document.getElementById(id)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY + offset
  const duration = prefersReduced ? 0 : DURATION

  // Hold the pager off for the length of the trip, so a wheel tick mid-flight
  // doesn't step a section from wherever the animation currently is.
  lockPager(duration * 1000 + 160)
  animateScrollTo(top, { duration })
}
