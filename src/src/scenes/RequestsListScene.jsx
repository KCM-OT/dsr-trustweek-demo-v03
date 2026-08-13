import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { queue } from '../data/fixtures'
import { StatusPill } from '../components/StatusPill'
import { useSceneBeats, useCue } from '../cue/CueContext'

// Augment queue items with spam/bot detection and duplicate detection
function augmentQueueWithSpamDetection(queueData, rejectedIds = new Set()) {
  const augmented = queueData.map((item, idx) => ({
    ...item,
    isSpam: idx % 4 === 0 || idx % 5 === 2,
    riskScore: idx % 4 === 0 ? 95 : idx % 5 === 2 ? 78 : 12,
  }))

  // Detect duplicates: only mark specific indices as duplicates (2 pairs)
  const duplicateIds = new Set()
  // Mark indices 0 and 5 as duplicates (first pair)
  duplicateIds.add(augmented[0].id)
  duplicateIds.add(augmented[5].id)
  // Mark indices 8 and 11 as duplicates (second pair)
  duplicateIds.add(augmented[8].id)
  duplicateIds.add(augmented[11].id)

  return augmented.map((item) => ({
    ...item,
    isDuplicate: duplicateIds.has(item.id),
    status: rejectedIds.has(item.id) ? 'Rejected' : item.riskScore >= 80 ? 'Awaiting human' : item.status,
  }))
}

export function RequestsListScene() {
  const beatIndex = useSceneBeats('requests-list', 'Requests queue', [
    'Request table loaded',
    'Agent panel opens',
    'Analyzing incoming requests',
    'Duplicate request identified',
    'Rejecting duplicate request',
  ])
  const { advance } = useCue()

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'ArrowRight' || e.key === ' ') && beatIndex === 4) {
        advance()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [beatIndex, advance])

  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [actionModal, setActionModal] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [rejectedIds, setRejectedIds] = useState(new Set())
  const [showAutomationPrompt, setShowAutomationPrompt] = useState(false)
  const [rejectedDuplicateCount, setRejectedDuplicateCount] = useState(0)

  const augmentedQueue = augmentQueueWithSpamDetection(queue, rejectedIds)
  const filteredQueue = showFlaggedOnly ? augmentedQueue.filter((item) => item.isSpam) : augmentedQueue
  const flaggedCount = augmentedQueue.filter((item) => item.isSpam).length

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredQueue.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredQueue.map((item) => item.id)))
    }
  }

  const handleSelectHighRisk = () => {
    const highRiskIds = filteredQueue.filter((item) => item.riskScore >= 80).map((item) => item.id)
    const allHighRiskSelected = highRiskIds.length > 0 && highRiskIds.every((id) => selectedIds.has(id))

    if (allHighRiskSelected) {
      const newSelected = new Set(selectedIds)
      highRiskIds.forEach((id) => newSelected.delete(id))
      setSelectedIds(newSelected)
    } else {
      const newSelected = new Set(selectedIds)
      highRiskIds.forEach((id) => newSelected.add(id))
      setSelectedIds(newSelected)
    }
  }

  const highRiskCount = filteredQueue.filter((item) => item.riskScore >= 80).length
  const duplicateCount = filteredQueue.filter((item) => item.isDuplicate).length

  const handleSelectDuplicates = () => {
    const duplicateIds = filteredQueue.filter((item) => item.isDuplicate).map((item) => item.id)
    const allDuplicatesSelected = duplicateIds.length > 0 && duplicateIds.every((id) => selectedIds.has(id))

    if (allDuplicatesSelected) {
      const newSelected = new Set(selectedIds)
      duplicateIds.forEach((id) => newSelected.delete(id))
      setSelectedIds(newSelected)
    } else {
      const newSelected = new Set(selectedIds)
      duplicateIds.forEach((id) => newSelected.add(id))
      setSelectedIds(newSelected)
    }
  }

  const handleBulkReject = () => {
    console.log('[v0] Bulk rejecting requests:', Array.from(selectedIds))
    const newRejected = new Set(rejectedIds)
    
    // Check if any rejected requests are duplicates
    const rejectedDuplicates = Array.from(selectedIds).filter((id) => {
      const request = filteredQueue.find((r) => r.id === id)
      return request && request.isDuplicate
    })
    
    selectedIds.forEach((id) => newRejected.add(id))
    setRejectedIds(newRejected)
    setActionModal(null)
    setSelectedIds(new Set())
    
    // Show automation prompt if duplicates were rejected
    if (rejectedDuplicates.length > 0) {
      setRejectedDuplicateCount(rejectedDuplicates.length)
      setTimeout(() => setShowAutomationPrompt(true), 300)
    }
  }

  const handleBulkComment = () => {
    console.log('[v0] Bulk comment on requests:', Array.from(selectedIds), 'Message:', commentText)
    setActionModal(null)
    setCommentText('')
    setSelectedIds(new Set())
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--ot-bg)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 'var(--space-6) var(--space-8)' }}>
        <Header flaggedCount={flaggedCount} />
        <div style={{ flex: 1, overflow: 'auto', marginBottom: selectedIds.size > 0 ? 80 : 0 }}>
          <RequestsTable
            queue={filteredQueue}
            flaggedCount={flaggedCount}
            showFlaggedOnly={showFlaggedOnly}
            onToggleFlagged={setShowFlaggedOnly}
            selectedIds={selectedIds}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            highRiskCount={highRiskCount}
            onSelectHighRisk={handleSelectHighRisk}
            duplicateCount={duplicateCount}
            onSelectDuplicates={handleSelectDuplicates}
          />
        </div>
      </div>
      <BulkActionBar selectedCount={selectedIds.size} onReject={() => setActionModal('reject')} onComment={() => setActionModal('comment')} />
      {actionModal === 'reject' && (
        <ConfirmModal title="Reject flagged requests?" message={`Are you sure you want to reject ${selectedIds.size} flagged request(s)?`} onConfirm={handleBulkReject} onCancel={() => setActionModal(null)} />
      )}
      {actionModal === 'comment' && (
        <CommentModal selectedCount={selectedIds.size} commentText={commentText} onCommentChange={setCommentText} onSubmit={handleBulkComment} onCancel={() => setActionModal(null)} />
      )}
      {showAutomationPrompt && (
        <AutomationPromptModal rejectedCount={rejectedDuplicateCount} onEnable={() => { console.log('[v0] Automation enabled for duplicate patterns'); setShowAutomationPrompt(false) }} onDisable={() => setShowAutomationPrompt(false)} />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Figma: DSR-2026 / "Page-header-privacy-agent" (node 245:18268)
// White 24px-padded band, title + warning status pill, description, and a
// 1px #a9a9a9 bottom divider. Bleeds past the scene padding so the divider
// spans the full content width like the design.
// ---------------------------------------------------------------------------
function Header({ flaggedCount = 0 }) {
  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        margin: 'calc(var(--space-6) * -1) calc(var(--space-8) * -1) var(--space-6)',
        background: '#ffffff',
        borderBottom: '1px solid #a9a9a9',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <h1
            style={{
              margin: 0,
              font: '600 24px/32px "Open Sans", sans-serif',
              color: '#1a1a1a',
            }}
          >
            Requests
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              aria-hidden="true"
              style={{ width: 8, height: 8, borderRadius: 8, background: '#da7c01', flex: '0 0 auto' }}
            />
            <span style={{ font: '400 16px/24px "Open Sans", sans-serif', color: '#1a1a1a' }}>
              {flaggedCount} flagged
            </span>
          </div>
        </div>
        <p style={{ margin: 0, font: '400 14px/20px "Open Sans", sans-serif', color: '#1a1a1a' }}>
          View and manage all privacy requests
        </p>
      </div>
    </header>
  )
}

function RequestsTable({ queue, flaggedCount, showFlaggedOnly, onToggleFlagged, selectedIds, onSelectItem, onSelectAll, highRiskCount, onSelectHighRisk, duplicateCount, onSelectDuplicates }) {
  return (
    <div style={{ background: 'var(--ot-surface)', border: '1px solid var(--ot-border)', borderRadius: 'var(--radius-card)', paddingTop: 20 }}>
      <Toolbar showFlaggedOnly={showFlaggedOnly} onToggleFlagged={onToggleFlagged} highRiskCount={highRiskCount} onSelectHighRisk={onSelectHighRisk} duplicateCount={duplicateCount} onSelectDuplicates={onSelectDuplicates} />
      <Table queue={queue} selectedIds={selectedIds} onSelectItem={onSelectItem} onSelectAll={onSelectAll} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Figma: DSR-2026 / "table-tools" (node 245:18037)
// Two stacked 32px rows inside a 24px-inset container: a saved-views select
// paired with the search + action buttons, then the "Add filter" row.
// ---------------------------------------------------------------------------
const TOOLS = {
  savedViewBg: '#edf3ee',
  ink: '#1a1a1a',
  placeholder: '#767676',
  searchBorder: '#a9a9a9',
  greenBorder: '#468254',
  greenFill: '#468254',
  greenText: '#2c6145',
  white: '#ffffff',
  labelFont: '600 14px/20px "Open Sans", sans-serif',
}

// Figma "X / Table / Filters_Saved views" — 32px #edf3ee field with the list
// glyph, the current view name, and a chevron. Doubles as the flagged filter.
function SavedViewSelect({ showFlaggedOnly, onToggleFlagged }) {
  return (
    <button
      type="button"
      onClick={() => onToggleFlagged(!showFlaggedOnly)}
      title={showFlaggedOnly ? 'Show all requests' : 'Show flagged requests'}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: 185,
        height: 32,
        padding: '0 8px',
        background: TOOLS.savedViewBg,
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <img src="/figma/saved-views-icon.svg" alt="" width={28} height={24} style={{ flex: '0 0 auto' }} />
      <span
        style={{
          flex: 1,
          minWidth: 0,
          font: '400 16px/24px "Open Sans", sans-serif',
          color: TOOLS.ink,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {showFlaggedOnly ? 'Flagged Requests' : 'All Requests'}
      </span>
      <img src="/figma/select.svg" alt="" width={24} height={24} style={{ flex: '0 0 auto' }} />
    </button>
  )
}

// Figma "X / Table / Search Bar" — 270x32 white field, 1px #a9a9a9, radius 4.
function SearchBar() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        // Figma width is 270; shrink first so the buttons never clip.
        flex: '0 1 270px',
        width: 270,
        minWidth: 120,
        height: 32,
        padding: '0 8px',
        background: TOOLS.white,
        border: `1px solid ${TOOLS.searchBorder}`,
        borderRadius: 4,
      }}
    >
      <input
        type="search"
        placeholder="Search..."
        aria-label="Search requests"
        style={{
          flex: 1,
          minWidth: 0,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          font: '400 16px/22px "Open Sans", sans-serif',
          color: TOOLS.ink,
        }}
      />
      <img src="/figma/search-icon.svg" alt="" width={16} height={16} style={{ flex: '0 0 auto' }} />
    </div>
  )
}

// Figma button instances: "Secondary" (outlined) and "Primary" (filled).
function ToolbarButton({ variant, onClick, disabled, title, children }) {
  const primary = variant === 'primary'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 32,
        padding: '6px 16px',
        borderRadius: 4,
        border: primary ? '1px solid transparent' : `1px solid ${TOOLS.greenBorder}`,
        background: primary ? TOOLS.greenFill : 'transparent',
        color: primary ? TOOLS.white : TOOLS.greenText,
        font: TOOLS.labelFont,
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {children}
    </button>
  )
}

function Toolbar({ showFlaggedOnly, onToggleFlagged, highRiskCount, onSelectHighRisk, duplicateCount, onSelectDuplicates }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          paddingBottom: 8,
          justifyContent: 'center',
        }}
      >
        {/* Figma "Saved views + Actions" — space-between yields the design's
            66px gap at full width, and the group shrinks instead of clipping
            once the agent panel narrows the table. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, minHeight: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
            <SavedViewSelect showFlaggedOnly={showFlaggedOnly} onToggleFlagged={onToggleFlagged} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, flex: '0 1 auto', minWidth: 0 }}>
            <SearchBar />
            <ToolbarButton
              variant="secondary"
              onClick={onSelectDuplicates}
              disabled={duplicateCount === 0}
              title={`Select all ${duplicateCount} duplicate request(s)`}
            >
              Select duplicates ({duplicateCount})
            </ToolbarButton>
            <ToolbarButton
              variant="primary"
              onClick={onSelectHighRisk}
              disabled={highRiskCount === 0}
              title={`Select all ${highRiskCount} high-risk request(s)`}
            >
              Select high risk ({highRiskCount})
            </ToolbarButton>
            <button
              type="button"
              aria-label="More table actions"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                padding: 8,
                borderRadius: 4,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                flex: '0 0 auto',
              }}
            >
              <img src="/figma/ellipsis-icon.svg" alt="" width={16} height={16} />
            </button>
          </div>
        </div>

        {/* Figma "Filters" row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 32 }}>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              height: 32,
              padding: '6px 8px',
              borderRadius: 4,
              border: 'none',
              background: 'transparent',
              color: TOOLS.greenText,
              font: TOOLS.labelFont,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            <img src="/figma/add-icon.svg" alt="" width={24} height={24} />
            Add filter
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Figma: DSR-2026 / "table-data" (node 245:17265)
// Exact values lifted from the frame so the queue table matches the design.
// ---------------------------------------------------------------------------
const TBL = {
  headerBg: '#f8f8f8',
  border: '#cccccc',
  ink: '#1a1a1a',
  inkMuted: '#4d4d4d',
  link: '#1470a9',
  checkboxBorder: '#767676',
  riskVeryHigh: '#942522',
  rowH: 48,
  font: '400 14px/20px "Open Sans", sans-serif',
  headerFont: '700 14px/20px "Open Sans", sans-serif',
}

// Stage pill palette — Figma "Stage" column badges.
const STAGE_PILL = {
  'Awaiting human': { bg: '#fbf2e6', border: '#da7c01' },
  'Agent fulfilling': { bg: '#f2eef9', border: '#7e57c2' },
  Complete: { bg: '#edf5f2', border: '#4f9d81' },
}

function StagePill({ status }) {
  const s = STAGE_PILL[status]
  if (!s) return <StatusPill status={status} />
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 30,
        padding: '0 12px',
        borderRadius: 999,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: TBL.ink,
        font: TBL.font,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}

// Figma "New Risk Badges / Risk — Very High": 30px maroon disc + white flag.
function RiskFlagBadge() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
        width: 30,
        height: 30,
        borderRadius: 15,
        background: TBL.riskVeryHigh,
      }}
    >
      <img src="/figma/flag-vector.svg" alt="" width={15} height={14} />
    </span>
  )
}

function TableCheckbox({ checked, onChange, label }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      style={{
        width: 16,
        height: 16,
        margin: 0,
        borderRadius: 4,
        border: `1px solid ${TBL.checkboxBorder}`,
        accentColor: TBL.link,
        cursor: 'pointer',
      }}
    />
  )
}

function DuplicateIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10.5L8 14.5L16 6" stroke={TBL.ink} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const COLUMNS = [
  // Widths are the Figma column widths expressed as a share of the 1143px
  // content box (1191 frame - 24px side padding), so the proportions hold
  // when the queue is compressed by the agent panel.
  { key: 'flag', label: 'Flag', width: '17%' },
  { key: 'duplicate', label: 'Duplicate', width: '8.5%', align: 'center' },
  { key: 'requestId', label: 'Request ID', width: '10.5%' },
  { key: 'subject', label: 'Data Subject', width: '12.5%' },
  { key: 'stage', label: 'Stage', width: '15%' },
  { key: 'type', label: 'Request Type', width: '11%' },
  { key: 'jurisdiction', label: 'Jurisdiction', width: '12%' },
  { key: 'daysLeft', label: 'Days left', width: '9%' },
]

function Table({ queue, selectedIds, onSelectItem, onSelectAll }) {
  const allSelected = queue.length > 0 && selectedIds.size === queue.length

  return (
    <div style={{ padding: '0 24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '4.2%', minWidth: 40 }} />
          {COLUMNS.map((c) => (
            <col key={c.key} style={c.width ? { width: c.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th style={{ ...headerCellStyle, textAlign: 'center' }}>
              <TableCheckbox checked={allSelected} onChange={onSelectAll} label="Select all visible requests" />
            </th>
            {COLUMNS.map((col) => (
              <th key={col.key} style={{ ...headerCellStyle, textAlign: col.align === 'center' ? 'center' : 'left' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {queue.map((row) => (
            <tr
              key={row.id}
              style={{
                height: TBL.rowH,
                background: selectedIds.has(row.id) ? 'rgba(20, 112, 169, 0.07)' : 'transparent',
              }}
            >
              <td style={{ ...cellStyle, textAlign: 'center' }}>
                <TableCheckbox
                  checked={selectedIds.has(row.id)}
                  onChange={() => onSelectItem(row.id)}
                  label={`Select request ${row.id}`}
                />
              </td>
              <td style={cellStyle}>
                {row.isSpam && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <RiskFlagBadge />
                    <span
                      style={{
                        font: TBL.font,
                        color: TBL.ink,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Suspected agent
                    </span>
                  </span>
                )}
              </td>
              <td style={{ ...cellStyle, textAlign: 'center' }}>
                {row.isDuplicate && <DuplicateIcon />}
              </td>
              <td style={cellStyle}>
                <Link
                  to={`/requests/${row.id.split('-')[1]}`}
                  style={{ color: TBL.link, textDecoration: 'none', font: TBL.font }}
                >
                  {row.id}
                </Link>
              </td>
              <td style={cellStyle}>{row.subject}</td>
              <td style={cellStyle}>
                <StagePill status={row.status} />
              </td>
              <td style={cellStyle}>{row.type}</td>
              <td style={cellStyle}>{row.jurisdiction}</td>
              <td style={{ ...cellStyle, color: row.daysLeft < 0 ? TBL.riskVeryHigh : TBL.ink }}>
                {row.daysLeft} days
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const headerCellStyle = {
  height: TBL.rowH,
  padding: '14px 8px',
  background: TBL.headerBg,
  borderTop: `1px solid ${TBL.border}`,
  borderBottom: `1px solid ${TBL.border}`,
  font: TBL.headerFont,
  color: TBL.ink,
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const cellStyle = {
  padding: '0 8px',
  borderBottom: `1px solid ${TBL.border}`,
  font: TBL.font,
  color: TBL.ink,
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

function BulkActionBar({ selectedCount, onReject, onComment }) {
  if (selectedCount === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--ot-ink)',
        color: '#fff',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      }}
    >
      <div style={{ font: '600 14px "Open Sans", sans-serif' }}>{selectedCount} request(s) selected</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button
          type="button"
          onClick={onComment}
          style={{
            padding: '8px 16px',
            border: '1px solid #fff',
            borderRadius: 'var(--radius-control)',
            background: 'transparent',
            color: '#fff',
            font: '600 13px "Open Sans", sans-serif',
            cursor: 'pointer',
          }}
        >
          Send Comment
        </button>
        <button
          type="button"
          onClick={onReject}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--ot-danger)',
            borderRadius: 'var(--radius-control)',
            background: 'var(--ot-danger)',
            color: '#fff',
            font: '600 13px "Open Sans", sans-serif',
            cursor: 'pointer',
          }}
        >
          Reject
        </button>
      </div>
    </div>
  )
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1001,
        }}
        onClick={onCancel}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: 'var(--radius-card)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          maxWidth: 400,
          zIndex: 1002,
        }}
      >
        <div style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ font: '600 18px "Open Sans", sans-serif', color: 'var(--ot-ink)', margin: '0 0 var(--space-2) 0' }}>{title}</h2>
          <p style={{ font: 'var(--fs-body)', color: 'var(--ot-ink-2)', margin: 'var(--space-2) 0 var(--space-6) 0' }}>{message}</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--ot-border)',
                borderRadius: 'var(--radius-control)',
                background: '#fff',
                color: 'var(--ot-ink)',
                font: '600 13px "Open Sans", sans-serif',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--ot-danger)',
                borderRadius: 'var(--radius-control)',
                background: 'var(--ot-danger)',
                color: '#fff',
                font: '600 13px "Open Sans", sans-serif',
                cursor: 'pointer',
              }}
            >
              Reject All
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function CommentModal({ selectedCount, commentText, onCommentChange, onSubmit, onCancel }) {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1001,
        }}
        onClick={onCancel}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: 'var(--radius-card)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          maxWidth: 500,
          zIndex: 1002,
        }}
      >
        <div style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ font: '600 18px "Open Sans", sans-serif', color: 'var(--ot-ink)', margin: '0 0 var(--space-2) 0' }}>Send Comment</h2>
          <p style={{ font: 'var(--fs-body)', color: 'var(--ot-ink-2)', margin: 'var(--space-2) 0 var(--space-4) 0' }}>
            Adding a comment to {selectedCount} request(s). This will be visible to data subjects.
          </p>
          <textarea
            value={commentText}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Enter your comment here..."
            style={{
              width: '100%',
              minHeight: 120,
              padding: 'var(--space-3)',
              border: '1px solid var(--ot-border)',
              borderRadius: 'var(--radius-control)',
              font: 'var(--fs-body)',
              color: 'var(--ot-ink)',
              boxSizing: 'border-box',
              fontFamily: '"Open Sans", sans-serif',
              resize: 'vertical',
            }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--ot-border)',
                borderRadius: 'var(--radius-control)',
                background: '#fff',
                color: 'var(--ot-ink)',
                font: '600 13px "Open Sans", sans-serif',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!commentText.trim()}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--ot-link)',
                borderRadius: 'var(--radius-control)',
                background: 'var(--ot-link)',
                color: '#fff',
                font: '600 13px "Open Sans", sans-serif',
                cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                opacity: commentText.trim() ? 1 : 0.5,
              }}
            >
              Send to All
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function AutomationPromptModal({ rejectedCount, onEnable, onDisable }) {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1001,
        }}
        onClick={onDisable}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          width: 'calc(100% - 40px)',
          maxWidth: 420,
          zIndex: 1002,
        }}
      >
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '20px', color: '#34c759', lineHeight: '20px', flexShrink: 0 }}>✓</span>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 2px 0' }}>Smart Automation</h3>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>You have rejected {rejectedCount} duplicate request{rejectedCount !== 1 ? 's' : ''}.</p>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#1a1a1a', marginBottom: '16px', lineHeight: '1.5', margin: '0 0 16px 0' }}>Would you like me to automatically reject requests with similar duplicate patterns in the future?</p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onDisable}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                background: '#fff',
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: '"Open Sans", sans-serif',
              }}
            >
              Decline
            </button>
            <button
              type="button"
              onClick={onEnable}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #34c759',
                borderRadius: '6px',
                background: '#34c759',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: '"Open Sans", sans-serif',
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

