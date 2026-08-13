import { useEffect } from 'react'

/**
 * Reveal `[data-reveal]` elements as they enter the scroller.
 *
 * Written as a hook rather than reached for with GSAP because of how the last
 * version failed: `gsap.from({ opacity: 0 })` fired by an observer leaves every
 * element invisible until its trigger happens to fire, and on sections taller
 * than the viewport that trigger is unreliable — which is how two whole
 * sections ended up rendering as blank screens.
 *
 * So the contract here is that content can never be lost:
 *
 *  - anything already on screen at mount is revealed immediately, without
 *    waiting for an intersection that may never come;
 *  - a backstop timer reveals everything regardless after a couple of seconds,
 *    so a failed observer costs an animation, never the content;
 *  - the hidden state lives on `[data-reveal]:not(.is-in)`, so if this hook
 *    never runs at all the markup is simply visible.
 */
export function useReveal(scroller, deps = []) {
  useEffect(() => {
    const root = scroller.current
    if (!root) return

    const items = [...root.querySelectorAll('[data-reveal]')]
    if (!items.length) return

    const show = (el) => el.classList.add('is-in')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          show(e.target)
          io.unobserve(e.target)
        })
      },
      /* Fires a little before the element is fully in view, so the movement
         reads as arriving rather than as catching up. */
      { root, rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )

    const rootRect = root.getBoundingClientRect()
    items.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < rootRect.bottom && r.bottom > rootRect.top) show(el)
      else io.observe(el)
    })

    const backstop = setTimeout(() => items.forEach(show), 2500)

    return () => {
      io.disconnect()
      clearTimeout(backstop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Drive a section's own scroll progress as a smoothed CSS variable.
 *
 * The obvious version — write `scrollTop` straight into a custom property on
 * every scroll event — is what makes scroll-driven scenes feel cheap. Scroll
 * arrives in lumps: a mouse wheel delivers large discrete jumps and a trackpad
 * delivers bursts, so anything reading the raw value inherits that stepping no
 * matter how the easing is written.
 *
 * So the raw value is only ever a *target*. A rAF loop eases the rendered value
 * toward it by a fixed fraction each frame, which turns any input cadence into
 * continuous motion and adds a little weight on top — the scene keeps moving
 * for a moment after the wheel stops, the way something heavy would.
 *
 * The loop parks itself once the two converge, so a section standing still
 * costs nothing.
 */
export function useSmoothProgress(section, onStep, ease = 0.11) {
  useEffect(() => {
    const el = section.current
    if (!el) return
    const scroller = el.closest('.world-scroll')
    if (!scroller) return

    let target = 0
    let current = 0
    let raf = 0
    let running = false

    const read = () => {
      const r = el.getBoundingClientRect()
      const span = r.height - scroller.clientHeight
      target = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
    }

    const step = () => {
      current += (target - current) * ease
      /* Snap the last fraction of a pixel's worth, so the loop can stop instead
         of chasing an asymptote for ever. */
      if (Math.abs(target - current) < 0.0004) {
        current = target
        running = false
      }
      el.style.setProperty('--p', current.toFixed(4))
      onStep?.(current)
      raf = running ? requestAnimationFrame(step) : 0
    }

    const kick = () => {
      read()
      if (!running) {
        running = true
        raf = requestAnimationFrame(step)
      }
    }

    scroller.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    read()
    current = target
    el.style.setProperty('--p', current.toFixed(4))
    onStep?.(current)

    return () => {
      scroller.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, ease])
}

/**
 * Report how far the scroller has travelled, 0 → 1, as a CSS variable.
 *
 * A variable rather than React state on purpose: this updates on every scroll
 * frame, and re-rendering a page this size at that rate is the difference
 * between a route line that tracks the scroll and one that stutters behind it.
 */
export function useScrollProgress(scroller, varName = '--progress', target) {
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const write = target?.current ?? el

    let frame = 0
    const update = () => {
      frame = 0
      const max = el.scrollHeight - el.clientHeight
      write.style.setProperty(varName, max > 0 ? String(el.scrollTop / max) : '0')
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [scroller, varName, target])
}
