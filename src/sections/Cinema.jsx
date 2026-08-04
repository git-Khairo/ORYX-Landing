import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { brand } from '../content/copy'
import { prefersReduced } from '../lib/useLenis'
import { useAppReady } from '../lib/useAppReady'
import { setCinema, phase, ACT } from '../lib/useCinemaProgress'
import ServiceCarousel3D from '../components/three/ServiceCarousel3D'
import MarqueeHeadline from '../components/MarqueeHeadline'
import Standard from './Standard'
import '../styles/hero3d.css'
import '../styles/cinema.css'

export default function Cinema({ onOpenService, onContact }) {
  const root = useRef(null)
  const stage = useRef(null)
  const fill = useRef(null)
  const atmos = useRef(null)
  const darkRef = useRef(false)
  const particlesRef = useRef(null)
  const standard = useRef(null)
  const ready = useAppReady()
  const [staticMode] = useState(prefersReduced)

  useEffect(() => {
    if (!ready || staticMode) return

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage.current,
        pinSpacing: false,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          setCinema(p)

          const tZoom = phase(p, ...ACT.zoom)

          if (atmos.current) atmos.current.style.opacity = (1 - tZoom).toFixed(3)

          if (fill.current) {
            const o = Math.max(0, (tZoom - 0.55) / 0.45)
            fill.current.style.opacity = o.toFixed(3)
          }

          const tStd = phase(p, ...ACT.standard)
          const onDark = tStd > 0.3
          if (onDark !== darkRef.current) {
            darkRef.current = onDark
            document.documentElement.classList.toggle('tone-dark', onDark)
          }

          if (standard.current) {
            standard.current.style.setProperty('--t', tStd.toFixed(4))
            standard.current.style.opacity = tStd > 0 ? '1' : '0'
            standard.current.style.pointerEvents = tStd > 0.6 ? 'auto' : 'none'
          }
        },
      })
      return () => st.kill()
    }, root)

    return () => {
      ctx.revert()
      document.documentElement.classList.remove('tone-dark')
      darkRef.current = false
    }
  }, [ready, staticMode])

  // Gold particle system — replaces the cursor-following ember gradient.
  // A canvas handles both the ambient warm glow AND the sparks: one requestAnimationFrame
  // loop, zero CSS custom-property writes per frame.
  useEffect(() => {
    if (staticMode) return
    const canvas = particlesRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const particles = []
    const target = { x: window.innerWidth / 2, y: window.innerHeight * 0.55 }
    const cur = { x: target.x, y: target.y }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    let lastT = 0
    const tick = (t) => {
      raf = requestAnimationFrame(tick)
      // Cap at ~30fps to halve the CPU cost — the soft glow doesn't need 60fps.
      if (t - lastT < 32) return
      lastT = t

      const w = canvas.width
      const h = canvas.height

      cur.x += (target.x - cur.x) * 0.1
      cur.y += (target.y - cur.y) * 0.1

      particles.push({
        x: cur.x + (Math.random() - 0.5) * 90,
        y: cur.y + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(0.25 + Math.random() * 0.75),
        life: 1,
        decay: 0.009 + Math.random() * 0.014,
        r: 0.7 + Math.random() * 2,
      })

      ctx.clearRect(0, 0, w, h)

      const grd = ctx.createRadialGradient(cur.x, cur.y, 0, cur.x, cur.y, Math.min(w, h) * 0.38)
      grd.addColorStop(0, 'rgba(180, 180, 180, 0.10)')
      grd.addColorStop(1, 'rgba(180, 180, 180, 0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life -= p.decay
        if (p.life <= 0) { particles.splice(i, 1); continue }
        p.x += p.vx
        p.y += p.vy
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 200, 200, ${(p.life * 0.5).toFixed(3)})`
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [staticMode])

  return (
    <section
      id="hero"
      className={`cinema ${staticMode ? 'is-static' : ''}`}
      ref={root}
      aria-label={`${brand.name} — ${brand.tagline}`}
    >
      <span id="standard" className="cinema-anchor" aria-hidden="true" />

      <div className="cinema-stage" ref={stage}>
        <div className="cinema-atmos" ref={atmos} aria-hidden="true">
          {/* Canvas particle system: ambient glow + floating sparks, cursor-driven */}
          <canvas className="cinema-atmos-particles" ref={particlesRef} />
          <span className="cinema-atmos-grid" />
          <span className="cinema-atmos-grain" />
          <span className="cinema-atmos-vignette" />
        </div>

        <div className="cinema-marquee" aria-hidden="true">
          <MarqueeHeadline />
        </div>

        <div className="cinema-canvas">
          <ServiceCarousel3D
            onOpen={onOpenService}
            onContact={onContact}
            onExplore={() => onOpenService?.('cleaning', null)}
          />
        </div>

        <div className="cinema-fill" ref={fill} aria-hidden="true" />
        <div className="cinema-standard" ref={standard}>
          <Standard />
        </div>
      </div>
    </section>
  )
}
