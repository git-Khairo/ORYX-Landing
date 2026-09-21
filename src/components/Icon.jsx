/**
 * One icon set, drawn for this site.
 *
 * No icon library and no emoji. Every glyph is a few strokes on a 24 unit
 * grid at one weight, with square ends and mitred corners, because nothing
 * else in the brand is rounded. They take `currentColor`, so the same icon
 * sits on the dark pages and on Renovation's light sheet without a variant.
 *
 * `d` is one or more path strings. `c` is circles as [cx, cy, r]. `r` is
 * rectangles as [x, y, w, h, rx]. `f` is small filled dots as [cx, cy, r].
 */
const ICONS = {
  /* ── Interface ─────────────────────────────────────────────────────── */
  arrow: { d: ['M4 12H20', 'M14 6l6 6-6 6'] },
  back: { d: ['M20 12H4', 'M10 6l-6 6 6 6'] },
  close: { d: ['M5 5l14 14', 'M19 5L5 19'] },
  download: { d: ['M12 3v12', 'M7 10l5 5 5-5', 'M4 20h16'] },
  check: { d: ['M4 12.5l5 5L20 6.5'] },
  search: { c: [[10.5, 10.5, 6.5]], d: ['M15.5 15.5L21 21'] },
  user: { c: [[12, 8, 4]], d: ['M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7'] },
  mail: { r: [[3, 5, 18, 14, 0]], d: ['M3 6l9 7 9-7'] },
  building: { d: ['M4 21V5h10v16', 'M14 10h6v11', 'M2 21h20', 'M7 9h4', 'M7 13h4', 'M7 17h4'] },
  phone: { d: ['M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z'] },
  note: { d: ['M5 3h10l4 4v14H5z', 'M15 3v4h4', 'M8 12h8', 'M8 16h6'] },
  layers: { d: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5'] },
  list: { d: ['M8 6h12', 'M8 12h12', 'M8 18h12'], f: [[4, 6, 1], [4, 12, 1], [4, 18, 1]] },
  clock: { c: [[12, 12, 9]], d: ['M12 7v5l3.5 2'] },
  calendar: { d: ['M4 6h16v15H4z', 'M4 10h16', 'M8 3v5', 'M16 3v5'] },
  people: { c: [[8, 8, 3], [17, 9, 2.3]], d: ['M2.5 20c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6', 'M15 14.2c.6-.2 1.3-.2 2-.2 2.6 0 4.5 2 4.5 5'] },
  userCheck: { c: [[10, 8, 4]], d: ['M2 21c0-4.4 3.6-7 8-7 1.3 0 2.5.2 3.6.7', 'M15 18l2.5 2.5L22 16'] },
  bolt: { d: ['M13 2L5 13.5h6L10 22l8-11.5h-6z'] },

  /* ── Social ────────────────────────────────────────────────────────── */
  instagram: { r: [[3.5, 3.5, 17, 17, 4.5]], c: [[12, 12, 4]], f: [[17.2, 6.8, 0.9]] },
  linkedin: { r: [[3.5, 3.5, 17, 17, 2]], d: ['M8 10.5v6', 'M12 16.5v-6', 'M12 13a2.2 2.2 0 0 1 4.4 0v3.5'], f: [[8, 7.6, 0.9]] },
  facebook: { d: ['M14 21v-8h3l.5-3.5H14V7.5c0-1 .5-1.7 1.8-1.7h1.7V3a14 14 0 0 0-2.3-.2c-2.4 0-4.2 1.5-4.2 4.2v2.5H8V13h3v8'] },

  /* ── Transport services ────────────────────────────────────────────── */
  truck: { d: ['M2 7h11v9H2z', 'M13 10h5l3 3v3h-8z'], c: [[6.5, 17.5, 1.8], [17, 17.5, 1.8]] },
  swap: { d: ['M4 7h13', 'M14 4l3 3-3 3', 'M20 17H7', 'M10 14l-3 3 3 3'] },
  box: { d: ['M3 8l9-5 9 5v8l-9 5-9-5z', 'M3 8l9 5 9-5', 'M12 13v8'] },
  globe: { c: [[12, 12, 9]], d: ['M3 12h18', 'M12 3c3 3 3 15 0 18', 'M12 3c-3 3-3 15 0 18'] },

  /* ── Workforce sectors ─────────────────────────────────────────────── */
  cleaning: { d: ['M9 9h6l1 12H8z', 'M10 9V6h4v3', 'M14 6h4', 'M18 4v4'], f: [[20.5, 3.5, 0.7], [20.5, 6, 0.7], [20.5, 8.5, 0.7]] },
  transport: { d: ['M2 7h11v9H2z', 'M13 10h5l3 3v3h-8z'], c: [[6.5, 17.5, 1.8], [17, 17.5, 1.8]] },
  property: { d: ['M2 17h20v2H2z', 'M5 17a7 7 0 0 1 14 0', 'M10 10.3V6h4v4.3'] },
  technical: { d: ['M14.5 5.5a4 4 0 0 0-5 5L3 17l4 4 6.5-6.5a4 4 0 0 0 5-5l-2.8 2.8-2.4-.6-.6-2.4z'] },
  manufacturing: { d: ['M3 21V10l6 4v-4l6 4V5h5v16z', 'M7 17h2', 'M12 17h2'] },
  infrastructure: { d: ['M7 3L3 21', 'M17 3l4 18', 'M12 4v3', 'M12 10.5v3', 'M12 17v3'] },
  traffic: { d: ['M10 4h4l4 14H6z', 'M8.3 10h7.4', 'M7.2 14h9.6', 'M3 20h18'] },
  agriculture: { d: ['M12 21v-9', 'M12 12c0-4 3-7 8-7 0 5-3 8-8 7z', 'M12 15c0-3-2.5-5.5-7-5.5 0 4 2.5 6.5 7 5.5z'] },
  waste: { d: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 14h10l1-14', 'M10 11v6', 'M14 11v6'] },
  healthcare: { d: ['M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z', 'M12 10.5v5', 'M9.5 13h5'] },
  maritime: { c: [[12, 5.5, 2]], d: ['M12 7.5V21', 'M8 11h8', 'M4 14a8 8 0 0 0 16 0'] },
  retail: { d: ['M5 8h14l-1 13H6z', 'M9 8V6a3 3 0 0 1 6 0v2'] },

  /* ── Renovation services ───────────────────────────────────────────── */
  'property-check': { d: ['M8 4h8v3H8z', 'M8 5.5H5V21h14V5.5h-3', 'M8.5 14l2.5 2.5 4.5-5'] },
  'responsive-void': { c: [[8, 15, 4]], d: ['M11 12l9-9', 'M16 7l3 3', 'M13.5 9.5l2 2'] },
  'planned-major': { d: ['M3 11l9-7 9 7', 'M5 9.5V20h14V9.5', 'M9 20v-6h6v6'] },
  interiors: { d: ['M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z', 'M6 12V6a2 2 0 0 1 4 0', 'M7 19l-1 2', 'M17 19l1 2'] },
  'renovation-energy': { d: ['M13 2L5 13.5h6L10 22l8-11.5h-6z'] },
  conversion: { d: ['M3 4h8v8H3z', 'M13 12h8v8h-8z', 'M14 7h5', 'M17 4.5L19.5 7 17 9.5', 'M10 17H5', 'M7 14.5L4.5 17 7 19.5'] },
  heritage: { d: ['M3 8l9-5 9 5z', 'M5 8v10', 'M9.7 8v10', 'M14.3 8v10', 'M19 8v10', 'M4 18h16', 'M3 21h18'] },
  specialist: { d: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M9 12l2.2 2.2L15.5 10'] },
  'project-management': { c: [[8, 8, 3], [17, 9, 2.3]], d: ['M2.5 20c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6', 'M15 14.2c.6-.2 1.3-.2 2-.2 2.6 0 4.5 2 4.5 5'] },
}

export const hasIcon = (name) => Boolean(ICONS[name])

export default function Icon({ name, size = 20, className = '', title }) {
  const g = ICONS[name]
  if (!g) return null
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {g.r?.map(([x, y, w, h, rx], i) => <rect key={`r${i}`} x={x} y={y} width={w} height={h} rx={rx} />)}
      {g.c?.map(([cx, cy, r], i) => <circle key={`c${i}`} cx={cx} cy={cy} r={r} />)}
      {g.d?.map((d, i) => <path key={`d${i}`} d={d} />)}
      {g.f?.map(([cx, cy, r], i) => <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />)}
    </svg>
  )
}
