/**
 * All site copy in one place.
 *
 * The brand is O.I.F.M.G — ORYX Integration Facility Management Group. The
 * initials are the mark; the expansion is the reveal, so they are stored apart
 * and the hero animates from one to the other.
 */
export const brand = {
  /* The company is ORYX everywhere on the page. O.I.F.M.G is the legal/full
     form and appears in exactly one place — the film — where unfolding it is
     the point. Using it in running chrome would trade a name people can say
     for an acronym they have to decode. */
  name: 'ORYX',
  initials: ['O', 'I', 'F', 'M', 'G'],
  expansion: ['ORYX', 'Integration', 'Facility', 'Management', 'Group'],
  full: 'ORYX Integration Facility Management Group',
  tagline: 'Your partner. Always ready.',
  region: 'Netherlands',
}

/**
 * The opening film, as a sequence of acts.
 *
 * Each act owns one clip and one line. `hold` is how long the act sits on
 * screen in seconds — short, because the whole sequence is under twenty and
 * every act has to earn its place.
 */
export const acts = [
  {
    id: 'oryx',
    kind: 'brand',
    film: 'oryx',
    hold: 3.4,
    line: 'ORYX',
    sub: 'Your partner. Always ready.',
  },
  {
    id: 'identity',
    kind: 'initials',
    film: 'facilities',
    hold: 4.6,
    sub: 'One group. Every operation.',
  },
  {
    id: 'transport',
    kind: 'service',
    film: 'transport',
    hold: 2.8,
    index: '01',
    line: 'Transport\n& Logistics',
    sub: 'Goods moved on a schedule you can plan around.',
  },
  {
    id: 'workforce',
    kind: 'service',
    film: 'workforce',
    hold: 2.8,
    index: '02',
    line: 'Workforce',
    sub: 'The right people, placed where the work is.',
  },
  {
    id: 'renovation',
    kind: 'service',
    film: 'renovation',
    hold: 2.8,
    index: '03',
    line: 'Renovation',
    sub: 'Buildings brought back into service.',
  },
  {
    id: 'outro',
    kind: 'outro',
    film: 'outro',
    hold: 3.2,
    line: 'Always ready.',
    sub: 'ORYX · Netherlands',
  },
]

/**
 * The three portals, and the worlds behind them.
 *
 * The top-level keys are what section two shows. `world` is what opens on a
 * click — the detail the landing screen withholds on purpose. `definition`,
 * `audience.items` and `inside` all use the same `{ k, d }` shape as
 * `pillars[].points`, so one row component renders all three.
 */
export const services = [
  {
    id: 'transport',
    /* The page this service opens is tinted from here — read by ServiceWorld
       and written onto the overlay as --accent / --tint. */
    accent: '#2f5d7c',
    tint: '#eef3f7',
    index: '01',
    title: 'Transport & Logistics',
    short: 'Transport',
    promise: 'Moved on time, tracked end to end.',
    body: 'Fixed routes for predictable volume and on-demand capacity for everything else, run for organisations that cannot afford to find out late.',
    world: {
      lede: 'Most delivery problems are not driving problems. They are information problems — you find out late, and by then the only choice left is which apology to make. We plan routes to be reported, not chased.',
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
      /* Numbers, so the page has something to look at that is not a sentence.
         Placeholders until real operating figures are supplied. */
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
    /* The page this service opens is tinted from here — read by ServiceWorld
       and written onto the overlay as --accent / --tint. */
    accent: '#8a6234',
    tint: '#f7f2eb',
    index: '02',
    title: 'Workforce',
    short: 'Workforce',
    promise: 'The right people, placed where the work is.',
    body: 'Event crew, cleaning teams, facility staff — supplied to organisations and clients who need capable people at short notice and to a known standard.',
    world: {
      lede: 'Staffing is judged on the shifts nobody remembers. The right number of people arrived, they knew the site, they knew the standard, and the day ran. We supply people the way an operations team would want them supplied.',
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
    /* The page this service opens is tinted from here — read by ServiceWorld
       and written onto the overlay as --accent / --tint. */
    accent: '#7d4436',
    tint: '#f8f0ed',
    index: '03',
    title: 'Renovation',
    short: 'Renovation',
    promise: 'Buildings brought back into service.',
    body: 'Refurbishment and fit-out of commercial premises, coordinated as one accountable programme rather than a queue of separate trades.',
    world: {
      lede: 'Renovation goes wrong in the gaps between trades — the week nobody booked, the decision nobody owned. Held as one programme those gaps stop existing, and the building comes back into service on the date you were given.',
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
      figures: [
        { n: '1', l: 'Contract covering every trade' },
        { n: '0', l: 'Days a floor closes unnecessarily' },
        { n: '100%', l: 'Work signed off against written scope' },
      ],
      prompt: 'Tell us what needs bringing back into service.',
    },
  },
]

/** Vision, mission, values.
 *
 * Cut hard and the point lines lifted from the earlier branch, where they were
 * already written short. Each panel is one sentence and three named values —
 * an accordion that has to be read for twenty seconds is not an accordion, it
 * is an article behind a click. */
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
