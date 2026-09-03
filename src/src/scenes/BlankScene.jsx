import { useSceneBeats } from '../cue/CueContext'
import { MeridianWordmark } from '../brand/MeridianWordmark'

// Key 6 — holding screen: "Meridian wordmark on cream" per the 03
// rehearsal card (built in Session 3 once the wordmark existed). This is
// the "nothing to see, presenter is talking" state.
export function BlankScene() {
  useSceneBeats('blank', 'Blank / holding screen', ['Holding'])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--mer-cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MeridianWordmark height={64} />
    </div>
  )
}
