/**
 * All site copy in one place.
 *
 * The brand is ORYX GROUP. The old O.I.F.M.G initials-unfold is gone with it:
 * an acronym nobody can say was never the reveal it was being asked to be, and
 * the identity board settles the question — the mark and the word ORYX are the
 * brand, and the descriptor line does the explaining underneath.
 */
export const brand = {
  name: 'ORYX',
  full: 'ORYX GROUP',
  /* The slogan reads as an expansion of the name, which is why it earns the
     dash when it is set as a lockup: ORYX — Our Reliability, Your Excellence. */
  slogan: 'Our Reliability, Your Excellence',
  /* The same slogan, split against the letters it comes out of. Stored as
     explicit pairs rather than derived from the words' first letters, because
     the last pair does not survive that: X is taken from e(X)cellence, which is
     the whole reason the backronym lands. */
  letters: [
    { k: 'O', w: 'Our' },
    { k: 'R', w: 'Reliability' },
    { k: 'Y', w: 'Your' },
    { k: 'X', w: 'Excellence' },
  ],
  /* The board's four-part descriptor. Chrome and metadata only — it says what
     the company does, where the slogan says what it is like to work with. */
  descriptor: ['Building', 'People', 'Services', 'Solutions'],
  region: 'Netherlands',
}

/**
 * The opening film, as six shots of one sequence.
 *
 * Not a carousel: the shots share a camera. Every one is a slow push at the
 * same rate, every cut is the same chevron wipe taken off the mark, and the
 * film opens and closes on the same object. `hold` is seconds on screen.
 *
 * `enter` names the direction the wipe travels, alternating so the film has a
 * rhythm rather than a tic.
 */
export const acts = [
  {
    /* The origin shot. The animal, with the mark standing in for its horns —
       then the horns detach and rise into the logo, which is the whole idea of
       the identity stated in three seconds and never explained again. */
    id: 'oryx',
    kind: 'origin',
    film: 'oryx',
    /* Cut on the resolve. The detach lands at 4.15s (it starts at 1.95 and runs
       2.2), and the shot used to sit there for another second afterwards with
       the mark finished and the animal still fading in the background — a dead
       beat that read as the film hesitating. The hold now ends just as the mark
       arrives, so the next shot takes over on the resolve. */
    hold: 4.35,
    enter: 'up',
    line: 'ORYX',
    /* The board's own three words for the animal. The slogan used to sit here
       and now belongs to the shot after this one, where it is taken apart
       letter by letter — printing it twice would spend the reveal early. */
    sub: 'Strength · Focus · Resilience',
  },
  {
    /* The slogan, taken apart. This is the shot that earns the name: the film
       has just made the mark out of the animal, and now it makes the promise
       out of the mark's four letters. */
    id: 'group',
    kind: 'initials',
    film: 'facilities',
    hold: 5.4,
    enter: 'down',
    line: 'ORYX GROUP',
    sub: 'ORYX GROUP · Building · People · Services · Solutions',
  },
  {
    id: 'transport',
    kind: 'service',
    film: 'transport',
    hold: 2.9,
    enter: 'up',
    index: '01',
    line: 'Transport\n& Logistics',
    sub: 'Goods moved on a schedule you can plan around.',
  },
  {
    id: 'workforce',
    kind: 'service',
    film: 'workforce',
    hold: 2.9,
    enter: 'down',
    index: '02',
    line: 'Workforce',
    sub: 'The right people, placed where the work is.',
  },
  {
    id: 'renovation',
    kind: 'service',
    film: 'renovation',
    hold: 2.9,
    enter: 'up',
    index: '03',
    line: 'Renovation',
    sub: 'Buildings brought back into service.',
  },
  {
    /* Closes on the mark alone — the same object the film opened with, now
       without the animal, because by here it does not need it. */
    id: 'outro',
    kind: 'outro',
    film: 'outro',
    hold: 3.6,
    enter: 'down',
    line: 'One group. Every operation.',
    sub: 'ORYX GROUP · Netherlands',
  },
]

/**
 * The three services, and the worlds behind them.
 *
 * `tone` is a ground tint, not a theme — three near-blacks a degree apart in
 * temperature, so each world sits in its own light while the site stays one
 * colour. `accent` is sand for all three on purpose: the layouts differentiate
 * these pages, the palette does not have to.
 */
export const services = [
  {
    id: 'transport',
    accent: '#c8a978',
    tone: '#101315',
    index: '01',
    title: 'Transport & Logistics',
    short: 'Transport',
    promise: 'Moved on time, tracked end to end.',
    body: 'Fixed routes for predictable volume and on-demand capacity for everything else, run for organisations that cannot afford to find out late.',
    world: {
      lede: 'Most delivery problems are not driving problems. They are information problems — you find out late, and by then the only choice left is which apology to make. We plan routes to be reported, not chased.',
      /* The route this page is built around. Each stop is a section; scroll
         position moves the marker down the line. */
      route: [
        { t: '06:40', k: 'Depot', d: 'Manifest built, load sequenced by drop order.' },
        { t: '07:15', k: 'Loaded', d: 'Checked against the manifest and sealed.' },
        { t: '07:30', k: 'In transit', d: 'Live position, with an ETA that updates itself.' },
        { t: '09:05', k: 'Exception', d: 'If it slips, you hear it from us first.' },
        { t: '11:20', k: 'Delivered', d: 'Signed, timestamped, proof returned same day.' },
      ],
      definition: [
        { k: 'Scheduled', d: 'Fixed routes for volume you can predict a month out.' },
        { k: 'On demand', d: 'Capacity within the day for the volume you cannot.' },
        { k: 'Between sites', d: 'Internal movement across your own locations.' },
        { k: 'Tracked', d: 'Departure, exception and arrival, told rather than asked for.' },
      ],
      audience: {
        line: 'For organisations where something arriving late costs more than the delivery itself.',
        items: [
          { k: 'Retail groups', d: 'Stock between depot and floor, ahead of opening.' },
          { k: 'Manufacturers', d: 'Parts and pallets on a line that cannot wait.' },
          { k: 'Healthcare', d: 'Time-critical items with a chain of custody.' },
          { k: 'Multi-site offices', d: 'Documents, equipment and post between buildings.' },
        ],
      },
      inside: [
        { k: 'Route planning', d: 'Consolidated runs, so you are not paying for half-empty vans crossing the same city twice.' },
        { k: 'Proof of delivery', d: 'Captured at the door, signed, timestamped and returned to you.' },
        { k: 'Exception handling', d: 'If something slips, the message reaches you before it reaches your customer.' },
        { k: 'Specialist handling', d: 'Fragile, temperature-controlled, oversized or restricted-access, agreed up front.' },
        { k: 'Coverage', d: 'City, Randstad, nationwide and cross-border, on one agreement.' },
      ],
      /* The network, as a map draws it. Coordinates are in the map's own
         viewBox units, so the route and its pins are authored together and
         cannot drift apart. */
      map: {
        nodes: [
          { k: 'Rotterdam', s: 'Port · depot', x: 150, y: 250 },
          { k: 'Den Haag', s: 'Cross-dock', x: 330, y: 150 },
          { k: 'Amsterdam', s: 'Hub', x: 610, y: 95 },
          { k: 'Utrecht', s: 'Regional', x: 800, y: 205 },
          { k: 'Eindhoven', s: 'Drop', x: 1030, y: 275 },
        ],
        path: 'M150 250 C 230 220, 260 180, 330 150 S 470 90, 610 95 S 760 170, 800 205 S 950 250, 1030 275',
      },
      figures: [
        { n: '24/7', l: 'Dispatch and exception cover' },
        { n: '<1h', l: 'Response on an urgent lift' },
        { n: '100%', l: 'Consignments with proof of delivery' },
      ],
      prompt: 'Tell us what needs to move, and how often.',
    },
  },
  {
    id: 'workforce',
    accent: '#c8a978',
    tone: '#191713',
    index: '02',
    title: 'Workforce',
    short: 'Workforce',
    promise: 'The right people, placed where the work is.',
    body: 'Event crew, cleaning teams, facility staff — supplied to organisations and clients who need capable people at short notice and to a known standard.',
    world: {
      lede: 'Staffing is judged on the shifts nobody remembers. The right number of people arrived, they knew the site, they knew the standard, and the day ran. We supply people the way an operations team would want them supplied.',
      /* The shift this page is built around — the timetable is the layout. */
      shift: [
        { t: '06:00', k: 'Brief', d: 'Site, scope and standard, before anyone starts.' },
        { t: '08:00', k: 'On site', d: 'Full crew, inducted, in uniform, working.' },
        { t: '12:30', k: 'Cover', d: 'An absence is absorbed inside the shift, not reported after it.' },
        { t: '17:00', k: 'Handover', d: 'Written, to a named person, with what is outstanding.' },
      ],
      /* The crew grid — roles that populate as the page is read. */
      crew: [
        { r: 'Event crew', n: 'Build · Run · Strike' },
        { r: 'Cleaning', n: 'Daily · Periodic · Deep' },
        { r: 'Facilities', n: 'Caretaking · Post · Stock' },
        { r: 'Front of house', n: 'Reception · Access' },
        { r: 'Supervisors', n: 'One per shift, named' },
        { r: 'Floating cover', n: 'Absence, same day' },
      ],
      definition: [
        { k: 'Placed', d: 'Our people, working to your standard, on your site.' },
        { k: 'Briefed', d: 'They know the building before their first shift, not during it.' },
        { k: 'Covered', d: 'Absence is our problem to solve, not yours.' },
        { k: 'Accountable', d: 'One contact, one agreement, one invoice.' },
      ],
      audience: {
        line: 'For organisations that need capable people at short notice and to a known standard.',
        items: [
          { k: 'Event organisers', d: 'Crew for build, run and strike, scaled to the day.' },
          { k: 'Facility managers', d: 'Cleaning and support staff on a standing rota.' },
          { k: 'Property groups', d: 'Front-of-house and caretaking across a portfolio.' },
          { k: 'Seasonal operations', d: 'Volume that triples for six weeks and then stops.' },
        ],
      },
      inside: [
        { k: 'Event crew', d: 'Build, run and strike teams, briefed on the venue and the schedule.' },
        { k: 'Cleaning teams', d: 'Daily, periodic and deep-clean cycles to a written specification.' },
        { k: 'Facility staff', d: 'Caretaking, front-of-house, post and stock handling.' },
        { k: 'Cover and escalation', d: 'Sickness and no-shows absorbed inside one shift.' },
        { k: 'Vetting and training', d: 'Checked, inducted and insured before they reach your door.' },
      ],
      /* The day, as a clock rather than a table. `f` and `t` are hours on a
         24-hour dial; night cover deliberately wraps past midnight, which is
         the one shift a rectangular timetable cannot draw without cutting it
         in half. Ordered outermost ring first. */
      dial: [
        { k: 'Night cover', f: 22, t: 5 },
        { k: 'Cleaning', f: 5, t: 13 },
        { k: 'Front of house', f: 7, t: 19 },
        { k: 'Facilities', f: 8, t: 17 },
        { k: 'Event crew', f: 12, t: 23 },
      ],
      /* A week of cover, as a rota actually looks. `c` is one cell per day,
         Monday to Sunday: 2 = full crew, 1 = reduced, 0 = not staffed. The
         point of showing it is the shape — cover is not uniform, and a staffing
         partner that pretends otherwise has never run a weekend. */
      roster: {
        days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        rows: [
          { r: 'Event crew', c: [1, 1, 2, 2, 2, 2, 1] },
          { r: 'Cleaning', c: [2, 2, 2, 2, 2, 1, 1] },
          { r: 'Facilities', c: [2, 2, 2, 2, 2, 0, 0] },
          { r: 'Front of house', c: [2, 2, 2, 2, 2, 1, 0] },
          { r: 'Supervisors', c: [2, 2, 2, 2, 2, 2, 2] },
          { r: 'Floating cover', c: [1, 1, 1, 1, 2, 2, 1] },
        ],
        key: [
          { n: 2, k: 'Full crew' },
          { n: 1, k: 'Reduced' },
          { n: 0, k: 'Closed' },
        ],
      },
      figures: [
        { n: '48h', l: 'From brief to crew on site' },
        { n: '1', l: 'Account manager, start to finish' },
        { n: '100%', l: 'Staff vetted, trained and insured' },
      ],
      prompt: 'Tell us where you need people, and when.',
    },
  },
  {
    id: 'renovation',
    accent: '#c8a978',
    tone: '#1a1310',
    index: '03',
    title: 'Renovation',
    short: 'Renovation',
    promise: 'Buildings brought back into service.',
    body: 'Refurbishment and fit-out of commercial premises, coordinated as one accountable programme rather than a queue of separate trades.',
    world: {
      lede: 'Renovation goes wrong in the gaps between trades — the week nobody booked, the decision nobody owned. Held as one programme those gaps stop existing, and the building comes back into service on the date you were given.',
      /* The layer stack this page is built around — assembled on scroll, in
         the order the building itself is assembled. */
      layers: [
        { n: '01', k: 'Shell', d: 'Strip-out complete, structure surveyed, back to the substrate.' },
        { n: '02', k: 'Services', d: 'Electrical, ventilation and data set out before anything closes over them.' },
        { n: '03', k: 'Partitions', d: 'Walls, ceilings and openings built to the agreed plan.' },
        { n: '04', k: 'Finish', d: 'Flooring, joinery, decoration — snagged and handed back clean.' },
      ],
      /* Real material names, so the swatch strip is a specification rather
         than decoration. */
      materials: [
        { k: 'Oak veneer', c: '#8a6a3b' },
        { k: 'Warm concrete', c: '#77746d' },
        { k: 'Brushed steel', c: '#a8a49a' },
        { k: 'Deep walnut', c: '#4a3828' },
        { k: 'Bone plaster', c: '#e8e3d6' },
      ],
      definition: [
        { k: 'One programme', d: 'Every trade coordinated under a single accountable party.' },
        { k: 'One date', d: 'A completion you can plan a return-to-work around.' },
        { k: 'In occupation', d: 'Phased so the parts still in use stay usable.' },
        { k: 'Handed back clean', d: 'Snagged, cleaned and ready, not merely finished.' },
      ],
      audience: {
        line: 'For organisations bringing commercial premises back into service.',
        items: [
          { k: 'Landlords', d: 'Turning a unit around between tenants.' },
          { k: 'Occupiers', d: 'Fit-out shaped around how the space will actually be used.' },
          { k: 'Facility teams', d: 'Refurbishment while the building stays open.' },
          { k: 'Retail and hospitality', d: 'Short closures where every day dark is revenue.' },
        ],
      },
      inside: [
        { k: 'Strip-out', d: 'Clearance and disposal, with materials separated for recycling.' },
        { k: 'Fit-out', d: 'Partitions, ceilings, flooring, joinery and finishes.' },
        { k: 'Building services', d: 'Electrical, lighting, ventilation and data, coordinated as one.' },
        { k: 'Phasing', d: 'Work sequenced around occupation, out of hours where it has to be.' },
        { k: 'Handover', d: 'Snagging closed out, site cleaned, documentation delivered.' },
      ],
      /* The programme, as a bar chart of weeks. `f` and `t` are week numbers
         across a twelve-week span. The overlaps are the argument: trades run
         into each other on purpose, which is what "one programme" buys you and
         what a queue of separate contractors cannot do. */
      programme: {
        weeks: 12,
        phases: [
          { k: 'Strip-out', f: 0, t: 3 },
          { k: 'Services', f: 2, t: 6 },
          { k: 'Partitions', f: 5, t: 9 },
          { k: 'Finishes', f: 8, t: 11 },
          { k: 'Snag & hand back', f: 11, t: 12 },
        ],
      },
      /* The floor plan the page draws. Authored in the plan's own viewBox
         units: `walls` are the shell, `rooms` the partitions. */
      plan: {
        shell: 'M40 40 H820 V420 H40 Z',
        walls: [
          'M300 40 V250', 'M300 250 H560', 'M560 250 V420',
          'M560 140 H820', 'M40 320 H300',
        ],
        rooms: [
          { k: 'Reception', x: 168, y: 190 },
          { k: 'Open floor', x: 430, y: 130 },
          { k: 'Meeting', x: 690, y: 92 },
          { k: 'Services', x: 690, y: 330 },
          { k: 'Store', x: 168, y: 375 },
        ],
      },
      figures: [
        { n: '1', l: 'Contract covering every trade' },
        { n: '0', l: 'Days a floor closes unnecessarily' },
        { n: '100%', l: 'Work signed off against written scope' },
      ],
      prompt: 'Tell us what needs bringing back into service.',
    },
  },
]

/** Vision, mission, values. One sentence and four named points each. */
export const pillars = [
  {
    id: 'vision',
    label: 'Vision',
    headline: 'One partner for everything that keeps an organisation running.',
    points: [
      { k: 'One group', d: 'Accountable for all of it.' },
      { k: 'No gaps', d: 'Nothing between two contracts.' },
      { k: 'Long term', d: 'A partner, not a provider.' },
      { k: 'One agreement', d: 'Three services, one contract.' },
    ],
  },
  {
    id: 'mission',
    label: 'Mission',
    headline: 'Take the operational load, and give back the day.',
    points: [
      { k: 'Precision', d: 'Executed to a measurable standard.' },
      { k: 'Speed of response', d: 'Ready when the business needs it.' },
      { k: 'Reported plainly', d: 'In numbers, not adjectives.' },
      { k: 'Written standards', d: 'Agreed once, then measured.' },
    ],
  },
  {
    id: 'values',
    label: 'Values',
    headline: 'Reliable before impressive.',
    points: [
      { k: 'Reliability', d: 'We commit to what we promise.' },
      { k: 'Respect', d: 'For time, place, people and culture.' },
      { k: 'Sustainability', d: 'Every decision respects the environment.' },
      { k: 'Professionalism', d: 'Every detail reflects the craft.' },
    ],
  },
]
