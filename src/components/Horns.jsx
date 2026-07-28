import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { prefersReduced } from '../lib/useLenis'

/**
 * The sculpture, as a composited object rather than a picture on the page.
 *
 * Drop a transparent PNG at `public/brand/horns.png` and this mounts it. If the
 * file is not there it renders nothing — no broken icon, no reserved gap.
 *
 * Everything below exists to stop it reading as a pasted image:
 *  - it moves against the pointer, so it sits at a different depth to the copy
 *  - it drifts and rotates a degree or so with scroll, so it is never a fixed
 *    stamp in the layout
 *  - the page's grain is multiplied over it, so it shares the page's surface
 *    rather than sitting cleanly on top of it
 *  - it enters behind a mask that wipes upward, so it is revealed rather than
 *    switched on
 * The alpha channel does the rest: an opaque rectangle can never stop looking
 * like a photograph, and no amount of treatment rescues one.
 */
export default function Horns({ align = 'right', scale = 1, className = '' }) {
  const wrap = useRef(null)
  const img = useRef(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const probe = new Image()
    probe.onload = () => setOk(true)
    probe.onerror = () => setOk(false)
    probe.src = '/brand/horns.png'
  }, [])

  useEffect(() => {
    if (!ok || prefersReduced) return
    const el = img.current
    const box = wrap.current
    if (!el || !box) return

    const pointer = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)

    const tick = () => {
      pointer.x += (target.x - pointer.x) * 0.045
      pointer.y += (target.y - pointer.y) * 0.045

      // How far this instance has travelled through the viewport, -1 → 1.
      const r = box.getBoundingClientRect()
      const centre = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
      const travel = gsap.utils.clamp(-1, 1, centre)

      el.style.transform = [
        `translate3d(${-pointer.x * 18}px, ${-pointer.y * 14 - travel * 46}px, 0)`,
        `rotate(${pointer.x * 1.1 - travel * 1.6}deg)`,
        `scale(${scale + Math.abs(travel) * 0.015})`,
      ].join(' ')
    }
    gsap.ticker.add(tick)
    tick()
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
    }
  }, [ok, scale])

  if (!ok) return null

  return (
    <div className={`horns horns--${align} ${className}`} ref={wrap} aria-hidden="true">
      <span className="horns-mask">
        <img ref={img} src="/brand/horns.png" alt="" draggable="false" />
      </span>
      <span className="horns-grain" />
    </div>
  )
}
