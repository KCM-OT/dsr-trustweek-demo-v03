import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { marcus } from '../../data/fixtures'
import { useCue, useSceneBeats } from '../../cue/CueContext'
import { StatusPill } from '../../components/StatusPill'
import { GroundingChip } from '../../components/GroundingChip'
import { AgentMark } from '../../components/AgentMark'
import {
  PencilIcon,
  KebabIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  IdBadgeIcon,
  CloudIcon,
  MegaphoneIcon,
  HeadsetIcon,
  DatabaseIcon,
  DocumentIcon,
  WarningIcon,
} from '../../shell/icons'
import { PageHeader, PageBody, PageAction } from '../../shell/PageHeader'
import { ActivityTrail } from './ActivityTrail'
import { formatDate, formatDateTime } from './format'
import { getWorkflowByName } from '../../data/workflows'

// Request detail — agent workflow view (build spec §3.1). Keeps the real
// page skeleton from reference/pra_request_detail.png: breadcrumb, title +
// stage pill, Results summary + kebab, left metadata rail with edit
// pencils, green-underline tabs. Where today's blue chevron stage bar sits,
// the selected workflow + reasoning panels take that exact slot — the
// before/after moment. All copy verbatim from 03_demo_script.md Act 3; all
// data from fixtures §marcus.
//
// The "Workflow" tab shows which of Act 1's four generated workflows
// (data/workflows.js, beat 10) is running this request — matched here by
// marcus.type ("Access") — then its steps as the request's subtasks get
// processed. Step 5 is the demo's payoff: verifying Alpine Rewards history
// turns up a hit, which flags the step to the privacy team before Daniel
// Okafor's data even lands, and it's that same step that hands off into
// Act 3's agent collaboration (split screen).

const BEATS = [
  'Request detail, initial state',
  'Initial state',
  'Workflow steps appear (staggered)',
  'Reasoning: Classification opens',
  'Reasoning: Obligations opens',
  'Reasoning: Your context opens',
  'Fast-forward — items 1–4 done, item 5 flagged for privacy review',
  'Hand off → split screen',
]

const HANDOFF_BEAT = 7

const PLAN_ICONS = {
  'ID verification': IdBadgeIcon,
  Salesforce: CloudIcon,
  Marketo: MegaphoneIcon,
  Zendesk: HeadsetIcon,
  'Internal warehouse': DatabaseIcon,
  'Privacy Agent': DocumentIcon,
}

export function RequestDetailScene() {
  const navigate = useNavigate()
  // ← on beat 0 returns to Act 2's intake at its pre-submit state, so the
  // Submit → Act 3 boundary is walkable backward on the cue keys.
  const beat = useSceneBeats('request-detail', 'Request detail — Marcus Bell', BEATS, null, () =>
    navigate('/intake', { state: { resume: 'pre-submit' } })
  )
  const [tab, setTab] = useState('Workflow')

  // Entered with a requested beat (the split screen's back-exit returns
  // here at beat 5, the fast-forward state); number key 3 still lands on 0.
  const location = useLocation()
  const { jumpToBeat } = useCue()
  useEffect(() => {
    if (typeof location.state?.beat === 'number') jumpToBeat(location.state.beat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (beat === 0) {
      setTab('Request')
    } else if (beat === 1) {
      setTab('Workflow')
    } else if (beat === HANDOFF_BEAT) {
      navigate('/requests/4207/subtask')
    }
  }, [beat, navigate])

  return (
    <div>
      <Header />
      <PageBody>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <MetaRail />
          <div style={{ flex: 1, minWidth: 0, maxWidth: 980 }}>
            <Tabs tab={tab} onSelect={setTab} />
            {tab === 'Workflow' && <WorkflowTab beat={beat} />}
            {tab === 'Activity' && <ActivityTrail />}
            {tab === 'Request' && <RequestTab />}
          </div>
        </div>
      </PageBody>
    </div>
  )
}

function Header() {
  return (
    <PageHeader
      breadcrumb={[
        { label: 'Requests', to: '/requests' },
        { label: marcus.requestId },
      ]}
      title="Data subject request details"
      status={<StatusPill status="Agent fulfilling" />}
      actions={
        <>
          <PageAction variant="secondary">Results summary</PageAction>
          <span
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 4,
              border: '1px solid var(--ot-border)',
              color: 'var(--ot-ink-2)',
              background: 'var(--ot-surface)',
            }}
          >
            <KebabIcon width={16} height={16} />
          </span>
        </>
      }
    />
  )
}

// Left metadata rail — stacked label/value pairs with edit pencils, per the
// reference skeleton. The one-line detail the audience should catch: where
// today's rail says "Workflow: Ryan Workflow", ours says
// "✦ Fulfilled by Privacy Agent".
function MetaRail() {
  return (
    <div style={{ width: 230, flexShrink: 0 }}>
      <RailRow label="Data subject" value={marcus.subject} editable />
      <RailRow label="Request type" value={`${marcus.type} request`} editable />
      <RailRow
        label="Jurisdiction"
        value={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {marcus.jurisdiction}
            <GroundingChip label={marcus.regulation} />
          </span>
        }
      />
      <RailRow label="Received" value={formatDate(marcus.received)} />
      <RailRow label="Deadline" value={`${marcus.daysRemaining} days remaining`} />
      <RailRow label="Preferred language" value="English (US)" editable />
      <div style={{ padding: '12px 0' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            font: '600 13px "Open Sans", sans-serif',
            color: 'var(--ot-agent)',
          }}
        >
          <AgentMark size={13} />
          Fulfilled by Privacy Agent
        </span>
      </div>
    </div>
  )
}

function RailRow({ label, value, editable }) {
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--ot-border)' }}>
      <div style={{ font: '600 12.5px "Open Sans", sans-serif', color: 'var(--ot-ink-2)', marginBottom: 3 }}>
        {label}:
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          font: 'var(--fs-body)',
          color: 'var(--ot-ink)',
        }}
      >
        <span style={{ minWidth: 0 }}>{value}</span>
        {editable && (
          <span aria-hidden="true" style={{ color: 'var(--ot-ink-3)', display: 'flex', flexShrink: 0 }}>
            <PencilIcon width={14} height={14} />
          </span>
        )}
      </div>
    </div>
  )
}

const TABS = ['Workflow', 'Activity', 'Request']

function Tabs({ tab, onSelect }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-6)',
        borderBottom: '1px solid var(--ot-border)',
        marginBottom: 'var(--space-4)',
      }}
    >
      {TABS.map((t) => {
        const active = t === tab
        return (
          <button
            key={t}
            onClick={() => onSelect(t)}
            style={{
              padding: '8px 2px 10px',
              border: 'none',
              borderBottom: `2px solid ${active ? 'var(--ot-green)' : 'transparent'}`,
              marginBottom: -1,
              background: 'none',
              color: active ? 'var(--ot-ink)' : 'var(--ot-ink-2)',
              font: `${active ? 600 : 400} 14px "Open Sans", sans-serif`,
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        )
      })}
    </div>
  )
}

// --- Workflow tab: selected workflow + its steps (left), reasoning (right) --

function WorkflowTab({ beat }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {beat >= 1 && (
          <>
            <SelectedWorkflowCard />
            <WorkflowStepsPanel beat={beat} />
          </>
        )}
      </div>
      <ReasoningPanel beat={beat} />
    </div>
  )
}

// The workflow this request is running — one of the four drafted at Act
// 1's capstone (beat 10, WorkflowsScene), looked up by marcus.type
// ("Access"). Ties the two capstones together: what was generated there
// is what's executing here.
function SelectedWorkflowCard() {
  const workflow = getWorkflowByName(marcus.type)
  if (!workflow) return null
  return (
    <div
      className="anim-enter"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-3) var(--space-4)',
        marginBottom: 'var(--space-4)',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          flexShrink: 0,
          background: '#f4f3f3',
          borderRadius: 6,
        }}
      >
        <img src="/figma/chart-diagram.svg" alt="" width="16" height="16" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)', marginBottom: 2 }}>
          Workflow · selected from Generated workflows
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span style={{ font: '600 14px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>{workflow.name}</span>
          <GroundingChip label={workflow.requestType} />
        </div>
        <div style={{ font: '400 12.5px/18px "Open Sans", sans-serif', color: 'var(--ot-ink-3)', marginTop: 2 }}>
          {workflow.description}
        </div>
      </div>
      <StatusPill status="In progress" />
    </div>
  )
}

// Per-beat step state. Before the fast-forward (beat 6) the agent is
// mid-flight: step 1 running, the rest planned. At beat 6 the fixture
// statuses land — steps 1–4 done (with timestamps), step 5 awaiting human
// and flagged for privacy review.
function itemState(item, beat) {
  if (beat < 6) {
    return item.id === 1 ? { status: 'Running' } : { status: 'Planned' }
  }
  if (item.status === 'done') return { status: 'Done', timestamp: formatDateTime(item.completedAt), note: item.note }
  if (item.status === 'awaitingHuman') {
    return { status: 'Awaiting human', detail: `In progress with ${item.assignee}`, flag: item.flag }
  }
  return { status: 'Planned' }
}

function WorkflowStepsPanel({ beat }) {
  const navigate = useNavigate()

  return (
    <div
      style={{
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-2) 0',
      }}
    >
      {marcus.plan.map((item, i) => {
        const Icon = PLAN_ICONS[item.system] || DocumentIcon
        const s = itemState(item, beat)
        return (
          <div
            key={item.id}
            className="anim-enter"
            style={{
              '--stagger-i': i,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: '14px var(--space-4)',
              borderBottom: i < marcus.plan.length - 1 ? '1px solid var(--ot-border)' : 'none',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                flexShrink: 0,
                borderRadius: 'var(--radius-control)',
                background: s.status === 'Running' ? 'var(--ot-agent-tint)' : 'var(--ot-bg)',
                color: s.status === 'Running' ? 'var(--ot-agent)' : 'var(--ot-ink-2)',
              }}
            >
              <Icon width={18} height={18} />
            </span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <span style={{ font: '600 14px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>
                  {item.title}
                </span>
                <GroundingChip label={item.system} />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {item.grounding.map((g) => (
                  <GroundingChip key={g} label={g} />
                ))}
              </div>
              {s.status === 'Running' && <div className="agent-shimmer" style={{ marginTop: 10, width: 120 }} />}
            </div>

            {/* Keyed by beat-phase so the fast-forward flip re-enters with a
                stagger — status flips land 450ms apart, visibly (README #3). */}
            <div
              key={`${item.id}-${beat >= 5 ? 'ff' : 'pre'}`}
              className={beat >= 5 ? 'anim-enter' : undefined}
              style={{
                '--stagger-i': i,
                '--stagger-step': '450ms',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 4,
                flexShrink: 0,
              }}
            >
              <StatusPill status={s.status} />
              {s.timestamp && (
                <span style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)' }}>{s.timestamp}</span>
              )}
              {s.detail && (
                <span style={{ font: 'var(--fs-meta)', color: 'var(--ot-warn)' }}>{s.detail}</span>
              )}
              {s.flag && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    font: '600 11px "Open Sans", sans-serif',
                    color: 'var(--ot-danger)',
                    textAlign: 'right',
                    maxWidth: 200,
                  }}
                >
                  <WarningIcon width={12} height={12} style={{ flexShrink: 0 }} />
                  {s.flag}
                </span>
              )}
              {s.note && (
                <button
                  onClick={() => navigate('/requests/4207/redaction')}
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    font: '600 12.5px "Open Sans", sans-serif',
                    color: 'var(--ot-link)',
                    cursor: 'pointer',
                  }}
                >
                  {s.note}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// --- Reasoning panel ---------------------------------------------------------

// Verbatim from 03_demo_script.md Act 3, CUE 2–4. Audit register: no
// avatars, no chat bubbles — short lines, each carrying its source chip.
const REASONING = [
  {
    title: 'Classification',
    beat: 3,
    lines: [
      { text: 'Access request · Consumer · California resident → CCPA/CPRA governs' },
      { text: 'Verified: Marcus is an active Northwind customer and Alpine Rewards member' },
    ],
    chips: ['CCPA/CPRA', 'Intake AR-4207'],
  },
  {
    title: 'Obligations',
    beat: 4,
    lines: [
      { text: 'Verify identity before disclosure', chip: 'CCPA §1798.130' },
      { text: 'Respond within 45 days (one 45-day extension available)', chip: 'CCPA §1798.130' },
      {
        text: 'Disclose: categories, sources, purposes, third parties, and specific pieces of personal information',
        chip: 'CCPA §1798.110',
      },
    ],
  },
  {
    title: 'Your context',
    beat: 5,
    lines: [
      { text: "Marcus's data lives in: Salesforce, Marketo, Zendesk, internal warehouse", chip: 'Customer Data Flows' },
      {
        text: 'Support transcripts require third-party redaction with privacy sign-off before disclosure',
        chip: 'SOP §4.2',
      },
      {
        text: "Response follows Meridian letter structure, plain and warm, in the requester's language",
        chip: 'Brand + Tone Guide',
      },
    ],
  },
]

function ReasoningPanel({ beat }) {
  // Cues open sections in sequence; after that they stay freely
  // click-toggleable ([CUE] then [CLICK]). User toggles reset on beat
  // change so stepping back always reproduces the scripted state.
  const [overrides, setOverrides] = useState({})
  useEffect(() => setOverrides({}), [beat])

  return (
    <div
      style={{
        width: 400,
        flexShrink: 0,
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          font: 'var(--fs-section)',
          color: 'var(--ot-ink)',
          paddingBottom: 'var(--space-3)',
          borderBottom: '1px solid var(--ot-border)',
        }}
      >
        <AgentMark size={15} />
        How I planned this request
      </div>

      {REASONING.map((section) => {
        const open = overrides[section.title] ?? beat >= section.beat
        return (
          <div key={section.title} style={{ borderBottom: '1px solid var(--ot-border)' }}>
            <button
              onClick={() => setOverrides((o) => ({ ...o, [section.title]: !open }))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '12px 0',
                border: 'none',
                background: 'none',
                font: '600 14px "Open Sans", sans-serif',
                color: 'var(--ot-ink)',
                cursor: 'pointer',
              }}
            >
              {section.title}
              <span style={{ color: 'var(--ot-ink-3)', display: 'flex' }}>
                {open ? <ChevronDownIcon width={16} height={16} /> : <ChevronRightIcon width={16} height={16} />}
              </span>
            </button>
            {open && (
              <div className="anim-enter" style={{ paddingBottom: 'var(--space-3)' }}>
                {section.lines.map((line) => (
                  <div key={line.text} style={{ padding: '5px 0' }}>
                    <span style={{ font: '400 13.5px/1.5 "Open Sans", sans-serif', color: 'var(--ot-ink-2)' }}>
                      {line.text}
                    </span>
                    {line.chip && (
                      <span style={{ marginLeft: 8 }}>
                        <GroundingChip label={line.chip} />
                      </span>
                    )}
                  </div>
                ))}
                {section.chips && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    {section.chips.map((c) => (
                      <GroundingChip key={c} label={c} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// --- Request tab: the original submission, fixture values only ---------------

function RequestTab() {
  const rows = [
    ['Request ID', marcus.requestId],
    ['Data subject', marcus.subject],
    ['Email', marcus.email],
    ['Customer ID', marcus.customerId],
    ['Request type', `${marcus.type} request`],
    ['Jurisdiction', `${marcus.jurisdiction} (${marcus.regulation})`],
    ['Received', formatDate(marcus.received)],
    [
      marcus.loyalty.program,
      `${marcus.loyalty.points.toLocaleString('en-US')} points · Member since ${formatDate(marcus.loyalty.memberSince)}`,
    ],
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div
        style={{
          background: 'var(--ot-surface)',
          border: '1px solid var(--ot-border)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-2) var(--space-4)',
        }}
      >
        {rows.map(([label, value], i) => (
          <div
            key={label}
            style={{
              display: 'flex',
              padding: '10px 0',
              borderBottom: i < rows.length - 1 ? '1px solid var(--ot-border)' : 'none',
              font: 'var(--fs-body)',
            }}
          >
            <span style={{ width: 180, flexShrink: 0, color: 'var(--ot-ink-2)', fontWeight: 600, fontSize: 12.5 }}>
              {label}:
            </span>
            <span style={{ color: 'var(--ot-ink)' }}>{value}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          background: 'var(--ot-danger-tint)',
          border: '1px solid rgba(192, 57, 43, 0.3)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <span aria-hidden="true" style={{ display: 'flex', color: 'var(--ot-danger)' }}>
            <WarningIcon width={18} height={18} />
          </span>
          <h3 style={{ margin: 0, font: '600 14px "Open Sans", sans-serif', color: 'var(--ot-danger)' }}>
            Suspected Agent Detection
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ font: '600 12px "Open Sans", sans-serif', color: 'var(--ot-ink-2)', marginBottom: 'var(--space-1)' }}>
                Risky IP from submission
              </div>
              <div style={{ font: '13px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>
                203.142.65.87
              </div>
              <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)', marginTop: '4px' }}>
                Last seen: Recently flagged
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ font: '600 12px "Open Sans", sans-serif', color: 'var(--ot-ink-2)', marginBottom: 'var(--space-1)' }}>
                Multiple requests from IP
              </div>
              <div style={{ font: '13px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>
                12 requests
              </div>
              <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)', marginTop: '4px' }}>
                Past 7 days
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ font: '600 12px "Open Sans", sans-serif', color: 'var(--ot-ink-2)', marginBottom: 'var(--space-1)' }}>
                Rate of submission
              </div>
              <div style={{ font: '13px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>
                1.7 per day
              </div>
              <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-3)', marginTop: '4px' }}>
                Unusual pattern
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
