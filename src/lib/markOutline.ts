/**
 * The ORYX mark as pure geometry. No dependencies, deliberately.
 *
 * This module exists because of a bundling mistake worth remembering:
 * the no-WebGL poster drew the mark by importing the Three version of
 * this maths, which meant every visitor who could not run WebGL
 * downloaded the entire renderer in order to look at a static SVG. The
 * fallback was more expensive than the thing it was falling back from.
 *
 * So the outline lives here as plain numbers. `three/markShape.ts`
 * turns it into extruded geometry, and the poster turns the same
 * numbers into SVG paths, and neither one knows about the other.
 *
 * The mark is reconstructed rather than traced. The client supplied a
 * PNG and no vector, and rebuilding it from the curves it is made of
 * gives us three things a trace cannot: every blade is its own closed
 * shape so they can animate independently, taper and slice angle are
 * parameters we can tune against the artwork, and the long straight
 * edges stay exact at any scale.
 *
 * Coordinates: y up, origin at the point of the V.
 */

export type Point = readonly [number, number];

export interface OutlineMeta {
  /** -1 for the left horn, 1 for the right, 0 for the jaw. */
  side: -1 | 0 | 1;
  /** Position along the horn, 0 at the base and 1 at the tip. */
  along: number;
  /** Assembly order, base outward. */
  order: number;
}

export interface Outline {
  points: Point[];
  meta: OutlineMeta;
}

const BLADES_PER_HORN = 4;
/** Gap between blades, in curve parameter. */
const CUT = 0.035;
/** How far the cut leans. 0 is square across, higher is more raked. */
const CUT_RAKE = 0.55;

/**
 * Centreline of a horn, from the V to the tip.
 *
 * Proportions taken off the supplied artwork rather than invented.
 * In that image the mark is about 300 wide by 460 tall, the horn tips
 * sit near x=45 and x=250 at y=25, and the two horns converge at
 * about (150, 330). So measured from the V with y up:
 *
 *   tip offset / horn height  =  100 / 305  =  0.33
 *
 * The first attempt used 0.53, which is why it read as a wishbone or
 * a crescent instead of a pair of horns. They are steep and narrow,
 * splaying only in the last third.
 *
 * The control point sits high, not wide. That keeps the lower half
 * climbing almost vertically out of the V and puts what little bow
 * there is where the artwork actually has it, near the top.
 */
function hornPoint(t: number, side: number): [number, number] {
  const p0x = 5 * side;
  const p0y = -4;
  const p1x = 26 * side;
  const p1y = 96;
  const p2x = 72 * side;
  const p2y = 208;

  const u = 1 - t;
  return [
    u * u * p0x + 2 * u * t * p1x + t * t * p2x,
    u * u * p0y + 2 * u * t * p1y + t * t * p2y,
  ];
}

/**
 * Half-width along the horn.
 *
 * Not a linear taper. The blade swells just above the base and runs
 * out to a true point, which is what stops it reading as a flat
 * cut-out and what lets a rim light travel along the edge.
 */
function hornHalfWidth(t: number) {
  /* Also measured, not guessed. The horn is roughly 22 wide at its
     widest in a 305 tall mark, so the half-width peaks near 7.5 in
     these units. The previous values peaked around 17, which is why
     the blades read as fat slabs rather than blades. */
  const swell = Math.sin(Math.PI * Math.min(1, t * 1.3)) * 0.55 + 0.45;
  const taper = Math.pow(1 - t, 0.7);
  return 0.7 + 9.2 * swell * taper;
}

/**
 * Walks one side of a centreline and returns down the other, offset by
 * the half-width along the normal. The end caps are skewed so
 * consecutive blades meet on a diagonal, which is the detail that
 * makes the mark read as sliced rather than merely dashed.
 */
function ribbon(t0: number, t1: number, side: number, steps = 14): Point[] {
  const left: Point[] = [];
  const right: Point[] = [];

  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const t = t0 + (t1 - t0) * s;

    const [ax, ay] = hornPoint(t, side);
    const [bx, by] = hornPoint(Math.min(1, t + 0.004), side);
    const tx = bx - ax;
    const ty = by - ay;
    const len = Math.hypot(tx, ty) || 1;

    const nx = -ty / len;
    const ny = tx / len;
    const hw = hornHalfWidth(t);
    const lean = (s === 0 ? -CUT_RAKE : s === 1 ? CUT_RAKE : 0) * hw;

    left.push([ax + nx * hw + (tx / len) * lean, ay + ny * hw + (ty / len) * lean]);
    right.push([ax - nx * hw + (tx / len) * lean, ay - ny * hw + (ty / len) * lean]);
  }

  return [...left, ...right.reverse()];
}

/** The hooked jaw below the V. Its corners are hard, not swept. */
function jaw(): Point[] {
  /* In the artwork the jaw drops about 85 below the V against a horn
     height of 305, so roughly 0.28 of the mark. The first version ran
     to 0.51 and made the whole thing bottom heavy. */
  const spine: Point[] = [
    [3, -4],
    [-3, -30],
    [-7, -50],
    [-32, -58],
  ];
  const hw = 5.4;
  const left: Point[] = [];
  const right: Point[] = [];

  for (let i = 0; i < spine.length; i++) {
    const prev = spine[Math.max(0, i - 1)];
    const next = spine[Math.min(spine.length - 1, i + 1)];
    const tx = next[0] - prev[0];
    const ty = next[1] - prev[1];
    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;
    left.push([spine[i][0] + nx * hw, spine[i][1] + ny * hw]);
    right.push([spine[i][0] - nx * hw, spine[i][1] - ny * hw]);
  }

  return [...left, ...right.reverse()];
}

/**
 * Every piece of the mark, in assembly order.
 *
 * Ordered base to tip and alternating sides, so a stagger over this
 * array reads as the mark growing out of its own root rather than as
 * a list animating.
 */
export function buildMarkOutlines(): Outline[] {
  const out: Outline[] = [
    { points: jaw(), meta: { side: 0, along: 0, order: 0 } },
  ];

  const span = 1 / BLADES_PER_HORN;
  for (let i = 0; i < BLADES_PER_HORN; i++) {
    const t0 = i * span + (i === 0 ? 0 : CUT * 0.5);
    const t1 = (i + 1) * span - (i === BLADES_PER_HORN - 1 ? 0 : CUT * 0.5);
    const along = (i + 0.5) / BLADES_PER_HORN;

    for (const side of [1, -1] as const) {
      out.push({
        points: ribbon(t0, t1, side),
        meta: { side, along, order: i * 2 + (side === 1 ? 1 : 2) },
      });
    }
  }

  return out;
}

/** The same outlines as SVG path data. Note the y flip: maths is y up, SVG is y down. */
export function markToSvgPaths(): string[] {
  return buildMarkOutlines().map(({ points }) =>
    points.length === 0
      ? ""
      : `${points
          .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${(-y).toFixed(2)}`)
          .join(" ")} Z`,
  );
}

/** Bounding box of the mark in its own units, for the SVG viewBox. */
export const MARK_VIEWBOX = "-95 -215 190 285";
