# Claude Code Continuation Guide

## Environment setup
Requirements: Node.js 18+ and npm.

```bash
unzip claude-code-dsr-prototype.zip
cd claude-code-dsr-prototype
npm install
npm run dev
```

Other commands:
```bash
npm run build
npm run preview
```

No environment variables or external integrations are required.

## Recommended first prompt to Claude Code
> Read CLAUDE.md, docs/ARCHITECTURE.md, docs/INTERACTIONS.md, docs/DESIGN_SYSTEM.md, src/scenes/sceneMap.js, and src/cue/prototypeTimeline.js. Then inspect the specific scene and fixtures involved in my request before proposing changes. Preserve deterministic beats, presenter controls, existing design tokens, and authored dialogue.

## Workflow for adding or changing a beat
1. Locate the route in `src/scenes/sceneMap.js`.
2. Locate the same scene in `src/cue/prototypeTimeline.js` and its scene-local `BEATS` array.
3. Read the entire scene component and every imported local component involved.
4. Check `src/data/fixtures.js` before adding data.
5. Add behavior as a deterministic `beat === n` or `beat >= n` transition.
6. Reset any scene-local state at beat 0.
7. Clean up every timer in its effect.
8. Keep beat labels consistent across timeline and scene registration.
9. Build and test forward, backward, direct-jump, and reset behavior.

## Workflow for Figma-driven changes
1. Fetch/read the exact Figma node rather than relying on memory.
2. List exact colors, type, spacing, dimensions, and exported assets.
3. Reuse assets under `public/figma`; copy new exports there with descriptive names.
4. Prefer semantic tokens where they match; use exact scoped values when Figma intentionally differs.
5. Compare at the target viewport and verify narrow-width behavior.
6. Do not replace exact supplied assets with generic icon-library approximations.

## Workflow for changing shared data
1. Update `src/data/fixtures.js`.
2. Search all usages of the old value.
3. Verify request queue, detail, collaboration, redaction, dashboard, and report stay consistent.
4. Avoid fetching or generating values at runtime; this is a deterministic prototype.

## Testing checklist
- `npm run build` passes.
- No console errors.
- Initial route redirects to `/setup`.
- Arrow/Space/number/Escape controls work.
- Direct cue jumps show the same state as sequential traversal.
- Beat 0 resets local state.
- Auto-navigation and status timers do not duplicate after repeated entry.
- Shell-free scenes remain shell-free.
- Setup initial rows hide at beat 1 and restore at beat 0.
- Desktop target is strong around 1260×966; also inspect a narrow mobile-like width.

## Known caveats
- This is a Vite prototype, not Next.js.
- Inline styles are used intentionally in high-fidelity scene surfaces; do not refactor them broadly without a visual regression pass.
- `vite.config.js` contains explicit HMR protocol/ports to keep hosted preview WebSocket URLs valid. Local development works with it; if your environment has a conflicting port, adjust only after checking emitted `/@vite/client` values.
- `components/ui/` may contain supporting primitives from earlier iterations; application source of truth is under `src/` unless imported by current code.
- `PROGRESS.md` is historical and may include superseded implementation notes; current code and CLAUDE.md take precedence.

## Packaging/deployment
- Vercel: `npm run build` outputs `dist`; `vercel.json` is included.
- Firebase configuration is included for historical deployment support.
- Do not commit `node_modules` or `dist`.
