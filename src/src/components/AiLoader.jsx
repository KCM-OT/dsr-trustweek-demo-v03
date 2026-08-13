import { useId } from 'react'

// Transition loader — built from the AI indicator mark (public/figma/
// ai-indicator.svg's two sparkle paths, reproduced inline so each can
// animate independently; see AgentMark for the same inline-SVG precedent).
// A ring sweeps clockwise around the mark while the two sparkles pulse
// scale/opacity out of phase. Used only for the brief scripted pauses
// between slides 1→2 and 8→9 — never a persistent at-rest animation.
export function AiLoader({ size = 56 }) {
  const uid = useId()
  const gradA = `ai-loader-grad-a-${uid}`
  const gradB = `ai-loader-grad-b-${uid}`

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }} role="status" aria-label="Loading">
      <svg
        className="ai-loader-ring"
        width={size}
        height={size}
        viewBox="0 0 56 56"
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r="24" fill="none" stroke="var(--ot-agent-tint)" strokeWidth="3" />
        <circle
          cx="28"
          cy="28"
          r="24"
          fill="none"
          stroke="var(--ot-agent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="70 151"
        />
      </svg>
      <svg
        width={size * 0.52}
        height={size * 0.52}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <g className="ai-loader-sparkle ai-loader-sparkle--sm">
          <path
            d="M39.66 0.56C39.54 0.22 39.21 0 38.86 0C38.5 0 38.18 0.22 38.05 0.56L35.94 6.22L30.27 8.34C29.94 8.46 29.71 8.79 29.71 9.14C29.71 9.5 29.94 9.82 30.27 9.95L35.94 12.07L38.06 17.73C38.18 18.06 38.5 18.29 38.86 18.29C39.21 18.29 39.54 18.06 39.66 17.73L41.78 12.06L47.45 9.94C47.78 9.82 48 9.5 48 9.14C48 8.79 47.78 8.46 47.44 8.34L41.78 6.22L39.66 0.56Z"
            fill={`url(#${gradA})`}
          />
        </g>
        <g className="ai-loader-sparkle ai-loader-sparkle--lg">
          <path
            d="M18.65 14.76C18.42 14.13 17.81 13.71 17.14 13.71C16.47 13.71 15.87 14.13 15.64 14.76L11.67 25.38L1.05 29.35C0.42 29.59 0 30.19 0 30.86C0 31.53 0.42 32.13 1.05 32.36L11.67 36.34L15.64 46.96C15.87 47.58 16.47 48 17.14 48C17.81 48 18.42 47.58 18.65 46.96L22.63 36.34L33.25 32.36C33.87 32.13 34.29 31.53 34.29 30.86C34.29 30.19 33.87 29.59 33.24 29.35L22.62 25.38L18.65 14.76Z"
            fill={`url(#${gradB})`}
          />
        </g>
        <defs>
          <linearGradient id={gradA} x1="48" y1="2.18e-06" x2="29.71" y2="18.29" gradientUnits="userSpaceOnUse">
            <stop offset="0.25" stopColor="#976FE6" />
            <stop offset="1" stopColor="#0788F7" />
          </linearGradient>
          <linearGradient id={gradB} x1="34.29" y1="13.71" x2="0" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0.25" stopColor="#976FE6" />
            <stop offset="1" stopColor="#0788F7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
