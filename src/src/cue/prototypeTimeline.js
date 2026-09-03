const JOURNEY_SCENES = [
  {
    sceneId: 'setup',
    route: '/setup',
    act: 'Act 1',
    sceneLabel: 'Agent Setup',
    tone: 'agent',
    beats: [
      'Initial state',
      'Greeting + profile card',
      'Document request',
      'Uploads appear',
      'Decomposed playbook',
      'Intake agent proposal',
      'Systems & integrations',
      'Handoff to flow chart',
    ],
  },
  {
    sceneId: 'setup-flow',
    route: '/setup/flow',
    act: 'Act 1',
    sceneLabel: 'Generated flow chart',
    tone: 'agent',
    beats: ['Flow chart (interactive)', 'Agent escalates high-risk requests to Legal'],
  },
  {
    sceneId: 'setup-workflows',
    route: '/setup/workflows',
    act: 'Act 1',
    sceneLabel: 'Generated workflows',
    tone: 'agent',
    beats: ['Workflows generated'],
  },
  {
    sceneId: 'intake',
    route: '/intake',
    act: 'Act 2',
    sceneLabel: 'Meridian intake agent',
    tone: 'meridian',
    beats: ['Initial state', 'Identity autofilled', 'Assistant exchange', 'California note + submit'],
  },
  {
    sceneId: 'request-detail',
    route: '/requests/4207',
    act: 'Act 3',
    sceneLabel: 'Request detail',
    tone: 'platform',
    beats: [
      'Request tab, initial state',
      'Transition to Workflow tab (steps appear)',
      'Items 1–4 complete',
      'Handoff to split screen',
    ],
  },
  {
    sceneId: 'request-subtask',
    route: '/requests/4207/subtask',
    act: 'Act 3',
    sceneLabel: 'Agent collaboration',
    tone: 'collaboration',
    beats: ['Initial state', 'Agent asks in Teams', "Daniel's question", "Agent's answer", 'Extract returned', 'Systems synchronize'],
  },
  {
    sceneId: 'request-redaction',
    route: '/requests/4207/redaction',
    act: 'Act 3',
    sceneLabel: 'Redaction summary',
    tone: 'platform',
    beats: ['Awaiting privacy sign-off', 'Report ready'],
  },
  {
    sceneId: 'report',
    route: '/report',
    act: 'Act 3/5',
    sceneLabel: 'PDF report viewer',
    tone: 'report',
    beats: [
      'Page 1 · Cover',
      'Page 2 · A letter, not a form',
      'Page 3 · What we collect and why',
      'Page 4 · Sources, purposes, sharing',
      'Page 5 · Profile & accounts',
      'Page 6 · Alpine Rewards history',
      'Page 7 · Orders & transactions',
      'Page 8 · Marketing & support history',
      'Page 9 · What you can do next',
    ],
  },
  {
    sceneId: 'dashboard',
    route: '/dashboard',
    act: 'Act 4',
    sceneLabel: 'Program dashboard',
    tone: 'dashboard',
    beats: [
      'Dashboard overview',
      'Needs your attention',
      'Compare duplicate request',
      'Reject duplicate → learn prompt',
      'Confirm learn and auto-reject',
    ],
  },
  { sceneId: 'blank', route: '/blank', act: 'Holding', sceneLabel: 'Holding screen', tone: 'meridian', beats: ['Holding'] },
]

export const PROTOTYPE_TIMELINE = JOURNEY_SCENES.flatMap((scene) =>
  scene.beats.map((beatLabel, beatIndex) => ({
    ...scene,
    beatLabel,
    beatIndex,
    id: `${scene.sceneId}-${beatIndex}`,
  }))
)

export function timelineIndexFor(sceneId, beatIndex) {
  return PROTOTYPE_TIMELINE.findIndex((step) => step.sceneId === sceneId && step.beatIndex === beatIndex)
}
