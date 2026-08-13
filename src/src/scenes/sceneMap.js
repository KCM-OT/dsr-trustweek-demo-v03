// Scene map — mirrors 01_build_spec.md §0 "Scene map" table. Route is the
// single source of truth for navigation; nav rail, presenter number-keys,
// and the cue overlay all read from this list rather than hardcoding paths.

export const SCENES = [
  {
    id: 'setup',
    route: '/setup',
    label: 'Agent Setup',
    act: 'Act 1',
    shell: true,
    navLabel: 'Setup',
    numberKey: '1',
  },
  {
    id: 'setup-flow',
    route: '/setup/flow',
    label: 'Generated flow chart',
    act: 'Act 1 capstone',
    shell: true,
  },
  {
    id: 'intake',
    route: '/intake',
    label: 'Meridian intake agent',
    act: 'Act 2',
    shell: false, // zero OneTrust chrome — consumer-facing Meridian brand
    numberKey: '2',
  },
  {
    id: 'requests-list',
    route: '/requests',
    label: 'Requests',
    act: 'Act 3',
    shell: true,
    navLabel: 'Requests',
    numberKey: '3',
  },
  {
    id: 'request-detail',
    route: '/requests/4207',
    label: 'Request detail — Marcus Bell',
    act: 'Act 3',
    shell: true,
  },
  {
    id: 'request-subtask',
    route: '/requests/4207/subtask',
    label: 'Split-screen (OT + Teams + ServiceNow)',
    act: 'Act 3',
    shell: true,
  },
  {
    id: 'request-redaction',
    route: '/requests/4207/redaction',
    label: 'Redaction summary',
    act: 'Act 3',
    shell: true,
  },
  {
    id: 'dashboard',
    route: '/dashboard',
    label: 'Program dashboard',
    act: 'Act 4',
    shell: true,
    navLabel: 'Dashboard',
    numberKey: '4',
  },
  {
    id: 'report',
    route: '/report',
    label: 'PDF report viewer',
    act: 'Act 3/5',
    shell: true,
    numberKey: '5',
  },
  {
    id: 'blank',
    route: '/blank',
    label: 'Blank / holding screen',
    act: 'Holding',
    shell: false,
    numberKey: '6',
  },
  // Reports and Subtasks are real module sidebar items (02_design_system.md
  // §1) but "route to simple placeholder scenes — present for authenticity,
  // not part of the demo path."
  {
    id: 'reports',
    route: '/reports',
    label: 'Reports',
    act: null,
    shell: true,
    navLabel: 'Reports',
  },
  {
    id: 'subtasks',
    route: '/subtasks',
    label: 'Subtasks',
    act: null,
    shell: true,
    navLabel: 'Subtasks',
  },
  {
    id: 'settings',
    route: '/settings',
    label: 'Settings',
    act: null,
    shell: true,
    navLabel: 'Settings',
  },
]

// Real module sidebar order (02_design_system.md §1): Dashboard, Reports,
// Requests, Subtasks, Setup, Settings — independent of SCENES declaration
// order above.
const NAV_ORDER = ['Dashboard', 'Reports', 'Requests', 'Subtasks', 'Setup', 'Settings']

export const NAV_ITEMS = SCENES.filter((s) => s.navLabel).sort(
  (a, b) => NAV_ORDER.indexOf(a.navLabel) - NAV_ORDER.indexOf(b.navLabel)
)

export const NUMBER_KEY_ROUTES = SCENES.filter((s) => s.numberKey).reduce(
  (acc, s) => ({ ...acc, [s.numberKey]: s.route }),
  {}
)

export function sceneByRoute(route) {
  return SCENES.find((s) => s.route === route)
}
