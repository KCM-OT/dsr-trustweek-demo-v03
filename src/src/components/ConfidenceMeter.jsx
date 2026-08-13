// Confidence meter — 02_design_system.md §1: 5-segment meter + word.
// High = green (spec allows 4–5 filled; 5 chosen for projector legibility),
// Medium = amber 3, Low = red 2. Semantics colors per design system.

const LEVELS = {
  high: { word: 'High', filled: 5, color: 'var(--ot-green)' },
  medium: { word: 'Medium', filled: 3, color: 'var(--ot-warn)' },
  low: { word: 'Low', filled: 2, color: 'var(--ot-danger)' },
}

export function ConfidenceMeter({ level }) {
  const l = LEVELS[level] || LEVELS.medium
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', gap: 3 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 5,
              borderRadius: 2,
              background: i <= l.filled ? l.color : 'var(--ot-border)',
            }}
          />
        ))}
      </span>
      <span style={{ font: '600 12.5px "Open Sans", sans-serif', color: l.color }}>{l.word}</span>
    </span>
  )
}
