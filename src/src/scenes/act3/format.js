// Display formatting for fixture dates — follows the script's own
// convention (03_demo_script.md: "Complete · Jul 10, 2:14 PM",
// "Received Jul 8"). Fixture timestamps are local-naive ISO strings.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parts(iso) {
  const [date, time] = iso.split('T')
  const [y, m, d] = date.split('-').map(Number)
  let hh = 0
  let mm = 0
  if (time) [hh, mm] = time.split(':').map(Number)
  return { y, m, d, hh, mm }
}

// "2026-07-08" → "Jul 8"; withYear: "2024-02-09" → "Feb 9, 2024"
export function formatDate(iso, { withYear = false } = {}) {
  const { y, m, d } = parts(iso)
  return withYear ? `${MONTHS[m - 1]} ${d}, ${y}` : `${MONTHS[m - 1]} ${d}`
}

// "2026-07-10T14:14" → "Jul 10, 2:14 PM"
export function formatDateTime(iso) {
  const { m, d, hh, mm } = parts(iso)
  const ampm = hh >= 12 ? 'PM' : 'AM'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${MONTHS[m - 1]} ${d}, ${h12}:${String(mm).padStart(2, '0')} ${ampm}`
}

// "2026-07-10T14:14" → "2:14 PM" (Teams message timestamps)
export function formatTime(iso) {
  const { hh, mm } = parts(iso)
  const ampm = hh >= 12 ? 'PM' : 'AM'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${String(mm).padStart(2, '0')} ${ampm}`
}
