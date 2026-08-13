import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { marcus } from '../data/fixtures'
import { useCue, useSceneBeats } from '../cue/CueContext'
import { AgentMark } from '../components/AgentMark'

// PDF report viewer (build spec §0 scene 8 / §3.5) — a cue-driven page
// presenter: each advance press turns one page of the report, and
// advancing past the final page continues to Act 4's dashboard (presenter
// request, post-session-4 revision). The pages shown are 2x PNGs of the
// real committed PDF, rendered by the same toolchain that produces it
// (report/render-pdf.mjs) — the artifact itself remains the genuine
// public/AR-4207_access_report.pdf, linked from "Open in new tab". A
// controlled presenter beats Chrome's embedded PDF viewer on stage: pages
// map 1:1 to beats (visible in the cue overlay), flips are instant
// (preloaded, no iframe focus stealing), and both act boundaries stay
// walkable on the cue keys.

const PDF_URL = '/AR-4207_access_report.pdf'

// One beat per page — the cue overlay doubles as a table of contents.
export const REPORT_PAGES = [
  'Page 1 · Cover',
  'Page 2 · A letter, not a form',
  'Page 3 · What we collect and why',
  'Page 4 · Sources, purposes, sharing',
  'Page 5 · Profile & accounts',
  'Page 6 · Alpine Rewards history',
  'Page 7 · Orders & transactions',
  'Page 8 · Marketing & support history',
  'Page 9 · What you can do next',
]

const pageUrl = (n) => `/report-pages/page-${n}.png`

export function ReportScene() {
  const navigate = useNavigate()
  // → on the final page continues to Act 4; ← on the cover steps back to
  // the redaction summary at its report-ready beat.
  const beat = useSceneBeats(
    'report',
    'PDF report viewer',
    REPORT_PAGES,
    () => navigate('/dashboard'),
    () => navigate('/requests/4207/redaction', { state: { beat: 1 } })
  )

  // The dashboard's back-exit returns here at the last page, so the
  // report → dashboard boundary is symmetric (same pattern as the other
  // cross-scene beat jumps).
  const location = useLocation()
  const { jumpToBeat } = useCue()
  useEffect(() => {
    if (typeof location.state?.beat === 'number') jumpToBeat(location.state.beat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Preload every page once so cue flips are instant — no load flash (§5.2).
  useEffect(() => {
    REPORT_PAGES.forEach((_, i) => {
      const img = new Image()
      img.src = pageUrl(i + 1)
    })
  }, [])

  const page = beat + 1

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-8)',
          borderBottom: '1px solid var(--ot-border)',
          background: 'var(--ot-surface)',
          flexShrink: 0,
        }}
      >
        <div style={{ font: 'var(--fs-meta)' }}>
          <Link to="/requests/4207" style={{ color: 'var(--ot-link)', textDecoration: 'none' }}>
            Requests
          </Link>
          <span style={{ color: 'var(--ot-ink-3)' }}> › {marcus.requestId} › Access report</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--fs-meta)', color: 'var(--ot-ink-2)' }}>
            <AgentMark size={12} />
            English (US) · 9 pages · Generated to Meridian brand + tone guide
          </span>
          <span style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)', fontVariantNumeric: 'tabular-nums' }}>
            Page {page} of {REPORT_PAGES.length}
          </span>
          <a
            href={PDF_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--ot-border)',
              background: 'var(--ot-surface)',
              color: 'var(--ot-ink-2)',
              font: '600 12.5px "Open Sans", sans-serif',
              textDecoration: 'none',
            }}
          >
            Open in new tab
          </a>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: '#3c3c3c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)',
        }}
      >
        {/* key={page} re-triggers the 200ms entrance so page turns read as a
            deliberate flip rather than a hard swap */}
        <img
          key={page}
          className="anim-enter"
          src={pageUrl(page)}
          alt={`Access report for Marcus Bell — ${REPORT_PAGES[beat]}`}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.45)',
          }}
        />
      </div>
    </div>
  )
}
