/**
 * Workforce — sectors, groups and roles.
 *
 * Transcribed from the ORYX source document *Workforce / Structure* (37pp),
 * which is an extract of the real ORYX website copy files rather than a
 * proposal. Every count here was parsed from that PDF and checked against the
 * document's own summary table: 43 groups and 315 role records across 14
 * sectors, with statuses 263 published / 37 on request / 7 qualification
 * check / 8 blocked.
 *
 * ── Two axes, not one hierarchy ──────────────────────────────────────
 * The document opens by rejecting the reading its own shape invites. Sector →
 * group → role genuinely nests. **Service line does not.** It is a separate
 * axis describing *how* a role is delivered — the same occupation supplied as
 * temporary staffing, as secondment, as a permanent placement, or inside a
 * project team. The occupation does not change; the contract does.
 *
 * That is why `serviceLines` below is a sibling of `sectors` and not a field
 * inside it, and why the page draws the two as crossing axes rather than
 * stacking one under the other.
 *
 * ── One role, one source record — an unmet rule ──────────────────────
 * Roles live in `roles` keyed by id and a group holds *ids*, not copies, which
 * is the shape the source's "one role, one source record" rule asks for.
 *
 * The source data does not actually satisfy that rule. Five occupations appear
 * in two sectors each — Groundworker and Paver in Property and Infrastructure,
 * Dismantling operative in Property and Waste, Machine operator and Process
 * operator in Technical and Manufacturing — and every one of them is written
 * twice, with different wording and different capitalisation. Sector 03's
 * Groundworker does "Excavation, backfilling, drainage, cables and utilities";
 * sector 06's does "Trenches, excavations, cables, utilities, drainage,
 * compaction and excavator support." That is exactly the drift the rule exists
 * to prevent, and it is already in the copy files.
 *
 * Both copies therefore ship verbatim under sector-qualified ids
 * (`groundworker--property`, `groundworker--infrastructure`). Merging them
 * would mean choosing which of two source sentences is correct, which is an
 * editorial decision belonging to ORYX and not to this file.
 *
 * Consequence for the page: it must NOT claim that a role is stored once and
 * tagged across sectors. That is a true statement about the intended database
 * and a false one about this data. The two-axes argument does not rest on it —
 * it rests on service line being orthogonal to sector, which is true.
 *
 * ── Two sectors are deliberately absent ──────────────────────────────
 * The source has fourteen; this has twelve.
 *
 *  · **08 Security & Supervision** — all eight roles are BLOCKED in the source,
 *    pending an evidenced Wpbr route. Wpbr is the Dutch private-security
 *    licensing act; supplying security staff without it is not a marketing
 *    problem but an offence.
 *  · **14 Automotive & Mobility** — no copy file exists. The source lists it
 *    with 0 groups and 0 roles and flags it as an open question.
 *
 * They are *cut*, not flagged or hidden behind a feature switch, because a
 * switch is something a future edit can flip by accident. When Mr. Omar
 * confirms the Wpbr route, sector 08 gets added back deliberately.
 *
 * ── Statuses ─────────────────────────────────────────────────────────
 * `s` is omitted for a published role, which is most of them. Otherwise:
 *   'req' — on request. Supplied subject to confirmation.
 *   'qc'  — qualification check. The certificate is verified per assignment.
 *
 * These are not badges. They mean *not confirmed available*, and the page must
 * never render them as though they were features.
 *
 * ⚠ Counts in the source are pre-review. Its governing rule is that "a role is
 * published only where ORYX can demonstrably recruit, select and support it",
 * and it states the numbers are expected to reduce after the availability and
 * evidence check — which has not yet run. Nothing on the page may present
 * these as an availability guarantee.
 */

/* ── Axis two: how capacity is delivered ─────────────────────────────
   Four lines, quoted from the source. Every role above can be supplied
   through any of them; the choice is commercial and contractual, never
   occupational. */
export const serviceLines = [
  { n: '01', k: 'Temporary staffing',        fit: 'Peaks, absence, flexible shifts and short-term deployment.', d: 'Flexible capacity aligned with the assignment and schedule.' },
  { n: '02', k: 'Secondment',                fit: 'Longer assignments, projects and continuity.',               d: 'Skilled people for an agreed period and scope.' },
  { n: '03', k: 'Recruitment & selection',   fit: 'The candidate joins the employer directly.',                 d: 'Targeted recruitment for a sustainable permanent match.' },
  { n: '04', k: 'Project teams & flex pools', fit: 'Multiple roles, sites, shifts or recurring demand.',        d: 'A scalable deployment structure with planning and quality control.' },
]

/* ── The register ────────────────────────────────────────────────────
   id: [title, description, status?] — tuples rather than objects because
   there are 307 of them and the shape never varies. */
export const roles = {
  'cleaning-operative': ['Cleaning operative', 'Routine site cleaning, washrooms, workplaces and communal areas.'],
  'mobile-cleaner-relief-worker': ['Mobile cleaner / relief worker', 'Multiple sites, open shifts and temporary cover.'],
  'housekeeping-operative': ['Housekeeping operative', 'Hotel rooms, holiday accommodation, public areas and changeover days.'],
  'hospitality-facilities-operative': ['Hospitality / facilities operative', 'Visible cleaning, guest contact and light facilities duties.'],
  'healthcare-and-hygiene-cleaner': ['Healthcare & hygiene cleaner', 'Healthcare locations where protocols, discretion and hygiene are essential.'],
  'food-high-care-cleaner': ['Food / high-care cleaner', 'Production environments with strict hygiene and documentation rules.'],
  'cleanroom-cleaner': ['Cleanroom cleaner', 'Controlled environments, subject to suitable experience and instruction.'],
  'transport-high-traffic-cleaner': ['Transport / high-traffic cleaner', 'Stations, vehicles, terminals, airports and busy public locations.'],
  'specialist-cleaner': ['Specialist cleaner', 'Deep cleaning, floors, glazing/facades, construction cleaning and periodic work.'],
  'event-cleaner': ['Event cleaner', 'Public opening hours, changeovers and rapid handover after events.'],
  'post-construction-cleaner': ['Post-construction cleaner', 'Dust-free, clean and ready-for-use handover of new-build and refurbishment projects.'],
  'construction-clean-up-final-clean-operative': ['Construction clean-up / final-clean operative', 'Pre-cleaning, light construction waste and the final clean before handover.'],
  'working-supervisor': ['Working supervisor', 'Task allocation, progress monitoring and daily coordination on site.'],
  'industrial-cleaner': ['Industrial cleaner', 'Installations, machinery, tanks, production areas and technical spaces.'],
  'industrial-cleaning-assistant': ['Industrial cleaning assistant', 'Preparation, material support, screening-off and safe clean-up work.'],
  'industrial-housekeeping-site-support': ['Industrial housekeeping / site support', 'A clean and safe plant, factory, shutdown facility or production environment.'],
  'shutdown-turnaround-worker': ['Shutdown / turnaround worker', 'Temporary reinforcement during maintenance shutdowns and turnarounds.'],
  'hogedrukspuiter-hds-hogedrukoperator-hdo': ['Hogedrukspuiter (HDS) / Hogedrukoperator (HDO)', 'High-pressure work using the method and SIR qualification required for the assignment.'],
  'industrial-cleaning-machine-operator': ['Industrial cleaning machine operator', 'Equipment operation; HDS-M or HDO-M agreed specifically in advance for SIR high-pressure work.'],
  'pressure-vacuum-assistant-dvh': ['Pressure/Vacuum Assistant (DVH)', 'SIR-trained to assist the Pressure/Vacuum Operator safely.'],
  'pressure-vacuum-operator-dvm': ['Pressure/Vacuum Operator (DVM)', 'Operating the unit, work arrangements and execution around the pressure/vacuum vehicle.'],
  'industrial-blaster-grit-blaster': ['Industrial blaster / grit blaster', 'Abrasive blasting of steel and installations; also called a sandblaster.'],
  'tank-unit-cleaner': ['Tank / unit cleaner', 'Tanks, units, containers, vessels and industrial storage environments.'],
  'cleaner-using-independent-respiratory-protection': ['Cleaner using independent respiratory protection', 'Work with breathing apparatus or an airline system, matched to risk and qualification.'],
  'adembescherming-c-ab-c': ['Adembescherming C (AB-C)', 'Official SIR qualification for specialist level-C work; demonstrable qualifications required.'],
  'industrial-fire-marshal': ['Industrial fire marshal', 'Monitors maintenance, hot work and fire-risk situations.'],
  'confined-space-attendant': ['Confined space attendant', 'Checks working conditions and monitors people working in confined spaces.'],
  'gas-analyst': ['Gas analyst', 'Carries out and records gas measurements to help validate the working environment.'],
  'decontamination-operative': ['Decontamination operative', 'Controlled cleaning of contaminated components and zones.'],
  'hogedrukspuiter-hds': ['Hogedrukspuiter (HDS)', 'High-pressure jetting under the applicable SIR guideline and agreed work method.', 'req'],
  'hogedrukoperator-hdo': ['Hogedrukoperator (HDO)', 'Manual or mechanised high-pressure work within the applicable SIR requirements.', 'req'],
  'hogedrukspuiter-machinist-hds-m': ['Hogedrukspuiter Machinist (HDS-M)', 'Machine-operator role on work corresponding to the HDS-M qualification.', 'req'],
  'hogedrukoperator-machinist-hdo-m': ['Hogedrukoperator Machinist (HDO-M)', 'Machine-operator role on work corresponding to the HDO-M qualification.', 'req'],
  'toezichthouder-hogedruk-thd': ['Toezichthouder Hogedruk (THD)', 'Supervision of high-pressure work, work method, team and agreed safety conditions.', 'req'],
  'toezichthouder-drukvacuum-tdv': ['Toezichthouder Drukvacuum (TDV)', 'Supervision of pressure/vacuum work under the applicable task and project requirements.', 'req'],
  'adembescherming-b-met-gaspak-abb-g': ['Adembescherming B met gaspak (ABB-G)', 'Gas-suit work within the relevant SIR risk category and admission requirements.', 'req'],
  'toezichthouder-adembescherming-tab': ['Toezichthouder Adembescherming (TAB)', 'Supervision of work using independent respiratory protection.', 'req'],
  'chemisch-technisch-operator-cto': ['Chemisch Technisch Operator (CTO)', 'Chemical-technical cleaning under the applicable SIR guideline.', 'req'],
  'toezichthouder-chemisch-technisch-tct': ['Toezichthouder Chemisch Technisch (TCT)', 'Supervision of chemical-technical work and agreed control measures.', 'req'],
  'catalyst-reactor-technician': ['Catalyst / Reactor Technician', 'Catalyst unloading, cleaning, inspection and reloading of reactors.', 'req'],
  'dense-loading-technician': ['Dense Loading Technician', 'Controlled, even loading of catalyst material to project method and process requirements.', 'req'],
  'supplied-air-specialist-gas-suit-worker': ['Supplied-Air Specialist / Gas- Suit Worker', 'Specialist work with independent breathing air or a gas-tight suit.', 'req'],
  'industrial-cleaning-superintendent': ['Industrial Cleaning Superintendent', 'Task allocation, permits, LMRA, safety, progress and customer coordination.', 'req'],
  'work-preparer-shutdown-planner': ['Work Preparer / Shutdown Planner', 'Workforce, equipment and work planning, work packs, access and progress.', 'req'],
  'turnaround-project-coordinator': ['Turnaround / Project Coordinator', 'Coordinates customer, execution team, planning function and safety organisation.', 'req'],
  'tank-maintenance-operative-industrial-fitter': ['Tank Maintenance Operative / Industrial Fitter', 'Dismantling, assembly and mechanical support around tanks and cleaning projects.', 'req'],
  'flange-fitter-pipefitter': ['Flange Fitter / Pipefitter', 'Mechanical project support with appropriate training, experience and work arrangements.', 'req'],
  'industrial-painter-coating-operative': ['Industrial Painter / Coating Operative', 'Preservation and coating after preparation or blasting.', 'req'],
  'working-foreman-specialist-crew': ['Working Foreman - Specialist Crew', 'Daily supervision of cleaners, operators, blasters or catalyst workers on site.', 'req'],
  'category-c-truck-driver': ['Category C truck driver', 'Rigid trucks, distribution, collection and work requiring a Category C licence.'],
  'category-ce-truck-driver': ['Category CE truck driver', 'Tractor-trailer combinations, national or international transport.'],
  'rigid-truck-driver': ['Rigid truck driver', 'Urban and regional distribution, general cargo, retail and business deliveries.'],
  'multi-drop-distribution-driver': ['Multi-drop distribution driver', 'Store, hospitality and foodservice routes with multiple delivery points.'],
  'container-terminal-driver': ['Container / terminal driver', 'Port, depot and container transport, aligned with access and experience.'],
  'shunter-yard-driver': ['Shunter / yard driver', 'Moving trailers and keeping docks available on a yard or terminal.'],
  'adr-driver': ['ADR driver', 'Dangerous goods, only with a valid qualification matched to the assignment.'],
  'loader-crane-building-materials-driver': ['Loader-crane / building materials driver', 'Delivery and unloading by crane, with required experience and evidence.'],
  'waste-collection-driver-loader': ['Waste collection driver / loader', 'Collection rounds, recycling streams and combined driving/ loading duties.'],
  'tipper-bulk-driver': ['Tipper / bulk driver', 'Raw materials, construction, infrastructure or agricultural flows.'],
  'van-driver-courier': ['Van driver / courier', 'Parcels, post, parts, groceries and business last-mile distribution.'],
  'driver-s-mate': ['Driver\'s mate', 'Loading, unloading, route support, customer contact and physical distribution work.'],
  'removals-operative-driver': ['Removals operative / driver', 'Domestic and commercial moves, assembly and careful goods handling.'],
  'category-d-bus-driver': ['Category D bus driver', 'Category D licence, valid Driver CPC/Code 95 and applicable requirements.'],
  'logistics-operative': ['Logistics operative', 'Versatile support across receiving, storage, order processing, dispatch and shipping.'],
  'warehouse-operative': ['Warehouse operative', 'Goods handling, location management, picking, packing and workplace order.'],
  'order-picker-voice-picker': ['Order picker / voice picker', 'Accurate picking by scanner, pick list or voice system.'],
  'packing-fulfilment-operative': ['Packing / fulfilment operative', 'Checking, packing, labelling, returns and shipment preparation.'],
  'inbound-goods-in-operative': ['Inbound / goods-in operative', 'Unloading, counting, checking, recording and storing incoming goods.'],
  'outbound-dispatch-operative': ['Outbound / dispatch operative', 'Consolidation, loading sequence, documentation and on-time dispatch.'],
  'cross-dock-operative': ['Cross-dock operative', 'Fast transfer, sorting and onward movement without long-term storage.'],
  'parcel-sorting-operative': ['Parcel sorting operative', 'Parcel flows, hubs, returns and peak operations.'],
  'electric-pallet-truck-operator': ['Electric pallet truck operator', 'Horizontal transport, order collection and loading after suitable instruction.'],
  'forklift-operator': ['Forklift operator', 'Pallets, receiving, storage and loading with demonstrable competence.'],
  'reach-truck-operator': ['Reach truck operator', 'Racking and high-level handling, matched to the site and truck type.'],
  'vna-combi-truck-operator': ['VNA / combi truck operator', 'Narrow-aisle and high-bay warehouses, with relevant experience.'],
  'loader-unloader': ['Loader / unloader', 'Physical goods handling, docks, containers and safe loading processes.'],
  'inventory-operative-cycle-counter': ['Inventory operative / cycle counter', 'Counts, discrepancies, location checks and records.'],
  'production-logistics-operative': ['Production logistics operative', 'Material supply, finished goods, line support and internal logistics.'],
  'working-team-leader-supervisor': ['Working team leader / supervisor', 'Task allocation, output, quality and day-to-day floor coordination.'],
  'transport-planner': ['Transport planner', 'Plans vehicles, drivers, routes and time windows and responds to disruption.', 'req'],
  'logistics-planner': ['Logistics planner', 'Coordinates capacity, volumes, dock planning, inventory or production flows.', 'req'],
  'freight-forwarder': ['Freight forwarder', 'Organises transport, documents and coordination with carriers, customers and partners.', 'req'],
  'logistics-customer-service': ['Logistics customer service', 'Monitors orders, delivery times, exceptions and customer communication.', 'req'],
  'warehouse-coordinator': ['Warehouse coordinator', 'Directs daily workflows, priorities and alignment between inbound and outbound.', 'req'],
  'logistics-supervisor-team-leader': ['Logistics supervisor / team leader', 'Monitors staffing, safety, quality and productivity.', 'req'],
  'logistics-administrator': ['Logistics administrator', 'Processes orders, transport documents, inventory movements and hours or trip data.', 'req'],
  'fleet-transport-support': ['Fleet / transport support', 'Supports planning, vehicle files, damage, passes and operational administration.', 'req'],
  'carpenter': ['Carpenter', 'Maintenance, renovation, restoration, structural work, prefab, formwork and fit-out.'],
  'painter': ['Painter', 'Maintenance, renovation, restoration, new build and spray application.'],
  'wall-covering-installer': ['Wall covering installer', 'Wallpaper, lining paper, glass-fibre wall covering and contract finishing.'],
  'glazier': ['Glazier', 'Maintenance, renovation, new build and historic glazing.'],
  'sealant-applicator': ['Sealant applicator', 'Connection joints, sealing and airtight and watertight finishing.'],
  'bricklayer': ['Bricklayer', 'New build, alterations, renovation, facade repairs and restoration.'],
  'repointing-specialist': ['Repointing specialist', 'New pointing, facade repairs, renovation and historic pointing.'],
  'roofer': ['Roofer', 'Flat and pitched roofs, maintenance, renovation, new build and restoration.'],
  'cladding-installer': ['Cladding installer', 'Facade systems, curtain walling, panels, repairs and energy upgrades.'],
  'window-and-door-installer': ['Window and door installer', 'Installation, replacement, alignment, hanging and finishing.'],
  'concrete-worker': ['Concrete worker', 'Reinforcement, pouring, finishing and concrete structures.'],
  'concrete-repair-specialist': ['Concrete repair specialist', 'Damage repair, preparation, repair systems and protection.'],
  'timber-decay-repair-specialist': ['Timber decay repair specialist', 'Inspection, removal and durable timber repair.'],
  'demolition-worker': ['Demolition worker', 'Controlled demolition, strip-out and renovation preparation.'],
  'dismantling-operative--property': ['Dismantling operative', 'Dismantling, separation, removal and reuse.'],
  'plasterer': ['Plasterer', 'Plasterwork, repairs, levelling, walls and ceilings.'],
  'tiler': ['Tiler', 'Wall and floor tiles, bathrooms, kitchens and commercial buildings.'],
  'drywall-and-ceiling-installer': ['Drywall and ceiling installer', 'Metal stud, plasterboard, suspended ceilings and insulation.'],
  'flooring-installer': ['Flooring installer', 'Preparation, levelling, contract flooring and floor finishes.'],
  'groundworker--property': ['Groundworker', 'Excavation, backfilling, drainage, cables and utilities.'],
  'paver--property': ['Paver', 'Paving, reinstatement, external works and public realm.'],
  'construction-labourer': ['Construction labourer', 'Preparation, moving materials and general site support.'],
  'masonry-assistant': ['Masonry assistant', 'Material supply for bricklaying, paving and construction work.'],
  'site-logistics-operative': ['Site logistics operative', 'Goods receipt, storage, internal transport and material supply.'],
  'handover-operative': ['Handover operative', 'Snagging, quality repairs and ready-for-use handover.'],
  'maintenance-operative': ['Maintenance operative', 'Aftercare, repairs, voids and service work.'],
  'resident-liaison-officer': ['Resident liaison officer', 'Appointments, access, communication and aftercare.'],
  'working-foreman': ['Working foreman', 'Task allocation, supervision, quality and progress.'],
  'maintenance-technician': ['Maintenance technician', 'Plant maintenance, preventive, corrective and overhaul.'],
  'breakdown-technician': ['Breakdown technician', 'Diagnosis, fault finding, repair and restart.'],
  'service-technician': ['Service technician', 'Maintenance, repair, customer site and reporting.'],
  'mechanical-technician': ['Mechanical technician', 'Drives, pumps, bearings and conveyors.'],
  'mechatronics-technician': ['Mechatronics technician', 'Mechanical, electrical, controls and diagnostics.'],
  'machine-builder': ['Machine builder', 'Modules, assembly, alignment and drawings.'],
  'assembly-technician': ['Assembly technician', 'Components, precision assembly, final build and test.'],
  'commissioning-technician': ['Commissioning technician', 'Testing, parameters, start-up and handover.'],
  'welder': ['Welder', 'MIG/MAG, TIG, material, position and procedure.'],
  'cnc-machinist': ['CNC machinist', 'Turning, milling, programming and measurement.'],
  'electrician': ['Electrician', 'Installations, machinery, panels and cabling.'],
  'eandi-technician': ['E&I technician', 'Electrical, instrumentation, loops and faults.'],
  'instrumentation-technician': ['Instrumentation technician', 'Sensors, transmitters, calibration and loops.'],
  'refrigeration-and-climate-systems-technician': ['Refrigeration & climate systems technician', 'Refrigeration, air conditioning, heat pumps and commissioning.', 'qc'],
  'heating-and-boiler-technician': ['Heating & boiler technician', 'Boilers, heating, hot water and flue systems.', 'qc'],
  'process-operator--technical': ['Process operator', 'Process monitoring, adjustment, safety and shifts.'],
  'machine-operator--technical': ['Machine operator', 'Setting, operating, changeovers and checks.'],
  'work-planner': ['Work planner', 'Scope, materials, hours, drawings and work pack.'],
  'maintenance-planner': ['Maintenance planner', 'Work orders, capacity, materials and backlog.'],
  'maintenance-engineer': ['Maintenance engineer', 'Strategy, analysis, optimisation and data.'],
  'technical-drafter': ['Technical drafter', '2D/3D, CAD, revisions and bills of material.'],
  'technical-project-lead': ['Technical project lead', 'Scope, team, schedule, budget and progress.'],
  'mechanical-engineer': ['Mechanical engineer', 'Design, calculations, CAD and manufacturability.'],
  'electrical-engineer': ['Electrical engineer', 'Schematics, calculations, components and standards.'],
  'production-operative': ['Production Operative', 'Supports production, performs manual or machine-assisted tasks and checks own work.'],
  'assembly-operative': ['Assembly Operative', 'Builds parts or modules to instructions, drawings, sequence and quality standards.'],
  'packing-operative': ['Packing Operative', 'Packs, checks, labels and prepares products for the next production or logistics step.'],
  'sorting-operative': ['Sorting Operative', 'Sorts products or materials by quality, size, type, defect or recovery route.'],
  'materials-preparation-operative': ['Materials Preparation Operative', 'Prepares raw materials, packaging, recipes and resources for a controlled start.'],
  'batching-and-mixing-operative': ['Batching & Mixing Operative', 'Weighs, doses and mixes raw materials to recipe and recording requirements.'],
  'cleanroom-production-operative': ['Cleanroom Production Operative', 'Production, assembly or packing within defined gowning, hygiene and recording rules.'],
  'finishing-operative': ['Finishing Operative', 'Trimming, sanding, polishing, repair, rework or visual final inspection.'],
  'machine-operator--manufacturing': ['Machine Operator', 'Sets, runs and changes over a machine and handles agreed first-line deviations.'],
  'line-operator': ['Line Operator', 'Monitors an integrated line, coordinates process steps and adjusts pace and quality.'],
  'process-operator--manufacturing': ['Process Operator', 'Monitors and controls a process, records values and intervenes within operating limits.'],
  'field-operator': ['Field Operator', 'Checks plant outside the control room, completes rounds and takes samples.'],
  'control-room-operator': ['Control Room Operator', 'Monitors trends and alarms through DCS or SCADA and coordinates actions.'],
  'packaging-operator': ['Packaging Operator', 'Sets and monitors packing, filling or labelling lines including coding and sealing.'],
  'quality-controller': ['Quality Controller', 'Performs product and process checks and blocks or reports deviations to procedure.'],
  'quality-assurance-coordinator': ['Quality Assurance Coordinator', 'Supports quality systems, procedures, records, deviations, audits and improvement.'],
  'production-planner': ['Production Planner', 'Plans orders, capacity, materials and lead time and coordinates changes.'],
  'production-preparation-coordinator': ['Production Preparation Coordinator', 'Prepares work orders, instructions, materials, resources and production data.'],
  'working-production-foreperson': ['Working Production Foreperson', 'Works alongside the team and monitors pace, safety, quality and handover.'],
  'production-team-leader-shift-leader': ['Production Team Leader / Shift Leader', 'Leads a shift and monitors staffing, safety, output, quality and improvement.'],
  'groundworker--infrastructure': ['Groundworker', 'Trenches, excavations, cables, utilities, drainage, compaction and excavator support.'],
  'civil-engineering-operative': ['Civil engineering operative', 'Road foundations, drainage, gullies, kerbs, surfacing and public infrastructure.'],
  'paver--infrastructure': ['Paver', 'Installation and reinstatement of blocks, slabs, kerbs, channels and modular paving.'],
  'drainage-operative': ['Drainage operative', 'Installation, replacement and repair of drains, manholes, gullies and connections.'],
  'cable-and-duct-layer': ['Cable and duct layer', 'Installs cables, utilities and ducts and supports network and service connections.'],
  'excavator-operator': ['Excavator operator', 'Excavator, mini excavator or mobile plant, matched to task and competence.'],
  'working-foreman-infrastructure': ['Working foreman - infrastructure', 'Allocates tasks and controls progress, safety and daily coordination.'],
  'data-distribution-technician': ['Data distribution technician', 'Installs, checks and commissions parts of data and telecom networks.'],
  'fibre-technician': ['Fibre technician', 'Installation, termination, testing and handover of fibre networks.'],
  'fibre-splicer': ['Fibre splicer', 'Splices fibres, completes distribution points and records links and test results.'],
  'fibre-cable-blowing-operative': ['Fibre cable blowing operative', 'Blows cables or microcables into ducts and controls pressure and route conditions.'],
  'ftth-connection-technician': ['FTTH connection technician', 'Completes connections from network point to homes or business premises.'],
  'telecom-fault-technician': ['Telecom fault technician', 'Locates, analyses and repairs faults in telecom and data networks.'],
  'cable-testing-and-fault-specialist': ['Cable testing and fault specialist', 'Performs OTDR or other testing for diagnosis, quality and handover.'],
  'infrastructure-telecom-works-planner': ['Infrastructure / telecom works planner', 'Prepares schedules, people, materials, drawings, permits and files.', 'qc'],
  'infrastructure-telecom-site-supervisor': ['Infrastructure / telecom site supervisor', 'Directs crews, safety, quality, progress, stakeholders and subcontractors.', 'qc'],
  'telecom-route-engineer': ['Telecom / route engineer', 'Designs routes, capacity, connections, crossings and technical documentation.', 'qc'],
  'utility-information-coordinator': ['Utility-information coordinator', 'Manages Dutch KLIC utility data, risks, discrepancies and handover to field teams.', 'qc'],
  'setting-out-engineer': ['Setting-out engineer', 'Sets out levels, lines and positions and checks completed works.', 'qc'],
  'professional-traffic-controller': ['Professional traffic controller', 'Controls traffic on public roads with required exam, appointment and site instruction.'],
  'event-traffic-controller': ['Event traffic controller', 'Deployed for a specific event after the required instruction and appointment procedure.'],
  'parking-steward': ['Parking steward', 'Supports arrival, parking and routing without performing unauthorised traffic control.'],
  'traffic-controller-team-coordinator': ['Traffic-controller team coordinator', 'Plans posts, briefs the team and controls staffing and reporting.'],
  'traffic-management-operative': ['Traffic management operative', 'Delivers, installs, checks, changes and removes temporary traffic management.'],
  'traffic-management-driver': ['Traffic management driver', 'Transports equipment and supports installation and removal.'],
  'impact-protection-vehicle-driver': ['Impact protection vehicle driver', 'Operates an impact protection vehicle under the work plan and procedures.'],
  'traffic-signs-installer': ['Traffic signs installer', 'Installs, replaces and maintains temporary or permanent signs.'],
  'working-foreman-traffic-management': ['Working foreman - traffic management', 'Directs the crew and controls plan, equipment, safety and handover.', 'req'],
  'traffic-management-works-planner': ['Traffic management works planner', 'Prepares measures, equipment, schedule, permits and site delivery.', 'req'],
  'traffic-management-cad-technician': ['Traffic management CAD technician', 'Develops temporary traffic plans and phases for the assignment and road type.', 'req'],
  'traffic-management-project-coordinator': ['Traffic management project coordinator', 'Connects customer, planning, yard, delivery crews and traffic controllers.', 'req'],
  'crop-production-worker': ['Crop Production Worker', 'Plants and tends crops in field production, greenhouses, nurseries, bulbs or seed.'],
  'crop-care-worker': ['Crop Care Worker', 'Prunes, ties, side-shoots, tops, trains and checks crops to the work instruction.'],
  'harvest-worker': ['Harvest Worker', 'Harvests or picks vegetables, fruit, flowers and plants to quality and pace.'],
  'fruit-growing-worker': ['Fruit-Growing Worker', 'Pruning, thinning, tree care, harvest and orchard maintenance year-round.'],
  'nursery-worker': ['Nursery Worker', 'Propagates, plants, lifts, ties, grades and prepares trees and plants for dispatch.'],
  'flower-bulb-worker': ['Flower Bulb Worker', 'Plants, selects, lifts, processes and grades flower bulbs.'],
  'seed-and-trial-field-worker': ['Seed & Trial Field Worker', 'Supports sowing, observation, selection, harvest and records in seed and trial fields.'],
  'produce-grading-and-packing-operative': ['Produce Grading & Packing Operative', 'Checks, grades, packs and labels produce on farm or in a packhouse.'],
  'horticultural-line-operator': ['Horticultural Line Operator', 'Operates crop, grading or packing lines after suitable machine instruction.'],
  'working-foreperson-crop-production': ['Working Foreperson - Crop Production', 'Allocates work and monitors pace, quality, records and crew coordination.'],
  'livestock-farm-worker': ['Livestock Farm Worker', 'Feeds, tends and checks dairy cattle, grazing livestock, pigs, poultry or horses.'],
  'milker': ['Milker', 'Performs milking shifts and related animal and barn checks to the farm routine.'],
  'agricultural-relief-worker': ['Agricultural Relief Worker', 'Takes over agreed farm duties during illness, leave, peaks or structural support.'],
  'agricultural-machine-operator': ['Agricultural Machine Operator', 'Tractor, harvest, cultivation and other mechanised field work.'],
  'irrigation-worker': ['Irrigation Worker', 'Installs, operates and moves irrigation and monitors water and safe work zones.'],
  'agricultural-trade-and-logistics-operative': ['Agricultural Trade & Logistics Operative', 'Receipt, internal movement, storage, order processing and dispatch.'],
  'agricultural-quality-controller': ['Agricultural Quality Controller', 'Checks product, batch, records, traceability and customer specifications.'],
  'working-foreperson-agriculture': ['Working Foreperson - Agriculture', 'Coordinates workers, task allocation, progress, records and handover.'],
  'landscaper-gardener': ['Landscaper / Gardener', 'Constructs and maintains gardens and outdoor spaces.'],
  'grounds-maintenance-operative': ['Grounds Maintenance Operative', 'Maintains public and large-scale green space through mowing, pruning and planting.'],
  'mowing-machine-operator': ['Mowing Machine Operator', 'Operates mowing and maintenance machines on verges, lawns, sites and grounds.'],
  'arborist': ['Arborist', 'Plants, inspects, prunes and cares for trees.'],
  'forestry-and-conservation-operative': ['Forestry & Conservation Operative', 'Maintains woodland, nature, paths, banks and recreation areas.'],
  'groundskeeper': ['Groundskeeper', 'Maintains outdoor assets at businesses, institutions, parks and cemeteries.'],
  'sports-turf-operative': ['Sports Turf Operative', 'Maintains turf, soil, markings, irrigation and playing quality.'],
  'working-foreperson-grounds-maintenance': ['Working Foreperson - Grounds Maintenance', 'Leads the crew and monitors assets, quality, safety and progress.'],
  'agricultural-farm-manager': ['Agricultural Farm Manager', 'Manages production, people, programme, quality and results.', 'req'],
  'grounds-maintenance-supervisor': ['Grounds Maintenance Supervisor', 'Coordinates people, plant, environment, programme and contract commitments.', 'req'],
  'waste-loader': ['Waste Loader', 'Supports collection routes and works safely around vehicles, traffic and the public.'],
  'waste-management-operative': ['Waste Management Operative', 'Collects waste, supports sorting and reuse and follows acceptance arrangements.'],
  'recycling-centre-operative': ['Recycling Centre Operative', 'Guides visitors, directs waste streams and keeps the site safe and orderly.'],
  'waste-acceptance-officer': ['Waste Acceptance Officer', 'Checks incoming waste against acceptance criteria and blocks non-conforming loads.'],
  'weighbridge-operative': ['Weighbridge Operative', 'Weighs vehicles, records data and guides drivers under site and administration rules.'],
  'recycling-yard-operative': ['Recycling Yard Operative', 'Moves, separates and consolidates materials across the recycling yard.'],
  'recycling-sorter': ['Recycling Sorter', 'Separates materials manually or at a belt and removes contamination.'],
  'recycling-operative': ['Recycling Operative', 'Performs processing, handling and checking tasks within a recycling operation.'],
  'dismantling-operative--waste': ['Dismantling Operative', 'Dismantles products or equipment and separates parts for reuse or processing.'],
  'reuse-and-refurbishment-operative': ['Reuse & Refurbishment Operative', 'Checks, cleans, sorts and restores products for a safe second-use cycle.'],
  'recycling-quality-controller': ['Recycling Quality Controller', 'Checks streams and recovered materials for composition, contamination and specification.'],
  'recycling-plant-operator': ['Recycling Plant Operator', 'Sets and monitors sorting, separation, crushing, shredding or baling equipment.'],
  'waste-processing-operator': ['Waste Processing Operator', 'Monitors continuous or batch processes for waste, water, organics or energy recovery.'],
  'wheel-loader-operator': ['Wheel Loader Operator', 'Feeds plant, moves bulk streams and manages stockpiles and traffic routes.'],
  'recycling-crane-operator': ['Recycling Crane Operator', 'Sorts, loads and moves materials with a mobile crane and suitable grab.'],
  'waste-collection-planner': ['Waste Collection Planner', 'Plans routes, vehicles, staffing and changes and coordinates delivery.'],
  'working-recycling-foreperson': ['Working Recycling Foreperson', 'Works alongside the team and monitors safety, pace, quality and site order.'],
  'waste-and-recycling-team-leader': ['Waste & Recycling Team Leader', 'Leads a team or shift and monitors staffing, safety, progress and handover.'],
  'care-assistant': ['Care Assistant', 'Supports the care team with defined non-complex client, logistics and domestic duties.'],
  'care-and-wellbeing-assistant': ['Care & Wellbeing Assistant', 'Supports living, nutrition, personal care, ADL, activities and wellbeing.'],
  'verzorgende-ig-vig': ['Verzorgende IG (VIG)', 'Provides personal and selected clinical care and reports under the care plan.'],
  'registered-nurse': ['Registered Nurse', 'Assesses nursing needs and performs procedures within BIG registration and competence.'],
  'medical-assistant-gp-practice': ['Medical Assistant (GP Practice)', 'Triages within agreed limits, schedules care and performs protocol-led clinical tasks.'],
  'medical-secretary': ['Medical Secretary', 'Supports medical administration, scheduling, correspondence and records.'],
  'social-care-support-worker': ['Social Care Support Worker', 'Supports autonomy, living, daily structure, participation, behaviour and quality of life.'],
  'personal-social-care-coordinator': ['Personal Social Care Coordinator', 'Coordinates client support and aligns the client\'s network and disciplines.'],
  'social-worker': ['Social Worker', 'Supports daily functioning, participation, prevention and access to services.'],
  'youth-and-family-professional': ['Youth & Family Professional', 'Supports young people and families within professional allocation and SKJ registration.'],
  'client-support-adviser': ['Client Support Adviser', 'Helps clients clarify needs and options and supports access to care and services.'],
  'maternity-care-assistant': ['Maternity Care Assistant', 'Supports mother, baby and family after birth under the maternity-care protocol.'],
  'childcare-practitioner': ['Childcare Practitioner', 'Provides responsible childcare and supports development, care, play and structure.'],
  'senior-childcare-practitioner': ['Senior Childcare Practitioner', 'Supports children with more complex needs and contributes to plans and quality.'],
  'childcare-group-assistant': ['Childcare Group Assistant', 'Supports the group with care, domestic and organisational tasks.'],
  'home-support-worker': ['Home Support Worker', 'Supports clients at home with domestic activity, daily structure and autonomy.'],
  'care-planner': ['Care Planner', 'Plans staff and shifts and processes availability, qualifications and roster rules.'],
  'care-and-social-support-team-leader': ['Care & Social Support Team Leader', 'Leads the team and monitors quality, safety, continuity and handover.'],
  'port-operative': ['Port Operative', 'Loads, unloads, moves and checks cargo at quay or vessel to work and safety instructions.'],
  'terminal-operator': ['Terminal Operator', 'Supports yard, gate and terminal processes, inspections, scanning and records.'],
  'lasher-lashing-specialist': ['Lasher / Lashing Specialist', 'Secures or releases containers and project cargo to vessel and terminal procedures.'],
  'port-crane-operator': ['Port Crane Operator', 'Operates the appropriate port or handling crane; machine type and evidence matched first.'],
  'reach-stacker-operator': ['Reach Stacker Operator', 'Moves and stacks containers within route, capacity and terminal rules.'],
  'straddle-carrier-operator': ['Straddle Carrier Operator', 'Moves and positions containers at equipped terminals after site instruction.'],
  'terminal-tractor-driver': ['Terminal Tractor Driver', 'Moves trailers, chassis and cargo units between quay, yard and logistics zones.'],
  'inland-navigation-boatman': ['Inland Navigation Boatman', 'Deck, maintenance, mooring and cargo duties at the applicable operational level.'],
  'inland-navigation-helmsman': ['Inland Navigation Helmsman', 'Navigational and operational duties within the valid qualification and manning plan.'],
  'inland-boatmaster': ['Inland Boatmaster', 'Commands an inland vessel within the valid Union qualification and entitlement.'],
  'deck-rating-able-seafarer-deck': ['Deck Rating / Able Seafarer Deck', 'Deck, watchkeeping, mooring and maintenance duties to STCW competence and flag.'],
  'deck-officer-mate': ['Deck Officer / Mate', 'Keeps navigational watch and carries deck responsibility within valid STCW competency.'],
  'sea-going-master': ['Sea-going Master', 'Holds nautical command within STCW, flag-state and company requirements.'],
  'marine-engineer-officer': ['Marine Engineer Officer', 'Operates, maintains and monitors propulsion and technical systems.'],
  'marine-mechanic': ['Marine Mechanic', 'Installs, maintains and repairs mechanical systems onboard, at a yard or offshore.'],
  'marine-electrician': ['Marine Electrician', 'Installs, tests and maintains vessel electrical systems within authorisation.'],
  'offshore-mechanical-technician': ['Offshore Mechanical Technician', 'Maintains and installs mechanical systems on a platform, vessel or structure.'],
  'offshore-electrical-technician': ['Offshore Electrical Technician', 'Electrical maintenance, inspection and fault work within voltage and asset rules.'],
  'wind-turbine-technician': ['Wind Turbine Technician', 'Maintains or installs turbines; OEM, task, GWO modules and experience must match.'],
  'rigger': ['Rigger', 'Prepares lifting work, checks accessories and guides loads within the lift plan.'],
  'banksman-slinger-signaller': ['Banksman / Slinger Signaller', 'Slings loads and communicates with the crane operator to the lift plan and signals.'],
  'offshore-crane-operator': ['Offshore Crane Operator', 'Operates offshore lifting equipment within crane type, load chart and asset rules.'],
  'rov-pilot-technician': ['ROV Pilot Technician', 'Operates and maintains remotely operated vehicles for inspection, survey or intervention.'],
  'retail-sales-associate': ['Retail Sales Associate', 'Helps customers, presents products and closes sales in stores or counter environments.'],
  'sales-advisor': ['Sales Advisor', 'Analyses customer needs and advises on products requiring deeper product knowledge.'],
  'cashier': ['Cashier', 'Processes payments and returns accurately and supports a smooth checkout.'],
  'customer-service-desk-associate': ['Customer Service Desk Associate', 'Handles information requests, returns, complaints and service cases.'],
  'merchandiser': ['Merchandiser', 'Maintains presentation, planograms, POS materials and availability.'],
  'brand-promoter': ['Brand Promoter', 'Engages customers in stores, events or campaigns and explains product benefits.'],
  'replenishment-associate': ['Replenishment Associate', 'Replenishes and faces stock, checks availability and supports store readiness.'],
  'stocktake-assistant': ['Stocktake Assistant', 'Counts, scans and checks retail stock during inventories or correction rounds.'],
  'telesales-representative': ['Telesales Representative', 'Conducts permitted sales conversations and follows up leads by phone or video.'],
  'inside-sales-representative': ['Inside Sales Representative', 'Advises customers, prepares offers, records opportunities and manages follow-up.'],
  'lead-generation-specialist': ['Lead Generation Specialist', 'Qualifies leads and books relevant meetings for advisors or account managers.'],
  'business-development-representative-bdr-sdr': ['Business Development Representative (BDR/SDR)', 'Approaches business prospects and records handover of sales-ready leads.'],
  'field-sales-representative': ['Field Sales Representative', 'Visits prospects, identifies needs and develops opportunities in a territory.'],
  'account-manager': ['Account Manager', 'Builds relationships, develops revenue opportunities and manages commitments.'],
  'sales-support-coordinator': ['Sales Support Coordinator', 'Supports sales teams with quotations, customer data, reporting and order follow-up.'],
  'retention-specialist': ['Retention Specialist', 'Handles cancellation signals, renewals and retention within mandate.'],
  'commercial-administrator': ['Commercial Administrator', 'Processes sales orders, contract documents and customer data.'],
  'customer-service-representative': ['Customer Service Representative', 'Answers questions by phone, email, chat or social channels and records solutions.'],
  'customer-contact-back-office-associate': ['Customer Contact Back Office Associate', 'Processes changes, cases, escalations and follow-up actions.'],
  'customer-success-specialist': ['Customer Success Specialist', 'Supports post-sale adoption, value and renewal.'],
  'senior-sales-associate': ['Senior Sales Associate', 'Combines sales with daily support, handovers and shop-floor guidance.'],
  'retail-team-leader': ['Retail Team Leader', 'Leads the store team on service, scheduling, presentation and commercial execution.'],
  'store-manager': ['Store Manager', 'Owns store operations, staffing, performance, safety and customer experience.'],
  'sales-team-leader': ['Sales Team Leader', 'Coaches the sales team on conversation quality, follow-up and execution.'],
  'customer-contact-team-leader': ['Customer Contact Team Leader', 'Leads service operations on accessibility, quality, escalations and satisfaction.'],
  'sales-manager': ['Sales Manager', 'Sets commercial priorities and leads teams on market development and pipeline.'],
  'contact-centre-manager': ['Contact Centre Manager', 'Leads capacity, processes, quality, accessibility and continuous improvement.'],
  'contact-centre-workforce-planner': ['Contact Centre Workforce Planner', 'Workforce management and capacity planning for contact centre operations.', 'req'],
  'customer-contact-quality-coach': ['Customer Contact Quality Coach', 'Quality coaching on conversation standards and customer contact performance.', 'req'],
  'sales-coach': ['Sales Coach', 'Sales training and performance coaching for commercial teams.', 'req'],
}

/* ── Axis one: the industry the work sits in ─────────────────────────
   `short` is the rail label; `name` is the full source name, used in the
   panel where there is room for it. The longest full name runs to 48
   characters and wraps to four lines in a 200px rail, which is why the two
   are separate fields rather than one truncated at render time. */
export const sectors = [
  {
    id: 'cleaning',
    no: '01',
    name: 'Cleaning & Industrial Cleaning',
    short: 'Cleaning & Industrial',
    blurb: 'Cleaning, facilities, industrial cleaning and qualified safety watch roles, from recurring site coverage to maintenance shutdowns.',
    groups: [
      {
        id: 'cleaning-and-facilities',
        name: 'Cleaning & facilities',
        intro: 'The right people for every cleaning environment, from routine site work to hotels, healthcare and cleanrooms.',
        roles: [
          'cleaning-operative', 'mobile-cleaner-relief-worker', 'housekeeping-operative',
          'hospitality-facilities-operative', 'healthcare-and-hygiene-cleaner', 'food-high-care-cleaner',
          'cleanroom-cleaner', 'transport-high-traffic-cleaner', 'specialist-cleaner',
          'event-cleaner', 'post-construction-cleaner', 'construction-clean-up-final-clean-operative',
          'working-supervisor',
        ],
      },
      {
        id: 'industrial-cleaning-and-safety',
        name: 'Industrial cleaning & safety',
        intro: 'Experienced people for work where safety matters: installations, tanks, high-pressure work and confined spaces.',
        roles: [
          'industrial-cleaner', 'industrial-cleaning-assistant', 'industrial-housekeeping-site-support',
          'shutdown-turnaround-worker', 'hogedrukspuiter-hds-hogedrukoperator-hdo', 'industrial-cleaning-machine-operator',
          'pressure-vacuum-assistant-dvh', 'pressure-vacuum-operator-dvm', 'industrial-blaster-grit-blaster',
          'tank-unit-cleaner', 'cleaner-using-independent-respiratory-protection', 'adembescherming-c-ab-c',
          'industrial-fire-marshal', 'confined-space-attendant', 'gas-analyst',
          'decontamination-operative',
        ],
      },
      {
        id: 'official-sir-profiles',
        name: 'Official SIR profiles',
        intro: 'The right qualification for the technique and risk category. Dutch SIR names and codes are deliberately retained.',
        roles: [
          'hogedrukspuiter-hds', 'hogedrukoperator-hdo', 'hogedrukspuiter-machinist-hds-m',
          'hogedrukoperator-machinist-hdo-m', 'toezichthouder-hogedruk-thd', 'toezichthouder-drukvacuum-tdv',
          'adembescherming-b-met-gaspak-abb-g', 'toezichthouder-adembescherming-tab', 'chemisch-technisch-operator-cto',
          'toezichthouder-chemisch-technisch-tct',
        ],
      },
      {
        id: 'catalyst-shutdown-and-technical-projects',
        name: 'Catalyst, shutdown & technical projects',
        intro: 'Specialist capacity for complex industrial projects. These are additional industrial services, not routine cleaning roles.',
        roles: [
          'catalyst-reactor-technician', 'dense-loading-technician', 'supplied-air-specialist-gas-suit-worker',
          'industrial-cleaning-superintendent', 'work-preparer-shutdown-planner', 'turnaround-project-coordinator',
          'tank-maintenance-operative-industrial-fitter', 'flange-fitter-pipefitter', 'industrial-painter-coating-operative',
          'working-foreman-specialist-crew',
        ],
      },
    ],
  },
  {
    id: 'transport',
    no: '02',
    name: 'Transport & Logistics',
    short: 'Transport & Logistics',
    blurb: 'Drivers, warehouse, planning and logistics coordination. This is staffing only and is separate from the ORYX Transport business unit.',
    groups: [
      {
        id: 'transport-profiles',
        name: 'Transport profiles',
        intro: 'The right driver for the vehicle, route and load. Licence, Code 95, driver card and route are aligned per assignment.',
        roles: [
          'category-c-truck-driver', 'category-ce-truck-driver', 'rigid-truck-driver',
          'multi-drop-distribution-driver', 'container-terminal-driver', 'shunter-yard-driver',
          'adr-driver', 'loader-crane-building-materials-driver', 'waste-collection-driver-loader',
          'tipper-bulk-driver', 'van-driver-courier', 'driver-s-mate',
          'removals-operative-driver', 'category-d-bus-driver',
        ],
      },
      {
        id: 'warehouse-and-logistics',
        name: 'Warehouse & logistics',
        intro: 'People who keep the flow of goods moving, from receiving through picking and packing to dispatch.',
        roles: [
          'logistics-operative', 'warehouse-operative', 'order-picker-voice-picker',
          'packing-fulfilment-operative', 'inbound-goods-in-operative', 'outbound-dispatch-operative',
          'cross-dock-operative', 'parcel-sorting-operative', 'electric-pallet-truck-operator',
          'forklift-operator', 'reach-truck-operator', 'vna-combi-truck-operator',
          'loader-unloader', 'inventory-operative-cycle-counter', 'production-logistics-operative',
          'working-team-leader-supervisor',
        ],
      },
      {
        id: 'planning-and-coordination',
        name: 'Planning & coordination',
        intro: 'Every detail matters behind the operation too: planning, forwarding, customer service and administration.',
        roles: [
          'transport-planner', 'logistics-planner', 'freight-forwarder',
          'logistics-customer-service', 'warehouse-coordinator', 'logistics-supervisor-team-leader',
          'logistics-administrator', 'fleet-transport-support',
        ],
      },
    ],
  },
  {
    id: 'property',
    no: '03',
    name: 'Property Maintenance, Renovation, Restoration & Construction',
    short: 'Property & Construction',
    blurb: 'Site trades plus preparation, coordination and management across maintenance, renovation, restoration and new build.',
    groups: [
      {
        id: 'site-trades',
        name: 'Site trades',
        intro: 'The core trades. Each profession appears once; application and specialism are attached as tags.',
        roles: [
          'carpenter', 'painter', 'wall-covering-installer',
          'glazier', 'sealant-applicator', 'bricklayer',
          'repointing-specialist', 'roofer', 'cladding-installer',
          'window-and-door-installer', 'concrete-worker', 'concrete-repair-specialist',
          'timber-decay-repair-specialist', 'demolition-worker', 'dismantling-operative--property',
          'plasterer', 'tiler', 'drywall-and-ceiling-installer',
          'flooring-installer', 'groundworker--property', 'paver--property',
        ],
      },
      {
        id: 'support-and-coordination',
        name: 'Support & coordination',
        intro: 'Site support, handover and daily supervision, including resident-facing and aftercare roles.',
        roles: [
          'construction-labourer', 'masonry-assistant', 'site-logistics-operative',
          'handover-operative', 'maintenance-operative', 'resident-liaison-officer',
          'working-foreman',
        ],
      },
    ],
  },
  {
    id: 'technical',
    no: '04',
    name: 'Technical, Maintenance, Production & Engineering',
    short: 'Technical & Engineering',
    blurb: 'Technicians and operators through preparation, engineering and project leadership, for breakdowns, installation, production and projects.',
    groups: [
      {
        id: 'maintenance-and-service',
        name: 'Maintenance & service',
        intro: 'Maintenance, breakdowns, shutdowns, overhauls and field service.',
        roles: [
          'maintenance-technician', 'breakdown-technician', 'service-technician',
        ],
      },
      {
        id: 'mechanical-and-mechatronics',
        name: 'Mechanical & mechatronics',
        intro: 'Mechanical, machinery, assembly, metal, CNC and drive technology.',
        roles: [
          'mechanical-technician', 'mechatronics-technician', 'machine-builder',
          'assembly-technician', 'commissioning-technician', 'welder',
          'cnc-machinist',
        ],
      },
      {
        id: 'electrical-and-automation',
        name: 'Electrical & automation',
        intro: 'Electrical, E&I, instrumentation, PLC, SCADA and robotics.',
        roles: [
          'electrician', 'eandi-technician', 'instrumentation-technician',
        ],
      },
      {
        id: 'building-services-and-energy',
        name: 'Building services & energy',
        intro: 'Refrigeration, air conditioning, heat pumps, heating and boilers. Regulated; certification is checked first.',
        roles: [
          'refrigeration-and-climate-systems-technician', 'heating-and-boiler-technician',
        ],
      },
      {
        id: 'production-and-process',
        name: 'Production & process',
        intro: 'Operators, production technology and shift-based operation of machines and processes.',
        roles: [
          'process-operator--technical', 'machine-operator--technical',
        ],
      },
      {
        id: 'engineering-and-projects',
        name: 'Engineering & projects',
        intro: 'Work preparation, CAD, engineering, technical management and project leadership.',
        roles: [
          'work-planner', 'maintenance-planner', 'maintenance-engineer',
          'technical-drafter', 'technical-project-lead', 'mechanical-engineer',
          'electrical-engineer',
        ],
      },
    ],
  },
  {
    id: 'manufacturing',
    no: '05',
    name: 'Manufacturing & Process Industries',
    short: 'Manufacturing & Process',
    blurb: 'Production, assembly, process, quality, shift leadership and operational support across manual and continuous production.',
    groups: [
      {
        id: 'production-assembly-and-packing',
        name: 'Production, assembly & packing',
        intro: 'Shop-floor people who keep products moving. Food, metal, plastics and pharma are filters, not duplicate job titles.',
        roles: [
          'production-operative', 'assembly-operative', 'packing-operative',
          'sorting-operative', 'materials-preparation-operative', 'batching-and-mixing-operative',
          'cleanroom-production-operative', 'finishing-operative',
        ],
      },
      {
        id: 'machine-and-process-operations',
        name: 'Machine & process operations',
        intro: 'Operators matched to machine, line and process. Operator is not a universal authorisation.',
        roles: [
          'machine-operator--manufacturing', 'line-operator', 'process-operator--manufacturing',
          'field-operator', 'control-room-operator', 'packaging-operator',
        ],
      },
      {
        id: 'quality-planning-and-leadership',
        name: 'Quality, planning & leadership',
        intro: 'Control over quality, staffing and progress. Quality control and quality assurance stay separate.',
        roles: [
          'quality-controller', 'quality-assurance-coordinator', 'production-planner',
          'production-preparation-coordinator', 'working-production-foreperson', 'production-team-leader-shift-leader',
        ],
      },
    ],
  },
  {
    id: 'infrastructure',
    no: '06',
    name: 'Infrastructure, Civil Works & Telecom',
    short: 'Infrastructure & Telecom',
    blurb: 'Groundworks, paving, cables, utilities and telecom profiles within one project chain. Security remains a separate sector.',
    groups: [
      {
        id: 'civil-works-and-underground-delivery',
        name: 'Civil works & underground delivery',
        intro: 'The core workforce for groundworks, public infrastructure and underground networks.',
        roles: [
          'groundworker--infrastructure', 'civil-engineering-operative', 'paver--infrastructure',
          'drainage-operative', 'cable-and-duct-layer', 'excavator-operator',
          'working-foreman-infrastructure',
        ],
      },
      {
        id: 'telecom-and-fibre',
        name: 'Telecom & fibre',
        intro: 'From route to active connection. Groundworks and network installation remain separate trades in the same programme.',
        roles: [
          'data-distribution-technician', 'fibre-technician', 'fibre-splicer',
          'fibre-cable-blowing-operative', 'ftth-connection-technician', 'telecom-fault-technician',
          'cable-testing-and-fault-specialist',
        ],
      },
      {
        id: 'preparation-and-project-control',
        name: 'Preparation & project control',
        intro: 'Control of delivery and handover: preparation, supervision, engineering, utility data and setting out.',
        roles: [
          'infrastructure-telecom-works-planner', 'infrastructure-telecom-site-supervisor', 'telecom-route-engineer',
          'utility-information-coordinator', 'setting-out-engineer',
        ],
      },
    ],
  },
  {
    id: 'traffic',
    no: '07',
    name: 'Traffic Control & Traffic Management',
    short: 'Traffic Management',
    blurb: 'Traffic controllers and operational traffic measures, kept as strictly separated roles with different legal authority.',
    groups: [
      {
        id: 'traffic-control',
        name: 'Traffic control',
        intro: 'Roles for traffic flow and visitor routing. The legal role determines which directions a person may give.',
        roles: [
          'professional-traffic-controller', 'event-traffic-controller', 'parking-steward',
          'traffic-controller-team-coordinator',
        ],
      },
      {
        id: 'temporary-traffic-management',
        name: 'Temporary traffic management',
        intro: 'Roles for work-zone layout and equipment. This crew installs and removes the work zone under the delivery plan.',
        roles: [
          'traffic-management-operative', 'traffic-management-driver', 'impact-protection-vehicle-driver',
          'traffic-signs-installer',
        ],
      },
      {
        id: 'preparation-and-leadership',
        name: 'Preparation & leadership',
        intro: 'Control of planning and delivery, from work preparation and CAD to project coordination.',
        roles: [
          'working-foreman-traffic-management', 'traffic-management-works-planner', 'traffic-management-cad-technician',
          'traffic-management-project-coordinator',
        ],
      },
    ],
  },
  {
    id: 'agriculture',
    no: '09',
    name: 'Agriculture, Horticulture, Fruit & Green',
    short: 'Agriculture & Green',
    blurb: 'Cultivation, harvest, greenhouse, livestock, sorting, landscaping and agricultural logistics across three specialist fields.',
    groups: [
      {
        id: 'crop-production-horticulture-and-fruit',
        name: 'Crop production, horticulture & fruit',
        intro: 'Core roles from plant to product. Crops and production systems become filters.',
        roles: [
          'crop-production-worker', 'crop-care-worker', 'harvest-worker',
          'fruit-growing-worker', 'nursery-worker', 'flower-bulb-worker',
          'seed-and-trial-field-worker', 'produce-grading-and-packing-operative', 'horticultural-line-operator',
          'working-foreperson-crop-production',
        ],
      },
      {
        id: 'livestock-contracting-and-agricultural-trade',
        name: 'Livestock, contracting & agricultural trade',
        intro: 'Continuity on the farm, in the barn and in the field. Animal group and machine are agreed per assignment.',
        roles: [
          'livestock-farm-worker', 'milker', 'agricultural-relief-worker',
          'agricultural-machine-operator', 'irrigation-worker', 'agricultural-trade-and-logistics-operative',
          'agricultural-quality-controller', 'working-foreperson-agriculture',
        ],
      },
      {
        id: 'landscaping-grounds-and-conservation',
        name: 'Landscaping, grounds & conservation',
        intro: 'People for construction, maintenance and outdoor assets, across gardens, public grounds, trees and turf.',
        roles: [
          'landscaper-gardener', 'grounds-maintenance-operative', 'mowing-machine-operator',
          'arborist', 'forestry-and-conservation-operative', 'groundskeeper',
          'sports-turf-operative', 'working-foreperson-grounds-maintenance',
        ],
      },
      {
        id: 'on-request',
        name: 'On request',
        intro: 'Management profiles shown as available only where ORYX has demonstrable capacity.',
        roles: [
          'agricultural-farm-manager', 'grounds-maintenance-supervisor',
        ],
      },
    ],
  },
  {
    id: 'waste',
    no: '10',
    name: 'Waste, Recycling & Circularity',
    short: 'Waste & Recycling',
    blurb: 'Collection, sorting, processing, recycling, site work and circular operations, from kerbside to recovered material.',
    groups: [
      {
        id: 'collection-recycling-centres-and-acceptance',
        name: 'Collection, recycling centres & acceptance',
        intro: 'People who receive waste streams and keep them moving safely. Vehicle and material type are filters, not job titles.',
        roles: [
          'waste-loader', 'waste-management-operative', 'recycling-centre-operative',
          'waste-acceptance-officer', 'weighbridge-operative', 'recycling-yard-operative',
        ],
      },
      {
        id: 'sorting-recycling-and-reuse',
        name: 'Sorting, recycling & reuse',
        intro: 'Shop-floor people who turn waste back into value. Material is a filter, not a new occupation.',
        roles: [
          'recycling-sorter', 'recycling-operative', 'dismantling-operative--waste',
          'reuse-and-refurbishment-operative', 'recycling-quality-controller',
        ],
      },
      {
        id: 'plant-processes-and-leadership',
        name: 'Plant, processes & leadership',
        intro: 'Control over equipment, site, planning and shift. Machine experience is task- and site-specific.',
        roles: [
          'recycling-plant-operator', 'waste-processing-operator', 'wheel-loader-operator',
          'recycling-crane-operator', 'waste-collection-planner', 'working-recycling-foreperson',
          'waste-and-recycling-team-leader',
        ],
      },
    ],
  },
  {
    id: 'healthcare',
    no: '11',
    name: 'Healthcare & Social Care',
    short: 'Healthcare & Social Care',
    blurb: 'Care, support and welfare profiles across six care settings, from daily support to clinical care and coordination.',
    groups: [
      {
        id: 'personal-care-nursing-and-medical-support',
        name: 'Personal care, nursing & medical support',
        intro: 'Professionals for daily care and clinical support. Care intensity and autonomy determine the required profile.',
        roles: [
          'care-assistant', 'care-and-wellbeing-assistant', 'verzorgende-ig-vig',
          'registered-nurse', 'medical-assistant-gp-practice', 'medical-secretary',
        ],
      },
      {
        id: 'support-work-social-work-and-wellbeing',
        name: 'Support work, social work & wellbeing',
        intro: 'People who support, activate and strengthen autonomy. Setting is a filter, not a new occupation.',
        roles: [
          'social-care-support-worker', 'personal-social-care-coordinator', 'social-worker',
          'youth-and-family-professional', 'client-support-adviser',
        ],
      },
      {
        id: 'maternity-childcare-home-support-and-planning',
        name: 'Maternity, childcare, home support & planning',
        intro: 'Continuity for children, home, roster and team. Childcare has its own diploma and registration route.',
        roles: [
          'maternity-care-assistant', 'childcare-practitioner', 'senior-childcare-practitioner',
          'childcare-group-assistant', 'home-support-worker', 'care-planner',
          'care-and-social-support-team-leader',
        ],
      },
    ],
  },
  {
    id: 'maritime',
    no: '12',
    name: 'Maritime, Port & Offshore',
    short: 'Maritime & Offshore',
    blurb: 'Terminal, port, inland and sea-going shipping, marine engineering and offshore profiles, with separate qualification routes.',
    groups: [
      {
        id: 'port-and-terminal',
        name: 'Port & terminal',
        intro: 'Capacity for quay, yard and terminal. Equipment evidence is assignment-specific, never a general authorisation.',
        roles: [
          'port-operative', 'terminal-operator', 'lasher-lashing-specialist',
          'port-crane-operator', 'reach-stacker-operator', 'straddle-carrier-operator',
          'terminal-tractor-driver',
        ],
      },
      {
        id: 'inland-sea-going-and-marine-engineering',
        name: 'Inland, sea-going & marine engineering',
        intro: 'Separate qualification routes. Inland and sea-going occupations are not interchangeable.',
        roles: [
          'inland-navigation-boatman', 'inland-navigation-helmsman', 'inland-boatmaster',
          'deck-rating-able-seafarer-deck', 'deck-officer-mate', 'sea-going-master',
          'marine-engineer-officer', 'marine-mechanic', 'marine-electrician',
        ],
      },
      {
        id: 'offshore-dredging-and-subsea',
        name: 'Offshore, dredging & subsea',
        intro: 'Technical and marine profiles for work at sea. Safety training is not trade authorisation.',
        roles: [
          'offshore-mechanical-technician', 'offshore-electrical-technician', 'wind-turbine-technician',
          'rigger', 'banksman-slinger-signaller', 'offshore-crane-operator',
          'rov-pilot-technician',
        ],
      },
    ],
  },
  {
    id: 'retail',
    no: '13',
    name: 'Retail, Sales & Customer Contact',
    short: 'Retail & Customer Contact',
    blurb: 'Retail sales, inside sales, outbound and inbound contact and commercial administration across five commercial routes.',
    groups: [
      {
        id: 'retail-and-store',
        name: 'Retail & store',
        intro: 'Customer-focused capacity for sales, service and store support. Sales Associate and Sales Advisor stay separate.',
        roles: [
          'retail-sales-associate', 'sales-advisor', 'cashier',
          'customer-service-desk-associate', 'merchandiser', 'brand-promoter',
          'replenishment-associate', 'stocktake-assistant',
        ],
      },
      {
        id: 'sales-and-acquisition',
        name: 'Sales & acquisition',
        intro: 'Commercial profiles for B2C, B2B, inbound and outbound. Industry is a filter; the occupation stays commercial.',
        roles: [
          'telesales-representative', 'inside-sales-representative', 'lead-generation-specialist',
          'business-development-representative-bdr-sdr', 'field-sales-representative', 'account-manager',
          'sales-support-coordinator', 'retention-specialist', 'commercial-administrator',
        ],
      },
      {
        id: 'customer-contact-and-leadership',
        name: 'Customer contact & leadership',
        intro: 'Service, back office and leadership without duplicate job titles. Service is not automatically a sales role.',
        roles: [
          'customer-service-representative', 'customer-contact-back-office-associate', 'customer-success-specialist',
          'senior-sales-associate', 'retail-team-leader', 'store-manager',
          'sales-team-leader', 'customer-contact-team-leader', 'sales-manager',
          'contact-centre-manager',
        ],
      },
      {
        id: 'on-request-specialists',
        name: 'On-request specialists',
        intro: 'Quality and planning specialists confirmed per request rather than published as core profiles.',
        roles: [
          'contact-centre-workforce-planner', 'customer-contact-quality-coach', 'sales-coach',
        ],
      },
    ],
  },
]

/* Totals, computed rather than typed, so they cannot drift from the data
   above the way a hand-written figure would. Used by the page to state the
   size of the catalogue honestly — as coverage, never as availability. */
export const totals = {
  sectors: sectors.length,
  groups: sectors.reduce((n, s) => n + s.groups.length, 0),
  roles: Object.keys(roles).length,
  tags: sectors.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.roles.length, 0), 0),
}
