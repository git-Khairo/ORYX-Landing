import { useEffect, useRef, useSyncExternalStore } from 'react'

/**
 * How many full-screen overlays are currently open.
 *
 * The pager must go completely inert while one is: the body is `position:
 * fixed` under a scroll lock, so `window.scrollTo` cannot move it, and the
 * pager's own self-heal would read that as "this browser refuses programmatic
 * scroll" and permanently switch paging off. That is why snapping died after
 * closing a service.
 */
let openCount = 0
const listeners = new Set()

function setOpenCount(n) {
  openCount = n
  listeners.forEach((l) => l())
}

export function isOverlayOpen() {
  return openCount > 0
}

function subscribeOverlay(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useOverlayOpen() {
  return useSyncExternalStore(
    subscribeOverlay,
    () => openCount > 0,
    () => false,
  )
}

/**
 * The three things every full-screen overlay on this page needs, and that are
 * wrong often enough to be worth centralising: the page underneath must not
 * scroll, Escape must close, and focus must not escape into the frozen page
 * behind.
 *
 * Scroll lock preserves the position rather than jumping to the top: the pager
 * puts the visitor at an exact stop, and returning them somewhere else would
 * undo that.
 */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    setOpenCount(openCount + 1)
    const y = window.scrollY
    const { body } = document
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    }

    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    return () => {
      Object.assign(body.style, previous)
      window.scrollTo(0, y)
      setOpenCount(Math.max(openCount - 1, 0))
    }
  }, [active])
}

export function useEscape(active, onEscape) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      onEscape()
    }
    // Capture phase so this wins over the pager's own key handling.
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [active, onEscape])
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(active) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return
    const root = ref.current
    if (!root) return

    const previouslyFocused = document.activeElement
    const first = root.querySelector(FOCUSABLE)
    first?.focus?.()

    const onKey = (e) => {
      if (e.key !== 'Tab') return
      const items = [...root.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      )
      if (!items.length) return
      const start = items[0]
      const end = items[items.length - 1]

      if (e.shiftKey && document.activeElement === start) {
        e.preventDefault()
        end.focus()
      } else if (!e.shiftKey && document.activeElement === end) {
        e.preventDefault()
        start.focus()
      }
    }

    root.addEventListener('keydown', onKey)
    return () => {
      root.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [active])

  return ref
}
