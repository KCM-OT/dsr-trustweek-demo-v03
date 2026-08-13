// Renders report/AR-4207_report.html → public/AR-4207_access_report.pdf
// (the static asset the demo app serves — README tech constraints: a real
// PDF bundled with the app) plus per-page PNGs at 2x into
// public/report-pages/ — the /report scene's cue-driven page presenter
// shows these (one advance = one page) while the real PDF stays the
// linked/downloadable artifact. Uses the Playwright-cached Chromium
// already on this machine; run with:
//   node report/render-pdf.mjs
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = path.join(here, 'AR-4207_report.html')
const pdfPath = path.join(here, '..', 'public', 'AR-4207_access_report.pdf')
const pagesDir = path.join(here, '..', 'public', 'report-pages')
mkdirSync(pagesDir, { recursive: true })

const EXE =
  process.env.CHROMIUM ||
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`

const browser = await chromium.launch({ executablePath: EXE })
// 8.5×11in @96dpi; deviceScaleFactor 2 → page PNGs at 1632×2112, crisp on
// a 1920×1080 projector (page.pdf output is vector and unaffected).
const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 })
await page.goto(`file://${htmlPath}`)
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(150)

// Guardrails: exactly 9 pages, none overflowing its 11in box (overflow
// would silently push content into a phantom extra PDF page).
const audit = await page.evaluate(() =>
  [...document.querySelectorAll('.page')].map((el, i) => ({
    i: i + 1,
    clientH: el.clientHeight,
    scrollH: el.scrollHeight,
    overflows: el.scrollHeight > el.clientHeight,
  }))
)
if (audit.length !== 9) throw new Error(`expected 9 .page sections, found ${audit.length}`)
for (const p of audit) {
  console.log(`page ${p.i}: ${p.scrollH}/${p.clientH}px${p.overflows ? '  ⚠ OVERFLOW' : ''}`)
  if (p.overflows) throw new Error(`page ${p.i} content overflows its 11in box by ${p.scrollH - p.clientH}px`)
}

await page.pdf({
  path: pdfPath,
  width: '8.5in',
  height: '11in',
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  printBackground: true,
})
console.log(`PDF written → ${pdfPath}`)

for (let i = 1; i <= 9; i++) {
  const el = page.locator(`.page:nth-of-type(${i})`)
  await el.screenshot({ path: path.join(pagesDir, `page-${i}.png`), scale: 'device' })
}
console.log(`page images → ${pagesDir}/page-{1..9}.png`)
await browser.close()
