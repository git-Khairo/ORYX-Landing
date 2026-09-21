# ORYX image prompts

Twenty-three pictures, one look. Generate them in ChatGPT Images, save each
under the file name given, and drop it in the folder given. The site picks it
up on the next build and the stock placeholder disappears on its own. Nothing
in the code needs to change.

After adding pictures, run this once so the brochures use them too:

```bash
npm run brochures
```

## Before you start

1. **Attach three reference images to every request**: the dark ORYX identity
   board, the light ORYX identity board, and `public/logo.png`. Then say in the
   prompt: *use the attached ORYX mark exactly as drawn, do not redraw it.*
   Image models invent logos unless they are shown the real one.
2. **Size**: landscape, 1600 x 1000 pixels or larger, ratio 16:10.
3. **Composition**: keep the main subject in the middle third. The card puts a
   number in the bottom-left corner and an icon in the bottom-right, and the
   popup crops the picture to a wide banner, so the top and bottom edges are
   cut off there.
4. **Save as** `.jpg`, with exactly the file name listed. Lower case.

## The ORYX look (paste this at the end of every prompt)

> Documentary photograph, natural light, shallow depth of field, shot on a
> 35mm lens at eye level. Muted, warm palette built from black, sand beige,
> warm grey, deep brown and off-white. No saturated colours anywhere in the
> frame. No orange or yellow hi-vis.
>
> ORYX uniform, consistent in every picture: field staff wear a black safety
> vest with sand-beige trim and warm-grey reflective strips over black
> workwear, and a matte black hard hat. The ORYX horn mark in metallic sand
> gold sits on the left chest of the vest, large on the back of the vest, and
> on the front of the helmet. Supervisors wear a crisp white long-sleeved
> shirt with the same gold ORYX mark and the words ORYX GROUP embroidered on
> the left chest, black trousers, and carry a black tablet. ORYX vehicles are
> matte black vans with one diagonal sand-gold stripe and the gold ORYX mark on
> the side. Use the attached ORYX mark exactly as drawn, do not redraw it.
>
> People are absorbed in their work and never look at the camera. No stock
> smiles. No text, captions, watermarks or other company names anywhere.
> Northern European setting, overcast or soft morning light. Landscape, 16:10.

Whenever a picture has a supervisor in it, there is one supervisor and the rest
are field staff. That keeps the white shirt meaning something.

## Workforce sectors

Folder: `src/assets/cards/workforce/`

| File | Prompt |
|---|---|
| `cleaning.jpg` | Two ORYX cleaning operatives at work in the entrance hall of a modern office building early in the morning. One guides a ride-on floor scrubber across polished stone, the other wipes a glass partition. Black ORYX vests over black workwear, no helmets indoors. Wet floor reflecting the window light. |
| `transport.jpg` | An ORYX driver in black vest stepping down from the cab of a matte black ORYX lorry at a distribution centre at dawn, and a forklift operator in black vest and black helmet moving a wrapped pallet behind him. Loading docks in the background. |
| `property.jpg` | A small ORYX construction crew on the scaffold of a brick building under renovation. A carpenter fixes a timber frame and a bricklayer points a wall, both in black vests and black hard hats. An ORYX supervisor in a white shirt and black helmet checks a drawing on a tablet beside them. |
| `technical.jpg` | An ORYX maintenance technician in black vest and black helmet kneeling at an open electrical control cabinet in a clean plant room, testing with a multimeter. Pipework and valves behind, a black ORYX tool case open on the floor. |
| `manufacturing.jpg` | ORYX production operators on a modern factory assembly line, black vests over black workwear, black bump caps. One operator checks a part at a workstation, another watches a machine panel. Long line of machines receding into soft focus. |
| `infrastructure.jpg` | An ORYX groundworks crew laying fibre cable ducts in an open trench along a Dutch street. Two workers in black vests and black hard hats guide a cable drum, a compact excavator behind them. Paving stacked neatly to one side. |
| `traffic.jpg` | An ORYX traffic controller in black vest and black helmet directing vehicles past road works on a wet provincial road. Sand-beige and black barriers, black cones with reflective bands, and a black ORYX van with its diagonal gold stripe parked on the verge. |
| `agriculture.jpg` | ORYX workers harvesting vine tomatoes inside a vast Dutch glass greenhouse. Black ORYX vests over black work shirts, no helmets. Rows of plants run to a vanishing point, warm diffused light through the glass roof, picking trolleys between the rows. |
| `waste.jpg` | ORYX operatives at a recycling sorting line inside a clean modern facility. Black vests, black hard hats, gloves, sorting material on a conveyor. Bales of sorted cardboard stacked behind them in warm grey and brown tones. |
| `healthcare.jpg` | An ORYX care worker helping an elderly woman walk along a bright corridor of a care home, seen from behind and slightly to the side so neither face is the subject. The care worker wears a black ORYX tunic with sand-beige trim and the gold mark on the sleeve. Calm, respectful, soft daylight. |
| `maritime.jpg` | ORYX dock workers securing a container on the quay of a large European port at first light. Black vests, black hard hats, a lashing rod in hand. Stacked containers in muted colours and a gantry crane above, sea mist in the distance. |
| `retail.jpg` | An ORYX retail team member restocking shelves in a calm, well-lit store before opening, and a colleague at the service desk behind. Black ORYX polo shirts with sand-beige collar trim and the gold mark on the chest. Neutral products with no readable brands. |

## Renovation services

Folder: `src/assets/cards/renovation/`

| File | Prompt |
|---|---|
| `property-check.jpg` | An ORYX supervisor in a white shirt and black hard hat inspecting the brick facade of an older Dutch apartment building, tablet in one hand, pointing at a crack beside a window frame. A field colleague in a black vest holds a measuring pole. Overcast light. |
| `responsive-void.jpg` | An ORYX tradesperson in black vest repairing a door lock in an empty, freshly cleared flat. Bare walls, a toolbox on a dust sheet, daylight from an uncurtained window. A second worker patches plaster in the next room, seen through the doorway. |
| `planned-major.jpg` | Scaffolding wraps the facade of a block of flats. ORYX painters in black vests and black hard hats repaint external window frames, and a roofer works at the eaves above. A black ORYX van with the diagonal gold stripe is parked at the foot of the scaffold. |
| `interiors.jpg` | An ORYX fitter in black vest installing a new kitchen in an occupied flat, levelling a cabinet. Dust sheets protect the floor, a tiler finishes a splashback behind. Clean, orderly site with tools laid out in a row. |
| `renovation-energy.jpg` | Two ORYX installers in black vests and black hard hats fitting a large triple-glazed window into the insulated wall of a 1970s house. Fresh insulation boards visible around the opening, a heat pump unit on the ground nearby. |
| `conversion.jpg` | The stripped interior of an old industrial building being converted: exposed concrete columns, new metal stud walls going up. An ORYX supervisor in white shirt and black helmet walks the floor with a drawing while two field staff in black vests fix a partition. |
| `heritage.jpg` | An ORYX craftsperson in black vest and black hard hat restoring carved stonework on the entrance of a historic canal house in Amsterdam, working from a small scaffold with a chisel and soft brush. Centuries-old brick and sandstone in warm tones. |
| `specialist.jpg` | Two ORYX specialists in full white protective suits and respirators working inside a sealed containment area made of translucent sheeting, with an airlock entrance. A supervisor in a white shirt and black helmet watches from outside the enclosure with a checklist. The ORYX mark is on the enclosure sign. |
| `project-management.jpg` | An ORYX supervisor in a white shirt talking with two residents at the entrance of their building during renovation works, showing them a schedule on a tablet. Scaffolding and a black ORYX van in the background, field staff in black vests at work behind. |

## Transport

Folder: `src/assets/cards/transport/`

| File | Prompt |
|---|---|
| `route.jpg` | A matte black ORYX van with a diagonal sand-gold stripe backed up to a loading bay at dawn, rear doors open. An ORYX driver in black vest scans a sealed crate with a handheld while a colleague wheels a pallet truck. Warm dock lighting against a blue-grey morning. |
| `proof.jpg` | The moment of delivery at a business reception: a customer signs on a black handheld device held by an ORYX driver in black vest. A sealed box with a sand-beige ORYX label sits on the counter between them. Hands and device sharp, faces soft. |

## Later: video

When Higgsfield is connected, the same uniform block applies. The site uses
nine clips: one opening film and one closing film for each of the three service
pages, and one for each of the three doors on the home page. Each should be a
slow, steady 8 to 10 second shot of the same scenes described above, with no
cuts and very little camera movement, because type is set over them.

## One note on honesty

These are illustrations of how ORYX works, not photographs of real jobs. That
is fine on a card. It stops being fine if a picture is captioned as a specific
completed project, so do not caption them that way.
