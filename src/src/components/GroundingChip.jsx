// Grounding/source chips — 02_design_system.md §1 component grammar:
// tiny bordered chips, 12.5px, always look clickable. Regulation refs are
// blue tint (`CCPA §1798.110`); document/context refs are green tint
// (`SOP §4.2` / `Data flow diagram` / `Brand + Tone Guide`). Record refs
// (`Intake AR-4207`, `SNOW-88412`, system names) get a neutral outlined
// variant — an implementation choice, the spec defines only the two tints.

const REGULATION = /^(CCPA|CPRA|VCDPA|CPA|GDPR)/
const DOCUMENT = /^(SOP|Customer Data Flows|Data flow diagram|Brand \+ Tone Guide|Response Letter Examples|DSAR)/

function variantFor(label) {
  if (REGULATION.test(label)) {
    return { background: 'var(--ot-blue-tint)', borderColor: '#c6d8f5', color: 'var(--ot-link)' }
  }
  if (DOCUMENT.test(label)) {
    return { background: 'var(--ot-green-tint)', borderColor: '#cde4d2', color: 'var(--ot-green)' }
  }
  return { background: 'var(--ot-surface)', borderColor: 'var(--ot-border)', color: 'var(--ot-ink-2)' }
}

export function GroundingChip({ label }) {
  const v = variantFor(label)
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 8px',
        borderRadius: 'var(--radius-chip)',
        border: `1px solid ${v.borderColor}`,
        background: v.background,
        color: v.color,
        font: '400 12.5px "Open Sans", sans-serif',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }}
    >
      {label}
    </span>
  )
}
