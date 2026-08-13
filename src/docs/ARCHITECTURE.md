# Architecture

## Overview
Single-page React application built with Vite. It is a scripted, deterministic product prototype for an AI-native Data Subject Rights (DSR) workflow. There is no backend; every value is fixture-driven and every animation is authored for a live presentation.

## Runtime composition
- `index.html` mounts `src/main.jsx`, which renders `src/App.jsx`.
- `App.jsx` wraps the app in `CueProvider` (presentation state) and `DemoStateProvider` (shared demo mutations), then renders `CueLayer`.
- `CueLayer` calls `useCueKeyboard()` for global keyboard control and defines all routes.
- Shell scenes render inside `AppShell` (OneTrust chrome); standalone scenes (`/intake`, `/blank`) render without chrome for brand separation.

## Directory map
- `src/App.jsx` — router, providers, and shell/standalone component wiring
- `src/main.jsx` — React entry point and global CSS imports
- `src/cue/` — presentation engine
  - `CueContext.jsx` — cue state, `advance`/`back`/`jumpToBeat`/`jumpToNumberKey`, scene beat registration
  - `useCueKeyboard.js` — global key bindings (Arrow/Space/number/Escape)
  - `prototypeTimeline.js` — canonical ordered list of scenes and beats
  - `CueOverlay.jsx`, `PrototypeNavigator.jsx` — presenter overlay and dock
- `src/scenes/` — one component per route, grouped by act (`act1`, `act3`, `act4`) plus top-level scenes
  - `sceneMap.js` — routes, nav labels, number keys, nav ordering
- `src/shell/` — `AppShell`, sidebar/topbar, and shared icon set
- `src/components/` — reusable primitives (status pills, grounding chips, agent mark, etc.)
- `src/brand/` — Meridian/Northwind brand assets and dev brand proof
- `src/state/` — `DemoStateContext` for cross-scene demo mutations
- `src/data/fixtures.js` — all tenant, request, task, workflow, and report data
- `src/styles/` — `tokens.css` (design system), `app.css`, `shell.css`, `motion.css`, `flow.css`
- `public/figma/` — exact exported Figma icons for setup dashboard cards
- `spec_pack/` — original build spec, design system, demo script, fixtures, and acceptance notes
- `report/` — report artifact source

## Presentation engine
`prototypeTimeline.js` flattens scenes into an ordered `PROTOTYPE_TIMELINE` of `{ sceneId, beatIndex, beatLabel, route, ... }`. `CueContext` tracks the active timeline index and exposes navigation. A scene registers its beats via `useSceneBeats(sceneId, label, beats)` and receives the current beat number, which it uses to reveal cumulative content and trigger choreography.

Key invariants:
- Beats are ordered and, within a scene, generally cumulative (content grows).
- Every beat is re-enterable; scene-local presenter state resets when returning to beat 0.
- Some beats auto-advance via timed `navigate()` (for example, setup beat 7 → `/setup/flow`). Timers must be cleared in effect cleanup.

## Styling model
Two token systems coexist and must never blend:
- OneTrust platform chrome and agent surfaces (`--ot-*`, `--ot-agent*`).
- Brand contexts: Meridian (`--mer-*`) and Northwind (`--nw-*`).
Global CSS holds shared resets, layout, and motion utilities; individual scene components frequently use inline styles for precise, Figma-matched surfaces.

## Constraints
- No network calls, backend, database, or authentication.
- No localStorage-based persistence.
- Deterministic data and timing only.
- Accessibility is intentional: semantic landmarks, real buttons, labels, and reduced-motion friendliness.
