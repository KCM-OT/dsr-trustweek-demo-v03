import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCue, useSceneBeats } from '../../cue/CueContext'
import { AiLoader } from '../../components/AiLoader'
import { SendIcon } from '../../shell/icons'

// Act 1 capstone — the generated DSAR intake workflow, rebuilt from Figma
// "workflow for vercel" (DSR-2026, node 187:3734). Geometry, copy, colors
// and every connector line come straight from that frame: the connectors
// and the zoom/pan glyphs are the design's own exported SVGs (public/figma),
// never redrawn here. Tooltips are mapped onto the frame's node labels
// (step-intake, access-customer-records, deletion-route-to-legal, …) so the
// grounding lines from 03's playbook rules + fixtures §tenant still attach
// to the element they describe.

// ---------------------------------------------------------------------------
// Frame constants (Figma frame 1950×1178; the canvas region starts at y=200,
// below the page header (136) + tag legend row (65). All diagram coordinates
// below are canvas-local, i.e. frame y minus 200.)
// ---------------------------------------------------------------------------

const DIAGRAM_W = 1950
const DIAGRAM_H = 978
const CARD_W = 176
const CARD_H = 63
const BAR_W = 18
const DOT = 12 // Ellipse 2 / Ellipse 3 — white connector dots on card edges

const INK = '#1a1a1a'
const INK_2 = '#4d4d4d'
const LINK = '#167cbb'
const CANVAS_BG = '#f4f6f8'
const SURFACE = '#ffffff'
const CARD_BORDER = '#e8e8e8'
const GROUP_BG = '#eceef0'
const CHIP_BORDER = '#468254'
const CHIP_INK = '#2c6145'
const TOOL_BORDER = '#e5e5e5'

// ---------------------------------------------------------------------------
// Cards. `id` is the Figma node name — the label used to attach each tooltip.
// ---------------------------------------------------------------------------

const CARDS = [
  {
    id: 'step-intake',
    lane: 'trunk',
    x: 38,
    y: 446,
    bar: '#6ceead',
    title: ['Intake'],
    sub: ['Branded intake agents'],
    dots: { right: [478] },
    tip: "Structured request experiences that can also answer requesters' questions — one per consumer brand, one for employees",
  },
  {
    id: 'step-identity',
    lane: 'trunk',
    x: 245,
    y: 446,
    bar: '#6ce1ee',
    title: ['Verify identity'],
    sub: ['Before any data handling'],
    dots: { left: [478], right: [455, 470, 485, 500] },
    tip: 'Identity verification required before any data handling — from your SOP §2.1',
  },
  {
    id: 'opt-out-suppress-marketings',
    lane: 'optout',
    x: 1237,
    y: 55,
    bar: '#79ee6c',
    title: ['Suppress marketing'],
    sub: ['Marketo'],
    dots: { left: [87], right: [87] },
    tip: 'Marketing profiles: Marketo — suppress marketing preferences across systems, from your Customer Data Flows',
  },
  {
    id: 'access-internal-warehouse',
    lane: 'access',
    x: 648,
    y: 158,
    bar: '#6c93ee',
    title: ['Internal warehouse'],
    sub: ['Owner: Danial Okafor'],
    dots: { left: [190], right: [190] },
    tip: 'Tasks route to Danial Okafor (Data Platform) in Microsoft Teams, tracked in your ITSM',
  },
  {
    id: 'access-customer-records',
    lane: 'access',
    x: 648,
    y: 233,
    bar: '#936cee',
    title: ['Customer records'],
    sub: ['Salesforce'],
    dots: { left: [265], right: [265] },
    tip: 'Customer records — from your Customer Data Flows',
  },
  {
    id: 'access-marketing-profiles',
    lane: 'access',
    x: 648,
    y: 308,
    bar: '#936cee',
    title: ['Marketing profiles'],
    sub: ['Marketo'],
    dots: { left: [340], right: [340] },
    tip: 'Marketing profiles — from your Customer Data Flows',
  },
  {
    id: 'access-support-tickets',
    lane: 'access',
    x: 648,
    y: 383,
    bar: '#936cee',
    title: ['Support tickets &', 'transcripts'],
    sub: ['Zendesk'],
    dots: { left: [415], right: [415] },
    tip: 'Support tickets + transcripts — from your Customer Data Flows',
  },
  {
    id: 'access-redact',
    lane: 'access',
    x: 894,
    y: 270,
    bar: '#e16cee',
    title: ['Redact third-party', 'personal information'],
    dots: { left: [301], right: [301] },
    tip: 'Access packages containing support transcripts: redact third-party personal information — from your SOP §4.2',
  },
  {
    id: 'access-privacy-sigh-off',
    lane: 'access',
    x: 1104,
    y: 270,
    bar: '#ee6cad',
    title: ['Privacy sign-off:', 'redactions'],
    dots: { left: [301], right: [301] },
    tip: 'Privacy sign-off required before disclosure — from your SOP §4.2',
  },
  {
    id: 'deletion-delete-records',
    lane: 'deletion',
    x: 648,
    y: 499,
    bar: '#d9b562',
    title: ['Delete records'],
    sub: ['Salesforce'],
    dots: { left: [531], right: [531] },
    tip: 'Customer records deletion — from your Customer Data Flows',
  },
  {
    id: 'deletion-delete-profiles',
    lane: 'deletion',
    x: 648,
    y: 575,
    bar: '#f5cd6f',
    title: ['Delete profiles'],
    sub: ['Marketo'],
    dots: { left: [607], right: [607] },
    tip: 'Marketing profiles deletion — from your Customer Data Flows',
  },
  {
    id: 'deletion-delete-support-data',
    lane: 'deletion',
    x: 648,
    y: 650,
    bar: '#f5cd6f',
    title: ['Delete support data'],
    sub: ['Zendesk'],
    dots: { left: [682], right: [682] },
    tip: 'Support tickets + transcripts deletion — from your Customer Data Flows',
  },
  {
    id: 'deletion-internal-warehouse',
    lane: 'deletion',
    x: 648,
    y: 725,
    bar: '#f5cd6f',
    title: ['Internal warehouse'],
    sub: ['Owner: Danial Okafor'],
    dots: { left: [757], right: [757] },
    tip: 'Deletion tasks route to Danial Okafor (Data Platform) in Microsoft Teams, tracked in your ITSM',
  },
  {
    id: 'deletion-route-to-legal',
    lane: 'deletion',
    x: 994,
    y: 612,
    bar: '#ba9c54',
    title: ['Route to legal'],
    sub: ['Accounts with open', 'disputes'],
    dots: { left: [644], right: [644] },
    tip: 'Deletion holds: accounts with open disputes route to Legal — from your SOP §5.3',
  },
  {
    id: 'correction-update-source-records',
    lane: 'correction',
    x: 1237,
    y: 822,
    bar: '#c7ee6c',
    title: ['Update source records'],
    sub: ['Where the data lives'],
    dots: { left: [854], right: [854] },
    tip: 'Update customer records, marketing profiles and support data at the source — from your Customer Data Flows',
  },
  {
    id: 'step-generate-response',
    lane: 'trunk',
    x: 1485,
    y: 446,
    bar: '#6ce1ee',
    title: ['Generate response'],
    dots: { left: [455, 470, 485, 500], right: [478] },
    tip: 'Response letters follow the Meridian letter structure — from your Response Letter Examples',
  },
  {
    id: 'step-deliver',
    lane: 'trunk',
    x: 1697,
    y: 446,
    bar: '#6ceead',
    title: ['Deliver'],
    dots: { left: [478] },
    tip: "Plain and warm, in the requester's language — from your Brand + Tone Guide",
  },
]

// Not part of the Figma frame — this card only exists once the agent chat
// (below) makes the scripted edit, so it has no exported connector SVG of
// its own. It stacks directly under "Privacy sign-off: redactions" (same
// x, lane still 'access') and is joined to it with a drawn vertical line
// plus a matching pair of EdgeDots (bottom of the sign-off card, top of
// this card), so the link reads the same as the design's real connectors.
const ESCALATION_CARD = {
  id: 'access-escalate-legal',
  lane: 'access',
  x: 1104,
  y: 373,
  bar: '#ba9c54',
  title: ['Escalate to legal'],
  sub: ['High-risk flags'],
  tip: 'Added via chat — high-risk access requests flagged in review are escalated to Legal before delivery.',
}

// The design's own exported connector artwork — placed at Figma geometry.
const CONNECTORS = [
  { src: 'connector-step1-and-step2.svg', lane: 'trunk', x: 210.333, y: 475.333, w: 38.334, h: 5.334 },
  { src: 'connector-last-steps.svg', lane: 'trunk', x: 1657.333, y: 475.333, w: 43.334, h: 5.334 },

  { src: 'connector-opt-out-a.svg', lane: 'optout', x: 417.333, y: 83.333, w: 823.334, h: 374.334 },
  { src: 'connector-opt-out-b.svg', lane: 'optout', x: 1410.333, y: 83.333, w: 78.334, h: 374.334 },

  { src: 'connector-access-in.svg', lane: 'access', x: 417.333, y: 300.5, w: 79.667, h: 172.167 },
  { src: 'fan-vector-9-a.svg', lane: 'access', x: 579.5, y: 186.333, w: 72.167, h: 116.167 },
  { src: 'fan-vector-10-access-out.svg', lane: 'access', x: 556, y: 301.5, w: 95.667, h: 116.167 },
  { src: 'fan-stub-left.svg', lane: 'access', x: 614.5, y: 261.833, w: 37.167, h: 5.334 },
  { src: 'fan-stub-left.svg', lane: 'access', x: 614.5, y: 337.333, w: 37.167, h: 5.334 },
  { src: 'fan-vector-9-b.svg', lane: 'access', x: 821.333, y: 186.333, w: 72.167, h: 116.167 },
  { src: 'fan-vector-10-access-in.svg', lane: 'access', x: 821.333, y: 299.333, w: 77.334, h: 118.334 },
  { src: 'fan-stub-right.svg', lane: 'access', x: 821.333, y: 261.833, w: 37.167, h: 5.334 },
  { src: 'fan-stub-right.svg', lane: 'access', x: 821.333, y: 337.333, w: 37.167, h: 5.334 },
  { src: 'connector-access-mid.svg', lane: 'access', x: 1066.333, y: 299.333, w: 41.334, h: 5.334 },
  { src: 'connector-access-out.svg', lane: 'access', x: 1276.333, y: 299.333, w: 212.334, h: 173.334 },

  { src: 'connector-deletion-in.svg', lane: 'deletion', x: 417.333, y: 482.333, w: 79.667, h: 162.167 },
  { src: 'fan-vector-9-a.svg', lane: 'deletion', x: 579.5, y: 528.333, w: 72.167, h: 116.167 },
  { src: 'fan-vector-10-deletion-out.svg', lane: 'deletion', x: 527, y: 643.5, w: 124.667, h: 116.167 },
  { src: 'fan-stub-left.svg', lane: 'deletion', x: 614.5, y: 603.833, w: 37.167, h: 5.334 },
  { src: 'fan-stub-left.svg', lane: 'deletion', x: 614.5, y: 679.333, w: 37.167, h: 5.334 },
  { src: 'fan-vector-9-b.svg', lane: 'deletion', x: 820.333, y: 528.333, w: 72.167, h: 116.167 },
  { src: 'fan-vector-10-deletion-in.svg', lane: 'deletion', x: 820.333, y: 641.333, w: 177.334, h: 118.334 },
  { src: 'fan-stub-right.svg', lane: 'deletion', x: 820.333, y: 603.833, w: 37.167, h: 5.334 },
  { src: 'fan-stub-right.svg', lane: 'deletion', x: 820.333, y: 679.333, w: 37.167, h: 5.334 },
  { src: 'connector-deletion-out.svg', lane: 'deletion', x: 1166.333, y: 482.333, w: 322.334, h: 164.334 },

  { src: 'connector-correction-in.svg', lane: 'correction', x: 417.333, y: 497.333, w: 823.334, h: 359.334 },
  { src: 'connector-correction-out.svg', lane: 'correction', x: 1410.333, y: 497.333, w: 78.334, h: 359.334 },
]

// background-access-group / background-deletion-group
const LANE_PANELS = [
  { lane: 'access', x: 590, y: 141, w: 711, h: 321 },
  { lane: 'deletion', x: 590, y: 483, w: 711, h: 321 },
]

// Button-opt-out / Button-access / Button-deletion / Button-correction
const LANE_CHIPS = [
  { lane: 'optout', label: 'opt-out', x: 487, y: 71, w: 83 },
  { lane: 'access', label: 'access', x: 487, y: 284, w: 76 },
  { lane: 'deletion', label: 'deletion', x: 487, y: 628, w: 88 },
  { lane: 'correction', label: 'correction', x: 487, y: 837, w: 102 },
]

// tag-button-div — the legend strip under the page header
const LANE_TAGS = [
  { lane: 'optout', label: 'OPT-OUT', accent: '#8ee86d', desc: 'Suppress marketing preferences across systems (e.g. Marketo)' },
  { lane: 'access', label: 'ACCESS', accent: '#6986e6', desc: 'Retrieve, redact, and review personal data before delivery' },
  { lane: 'deletion', label: 'DELETION', accent: '#e4c26b', desc: 'Delete data across all systems; route edge cases to legal' },
  { lane: 'correction', label: 'CORRECTION', accent: '#c9ea6e', desc: 'Update source records where data lives' },
]

const ZOOM_STEPS = [0.4, 0.5, 0.6, 0.7, 0.85, 1, 1.25, 1.5]

function laneDimmed(focus, lane) {
  return Boolean(focus) && lane !== 'trunk' && lane !== focus
}

// Beat 0 is the free-roam interactive chart (zoom/pan/hover, plus the chat
// bubble always available for manual clicks). Beat 1 is the scripted cue
// step: entering it opens the "ask the agent" panel and fires the same
// escalation request the chip sends manually, so clicking through the cue
// deck demonstrates the edit without the presenter having to drive the
// chat by hand. Advancing past beat 1 continues to the workflows list.
const BEATS = ['Flow chart (interactive)', 'Agent escalates high-risk requests to Legal']

export function FlowChartScene() {
  const navigate = useNavigate()
  // Never a cue dead-end: advancing past beat 1 continues to the generated
  // workflows list (/setup/workflows) — the flow chart's four lanes turned
  // into individual, reviewable workflows; stepping back from beat 0
  // returns to the setup conversation at its final pre-handoff state (beat
  // 6 — beat 7 would immediately hand off here again).
  const beat = useSceneBeats(
    'setup-flow',
    'Generated flow chart',
    BEATS,
    () => navigate('/setup/workflows'),
    () => navigate('/setup', { state: { beat: 6 } })
  )

  const [focus, setFocus] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [zoomIndex, setZoomIndex] = useState(3) // 70%, matching the frame
  const [panTool, setPanTool] = useState(false)
  const [pan, setPan] = useState({ x: 40, y: 0 })
  const dragRef = useRef(null)
  const viewportRef = useRef(null)
  const zoom = ZOOM_STEPS[zoomIndex]

  // Scripted chat-driven edit — the agent chat bubble (bottom-right) lets
  // the presenter ask for a change to the generated chart; the one scripted
  // request adds the ESCALATION_CARD below the sign-off card. autoAskCount
  // increments each time beat 1 is entered via the cue deck, telling
  // AgentChatWidget to open itself and send the scripted prompt — guarded
  // on sceneId (not just beat) the same way RequestDetailScene is, since
  // `beat` still holds the PREVIOUS scene's leftover index for one render
  // right after a cross-scene navigation into this one.
  const [escalationAdded, setEscalationAdded] = useState(false)
  const [autoAskCount, setAutoAskCount] = useState(0)
  const { sceneId } = useCue()
  useEffect(() => {
    if (sceneId !== 'setup-flow') return
    if (beat === 1) setAutoAskCount((n) => n + 1)
  }, [beat, sceneId])

  // The frame is authored at 1950×978 and shown at 70%. On narrower viewports
  // that still overflows, so on mount we drop to the largest step that fits
  // the whole chart and centre it — the design's own zoom control takes over
  // from there.
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const fit = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width) return
      let next = 3
      while (next > 0 && DIAGRAM_W * ZOOM_STEPS[next] > width - 24) next -= 1
      const z = ZOOM_STEPS[next]
      setZoomIndex(next)
      setPan({
        x: Math.max(12, (width - DIAGRAM_W * z) / 2),
        y: Math.max(0, (height - DIAGRAM_H * z) / 2),
      })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 1s scripted pause, slide 8 → 9 (build spec: a loader beat between the
  // setup conversation's handoff line and the generated chart appearing).
  const [entering, setEntering] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 1000)
    return () => clearTimeout(t)
  }, [])

  const hoveredCard = hovered ? CARDS.find((c) => c.id === hovered) : null

  function startDrag(e) {
    if (e.button !== 0) return
    dragRef.current = { x: e.clientX, y: e.clientY, pan }
  }

  function onDrag(e) {
    const d = dragRef.current
    if (!d) return
    setPan({ x: d.pan.x + (e.clientX - d.x), y: d.pan.y + (e.clientY - d.y) })
  }

  function endDrag() {
    dragRef.current = null
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100%', background: CANVAS_BG }}>
      {entering && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: CANVAS_BG,
          }}
        >
          <AiLoader size={56} />
        </div>
      )}

      <PageHeader />

      <div style={{ display: 'flex', flexShrink: 0, background: SURFACE, borderBottom: `1px solid ${TOOL_BORDER}` }}>
        {LANE_TAGS.map((tag) => (
          <button
            key={tag.lane}
            type="button"
            onClick={() => setFocus((f) => (f === tag.lane ? null : tag.lane))}
            aria-pressed={focus === tag.lane}
            style={{
              width: 246,
              height: 65,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '12px 15px',
              border: 'none',
              borderRight: `1px solid ${TOOL_BORDER}`,
              background: focus === tag.lane ? '#f7fafb' : SURFACE,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <span style={{ width: 3, height: 41, flexShrink: 0, background: tag.accent }} />
            <span style={{ width: 199, display: 'block' }}>
              <span style={{ display: 'block', font: '700 12px/16px "Open Sans", sans-serif', color: INK }}>{tag.label}</span>
              <span style={{ display: 'block', font: '400 12px/16px "Open Sans", sans-serif', color: INK_2 }}>{tag.desc}</span>
            </span>
          </button>
        ))}
      </div>

      <div
        ref={viewportRef}
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClick={() => setFocus(null)}
        style={{
          position: 'relative',
          flex: 1,
          minHeight: 620,
          overflow: 'hidden',
          background: CANVAS_BG,
          cursor: panTool ? 'grab' : 'default',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: DIAGRAM_W,
            height: DIAGRAM_H,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {LANE_PANELS.map((panel) => (
            <div
              key={panel.lane}
              style={{
                position: 'absolute',
                left: panel.x,
                top: panel.y,
                width: panel.w,
                height: panel.h,
                background: GROUP_BG,
                borderRadius: 8,
                opacity: laneDimmed(focus, panel.lane) ? 0.3 : 1,
                transition: 'opacity 200ms var(--motion-ease, ease)',
              }}
            />
          ))}

          {CONNECTORS.map((line, i) => (
            <img
              key={`${line.src}-${i}`}
              src={`/figma/${line.src}`}
              alt=""
              aria-hidden="true"
              draggable="false"
              style={{
                position: 'absolute',
                left: line.x,
                top: line.y,
                width: line.w,
                height: line.h,
                opacity: laneDimmed(focus, line.lane) ? 0.2 : 1,
                transition: 'opacity 200ms var(--motion-ease, ease)',
              }}
            />
          ))}

          {LANE_CHIPS.map((chip) => {
            const active = focus === chip.lane
            return (
              <button
                key={chip.lane}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setFocus(active ? null : chip.lane)
                }}
                aria-pressed={active}
                style={{
                  position: 'absolute',
                  left: chip.x,
                  top: chip.y,
                  width: chip.w,
                  height: 32,
                  padding: '6px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: active ? '#eef6f1' : SURFACE,
                  border: `1px solid ${CHIP_BORDER}`,
                  borderRadius: 4,
                  color: CHIP_INK,
                  font: '600 14px/20px "Open Sans", sans-serif',
                  cursor: 'pointer',
                  opacity: laneDimmed(focus, chip.lane) ? 0.3 : 1,
                  transition: 'opacity 200ms var(--motion-ease, ease)',
                }}
              >
                {chip.label}
              </button>
            )
          })}

          {CARDS.map((card) => (
            <FlowCard
              key={card.id}
              card={card}
              dimmed={laneDimmed(focus, card.lane)}
              active={hovered === card.id}
              onHover={setHovered}
            />
          ))}

          {escalationAdded && (
            <>
              {/* Vertical link from the sign-off card's bottom edge (270 + CARD_H)
                  down to this card's top edge, centered on both cards' shared x. */}
              <span
                className="anim-enter"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: ESCALATION_CARD.x + CARD_W / 2 - 2,
                  top: 270 + CARD_H,
                  width: 4,
                  height: ESCALATION_CARD.y - (270 + CARD_H),
                  background: CARD_BORDER,
                  opacity: laneDimmed(focus, ESCALATION_CARD.lane) ? 0.3 : 1,
                }}
              />
              {/* EdgeDots at each end, matching how every other connector in the
                  diagram meets its card (white dot, light ring) — sign-off's
                  bottom edge and this card's top edge. */}
              <span
                className="anim-enter"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: ESCALATION_CARD.x + CARD_W / 2 - DOT / 2,
                  top: 270 + CARD_H - DOT / 2,
                  width: DOT,
                  height: DOT,
                  background: SURFACE,
                  border: `2px solid ${CARD_BORDER}`,
                  borderRadius: '50%',
                  opacity: laneDimmed(focus, ESCALATION_CARD.lane) ? 0.3 : 1,
                }}
              />
              <span
                className="anim-enter"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: ESCALATION_CARD.x + CARD_W / 2 - DOT / 2,
                  top: ESCALATION_CARD.y - DOT / 2,
                  width: DOT,
                  height: DOT,
                  background: SURFACE,
                  border: `2px solid ${CARD_BORDER}`,
                  borderRadius: '50%',
                  opacity: laneDimmed(focus, ESCALATION_CARD.lane) ? 0.3 : 1,
                }}
              />
              <FlowCard
                card={ESCALATION_CARD}
                dimmed={laneDimmed(focus, ESCALATION_CARD.lane)}
                active={hovered === ESCALATION_CARD.id}
                onHover={setHovered}
                className="anim-enter"
              />
            </>
          )}
        </div>

        {hoveredCard && (
          <NodeTooltip card={hoveredCard} zoom={zoom} pan={pan} />
        )}

        <NavigationTools
          zoom={zoom}
          panTool={panTool}
          canZoomOut={zoomIndex > 0}
          canZoomIn={zoomIndex < ZOOM_STEPS.length - 1}
          onZoomOut={() => setZoomIndex((i) => Math.max(0, i - 1))}
          onZoomIn={() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
          onTogglePan={() => setPanTool((v) => !v)}
        />

        <AgentChatWidget
          escalationAdded={escalationAdded}
          onEscalate={() => setEscalationAdded(true)}
          autoAskCount={autoAskCount}
        />
      </div>
    </div>
  )
}

// Page-header-intake-workflow
function PageHeader() {
  return (
    <header style={{ flexShrink: 0, background: SURFACE, borderBottom: `1px solid ${TOOL_BORDER}`, padding: '24px' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, font: '400 14px/20px "Open Sans", sans-serif' }}>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: LINK, textDecoration: 'none' }}>
          Setup
        </a>
        <span style={{ color: INK_2 }}>{'>'}</span>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: LINK, textDecoration: 'none' }}>
          Privacy Agent
        </a>
        <span style={{ color: INK_2 }}>{'>'}</span>
        <span style={{ color: INK }}>DSAR Intake Workflow</span>
      </nav>
      <h1 style={{ marginTop: 8, font: '600 28px/36px "Open Sans", sans-serif', color: INK }}>DSAR Intake Workflow</h1>
      <p style={{ marginTop: 4, font: '400 15px/22px "Open Sans", sans-serif', color: INK_2 }}>
        Data subject access request - intake path overview
      </p>
    </header>
  )
}

function FlowCard({ card, dimmed, active, onHover, className }) {
  const titleLines = card.title
  const subLines = card.sub || []
  const totalLines = titleLines.length + subLines.length
  const top = totalLines === 1 ? 23 : Math.floor((CARD_H - totalLines * 16) / 2)

  return (
    <div
      className={className}
      onMouseEnter={() => onHover(card.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(card.id)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      aria-label={`${titleLines.join(' ')}${subLines.length ? `. ${subLines.join(' ')}` : ''}. ${card.tip}`}
      style={{
        position: 'absolute',
        left: card.x,
        top: card.y,
        width: CARD_W,
        height: CARD_H,
        background: SURFACE,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 7,
        opacity: dimmed ? 0.3 : 1,
        transition: 'opacity 200ms var(--motion-ease, ease), box-shadow 150ms var(--motion-ease, ease)',
        boxShadow: active && !dimmed ? '0 4px 12px rgba(26,26,26,0.14)' : 'none',
        zIndex: active ? 6 : 4,
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: BAR_W,
          height: '100%',
          background: card.bar,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: '7px 0 0 7px',
        }}
      />
      <div style={{ position: 'absolute', left: 23, top, right: 8 }}>
        {titleLines.map((line, i) => (
          <span key={i} style={{ display: 'block', font: '700 12px/16px "Open Sans", sans-serif', color: INK, whiteSpace: 'nowrap' }}>
            {line}
          </span>
        ))}
        {subLines.map((line, i) => (
          <span key={i} style={{ display: 'block', font: '400 12px/16px "Open Sans", sans-serif', color: INK_2, whiteSpace: 'nowrap' }}>
            {line}
          </span>
        ))}
      </div>

      {(card.dots?.left || []).map((cy) => (
        <EdgeDot key={`l-${cy}`} left={-1 - DOT / 2} top={cy - card.y - DOT / 2} />
      ))}
      {(card.dots?.right || []).map((cy) => (
        <EdgeDot key={`r-${cy}`} left={CARD_W - 1 - DOT / 2} top={cy - card.y - DOT / 2} />
      ))}
    </div>
  )
}

// Ellipse 2 / Ellipse 3 — white 12px dot with a 2px light ring, straddling
// the card edge where a connector meets it.
function EdgeDot({ left, top }) {
  return (
    <span
      style={{
        position: 'absolute',
        left,
        top,
        width: DOT,
        height: DOT,
        background: SURFACE,
        border: `2px solid ${CARD_BORDER}`,
        borderRadius: '50%',
      }}
    />
  )
}

// Rendered outside the zoom transform so grounding copy stays legible at 70%.
function NodeTooltip({ card, zoom, pan }) {
  const left = card.x * zoom + pan.x
  const top = (card.y + CARD_H) * zoom + pan.y + 10

  return (
    <div
      role="tooltip"
      style={{
        position: 'absolute',
        left: Math.max(8, left),
        top,
        maxWidth: 300,
        padding: '8px 12px',
        background: INK,
        color: SURFACE,
        borderRadius: 8,
        font: '400 12.5px/1.45 "Open Sans", sans-serif',
        boxShadow: '0 8px 24px rgba(26,26,26,0.18)',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {card.tip}
    </div>
  )
}

// navigation-tools — zoom-out / percentage / zoom-in / divider / hand-pan,
// using the frame's own exported glyphs.
function NavigationTools({ zoom, panTool, canZoomOut, canZoomIn, onZoomOut, onZoomIn, onTogglePan }) {
  const toolButton = {
    width: 28,
    height: 28,
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    border: 'none',
    borderRadius: 6,
    background: 'transparent',
    cursor: 'pointer',
  }

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: 56,
        top: 35,
        height: 35,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 10px',
        background: SURFACE,
        border: `1px solid ${TOOL_BORDER}`,
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 2px rgba(0,0,0,0.05), 0 0 2px rgba(0,0,0,0.05)',
        zIndex: 15,
      }}
    >
      <button type="button" aria-label="Zoom out" disabled={!canZoomOut} onClick={onZoomOut} style={{ ...toolButton, opacity: canZoomOut ? 1 : 0.4 }}>
        <img src="/figma/zoom-out-function.svg" alt="" width="14" height="14" draggable="false" />
      </button>
      <span style={{ minWidth: 32, textAlign: 'center', font: '700 12px/16px "Open Sans", sans-serif', color: INK_2 }}>
        {Math.round(zoom * 100)}%
      </span>
      <button type="button" aria-label="Zoom in" disabled={!canZoomIn} onClick={onZoomIn} style={{ ...toolButton, opacity: canZoomIn ? 1 : 0.4 }}>
        <img src="/figma/zoom-in-function.svg" alt="" width="14" height="14" draggable="false" />
      </button>
      <span style={{ width: 1, height: 19, background: TOOL_BORDER }} />
      <button
        type="button"
        aria-label="Pan tool"
        aria-pressed={panTool}
        onClick={onTogglePan}
        style={{ ...toolButton, background: panTool ? '#eceef0' : 'transparent' }}
      >
        <img src="/figma/hand-pan-function.svg" alt="" width="13" height="14" draggable="false" />
      </button>
    </div>
  )
}

// Suggested edit surfaced as a one-click chip — the scripted request this
// prototype supports. Clicking it or typing free text both run the same
// canned exchange, so the demo can't dead-end on unexpected phrasing.
const SUGGESTED_PROMPT = 'Escalate flagged high-risk access requests to Legal'

// Floating agent chat — lets the presenter "edit" the generated chart from
// chat, mirroring the setup conversation's agent-message styling (Figma
// "chat-elements", node 492:15408; --ot-agent-* tokens) rather than
// reusing the Figma-frame chrome above. Scripted for the demo: any message
// sent before the escalation exists triggers the one canned edit; anything
// sent after gets a "already here" reply instead of adding a duplicate.
function AgentChatWidget({ escalationAdded, onEscalate, autoAskCount }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, thinking, open])

  // Cue-driven beat 1 ("Agent escalates high-risk requests to Legal"):
  // opens the panel and sends the exact scripted prompt, same as the
  // suggestion chip a presenter would click by hand. Skips 0 so mount
  // doesn't fire this before the cue ever asks for it.
  useEffect(() => {
    if (!autoAskCount) return
    setOpen(true)
    send(SUGGESTED_PROMPT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAskCount])

  function send(text) {
    const value = text.trim()
    if (!value || thinking) return
    setMessages((m) => [...m, { from: 'user', text: value }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      if (escalationAdded) {
        setMessages((m) => [
          ...m,
          { from: 'agent', text: 'That escalation step is already in this workflow — look for "Escalate to legal" under the privacy sign-off card.' },
        ])
      } else {
        onEscalate()
        setMessages((m) => [
          ...m,
          { from: 'agent', text: 'Done — I added an "Escalate to legal" step after the privacy sign-off, for high-risk access requests flagged in review.' },
        ])
      }
    }, 1100)
  }

  function stop(e) {
    e.stopPropagation()
  }

  return (
    <div onMouseDown={stop} onClick={stop} style={{ position: 'absolute', right: 24, bottom: 24, zIndex: 25 }}>
      {open && (
        <div
          role="dialog"
          aria-label="Ask the agent to update this workflow"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 64,
            width: 340,
            maxHeight: 460,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--ot-surface)',
            border: '1px solid var(--ot-border)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-overlay)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid var(--ot-border)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--fs-section)', color: 'var(--ot-ink)' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  borderRadius: '50%',
                  background: 'var(--ot-agent-avatar-bg)',
                }}
              >
                <img src="/figma/ai-indicator.svg" alt="" width={16} height={16} aria-hidden="true" />
              </span>
              Ask the agent
            </span>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              style={{ border: 'none', background: 'transparent', color: 'var(--ot-ink-3)', cursor: 'pointer', font: '400 20px/1 "Open Sans", sans-serif' }}
            >
              &times;
            </button>
          </div>

          <div ref={listRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px' }}>
            <ChatAgentMessage>
              Ask me to update this workflow — try the suggestion below, or type your own request.
            </ChatAgentMessage>

            {messages.map((msg, i) =>
              msg.from === 'user' ? (
                <ChatUserMessage key={i}>{msg.text}</ChatUserMessage>
              ) : (
                <ChatAgentMessage key={i}>{msg.text}</ChatAgentMessage>
              )
            )}

            {thinking && <ChatAgentMessage typing />}

            {messages.length === 0 && !thinking && (
              <button
                type="button"
                onClick={() => send(SUGGESTED_PROMPT)}
                className="anim-enter"
                style={{
                  display: 'block',
                  width: 'calc(100% - 37px)',
                  textAlign: 'left',
                  padding: '10px 14px',
                  margin: '0 0 0 37px',
                  background: 'var(--ot-agent-tint)',
                  border: '1px solid var(--ot-agent)',
                  borderRadius: 'var(--radius-control)',
                  color: 'var(--ot-agent)',
                  font: '600 13px/1.4 "Open Sans", sans-serif',
                  cursor: 'pointer',
                }}
              >
                {'"'}{SUGGESTED_PROMPT}{'"'}
              </button>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            style={{ flexShrink: 0, display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--ot-border)' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a change…"
              aria-label="Message the agent"
              style={{
                flex: 1,
                minWidth: 0,
                padding: '9px 12px',
                background: 'var(--ot-bg)',
                border: '1px solid var(--ot-border)',
                borderRadius: 'var(--radius-control)',
                color: 'var(--ot-ink)',
                font: '400 13.5px/1.4 "Open Sans", sans-serif',
              }}
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim() || thinking}
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 36,
                height: 36,
                flexShrink: 0,
                border: 'none',
                borderRadius: 'var(--radius-control)',
                background: 'var(--ot-agent)',
                color: '#fff',
                opacity: !input.trim() || thinking ? 0.5 : 1,
                cursor: !input.trim() || thinking ? 'default' : 'pointer',
              }}
            >
              <SendIcon width={16} height={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? 'Close agent chat' : 'Ask the agent to update this workflow'}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'grid',
          placeItems: 'center',
          width: 52,
          height: 52,
          border: 'none',
          borderRadius: '50%',
          background: 'var(--ot-agent)',
          boxShadow: 'var(--shadow-overlay)',
          cursor: 'pointer',
        }}
      >
        {open ? (
          <span style={{ color: '#fff', font: '400 22px/1 "Open Sans", sans-serif' }}>&times;</span>
        ) : (
          <img src="/figma/ai-indicator.svg" alt="" width={24} height={24} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

// Agent bubble — same shell as the setup conversation's AgentMessage
// (Figma "chat-elements", node 492:15408), reproduced locally since this
// scene's chat is its own scoped widget rather than a beat-driven transcript.
function ChatAgentMessage({ children, typing }) {
  return (
    <div className="anim-enter" style={{ display: 'flex', alignItems: 'flex-end', gap: 8, margin: '0 0 12px' }}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 29,
          height: 29,
          flexShrink: 0,
          borderRadius: '50%',
          background: 'var(--ot-agent-avatar-bg)',
        }}
      >
        <img src="/figma/ai-indicator.svg" alt="" width={16} height={16} aria-hidden="true" />
      </span>
      <div
        style={{
          background: 'var(--ot-agent-bubble-bg)',
          border: '1px solid var(--ot-agent-bubble-border)',
          borderRadius: '10px 10px 10px 0',
          padding: typing ? '11px 16px' : '12px 16px',
          maxWidth: 240,
        }}
      >
        {typing ? (
          <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </span>
        ) : (
          <p style={{ font: '400 13.5px/1.5 "Open Sans", sans-serif', color: 'var(--ot-ink)', margin: 0 }}>{children}</p>
        )}
      </div>
    </div>
  )
}

// User reply: right-aligned, plain surface — mirrors AdminMessage.
function ChatUserMessage({ children }) {
  return (
    <div className="anim-enter" style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 0 12px' }}>
      <div
        style={{
          background: 'var(--ot-bg)',
          border: '1px solid var(--ot-border)',
          borderRadius: 'var(--radius-card)',
          padding: '8px 14px',
          font: '400 13.5px/1.5 "Open Sans", sans-serif',
          color: 'var(--ot-ink)',
          maxWidth: 240,
        }}
      >
        {children}
      </div>
    </div>
  )
}
