/**
 * Build one PDF brochure per card.
 *
 *     npm run brochures
 *
 * Twelve for the Workforce sectors and nine for the Renovation services, in
 * each of the site's four languages: English in `public/brochures/`, the
 * others in `public/brochures/<lang>/`, which is where each language's
 * "Download brochure" buttons point.
 *
 *     npm run brochures                 all four languages
 *     npm run brochures -- --lang=de    German only
 *     npm run brochures -- cleaning     every language, one brochure
 *
 * ── Why the brochures are generated and not designed by hand ──────────
 * Everything in them already exists as data: the sector, its groups, every
 * role and the sentence that describes it; the service, its works and their
 * conditions. A brochure typed by hand is a second copy of that, and a second
 * copy drifts the first time a role is renamed. Generated, the brochure is
 * the page's own content at full length, and re-running this script after a
 * copy change brings all twenty-one back in step. It also means a brochure
 * can only say what the claims checker has already walked.
 *
 * ── How ───────────────────────────────────────────────────────────────
 * Each brochure is an HTML page laid out for A4, printed to PDF by the Chrome
 * already installed on this machine, run headless. No new dependency, and the
 * brand's real fonts are embedded because the HTML loads the same font files
 * the site does. If Chrome lives somewhere else, set CHROME_PATH.
 *
 * The PDFs are committed, because the Docker build has no Chrome in it.
 *
 * ── Pictures ──────────────────────────────────────────────────────────
 * A generated picture in `src/assets/cards/<page>/<id>.jpg` is used if it is
 * there, and otherwise the stand-in still from `content/cards.js`. Re-run the
 * script after adding pictures so the brochures pick them up.
 */
import { execFileSync, spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, rmSync, readdirSync, statSync, readFileSync } from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { LANGS, DEFAULT_LANG, setLanguage, fmt, plural } from '../src/i18n/core.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SELF = fileURLToPath(import.meta.url)

/* ── One process per language ────────────────────────────────────────
   The content modules translate themselves once, when they are first
   imported, so a language has to be set before that and cannot be changed
   after. Without `--lang` this run is only a conductor: it starts one run of
   this same script per language, in turn, sharing a folder of downloaded
   cover pictures so each is fetched once. */
const arg = process.argv.slice(2)
const langArg = arg.find((a) => a.startsWith('--lang='))?.slice(7)
const only = arg.find((a) => !a.startsWith('--'))

if (!langArg) {
  const shared = path.join(tmpdir(), `oryx-brochures-${process.pid}`)
  mkdirSync(shared, { recursive: true })
  let failed = 0
  for (const l of LANGS) {
    console.log(`\n${l.toUpperCase()}`)
    const r = spawnSync(process.execPath, [SELF, `--lang=${l}`, ...(only ? [only] : [])], {
      stdio: 'inherit', env: { ...process.env, BROCHURE_PICTURES: shared },
    })
    if (r.status !== 0) failed += 1
  }
  /* Kept HTML points at these pictures, so they stay with it. */
  if (!process.env.BROCHURE_KEEP_HTML) rmSync(shared, { recursive: true, force: true })
  process.exit(failed ? 1 : 0)
}

if (!LANGS.includes(langArg)) {
  console.error(`--lang must be one of ${LANGS.join(', ')}`)
  process.exit(1)
}
const LANG = langArg
setLanguage(LANG, LANG === DEFAULT_LANG ? null : JSON.parse(readFileSync(path.join(ROOT, `src/i18n/locales/${LANG}.json`), 'utf8')))

const { brand } = await import('../src/content/copy.js')
const { sectors, roles, serviceLines } = await import('../src/content/workforce.js')
const { services } = await import('../src/content/renovation.js')
const { requestServices } = await import('../src/content/requests.js')
const { cardStills } = await import('../src/content/cards.js')
const { ui } = await import('../src/content/ui.js')
const T = ui.brochure

const OUT = path.join(ROOT, 'public/brochures', LANG === DEFAULT_LANG ? '' : LANG)
const CHROME =
  process.env.CHROME_PATH ||
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
   '/Applications/Chromium.app/Contents/MacOS/Chromium',
   '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync)

if (!CHROME) {
  console.error('No Chrome found. Set CHROME_PATH to a Chrome or Chromium binary.')
  process.exit(1)
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const font = (p) => pathToFileURL(path.join(ROOT, 'node_modules', p)).href
const count = (s) => s.groups.reduce((n, g) => n + g.roles.length, 0)

/* The cover picture, as a small plain JPEG on disk.
 *
 * Chrome embeds a JPEG in a PDF untouched only when it is a simple baseline
 * file. The stock stills arrive progressive and colour-profiled, so Chrome
 * decoded each one and stored it uncompressed: a 200 KB photograph became two
 * megabytes of PDF. Running it through `sips`, which ships with macOS, writes
 * a baseline JPEG at the size the cover needs, and the brochure drops to a few
 * hundred kilobytes. If `sips` is missing the original is used as it is. */
const picture = async (key, workdir) => {
  let src = null
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const f = path.join(ROOT, 'src/assets/cards', `${key}.${ext}`)
    if (existsSync(f)) { src = f; break }
  }
  const out = path.join(workdir, `${key.replace('/', '-')}.jpg`)
  if (existsSync(out)) return pathToFileURL(out).href
  const raw = path.join(workdir, `${key.replace('/', '-')}-raw`)
  if (!src) {
    const still = cardStills[key]
    if (!still?.src) return null
    try {
      const res = await fetch(`${still.src}?auto=compress&cs=tinysrgb&w=1400`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) return null
      writeFileSync(raw, Buffer.from(await res.arrayBuffer()))
      src = raw
    } catch {
      return null
    }
  }
  try {
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '62', '-Z', '1400', src, '--out', out], { stdio: 'pipe' })
    return pathToFileURL(out).href
  } catch {
    return pathToFileURL(src).href
  }
}

/* The slogan with O, R, Y and X picked out, as on the site. */
const slogan = () => {
  const join = [' ', ', ', ' ', '']
  return brand.letters
    .map(({ k, w }, i) => {
      const at = w.indexOf(k)
      return `${esc(w.slice(0, at))}<b>${k}</b>${esc(w.slice(at + 1))}${join[i]}`
    })
    .join('')
}

/* The board's two faces and nothing else, as on the site: Cinzel standing in
   for Trajan Pro on headings, Montserrat for the rest. The two pages differ
   only in how heavy their headings are, matching their service pages. */
const FACES = [
  `@font-face{font-family:'Cinzel';font-weight:400;src:url('${font('@fontsource/cinzel/files/cinzel-latin-400-normal.woff2')}') format('woff2');}`,
  `@font-face{font-family:'Cinzel';font-weight:600;src:url('${font('@fontsource/cinzel/files/cinzel-latin-600-normal.woff2')}') format('woff2');}`,
  `@font-face{font-family:'Montserrat';font-weight:100 900;src:url('${font('@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2')}') format('woff2');}`,
].join('\n')
const DISPLAY = `'Cinzel', serif`
const BODY = `'Montserrat', sans-serif`
const THEME = {
  workforce: { displayWeight: 600 },
  renovation: { displayWeight: 400 },
}

/* The cover title steps down for a long word, the way the door titles on the
   site do: German compounds run to twenty letters and more, and at the full
   30pt a word that long would run off the page. */
const longest = (s) => Math.max(...String(s).split(/\s+/).map((w) => w.length))

const page = ({ theme, unit, no, title, lede, stats, img, body, email, cta, team }) => `<!doctype html>
<html lang="${LANG}"><head><meta charset="utf-8"><title>${esc(title)} | ${esc(brand.full)}</title>
<style>
${FACES}
/* Every page bleeds to the edge, because the paper colour is part of the
   design and Chrome leaves page margins white. The breathing room at the top
   and bottom of a continued page comes from box-decoration-break: clone on
   .inner instead, which repeats its padding on every page it runs across. */
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #f4f1e8; }
body { font-family: ${BODY}; font-size: 9.6pt; line-height: 1.5; color: #1c1c1a; background: #f4f1e8; }
b { font-weight: inherit; }
/* Dutch, French and German words run long for a 42mm column. English is
   set as it always was, unbroken. */
${LANG === DEFAULT_LANG ? '' : 'p, h2 { hyphens: auto; -webkit-hyphens: auto; hyphenate-limit-chars: 10 4 4; }'}

.cover { position: relative; height: 297mm; padding: 16mm; display: flex; flex-direction: column; justify-content: space-between; background: #131311; color: #f4f1e8; overflow: hidden; page-break-after: always; }
.cover-img { position: absolute; inset: 0; }
/* No CSS filter on the picture. A filter makes Chrome flatten the photograph
   into an uncompressed bitmap inside the PDF: the first brochures came out at
   three to four megabytes each and took a minute apiece. Darkened by an
   overlay instead, the JPEG is embedded as it is. */
.cover-img img { width: 100%; height: 100%; object-fit: cover; }
.cover-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(16,15,13,0.97) 0%, rgba(16,15,13,0.86) 38%, rgba(16,15,13,0.42) 72%, rgba(16,15,13,0.5) 100%); }
.cover > :not(.cover-img) { position: relative; }
.brandbar { display: flex; align-items: center; justify-content: space-between; }
.lock { display: flex; align-items: center; gap: 3mm; font-family: 'Cinzel', serif; font-weight: 600; font-size: 10pt; letter-spacing: 0.3em; }
.lock i { width: 4mm; height: 9.6mm; background: #c8a978; -webkit-mask: url('${pathToFileURL(path.join(ROOT, 'public/mark.png')).href}') center / contain no-repeat; }
.unit { font-size: 8pt; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #d4b98d; }
.cover-main { display: grid; gap: 6mm; }
.cover-no { font-size: 9pt; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #d4b98d; }
h1 { font-family: ${DISPLAY}; font-weight: ${THEME[theme].displayWeight}; font-size: min(30pt, calc(160mm / (var(--len) * 0.86))); line-height: 1.1; letter-spacing: 0.06em; text-transform: uppercase; max-width: 160mm; }
.lede { font-size: 12.5pt; line-height: 1.5; font-weight: 300; color: #ece6d6; max-width: 140mm; }
.stats { display: flex; gap: 0; margin-top: 2mm; border: 0.3mm solid rgba(200,169,120,0.45); width: fit-content; }
.stats div { padding: 3.5mm 7mm; border-right: 0.3mm solid rgba(200,169,120,0.45); }
.stats div:last-child { border-right: 0; }
.stats dt { font-size: 7pt; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #b8b4a8; }
.stats dd { font-family: ${DISPLAY}; font-weight: ${THEME[theme].displayWeight}; font-size: 20pt; line-height: 1.1; color: #c8a978; }
.cover-foot { display: flex; justify-content: space-between; align-items: flex-end; font-size: 8.5pt; color: #b8b4a8; }
.slogan { font-size: 10pt; font-weight: 600; letter-spacing: 0.03em; color: #f4f1e8; }
.slogan b { color: #c8a978; }

.inner { padding: 14mm 16mm 13mm; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.kick { display: flex; align-items: center; gap: 3mm; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #6b4f2a; margin: 7mm 0 3mm; }
.kick:first-child { margin-top: 0; }
.kick::after { content: ''; flex: 1; height: 0.25mm; background: rgba(74,56,40,0.3); }
h2 { font-family: ${DISPLAY}; font-weight: ${THEME[theme].displayWeight}; font-size: 13pt; line-height: 1.2; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1mm; break-after: avoid; }
h2 span { font-family: ${BODY}; font-weight: 500; font-size: 8pt; letter-spacing: 0.14em; color: #7d7a72; margin-left: 2mm; }
.intro { color: #55534c; margin-bottom: 2.5mm; max-width: 150mm; break-after: avoid; }
.grp { margin-bottom: 6mm; }
.rows { border-top: 0.25mm solid rgba(28,28,26,0.22); }
.row { display: grid; grid-template-columns: 56mm 1fr; gap: 5mm; padding: 1.7mm 0; border-bottom: 0.25mm solid rgba(28,28,26,0.12); break-inside: avoid; }
.row-t { font-weight: 700; line-height: 1.3; }
.row-d { color: #55534c; line-height: 1.4; }
.tag { display: inline-block; margin-top: 0.8mm; padding: 0.3mm 1.6mm; border: 0.25mm solid rgba(74,56,40,0.5); font-size: 6.6pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6b4f2a; }
.ways { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5mm; }
.way { padding: 3mm 3.2mm; border: 0.25mm solid rgba(28,28,26,0.22); background: #efebdd; break-inside: avoid; }
.way-n { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.16em; color: #6b4f2a; }
.way-k { font-weight: 700; font-size: 9.6pt; line-height: 1.2; margin: 0.5mm 0 1mm; }
.way-d { color: #55534c; font-size: 8.2pt; line-height: 1.35; }
.way-f { margin-top: 1.2mm; padding-top: 1.2mm; border-top: 0.25mm solid rgba(28,28,26,0.14); color: #1c1c1a; font-size: 8pt; line-height: 1.35; }
.note { color: #55534c; font-size: 8.8pt; margin-top: 3mm; max-width: 160mm; }
.note b { font-weight: 700; color: #1c1c1a; }
.contact { margin-top: 6mm; padding: 6mm 7mm; background: #131311; color: #f4f1e8; display: flex; justify-content: space-between; align-items: center; gap: 8mm; break-inside: avoid; }
.contact-k { font-family: ${DISPLAY}; font-weight: ${THEME[theme].displayWeight}; font-size: 14pt; letter-spacing: 0.06em; text-transform: uppercase; line-height: 1.1; }
.contact-d { color: #b8b4a8; font-size: 9pt; margin-top: 1mm; }
.contact-m { text-align: right; font-size: 10pt; font-weight: 600; color: #c8a978; white-space: nowrap; }
.contact-m small { display: block; font-size: 7.5pt; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #b8b4a8; margin-bottom: 1mm; }
</style></head><body>
<section class="cover">
  ${img ? `<div class="cover-img"><img src="${img}" alt=""></div>` : ''}
  <div class="brandbar"><span class="lock"><i></i>${esc(brand.full)}</span><span class="unit">${esc(unit)}</span></div>
  <div class="cover-main">
    <p class="cover-no">${esc(no)}</p>
    <h1 style="--len:${longest(title)}">${esc(title)}</h1>
    <p class="lede">${esc(lede)}</p>
    <dl class="stats">${stats.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
  <div class="cover-foot"><p class="slogan">${slogan()}</p><p>${esc(brand.descriptor.join(' / '))}</p></div>
</section>
<section class="inner">
${body}
  <div class="contact">
    <div><p class="contact-k">${esc(cta)}</p><p class="contact-d">${esc(fmt(T.contact, { team }))}</p></div>
    <p class="contact-m"><small>${esc(T.writeTo)}</small>${esc(email)}</p>
  </div>
</section>
</body></html>`

const STATUS = ui.workforce.status
const COND = Object.fromEntries(Object.entries(ui.renovation.conds).map(([c, { k, d }]) => [c, [k, d]]))
const two = (n) => String(n).padStart(2, '0')

const jobs = []

const wf = requestServices.find((s) => s.id === 'workforce')
sectors.forEach((s, i) => {
  const flagged = s.groups.some((g) => g.roles.some((id) => roles[id][2]))
  const body = `
  <p class="kick">${esc(ui.workforce.rolesWeSupply)}</p>
  ${s.groups.map((g) => `
  <div class="grp">
    <h2>${esc(g.name)}<span>${g.roles.length} ${esc(plural(g.roles.length, ui.workforce.roleWord))}</span></h2>
    ${g.intro ? `<p class="intro">${esc(g.intro)}</p>` : ''}
    <div class="rows">${g.roles.map((id) => {
      const [t, d, st] = roles[id]
      return `<div class="row"><p class="row-t">${esc(t)}${st ? `<br><span class="tag">${esc(STATUS[st])}</span>` : ''}</p><p class="row-d">${esc(d)}</p></div>`
    }).join('')}</div>
  </div>`).join('')}
  ${flagged ? `<p class="note">${fmt(esc(T.flagged), { req: `<b>${esc(STATUS.req)}</b>`, qc: `<b>${esc(STATUS.qc)}</b>` })}</p>` : ''}
  <p class="kick">${esc(T.waysHead)}</p>
  <div class="ways">${serviceLines.map((l) => `<div class="way"><p class="way-n">${l.n}</p><p class="way-k">${esc(l.k)}</p><p class="way-d">${esc(l.d)}</p><p class="way-f">${esc(l.fit)}</p></div>`).join('')}</div>`
  jobs.push({
    file: `workforce-${s.id}.pdf`,
    html: (img) => page({
      img,
      theme: 'workforce', unit: wf.label, team: wf.label, no: fmt(T.sector, { n: two(i + 1), total: sectors.length }),
      title: s.name, lede: s.blurb,
      stats: [[T.statRoles, count(s)], [T.statGroups, s.groups.length], [T.statWays, serviceLines.length]],
      body, email: wf.email, cta: wf.cta,
    }),
    key: `workforce/${s.id}`,
  })
})

const rn = requestServices.find((s) => s.id === 'renovation')
services.forEach((s) => {
  const used = [...new Set(s.works.map((w) => w.s || s.cond).filter(Boolean))]
  const body = `
  <p class="kick">${esc(ui.renovation.covers)}</p>
  <div class="rows">${s.works.map((w) => {
    const c = w.s || s.cond
    return `<div class="row"><p class="row-t">${esc(w.t)}${c ? `<br><span class="tag">${esc(COND[c][0])}</span>` : ''}</p><p class="row-d">${esc(w.d)}</p></div>`
  }).join('')}</div>
  ${used.map((c) => `<p class="note"><b>${esc(COND[c][0])}.</b> ${esc(COND[c][1])}</p>`).join('')}
  ${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}`
  jobs.push({
    file: `renovation-${s.id}.pdf`,
    html: (img) => page({
      img,
      theme: 'renovation', unit: rn.label, team: rn.label, no: fmt(T.service, { n: s.no, total: two(services.length) }),
      title: s.name, lede: s.sub,
      stats: [[T.statWorks, s.works.length], [T.statService, s.no]],
      body, email: rn.email, cta: rn.cta,
    }),
    key: `renovation/${s.id}`,
  })
})

mkdirSync(OUT, { recursive: true })
const tmp = path.join(tmpdir(), `oryx-brochures-${LANG}-${process.pid}`)
mkdirSync(tmp, { recursive: true })
const pictures = process.env.BROCHURE_PICTURES || tmp

/* Headless Chrome writes the PDF and then does not exit, so waiting for the
   process means waiting for a timeout: ninety seconds a brochure, half an hour
   for the set. Watch for the file instead, give it a moment to finish being
   written, and stop Chrome ourselves. Judged by the file for the same reason:
   the exit code says nothing useful here. */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const print = async (html, target) => {
  rmSync(target, { force: true })
  const child = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
    '--allow-file-access-from-files', '--virtual-time-budget=8000',
    `--user-data-dir=${path.join(tmp, 'profile')}`,
    `--print-to-pdf=${target}`,
    pathToFileURL(html).href,
  ], { stdio: 'ignore' })
  let exited = false
  child.on('exit', () => { exited = true })
  let last = -1
  for (let i = 0; i < 120 && !exited; i += 1) {
    await sleep(500)
    const size = existsSync(target) ? statSync(target).size : 0
    if (size > 2000 && size === last) break
    last = size
  }
  if (!exited) child.kill('SIGKILL')
  await sleep(150)
  return existsSync(target) && statSync(target).size > 2000
}

let made = 0
for (const job of jobs) {
  if (only && !job.file.includes(only)) continue
  const html = path.join(tmp, job.file.replace(/\.pdf$/, '.html'))
  writeFileSync(html, job.html(await picture(job.key, pictures)))
  const target = path.join(OUT, job.file)
  if (await print(html, target)) {
    made += 1
    console.log(`  ✓ ${job.file}  ${Math.round(statSync(target).size / 1024)} KB`)
  } else {
    console.error(`  ✗ ${job.file}`)
  }
}
if (!process.env.BROCHURE_KEEP_HTML) rmSync(tmp, { recursive: true, force: true })
else console.log(`  HTML kept in ${tmp}`)

const stale = readdirSync(OUT).filter((f) => f.endsWith('.pdf') && !jobs.some((j) => j.file === f))
if (stale.length) console.log(`\n⚠ No longer generated, safe to delete: ${stale.join(', ')}`)
console.log(`${made} brochure${made === 1 ? '' : 's'} written to ${path.relative(ROOT, OUT)}/`)
process.exit(made ? 0 : 1)
