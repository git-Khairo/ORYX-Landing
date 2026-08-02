import { useEffect, useRef } from 'react'
import { useSectionReveal } from '../lib/useSectionReveal'
import VideoBackdrop from '../components/VideoBackdrop'
import { prefersReduced } from '../lib/useLenis'
import { film } from '../content/media'

/**
 * The floating moodboard — AI Studio's scattered parallax gallery, rebuilt as a
 * drift of ORYX service footage around a single line of type.
 *
 * The pager snaps each section to a full screen, so there is no scroll travel
 * to drive parallax with. Instead the tiles react to the pointer: each carries
 * a depth, and the whole field translates against the cursor by that depth —
 * near tiles move more, far tiles less — over a slow idle float. Self-contained,
 * GPU-only, and it simply holds still under reduced motion.
 */
const TILES = [
  { src: film.cleaning.src, label: 'Cleaning', depth: 26, x: '8%', y: '16%', w: '20vw', tone: 'dark' },
  { src: film.delivery.src, label: 'Delivery', depth: 44, x: '68%', y: '10%', w: '22vw', tone: 'dark' },
  { src: film.facility.src, label: 'Facility', depth: 18, x: '74%', y: '58%', w: '19vw', tone: 'dark' },
  { src: film.people.src, label: 'The people it is for', depth: 52, x: '4%', y: '60%', w: '21vw', tone: 'cinematic' },
  { src: film.platform.src, label: 'The platform', depth: 34, x: '26%', y: '2%', w: '15vw', tone: 'cinematic' },
  { src: film.office.src, label: 'Always ready', depth: 62, x: '44%', y: '66%', w: '17vw', tone: 'cinematic' },
]

export default function Gallery() {
  const ref = useSectionReveal()
  const field = useRef(null)

  useEffect(() => {
    if (prefersReduced) return
    const el = field.current
    if (!el) return
    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const onMove = (e) => {
      // -0.5 … 0.5 across the viewport.
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      const tiles = el.querySelectorAll('[data-depth]')
      tiles.forEach((tile) => {
        const d = Number(tile.dataset.depth) || 0
        tile.style.transform = `translate3d(${(-cx * d).toFixed(2)}px, ${(-cy * d).toFixed(2)}px, 0)`
      })
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="gallery" className="gallery" ref={ref} data-stops={1} aria-label="ORYX in the field">
      <div className="gallery-field" ref={field}>
        {TILES.map((t, i) => (
          <figure
            key={i}
            className="gallery-tile"
            data-depth={t.depth}
            style={{ left: t.x, top: t.y, '--w': t.w, '--float': `${8 + (i % 3) * 3}s` }}
          >
            <VideoBackdrop src={t.src} tone={t.tone} className="gallery-tile-bg" />
            <figcaption className="gallery-tile-cap">{t.label}</figcaption>
          </figure>
        ))}
      </div>

      <div className="gallery-center">
        <p className="eyebrow" data-reveal>Everywhere you operate</p>
        <h2 className="gallery-title" data-reveal>
          One partner,<br />every floor.
        </h2>
      </div>
    </section>
  )
}
