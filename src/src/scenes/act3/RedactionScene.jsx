import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { marcus } from '../../data/fixtures'
import { useCue, useSceneBeats } from '../../cue/CueContext'
import { useDemoState } from '../../state/DemoStateContext'
import { ConfidenceMeter } from '../../components/ConfidenceMeter'
import { AgentMark } from '../../components/AgentMark'
import { formatDate, formatDateTime } from './format'

// Redaction summary — build spec §3.3. The privacy reviewer's sign-off
// surface, a first-class panel: findings table (fixtures §marcus.redaction),
// excerpt viewer with inline black-bar redactions, Approve & sign off /
// Return to agent with note. A privacy professional should be able to
// reconstruct exactly what was redacted and why the reviewer only needed
// ~15 seconds — the panel is the argument. Copy verbatim from
// 03_demo_script.md; the final Act 3 cue lands the report-ready card (§3.5).

const BEATS = ['Redaction summary — awaiting sign-off', 'Report ready card appears']

// Sign-off line values come from the fixture activity entry
// (osei · Privacy sign-off), not invented: Jul 10, 2:31 PM.
const signOffTs = marcus.activity.find((e) => e.actor === 'osei').ts

export function RedactionScene() {
  const navigate = useNavigate()
  // ← on beat 0 returns to the split screen at its sync beat (how this
  // scene was entered); → past the report-ready card continues to /report,
  // keeping the whole golden path walkable on the cue keys.
  const beat = useSceneBeats(
    'request-redaction',
    'Redaction summary',
    BEATS,
    () => navigate('/report'),
    () => navigate('/requests/4207/subtask', { state: { beat: 5 } })
  )
  const { redactionApproved, approveRedaction } = useDemoState()
  const [openCategory, setOpenCategory] = useState(null)

  // Entered with a requested beat (the report viewer's back-exit returns
  // here at beat 1, the report-ready state) — same pattern as the split
  // screen and request detail.
  const location = useLocation()
  const { jumpToBeat } = useCue()
  useEffect(() => {
    if (typeof location.state?.beat === 'number') jumpToBeat(location.state.beat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: 'var(--space-6) var(--space-8)', maxWidth: 980 }}>
      <div style={{ font: 'var(--fs-meta)', marginBottom: 'var(--space-2)' }}>
        <Link to="/requests/4207" style={{ color: 'var(--ot-link)', textDecoration: 'none' }}>
          Requests
        </Link>
        <span style={{ color: 'var(--ot-ink-3)' }}> › {marcus.requestId}</span>
      </div>

      <h1 style={{ font: 'var(--fs-page-title)', marginBottom: 'var(--space-2)' }}>
        Redaction complete — awaiting your sign-off
      </h1>
      <p
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          font: 'var(--fs-body)',
          color: 'var(--ot-ink-2)',
          marginBottom: 'var(--space-6)',
          maxWidth: 760,
        }}
      >
        <AgentMark size={13} style={{ alignSelf: 'center' }} />
        <span>
          Source: {marcus.redaction.source} included in the access package. I redacted other people's personal
          information per SOP §4.2. Review my work below.
        </span>
      </p>

      <FindingsTable openCategory={openCategory} onToggle={setOpenCategory} />

      <SignOffFooter approved={redactionApproved} onApprove={approveRedaction} />

      {beat >= 1 && <ReportReadyCard onOpen={() => navigate('/report')} />}
    </div>
  )
}

// --- Findings table -------------------------------------------------------------

function FindingsTable({ openCategory, onToggle }) {
  const findings = marcus.redaction.findings
  return (
    <div
      style={{
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Category', 'Instances', 'Confidence', ''].map((col, i) => (
              <th
                key={col || 'link'}
                style={{
                  textAlign: i === 1 ? 'right' : 'left',
                  padding: '10px var(--space-4)',
                  font: '600 12.5px "Open Sans", sans-serif',
                  color: 'var(--ot-ink-2)',
                  borderBottom: '1px solid var(--ot-border)',
                  background: 'var(--ot-bg)',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {findings.map((f) => {
            const excerpts = marcus.redaction.excerpts.filter((e) => e.findingCategory === f.category)
            const open = openCategory === f.category
            return (
              <Row
                key={f.category}
                finding={f}
                excerpts={excerpts}
                open={open}
                onToggle={() => onToggle(open ? null : f.category)}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Row({ finding, excerpts, open, onToggle }) {
  const hasExcerpts = excerpts.length > 0
  const cell = {
    padding: '14px var(--space-4)',
    borderBottom: '1px solid var(--ot-border)',
    font: 'var(--fs-body)',
    color: 'var(--ot-ink)',
    verticalAlign: 'top',
  }
  return (
    <>
      <tr
        onClick={hasExcerpts ? onToggle : undefined}
        style={{ cursor: hasExcerpts ? 'pointer' : 'default', background: open ? 'var(--ot-bg)' : 'transparent' }}
      >
        <td style={cell}>
          <div style={{ fontWeight: 600 }}>{finding.category}</div>
          {finding.note && (
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 6,
                marginTop: 6,
                font: 'var(--fs-meta)',
                color: 'var(--ot-ink-2)',
                maxWidth: 520,
              }}
            >
              <AgentMark size={11} style={{ alignSelf: 'center' }} />
              <span>{finding.note}</span>
            </div>
          )}
        </td>
        <td style={{ ...cell, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{finding.instances}</td>
        <td style={cell}>
          <ConfidenceMeter level={finding.confidence} />
        </td>
        <td style={{ ...cell, textAlign: 'right' }}>
          {hasExcerpts && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              style={{
                border: 'none',
                background: 'none',
                padding: 0,
                font: '600 13px "Open Sans", sans-serif',
                color: 'var(--ot-link)',
                cursor: 'pointer',
              }}
            >
              View excerpts
            </button>
          )}
        </td>
      </tr>
      {open &&
        excerpts.map((e) => (
          <tr key={e.ticket}>
            <td colSpan={4} style={{ padding: 0, borderBottom: '1px solid var(--ot-border)' }}>
              <Excerpt excerpt={e} />
            </td>
          </tr>
        ))}
    </>
  )
}

// Redacted transcript excerpt — the fixture text carries the redaction runs
// as █ characters; each run renders as one continuous black bar.
function Excerpt({ excerpt }) {
  return (
    <div className="anim-enter" style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--ot-bg)' }}>
      <div style={{ font: '600 12.5px "Open Sans", sans-serif', color: 'var(--ot-ink-2)', marginBottom: 8 }}>
        {excerpt.ticket} · {formatDate(excerpt.date, { withYear: true })}
      </div>
      <div
        style={{
          background: 'var(--ot-surface)',
          border: '1px solid var(--ot-border)',
          borderRadius: 'var(--radius-control)',
          padding: 'var(--space-4)',
          font: '400 13.5px/1.7 "Open Sans", sans-serif',
          color: 'var(--ot-ink)',
          maxWidth: 720,
        }}
      >
        {renderRedacted(excerpt.text)}
      </div>
    </div>
  )
}

function renderRedacted(text) {
  return text.split(/(█+)/).map((chunk, i) =>
    chunk.startsWith('█') ? (
      <span
        key={i}
        style={{ background: '#16191d', color: 'transparent', borderRadius: 2, userSelect: 'none' }}
        aria-label="redacted"
      >
        {chunk}
      </span>
    ) : (
      <span key={i}>{chunk}</span>
    )
  )
}

// --- Footer: sign-off -------------------------------------------------------------

function SignOffFooter({ approved, onApprove }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        marginTop: 'var(--space-4)',
        padding: 'var(--space-4)',
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        minHeight: 68,
      }}
    >
      {approved ? (
        <span
          className="anim-enter"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 14px "Open Sans", sans-serif', color: 'var(--ot-green)' }}
        >
          Privacy sign-off · Amara Osei · {formatDateTime(signOffTs)}
        </span>
      ) : (
        <>
          <button
            onClick={onApprove}
            style={{
              padding: '9px 18px',
              borderRadius: 'var(--radius-control)',
              border: 'none',
              background: 'var(--ot-green)',
              color: '#fff',
              font: '600 14px "Open Sans", sans-serif',
              cursor: 'pointer',
            }}
          >
            Approve &amp; sign off
          </button>
          <button
            style={{
              padding: '9px 4px',
              borderRadius: 'var(--radius-control)',
              border: 'none',
              background: 'none',
              color: 'var(--ot-ink-2)',
              font: '400 14px "Open Sans", sans-serif',
              cursor: 'pointer',
            }}
          >
            Return to agent with note
          </button>
        </>
      )}
    </div>
  )
}

// --- Report ready card (final Act 3 cue, build spec §3.5) ---------------------------

function ReportReadyCard({ onOpen }) {
  return (
    <div
      className="anim-enter"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        marginTop: 'var(--space-4)',
        padding: 'var(--space-4)',
        background: 'var(--ot-agent-tint)',
        border: '1px solid var(--ot-agent)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      {/* Cover thumbnail — Meridian navy with the copper meridian rule */}
      <span
        aria-hidden="true"
        style={{
          width: 46,
          height: 60,
          flexShrink: 0,
          borderRadius: 4,
          background: 'var(--mer-navy)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
        }}
      >
        <span style={{ font: '600 6px "Open Sans", sans-serif', letterSpacing: 1.2, color: 'var(--mer-cream)' }}>
          MERIDIAN
        </span>
        <span style={{ width: 24, height: 2, background: 'var(--mer-copper)' }} />
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '600 15px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>
          <AgentMark size={14} />
          Access report for Marcus Bell
        </div>
        <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-2)', marginTop: 4 }}>
          English (US) · 9 pages · Generated to Meridian brand + tone guide · All six sources included · Redactions
          applied
        </div>
      </div>

      <button
        onClick={onOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '9px 16px',
          borderRadius: 'var(--radius-control)',
          border: 'none',
          background: 'var(--ot-agent)',
          color: '#fff',
          font: '600 14px "Open Sans", sans-serif',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <AgentMark size={13} color="#fff" />
        Open report
      </button>
    </div>
  )
}
