// All site copy — English, faithful to ORYX_Brand_Strategy.pdf.
// Centralized so wording stays on-brand and is easy to edit.

export const brand = {
  name: 'ORYX',
  tagline: 'Always Ready.',
  category: 'B2B Operational Services · Netherlands',
  promise: 'We take care of your operations, so you can focus on your business.',
  pillars: ['Technology', 'European Quality', 'Arabic Hospitality', 'Sustainability'],
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
    body: 'Precise, consistent and sustainable cleaning executed to the highest European standards — so your spaces are always ready, and your time is always respected.',
    features: ['Consistent quality', 'Eco-conscious materials', 'Reliable schedules'],
  },
  {
    id: 'delivery',
    eyebrow: 'Service 02',
    title: 'Delivery',
    pillar: 'We Keep Your Business Moving',
    body: 'Dependable delivery that keeps your operations flowing. Fast to respond, transparent to track, and built around the rhythm of your business.',
    features: ['Fast response', 'Full transparency', 'Dependable logistics'],
  },
  {
    id: 'facility',
    eyebrow: 'Service 03',
    title: 'Facility Management',
    pillar: 'One Integrated Partner',
    body: 'Integrated management of your facilities under one accountable partner — combining people, process and technology so nothing falls through the cracks.',
    features: ['Single accountable partner', 'Proactive maintenance', 'Measurable standards'],
  },
]

export const why = {
  eyebrow: 'Why ORYX',
  title: 'One experience. Not just a service.',
  body: 'ORYX brings technology, European quality, Arabic hospitality and sustainability together into a single, integrated experience.',
  advantages: [
    { k: 'Technology-driven', d: 'A modern platform behind every service.' },
    { k: 'European Quality', d: 'Executed to the highest European standards.' },
    { k: 'Arabic Hospitality', d: 'Care, respect and warmth in every detail.' },
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
    { n: 'EU', l: 'Standards for quality & responsibility' },
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

export const statement = {
  eyebrow: 'The ORYX Statement',
  body: 'ORYX is a modern operational partner that brings together technology, European quality and Arabic hospitality — delivering reliable, sustainable and always-ready services for businesses. It is not just a cleaning, delivery or facility company.',
  close: 'Always Ready.',
}
