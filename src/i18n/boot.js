/**
 * Choosing the language, in the browser, before anything else runs.
 *
 * The address decides: `/nl/…`, `/fr/…` and `/de/…` are those languages, and
 * everything else is English. Only the bare root ever moves a visitor, and
 * only when they have not chosen English themselves:
 *
 *   - a language they picked before, remembered in localStorage, wins;
 *   - otherwise the first of their browser's languages that the site has;
 *   - otherwise English, which needs no move at all.
 *
 * A shared `/de/` link always opens in German, whatever was picked before,
 * because a link is a choice too. `/en/` is not an address of its own: it
 * goes to `/`, and counts as choosing English.
 *
 * Switching language is a page load of the other address. Before it goes,
 * the page leaves a note in sessionStorage (the open service page, the scroll
 * position, and that the intro has been seen) which the new page picks up, so
 * a visitor who switches mid-read lands where they were, without the film.
 */
import { LANGS, DEFAULT_LANG, setLanguage, pathFor } from './core'

const KEY = 'oryx-lang'
const CARRY = 'oryx-carry'

/* Storage may refuse to exist at all: with site data blocked, merely reading
   `window.localStorage` throws. So each store is looked up by name inside the
   guard, and a refusal means "nothing remembered", never a blank page. */
const read = (name, k) => { try { return window[name].getItem(k) } catch { return null } }
const write = (name, k, v) => { try { window[name].setItem(k, v) } catch { /* blocked or private */ } }
const drop = (name, k) => { try { window[name].removeItem(k) } catch { /* blocked */ } }

/* One chunk per language, fetched only by a visitor reading in it. */
const tables = {
  nl: () => import('./locales/nl.json'),
  fr: () => import('./locales/fr.json'),
  de: () => import('./locales/de.json'),
}

export const langFromPath = (pathname) => {
  const seg = pathname.split('/')[1]
  return LANGS.includes(seg) && seg !== DEFAULT_LANG ? seg : DEFAULT_LANG
}

function preferred() {
  const saved = read('localStorage', KEY)
  if (LANGS.includes(saved)) return saved
  for (const tag of navigator.languages || [navigator.language || '']) {
    const code = String(tag).slice(0, 2).toLowerCase()
    if (LANGS.includes(code)) return code
  }
  return DEFAULT_LANG
}

/* A promise that never settles: the page is navigating away, and nothing
   should render in the moment before it goes. */
const leaving = (to) => { location.replace(to); return new Promise(() => {}) }

export async function boot() {
  const { pathname, search, hash } = location
  /* `/en/` is someone asking for English by name: remember it, so the root
     does not then send them back to a language picked earlier. */
  if (pathname.split('/')[1] === DEFAULT_LANG) {
    write('localStorage', KEY, DEFAULT_LANG)
    return leaving('/' + search + hash)
  }

  const lang = langFromPath(pathname)
  if (lang === DEFAULT_LANG && (pathname === '/' || pathname === '/index.html')) {
    const want = preferred()
    if (want !== DEFAULT_LANG) return leaving(pathFor(want) + search + hash)
  }

  let table = null
  if (lang !== DEFAULT_LANG) {
    try { table = (await tables[lang]()).default } catch { table = null }
  }
  setLanguage(lang, table)
  document.documentElement.lang = lang

  /* Imported only now, so it is evaluated in the chosen language. */
  const { ui } = await import('../content/ui.js')
  document.title = ui.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', ui.meta.description)
  return lang
}

/* The switcher's action. `carry` is whatever the app wants back after the
   load: today the open service page. A service page scrolls inside its own
   panel while the page behind it is pinned, so its position is carried too. */
export function switchLanguage(lang, carry = {}) {
  write('localStorage', KEY, lang)
  const panel = document.querySelector('.world-scroll')
  write('sessionStorage', CARRY, JSON.stringify({ ...carry, y: window.scrollY, wy: panel ? panel.scrollTop : 0 }))
  location.assign(pathFor(lang) + location.hash)
}

/* Read once, by the app's first render, and then forgotten, so a plain reload
   later plays the intro as usual. */
export function takeCarry() {
  const raw = read('sessionStorage', CARRY)
  if (!raw) return null
  drop('sessionStorage', CARRY)
  try { return JSON.parse(raw) } catch { return null }
}
