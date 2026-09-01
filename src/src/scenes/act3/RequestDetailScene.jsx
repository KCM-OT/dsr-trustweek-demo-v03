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
  'Initial state',
  'Workflow steps appear (staggered)',
  'Fast-forward — items 1–4 done, item 5 flagged for privacy review',
  'Hand off → split screen',
]

const HANDOFF_BEAT = 3
// The workflow's steps are pre-determined by the matched workflow itself
// (data/workflows.js), not "planned" per request — so this scene has no
// separate reasoning/plan-explanation beat. Fast-forward now lands one
// beat earlier than before. The scene opens directly on the Workflow tab's
// initial state (no separate Request-tab beat ahead of it).
const FAST_FORWARD_BEAT = 2

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

// --- Workflow tab: selected workflow + its steps ---------------------------
// The workflow determines the steps and tasks a request runs — there's no
// separate "how I planned this" explanation, since the steps aren't planned
// per request, they come from the matched workflow (data/workflows.js).

function WorkflowTab({ beat }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <SelectedWorkflowCard />
      <WorkflowStageChevron beat={beat} />
      <WorkflowStepsPanel beat={beat} />
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

// Which stage the request is currently on, 0-indexed into marcus.plan —
// the first item that isn't Done yet (or the last item, once everything
// is). Shared by the stage chevron (shows the whole workflow's stages)
// and the steps panel (shows only the subtasks added so far, stage by
// stage — see WorkflowStepsPanel).
function currentStageIndex(beat) {
  const states = marcus.plan.map((item) => itemState(item, beat).status)
  const i = states.findIndex((s) => s !== 'Done')
  return i === -1 ? marcus.plan.length - 1 : i
}

// Stage bar — occupies the same "where is this request in its process"
// role as the legacy blue chevron stage bar this scene's skeleton is based
// on, just driven by the matched workflow's steps (marcus.plan) instead of
// a fixed New/In Progress/Closed lifecycle: one chevron per step, done
// steps green, the current step blue, everything ahead outlined gray.
function WorkflowStageChevron({ beat }) {
  const total = marcus.plan.length
  const states = marcus.plan.map((item) => itemState(item, beat).status)
  const currentIndex = currentStageIndex(beat)
  const currentItem = marcus.plan[currentIndex]

  return (
    <div className="anim-enter" style={{ marginBottom: 'var(--space-4)' }}>
      <div style={{ display: 'flex', gap: 3, height: 30 }}>
        {marcus.plan.map((item, i) => {
          const done = states[i] === 'Done'
          const current = i === currentIndex
          const clipPath =
            total === 1
              ? undefined
              : i === 0
                ? 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
                : i === total - 1
                  ? 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 0 50%)'
                  : 'polygon(15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%, 0 50%)'
          return (
            <div
              key={item.id}
              title={item.title}
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                clipPath,
                background: done ? 'var(--ot-green)' : current ? 'var(--ot-link)' : 'var(--ot-bg)',
                border: done || current ? 'none' : '1px solid var(--ot-border)',
                color: done || current ? '#fff' : 'var(--ot-ink-3)',
                font: '600 12px "Open Sans", sans-serif',
              }}
            >
              {i + 1}
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 6, font: 'var(--fs-meta)', color: 'var(--ot-ink-2)' }}>
        Step {currentIndex + 1} of {total} ·{' '}
        <span style={{ color: 'var(--ot-link)', fontWeight: 600 }}>{currentItem.title}</span>
      </div>
    </div>
  )
}

// Per-beat step state. Before the fast-forward the agent is mid-flight:
// step 1 running, the rest planned. At FAST_FORWARD_BEAT the fixture
// statuses land — steps 1–4 done (with timestamps), step 5 awaiting human
// and flagged for privacy review.
function itemState(item, beat) {
  if (beat < FAST_FORWARD_BEAT) {
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

  // Subtasks are tied to the workflow's current stage: only the tasks up
  // through the stage the request has reached are visible, so at stage 1
  // just "Verify identity" shows. Fast-forwarding to stage 5 reveals the
  // stages 2–4 subtasks (Salesforce, Marketo, Zendesk) along with it, as
  // if they'd been added one by one on the way there.
  const currentIndex = currentStageIndex(beat)
  const visiblePlan = marcus.plan.slice(0, currentIndex + 1)

  return (
    <div
      style={{
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-2) 0',
      }}
    >
      {visiblePlan.map((item, i) => {
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
              borderBottom: i < visiblePlan.length - 1 ? '1px solid var(--ot-border)' : 'none',
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
              key={`${item.id}-${beat >= FAST_FORWARD_BEAT ? 'ff' : 'pre'}`}
              className={beat >= FAST_FORWARD_BEAT ? 'anim-enter' : undefined}
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
