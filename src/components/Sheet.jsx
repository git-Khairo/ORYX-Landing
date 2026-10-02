import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useEscape, useFocusTrap } from '../lib/useOverlay'
import Icon from './Icon'
import { ui } from '../content/ui'

/**
 * The detail popup.
 *
 * Opened from a sector card on Workforce and a service card on Renovation. It
 * is a dialog over the service page, which is itself a dialog, so three things
 * matter: Escape must close only this layer, Tab must stay inside it, and the
 * page behind must not scroll under a finger. The first two come from
 * `useOverlay`. The third is free, because the popup is portalled to `body`
 * and the service page's scroller is not one of its ancestors.
 *
 * `tone` is the service id. The popup lives outside `.world`, so it would
 * otherwise lose the page's palette and type. Carrying the `world--<id>` class
 * brings the tokens with it, which is what keeps Renovation's popup light and
 * the other two dark without a second set of styles.
 *
 * The entrance is a transform only, never an opacity fade, so a stalled
 * animation clock costs a few pixels of offset and not the whole panel.
 */
export default function Sheet({ tone, label, image, onClose, children, actions }) {
  const trap = useFocusTrap(true)
  const uid = useId().replace(/:/g, '')
  const body = useRef(null)
  useEscape(true, onClose)

  /* Open at the top every time, whatever the last popup was scrolled to. */
  useEffect(() => {
    if (body.current) body.current.scrollTop = 0
  }, [])

  return createPortal(
    <div
      className={`sheet ${tone ? `world--${tone}` : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-t`}
      ref={trap}
    >
      <div className="sheet-back" onClick={onClose} aria-hidden="true" />
      <div className="sheet-card">
        <button type="button" className="sheet-close" onClick={onClose} aria-label={ui.common.close}>
          <Icon name="close" size={18} />
        </button>

        {/* The only scroller in the popup, and none of the buttons live inside
            it. Focusable, so arrow keys and Page Down can reach the text below
            the fold from the keyboard in every browser. */}
        <div className="sheet-body" ref={body} tabIndex={0} role="region" aria-labelledby={`${uid}-t`}>
          {image?.src && (
            <figure className="sheet-img">
              <img src={image.src} alt={image.alt || ''} />
            </figure>
          )}
          <div className="sheet-in">
            <h3 className="sheet-title" id={`${uid}-t`}>{label}</h3>
            {children}
          </div>
        </div>

        {actions && <div className="sheet-actions">{actions}</div>}
      </div>
    </div>,
    document.body,
  )
}
