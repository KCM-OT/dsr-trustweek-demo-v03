import { createContext, useContext, useMemo, useState } from 'react'

// Tiny cross-scene demo state — currently just the redaction sign-off flag
// (01_build_spec.md §3.3: "Approving flips plan item 4's gate and logs to
// the activity trail"), which must survive navigating between the
// redaction summary and the request detail without a reload. Deliberately
// minimal; per-scene choreography state stays in the cue engine.

const DemoStateContext = createContext(null)

export function DemoStateProvider({ children }) {
  const [redactionApproved, setRedactionApproved] = useState(false)
  const value = useMemo(
    () => ({ redactionApproved, approveRedaction: () => setRedactionApproved(true) }),
    [redactionApproved]
  )
  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>
}

export function useDemoState() {
  const ctx = useContext(DemoStateContext)
  if (!ctx) throw new Error('useDemoState must be used within a DemoStateProvider')
  return ctx
}
