import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { process } from '../content/copy'
import { film as footage } from '../content/media'
import VideoBackdrop from '../components/VideoBackdrop'
import { prefersReduced } from '../lib/useLenis'
import '../styles/howitworks.css'

/**
 * Acts 6–7 — How it works, then the hand-off.
 *
 * The section pins and converts vertical scroll into horizontal travel: the
 * four process steps pass through as stations, and a fifth panel — the
 * scattered field of the work itself — arrives last. Keeping the fifth panel on
 * the same track is what makes it feel like the end of a movement rather than a
 * new section: you arrive at it by the same gesture that carried you through
 * the steps.
 *
 * That last panel carries a frame which Act 7 scales up to full bleed, handing
 * the screen to the closing statement. The zoom is a separate, shorter trigger
 * so it can run *after* the horizontal travel has finished.
 */
const TILES = [
  { src: footage.cleaning.src, label: 'Cleaning', x: '4%', y: '10%', w: '22%' },
  { src: footage.delivery.src, label: 'Delivery', x: '72%', y: '6%', w: '24%' },
  { src: footage.facility.src, label: 'Facility', x: '78%', y: '58%', w: '20%' },
  { src: footage.people.src, label: 'The people', x: '2%', y: '58%', w: '22%' },
  { src: footage.platform.src, label: 'The platform', x: '26%', y: '4%', w: '17%' },
  { src: footage.office.src, label: 'Always ready', x: '46%', y: '68%', w: '19%' },
]

export default function HowItWorks() {
  const root = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const el = track.current
      if (!el) return
      const distance = () => el.scrollWidth - window.innerWidth

      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          // Travel is proportional to the track, so panel width changes never
          // desync the pin from the motion.
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Act 7: once the track has run out, the fifth frame keeps growing until
      // it is the whole screen — the statement is what is behind it. Driven off
      // the zoom spacer that follows this section, so it starts exactly where
      // the horizontal travel ends.
      const frame = el.querySelector('[data-how-frame]')
      const spacer = document.getElementById('how-zoom')
      if (frame && spacer) {
        gsap.fromTo(
          frame,
          { scale: 1, borderRadius: 18 },
          {
            scale: 2.6,
            borderRadius: 0,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: spacer,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        )
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="how" className="how" ref={root} aria-label="How it works">
      <div className="how-track" ref={track}>
        <div className="how-panel how-intro">
          <p className="eyebrow" >{process.eyebrow}</p>
          <h2 className="how-title">{process.title}</h2>
          <p className="how-lead">{process.body}</p>
        </div>

        {process.steps.map((s) => (
          <article className="how-panel how-step" key={s.n}>
            <span className="how-step-n">{s.n}</span>
            <h3 className="how-step-t">{s.t}</h3>
            <p className="how-step-d">{s.d}</p>
          </article>
        ))}

        {/* The fifth frame: the scattered field, and Act 7's zoom target. */}
        <div className="how-panel how-scatter">
          <div className="how-frame" data-how-frame>
            {TILES.map((t, i) => (
              <figure
                className="how-tile"
                key={i}
                style={{ left: t.x, top: t.y, '--w': t.w, '--float': `${8 + (i % 3) * 3}s` }}
              >
                <VideoBackdrop src={t.src} tone="dark" className="how-tile-bg" />
                <figcaption>{t.label}</figcaption>
              </figure>
            ))}
            <div className="how-scatter-center">
              <p className="eyebrow">Everywhere you operate</p>
              <h2 className="how-scatter-title">One partner,<br />every floor.</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
