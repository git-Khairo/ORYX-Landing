import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { film } from '../content/media'
import OryxOrigin from './OryxOrigin'

/** The wipe, as a function of progress.
 *
 * A panel whose leading edge is the mark's own chevron. The notch closes as the
 * panel lands (`n` falls to zero with `p`), so the shot finishes on a flat edge
 * instead of leaving a permanent V bitten out of the frame. */
const wipePath = (p, down) => {
  const n = 14 * (1 - p)
  const y = down ? 100 * p : 100 * (1 - p)
  return down
    ? `polygon(0% 0%, 100% 0%, 100% ${y}%, 50% ${y + n}%, 0% ${y}%)`
    : `polygon(0% ${y}%, 50% ${y + n}%, 100% ${y}%, 100% 100%, 0% 100%)`
}

/**
 * The film layer behind the hero.
 *
 * Two things make six clips read as one film rather than six slides.
 *
 * The cut: every shot arrives behind a chevron wipe taken off the mark — the
 * same V, six times, alternating up and down. A crossfade would have been
 * easier and would have said nothing; a wipe that is literally the logo makes
 * the brand the thing joining the shots together.
 *
 * The camera: every shot pushes in at the same rate and the push does not reset
 * on the cut. One camera moving continuously is what the eye reads as a single
 * take, even across a hard edit.
 *
 * Every clip is mounted at once and revealed by the wipe rather than swapping
 * one element's `src`. Swapping would stall for a beat on each cut while the
 * new file buffered — fatal here, because shots are under three seconds and the
 * stall would land exactly on the cut. Off-screen clips are paused so only one
 * is ever decoding.
 */
export default function FilmStage({ activeId, enter, cam, hold, reduced }) {
  const videos = useRef({})
  const wipe = useRef(null)
  const [ready, setReady] = useState({})

  /* The outgoing shot has to stay on screen for the length of the cut — a wipe
     needs something to wipe *over*.

     Derived during render, not in an effect, and this is the whole difference
     between a film and a slideshow. Held in state it was set one commit too
     late: on the render where `activeId` changed there was no previous shot
     yet, so the wipe below bailed out and the incoming shot painted at full
     size, unclipped — a hard cut. Only on the *next* commit did it collapse and
     wipe in, so every edit was a slide change followed by a redundant wipe.
     Computing it here means the outgoing shot is already in place on the very
     first render of the new one. */
  const seen = useRef(activeId)
  const prev = useRef(null)
  if (seen.current !== activeId) {
    prev.current = seen.current
    seen.current = activeId
  }
  const prevId = prev.current

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

  /* The wipe itself.
     GSAP tweens a plain number and the clip-path string is rebuilt from it each
     frame. Tweening `clip-path` directly is unreliable — browsers only
     interpolate two polygons that agree on point count and units, and any
     mismatch silently degrades to a hard cut. Driving one number and writing
     the string keeps the shape under our control. */
  /* `useLayoutEffect`, not `useEffect`: this has to close the incoming shot
     before the browser paints. A passive effect runs after paint, which shows
     the new shot at full frame for one frame and then snaps it shut — the exact
     flash the wipe exists to replace. */
  useLayoutEffect(() => {
    const el = wipe.current
    /* No previous shot means this is the opening frame, which has nothing to
       wipe over and should simply be there. */
    if (reduced || !el || !prevId || prevId === activeId) return
    /* A hard cut. Most edits in a film are instantaneous, and running the same
       decorated transition on every one of them is what makes a sequence read
       as slides no matter how the pictures move. The wipe is kept for the two
       edits that mark a change of act. */
    if (enter === 'cut') return

    const down = enter === 'down'
    el.style.clipPath = wipePath(0, down)

    const obj = { p: 0 }
    const tween = gsap.to(obj, {
      p: 1,
      duration: 0.9,
      ease: 'power3.inOut',
      onUpdate: () => {
        el.style.clipPath = wipePath(obj.p, down)
      },
      onComplete: () => {
        /* Hand the frame back. Leaving a 100%-open polygon behind would keep
           the element in a composited clipping layer for nothing. */
        el.style.clipPath = ''
      },
    })
    return () => tween.kill()
  }, [activeId, prevId, enter, reduced])

  return (
    <div className="stage" aria-hidden="true">
      {Object.entries(film).map(([id, clip]) => {
        const live = id === activeId
        const prev = id === prevId && !live
        return (
          <div
            key={id}
            className={`stage-clip ${live ? 'is-live' : ''} ${prev ? 'is-prev' : ''} ${
              ready[id] ? 'is-ready' : ''
            }`}
            /* The live shot carries its own camera move and runs it over its
               own hold. Every shot pushing in at the same rate is what made
               six clips read as a slideshow; a film changes setup on the cut,
               and it is the grade and the cut language that carry continuity,
               not identical motion. */
            data-cam={live ? cam : undefined}
            style={live ? { '--hold': `${hold}s` } : undefined}
            ref={live ? wipe : null}
          >
            {/* The origin shot is a composite, not a clip — the animal and the
                mark have to move independently for the horns to detach. */}
            {id === 'oryx' ? (
              <OryxOrigin play={live} reduced={reduced} />
            ) : clip.kind === 'image' && clip.src ? (
              <img src={clip.src} alt="" />
            ) : clip.src ? (
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
            ) : null}
          </div>
        )
      })}

      {/* One soft dark gradient weighted to the foot — enough for white type to
          clear 7:1, light enough that the picture is never dimmed as a whole.
          No colour cast: the footage keeps its own. */}
      <div className="stage-scrim" />
    </div>
  )
}
