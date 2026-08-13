# 01 — Build Spec (PRD)

The demo app simulates the future OneTrust Privacy Rights Automation product for a fictional customer, Meridian Brands. Four acts, one continuous story: setup (Act 1) → intake (Act 2) → fulfillment (Act 3) → oversight (Act 4). The narrative rationale lives in the demo flow doc; this spec is only what to build.

Every surface below is tagged with its **mode**:
- `[CLICK]` — freely interactive; the presenter (or a curious customer at a booth) can explore it safely
- `[CUE]` — choreographed sequence advanced by presenter keys; each beat is a scripted state transition
- `[STATIC]` — a fixed artifact (slide, PDF)

Copy for all labels, messages, and dialogue: see `03_demo_script.md`. Data: see `04_data_fixtures.json`.

---

## 0. App shell

**Layout:** faithful OneTrust platform chrome per `02_design_system.md` §1 and the screenshots in `reference/` (view them first — especially `pra_request_queue.png` and `pra_request_detail.png`, the actual module being reimagined): near-black top bar (waffle launcher icon — inert, no mega menu — OneTrust-register mark, search icon, bell with badge, tenant switcher "Meridian Brands ⌄", settings gear, avatar `AO`); dark navy module sidebar titled "Privacy Rights Automation" with the **real module's items**: Dashboard, Reports, Requests, Subtasks, Setup, Settings (Reports and Subtasks = simple placeholder scenes; Setup routes to the agent setup conversation; the consumer intake agent has no nav item — it's outside the admin app, reached via presenter key 2). No "Ask Copilot" in the chrome — one AI entry point only (the Privacy Agent in the content area). The nav is real — clicking items routes to the corresponding scenes. Page headers: title + gray description + green filled primary action top-right. The chrome is *today's* platform on purpose; the future lives in the content area.

**Scene map:**

| # | Scene | Route | Acts |
|---|---|---|---|
| 1 | Agent Setup (conversation) | /setup | Act 1 |
| 2 | Generated flow chart | /setup/flow | Act 1 capstone |
| 3 | Meridian intake agent (consumer view, no OT chrome) | /intake | Act 2 |
| 4 | Request detail — Marcus Bell | /requests/4207 | Act 3 |
| 5 | Split-screen (OT + Teams + ServiceNow) | /requests/4207/subtask | Act 3 |
| 6 | Redaction summary | /requests/4207/redaction | Act 3 |
| 7 | Queue page: program dashboard + queue + needs-attention | /dashboard | Act 4 |
| 8 | PDF report viewer | /report | Act 3/5 key |

**Presenter cue engine:** per README non-negotiable #2. Implementation: each scene exports an ordered array of beats; a beat is `{apply(state), revert(state)}` or equivalently a scene state index. Global keyboard listener; cue overlay (Esc) lists beats with the current one highlighted, click-to-jump.

**Acceptance:** number-key jumps land on the correct scene in its *initial* beat state; advancing through all beats and back never produces a broken intermediate state; a full act can be re-run without reloading.

---

## 1. Act 1 surfaces

### 1.1 Setup agent conversation `[CUE]`
A full-page conversational surface — but composed, not a bare chat: agent messages appear as rich cards where appropriate (profile summary, document playbook, form previews, integration progress), with the admin's replies as compact right-aligned confirmations. Beats (dialogue in `03`):

1. Agent greeting + **company profile card**: researched facts (brands, jurisdictions in scope with regulation chips: CCPA/CPRA, VCDPA, CPA, GDPR; customer countries). Card has per-row confirm/edit affordances.
2. Admin corrects one row (removes a country) — a real click the presenter performs, not a cue. The card updates; agent acknowledges.
3. Agent requests documents → **upload moment** (staged: cue triggers the four documents appearing as chips: DSAR SOP.pdf, Customer Data Flows.pdf, Response Letter Examples.docx, Meridian Brand + Tone Guide.pdf).
4. **Decomposed playbook card**: three columns — Process rules (from SOP, incl. the redaction sign-off rule), Data landscape (from flow diagram: 4 systems), Voice & brand (from guides). Each entry shows a tiny source-doc tag. This card is `[CLICK]`: entries expandable one level.
5. Agent proposes **4 branded intake agents** (Northwind Outfitters, Cascade Home, Alpine Rewards, + Employees). Small preview tiles in each brand's color. Clicking a tile opens a mini preview (static image is acceptable).
6. **Systems & integrations beat**: agent lists systems cross-referenced from data map + flow diagram; asks for Salesforce URL + credential; admin's answer appears; then a **provisioning sequence**: three integration rows (Salesforce, Marketo, Zendesk) animate Pending → Configuring → Connected, staggered. Warehouse row shows "No integration — tasks will route to asset owner (D. Okafor) via Teams."
7. Agent closes: "Here's the process I'll follow" → transitions to the flow chart scene.

**Acceptance:** the whole conversation can be driven start-to-finish with only the advance key plus the two deliberate presenter clicks (country removal, tile preview); every card is legible at 1920×1080 from the back of a room (no body text under 14px).

### 1.2 Generated flow chart `[CLICK]`
The Act 1 capstone. One unified horizontal flow, n8n-inspired but *simpler and calmer* — err on visual taste: rounded nodes, generous spacing, one accent color for agent-automated nodes and a neutral for human-gate nodes, thin curved connectors.

Structure: Intake → Verify identity → **Request-type branch** (Access / Deletion / Correction / Opt-Out — four branch lanes) → per-branch system nodes (from fixtures) → review gates (e.g., "Privacy sign-off: redactions" on the Access lane) → Generate response → Deliver.

Interactions: clicking a branch label zooms/focuses that lane (others dim and compress); click background to zoom out; hovering a node shows a one-line tooltip of what it does and its grounding source ("From your SOP §4.2"). **Do not** build editing — a single "Suggest a change" button that opens a small text affordance and an agent acknowledgment is enough to make the point.

**Acceptance:** the full map reads as one glance-comprehensible picture (≤ ~22 nodes total); zoom into Access lane is smooth and is the state Act 3 will later echo.

---

## 2. Act 2 surface

### 2.1 Meridian intake agent `[CUE]` with `[CLICK]` fields
Consumer-facing, **no OneTrust chrome** — full Meridian Northwind Outfitters branding per `02`. Layout: a structured single-column request flow (brand header, progress steps: Identify → Request → Confirm) with an ever-present slim assistant affordance ("Questions? Ask here") docked at the bottom of the card — the structure of a form, conversationally capable.

Beats:
1. Initial state; presenter fills identity fields live (pre-fillable via cue as fallback: a beat that populates Marcus's details).
2. Marcus selects **Delete my data** (real click on a request-type option card).
3. Cue: Marcus's question appears in the assistant slot ("If I delete my account, do I lose my loyalty points?"); agent's answer appears (scripted, cites "Alpine Rewards program terms"), ending with the access-request suggestion as an inline action chip.
4. Presenter clicks the chip → request type flips to **Access**; a subtle confirmation notes the change.
5. California-consumer adaptation moment: the form shows a compact "Why we ask" note with CCPA/CPRA-specific disclosure line. Submit → branded confirmation screen ("Request AR-4207 received").

**Acceptance:** the pivot exchange takes ≤ 4 presenter inputs; the surface would pass as a polished consumer brand page with zero OneTrust visual DNA.

---

## 3. Act 3 surfaces (highest priority)

### 3.1 Request detail — agent plan view `[CUE]` then `[CLICK]`
Route /requests/4207, Marcus Bell, Access, California, consumer. **Keep the real page skeleton from `reference/pra_request_detail.png`** — breadcrumb `Requests › AR-4207`, title `Data subject request details` + status pill, left metadata rail (subject, type, jurisdiction badge, received date, deadline countdown "41 days remaining", language; and where today's rail says `Workflow: …`, ours says `✦ Fulfilled by Privacy Agent`), tabs with green underline: `Plan · Activity · Request`. **Where today's blue chevron stage bar sits (NEW → VERIFYING IDENTITY → …), our agent plan takes that exact slot** — the substitution is the before/after moment. Main content, two panels:

**Left — the plan.** A vertical execution plan replacing today's workflow diagram: 6 plan items (fixtures §marcus.plan) each with: icon, title, target system chip, status (Planned / Running / Done / Awaiting human), and grounding tag (e.g., "CCPA §1798.110" or "SOP §4.2"). This is the demo's most-photographed admin screen — spacing and typographic hierarchy matter more than density.

**Right — reasoning panel.** Titled "How I planned this request." Three collapsed-by-default sections that the cue opens in sequence: Classification (request/subject/jurisdiction determination), Obligations (from DataGuidance: verification, 45-day deadline, disclosure scope — each a short line with a regulation chip), Your context (data flow diagram → where Marcus's data lives; SOP → redaction + sign-off rule; brand guide → response style). Every line carries a source chip. Visual register: audit artifact, not chat bubble — no avatars, no message bubbles.

Beats: 1) plan appears items-staggered; 2–4) reasoning sections open one by one; 5) "fast-forward" — plan items 1–3 flip to Done with timestamps; item 4 (Zendesk + redaction) flips to Done with a "Redaction summary ready" affordance; item 5 (warehouse) shows Awaiting human → this is the hand-off to 3.2.

### 3.2 Split-screen agentic user subtask `[CUE]`
A purpose-built presentation layout (entered from plan item 5): left 45% = OneTrust subtask card (subtask state, linked ServiceNow ticket chip SNOW-88412 with status); right 55% = a **mocked Microsoft Teams** window (pixel-credible: Teams left rail hinted, chat header "Meridian Privacy Agent → Daniel Okafor", message bubbles) with a slim **mocked ServiceNow ticket strip** below it (ticket number, state pill, short work-notes line).

Beats (messages verbatim in `03`): 1) agent's Teams message appears (typing indicator first) — the ask, the exact tables, the return format; 2) Okafor's clarifying question; 3) agent's answer; 4) Okafor returns the extract (file chip) + "done"; 5) the choreographed sync: Teams read-receipt tick → OneTrust subtask flips Complete → ServiceNow ticket flips Resolved with a work note — staggered 500ms apart, in that order, visibly.

**Acceptance:** the sync beat is legible as three distinct state changes; Teams/ServiceNow mockups are credible to daily users (correct visual grammar; see `02` §4 for what to imitate and what to only suggest).

### 3.3 Redaction summary `[CLICK]` (entered by cue)
The privacy reviewer's sign-off surface, opened from plan item 4. A first-class panel, not a modal. Contents:

- Header: "Redaction complete — awaiting your sign-off" + context line (source: 6 Zendesk transcripts, 2019–2026).
- **Findings table** (fixtures §marcus.redaction): rows = category of third-party data found (Support agent names & signatures ×14; Other customer's name + order details ×3; Internal account identifiers ×7); columns = category, instances, confidence (High/High/Medium rendered as a small labeled meter — color per design system semantics), and a "View excerpts" link.
- Excerpt viewer: clicking a row opens redacted transcript excerpts with black-bar redactions inline; the Medium-confidence row is the one the presenter opens (scripted spot-check moment).
- Footer: Approve & sign off (primary) / Return to agent with note (quiet secondary). Approving flips plan item 4's gate and logs to the activity trail.

**Acceptance:** a privacy professional in the audience could reconstruct exactly what was redacted and why the reviewer only needed ~15 seconds — the panel *is* the argument.

### 3.4 Agent activity trail `[CLICK]`
A tab on the request detail. Chronological entries (fixtures §marcus.activity): every decision, system call, Teams message, redaction, and human sign-off; each entry = timestamp, actor (Agent / D. Okafor / A. Osei), one-line action, expandable grounding ("why"), and source chips. Filter chips by actor. Quiet, dense-but-airy audit register.

### 3.5 Generated report handoff `[CUE→STATIC]`
Final Act 3 beat: plan item 6 completes → a report card appears (cover thumbnail, "Access report — English (US) — 9 pages — generated to Meridian brand + tone guide") → presenter opens it → the real PDF (per `05`) in a viewer. Also reachable directly via presenter key 5.

---

## 4. Act 4 surfaces

### 4.1 Program dashboard `[CLICK]`
Top of /dashboard. **Lead element: an "AI summary" banner in the platform's own pattern** (see `reference/ai_posture_dashboard_pattern.png`): purple-tinted band, ✦ + `AI summary` label, one two-sentence digest with bolded key figures (recomputed per timeframe — e.g., at Since yesterday: "**47** requests came in. I fulfilled **39** end-to-end; **8** need you — the top one is a deadline risk on AR-4211."), action link right: `View needs-attention`. Below it, a timeframe segmented control (Today / Since yesterday / 7 days / 30 days) that **actually recomputes** every value from fixtures §history. Content (keep to exactly these — simplicity): 
- Four stat blocks with trend deltas vs. prior equivalent period: Requests received; Fulfilled end-to-end by agent (the hero number — "39, ▲ from 31" arc must emerge at the Since-yesterday/30-day views per fixtures); Median time to fulfill (trending down); Awaiting human (small, links to needs-attention).
- One slim trend chart: requests fulfilled by agent vs. requiring human, stacked area or bars over the timeframe.
- One compact distribution row: request type split + top jurisdictions as inline chips with counts.

Below it, the **request queue table** at deliberately reduced height (~35% of viewport): the familiar columns (ID, subject, type, jurisdiction, status, days left), fully sortable/filterable but visually subordinate. The shrunken queue is itself a talking point — do not let it creep back to full-page.

### 4.2 Needs-attention list `[CLICK]` with `[CUE]` resolves
A distinct panel (right rail or below-dashboard section — designer's choice, but visually separate from the queue): agent-raised items, each a card: reason line, request link, context sentence, confidence/deadline chip, and **one primary action**. Fixtures §attention provide 8 items; the two scripted ones:
1. Identity-match low confidence → action "Review match" opens a compact compare card (two candidate records, matching fields highlighted) → Approve → card resolves with a subtle check animation and the agent-resumed note.
2. Stalled warehouse extract (request 4211, 6 days open, deadline in 9, "reminded D. Okafor twice in Teams") → action "Escalate to manager" → resolves with escalation note.

**Acceptance:** timeframe switching is instant and every number visibly changes; resolving an attention card updates the "Awaiting human" stat live — the surfaces must feel like one live system, not separate screens.

---

## 5. Cross-cutting acceptance (the stage bar)

1. Full run-through Act 1→4 in under 9 minutes of wall time using only the cue map in `03` — timed, with no dead-ends requiring browser refresh.
2. Zero layout shift or flash during any beat transition.
3. Every string in the UI comes from `03`/`04` — no lorem, no placeholder, no "TODO".
4. A screen-recording of the golden path is producible from the app itself (it must be stable enough to record in one take).
