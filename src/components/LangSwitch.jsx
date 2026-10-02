import { useContext, useEffect, useId, useRef, useState } from 'react'
import { LANGS, LANG_NAMES, DEFAULT_LANG, getLang, pathFor } from '../i18n/core'
import { switchLanguage } from '../i18n/boot'
import { LangContext } from '../i18n/context'
import { ui } from '../content/ui'
import { useEscape } from '../lib/useOverlay'
import Icon from './Icon'

/**
 * EN / NL / FR / DE.
 *
 * Every option is a real link to that language's address, with `hreflang`,
 * so it works without script, opens in a new tab on a middle click, and is
 * how a search engine finds the other three versions. A plain click is
 * intercepted only to carry the open service page across the load.
 *
 * `menu` is the compact form for the bars: the current code on a button, the
 * four names under it. `list` is the footer's row of names.
 */
export default function LangSwitch({ variant = 'menu', className = '' }) {
  const carry = useContext(LangContext)
  const current = getLang()
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const uid = useId().replace(/:/g, '')

  /* Out with a click anywhere else. */
  useEffect(() => {
    if (!open) return
    const away = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  /* And with Escape, which hands focus back to the button. Through the shared
     stack, so that inside a service page Escape closes this menu and not the
     page under it. */
  useEscape(open, () => {
    setOpen(false)
    root.current?.querySelector('button')?.focus()
  })

  /* Tabbing out of the open menu closes it rather than leaving it over the
     page. */
  const leave = (e) => { if (!root.current?.contains(e.relatedTarget)) setOpen(false) }

  const go = (lang) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
    e.preventDefault()
    if (lang === current) { setOpen(false); return }
    if (carry) carry(lang)
    else switchLanguage(lang)
  }

  const links = LANGS.map((l) => (
    <li key={l}>
      {/* English by its own address, `/en/`, which counts as choosing it: the
          bare root would send a new tab back to a language picked earlier. */}
      <a
        href={l === DEFAULT_LANG ? '/en/' : pathFor(l)}
        hrefLang={l}
        lang={l}
        aria-current={l === current ? 'true' : undefined}
        onClick={go(l)}
      >
        {variant === 'menu' && <b>{l.toUpperCase()}</b>}
        <span>{LANG_NAMES[l]}</span>
      </a>
    </li>
  ))

  if (variant === 'list') {
    return (
      <nav className={`lang-list ${className}`} aria-label={ui.lang.label}>
        <ul role="list">{links}</ul>
      </nav>
    )
  }

  return (
    <div className={`lang ${open ? 'is-open' : ''} ${className}`} ref={root} onBlur={leave}>
      <button
        type="button"
        className="lang-btn"
        aria-expanded={open}
        aria-controls={`${uid}-langs`}
        aria-label={`${ui.lang.choose}: ${LANG_NAMES[current]}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{current.toUpperCase()}</span>
        <Icon name="chevron" size={12} />
      </button>
      <ul className="lang-pop" id={`${uid}-langs`} role="list" hidden={!open}>
        {links}
      </ul>
    </div>
  )
}
