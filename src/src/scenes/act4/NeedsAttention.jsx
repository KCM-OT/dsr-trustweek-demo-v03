import { useEffect, useState } from 'react'
import { attention } from '../../data/fixtures'
import { AgentMark } from '../../components/AgentMark'

// Needs-attention list (build spec §4.2) — agent-raised items, visually
// distinct from the queue (cards, not table rows; each ✦-authored). All 9
// fixture items render (including a duplicate-request flag, id 9); the two
// scripted (identity-match compare→approve, and escalate) resolve live and
// call onResolve so the dashboard's "Awaiting human" stat ticks down —
// "one live system, not separate screens." Copy verbatim from fixtures
// §attention / 03_demo_script.md, aside from the added duplicate item.
//
// autoCompareId/autoCompareTrigger are set by DashboardScene's cue-driven
// beat 2 — when autoCompareTrigger increments, the card whose id matches
// autoCompareId opens its "Compare requests" modal automatically, the same
// way the card's own button does.

export function NeedsAttention({ onResolve, autoCompareId, autoCompareTrigger }) {
  return (
    <section id="needs-attention" style={{ marginTop: 'var(--space-8)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
        <AgentMark size={16} />
        <h2 style={{ font: 'var(--fs-section)', color: 'var(--ot-ink)' }}>Needs your attention</h2>
        <span style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)' }}>{attention.length} raised by the agent</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
        {attention.map((item) => (
          <AttentionCard
            key={item.id}
            item={item}
            onResolve={onResolve}
            autoCompareTrigger={item.id === autoCompareId ? autoCompareTrigger : 0}
          />
        ))}
      </div>
    </section>
  )
}

function AttentionCard({ item, onResolve, autoCompareTrigger }) {
  // 'open' → (identity match) 'reviewing' → 'resolved'; non-scripted items
  // stay 'open' (their action buttons are inert) EXCEPT kind:'duplicate',
  // which has its own live path: 'open' → 'comparing' (modal) → 'resolved',
  // with the resolve note depending on which modal action was chosen.
  const [phase, setPhase] = useState('open')
  const [resolveNote, setResolveNote] = useState(item.resolveNote)

  // Cue-driven auto-open — skips 0 so mount doesn't fire this before the
  // cue deck ever asks for it (same guard pattern as the flow chart's
  // agent-chat auto-ask trigger).
  useEffect(() => {
    if (!autoCompareTrigger) return
    setPhase('comparing')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCompareTrigger])

  function resolve(note) {
    if (note) setResolveNote(note)
    setPhase('resolved')
    onResolve(item.id)
  }

  const resolved = phase === 'resolved'

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-4)',
        paddingLeft: 'calc(var(--space-4) + 3px)',
        opacity: resolved ? 0.72 : 1,
        transition: 'opacity 200ms ease-out',
      }}
    >
      {/* left accent — agent purple (their raised item) */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          borderRadius: '3px 0 0 3px',
          background: resolved ? 'var(--ot-green)' : 'var(--ot-agent)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <AgentMark size={13} />
          <span style={{ font: '600 14px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>{item.title}</span>
        </div>
        <DeadlineChip kind={item.kind} />
      </div>

      <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-2)', marginTop: 6, lineHeight: 1.5 }}>
        <span style={{ color: 'var(--ot-link)', fontWeight: 600 }}>Request {item.request}</span>
        <span style={{ color: 'var(--ot-ink-3)' }}> · </span>
        {item.body}
      </div>

      {/* identity-match compare card (scripted spot-check) */}
      {phase === 'reviewing' && item.compare && <CompareCard compare={item.compare} />}

      <div style={{ marginTop: 'var(--space-3)' }}>
        {resolved ? (
          <ResolveNote note={resolveNote} />
        ) : phase === 'reviewing' ? (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <PrimaryAction label="Approve match" onClick={() => resolve()} />
            <QuietAction label="Not a match" />
          </div>
        ) : item.scripted ? (
          <PrimaryAction
            label={item.action}
            onClick={item.compare ? () => setPhase('reviewing') : () => resolve()}
          />
        ) : item.kind === 'duplicate' && item.duplicate ? (
          <PrimaryAction label={item.action} onClick={() => setPhase('comparing')} />
        ) : (
          // Non-scripted item — action present for authenticity, inert on stage.
          <QuietAction label={item.action} />
        )}
      </div>

      {/* duplicate-request comparison (live path, not tied to the rehearsed
          identity-match/escalate script) — modal, so it reads as a real
          decision point rather than another inline card. */}
      {phase === 'comparing' && item.duplicate && (
        <DuplicateModal
          request={item.request}
          duplicate={item.duplicate}
          onClose={() => setPhase('open')}
          onReject={() => resolve(item.rejectNote)}
          onKeep={() => resolve(item.keepNote)}
        />
      )}
    </div>
  )
}

// Duplicate-request comparison modal — side-by-side fields for both
// requests with matching fields (name/email/type) highlighted the same
// way CompareCard highlights the identity-match spot-check, plus the two
// outcomes a reviewer actually has: close this one as the duplicate, or
// clear the flag and let both proceed independently.
function DuplicateModal({ request, duplicate, onClose, onReject, onKeep }) {
  const matchOn = new Set(duplicate.matchOn)
  const ROWS = [
    { key: 'request', label: 'Request' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'type', label: 'Request type' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'status', label: 'Status' },
  ]

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 24, 29, 0.45)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 40,
        padding: 'var(--space-4)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Compare duplicate requests for ${request}`}
        onClick={(e) => e.stopPropagation()}
        className="anim-enter"
        style={{
          width: 560,
          maxWidth: '100%',
          background: 'var(--ot-surface)',
          border: '1px solid var(--ot-border)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-overlay)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--ot-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <AgentMark size={13} />
            <span style={{ font: '600 15px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>Possible duplicate request</span>
          </div>
          <p style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-2)', marginTop: 4 }}>
            {duplicate.a.request} matches {duplicate.b.request} on name, email, and request type.
          </p>
        </div>

        <div style={{ padding: 'var(--space-4)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '104px 1fr 1fr',
              border: '1px solid var(--ot-border)',
              borderRadius: 'var(--radius-control)',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            <Cell head />
            <Cell head>{duplicate.a.request}</Cell>
            <Cell head>{duplicate.b.request}</Cell>
            {ROWS.filter((r) => r.key !== 'request').map((r) => {
              const match = matchOn.has(r.key)
              return <FieldRow key={r.key} label={r.label} a={duplicate.a[r.key]} b={duplicate.b[r.key]} match={match} />
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', padding: 'var(--space-4)', borderTop: '1px solid var(--ot-border)' }}>
          <DangerAction label="Reject duplicate" onClick={onReject} />
          <QuietAction label="Remove duplicate flag" onClick={onKeep} />
        </div>
      </div>
    </div>
  )
}

// Deadline / severity chip — deadline-risk items read amber-urgent; the rest
// are informational (neutral). Derived from kind (implementation choice;
// fixtures tag every item severity:"warn").
function DeadlineChip({ kind }) {
  const urgent = kind === 'stalled'
  const label = urgent ? 'Deadline risk' : kind === 'duplicate' ? 'Possible duplicate' : 'Needs review'
  return (
    <span
      style={{
        flexShrink: 0,
        padding: '2px 9px',
        borderRadius: 'var(--radius-chip)',
        border: `1px solid ${urgent ? 'var(--ot-warn)' : 'var(--ot-border)'}`,
        background: urgent ? 'var(--ot-warn-tint)' : 'var(--ot-surface)',
        color: urgent ? 'var(--ot-warn)' : 'var(--ot-ink-3)',
        font: '600 11px "Open Sans", sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function CompareCard({ compare }) {
  const matchOn = new Set(compare.matchOn)
  const ROWS = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'lastOrder', label: 'Last order' },
  ]
  return (
    <div
      className="anim-enter"
      style={{
        marginTop: 'var(--space-3)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-control)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr 1fr' }}>
        <Cell head />
        <Cell head>Candidate A</Cell>
        <Cell head>Candidate B</Cell>
        {ROWS.map((r) => {
          const match = matchOn.has(r.key)
          return (
            <FieldRow key={r.key} label={r.label} a={compare.a[r.key]} b={compare.b[r.key]} match={match} />
          )
        })}
      </div>
    </div>
  )
}

function FieldRow({ label, a, b, match }) {
  const cellBg = match ? 'var(--ot-green-tint)' : 'transparent'
  const cellColor = match ? 'var(--ot-green)' : 'var(--ot-ink)'
  return (
    <>
      <Cell label>{label}</Cell>
      <Cell style={{ background: cellBg, color: cellColor, fontWeight: match ? 600 : 400 }}>{a}</Cell>
      <Cell style={{ background: cellBg, color: cellColor, fontWeight: match ? 600 : 400 }}>{b}</Cell>
    </>
  )
}

function Cell({ children, head, label, style }) {
  return (
    <div
      style={{
        padding: '7px 10px',
        borderBottom: '1px solid var(--ot-border)',
        borderRight: '1px solid var(--ot-border)',
        font: head ? '600 12px "Open Sans", sans-serif' : 'var(--fs-meta)',
        color: head ? 'var(--ot-ink-2)' : label ? 'var(--ot-ink-3)' : 'var(--ot-ink)',
        background: head ? 'var(--ot-bg)' : 'transparent',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function ResolveNote({ note }) {
  return (
    <div className="anim-enter" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ot-green)' }}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'var(--ot-green-tint)',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="var(--ot-green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path className="check-draw" d="M4 10.5l4 4 8-8.5" pathLength="1" />
        </svg>
      </span>
      <span style={{ font: '600 12.5px "Open Sans", sans-serif' }}>{note}</span>
    </div>
  )
}

function PrimaryAction({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 'var(--radius-control)',
        border: '1px solid var(--ot-agent)',
        background: 'var(--ot-agent-tint)',
        color: 'var(--ot-agent)',
        font: '600 13px "Open Sans", sans-serif',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function QuietAction({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 'var(--radius-control)',
        border: '1px solid var(--ot-border)',
        background: 'var(--ot-surface)',
        color: 'var(--ot-ink-2)',
        font: '600 13px "Open Sans", sans-serif',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function DangerAction({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 'var(--radius-control)',
        border: '1px solid var(--ot-danger)',
        background: 'var(--ot-danger-tint)',
        color: 'var(--ot-danger)',
        font: '600 13px "Open Sans", sans-serif',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}
