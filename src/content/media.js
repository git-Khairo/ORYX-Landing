/**
 * Footage, in two sets.
 *
 * `film` is the opening sequence. `portal` is section two — deliberately
 * different clips of the same three services, so the page is not showing the
 * same six seconds twice.
 *
 * ⚠ Live Pexels CDN links. The licence covers commercial use with no
 * attribution and permits hotlinking, but before production these should be
 * downloaded into `public/film/`. Every URL verified in session: 200, video/mp4.
 */
/* Our own films, made for ORYX, in `public/film/`.

   Each is two files. The first is HEVC (H.265): small, and played by Safari
   and by Chrome and Edge wherever the hardware decodes it, which today is
   nearly everywhere. The second is H.264 at 720p, bigger but played by every
   browser there is; a browser that cannot play the first skips to it. The
   `type` strings carry the exact codec of each file, read from the files
   themselves, because a browser decides from that string alone whether to
   try a source, and a vague one makes Chrome give up on HEVC it could play.

   `src` is the H.264 file, for anything that reads a single address. The
   poster is the film's own first frame, so a phone that refuses to autoplay
   shows the right picture rather than black. */
const HEVC = 'video/mp4; codecs="hvc1.1.6.H120.90"'
const H264 = 'video/mp4; codecs="avc1.4D0020"'
const ours = (name) => ({
  src: `/film/${name}-h264.mp4`,
  poster: `/film/${name}.jpg`,
  sources: [
    { src: `/film/${name}.mp4`, type: HEVC },
    { src: `/film/${name}-h264.mp4`, type: H264 },
  ],
})

import { localize } from '../i18n/core.js'

export const film = localize('media.film', {
  /* ── The opening film ─────────────────────────────────────────────────
     Fifteen seconds, generated from two stills made for it: the oryx walking
     the dunes, and the same animal square to camera with the sun between its
     horns. It ends holding that frame, and the mark lands on the horns; the
     alignment lives on `.origin-mark` in hero.css. See `acts` in copy.js for
     how the copy is timed over it. */
  oryx: {
    ...ours('intro'),
    /* Where the horns converge on the last frame, as fractions of it.
       Documentation; the live numbers are on `.origin-mark` in hero.css. */
    horn: { x: 0.493, y: 0.486 },
  },

  facilities: {
    src: 'https://videos.pexels.com/video-files/8783705/8783705-hd_1920_1080_30fps.mp4',
    /* First frame, so the section paints before the file arrives — and on an
       iPhone that refuses muted autoplay, instead of a black band. */
    poster: 'https://images.pexels.com/videos/8783705/pictures/preview-0.jpeg',
    credit: 'https://www.pexels.com/video/drone-footage-of-modern-city-buildings-8783705/',
  },
  /* Transport opening: ORYX lorries and a van on a Dutch motorway at dawn,
     tracked from the roadside. */
  transport: ours('transport'),
  /* Workforce opening: a bricklayer and a carpenter at work on the scaffold
     while the supervisor in the white ORYX shirt checks his tablet. */
  workforce: ours('workforce'),
  /* Renovation opening: ORYX painters at the window frames on the scaffold,
     the van parked below. Made for ORYX. */
  renovation: ours('renovation'),


  /* Warm aerial at sunset. The previous closing clip was shot monochrome, which
     is why that act looked black — not a bug in the player. */
  outro: {
    src: 'https://videos.pexels.com/video-files/28542398/12414662_1280_720_30fps.mp4',
    /* First frame, so the section paints before the file arrives — and on an
       iPhone that refuses muted autoplay, instead of a black band. */
    poster: 'https://images.pexels.com/videos/28542398/pictures/preview-0.jpg',
    credit: 'https://www.pexels.com/video/sunset-28542398/',
  },
})

/**
 * The hero promo — one finished film, when there is one.
 *
 * `src` is null until the edited video exists, and that is the switch: with it
 * null the intro plays the five-shot composited sequence in `acts`, and the
 * moment a path is set here the whole intro becomes that one file followed by
 * the end card. Nothing else changes.
 *
 * To turn it on: put the export at `public/film/promo.mp4`, a first frame at
 * `public/film/promo-poster.jpg`, and fill both fields in.
 *
 * Requirements the player imposes, not preferences:
 *  - **Silent.** Autoplay is only permitted for muted video, and the site's own
 *    soundtrack is carrying the audio anyway. A promo with its own mix would
 *    play over `theme.mp3`, not instead of it.
 *  - **H.264 MP4**, 1920×1080. Not HEVC, which Chrome on Windows will not
 *    decode, and not a 4K master — this autoplays on first paint.
 *  - **A poster.** Without one the first frame is black until enough of the
 *    file has arrived, which on a slow connection is the whole opening beat.
 */
export const promo = localize('media.promo', {
  src: null,
  poster: null,
})

/** The closing frame under the footer — a different aerial from the outro act,
    so the last two things on the page are not the same shot twice. */
export const footerFilm = localize('media.footerFilm', {
  src: 'https://videos.pexels.com/video-files/8783386/8783386-hd_1920_1080_30fps.mp4',
  /* First frame, so the section paints before the file arrives — and on an
     iPhone that refuses muted autoplay, instead of a black band. */
  poster: 'https://images.pexels.com/videos/8783386/pexels-photo-8783386.jpeg?auto=compress&cs=tinysrgb&w=1600',
  credit: 'https://www.pexels.com/video/drone-footage-of-tall-buildings-in-the-city-8783386/',
})

/** Section two. Different footage, same three services. */
export const portal = localize('media.portal', {
  transport: {
    src: 'https://videos.pexels.com/video-files/6170613/6170613-hd_1920_1080_25fps.mp4',
    /* First frame, so the section paints before the file arrives — and on an
       iPhone that refuses muted autoplay, instead of a black band. */
    poster: 'https://images.pexels.com/videos/6170613/pexels-photo-6170613.jpeg?auto=compress&cs=tinysrgb&w=1600',
    credit: 'https://www.pexels.com/video/male-worker-loading-boxes-into-a-white-van-6170613/',
  },
  workforce: {
    src: 'https://videos.pexels.com/video-files/13422071/13422071-hd_1920_1080_30fps.mp4',
    /* First frame, so the section paints before the file arrives — and on an
       iPhone that refuses muted autoplay, instead of a black band. */
    poster: 'https://images.pexels.com/videos/13422071/pictures/preview-0.jpeg',
    credit: 'https://www.pexels.com/video/workers-cleaning-warehouse-13422071/',
  },
  /* From the same shoot as the opening clip, so the two cut together: an
     empty room being sprayed, daylight blown out through the one window.
     Verified: 200, video/mp4, H.264, 1920×1080 25fps, 4.4 MB. */
  renovation: {
    src: 'https://videos.pexels.com/video-files/6474085/6474085-hd_1920_1080_25fps.mp4',
    /* A poster, like the opening clip has. Without one the interlude sits
       blank until enough of the file has arrived, and it is a full-bleed band
       with a line of display type over it. */
    poster:
      'https://images.pexels.com/videos/6474085/pexels-photo-6474085.jpeg?auto=compress&cs=tinysrgb&w=1600',
    credit: 'https://www.pexels.com/video/man-painting-a-wall-6474085/',
  },
})

/**
 * Stills, three per service.
 *
 * The service pages were re-showing the same two clips the home page already
 * plays, so opening one felt like staying put. These are photographs nothing
 * else on the site uses — they break the run of text far better than another
 * paragraph and cost a fraction of a video to load.
 *
 * All nine verified live: HTTP 200, image/jpeg. Pexels licence, commercial use,
 * no attribution required. Width-capped at 1400 by the CDN.
 */
const shot = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`

/* A third clip per service, for the closing frame. The close was replaying the
   opening clip, so a page that had travelled through six sections ended on the
   shot it began with and felt like it had gone nowhere. */
export const closing = localize('media.closing', {
  transport: film.outro,
  workforce: film.facilities,
  renovation: footerFilm,
})

export const gallery = localize('media.gallery', {
  transport: [
    { src: shot(18395054), alt: 'Loading bay at a distribution centre' },
    { src: shot(19034547), alt: 'Pallets racked in a warehouse aisle' },
    { src: shot(1797428), alt: 'Freight containers stacked at a depot' },
  ],
  workforce: [
    { src: shot(3769711), alt: 'Service staff at work in a building' },
    { src: shot(4353622), alt: 'Uniformed team preparing equipment' },
    { src: shot(19038677), alt: 'Facility crew on shift' },
  ],
  /* [0] and [2] are the two halves of the before/after scrub, and they are now
     a genuine matched pair rather than two rooms that happened to look alike:
     the same floor, the same camera position, the same lens, the same doorway
     in the same place in the far wall. Only the finish state differs, which is
     the one thing the comparison is claiming.

     Local files, not stock. No free library has a matched pair — the format
     only exists behind Getty and iStock licences — so these were made to the
     brief. Swap them for photographs of a real ORYX floor as soon as one is
     shot; the scrub clips rather than resizes, so any pair framed alike will
     drop straight in.

     JPEG, not the source PNG: 5.1 MB of lossless photograph became 644 KB with
     nothing visible lost. The PNGs stay beside them as the masters. */
  renovation: [
    { src: '/renovation/before.jpg', alt: 'Illustration: a commercial floor stripped back before refurbishment, with bare concrete, services exposed overhead, walls back to substrate' },
    { src: shot(12526862), alt: 'A commercial floor part-cleared during works' },
    { src: '/renovation/after.jpg', alt: 'Illustration: the same floor completed, with oak flooring, suspended ceiling with linear lighting, desks in place' },
  ],
})
