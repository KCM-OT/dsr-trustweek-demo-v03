import { Link } from 'react-router-dom'

// Shared page-header band — Figma: DSR-2026 / "Page-header-privacy-agent"
// (node 245:18268), the grammar the Setup and Requests refits established:
// a full-width white band with 24px padding, an optional breadcrumb, a
// 24/32 title (optionally paired with a status pill or an inline meta
// read), a 14/20 description, optional right-aligned actions, and a 1px
// #a9a9a9 divider that spans the whole content width.
//
// Session 3.5 extracted it here so every in-shell scene shares one
// implementation instead of five near-copies at three different title
// sizes and two different gutters.

export const PAGE_GUTTER = 24
export const PAGE_MEASURE = 1200

const HEADER_INK = '#1a1a1a'
const HEADER_LINK = '#1470a9'
const HEADER_RULE = '#a9a9a9'

export function PageHeader({ breadcrumb, title, status, meta, description, actions }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--space-6)',
        padding: PAGE_GUTTER,
        background: '#ffffff',
        borderBottom: `1px solid ${HEADER_RULE}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        {breadcrumb && <Breadcrumb trail={breadcrumb} />}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}>
          <h1 style={{ margin: 0, font: 'var(--fs-page-title)', color: HEADER_INK }}>{title}</h1>
          {status}
          {meta}
        </div>
        {description && (
          <p style={{ margin: 0, font: '400 14px/20px "Open Sans", sans-serif', color: HEADER_INK }}>{description}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>{actions}</div>
      )}
    </header>
  )
}

// Breadcrumb trail: [{ label, to }, { label, onClick }, …] — the last entry
// renders as plain current-page ink, matching the Setup refit's crumb row.
// Setup's first crumb rewinds a beat rather than navigating, hence onClick.
const CRUMB_LINK = { color: HEADER_LINK, textDecoration: 'none', font: '600 14px/20px "Open Sans", sans-serif' }

function Breadcrumb({ trail }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: 20 }}>
      {trail.map((crumb, i) => {
        const last = i === trail.length - 1
        return (
          <span key={crumb.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {crumb.to && !last ? (
              <Link to={crumb.to} style={CRUMB_LINK}>
                {crumb.label}
              </Link>
            ) : crumb.onClick && !last ? (
              <button
                type="button"
                onClick={crumb.onClick}
                style={{ ...CRUMB_LINK, padding: 0, border: 0, background: 'transparent', cursor: 'pointer' }}
              >
                {crumb.label}
              </button>
            ) : (
              <span style={{ color: HEADER_INK, font: '400 14px/20px "Open Sans", sans-serif' }}>{crumb.label}</span>
            )}
            {!last && <img src="/figma/chevron-thin-right.svg" alt="" width="8" height="8" />}
          </span>
        )
      })}
    </nav>
  )
}

// Content well below the band: one 24px gutter for every scene, and an
// optional 1200px measure so wide surfaces stop short of the projector's
// far edge instead of stretching to 1920.
export function PageBody({ children, measure, style }) {
  return (
    <div style={{ padding: PAGE_GUTTER, ...style }}>
      {measure ? <div style={{ maxWidth: PAGE_MEASURE }}>{children}</div> : children}
    </div>
  )
}

// The module's outlined/filled control pair, so page actions read the same
// on every header (green filled primary, green outlined secondary).
export function PageAction({ children, variant = 'primary', onClick }) {
  const outlined = variant === 'secondary'
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 4,
        border: `1px solid ${outlined ? '#4c754d' : 'var(--ot-green)'}`,
        background: outlined ? '#ffffff' : 'var(--ot-green)',
        color: outlined ? '#33553e' : '#ffffff',
        font: '600 14px/20px "Open Sans", sans-serif',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}
