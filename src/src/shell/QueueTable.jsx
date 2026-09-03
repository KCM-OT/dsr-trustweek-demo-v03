import { queue } from '../data/fixtures'
import { StatusPill } from '../components/StatusPill'
import { ChevronDownIcon, ColumnsIcon, RefreshIcon, SearchIcon, KebabIcon } from './icons'

// Request queue table — Figma frame 318:11834. The table is intentionally
// flat and wide: saved view + actions above, filter row beneath, 48px cells,
// and the six-column request data grid.
export function QueueTable() {
  return (
    <div style={{ background: 'var(--ot-surface)', overflow: 'hidden' }}>
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
        flexDirection: 'column',
        gap: 8,
        minHeight: 80,
        padding: '0 24px 8px',
        justifyContent: 'center',
        background: 'var(--ot-bg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 32,
            padding: '0 8px',
            border: 'none',
            borderRadius: 4,
            background: '#edf3ee',
            color: '#1a1a1a',
            font: '400 16px/24px "Open Sans", sans-serif',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 24, lineHeight: 1 }}>☰</span>
          All Requests
          <ChevronDownIcon width={20} height={20} color="#4d4d4d" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: 270,
              height: 32,
              boxSizing: 'border-box',
              padding: '0 12px',
              border: '1px solid #a9a9a9',
              borderRadius: 4,
              background: '#fff',
              color: '#767676',
              font: '400 16px/22px "Open Sans", sans-serif',
            }}
          >
            <SearchIcon width={16} height={16} />
            Search...
          </div>
          <IconButton label="Select columns"><ColumnsIcon width={16} height={16} /></IconButton>
          <IconButton label="Refresh"><RefreshIcon width={16} height={16} /></IconButton>
          <IconButton label="More"><KebabIcon width={16} height={16} /></IconButton>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 8px',
            border: 'none',
            background: 'transparent',
            color: '#2c6145',
            font: '600 14px/20px "Open Sans", sans-serif',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 24, lineHeight: 1 }}>+</span>
          Add filter
        </button>
      </div>
    </div>
  )
}

function IconButton({ children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        padding: 8,
        border: 'none',
        borderRadius: 4,
        background: 'transparent',
        color: '#4d4d4d',
      }}
    >
      {children}
    </button>
  )
}

const COLUMNS = [
  { key: 'id', label: 'Request ID' },
  { key: 'subject', label: 'Data Subject' },
  { key: 'type', label: 'Request Type' },
  { key: 'jurisdiction', label: 'Jurisdiction' },
  { key: 'status', label: 'Stage' },
  { key: 'daysLeft', label: 'Days left' },
]

function Table() {
  return (
    <div style={{ overflowX: 'auto', padding: 0 }}>
      <table style={{ width: '100%', minWidth: 860, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '18%' }} />
          <col style={{ width: '16%' }} />
          <col style={{ width: '17%' }} />
          <col style={{ width: '18%' }} />
          <col style={{ width: '19%' }} />
          <col style={{ width: '12%' }} />
        </colgroup>
        <thead>
          <tr style={{ background: '#f8f8f8' }}>
            {COLUMNS.map((col) => (
              <th key={col.key} style={headerCellStyle}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {queue.map((row) => (
            <tr key={row.id} style={{ height: 48 }}>
              <td style={{ ...cellStyle, color: '#1470a9', fontWeight: 600 }}>{row.id}</td>
              <td style={cellStyle}>{row.subject}</td>
              <td style={cellStyle}>{row.type}</td>
              <td style={cellStyle}>{row.jurisdiction}</td>
              <td style={cellStyle}><StagePill status={row.status} /></td>
              <td style={{ ...cellStyle, color: row.daysLeft < 0 ? 'var(--ot-danger)' : '#4d4d4d' }}>{row.daysLeft} days</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const headerCellStyle = {
  height: 48,
  padding: '0 8px',
  textAlign: 'left',
  border: 'none',
  color: '#1a1a1a',
  font: '700 14px/20px "Open Sans", sans-serif',
}

const cellStyle = {
  height: 48,
  padding: '0 8px',
  borderBottom: '1px solid #cccccc',
  color: '#4d4d4d',
  font: '400 14px/20px "Open Sans", sans-serif',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export function StagePill({ status }) {
  return <StatusPill status={status} />
}

export default QueueTable
