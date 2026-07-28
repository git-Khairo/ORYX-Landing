import { useEffect } from 'react'
import { prefersReduced } from './useLenis'
import { animateScrollTo } from './scrollEngine'
import { lockPager, pagerLocked } from './pagerLock'
import { isOverlayOpen } from './useOverlay'

/**
 * Full-screen section paging: one scroll gesture moves the page exactly one
 * stop, so every section is entered as a complete screen rather than drifting
 * past as a strip of a long document.
 *
 * Design rule for this file, learned the hard way: **never swallow a gesture
 * without moving the page.** Every guard that returns after preventDefault is a
 * potential total scroll freeze. So there is exactly one preventDefault, it
 * happens only when a move is actually about to be attempted, and if a move
 * ever fails to change scrollY the pager switches itself off and hands the page
 * back to the browser.
 *
 * Stops come from live layout, because sections are not all one screen tall:
 *  - Services pins a sticky stage and translates a horizontal track, so it
 *    declares `data-stops` and contributes one stop per panel.
 *  - Any section that outgrows the viewport is split into viewport-sized stops
 *    automatically, so nothing becomes unreachable.
 */
const DURATION = 0.9
const MIN_WHEEL = 4
const SWIPE_MIN = 40

export function usePager() {
  useEffect(() => {
    let stops = []
    let enabled = true

    const buildStops = () => {
      const vh = window.innerHeight
      const pageTop = window.scrollY
      const max = document.documentElement.scrollHeight - vh
      const raw = []

      document.querySelectorAll('.content-layer > section').forEach((el) => {
        // Rect + scrollY is correct even while the preloader has the page
        // locked under overflow:hidden — layout still happens, it is only
        // clipped. Do not gate this on load state.
        const top = el.getBoundingClientRect().top + pageTop
        const height = el.offsetHeight
        const declared = Number(el.dataset.stops || 0)

        if (declared === 1) {
          // Explicitly one screen. Sections declare this rather than having it
          // inferred from measurement: a section a few pixels over 100svh was
          // being split in two, which cost a second gesture to leave it, and
          // chasing that by shrinking content never converges.
          raw.push(top)
        } else if (declared > 1) {
          const travel = Math.max(height - vh, 0)
          for (let k = 0; k < declared; k++) raw.push(top + (travel * k) / (declared - 1))
        } else if (height > vh * 1.02) {
          // Anything even slightly taller than the viewport gets a second stop
          // at its foot. At the old 1.35 threshold a section 10% too tall was
          // entered at its top and its bottom was simply never reachable.
          const steps = Math.max(Math.ceil(height / vh), 2)
          for (let k = 0; k < steps; k++) raw.push(Math.min(top + k * vh, top + height - vh))
        } else {
          raw.push(top)
        }
      })

      // Only clamp against the document when it has a real measured height; a
      // bogus max must never flatten every stop to zero.
      const clamp = (v) => (max > 0 ? Math.min(Math.max(v, 0), max) : Math.max(v, 0))
      stops = [...new Set(raw.map((v) => Math.round(clamp(v))))].sort((a, b) => a - b)

      window.__pager = { ...(window.__pager || {}), stops, max, vh, enabled }
      return stops
    }

    // Derived from real scroll position every time rather than tracked, so
    // anchor links, the rail and scrollbar drags all stay in sync for free.
    const nearestIndex = () => {
      const y = window.scrollY
      let best = 0
      let bestDistance = Infinity
      for (let i = 0; i < stops.length; i++) {
        const d = Math.abs(stops[i] - y)
        if (d < bestDistance) {
          bestDistance = d
          best = i
        }
      }
      return best
    }

    /** Returns true if a move was actually started. */
    const step = (direction) => {
      if (!enabled) return false
      // Use the cached grid. Rebuilding here read ten bounding rects on every
      // gesture, and a wheel produces a burst of them — that forced-layout
      // storm is what made mouse paging feel heavy next to arrow keys.
      // `buildStops` still runs on resize, on ready, and if the grid is empty.
      if (stops.length < 2 && buildStops().length < 2) return false

      const current = nearestIndex()
      const next = Math.min(Math.max(current + direction, 0), stops.length - 1)
      if (next === current) return false

      const target = stops[next]
      const before = window.scrollY
      const duration = prefersReduced ? 0 : DURATION

      lockPager(duration * 1000 + 160)
      animateScrollTo(target, { duration })

      // Self-heal: if a frame later the page has not budged, this environment
      // is not honouring programmatic scroll. Hand control back rather than
      // leaving the user on a page that eats every gesture.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // An overlay that opened mid-flight legitimately freezes the body.
          // Reading that as a broken browser is what killed paging for good
          // after closing a service world.
          if (locked()) return
          if (Math.abs(window.scrollY - before) < 1 && Math.abs(target - before) > 2) {
            enabled = false
            window.__pager = { ...(window.__pager || {}), enabled: false, reason: 'scroll-blocked' }
            console.warn('[ORYX] pager disabled — window.scrollTo did not move the page.')
          }
        })
      })
      return true
    }

    const scrollsItself = (node) => {
      let el = node
      while (el && el !== document.body) {
        if (el.tagName === 'TEXTAREA' && el.scrollHeight > el.clientHeight) return true
        el = el.parentElement
      }
      return false
    }

    /** True while the preloader or a full-screen overlay owns the screen. */
    const locked = () =>
      document.documentElement.classList.contains('is-loading') || isOverlayOpen()

    const onWheel = (e) => {
      if (!enabled || e.ctrlKey || locked()) return
      if (scrollsItself(e.target)) return
      if (Math.abs(e.deltaY) < MIN_WHEEL) return
      if (stops.length < 2 && buildStops().length < 2) return

      // Mid-animation: absorb the gesture so momentum does not stack pages,
      // but the lock is time-bounded and always expires.
      if (pagerLocked()) {
        e.preventDefault()
        return
      }

      e.preventDefault()
      window.__pager.gestures = (window.__pager.gestures || 0) + 1
      step(e.deltaY > 0 ? 1 : -1)
    }

    let touchY = null
    const onTouchStart = (e) => {
      touchY = e.touches[0]?.clientY ?? null
    }
    const onTouchMove = (e) => {
      if (!enabled || locked() || stops.length < 2) return
      if (scrollsItself(e.target)) return
      e.preventDefault()
    }
    const onTouchEnd = (e) => {
      if (!enabled || touchY == null || locked()) return
      const delta = touchY - (e.changedTouches[0]?.clientY ?? touchY)
      touchY = null
      if (Math.abs(delta) < SWIPE_MIN || pagerLocked()) return
      step(delta > 0 ? 1 : -1)
    }

    const onKey = (e) => {
      if (!enabled || locked()) return
      const el = e.target
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return

      if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault()
        if (pagerLocked() || buildStops().length < 2) return
        const target = stops[e.key === 'Home' ? 0 : stops.length - 1]
        lockPager(DURATION * 1000 + 160)
        animateScrollTo(target, { duration: prefersReduced ? 0 : DURATION })
        return
      }

      let direction = 0
      if (e.key === 'ArrowDown' || e.key === 'PageDown') direction = 1
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') direction = -1
      else if (e.key === ' ') direction = e.shiftKey ? -1 : 1
      if (!direction) return

      e.preventDefault()
      if (!pagerLocked()) step(direction)
    }

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(buildStops, 150)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)

    buildStops()
    const settle = setTimeout(buildStops, 800)
    const late = setTimeout(buildStops, 4000)

    return () => {
      clearTimeout(resizeTimer)
      clearTimeout(settle)
      clearTimeout(late)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])
}
