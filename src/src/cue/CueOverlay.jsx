import { useCue } from './CueContext'
import { NUMBER_KEY_ROUTES } from '../scenes/sceneMap'

// Esc opens this — build spec §0: "cue overlay (Esc) lists beats with the
// current one highlighted, click-to-jump."
export function CueOverlay() {
  const { overlayOpen, closeOverlay, sceneLabel, beatLabels, beatIndex, jumpToBeat } = useCue()

  if (!overlayOpen) return null

  return (
    <div
      role="dialog"
      aria-label="Presenter cue overlay"
      onClick={closeOverlay}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(31, 41, 51, 0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--ot-surface)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-overlay)',
          width: 480,
          maxWidth: '90vw',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)', marginBottom: 'var(--space-1)' }}>
          Presenter cue overlay
        </div>
        <h2 style={{ font: 'var(--fs-page-title)', marginBottom: 'var(--space-4)' }}>
          {sceneLabel || 'No scene loaded'}
        </h2>

        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-2)' }}>
          {beatLabels.map((label, i) => {
            const active = i === beatIndex
            return (
              <li key={i}>
                <button
                  onClick={() => jumpToBeat(i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-control)',
                    border: active ? '1px solid var(--ot-agent)' : '1px solid var(--ot-border)',
                    background: active ? 'var(--ot-agent-tint)' : 'var(--ot-surface)',
                    color: 'var(--ot-ink)',
                    cursor: 'pointer',
                    font: 'var(--fs-body)',
                  }}
                >
                  <span style={{ color: 'var(--ot-ink-3)', marginRight: 8 }}>{i + 1}.</span>
                  {label}
                </button>
              </li>
            )
          })}
        </ol>

        <div
          style={{
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--ot-border)',
            font: 'var(--fs-meta)',
            color: 'var(--ot-ink-3)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          <span>→ / Space advance</span>
          <span>← back</span>
          {Object.entries(NUMBER_KEY_ROUTES).map(([key, route]) => (
            <span key={key}>
              {key} → {route}
            </span>
          ))}
          <span>Esc close</span>
        </div>
      </div>
    </div>
  )
}
