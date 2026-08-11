import { useEffect, useRef } from 'react'

/**
 * The three things a full-screen overlay needs, and that are wrong often enough
 * to be worth writing once: the page underneath must not scroll, Escape must
 * close, and focus must not wander into the frozen page behind.
 */

/**
 * Freeze the page behind the overlay.
 *
 * `overflow: hidden` on body is the usual shortcut and it is wrong here: this
 * page sets `body { overflow-x: clip }` and builds its sections from
 * `min-height: 100svh`, so hiding overflow collapses the scroll position and
 * the visitor is returned to the top when the overlay closes. Pinning the body
 * at a negative offset keeps the exact position and hands it back on cleanup.
 */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    const y = window.scrollY
    const { body } = document
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    }

    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    return () => {
      Object.assign(body.style, previous)
      window.scrollTo(0, y)
    }
  }, [active])
}

/** Escape closes. Capture phase, so it wins over anything below. */
export function useEscape(active, onEscape) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onEscape()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [active, onEscape])
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Keep Tab inside the overlay, and put focus back where it came from on close.
 *
 * The restore matters more than the trap: the visitor opened this from a
 * specific service row, and returning focus to the top of the document would
 * lose their place in a page that is otherwise careful to preserve it.
 */
export function useFocusTrap(active) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return
    const root = ref.current
    if (!root) return

    const opener = document.activeElement
    root.querySelector(FOCUSABLE)?.focus?.()

    const onKey = (e) => {
      if (e.key !== 'Tab') return
      const items = [...root.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    root.addEventListener('keydown', onKey)
    return () => {
      root.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [active])

  return ref
}


/**
 * Pause every video outside the overlay while it is open.
 *
 * The home page keeps five clips playing — the hero stage and the three
 * service rows and the footer — and none of them stop just because something
 * is covering them. Decoding eight videos at once while also compositing a
 * backdrop-filter and a blend mode is what makes the overlay scroll badly; the
 * page underneath is doing full-rate work nobody can see.
 */
export function usePauseBackgroundVideo(active, exceptRoot) {
  useEffect(() => {
    if (!active) return
    const paused = []
    document.querySelectorAll('video').forEach((v) => {
      if (exceptRoot?.current?.contains(v)) return
      if (v.paused) return
      v.pause()
      paused.push(v)
    })
    return () => {
      paused.forEach((v) => v.play?.().catch(() => {}))
    }
  }, [active, exceptRoot])
}
