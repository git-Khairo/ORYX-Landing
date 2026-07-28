# ORYX

The ORYX brand experience. One page, nine scenes, three expandable
service worlds and a guided contact journey per service.

```bash
npm --prefix site run dev
```

Then open http://localhost:3000.

```bash
npm --prefix site run build     # production build
npm --prefix site run typecheck # types only
```

**Stop the dev server before building.** Both write to `site/.next`, and running
them together corrupts the dev server into serving 500s with
`__webpack_modules__[moduleId] is not a function`. Recovery is
`rm -rf site/.next` and a restart.

**This project sits inside OneDrive**, which will dehydrate build output into
cloud placeholders and make Next fail to require files that plainly exist on
disk. The build directory is pinned with `attrib +P -U .next /S /D`. If you ever
delete `.next` and start seeing `Cannot find module for page` or a missing
`.nft.json`, run that again from PowerShell in the `site` folder.

## Stack

Next.js 15 App Router, TypeScript, Tailwind v4 (token based), Motion
for interface and shared layout transitions, Zustand for experience
state. No GSAP: every piece of scroll choreography here is either a
scroll driven transform or a sticky stage, both of which Motion's
`useScroll` handles without a second animation runtime competing for
the same frames.

## How the experience is put together

```
src/
  app/
    layout.tsx            fonts, metadata, skip link
    globals.css           tokens, type scale, snapping, reduced motion
    api/requests/route.ts request intake and server side validation
  lib/
    content.ts            all copy, services, sub-scenes, journeys
    chapters.ts           the nine scenes, in order
    store.ts              service expansion, contact progress
    hooks.ts              scroll lock, escape, focus trap, mounted
  components/
    Experience.tsx        composition, hash and history handling
    layout/Scene.tsx      scene shell, accent ownership, reveals
    media/                OperationalCanvas, SceneMedia
    chrome/               opening, nav, journey rail, scene tracker
    scenes/               the nine main scenes
    services/             territories and expanded worlds
    contact/              gateway, doors, guided journeys
```

### Scene model

Every scene owns exactly one accent and sets it as `--accent`. Nothing
reads a service colour directly, which is what keeps the rule "one
dominant accent per scene" true by construction rather than by
discipline.

Scenes that fit a viewport are snap targets. Scenes that need scroll
length to tell their story (`Partner`, `Process`) carry `free` and opt
out, so a tall section can never trap the visitor. Snapping is
`proximity`, desktop only, precise pointers only, and off entirely
under reduced motion.

### Service expansion

Selecting a service is a state change, never a route. The panel's
media carries a `layoutId`, so the same object grows into the full
viewport. The hash records it (`#cleaning`) so the browser back action
and the "All services" control both close it through one path. The
page underneath is never unmounted, and the scroll position is exact
on return.

Scroll locking uses two techniques on purpose: hidden document
overflow on precise pointers, where `scrollbar-gutter: stable` keeps
every element at the same viewport coordinate during the shared
element transition, and a pinned body on touch, where hidden overflow
is unreliable.

### Contact

Contact never opens a form. It opens a gateway with one question and
three environments. Choosing one starts a seven step journey shaped to
that service, one question per screen. Progress lives in
`sessionStorage`, so closing the gateway to check something costs
nothing. The summary is editable per answer, and the API route
validates independently of the client.

### Reduced motion

Not a degraded version. Parallax and scrubbing fall away, reveals
become fades, snapping is disabled, the canvas paints one composed
frame instead of animating, and the opening moment is skipped. All
content and every interaction remain.

## Media

All media slots currently render operational drawings on canvas. See
[MEDIA.md](MEDIA.md) for the art direction of each slot and the two
line change that swaps one for footage.

## Before launch

These are placeholders that need a decision from the business:

- `hello@oryx.nl` in the closing scene, and `https://oryx.nl` in
  `layout.tsx` metadata
- The request endpoint logs to the server console. Point it at the
  real destination in `src/app/api/requests/route.ts`
- Dutch and Arabic are wired for typography and direction but not
  translated. The language control lists them as not yet available
- No response time is promised anywhere. Add one only once the
  business commits to it
