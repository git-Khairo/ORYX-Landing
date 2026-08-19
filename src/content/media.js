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
export const film = {
  /* ── The opening film, generated ─────────────────────────────────────
     Three clips that chain: each one ends on the frame the next begins with,
     because they were made as first/last-frame interpolations off a single
     chain of keyframes. That is what lets them cut together without a
     dissolve — the edit lands on an identical frame.

     Note the order is not the filename order they arrived in. Read by content:
     the wide push came first, the mid-to-head push third, and the sunset
     second. Renamed on the way in so the sequence is legible on disk.

     ⚠ 848×480. That is the Wan "Fast" output, and full-bleed on a 1440p screen
     it is roughly a 3× upscale — soft, and visibly so on the wide shot where
     the dune edges are. The grade and the scrim hide a good deal of it, but
     this wants regenerating at a higher resolution, or upscaling, before
     launch. Everything else about them is right. */
  oryxWide: {
    src: '/film/01-wide.mp4',
    /* Where the animal stands, as a fraction of the plate — the push targets
       this point. */
    subject: { x: 0.34, y: 0.62 },
  },
  oryxPush: {
    src: '/film/02-push.mp4',
  },
  /* Ends on the shot the whole identity rests on: the head square to camera,
     the horns rising in a narrow V, and the sun sitting exactly in the gap
     between them. The mark goes here. */
  oryxSun: {
    src: '/film/03-sun.mp4',
    /* Where the horns converge in this clip, as fractions of the frame. The
       mark overlay is positioned from these two numbers and nothing else. */
    horn: { x: 0.5, y: 0.30, spread: 0.15 },
  },

  facilities: {
    src: 'https://videos.pexels.com/video-files/8783705/8783705-hd_1920_1080_30fps.mp4',
    credit: 'https://www.pexels.com/video/drone-footage-of-modern-city-buildings-8783705/',
  },
  transport: {
    src: 'https://videos.pexels.com/video-files/32838797/13996854_1920_1080_30fps.mp4',
    credit: 'https://www.pexels.com/video/efficient-warehouse-forklift-loading-outdoors-32838797/',
  },
  /* A uniformed team walking equipment toward a modern building — people being
     brought to a site, which is what this service sells. Replaces warehouse
     floor-scrubbing, which read as janitorial rather than as staffing. */
  workforce: {
    src: 'https://videos.pexels.com/video-files/6195153/6195153-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/cleaners-carrying-working-tools-6195153/',
  },
  /* A building going up, sped up — a genuine time-lapse of a concrete frame
     rising, scaffolded, with a tower crane behind it.

     Chosen on two constraints beyond the subject. No writing anywhere in
     frame: every other free construction time-lapse is a Hong Kong or
     Singapore shoot with Chinese signage on the hoardings, and 6164052 — the
     one that best matched otherwise — carries a banner across the building.
     And no saturated primary: the tilt-shift family (5513059, 5513062,
     8598730, 8598739, 9425993) is all cobalt netting and orange barriers,
     which is four colours this palette does not have. This one is concrete,
     haze and grey sky, which is the Renovation page's own range.

     ⚠ 64 MB — the only rendition Pexels offers for it is 1080p60. Fine while
     it is a placeholder; re-encode to ~1080p30 when these move into
     `public/film/`, or it is the heaviest thing on the site by a wide margin. */
  renovation: {
    src: 'https://videos.pexels.com/video-files/29794133/12800975_1920_1080_60fps.mp4',
    /* First frame as a still, so the section paints the moment it opens rather
       than sitting black while 64 MB starts arriving. */
    poster:
      'https://images.pexels.com/videos/29794133/architecture-building-building-construction-construction-work-29794133.jpeg?auto=compress&cs=tinysrgb&w=1600',
    credit: 'https://www.pexels.com/video/urban-building-construction-progress-timelapse-29794133/',
  },


  /* Warm aerial at sunset. The previous closing clip was shot monochrome, which
     is why that act looked black — not a bug in the player. */
  outro: {
    src: 'https://videos.pexels.com/video-files/28542398/12414662_1280_720_30fps.mp4',
    credit: 'https://www.pexels.com/video/sunset-28542398/',
  },
}

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
export const promo = {
  src: null,
  poster: null,
}

/** The closing frame under the footer — a different aerial from the outro act,
    so the last two things on the page are not the same shot twice. */
export const footerFilm = {
  src: 'https://videos.pexels.com/video-files/8783386/8783386-hd_1920_1080_30fps.mp4',
  credit: 'https://www.pexels.com/video/drone-footage-of-tall-buildings-in-the-city-8783386/',
}

/** Section two. Different footage, same three services. */
export const portal = {
  transport: {
    src: 'https://videos.pexels.com/video-files/6170613/6170613-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/male-worker-loading-boxes-into-a-white-van-6170613/',
  },
  workforce: {
    src: 'https://videos.pexels.com/video-files/13422071/13422071-hd_1920_1080_30fps.mp4',
    credit: 'https://www.pexels.com/video/workers-cleaning-warehouse-13422071/',
  },
  renovation: {
    src: 'https://videos.pexels.com/video-files/8488112/8488112-hd_1920_1080_30fps.mp4',
    credit: 'https://www.pexels.com/video/handyman-hammering-the-nail-on-wooden-flooring-8488112/',
  },
}

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
export const closing = {
  transport: film.outro,
  workforce: film.facilities,
  renovation: footerFilm,
}

export const gallery = {
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
    { src: '/renovation/before.jpg', alt: 'Commercial floor stripped back before refurbishment: bare concrete, services exposed overhead, walls back to substrate' },
    { src: shot(12526862), alt: 'Commercial floor part-cleared during fit-out' },
    { src: '/renovation/after.jpg', alt: 'The same floor completed: oak flooring, suspended ceiling with linear lighting, desks in place' },
  ],
}
