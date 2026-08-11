import { useEffect, useRef, useState } from 'react'
import { film } from '../content/media'

/**
 * The film layer behind the hero.
 *
 * Every clip is mounted at once and crossfaded by opacity rather than swapping
 * one element's `src`. Swapping would stall for a beat on each cut while the
 * new file buffered — fatal here, because acts are under three seconds and the
 * stall would land exactly on the cut. Off-screen clips are paused so only one
 * is ever decoding.
 *
 * A clip with no source yet renders as ground colour, so the sequence keeps its
 * timing while footage is still being sourced.
 */
export default function FilmStage({ activeId, reduced }) {
  const videos = useRef({})
  const [ready, setReady] = useState({})

  useEffect(() => {
    Object.entries(videos.current).forEach(([id, node]) => {
      if (!node) return
      if (id === activeId) {
        node.currentTime = 0
        if (!reduced) node.play?.().catch(() => {})
      } else {
        node.pause?.()
      }
    })
  }, [activeId, reduced])

  return (
    <div className="stage" aria-hidden="true">
      {Object.entries(film).map(([id, clip]) => (
        <div
          key={id}
          className={`stage-clip ${id === activeId ? 'is-live' : ''} ${
            ready[id] ? 'is-ready' : ''
          }`}
        >
          {clip.kind === 'image' && clip.src && (
            /* A still gets a slow push so the act still breathes. The class
               drives the move; there is nothing to play or pause. */
            <img src={clip.src} alt="" />
          )}
          {clip.kind !== 'image' && clip.src && (
            <video
              ref={(node) => {
                videos.current[id] = node
              }}
              src={clip.src}
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
              onCanPlay={() => setReady((r) => (r[id] ? r : { ...r, [id]: true }))}
            />
          )}
        </div>
      ))}

      {/* One soft dark gradient weighted to the foot — enough for white type
          to clear 7:1, light enough that the picture is never dimmed as a
          whole. No colour cast: the footage keeps its own. */}
      <div className="stage-scrim" />
    </div>
  )
}
