import { queue } from '../data/fixtures'
import { StatusPill } from '../components/StatusPill'
import { ChevronRightIcon, ColumnsIcon, RefreshIcon, FilterIcon, SearchIcon } from './icons'

// Queue-page grammar — 02_design_system.md §1, matched against
// spec_pack/reference/pra_request_queue.png: saved-view box, items/filters
// count block, green filter button, uppercase outlined stage pills. Renders
// real fixtures.queue data. This is shell-level chrome, not Act 4 scene
// content — the dashboard's stat blocks, trend chart, and needs-attention
// panel are still Session 4's job (01_build_spec.md §4).
export function QueueTable() {
  return (
    <div style={{ background: 'var(--ot-surface)', border: '1px solid var(--ot-border)', borderRadius: 'var(--radius-card)' }}>
      <Toolbar />
      <Table />
    </div>
  )
}

function Toolbar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px var(--space-4)',
        borderBottom: '1px solid var(--ot-border)',
        background: 'var(--ot-bg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' }}>
        <span style={{ font: 'var(--fs-body)', color: 'var(--ot-ink)' }}>All requests</span>
        <ChevronRightIcon width={14} height={14} color="var(--ot-ink-3)" />
        <span style={{ borderLeft: '1px solid var(--ot-border)', marginLeft: 8, paddingLeft: 12 }}>
          <div style={{ font: 'var(--fs-body)', color: 'var(--ot-ink)' }}>{queue.length} Items</div>
          <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)' }}>0 Filters applied</div>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            border: '1px solid var(--ot-border)',
            borderRadius: 'var(--radius-control)',
            background: 'var(--ot-surface)',
            color: 'var(--ot-ink-3)',
          }}
        >
          <SearchIcon width={16} height={16} />
          <span style={{ font: 'var(--fs-meta)' }}>Search</span>
        </div>
        <IconButton>
          <ColumnsIcon width={18} height={18} />
        </IconButton>
        <IconButton>
          <RefreshIcon width={18} height={18} />
        </IconButton>
        <span
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-control)',
            background: 'var(--ot-green)',
            color: '#fff',
          }}
        >
          <FilterIcon width={16} height={16} />
        </span>
      </div>
    </div>
  )
}

function IconButton({ children }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 'var(--radius-control)',
        border: '1px solid var(--ot-border)',
        color: 'var(--ot-ink-2)',
      }}
    >
      {children}
    </span>
  )
}

const COLUMNS = ['ID', 'Subject', 'Type', 'Jurisdiction', 'Status', 'Days left']

function Table() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {COLUMNS.map((col) => (
            <th
              key={col}
              style={{
                textAlign: 'left',
                padding: '10px var(--space-4)',
                font: '600 12.5px "Open Sans", sans-serif',
                color: 'var(--ot-ink-2)',
                borderBottom: '1px solid var(--ot-border)',
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {queue.map((row) => (
          <tr key={row.id} style={{ height: 44 }}>
            <td style={cellStyle}>
              <span style={{ color: 'var(--ot-link)', font: 'var(--fs-body)' }}>{row.id}</span>
            </td>
            <td style={cellStyle}>{row.subject}</td>
            <td style={cellStyle}>{row.type}</td>
            <td style={cellStyle}>{row.jurisdiction}</td>
            <td style={cellStyle}>
              <StagePill status={row.status} />
            </td>
            <td style={{ ...cellStyle, color: row.daysLeft < 0 ? 'var(--ot-danger)' : 'var(--ot-ink)' }}>
              {row.daysLeft}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const cellStyle = {
  padding: '0 var(--space-4)',
  borderBottom: '1px solid var(--ot-border)',
  font: 'var(--fs-body)',
  color: 'var(--ot-ink)',
}

// The pill grammar moved to the canonical shared component in Session 2
// (src/components/StatusPill.jsx) — same rendering, single source of truth.
export function StagePill({ status }) {
  return <StatusPill status={status} />
}
