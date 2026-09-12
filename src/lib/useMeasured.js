import { useEffect, useRef } from 'react'

/**
 * Publish an element's real height as a custom property on the world root.
 *
 * Sticky chrome stacks: a bar, and under it a rail, and under that a column
 * header, each needing a `top` offset that clears everything above it. Every
 * one of those offsets is wrong if a height is guessed, and none of them can
 * be guessed — a navigation bar holds a wordmark and a call to action whose
 * label comes from `copy.js`, so its height moves with the copy, the font and
 * the viewport. Measured on this project: 54px on a desktop and 82px on a
 * 375px phone, where the button wrapped. A hard-coded `3.4rem` put the sector
 * rail twenty-eight pixels underneath the bar it was supposed to sit below.
 *
 * So it is measured, once, and re-measured whenever the element resizes.
 *
 * Shared by Workforce and Renovation. It lived inside `WorkforceWorld.jsx`
 * first; the second caller is what moved it here rather than being copied.
 */
export function useMeasured(varName) {
  const el = useRef(null)
  useEffect(() => {
    const n = el.current
    if (!n) return
    const root = n.closest('.world') || document.documentElement
    const write = () =>
      root.style.setProperty(varName, `${Math.round(n.getBoundingClientRect().height)}px`)
    write()
    if (typeof ResizeObserver !== 'function') return
    const ro = new ResizeObserver(write)
    ro.observe(n)
    return () => {
      ro.disconnect()
      root.style.removeProperty(varName)
    }
  }, [varName])
  return el
}
