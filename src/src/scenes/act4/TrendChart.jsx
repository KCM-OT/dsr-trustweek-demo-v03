// The dashboard's one chart (spec §4.1 / §3 data-viz rules): requests
// fulfilled by agent vs requiring human, stacked bars over the timeframe.
// Agent-fulfilled = --ot-agent; human-involved = --ot-ink-3. Hairline
// horizontal gridlines only, 12.5px --ot-ink-3 axis text, tabular figures.
// Inline SVG, no chart library (tech constraints).

const W = 720
const H = 210
const PAD = { top: 12, right: 8, bottom: 26, left: 30 }

function monthDay(iso) {
  const [, m, d] = iso.split('-').map(Number)
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${MONTHS[m - 1]} ${d}`
}

function niceMax(v) {
  // round up to a clean 10 for calm gridlines
  return Math.ceil(v / 10) * 10
}

export function TrendChart({ data }) {
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const maxVal = niceMax(Math.max(...data.map((d) => d.agentFulfilled + d.humanInvolved), 10))

  const n = data.length
  const slot = plotW / n
  const barW = Math.min(26, slot * 0.62)
  const y = (v) => PAD.top + plotH - (v / maxVal) * plotH

  // Three gridlines: 0, mid, max.
  const ticks = [0, maxVal / 2, maxVal]

  // X labels: first, last, and a middle one when the series is long enough,
  // so the axis never crowds.
  const labelIdx = new Set([0, n - 1])
  if (n >= 10) labelIdx.add(Math.floor((n - 1) / 2))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <div style={{ font: 'var(--fs-section)', color: 'var(--ot-ink)' }}>Fulfilment trend</div>
        <Legend />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Requests fulfilled by agent versus requiring human, over time" style={{ display: 'block' }}>
        {/* gridlines + y labels */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--ot-border)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y(t) + 3.5} textAnchor="end" style={axisText}>
              {t}
            </text>
          </g>
        ))}

        {/* stacked bars: agent-fulfilled (bottom, purple) + human (top, gray) */}
        {data.map((d, i) => {
          const cx = PAD.left + slot * i + slot / 2
          const x = cx - barW / 2
          const agentH = (d.agentFulfilled / maxVal) * plotH
          const humanH = (d.humanInvolved / maxVal) * plotH
          const agentY = PAD.top + plotH - agentH
          const humanY = agentY - humanH
          return (
            <g key={d.date}>
              <rect x={x} y={agentY} width={barW} height={agentH} fill="var(--ot-agent)" rx="1.5">
                <title>{`${monthDay(d.date)} · ${d.agentFulfilled} agent-fulfilled`}</title>
              </rect>
              <rect x={x} y={humanY} width={barW} height={humanH} fill="var(--ot-ink-3)" rx="1.5">
                <title>{`${monthDay(d.date)} · ${d.humanInvolved} needed human`}</title>
              </rect>
            </g>
          )
        })}

        {/* x labels */}
        {data.map((d, i) =>
          labelIdx.has(i) ? (
            <text key={d.date} x={PAD.left + slot * i + slot / 2} y={H - 8} textAnchor="middle" style={axisText}>
              {monthDay(d.date)}
            </text>
          ) : null
        )}
      </svg>
    </div>
  )
}

const axisText = {
  font: '400 12.5px "Open Sans", sans-serif',
  fill: 'var(--ot-ink-3)',
  fontVariantNumeric: 'tabular-nums',
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', font: 'var(--fs-meta)', color: 'var(--ot-ink-2)' }}>
      <Swatch color="var(--ot-agent)" label="Agent-fulfilled" />
      <Swatch color="var(--ot-ink-3)" label="Needed human" />
    </div>
  )
}

function Swatch({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      {label}
    </span>
  )
}
