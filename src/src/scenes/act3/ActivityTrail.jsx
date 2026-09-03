import { useState } from 'react'
import { marcus } from '../../data/fixtures'
import { AgentMark } from '../../components/AgentMark'
import { GroundingChip } from '../../components/GroundingChip'
import { formatDateTime } from './format'

// Agent activity trail — build spec §3.4. A tab on the request detail:
// chronological fixture entries (marcus.activity), each timestamp · actor ·
// one-line action · source chips, with actor filter chips. Keeps the real
// Activity tab's entry rhythm (02_design_system.md §1) in a quiet,
// dense-but-airy audit register. Grounding renders as the chips themselves —
// the fixtures carry no separate "why" text, and copy can't be invented.

const ACTORS = { agent: 'Agent', okafor: 'D. Okafor', osei: 'A. Osei' }
const FILTERS = ['All', ...Object.values(ACTORS)]

export function ActivityTrail() {
  const [filter, setFilter] = useState('All')
  const entries = marcus.activity.filter((e) => filter === 'All' || ACTORS[e.actor] === filter)

  return (
    <div
      style={{
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--ot-border)',
        }}
      >
        {FILTERS.map((f) => {
          const active = f === filter
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-chip)',
                border: `1px solid ${active ? 'var(--ot-ink)' : 'var(--ot-border)'}`,
                background: active ? 'var(--ot-ink)' : 'var(--ot-surface)',
                color: active ? '#fff' : 'var(--ot-ink-2)',
                font: '600 12.5px "Open Sans", sans-serif',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          )
        })}
      </div>

      <div>
        {entries.map((e, i) => (
          <div
            key={`${e.ts}-${i}`}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--space-3)',
              padding: '11px var(--space-4)',
              borderBottom: i < entries.length - 1 ? '1px solid var(--ot-border)' : 'none',
            }}
          >
            <span
              style={{
                width: 118,
                flexShrink: 0,
                font: 'var(--fs-meta)',
                color: 'var(--ot-ink-3)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatDateTime(e.ts)}
            </span>
            <span
              style={{
                width: 86,
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                font: '600 13px "Open Sans", sans-serif',
                color: 'var(--ot-ink)',
              }}
            >
              {e.actor === 'agent' && <AgentMark size={12} />}
              {ACTORS[e.actor] || e.actor}
            </span>
            <span style={{ flex: 1, font: 'var(--fs-body)', color: 'var(--ot-ink-2)' }}>{e.action}</span>
            <span style={{ display: 'inline-flex', gap: 6, flexShrink: 0 }}>
              {(e.chips || []).map((c) => (
                <GroundingChip key={c} label={c} />
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
