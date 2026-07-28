# ORYX media direction

Every media slot in the experience currently renders an **operational
drawing**: a live canvas composition that expresses the idea the slot
carries. These are not stand-ins waiting to be replaced by anything at
hand. They are the art direction for the footage, and several of them
are strong enough to keep as the permanent treatment.

## How to switch a slot to real footage

Each slot is a `<SceneMedia>` call. Uncomment the two props:

```tsx
<SceneMedia
  variant="drift"
  accent="#B9975B"
  scrim="edge"
  src="/media/hero-montage.mp4"
  poster="/media/hero-montage.jpg"
/>
```

Drop the files into `public/media/`. If the video fails to load for any
reason the slot falls back to its drawing automatically, so a missing
or blocked file can never leave a hole in the page.

## Encoding requirements

| Property | Value |
|---|---|
| Container | MP4 (H.264, `yuv420p`) plus WebM/VP9 where bandwidth matters |
| Resolution | 1920x1080 master, 1280x720 mobile variant |
| Duration | 8 to 14 seconds, seamless loop |
| Bitrate | 2.5 to 4 Mbps desktop, 1.2 Mbps mobile |
| Audio | None. Strip the track entirely, do not just mute it |
| Poster | JPEG at 60 quality, first frame, under 120 KB |
| Motion | Slow. Camera moves under 10 px per second on screen |

The player already handles the rest: muted, looping, inline, lazy,
paused off screen and paused on a hidden tab.

## Grading

Footage is graded in CSS: desaturated to about 42%, contrast lifted
slightly, brightness pulled to 62%. Shoot and deliver **neutral**. Do
not bake in a look, and do not deliver anything already crushed to
black. Every slot then sits under a scrim, so legibility never depends
on where the subject happens to be in frame.

## Slots

### H1. Hero montage
**Scene:** 01, dune accent, `scrim="edge"`
One continuous montage that connects the three worlds so they read as
one company rather than three stock clips. Suggested beats: a vehicle
moving through a Dutch city at first light; a commercial interior
already in perfect condition before anyone arrives; a facility
professional walking a plant room with a tablet; hands, schedules,
door handles, a signature at a handover. Cut on movement, never on a
logo. No faces to camera, no smiling, no thumbs up.

### T1. Technology and coordination
**Scene:** 03, teal accent, `scrim="left"`
Not a screen recording and not a dashboard. Shallow depth of field on
real coordination: a planner glancing at a schedule, a route being
adjusted, a check being recorded on site. The canvas drawing behind
this slot is a timeline with a scanning column, and the footage should
feel like the human half of the same picture.

### S1. Sustainability
**Scene:** 06, light passage, dune accent, `scrim="light"`
The only bright slot. Natural light on real material: correctly dosed
product, a reusable cloth being folded, a single combined run instead
of three trips. No leaves, no globes, no drone-over-forest. The claim
is method, not nature.

### SV1 to SV3. Service territories
**Scene:** 04, one per service, and reused in the contact gateway doors
Each territory needs a loop that survives being cropped to a narrow
vertical column at desktop and a wide band on mobile. Compose for the
centre third.

- **SV1 Transportation**, transport blue. Movement seen from a fixed
  camera: a vehicle entering frame, a dock, a load secured. Motion
  crosses the frame, it does not come toward the lens.
- **SV2 Cleaning**, cleaning aqua. Detail over activity: a surface
  changing state, light returning to a floor, a room resetting. Show
  the result, not the labour.
- **SV3 Facility Management**, facility copper. Systems and structure:
  risers, meters, roof plant, a corridor at night with everything
  working. Architectural, still, controlled.

### W1 to W3. Inside the service worlds
Each expanded world has five sub-scenes. They currently carry drawings
matched to their argument (`routes`, `converge`, `telemetry`, `plan`,
`sweep`, `drift`, `pulse`). If footage is produced for these, shoot
them as a set with one camera language per service so the world holds
together while scrolling.

### C1. Contact environments
Reuses SV1 to SV3. The three doors are the same three territories, so a
visitor who chose transportation in the selector recognises the room
they walked into.

## What not to deliver

- Random stock with mismatched grade, lens and colour temperature
- Anything with an audio bed
- Aerials and drone reveals
- People performing enthusiasm at the camera
- Screens showing invented software with fake data
- Slow-motion sparkle, lens flares, speed ramps
