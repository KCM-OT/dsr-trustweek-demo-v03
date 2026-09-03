import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tenant } from '../../data/fixtures'
import { useCue, useSceneBeats } from '../../cue/CueContext'
import { StatusPill } from '../../components/StatusPill'
import { GroundingChip } from '../../components/GroundingChip'
import { AiLoader } from '../../components/AiLoader'
import { NorthwindWordmark } from '../../brand/NorthwindWordmark'
import { FileIcon, ChevronDownIcon, ChevronRightIcon } from '../../shell/icons'
import { PageHeader } from '../../shell/PageHeader'

// Act 1 — setup agent conversation (build spec §1.1). A composed
// conversational surface, not a bare chat: agent messages carry rich cards
// (profile, playbook, tiles, provisioning), admin replies are compact
// right-aligned confirmations. All dialogue verbatim from 03_demo_script.md
// Act 1; all data from fixtures §tenant. Beats are cumulative — the thread
// only grows — so every beat state is re-enterable, and beat 0 resets the
// presenter clicks for a clean re-run.

const BEATS = [
  'Initial state',
  'CUE 1 · Greeting + profile card',
  'CUE 2 · Document request',
  'CUE 3 · Uploads appear',
  'CUE 4 · Decomposed playbook',
  'CUE 5 · Intake agent proposal',
  'CUE 6 · Systems & integrations',
  'CUE 7 · Handoff → flow chart',
]

const HANDOFF_BEAT = 7

export function SetupScene() {
  const beat = useSceneBeats('setup', 'Agent Setup', BEATS)
  const navigate = useNavigate()
  const location = useLocation()
  const { jumpToBeat } = useCue()

  // Entered with a requested beat (the flow chart's back-exit returns here
  // at beat 6) — jump after registration; number-key 1 still lands on 0.
  useEffect(() => {
    if (typeof location.state?.beat === 'number') jumpToBeat(location.state.beat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Presenter-click state. Reset when the scene returns to its initial
  // beat so number-key 1 always yields a clean re-run (build spec §0).
  const [austriaRemoved, setAustriaRemoved] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  useEffect(() => {
    if (beat === 0) {
      setAustriaRemoved(false)
      setPreviewOpen(false)
    }
  }, [beat])

  // A 1s loader pause plays on entry into the conversation (beat 0 → 1,
  // "slide 1 → 2" in the presenter numbering). Keyed off the beat
  // transition itself rather than a fixed beat number, so it replays
  // deterministically every time this edge is crossed — including after
  // ← back to 0 and → forward again.
  const [entering, setEntering] = useState(false)
  const prevBeatRef = useRef(beat)
  useEffect(() => {
    if (prevBeatRef.current === 0 && beat === 1) {
      setEntering(true)
      const t = setTimeout(() => setEntering(false), 1000)
      prevBeatRef.current = beat
      return () => clearTimeout(t)
    }
    prevBeatRef.current = beat
  }, [beat])

  // Slide 2 build order: the greeting bubble lands first — with its own
  // ~800ms typing beat (AgentMessage) — and only once that settles does the
  // profile table appear, instead of both building in at once.
  const showChatContent = beat >= 1 && !entering
  const [profileCardVisible, setProfileCardVisible] = useState(false)
  useEffect(() => {
    if (!showChatContent) {
      setProfileCardVisible(false)
      return
    }
    const t = setTimeout(() => setProfileCardVisible(true), 800)
    return () => clearTimeout(t)
  }, [showChatContent])

  // CUE 6 choreography — Amara's reply, then the provisioning card, then
  // the three status flips staggered ~500–600ms apart (README #3 pacing).
  const provisionStep = useChoreography(beat === 6, [1400, 1900, 2400, 3000, 3600, 4200])

  // CUE 7 — the closing line lands (typing ~800ms), reads for a moment,
  // then the scene hands off to the flow chart.
  useEffect(() => {
    if (beat !== HANDOFF_BEAT) return
    const t = setTimeout(() => navigate('/setup/flow'), 2200)
    return () => clearTimeout(t)
  }, [beat, navigate])

  // Keep the newest content in view as the thread grows.
  const endRef = useRef(null)
  useEffect(() => {
    const t = setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 250)
    return () => clearTimeout(t)
  }, [beat, austriaRemoved, provisionStep])

  return (
    <div style={beat >= 1 ? { height: '100%', display: 'flex', flexDirection: 'column' } : undefined}>
      {beat === 0 ? (
        <PageHeader
          title="Setup"
          description="Configure Data Subject Rights intake so your Privacy Agent can route, resolve, and report on requests automatically."
        />
      ) : (
        <PageHeader
          breadcrumb={[{ label: 'Setup', onClick: () => jumpToBeat(0) }, { label: 'Privacy Agent' }]}
          title="Privacy Agent"
          description="AI Assisted configuration for jurisdiction, data subject rights, response templates, and workflows."
        />
      )}

      {beat === 0 ? (
        <div style={{ padding: '24px 24px 0' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
              gap: 24,
              maxWidth: 1200,
              margin: '0 auto',
            }}
          >
            <SetupChoiceCard
              variant="agent"
              icon="/figma/ai-indicator.svg"
              eyebrow="RECOMMENDED"
              title="Set up with Privacy Agent"
              description="Answer a few guided questions and your AI Privacy Agent configures jurisdictions, data subject rights, response workflows, and templates for you - in minutes."
              benefits={['Jurisdiction & regulation mapping', 'Request type recommendations', 'Ready-to-edit workflow draft']}
              action="Start with privacy agent"
              onAction={() => jumpToBeat(1)}
            />
            <SetupChoiceCard
              variant="manual"
              icon="/figma/wrench.svg"
              title="Set up manually"
              description="Configure jurisdictions, data subject rights, and intake rules yourself using full control over every setting."
              benefits={['Full control over every field', 'No AI-generated defaults', 'Best if you already have a plan']}
              action="Configure manually"
              onAction={() => jumpToBeat(1)}
            />
          </div>

          <section aria-labelledby="program-overview-heading" style={{ maxWidth: 1200, margin: '32px auto 0' }}>
            <h2
              id="program-overview-heading"
              style={{
                margin: '0 0 16px',
                color: '#1a1a1a',
                fontFamily: '"Open Sans", sans-serif',
                fontSize: 16,
                fontWeight: 600,
                lineHeight: '24px',
              }}
            >
              Program overview
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                gap: 16,
              }}
            >
              <ProgramOverviewCard icon="/figma/globe.svg" label="Jurisdictions configured" value="0" detail="None set up yet" />
              <ProgramOverviewCard icon="/figma/file.svg" label="Request types enabled" value="0 of 12" detail="Access, deletion, portability/..." />
              <ProgramOverviewCard icon="/figma/dashboard.svg" label="Automation coverage" value="---" detail="Available after setup" />
              <ProgramOverviewCard icon="/figma/clock.svg" label="Avg. resolution time" value="---" detail="No requests processed" />
            </div>
          </section>

          <section aria-labelledby="configurations-heading" style={{ maxWidth: 1200, margin: '32px auto 0' }}>
            <h2
              id="configurations-heading"
              style={{
                margin: '0 0 16px',
                color: '#1a1a1a',
                fontFamily: '"Open Sans", sans-serif',
                fontSize: 16,
                fontWeight: 700,
                lineHeight: '24px',
              }}
            >
              Configurations
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: 16,
              }}
            >
              <ConfigurationCard icon="/figma/file-lines.svg" title="Webforms" description="Public intake forms" />
              <ConfigurationCard icon="/figma/chart-diagram.svg" title="Workflows" description="Routing & approvals" />
              <ConfigurationCard icon="/figma/plug.svg" title="Integrations" description="Connected systems" />
              <ConfigurationCard icon="/figma/diagram-lean-canvas.svg" title="Response templates" description="Notices & letters" />
              <ConfigurationCard icon="/figma/diagram-subtask.svg" title="Subtask templates" description="Internal task steps" />
              <ConfigurationCard icon="/figma/eye-slash.svg" title="Redaction preferences" description="Default rules" />
            </div>
          </section>
        </div>
      ) : (
        // Chat mode (CUE 1–7) — Figma "chat-interface-background-and-sidebar"
        // (Privacy Platform Journey Maps, node 494:15469): a bounded chat
        // panel (scrolling thread + fixed compose bar) beside a steps card
        // that tracks progress through the conversation. The chat panel is
        // flush against the header, nav rail, and window bottom (no radius,
        // no inset) — the compose bar's own bottom edge is the window's
        // bottom edge, so it's always anchored there regardless of thread
        // length (the message area scrolls internally instead). The steps
        // card keeps its own inset.
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <div style={{ height: '100%', display: 'flex', gap: 24 }}>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              background: '#ffffff',
              boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 32px' }}>
              <div style={{ maxWidth: 780, margin: '0 auto' }}>
                {/* Held out of the tree while the entry loader is up, so the
                    greeting bubble mounts — and plays its entrance/typing
                    animation — only once the loader has faded. The profile
                    table then follows once the bubble settles (build order:
                    bubble first, table after — not simultaneous). */}
                {showChatContent && (
                  <>
                    <AgentMessage isNew={beat === 1}>
                      Welcome, Amara. Before we set anything up, I researched Meridian Brands. Here's what I found —
                      confirm or correct anything.
                    </AgentMessage>
                    {profileCardVisible && (
                      <>
                        <ProfileCard austriaRemoved={austriaRemoved} onRemoveAustria={() => setAustriaRemoved(true)} />
                        {austriaRemoved && (
                          <AgentMessage isNew>
                            Got it — removing Austria. That takes Austrian consumer obligations out of scope. Everything
                            else confirmed.
                          </AgentMessage>
                        )}
                      </>
                    )}
                  </>
                )}

                {beat >= 2 && (
                  <AgentMessage isNew={beat === 2}>
                    Next: the documents that describe how Meridian actually works. A DSAR procedure, retention
                    policies, data flow diagrams, past response letters, brand guidelines — anything you'd hand a new
                    privacy hire, hand to me.
                  </AgentMessage>
                )}

                {beat >= 3 && <UploadMessage isNew={beat === 3} />}

                {beat >= 4 && (
                  <>
                    <AgentMessage isNew={beat === 4}>
                      I've read them. Here's your operating playbook as I understand it — this is the context I'll
                      follow on every request.
                    </AgentMessage>
                    <PlaybookCard />
                  </>
                )}

                {beat >= 5 && (
                  <>
                    <AgentMessage isNew={beat === 5}>
                      Based on your brands and jurisdictions, I suggest four branded intake agents — structured
                      request experiences that can also answer requesters' questions. One per consumer brand, one for
                      employees.
                    </AgentMessage>
                    <TilesCard onPreview={() => setPreviewOpen(true)} />
                  </>
                )}

                {beat >= 6 && (
                  <>
                    <AgentMessage isNew={beat === 6}>
                      To fulfill requests I'll work in your systems. Your data map and your data flow diagram agree on
                      four: Salesforce, Marketo, Zendesk, and your internal warehouse. I have pre-built integrations
                      for the first three. I need two things only you know: your Salesforce instance URL and an API
                      credential.
                    </AgentMessage>
                    {(beat > 6 || provisionStep >= 1) && (
                      <AdminMessage isNew={beat === 6}>meridian.my.salesforce.com — credential added to the vault.</AdminMessage>
                    )}
                    {(beat > 6 || provisionStep >= 2) && <IntegrationsCard step={beat > 6 ? 99 : provisionStep} />}
                  </>
                )}

                {beat >= 7 && (
                  <AgentMessage isNew={beat === 7}>
                    That's everything I need. Here's the process I'll follow for every request — review it, and change
                    anything you'd like.
                  </AgentMessage>
                )}

                <div ref={endRef} style={{ height: 1 }} />
              </div>
            </div>
            <ChatComposeBar />
          </div>

          <div style={{ paddingTop: 24, paddingRight: 24, paddingBottom: 24 }}>
            <IntakeStepsCard beat={beat} />
          </div>
        </div>
        {entering && <TransitionLoader />}
        </div>
      )}

      {previewOpen && <NorthwindPreview onClose={() => setPreviewOpen(false)} />}
    </div>
  )
}

function ConfigurationCard({ icon, title, description }) {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minHeight: 143,
        padding: '18px 16px 8px',
        background: '#ffffff',
        borderRadius: 6,
        boxShadow: '0 1px 3px #00000033, 0 2px 2px #0000001f, 0 0 2px #00000024',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 38,
          background: '#f4f3f3',
          borderRadius: 6,
        }}
      >
        <img src={icon} alt="" width="20" height="20" />
      </span>
      <div>
        <h3 style={{ margin: 0, color: '#1a1a1a', fontFamily: '"Open Sans", sans-serif', fontSize: 14, fontWeight: 700, lineHeight: '20px' }}>
          {title}
        </h3>
        <p style={{ margin: 0, color: '#a9a9a9', fontFamily: '"Open Sans", sans-serif', fontSize: 14, lineHeight: '20px' }}>
          {description}
        </p>
      </div>
      <strong
        style={{
          alignSelf: 'flex-end',
          marginTop: 'auto',
          color: '#a9a9a9',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: 12,
          fontWeight: 700,
          lineHeight: '16px',
        }}
      >
        Not configured
      </strong>
    </article>
  )
}

function ProgramOverviewCard({ icon, label, value, detail }) {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: 118,
        padding: '18px 16px 8px',
        background: '#ffffff',
        borderRadius: 6,
        boxShadow: '0 1px 3px #00000033, 0 2px 2px #0000001f, 0 0 2px #00000024',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={icon} alt="" width="16" height="16" />
        <span style={{ color: '#1a1a1a', fontFamily: '"Open Sans", sans-serif', fontSize: 14, lineHeight: '20px' }}>
          {label}
        </span>
      </div>
      <strong
        style={{
          color: '#292b2e',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: 28,
          fontWeight: 600,
          lineHeight: '40px',
        }}
      >
        {value}
      </strong>
      <span style={{ color: '#a9a9a9', fontFamily: '"Open Sans", sans-serif', fontSize: 12, lineHeight: '16px' }}>
        {detail}
      </span>
    </article>
  )
}

function SetupChoiceCard({ variant, icon, eyebrow, title, description, benefits, action, onAction }) {
  const isAgent = variant === 'agent'

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 300,
        padding: 24,
        background: '#ffffff',
        border: isAgent ? '1px solid #8659e8' : '1px solid transparent',
        borderRadius: 6,
        boxShadow: '0 1px 3px #00000033, 0 2px 2px #0000001f, 0 0 2px #00000024',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 30, marginBottom: 12 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isAgent ? 24 : 30,
            height: isAgent ? 24 : 30,
            background: isAgent ? 'transparent' : '#e5e5e5',
            borderRadius: 6,
          }}
        >
          <img src={icon} alt="" width={isAgent ? 24 : 18} height={isAgent ? 24 : 18} />
        </span>
        {eyebrow && (
          <span style={{ color: '#8858e7', fontFamily: '"Open Sans", sans-serif', fontSize: 12, fontWeight: 700, lineHeight: '16px' }}>
            {eyebrow}
          </span>
        )}
      </div>

      <h2 style={{ margin: '0 0 4px', color: '#1a1a1a', fontFamily: '"Open Sans", sans-serif', fontSize: 16, fontWeight: 700, lineHeight: '24px' }}>
        {title}
      </h2>
      <p style={{ margin: '0 0 20px', color: '#000000', fontFamily: '"Open Sans", sans-serif', fontSize: 14, lineHeight: '20px' }}>
        {description}
      </p>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: 0, margin: 0, padding: 0, listStyle: 'none' }}>
        {benefits.map((benefit) => (
          <li key={benefit} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#000000', fontFamily: '"Open Sans", sans-serif', fontSize: 14, lineHeight: '20px' }}>
            <img src={isAgent ? '/figma/check.svg' : '/figma/check-muted.svg'} alt="" width="16" height="16" />
            {benefit}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: 20 }}>
        <button
          type="button"
          onClick={onAction}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            minHeight: 32,
            padding: '6px 16px',
            border: isAgent ? 0 : '1px solid #468254',
            borderRadius: 4,
            background: isAgent ? 'linear-gradient(90deg, #5358ef 25%, #8858e7 100%)' : '#ffffff',
            color: isAgent ? '#ffffff' : '#2c6145',
            fontFamily: '"Open Sans", sans-serif',
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '20px',
            cursor: 'pointer',
          }}
        >
          {isAgent && <img src="/figma/ai-indicator-1.svg" alt="" width="16" height="16" />}
          {action}
        </button>
      </div>
    </section>
  )
}

// Fires an ascending step counter at the given delays while `active`;
// resets to 0 when inactive. Same timer discipline as the Act 3 sync.
function useChoreography(active, delays) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!active) {
      setStep(0)
      return
    }
    setStep(0)
    const timers = delays.map((ms, i) => setTimeout(() => setStep(i + 1), ms))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
  return step
}

// --- Message primitives ------------------------------------------------------

// Agent-authored line: avatar circle (AI sparkle mark) + a speech bubble —
// Figma "chat-elements" (Privacy Platform Journey Maps, node 492:15408).
// Bubble corners are square on the bottom-left, where it meets the avatar.
// New messages land behind an ~800ms typing indicator (README #3).
function AgentMessage({ children, isNew }) {
  const [typing, setTyping] = useState(Boolean(isNew))
  useEffect(() => {
    if (!isNew) {
      setTyping(false)
      return
    }
    setTyping(true)
    const t = setTimeout(() => setTyping(false), 800)
    return () => clearTimeout(t)
  }, [isNew])

  return (
    <div className="anim-enter" style={{ display: 'flex', alignItems: 'flex-end', gap: 10, margin: '0 0 var(--space-4)' }}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 37,
          height: 37,
          flexShrink: 0,
          borderRadius: '50%',
          background: 'var(--ot-agent-avatar-bg)',
        }}
      >
        <img src="/figma/ai-indicator.svg" alt="" width={20} height={20} aria-hidden="true" />
      </span>
      <div
        style={{
          background: 'var(--ot-agent-bubble-bg)',
          border: '1px solid var(--ot-agent-bubble-border)',
          borderRadius: '10px 10px 10px 0',
          padding: typing ? '14px 20px' : '18px 20px',
          maxWidth: 620,
        }}
      >
        {typing ? (
          <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </span>
        ) : (
          <p className="anim-enter" style={{ font: '400 14.5px/1.55 "Open Sans", sans-serif', color: 'var(--ot-ink)', margin: 0 }}>
            {children}
          </p>
        )}
      </div>
    </div>
  )
}

// Admin reply: compact right-aligned confirmation.
function AdminMessage({ children, isNew }) {
  return (
    <div className={isNew ? 'anim-enter' : undefined} style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 0 var(--space-4)' }}>
      <div
        style={{
          background: 'var(--ot-surface)',
          border: '1px solid var(--ot-border)',
          borderRadius: 'var(--radius-card)',
          padding: '9px 16px',
          font: '400 14px/1.5 "Open Sans", sans-serif',
          color: 'var(--ot-ink)',
          maxWidth: 520,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Card shell shared by the rich agent cards — indented to the message
// bubble's left edge (37px avatar + 10px gap) so cards read as agent-authored.
function Card({ children, style }) {
  return (
    <div
      className="anim-enter"
      style={{
        margin: '0 0 var(--space-4) 47px',
        background: 'var(--ot-surface)',
        border: '1px solid var(--ot-border)',
        borderRadius: 'var(--radius-card)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// --- Chat-mode compose bar & intake-steps card ---------------------------------
// Figma "chat-interface-background-and-sidebar" (node 494:15469). Chrome
// only — nothing typed, nothing sent (same convention as the Act 3 Teams
// compose bar): the thread is scripted/beat-driven, not a live input.

function ChatComposeBar() {
  return (
    <div style={{ flexShrink: 0, borderTop: '1px solid #e5e5e5', background: '#ffffff', padding: '14px 24px' }}>
      <div
        style={{
          height: 82,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '14px 16px 10px',
          background: '#f6f6f6',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
        }}
      >
        <p style={{ margin: 0, color: '#4d4d4d', fontFamily: '"Open Sans", sans-serif', fontSize: 12, fontStyle: 'italic', lineHeight: '16px' }}>
          Message to privacy agent goes here...
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            type="button"
            aria-label="Add attachment options"
            style={{ width: 24, height: 24, padding: 0, border: 0, background: 'none', display: 'flex', cursor: 'pointer' }}
          >
            <img src="/figma/plus-button.svg" alt="" width={24} height={24} />
          </button>
          <button
            type="button"
            aria-label="Attach a file"
            style={{ width: 15, height: 17, padding: 0, border: 0, background: 'none', display: 'flex', cursor: 'pointer' }}
          >
            <img src="/figma/attachment-button.svg" alt="" width={15} height={17} />
          </button>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            style={{
              padding: '6px 16px',
              border: 0,
              borderRadius: 4,
              background: '#4d4d4d',
              color: '#ffffff',
              font: '600 14px/20px "Open Sans", sans-serif',
              cursor: 'pointer',
            }}
          >
            Send now
          </button>
        </div>
      </div>
    </div>
  )
}

// Steps mirror the chat's CUE structure. CUEs 2–3 (document request +
// upload) share step 2; the last step holds through the CUE 7 handoff beat
// since nothing in the thread supersedes it.
const INTAKE_STEPS = ['Research & identification', 'Document upload', 'Operational playbook', 'Suggested agents', 'Integrations']

function stepIndexForBeat(beat) {
  if (beat <= 1) return 0
  if (beat <= 3) return 1
  if (beat === 4) return 2
  if (beat === 5) return 3
  return 4
}

function IntakeStepsCard({ beat }) {
  const activeIndex = stepIndexForBeat(beat)
  return (
    <aside
      aria-label="Privacy intake steps"
      style={{
        width: 301,
        flexShrink: 0,
        alignSelf: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: 24,
        background: '#ffffff',
        borderRadius: 4,
        boxShadow: '0px 0px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.12), 0px 1px 1.5px rgba(0,0,0,0.2)',
      }}
    >
      <h2 style={{ margin: 0, color: '#1a1a1a', fontFamily: '"Open Sans", sans-serif', fontSize: 18, fontWeight: 600, lineHeight: '24px' }}>
        Privacy intake steps
      </h2>
      <div>
        {INTAKE_STEPS.map((label, i) => (
          <IntakeStepRow
            key={label}
            number={i + 1}
            label={label}
            state={i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending'}
            showTopLine={i > 0}
            showBottomLine={i < INTAKE_STEPS.length - 1}
          />
        ))}
      </div>
    </aside>
  )
}

// Pending steps sit at 30% opacity; reaching a step (done or active) brings
// it to full opacity — the opacity change transitions (build spec: "animate
// the opacity of each given step"). The step's badge also fires a one-shot
// sonar pulse the moment it becomes active, then settles (README #3: fire
// once on arrival, nothing animates at rest).
function IntakeStepRow({ number, label, state, showTopLine, showBottomLine }) {
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (state !== 'active') return
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 1800)
    return () => clearTimeout(t)
  }, [state])

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', opacity: state === 'pending' ? 0.3 : 1, transition: 'opacity 500ms ease' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 25, height: 62, flexShrink: 0 }}>
        <span style={{ flex: 1, width: 2, background: '#a2c0a9', opacity: showTopLine ? 1 : 0 }} />
        <span style={{ position: 'relative', width: 25, height: 25, flexShrink: 0 }}>
          {pulse && (
            <>
              <span className="sonar-ring" />
              <span className="sonar-ring" />
            </>
          )}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '2px solid #a2c0a9',
              background: '#f3fbf5',
              color: '#a2c0a9',
              fontFamily: '"Open Sans", sans-serif',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: '20px',
            }}
          >
            {number}
          </span>
        </span>
        <span style={{ flex: 1, width: 2, background: '#a2c0a9', opacity: showBottomLine ? 1 : 0 }} />
      </div>
      <span style={{ flex: 1, color: '#1a1a1a', fontFamily: '"Open Sans", sans-serif', fontSize: 16, lineHeight: '24px' }}>{label}</span>
    </div>
  )
}

// 1s scripted pause, slide 1 → 2 (build spec: a loader beat between the
// dashboard and the conversation opening). Opaque so it fully hides the
// beat-1 content mounting underneath until the pause elapses.
function TransitionLoader() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
      }}
    >
      <AiLoader size={56} />
    </div>
  )
}

// --- Row approve/edit toggle buttons --------------------------------------------
// Figma "Frame1410140503" (Privacy Platform Journey Maps, node 499:3665): a
// 15x15, 4px-radius square. Default = white fill, slate-grey glyph. Selected
// = solid color fill, white glyph — sage green for approve, gold for edit.

const CHECK_GLYPH_PATH =
  'M8.49609 0.115008C8.76953 0.329851 8.82812 0.720476 8.63281 0.993914L3.63281 7.86891C3.51562 8.00563 3.35938 8.10329 3.18359 8.12282C2.98828 8.14235 2.8125 8.06423 2.67578 7.94704L0.175781 5.44704C-0.0585938 5.19313 -0.0585938 4.80251 0.175781 4.5486C0.429688 4.31423 0.820312 4.31423 1.07422 4.5486L3.04688 6.54079L7.61719 0.251726C7.83203 -0.0217111 8.22266 -0.0803048 8.49609 0.115008Z'

const PENCIL_GLYPH_PATH =
  'M0.698242 6.91406C0.795898 6.64062 0.932617 6.36719 1.14746 6.17188L4.68262 2.61719L5.34668 1.95312C5.67871 2.28516 6.34277 2.96875 7.37793 3.98438L8.04199 4.64844L7.37793 5.3125L3.84277 8.84766C3.62793 9.0625 3.37402 9.21875 3.08105 9.29688L0.581055 10C0.424805 10.0391 0.249023 10 0.131836 9.86328C0.0146484 9.74609 -0.0244141 9.57031 0.0146484 9.41406L0.698242 6.91406ZM1.79199 6.85547C1.71387 6.93359 1.63574 7.05078 1.61621 7.16797L1.14746 8.86719L2.84668 8.39844C2.96387 8.35938 3.08105 8.30078 3.17871 8.20312L1.79199 6.85547ZM8.70605 3.98438C8.37402 3.67188 7.70996 2.98828 6.6748 1.95312L6.01074 1.30859C6.53809 0.78125 6.81152 0.488281 6.88965 0.429688C7.14355 0.15625 7.51465 0 7.88574 0C8.25684 0 8.62793 0.15625 8.88184 0.429688L9.58496 1.11328C9.83887 1.38672 9.99512 1.73828 9.99512 2.10938C9.99512 2.5 9.83887 2.85156 9.58496 3.125C9.50684 3.18359 9.21387 3.47656 8.70605 3.98438Z'

function ToggleSquareButton({ selected, selectedColor, glyphPath, glyphWidth, glyphHeight, glyphViewBox, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 15,
        height: 15,
        flexShrink: 0,
        padding: 0,
        border: 'none',
        borderRadius: 4,
        background: selected ? selectedColor : '#ffffff',
        cursor: 'pointer',
      }}
      {...props}
    >
      <svg width={glyphWidth} height={glyphHeight} viewBox={glyphViewBox} fill="none" aria-hidden="true">
        <path d={glyphPath} fill={selected ? '#ffffff' : '#929aa7'} />
      </svg>
    </button>
  )
}

function ButtonCheck({ selected, ...props }) {
  return (
    <ToggleSquareButton
      selected={selected}
      selectedColor="#a2c0a9"
      glyphPath={CHECK_GLYPH_PATH}
      glyphWidth={9}
      glyphHeight={8}
      glyphViewBox="0 0 8.74782 8.12581"
      {...props}
    />
  )
}

function ButtonEdit({ selected, ...props }) {
  return (
    <ToggleSquareButton
      selected={selected}
      selectedColor="#dfb537"
      glyphPath={PENCIL_GLYPH_PATH}
      glyphWidth={10}
      glyphHeight={10}
      glyphViewBox="0 0 9.99512 10.0144"
      {...props}
    />
  )
}

// --- CUE 1 · Company profile card ---------------------------------------------

const PROFILE_ROWS = [
  { label: 'Brands', values: tenant.brands },
  {
    label: 'Privacy regulations in scope',
    values: ['CCPA/CPRA (California)', 'VCDPA (Virginia)', 'CPA (Colorado)', 'GDPR (Germany)'],
  },
  { label: 'Customer countries', values: ['United States', 'Germany', 'Austria'] },
  { label: 'Employees', values: ['United States', 'Germany'] },
]

// Each row toggles independently between three states, check and pencil
// mutually exclusive per build spec: 'approved' (check turns green) or
// 'editing' (pencil becomes a solid-yellow badge and every chip in the row
// gets a remove ×). Local to the card — it unmounts/remounts whenever the
// presenter returns to beat 0, so it resets for free (README #3).
function ProfileCard({ austriaRemoved, onRemoveAustria }) {
  const [rowStatus, setRowStatus] = useState({})
  const [removedTags, setRemovedTags] = useState({})

  function toggleApproved(label) {
    setRowStatus((prev) => ({ ...prev, [label]: prev[label] === 'approved' ? undefined : 'approved' }))
  }
  function toggleEditing(label) {
    setRowStatus((prev) => ({ ...prev, [label]: prev[label] === 'editing' ? undefined : 'editing' }))
  }
  function removeTag(label, value) {
    setRemovedTags((prev) => ({ ...prev, [label]: [...(prev[label] || []), value] }))
    // The Austria removal from Customer countries is the one scripted
    // beat (build spec §1.1) — still fires the agent's "Got it" reply
    // when it happens through this general edit affordance.
    if (label === 'Customer countries' && value === 'Austria' && !austriaRemoved) onRemoveAustria()
  }

  return (
    <Card>
      {PROFILE_ROWS.map((row, i) => {
        const status = rowStatus[row.label]
        const removed = removedTags[row.label] || []
        const editing = status === 'editing'
        return (
          <div
            key={row.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: '12px var(--space-4)',
              borderBottom: i < PROFILE_ROWS.length - 1 ? '1px solid var(--ot-border)' : 'none',
            }}
          >
            <span style={{ width: 200, flexShrink: 0, font: '600 12.5px "Open Sans", sans-serif', color: 'var(--ot-ink-2)' }}>
              {row.label}
            </span>
            <span style={{ flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {row.values
                .filter((v) => !removed.includes(v))
                .map((v) =>
                  editing ? (
                    <RemovableChip key={v} label={v} onRemove={() => removeTag(row.label, v)} />
                  ) : (
                    <GroundingChip key={v} label={v} />
                  )
                )}
            </span>
            <span style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <ButtonCheck
                selected={status === 'approved'}
                aria-label={status === 'approved' ? `${row.label} approved` : `Approve ${row.label}`}
                onClick={() => toggleApproved(row.label)}
              />
              <ButtonEdit
                selected={editing}
                aria-label={editing ? `Stop editing ${row.label}` : `Edit ${row.label}`}
                onClick={() => toggleEditing(row.label)}
              />
            </span>
          </div>
        )
      })}
    </Card>
  )
}

// Chip grammar with a remove × on hover — shown for every chip while its
// row is in edit mode (toggled via the row's pencil button).
function RemovableChip({ label, onRemove }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onRemove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '1px 8px',
        borderRadius: 'var(--radius-chip)',
        border: `1px solid ${hover ? 'var(--ot-danger)' : 'var(--ot-border)'}`,
        background: hover ? 'var(--ot-danger-tint)' : 'var(--ot-surface)',
        color: hover ? 'var(--ot-danger)' : 'var(--ot-ink-2)',
        font: '400 12.5px "Open Sans", sans-serif',
        cursor: 'pointer',
      }}
    >
      {label}
      <span style={{ font: '600 12px "Open Sans", sans-serif', opacity: hover ? 1 : 0.45 }}>×</span>
    </button>
  )
}

// --- CUE 3 · Upload moment -----------------------------------------------------

function UploadMessage({ isNew }) {
  return (
    <div className={isNew ? 'anim-enter' : undefined} style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 0 var(--space-4)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 560 }}>
        {tenant.documents.map((doc, i) => (
          <span
            key={doc}
            className={isNew ? 'anim-enter' : undefined}
            style={{
              '--stagger-i': i,
              '--stagger-step': '180ms',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: 'var(--ot-surface)',
              border: '1px solid var(--ot-border)',
              borderRadius: 'var(--radius-control)',
              font: '400 13px "Open Sans", sans-serif',
              color: 'var(--ot-ink)',
            }}
          >
            <span style={{ color: 'var(--ot-ink-2)', display: 'flex', flexShrink: 0 }}>
              <FileIcon width={15} height={15} />
            </span>
            {doc}
          </span>
        ))}
      </div>
    </div>
  )
}

// --- CUE 4 · Decomposed playbook card ------------------------------------------

// Entries verbatim from 03 CUE 4. Expandable one level (build spec §1.1):
// opening an entry reveals the source document behind its tag — decomposed
// rule → the file it came from.
const TAG_TO_DOCUMENT = {
  'SOP §4.2': 'DSAR Standard Operating Procedure.pdf',
  'SOP §2.1': 'DSAR Standard Operating Procedure.pdf',
  'SOP §5.3': 'DSAR Standard Operating Procedure.pdf',
  'Customer Data Flows': 'Customer Data Flows.pdf',
  'Brand + Tone Guide': 'Meridian Brand + Tone Guide.pdf',
  'Response Letter Examples': 'Response Letter Examples.docx',
}

const PLAYBOOK = [
  {
    column: 'Process rules',
    entries: [
      {
        text: 'Access packages containing support transcripts: redact third-party personal information; privacy sign-off required before disclosure',
        tag: 'SOP §4.2',
      },
      { text: 'Identity verification required before any data handling', tag: 'SOP §2.1' },
      { text: 'Deletion holds: accounts with open disputes route to Legal', tag: 'SOP §5.3' },
    ],
  },
  {
    column: 'Data landscape',
    entries: [
      { text: 'Customer records: Salesforce', tag: 'Customer Data Flows' },
      { text: 'Marketing profiles: Marketo', tag: 'Customer Data Flows' },
      { text: 'Support tickets + transcripts: Zendesk', tag: 'Customer Data Flows' },
      {
        text: 'Transactions + Alpine Rewards balances: internal warehouse (owner: Daniel Okafor)',
        tag: 'Customer Data Flows',
      },
    ],
  },
  {
    column: 'Voice & brand',
    entries: [
      { text: 'Plain, warm, direct; short sentences; no legalese in body text', tag: 'Brand + Tone Guide' },
      { text: "Loyalty program is always 'Alpine Rewards'", tag: 'Brand + Tone Guide' },
      { text: 'Response letters follow the Meridian letter structure', tag: 'Response Letter Examples' },
    ],
  },
]

function PlaybookCard() {
  const [expanded, setExpanded] = useState(null)
  return (
    <Card style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
      {PLAYBOOK.map((col, ci) => (
        <div key={col.column} style={{ padding: 'var(--space-4)', borderLeft: ci > 0 ? '1px solid var(--ot-border)' : 'none' }}>
          <div style={{ font: '600 12.5px "Open Sans", sans-serif', color: 'var(--ot-ink-2)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 'var(--space-3)' }}>
            {col.column}
          </div>
          {col.entries.map((entry) => {
            const key = `${col.column}:${entry.text}`
            const open = expanded === key
            return (
              <div key={key} style={{ marginBottom: 'var(--space-3)' }}>
                <button
                  onClick={() => setExpanded(open ? null : key)}
                  style={{
                    display: 'flex',
                    gap: 6,
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ color: 'var(--ot-ink-3)', flexShrink: 0, paddingTop: 3, display: 'flex' }}>
                    {open ? <ChevronDownIcon width={12} height={12} /> : <ChevronRightIcon width={12} height={12} />}
                  </span>
                  <span style={{ font: '400 13px/1.5 "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>{entry.text}</span>
                </button>
                <div style={{ marginTop: 5, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' }}>
                  <GroundingChip label={entry.tag} />
                  {open && (
                    <span className="anim-enter" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '400 12.5px "Open Sans", sans-serif', color: 'var(--ot-ink-2)' }}>
                      <FileIcon width={13} height={13} />
                      {TAG_TO_DOCUMENT[entry.tag]}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </Card>
  )
}

// --- CUE 5 · Intake agent tiles ------------------------------------------------

// Tile colors: Northwind and Meridian corporate come from the 02 §2 token
// sets; Cascade Home and Alpine Rewards have no spec'd palette (data-only
// brands), so they get tasteful siblings — a housewares teal, and the
// family's shared copper for the loyalty program.
const TILES = [
  { name: 'Northwind Outfitters', color: 'var(--nw-pine)', tint: '#EDF2EF', regs: ['CCPA/CPRA', 'VCDPA', 'CPA', 'GDPR'], preview: true },
  { name: 'Cascade Home', color: '#33606E', tint: '#EBF1F3', regs: ['CCPA/CPRA', 'VCDPA', 'CPA', 'GDPR'] },
  { name: 'Alpine Rewards', color: 'var(--mer-copper)', tint: '#F8EFE7', regs: ['CCPA/CPRA', 'VCDPA', 'CPA', 'GDPR'] },
  // Employees sit in California + Germany only — VCDPA/CPA don't cover
  // employee data, and this audience would catch that.
  { name: 'Meridian Employees', color: 'var(--mer-navy)', tint: '#EDF0F3', regs: ['CCPA/CPRA', 'GDPR'] },
]

function TilesCard({ onPreview }) {
  return (
    <Card style={{ padding: 'var(--space-4)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-3)' }}>
        {TILES.map((tile, i) => (
          <button
            key={tile.name}
            onClick={tile.preview ? onPreview : undefined}
            className="anim-enter"
            style={{
              '--stagger-i': i,
              textAlign: 'left',
              padding: 'var(--space-3)',
              background: tile.tint,
              border: '1px solid var(--ot-border)',
              borderTop: `3px solid ${tile.color}`,
              borderRadius: 'var(--radius-card)',
              cursor: tile.preview ? 'pointer' : 'default',
              display: 'grid',
              gap: 8,
              alignContent: 'start',
            }}
          >
            <span style={{ font: `600 13.5px var(--mer-font)`, color: tile.color }}>{tile.name}</span>
            <span style={{ font: '400 12px/1.5 "Open Sans", sans-serif', color: 'var(--ot-ink-2)' }}>
              Request types: Access · Deletion · Correction · Opt-Out
            </span>
            <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {tile.regs.map((r) => (
                <GroundingChip key={r} label={r} />
              ))}
            </span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
        <button
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-control)',
            border: 'none',
            background: 'var(--ot-green)',
            color: '#fff',
            font: '600 13.5px "Open Sans", sans-serif',
            cursor: 'pointer',
          }}
        >
          Approve all four
        </button>
      </div>
    </Card>
  )
}

// Mini preview of the Northwind intake agent — rendered live from the Act 2
// brand components rather than a static image, so it foreshadows the real
// thing exactly.
function NorthwindPreview({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(31, 41, 51, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="anim-enter"
        style={{
          width: 460,
          background: 'var(--nw-sand)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-overlay)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 12px 0' }}>
          <button
            onClick={onClose}
            aria-label="Close preview"
            style={{ border: 'none', background: 'none', color: 'var(--nw-pine)', font: '600 16px sans-serif', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '8px 40px 40px', display: 'grid', gap: 18, justifyItems: 'center' }}>
          <NorthwindWordmark height={44} />
          <div style={{ textAlign: 'center', display: 'grid', gap: 8 }}>
            <span style={{ font: `600 22px var(--mer-font)`, color: 'var(--nw-pine)' }}>Your data, your call.</span>
            <span style={{ font: '400 13.5px/1.5 "Open Sans", sans-serif', color: 'var(--mer-ink)' }}>
              Ask us for a copy of your data, or ask us to delete it. We'll handle the rest.
            </span>
          </div>
          <span style={{ font: `500 12px var(--mer-font)`, letterSpacing: 1, color: 'var(--nw-pine)', opacity: 0.75 }}>
            Identify → Request → Confirm
          </span>
        </div>
      </div>
    </div>
  )
}

// --- CUE 6 · Systems & integrations --------------------------------------------

// Row status by choreography step: Salesforce configures at step 3, lands
// at 4; Marketo 4→5; Zendesk 5→6. Config notes: Salesforce's is verbatim
// from 03; the other two follow its pattern with their fixture template
// versions.
const INTEGRATIONS = [
  { name: 'Salesforce', note: 'Configured from template v3.2 for meridian.my.salesforce.com', configuringAt: 3, connectedAt: 4 },
  { name: 'Marketo', note: 'Configured from template v2.8', configuringAt: 4, connectedAt: 5 },
  { name: 'Zendesk', note: 'Configured from template v3.0', configuringAt: 5, connectedAt: 6 },
]

function IntegrationsCard({ step }) {
  return (
    <Card>
      {INTEGRATIONS.map((row) => {
        const status = step >= row.connectedAt ? 'Connected' : step >= row.configuringAt ? 'Configuring' : 'Pending'
        return (
          <div
            key={row.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: '13px var(--space-4)',
              borderBottom: '1px solid var(--ot-border)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 14px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>{row.name}</div>
              {status === 'Connected' && (
                <div className="anim-enter" style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-2)', marginTop: 3 }}>
                  {row.note}
                </div>
              )}
              {status === 'Configuring' && <div className="agent-shimmer" style={{ marginTop: 8, width: 110 }} />}
            </div>
            <StatusPill status={status} />
          </div>
        )
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '13px var(--space-4)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '600 14px "Open Sans", sans-serif', color: 'var(--ot-ink)' }}>Internal warehouse</div>
          <div style={{ font: 'var(--fs-meta)', color: 'var(--ot-ink-2)', marginTop: 3 }}>
            Tasks will route to Daniel Okafor (Data Platform) in Microsoft Teams, tracked in your ITSM.
          </div>
        </div>
        <StatusPill status="No integration" />
      </div>
    </Card>
  )
}
