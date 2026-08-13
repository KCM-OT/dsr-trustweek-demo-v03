# TrustWeek Agentic DSAR Demo

A stage demo of a "future OneTrust" Privacy Rights product handling an
agentic DSAR (Data Subject Access Request) workflow for a fictional
customer, Meridian. It's a presenter-cued, fully interactive React app —
no backend, no live LLM calls, no network dependencies at demo time. Every
"agent working" moment is a scripted choreography sequence that the
presenter advances with the keyboard.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # serve the production build
```

Design target is a 1920×1080 projector. There's a real PDF report bundled
under `public/` (built via `report/render-pdf.mjs`) — see `report/`.

## Presenter controls

- `→` / `Space` — advance to the next beat in the current scene
- `←` — step back one beat
- `1`–`6` — jump to Act 1 / Act 2 / Act 3 / Act 4 / PDF report / blank screen
- `Esc` — presenter overlay: current act/beat, full beat list, click to jump

## Where things live

- `spec_pack/` — the original spec pack (PRD, design system, demo script,
  data fixtures, PDF spec). Read `spec_pack/README.md` first if you're
  extending the build; it explains how the docs relate to each other and
  the non-negotiables the app is built against.
- `src/scenes/` — one folder per act (`act1`, `act3`, `act4`) plus
  standalone scenes (`IntakeScene`, `ReportScene`, `BlankScene`).
- `src/cue/` — the presenter cue engine (beat state, keyboard handler,
  overlay).
- `src/shell/` — the OneTrust app shell (nav rail, top bar, icons).
- `src/data/fixtures.js` — re-exports `spec_pack/04_data_fixtures.json`,
  imported at build time.
- `report/` — HTML source and render script for the bundled Meridian PDF
  access report.
- `PROGRESS.md` — session-by-session build log: what's done, what's
  stubbed, deviations from spec. Read it before starting new work.
