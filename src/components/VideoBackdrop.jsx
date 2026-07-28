import { useEffect, useRef, useState } from 'react'
import { prefersReduced } from '../lib/useLenis'

/**
 * A muted, looping film behind a section.
 *
 * Three things this has to get right, because there is a live WebGL scene
 * running the whole time:
 *  - Nothing loads until the section is near. Four background films all
 *    fetching on page load would starve the particle scene of bandwidth.
 *  - Only the visible film decodes. Off-screen videos are paused, not merely
 *    hidden — a hidden <video> still burns decode budget on most browsers.
 *  - Reduced motion gets a still frame, never a moving one.
 *
 * The film fades up from the section's own base tone, so a slow network shows a
 * calm surface rather than a black rectangle.
 */
export default function VideoBackdrop({
  src,
  poster,
  tone = 'cream',
  /** Which side the section's copy sits on — the scrim protects that side. */
  align = 'left',
  className = '',
}) {
  const wrap = useRef(null)
  const video = useRef(null)
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)

  // Mount the source only once the section is roughly a screen away.
  useEffect(() => {
    const el = wrap.current
    if (!el || !src) return
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNear(true),
      { rootMargin: '120% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Play only while on screen.
  useEffect(() => {
    const el = wrap.current
    if (!el || !near || prefersReduced) return
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = video.current
        if (!v) return
        if (entry.isIntersecting) v.play?.().catch(() => {})
        else v.pause?.()
      },
      { threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  return (
    <div
      ref={wrap}
      className={`video-backdrop tone-${tone} align-${align} ${ready ? 'is-ready' : ''} ${className}`}
    >
      {near && src && (
        <video
          ref={video}
          className="vb-media"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay={!prefersReduced}
          preload="metadata"
          tabIndex={-1}
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
        />
      )}
      {/* No tint layers. The footage plays in its own colour, exposed down so
          light text reads against it — every attempt at a coloured or cream
          overlay read as a stain over the picture. */}
      <div className="vb-grain" />
    </div>
  )
}
