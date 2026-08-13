import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { marcus, tenant } from '../../data/fixtures'
import { useCue, useSceneBeats } from '../../cue/CueContext'
import { StatusPill } from '../../components/StatusPill'
import { AgentMark } from '../../components/AgentMark'
import { FileIcon, CheckIcon, PersonIcon } from '../../shell/icons'
import { formatDate, formatDateTime } from './format'

// Split-screen agentic user subtask — build spec §3.2. Left 45% = OneTrust
// subtask card; right 55% = mocked Microsoft Teams window with a slim
// mocked ITSM (ServiceNow) ticket strip below it. Teams/ServiceNow visual
// grammar per 02_design_system.md §4: imitate geometry, only suggest
// branding. Messages verbatim from 03_demo_script.md Act 3 split screen.
// The final sync is three distinct state changes staggered 500ms apart:
// Teams thanks message → subtask flips Complete → ticket flips Resolved.

const BEATS = [
  'Initial state',
  'Agent asks in Teams (typing first)',
  "Daniel's clarifying question",
  "Agent's answer",
  'Daniel returns the extract',
  'The sync: Teams → subtask → ITSM',
]

const SYNC_BEAT = 5

const warehouse = tenant.systems.find((s) => s.name === 'Internal warehouse')
const subtaskItem = marcus.plan.find((p) => p.system === 'Internal warehouse')
// Fixture-grounded timestamps: the thread opened Jul 9, 11:52 AM; the
// extract was delivered (and the ticket resolved) Jul 10, 2:14 PM. The
// middle messages carry no fixture timestamp and show none — nothing gets
// invented.
const threadOpenedTs = marcus.activity.find((e) => e.action.startsWith('Opened Teams thread')).ts
const deliveredTs = marcus.activity.find((e) => e.actor === 'okafor').ts

const MESSAGES = [
  {
    beat: 1,
    from: 'agent',
    typing: true,
    ts: threadOpenedTs,
    dayDivider: formatDate(threadOpenedTs),
    text: "Hi Daniel — I'm fulfilling privacy request AR-4207 (access request, CCPA). I need Marcus Bell's records from the warehouse: tables `txn_orders`, `txn_refunds`, and `loyalty_ledger`, filtered to customer_id `C-102-448-871`, full history. Return as CSV here and I'll take it from there. Ticket SNOW-88412 is tracking this — I'll keep it updated so you don't have to.",
  },
  {
    beat: 2,
    from: 'daniel',
    text: 'does loyalty_ledger include the points expiry rows or do you need those separately from loyalty_expiry?',
  },
  {
    beat: 3,
    from: 'agent',
    typing: true,
    text: 'Good catch — include `loyalty_expiry` too. Marcus specifically cares about his points, so expiry history is in scope for "specific pieces of personal information."',
  },
  {
    beat: 4,
    from: 'daniel',
    ts: deliveredTs,
    dayDivider: formatDate(deliveredTs),
    file: 'AR-4207_warehouse_extract.csv',
    text: 'done',
    doneCheck: true,
  },
]

export function SplitScreenScene() {
  const navigate = useNavigate()
  const beat = useSceneBeats(
    'request-subtask',
    'Split-screen (OT + Teams + ServiceNow)',
    BEATS,
    // Redaction summary is "entered by cue" (build spec §3.3): advancing
    // past the sync hands off. ← on beat 0 returns to the request detail
    // at its fast-forward state (beat 5, the state that opened this door).
    () => navigate('/requests/4207/redaction'),
    () => navigate('/requests/4207', { state: { beat: 5 } })
  )

  // Entered with a requested beat (the redaction summary's back-exit
  // returns here at the sync beat).
  const location = useLocation()
  const { jumpToBeat } = useCue()
  const enteredAtBeat = useRef(typeof location.state?.beat === 'number')
  useEffect(() => {
    if (typeof location.state?.beat === 'number') jumpToBeat(location.state.beat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Slide 27 build: the Teams window starts collapsed to an icon in the
  // bottom-right corner, then scales open from that corner after a 500ms
  // hold. Skipped when the redaction back-exit drops us at a later beat.
  const [meetOpen, setMeetOpen] = useState(enteredAtBeat.current)
  useEffect(() => {
    if (enteredAtBeat.current || beat !== 0) {
      setMeetOpen(true)
      return
    }
    setMeetOpen(false)
    const timer = setTimeout(() => setMeetOpen(true), 500)
    return () => clearTimeout(timer)
  }, [beat])

  // The sync's three staggered flips (500ms apart, in order). Timers reset
  // whenever the beat leaves SYNC_BEAT, so ← replays cleanly.
  const [syncStep, setSyncStep] = useState(0)
  useEffect(() => {
    if (beat !== SYNC_BEAT) {
      setSyncStep(0)
      return
    }
    const timers = [
      setTimeout(() => setSyncStep(1), 0),
      setTimeout(() => setSyncStep(2), 500),
      setTimeout(() => setSyncStep(3), 1000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [beat])

  const subtaskComplete = syncStep >= 2
  const ticketResolved = syncStep >= 3

  // The Meet chrome is taller than the old mock (54px title bar + 58px
  // recipient bar + 75px composer), so the scene is pinned to the shell's
  // main box and the message canvas takes the remaining space.
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        gap: 'var(--space-6)',
        padding: 'var(--space-6) var(--space-8)',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: '0 0 45%', minWidth: 0 }}>
        <SubtaskCard complete={subtaskComplete} resolved={ticketResolved} />
      </div>
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Scales from the bottom-right corner over 500ms. The flex item keeps
            its box while collapsed, so the icon sits in the chat area's corner. */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            transformOrigin: '100% 100%',
            transform: meetOpen ? 'scale(1)' : 'scale(0.07)',
            opacity: meetOpen ? 1 : 0.85,
            borderRadius: meetOpen ? 10 : 90,
            overflow: 'hidden',
            // Shadow lives here, not on TeamsWindow — this wrapper's
            // overflow:hidden would clip a shadow cast by its child.
            boxShadow: 'var(--shadow-window)',
            willChange: 'transform',
            pointerEvents: meetOpen ? 'auto' : 'none',
            transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease-out, border-radius 500ms ease-out',
          }}
        >
          <TeamsWindow beat={beat} thanksVisible={syncStep >= 1} />
        </div>
        <ItsmStrip resolved={ticketResolved} />
      </div>
    </div>
  )
}

// --- Left: OneTrust subtask card ---------------------------------------------

function SubtaskCard({ complete, resolved }) {
  return (
    <div>
      <div style={{ font: 'var(--fs-meta)', marginBottom: 'var(--space-2)' }}>
        <Link to="/requests/4207" style={{ color: 'var(--ot-link)', textDecoration: 'none' }}>
          Requests
        </Link>
        <span style={{ color: 'var(--ot-ink-3)' }}> › {marcus.requestId}</span>
      </div>

      <div
        style={{
          background: 'var(--ot-surface)',
          border: '1px solid var(--ot-border)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)', marginBottom: 'var(--space-2)' }}>
          Subtask
        </div>
        <h1 style={{ font: '600 18px/1.4 "Open Sans", sans-serif', marginBottom: 'var(--space-4)' }}>
          {subtaskItem.title}
        </h1>

        <CardRow label="Assignee">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'var(--ot-bg)',
                color: 'var(--ot-ink-2)',
              }}
            >
              <PersonIcon width={15} height={15} />
            </span>
            {warehouse.owner.name} · {warehouse.owner.team}
          </span>
        </CardRow>

        <CardRow label="Linked ticket">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              border: '1px solid var(--ot-border)',
              borderRadius: 'var(--radius-chip)',
              font: '600 12.5px "SF Mono", "Menlo", monospace',
              color: 'var(--ot-ink)',
            }}
          >
            {subtaskItem.ticket}
            <span style={{ font: 'var(--fs-meta)', color: resolved ? 'var(--ot-green)' : 'var(--ot-ink-2)' }}>
              · {resolved ? 'Resolved' : 'Open'}
            </span>
          </span>
        </CardRow>

        <CardRow label="Status">
          {/* Keyed remount so the sync's 500ms flip re-enters visibly */}
          <span key={complete ? 'complete' : 'inprogress'} className="anim-enter" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <StatusPill status={complete ? 'Complete' : 'In progress'} />
            {complete && (
              <span style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)' }}>{formatDateTime(deliveredTs)}</span>
            )}
          </span>
        </CardRow>
      </div>
    </div>
  )
}

function CardRow({ label, children }) {
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--ot-border)' }}>
      <div style={{ font: '600 12.5px "Open Sans", sans-serif', color: 'var(--ot-ink-2)', marginBottom: 5 }}>
        {label}:
      </div>
      <div style={{ font: 'var(--fs-body)', color: 'var(--ot-ink)' }}>{children}</div>
    </div>
  )
}

// --- Right: mocked Teams window -----------------------------------------------

// ---------------------------------------------------------------------------
// Figma: DSR-2026 / "Meet-container" (node 269:11944)
// Chrome only — a #167cbb title bar, a two-tone left rail, the recipient bar
// with the agent avatar + Join button, and the 55px composer. The message
// canvas and every message interaction below are unchanged.
// ---------------------------------------------------------------------------
const MEET = {
  chrome: '#167cbb',
  chromeDark: '#0f5580',
  railFill: '#e4e4e4',
  railEdge: '#ebebeb',
  railEdgeStroke: '#e1e1e1',
  border: '#e0e0e0',
  ink: '#1a1a1a',
  placeholder: '#626262',
  composerBorder: '#c8c8c8',
  divider: '#bdbdbd',
  avatarTint: '#e5d8ff',
  white: '#ffffff',
}

const RAIL_ICONS = [
  { src: '/figma/meet/bell.svg', w: 19, h: 22, alt: 'Activity' },
  { src: '/figma/meet/comment.svg', w: 22, h: 22, alt: 'Chat' },
  { src: '/figma/meet/calendar.svg', w: 19, h: 21, alt: 'Calendar' },
  { src: '/figma/meet/phone.svg', w: 22, h: 22, alt: 'Calls' },
  { src: '/figma/meet/cloud.svg', w: 25, h: 19, alt: 'Files' },
  { src: '/figma/meet/ellipsis.svg', w: 19, h: 4, alt: 'More apps' },
  { src: '/figma/meet/square-plus.svg', w: 19, h: 19, alt: 'Add app' },
]

const COMPOSER_ICONS = [
  { src: '/figma/meet/pencil.svg', w: 18, h: 18, alt: 'Format' },
  { src: '/figma/meet/smile.svg', w: 18, h: 18, alt: 'Emoji' },
  { src: '/figma/meet/paperclip.svg', w: 16, h: 19, alt: 'Attach' },
  { src: '/figma/meet/pen-clip.svg', w: 18, h: 18, alt: 'Loop component' },
  { src: '/figma/meet/plus.svg', w: 16, h: 16, alt: 'More options' },
]

function TeamsWindow({ beat, thanksVisible }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 10,
        overflow: 'hidden',
        background: MEET.white,
      }}
    >
      {/* Figma "meet-header" — 54px #167cbb chrome with window controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          height: 54,
          flexShrink: 0,
          padding: '0 20px',
          background: MEET.chrome,
        }}
      >
        <span style={{ display: 'flex', gap: 8, flexShrink: 0 }} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: MEET.chromeDark }} />
          ))}
        </span>
        <img src="/figma/meet/sidebar.svg" alt="" width={20} height={15} style={{ flexShrink: 0, marginLeft: 8 }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0, marginLeft: 8 }} aria-hidden="true">
          <img src="/figma/meet/angle-left.svg" alt="" width={11} height={20} />
          <img src="/figma/meet/angle-right.svg" alt="" width={11} height={20} />
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flex: 1,
            minWidth: 0,
            maxWidth: 408,
            height: 36,
            margin: '0 auto',
            padding: '0 16px',
            borderRadius: 4,
            background: MEET.white,
          }}
        >
          <img src="/figma/meet/search.svg" alt="" width={18} height={18} style={{ flexShrink: 0 }} />
          <span style={{ font: '400 16px/22px Inter, "Open Sans", sans-serif', color: '#c8c8c8' }}>Search</span>
        </div>
        <img src="/figma/meet/ellipsis.svg" alt="" width={19} height={4} style={{ flexShrink: 0 }} />
        <img src="/figma/meet/circle-user.svg" alt="" width={28} height={28} style={{ flexShrink: 0 }} />
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Figma "meet-sidebar" — 41px #e4e4e4 rail + 10px #ebebeb edge */}
        <div style={{ display: 'flex', flexShrink: 0 }}>
          <div
            style={{
              width: 41,
              background: MEET.railFill,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 22,
              paddingTop: 24,
            }}
          >
            {RAIL_ICONS.map((icon) => (
              <img key={icon.src} src={icon.src} alt="" width={icon.w} height={icon.h} />
            ))}
          </div>
          <div
            style={{
              width: 10,
              background: MEET.railEdge,
              borderLeft: `1px solid ${MEET.railEdgeStroke}`,
              borderRight: `1px solid ${MEET.railEdgeStroke}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/figma/meet/grip-lines-vertical.svg" alt="" width={5} height={11} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Figma "meet-recipient-bar" — 58px white bar, 1px #e0e0e0 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 58,
              flexShrink: 0,
              padding: '0 24px',
              background: MEET.white,
              borderBottom: `1px solid ${MEET.border}`,
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                borderRadius: 50,
                background: MEET.avatarTint,
                flexShrink: 0,
              }}
            >
              <img src="/figma/meet/ai-sparkle.svg" alt="" width={16} height={16} />
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                minWidth: 0,
                font: '600 16px/19px Inter, "Open Sans", sans-serif',
                color: MEET.ink,
              }}
            >
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Meridian Privacy Agent
              </span>
              <img src="/figma/meet/arrow-right.svg" alt="to" width={15} height={11} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Daniel Okafor</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto', flexShrink: 0 }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 54,
                  height: 31,
                  borderRadius: 4,
                  background: MEET.chrome,
                  color: MEET.white,
                  font: '600 16px/19px Inter, "Open Sans", sans-serif',
                }}
              >
                Join
              </span>
              <img src="/figma/meet/search.svg" alt="" width={18} height={18} />
              <img src="/figma/meet/ellipsis.svg" alt="" width={19} height={4} />
            </span>
          </div>

          {/* Message canvas — interactions unchanged */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 24px', background: MEET.white }}>
            {MESSAGES.filter((m) => beat >= m.beat).map((m) => (
              <Message key={m.beat} message={m} active={beat === m.beat} />
            ))}
            {thanksVisible && (
              <Message
                message={{ beat: SYNC_BEAT, from: 'agent', text: "Thanks — verified 214 rows, all four tables. You're done." }}
                active
              />
            )}
          </div>

          {/* Figma "meet-chat-input" — 55px field, 1px #c8c8c8, radius 4 */}
          <div style={{ flexShrink: 0, padding: '0 24px 20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                height: 55,
                padding: '0 20px',
                border: `1px solid ${MEET.composerBorder}`,
                borderRadius: 4,
                background: MEET.white,
              }}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  font: '400 16px/22px Inter, "Open Sans", sans-serif',
                  color: MEET.placeholder,
                }}
              >
                Type a message
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }} aria-hidden="true">
                {COMPOSER_ICONS.map((icon) => (
                  <img key={icon.src} src={icon.src} alt="" width={icon.w} height={icon.h} />
                ))}
                <span style={{ width: 1, height: 31, background: MEET.divider }} />
                <img src="/figma/meet/send.svg" alt="" width={19} height={18} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Agent messages appear behind a ~800ms typing indicator when their beat is
// live (README #3); revisiting later beats shows them instantly.
function Message({ message, active }) {
  const [typing, setTyping] = useState(Boolean(message.typing) && active)
  useEffect(() => {
    if (!typing) return
    const t = setTimeout(() => setTyping(false), 800)
    return () => clearTimeout(t)
  }, [typing])

  const isAgent = message.from === 'agent'
  return (
    <div>
      {message.dayDivider && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
          <span style={{ flex: 1, height: 1, background: '#e5e5e7' }} />
          <span style={{ font: '600 11px "Open Sans", sans-serif', color: '#8a8a8e' }}>{message.dayDivider}</span>
          <span style={{ flex: 1, height: 1, background: '#e5e5e7' }} />
        </div>
      )}

      <div className="anim-enter" style={{ display: 'flex', justifyContent: isAgent ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
        <div style={{ maxWidth: '82%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: isAgent ? 'flex-end' : 'flex-start',
              alignItems: 'baseline',
              gap: 8,
              marginBottom: 3,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '600 12px "Open Sans", sans-serif', color: '#424245' }}>
              {isAgent && <AgentMark size={11} />}
              {isAgent ? 'Meridian Privacy Agent' : 'Daniel Okafor'}
            </span>
            {message.ts && <span style={{ font: '400 11px "Open Sans", sans-serif', color: '#8a8a8e' }}>{formatDateTime(message.ts)}</span>}
          </div>

          {typing ? (
            <div
              style={{
                display: 'inline-flex',
                gap: 4,
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 8,
                background: isAgent ? '#e8ebfa' : '#f1f2f4',
              }}
            >
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          ) : (
            <div
              className="anim-enter"
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: isAgent ? '#e8ebfa' : '#f1f2f4',
                font: '400 13.5px/1.5 "Open Sans", sans-serif',
                color: '#242424',
              }}
            >
              {message.file && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    marginBottom: 8,
                    border: '1px solid #d6d6d9',
                    borderRadius: 6,
                    background: '#fff',
                    font: '600 12.5px "Open Sans", sans-serif',
                    color: '#242424',
                  }}
                >
                  <span style={{ color: 'var(--ot-green)', display: 'flex' }}>
                    <FileIcon width={16} height={16} />
                  </span>
                  {message.file}
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{renderRichText(message.text)}</span>
                {message.doneCheck && (
                  <span style={{ color: 'var(--ot-green)', display: 'flex' }} aria-hidden="true">
                    <CheckIcon width={14} height={14} className="check-draw" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Backticked spans in the script render as inline code (table/field names).
function renderRichText(text) {
  return text.split('`').map((chunk, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        style={{
          font: '500 12.5px "SF Mono", "Menlo", monospace',
          background: 'rgba(0,0,0,0.06)',
          padding: '1px 4px',
          borderRadius: 4,
        }}
      >
        {chunk}
      </code>
    ) : (
      <span key={i}>{chunk}</span>
    )
  )
}

// --- Below Teams: mocked ITSM (ServiceNow) ticket strip ------------------------

function ItsmStrip({ resolved }) {
  return (
    <div
      style={{
        flexShrink: 0,
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        background: '#f7f8f9',
        padding: '12px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 4,
            background: '#3d4b5c',
            color: '#fff',
            font: '600 10.5px "Open Sans", sans-serif',
            letterSpacing: 0.5,
          }}
        >
          ITSM
        </span>
        <span style={{ font: '600 13px "SF Mono", "Menlo", monospace', color: 'var(--ot-ink)' }}>
          {subtaskItem.ticket}
        </span>
        <StatusPill status={resolved ? 'Resolved' : 'Open'} />
        <span style={{ flex: 1, font: 'var(--fs-meta)', color: 'var(--ot-ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {subtaskItem.title}
        </span>
        <span style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)', flexShrink: 0 }}>
          Assignment group: {warehouse.owner.team}
        </span>
      </div>
      {resolved && (
        <div
          className="anim-enter"
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid var(--ot-border)',
            font: 'var(--fs-meta)',
            color: 'var(--ot-ink-2)',
          }}
        >
          <span style={{ fontWeight: 600 }}>Work notes</span> · Extract delivered via Teams; verified by Privacy
          Agent. Auto-resolved.
        </div>
      )}
    </div>
  )
}
