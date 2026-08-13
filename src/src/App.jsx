import { Navigate, Route, Routes } from 'react-router-dom'
import { CueProvider } from './cue/CueContext'
import { CueOverlay } from './cue/CueOverlay'
import { PrototypeNavigator } from './cue/PrototypeNavigator'
import { useCueKeyboard } from './cue/useCueKeyboard'
import { AppShell } from './shell/AppShell'
import { SCENES } from './scenes/sceneMap'
import { IntakeScene } from './scenes/IntakeScene'
import { BlankScene } from './scenes/BlankScene'
import { DemoStateProvider } from './state/DemoStateContext'
import { SetupScene } from './scenes/act1/SetupScene'
import { FlowChartScene } from './scenes/act1/FlowChartScene'
import { RequestsListScene } from './scenes/RequestsListScene'
import { RequestDetailScene } from './scenes/act3/RequestDetailScene'
import { SplitScreenScene } from './scenes/act3/SplitScreenScene'
import { RedactionScene } from './scenes/act3/RedactionScene'
import { DashboardScene } from './scenes/act4/DashboardScene'
import { ReportScene } from './scenes/ReportScene'
import { ReportsScene, SubtasksScene, SettingsScene } from './scenes/ModulePlaceholders'
import { BrandPreview } from './brand/BrandPreview'

const STANDALONE_COMPONENTS = {
  intake: IntakeScene,
  blank: BlankScene,
}

// Every scene in the map now has a real component (Session 4 retired the
// last Session-1 stubs — Reports/Subtasks/Settings render the minimal
// fixture-derived module pages).
const SHELL_COMPONENTS = {
  setup: SetupScene,
  'setup-flow': FlowChartScene,
  'requests-list': RequestsListScene,
  'request-detail': RequestDetailScene,
  'request-subtask': SplitScreenScene,
  'request-redaction': RedactionScene,
  dashboard: DashboardScene,
  report: ReportScene,
  reports: ReportsScene,
  subtasks: SubtasksScene,
  settings: SettingsScene,
}

export default function App() {
  return (
    <CueProvider>
      <DemoStateProvider>
        <CueLayer />
      </DemoStateProvider>
    </CueProvider>
  )
}

// Split out so useCueKeyboard/useCue run inside the CueProvider.
function CueLayer() {
  useCueKeyboard()
  const shellScenes = SCENES.filter((s) => s.shell)
  const standaloneScenes = SCENES.filter((s) => !s.shell)

  return (
    <>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/setup" replace />} />
          {shellScenes.map((scene) => {
            const Component = SHELL_COMPONENTS[scene.id]
            return <Route key={scene.id} path={scene.route.slice(1)} element={<Component />} />
          })}
        </Route>
        {/* Dev-only brand proof sheet — outside the scene map on purpose. */}
        <Route path="/brand" element={<BrandPreview />} />
        {standaloneScenes.map((scene) => {
          const Component = STANDALONE_COMPONENTS[scene.id]
          return <Route key={scene.id} path={scene.route} element={<Component />} />
        })}
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
      <PrototypeNavigator />
      <CueOverlay />
    </>
  )
}
