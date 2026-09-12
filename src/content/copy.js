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
    /* Establishing, with one line under it. The three lines across the film
       build: a sentence about the desert, then the value, then the name that
       stands for it. `line` is drawn as hero type when `text` is 'line';
       `sub` only feeds the screen-reader announcement. */
    id: 'wild',
    kind: 'plate',
    film: 'oryxWide',
    /* The clip runs five seconds; three of them are used. */
    hold: 3.0,
    enter: 'up',
    cam: 'none',
    text: 'line',
    line: 'Some ground only the steady can cross.',
    sub: 'An oryx crossing the Namib desert.',
  },
  {
    /* A second look before the name: the same kind of animal, closer, turned
       toward us, at the foot of a dune. The line is the values headline from
       further down the page, said once here first. It is here so the film has
       the length it was asked for without stretching any one shot past the
       footage it has — this clip barely moves on its own (measured, a fifth
       of the wide shot's motion), so the site's slow `closeIn` push runs over
       it, and it dissolves in and out because it is a different place from
       both neighbours. */
    id: 'bush',
    kind: 'plate',
    film: 'oryxBush',
    hold: 3.0,
    enter: 'dissolve',
    cam: 'closeIn',
    text: 'line',
    line: 'Reliable before impressive.',
    sub: 'An oryx at the foot of a dune.',
  },
  {
    /* The push onto the head, carrying the name itself: O·R·Y·X unfolding
       into the slogan it abbreviates. This shot is where the word is
       explained, so the letters live here rather than over the finale, which
       has its own work to do.

       A dissolve, not a cut: the shot before this is a different animal in a
       different place, and a hard cut between two scenes jumps. No CSS
       camera — this clip is itself a push from mid-shot to the head, and it
       ends a hair off the frame the finale begins on. */
    id: 'push',
    kind: 'plate',
    film: 'oryxPush',
    hold: 4.06,
    enter: 'dissolve',
    cam: 'none',
    text: 'letters',
    line: 'ORYX',
    sub: brand.slogan,
  },
  {
    /* The finale. The sun comes up inside the V the horns make, the mark
       fades onto them, a short brief about the company reads over the held
       frame — and then the same mark, one element, never swapped, shrinks
       into its place while the footage gives out and the way in appears
       under it.

       `enter: 'dissolve'`: this shot and the push were generated as one
       keyframe chain and nearly share the frame they cut on, but not quite —
       the head lands at a slightly different scale either side, and the
       dissolve hides it. No `hold`: the timeline stops here and the film
       waits to be dismissed rather than dismissing itself. */
    id: 'finale',
    kind: 'finale',
    film: 'oryxSun',
    hold: 0,
    enter: 'dissolve',
    cam: 'none',
    text: 'brief',
    line: 'ORYX GROUP',
    sub: 'One group for transport, workforce and renovation — reliable people and services, delivered across the Netherlands.',
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
      /* ⚠ Two of these were blocked claims and have been replaced.
         "24/7 — Dispatch and exception cover" and "<1h — Response on an urgent
         lift" are named on the publication gate in the Workforce source
         document, whose instruction is site-wide: *"Do not place any of the
         following on the site until evidence is supplied"* — a personal 24/7
         response, and a first response inside two working hours, which "<1h"
         is a stronger version of. Only "Requests may be submitted 24/7" is
         cleared, and that is a fact about a form rather than about a person.

         What replaced them are counts the page can already show you: the
         network has five points because `map.nodes` has five entries, and the
         single line of contact is the group's own approved wording. */
      figures: [
        { n: '5', l: 'Network points, Rotterdam to Eindhoven' },
        { n: '1', l: 'Contact for the whole movement' },
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
    /* Source, HOMEPAGE block, quoted exactly. */
    promise: 'From one skilled worker to a complete flex pool or project crew.',
    body: 'Qualified capacity for your operation, across twelve sectors — supplied as temporary staffing, secondment, permanent recruitment or a complete project team.',
    world: {
      /* ── Everything below is transcribed from the ORYX source document
         *Workforce / Structure*, whose LANGUAGE pages carry the approved
         wording verbatim. The sector, group and role data is a separate
         module — `src/content/workforce.js` — because it is 307 records and
         has its own provenance notes.

         ⚠ THE PUBLICATION GATE. The source's final page clears only five of
         twenty-five claims and marks the overall go-live decision red. None of
         the following may appear on this page, and nothing here should be
         edited in a way that reintroduces one:

           · a personal 24/7 response — only "requests may be submitted 24/7"
             is cleared, and that is about the form, not about a person;
           · a first response within two working hours;
           · ABU, NBBU, SNA, SNF or ISO 9001 / 14001 / 45001 marks;
           · the site or its vacancies being available in six languages;
           · client or candidate portals shown as live;
           · AI matching;
           · candidate pool size — an internal figure that the source says
             must never appear publicly.

         And the clause that reaches furthest: *"The final lending legal entity
         is not yet fixed, which blocks every legal and compliance claim on the
         site."* That is why this page names no certificate scheme. The previous
         version listed VCA, Code 95, ADR, IPAF, TCVT and NEN 3140 as things
         ORYX checks; each of those is a compliance claim made by a legal entity
         that does not yet exist on paper. They are gone, and `trust` states the
         principle instead.

         Eight proprietary terms are also unapproved pending sign-off, per the
         source's own open items — Workforcecheck, Start-Ready Gate, Skill
         Passport, Continuity Plan, Trust Center, and the availability labels
         Profile pool, Qualification check and Project sourcing. None appears
         here. The source CTA "Start the Workforcecheck" is therefore rendered
         as "Urgent request", which is a sibling CTA in the same source list. */

      headline: 'Qualified capacity\nfor your operation.',

      /* The north star. Set as a statement and never as a testimonial: it is
         ORYX speaking about itself, and putting it in quotation marks with an
         attribution underneath would dress a self-description as social proof.
         The previous page did exactly that with an invented facilities manager,
         who has been removed — there is no real quote to publish yet. */
      northStar: 'Not merely available. Verifiably ready.',

      lede: 'You receive clear guidance on what is feasible — and which evidence has been checked before the start. One request. One control line. One accountable team.',

      /* The catalogue's size, stated as coverage and never as availability.
         The governing line beneath it is quoted from the source and is the
         reason the numbers are safe to print: they describe the taxonomy ORYX
         covers, not a pool of people standing by. The source is explicit that
         these counts are pre-review and expected to fall. */
      strip: [
        { n: '12', l: 'Sectors' },
        { n: '41', l: 'Groups within them' },
        { n: '307', l: 'Roles in the register' },
      ],
      stripNote: 'A role is listed only where ORYX can demonstrably recruit, select and support it. These counts precede that review and are expected to reduce.',

      /* The two axes. This is the page's structural argument, and the figure
         beside it exists to stop a reader treating the four service lines as a
         fifth level of the sector tree. Source wording, condensed. */
      axes: {
        kicker: 'How to read this',
        line: 'Two axes, not one hierarchy.',
        d: 'Sector, group and role nest inside one another — that part is a real hierarchy. Service line sits on a separate axis: it describes how a role is delivered, not what industry it belongs to.',
        note: 'The same role can be supplied as temporary staffing, secondment, recruitment or inside a project team. The occupation does not change — the contract does.',
        hier: { k: 'Sector → group → role', d: 'The work itself. Nests.' },
        line2: { k: 'Service line', d: 'How it is delivered. Does not nest.' },
      },

      /* METHOD, source page 5. Three triplets, in the source's own order.
         They are cadence rather than process — the previous page ran a
         seven-step journey (Source, Screen, Verify, Match, Deploy, Monitor,
         Develop) which appears nowhere in this document. */
      method: [
        { k: 'Move quickly. Select precisely. Confirm clearly.', d: 'The request is captured in minutes; ORYX then takes personal control of it.' },
        { k: 'Role first. Authority second. Planning third.', d: 'What the work is, who is permitted to do it, and only then when it happens.' },
        { k: 'The right documents. The right instruction. The right deployment.', d: 'Three things checked before a start date, in that order.' },
      ],

      /* TRUST, source page 5. Principles, not a certificate matrix.
         `line` is the differentiator the source states first, and the three
         restraint clauses under it are the ones that make the claim credible —
         each one narrows what ORYX is promising rather than widening it. */
      trust: {
        kicker: 'What we will and will not claim',
        line: 'A job title is not the complete profile.',
        d: 'Evidence before promise. Technology proposes; authorised staff decide and can override.',
        holds: [
          'Availability and qualifications are reconfirmed for every assignment.',
          'A certificate does not automatically grant authority.',
          'The status is time-bound and assignment-specific — it is not a general certification of a person.',
          'The website must never promise more than ORYX can prove.',
        ],
      },

      /* VALUE PROPOSITION, source page 4, quoted. The interlude sets its line
         in display capitals on a 30ch measure, so it takes one sentence and
         not a paragraph — the source's other three value lines ("Capacity that
         moves with your operation", "Not just a technician. The right
         specialist for your equipment.", "One partner for the cab, the
         warehouse and the planning desk.") are equally good and equally
         available if this one is ever swapped. */
      value: 'More than extra hands. Skilled people who fit the work.',

      bestFit: 'Best fit',

      /* The two cleared calls to action. "Urgent request" is a source CTA;
         "Which people does your schedule need?" is the source prompt. */
      prompt: 'Which people does your schedule need?',
      cta: 'Urgent request',
      /* The one cleared 24/7 wording, and the only place the page may say it. */
      submitNote: 'Requests may be submitted 24/7.',
    },
  },
  {
    id: 'renovation',
    accent: '#c8a978',
    tone: '#1a1310',
    index: '03',
    title: 'Renovation',
    short: 'Renovation',
    /* Source, POSITIONING block, quoted. */
    promise: 'One property. One plan. One accountable route.',
    body: 'Maintenance, renovation and heritage restoration organised from one plan — from the first property assessment to delivery, handover and aftercare.',
    world: {
      /* ── Everything below is transcribed from the ORYX source document
         *Property Care / Structure* (22pp), whose LANGUAGE pages carry the
         approved wording verbatim. The nine services and sixty-five works are
         a separate, generated module — `src/content/renovation.js` — because
         they have their own provenance notes and are parsed from the PDF
         rather than typed.

         ⚠ THE PUBLICATION GATE. The source's claims matrix blocks eight topics
         and supplies safe interim wording for each, which is what makes it
         workable: there is an approved sentence for every blocked claim rather
         than only a prohibition. None of the following may be published in
         full until the evidence behind it is supplied:

           · direct delivery        → "ORYX organises delivery."
           · 24/7 or emergency      → "Emergency support by property and
                                       service level."
           · RGS / VGO certification→ "Outcome-led where appropriate; no
                                       certification claim."
           · ERM / conservation     → "Through a demonstrably competent
                                       conservation partner."
           · NEN 2767               → "Condition insight appropriate to the
                                       brief."
           · asbestos               → "Through a certified specialist where
                                       required."
           · savings / performance  → "Scenario with expected effects; no
                                       guarantee."
           · client logo / case     → "Anonymised case."

         Highest exposure, in the source's own words: any 24/7 or emergency
         promise; the RGS, VGO-keur, ERM and NEN 2767 references, which are
         registers held by an entity whose scope and validity must be
         confirmed first; and any savings or performance figure, which must
         always be a scenario and never a guarantee.

         Never on the site: the fifty-company competitor benchmark and the
         eight evidence families. Both are internal research.

         ⚠ THE WORLD KEEPS THE NAME "RENOVATION". The source's service-line
         brand — Property Care in English, Vastgoedzorg in Dutch — is an
         unconfirmed open item: which of the two is the registered name has not
         been decided. So it appears nowhere in navigation, and the positioning
         line carries the real breadth instead. */

      headline: 'Property that\nkeeps performing.',
      /* Source, HOMEPAGE HERO, quoted. */
      lede: 'From maintenance need to verifiable results. ORYX organises property maintenance, renovation and heritage restoration from one plan.',
      beats: ['Assessment', 'Plan', 'Delivery', 'Handover'],

      /* ── The fork ─────────────────────────────────────────────────────
         The decision the source says to meet before the catalogue: "Start
         with the right decision for the property, not a long list of trades."

         Each scenario cites real works from one service, and the citation is a
         bracketed service number — a detail reference on a drawing, which is a
         citation and not a rank. `st` appears exactly once, on Structural,
         because Structural is genuinely one of the four works the source marks
         QUALIFIED PARTY. No status is invented for anything else. */
      forkHead: 'A clear choice: maintain, improve or transform.',
      forkLede: 'Start with the right decision for the property, not a long list of trades.',
      forkTop: { k: 'Datum', v: 'One property, assessed once.', n: 'ORYX Property Check' },
      forkFoot: { k: 'Whichever is chosen', v: 'One plan. One accountable route. Verifiable results.', n: 'Evidence-based handover' },
      forkSet: 'Scope, phasing and budget range are set at the ORYX Property Check, for whichever is chosen.',
      forkNote: 'Conserve what has value. Repair what is necessary. Replace only as a last resort.',
      forkNoteKey: 'Note — ordered by depth of intervention, not by preference.',
      scenarios: [
        {
          id: 'maintain',
          n: '01',
          k: 'Maintain',
          od: 'The envelope.',
          depth: 'ENVELOPE',
          claim: 'Keep the property performing.',
          body: 'Coordinate maintenance to the envelope, roof, structure and common areas.',
          marks: [
            { t: 'Roof & drainage', ref: '03' },
            { t: 'Paint & timber', ref: '03' },
            { t: 'Façade & concrete', ref: '03' },
          ],
          cav: 'Condition insight appropriate to the brief.',
        },
        {
          id: 'improve',
          n: '02',
          k: 'Improve',
          od: 'The fabric inside it.',
          depth: 'FABRIC',
          claim: 'Better performance, same building.',
          body: 'Combine technical improvement with comfort, health and energy performance.',
          marks: [
            { t: 'Building envelope', ref: '05' },
            { t: 'Frames & glazing', ref: '05' },
            { t: 'Ventilation & indoor climate', ref: '05' },
          ],
          cav: 'Energy-performance and permit requirements depend on the intervention. Scenario with expected effects; no guarantee.',
        },
        {
          id: 'transform',
          n: '03',
          k: 'Transform',
          od: 'The structure and the plan.',
          depth: 'STRUCTURE',
          claim: 'A new function for an existing building.',
          body: 'Prepare existing property for a new function or layout.',
          marks: [
            { t: 'New layout', ref: '06' },
            { t: 'Structural', ref: '06', st: 'Qualified party' },
            { t: 'Extension', ref: '06' },
          ],
          cav: 'Feasibility and risk first. Scope, programme and delivery second.',
        },
      ],

      /* ── The route ────────────────────────────────────────────────────
         Seven steps, from the generated module. The claim worth keeping
         visible is the source's own: the route does not change with the
         service, only the scope of step three does. */
      routeLine: 'The route is the same whatever the service; only the scope of step three changes.',

      /* ── The two named methods ────────────────────────────────────────
         Approved for use as method names. The limit is equally explicit and
         is printed with them: no software, no dashboard, no measurement
         accuracy until the process is technically implemented. */
      toolsNote: 'Both are methods, not products. Neither is a portal, a dashboard or a live feed.',

      /* TRUST. The source's publication discipline, stated as the page's own
         rule rather than as an apology. Every line narrows what is being
         promised, which is exactly why they can be published while the claims
         matrix is still open. */
      trust: {
        line: 'Evidence first. Promise second.',
        d: 'Never publish a certification, standard, response-time, capacity or availability claim without current evidence. Publish only what ORYX can deliver operationally.',
      },

      /* The cross-link the source requires. "ORYX Property Care delivers and
         coordinates complete work packages — the client has work delivered.
         ORYX Workforce supplies tradespeople managed by the client. The
         cross-link between them is people, not contracted works." */
      cross: {
        k: 'Need tradespeople instead?',
        d: 'This page is work ORYX delivers and coordinates as complete packages, with one scope, programme and handover record. Supplying skilled people your own team manages is ORYX Workforce — a different route.',
        cta: 'ORYX Workforce',
      },

      /* The intake every route on the site is meant to end at. */
      check: {
        k: 'Property Check',
        d: 'Six fields to start: property type, location, need or issue, desired outcome, preferred start and contact details.',
      },
      prompt: 'Tell us about the property.',
      cta: 'Start the Property Check',
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
