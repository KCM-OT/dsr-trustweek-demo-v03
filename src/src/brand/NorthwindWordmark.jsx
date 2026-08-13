// Northwind Outfitters wordmark — 02_design_system.md §2: pine wordmark
// with a minimal NW chevron/compass tick, nothing illustrative. The tick is
// a two-tone compass needle pointing northwest (copper head — the family's
// shared accent — pine tail). The two text lines are flush-justified to the
// same width (textLength), the classic outfitter lockup.

const W = 236
const H = 44

export function NorthwindWordmark({ height = 40, color = 'var(--nw-pine)', accent = 'var(--nw-clay)', style }) {
  return (
    <svg
      width={(height / H) * W}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Northwind Outfitters"
      style={{ display: 'block', ...style }}
    >
      {/* NW compass tick: needle on the northwest diagonal, copper head / pine tail */}
      <polygon points="7,7 22,16 16,22" fill={accent} />
      <polygon points="31,31 22,16 16,22" fill={color} />
      <text
        x="50"
        y="24"
        textLength="180"
        lengthAdjust="spacing"
        style={{ fontFamily: 'var(--mer-font)', fontWeight: 600, fontSize: 21, fill: color }}
      >
        NORTHWIND
      </text>
      <text
        x="50"
        y="39"
        textLength="180"
        lengthAdjust="spacing"
        style={{ fontFamily: 'var(--mer-font)', fontWeight: 500, fontSize: 10.5, fill: color, opacity: 0.72 }}
      >
        OUTFITTERS
      </text>
    </svg>
  )
}
