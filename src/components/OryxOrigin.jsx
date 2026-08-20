import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { film } from '../content/media'

/**
 * The shot the identity rests on: the mark arriving on the animal's horns.
 *
 * The footage does the photography now. It used to be a still plate with a sun
 * drawn over it in CSS, because there was no oryx footage to be had — the
 * generated clip has the head square to camera, the horns rising in a narrow V
 * and the sun genuinely rising into the gap between them, so the drawn sun and
 * the second `day` variant both went with it. What is left is the one thing
 * that cannot be filmed: the ORYX mark fading up exactly where the horns are.
 *
 * It fades up and stays. The whole point of the shot is the equivalence, and a
 * mark that immediately flies off to become a logo spends that idea in the same
 * second it makes it.
 *
 * The mark is painted from `mark.png` as a CSS mask, so it can be any colour —
 * here a warm sand that sits on the horns without hiding the sun behind them.
 *
 * Everything lives inside `.origin-plate`, a fixed box scaled to cover the
 * viewport, so the video and the mark scale as one object and stay in register
 * at every window size. Positioning the mark against the viewport instead would
 * let the two drift apart the moment the aspect ratio changed.
 */
export default function OryxOrigin({ play, phase, reduced }) {
  const root = useRef(null)
  const video = useRef(null)
  const clip = film.oryxSun

  /* Start the clip when the shot goes live, not when it mounts.
     `autoPlay` was the whole "only the last frame shows" bug: FilmStage mounts
     every clip up front, so this 3.6-second video began at page load, finished
     long before its act came round at ~6s, and sat parked on its final frame.
     FilmStage already resets and plays its own videos this way; this one is
     rendered here instead, so it needs the same treatment rather than
     inheriting it. */
  useEffect(() => {
    const v = video.current
    if (!v) return
    if (!play) {
      v.pause?.()
      return
    }
    v.currentTime = 0
    if (!reduced) v.play?.().catch(() => {})
  }, [play, reduced])

  useEffect(() => {
    if (!play) return

    /* Reduced motion gets the resolved frame. The composition carries the idea
       on its own; only the arrival is dropped. */
    if (reduced) {
      const ctx = gsap.context(() => gsap.set('.origin-mark', { opacity: 1 }), root)
      return () => ctx.revert()
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      /* Dim first, then hardening — the mark arrives as part of the animal
         rather than as a graphic laid over it. Up by the time the sun has
         cleared the horns. */
      tl.fromTo('.origin-mark', { opacity: 0 }, { opacity: 0.5, duration: 0.9, ease: 'power2.out' }, 0.4)
      tl.to('.origin-mark', { opacity: 1, duration: 0.8, ease: 'power2.inOut' }, 1.7)

    }, root)

  }, [play, reduced])

  /* The hand-off, and the reason there is only one mark on this page.
     The end block renders an empty `.hero-end-slot` rather than a second mark;
     this measures it, pins the mark that is already on the horns at its current
     viewport rect, and tweens it into that slot. One element travels, so the
     logo never blinks out and back — which is what makes it read as the same
     object arriving rather than a cut between two frames that both happen to
     have a logo in them.

     `position: fixed` is safe here specifically because nothing between this
     element and the viewport carries a transform, filter or `will-change`
     other than the mark's own — a transformed ancestor would make `fixed`
     resolve against *it* and throw the mark somewhere unintended. The grade
     and camera filters live on the sibling `.origin-photo`, not on any
     ancestor of the mark. */
  useEffect(() => {
    if (phase !== 'travel' || reduced) return
    const mark = root.current?.querySelector('.origin-mark')
    const slot = document.querySelector('.hero-end-slot')
    if (!mark || !slot) return

    const from = mark.getBoundingClientRect()
    const to = slot.getBoundingClientRect()

    const ctx = gsap.context(() => {
      gsap.set(mark, {
        position: 'fixed',
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
        margin: 0,
        zIndex: 6,
      })
      gsap.to(mark, {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        duration: 1.2,
        ease: 'power2.inOut',
      })
      /* The picture goes, the mark stays. */
      gsap.to(['.origin-photo', '.origin-grade'], {
        opacity: 0,
        duration: 1.1,
        ease: 'power2.inOut',
      })
    }, root)
    return () => ctx.revert()
  }, [phase, reduced])

  return (
    <div className="origin origin--sunset" ref={root} aria-hidden="true">
      <div className="origin-plate">
        <div className="origin-photo">
          <video ref={video} src={clip.src} muted playsInline preload="auto" tabIndex={-1} />
          {/* Graded to the brand before anything is drawn on top. */}
          <span className="origin-grade" />
        </div>

        <span className="origin-mark" />
      </div>
    </div>
  )
}
