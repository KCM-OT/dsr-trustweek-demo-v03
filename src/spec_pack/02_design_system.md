# 02 — Design System

Two visual systems coexist in the demo: the **future OneTrust shell** (all admin surfaces) and the **Meridian brand** (the consumer intake agent in Act 2 and the PDF report). They must never blend: the intake agent has zero OneTrust DNA; the admin shell shows Meridian only as data (brand names, tiles).

Overriding directive: **simplicity and visual taste.** The future product should feel like today's OneTrust after a confident redesign — recognizably the same family (audiences are current customers; familiarity is trust), but calmer, more spacious, more premium.

---

## 1. Future OneTrust shell

**Reference screenshots are authoritative** — see `reference/`: `pra_request_queue.png` and `pra_request_detail.png` (**the actual Privacy Rights Automation module we're reimagining — the two most important references**), `shell_module_sidebar_table.png` (platform chrome, another module's sidebar + table), `app_launcher_mega_menu.png` (app launcher overlay), `ai_posture_dashboard_pattern.png` (OneTrust's emerging AI design language — purple agent affordances, AI summary banner, donut + trend charts). **View these images before building any shell component.** The rule: the *chrome* (top bar, sidebar, table grammar) stays faithful to today's platform so the demo feels at home in OneTrust; the *future* lives in the content area (agent surfaces) and follows the AI language of the posture dashboard. Grounded shell, futuristic content.

### Privacy Rights Automation module specifics (from `pra_request_queue.png` / `pra_request_detail.png`)

- **Sidebar items (real — use exactly these):** `Dashboard` · `Reports` · `Requests` · `Subtasks` · `Setup ›` · `Settings`, under the module title `Privacy Rights Automation`. Our scenes map onto them: Setup → the agent setup conversation (/setup); the consumer intake agent needs no nav item (it's outside the admin app). Active item = darker row + white text + thin left accent, per screenshot.
- **Queue page grammar:** header `Requests` + gray description + green `Create request` + kebab. Toolbar: saved-view box (`All requests ›`) · `N Items / N Filters applied` count block · right: search, column icon, refresh icon, green filter button. **Stage pills here are UPPERCASE and outlined:** `NEW` (amber outline) · `IN PROGRESS` (blue outline) · `REJECTED` (red outline). Negative `Days left` renders in red. IDs are blue-link alphanumerics. Row selection = light blue tint; kebab at row end on hover.
- **Request detail skeleton (keep this skeleton for our request detail — it's what makes Act 3 feel native):** breadcrumb `Requests › {ID}` · page title `Data subject request details` + stage pill · outlined `Results summary` button + kebab top-right · **left metadata rail** (stacked label/value pairs with edit pencils: language, workflow, approver, org, dates, deadline, resolution…) · main content area · **tabs with green underline** (`ID verification · Subtasks · Activity · History` today). The **blue chevron stage bar** (NEW → VERIFYING IDENTITY → IN PROGRESS → COMPLETE, with `Advance`) is the legacy element **our agent plan visually replaces** — same slot on the page, new content; that substitution is itself the demo's before/after. In our version the metadata rail swaps `Workflow: Ryan Workflow` for `✦ Fulfilled by Privacy Agent` — a one-line detail the audience will catch.
- **Activity tab grammar:** Public/Internal toggle, composer with rich-text toolbar, entries as actor + action + timestamp with a stage pill at right. Our agent activity trail keeps this entry rhythm (actor · action · timestamp · chips) so it reads as the same product grown up.

### Platform chrome (imitate the screenshots)

- **Top bar:** near-black (`#0B0E11`), full width, 56–64px. Left: waffle app-launcher icon (present but inert — do NOT build the mega menu; if clicked, nothing) + OneTrust-style mark and wordmark in white (approximate the register; don't reproduce the actual logo asset). Right: search icon · notification bell with small red count badge · tenant switcher `Meridian Brands ⌄` · settings gear · circular initial avatar `AO` (muted maroon). **Omit "Ask Copilot"** — the demo has one AI entry point (the Privacy Agent in the content area) and a second AI button in the chrome muddies the story on stage.
- **Module sidebar:** dark navy (`#1F2A3B`), ~280px, white/gray text. Top: module title `Privacy Rights Automation` in small caps-ish 14px. Items with 20px outline icons, **exactly the real module's items:** `Dashboard` · `Reports` · `Requests` · `Subtasks` · `Setup ›` · `Settings`. Active item: darker row background + white text + thin left accent (match `pra_request_queue.png`). Hairline separators between item groups. (`Reports` and `Subtasks` route to simple placeholder scenes — present for authenticity, not part of the demo path.)
- **Page header pattern:** large page title (22–24px/600, ink) + one-line gray description + primary action button top-right.
- **Primary buttons are GREEN, filled** (`--ot-green`, white text, radius 6–8px) — e.g. `Launch assessment` in the reference. Blue is for links and selected states, not primary CTAs. Secondary buttons: white, hairline border.

### Table grammar (imitate `shell_module_sidebar_table.png`)

Toolbar row: saved-view dropdown (`Default view ⌄`) left, then `+ Add filter`; right side: search input + column-selector icon + export icon. Rows: leading checkbox + kebab (`⋯`) menu · record names as **blue links** (`#2B6CD4`) · empty values as `- - - - -` dashes (never blank) · initial avatars as colored circles (navy, purple, teal rotation) beside person names · footer pagination `Showing 1–10 of N items`. Row height ~52px, hairline row borders, no zebra.

**Status pills, two registers (as in the platform):** in-progress states = **outlined** pill (blue outline, blue text); terminal states = **tinted** pill (green tint bg for Completed); `Not started` = outlined gray. Extend the same grammar for our agent states: `Agent fulfilling` = outlined purple · `Awaiting human` = outlined amber · `Complete` = tinted green · `Overdue` = tinted red.

### AI design language (imitate `ai_posture_dashboard_pattern.png`)

This screenshot is OneTrust's own AI-era direction — align with it:
- **Agent purple:** `--ot-agent: #7A5AF8` (matching their posture-agent purple family), tint `#F1EDFE`. Agent-action buttons: filled purple with a ✦ sparkle glyph (their pattern) — used ONLY for agent-related actions; green remains the general primary.
- **AI summary banner:** light purple tinted band with ✦ + label (`AI summary`), body text with **bolded key figures**, action link right-aligned. **Our Act 4 morning digest adopts exactly this pattern** — it reads as native OneTrust because it is.
- **Charts:** donut with center figure + legend; line/area trend chart with light fill; both minimal, light gridlines. Our dashboard trend chart follows this register (purple series for agent-fulfilled instead of their blue).
- **Tabs:** underline style (active = dark underline + 600 weight), used on detail surfaces (our request detail: `Plan · Activity · Request`).

### Tokens

```css
/* Chrome */
--ot-topbar:  #0B0E11;  --ot-sidebar: #1F2A3B;  --ot-sidebar-ink: #C7D0DA;
/* Color */
--ot-green:   #3D7A44;  /* filled primary buttons (Launch assessment green) */
--ot-green-tint: #E7F2E9;
--ot-link:    #2B6CD4;  /* record links, outlined in-progress pills */
--ot-ink:     #1F2933;  --ot-ink-2: #52606D;  --ot-ink-3: #9AA5B1;
--ot-bg:      #F5F7F9;  --ot-surface: #FFFFFF;  --ot-border: #E4E9EE;
--ot-agent:   #7A5AF8;  --ot-agent-tint: #F1EDFE;  /* agent everything; ✦ glyph */
--ot-warn:    #B45309;  --ot-warn-tint: #FDF3E7;
--ot-danger:  #C0392B;  --ot-danger-tint: #FBEDEB;
/* Type — Open Sans, weights 400/600. Sizes: page 22px, section 16px, body 14px, meta 12.5px min. */
/* Shape: cards radius 10, controls 8, pills 999. Hairline 1px borders; one soft shadow tier for overlays only. */
```

### Component grammar (carried forward, restyled to the above)

- **Grounding/source chips:** tiny bordered chips — `CCPA §1798.110` (blue tint) · `SOP §4.2` / `Data flow diagram` / `Brand + Tone Guide` (green tint). 12.5px, always look clickable.
- **Agent authorship marker:** the ✦ sparkle in `--ot-agent` before any agent-authored line or card title (consistent with the platform's own AI affordances). Used everywhere, it becomes the legend-free "the agent did this."
- **Confidence meter (redaction):** 5-segment meter + word. High = green 4–5, Medium = amber 3, Low = red 2.
- **Metric blocks (dashboard):** white cards, 32px/600 number (tabular figures), gray label, trend-delta chip. Bottom-edge color bars are legacy — drop them; the posture dashboard doesn't use them.
- **Choreography motion:** 200ms ease-out transitions; active agent work = subtle purple shimmer bar; completion = 150ms check-draw. Nothing animates at rest.

### The flow chart (Act 1 capstone) visual spec

Calm n8n: horizontal left→right, nodes 180×64 rounded-10 white cards with hairline border; agent-automated nodes get a 3px purple left bar + spark glyph; human-gate nodes a warn left bar + person glyph. Connectors: 1.5px `--ot-ink-3` curved paths, arrowless (dots at junctions). Branch lanes labeled with type chips (Access / Deletion / Correction / Opt-Out). Focus interaction: selected lane at full opacity centered; others 25% opacity and vertically compressed. Background `--ot-bg` with a barely-visible dot grid (the one permitted n8n-ism).

---

## 2. Meridian brand (fictional — we own it)

**Company:** Meridian Brands — parent of three consumer brands. The demo's consumer surface uses the flagship: **Northwind Outfitters** (outdoor apparel & gear). Others (data only): **Cascade Home** (housewares), **Alpine Rewards** (the shared loyalty program).

```css
/* Meridian corporate (PDF report, parent-brand contexts) */
--mer-navy:   #14304A;  /* primary */
--mer-copper: #C56A2D;  /* accent */
--mer-cream:  #FAF6F0;  /* backgrounds */
--mer-ink:    #22303C;
/* Northwind Outfitters (intake agent) */
--nw-pine:    #1E4D3B;  /* primary */
--nw-sand:    #EFE9DC;  /* background */
--nw-clay:    #C56A2D;  /* shared copper accent ties the family together */
```

**Type:** headings — a geometric-warm sans (Outfit or Sora via bundled font files; pick one, use everywhere Meridian); body — system sans is fine at this fidelity. Generous letter-spacing on the wordmark.

**Logo:** wordmark-first. "MERIDIAN" in navy with a copper horizontal rule through the E's crossbar (a meridian line) — simple enough to draw as SVG in one sitting. Northwind: "Northwind Outfitters" wordmark in pine with a minimal NW chevron/compass tick. Do not attempt illustrative logos.

**Intake agent register (Act 2):** warm, premium-outdoors: sand background, white card, pine headings, copper primary button ("Continue"), rounded-12 cards, one tasteful brand touch max (a thin topographic-line footer motif is approved; nothing else decorative). The assistant slot: a quiet bordered strip, pine icon, placeholder "Questions about your request? Ask here." Answers render inside the strip — never a floating chat widget.

**Voice (drives all Meridian-facing copy, incl. the PDF):** plain, warm, direct; second person; short sentences; no legalese in body text (legal precision lives in labeled sections); loyalty program always by name, "Alpine Rewards."

---

## 3. Data-visualization rules (dashboard)

One chart on the dashboard, no more. Colors: agent-fulfilled = `--ot-agent` tint fill/solid line; human-involved = `--ot-ink-3`. Axis text 12.5px `--ot-ink-3`; hairline gridlines, horizontal only. Deltas always show direction + comparison basis ("▲ 26% vs prior 30 days"). Numbers in metric blocks use tabular figures.

---

## 4. Teams & ServiceNow mockups — imitate vs. suggest

These must be pixel-credible to daily users without being asset-perfect clones.

**Teams (imitate):** overall geometry — dark-neutral left app rail (icons only), white chat canvas, chat header with avatar + name + presence dot, left-aligned received bubbles (light gray) / right-aligned sent (light purple-blue), timestamps in small gray, the compose bar at bottom, file attachments as bordered chips with a file-type icon. **Suggest only:** exact icons, exact purple hue, fonts — approximate; do not import Microsoft assets or logos. Agent participant: "Meridian Privacy Agent" with a purple spark avatar (our marker, and honest — it reads as a bot).

**ServiceNow (imitate):** a compact ticket strip/card: ticket number `SNOW-88412` in mono-ish type, state pill (Open → Resolved), short-description line, assignment group, and a one-line work-notes entry that appears on resolve. Gray/blue enterprise register, dense, slightly boring — that boringness *is* the credibility. **Suggest only:** branding; a neutral "ITSM" label is fine, the audience will read it as ServiceNow from the grammar. (Decision: presenter says "ServiceNow" aloud; the UI says the ticket number and looks the part — safest on trademarks while fully legible.)

---

## 5. What tasteful means here (tie-breakers)

- One accent per surface doing the talking (purple on admin agent surfaces, copper on Meridian).
- Whitespace over dividers; dividers over boxes; boxes over shadows.
- Every number gets a label and a comparison or it doesn't appear.
- If an element needs a tooltip to be understood on stage, redesign or cut it.
- Motion only where state changes; nothing animates at rest except the `Running` bar.
