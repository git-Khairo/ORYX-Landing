/**
 * Background footage, in one place so it can be swapped without touching
 * section code.
 *
 * ⚠ These are Pexels CDN links, used live. That is fine for development and it
 * works today — the CDN sends `Access-Control-Allow-Origin: *` and long cache
 * headers — but the Pexels licence grants the right to USE the footage, it says
 * nothing about serving it from their CDN. Before this goes to production,
 * download each file into `public/film/` and change these to local paths. The
 * licence (commercial use, no attribution required) covers you either way; what
 * you gain is a URL that cannot disappear under you.
 *
 * Every URL below was verified live: HTTP 200, content-type video/mp4.
 * `credit` is not legally required — it is here so the source stays traceable.
 */
export const film = {
  // The opening frame. A slow drone move over a modern city — the scale the
  // brand operates at, and calm enough to sit under a wordmark.
  hero: {
    src: 'https://videos.pexels.com/video-files/9982002/9982002-hd_1920_1080_30fps.mp4',
    credit: 'https://www.pexels.com/video/drone-view-of-modern-city-9982002/',
  },
  cleaning: {
    src: 'https://videos.pexels.com/video-files/6390310/6390310-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/person-sweeping-a-corridor-floor-6390310/',
  },
  // A courier wheeling a trolley of boxes into a white van. The previous clip
  // was vans passing on a street — transportation, not distribution. This one
  // shows the actual act of moving goods, which is what the service is.
  // Alternate if a subject-free plate is ever wanted:
  //   .../10472351/10472351-hd_1920_1080_25fps.mp4 (parcels on a sorting lane)
  delivery: {
    src: 'https://videos.pexels.com/video-files/6170613/6170613-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/male-worker-loading-boxes-into-a-white-van-6170613/',
  },
  facility: {
    src: 'https://videos.pexels.com/video-files/3197808/3197808-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/a-clean-office-building-3197808/',
  },
  aerial: {
    src: 'https://videos.pexels.com/video-files/8783705/8783705-hd_1920_1080_30fps.mp4',
    credit: 'https://www.pexels.com/video/drone-footage-of-modern-city-buildings-8783705/',
  },
  office: {
    src: 'https://videos.pexels.com/video-files/8347237/8347237-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/an-empty-office-8347237/',
  },
  // Colleagues at work — the people the service is actually for.
  people: {
    src: 'https://videos.pexels.com/video-files/7147624/7147624-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/colleagues-talking-at-office-7147624/',
  },
  // A handheld scanner reading parcels — kept as an alternate.
  scanning: {
    src: 'https://videos.pexels.com/video-files/10472349/10472349-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/woman-scanning-parcels-10472349/',
  },
  // Charts and figures being read on a tablet. The technology claim is about a
  // digital experience handling every request, schedule and follow-up — so the
  // footage is a screen with data on it, not a warehouse conveyor.
  platform: {
    src: 'https://videos.pexels.com/video-files/36455152/15458588_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/tablet-analysis-of-financial-data-36455152/',
  },
  // Parcels moving down a sorting lane — continuous, no focal subject, so it
  // survives heavy grading behind text. The process, literally.
  flow: {
    src: 'https://videos.pexels.com/video-files/10472351/10472351-hd_1920_1080_25fps.mp4',
    credit: 'https://www.pexels.com/video/close-up-on-parcels-on-sorting-lane-10472351/',
  },
  city: {
    src: 'https://videos.pexels.com/video-files/4471968/4471968-hd_1280_720_30fps.mp4',
    credit: 'https://www.pexels.com/video/drone-footage-on-high-buildings-4471968/',
  },
  skyline: {
    src: 'https://videos.pexels.com/video-files/8783386/8783386-hd_1920_1080_30fps.mp4',
    credit: 'https://www.pexels.com/video/drone-footage-of-tall-buildings-in-the-city-8783386/',
  },
}
