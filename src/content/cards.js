/**
 * Stand-in photographs for the card grids.
 *
 * One Pexels still per Workforce sector and per Renovation service. Every one
 * was opened and looked at before it was listed here, and then checked again
 * by a second pass, because stock titles on this project have been wrong
 * before. `alt` says what the picture actually shows.
 *
 * These are placeholders. The intended pictures are generated to the prompts
 * in `docs/image-prompts.md` and dropped into `src/assets/cards/`, where they
 * take over automatically. See `src/lib/cardImage.js`.
 *
 * Plain data with no imports, so the brochure script can read it in Node.
 */
export const cardStills = {
  /* ── Workforce ─ */
  'workforce/cleaning': {
    src: 'https://images.pexels.com/photos/34194579/pexels-photo-34194579.jpeg',
    alt: 'A worker in a blue jacket, orange helmet with visor and ear defenders and yellow gloves aims a high-pressure lance at a wooden pallet at night, with a large cloud of steam and red-and-white barrier tape behind him.',
  },
  'workforce/transport': {
    src: 'https://images.pexels.com/photos/21711145/pexels-photo-21711145.jpeg',
    alt: 'Black-and-white side view of a bald, bearded truck driver in silhouette sitting at the steering wheel inside a lorry cab, with a device mounted on a bracket at the right of the windscreen.',
  },
  'workforce/property': {
    src: 'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg',
    alt: 'A construction worker in a blue hard hat, orange hi-vis vest, safety harness and leather tool pouch kneels on a plywood roof deck and hammers a nail into a sheathing panel, with a safety rope trailing behind him.',
  },
  'workforce/technical': {
    src: 'https://images.pexels.com/photos/37668423/pexels-photo-37668423.jpeg',
    alt: 'A maintenance worker in a white hard hat with 1679 handwritten on it and a green shirt looks up and reaches with greasy hands to a heavy steel machine component overhead, with industrial pipework, valves and chains blurred behind him.',
  },
  'workforce/manufacturing': {
    src: 'https://images.pexels.com/photos/32845687/pexels-photo-32845687.jpeg',
    alt: 'Two workers in white hard hats and blue overalls checking a machine on a factory floor.',
  },
  'workforce/infrastructure': {
    src: 'https://images.pexels.com/photos/4575148/pexels-photo-4575148.jpeg',
    alt: 'A road crew in hi-vis vests spreading fresh asphalt by hand on a road under construction.',
  },
  'workforce/traffic': {
    src: 'https://images.pexels.com/photos/39142590/pexels-photo-39142590.jpeg',
    alt: 'A closed road with red and white safety barriers, a no-entry sign and a paving machine beyond them.',
  },
  'workforce/agriculture': {
    src: 'https://images.pexels.com/photos/20339261/pexels-photo-20339261.jpeg',
    alt: 'Workers at a potting machine inside a greenhouse, with soil pouring from a conveyor.',
  },
  'workforce/waste': {
    src: 'https://images.pexels.com/photos/11077610/pexels-photo-11077610.jpeg',
    alt: 'A waste collector in a yellow hi-vis vest and green work trousers, seen from behind, operates the controls at the rear of a white refuse truck on a city street at dusk.',
  },
  'workforce/healthcare': {
    src: 'https://images.pexels.com/photos/18459193/pexels-photo-18459193.jpeg',
    alt: 'A carer in a red top and white trousers leans over a bedside table holding a kettle beside a cup and saucer, while an elderly woman in a nightshirt sits up in bed by a bright window with potted plants.',
  },
  'workforce/maritime': {
    src: 'https://images.pexels.com/photos/13384293/pexels-photo-13384293.jpeg',
    alt: 'Two crew members in yellow hard hats and orange life vests haul on lines beneath a small orange deck crane with a pulley block, with grey sea and an overcast sky behind them.',
  },
  'workforce/retail': {
    src: 'https://images.pexels.com/photos/8476596/pexels-photo-8476596.jpeg',
    alt: 'A shop worker in a white sweatshirt and brown apron bends over wooden crates arranging cabbages among cucumbers and peppers in a small grocery store lined with shelves and jars.',
  },
  /* ── Renovation ─ */
  'renovation/property-check': {
    src: 'https://images.pexels.com/photos/8293673/pexels-photo-8293673.jpeg',
    alt: 'A man in a yellow hard hat and hi-vis vest holds a clipboard and reaches up to check the top hinge of an open dark front door on a house with pale grey cladding.',
  },
  'renovation/responsive-void': {
    src: 'https://images.pexels.com/photos/6473982/pexels-photo-6473982.jpeg',
    alt: 'A man in a white T-shirt, glasses and white work gloves holds a long metal straightedge against a freshly plastered wall in an empty room with a taped and sheeted window.',
  },
  'renovation/planned-major': {
    src: 'https://images.pexels.com/photos/8576025/pexels-photo-8576025.jpeg',
    alt: 'Two roofers in orange hard hats, one in a hi-vis jacket, stand on the dark tiled roof of brick terraced houses with white dormers while a crane chain lowers a bundle of timber battens.',
  },
  'renovation/interiors': {
    src: 'https://images.pexels.com/photos/15124970/pexels-photo-15124970.jpeg',
    alt: 'Two workers lean over the worktop of a newly fitted kitchen with pale blue and oak cabinets, while a red air compressor, paint buckets, a loose drawer and cables lie on the dusty tiled floor.',
  },
  'renovation/renovation-energy': {
    src: 'https://images.pexels.com/photos/5691531/pexels-photo-5691531.jpeg',
    alt: 'Seen from behind, a man in a checked shirt and dark work apron lifts a white-painted wooden window casement with hinges into a tall window opening in a bright, empty white room.',
  },
  'renovation/conversion': {
    src: 'https://images.pexels.com/photos/5505927/pexels-photo-5505927.jpeg',
    alt: 'A long, empty former industrial hall with a rough concrete ceiling and tapered concrete columns, new exposed spiral ventilation ducts and round pendant lights, tall steel-framed windows on the left, and pallets, tools and barrier tape at the far end of the bare open floor.',
  },
  'renovation/heritage': {
    src: 'https://images.pexels.com/photos/37627331/pexels-photo-37627331.jpeg',
    alt: 'A worker in a plain yellow hi-vis vest and shorts, seen from behind, stands on an aluminium ladder at an open upper window of an old honey-coloured stone house with three gabled dormers, stone roof tiles and stone chimneys, with a length of timber resting across the window and one neighbouring window boarded up.',
  },
  'renovation/specialist': {
    src: 'https://images.pexels.com/photos/6474199/pexels-photo-6474199.jpeg',
    alt: 'A worker in a grey hooded coverall, half-mask respirator, glasses and work gloves holds a long spray lance up towards the ceiling inside a room whose floor, walls and doorway are covered in taped-down clear plastic sheeting, viewed past a blurred wall in the left foreground.',
  },
  'renovation/project-management': {
    src: 'https://images.pexels.com/photos/8961298/pexels-photo-8961298.jpeg',
    alt: 'A woman in a checked shirt and work trousers holds large paper drawings and explains them to a man in a dusty black T-shirt who holds the other edge, inside a timber-walled building under renovation with a stone stove, a site vacuum, cables and a bare hanging light bulb behind them.',
  },
}
