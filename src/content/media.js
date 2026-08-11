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
  /* A still, not a clip — and deliberately so.
     There is no Arabian oryx footage in the free libraries. Pexels holds
     exactly two oryx videos (a scimitar oryx on grass and a backlit silhouette,
     both rejected) and Pixabay's single result is a gemsbok on savanna. What
     does exist is good Arabian oryx *photography* in actual desert. For a
     three-second act a still under a slow push reads as deliberate — a title
     card — where a wrong animal in the wrong landscape reads as a mistake. */
  oryx: {
    kind: 'image',
    src: 'https://images.pexels.com/photos/16573757/pexels-photo-16573757.jpeg?auto=compress&cs=tinysrgb&w=1920',
    credit: 'https://www.pexels.com/photo/antelope-on-sand-16573757/',
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
  renovation: [
    { src: shot(5691533), alt: 'Interior strip-out in progress' },
    { src: shot(2590716), alt: 'Fit-out underway on a commercial floor' },
    { src: shot(1804173), alt: 'Finished interior after refurbishment' },
  ],
}
