/**
 * The site in four languages, without a second copy of any content.
 *
 * Every content module keeps its English as it is and wraps each export in
 * `localize('<file>.<export>', value)`. In English that returns the value
 * untouched. In another language it returns a copy in which every string a
 * visitor reads has been swapped for its translation, looked up by its path:
 *
 *     copy.services.transport.promise      → "Op tijd geleverd, …"
 *     workforce.roles.adr-driver.0         → "ADR-chauffeur"
 *
 * So structure, ids, media and order live in one place, and a language file
 * is nothing but `path → text`. A path with no translation falls back to the
 * English, so a missing line shows English rather than breaking the page,
 * and `npm run i18n:check` lists every gap.
 *
 * The language is fixed for the life of the page: switching language loads
 * that language's address (`/nl/`, `/fr/`, `/de/`), so nothing here has to be
 * reactive. `src/main.jsx` sets it before the app, and with it every content
 * module, is imported.
 *
 * No browser APIs at module level: the build scripts import the content in
 * Node and get English.
 */

export const LANGS = ['en', 'nl', 'fr', 'de']
export const DEFAULT_LANG = 'en'

/* Each language's name in itself, for the switcher. */
export const LANG_NAMES = { en: 'English', nl: 'Nederlands', fr: 'Français', de: 'Deutsch' }

let current = DEFAULT_LANG
let dict = null

export const getLang = () => current

export function setLanguage(lang, table) {
  current = LANGS.includes(lang) ? lang : DEFAULT_LANG
  dict = current === DEFAULT_LANG ? null : table || null
}

/* Keys whose strings are data, not copy: references, media, modes, colours. */
const SKIP_KEYS = new Set([
  'id', 'src', 'poster', 'href', 'type', 'film', 'enter', 'cam', 'icon',
  'credit', 'email', 'kind', 'path', 'provider', 'publicKey', 'serviceId',
  'templateId', 'text', 'tone', 'accent', 'cond', 'sources', 'horn',
  /* The Dutch names of the two methods are names, in every language. */
  'nl',
  /* A sector group's `roles` is a list of role ids, not of words. */
  'roles',
])

/* Whole branches that stay English everywhere. The slogan spells ORYX, and
   `letters` is the same slogan split against the letters it comes from. */
const SKIP_PATHS = new Set(['copy.brand.slogan', 'copy.brand.letters', 'copy.brand.full'])

/* A string with no letters (a time, a number), a slug ("cleaning-operative",
   "groundworker--infrastructure"), an address, a URL or a colour. A single
   lowercase word is NOT excluded: "roles" and "works" are copy. */
const NOT_COPY = /^[^A-Za-zÀ-ÿ]*$|^[a-z0-9]+(?:[-_/.]+[a-z0-9]+)+$|^(?:https?:|mailto:|tel:|\/|#)|^[^\s@]+@[^\s@]+$/

/* Status codes that sit among copy as data: the role statuses in the role
   tuples, and the condition on a renovation work. */
const CODES = new Set(['req', 'qc', 'qualified', 'project'])

export const isCopy = (s) => typeof s === 'string' && !CODES.has(s) && !NOT_COPY.test(s.trim())

/* An array element's path segment: its id when it has one, so reordering a
   list does not shift every translation after it; otherwise its index. */
const seg = (item, i) => (item && typeof item === 'object' && typeof item.id === 'string' ? item.id : String(i))

/* Calls `visit(path, string)` for every visitor string under `value`. Shared
   by `localize` and by the extraction script, so both agree on every path. */
export function walkCopy(value, path, visit) {
  if (SKIP_PATHS.has(path)) return value
  if (typeof value === 'string') return isCopy(value) ? visit(path, value) : value
  if (Array.isArray(value)) return value.map((v, i) => walkCopy(v, `${path}.${seg(v, i)}`, visit))
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out = {}
    for (const k of Object.keys(value)) out[k] = SKIP_KEYS.has(k) ? value[k] : walkCopy(value[k], `${path}.${k}`, visit)
    return out
  }
  return value
}

export function localize(ns, value) {
  if (!dict) return value
  return walkCopy(value, ns, (path, s) => (typeof dict[path] === 'string' && dict[path] ? dict[path] : s))
}

/* "{n} works" → "7 works". */
export const fmt = (s, vars = {}) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m))

/* `forms` is `{ one, other }`; every one of the four languages takes the
   singular for exactly 1. */
export const plural = (n, forms, vars = {}) => fmt(n === 1 ? forms.one : forms.other, { n, ...vars })

/* A card's brochure in the language being read: English in `/brochures/`,
   the others in a folder of their own, as `scripts/build-brochures.mjs`
   writes them. The saved file carries the language too, so a reader who
   downloads two languages does not get one file overwriting the other. */
export const brochure = (name) =>
  current === DEFAULT_LANG
    ? { href: `/brochures/${name}.pdf`, download: `${name}.pdf` }
    : { href: `/brochures/${current}/${name}.pdf`, download: `${name}-${current}.pdf` }

/* The address of the current page in another language. English is the bare
   root; the others carry their code as the first path segment. */
export const pathFor = (lang) => (lang === DEFAULT_LANG ? '/' : `/${lang}/`)
