import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCue, useSceneBeats } from '../../cue/CueContext'
import { AgentMark } from '../../components/AgentMark'
import { QueueTable } from '../../shell/QueueTable'
import { PageHeader, PageBody, PageAction } from '../../shell/PageHeader'
import { queue } from '../../data/fixtures'
import {
  TIMEFRAMES,
  DEFAULT_TIMEFRAME,
  statsFor,
  digestFor,
  requestTypeShare,
  topJurisdictions,
} from '../../data/dashboard'
import { TrendChart } from './TrendChart'
import { NeedsAttention } from './NeedsAttention'
import { REPORT_PAGES } from '../ReportScene'

// Program dashboard (Act 4 · build spec §4.1). Lead element is the AI-summary
// banner in the platform's own posture-dashboard pattern; a timeframe
// segmented control recomputes every value from fixtures §history; four stat
// blocks; one trend chart; a compact distribution row; and the deliberately
// subordinated request queue (~35% viewport). Below it, the needs-attention
// list (§4.2). This is mostly a [CLICK] surface (rehearsal card: Act 4 =
// 0 cues + 4 clicks), but it registers two further cue-driven beats: beat 1
// scrolls down to reveal the needs-attention section (the same scroll the
// AI-summary banner's "View needs-attention" link and the "Awaiting human"
// stat block already trigger on click, just fired on advance instead of a
// manual click), and beat 2 opens the "Compare requests" modal for the
// duplicate data-deletion request (DR-4215, fixtures id 3) — the same modal
// its own action button opens, triggered here so advancing the cue deck
// demonstrates the duplicate-review flow without the presenter driving it
// by hand. Number key 4 still lands on beat 0.

const BEATS = ['Dashboard overview', 'Needs your attention', 'Compare duplicate request']
const DUPLICATE_COMPARE_ITEM_ID = 3

export function DashboardScene() {
  const navigate = useNavigate()
  // ← steps back across the act boundary to the report viewer at its LAST
  // page (the state that handed off here), mirroring every other scene
  // hand-off — without it the report→dashboard advance was the one
  // irreversible press in the walk. Key 4 remains the hard reset.
  const beat = useSceneBeats('dashboard', 'Program dashboard', BEATS, null, () =>
    navigate('/report', { state: { beat: REPORT_PAGES.length - 1 } })
  )
  const { sceneId } = useCue()

  // autoCompareCount increments each time beat 2 is entered via the cue
  // deck, telling NeedsAttention to open the compare-requests modal for
  // DUPLICATE_COMPARE_ITEM_ID — guarded on sceneId (not just beat) since
  // `beat` still holds the PREVIOUS scene's leftover index for one render
  // right after a cross-scene navigation into this one.
  const [autoCompareCount, setAutoCompareCount] = useState(0)

  useEffect(() => {
    if (sceneId !== 'dashboard') return
    if (beat === 1 || beat === 2) {
      document.getElementById('needs-attention')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (beat === 2) setAutoCompareCount((n) => n + 1)
  }, [beat, sceneId])

  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME)
  // Resolving a needs-attention card ticks the live "Awaiting human" stat
  // down (§4.2 "resolving an attention card updates the stat live").
  const [resolvedIds, setResolvedIds] = useState(() => new Set())

  const stats = statsFor(timeframe)
  const awaitingLive = Math.max(0, stats.awaiting - resolvedIds.size)

  function handleResolve(id) {
    setResolvedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  function scrollToAttention() {
    document.getElementById('needs-attention')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your privacy request program at a glance — throughput, fulfilment, and what needs a human."
        actions={<PageAction>Create request</PageAction>}
      />

      <PageBody>
        <AISummaryBanner timeframe={timeframe} stats={stats} awaiting={awaitingLive} onViewAttention={scrollToAttention} />

        <TimeframeControl value={timeframe} onChange={setTimeframe} />

        <StatRow stats={stats} awaiting={awaitingLive} onAwaitingClick={scrollToAttention} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 1fr)',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-4)',
            alignItems: 'start',
          }}
        >
          <Card>
            <TrendChart data={stats.chart} />
          </Card>
          <Card>
            <Distribution />
          </Card>
        </div>

        <QueueSection />

        <NeedsAttention
          onResolve={handleResolve}
          autoCompareId={DUPLICATE_COMPARE_ITEM_ID}
          autoCompareTrigger={autoCompareCount}
        />
      </PageBody>
    </div>
  )
}

// --- AI summary banner (02 §1 AI design language; posture pattern) ----------

function AISummaryBanner({ stats, awaiting, onViewAttention }) {
  const tokens = digestFor(stats.key, { ...stats, awaiting })
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        padding: 'var(--space-4) var(--space-6)',
        background: 'linear-gradient(180deg, var(--ot-agent-tint), #f7f5ff)',
        border: '1px solid #e4dcfb',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <AgentMark size={15} />
          <span style={{ font: '600 13px "Open Sans", sans-serif', color: 'var(--ot-agent)' }}>AI summary</span>
        </div>
        <p style={{ font: '400 15px/1.55 "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>
          {tokens.map((tok, i) =>
            tok.b ? (
              <strong key={i} style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {tok.t}
              </strong>
            ) : (
              <span key={i}>{tok.t}</span>
            )
          )}
        </p>
      </div>
      <button
        onClick={onViewAttention}
        style={{
          flexShrink: 0,
          padding: '6px 4px',
          border: 'none',
          background: 'transparent',
          color: 'var(--ot-link)',
          font: '600 13px "Open Sans", sans-serif',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        View needs-attention
      </button>
    </div>
  )
}

// --- Timeframe segmented control --------------------------------------------

function TimeframeControl({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Timeframe"
      style={{
        display: 'inline-flex',
        gap: 2,
        marginTop: 'var(--space-6)',
        padding: 3,
        background: 'var(--ot-bg)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-control)',
      }}
    >
      {TIMEFRAMES.map((tf) => {
        const active = tf.key === value
        return (
          <button
            key={tf.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tf.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: active ? '1px solid var(--ot-border)' : '1px solid transparent',
              background: active ? 'var(--ot-surface)' : 'transparent',
              color: active ? 'var(--ot-ink)' : 'var(--ot-ink-2)',
              font: active ? '600 13px "Open Sans", sans-serif' : '400 13px "Open Sans", sans-serif',
              cursor: 'pointer',
              boxShadow: active ? '0 1px 2px rgba(31,41,51,0.08)' : 'none',
            }}
          >
            {tf.label}
          </button>
        )
      })}
    </div>
  )
}

// --- Stat blocks (02 §1 metric blocks; no legacy bottom color bars) ---------

function StatRow({ stats, awaiting, onAwaitingClick }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 'var(--space-4)',
        marginTop: 'var(--space-4)',
      }}
    >
      <StatBlock label="Requests received" value={stats.received} delta={stats.receivedDelta} tone="neutral" />
      <StatBlock label="Fulfilled end-to-end by agent" value={stats.fulfilled} delta={stats.fulfilledDelta} tone="good" hero />
      <StatBlock label="Median time to fulfil" value={stats.median} unit="days" delta={stats.medianDelta} tone="good" />
      <StatBlock label="Awaiting human" value={awaiting} tone="warn" small onClick={onAwaitingClick} />
    </div>
  )
}

function StatBlock({ label, value, unit, delta, tone, hero, small, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-4) var(--space-6)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 18 }}>
        {hero && <AgentMark size={13} />}
        <span style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-2)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
        <span style={{ font: '600 32px/1 "Open Sans", sans-serif', color: 'var(--ot-ink)', fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </span>
        {unit && <span style={{ font: 'var(--fs-body)', color: 'var(--ot-ink-3)' }}>{unit}</span>}
      </div>
      <div style={{ marginTop: 10, minHeight: 18 }}>
        {onClick && !delta ? (
          <span style={{ font: 'var(--fs-meta)', color: 'var(--ot-link)', fontWeight: 600 }}>View needs-attention →</span>
        ) : (
          <Delta delta={delta} tone={tone} />
        )}
      </div>
    </div>
  )
}

function Delta({ delta, tone }) {
  if (!delta) return null
  const up = delta.dir === 'up'
  const color = tone === 'good' ? 'var(--ot-green)' : tone === 'bad' ? 'var(--ot-danger)' : 'var(--ot-ink-2)'
  const text = delta.text || `${delta.pct}%`
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: '400 12.5px "Open Sans", sans-serif' }}>
      <Triangle dir={up ? 'up' : 'down'} color={color} />
      <span style={{ color, fontWeight: 600 }}>{text}</span>
      {delta.basis && <span style={{ color: 'var(--ot-ink-3)' }}>{delta.basis}</span>}
    </span>
  )
}

function Triangle({ dir, color }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
      <path d={dir === 'up' ? 'M4 1 L7.2 6.5 L0.8 6.5 Z' : 'M4 7 L7.2 1.5 L0.8 1.5 Z'} fill={color} />
    </svg>
  )
}

// --- Distribution row (request-type split + top jurisdictions) --------------

const TYPE_LABELS = { access: 'Access', deletion: 'Deletion', optOut: 'Opt-Out', correction: 'Correction' }

function Distribution() {
  const types = Object.entries(requestTypeShare)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-2)', marginBottom: 8 }}>Request types</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {types.map(([k, v]) => (
            <Chip key={k} label={TYPE_LABELS[k] || k} value={`${Math.round(v * 100)}%`} />
          ))}
        </div>
      </div>
      <div>
        <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-2)', marginBottom: 8 }}>Top jurisdictions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {topJurisdictions.map(([name, count]) => (
            <Chip key={name} label={name} value={count} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Chip({ label, value }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 'var(--radius-chip)',
        border: '1px solid var(--ot-border)',
        background: 'var(--ot-bg)',
        font: 'var(--fs-meta)',
        color: 'var(--ot-ink)',
      }}
    >
      {label}
      <span style={{ color: 'var(--ot-ink-2)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </span>
  )
}

// --- Subordinated queue (~35% viewport) -------------------------------------

function QueueSection() {
  return (
    <div style={{ marginTop: 'var(--space-8)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 'var(--space-3)' }}>
        <h2 style={{ font: 'var(--fs-section)', color: 'var(--ot-ink)' }}>Request queue</h2>
        <span style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)' }}>{queue.length} items</span>
      </div>
      {/* Deliberately reduced height — the shrunken queue is itself the
          talking point (§4.1). Rows scroll inside; it must not creep back
          to full-page. */}
      <div style={{ maxHeight: '35vh', overflow: 'auto', borderRadius: 'var(--radius-card)' }}>
        <QueueTable />
      </div>
    </div>
  )
}

function Card({ children }) {
  return (
    <div
      style={{
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-6)',
      }}
    >
      {children}
    </div>
  )
}
