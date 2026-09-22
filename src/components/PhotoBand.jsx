import Icon from './Icon'

/**
 * A slow band of photographs, each one a door to a popup.
 *
 * Two identical runs and a translate of exactly half, the same construction as
 * the client tape on Transport, so the second run is under the pointer as the
 * first one leaves and the loop has no seam. The second run exists only to
 * close that loop: it is hidden from assistive technology and out of the tab
 * order, or every item would be announced and tabbed through twice.
 *
 * Shared by Workforce (twelve sectors) and Renovation (nine services). The
 * styles read only colour tokens, so the same band sits on a dark page and on
 * Renovation's cream sheet. `items` carry an id, a label, an icon name and the
 * picture; `onOpen` receives the id.
 */
export default function PhotoBand({ items, onOpen, label }) {
  return (
    <section className="pband" aria-label={label}>
      <div className="pband-rail">
        {[0, 1].map((copy) => (
          <ul className="pband-run" key={copy} role="list" aria-hidden={copy === 1 ? 'true' : undefined}>
            {items.map((it) => (
              <li key={it.id}>
                <button
                  type="button"
                  className="pband-tile"
                  tabIndex={copy === 1 ? -1 : undefined}
                  onClick={() => onOpen(it.id)}
                  aria-haspopup="dialog"
                >
                  {it.img && <img src={it.img.src} alt="" loading="lazy" />}
                  <span className="pband-k"><Icon name={it.icon} size={16} />{it.label}</span>
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
