// The ✦ agent authorship marker — 02_design_system.md §1: a four-pointed
// sparkle in --ot-agent before any agent-authored line or card title.
// Rendered as inline SVG (tech constraints: no emoji/dingbat glyphs), so
// it stays crisp and color-controllable at any size.

export function AgentMark({ size = 14, color = 'var(--ot-agent)', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ flexShrink: 0, verticalAlign: '-0.12em', ...style }}
    >
      <path d="M8 0.8 C8.8 4.4, 11.6 7.2, 15.2 8 C11.6 8.8, 8.8 11.6, 8 15.2 C7.2 11.6, 4.4 8.8, 0.8 8 C4.4 7.2, 7.2 4.4, 8 0.8 Z" fill={color} />
    </svg>
  )
}
