import { useEffect, useRef } from 'react'

/**
 * A cursor made out of the mark.
 *
 * Two parts, because one is not enough to feel like anything: a small dot that
 * tracks the pointer exactly, and a ring that chases it a few frames behind.
 * The gap between them is the whole effect — the dot says where you are, the
 * ring says where you have just been, and the lag reads as weight.
 *
 * Over anything clickable the ring opens up and the chevron appears inside it,
 * so the brand's own shape is what tells you a thing can be pressed.
 *
 * It is additive, never a replacement. The native cursor is only hidden once
 * this is known to be running on a device with a real pointer — hiding it
 * first and discovering later that nothing replaced it is how a page ends up
 * with no cursor at all.
 */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    /* Fine pointer only. On touch there is nothing to follow, and a visitor who
       has asked for less motion should not be given a thing that chases them
       around the screen. */
    const fine = window.matchMedia('(pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || still.matches) return

    document.documentElement.classList.add('has-cursor')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      /* The dot is written straight from the event rather than from the loop —
         a cursor that lags its own pointer feels broken, however good the
         easing on everything else. */
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const step = () => {
      /* The ring eases toward the dot by a fixed fraction each frame, which is
         what produces the trailing weight. */
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(step)
    }

    /* Interactive state is read off the element under the pointer rather than
       bound to every button on mount — sections mount and unmount constantly
       here, and listeners attached at startup would miss all of them. */
    const onOver = (e) => {
      const hit = e.target.closest?.('a, button, [role="button"], input, .door, .r-scrub')
      document.documentElement.classList.toggle('cursor-live', !!hit)
    }

    const onLeave = () => document.documentElement.classList.add('cursor-out')
    const onEnter = () => document.documentElement.classList.remove('cursor-out')
    const onDown = () => document.documentElement.classList.add('cursor-down')
    const onUp = () => document.documentElement.classList.remove('cursor-down')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    raf = requestAnimationFrame(step)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove(
        'has-cursor',
        'cursor-live',
        'cursor-out',
        'cursor-down',
      )
    }
  }, [])

  return (
    <>
      <span className="cursor-dot" ref={dot} aria-hidden="true" />
      <span className="cursor-ring" ref={ring} aria-hidden="true">
        <i />
      </span>
    </>
  )
}
