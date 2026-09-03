# Design System

## Source of truth
1. `src/styles/tokens.css`
2. `spec_pack/02_design_system.md`
3. Existing components and scene patterns
4. Exact Figma exports in `public/figma/`

Do not invent a parallel theme. Extend semantic variables only when an existing token cannot represent a required design.

## Typography
- Primary UI: Open Sans
- Supported core weights: 400 and 600; some recent exact Figma surfaces use 700 for compact card headings/labels
- Editorial report/proof moments: Georgia only
- Tokens:
  - `--fs-page-title`: 600 22px/1.3 Open Sans
  - `--fs-section`: 600 16px/1.3 Open Sans
  - `--fs-body`: 400 14px/1.5 Open Sans
  - `--fs-meta`: 400 12.5px/1.4 Open Sans

## OneTrust platform colors
- Top bar: `--ot-topbar` / `#0b0e11`
- Sidebar: `--ot-sidebar` / `#1f2a3b`
- Primary green: `--ot-green` / `#3d7a44`
- Agent purple: `--ot-agent` / `#7a5af8`
- Background: `--ot-bg` / `#f5f7f9`
- Surface: `--ot-surface` / `#ffffff`
- Border: `--ot-border` / `#e4e9ee`
- Main ink: `--ot-ink` / `#1f2933`
- Secondary ink: `--ot-ink-2` / `#52606d`
- Muted ink: `--ot-ink-3` / `#9aa5b1`
- Warning: `--ot-warn` / `#b45309`
- Danger: `--ot-danger` / `#c0392b`

## Brand palettes
Meridian corporate:
- Navy `#14304a`
- Copper `#c56a2d`
- Cream `#faf6f0`
- Ink `#22303c`

Northwind consumer:
- Pine `#1e4d3b`
- Sand `#efe9dc`
- Clay `#c56a2d`

Never place brand colors into OneTrust platform chrome or agent-state semantics.

## Spacing and shape
- Scale: 4, 8, 12, 16, 24, 32px (`--space-1` through `--space-8`)
- Platform card radius: 10px (`--radius-card`)
- Control radius: 8px (`--radius-control`)
- Pill radius: 999px (`--radius-chip`)
- Recent setup dashboard cards intentionally use exact 6px Figma corners and low soft shadow; preserve those values for that family.
- Overlay shadow: `0 8px 24px rgba(31, 41, 51, 0.1)`

## Semantic components
- `StatusPill`: workflow states; use semantic status colors rather than arbitrary badges
- `GroundingChip`: evidence/regulation grounding with blue tint
- `AgentMark`: AI-authored content marker
- Cards: white surface, subtle border or low elevation; avoid consumer-SaaS glass effects
- Agent messages: icon + authored text, no chat bubble
- Admin messages: compact right-aligned confirmation
- Tables and queues: dense enterprise information hierarchy

## Setup dashboard specifics
Exact exported icons in `public/figma/` are required.
- Main cards: 2-column responsive grid, 24px gap, max width 1200px
- Program Overview: 4 responsive cards, 16px gap
- Configurations: 6 responsive cards, 16px gap
- On beat 1+, these rows disappear and the 136px Privacy Agent header replaces the 108px Setup header.

## Motion
From `src/styles/motion.css`:
- `anim-enter`: 200ms ease-out fade + 6px rise with configurable stagger
- `agent-shimmer`: only while the agent is actively running
- `check-draw`: 150ms SVG path completion
- `typing-dot`: three-dot pulse while authored response is pending
- Honor `prefers-reduced-motion` patterns already present in global CSS.

## Layout hierarchy
1. Flexbox for one-dimensional composition
2. CSS grid for card rows, data matrices, and other true 2D layouts
3. Absolute positioning only for overlays/connectors or interactions that require it

## Accessibility
- Use semantic `header`, `main`, `nav`, `section`, `article`, and button elements.
- Decorative exports use empty alt text; meaningful imagery gets useful alt text.
- Keep labels connected to controls and preserve keyboard behavior.
- Do not remove focus visibility globally for user-facing flows without replacing it with an accessible focus treatment. The current presenter-machine reset is an inherited prototype constraint; improve carefully if converting to production.
