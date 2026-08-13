import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { marcus } from '../data/fixtures'
import { useCue, useSceneBeats } from '../cue/CueContext'
import { NorthwindWordmark } from '../brand/NorthwindWordmark'

// Act 2 — the Meridian intake agent (build spec §2.1), consumer-facing with
// ZERO OneTrust visual DNA: Northwind Outfitters branding per 02 §2 (sand
// ground, white card, pine headings, copper primary, rounded-12), Outfit
// headings, system-sans body. No shared admin components on purpose — no
// pills, no ✦, no OT tokens. The one permitted brand touch beyond the
// wordmark: the thin topographic-line footer motif. All copy verbatim from
// 03_demo_script.md Act 2; request-type card descriptions are composed in
// the 02 §2 brand voice (the script requires them but scripts no text —
// flagged in PROGRESS.md).

const BEATS = [
  'Initial state',
  'CUE 1 · Identity autofilled',
  'CUE 2 · Assistant exchange',
  'CUE 3 · California note + submit',
]

const BODY = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

const REQUEST_TYPES = [
  { title: 'See my data', desc: 'Get a copy of everything we have about you.' },
  { title: 'Delete my data', desc: 'Permanently erase your account and information.' },
  { title: 'Fix my data', desc: 'Correct something we got wrong.' },
  { title: 'Stop marketing to me', desc: 'No more marketing emails from us.' },
]

export function IntakeScene() {
  const navigate = useNavigate()
  const [step, setStep] = useState('Identify') // Identify | Request | Confirm
  const [requestType, setRequestType] = useState(null)
  const [pivotDone, setPivotDone] = useState(false)
  const [typed, setTyped] = useState({}) // presenter filling fields live (beat 0)

  // The exit-forward closure is registered once, so it reads the current
  // step through a ref.
  const stepRef = useRef(step)
  stepRef.current = step

  // Cue-key traversal across act boundaries: stepping back from beat 0
  // returns to the Act 1 flow chart. Advancing past the last beat first
  // lands the confirmation screen (the cue fallback for the Submit click —
  // without this, a cue-only walk skipped the submission entirely), and
  // only continues into Act 3's request detail from the confirmation.
  const beat = useSceneBeats(
    'intake',
    'Meridian intake agent',
    BEATS,
    () => {
      if (stepRef.current === 'Confirm') navigate('/requests/4207')
      else setStep('Confirm')
    },
    () => navigate('/setup/flow')
  )

  // Number-key 2 / beat 0 = clean re-run: all presenter clicks reset.
  useEffect(() => {
    if (beat === 0) {
      setStep('Identify')
      setRequestType(null)
      setPivotDone(false)
      setTyped({})
    }
  }, [beat])

  // Cue fallbacks for the presenter clicks (build spec §2.1 makes CUE 1 a
  // fallback for live-filling; the same applies to every scripted click):
  // each beat reproduces its scripted state even if no clicks happened, so
  // the forward cue-only path walks the full arc — Identify → Request with
  // Delete selected (CUE 2's exchange is about deletion) → post-pivot with
  // the CCPA note (CUE 3 follows the pivot in the script). Deliberate
  // clicks still do the same thing earlier; these are no-ops then. Stepping
  // ← below beat 3 also un-confirms, so the confirmation screen reverts.
  useEffect(() => {
    if (beat >= 2) {
      if (stepRef.current === 'Identify') setStep('Request')
      setRequestType((t) => t ?? 'Delete my data')
    }
    if (beat >= 3) {
      setRequestType('See my data')
      setPivotDone(true)
    }
    if (beat < 3 && stepRef.current === 'Confirm') setStep('Request')
  }, [beat])

  // Entered via Act 3's back-exit: restore the exact pre-submit state
  // (Request step, pivoted to See my data, CUE 3 note visible) so ← from
  // the request detail lands back on the submission form, not a blank one.
  // Declared after the beat-0 reset effect so the restore wins on mount.
  const location = useLocation()
  const { jumpToBeat } = useCue()
  useEffect(() => {
    if (location.state?.resume !== 'pre-submit') return
    jumpToBeat(3)
    setStep('Request')
    setRequestType('See my data')
    setPivotDone(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filled = beat >= 1

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--nw-sand)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: BODY,
        color: 'var(--mer-ink)',
      }}
    >
      <header style={{ display: 'grid', justifyItems: 'center', gap: 14, padding: '44px 24px 26px' }}>
        <NorthwindWordmark height={44} />
        {step !== 'Confirm' && (
          <div style={{ textAlign: 'center', display: 'grid', gap: 6 }}>
            <h1 style={{ font: '600 26px var(--mer-font)', color: 'var(--nw-pine)' }}>Your data, your call.</h1>
            <p style={{ font: `400 14.5px/1.5 ${BODY}`, color: 'var(--mer-ink)', opacity: 0.8, maxWidth: 460 }}>
              Ask us for a copy of your data, or ask us to delete it. We'll handle the rest.
            </p>
          </div>
        )}
      </header>

      <main style={{ width: 620, maxWidth: '92vw', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {step !== 'Confirm' && <Steps current={step} />}

        {step === 'Identify' && (
          <FormCard>
            <Field label="Full name" value={filled ? marcus.subject : typed['Full name'] ?? ''} onType={setTyped} />
            <Field label="Email" value={filled ? marcus.email : typed['Email'] ?? ''} onType={setTyped} />
            <Field
              label="Where you live"
              value={filled ? 'California, United States' : typed['Where you live'] ?? ''}
              onType={setTyped}
            />
            <Field
              label="Customer of"
              value={filled ? 'Northwind Outfitters' : typed['Customer of'] ?? ''}
              onType={setTyped}
              badge={filled ? 'Alpine Rewards member' : null}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
              <PrimaryButton onClick={() => setStep('Request')}>Continue</PrimaryButton>
            </div>
            <AssistantStrip beat={beat} onPivot={null} />
          </FormCard>
        )}

        {step === 'Request' && (
          <FormCard>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {REQUEST_TYPES.map((t) => {
                const selected = requestType === t.title
                return (
                  <button
                    key={t.title}
                    onClick={() => setRequestType(t.title)}
                    style={{
                      textAlign: 'left',
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: `2px solid ${selected ? 'var(--nw-pine)' : '#E3DCCC'}`,
                      background: selected ? '#F4F7F5' : '#fff',
                      cursor: 'pointer',
                      display: 'grid',
                      gap: 4,
                    }}
                  >
                    <span style={{ font: '600 15px var(--mer-font)', color: 'var(--nw-pine)' }}>{t.title}</span>
                    <span style={{ font: `400 13px/1.45 ${BODY}`, color: 'var(--mer-ink)', opacity: 0.75 }}>{t.desc}</span>
                  </button>
                )
              })}
            </div>

            {pivotDone && (
              <p
                className="anim-enter"
                style={{ font: `400 13px ${BODY}`, color: 'var(--nw-pine)', margin: '10px 2px 0' }}
              >
                Changed to: See my data. You can request deletion any time after.
              </p>
            )}

            {beat >= 3 && (
              <div
                className="anim-enter"
                style={{
                  marginTop: 14,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#F6F2E9',
                  display: 'grid',
                  gap: 4,
                }}
              >
                <span style={{ font: '600 12px var(--mer-font)', letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--nw-clay)' }}>
                  Why we ask
                </span>
                <span style={{ font: `400 13.5px/1.55 ${BODY}`, color: 'var(--mer-ink)' }}>
                  Because you're a California resident, your report will include the categories of information we
                  collect, where it comes from, why we use it, and who we share it with — along with the data
                  itself. (CCPA/CPRA)
                </span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <PrimaryButton onClick={() => setStep('Confirm')}>Submit</PrimaryButton>
            </div>

            <AssistantStrip
              beat={beat}
              onPivot={() => {
                setRequestType('See my data')
                setPivotDone(true)
              }}
            />
          </FormCard>
        )}

        {step === 'Confirm' && <Confirmation />}
      </main>

      <TopoFooter />
    </div>
  )
}

function Steps({ current }) {
  const steps = ['Identify', 'Request', 'Confirm']
  const idx = steps.indexOf(current)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center', paddingBottom: 18 }}>
      {steps.map((s, i) => (
        <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              font: `${i === idx ? 600 : 500} 13px var(--mer-font)`,
              letterSpacing: 0.8,
              color: i === idx ? 'var(--nw-clay)' : 'var(--nw-pine)',
              opacity: i <= idx ? 1 : 0.45,
            }}
          >
            {s}
          </span>
          {i < steps.length - 1 && <span style={{ color: 'var(--nw-pine)', opacity: 0.35, fontSize: 13 }}>→</span>}
        </span>
      ))}
    </div>
  )
}

function FormCard({ children }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '28px 32px 20px',
        boxShadow: '0 1px 2px rgba(34, 48, 60, 0.06)',
        display: 'grid',
        gap: 14,
      }}
    >
      {children}
    </div>
  )
}

function Field({ label, value, badge, onType }) {
  return (
    <label style={{ display: 'grid', gap: 5 }}>
      <span style={{ font: '600 12.5px var(--mer-font)', letterSpacing: 0.4, color: 'var(--nw-pine)' }}>{label}</span>
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          value={value}
          placeholder=" "
          onChange={(e) => onType((t) => ({ ...t, [label]: e.target.value }))}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #E3DCCC',
            background: '#FDFCFA',
            font: `400 14px ${BODY}`,
            color: 'var(--mer-ink)',
            outline: 'none',
          }}
        />
        {badge && (
          <span
            className="anim-enter"
            style={{
              position: 'absolute',
              right: 10,
              padding: '2px 10px',
              borderRadius: 999,
              background: '#F8EFE7',
              color: 'var(--nw-clay)',
              font: '600 11.5px var(--mer-font)',
              letterSpacing: 0.3,
            }}
          >
            {badge}
          </span>
        )}
      </span>
    </label>
  )
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 26px',
        borderRadius: 8,
        border: 'none',
        background: 'var(--nw-clay)',
        color: '#fff',
        font: '600 14px var(--mer-font)',
        letterSpacing: 0.3,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

// The docked assistant affordance — a quiet bordered strip at the bottom of
// the card, never a floating widget (02 §2). The CUE 2 exchange renders
// inside it: Marcus's question, then the brand's answer (typing ~800ms)
// ending in the inline pivot chip.
function AssistantStrip({ beat, onPivot }) {
  const exchange = beat >= 2
  const [typing, setTyping] = useState(false)
  useEffect(() => {
    if (!exchange) return
    setTyping(true)
    const t = setTimeout(() => setTyping(false), 800)
    return () => clearTimeout(t)
  }, [exchange])

  return (
    <div
      style={{
        marginTop: 8,
        border: '1px solid #E3DCCC',
        borderRadius: 12,
        padding: '12px 16px',
        display: 'grid',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <CompassGlyph />
        {exchange ? (
          <span style={{ font: `400 14px ${BODY}`, color: 'var(--mer-ink)' }}>
            If I delete my account, do I lose my loyalty points?
          </span>
        ) : (
          <span style={{ font: `400 13.5px ${BODY}`, color: 'var(--mer-ink)', opacity: 0.55 }}>
            Questions about your request? Ask here.
          </span>
        )}
      </div>

      {exchange &&
        (typing ? (
          <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', paddingLeft: 30 }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </span>
        ) : (
          <div className="anim-enter" style={{ paddingLeft: 30, display: 'grid', gap: 10, justifyItems: 'start' }}>
            <p style={{ font: `400 13.5px/1.55 ${BODY}`, color: 'var(--mer-ink)' }}>
              Yes — deleting your account permanently forfeits your Alpine Rewards balance (currently 12,480
              points), and we can't restore it later. If you'd like to see everything we have about you first —
              including your points history — you can request a copy of your data instead, and decide about
              deletion after.
            </p>
            <button
              onClick={onPivot || undefined}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                border: '1px solid var(--nw-pine)',
                background: '#fff',
                color: 'var(--nw-pine)',
                font: '600 13px var(--mer-font)',
                cursor: 'pointer',
              }}
            >
              Switch to "See my data"
            </button>
          </div>
        ))}
    </div>
  )
}

function CompassGlyph({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" aria-hidden="true" style={{ flexShrink: 0 }}>
      <polygon points="7,7 22,16 16,22" fill="var(--nw-clay)" />
      <polygon points="31,31 22,16 16,22" fill="var(--nw-pine)" />
    </svg>
  )
}

function Confirmation() {
  return (
    <div className="anim-enter" style={{ display: 'grid', justifyItems: 'center', gap: 16, padding: '40px 24px', textAlign: 'center' }}>
      <h1 style={{ font: '600 30px var(--mer-font)', color: 'var(--nw-pine)' }}>Request received.</h1>
      <p style={{ font: `400 15px/1.65 ${BODY}`, color: 'var(--mer-ink)', maxWidth: 460 }}>
        Your request number is <strong>AR-4207</strong>. We've emailed a confirmation to m•••@—mail.com. Most
        access requests are completed well within the 45-day requirement — we'll keep you posted.
      </p>
    </div>
  )
}

// The one approved decorative brand touch: a thin topographic-line footer.
function TopoFooter() {
  return (
    <svg width="100%" height="46" viewBox="0 0 1200 46" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', opacity: 0.5 }}>
      <path d="M0 14 C 180 4, 320 26, 520 18 S 900 4, 1200 16" fill="none" stroke="#D8CDB4" strokeWidth="1" />
      <path d="M0 26 C 200 18, 360 38, 560 30 S 920 16, 1200 28" fill="none" stroke="#D8CDB4" strokeWidth="1" />
      <path d="M0 38 C 220 30, 400 48, 620 40 S 940 30, 1200 40" fill="none" stroke="#D8CDB4" strokeWidth="1" />
    </svg>
  )
}
