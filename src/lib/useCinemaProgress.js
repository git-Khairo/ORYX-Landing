/**
 * The cinema channel.
 *
 * Acts 1–4 are one pinned scroll region whose ScrollTrigger writes a single
 * master progress `p` (0..1) in here. The R3F scene reads `getCinema().p` every
 * frame in `useFrame` WITHOUT triggering React re-renders — the same
 * external-store trick `useScrollStore` uses for the rest of the page.
 *
 * Everything the 3D stage does is derived from `p` via the phase helpers below,
 * so the whole hero→carousel→zoom sequence is one function of scroll position
 * and stays perfectly reversible when the user scrolls back up.
 */
const cinema = { p: 0 }

export function setCinema(p) {
  cinema.p = p
}

export function getCinema() {
  return cinema
}

/** Linear map of `x` from [a,b] into [0,1], clamped. */
export function phase(x, a, b) {
  if (b === a) return x < a ? 0 : 1
  const t = (x - a) / (b - a)
  return t < 0 ? 0 : t > 1 ? 1 : t
}

/**
 * The act boundaries, in master-progress space. Ranges overlap on purpose so
 * one act hands off to the next mid-motion rather than stopping dead.
 *   logo   — the single 3D logo, large and facing camera
 *   morph  — logo shrinks + tips vertical; the other cards fly into the ring
 *   rotate — the ring turns through the three services and back to the logo card
 *   zoom   — the front logo card scales to fill the screen, then the wipe
 */
export const ACT = {
  logo: [0.0, 0.16],
  morph: [0.11, 0.36],
  rotate: [0.36, 0.7],
  zoom: [0.7, 0.86],
  // The Standard is part of this pinned run rather than a section below it:
  // once the mark has filled the screen the page is *already* there, and this
  // last stretch is only the copy arriving on it. Scrolling never reveals it —
  // scrolling plays it.
  standard: [0.86, 1.0],
}
