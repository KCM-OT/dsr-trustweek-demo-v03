// Dashboard data layer (Act 4 · build spec §4.1) — every value the program
// dashboard shows is DERIVED here from fixtures §history so the timeframe
// control "actually recomputes" (spec §4.1 / acceptance §4.2), never a
// hardcoded number in the view.
//
// Model (documented in PROGRESS.md, flagged for confirmation):
//  · Received / Fulfilled = window SUMS → they visibly change as the
//    timeframe widens (satisfies "every number visibly changes"). At the
//    two 1-day views this equals the day's figures, so "Since yesterday"
//    lands the scripted hero 47 / 39.
//  · Median time to fulfil = the current rolling figure (2.1 days) with a
//    ▼61% vs-prior-30-days delta — summing medians is meaningless, so it's
//    a point-in-time metric, matching the script's "2.1 days ▼ 61%".
//  · Awaiting human = the current backlog (8), a right-now count the
//    needs-attention resolves decrement live (§4.2); constant across views.
//  · The "39, ▲ from 31/day" agent-fulfilment arc and the 5.4→2.1 median
//    fall are surfaced from fixtures §history.heroReads at the Since-
//    yesterday and 30-day views, per spec.

import { history, attention } from './fixtures'

const DAYS = history.days
const N = DAYS.length
const LATEST = DAYS[N - 1]

// Ordered timeframes for the segmented control. `days` = window length in
// trailing days ending at the latest fixture day (2026-07-10).
export const TIMEFRAMES = [
  { key: 'today', label: 'Today', days: 1 },
  { key: 'sinceYesterday', label: 'Since yesterday', days: 1 },
  { key: '7d', label: '7 days', days: 7 },
  { key: '30d', label: '30 days', days: 30 },
]

export const DEFAULT_TIMEFRAME = 'sinceYesterday'

const sum = (days, key) => days.reduce((acc, d) => acc + d[key], 0)

function windowFor(tfDays) {
  const win = DAYS.slice(Math.max(0, N - tfDays))
  const prior = N - 2 * tfDays >= 0 ? DAYS.slice(N - 2 * tfDays, N - tfDays) : null
  return { win, prior }
}

function pctDelta(now, before) {
  if (!before) return null
  const pct = Math.round(((now - before) / before) * 100)
  return { pct: Math.abs(pct), dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' }
}

// The 30-day arc anchors (spec: "the climb from 31/day avg", "5.4→2.1").
const ARC = history.heroReads.thirtyDay

// The top needs-attention item the digest names (first scripted card).
const TOP_ATTENTION = attention.find((a) => a.scripted && a.kind === 'stalled') || attention[0]

export function statsFor(key) {
  const tf = TIMEFRAMES.find((t) => t.key === key) || TIMEFRAMES[1]
  const { win, prior } = windowFor(tf.days)

  const received = sum(win, 'received')
  const fulfilled = sum(win, 'agentFulfilled')
  const awaiting = LATEST.humanInvolved // current backlog, point-in-time
  const median = LATEST.medianDays // current rolling median

  // Received: plain vs-prior-equal-period delta when the data reaches back
  // far enough (not the 30-day view — no prior 30 days exist in fixtures).
  const receivedDelta = prior
    ? { ...pctDelta(received, sum(prior, 'received')), basis: priorBasis(tf) }
    : null

  // Fulfilled: at the Since-yesterday and 30-day views the story is the
  // agent-fulfilment climb, so the delta references the 30-day-ago rate
  // (31/day → 39/day). Elsewhere it's a plain vs-prior-period delta.
  const fulfilledArc = key === 'sinceYesterday' || key === '30d'
  const fulfilledDelta = fulfilledArc
    ? { dir: 'up', text: `from ${ARC.agentFulfilledPerDayStart}/day avg`, basis: 'over 30 days' }
    : prior
      ? { ...pctDelta(fulfilled, sum(prior, 'agentFulfilled')), basis: priorBasis(tf) }
      : null

  // Median: the headline improvement — always framed against the prior
  // 30 days (5.4 → 2.1 = −61%), the way the script reads it.
  const medianPct = Math.round(((ARC.medianDaysStart - ARC.medianDaysEnd) / ARC.medianDaysStart) * 100)
  const medianDelta = { pct: medianPct, dir: 'down', basis: 'vs prior 30 days' }

  return {
    key,
    label: tf.label,
    received,
    fulfilled,
    fulfilledRate: LATEST.agentFulfilled, // 39/day, for the arc secondary
    awaiting,
    median,
    receivedDelta,
    fulfilledDelta,
    medianDelta,
    // Trend chart follows the timeframe but floors at 7 days, so the two
    // 1-day views still render a legible recent trend rather than a lone
    // bar (spec §4.1 "over the timeframe"; flagged in PROGRESS).
    chart: DAYS.slice(N - Math.max(tf.days, 7)).map((d) => ({
      date: d.date,
      agentFulfilled: d.agentFulfilled,
      humanInvolved: d.humanInvolved,
    })),
  }
}

function priorBasis(tf) {
  if (tf.days === 1) return 'vs yesterday'
  return `vs prior ${tf.days} days`
}

// Two-sentence AI-summary digest, tokenised so the banner can bold the key
// figures (02 §1 "body text with bolded key figures"). Each token is
// { t, b } — b:true renders <strong>. The Since-yesterday digest is the
// verbatim script line (spec §4.1); the others are composed in the same
// register (flagged in PROGRESS per §5.3).
export function digestFor(key, s) {
  const topReq = TOP_ATTENTION.request
  switch (key) {
    case 'today':
      return [
        { t: 'So far today, ' },
        { t: String(s.received), b: true },
        { t: ' requests came in and I fulfilled ' },
        { t: String(s.fulfilled), b: true },
        { t: ' end-to-end. ' },
        { t: String(s.awaiting), b: true },
        { t: ` need you — the top one is a deadline risk on ${topReq}.` },
      ]
    case '7d':
      return [
        { t: 'Over the last 7 days, ' },
        { t: String(s.received), b: true },
        { t: ' requests came in. I fulfilled ' },
        { t: String(s.fulfilled), b: true },
        { t: ' end-to-end by agent; ' },
        { t: String(s.awaiting), b: true },
        { t: ` currently need you — the top one is a deadline risk on ${topReq}.` },
      ]
    case '30d':
      return [
        { t: 'Over 30 days, agent fulfilment climbed from ' },
        { t: `${ARC.agentFulfilledPerDayStart}`, b: true },
        { t: ' to ' },
        { t: `${ARC.agentFulfilledPerDayEnd}`, b: true },
        { t: ' per day and median time to fulfil fell from ' },
        { t: `${ARC.medianDaysStart}`, b: true },
        { t: ' to ' },
        { t: `${ARC.medianDaysEnd} days`, b: true },
        { t: `. ${s.awaiting} requests need you now.` },
      ]
    case 'sinceYesterday':
    default:
      // Verbatim, spec §4.1.
      return [
        { t: String(s.received), b: true },
        { t: ' requests came in. I fulfilled ' },
        { t: String(s.fulfilled), b: true },
        { t: ' end-to-end; ' },
        { t: String(s.awaiting), b: true },
        { t: ` need you — the top one is a deadline risk on ${topReq}.` },
      ]
  }
}

// Distribution row (spec §4.1: "request type split + top jurisdictions as
// inline chips with counts"). Straight from fixtures §history.
export const requestTypeShare = history.requestTypeShare
export const topJurisdictions = history.topJurisdictions
