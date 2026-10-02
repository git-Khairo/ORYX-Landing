/**
 * One HTML page per language, after `vite build`.
 *
 * The app picks its language from the address in the browser, but a search
 * engine reads the HTML first. So `dist/nl/index.html`, `dist/fr/index.html`
 * and `dist/de/index.html` are written as copies of the built page with that
 * language's `lang` attribute, title and description, and every page, the
 * English root included, lists all four as alternates of each other with
 * `hreflang`, plus its own canonical address.
 *
 * nginx serves `/nl/` from `nl/index.html` (`try_files $uri $uri/`), and
 * redirects `/nl` to it relatively (`absolute_redirect off` in
 * docker/nginx.conf). The site's public address comes from SITE_URL,
 * defaulting to the live one; the Dockerfile passes it through.
 *
 * Safe to run twice: the links it adds are taken out of the page first.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LANGS, DEFAULT_LANG, pathFor } from '../src/i18n/core.js'
/* Imported in Node, the content is English: the current wording, not the
   source.json snapshot, which can lag behind an edit. */
import { ui } from '../src/content/ui.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const SITE = (process.env.SITE_URL || 'https://oryx.withhumble.com').replace(/\/$/, '')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const table = (l) => {
  const f = path.join(ROOT, `src/i18n/locales/${l}.json`)
  return l !== DEFAULT_LANG && existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {}
}

const base = readFileSync(path.join(DIST, 'index.html'), 'utf8')
  .replace(/\s*<link rel="(?:canonical|alternate)"[^>]*>/g, '')
const alternates = [
  ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${pathFor(l)}" />`),
  `<link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
].join('\n    ')

for (const l of LANGS) {
  const t = table(l)
  const title = t['ui.meta.title'] || ui.meta.title
  const description = t['ui.meta.description'] || ui.meta.description
  const html = base
    .replace(/<html lang="[^"]*">/, `<html lang="${l}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace('</head>', `    <link rel="canonical" href="${SITE}${pathFor(l)}" />\n    ${alternates}\n  </head>`)
  const dir = l === DEFAULT_LANG ? DIST : path.join(DIST, l)
  mkdirSync(dir, { recursive: true })
  writeFileSync(path.join(dir, 'index.html'), html)
}
console.log(`✓ language pages: ${LANGS.map((l) => pathFor(l)).join('  ')}  (${SITE})`)
