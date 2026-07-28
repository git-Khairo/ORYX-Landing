/**
 * The page's only scroll animator.
 *
 * This used to be Lenis. Lenis was configured with `smoothWheel: false` (the
 * pager owns wheel input), which left it doing nothing but `scrollTo` — and
 * when that silently failed to move the page, every gesture was swallowed by
 * the pager and the site froze. A rAF loop over `window.scrollTo` is about
 * fifteen lines, has no configuration surface, and cannot fail quietly.
 */
let frame = 0
let onCancel = null

const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export function cancelScroll() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  if (onCancel) {
    const fn = onCancel
    onCancel = null
    fn()
  }
}

/**
 * Ease the window to `targetY`. Resolves when it arrives or is superseded.
 * `duration` is in seconds; 0 jumps immediately.
 */
export function animateScrollTo(targetY, { duration = 0.9 } = {}) {
  cancelScroll()

  const startY = window.scrollY
  const distance = targetY - startY

  if (duration <= 0 || Math.abs(distance) < 1) {
    window.scrollTo(0, targetY)
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    onCancel = resolve
    const startTime = performance.now()
    const ms = duration * 1000

    const tick = (now) => {
      const t = Math.min((now - startTime) / ms, 1)
      window.scrollTo(0, startY + distance * expoOut(t))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        frame = 0
        onCancel = null
        resolve()
      }
    }
    frame = requestAnimationFrame(tick)
  })
}
