// One consistent outline icon set — no emoji anywhere in the UI (README
// tech constraints). 20x20, 1.5px stroke, currentColor. Sidebar set matches
// the real module items (02_design_system.md §1): Dashboard, Reports,
// Requests, Subtasks, Setup, Settings.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function DashboardIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  )
}

export function ReportsIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 16.5V3.5M10 16.5V7M16 16.5v-6" />
      <path d="M3 16.5h14" />
    </svg>
  )
}

export function RequestsIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 3.5h12v13H4z" />
      <path d="M7 7.5h6M7 10.5h6M7 13.5h3.5" />
    </svg>
  )
}

export function SubtasksIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5l1.3 1.3L8 4" />
      <path d="M10.5 5h6" />
      <path d="M4 10.5l1.3 1.3L8 9" />
      <path d="M10.5 10.5h6" />
      <path d="M4 15.5l1.3 1.3L8 14" />
      <path d="M10.5 15.5h6" />
    </svg>
  )
}

export function SetupIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12.7 7.3a2.9 2.9 0 0 1-3.66 3.66l-4.5 4.5a1.3 1.3 0 0 1-1.84-1.84l4.5-4.5A2.9 2.9 0 0 1 10.86 5l-2.02 2.02.9.9L11.76 6l.94 1.3z" />
    </svg>
  )
}

export function SettingsIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="2.75" />
      <path d="M10 3.5v2M10 14.5v2M3.5 10h2M14.5 10h2M5.5 5.5l1.4 1.4M13.1 13.1l1.4 1.4M14.5 5.5l-1.4 1.4M6.9 13.1l-1.4 1.4" />
    </svg>
  )
}

export function ChevronRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7.5 4.5l5 5.5-5 5.5" />
    </svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 7.5l5.5 5 5.5-5" />
    </svg>
  )
}

// --- Top bar --------------------------------------------------------------

export function WaffleIcon(props) {
  return (
    <svg {...base} {...props}>
      {[3.5, 8.5, 13.5].flatMap((y) => [3.5, 8.5, 13.5].map((x) => ({ x, y }))).map(({ x, y }) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="currentColor" stroke="none" />
      ))}
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="8.75" cy="8.75" r="5.25" />
      <path d="M12.8 12.8L17 17" />
    </svg>
  )
}

export function BellIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 8.5a4.5 4.5 0 0 1 9 0c0 3.5 1.2 4.5 1.2 4.5H4.3s1.2-1 1.2-4.5z" />
      <path d="M8.3 15.5a1.8 1.8 0 0 0 3.4 0" />
    </svg>
  )
}

// --- Queue toolbar ----------------------------------------------------------

export function ColumnsIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="13" height="13" rx="1.5" />
      <path d="M8.3 3.5v13M12.7 3.5v13" />
    </svg>
  )
}

export function RefreshIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M15.5 8.5A5.5 5.5 0 1 0 14 12.2" />
      <path d="M15.5 4.5v4h-4" />
    </svg>
  )
}

export function FilterIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 4.5h13l-4.8 5.4v4.6l-3.4 1.6v-6.2z" />
    </svg>
  )
}

// --- Act 3 surfaces ---------------------------------------------------------

export function PencilIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 16l.7-3.2 8.6-8.6a1.55 1.55 0 0 1 2.2 0l.3.3a1.55 1.55 0 0 1 0 2.2L7.2 15.3z" />
      <path d="M12 5.5l2.5 2.5" />
    </svg>
  )
}

export function KebabIcon(props) {
  return (
    <svg {...base} {...props}>
      {[5, 10, 15].map((x) => (
        <circle key={x} cx={x} cy="10" r="1.1" fill="currentColor" stroke="none" />
      ))}
    </svg>
  )
}

export function FileIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 2.5h6l3 3v12h-9z" />
      <path d="M11.5 2.5v3h3" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10.5l4 4 8-8.5" pathLength="1" />
    </svg>
  )
}

export function PersonIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="6.5" r="3" />
      <path d="M4 17a6 6 0 0 1 12 0" />
    </svg>
  )
}

export function SendIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10l14-6.5-4 13-3.2-4.5z" />
      <path d="M9.8 12L17 3.5" />
    </svg>
  )
}

// Plan-item glyphs (request detail execution plan, build spec §3.1)
export function IdBadgeIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4" width="13" height="12" rx="1.5" />
      <circle cx="7.5" cy="9" r="1.6" />
      <path d="M5.5 13.2a2.4 2.4 0 0 1 4 0" />
      <path d="M11.5 8h3M11.5 11h3" />
    </svg>
  )
}

export function CloudIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 15.5a3.5 3.5 0 0 1-.4-6.98 4.5 4.5 0 0 1 8.7 1.06A3 3 0 0 1 14 15.5z" />
    </svg>
  )
}

export function MegaphoneIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 8.5v3l8.5 3.5v-10z" />
      <path d="M12 6.8a3.2 3.2 0 0 1 0 6.4" />
      <path d="M5.5 12v3.5" />
    </svg>
  )
}

export function HeadsetIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12v-1.5a6 6 0 0 1 12 0V12" />
      <rect x="3" y="11.5" width="3" height="4.5" rx="1.2" />
      <rect x="14" y="11.5" width="3" height="4.5" rx="1.2" />
      <path d="M16 15.5a3 3 0 0 1-3 2.5h-1.5" />
    </svg>
  )
}

export function DatabaseIcon(props) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="10" cy="5" rx="6" ry="2.4" />
      <path d="M4 5v10c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V5" />
      <path d="M4 10c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4" />
    </svg>
  )
}

export function DocumentIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 2.5h6l3 3v12h-9z" />
      <path d="M11.5 2.5v3h3" />
      <path d="M7.5 9.5h5M7.5 12.5h5" />
    </svg>
  )
}

export const NAV_ICONS = {
  Dashboard: DashboardIcon,
  Reports: ReportsIcon,
  Requests: RequestsIcon,
  Subtasks: SubtasksIcon,
  Setup: SetupIcon,
  Settings: SettingsIcon,
}
