/**
 * All site copy in one place.
 *
 * The brand is ORYX GROUP. The old O.I.F.M.G initials-unfold is gone with it:
 * an acronym nobody can say was never the reveal it was being asked to be, and
 * the identity board settles the question — the mark and the word ORYX are the
 * brand, and the descriptor line does the explaining underneath.
 */
export const brand = {
  full: 'ORYX GROUP',
  /* The capital X is the point, not a typo. The slogan is a backronym of the
     name and X is the letter it gives up — setting it "Excellence" hides the
     one word doing the work. Held as a single string so the capital cannot
     drift between the three places this renders. */
  slogan: 'Our Reliability, Your eXcellence',
  /* The same slogan, split against the letters it comes out of. Stored as
     explicit pairs rather than derived from the words' first letters, because
     the last pair does not survive that: X is taken from e(X)cellence, which is
     the whole reason the backronym lands. */
  letters: [
    { k: 'O', w: 'Our' },
    { k: 'R', w: 'Reliability' },
    { k: 'Y', w: 'Your' },
    { k: 'X', w: 'eXcellence' },
  ],
  /* The board's four-part descriptor. Chrome and metadata only — it says what
     the company does, where the slogan says what it is like to work with. */
  descriptor: ['Building', 'People', 'Services', 'Solutions'],
  /* The identity board's own purpose statement, used verbatim. It sits beside
     the three services on the gateway, which is the only place on the site
     that has to answer "who is this" before "what do they do". */
  purpose:
    'We build, support and deliver essential services and smart solutions that create value, empower people and build a better tomorrow.',
  region: 'Netherlands',
}

/**
 * The opening film — five shots, and the subject is the name.
 *
 * The services are gone from it. They were three shots in the middle listing
 * what the company sells, which is what the page underneath is for; a title
 * sequence that lists your services is a contents page with music. What is
 * left is the one thing only the film can say: where the mark comes from.
 *
 * The three middle shots are one continuous idea — the animal far off, the
 * push onto its head where the mark turns out to be its horns, then the same
 * frame again at sunset with the sun coming up inside them. Shots 2 and 3 are
 * literally the same plate, so the sunset is a time-lapse jump on one image
 * rather than a cut between two different animals that would never match.
 *
 * `enter` is `cut` where the edit should be invisible. The chevron wipe is
 * kept for the two edits that change subject: into the letters, and into the
 * end card.
 */
export const acts = [
  {
    /* Establishing. The animal small in the dunes, camera creeping in. */
    id: 'wild',
    kind: 'plate',
    film: 'oryxWide',
    hold: 2.06,
    enter: 'up',
    cam: 'none',
    line: 'ORYX',
    sub: 'An oryx in the Namib.',
  },
  {
    /* The push onto the head, carrying what the name stands for. This one cuts
       hard: it shares its opening frame with the shot before it. */
    id: 'push',
    kind: 'plate',
    film: 'oryxPush',
    hold: 4.06,
    enter: 'cut',
    cam: 'none',
    line: 'ORYX',
    sub: 'Strength · Focus · Resilience',
  },
  {
    /* The finale, and it is one shot rather than a shot and then a card.
       The clip runs day into sunset with the sun coming up inside the V the
       horns make. The mark fades onto those horns, the letters unfold into the
       promise, and then the same mark — one element, never swapped — shrinks
       into its place while the footage gives out beneath it and the way in
       appears under it.

       `enter: 'dissolve'` because this is the one edit whose two shots were
       generated separately and do not share the frame they should cut on.

       No `hold`: the timeline stops here and the film waits to be dismissed
       rather than dismissing itself. */
    id: 'finale',
    kind: 'finale',
    film: 'oryxSun',
    hold: 0,
    enter: 'dissolve',
    cam: 'none',
    line: 'ORYX GROUP',
    sub: 'ORYX GROUP · Netherlands',
  },
]

/**
 * The client tape.
 *
 * `logo` is a path under `/public/clients/`; until one exists the tape renders
 * `name` as type instead, so nothing on the page claims a relationship that
 * cannot be evidenced. Drop a file in and fill the field — one line per client,
 * nothing else to change.
 *
 * The names below are SECTORS, not companies, and are safe to ship as they
 * stand. Replace them with real clients only when the logos are cleared.
 */
export const clients = [
  { name: 'Retail groups', logo: null },
  { name: 'Manufacturing', logo: null },
  { name: 'Healthcare', logo: null },
  { name: 'Multi-site offices', logo: null },
  { name: 'Events & venues', logo: null },
  { name: 'Public sector', logo: null },
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
      /* The opening line of the world. Short and declarative, where the body
         copy stays discursive — a headline and an essay are different jobs. */
      headline: 'Moved on time.\nTracked to the door.',
      /* Four steps, in this trade's own language. Every service answers "how
         does this actually work", and each answers it in its own words rather
         than a shared template with the nouns swapped. */
      process: [
        { k: 'Brief', d: 'What moves, from where, how often, and what it costs you if it is late.' },
        { k: 'Plan', d: 'Route built, load sequenced by drop order, slot confirmed in writing.' },
        { k: 'Run', d: 'Collected, sealed and tracked, with exceptions reported before you ask.' },
        { k: 'Prove', d: 'Signed and timestamped at the door, proof returned the same day.' },
      ],
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
    promise: 'From people to complete workforce solutions.',
    body: 'The people, skills and teams you need to keep your operation moving — from a single tradesperson to a complete crew with its own supervisor, across nine sectors.',
    world: {
      headline: 'People. Skills.\nTeams. Operations.',
      /* The Workforce Journey (§12). The proposal lists nine steps internally;
         §18 proposes seven for the website, and seven is right — Assess folds
         into Screen and Evaluate into Monitor, because as separate numbered
         items they read as process for its own sake. */
      process: [
        { k: 'Source', d: 'Recruit against the sectors we actually staff, so the pool is deep where the work is.' },
        { k: 'Screen', d: 'Interview, practical experience and trade skill assessed before anyone is put forward.' },
        { k: 'Verify', d: 'Identity, work documents, licences and certificates checked and dated — not taken on trust.' },
        { k: 'Match', d: 'Worker or team linked to the client, the site and the role, against the stated requirement.' },
        { k: 'Deploy', d: 'Deployment organised with onboarding and site instruction before the first shift starts.' },
        { k: 'Monitor', d: 'Attendance, performance, safety and client feedback followed up while the work runs.' },
        { k: 'Develop', d: 'Training, recertification and progression to the next ORYX level.' },
      ],
      /* The most concrete thing this service can say. Uniform, badge and a
         named supervisor are what a site manager actually sees on the day —
         everything else on the page is a promise about them. */
      /* The five ORYX levels (§5). The point is progression, not grading: a
         worker moves up through training and experience, which is why the
         section is drawn as a ladder rather than a table. */
      levels: [
        { n: '01', k: 'General', d: 'Generally deployable; limited or no formal trade certification.', ex: 'Labourer · Cleaner · Warehouse assistant' },
        { n: '02', k: 'Skilled', d: 'Demonstrable practical experience, works independently within the trade.', ex: 'Skilled construction worker · Experienced order picker' },
        { n: '03', k: 'Certified', d: 'Required or relevant certificates demonstrably verified.', ex: 'VCA · Forklift · Code 95 · ADR · IPAF · TCVT' },
        { n: '04', k: 'Specialist', d: 'Specialist expertise, several years of experience or additional qualifications.', ex: 'CNC operator · Service engineer · Heavy machine operator' },
        { n: '05', k: 'Supervisory', d: 'Managerial and coordinating roles.', ex: 'Team leader · Foreman · Site supervisor' },
      ],

      /* The five engagement models (§10). The examples are the persuasive part
         — "a flexible pool" is an abstraction and "5–20 workers depending on
         weekly volume" is an offer — so they are content, not decoration.

         `lead` marks Team-Based, which §11 names as the key differentiator and
         which the deployment plan alongside this section illustrates. */
      solutions: [
        { k: 'Temporary Staffing', d: 'Short-term or temporary deployment of individual workers.', ex: '10 warehouse workers for 3 weeks' },
        { k: 'Flexible Workforce', d: 'A pool that scales up and down with your volume.', ex: '5–20 workers depending on weekly volume' },
        { k: 'Long-Term Staffing', d: 'Workers placed with the same client for a longer period.', ex: '15 construction workers for 12 months' },
        { k: 'Team-Based Workforce', d: 'A complete crew covering every role the job needs, supervisor included.', ex: '1 supervisor + 4 skilled + 5 general workers', lead: true },
        { k: 'Managed Workforce', d: 'Planning, follow-up and operational coordination alongside supply.', ex: 'A full industrial cleaning crew with supervisor' },
      ],

      /* §20, the quality principle — stated as a principle and nothing more.
         The proposal's certificate matrix is deliberately not published: §22
         requires it to be legally validated first, and which certificate is
         mandatory depends on machine, site, risk class and current Dutch law.
         Naming the categories is honest; publishing the matrix is a claim. */
      compliance: {
        line: 'No verification, no deployment.',
        d: 'A worker goes to site once the documents, certificates, instructions and competences that assignment needs have been checked. Not after, and not on the assumption that someone else has done it.',
        checks: [
          { k: 'Safety', d: 'VCA at the level the role and the site call for.' },
          { k: 'Transport', d: 'Licence category, Code 95 and ADR, checked in date.' },
          { k: 'Machinery', d: 'IPAF and TCVT recorded by exact machine category.' },
          { k: 'Electrical', d: 'NEN 3140 designation and task authorisation.' },
        ],
      },
      lede: 'Staffing is judged on the shifts nobody remembers. The right number of people arrived, they knew the site, they knew the standard, and the day ran. We supply people the way an operations team would want them supplied.',
      /* The shift this page is built around — the timetable is the layout. */
      shift: [
        { t: '06:00', k: 'Brief', d: 'Site, scope and standard, before anyone starts.' },
        { t: '08:00', k: 'On site', d: 'Full crew, inducted, in uniform, working.' },
        { t: '12:30', k: 'Cover', d: 'An absence is absorbed inside the shift, not reported after it.' },
        { t: '17:00', k: 'Handover', d: 'Written, to a named person, with what is outstanding.' },
      ],
      /* The crew grid — roles that populate as the page is read. */
      /* The deployment plan. `x`/`y` are plan coordinates in the scene's own
         1120×600 space, so a post moves by editing two numbers here rather
         than by touching the drawing.

         A distribution site, not a venue. It was Stage, Concourse and Front of
         house — an event crew, which is the one sector this business turned
         out not to have. The composition is now the Logistics Team from §11
         (1 coordinator + 2 truck operators + 8 warehouse workers), so the
         drawing illustrates the Team-Based model beside it rather than a
         made-up job.

         `lead` marks the coordinator; `rove` marks the pair deliberately not
         fixed to a position. Ordered control-first and then outward, which is
         both how a site is staffed and how the posts fill. */
      posts: [
        { k: 'Shift office', r: 'Coordinator', n: 1, x: 200, y: 145, lead: true },
        { k: 'Inbound', r: 'Warehouse', n: 2, x: 520, y: 145 },
        { k: 'Racking', r: 'Reach truck', n: 1, x: 830, y: 150 },
        { k: 'Pick face', r: 'Order pickers', n: 4, x: 230, y: 320 },
        { k: 'Pack bench', r: 'Warehouse', n: 2, x: 560, y: 335 },
        { k: 'Floating', r: 'Cover', n: 2, x: 760, y: 305, rove: true },
        { k: 'Loading dock', r: 'Forklift', n: 1, x: 830, y: 460 },
        { k: 'Returns', r: 'Warehouse', n: 2, x: 190, y: 480 },
        { k: 'Dispatch', r: 'Outbound', n: 2, x: 530, y: 480 },
      ],
      /* Social proof, and the only quote on the site. Placeholder wording
         until a real one is supplied — the attribution is deliberately a role
         and a sector rather than a person, which is both what a facilities
         buyer finds credible and what survives not having a name to use. */
      quote: {
        line: 'The shift ran, and nobody called me. That is the whole job.',
        who: 'Facilities Manager',
        where: 'Multi-site retail group, Randstad',
      },
      /* The checks, in the order they actually happen. Staffing is bought on
         risk, and "vetted, trained and insured" is four words carrying the
         single largest objection this service has to answer. */
      /* The day, as a clock rather than a table. `f` and `t` are hours on a
         24-hour dial; night cover deliberately wraps past midnight, which is
         the one shift a rectangular timetable cannot draw without cutting it
         in half. Ordered outermost ring first. */
      dial: [
        { k: 'Night cover', f: 22, t: 5 },
        { k: 'Cleaning', f: 5, t: 13 },
        { k: 'Logistics', f: 6, t: 18 },
        { k: 'Construction', f: 7, t: 16 },
        { k: 'Transport', f: 4, t: 20 },
      ],
      /* The domains, one tab each.
         Staffing is not one job — the checks, the kit and the shift pattern
         differ enough between a stage crew and a night guard that a single
         "workforce" page describes none of them. Each tab carries what the
         domain covers, who buys it, and the two things specific to it: what
         its people are cleared for, and what they arrive wearing. */
      /* The nine sectors, from the workforce proposal (§3, catalogue in §4).
         These replace four invented domains — two of which, Event crew and
         Security, were not part of this business at all, while seven real
         sectors were missing.

         `roles` carries the catalogue's actual job titles. It is the field the
         old copy had no equivalent of, and it is the whole substance: "we do
         construction" is a claim anyone can make, and "formwork carpenters,
         pointers, concrete-sawing operatives" is not.

         `cleared` names Dutch regimes, because this is a Dutch company. The
         previous lists cited SIA, COSHH and right-to-work checks, all of which
         are British and none of which apply here. */
      sectors: [
        {
          id: 'construction',
          k: 'Construction & Demolition',
          n: 'Build · Strip · Finish',
          d: 'Trades and site labour across new build, renovation, demolition and civils — from first strip-out to final finish.',
          who: 'Main contractors, developers, fit-out firms and civils contractors.',
          roles: ['Bricklayers and carpenters', 'Formwork carpenters and pointers', 'Painters, plasterers and tilers', 'Demolition and strip-out crews', 'Groundworkers and pavers', 'Cable and fibre layers'],
          cleared: ['B-VCA where the client requires it', 'Working at height and fall protection', 'Site induction before first shift', 'DAV/DTA where asbestos risk applies'],
        },
        {
          id: 'cleaning',
          k: 'Cleaning & Facility',
          n: 'Daily · Deep · Controlled',
          d: 'Commercial and industrial cleaning, post-construction handover cleans, and controlled environments worked to site protocol.',
          who: 'Facility managers, landlords, manufacturers and healthcare sites.',
          roles: ['Office and commercial cleaners', 'Industrial and machine cleaning', 'Post-construction and handover cleans', 'Window and facade cleaning', 'Floor and carpet maintenance', 'Cleanroom and laboratory staff'],
          cleared: ['Chemical and SDS instruction', 'Machine instruction carried', 'Cleanroom protocol where applicable', 'Out-of-hours and lone-working cover'],
        },
        {
          id: 'transport',
          k: 'Transport & Distribution',
          n: 'Deliver · Haul · Distribute',
          d: 'Drivers across every licence category, from parcel and last-mile work to CE tractor-trailer and specialised loads.',
          who: 'Hauliers, distributors, wholesalers and construction logistics.',
          roles: ['Category B delivery and van drivers', 'Category C rigid truck drivers', 'CE tractor-trailer drivers', 'ADR and tanker transport', 'Refrigerated and waste transport', 'Concrete mixer and crane truck'],
          cleared: ['Licence category verified', 'Code 95 checked and in date', 'ADR certificate where carried', 'Tachograph and driver documents'],
        },
        {
          id: 'logistics',
          k: 'Logistics & Warehousing',
          n: 'Pick · Move · Dispatch',
          d: 'Warehouse floors and the equipment on them, up to coordinators who run the shift rather than work in it.',
          who: 'Distribution centres, third-party logistics and e-commerce operations.',
          roles: ['Order pickers and packers', 'Inbound, outbound and dispatch', 'Forklift and reach truck operators', 'Electric pallet truck (EPT)', 'Cross-docking and sorting', 'Logistics and transport coordinators'],
          cleared: ['Demonstrable truck instruction and competence', 'Machine type recorded per operator', 'Site traffic rules before first shift', 'Client acceptance where required'],
        },
        {
          id: 'industry',
          k: 'Industry & Production',
          n: 'Produce · Operate · Inspect',
          d: 'Production lines, machine operation and quality control, including food environments and cold storage.',
          who: 'Manufacturers, food producers and process industry.',
          roles: ['Production and assembly workers', 'Packaging and line staff', 'Machine and CNC operators', 'Process operators', 'Food production and cold storage', 'Quality inspectors and measurement'],
          cleared: ['Machine-specific instruction', 'Hygiene training for food environments', 'Line safety and lock-out procedure', 'Shift and night-work availability'],
        },
        {
          id: 'technical',
          k: 'Technical & Maintenance',
          n: 'Install · Maintain · Repair',
          d: 'Electrical, mechanical and installation trades, plus the maintenance staff who keep a building working after handover.',
          who: 'Installers, maintenance contractors and in-house technical services.',
          roles: ['Electricians and panel builders', 'Cable jointers', 'Mechanical and maintenance fitters', 'Breakdown engineers', 'Plumbers and HVAC technicians', 'Solar, heat pump and EV charging installers'],
          cleared: ['NEN 3140 VOP/VP designation', 'Task authorisation from the responsible person', 'Insulated tools and measuring equipment', 'Manufacturer training where required'],
        },
        {
          id: 'plant',
          k: 'Heavy Equipment & Machinery',
          n: 'Lift · Move · Reach',
          d: 'Certified operators for earthmoving, lifting and access equipment, recorded by exact machine category rather than by job title.',
          who: 'Civils contractors, lifting firms and any site running plant.',
          roles: ['Excavator and mini-excavator operators', 'Wheel loaders and bulldozers', 'Tower and mobile crane operators', 'Lift supervisors and riggers', 'Scissor and boom lift operators', 'Telehandler operators'],
          cleared: ['TCVT certification for crane work at 10 tm and above', 'IPAF/PAL card with exact categories', 'TCVT W4-08 / W4-09 for lifting roles', 'Lifting plan and authorisation on site'],
        },
        {
          id: 'green',
          k: 'Green & Outdoor',
          n: 'Plant · Maintain · Harvest',
          d: 'Grounds and landscape work, plus seasonal and agricultural support that scales with the calendar rather than the contract.',
          who: 'Landscapers, grounds contractors, growers and municipalities.',
          roles: ['Gardeners and landscapers', 'Grounds maintenance staff', 'Tree care assistants', 'Seasonal and harvest workers', 'Greenhouse planting and picking', 'Sorting and packing support'],
          cleared: ['Machinery instruction for the tools carried', 'Seasonal availability confirmed', 'Transport to site arranged', 'Weather and daylight shift patterns'],
        },
        {
          id: 'general',
          k: 'General Workforce',
          n: 'Load · Assist · Support',
          d: 'Generally deployable people for the work that does not need a trade ticket but still needs turning up, on time, briefed.',
          who: 'Anyone with a volume peak, a move, a clearance or a deadline.',
          roles: ['General workers and labourers', 'Site and production assistants', 'Warehouse assistants', 'Loading and unloading crews', 'Removal and assembly support', 'Clearance and materials handling'],
          cleared: ['Identity and work documents', 'Manual handling instruction', 'Site induction before first shift', 'PPE issued or verified'],
        },
      ],
      /* A week of cover, as a rota actually looks. `c` is one cell per day,
         Monday to Sunday: 2 = full crew, 1 = reduced, 0 = not staffed. The
         point of showing it is the shape — cover is not uniform, and a staffing
         partner that pretends otherwise has never run a weekend. */
      roster: {
        days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        rows: [
          { r: 'Construction', c: [2, 2, 2, 2, 2, 1, 0] },
          { r: 'Cleaning', c: [2, 2, 2, 2, 2, 1, 1] },
          { r: 'Transport', c: [2, 2, 2, 2, 2, 1, 0] },
          { r: 'Logistics', c: [2, 2, 2, 2, 2, 2, 1] },
          { r: 'Supervisors', c: [2, 2, 2, 2, 2, 2, 2] },
          { r: 'Floating cover', c: [1, 1, 1, 1, 2, 2, 1] },
        ],
        key: [
          { n: 2, k: 'Full crew' },
          { n: 1, k: 'Reduced' },
          { n: 0, k: 'Not staffed' },
        ],
      },
      figures: [
        { n: '48h', l: 'From brief to crew on site' },
        { n: '1', l: 'Account manager, start to finish' },
        { n: '5', l: 'Levels, from general to supervisory' },
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
      headline: 'Back in service.\nOn the date you were given.',
      process: [
        { k: 'Survey', d: 'Measured and recorded, then priced against a written scope.' },
        { k: 'Programme', d: 'Every trade sequenced into one contract with one completion date.' },
        { k: 'Build', d: 'Phased around occupation, reported weekly against the programme.' },
        { k: 'Hand back', d: 'Snagged, cleaned, documented and signed off against the scope.' },
      ],
      lede: 'Renovation goes wrong in the gaps between trades — the week nobody booked, the decision nobody owned. Held as one programme those gaps stop existing, and the building comes back into service on the date you were given.',
      /* The layer stack this page is built around — assembled on scroll, in
         the order the building itself is assembled. */
      layers: [
        { n: '01', k: 'Slab', d: 'Strip-out complete, structure surveyed, back to the substrate.' },
        { n: '02', k: 'Services', d: 'Electrical, ventilation and data set out before anything closes over them.' },
        { n: '03', k: 'Partitions', d: 'Walls and openings built to the agreed plan, off the survey.' },
        { n: '04', k: 'Ceiling', d: 'Grid, lighting and diffusers hung once the services above are signed off.' },
        { n: '05', k: 'Finishes', d: 'Flooring, joinery, decoration — snagged and handed back clean.' },
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
