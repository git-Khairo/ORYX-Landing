/**
 * Background footage, in one place so any slot can be swapped without
 * touching scene code.
 *
 * These are Pexels CDN links used live. The Pexels licence covers
 * commercial use with no attribution required, and the CDN sends
 * permissive CORS and long cache headers, so this works today. What it
 * does not give you is a URL under your control. Before launch,
 * download each file into `public/film/` and change `src` to a local
 * path. `credit` is not legally required; it is here so every clip
 * stays traceable to its source.
 *
 * Every URL below was verified live with a range request:
 * HTTP 200/206, content-type video/mp4.
 */

export interface Clip {
  src: string;
  credit: string;
  /** What this clip is doing in the composition. */
  note: string;
}

export const CLIPS = {
  cityDistrict: {
    src: "https://videos.pexels.com/video-files/8783705/8783705-hd_1920_1080_30fps.mp4",
    credit: "https://www.pexels.com/video/drone-footage-of-modern-city-buildings-8783705/",
    note: "Modern city buildings from the air. The hero: business district, cool architecture, slow move.",
  },
  emptyOffice: {
    src: "https://videos.pexels.com/video-files/8347237/8347237-hd_1920_1080_25fps.mp4",
    credit: "https://www.pexels.com/video/an-empty-office-8347237/",
    note: "An empty office. The workplace before anyone arrives, which is the argument of scene 02.",
  },
  officeBuilding: {
    src: "https://videos.pexels.com/video-files/3197808/3197808-hd_1920_1080_25fps.mp4",
    credit: "https://www.pexels.com/video/a-clean-office-building-3197808/",
    note: "A clean commercial building. Structure and continuity: the facility world.",
  },
  towerLowAngle: {
    src: "https://videos.pexels.com/video-files/4565679/4565679-hd_1920_1080_25fps.mp4",
    credit: "https://www.pexels.com/video/a-low-angle-shot-of-buildings-4565679/",
    note: "Low angle on office towers. Scale and permanence, behind the Why ORYX system.",
  },
  cityAerial: {
    src: "https://videos.pexels.com/video-files/6429653/6429653-hd_1920_1080_24fps.mp4",
    credit: "https://www.pexels.com/video/aerial-video-of-city-high-rise-buildings-6429653/",
    note: "High rise city from above, wide and slow. Long term thinking, behind sustainability.",
  },
  warehouseInterior: {
    src: "https://videos.pexels.com/video-files/20591258/20591258-hd_1920_1080_60fps.mp4",
    credit: "https://www.pexels.com/video/inside-view-of-the-warehouse-20591258/",
    note: "Inside a working warehouse. Operational space, behind the partnership process.",
  },
  warehouseWork: {
    src: "https://videos.pexels.com/video-files/4281239/4281239-hd_1920_1080_25fps.mp4",
    credit: "https://www.pexels.com/video/working-men-warehouse-box-4281239/",
    note: "Boxes handled on a warehouse floor. The act of moving goods, not just vehicles.",
  },
  deliveryStreet: {
    src: "https://videos.pexels.com/video-files/36445751/15454170_2560_1440_25fps.mp4",
    credit: "https://www.pexels.com/video/urban-street-with-passing-delivery-vans-36445751/",
    note: "Urban street with passing delivery vans. Movement crossing the frame.",
  },
  corridorClean: {
    src: "https://videos.pexels.com/video-files/6390310/6390310-hd_1920_1080_25fps.mp4",
    credit: "https://www.pexels.com/video/person-sweeping-a-corridor-floor-6390310/",
    note: "A corridor floor being cleaned. Result over labour, shot at distance.",
  },
} as const satisfies Record<string, Clip>;

export type ClipName = keyof typeof CLIPS;

/**
 * Slot assignment. A slot is a place in the experience; a clip is the
 * footage in it. Keeping these separate means re-casting a scene is a
 * one word change, and a slot with no clip yet falls back to its
 * operational drawing rather than leaving a hole.
 *
 * Every slot is cast. Film runs the length of the experience, with
 * only Values left purely typographic so the eye gets one rest before
 * the closing.
 */
export const SLOTS = {
  hero: "cityDistrict",
  statement: "emptyOffice",
  technology: "officeBuilding",
  serviceTransportation: "deliveryStreet",
  serviceCleaning: "corridorClean",
  serviceFacility: "officeBuilding",
  why: "towerLowAngle",
  sustainability: "cityAerial",
  process: "warehouseInterior",
  contact: "warehouseWork",
} as const satisfies Record<string, ClipName | null>;

export type SlotName = keyof typeof SLOTS;

export function clipFor(slot: SlotName): Clip | null {
  const name = SLOTS[slot];
  return name ? CLIPS[name] : null;
}

/* ------------------------------------------------------------------ */
/* Stills                                                              */
/* ------------------------------------------------------------------ */

export interface Still {
  src: string;
  /** Describes the picture for anyone who cannot see it. */
  alt: string;
  credit: string;
}

const photo = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

const page = (id: number) => `https://www.pexels.com/photo/${id}/`;

/**
 * Photography inside the expanded service worlds.
 *
 * Same licence and same caveat as the film: Pexels, commercial use, no
 * attribution required, but download into `public/stills/` before
 * launch so the URLs are yours. Every id below was verified live,
 * HTTP 200, content-type image/jpeg.
 *
 * One per sub-scene, and deliberately not every sub-scene. The third
 * beat in each world is the one about systems and visibility, and that
 * beat keeps its operational drawing, so the worlds alternate between
 * photography and diagram rather than turning into a gallery.
 */
export const STILLS: Record<string, (Still | null)[]> = {
  transportation: [
    {
      src: photo(29786116),
      alt: "A delivery truck leaving a warehouse loading dock.",
      credit: page(29786116),
    },
    {
      src: photo(6170458),
      alt: "Parcels stacked and secured inside a delivery van.",
      credit: page(6170458),
    },
    null,
    {
      src: photo(6169660),
      alt: "A courier moving a loaded trolley of boxes.",
      credit: page(6169660),
    },
    {
      src: photo(33623771),
      alt: "Rows of white vans parked in a fleet yard, seen from above.",
      credit: page(33623771),
    },
  ],
  cleaning: [
    {
      src: photo(6794970),
      alt: "An open plan office with clear desks, empty and in order.",
      credit: page(6794970),
    },
    {
      src: photo(7511755),
      alt: "A quiet office corridor leading to a conference room.",
      credit: page(7511755),
    },
    null,
    {
      src: photo(7511754),
      alt: "A boardroom table with plants, clean and prepared.",
      credit: page(7511754),
    },
    {
      src: photo(5511098),
      alt: "The interior of a working office, tidy and in use.",
      credit: page(5511098),
    },
  ],
  facility: [
    {
      src: photo(13219418),
      alt: "A commercial building facade of glass windows.",
      credit: page(13219418),
    },
    {
      src: photo(36631701),
      alt: "A modern open office floor with workspace cubicles.",
      credit: page(36631701),
    },
    null,
    {
      src: photo(15389577),
      alt: "The exterior of an office building at night, still lit.",
      credit: page(15389577),
    },
    {
      src: photo(35188667),
      alt: "An office building illuminated after dark.",
      credit: page(35188667),
    },
  ],
};

export function stillFor(serviceId: string, index: number): Still | null {
  return STILLS[serviceId]?.[index] ?? null;
}
