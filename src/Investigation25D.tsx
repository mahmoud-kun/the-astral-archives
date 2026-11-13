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
  const edgeRef = useRef(0)
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
    const tick = (now: number) => {
      const dt = Math.min(0.06, Math.max(.001, (now - (last || now)) / 1000))
      last = now
      if (!focusRef.current && !disabledRef.current && edgeRef.current !== 0) {
        target.current = CLAMP(target.current + edgeRef.current * dt * .46)
      }
      const dest = focusRef.current ? FOCUS[focusRef.current].look : target.current
      const f = 1 - Math.exp(-dt * 4.4)
      current.current += (dest - current.current) * f
      const zGoal = focusRef.current ? FOCUS[focusRef.current].zoom : 1
      zoomNow.current += (zGoal - zoomNow.current) * (1 - Math.exp(-dt * 3.4))
      const look = current.current
      const pose = focusRef.current ? FOCUS[focusRef.current] : null
      const shiftX = (pose?.shiftX ?? 0) - look * 6.1
      const shiftY = pose?.shiftY ?? 0
      if (worldRef.current) {
        worldRef.current.style.transform =
          'translate3d(' + shiftX.toFixed(3) + '%, ' + shiftY.toFixed(3) + '%, 0) scale(' + zoomNow.current.toFixed(4) + ') rotateY(' + (-look * 1.2).toFixed(2) + 'deg)'
      }
      if (frameRef.current) {
        frameRef.current.style.setProperty('--far-motion', (look * 9).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--near-motion', (-look * 38).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--near-motion-right', (look * 38).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--near-rotation', (-look * 2.1).toFixed(1) + 'deg')
        frameRef.current.style.setProperty('--look-position', ((look + 1) * 50).toFixed(1) + '%')
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
        setFocus(null)
        target.current = CLAMP(target.current - .28)
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setFocus(null)
        target.current = CLAMP(target.current + .28)
      }
      if (e.key === 'Home') {
        setFocus(null)
        target.current = 0
      }
      if (e.key === 'Escape') setFocus(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [disabled])

  useEffect(() => () => { if (pending.current !== null) window.clearTimeout(pending.current) }, [])

  function aim(delta: number) {
    if (disabled) return
    setFocus(null)
    target.current = CLAMP(target.current + delta)
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled || (event.target as HTMLElement).closest('button')) return
    panActive.current = true
    lastX.current = event.clientX
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* optional */ }
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (disabled || focusRef.current) return
    const bounds = frameRef.current?.getBoundingClientRect()
    if (!bounds) return
    if (panActive.current) {
      const dx = event.clientX - lastX.current
      target.current = CLAMP(target.current - (dx / bounds.width) * 2.2)
      lastX.current = event.clientX
      if (Math.abs(dx) > 3) setGuide(false)
    } else if (event.pointerType === 'mouse') {
      const x = (event.clientX - bounds.left) / bounds.width
      edgeRef.current = x <= .10 ? -1 : x >= .90 ? 1 : 0
    }
  }

  function pointerUp() { panActive.current = false }

  function select(id: Exclude<Focus, null>) {
    if (disabled) return
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
      ref={frameRef} className="exploration25d" aria-label="Investigation Room 2.5D exploration"
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}
      onPointerCancel={pointerUp} onLostPointerCapture={pointerUp}
      onPointerLeave={() => { edgeRef.current = 0 }}
    >
      <div className="exploration-depth-world" ref={worldRef}>
        <div className="exploration-far-wall">
          <picture>
            <source media="(max-width: 620px)" srcSet="/assets/optimized/room-investigation-sm.webp" type="image/webp" />
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
          <button type="button" className="object-hotspot object-files" aria-label="Approach mission files" onClick={() => select('mission-files')}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">MISSION FILES</span>
          </button>
          <button type="button" className="object-hotspot object-evidence" aria-label="Approach evidence board" onClick={() => select('evidence-board')}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">EVIDENCE BOARD</span>
          </button>
          <button type="button" className="object-hotspot object-desk" aria-label="Approach investigation desk" onClick={() => select('desk-terminal')}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">DESK TERMINAL</span>
          </button>
          <button type="button" className="object-hotspot object-door" aria-label="Enter the Archive Room" onClick={() => select('door')}>
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

      <div className="exploration-control" role="group" aria-label="Move camera">
        <button type="button" onClick={() => aim(-.32)} aria-label="Look left">‹</button>
        <div className="exploration-look-track" aria-hidden="true"><span/></div>
        <button type="button" onClick={() => { setFocus(null); target.current = 0 }} aria-label="Look center">◎</button>
        <button type="button" onClick={() => aim(.32)} aria-label="Look right">›</button>
        <button type="button" className="exploration-help-button" aria-label="Camera controls" onClick={() => setShowInfo(v => !v)}>?</button>
      </div>

      {guide && <div className="exploration-guide" role="status">DRAG TO LOOK AROUND <span>·</span> MOVE TO AN EDGE <span>·</span> SELECT AN OBJECT</div>}

      {showInfo && <section className="exploration-help" aria-label="Camera controls">
        <button type="button" onClick={() => setShowInfo(false)} aria-label="Close controls">×</button>
        <strong>EXPLORE THE ROOM</strong>
        <p>Drag to pan the camera, or move your mouse near the edges. Use ← → or A / D on a keyboard. Select a lit object to approach and inspect it.</p>
        <small>Prototype: layered 2.5D camera, not a free-roaming 3D environment.</small>
      </section>}

      {focus && <span className="exploration-focus-state" aria-live="polite">
        {focus === 'door' ? 'APPROACHING THE ARCHIVE…' : 'MOVING IN FOR A CLOSER LOOK…'}
      </span>}
    </div>
  )
}
