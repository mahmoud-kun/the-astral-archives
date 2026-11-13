import { useEffect, useRef, useState, type PointerEvent } from 'react'
import './investigation25d.css'

type ObjectId = 'mission-files' | 'evidence-board' | 'desk-terminal'
type Focus = ObjectId | 'door' | null

type Props = {
  onInspect: (id: ObjectId) => void
  onExit: () => void
  disabled?: boolean
}

const CLAMP = (n: number, low = -1, high = 1) => Math.min(high, Math.max(low, n))
const FOCUS: Record<Exclude<Focus, null>, { look: number; shiftX: number; shiftY: number; zoom: number }> = {
  'mission-files': { look: -.88, shiftX: 5, shiftY: 1, zoom: 1.33 },
  'evidence-board': { look: -.28, shiftX: 1, shiftY: 2, zoom: 1.37 },
  'desk-terminal': { look: .09, shiftX: -2, shiftY: -9, zoom: 1.45 },
  'door': { look: .88, shiftX: -5, shiftY: 1, zoom: 1.29 },
}

export default function Investigation25D({ onInspect, onExit, disabled = false }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const target = useRef(0)
  const current = useRef(0)
  const zoomNow = useRef(1)
  const panActive = useRef(false)
  const startX = useRef(0)
  const dragDistance = useRef(0)
  const gesturePointerId = useRef<number | null>(null)
  const suppressClick = useRef(false)
  const disabledRef = useRef(disabled)
  const lastX = useRef(0)
  const focusRef = useRef<Focus>(null)
  const [focus, setFocus] = useState<Focus>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [guide, setGuide] = useState(true)
  const pending = useRef<number | null>(null)

  useEffect(() => { focusRef.current = focus }, [focus])
  useEffect(() => { disabledRef.current = disabled }, [disabled])

  useEffect(() => {
    let raf = 0
    let last = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tick = (now: number) => {
      const dt = Math.min(0.06, Math.max(.001, (now - (last || now)) / 1000))
      last = now
      const dest = focusRef.current ? FOCUS[focusRef.current].look : target.current
      const f = reducedMotion ? 1 : 1 - Math.exp(-dt * 4.4)
      current.current += (dest - current.current) * f
      const zGoal = focusRef.current ? FOCUS[focusRef.current].zoom : 1
      zoomNow.current += (zGoal - zoomNow.current) * (reducedMotion ? 1 : 1 - Math.exp(-dt * 3.4))
      const look = current.current
      const pose = focusRef.current ? FOCUS[focusRef.current] : null
      const shiftX = pose?.shiftX ?? 0
      const shiftY = pose?.shiftY ?? 0
      if (worldRef.current && frameRef.current) {
        // Travel is measured from the actual artwork width: on portrait screens
        // swipes reveal the whole room instead of shifting a cropped image.
        const travel = Math.max(0, (worldRef.current.clientWidth - frameRef.current.clientWidth) / 2)
        const pan = -look * travel
        worldRef.current.style.transform =
          'translate3d(calc(-50% + ' + pan.toFixed(2) + 'px + ' + shiftX.toFixed(2) + '%), ' + shiftY.toFixed(2) + '%, 0) scale(' + zoomNow.current.toFixed(4) + ') rotateY(' + (-look * 1.2).toFixed(2) + 'deg)'
      }
      if (frameRef.current) {
        frameRef.current.style.setProperty('--far-motion', (look * 9).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--near-motion', (-look * 38).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--near-motion-right', (look * 38).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--near-rotation', (-look * 2.1).toFixed(1) + 'deg')
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!disabled) return
    if (pending.current !== null) {
      window.clearTimeout(pending.current)
      pending.current = null
    }
  }, [disabled])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (disabled || e.altKey || e.ctrlKey || e.metaKey) return
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        e.preventDefault()
        stopApproach()
        setGuide(false)
        target.current = CLAMP(target.current - .28)
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault()
        stopApproach()
        setGuide(false)
        target.current = CLAMP(target.current + .28)
      }
      if (e.key === 'Home') {
        stopApproach()
        target.current = 0
      }
      if (e.key === 'Escape') stopApproach()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [disabled])

  useEffect(() => () => { if (pending.current !== null) window.clearTimeout(pending.current) }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setGuide(false), 15000)
    return () => window.clearTimeout(timer)
  }, [])

  function stopApproach() {
    if (pending.current !== null) {
      window.clearTimeout(pending.current)
      pending.current = null
    }
    setFocus(null)
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled || panActive.current || (event.pointerType === 'mouse' && event.button !== 0)) return
    const origin = event.target as HTMLElement
    if (origin.closest('.exploration-help-button, .exploration-help button')) return
    panActive.current = true
    gesturePointerId.current = event.pointerId
    startX.current = event.clientX
    lastX.current = event.clientX
    dragDistance.current = 0
    suppressClick.current = false
    // Do not steal a genuine tap from an object. Drags beginning on a hotspot
    // are still interpreted as looking around, not selecting that object.
    if (!origin.closest('.object-hotspot')) {
      try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* optional */ }
    }
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (disabled || focusRef.current || !panActive.current || gesturePointerId.current !== event.pointerId) return
    const frame = frameRef.current
    const world = worldRef.current
    if (!frame || !world) return
    const dx = event.clientX - lastX.current
    lastX.current = event.clientX
    dragDistance.current += Math.abs(dx)
    if (Math.abs(event.clientX - startX.current) > 8 || dragDistance.current > 12) {
      suppressClick.current = true
      setGuide(false)
    }
    const travel = Math.max(1, (world.clientWidth - frame.clientWidth) / 2)
    target.current = CLAMP(target.current - dx / travel)
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    if (gesturePointerId.current !== event.pointerId) return
    panActive.current = false
    gesturePointerId.current = null
  }

  function select(id: Exclude<Focus, null>, keyboardActivation = false) {
    if (disabled) return
    if (!keyboardActivation && suppressClick.current) {
      suppressClick.current = false
      return
    }
    setGuide(false)
    setFocus(id)
    if (pending.current !== null) window.clearTimeout(pending.current)
    if (id === 'door') {
      pending.current = window.setTimeout(() => {
        pending.current = null
        onExit()
      }, 750)
      return
    }
    // Camera physically approaches the object before opening its examination UI.
    pending.current = window.setTimeout(() => {
      pending.current = null
      onInspect(id)
    }, 780)
  }

  useEffect(() => {
    if (disabled) return
    if (focusRef.current) {
      const timer = window.setTimeout(() => { setFocus(null) }, 210)
      return () => window.clearTimeout(timer)
    }
  }, [disabled])

  return (
    <div
      ref={frameRef} className="exploration25d" role="region" aria-label="Investigation Room. Drag or swipe to look around; select an illuminated object to inspect."
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}
      onPointerCancel={pointerUp} onLostPointerCapture={pointerUp}
    >
      <div className="exploration-depth-world" ref={worldRef}>
        <div className="exploration-far-wall">
          <picture>
            <source srcSet="/assets/optimized/investigation-panorama-hq.webp" type="image/webp" />
            <img src="/assets/rooms/Investigation_Wide_Artwork.png" width="1916" height="821" alt="" draggable={false} />
          </picture>
          {focus && focus !== "door" && <img className="exploration-close-angle" src="/assets/optimized/investigation-close-hq.webp" width="1752" height="897" alt="" draggable={false} /> }
        </div>
        <div className="exploration-atmospheric-glow" aria-hidden="true" />
        <div className="exploration-dust" aria-hidden="true">
          <i/><i/><i/><i/><i/><i/><i/><i/>
        </div>
        <div className="exploration-surfaces" aria-label="Objects you can investigate">
          <button type="button" className="object-hotspot object-files" aria-label="Approach mission files" onClick={event => select('mission-files', event.detail === 0)}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">MISSION FILES</span>
          </button>
          <button type="button" className="object-hotspot object-evidence" aria-label="Approach evidence board" onClick={event => select('evidence-board', event.detail === 0)}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">EVIDENCE BOARD</span>
          </button>
          <button type="button" className="object-hotspot object-desk" aria-label="Approach investigation desk" onClick={event => select('desk-terminal', event.detail === 0)}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">DESK TERMINAL</span>
          </button>
          <button type="button" className="object-hotspot object-door" aria-label="Enter the Archive Room" onClick={event => select('door', event.detail === 0)}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">ARCHIVE DOOR <b>→</b></span>
          </button>
        </div>
      </div>
      <div className="exploration-near-left" aria-hidden="true">
        <span className="near-strut"/><span className="near-illumination"/>
      </div>
      <div className="exploration-near-right" aria-hidden="true">
        <span className="near-strut"/><span className="near-illumination"/>
      </div>

      <div className="exploration-top-note" aria-hidden="true">CAMERA / INVESTIGATION <span>◆</span> PRESENT TIME</div>

      <button type="button" className="exploration-help-button" aria-label="How to explore" aria-expanded={showInfo}
        onClick={() => setShowInfo(v => !v)}>?</button>

      {guide && <div className="exploration-guide" role="status">DRAG OR SWIPE TO LOOK AROUND <span>·</span> SELECT A LIT OBJECT</div>}

      {showInfo && <section className="exploration-help" aria-label="Camera controls">
        <button type="button" onClick={() => setShowInfo(false)} aria-label="Close controls">×</button>
        <strong>EXPLORE THE ROOM</strong>
        <p>Drag with a mouse or swipe to look across this room. Select an illuminated object to approach it. Keyboard: A / D or ← / → to look, Home to center, Escape to cancel an approach.</p>
        <small>Prototype: layered 2.5D camera, not a free-roaming 3D environment.</small>
      </section>}

      {focus && <span className="exploration-focus-state" aria-live="polite">
        {focus === 'door' ? 'APPROACHING THE ARCHIVE…' : 'MOVING IN FOR A CLOSER LOOK…'}
      </span>}
    </div>
  )
}
