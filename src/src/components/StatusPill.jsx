// Status pills, two registers — 02_design_system.md §1: in-progress states
// are OUTLINED (color border + color text, transparent bg); terminal states
// are TINTED (tint bg, no border). Uppercase 600/11px, radius 999 — the
// exact rendering the queue table established in Session 1b. Agent-state
// extensions per spec: Agent fulfilling = outlined purple · Awaiting human
// = outlined amber · Complete = tinted green · Overdue = tinted red.
// This is the canonical pill for every session; QueueTable's StagePill
// delegates here.

const OUTLINED = (color) => ({ border: color, color, bg: 'transparent' })
const TINTED = (color, tint) => ({ border: 'transparent', color, bg: tint })

const STATUS_STYLES = {
  // Agent grammar (our extensions)
  'Agent fulfilling': OUTLINED('var(--ot-agent)'),
  Running: OUTLINED('var(--ot-agent)'),
  'Awaiting human': OUTLINED('var(--ot-warn)'),
  Complete: TINTED('var(--ot-green)', 'var(--ot-green-tint)'),
  Done: TINTED('var(--ot-green)', 'var(--ot-green-tint)'),
  Resolved: TINTED('var(--ot-green)', 'var(--ot-green-tint)'),
  Completed: TINTED('var(--ot-green)', 'var(--ot-green-tint)'),
  Overdue: TINTED('var(--ot-danger)', 'var(--ot-danger-tint)'),
  // Integration provisioning (Act 1 CUE 6) — same two-register grammar:
  // in-flight outlined, terminal tinted.
  Pending: OUTLINED('var(--ot-ink-3)'),
  Configuring: OUTLINED('var(--ot-agent)'),
  Connected: TINTED('var(--ot-green)', 'var(--ot-green-tint)'),
  // Platform grammar (from the reference screenshots)
  New: OUTLINED('var(--ot-warn)'),
  'In progress': OUTLINED('var(--ot-link)'),
  Open: OUTLINED('var(--ot-link)'),
  Rejected: OUTLINED('var(--ot-danger)'),
  Planned: OUTLINED('var(--ot-ink-3)'),
  'Not started': OUTLINED('var(--ot-ink-3)'),
}

const FALLBACK = { border: 'var(--ot-ink-3)', color: 'var(--ot-ink-2)', bg: 'transparent' }

export function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || FALLBACK
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 'var(--radius-chip)',
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        font: '600 11px "Open Sans", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}
