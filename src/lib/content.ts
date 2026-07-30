/**
 * ORYX content model.
 *
 * Copy discipline: short, factual, calm. No invented clients,
 * certifications, awards or statistics. No response-time promises.
 * No em-dashes anywhere in visible strings.
 */

import { SERVICE_TINT } from "./palette";

export type ServiceId = "transportation" | "cleaning" | "facility";

export type CanvasVariant =
  | "drift"
  | "routes"
  | "sweep"
  | "plan"
  | "telemetry"
  | "pulse"
  | "organic"
  | "converge";

export interface ServiceScene {
  /** Small operational label, used as the scene marker. */
  marker: string;
  title: string;
  body: string;
  /** Optional short operational lines. Never more than four. */
  notes?: string[];
  media: CanvasVariant;
}

export interface Service {
  id: ServiceId;
  index: "01" | "02" | "03";
  name: string;
  /** One line, always visible in the territory. */
  promise: string;
  /** Revealed when the territory becomes active. */
  detail: string;
  accent: string;
  media: CanvasVariant;
  headline: string;
  lede: string;
  scenes: ServiceScene[];
  contactPrompt: string;
}

export const SERVICES: Service[] = [
  {
    id: "transportation",
    index: "01",
    name: "Transportation & Delivery",
    promise: "Movement without operational friction.",
    detail:
      "Transport, distribution and warehouse logistics, coordinated end to end with clear visibility at every handover.",
    accent: SERVICE_TINT.transportation,
    media: "routes",
    headline: "Movement without\noperational friction.",
    lede: "Goods, materials and equipment move on plan, and your team stops chasing updates.",
    scenes: [
      {
        marker: "What we move",
        title: "From documents\nto full pallets.",
        body: "Goods, building materials, equipment and furniture, moved with the right vehicle and the right handling for each load.",
        media: "routes",
      },
      {
        marker: "Reach",
        title: "Local, national\nand last mile.",
        body: "City runs, trips between cities and fast final delivery to the door, on fixed schedules or on demand.",
        notes: [
          "Local and intercity",
          "Same day and express",
          "Fixed or on demand",
        ],
        media: "converge",
      },
      {
        marker: "Distribution",
        title: "To your shops\nand your clients.",
        body: "Parcels, retail deliveries and business orders distributed on a managed route, with the fleet coordinated for you.",
        notes: [
          "Store and parcel delivery",
          "Business order delivery",
          "Fleet coordination",
        ],
        media: "drift",
      },
      {
        marker: "Logistics",
        title: "The warehouse,\nhandled.",
        body: "Receiving, storage, picking, packing, shipping and stock control, including cross docking when speed matters.",
        notes: [
          "Picking and packing",
          "Inventory management",
          "Cross docking",
        ],
        media: "telemetry",
      },
      {
        marker: "Visibility",
        title: "You should not have\nto ask where it is.",
        body: "Status is shared through structured updates, so your people know the position without making a call.",
        media: "plan",
      },
    ],
    contactPrompt: "Tell us what needs to move.",
  },
  {
    id: "cleaning",
    index: "02",
    name: "Cleaning Services",
    promise: "A better environment for better work.",
    detail:
      "Commercial, industrial, specialised and post construction cleaning, delivered to a defined standard.",
    accent: SERVICE_TINT.cleaning,
    media: "sweep",
    headline: "A better environment\nfor better work.",
    lede: "A workplace that is consistently right removes a distraction nobody should have to manage.",
    scenes: [
      {
        marker: "Commercial",
        title: "Offices to\nhospitals.",
        body: "Offices, warehouses, factories, schools and healthcare sites, cleaned on a schedule that respects the working day.",
        notes: [
          "Offices and retail",
          "Warehouses and factories",
          "Schools and healthcare",
        ],
        media: "sweep",
      },
      {
        marker: "Industrial",
        title: "Where production\ncannot stop.",
        body: "Production lines, machinery and factory floors, including the reset after maintenance work is finished.",
        notes: [
          "Production line cleaning",
          "Machine cleaning",
          "Post maintenance",
        ],
        media: "telemetry",
      },
      {
        marker: "Specialised",
        title: "The detail work,\ndone right.",
        body: "Windows, floors and carpets, plus steam cleaning and disinfection where a higher standard is required.",
        notes: [
          "Windows and floors",
          "Carpet and steam",
          "Disinfection",
        ],
        media: "organic",
      },
      {
        marker: "Post construction",
        title: "Handed over,\nready to use.",
        body: "Site clean up, paint and dust removal, and a final clean that leaves the building ready to open.",
        notes: [
          "Site clean up",
          "Paint and dust removal",
          "Handover ready",
        ],
        media: "plan",
      },
      {
        marker: "Method",
        title: "Consistency is the\nharder promise.",
        body: "A written scope, an agreed standard per area and recorded checks keep month twelve identical to month one.",
        media: "converge",
      },
    ],
    contactPrompt: "Tell us about the property.",
  },
  {
    id: "facility",
    index: "03",
    name: "Facility Management",
    promise: "Every facility. One accountable partner.",
    detail:
      "Integrated facility management, plus the people and trades to run it, under one accountable partner.",
    accent: SERVICE_TINT.facility,
    media: "plan",
    headline: "Every facility.\nOne accountable partner.",
    lede: "One agreement and one contact for the services, the people and the reporting a building depends on.",
    scenes: [
      {
        marker: "Facility services",
        title: "One line for\nthe whole building.",
        body: "Cleaning, maintenance, reception, waste, grounds and seasonal work, with security through licensed partners.",
        notes: [
          "Reception and waste",
          "Grounds and seasonal",
          "Security via partners",
        ],
        media: "plan",
      },
      {
        marker: "Staffing",
        title: "The right people,\nwhen you need them.",
        body: "Temporary or permanent staff across construction, logistics, industry, cleaning and hospitality.",
        notes: [
          "Temporary or permanent",
          "Screened and briefed",
          "Scaled to demand",
        ],
        media: "pulse",
      },
      {
        marker: "Construction & maintenance",
        title: "Trades and repairs,\ncovered.",
        body: "Labour, demolition, plastering, painting, flooring, carpentry, plumbing, electrical, insulation and renovation, plus routine repairs.",
        notes: [
          "General and finishing trades",
          "Renovation and insulation",
          "Routine repairs",
        ],
        media: "converge",
      },
      {
        marker: "Project support",
        title: "Managed, not\njust supplied.",
        body: "Supervisors, resource and schedule planning, hours, productivity tracking, clear reporting and instant replacement.",
        notes: [
          "Supervision and planning",
          "Hours and productivity",
          "Instant replacement",
        ],
        media: "telemetry",
      },
      {
        marker: "Operational partner",
        title: "One point of\ncontact.",
        body: "Safety equipment, on site coordination and daily or weekly digital reports, invoiced through a single agreement.",
        notes: [
          "Single point of contact",
          "Digital reporting",
          "One invoice",
        ],
        media: "drift",
      },
    ],
    contactPrompt: "Tell us about the facility.",
  },
];

export const serviceById = (id: ServiceId): Service =>
  SERVICES.find((s) => s.id === id)!;

/* ------------------------------------------------------------------ */
/* Contact journeys                                                    */
/* ------------------------------------------------------------------ */

export type StepKind = "single" | "multi" | "text" | "details";

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

export interface Step {
  id: string;
  kind: StepKind;
  prompt: string;
  /** Shown small under the prompt. One short line only. */
  help?: string;
  options?: Option[];
  placeholder?: string;
  optional?: boolean;
}

const DETAILS_STEP: Step = {
  id: "details",
  kind: "details",
  prompt: "Who should we speak with?",
  help: "We only use these details to respond to this request.",
};

export const JOURNEYS: Record<ServiceId, Step[]> = {
  transportation: [
    {
      id: "cargo",
      kind: "single",
      prompt: "What needs to be transported?",
      options: [
        { value: "documents", label: "Documents and small parcels" },
        { value: "goods", label: "Goods and pallets" },
        { value: "equipment", label: "Equipment and materials" },
        { value: "internal", label: "Movement between our own sites" },
        { value: "other", label: "Something else" },
      ],
    },
    {
      id: "pattern",
      kind: "single",
      prompt: "Is this scheduled, recurring or on demand?",
      options: [
        { value: "fixed", label: "Fixed schedule", hint: "Same route, same times" },
        { value: "recurring", label: "Recurring, flexible windows" },
        { value: "ondemand", label: "On demand" },
        { value: "mixed", label: "A mix of both" },
      ],
    },
    {
      id: "area",
      kind: "single",
      prompt: "Where does the operation take place?",
      options: [
        { value: "city", label: "Within one city" },
        { value: "randstad", label: "Randstad region" },
        { value: "national", label: "Nationwide in the Netherlands" },
        { value: "crossborder", label: "Cross border" },
      ],
    },
    {
      id: "frequency",
      kind: "single",
      prompt: "How often is the service required?",
      options: [
        { value: "daily", label: "Daily" },
        { value: "weekly-multi", label: "Several times a week" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly or less" },
      ],
    },
    {
      id: "timing",
      kind: "single",
      prompt: "What timing matters most?",
      options: [
        { value: "sameday", label: "Same day" },
        { value: "nextday", label: "Next day" },
        { value: "window", label: "Fixed time windows" },
        { value: "flexible", label: "Flexible" },
      ],
    },
    {
      id: "handling",
      kind: "multi",
      prompt: "Any handling or access requirements?",
      help: "Select everything that applies.",
      options: [
        { value: "fragile", label: "Fragile" },
        { value: "temperature", label: "Temperature sensitive" },
        { value: "heavy", label: "Heavy or oversized" },
        { value: "restricted", label: "Restricted access site" },
        { value: "proof", label: "Proof of delivery" },
        { value: "representation", label: "Client facing handover" },
      ],
    },
    DETAILS_STEP,
  ],
  cleaning: [
    {
      id: "property",
      kind: "single",
      prompt: "What type of property needs service?",
      options: [
        { value: "office", label: "Office" },
        { value: "commercial", label: "Commercial property" },
        { value: "warehouse", label: "Warehouse or logistics" },
        { value: "institution", label: "Healthcare or institution" },
        { value: "retail", label: "Retail" },
        { value: "portfolio", label: "Mixed portfolio" },
      ],
    },
    {
      id: "size",
      kind: "single",
      prompt: "Roughly how large is the location?",
      options: [
        { value: "s", label: "Up to 250 m2" },
        { value: "m", label: "250 to 1.000 m2" },
        { value: "l", label: "1.000 to 5.000 m2" },
        { value: "xl", label: "Over 5.000 m2" },
        { value: "multi", label: "Several locations" },
      ],
    },
    {
      id: "commitment",
      kind: "single",
      prompt: "Is this recurring or one time?",
      options: [
        { value: "recurring", label: "Recurring agreement" },
        { value: "onetime", label: "One time" },
        { value: "project", label: "Project based" },
        { value: "exploring", label: "Still deciding" },
      ],
    },
    {
      id: "frequency",
      kind: "single",
      prompt: "What frequency do you have in mind?",
      options: [
        { value: "daily", label: "Daily" },
        { value: "five", label: "Five days a week" },
        { value: "few", label: "Two or three times a week" },
        { value: "weekly", label: "Weekly" },
        { value: "periodic", label: "Periodic deep clean" },
      ],
    },
    {
      id: "areas",
      kind: "multi",
      prompt: "Any special areas or requirements?",
      help: "Select everything that applies.",
      options: [
        { value: "sanitary", label: "Sanitary facilities" },
        { value: "kitchen", label: "Kitchen and pantry" },
        { value: "glass", label: "Glass and facade" },
        { value: "floors", label: "Floor treatment" },
        { value: "controlled", label: "Controlled or technical areas" },
        { value: "waste", label: "Waste separation" },
        { value: "consumables", label: "Consumables supply" },
      ],
    },
    {
      id: "hours",
      kind: "single",
      prompt: "Which working hours should we respect?",
      options: [
        { value: "before", label: "Before office hours" },
        { value: "after", label: "After office hours" },
        { value: "during", label: "During office hours" },
        { value: "night", label: "Night" },
        { value: "weekend", label: "Weekend" },
      ],
    },
    DETAILS_STEP,
  ],
  facility: [
    {
      id: "facilityType",
      kind: "single",
      prompt: "What type of facility is involved?",
      options: [
        { value: "office", label: "Office building" },
        { value: "park", label: "Business park" },
        { value: "warehouse", label: "Warehouse" },
        { value: "retail", label: "Retail location" },
        { value: "institution", label: "Institution" },
        { value: "portfolio", label: "Mixed portfolio" },
      ],
    },
    {
      id: "locations",
      kind: "single",
      prompt: "How many locations need support?",
      options: [
        { value: "1", label: "One" },
        { value: "2-5", label: "Two to five" },
        { value: "6-20", label: "Six to twenty" },
        { value: "20+", label: "More than twenty" },
      ],
    },
    {
      id: "scope",
      kind: "multi",
      prompt: "Which areas need managing?",
      help: "Select everything that applies.",
      options: [
        { value: "technical", label: "Technical maintenance" },
        { value: "cleaning", label: "Cleaning coordination" },
        { value: "transport", label: "Transport and logistics" },
        { value: "security", label: "Security coordination" },
        { value: "waste", label: "Waste management" },
        { value: "reception", label: "Reception and hospitality" },
        { value: "vendors", label: "Vendor management" },
      ],
    },
    {
      id: "horizon",
      kind: "single",
      prompt: "Is the need ongoing, transitional or urgent?",
      options: [
        { value: "ongoing", label: "Ongoing partnership" },
        { value: "transition", label: "Transition period" },
        { value: "urgent", label: "Urgent cover" },
        { value: "exploring", label: "Exploring options" },
      ],
    },
    {
      id: "challenges",
      kind: "multi",
      prompt: "What is not working today?",
      help: "Select everything that applies.",
      options: [
        { value: "suppliers", label: "Too many separate suppliers" },
        { value: "quality", label: "Inconsistent quality" },
        { value: "response", label: "Slow response" },
        { value: "reporting", label: "No clear reporting" },
        { value: "cost", label: "Rising cost" },
        { value: "compliance", label: "Compliance and documentation" },
      ],
    },
    {
      id: "coverage",
      kind: "single",
      prompt: "What coverage do you expect?",
      options: [
        { value: "office", label: "Office hours" },
        { value: "extended", label: "Extended hours" },
        { value: "always", label: "Around the clock" },
        { value: "planned", label: "Planned visits only" },
      ],
    },
    DETAILS_STEP,
  ],
};

/* ------------------------------------------------------------------ */
/* Main journey scenes                                                 */
/* ------------------------------------------------------------------ */

export const VALUES = [
  { word: "Reliability", line: "We do what we commit to." },
  { word: "Professionalism", line: "Prepared, presentable, briefed." },
  { word: "Excellence", line: "The standard holds in month twelve." },
  { word: "Sustainability", line: "Less waste, by method not by claim." },
  { word: "Respect", line: "For your time, place, people and culture." },
  { word: "Innovation", line: "Technology where it improves the service." },
  { word: "Readiness", line: "Prepared before the need becomes urgent." },
] as const;

export const WHY_ORYX = [
  { title: "Always ready.", line: "Capacity planned before you need it." },
  { title: "Reliable by design.", line: "Structure, not individual heroics." },
  { title: "Professional in every detail.", line: "The small things are the service." },
  { title: "Technology supported.", line: "Coordination you can see." },
  { title: "Sustainability conscious.", line: "Efficient operations waste less." },
  { title: "Human when it matters.", line: "A person answers, and stays with it." },
] as const;

export const PROCESS = [
  {
    index: "01",
    title: "Understand",
    line: "Understand your operation.",
    body: "We walk the site, map the day and learn what actually causes friction.",
  },
  {
    index: "02",
    title: "Design",
    line: "Build the right service model.",
    body: "Scope, standard, schedule and coverage, written down before anything starts.",
  },
  {
    index: "03",
    title: "Activate",
    line: "Coordinate people, schedules and standards.",
    body: "Teams briefed, routes set, one contact named. The first week is planned, not improvised.",
  },
  {
    index: "04",
    title: "Improve",
    line: "Monitor, communicate and continuously improve.",
    body: "Structured checks and clear reporting turn small observations into permanent adjustments.",
  },
] as const;

export const OPERATIONAL_WORDS = [
  "Time",
  "People",
  "Movement",
  "Quality",
  "Facilities",
  "Communication",
  "Readiness",
] as const;
