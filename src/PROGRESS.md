# PROGRESS

Read this before starting a new session, per `spec_pack/README.md`.

## Session 1 — Skeleton (done)

Stack: Vite + React 18 + react-router-dom v6. Plain JSX, no TypeScript, no
state-machine library (per README tech constraints).

Built:
- **`src/scenes/sceneMap.js`** — single source of truth for the 8 scenes in
  `01_build_spec.md` §0 plus nav-only stub routes for items with no
  dedicated scene in the spec yet. Route, nav label, act, shell-vs-standalone,
  and number-key all live here; nav rail, router, and the cue engine's
  number-key map all read from it. *(Superseded in part by Session 1b below
  — see that section for the current nav item list.)*
- **`src/cue/`** — presenter cue engine. `CueContext.jsx` models a beat as
  a scene-state index (the simpler of the two options `01_build_spec.md`
  §0 allows: "a beat is `{apply(state), revert(state)}` *or equivalently a
  scene state index*"). Scenes call `useSceneBeats(id, label, beatLabels)`
  and read the current index back to decide what to render — no
  apply/revert closures stored in context. `useCueKeyboard.js` is the
  global listener (→/Space advance, ← back, 1–6 jump routes, Esc toggles
  overlay; ignored while a text input has focus). `CueOverlay.jsx` is the
  Esc panel: lists the current scene's beats, highlights the current one,
  click-to-jump.
- **`src/shell/AppShell.jsx`** — nav rail + top bar pulling real values from
  fixtures. `src/shell/icons.jsx` is a small outline icon set (no emoji
  anywhere, per tech constraints). *(Visual treatment rebuilt in Session 1b
  against real reference screenshots — this paragraph describes the
  original guessed styling, since replaced.)*
- **`src/styles/tokens.css`** — CSS custom properties ported from
  `02_design_system.md` §1 (OneTrust shell tokens) and §2 (Meridian/
  Northwind tokens). *(§1 token values were revised in Session 1b — see
  below.)*
- **`src/data/fixtures.js`** — imports `spec_pack/04_data_fixtures.json` at
  build time (no fetches) and re-exports each top-level key.
- **Scenes**: every route renders. Shell-wrapped scenes use the generic
  `StubScene` (registers 3 placeholder beats, shows beat index + label,
  purely to prove the cue engine end-to-end). `/intake` and `/blank`
  render standalone with zero OneTrust chrome, per spec.

Verified (Playwright, headless Chromium, 1920×1080, see transcript — no
project run-skill exists yet, used the generic browser-driven pattern):
number-key jumps 1–6 land on `/setup`, `/intake`, `/requests/4207`,
`/dashboard`, `/report`, `/blank`; nav rail clicks route correctly and show
the green active bar; beat advance/back clamps at both ends; Esc opens/
closes the overlay, lists beats, highlights current, click-to-jump works;
zero console errors anywhere in the pass.

### Deviations / open questions for later sessions
- `/report` currently sits inside the OT shell like every other admin
  scene. Spec doesn't say whether the PDF viewer wants full-bleed instead
  — decide in Session 4 when building it for real.
- Clicking a beat in the cue overlay does **not** auto-close it (lets the
  presenter preview a couple of beats before dismissing). Revisit if that
  reads as awkward on stage.
- `Settings` (and, as of Session 1b, `Reports`/`Subtasks`) nav items route
  to bare stub scenes — they're outside the official scene map table but
  needed for the nav to be "real" per `01_build_spec.md` §0. No acceptance
  criteria attached yet; may get real content in a later session or stay
  minimal. (`Intake Agents` — the original guess for a 5th nav item — was
  removed in Session 1b once the real module's item list was known.)

### Environment note
This machine had no Node.js at session start. Installed nvm (user-level,
no sudo) → Node 24 LTS, then symlinked `node`/`npm`/`npx` into
`~/.local/bin` (already on PATH) so it persists across shells without
re-sourcing nvm. `npm install && npm run dev` should just work from here.

## Session 1b — Shell realignment against real screenshots (done)

**This was a spec-revision pass, not new scope.** `02_design_system.md` §1
and `01_build_spec.md` §0 were rewritten after two authoritative reference
screenshots of the real Privacy Rights Automation module were added to
`spec_pack/reference/` (`pra_request_queue.png`, `pra_request_detail.png`).
Session 1's shell was built against a *guess* at what "future OneTrust"
looked like; this pass replaces that guess with the real thing. No scene
content beyond the shell was touched — every route is still the same
`StubScene` placeholder it was, with one deliberate exception noted below.

Changes:
- **Sidebar** (`src/shell/AppShell.jsx`, `src/scenes/sceneMap.js`): real
  module item list — `Dashboard · Reports · Requests · Subtasks · Setup ›
  · Settings` — under the module title "Privacy Rights Automation". Removed
  the guessed `Intake Agents` item and renamed `Agent Setup` → `Setup`
  (still routes to `/setup`, no route changes). Added `Reports` (`/reports`)
  and `Subtasks` (`/subtasks`) as placeholder scenes — "present for
  authenticity, not part of the demo path" per spec. Sidebar is now a
  full-width (260px) dark-navy (`--ot-sidebar`) rail with horizontal
  icon+label rows instead of the old white icon-only 96px rail; active row
  = darker background (`--ot-sidebar-active`) + white text + thin left
  accent bar (`--ot-link`), matching `pra_request_queue.png`.
- **Top bar**: moved from a light bar with tenant name + admin name/role
  text to a near-black (`--ot-topbar`) bar matching the screenshots: inert
  waffle app-launcher icon + OneTrust mark/wordmark (white) on the left;
  search icon, notification bell (red count badge), tenant switcher
  ("Meridian Brands ⌄"), settings gear, and a muted-maroon initials avatar
  on the right. No "Ask Copilot" button, per spec's explicit instruction
  (one AI entry point only, in the content area). The admin name/role text
  that used to sit in the top bar is gone — the real chrome doesn't show it.
  The bell badge count is `fixtures.attention.length` (8) rather than an
  invented number — grounded in real fixture data, not decoration.
- **Tokens** (`src/styles/tokens.css`): replaced §1 color tokens with the
  revised spec block (`--ot-topbar`, `--ot-sidebar`, `--ot-sidebar-ink`,
  `--ot-link`, updated `--ot-green` #3D7A44, updated `--ot-agent` #7A5AF8).
  Added three implementation-choice tokens the spec describes by effect but
  doesn't give hex for: `--ot-sidebar-active`/`--ot-sidebar-hover` (active/
  hover row shading) and `--ot-avatar`/`--ot-avatar-tint` (the "muted
  maroon" avatar color) — tuned by eye against the screenshots.
- **Queue-page grammar** (new `src/shell/QueueTable.jsx`): built the
  reusable toolbar + table pattern named explicitly in this task — saved-view
  box ("All requests ›"), items/filters count block, search/columns/refresh
  icons, green filled filter button, and a table with real
  `fixtures.queue` rows (14 items) using **uppercase outlined** stage pills
  (`AGENT FULFILLING` purple outline, `AWAITING HUMAN` amber outline,
  `COMPLETE` tinted green — extending the spec's pill grammar to our own
  statuses). This is rendered as an `after` block appended below the
  `/dashboard` stub's placeholder card (`StubScene` gained an `after` prop
  for this). Deliberately **not** touched: stat blocks, trend chart,
  needs-attention panel — those are still Session 4 scope per
  `01_build_spec.md` §4.1.
- **Icons** (`src/shell/icons.jsx`): removed `IntakeAgentsIcon`; added
  `ReportsIcon`, `SubtasksIcon`, a wrench-style `SetupIcon` (replacing the
  old sparkle glyph), and top-bar/toolbar icons (waffle, search, bell,
  chevrons, columns, refresh, filter).

**My interpretation call, flagged for confirmation:** the task asked to
match "queue-page grammar" to the screenshots without specifying exactly
where it should render, since no scene currently shows a queue. I read
`/dashboard` (scene 7, "Queue page: program dashboard + queue +
needs-attention" per `01_build_spec.md` §0) as the only sensible target,
since it's the one scene whose eventual content *is* a queue table, and
built it as a shell-grammar preview using only real fixture data — not as
a start on Act 4's real content. If that's not what was intended, it's
isolated to `src/shell/QueueTable.jsx` and the one line wiring it into
`App.jsx`'s `STUB_AFTER` map, so it's cheap to relocate or remove.

Re-verified all of Session 1's `01_build_spec.md` §0 acceptance criteria
after the rebuild (Playwright, headless Chromium, 1920×1080, 37/37 checks
passed, zero console errors): number-key jumps 1–6, new sidebar item order
and routing, new active-state treatment (white text + dark row + blue left
accent), top-bar chrome details (near-black, no Ask Copilot, tenant name,
fixture-derived badge count), the new queue table's real data + uppercase
pills, beat advance/back clamping, cue overlay open/list/highlight/
click-to-jump/close, and `/intake` + `/blank` remaining chrome-free.

## Session 2 — Act 3 vertical slice (done) · model: Claude Fable 5

Built the three Act 3 scenes for real (replacing their stubs via a
`SHELL_COMPONENTS` map in `src/App.jsx` — stub fallback preserved for
everything else) plus the shared component layer later sessions reuse.
Verified end-to-end with Playwright (headless Chromium, 1920×1080,
**94/94 checks passed, zero console errors**, production `vite build`
clean): full beat walk forward and back, verbatim string assertions
against `03`, the staggered sync, revert/re-run without reload, tab
switching, and the queue table after the pill refactor (14 pills, no
visual change).

### Shared components (new — the reusable patterns)
- **`src/components/StatusPill.jsx`** — canonical two-register pill
  (`02` §1): outlined for in-progress states, tinted for terminal;
  covers agent grammar (Agent fulfilling/Running purple, Awaiting human
  amber, Complete/Done/Resolved green, Overdue red) + platform grammar
  (New, In progress, Open, Rejected, Planned). `QueueTable.StagePill` is
  now a one-line delegate to it (pixel-identical, confirmed).
- **`src/components/GroundingChip.jsx`** — regulation refs → blue tint,
  document refs → green tint, record refs (`Intake AR-4207`,
  `SNOW-88412`, system names) → neutral outlined (implementation choice;
  spec defines only the two tints).
- **`src/components/AgentMark.jsx`** — the ✦ four-point sparkle as SVG
  (no text glyph, per no-emoji constraint).
- **`src/components/ConfidenceMeter.jsx`** — 5-segment meter + word;
  High = 5 green (spec allows 4–5), Medium = 3 amber, Low = 2 red.
- **`src/styles/motion.css`** — choreography tokens/keyframes:
  `fade-slide-in` + `--stagger-i`/`--stagger-step` entrance stagger,
  `agent-shimmer` (Running bar), `check-draw` (150ms), typing dots.
- **`src/state/DemoStateContext.jsx`** — one cross-scene flag
  (`redactionApproved`) so sign-off survives navigation.
- **`src/cue/CueContext.jsx`** — additive: `registerScene`/`useSceneBeats`
  accept an optional `onExitForward`; advancing while on the last beat
  invokes it (used only by the split screen's hand-off into redaction).

### Scenes (`src/scenes/act3/`)
- **`RequestDetailScene.jsx`** (3.1 + 3.4) — real skeleton from
  `pra_request_detail.png`: breadcrumb · title + Agent fulfilling pill ·
  Results summary + kebab · metadata rail with pencils (and
  `✦ Fulfilled by Privacy Agent` in the Workflow slot) · green-underline
  tabs `Plan · Activity · Request`. Plan tab = 6 fixture plan items
  (icon, system chip, pill, grounding chips) + the reasoning panel
  ("How I planned this request", 3 sections, verbatim `03` lines, all
  click-toggleable after their cue). 7 beat states / 6 cues: initial →
  plan staggers in (item 1 Running with shimmer) → 3 reasoning sections →
  fast-forward (450ms-staggered flips to Done + timestamps, item 4 gets
  the clickable "Redaction summary ready" affordance, item 5 Awaiting
  human) → hand-off beat navigates to /subtask. Activity tab = 11
  fixture entries with actor filter chips; Request tab = fixture-only
  label/value card.
- **`SplitScreenScene.jsx`** (3.2) — left 45% OneTrust subtask card,
  right 55% Teams mock (hinted app rail, header with purple-spark avatar
  + presence dot, sent/received bubble grammar, day dividers, compose
  bar) + ITSM strip (mono ticket, pill, assignment group). 6 beat
  states / 5 cues; agent messages land behind ~800ms typing indicators;
  the sync is three timer-staggered flips 500ms apart (thanks message →
  subtask Complete · Jul 10, 2:14 PM → SNOW-88412 Resolved + work note),
  verified as distinct states. Advancing past the sync exits to
  /redaction via `onExitForward`.
- **`RedactionScene.jsx`** (3.3 + 3.5) — findings table with confidence
  meters and the Medium row's inline agent note; excerpt viewer (click
  row / View excerpts) rendering the fixture's `█` runs as continuous
  black bars; Approve & sign off → `Privacy sign-off · Amara Osei ·
  Jul 10, 2:31 PM` (timestamp from the fixture activity entry); final
  cue lands the report-ready card (Meridian cover thumbnail, verbatim
  meta line, purple ✦ `Open report` → routes to `/report`).

### Beat accounting (matches the `03` rehearsal card, user-approved)
Act 3 = **6 cues (detail) + 5 cues (split) + 3 clicks (redaction) +
1 cue (report)**. The script marks only CUE 1–5 on the detail; the 6th
counted cue is the labeled "Hand off → split screen" beat (mirrors
Act 1's counted CUE 7 handoff). The split's exit into redaction
("entered by cue", spec §3.3) is one additional advance-press the
rehearsal card does not enumerate — total Act 3 key presses are 13
(12 enumerated cues + the exit press) plus the 3 clicks (Medium row,
Approve & sign off, Open report).

### Deviations / implementation choices
- **`View excerpts` only on the Medium row** — spec §3.3 puts the link
  on every row, but fixtures provide excerpts only for `Internal
  account identifiers`; an empty viewer would be worse than no link.
- **Teams middle messages carry no timestamps** — only the two
  fixture-grounded ones (thread opened Jul 9, 11:52 AM; delivery
  Jul 10, 2:14 PM). Nothing invented.
- **Script's `done ✔` renders as "done" + SVG check** (no-emoji/dingbat
  constraint); backticked table names in messages render as inline code.
- **Activity trail has no expandable "why"** — fixtures carry no why
  text; grounding renders as the source chips themselves.
- **Plan item 6 stays `Planned`** even after sign-off/report cue — the
  fixture status is `planned` and no scripted beat flips it; revisit in
  Session 4 polish if it reads oddly next to the report card.
- **Report-ready card appears on the redaction scene** (script places
  it after sign-off there), not back on the detail plan.
- Structural UI labels (rail labels, `Assignee:`, table headers, `ITSM`,
  `Work notes`) derive from `01`/`02` surface descriptions — the spec
  names these surfaces but scripts no verbatim label strings for them.
- `/report` is still the Session 1 stub — it's the "report placeholder"
  the report card's `Open report` routes to; the real PDF is Session 4.

### §3 / §5 acceptance status
- §3.2 sync legible as three distinct changes: **pass** (asserted
  thanks-before-Complete ordering). Teams/ServiceNow credibility per
  `02` §4 grammar: **pass** (imitated geometry, suggested branding).
- §3.3 reconstructable-in-15-seconds panel: **pass** (category ·
  instances · confidence · note · excerpt all on one surface).
- §5.2 no layout shift/flash during beats: **pass** (fixed-width
  columns; beat content appears within reserved panels or below
  existing content).
- §5.3 every string from `03`/`04`: **pass for Act 3 scenes** (all
  copy asserted verbatim); still failing app-wide by design — Session 1
  stubs remain on unbuilt scenes until Sessions 3–4.
- §5.1 (<9 min full run) / §5.4 (recordable golden path): **N/A until
  Acts 1/2/4 exist**; the Act 3 slice is stable and re-runnable without
  reload.

## Session 3 — Act 1 + Act 2 (done) · model: Claude Fable 5

Built the Meridian brand layer, both Act 1 scenes, and the Act 2 intake
agent. Verified end-to-end with Playwright (headless Chromium, 1920×1080,
**65/65 checks passed, zero console errors**, production `vite build`
clean): full beat walks forward and back for both acts, verbatim string
assertions against `03`, the provisioning stagger asserted as
Pending-before-Connected, revert/re-run without reload (Austria restored
on reset), Act 3 regression spot-check after the StatusPill/tokens
touches, and AR-4207 present in the queue after intake submission.

### Brand layer (new — user-approved before the scenes were built)
- **`src/brand/MeridianWordmark.jsx`** — "MERIDIAN" (Outfit 600, tracked
  via SVG `textLength` so layout is deterministic) with the meridian-line
  device: 2px copper rule at exactly the E-crossbar height, passing
  behind the navy letterforms and overhanging both ends. `color`/`rule`
  props for the reversed-on-navy variant (holding screen, PDF cover).
- **`src/brand/NorthwindWordmark.jsx`** — flush-justified two-line
  lockup (NORTHWIND / OUTFITTERS) in pine with the NW compass tick: a
  slim two-tone needle on the northwest diagonal, copper head, pine tail.
- **`src/styles/brand.css`** — `@font-face` for Outfit (32KB latin
  variable woff2 bundled at `public/fonts/`, `font-display: block`, fully
  offline) + `--mer-font` token. Color tokens were already in tokens.css.
- **`/brand`** — dev-only proof-sheet route (`src/brand/BrandPreview.jsx`),
  outside the scene map; harmless to ship, cheap to delete.

### Scenes
- **`src/scenes/act1/SetupScene.jsx`** (1.1) — composed conversation:
  ✦-marked agent lines land behind ~800ms typing indicators; admin
  replies right-aligned. 8 beat states = initial + CUE 1–7. Profile card
  with per-row check/pencil affordances; only Austria carries a remove ×
  (hover-revealed) so nothing else can be mis-clicked on stage — ack line
  appears typed after the click. CUE 3 = four file chips staggered in as
  an admin upload. CUE 4 playbook = three columns, every entry expandable
  one level to its source document (tag → filename mapping from
  fixtures §tenant.documents). CUE 5 tiles in brand colors with
  regulation chips; Northwind tile opens a live mini-preview built from
  the Act 2 strings + wordmark (not a static image); other tiles inert.
  CUE 6 = timer choreography (`useChoreography`): Amara's reply →
  provisioning card (all Pending) → Configuring→Connected flips staggered
  ~600ms apart, shimmer bar while configuring, config notes on land.
  CUE 7 shows the closing line then auto-navigates to /setup/flow after
  ~2.2s (same hand-off pattern as Act 3). Beat 0 resets all click state
  (clean re-run); thread auto-scrolls via a bottom sentinel.
- **`src/scenes/act1/FlowChartScene.jsx`** (1.2) — 14 nodes (≤22):
  Intake → Verify identity → branch dot → four lanes → converge →
  Generate response → Deliver. Access lane carries the full Act 3 echo
  (Salesforce/Marketo/Zendesk/warehouse fan → redact → privacy sign-off
  gate); Deletion gets the SOP §5.3 legal gate; Correction/Opt-Out are
  single nodes. Purple left-bar + ✦ on agent nodes, amber + person on
  human gates (warehouse marked human — it awaits Okafor). Lane-chip
  click focuses (hand-tuned per-focus layout table `LAYOUTS`, positions
  CSS-transition 300ms, others dim to 25% + scale .85 and compress
  toward the edges); background click zooms out. Hover tooltips = one
  line + "from your {source}". "Suggest a change" opens a small popover
  with the verbatim placeholder; submit shows a ✦ acknowledgment.
- **`src/scenes/IntakeScene.jsx`** (2.1, replaced stub in place) — sand/
  pine/copper Northwind register, Outfit headings, system-sans body,
  zero OT tokens/components/✦. Header wordmark + verbatim title/subtitle,
  `Identify → Request → Confirm` steps, white rounded-12 card, docked
  assistant strip (compass glyph, verbatim placeholder — never a floating
  widget), thin topographic-line footer (the one approved brand touch).
  4 beat states = initial + CUE 1–3; 4 clicks = Continue · Delete my
  data · pivot chip · Submit. Fields are genuinely typeable at beat 0
  (live-fill path); CUE 1 autofill overrides + Alpine Rewards member
  badge. CUE 2 exchange renders in the strip (typing ~800ms). Pivot chip
  flips the selected card to See my data + verbatim microcopy. CUE 3 =
  "Why we ask" CCPA note. Submit → branded confirmation with the
  verbatim AR-4207 copy. Beat 0 resets everything.

### Beat accounting (matches the `03` rehearsal card)
Act 1 = **7 cues + 3 clicks** (Austria removal · Northwind tile preview ·
Access lane zoom on /setup/flow — CUE 7's transition is part of the 7th
cue, no extra press). Act 2 = **3 cues + 4 clicks** (Continue · Delete my
data · Switch-to chip · Submit). The script marks only 3 Act 2 clicks
explicitly; the rehearsal card says 4 — the Identify→Request **Continue**
press (the copper primary `02` §2 names) is counted as the 4th,
user-notified in the session plan.

### Deviations / composed strings (flagged per §5.3)
- **Request-type card descriptions** (Act 2) — spec requires "a one-line
  plain description" per card but scripts none; composed 4 lines in the
  02 §2 brand voice ("Get a copy of everything we have about you." etc.).
- **Suggest-a-change acknowledgment** — spec 1.2 requires "an agent
  acknowledgment" but 03 scripts none; composed "Got it — I'll draft
  that change for your review." echoing CUE 1's ack register.
- **Marketo/Zendesk config notes** — 03 gives Salesforce's note verbatim
  as an example; the other two follow its pattern with fixture template
  versions ("Configured from template v2.8" / "v3.0").
- **Tile jurisdiction chips** — consumer tiles get all four regulations;
  Meridian Employees gets CCPA/CPRA + GDPR only (VCDPA/CPA don't cover
  employee data; employees are US + Germany per the profile card).
- **Cascade Home / Alpine Rewards tile colors** — no spec'd palette
  (data-only brands): housewares teal #33606E, shared copper.
- **Only the Northwind tile opens a preview** — the scripted click; a
  generic preview for the other three would need invented content.
- **Flow-chart node labels** — no scripted strings exist for nodes;
  titles/sublabels derive from 01 §1.2's structure list, 03's playbook
  rules, and fixtures §tenant.systems ("Delete across systems" and
  "Update source records" are composed-structural).
- **StatusPill additions** (additive, not a restyle): Pending (outlined
  gray) · Configuring (outlined purple) · Connected (tinted green).
- **Global `button:focus`/`input:focus` outline suppression** in
  tokens.css — presenter clicks were leaving Chromium focus rings on the
  Act 2 request cards on camera.
- **Handoff reversibility** — *(revised post-session after presenter
  feedback: the flow chart was a cue dead-end).* The cue engine gained an
  additive `onExitBack` (mirror of `onExitForward`): ← on beat 0 exits the
  scene. Wiring: flow chart ← → /setup at beat 6 (pre-handoff state —
  beat 7 would immediately hand off again; the scene reads a
  `location.state.beat` jump target) and → → /intake; intake ← (beat 0) →
  /setup/flow and → (past CUE 3) → /requests/4207. The whole Act 1→2→3
  path is now walkable in both directions on the cue keys; number keys
  remain the hard recovery. `jumpToBeat`/`advance` now clamp against a
  synchronous labels ref so cross-scene "land on beat N" jumps can't
  clamp against the previous scene's beat list. *(Second round, after the
  same trap surfaced at the Submit → Act 3 boundary:)* the full Act 3
  chain is wired too — request detail ← → /intake restored to its
  **pre-submit state** (beat 3 + Request step + pivot applied, via a
  `location.state.resume` flag, since the confirmation screen is click-
  state); split screen ← → detail at beat 5; redaction ← → split screen
  at the sync beat; redaction → past the report card → /report. Every
  scene hand-off in Acts 1–3 is now reversible on ←. *(Third round:)*
  Act 2's beats gained **cue fallbacks for every scripted click** — a
  cue-only forward walk was skipping the Request step and confirmation
  entirely (beats rendered into whatever step the clicks had reached).
  Beat 2 now ensures Request step + Delete selected, beat 3 ensures the
  pivot, and advancing past beat 3 lands the confirmation screen first
  (fallback for the Submit click), continuing to Act 3 only from there;
  ← below beat 3 un-confirms. Deliberate clicks still do the same
  things earlier and the fallbacks become no-ops, so the 3-cues+4-clicks
  rehearsal path is unchanged. Also fixed in the cue engine: pressing a
  scene's number key while already on that scene now resets it to beat 0
  (the route didn't change, so the scene never re-registered and the
  "hard recovery" silently did nothing).

### §1 / §2 / §5 acceptance status
- §1.1 conversation drivable by advance key + two deliberate clicks;
  every card legible at 1920×1080, no body text under 14px except
  chips/meta at the 12.5px floor `02` permits: **pass**.
- §1.2 one glance-comprehensible map ≤22 nodes (14), smooth Access zoom,
  tooltips with grounding, suggest affordance, no editing: **pass**.
- §2.1 pivot exchange ≤4 presenter inputs (CUE 2 → chip click →
  CUE 3 → Submit = 4): **pass**. Zero OneTrust DNA (asserted: no
  OneTrust/module strings; no OT tokens or components used): **pass**.
- §5.2 no layout shift/flash: **pass** (thread grows downward with
  auto-scroll; flow transitions animate position only; provisioning
  flips in place).
- §5.3 every string from 03/04: **pass for Acts 1–3** with the composed
  strings itemized above; app-wide still pending Act 4 + report stubs.
- §5.1 (<9 min run) / §5.4 (recordable golden path): **N/A until
  Act 4 + PDF exist**; Acts 1–3 are stable and re-runnable.

## Session 4a — Act 4 dashboard chunk (done) · model: Claude Opus 4.8

Scope this chunk (user-selected "dashboard chunk only"): the program
dashboard (spec §4.1), the needs-attention list (§4.2), and presenter-key
wiring. **Deferred to later chunks of Session 4:** the Session-3 punch
list (see below), the PDF report (`05`), and the cross-cutting <9-min
full-run polish pass. Verified end-to-end with Playwright (headless
Chromium from the ms-playwright cache, 1920×1080, **34/34 checks passed,
zero console errors**, production `vite build` clean).

### New data layer
- **`src/data/dashboard.js`** — pure module; every dashboard value is
  derived here from fixtures §history so the timeframe control genuinely
  recomputes (no hardcoded numbers in the view). Exports `TIMEFRAMES`,
  `statsFor(key)`, `digestFor(key, stats)` (tokenised for bold figures),
  `requestTypeShare`, `topJurisdictions`.

### Scenes (`src/scenes/act4/`)
- **`DashboardScene.jsx`** (§4.1, replaces the Session-1b stub+QueueTable
  preview via `SHELL_COMPONENTS.dashboard`) — page header (green
  `Create request`); **AI summary banner** in the posture-dashboard
  pattern (`ai_posture_dashboard_pattern.png`): agent-tint band, ✦
  `AI summary`, two-sentence digest with **bold** figures recomputed per
  timeframe, right-aligned `View needs-attention` link (smooth-scrolls to
  the panel); **timeframe segmented control** (Today · Since yesterday
  [default] · 7 days · 30 days); **four stat blocks** (32px tabular
  numbers, no legacy bottom bars; Fulfilled is the ✦-marked hero;
  Awaiting-human links to attention); **one trend chart**; **distribution
  chips row**; and the **subordinated queue** (`QueueTable` wrapped at
  `max-height:35vh`, scrolls internally).
- **`TrendChart.jsx`** (§3 data-viz) — inline SVG stacked bars,
  agent-fulfilled `--ot-agent` over human-involved `--ot-ink-3`, hairline
  horizontal gridlines, 12.5px axis, tabular figures, `<title>` tooltips.
  No chart library.
- **`NeedsAttention.jsx`** (§4.2) — all 8 fixture cards in a 2-col grid,
  visually distinct from the queue (cards, purple ✦ left-accent). The two
  scripted resolves: identity-match `Review match` → inline compare card
  (matching Name/Email highlighted green) → `Approve match` → verbatim
  `Approved · Agent resumed fulfillment.`; and `Escalate` → verbatim
  `Escalated to R. Vance (Eng Manager) · Ticket SNOW-88419 updated.` Both
  land a 150ms check-draw and dim the card. Non-scripted cards' actions
  are present-but-inert (only two are scripted).

### Hero reads verified from the data
- Since yesterday: **47 received · 39 fulfilled · 8 awaiting · median 2.1**
  (the digest is the verbatim §4.1 script line).
- 30 days: digest surfaces the **31→39/day** fulfilment climb and the
  **5.4→2.1 day** median fall (−61%); Received/Fulfilled recompute to the
  30-day sums (1386 / 1016). 7-day recomputes to 322 / 261.
- Resolving either scripted attention card ticks **Awaiting human** down
  live (8 → 7 → 6) — same-route scene state, no global context needed.

### Beat accounting (rehearsal card: Act 4 = 0 cues + 4 clicks)
Dashboard is a `[CLICK]` surface — registered with a single beat so number
key 4 lands it in its initial (Since-yesterday) state; no advance-key
cues. The 4 stage clicks are the two scripted resolves' inputs (Review
match → Approve match; Escalate) plus a timeframe switch to the 30-day
view; the `View needs-attention` banner link is a fifth optional click.

### Deviations / interpretation calls (flagged for confirmation)
- **Timeframe model.** Received/Fulfilled = window SUMS (so numbers
  visibly change as the window widens — acceptance §4.2); at the two
  1-day views this equals the day's figures, landing the scripted hero.
  Median = current rolling 2.1 with a ▼61% vs-prior-30-days delta (summing
  medians is meaningless — it's point-in-time). Awaiting = current backlog
  (8), constant across views, decremented by resolves. Today and Since-
  yesterday share primaries by nature (end-of-day "today" *is* "since
  yesterday"); they differ in delta framing. If Today should be a distinct
  partial-day slice, easy to change.
- **Chart window floors at 7 days** so the two 1-day views render a real
  recent trend, not a lone bar (spec says "over the timeframe").
- **Composed digest strings** — only the Since-yesterday digest is
  verbatim (§4.1); Today / 7-day / 30-day digests are composed in the same
  register (per §5.3 the composed strings are itemised here).
- **Attention severity chips** (`Deadline risk` amber for `stalled`,
  `Needs review` neutral otherwise) derive from each item's `kind` — an
  implementation choice; fixtures tag every item `severity:"warn"`.
- **Favicon added** to `index.html` (inline data-URI SVG of the OT mark) —
  silences the browser's auto `favicon.ico` 404 so the console is truly
  clean and the projector tab looks intentional. One-line, revertable.

### Still open in Session 4 (next chunks, in order)
*(Resolved in Session 4b below. The Session-3 punch list came back empty —
user review found nothing to fix.)*

## Session 4b — PDF report + polish + endgame (done) · model: see summary

User-approved gate: pages 1/2/6/8 were rendered and shown before wiring.

### The PDF (spec 05 in full)
- **`public/AR-4207_access_report.pdf`** — the committed static asset:
  real 9-page US-Letter PDF, 274K, verified 9 pages via metadata. Meridian
  system throughout (navy/copper/cream, Outfit headings via the bundled
  woff2), 0.9in margins, copper-rule footer with small wordmark on pages
  2–9. Redactions render as true black bars with the tiny REDACTED
  microlabel (page 8).
- **`report/AR-4207_report.html`** — the source (print CSS, one `.page`
  per page); **`report/render-pdf.mjs`** regenerates the PDF + per-page
  PNG previews via the ms-playwright-cached Chromium (`node
  report/render-pdf.mjs`), with a guard that fails the render if any page
  overflows its 11in box (prevents silent 10-page drift).
  `playwright-core` is now a permanent devDependency (render toolchain).
- **Reconciliation (05 production note):** balance **12,480** = by-year
  earned 20,250 − redeemed 6,750 − expired 1,020; expiry schedule
  2,140 + 3,480 + 6,860 = 12,480 (next: Dec 31, 2026); 28 orders (14 shown
  + truncation line); 24 redactions (14+3+7 per fixtures); 22 Salesforce
  fields; 340 email events; 6 conversations 2019–2026 incl. ZD-30117 ·
  Feb 9 2024 (the fixture excerpt) and the Dec 2023 shared purchase; the
  excerpt's order NW-2024-1180 appears in the page-7 orders table;
  retrieval dates match the fixture activity trail (Salesforce/Marketo/
  Zendesk Jul 9, warehouse Jul 10).
- **Composed content, flagged per §5.3/05:** cover/letter/captions/closing
  are verbatim from 05; tables' plain-language cells, the page-5 field
  values (address, phone, DOB, AR number…), by-year points, order rows,
  and page-9 option-block bodies are composed to the tone guide — 05
  specifies their structure but not their strings.
- **Cover carries no footer** — 05 says "footer on every page" but the
  cover spec says "Nothing else"; "nothing else" won. Footers run 2–9.

### The viewer (`src/scenes/ReportScene.jsx`, replaces the last route stub)
- *(Rebuilt post-tag on presenter request: "each advance turns a page;
  past the last page, continue to the dashboard.")* The scene is now a
  **cue-driven page presenter**: 9 beats = 9 pages, so → walks the report
  page by page (cover → next steps) and → on page 9 exits to Act 4; ← is
  symmetric (page back; ← on the cover → /redaction at its report-ready
  beat). Pages are 2x PNGs of the real committed PDF (1632×2112, ~1.7M
  total at `public/report-pages/`), emitted by the same
  `report/render-pdf.mjs` run that produces the PDF, preloaded on mount
  so flips are instant (no flash, §5.2) with the 200ms entrance easing
  each turn. The cue overlay doubles as a table of contents (`Page 6 ·
  Alpine Rewards history`…); the header shows `Page N of 9`.
- **The artifact stays a real PDF** (README tech constraint): `Open in
  new tab` serves `public/AR-4207_access_report.pdf` itself — the
  presenter shows page images *of* that asset for stage control, it does
  not replace it. The earlier iframe embed (and its focus-recapture
  workaround) is gone — Chrome's PDF viewer can't be page-advanced by the
  cue engine, and its iframe could swallow presenter keys.
- Cue wiring: RedactionScene gained the same `location.state.beat` jump
  the split screen uses; the dashboard's ← returns to /report **at page
  9** (the state that handed off), so the boundary is symmetric.
  *(History: the first post-tag fix added the dashboard back-exit at all
  — report → dashboard had been the walk's one irreversible press.)*
- **Beat accounting revision:** the report is now 9 beats, so the golden
  path gains 8 page-turn presses between "Open report" and Act 4
  (previously the report was a single beat crossed in one press).
  Verified 16/16: overlay lists 9 beats, full forward walk, exit to
  dashboard, ← from dashboard → page 9, page-back chain to /redaction,
  real-PDF link intact, zero console errors.

### Polish pass (38-state screenshot walk at 1920×1080)
- Sessions 1–3 scenes held up: motion timings all inside the README bands
  (provisioning 500–600ms gaps, sync 500ms, fast-forward 450ms, typing
  800ms), pill/chip/type grammar consistent. No changes to any built
  scene's copy, data, beats, or interactions.
- **The one real seam:** Reports/Subtasks/Settings still showed Session 1
  stub text ("Skeleton scene — not yet built") — a §5.3 violation and a
  stage risk if clicked. Replaced with minimal fixture-derived module
  pages (`src/scenes/ModulePlaceholders.jsx`): Reports = page-header
  grammar + empty state; Subtasks = the one real fixture subtask
  (warehouse extract · Okafor · SNOW-88412 · Complete); Settings =
  tenant fixture rows (org, lead, regulation chips, systems with
  Connected/No-integration pills). One composed-structural line each,
  same convention as prior sessions. `StubScene.jsx` deleted — every
  scene in the map now has a real component.
- Dashboard distribution card no longer stretches to match the chart
  column (hugs content); favicon added in 4a keeps the console clean.

### §5 cross-cutting acceptance — final verdicts
1. **§5.1 <9-min full run, no dead-ends: PASS.** Scripted golden path
   (exact cue map: keys 1→2→3→4→5→6, every cue and click) completed in
   **6.1 min** machine-paced with 1.5s presenter gaps — zero dead-ends,
   zero refreshes (marker survived the whole run).
2. **§5.2 zero layout shift/flash: PASS.** Per-scene assertions in
   Sessions 2–3 + this session's 38-state visual walk; beat content lands
   in reserved panels, transitions animate position/opacity only.
3. **§5.3 every string from 03/04: PASS** with composed-structural strings
   itemized per session in this file. Sweep of rendered strings found no
   lorem/TODO/placeholder text; the last stub scenes are gone.
4. **§5.4 recordable golden path: PASS.** The §5.1 run is the recordable
   take — one pass, stable, machine-drivable.
- Beat counts vs the rehearsal card, verified via the cue overlay during
  the run: setup 8 beats (7 cues) · intake 4 (3) · detail 7 (6) · split
  6 (5) · redaction 2 (1) · dashboard 1 (0). Clicks: Act 1 ×3 (Austria ·
  Northwind tile · Access zoom) · Act 2 ×4 · Act 3 ×3 · Act 4 ×4. The
  split→redaction exit press remains the one un-enumerated advance (as
  documented since Session 2).

## Final state summary (Session 4 close)

| Component | State | Model |
|---|---|---|
| Shell (top bar, sidebar, tokens, queue grammar) | done | S1 unrecorded · S1b unrecorded |
| Cue engine (beats, overlay, number keys, exits) | done | S1 unrecorded; exit/back wiring Fable 5 |
| Act 1 setup conversation + flow chart | done | Fable 5 (S3) |
| Act 2 Northwind intake agent | done | Fable 5 (S3) |
| Act 3 detail/split/redaction + shared components | done | Fable 5 (S2) |
| Act 4 dashboard + needs-attention | done | Opus 4.8 (S4a) |
| PDF report (asset + toolchain) + /report viewer | done | S4b (session ran after a /model switch Opus 4.8 → Fable 5) |
| Reports/Subtasks/Settings module pages | done (minimal, off-path) | S4b |
| /blank holding screen · /brand proof sheet | done · dev-only extra | Fable 5 (S3) |
| Spanish PDF (05 “if time is abundant”) | **not built** (explicitly optional) | — |

**Open deviations carried forward (all flagged in their sessions):**
Act 3 `View excerpts` only on the Medium row · plan item 6 stays
`Planned` after sign-off (fixture status; no scripted flip) · Act 2/1
composed strings itemized in S3 notes · dashboard timeframe model +
composed digests (S4a notes) · PDF composed content + no-footer cover
(S4b notes) · report viewer lives in-shell (not full-bleed).

## Session 3.5 — Page-header unification (done)

Scope, per the session brief: **visual/fidelity polish on existing scenes
only.** No new scenes, routes, beats, cue timings, fixture data, or
authored copy. Every string on screen is unchanged from Session 4 close.

The seam this closes: the Figma page-header refits (Setup, Requests) had
established a real band — white, 24px padding, optional breadcrumb, 24/32
title, 14/20 description, full-width `#a9a9a9` divider — but the three
older surfaces (request detail, redaction, dashboard) plus the module
pages each had their own near-copy at a **different title size and a
different gutter**. Walking the deck, titles jumped 22px → 24px → 22px
and content wells jumped 32px → 24px → 32px between consecutive scenes.

Built:
- **`src/shell/PageHeader.jsx`** — the band extracted once, as three
  exports: `PageHeader` (breadcrumb / title / `status` slot / `meta` slot
  / description / `actions`), `PageBody` (the 24px content well, with an
  opt-in 1200px `measure`), and `PageAction` (the module's green
  filled/outlined control pair). Breadcrumb entries accept `to` for a
  route or `onClick` for Setup's crumb, which rewinds a beat rather than
  navigating.
- **Five scenes migrated onto it**: Setup (both beat-0 and Privacy-Agent
  variants), Requests, request detail, redaction, dashboard, and the
  Reports/Subtasks/Settings module pages. Deleted along the way: the
  per-scene `PageHeader` duplicates in `DashboardScene` and
  `ModulePlaceholders`, and the Requests header's negative-margin bleed
  hack — the band now sits outside the body padding, so the divider spans
  full width without fighting the scene's gutter.
- **`--fs-page-title` revised 22px → 24px/32px** in `tokens.css`, so the
  token *is* the Figma band's title rather than something scenes had to
  override locally.
- **Gutters normalized to 24px** on every in-shell surface (Setup's two
  `var(--space-8)` paddings, the Requests table well, the dashboard,
  detail, redaction and module bodies). Verified at 1262×983: header
  title and content card now share x=284 / right=1238 on all of them.
- **Two fidelity fixes inside the detail scene's Request tab**: the
  Suspected-Agent-Detection card's hardcoded `rgba(239,59,48,…)` pair
  swapped for `--ot-danger-tint` / `--ot-danger`, and its `⚠` text glyph
  replaced with a new outline `WarningIcon` in `shell/icons.jsx` (the
  no-emoji tech constraint — this was the last glyph standing). The card
  and the field table also lost their 640px cap, so they fill the tab
  column instead of stopping halfway.

Verified: production build clean; screenshot walk of `/setup`,
`/requests`, `/requests/4207` (Request tab), `/requests/4207/redaction`,
`/dashboard`, `/settings`, `/subtasks` at the presenter viewport — bands
identical, no layout shift, cue overlay and beat counts untouched.

**No new deviations.** All Session 4 open deviations carry forward
unchanged; this session touched styling only.

### 3.5b — Deployment fix + three restored binaries

Published site was serving `404 NOT_FOUND`. Cause was **not** app code:
the Vercel project had **Root Directory unset**, so it built from the
repo root — which holds only `.gitignore` and `src/`. No `package.json`
there meant no framework detected, no build run, and an empty directory
published; the deploy reported READY because there was nothing to do.
Knock-on effects: `dist/index.html` never existed (hence `/` 404), and
**`src/vercel.json` was ignored**, so the SPA rewrite this deck needs for
`/setup`, `/requests/4207`, `/dashboard` was absent too.

Fixed by setting `rootDirectory: "src"` and `framework: "vite"` on the
project. (Note for future CLI work: `vercel api`'s `-d` is the global
*debug* flag, not a data flag — a PATCH with `-d` sends no body and
silently no-ops. Use `--input -` and read the result back.)

While auditing, found three committed-but-absent binaries — dropped in
the original v0 import, not ignored by any `.gitignore`, and unrelated to
3.5:
- `public/fonts/outfit-variable-latin.woff2` — the build warned on it and
  `brand.css`'s `@font-face` silently fell back to Avenir Next, which also
  broke README non-negotiable #1 (runs fully offline). Re-fetched and
  self-hosted.
- `public/report-pages/page-{1..9}.png` — **all nine missing**, so the
  entire `/report` viewer rendered blank. This was the most severe of the
  three and would have killed Act 3's payoff on stage.
- `public/AR-4207_access_report.pdf` — the report scene's `PDF_URL`.

All regenerated from the committed source of truth (`report/*.html` +
`report/render-pdf.mjs`) rather than re-authored, so the artifacts still
match the fixtures. Required installing Chromium and its runtime libs in
the VM; the renderer's own `CHROMIUM` env override drove it, and it
reported all 9 pages with no overflow.

Verified on a preview deployment: `/`, `/setup`, `/dashboard`,
`/requests/4207`, `/requests/4207/redaction`, `/report` all 200 (SPA
rewrite live), plus the woff2, PDF, and page PNGs; `/report` loads 16
images with none broken and `document.fonts` reports Outfit `loaded`.

### 3.5c — Publish fix: root `vercel.json` shim

Setting Root Directory fixed **CLI** deploys but Publish still failed with
`vite: command not found` (exit 127). Cause: **v0's Publish builds from
the repo root and does not apply the dashboard Root Directory setting.**
Proof was in the log diff — the CLI build ran `Installing dependencies…`
then `pnpm run build`, while Publish ran no install at all and invoked the
framework preset's raw `vite build`. Vercel only uses `<pm> run build`
when it finds a `package.json` with a `build` script, so on Publish it was
never looking inside `src/`: no install, no `node_modules/.bin`, no vite
on PATH.

Fixed with a **root `vercel.json`** — config travels with the repo, so it
applies identically to Publish and CLI:

```json
{ "installCommand": "cd src && npm ci",
  "buildCommand":   "cd src && npm run build",
  "outputDirectory": "src/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

All dashboard overrides (rootDirectory / framework / build / install /
output) were then **cleared to null** so the file is the single source of
truth and nothing can silently diverge again. The rewrite is duplicated
from `src/vercel.json` because that nested file is only read when the
build root is `src/` — the root copy is what's live now.

**npm, not pnpm, in the shim.** First attempt used pnpm and failed:
`WARN Ignoring not compatible lockfile … ERROR Headless installation
requires a pnpm-lock.yaml file`. With no lockfile at the repo root Vercel
detects **npm** and provisions a pnpm too old to read this repo's
`lockfileVersion 9.0`. Both `pnpm-lock.yaml` and `package-lock.json` are
committed in `src/` and both agree with `package.json`, so `npm ci` is the
one that works unattended. (Aside: `vercel api`'s `-d` is the global
*debug* flag — a PATCH with `-d` sends no body and silently no-ops; use
`--input -`. And don't pipe `2>&1` into a file you intend to parse as
JSON, since the CLI banner corrupts it.)

Verified by deploying with Root Directory unset — i.e. reproducing
Publish's exact conditions — and reading the build log back: `npm ci`
added 66 packages, `vite build` transformed 73 modules, no font warning.
All routes 200 (`/`, `/setup`, `/dashboard`, `/requests`,
`/requests/4207`, `/requests/4207/redaction`, `/report`) plus the woff2
(32 KB), PDF (234 KB), and `page-1`/`page-9` PNGs; app boots in-browser
with the 3.5 header band intact.

### 3.5d — v0 preview panel: Vite `allowedHosts`

Separate from the deploy problem, and a separate cause. The dev server was
healthy the whole time (200 on `localhost:3000`), but the in-chat preview
panel showed nothing because `vite.config.js` had
`allowedHosts: ['.vercel.run']`. Vite answers a Host header it doesn't
recognise with a **403 "Blocked request. This host is not allowed"**
instead of the app, so a panel proxying through any other hostname got an
error page, not the deck. Confirmed by curling with spoofed Host headers:
`.vercel.run` → 200, but `v0.dev` / `v0.app` / `vercel.app` → 403.

Fixed with `allowedHosts: true` (accept any Host). Dev-server only — no
effect on the deployed build, which is static files behind Vercel's own
routing. Re-tested the same spoofed hosts: all 200.

Note Vite watches its own config and self-restarts, so an explicit
restart afterwards fails with `Port 3000 is already in use` — that error
means the reload already happened, not that something broke.

Verified all 9 routes in-browser at 1160x1111 dark: `/setup`,
`/dashboard`, `/requests`, `/requests/4207`,
`/requests/4207/redaction`, `/report`, `/reports`, `/subtasks`,
`/settings` — every one renders real content with **0 broken images**
(34 images on `/setup`), and HMR reports `[vite] connected`.

One red herring worth recording: the console history showed
`ReportsScene` crashing repeatedly. Those were **stale** entries from
mid-edit HMR reloads in earlier sessions — `/reports` renders fine now
(h1 "Reports"). Don't re-fix it.

**Open:** the project has SSO deployment protection
(`all_except_custom_domains`), so every `*.vercel.app` URL demands a
Vercel team login — a demo audience would hit an auth wall, not the deck.
Needs either a custom domain or protection relaxed before TrustWeek.

## Session 3 original brief (for reference)

Per `spec_pack/README.md`: setup agent conversation (`/setup`, 7 cues +
3 clicks incl. the country-removal click), document ingestion cards,
decomposed playbook, integration provisioning stagger, generated flow
chart (`/setup/flow`), and the branded Northwind intake agent
(`/intake`, no OT chrome) with the pivot exchange. Reuse StatusPill /
GroundingChip / AgentMark / motion.css from `src/components` +
`src/styles/motion.css`; register scenes via `useSceneBeats` (see
`src/scenes/act3/` for the pattern, incl. `onExitForward` hand-offs).
