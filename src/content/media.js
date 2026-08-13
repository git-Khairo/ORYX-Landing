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
  /* The origin shot, and the only frame on the site where the animal appears.
     A still rather than a clip, deliberately: the free libraries have no
     front-facing oryx footage, and this shot needs the head square to camera
     because the mark has to sit on it as the horns.

     The previous plate (16573757) was replaced — both animals faced away, the
     adult's head was cropped out of frame entirely, and there was nothing to
     align the mark to. This is a gemsbok, head to camera, real horns rising
     straight out of the top of frame with the same splay as the mark, on a
     dark background that takes the brand grade without a fight. Gemsbok is
     Oryx gazella and is the animal on the identity board itself. */
  oryx: {
    kind: 'image',
    /* Requested large: the shot is framed as a close-up on the head, so the
       plate is rendered about twice viewport width and a 1920 source would be
       upscaled and soft exactly where the mark meets the horns. */
    src: 'https://images.pexels.com/photos/37177683/pexels-photo-37177683.jpeg?auto=compress&cs=tinysrgb&w=2400',
    credit: 'https://www.pexels.com/photo/close-up-of-a-gemsbok-37177683/',
    /* Where the animal's horns converge, as a fraction of the plate. The
       overlay mark is positioned from these, so if the plate is ever swapped
       these three numbers are the only thing that needs re-measuring. */
    horn: { x: 0.62, y: 0.32, spread: 0.144 },
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
  renovation: {
    src: 'https://videos.pexels.com/video-files/6473935/6473935-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/a-man-polishing-the-ceiling-using-a-drywall-sander-6473935/',
  },
  /* Warm aerial at sunset. The previous closing clip was shot monochrome, which
     is why that act looked black — not a bug in the player. */
  outro: {
    src: 'https://videos.pexels.com/video-files/28542398/12414662_1280_720_30fps.mp4',
    credit: 'https://www.pexels.com/video/sunset-28542398/',
  },
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
  /* [0] and [2] are the two halves of the before/after scrub, so they are
     chosen as a pair rather than individually: both are empty interiors shot
     square-on, which is what lets the slider read as one space changing rather
     than two unrelated photographs meeting at a line.

     The previous [2] was a pair of orange tower cranes against a blue sky —
     wrong subject for "finished and handed back", and the only primary colour
     anywhere on the site. [1] was two unfinished tower blocks on a building
     plot, which is development, not refurbishment. */
  renovation: [
    { src: shot(5691533), alt: 'Stripped interior under dust sheets, before refurbishment' },
    { src: shot(12526862), alt: 'Commercial floor part-cleared during fit-out' },
    { src: shot(19837082), alt: 'Finished interior, daylit and handed back clean' },
  ],
}
