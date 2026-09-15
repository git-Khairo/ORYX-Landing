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
  /* ── The opening film, a montage ──────────────────────────────────────
     Four clips from two generations, cut together with dissolves. About
     sixteen seconds to the end card: 3 + 3 + 4.06 + the finale's 6.1.

     01  744×496 · 30 fps · 5.03 s — a first/last-frame interpolation off a
         photograph. ⚠ PLACEHOLDER, MUST NOT SHIP: the photograph carries a
         "© Thomas Vijayan" credit and it is baked into the bottom-left of
         every frame. `scripts/check-claims.mjs` warns on every build for as
         long as this exact file is here. The site's own crop hides most of
         it, which makes it worse, not better. Replace with a clip made from
         a photograph ORYX holds the rights to.
     02  744×496 · 30 fps · 5.03 s — a first/last-frame interpolation off a
         photograph of an oryx beside a dune shrub, facing camera. Nearly
         static; the act runs the site's `closeIn` camera over it.
     03  848×480 · 16 fps · 4.06 s — the original generated push, mid-shot
         to the head, from the keyframe chain that also made 04.
     04  848×480 · 16 fps · 3.56 s — the original generated sunset: head
         square to camera, horns in a narrow V, the sun rising into the gap.

     Why 03 and 04 are the originals: the replacement finale came back
     SQUARE, and on a widescreen no crop of a square keeps both the horn tips
     and the face. It played for an afternoon contained by height with
     blurred sides, and was taken out on request. It is parked in `frames/`
     as `unused-*` — not under `public/`, so it does not ship.

     ⚠ Resolution. All three are below the 1080p a full-bleed hero wants;
     848×480 was already flagged as soft. The grade and the scrim carry a
     good deal of it. The real fix is regeneration at 720p+ (a 16:9 finale
     from the first/last-frame Space, wide keyframes) or an upscale pass. */
  /* Every intro clip carries a first-frame poster. iOS paints nothing for a
     video that has not started, and muted autoplay is refused there whenever
     Low Power Mode is on or Safari's auto-play setting says so — which left
     the whole film as black frames under the copy. With a poster the stage
     always shows the shot, and FilmStage retries `play()` on the first touch. */
  oryxWide: {
    src: '/film/01-wide.mp4',
    poster: '/film/01-wide.jpg',
    /* Where the animal stands on the first frame, as a fraction of the plate —
       it walks left to right across the shot. Documentation for the `stalk`
       camera; this act runs `cam: 'none'`. */
    subject: { x: 0.36, y: 0.52 },
  },
  oryxBush: {
    src: '/film/02-bush.mp4',
    poster: '/film/02-bush.jpg',
  },
  oryxPush: {
    src: '/film/03-push.mp4',
    poster: '/film/03-push.jpg',
  },
  /* Ends on the shot the whole identity rests on: the head square to camera,
     the horns rising in a narrow V, and the sun sitting exactly in the gap
     between them. The mark goes here. The clip holds its last frame; the
     mark lands after it has stopped — see the phase timers in Hero.jsx. */
  oryxSun: {
    src: '/film/04-sun.mp4',
    poster: '/film/04-sun.jpg',
    /* Where the horns converge in this clip, as fractions of the frame.
       Documentation — the live numbers are `--horn-x` / `--horn-y` /
       `--mark-w` on `.origin-mark` in hero.css. */
    horn: { x: 0.5, y: 0.30, spread: 0.15 },
  },

  facilities: {
    src: 'https://videos.pexels.com/video-files/8783705/8783705-hd_1920_1080_30fps.mp4',
    /* First frame, so the section paints before the file arrives — and on an
       iPhone that refuses muted autoplay, instead of a black band. */
    poster: 'https://images.pexels.com/videos/8783705/pictures/preview-0.jpeg',
    credit: 'https://www.pexels.com/video/drone-footage-of-modern-city-buildings-8783705/',
  },
  transport: {
    src: 'https://videos.pexels.com/video-files/32838797/13996854_1920_1080_30fps.mp4',
    /* First frame, so the section paints before the file arrives — and on an
       iPhone that refuses muted autoplay, instead of a black band. */
    poster: 'https://images.pexels.com/videos/32838797/copells-32838797.jpeg?auto=compress&cs=tinysrgb&w=1600',
    credit: 'https://www.pexels.com/video/efficient-warehouse-forklift-loading-outdoors-32838797/',
  },
  /* A uniformed team walking equipment toward a modern building — people being
     brought to a site, which is what this service sells. Replaces warehouse
     floor-scrubbing, which read as janitorial rather than as staffing. */
  workforce: {
    src: 'https://videos.pexels.com/video-files/6195153/6195153-hd_1920_1080_25fps.mp4',
    /* First frame, so the section paints before the file arrives — and on an
       iPhone that refuses muted autoplay, instead of a black band. */
    poster: 'https://images.pexels.com/videos/6195153/pexels-photo-6195153.jpeg?auto=compress&cs=tinysrgb&w=1600',
    credit: 'https://www.pexels.com/video/cleaners-carrying-working-tools-6195153/',
  },
  /* A room mid-renovation in an existing building: plaster, dust sheets, a
     sprayer, daylight from one window.

     This replaced a time-lapse of a concrete frame going up. Two things were
     wrong with that. It was NEW CONSTRUCTION, and the source document for this
     page is entirely about existing property — its differentiator is
     "conserve what has value, repair what is necessary, replace only as a last
     resort", which a building rising from nothing directly contradicts. And it
     was 64 MB, the heaviest thing on the site by a wide margin, because 1080p60
     was the only rendition offered.

     Verified before use, which is the rule here after three clips turned out
     not to be what their titles said: poster frame read as an image, HTTP 200,
     video/mp4, H.264 (avc1), 1920×1080 25fps, 5.8 MB. Two earlier candidates
     were rejected on the same check — a "time-lapse of two men plastering a
     house facade" is a brick shell going up on bamboo scaffolding in saturated
     pink and cobalt, and a "man painting facade on ladder" is unprotected
     ladder work, which is the wrong message for a page whose catalogue marks
     access at height as a project-basis condition. */
  renovation: {
    src: 'https://videos.pexels.com/video-files/6473920/6473920-hd_1920_1080_25fps.mp4',
    /* First frame as a still, so the section paints the moment it opens. */
    poster:
      'https://images.pexels.com/videos/6473920/pexels-photo-6473920.jpeg?auto=compress&cs=tinysrgb&w=1600',
    credit: 'https://www.pexels.com/video/a-footage-of-a-room-under-renovation-6473920/',
  },


  /* Warm aerial at sunset. The previous closing clip was shot monochrome, which
     is why that act looked black — not a bug in the player. */
  outro: {
    src: 'https://videos.pexels.com/video-files/28542398/12414662_1280_720_30fps.mp4',
    /* First frame, so the section paints before the file arrives — and on an
       iPhone that refuses muted autoplay, instead of a black band. */
    poster: 'https://images.pexels.com/videos/28542398/pictures/preview-0.jpg',
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
  /* First frame, so the section paints before the file arrives — and on an
     iPhone that refuses muted autoplay, instead of a black band. */
  poster: 'https://images.pexels.com/videos/8783386/pexels-photo-8783386.jpeg?auto=compress&cs=tinysrgb&w=1600',
  credit: 'https://www.pexels.com/video/drone-footage-of-tall-buildings-in-the-city-8783386/',
}

/** Section two. Different footage, same three services. */
export const portal = {
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
    { src: '/renovation/before.jpg', alt: 'Illustration: a commercial floor stripped back before refurbishment — bare concrete, services exposed overhead, walls back to substrate' },
    { src: shot(12526862), alt: 'A commercial floor part-cleared during works' },
    { src: '/renovation/after.jpg', alt: 'Illustration: the same floor completed — oak flooring, suspended ceiling with linear lighting, desks in place' },
  ],
}
