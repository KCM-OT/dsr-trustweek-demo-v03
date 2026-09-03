# TrustWeek Agentic DSAR Demo — Spec Pack

This pack is the complete, self-sufficient specification for building the TrustWeek demo prototype. It is written to be consumed by Claude Code (any model) or a human engineer with zero access to the original ideation conversation. If something is ambiguous, the rule is: **err on the side of simplicity and visual taste.** This is a stage demo, not a product — every decision should optimize for how it reads from a projector.

## Documents

| File | What it is | Consumed by |
|---|---|---|
| `01_build_spec.md` | The PRD: architecture of the demo app, every surface, its states, cue-triggered transitions, interaction modes, acceptance criteria | Every build session — read first |
| `02_design_system.md` | Two visual systems: the "future OneTrust" shell (derived from real product screenshots) and the Meridian brand (fictional customer) | Every build session |
| `03_demo_script.md` | Verbatim copy: every agent utterance, Teams message, UI label, plus the presenter cue map | Sessions building conversational/choreographed surfaces |
| `04_data_fixtures.json` | The entire Meridian world as data: request history, Marcus Bell's request, systems, redaction findings, dashboard trends | Import as-is into the app |
| `05_pdf_report_spec.md` | Full content + layout spec for the Meridian-branded access report PDF | The session that builds the report |

## What we are building (one paragraph)

A single-page web app — the "stage machine" — that looks and feels like the future OneTrust Privacy Rights product. Everything on screen is real interactive UI. "Agent working in real time" moments are **presenter-cued choreographed sequences**: the presenter presses an advance key and the next scripted state transition plays with realistic timing. Nothing is video. Nothing calls an LLM at runtime. Every choreographed sequence lands in a fully interactive state.

## Non-negotiables

1. **No live LLM calls, no network dependencies at demo time.** All agent output is scripted (see `03_demo_script.md`). The app must run fully offline from a local build.
2. **Presenter cue system:** `→` / `Space` advances the next beat in the current scene. `←` steps back one beat (every beat must be reversible or re-enterable). Number keys `1–6` jump to: 1 = Act 1, 2 = Act 2, 3 = Act 3, 4 = Act 4, 5 = PDF report, 6 = blank/holding screen. `Esc` opens a presenter overlay showing current act/beat and the beat list. These are the on-stage recovery mechanisms.
3. **Choreography timing:** state transitions in agent sequences use deliberate, watchable pacing — typing indicators ~800ms, status flips staggered 400–700ms apart, progress steps 600–900ms. Never instant (reads as fake), never longer than ~2.5s per beat step (drags on stage).
4. **1920×1080 is the design target.** The demo runs full-screen on a conference projector. Test at that resolution; degrade gracefully but don't design for anything else.
5. **Simplicity and visual taste beat completeness.** If a surface can be 6 elements or 10, it's 6. Empty space is a feature. Anything that would need explaining is cut.

## Build order (recommended sessions)

- **Session 1 — Skeleton:** app shell (nav, routing, scene map), presenter cue engine, design tokens from `02`, fixture loading from `04`. Acceptance: can jump between empty act scenes with number keys, cue overlay works.
- **Session 2 — Act 3 vertical slice:** request detail + agent plan, reasoning panel, split-screen Teams/ServiceNow choreography, redaction summary, activity trail. This is the money shot and the hardest build — do it while context is freshest. Acceptance criteria in `01`, section 4.
- **Session 3 — Act 1 + Act 2:** setup agent conversation, document ingestion cards, flow chart, integration provisioning, branded intake agent with the pivot exchange.
- **Session 4 — Act 4 + PDF + polish:** program dashboard, needs-attention list, the PDF report (per `05`), then a full run-through pass at 1920×1080 fixing visual seams.

Each session: start by reading `01` and `02` in full, plus the sections of `03`/`04`/`05` relevant to the surfaces being built. Keep a `PROGRESS.md` in the repo root noting what's done, what's stubbed, and any deviations from spec — the next session reads it first.

## Tech constraints

- React single-page app, no backend. State machine per act (a simple ordered beat array per scene is sufficient — do not over-engineer with a state machine library).
- All fixture data imported from `04_data_fixtures.json` at build time. No fetches.
- The PDF report: generate ahead of time as a real PDF asset bundled with the app, opened in an embedded viewer or new tab. Do not render it as HTML pretending to be a PDF.
- Icons: a single consistent outline icon set. No emoji anywhere in the UI.
- Animations: CSS transitions/keyframes only. No animation libraries unless something genuinely can't be done without one.
