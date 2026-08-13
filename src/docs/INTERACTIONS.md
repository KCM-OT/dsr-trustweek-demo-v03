# Interaction and Choreography Guide

## Global presenter controls
- `ArrowRight` or `Space`: advance one beat
- `ArrowLeft`: go back one beat
- `Escape`: open/close cue overlay
- `1`: `/setup`
- `2`: `/intake`
- `3`: `/requests`
- `4`: `/dashboard`
- `5`: `/report`
- `6`: `/blank`
- Presenter navigator: direct scene/beat selection
- Keyboard shortcuts are ignored while typing in an input, textarea, or contenteditable element.

## Act 1 — `/setup`
Beat 0 is the initial setup dashboard:
- Initial `Setup` header
- Main cards: Privacy Agent (recommended) and manual setup
- Program Overview row (4 cards)
- Configurations row (6 cards)

Clicking either setup CTA or advancing to beat 1:
- Replaces the initial header with `Setup › Privacy Agent`, title, and AI-assisted configuration description.
- Hides all three initial dashboard sections.
- Shows greeting + researched profile card.
- Breadcrumb `Setup` button jumps back to beat 0.

Beats:
0. Initial state
1. Greeting + profile card; Austria can be removed
2. Document request
3. Uploaded documents appear
4. Decomposed operating playbook
5. Four branded intake agents; Northwind preview can open/close
6. Systems/integrations request; admin reply and provisioning statuses appear on staggered timers
7. Closing line; automatically navigates to `/setup/flow` after about 2.2 seconds

## Act 1 capstone — `/setup/flow`
Interactive generated process flow. It supports the review/handoff story and can return to setup at the intended beat. Consult `src/scenes/act1/FlowChartScene.jsx` and `src/styles/flow.css` before modifying nodes or connectors.

## Act 2 — `/intake`
Standalone Northwind/Meridian consumer-facing intake; intentionally no OneTrust shell. Beats progressively demonstrate autofill, assistant conversation, California guidance, and submission. Keep parent-brand and consumer-brand tokens separated from platform chrome.

## Act 3 — request operations
- `/requests`: queue entry point and selection
- `/requests/4207`: plan and three reasoning surfaces, then completion of items 1–4
- `/requests/4207/subtask`: split-screen collaboration across OneTrust, Teams, and ServiceNow; includes human question/agent answer, extraction, and synchronized statuses
- `/requests/4207/redaction`: privacy sign-off and final report-ready state

All request identity, task, source, and regulatory details come from `src/data/fixtures.js`. Do not duplicate or drift these values.

## Report — `/report`
Nine authored pages:
1. Cover
2. A letter, not a form
3. What we collect and why
4. Sources, purposes, sharing
5. Profile & accounts
6. Alpine Rewards history
7. Orders & transactions
8. Marketing & support history
9. What you can do next

## Timing conventions
Defined in `src/styles/motion.css` and scene effects:
- Entrance: 200ms ease-out fade/6px rise
- Typing indicator: about 800ms before an agent message lands
- Status flips: generally staggered 400–700ms
- Progress steps: generally 600–900ms
- Check draw: 150ms
- Active agent work only: purple shimmer; nothing animates at rest

## Smoke-test path
1. Open `/setup`, verify all 12 initial cards (2 + 4 + 6) and initial header.
2. Click `Start with privacy agent`; verify Privacy Agent header, greeting/profile, and disappearance of all initial rows.
3. Advance through setup beats; test Austria removal and Northwind preview.
4. Verify automatic handoff to flow chart.
5. Use number keys 2–6 and verify each scene opens.
6. Traverse request-detail/subtask/redaction beats and confirm cumulative status changes.
7. Traverse all nine report pages.
8. Use Escape overlay and direct beat jumps; verify state remains deterministic.
