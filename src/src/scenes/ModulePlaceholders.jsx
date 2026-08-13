import { Link } from 'react-router-dom'
import { tenant, marcus } from '../data/fixtures'
import { useSceneBeats } from '../cue/CueContext'
import { StatusPill } from '../components/StatusPill'
import { GroundingChip } from '../components/GroundingChip'

// Reports / Subtasks / Settings — the sidebar items 02 §1 marks "present
// for authenticity, not part of the demo path." Session 1's stub text
// ("Skeleton scene — not yet built") violated §5.3 (no placeholder, no
// TODO) if anyone clicked them on stage; these are the minimal real
// replacements: page-header grammar + fixture-derived content only. The
// one-line descriptions are composed-structural (flagged in PROGRESS) —
// the spec names these surfaces but scripts no strings for them.

function PageHeader({ title, description, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
      <div>
        <h1 style={{ font: 'var(--fs-page-title)', color: 'var(--ot-ink)' }}>{title}</h1>
        <p style={{ font: 'var(--fs-body)', color: 'var(--ot-ink-2)', marginTop: 4 }}>{description}</p>
      </div>
      {action && (
        <button
          style={{
            flexShrink: 0,
            padding: '9px 16px',
            borderRadius: 'var(--radius-control)',
            border: 'none',
            background: 'var(--ot-green)',
            color: '#fff',
            font: '600 14px "Open Sans", sans-serif',
            cursor: 'pointer',
          }}
        >
          {action}
        </button>
      )}
    </div>
  )
}

const card = {
  background: 'var(--ot-surface)',
  border: '1px solid var(--ot-border)',
  borderRadius: 'var(--radius-card)',
}

export function ReportsScene() {
  useSceneBeats('reports', 'Reports', ['Overview'])
  return (
    <div style={{ padding: 'var(--space-8)' }}>
      <PageHeader title="Reports" description="Program reporting across requests and subtasks." action="Create report" />
      <div style={{ ...card, padding: 'var(--space-8)', textAlign: 'center' }}>
        <p style={{ font: 'var(--fs-body)', color: 'var(--ot-ink-2)' }}>No reports yet.</p>
      </div>
    </div>
  )
}

export function SubtasksScene() {
  useSceneBeats('subtasks', 'Subtasks', ['Overview'])
  // The one real subtask in the demo world — fixtures §marcus.plan item 5
  // (the warehouse extract Act 3 walks through), shown post-completion.
  const sub = marcus.plan.find((p) => p.system === 'Internal warehouse')
  return (
    <div style={{ padding: 'var(--space-8)' }}>
      <PageHeader title="Subtasks" description="Work routed to people outside the privacy team." />
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Subtask', 'Assignee', 'Linked ticket', 'Request', 'Status'].map((c) => (
                <th key={c} style={{ textAlign: 'left', padding: '10px var(--space-4)', font: '600 12.5px "Open Sans", sans-serif', color: 'var(--ot-ink-2)', borderBottom: '1px solid var(--ot-border)' }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: 52 }}>
              <td style={cell}>{sub.title}</td>
              <td style={cell}>{sub.assignee} · Data Platform Engineering</td>
              <td style={cell}>
                <GroundingChip label={sub.ticket} />
              </td>
              <td style={cell}>
                <Link to="/requests/4207" style={{ color: 'var(--ot-link)', textDecoration: 'none' }}>
                  {marcus.requestId}
                </Link>
              </td>
              <td style={cell}>
                <StatusPill status="Complete" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const cell = { padding: '0 var(--space-4)', font: 'var(--fs-body)', color: 'var(--ot-ink)' }

export function SettingsScene() {
  useSceneBeats('settings', 'Settings', ['Overview'])
  return (
    <div style={{ padding: 'var(--space-8)', maxWidth: 760 }}>
      <PageHeader title="Settings" description="Module configuration for Privacy Rights Automation." />
      <div style={{ ...card, padding: 'var(--space-2) var(--space-6)' }}>
        <SettingRow label="Organization">{tenant.company}</SettingRow>
        <SettingRow label="Privacy program lead">
          {tenant.admin.name} · {tenant.admin.role}
        </SettingRow>
        <SettingRow label="Regulations in scope">
          <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>
            {tenant.regulations.map((r) => (
              <GroundingChip key={r} label={r} />
            ))}
          </span>
        </SettingRow>
        <SettingRow label="Connected systems" last>
          <div style={{ display: 'grid', gap: 8 }}>
            {tenant.systems.map((s) => (
              <span key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 140 }}>{s.name}</span>
                <StatusPill status={s.integration === 'connected' ? 'Connected' : 'No integration'} />
              </span>
            ))}
          </div>
        </SettingRow>
      </div>
    </div>
  )
}

function SettingRow({ label, children, last }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-6)',
        padding: 'var(--space-4) 0',
        borderBottom: last ? 'none' : '1px solid var(--ot-border)',
        font: 'var(--fs-body)',
      }}
    >
      <span style={{ width: 190, flexShrink: 0, color: 'var(--ot-ink-2)' }}>{label}</span>
      <span style={{ color: 'var(--ot-ink)', flex: 1 }}>{children}</span>
    </div>
  )
}
