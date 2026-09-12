/**
 * Renovation — the ORYX property-care catalogue.
 *
 * Transcribed from the ORYX source document *Property Care / Structure* (22pp),
 * an extract of the real ORYX website copy files. Every count here was parsed
 * from that PDF and checked against the document's own summary table: nine
 * services and sixty-five works, of which twelve carry an explicit condition —
 * eight on a project basis and four requiring a qualified party.
 *
 * ── Why this file is called renovation and the document is not ───────
 * The source describes a whole service line, branded *ORYX Property Care* in
 * English and *ORYX Vastgoedzorg* in Dutch, of which renovation is one service
 * of nine. The client's decision is that this world keeps the name Renovation,
 * so the module is named for the world it feeds. The service-line brand is
 * deliberately NOT introduced in navigation: which of the two names is the
 * registered one is an open item in the source, and putting an unconfirmed
 * second brand beside "Renovation" would invent a naming problem the document
 * is still trying to resolve. The positioning line carries the real breadth
 * instead — maintenance, renovation and heritage restoration.
 *
 * ── Two axes, again, but only one of them has data ───────────────────
 * The document opens the same way the Workforce one does: service → work
 * package → work nests, and *delivery status* sits on a separate axis
 * describing who may execute a work and under what condition.
 *
 * The difference is that the status axis here is mostly empty. The publication
 * rule demands one operational status per service, and the source assigns an
 * explicit label to **one service of nine** — it lists the other eight as an
 * open item awaiting confirmation. So a status is carried here only where the
 * source states one: on the twelve conditional works, and on service 08 as a
 * whole. Nothing infers a status, and in particular an unmarked work must
 * never be presented as "delivered directly" — that is a claim the source has
 * not made and one the publication gate blocks by name.
 *
 * ── The line that must not be blurred ────────────────────────────────
 * "ORYX Property Care delivers and coordinates complete work packages and
 * projects — the client has work delivered. ORYX Workforce supplies
 * tradespeople, project teams and temporary capacity managed by the client.
 * The cross-link between them is people, not contracted works." The source is
 * explicit that the two must never be blurred on the site, which is why this
 * page carries a cross-link to Workforce and why it does not reuse that
 * world's shapes.
 *
 * ── Statuses ─────────────────────────────────────────────────────────
 * `s` is omitted for a work the source leaves unconditioned, which is most of
 * them. Otherwise:
 *   'project'   — available on a project basis, after property, risk, partner
 *                 and qualification checks.
 *   'qualified' — delivered or supervised only by demonstrably competent and
 *                 qualified parties where required.
 */

/* ── Axis two: how the work is delivered ─────────────────────────────
   The document's three delivery statuses, quoted. Only the second and third
   appear against any work; the first is here because the axis is a set of
   three and printing two of them would misrepresent it. The internal
   "before publication, confirm…" instructions that follow each one in the
   source are deliberately not carried over — they are notes to ORYX, not
   copy for a visitor. */
export const statuses = [
  { n: '01', k: 'Delivered directly', fit: 'Work packages ORYX executes and coordinates with its own capacity.' },
  { n: '02', k: 'Available on a project basis', fit: 'Confirmed per project, not offered as a standing service.', d: 'Released after property, risk, partner and qualification checks.' },
  { n: '03', k: 'Through a demonstrably qualified specialist', fit: 'Regulated or certified work that must not be presented as a standard service.', d: 'Delivered or supervised only by competent and qualified parties where required.' },
]

/* ── The catalogue ───────────────────────────────────────────────────
   All nine, as one catalogue. The source's own site architecture gives seven
   of them a "service card" and five a URL, and flags both gaps as open items —
   but those are questions about a multi-page site. On one page they are simply
   nine services, which is also the client's instruction. */
export const services = [
  {
    id: 'property-check',
    no: '01',
    name: 'ORYX Property Check',
    sub: 'Turn a loose request into a property picture, risks, scenarios and a deliverable plan.',
    /* PENDING SIGN-OFF — assembled from the gate's safe wording, not quoted. */
    note: 'Condition insight appropriate to the brief.',
    works: [
      { t: 'Property assessment', d: 'Building, use, complaints, defects, risks and urgent measures.' },
      { t: 'Condition & maintenance', d: 'Maintenance need, priorities and support for long-term maintenance planning.' },
      { t: 'Energy & comfort', d: 'Insulation, ventilation, moisture, temperature, noise and occupant experience.' },
      { t: 'Constraints', d: 'Early check of permits, heritage status, asbestos, ecology and access.' },
      { t: 'Scenarios', d: 'Maintain, improve and transform — with scope, phasing and budget range.' },
      { t: 'Delivery plan', d: 'Work package, programme, resident/user approach, qualifications and evidence.' },
      { t: 'Property record', d: 'Photos, findings, decisions and the starting point for the ORYX Property Passport.' },
    ],
  },
  {
    id: 'responsive-void',
    no: '02',
    name: 'Responsive & void maintenance',
    sub: 'Repair quickly, hand over safely and manage vacant or changing occupancy.',
    /* PENDING SIGN-OFF — assembled from the gate's safe wording, not quoted. */
    note: 'Emergency support by property and service level.',
    works: [
      { t: 'Repair & response', d: 'Repair requests; leak, water, storm and break-in damage; minor carpentry, masonry, painting and tiling; locks and ironmongery.' },
      { t: 'Bathroom, kitchen & WC', d: 'Local repairs to sanitaryware, tiles, sealants, furniture, connections and finishes.' },
      { t: 'Void / changeover', d: 'Assessment, repairs, clean-safe-sound standard, pre-handover and final handover.' },
      { t: 'Vacancy', d: 'Temporary security, isolation, inspection rounds, loss prevention and readiness for new use.' },
      { t: 'Damage coordination', d: 'Cause, emergency action, repair route, evidence and coordination with relevant parties.' },
    ],
  },
  {
    id: 'planned-major',
    no: '03',
    name: 'Planned & major maintenance',
    sub: 'Coordinate maintenance to the envelope, roof, structure and common areas.',
    note: 'ORYX does not sell a disconnected list of trades; it offers a coordinated work package with one scope, programme and handover record.',
    works: [
      { t: 'Paint & timber', d: 'Internal/external painting, timber repair, frames, windows, doors and protective systems.' },
      { t: 'Façade & concrete', d: 'Façade cleaning, brickwork, pointing, crack repair, concrete repair, balconies, galleries and sealants.' },
      { t: 'Roof & drainage', d: 'Pitched and flat roofs, details, gutters, rainwater systems and lead, zinc or copperwork.' },
      { t: 'Glass & airtightness', d: 'Glass replacement, insulating glazing, sealants, junction details and airtightness measures.' },
      { t: 'Metal & coatings', d: 'Steel components, railings, stairs, corrosion protection and specialist coatings.' },
      { t: 'Common areas', d: 'Entrances, stairwells, stores, corridors and shared facilities.' },
      { t: 'Annual/long-term plan', d: 'Bundling, phasing, budget control, quality assurance and recurring maintenance.' },
      { t: 'Monitoring', d: 'Periodic inspection, failure data and condition information supporting risk-based maintenance.' },
    ],
  },
  {
    id: 'interiors',
    no: '04',
    name: 'Interiors, kitchens, bathrooms & WCs',
    sub: 'A distinct service category for occupied renovation, voids and change of use.',
    note: 'Occupied delivery. Programme by home, room or user. Clear access, daily schedule and contact person. Control of dust, noise, outages and unsafe conditions. Working temporary facilities where agreed in advance.',
    works: [
      { t: 'Kitchen, bathroom & WC', d: 'Replacement or renovation of units, sanitaryware, tiling, ceilings, connections and finishes.' },
      { t: 'Walls, ceilings & floors', d: 'Plastering, tiling, painting, wall finishes, ceilings, subfloors and specialist flooring systems.' },
      { t: 'Carpentry', d: 'Internal frames, doors, stairs, boxing, trims, skirting and bespoke work.' },
      { t: 'Layout', d: 'Non-load-bearing partitions, ceilings and flexible or demountable fit-out.' },
      { t: 'Accessibility', d: 'Measures supporting lifetime use, routes, thresholds and facilities.' },
      { t: 'Comfort & safety', d: 'Acoustic measures and fire-safety improvements subject to appropriate design and delivery control.', s: 'qualified' },
    ],
  },
  {
    id: 'renovation-energy',
    no: '05',
    name: 'Renovation & energy improvement',
    sub: 'Combine technical improvement with comfort, health and energy performance.',
    /* PENDING SIGN-OFF — assembled from the gate's safe wording, not quoted. */
    note: 'Energy-performance and permit requirements depend on the intervention. Scenario with expected effects; no guarantee.',
    works: [
      { t: 'Building envelope', d: 'Roof, wall, floor and cavity insulation; junction details; thermal bridges and airtightness.' },
      { t: 'Frames & glazing', d: 'Repair or replacement of frames, high-performance glazing and draught sealing.' },
      { t: 'Ventilation & indoor climate', d: 'Ventilation improvement, moisture/mould action after root-cause review, comfort and healthy air.' },
      { t: 'Building services', d: 'Heating, heat pumps, controls, PV and MEP systems through appropriate technical competence.', s: 'qualified' },
      { t: 'Portfolio delivery', d: 'Block, complex or portfolio programmes with phasing and occupied works.' },
      { t: 'Circularity', d: 'Retention, reuse, design for disassembly and bio-based materials where technically and commercially suitable.' },
      { t: 'Climate adaptation', d: 'Rainwater disconnection, water buffering, green/blue roofs, heat mitigation and nature-inclusive measures.' },
      { t: 'Performance', d: 'Measures tied to property objective, energy requirements, comfort, risk and maintenance strategy.' },
    ],
  },
  {
    id: 'conversion',
    no: '06',
    name: 'Conversion & adaptive reuse',
    sub: 'Prepare existing property for a new function or layout.',
    note: 'Feasibility and risk first. Scope, programme and delivery second.',
    works: [
      { t: 'Change of use', d: 'Office-to-residential, care, education, retail or another use class.' },
      { t: 'New layout', d: 'Subdivision, combination, self-contained units, circulation and service routes.' },
      { t: 'Extension', d: 'Vertical extension, additions, intensification or better use of existing volume.' },
      { t: 'Structural', d: 'Openings, floors, load-bearing structure and foundations after calculation and competent review.', s: 'qualified' },
      { t: 'Technical', d: 'Envelope, fire safety, acoustics, building services, accessibility and energy performance.' },
      { t: 'Flexible use', d: 'Demountable, reusable and reversible fit-out for future change.' },
      { t: 'Integrated delivery', d: 'Renovation, energy improvement, user communication and handover in one project route.' },
    ],
  },
  {
    id: 'heritage',
    no: '07',
    name: 'Heritage restoration',
    sub: 'Protect cultural value through a careful, evidence-based process.',
    note: 'Works to protected heritage may require permission and a demonstrably competent conservation partner. ORYX confirms the delivery model only after reviewing the property and requirements.',
    works: [
      { t: 'Research & significance', d: 'Historic-building research or heritage significance assessment through appropriate specialists.', s: 'qualified' },
      { t: 'Planning', d: 'Heritage inspection, conservation strategy, permit route, trials and phasing.' },
      { t: 'Timber & structure', d: 'Historic roofs, trusses, frames, windows, doors and timber joints.' },
      { t: 'Masonry & stone', d: 'Historic masonry, pointing, lime mortar, natural stone and restrained repair.' },
      { t: 'Roof, glass & metal', d: 'Historic roof coverings, glazing, lead, zinc, copper, railings and ornaments.' },
      { t: 'Finishes', d: 'Historic decoration, paint analysis, plasterwork, mouldings and decorative elements.' },
      { t: 'Sustainable conservation', d: 'Energy improvement, adaptive reuse and long-term maintenance respectful of heritage significance.' },
    ],
  },
  {
    id: 'specialist',
    no: '08',
    name: 'Specialist and regulated works',
    sub: 'One safe access point for expertise that must not be presented as a standard service.',
    note: '',
    /* The one service the source gives an explicit status. Every work
       under it is on a project basis, so the condition is carried once
       here rather than repeated eight times. */
    cond: 'project',
    works: [
      { t: 'Asbestos & hazardous materials', d: 'Survey, removal or management only within the applicable certification and safety chain.', s: 'project' },
      { t: 'Chromium VI & lead', d: 'Risk assessment, control measures and specialist delivery after investigation.', s: 'project' },
      { t: 'Structure & foundations', d: 'Inspection, calculation, repair design and delivery through suitable competence.', s: 'project' },
      { t: 'Fire safety', d: 'Assessment, fire stopping, compartmentation and records with the correct scope and evidence.', s: 'project' },
      { t: 'Access at height', d: 'Scaffold, MEWP, rope access or other access based on task risk and competent delivery.', s: 'project' },
      { t: 'Concrete & coatings', d: 'Specialist repair and protection systems following substrate and system selection.', s: 'project' },
      { t: 'Ecology & species plans', d: 'Protected species, nature-inclusive renovation and management plans through expert review.', s: 'project' },
      { t: 'Inspection technology', d: 'Thermography, moisture testing, leak detection, drone or other appropriate method.', s: 'project' },
    ],
  },
  {
    id: 'project-management',
    no: '09',
    name: 'Project, resident & stakeholder management',
    sub: 'One route for planning, communication, disruption, quality, records and aftercare.',
    note: 'One point of contact. No fragmented accountability.',
    works: [
      { t: 'Project leadership', d: 'One accountable contact route, scope, programme, meetings and decision log.' },
      { t: 'Residents/users', d: 'Audience-appropriate and, where needed, multilingual communication, appointments and contact.' },
      { t: 'Disruption control', d: 'Programme by unit, access, temporary measures and the ORYX Disruption Meter.' },
      { t: 'Partners', d: 'Selection, scope, qualification review, coordination and performance management.' },
      { t: 'Quality & safety', d: 'Hold points, deviations, corrective actions, photographs and evidence-based release.' },
      { t: 'Progress', d: 'Compact dashboard covering programme, status, risk, decisions and handover items.' },
      { t: 'Service & digital', d: 'Reports, appointments, status updates and feedback through a service line or resident environment once operational.' },
      { t: 'Handover', d: 'Pre-handover, final handover, snags, warranties, manuals and maintenance advice.' },
      { t: 'Aftercare', d: 'Reporting route, evaluation and return visits under the agreed service level.' },
    ],
  },
]

/* ── The method ──────────────────────────────────────────────────────
   Seven steps. The claim the source makes about them is the interesting part
   and is worth keeping visible: "The route is the same whatever the service;
   only the scope of step three changes." */
export const route = [
  { n: '01', k: 'Property Check', d: 'Define the property, use, issue, ambition and risks.' },
  { n: '02', k: 'Three scenarios', d: 'Maintain, improve or transform.' },
  { n: '03', k: 'ORYX delivery plan', d: 'Scope, phasing, communication, budget and evidence.' },
  { n: '04', k: 'Qualification review', d: 'Partners, people, systems, permits and documents.' },
  { n: '05', k: 'Delivery with property control', d: 'Progress, disruption, quality, safety and change.' },
  { n: '06', k: 'Evidence-based handover', d: 'Inspections, snags, warranties and a complete record.' },
  { n: '07', k: 'Aftercare & forward plan', d: 'Evaluation, reporting route and future maintenance moments.' },
]

/* ── The two named methods ───────────────────────────────────────────
   ⚠ These names are approved for immediate use *as methods*. The source is
   equally explicit about the limit: "Do not claim software functionality,
   real-time dashboards or measurement accuracy until the process is
   technically implemented." So they may be named and described, and must not
   be presented as a product, a portal or a live dashboard.

   `nl` is the Dutch name. Whether a proprietary name should be translated at
   all is an open item in the source — both are carried so the decision is a
   data edit rather than a rewrite. */
export const tools = [
  { k: 'ORYX Property Passport', nl: 'Objectpaspoort', d: 'Digital history containing inspections, photos, works, materials, decisions, warranties and future maintenance.' },
  { k: 'ORYX Disruption Meter', nl: 'Hindermeter', d: 'Early view of likely impact on residents, staff or operations by scenario and phase.' },
]

/* ── Who arrives, and what they ask first ────────────────────────────
   Six audiences, each with a different opening question. */
export const clients = [
  { k: 'Housing associations', d: 'Estate maintenance, voids, occupied renovation and energy improvement.' },
  { k: 'Owners\' associations & managers', d: 'Long-term planning, maintenance, damage, energy improvement and resident coordination.' },
  { k: 'Municipal, care & education', d: 'Continuity, safety, user disruption and phased renovation.' },
  { k: 'Commercial property', d: 'Availability, appearance, tenant change, operation and conversion.' },
  { k: 'Contractors & developers', d: 'Work packages, renovation teams, partner control and handover.' },
  { k: 'Heritage owners', d: 'Research, planning, specialist restoration and long-term conservation.' },
]

/* ── The five questions ──────────────────────────────────────────────
   The source's own framing: "Answers written to close the gap between promise
   and evidence." Every one of them narrows a claim rather than widening it,
   which is why they can be published while the claims matrix below is still
   unresolved. */
export const faq = [
  /* PENDING SIGN-OFF — the source answer published the blocked
     direct-delivery claim; this uses the gate's approved wording. */
  { q: 'Does ORYX deliver everything directly?', a: 'ORYX organises delivery, combining its own coordination with fixed partners; specialist works use demonstrably qualified parties.' },
  { q: 'Can works proceed in occupied buildings?', a: 'Yes, where suitable phasing, communication and disruption controls are feasible.' },
  { q: 'Does ORYX work on heritage assets?', a: 'On a project basis, after significance, permission and competence checks.' },
  { q: 'Is emergency maintenance available?', a: 'By region and property after confirmation of the agreed service level.' },
  { q: 'How does a project start?', a: 'With the Property Check and a personal conversation about property, objective, risk and programme.' },
]

/* ── The publication gate ────────────────────────────────────────────
   Eight claims, none of which may be published in full until the evidence in
   `check` is supplied. `safe` is the wording the source itself supplies for
   the site in the meantime — which makes this gate unusually workable: there
   is an approved sentence for every blocked claim rather than only a
   prohibition.

   `check` is an internal to-do and is NOT rendered. It is kept here so that
   the condition attached to each safe sentence is visible to whoever edits
   this file, and so the day the evidence arrives it is obvious what changes.

   Highest exposure, per the source: any 24/7 or emergency promise; the RGS,
   VGO-keur, ERM and NEN 2767 references, which are registers held by an
   entity whose scope and validity must be confirmed first; and any savings or
   performance figure, which must always be a scenario and never a guarantee. */
export const gate = [
  {
    claim: 'Direct delivery',
    check: 'Work package, region, capacity, equipment and accountable entity.',
    safe: 'ORYX organises delivery.',
  },
  {
    claim: '24/7 or emergency',
    check: 'On-call rota, triage, service area, materials, SLA and escalation.',
    safe: 'Emergency support by property and service level.',
  },
  {
    claim: 'RGS / VGO certification',
    check: 'Register, entity, scope, validity and project role.',
    safe: 'Outcome-led where appropriate; no certification claim.',
  },
  {
    claim: 'ERM / conservation',
    check: 'Recognised party, guideline, scope, permission and evidence.',
    safe: 'Through a demonstrably competent conservation partner.',
  },
  {
    claim: 'NEN 2767',
    check: 'Competent inspector, method, scope and reporting.',
    safe: 'Condition insight appropriate to the brief.',
  },
  {
    claim: 'Asbestos',
    check: 'Certification chain, register, client duties and safety plan.',
    safe: 'Through a certified specialist where required.',
  },
  {
    claim: 'Savings/performance',
    check: 'Baseline, calculation, assumptions and measurement period.',
    safe: 'Scenario with expected effects; no guarantee.',
  },
  {
    claim: 'Client logo/case',
    check: 'Written consent, accuracy, privacy and publication period.',
    safe: 'Anonymised case.',
  },
]

/* Computed rather than typed, so they cannot drift from the data above. */
export const totals = {
  services: services.length,
  works: services.reduce((n, s) => n + s.works.length, 0),
  conditional: services.reduce((n, s) => n + s.works.filter((w) => w.s).length, 0),
}
