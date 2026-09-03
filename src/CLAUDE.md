# CLAUDE.md — DSR TrustWeek Prototype

## Mission
Continue this presentation-grade prototype of an AI-native Data Subject Rights workflow. Preserve the authored story, deterministic presenter controls, OneTrust visual language, and all existing interactions unless the user explicitly requests a change.

## Quick start
```bash
npm install
npm run dev
```
Open `http://localhost:5173`. Production check: `npm run build`.

## Technology
- React 18 + React Router 6
- Vite 5
- Plain CSS token system plus component-level inline styles
- No backend, authentication, database, analytics, or external runtime APIs
- All demo data is deterministic and stored in `src/data/fixtures.js`

## Product architecture
- `src/App.jsx`: router and cue provider
- `src/cue/`: deterministic presentation controller, beat registration, keyboard navigation, timeline metadata
- `src/shell/`: global app shell and navigation
- `src/scenes/`: route-owned story surfaces grouped by act
- `src/components/`: reusable prototype primitives
- `src/data/fixtures.js`: all tenant, request, task, and workflow data
- `src/styles/tokens.css`: design-system source of truth
- `src/styles/motion.css`, `brand.css`: global motion and brand overrides
- `spec_pack/`: original product, story, fixture, and acceptance specifications
- `report/`: report artifact source
- `public/figma/`: exact exported Figma icons used by setup dashboard cards

## Routes and story
1. `/setup` — Act 1 setup dashboard, then Privacy Agent conversation
2. `/setup/flow` — Act 1 generated process flow handoff
3. `/intake` — Act 2 consumer-facing Meridian intake agent (no OneTrust shell)
4. `/requests` — Act 3 request queue
5. `/requests/4207` — Act 3 request detail and reasoning
6. `/requests/4207/subtask` — Act 3 split-screen agent collaboration
7. `/requests/4207/redaction` — Act 3 redaction summary
8. `/dashboard` — Act 4 program dashboard
9. `/report` — Act 3/5 nine-page PDF-style report viewer
10. `/blank` — shell-free holding screen
11. `/reports`, `/subtasks`, `/settings` — authentic module placeholders
12. `/brand` — development-only brand proof sheet

The canonical cue order lives in `src/cue/prototypeTimeline.js`; route metadata and numeric shortcuts live in `src/scenes/sceneMap.js`. Number keys 1–6 jump to setup, intake, requests, dashboard, report, and holding respectively. ArrowRight/Space advance one beat; ArrowLeft goes back; Escape opens the cue overlay. The presenter navigator can jump directly to any beat.

## Interaction contract
- Every scene beat must be deterministic, cumulative where expected, and re-enterable.
- Returning to beat 0 must reset scene-local presenter state.
- Do not replace beat-driven choreography with random timers or nondeterministic data.
- Timed transitions must clean up timers in React effect cleanup functions.
- Setup beat 0 displays the main setup cards, Program Overview, and Configurations. Beat 1+ replaces the header with Privacy Agent breadcrumbs/header and hides all three dashboard rows.
- Setup beat 7 automatically hands off to `/setup/flow` after the closing line.
- Preserve keyboard controls and presenter-dock behavior when adding routes or beats.

## Design system rules
Read `docs/DESIGN_SYSTEM.md` and `src/styles/tokens.css` before visual work.
- Open Sans is the primary UI typeface; Georgia is reserved for editorial proof moments.
- Use semantic CSS variables instead of inventing colors.
- OneTrust green signals approvals/completion; agent purple signals AI-authored/action states; amber signals review.
- Motion is purposeful only: 200ms ease-out entrances, staggered status changes, 150ms check draws, and agent shimmer while actively running.
- Prefer flexbox, then grid for true two-dimensional rows. Avoid absolute positioning unless the existing interaction requires it.
- Preserve the dense enterprise visual register and accessibility semantics.
- Figma-exported icons under `public/figma` are authoritative for the setup dashboard.

## Content and data rules
- Dialogue is authored and should remain verbatim unless copy changes are requested.
- Do not introduce lorem ipsum, fake integrations, live API calls, or uncontrolled timestamps.
- Update `src/data/fixtures.js` for shared data instead of duplicating values across scenes.
- Keep the fictional tenant and request details internally consistent.

## Coding expectations
- Follow existing React patterns before introducing dependencies.
- Do not use localStorage for state persistence.
- Keep route-level scenes composed from smaller local or shared components.
- Preserve accessibility: semantic landmarks, button elements for actions, labels, focus states, reduced-motion support, and useful image alt text.
- Avoid broad refactors during targeted visual changes.
- After any visible change, run `npm run build` and manually smoke-test affected beats at desktop and narrow widths.

## Known environment note
This project was migrated from a v0/hosted-proxy environment to local Claude Code development. The original `vite.config.js` hardcoded HMR to `wss` on `clientPort: 443` to survive that hosted proxy — that setting has been removed since dev now runs on plain local `http://localhost:5173`. If this project is ever redeployed behind a proxy that mangles the HMR WebSocket URL, reintroduce an explicit `server.hmr` block matching that proxy's scheme/port.

## Documentation map
- `docs/ARCHITECTURE.md` — runtime and file relationships
- `docs/INTERACTIONS.md` — routes, beats, choreography, and test paths
- `docs/DESIGN_SYSTEM.md` — tokens, typography, components, and motion
- `docs/CONTINUATION_GUIDE.md` — practical workflow for extending the prototype
- `docs/HANDOFF_MANIFEST.md` — package inventory and exclusions
- `spec_pack/` — original source specifications
- `PROGRESS.md` — prior implementation log

## Before changing anything
1. Read this file and the relevant focused guide.
2. Trace the route, cue registration, fixture values, and existing styles.
3. Inspect every matching implementation, not only the first search result.
4. Make the smallest cohesive change.
5. Build and exercise the affected presenter path.
6. Update documentation only when behavior, architecture, or conventions change.
