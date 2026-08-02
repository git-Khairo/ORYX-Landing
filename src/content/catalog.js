/**
 * What sits behind each of the three services, in English.
 *
 * Supplied by the client in Arabic and translated here rather than at render
 * time, so the site has one language and no runtime translation step.
 *
 * The client's list arrived as ten categories; the site sells three. So the ten
 * are folded into the three they belong to — transport, distribution and
 * logistics are all Delivery; construction, staffing, maintenance, projects and
 * workforce management are all what "one integrated partner" actually means —
 * rather than the ring growing to ten cards and the offer losing its shape.
 *
 * Ids match the `services` and `journeys` keys in `copy.js`, so opening a
 * request from a service page lands on that service's own question flow.
 */
/**
 * Pexels' CDN, sized on demand. Placeholder photography until the client's own
 * shoot lands — swap the ids and nothing else changes. Same caveat as the
 * footage in `media.js`: the licence covers using these, not serving them from
 * someone else's CDN forever, so they should be pulled local before launch.
 */
export const photo = (id, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

export const catalog = [
  {
    id: 'cleaning',
    eyebrow: 'Service 01',
    title: 'Cleaning',
    pillar: 'Respect Your Time',
    image: { id: 4239146, alt: 'A gloved hand wiping down a wall' },
    gallery: [
      { id: 4108715, alt: 'Sweeping a hard floor' },
      { id: 236705, alt: 'An empty industrial hall' },
    ],
    lede: 'Cleaning is judged on the mornings nobody remembers. Commercial, industrial and specialist work, delivered to one written standard and staffed by people we supervise.',
    groups: [
      {
        name: 'Commercial',
        items: ['Offices', 'Warehouses', 'Factories', 'Schools', 'Hospitals'],
      },
      {
        name: 'Industrial',
        items: [
          'Production line cleaning',
          'Machinery cleaning',
          'Factory cleaning',
          'Cleaning after maintenance work',
        ],
      },
      {
        name: 'Specialist',
        items: [
          'Window cleaning',
          'Floor care',
          'Carpet cleaning',
          'Steam cleaning',
          'Disinfection',
        ],
      },
      {
        name: 'Post-construction',
        items: [
          'Construction site cleaning',
          'Paint residue removal',
          'Dust removal',
          'Buildings handed over ready',
        ],
      },
      {
        name: 'The people',
        items: ['Cleaners', 'Cleaning supervisors', 'Industrial cleaning operatives'],
      },
    ],
  },
  {
    id: 'delivery',
    eyebrow: 'Service 02',
    title: 'Delivery',
    pillar: 'We Keep Your Business Moving',
    image: { id: 1267338, alt: 'A forklift moving pallets in a warehouse' },
    gallery: [
      { id: 906494, alt: 'Stacked shipping containers' },
      { id: 4481259, alt: 'Pallets and workers on a distribution floor' },
    ],
    lede: 'Most delivery problems are information problems — you find out late. Transport, distribution and the warehouse behind them, run as one operation and reported before you have to ask.',
    groups: [
      {
        name: 'Transport',
        items: [
          'Freight',
          'Equipment',
          'Building materials',
          'Furniture',
          'Local and intercity',
          'Express delivery',
          'Last-mile delivery',
        ],
      },
      {
        name: 'Distribution',
        items: [
          'Parcel distribution',
          'Distribution to retail stores',
          'Food products',
          'Pharmaceuticals, where requirements are met',
          'Business order delivery',
          'Distribution fleet management',
        ],
      },
      {
        name: 'Logistics',
        items: [
          'Warehouse management',
          'Goods receiving and storage',
          'Picking and packing',
          'Shipping',
          'Inventory management',
          'Cross docking',
        ],
      },
      {
        name: 'The people',
        items: [
          'Warehouse operatives',
          'Pickers and packers',
          'Order pickers',
          'Packing staff',
          'Sorting staff',
        ],
      },
    ],
  },
  {
    id: 'facility',
    eyebrow: 'Service 03',
    title: 'Facility Management',
    pillar: 'One Integrated Partner',
    image: { id: 2760241, alt: 'A worker in hi-vis and hard hat on plant equipment' },
    gallery: [
      { id: 8985454, alt: 'A tool case laid out' },
      { id: 3184292, alt: 'A team reviewing plans and figures' },
    ],
    lede: 'Buildings fail in the gaps between suppliers. Everything that keeps a site working — the trades, the upkeep, the people and the management around them — held under one agreement with one party accountable.',
    groups: [
      {
        name: 'Facility services',
        items: [
          'Cleaning',
          'Maintenance',
          'Reception services',
          'Waste management',
          'Security, through licensed partners',
          'Grounds and garden care',
          'Winter snow clearance',
        ],
      },
      {
        name: 'Maintenance',
        items: [
          'Building, warehouse and office maintenance',
          'Minor repairs',
          'Scheduled maintenance',
          'Emergency callout',
        ],
      },
      {
        name: 'Construction and fit-out',
        items: [
          'General labour',
          'Demolition',
          'Plasterwork and ceilings',
          'Interior and exterior painting',
          'Flooring — PVC, laminate, tiles',
          'Carpentry and kitchen installation',
          'Plumbing and electrical work',
          'Doors, windows and insulation',
          'Restoration and renovation',
        ],
      },
      {
        name: 'Staffing',
        items: [
          'Temporary or permanent placements',
          'Construction workers, carpenters, steel fixers',
          'Electricians and plumbers',
          'Production workers and line operators',
          'Quality controllers',
          'Kitchen, housekeeping and service staff',
        ],
      },
      {
        name: 'Project support',
        items: [
          'Team management',
          'On-site supervisors',
          'Resource planning',
          'Project monitoring',
          'Schedule management',
          'Performance reporting',
        ],
      },
      {
        name: 'Workforce management',
        items: [
          'Labour planning',
          'Schedules and shifts',
          'Absence management',
          'Hour logging',
          'Productivity monitoring',
          'Worker training',
          'Immediate replacement cover',
        ],
      },
    ],
  },
]

/** The sectors these services are delivered into. */
export const sectors = [
  'Construction companies',
  'Factories',
  'Food companies',
  'Pharmaceutical companies',
  'Warehouses',
  'Distribution centres',
  'Transport companies',
  'Municipalities',
  'Schools',
  'Universities',
  'Hotels',
  'Hospitals',
  'Offices',
  'Airports',
  'Ports',
  'Shopping centres',
]

/**
 * What "operational partner" means in practice — the difference between
 * supplying people and running the operation they are part of. True of all
 * three services, so it is stated once and shown on each of them.
 */
export const partnerModel = {
  title: 'An operational partner, not a supplier.',
  lede: 'We do not stop at supplying people. We run the operation they belong to, and report on it.',
  points: [
    'Supplying the right people for the work',
    'Managing schedules and shifts',
    'Supervising teams on site',
    'Transport to and from the work site',
    'Providing safety equipment',
    'Monitoring quality and productivity',
    'Daily or weekly digital reporting',
    'Immediate replacement cover for absence',
    'Invoicing and hour reports',
    'A single point of contact for everything',
  ],
}
