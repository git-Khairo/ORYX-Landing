import { useSyncExternalStore } from 'react'

/**
 * A tiny external store holding the single source of truth for scroll:
 *  - progress: normalized 0..1 down the whole page
 *  - velocity: current Lenis velocity (for subtle motion energy)
 *  - section: index (0..N-1) of the section closest to viewport centre
 * Lenis writes into it; the R3F scene reads it every frame WITHOUT causing
 * React re-renders (it reads .state directly in useFrame).
 */
const store = {
  state: { progress: 0, velocity: 0, section: 0, scroll: 0, direction: 1 },
  listeners: new Set(),
}

export function setScroll(partial) {
  const prev = store.state
  const next = { ...prev, ...partial }

  if (typeof partial.scroll === 'number') {
    const delta = partial.scroll - prev.scroll
    // Sub-pixel jitter at the end of an eased animation would otherwise flip
    // `direction` back and forth and make the nav strobe.
    next.direction = Math.abs(delta) > 0.5 ? (delta > 0 ? 1 : -1) : prev.direction
  }

  store.state = next
  store.listeners.forEach((l) => l())
}

export function getScrollState() {
  return store.state
}

function subscribe(listener) {
  store.listeners.add(listener)
  return () => store.listeners.delete(listener)
}

/** React hook — use sparingly (re-renders on every scroll tick). */
export function useScroll(selector = (s) => s) {
  return useSyncExternalStore(
    subscribe,
    () => selector(store.state),
    () => selector(store.state),
  )
}
