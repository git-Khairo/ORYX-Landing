import { useState } from 'react'
import { services, pillars, brand } from '../content/copy'
import { portal } from '../content/media'

/**
 * The gateway, and the group beneath it.
 *
 * The gateway is two things side by side: three vertical doors, and the
 * board's own purpose panel.
 *
 * The doors are vertical because that is what a door is. They were horizontal
 * rows for a while, and the reason was real — a narrow column turns
 * "Transport & Logistics" into two cramped lines — but the fix is not to lie
 * the doors down, it is to let the one you are pointed at open. A closed door
 * carries its name rotated up its own edge, where a long title has as much
 * room as it needs; the open one takes most of the width and sets the same
 * name flat, with the promise underneath.
 *
 * Vision, mission and values sit inside the panel, as tabs. Stacked as three
 * open-and-close panels they needed roughly 830px against a 720px screen, and
 * the section either clipped or ran past the fold. One tab bar and one panel
 * carries the same content in a third of the height, which is what lets the
 * whole gateway hold to exactly one screen.
 */
/* React sets `muted` as a DOM property only — it never writes the attribute
   (facebook/react#10389) — and iOS Safari decides whether an `autoplay` video
   may start by reading the attribute. So on an iPhone the three doors sat
   black while every desktop browser played them. The attribute is set by
   hand and `play()` is called explicitly; when the policy still refuses (Low
   Power Mode, Safari's auto-play set to never) the first gesture starts it.
   Module-level so the ref is stable and runs once per mount, not per render. */
function startMuted(node) {
  if (!node) return
  node.muted = true
  node.setAttribute('muted', '')
  node.play?.().catch(() => {
    const evs = ['pointerdown', 'touchstart', 'keydown', 'wheel']
    const kick = () => {
      evs.forEach((e) => window.removeEventListener(e, kick))
      node.play?.().catch(() => {})
    }
    evs.forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }))
  })
}

export default function Work({ onOpenService, warm = true }) {
  /* Nullable, and starting closed. Nothing is open until you point at
     something — the page opens on three equal doors rather than on one that
     has already been chosen for you. */
  const [active, setActive] = useState(null)
  /* Starts closed, like the doors. With close-on-leave in play, opening on
     Vision by default would mean the panel is open before the pointer has
     been near it and shut for ever after. */
  const [open, setOpen] = useState(null)

  return (
    <section className="gate" id="work" aria-label="Services and purpose">
      {/* Everything closes when the pointer leaves the row — unless the
          keyboard is in there, in which case closing would pull the panel out
          from under someone who is still reading it with Tab. */}
      <div
        className="doors"
        onMouseLeave={(e) => {
          if (!e.currentTarget.contains(document.activeElement)) setActive(null)
        }}
      >
        {services.map((s) => {
            const isOn = active === s.id
            return (
              <button
                key={s.id}
                type="button"
                className={`door ${isOn ? 'is-on' : ''}`}
                /* A closed door opens on the first click and the world opens
                   on the second, so every door can also be closed again. On a
                   pointer the first step usually happens on hover, which makes
                   the click behave exactly as it did before. */
                onClick={() => (isOn ? onOpenService?.(s.id) : setActive(s.id))}
                onMouseEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                aria-label={`${s.title}. ${s.promise} ${isOn ? "Open this service." : "Show this service."}`}
              >
                {/* Always playing, never a still that swaps in on hover —
                    footage that only starts on approach announces itself as a
                    trick. Different clips from the opening film, so the page
                    is not showing the same six seconds twice. */}
                <span className="door-film" aria-hidden="true">
                  {warm && portal[s.id]?.src && (
                    <video
                      ref={startMuted}
                      src={portal[s.id].src}
                      poster={portal[s.id].poster}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="auto"
                    />
                  )}
                </span>

                <span className="door-index">{s.index}</span>

                {/* Two settings of one title. The rotated one belongs to the
                    closed door and the flat one to the open door; rendering
                    both and swapping which is visible keeps the change
                    instant, where re-rendering the text would flicker. */}
                <span className="door-spine" aria-hidden="true">{s.short}</span>

                <span className="door-open">
                  <span className="door-title">{s.title}</span>
                  <span className="door-promise">{s.promise}</span>
                  <span className="door-body">{s.body}</span>
                  <span className="door-go" aria-hidden="true">
                    Enter <i>→</i>
                  </span>
                </span>
              </button>
            )
        })}
      </div>

      {/* The brand panel.
          Its one structural idea belongs to this layout and could not be
          lifted from anywhere: the doors beside it carry their names rotated
          up their own edges, so the panel answers with the group's name
          rotated down its outer edge, full height. The two sit either side of
          the same screen and read as one composition rather than a column of
          content next to a column of pictures.

          Everything else follows from that. The wordmark is off the content
          column entirely, which frees the whole width for the statement; the
          mark sits alone at the head; and vision, mission and values run as a
          numbered index against horizontal rules — a contents page, not three
          bordered notes. */}
      <aside className="purpose">
        <div className="purpose-body">
          <span className="purpose-mark" aria-hidden="true" />

          {/* The statement leads. With the wordmark moved to the edge there is
              nothing above it competing for the top of the column, so it can
              be set at the size it deserves. */}
          <p className="purpose-line">{brand.purpose}</p>

          <p className="purpose-tagline">{brand.descriptor.join('  /  ')}</p>

          {/* Vision, mission and values, as a hover accordion. One open at a
              time, and all three shut once the pointer leaves the group — the
              panel is a preview, so it should not outlive the pointer that
              asked for it. Guarded on focus for the same reason as the doors:
              a keyboard user mid-read must not have it closed underneath them. */}
          <div
            className="mvv"
            onMouseLeave={(e) => {
              if (!e.currentTarget.contains(document.activeElement)) setOpen(null)
            }}
          >
            {pillars.map((p, i) => {
              const isOpen = open === p.id
              return (
                <article
                  className={`mvv-item ${isOpen ? 'is-open' : ''}`}
                  key={p.id}
                  onMouseEnter={() => setOpen(p.id)}
                >
                  <h3>
                    <button
                      type="button"
                      className="mvv-key"
                      aria-expanded={isOpen}
                      aria-controls={`mvv-${p.id}`}
                      /* Hover is unavailable to a keyboard or a touch screen,
                         so the button keeps working: focus opens it the way a
                         pointer would, and click toggles. */
                      onFocus={() => setOpen(p.id)}
                      onClick={() => setOpen(isOpen ? null : p.id)}
                    >
                      <span className="mvv-n">{String(i + 1).padStart(2, '0')}</span>
                      <span className="mvv-label">{p.label}</span>
                      <i className="mvv-sign" aria-hidden="true" />
                    </button>
                  </h3>

                  {/* A one-row grid from `0fr` to `1fr`: the height animates
                      with nothing measured, no max-height guess to be wrong
                      about, and no layout read on every frame. */}
                  <div className="mvv-panel" id={`mvv-${p.id}`}>
                    <div className="mvv-inner">
                      {p.id === 'values' ? (
                        <ul className="mvv-vals">
                          {p.points.map((pt) => (
                            <li key={pt.k}>{pt.k}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{p.headline}</p>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <p className="purpose-foot">{brand.slogan}</p>
        </div>

        {/* The wordmark, down the outer edge, answering the door spines. */}
        <p className="purpose-spine wordmark-spine" aria-hidden="true">
          {brand.full}
        </p>
        <span className="sr-only">{brand.full}</span>
      </aside>
    </section>
  )
}
