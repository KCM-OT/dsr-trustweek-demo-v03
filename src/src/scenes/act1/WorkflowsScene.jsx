import { useNavigate } from 'react-router-dom'
import { useSceneBeats } from '../../cue/CueContext'
import { StatusPill } from '../../components/StatusPill'
import { PageHeader, PageBody, PageAction } from '../../shell/PageHeader'
import { WORKFLOWS } from '../../data/workflows'

// Act 1 capstone, beat 10 — the flow chart's four lanes (opt-out, access,
// deletion, correction — src/scenes/act1/FlowChartScene.jsx LANE_TAGS)
// turned into individually reviewable workflow drafts. Same generated-content
// beat as the flow chart itself, just the list view of the same output: a
// human still has to open and approve each one, hence every row starts
// "Ready for review" rather than live.
//
// WORKFLOWS itself lives in data/workflows.js — Act 3's request detail
// (RequestDetailScene) looks the same four rows up by request type, to
// show which workflow drafted here is the one actually running a given
// request.

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
                          background: `${wf.accent}22`,
                          border: `1px solid ${wf.accent}66`,
                          borderRadius: 6,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: 16,
                            height: 16,
                            display: 'block',
                            backgroundColor: wf.accent,
                            WebkitMask: 'url("/figma/chart-diagram.svg") center / contain no-repeat',
                            mask: 'url("/figma/chart-diagram.svg") center / contain no-repeat',
                          }}
                        />
                        <span className="sr-only">{wf.name} workflow icon</span>
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
