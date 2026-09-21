/**
 * Build one PDF brochure per card.
 *
 *     npm run brochures
 *
 * Twelve for the Workforce sectors and nine for the Renovation services, all
 * written to `public/brochures/`, which is where the "Download brochure"
 * buttons point.
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
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, rmSync, readdirSync, statSync } from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { brand } from '../src/content/copy.js'
import { sectors, roles, serviceLines } from '../src/content/workforce.js'
import { services } from '../src/content/renovation.js'
import { requestServices } from '../src/content/requests.js'
import { cardStills } from '../src/content/cards.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public/brochures')
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
  const out = path.join(workdir, `${key.replace('/', '-')}.jpg`)
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

const THEME = {
  workforce: {
    display: `'Archivo'`, body: `'Archivo'`, displayWeight: 800,
    faces: `@font-face{font-family:'Archivo';font-weight:100 900;src:url('${font('@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2')}') format('woff2');}`,
  },
  renovation: {
    display: `'Space Grotesk'`, body: `'Space Grotesk'`, displayWeight: 500,
    faces: `@font-face{font-family:'Space Grotesk';font-weight:300 700;src:url('${font('@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2')}') format('woff2');}`,
  },
}

const page = ({ theme, unit, no, title, lede, stats, img, body, email, cta }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(title)} | ${esc(brand.full)}</title>
<style>
${THEME[theme].faces}
@font-face{font-family:'Cinzel';font-weight:600;src:url('${font('@fontsource/cinzel/files/cinzel-latin-600-normal.woff2')}') format('woff2');}
/* Every page bleeds to the edge, because the paper colour is part of the
   design and Chrome leaves page margins white. The breathing room at the top
   and bottom of a continued page comes from box-decoration-break: clone on
   .inner instead, which repeats its padding on every page it runs across. */
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #f4f1e8; }
body { font-family: ${THEME[theme].body}, sans-serif; font-size: 9.6pt; line-height: 1.5; color: #1c1c1a; background: #f4f1e8; }
b { font-weight: inherit; }

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
h1 { font-family: ${THEME[theme].display}, sans-serif; font-weight: ${THEME[theme].displayWeight}; font-size: 33pt; line-height: 1.02; letter-spacing: 0.005em; text-transform: uppercase; max-width: 160mm; }
.lede { font-size: 12.5pt; line-height: 1.5; font-weight: 300; color: #ece6d6; max-width: 140mm; }
.stats { display: flex; gap: 0; margin-top: 2mm; border: 0.3mm solid rgba(200,169,120,0.45); width: fit-content; }
.stats div { padding: 3.5mm 7mm; border-right: 0.3mm solid rgba(200,169,120,0.45); }
.stats div:last-child { border-right: 0; }
.stats dt { font-size: 7pt; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #b8b4a8; }
.stats dd { font-family: ${THEME[theme].display}, sans-serif; font-weight: ${THEME[theme].displayWeight}; font-size: 20pt; line-height: 1.1; color: #c8a978; }
.cover-foot { display: flex; justify-content: space-between; align-items: flex-end; font-size: 8.5pt; color: #b8b4a8; }
.slogan { font-size: 10pt; font-weight: 600; letter-spacing: 0.03em; color: #f4f1e8; }
.slogan b { color: #c8a978; }

.inner { padding: 14mm 16mm 13mm; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.kick { display: flex; align-items: center; gap: 3mm; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #6b4f2a; margin: 7mm 0 3mm; }
.kick:first-child { margin-top: 0; }
.kick::after { content: ''; flex: 1; height: 0.25mm; background: rgba(74,56,40,0.3); }
h2 { font-family: ${THEME[theme].display}, sans-serif; font-weight: ${THEME[theme].displayWeight}; font-size: 13pt; line-height: 1.15; text-transform: uppercase; margin-bottom: 1mm; break-after: avoid; }
h2 span { font-weight: 500; font-size: 8pt; letter-spacing: 0.14em; color: #7d7a72; margin-left: 2mm; }
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
.contact-k { font-family: ${THEME[theme].display}, sans-serif; font-weight: ${THEME[theme].displayWeight}; font-size: 14pt; text-transform: uppercase; line-height: 1.1; }
.contact-d { color: #b8b4a8; font-size: 9pt; margin-top: 1mm; }
.contact-m { text-align: right; font-size: 10pt; font-weight: 600; color: #c8a978; white-space: nowrap; }
.contact-m small { display: block; font-size: 7.5pt; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #b8b4a8; margin-bottom: 1mm; }
</style></head><body>
<section class="cover">
  ${img ? `<div class="cover-img"><img src="${img}" alt=""></div>` : ''}
  <div class="brandbar"><span class="lock"><i></i>${esc(brand.full)}</span><span class="unit">${esc(unit)}</span></div>
  <div class="cover-main">
    <p class="cover-no">${esc(no)}</p>
    <h1>${esc(title)}</h1>
    <p class="lede">${esc(lede)}</p>
    <dl class="stats">${stats.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
  <div class="cover-foot"><p class="slogan">${slogan()}</p><p>${esc(brand.descriptor.join(' / '))}</p></div>
</section>
<section class="inner">
${body}
  <div class="contact">
    <div><p class="contact-k">${esc(cta)}</p><p class="contact-d">Tell us what you need and the ${esc(unit)} team will contact you to agree the details.</p></div>
    <p class="contact-m"><small>Write to</small>${esc(email)}</p>
  </div>
</section>
</body></html>`

const STATUS = { req: 'On request', qc: 'Qualification required' }
const COND = {
  project: ['Project basis', 'Confirmed for each project after property, risk, partner and qualification checks.'],
  qualified: ['Qualified specialist', 'Carried out or supervised by a qualified specialist where required.'],
}

const jobs = []

const wf = requestServices.find((s) => s.id === 'workforce')
sectors.forEach((s, i) => {
  const flagged = s.groups.some((g) => g.roles.some((id) => roles[id][2]))
  const body = `
  <p class="kick">Roles we supply</p>
  ${s.groups.map((g) => `
  <div class="grp">
    <h2>${esc(g.name)}<span>${g.roles.length} roles</span></h2>
    ${g.intro ? `<p class="intro">${esc(g.intro)}</p>` : ''}
    <div class="rows">${g.roles.map((id) => {
      const [t, d, st] = roles[id]
      return `<div class="row"><p class="row-t">${esc(t)}${st ? `<br><span class="tag">${STATUS[st]}</span>` : ''}</p><p class="row-d">${esc(d)}</p></div>`
    }).join('')}</div>
  </div>`).join('')}
  ${flagged ? `<p class="note"><b>${STATUS.req}</b> means the role is supplied subject to confirmation. <b>${STATUS.qc}</b> means the role calls for a certificate, and a certificate does not automatically grant authority.</p>` : ''}
  <p class="kick">Four ways to work with us</p>
  <div class="ways">${serviceLines.map((l) => `<div class="way"><p class="way-n">${l.n}</p><p class="way-k">${esc(l.k)}</p><p class="way-d">${esc(l.d)}</p><p class="way-f">${esc(l.fit)}</p></div>`).join('')}</div>`
  jobs.push({
    file: `workforce-${s.id}.pdf`,
    html: (img) => page({
      img,
      theme: 'workforce', unit: 'Workforce', no: `Sector ${String(i + 1).padStart(2, '0')} of ${sectors.length}`,
      title: s.name, lede: s.blurb,
      stats: [['Roles', count(s)], ['Groups', s.groups.length], ['Ways to hire', serviceLines.length]],
      body, email: wf.email, cta: wf.cta,
    }),
    key: `workforce/${s.id}`,
  })
})

const rn = requestServices.find((s) => s.id === 'renovation')
services.forEach((s) => {
  const used = [...new Set(s.works.map((w) => w.s || s.cond).filter(Boolean))]
  const body = `
  <p class="kick">What it covers</p>
  <div class="rows">${s.works.map((w) => {
    const c = w.s || s.cond
    return `<div class="row"><p class="row-t">${esc(w.t)}${c ? `<br><span class="tag">${COND[c][0]}</span>` : ''}</p><p class="row-d">${esc(w.d)}</p></div>`
  }).join('')}</div>
  ${used.map((c) => `<p class="note"><b>${COND[c][0]}.</b> ${COND[c][1]}</p>`).join('')}
  ${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}`
  jobs.push({
    file: `renovation-${s.id}.pdf`,
    html: (img) => page({
      img,
      theme: 'renovation', unit: 'Renovation', no: `Service ${s.no} of ${String(services.length).padStart(2, '0')}`,
      title: s.name, lede: s.sub,
      stats: [['Works', s.works.length], ['Service', s.no]],
      body, email: rn.email, cta: rn.cta,
    }),
    key: `renovation/${s.id}`,
  })
})

mkdirSync(OUT, { recursive: true })
const tmp = path.join(tmpdir(), `oryx-brochures-${process.pid}`)
mkdirSync(tmp, { recursive: true })

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

const only = process.argv[2]
let made = 0
for (const job of jobs) {
  if (only && !job.file.includes(only)) continue
  const html = path.join(tmp, job.file.replace(/\.pdf$/, '.html'))
  writeFileSync(html, job.html(await picture(job.key, tmp)))
  const target = path.join(OUT, job.file)
  if (await print(html, target)) {
    made += 1
    console.log(`  ✓ ${job.file}  ${Math.round(statSync(target).size / 1024)} KB`)
  } else {
    console.error(`  ✗ ${job.file}`)
  }
}
rmSync(tmp, { recursive: true, force: true })

const stale = readdirSync(OUT).filter((f) => f.endsWith('.pdf') && !jobs.some((j) => j.file === f))
if (stale.length) console.log(`\n⚠ No longer generated, safe to delete: ${stale.join(', ')}`)
console.log(`\n${made} brochure${made === 1 ? '' : 's'} written to public/brochures/`)
process.exit(made ? 0 : 1)
