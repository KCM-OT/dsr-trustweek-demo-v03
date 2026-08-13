import { useEffect } from 'react'
import { useCue } from './CueContext'
import { NUMBER_KEY_ROUTES } from '../scenes/sceneMap'

// Global keyboard listener — README non-negotiable #2:
// → / Space advances a beat, ← steps back, 1–6 jump acts, Esc opens the
// presenter overlay.
export function useCueKeyboard() {
  const { advance, back, jumpToNumberKey, toggleOverlay, overlayOpen, closeOverlay } = useCue()

  useEffect(() => {
    function onKeyDown(e) {
      const target = e.target
      const isTyping =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if (isTyping) return

      if (e.key === 'Escape') {
        e.preventDefault()
        if (overlayOpen) closeOverlay()
        else toggleOverlay()
        return
      }

      if (overlayOpen) return // overlay owns click-to-jump while open; don't also advance beats

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        advance()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        back()
      } else if (NUMBER_KEY_ROUTES[e.key]) {
        e.preventDefault()
        jumpToNumberKey(e.key)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [advance, back, jumpToNumberKey, toggleOverlay, overlayOpen, closeOverlay])
}
