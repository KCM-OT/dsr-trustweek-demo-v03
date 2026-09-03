// Meridian corporate wordmark — 02_design_system.md §2: wordmark-first,
// "MERIDIAN" in navy with a copper horizontal rule through the E's crossbar
// (a meridian line). The rule spans the full lockup and passes BEHIND the
// letterforms, surfacing in the tracking gaps and overhanging both ends, so
// it reads as a map meridian that the E's crossbar sits on — nothing
// illustrative. textLength pins the letter layout so the crossbar alignment
// is deterministic once the bundled Outfit face loads.

const W = 320
const H = 40
const RULE_Y = 21.4 // tuned to Outfit 600's cap-E crossbar at font-size 27

export function MeridianWordmark({ height = 32, color = 'var(--mer-navy)', rule = 'var(--mer-copper)', style }) {
  return (
    <svg
      width={(height / H) * W}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Meridian Brands"
      style={{ display: 'block', ...style }}
    >
      <line x1="0" y1={RULE_Y} x2={W} y2={RULE_Y} stroke={rule} strokeWidth="2" />
      <text
        x={W / 2}
        y="30.5"
        textAnchor="middle"
        textLength="272"
        lengthAdjust="spacing"
        style={{ fontFamily: 'var(--mer-font)', fontWeight: 600, fontSize: 27, fill: color }}
      >
        MERIDIAN
      </text>
    </svg>
  )
}
