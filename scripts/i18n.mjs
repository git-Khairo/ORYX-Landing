/**
 * The translations, kept honest.
 *
 *     node scripts/i18n.mjs extract   writes src/i18n/source.json
 *     node scripts/i18n.mjs check     compares every language with it
 *
 * `extract` walks the content modules exactly the way `localize` does, with
 * the same `walkCopy`, and records every visitor string by its path. That file
 * is the English the current translations were made from.
 *
 * `check` reports, per language:
 *   missing      a path with no translation (the site shows English there)
 *   obsolete     a translated path that no longer exists in the content
 *   placeholders a `{name}` hole the English has and the translation dropped,
 *                which would print a literal "{name}" on the page: an error
 *   characters   a long dash, middle dot or arrow, which visitor copy never
 *                uses in any language: an error
 * and, once for all languages, every English string that has changed since
 * `source.json` was written, so its translations can be brought up to date
 * before `extract` is run again.
 *
 * Errors exit non-zero, which fails the build; gaps are warnings, because a
 * gap falls back to English rather than breaking anything.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { walkCopy, LANGS, DEFAULT_LANG } from '../src/i18n/core.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = ['copy', 'media', 'cards', 'requests', 'renovation', 'workforce', 'ui']
const SOURCE = path.join(ROOT, 'src/i18n/source.json')
const localeFile = (l) => path.join(ROOT, `src/i18n/locales/${l}.json`)

/* Each wrapped export's namespace, read from its `localize('…', ` call so the
   paths here are the paths the site looks up. */
async function collect() {
  const out = {}
  for (const name of CONTENT) {
    const file = path.join(ROOT, `src/content/${name}.js`)
    const src = readFileSync(file, 'utf8')
    const mod = await import(file)
    for (const [, exp, ns] of src.matchAll(/export const (\w+) = localize\('([^']+)'/g)) {
      walkCopy(mod[exp], ns, (p, s) => { out[p] = s; return s })
    }
  }
  return out
}

const holes = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',')
const BAD_CHARS = /[–—·←-⇿➔➡]/

const cmd = process.argv[2]
const current = await collect()

if (cmd === 'extract') {
  writeFileSync(SOURCE, JSON.stringify(current, null, 2) + '\n')
  const words = Object.values(current).reduce((n, s) => n + s.split(/\s+/).length, 0)
  console.log(`✓ ${Object.keys(current).length} strings, ${words} words → src/i18n/source.json`)
  process.exit(0)
}

/* For translating in pieces: `split` cuts source.json into numbered chunks
   in src/i18n/.work/, and `merge <lang>` joins `<lang>-NN.json` chunks back
   into the locale file, keeping any key already translated there. */
const WORK = path.join(ROOT, 'src/i18n/.work')
if (cmd === 'split') {
  const { mkdirSync } = await import('node:fs')
  mkdirSync(WORK, { recursive: true })
  const keys = Object.keys(current)
  const size = Number(process.argv[3]) || 150
  let n = 0
  for (let i = 0; i < keys.length; i += size) {
    n++
    const part = Object.fromEntries(keys.slice(i, i + size).map((k) => [k, current[k]]))
    writeFileSync(path.join(WORK, `en-${String(n).padStart(2, '0')}.json`), JSON.stringify(part, null, 2) + '\n')
  }
  console.log(`✓ ${n} chunks of up to ${size} strings in src/i18n/.work/`)
  process.exit(0)
}
if (cmd === 'merge') {
  const { readdirSync } = await import('node:fs')
  const l = process.argv[3]
  if (!LANGS.includes(l) || l === DEFAULT_LANG) { console.error('merge needs nl, fr or de'); process.exit(1) }
  const base = existsSync(localeFile(l)) ? JSON.parse(readFileSync(localeFile(l), 'utf8')) : {}
  const parts = readdirSync(WORK).filter((f) => f.startsWith(`${l}-`) && f.endsWith('.json')).sort()
  /* A chunk fills gaps only: a line already in the locale file may have been
     corrected by hand since the chunk was written, and must not be reverted. */
  for (const f of parts) {
    for (const [k, v] of Object.entries(JSON.parse(readFileSync(path.join(WORK, f), 'utf8')))) {
      if (typeof base[k] !== 'string' || !base[k].trim()) base[k] = v
    }
  }
  /* Written in source order, so a diff of the locale reads like the site. */
  const ordered = Object.fromEntries(Object.keys(current).filter((k) => k in base).map((k) => [k, base[k]]))
  writeFileSync(localeFile(l), JSON.stringify(ordered, null, 2) + '\n')
  console.log(`✓ ${l}: merged ${parts.length} chunks, ${Object.keys(ordered).length} strings`)
  process.exit(0)
}

if (cmd !== 'check') {
  console.error('Usage: node scripts/i18n.mjs extract | check | split [size] | merge <lang>')
  process.exit(1)
}

let errors = 0
const snapshot = existsSync(SOURCE) ? JSON.parse(readFileSync(SOURCE, 'utf8')) : {}
const changed = Object.keys(current).filter((k) => k in snapshot && snapshot[k] !== current[k])
const added = Object.keys(current).filter((k) => !(k in snapshot))

for (const l of LANGS.filter((x) => x !== DEFAULT_LANG)) {
  if (!existsSync(localeFile(l))) { console.warn(`! ${l}: no translation file yet`); continue }
  const t = JSON.parse(readFileSync(localeFile(l), 'utf8'))
  const missing = Object.keys(current).filter((k) => typeof t[k] !== 'string' || !t[k].trim())
  const obsolete = Object.keys(t).filter((k) => !(k in current))
  /* A blank line is a gap, reported above and shown in English: only a line
     that is actually there can have lost a placeholder. */
  const badHoles = Object.keys(current).filter((k) => typeof t[k] === 'string' && t[k].trim() && holes(t[k]) !== holes(current[k]))
  const badChars = Object.keys(t).filter((k) => BAD_CHARS.test(t[k]))
  const line = [`${l}: ${Object.keys(current).length - missing.length}/${Object.keys(current).length} translated`]
  if (missing.length) line.push(`${missing.length} missing`)
  if (obsolete.length) line.push(`${obsolete.length} obsolete`)
  console.log((missing.length || obsolete.length ? '! ' : '✓ ') + line.join(', '))
  for (const k of missing.slice(0, 8)) console.log(`    missing  ${k}`)
  if (missing.length > 8) console.log(`    … and ${missing.length - 8} more`)
  for (const k of badHoles) { errors++; console.log(`  ✗ placeholders differ  ${k}: "${t[k]}"`) }
  for (const k of badChars) { errors++; console.log(`  ✗ long dash, middle dot or arrow  ${k}: "${t[k]}"`) }
}

if (changed.length || added.length) {
  console.log(`! English changed since the last extract: ${changed.length} edited, ${added.length} new. Update the translations of these, then run extract:`)
  for (const k of [...changed, ...added].slice(0, 12)) console.log(`    ${k}`)
}

process.exit(errors ? 1 : 0)
