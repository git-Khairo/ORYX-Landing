/**
 * Photography for the service worlds.
 *
 * The film is gone. Nine background clips were the single loudest
 * complaint in the review, and a stage that renders the mark in real
 * time does not need footage behind it as well. What survives is one
 * photograph per service, because a purely generated site reads as a
 * concept rather than a company, and the buyer is a facility manager
 * who has been let down by vendors before. One real picture of real
 * work is the cheapest proof that ORYX operates in the world.
 *
 * Pexels CDN links used live. The licence covers commercial use with
 * no attribution required, but the URLs are not under our control.
 * Before launch, download them into `public/stills/` and switch `src`
 * to local paths. `credit` is not legally required; it keeps every
 * image traceable to its source.
 *
 * Every id was verified live: HTTP 200, content-type image/jpeg.
 */

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
 * Deliberately not every beat. The third one in each world carries no
 * photograph, so a world alternates between picture and plain type
 * rather than turning into a gallery. Only the first three are read
 * now that the worlds are three beats long; the rest are kept because
 * they cost nothing and the sequence may lengthen again.
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
