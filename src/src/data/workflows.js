// Shared source of truth for the four workflows generated at Act 1's
// capstone beat (WorkflowsScene, beat 10 — one row per lane in the
// generated flow chart: opt-out, access, deletion, correction). Every
// row starts "Ready for review" there, since a human still has to open
// and approve each draft before it goes live.
//
// Act 3's request detail (RequestDetailScene) looks a specific request's
// type up here to show which of these four workflows is actually running
// the request — the same generated artifact, now in execution.

export const WORKFLOWS = [
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

// marcus.type is "Access" — matches WORKFLOWS[].name, not requestType, so
// requests key off the short name.
export function getWorkflowByName(name) {
  return WORKFLOWS.find((wf) => wf.name === name)
}
