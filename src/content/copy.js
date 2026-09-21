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
    sub: 'One group for transport, workforce and renovation, with reliable people and services across the Netherlands.',
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
    body: 'Regular routes for the loads you can plan, and extra vehicles for the ones you cannot.',
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
      lede: 'Most delivery problems start with not knowing. You hear about a delay when it is already too late to do anything about it. We tell you first, so you never have to chase us.',
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
        { k: 'Tracked', d: 'We tell you when it leaves, when something changes and when it arrives.' },
      ],
      audience: {
        line: 'For organisations where a late delivery costs more than the delivery itself.',
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
        { k: 'Coverage', d: 'Local, national and cross-border, all on one agreement.' },
      ],
      /* The network, as a map draws it: five capital cities on one corridor,
         with Amsterdam as the home hub. It was five Dutch cities, and the
         client asked for capitals so the map shows reach beyond the
         Netherlands.

         It is a schematic, the way a metro map is. Brussels, Amsterdam and
         Luxembourg sit within a few degrees of longitude of one another, so
         true geography would stack their labels on top of each other. The
         order is the order a vehicle would meet them driving north-east from
         Paris, and the heights follow latitude loosely. Coordinates are in
         the map's own viewBox units, so the route and its pins are authored
         together and cannot drift apart.

         ⚠ This is a coverage statement. Confirm the five cities with ORYX
         before launch, and edit this one list if any of them changes: the
         map, the footer and the figure below all read from it. */
      map: {
        nodes: [
          { k: 'Paris', s: 'France', x: 150, y: 268 },
          { k: 'Luxembourg', s: 'Grand Duchy', x: 360, y: 232 },
          { k: 'Brussels', s: 'Belgium', x: 570, y: 176 },
          { k: 'Amsterdam', s: 'Home hub', x: 790, y: 104 },
          { k: 'Berlin', s: 'Germany', x: 1030, y: 136 },
        ],
        path: 'M150 268 C 230 266, 290 246, 360 232 S 500 204, 570 176 S 710 112, 790 104 S 950 120, 1030 136',
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
        { n: '5', l: 'Capitals on the network, Paris to Berlin' },
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
    body: 'Qualified people for your operation in twelve sectors, as temporary staff, on secondment, as permanent hires or as a complete project team.',
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

      headline: 'The right people\nfor your operation.',


      lede: 'We tell you plainly what is possible and which documents have been checked before anyone starts. You make one request, and one team is responsible for it.',

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
      stripNote: 'We list a role only where we can recruit, select and support people for it. The list is still under review, so these numbers may come down.',

      /* The two axes. This is the page's structural argument, and the figure
         beside it exists to stop a reader treating the four service lines as a
         fifth level of the sector tree. Source wording, condensed. */
      axes: {
        kicker: 'How to read this',
        line: 'The job and the contract are separate choices',
        d: 'Every role belongs to a group, and every group belongs to a sector. How we supply the person is a separate choice, and it is the same in every sector.',
        note: 'The same role can be supplied as temporary staff, on secondment, as a permanent hire or inside a project team. The job stays the same and only the contract changes.',
        },

      /* METHOD, source page 5. Three triplets, in the source's own order.
         They are cadence rather than process — the previous page ran a
         seven-step journey (Source, Screen, Verify, Match, Deploy, Monitor,
         Develop) which appears nowhere in this document. */
      method: [
        { k: 'We move fast and choose carefully', d: 'Your request takes minutes to record. After that, one person at ORYX owns it.' },
        { k: 'The role comes first', d: 'We settle what the work is, then who is allowed to do it, and only then the dates.' },
        { k: 'Checked before the start date', d: 'Documents, site instructions and the placement itself are checked, in that order.' },
      ],

      /* TRUST, source page 5. Principles, not a certificate matrix.
         `line` is the differentiator the source states first, and the three
         restraint clauses under it are the ones that make the claim credible —
         each one narrows what ORYX is promising rather than widening it. */
      trust: {
        kicker: 'What we promise',
        line: 'A job title does not tell you everything about a person.',
        d: 'We check the evidence before we promise anything. Technology can make a suggestion, but our own staff make the decision and can overrule it.',
        holds: [
          'Availability and qualifications are reconfirmed for every assignment.',
          'A certificate does not automatically grant authority.',
          'A status applies to one assignment for a set period. It is not a general certificate for the person.',
          'This website never promises more than ORYX can prove.',
        ],
      },

      bestFit: 'Best fit',

      /* The source prompt. The button label beside it is not here: all three
         request buttons are named in `content/requests.js`, next to the inbox
         each one sends to. */
      prompt: 'Which people does your schedule need?',
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
    promise: 'One plan for your property, and one team accountable for it.',
    body: 'Maintenance, renovation and heritage restoration run from one plan, from the first property assessment through to handover and aftercare.',
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
      lede: 'ORYX organises property maintenance, renovation and heritage restoration from one plan, and shows you the results.',
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
      forkLede: 'Start by deciding what the property needs. The list of trades comes after that.',
      forkTop: { k: 'Datum', v: 'One property, assessed once.', n: 'ORYX Property Check' },
      forkFoot: { k: 'Whichever is chosen', v: 'One plan, one accountable team and results you can check.', n: 'Evidence-based handover' },
      forkSet: 'Scope, phasing and budget range are set at the ORYX Property Check, for whichever is chosen.',
      forkNote: 'We keep what has value, repair what needs it and replace only as a last resort.',
      forkNoteKey: 'The three options are ordered by how deep the work goes, not by preference.',
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
          cav: 'Energy-performance and permit requirements depend on the work. This is a scenario with expected effects, not a guarantee.',
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
            { t: 'Structural', ref: '06', st: 'Qualified specialist' },
            { t: 'Extension', ref: '06' },
          ],
          cav: 'We look at feasibility and risk first, then at scope, programme and delivery.',
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
        line: 'We show evidence before we make promises.',
        d: 'We do not publish a certification, standard, response-time, capacity or availability claim unless we hold current evidence for it. We publish only what ORYX can actually deliver.',
      },

      /* The cross-link the source requires. "ORYX Property Care delivers and
         coordinates complete work packages — the client has work delivered.
         ORYX Workforce supplies tradespeople managed by the client. The
         cross-link between them is people, not contracted works." */
      cross: {
        k: 'Need tradespeople instead?',
        d: 'This page is work ORYX delivers and coordinates as complete packages, with one scope, programme and handover record. Supplying skilled people for your own team to manage is a different service, ORYX Workforce.',
        cta: 'ORYX Workforce',
      },

      /* The intake every route on the site is meant to end at. */
      check: {
        k: 'Property Check',
        d: 'A few details are enough to start: the type of property, where it is, what needs doing and when you would like to begin.',
      },
      prompt: 'Tell us about the property.',
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
