import { useEffect, useMemo, useRef, useState } from 'react'
import { useCue } from './CueContext'
import { PROTOTYPE_TIMELINE, timelineIndexFor } from './prototypeTimeline'

const TONE = {
  agent: { accent: '#7a5af8', tint: '#f1edfe' },
  platform: { accent: '#3d7a44', tint: '#e7f2e9' },
  meridian: { accent: '#c56a2d', tint: '#faf6f0' },
  collaboration: { accent: '#5267b3', tint: '#eef1fb' },
  report: { accent: '#14304a', tint: '#edf2f6' },
  dashboard: { accent: '#2b6cd4', tint: '#edf3fe' },
}

export function PrototypeNavigator() {
  const { sceneId, beatIndex, jumpToStep } = useCue()
  const [expanded, setExpanded] = useState(true)
  const stripRef = useRef(null)
  const activeIndex = useMemo(() => timelineIndexFor(sceneId, beatIndex), [sceneId, beatIndex])

  useEffect(() => {
    if (!expanded || activeIndex < 0) return
    stripRef.current?.querySelector(`[data-step-index="${activeIndex}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeIndex, expanded])

  const current = activeIndex >= 0 ? PROTOTYPE_TIMELINE[activeIndex] : null

  return (
    <aside
      aria-label="Prototype navigation guide"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 900,
        pointerEvents: 'none',
      }}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="prototype-navigation-drawer"
        onClick={() => setExpanded((value) => !value)}
        style={{
          pointerEvents: 'auto',
          position: 'absolute',
          right: 18,
          bottom: expanded ? 174 : 0,
          height: 34,
          padding: '0 14px',
          border: '1px solid #303943',
          borderBottom: expanded ? 0 : '1px solid #303943',
          borderRadius: expanded ? '8px 8px 0 0' : '8px 8px 0 0',
          background: '#111820',
          color: '#f7f9fb',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          font: '600 12px/1 "Open Sans", sans-serif',
          boxShadow: '0 -4px 14px rgba(16, 24, 32, 0.18)',
          transition: 'bottom 180ms ease',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 14, transform: expanded ? 'rotate(180deg)' : 'none' }}>⌃</span>
        {expanded ? 'Hide guide' : `Show guide${current ? ` · ${activeIndex + 1}/${PROTOTYPE_TIMELINE.length}` : ''}`}
      </button>

      <div
        id="prototype-navigation-drawer"
        aria-hidden={!expanded}
        style={{
          pointerEvents: expanded ? 'auto' : 'none',
          height: expanded ? 174 : 0,
          overflow: 'hidden',
          background: 'rgba(12, 18, 24, 0.97)',
          borderTop: expanded ? '1px solid #303943' : 0,
          boxShadow: expanded ? '0 -10px 30px rgba(16, 24, 32, 0.2)' : 'none',
          transition: 'height 180ms ease',
        }}
      >
        <div style={{ height: '100%', padding: '12px 18px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 10, paddingRight: 116 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <span style={{ color: '#f7f9fb', font: '600 13px/1 "Open Sans", sans-serif', whiteSpace: 'nowrap' }}>Prototype guide</span>
              <span style={{ width: 1, height: 14, background: '#36414c' }} />
              <span style={{ color: '#aeb8c2', font: '400 12px/1 "Open Sans", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {current ? `${current.act} · ${current.sceneLabel} · ${current.beatLabel}` : 'Choose a stage'}
              </span>
            </div>
            <span style={{ color: '#8995a1', font: '400 11px/1 "Open Sans", sans-serif', whiteSpace: 'nowrap' }}>← → navigate</span>
          </div>

          <div
            ref={stripRef}
            aria-label="Prototype stages"
            style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              overflowY: 'hidden',
              paddingBottom: 8,
              scrollBehavior: 'smooth',
              scrollbarColor: '#64717d #202a34',
              scrollbarWidth: 'thin',
            }}
          >
            {PROTOTYPE_TIMELINE.map((step, index) => (
              <TimelineCard
                key={step.id}
                step={step}
                index={index}
                active={index === activeIndex}
                completed={activeIndex >= 0 && index < activeIndex}
                onClick={() => jumpToStep(step.route, step.beatIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

function TimelineCard({ step, index, active, completed, onClick }) {
  const tone = TONE[step.tone] || TONE.platform

  return (
    <button
      type="button"
      data-step-index={index}
      aria-current={active ? 'step' : undefined}
      aria-label={`Go to step ${index + 1}: ${step.sceneLabel}, ${step.beatLabel}`}
      onClick={onClick}
      style={{
        flex: '0 0 184px',
        height: 104,
        padding: 0,
        border: active ? `2px solid ${tone.accent}` : '1px solid #36414c',
        borderRadius: 8,
        background: '#17212a',
        color: '#f7f9fb',
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
        opacity: completed ? 0.76 : 1,
        boxShadow: active ? `0 0 0 2px ${tone.accent}33` : 'none',
      }}
    >
      <div style={{ height: 48, background: tone.tint, position: 'relative', padding: '8px 10px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '0 auto 0 0', width: 4, background: tone.accent }} />
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 6 }}>
          <span style={{ width: 22, height: 4, borderRadius: 999, background: tone.accent }} />
          <span style={{ width: 44, height: 4, borderRadius: 999, background: `${tone.accent}55` }} />
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[36, 52, 42].map((width, itemIndex) => (
            <span key={itemIndex} style={{ width, height: 18, borderRadius: 4, border: `1px solid ${tone.accent}44`, background: '#ffffffaa' }} />
          ))}
        </div>
        <span style={{ position: 'absolute', right: 8, top: 7, width: 20, height: 20, borderRadius: 999, display: 'grid', placeItems: 'center', background: active ? tone.accent : '#ffffff', color: active ? '#fff' : tone.accent, font: '600 10px/1 "Open Sans", sans-serif' }}>{index + 1}</span>
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{ color: active ? '#ffffff' : '#aeb8c2', font: '600 10px/1.2 "Open Sans", sans-serif', textTransform: 'uppercase', letterSpacing: 0.45, marginBottom: 4 }}>{step.act} · {step.sceneLabel}</div>
        <div style={{ color: '#f7f9fb', font: '600 12px/1.25 "Open Sans", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.beatLabel}</div>
      </div>
    </button>
  )
}
