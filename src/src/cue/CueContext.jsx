import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NUMBER_KEY_ROUTES } from '../scenes/sceneMap'

// Presenter cue engine — README non-negotiable #2 / build spec §0.
//
// A beat is just an index into the current scene's beat list. Scenes
// register their beats on mount (useSceneBeats) and read `beatIndex` back
// to decide what to render — this is the "equivalently a scene state
// index" option the build spec calls out, which avoids threading
// apply/revert closures through context and keeps every beat step
// re-enterable by construction (render is a pure function of the index).

const CueContext = createContext(null)

export function CueProvider({ children }) {
  const [sceneId, setSceneId] = useState(null)
  const [sceneLabel, setSceneLabel] = useState(null)
  const [beatLabels, setBeatLabels] = useState(['Initial state'])
  const [beatIndex, setBeatIndex] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Advancing past a scene's last beat (or stepping back from beat 0)
  // normally clamps; a scene may instead register exit actions — forward
  // (e.g. the split screen's hand-off into redaction, the flow chart's
  // continuation into Act 2) and back (e.g. the flow chart returning to the
  // setup conversation), so act boundaries stay traversable on the cue keys
  // and never dead-end the presenter. Kept in refs so advance()/back() can
  // consult them without re-subscribing, and so the side effect never runs
  // inside a state updater (StrictMode-safe). labelsRef mirrors beatLabels
  // synchronously so a jump issued right after registration (cross-scene
  // "land on beat N" navigation) clamps against the NEW scene's beats, not
  // the previous scene's still-rendered state.
  const beatIndexRef = useRef(0)
  const labelsRef = useRef(['Initial state'])
  const exitForwardRef = useRef(null)
  const exitBackRef = useRef(null)
  const pendingBeatRef = useRef(null)
  beatIndexRef.current = beatIndex

  const registerScene = useCallback((id, label, labels, onExitForward, onExitBack) => {
    setSceneId(id)
    setSceneLabel(label)
    const safeLabels = labels && labels.length ? labels : ['Initial state']
    setBeatLabels(safeLabels)
    labelsRef.current = safeLabels
    const routeBeat = window.history.state?.usr?.beat
    const requestedBeat = pendingBeatRef.current ?? (typeof routeBeat === 'number' ? routeBeat : null)
    const nextBeat = requestedBeat === null ? 0 : Math.max(0, Math.min(requestedBeat, safeLabels.length - 1))
    pendingBeatRef.current = null
    setBeatIndex(nextBeat)
    beatIndexRef.current = nextBeat
    exitForwardRef.current = onExitForward || null
    exitBackRef.current = onExitBack || null
  }, [])

  const jumpToBeat = useCallback((index) => {
    const nextBeat = Math.max(0, Math.min(index, labelsRef.current.length - 1))
    beatIndexRef.current = nextBeat
    setBeatIndex(nextBeat)
  }, [])

  const advance = useCallback(() => {
    if (beatIndexRef.current >= labelsRef.current.length - 1 && exitForwardRef.current) {
      exitForwardRef.current()
      return
    }
    setBeatIndex((prev) => Math.min(prev + 1, labelsRef.current.length - 1))
  }, [])

  const back = useCallback(() => {
    if (beatIndexRef.current <= 0 && exitBackRef.current) {
      exitBackRef.current()
      return
    }
    setBeatIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  // Number keys are the hard recovery (README #2): landing on a scene's
  // initial beat must also work when the presenter is ALREADY on that route
  // — the scene doesn't remount then, so re-registration never fires and
  // the beat would silently stay put. Re-pressing the key resets to beat 0.
  const pathRef = useRef(location.pathname)
  pathRef.current = location.pathname

  const jumpToNumberKey = useCallback(
    (key) => {
      const route = NUMBER_KEY_ROUTES[key]
      if (!route) return
      if (pathRef.current === route) jumpToBeat(0)
      else navigate(route)
    },
    [jumpToBeat, navigate]
  )

  const jumpToStep = useCallback(
    (route, index) => {
      if (pathRef.current === route) {
        jumpToBeat(index)
        return
      }
      pendingBeatRef.current = index
      navigate(route, { state: { beat: index } })
    },
    [jumpToBeat, navigate]
  )

  const value = useMemo(
    () => ({
      sceneId,
      sceneLabel,
      beatLabels,
      beatIndex,
      registerScene,
      advance,
      back,
      jumpToBeat,
      jumpToStep,
      jumpToNumberKey,
      currentPath: location.pathname,
      overlayOpen,
      openOverlay: () => setOverlayOpen(true),
      closeOverlay: () => setOverlayOpen(false),
      toggleOverlay: () => setOverlayOpen((v) => !v),
    }),
    [sceneId, sceneLabel, beatLabels, beatIndex, registerScene, advance, back, jumpToBeat, jumpToStep, jumpToNumberKey, location.pathname, overlayOpen]
  )

  return <CueContext.Provider value={value}>{children}</CueContext.Provider>
}

export function useCue() {
  const ctx = useContext(CueContext)
  if (!ctx) throw new Error('useCue must be used within a CueProvider')
  return ctx
}

// Scenes call this once with their (stable) beat label list to register
// with the cue engine and read back the current beat index. onExitForward
// (optional) runs when the advance key is pressed while already on the
// last beat; onExitBack (optional) runs when the back key is pressed while
// already on beat 0 — both used for cue-driven scene hand-offs so the
// presenter can walk act boundaries in either direction.
export function useSceneBeats(sceneId, sceneLabel, labels, onExitForward, onExitBack) {
  const { registerScene, beatIndex } = useCue()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => registerScene(sceneId, sceneLabel, labels, onExitForward, onExitBack), [sceneId])
  return beatIndex
}
