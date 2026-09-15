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
  /* Every finale tween ever started, killed only when the component leaves.
     The phase effect must NOT kill them itself: its cleanup runs on every
     phase change, and `door` follows `travel` by 300ms — killing there froze
     the 1.2s transform a quarter of the way in, which is exactly "the logo is
     not getting smaller and the background is still the footage". A one-shot
     tween that has been allowed to start must be allowed to finish. */
  const running = useRef([])
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
    v.muted = true
    v.setAttribute('muted', '')
    v.currentTime = 0
    /* Same retry as FilmStage: a refused muted autoplay on a phone holds the
       poster and starts on the first gesture rather than leaving the finale
       black under the mark. */
    let off = () => {}
    if (!reduced) {
      v.play?.().catch(() => {
        const kick = () => { off(); v.play?.().catch(() => {}) }
        const evs = ['pointerdown', 'keydown', 'touchstart', 'wheel']
        evs.forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }))
        off = () => evs.forEach((e) => window.removeEventListener(e, kick))
      })
    }
    return () => off()
  }, [play, reduced])


  /* The ending, beat by beat, driven by the phase Hero passes down.

       horns   the footage has run out to its held frame; the mark fades up
               exactly on the animal's horns and holds there — a beat where
               the logo *is* the horns, before anything else moves
       fade    the picture and its scrim go to the dark ground underneath;
               the mark stays, now alone on black
       travel  the same mark — one element, never swapped — shrinks into the
               empty `.hero-end-slot` the end block has just mounted

     No cleanup on phase change at all — neither revert (which undid finished
     beats) nor kill (which froze in-flight ones when `door` arrived 300ms
     into the 1.2s transform). Tweens accumulate in `running` and are killed
     once, on unmount, where stopping mid-flight is what you want.

     `position: fixed` for the travel is safe because nothing between the mark
     and the viewport carries a transform or filter — the grade and camera
     filters live on the sibling `.origin-photo`, not on an ancestor. */
  useEffect(() => {
    if (reduced) return
    const mark = root.current?.querySelector('.origin-mark')
    if (!mark) return
    const tweens = running.current

    if (phase === 'horns') {
      tweens.push(gsap.to(mark, { opacity: 1, duration: 0.9, ease: 'power2.out' }))
    }

    if (phase === 'travel') {
      /* The whole transform in one breath — the picture to the dark ground,
         the mark to its place — rather than as consecutive beats. The held
         previous shot fades with it: it is the daylight head at full opacity
         underneath this one, and leaving it put a bright oryx where the dark
         ground should be. */
      const layers = [
        root.current.querySelector('.origin-photo'),
        root.current.querySelector('.origin-grade'),
        document.querySelector('.stage-scrim'),
        document.querySelector('.stage-clip.is-prev'),
      ].filter(Boolean)
      tweens.push(gsap.to(layers, { opacity: 0, duration: 1.2, ease: 'power2.inOut' }))

      const slot = document.querySelector('.hero-end-slot')
      if (slot) {
        const from = mark.getBoundingClientRect()
        const to = slot.getBoundingClientRect()
        gsap.set(mark, {
          position: 'fixed',
          left: from.left,
          top: from.top,
          width: from.width,
          height: from.height,
          margin: 0,
          zIndex: 6,
          opacity: 1,
          /* Every transform channel zeroed, and belt-and-braces on purpose.
             The stylesheet no longer puts any transform on the mark — it is
             centred with a calc — but GSAP keeps percentage translates in
             `xPercent`, a separate channel from `x`, and zeroing only `x`
             against a `translateX(-50%)` is exactly the bug that had the mark
             jumping left and landing left of its slot. If a transform ever
             returns to this element, all four channels are already handled. */
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
        })
        tweens.push(
          gsap.to(mark, {
            left: to.left,
            top: to.top,
            width: to.width,
            height: to.height,
            duration: 1.2,
            ease: 'power2.inOut',
          }),
        )
      }
    }

  }, [phase, reduced])

  /* Unmount only — skip and dismiss land here. */
  useEffect(() => () => running.current.forEach((t) => t.kill()), [])

  return (
    <div className="origin origin--sunset" ref={root} aria-hidden="true">
      <div className="origin-plate">
        <div className="origin-photo">
          <video ref={video} src={clip.src} poster={clip.poster} muted playsInline preload="auto" tabIndex={-1} />
          {/* Graded to the brand before anything is drawn on top. */}
          <span className="origin-grade" />
        </div>

        <span className="origin-mark" />
      </div>
    </div>
  )
}
