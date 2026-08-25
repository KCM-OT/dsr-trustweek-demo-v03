import { useNavigate } from 'react-router-dom'
import { useSceneBeats } from '../../cue/CueContext'
import { StatusPill } from '../../components/StatusPill'
import { PageHeader, PageBody, PageAction } from '../../shell/PageHeader'

// Act 1 capstone, beat 10 — the flow chart's four lanes (opt-out, access,
// deletion, correction — src/scenes/act1/FlowChartScene.jsx LANE_TAGS)
// turned into individually reviewable workflow drafts. Same generated-content
// beat as the flow chart itself, just the list view of the same output: a
// human still has to open and approve each one, hence every row starts
// "Ready for review" rather than live.

const WORKFLOWS = [
  {
    id: 'wf-opt-out',
    name: 'Opt-out',
    requestType: 'Do Not Sell/Share, Opt-out of marketing',
    systems: ['Marketo'],
    steps: 1,
    description: 'Suppress marketing preferences across systems',
  },
  {
    id: 'wf-access',
    name: 'Access',
    requestType: 'Access / Know',
    systems: ['Internal warehouse', 'Salesforce', 'Marketo', 'Zendesk'],
    steps: 6,
    description: 'Retrieve, redact, and review personal data before delivery',
  },
  {
    id: 'wf-deletion',
    name: 'Deletion',
    requestType: 'Delete',
    systems: ['Salesforce', 'Marketo', 'Zendesk', 'Internal warehouse', 'Legal'],
    steps: 5,
    description: 'Delete data across all systems; route edge cases to legal',
  },
  {
    id: 'wf-correction',
    name: 'Correction',
    requestType: 'Correct',
    systems: ['Salesforce', 'Marketo', 'Zendesk'],
    steps: 4,
    description: 'Validate, update, and confirm source records where data lives',
  },
]

const cardStyle = {
  background: 'var(--ot-surface)',
  border: '1px solid var(--ot-border)',
  borderRadius: 'var(--radius-card)',
}

const cellStyle = {
  padding: '14px var(--space-4)',
  borderBottom: '1px solid var(--ot-border)',
  font: 'var(--fs-body)',
  color: 'var(--ot-ink)',
  verticalAlign: 'top',
}

const COLUMNS = ['Workflow', 'Request type', 'Systems', 'Steps', 'Status']

export function WorkflowsScene() {
  const navigate = useNavigate()
  // Single-beat [CLICK] scene between the flow chart and Act 2: advancing
  // continues the demo into the Meridian intake agent; stepping back
  // returns to the flow chart's single beat.
  useSceneBeats(
    'setup-workflows',
    'Generated workflows',
    ['Workflows generated'],
    () => navigate('/intake'),
    () => navigate('/setup/flow')
  )

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: 'Setup', to: '/setup' }, { label: 'Privacy Agent', to: '/setup/flow' }, { label: 'Generated workflows' }]}
        title="Generated workflows"
        description="Four request-type workflows, drafted from your flow chart. Review each before publishing."
        actions={<PageAction>Review all</PageAction>}
      />
      <PageBody measure>
        <div style={cardStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    style={{
                      textAlign: 'left',
                      padding: '10px var(--space-4)',
                      font: '600 12.5px "Open Sans", sans-serif',
                      color: 'var(--ot-ink-2)',
                      borderBottom: '1px solid var(--ot-border)',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WORKFLOWS.map((wf) => (
                <tr key={wf.id}>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          flexShrink: 0,
                          background: '#f4f3f3',
                          borderRadius: 6,
                        }}
                      >
                        <img src="/figma/chart-diagram.svg" alt="" width="16" height="16" />
                      </span>
                      <div>
                        <div style={{ font: '600 14px/20px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>{wf.name}</div>
                        <div style={{ font: '400 12.5px/18px "Open Sans", sans-serif', color: 'var(--ot-ink-3)' }}>{wf.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={cellStyle}>{wf.requestType}</td>
                  <td style={cellStyle}>{wf.systems.join(', ')}</td>
                  <td style={cellStyle}>{wf.steps}</td>
                  <td style={cellStyle}>
                    <StatusPill status="Ready for review" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageBody>
    </div>
  )
}
