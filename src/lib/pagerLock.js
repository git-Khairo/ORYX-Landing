/**
 * A single "a scroll animation owns the page right now" flag, shared by the
 * pager and by anchor navigation (nav logo, CTA buttons, progress rail).
 *
 * Without it the two fight: an anchor jump animates for ~1.4s, and any wheel
 * tick during that window would ask the pager to step one section from wherever
 * the animation happens to be mid-flight — landing somewhere nobody asked for.
 */
let lockedUntil = 0

export function lockPager(ms) {
  const until = Date.now() + ms
  if (until > lockedUntil) lockedUntil = until
}

export function pagerLocked() {
  return Date.now() < lockedUntil
}

export function releasePager() {
  lockedUntil = 0
}
