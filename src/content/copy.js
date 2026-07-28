// All site copy — English, faithful to ORYX_Brand_Strategy.pdf.
// Centralized so wording stays on-brand and is easy to edit.

export const brand = {
  name: 'ORYX',
  tagline: 'Always Ready.',
  category: 'B2B Operational Services · Netherlands',
  promise: 'We take care of your operations, so you can focus on your business.',
  pillars: ['Technology', 'Precision', 'Care', 'Sustainability'],
}

// The customer journey (used by the ProgressRail + section anchors).
export const journey = [
  { id: 'hero', label: 'Hero' },
  { id: 'discover', label: 'Discover' },
  { id: 'technology', label: 'Technology' },
  { id: 'services', label: 'Services' },
  { id: 'why', label: 'Why ORYX' },
  { id: 'sustainability', label: 'Sustainability' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
  { id: 'statement', label: 'Statement' },
]

export const discover = {
  eyebrow: 'Discover ORYX',
  title: 'Companies deserve a partner they can rely on.',
  body: 'ORYX is a modern operational-services company — cleaning, delivery and facility management for businesses across the Netherlands. Instead of managing dozens of operational details, companies rely on ORYX to handle everything that keeps the day running, while quality, commitment and sustainability stay intact.',
  aim: 'We don’t aim to deliver isolated services. We aim to be a trusted operational partner — for the long term, not a temporary provider.',
}

export const technology = {
  eyebrow: 'Technology',
  title: 'Technology makes service better.',
  body: 'ORYX is a technology company that happens to deliver operational services — not a traditional cleaning company. Every request, schedule and follow-up is handled through a digital experience that reflects the quality of the service itself.',
  points: [
    'A digital experience that mirrors service quality',
    'Trust built before the first point of contact',
    'Speed of response, by design',
  ],
}

export const services = [
  {
    id: 'cleaning',
    eyebrow: 'Service 01',
    title: 'Cleaning',
    pillar: 'Respect Your Time',
    body: 'Precise, consistent and sustainable cleaning executed to an exacting standard — so your spaces are always ready, and your time is always respected.',
    features: ['Consistent quality', 'Eco-conscious materials', 'Reliable schedules'],
    detail: 'Work that happens before anyone arrives, and is never the thing anyone has to think about.',
    world: {
      headline: 'The room was\nalready ready.',
      lede: 'Cleaning is judged on the mornings nobody remembers. No complaint, no lingering smell, no cupboard out of stock — just a building that opened as though it had never closed.',
      scenes: [
        {
          marker: 'Standard',
          title: 'One specification,\nevery site.',
          body: 'Every space is scoped once and written down: what is cleaned, how often, to what finish. Teams rotate; the specification does not. That is the difference between a cleaning company and an operational partner.',
          notes: ['Written scope per space', 'Photographed handover', 'Escalation inside one shift'],
        },
        {
          marker: 'Materials',
          title: 'Fewer chemicals.\nBetter results.',
          body: 'Concentrated, low-impact products dosed by measure rather than by habit, with microfibre systems that cut both water and residue. Sustainability here is a procurement decision, not a claim on a page.',
        },
        {
          marker: 'Rhythm',
          title: 'Scheduled around\nyour building.',
          body: 'Before opening, between shifts, after close — the schedule is shaped by when your rooms are empty, not by when it suits a roster.',
          notes: ['Out-of-hours as standard', 'Key-holding and alarm response', 'Seasonal deep-clean cycles'],
        },
      ],
      prompt: 'Tell us what needs to stay ready.',
    },
  },
  {
    id: 'delivery',
    eyebrow: 'Service 02',
    title: 'Delivery',
    pillar: 'We Keep Your Business Moving',
    body: 'Dependable delivery that keeps your operations flowing. Fast to respond, transparent to track, and built around the rhythm of your business.',
    features: ['Fast response', 'Full transparency', 'Dependable logistics'],
    detail: 'Goods moved between your sites and your customers, on a schedule you can plan around.',
    world: {
      headline: 'It left on time.\nIt arrived on time.',
      lede: 'Most delivery problems are not driving problems — they are information problems. You find out late. Our routes are planned to be told, not chased.',
      scenes: [
        {
          marker: 'Routes',
          title: 'Planned once,\nrun every day.',
          body: 'Fixed routes for predictable volume, on-demand capacity for the rest. Loads are consolidated so you are not paying for half-empty vans crossing the same city twice.',
          notes: ['Fixed and on-demand tiers', 'Consolidated multi-site runs', 'Randstad to nationwide'],
        },
        {
          marker: 'Visibility',
          title: 'You are told\nbefore you ask.',
          body: 'Departure, exception, arrival. Proof of delivery captured at the door. If something slips, the message reaches you before your customer notices.',
        },
        {
          marker: 'Handling',
          title: 'The last ten metres\ncount most.',
          body: 'Fragile, temperature-sensitive, oversized, restricted-access — handling requirements are agreed up front and carried by the driver, not improvised on arrival.',
          notes: ['Client-facing handover', 'Restricted-site access', 'Signed proof of delivery'],
        },
      ],
      prompt: 'Tell us what needs to move.',
    },
  },
  {
    id: 'facility',
    eyebrow: 'Service 03',
    title: 'Facility Management',
    pillar: 'One Integrated Partner',
    body: 'Integrated management of your facilities under one accountable partner — combining people, process and technology so nothing falls through the cracks.',
    features: ['Single accountable partner', 'Proactive maintenance', 'Measurable standards'],
    detail: 'One number to call, one party accountable, for everything that keeps a building working.',
    world: {
      headline: 'One partner.\nOne accountability.',
      lede: 'Buildings fail in the gaps between suppliers. Facility management under one agreement removes the gaps — and removes the part of your week spent deciding whose problem something is.',
      scenes: [
        {
          marker: 'Scope',
          title: 'Everything that\nkeeps it running.',
          body: 'Cleaning, waste, consumables, small maintenance, contractor coordination, access. Held as one scope with one point of contact, so nothing lives in the space between two contracts.',
          notes: ['Single point of contact', 'Contractor coordination', 'Consumables and stock'],
        },
        {
          marker: 'Prevention',
          title: 'Fixed before\nit is reported.',
          body: 'Planned inspection cycles catch the failures that would otherwise become an emergency call at the worst hour. Reactive work is the exception, and it is measured.',
        },
        {
          marker: 'Evidence',
          title: 'Reported in\nplain numbers.',
          body: 'What was done, when, at what cost, against what standard. A monthly operational picture you can hand to finance without translating it first.',
          notes: ['Monthly operational report', 'Cost per site, per service', 'Standards measured, not asserted'],
        },
      ],
      prompt: 'Tell us what you need held together.',
    },
  },
]

export const why = {
  eyebrow: 'Why ORYX',
  title: 'One experience. Not just a service.',
  body: 'ORYX brings technology, precision, care and sustainability together into a single, integrated experience.',
  advantages: [
    { k: 'Technology-driven', d: 'A modern platform behind every service.' },
    { k: 'Precision', d: 'Executed to an exacting, measurable standard.' },
    { k: 'Care', d: 'Attention, respect and warmth in every detail.' },
    { k: 'Sustainability', d: 'Every decision considers the environment.' },
    { k: 'Speed of Response', d: 'Ready when your business needs you.' },
    { k: 'Reliability', d: 'We commit to what we promise.' },
  ],
}

export const sustainability = {
  eyebrow: 'Sustainability',
  title: 'Sustainability matters.',
  body: 'Sustainability isn’t an add-on — it’s a standard. Every decision at ORYX weighs its impact on the environment, from the materials we choose to the routes we plan.',
  stats: [
    { n: '100%', l: 'Decisions weighed for environmental impact' },
    { n: 'One', l: 'Standard for quality and responsibility, everywhere' },
    { n: '∞', l: 'Long-term commitment, not a quick fix' },
  ],
}

export const process = {
  eyebrow: 'The Process',
  title: 'Set it once. Trust it forever.',
  body: 'Getting started with ORYX is calm and simple. Set up your service once — then rely on it, without needing to watch over it.',
  steps: [
    { n: '01', t: 'Choose your service', d: 'Cleaning, delivery or facility management.' },
    { n: '02', t: 'We tailor the plan', d: 'A setup shaped around how your business runs.' },
    { n: '03', t: 'We stay ready', d: 'Consistent execution, monitored so you don’t have to.' },
    { n: '04', t: 'You focus on business', d: 'Operations handled. Peace of mind delivered.' },
  ],
}

export const values = [
  { k: 'Reliability', d: 'We commit to what we promise.' },
  { k: 'Professionalism', d: 'Every detail reflects a high level of craft.' },
  { k: 'Excellence', d: 'Quality is not a choice — it’s the standard.' },
  { k: 'Sustainability', d: 'Every decision must respect the environment.' },
  { k: 'Respect', d: 'For time, for place, for people and culture.' },
  { k: 'Innovation', d: 'Technology is a core part of the service.' },
]

export const keywords = [
  'Modern', 'Smart', 'Reliable', 'Clean', 'Sustainable', 'Professional',
  'Premium', 'Elegant', 'Efficient', 'Human', 'Innovative', 'Trusted',
]

export const contact = {
  eyebrow: 'Get Started',
  title: 'Let’s begin with what you need.',
  body: 'Instead of one generic form, tell us which service you’re looking for — and we’ll tailor the request to you.',
  options: [
    { id: 'cleaning', label: 'Cleaning' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'facility', label: 'Facility Management' },
  ],
}

/* ── The request journey ──────────────────────────────────────────────────
   One question per screen, shaped to the service. Deliberately not a form:
   nobody can describe an operational need in a free-text box, and asking them
   to produces enquiries nobody can quote against. Structured answers mean the
   reply can be specific. The final step is the only one that asks who they are. */
const DETAILS_STEP = {
  id: 'details',
  kind: 'details',
  prompt: 'Where should the answer go?',
  help: 'The last step. Everything above is already saved.',
}

export const journeys = {
  cleaning: [
    {
      id: 'property',
      kind: 'single',
      prompt: 'What type of space needs service?',
      options: [
        { value: 'office', label: 'Office', hint: 'Single or multi-floor' },
        { value: 'retail', label: 'Retail or hospitality' },
        { value: 'industrial', label: 'Warehouse or industrial' },
        { value: 'multi', label: 'Several sites at once' },
      ],
    },
    {
      id: 'frequency',
      kind: 'single',
      prompt: 'How often should we be there?',
      options: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly-multi', label: 'Several times a week' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'periodic', label: 'Periodic or deep-clean only' },
      ],
    },
    {
      id: 'timing',
      kind: 'single',
      prompt: 'When are the rooms free?',
      options: [
        { value: 'before', label: 'Before opening' },
        { value: 'after', label: 'After close' },
        { value: 'during', label: 'During the working day' },
        { value: 'flexible', label: 'Flexible' },
      ],
    },
    {
      id: 'scope',
      kind: 'multi',
      prompt: 'Anything beyond the standard scope?',
      help: 'Select everything that applies.',
      options: [
        { value: 'consumables', label: 'Consumables and restocking' },
        { value: 'waste', label: 'Waste and recycling' },
        { value: 'windows', label: 'Windows and glass' },
        { value: 'floors', label: 'Specialist floor care' },
        { value: 'keys', label: 'Key-holding' },
        { value: 'eco', label: 'Certified eco-only products' },
      ],
    },
    DETAILS_STEP,
  ],
  delivery: [
    {
      id: 'cargo',
      kind: 'single',
      prompt: 'What needs to move?',
      options: [
        { value: 'documents', label: 'Documents and small parcels' },
        { value: 'goods', label: 'Goods and pallets' },
        { value: 'equipment', label: 'Equipment and materials' },
        { value: 'internal', label: 'Movement between our own sites' },
      ],
    },
    {
      id: 'pattern',
      kind: 'single',
      prompt: 'Is this scheduled or on demand?',
      options: [
        { value: 'fixed', label: 'Fixed schedule', hint: 'Same route, same times' },
        { value: 'recurring', label: 'Recurring, flexible windows' },
        { value: 'ondemand', label: 'On demand' },
        { value: 'mixed', label: 'A mix of both' },
      ],
    },
    {
      id: 'area',
      kind: 'single',
      prompt: 'Where does it run?',
      options: [
        { value: 'city', label: 'Within one city' },
        { value: 'randstad', label: 'Randstad region' },
        { value: 'national', label: 'Nationwide' },
        { value: 'crossborder', label: 'Cross border' },
      ],
    },
    {
      id: 'handling',
      kind: 'multi',
      prompt: 'Any handling requirements?',
      help: 'Select everything that applies.',
      options: [
        { value: 'fragile', label: 'Fragile' },
        { value: 'temperature', label: 'Temperature sensitive' },
        { value: 'heavy', label: 'Heavy or oversized' },
        { value: 'restricted', label: 'Restricted access site' },
        { value: 'proof', label: 'Proof of delivery' },
        { value: 'handover', label: 'Client-facing handover' },
      ],
    },
    DETAILS_STEP,
  ],
  facility: [
    {
      id: 'estate',
      kind: 'single',
      prompt: 'What are we looking after?',
      options: [
        { value: 'single', label: 'One building' },
        { value: 'campus', label: 'A campus or site' },
        { value: 'portfolio', label: 'Several locations' },
        { value: 'mixed', label: 'Mixed-use estate' },
      ],
    },
    {
      id: 'current',
      kind: 'single',
      prompt: 'How is it handled today?',
      options: [
        { value: 'inhouse', label: 'In-house team' },
        { value: 'multiple', label: 'Several separate suppliers' },
        { value: 'single', label: 'One provider we want to replace' },
        { value: 'nothing', label: 'Nothing formal yet' },
      ],
    },
    {
      id: 'scope',
      kind: 'multi',
      prompt: 'What should fall under the agreement?',
      help: 'Select everything that applies.',
      options: [
        { value: 'cleaning', label: 'Cleaning' },
        { value: 'maintenance', label: 'Small maintenance' },
        { value: 'waste', label: 'Waste and recycling' },
        { value: 'consumables', label: 'Consumables' },
        { value: 'contractors', label: 'Contractor coordination' },
        { value: 'reporting', label: 'Reporting and compliance' },
      ],
    },
    {
      id: 'priority',
      kind: 'single',
      prompt: 'What matters most right now?',
      options: [
        { value: 'accountability', label: 'One party accountable' },
        { value: 'cost', label: 'Predictable cost' },
        { value: 'response', label: 'Faster response' },
        { value: 'standards', label: 'Consistent standards' },
      ],
    },
    DETAILS_STEP,
  ],
}

export const statement = {
  eyebrow: 'The ORYX Statement',
  body: 'ORYX is a modern operational partner that brings together technology, precision and genuine care — delivering reliable, sustainable and always-ready services for businesses. It is not just a cleaning, delivery or facility company.',
  close: 'Always Ready.',
}
