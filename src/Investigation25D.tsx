import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent } from 'react'
import './investigation25d.css'
import { INVESTIGATION_ROOM_LAYERS } from './investigationRoomLayers'

type ObjectId = 'mission-files' | 'evidence-board' | 'desk-terminal'
type Focus = ObjectId | 'door' | null

type Props = {
  onInspect: (id: ObjectId) => void
  onExit: () => void
  disabled?: boolean
}

const CLAMP = (n: number, low = -1, high = 1) => Math.min(high, Math.max(low, n))
const LOOK_SENSITIVITY = 0.0024
const FOCUS: Record<Exclude<Focus, null>, { look: number; zoom: number }> = {
  'mission-files': { look: -.72, zoom: 1.08 },
  'evidence-board': { look: -.28, zoom: 1.09 },
  'desk-terminal': { look: .09, zoom: 1.12 },
  'door': { look: .8, zoom: 1.07 },
}

export default function Investigation25D({ onInspect, onExit, disabled = false }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const target = useRef(0)
  const current = useRef(0)
  const zoomNow = useRef(1)
  const panActive = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const dragDistance = useRef(0)
  const gesturePointerId = useRef<number | null>(null)
  const suppressClick = useRef(false)
  const disabledRef = useRef(disabled)
  const lastX = useRef(0)
  const focusRef = useRef<Focus>(null)
  const [focus, setFocus] = useState<Focus>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [guide, setGuide] = useState(true)
  const [locked, setLocked] = useState(false)
  const [lockIssue, setLockIssue] = useState(false)
  const [aimed, setAimed] = useState<Exclude<Focus, null> | null>(null)
  const aimedRef = useRef<Exclude<Focus, null> | null>(null)
  const aim = useRef({ x: .5, y: .5 })
  const pending = useRef<number | null>(null)

  useEffect(() => { focusRef.current = focus }, [focus])
  useEffect(() => { disabledRef.current = disabled }, [disabled])

  useEffect(() => {
    let raf = 0
    let last = 0
    let lastAimCheck = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tick = (now: number) => {
      const dt = Math.min(0.06, Math.max(.001, (now - (last || now)) / 1000))
      last = now
      const dest = focusRef.current ? FOCUS[focusRef.current].look : target.current
      const f = reducedMotion ? 1 : 1 - Math.exp(-dt * 7.2)
      current.current += (dest - current.current) * f
      const zGoal = focusRef.current ? FOCUS[focusRef.current].zoom : 1
      zoomNow.current += (zGoal - zoomNow.current) * (reducedMotion ? 1 : 1 - Math.exp(-dt * 6.2))
      const look = current.current
      if (worldRef.current && frameRef.current) {
        // Travel is measured from the actual artwork width: on portrait screens
        // swipes reveal the whole room instead of shifting a cropped image.
        const travel = Math.max(0, (worldRef.current.clientWidth - frameRef.current.clientWidth) / 2)
        const pan = -look * travel
        worldRef.current.style.transform =
          'translate3d(calc(-50% + ' + pan.toFixed(2) + 'px), 0, 0) scale(' + zoomNow.current.toFixed(4) + ')'
      }
      if (frameRef.current) {
        frameRef.current.style.setProperty('--far-motion', (look * 9).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--mid-motion', (-look * 18).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--near-motion', (-look * 38).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--near-motion-right', (look * 38).toFixed(1) + 'px')
        frameRef.current.style.setProperty('--near-rotation', (-look * 2.1).toFixed(1) + 'deg')
      }
      if (document.pointerLockElement === frameRef.current && now - lastAimCheck > 90) {
        lastAimCheck = now
        const next = findAimed()
        if (aimedRef.current !== next) {
          aimedRef.current = next
          setAimed(next)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!disabled) return
    if (document.pointerLockElement === frameRef.current) document.exitPointerLock()
    if (pending.current !== null) {
      window.clearTimeout(pending.current)
      pending.current = null
    }
  }, [disabled])

  useEffect(() => {
    const syncLock = () => {
      const active = document.pointerLockElement === frameRef.current
      setLocked(active)
      if (active) {
        setLockIssue(false)
        setGuide(false)
      } else {
        aimedRef.current = null
        setAimed(null)
      }
    }
    const lockError = () => setLockIssue(true)
    document.addEventListener('pointerlockchange', syncLock)
    document.addEventListener('pointerlockerror', lockError)
    return () => {
      if (document.pointerLockElement === frameRef.current) document.exitPointerLock()
      document.removeEventListener('pointerlockchange', syncLock)
      document.removeEventListener('pointerlockerror', lockError)
    }
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === 'Tab' || e.key === 'Escape') && document.pointerLockElement === frameRef.current) {
        document.exitPointerLock()
        if (e.key === 'Escape') return
      }
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

  function findAimed(): Exclude<Focus, null> | null {
    const frame = frameRef.current
    if (!frame) return null
    const bounds = frame.getBoundingClientRect()
    const x = bounds.left + aim.current.x * bounds.width
    const y = bounds.top + aim.current.y * bounds.height
    for (const element of frame.querySelectorAll<HTMLButtonElement>('.object-hotspot')) {
      const rect = element.getBoundingClientRect()
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue
      const id = element.dataset.objectId
      if (id === 'mission-files' || id === 'evidence-board' || id === 'desk-terminal' || id === 'door') return id
    }
    return null
  }

  function setAimPosition(x: number, y: number) {
    aim.current = { x: CLAMP(x, .06, .94), y: CLAMP(y, .08, .92) }
    frameRef.current?.style.setProperty('--aim-x', (aim.current.x * 100).toFixed(2) + '%')
    frameRef.current?.style.setProperty('--aim-y', (aim.current.y * 100).toFixed(2) + '%')
  }

  function activateLook() {
    if (disabled || focusRef.current) return
    const frame = frameRef.current
    if (!frame?.requestPointerLock) {
      setLockIssue(true)
      return
    }
    setAimPosition(.5, .5)
    try {
      // Call within this click's user activation; some browsers return void.
      void Promise.resolve(frame.requestPointerLock()).catch(() => setLockIssue(true))
    } catch {
      setLockIssue(true)
    }
  }

  function mouseMove(event: ReactMouseEvent<HTMLDivElement>) {
    if (disabled || focusRef.current) return
    const frame = frameRef.current
    if (!frame) return
    const bounds = frame.getBoundingClientRect()
    if (document.pointerLockElement === frame) {
      setAimPosition(aim.current.x + event.movementX / Math.max(1, bounds.width),
        aim.current.y + event.movementY / Math.max(1, bounds.height))
      target.current = CLAMP(target.current + event.movementX * LOOK_SENSITIVITY)
    } else if (window.matchMedia('(pointer: fine)').matches && event.buttons === 0) {
      // Graceful no-drag fallback if the browser rejects Pointer Lock.
      setAimPosition((event.clientX - bounds.left) / bounds.width, (event.clientY - bounds.top) / bounds.height)
      target.current = CLAMP((aim.current.x - .5) * 2)
    }
  }

  function capturedClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (disabled || event.detail === 0 || document.pointerLockElement !== frameRef.current) return
    event.preventDefault()
    event.stopPropagation()
    const id = findAimed()
    if (id) select(id, true)
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled || panActive.current || event.pointerType !== 'touch') return
    const origin = event.target as HTMLElement
    if (origin.closest('.exploration-help-button, .exploration-help button')) return
    panActive.current = true
    gesturePointerId.current = event.pointerId
    startX.current = event.clientX
    startY.current = event.clientY
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
    if (disabled || focusRef.current || event.pointerType !== 'touch' || !panActive.current || gesturePointerId.current !== event.pointerId) return
    const frame = frameRef.current
    const world = worldRef.current
    if (!frame || !world) return
    const dx = event.clientX - lastX.current
    lastX.current = event.clientX
    dragDistance.current += Math.abs(dx)
    if (Math.abs(event.clientX - startX.current) > 8 || Math.abs(event.clientY - startY.current) > 8 || dragDistance.current > 12) {
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
    // Touch browsers can suppress their synthetic click immediately after a swipe.
    // Treat a genuine tap as an action on pointer-up and suppress the later click.
    if (disabled || event.pointerType !== 'touch' || suppressClick.current) return
    const pressed = (event.target as HTMLElement).closest<HTMLButtonElement>('.object-hotspot')
    const id = pressed?.dataset.objectId
    if (id === 'mission-files' || id === 'evidence-board' || id === 'desk-terminal' || id === 'door') {
      select(id)
      suppressClick.current = true
    }
  }

  function select(id: Exclude<Focus, null>, keyboardActivation = false) {
    if (disabled || focusRef.current) return
    if (!keyboardActivation && suppressClick.current) {
      suppressClick.current = false
      return
    }
    setGuide(false)
    setFocus(id)
    if (document.pointerLockElement === frameRef.current) document.exitPointerLock()
    if (pending.current !== null) window.clearTimeout(pending.current)
    const approachDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 620
    if (id === 'door') {
      pending.current = window.setTimeout(() => {
        pending.current = null
        onExit()
      }, approachDelay)
      return
    }
    // Single artwork remains visible; dedicated authored close-ups are a later feature.
    pending.current = window.setTimeout(() => {
      pending.current = null
      onInspect(id)
    }, approachDelay)
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
      ref={frameRef} className={'exploration25d' + (locked ? ' is-locked' : '')} role="region" aria-label="Investigation Room. Activate Mouse Look, move the mouse to explore, and click at the aiming reticle. Escape releases control. Touch users can swipe; keyboard users can use arrow keys."
      onMouseMove={mouseMove} onClickCapture={capturedClick}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}
      onPointerCancel={pointerUp} onLostPointerCapture={pointerUp}
    >
      <div className="exploration-depth-world" ref={worldRef}>
        <div className="exploration-far-wall">
          <picture>
            <source srcSet="/assets/optimized/investigation-panorama-hq.webp" type="image/webp" />
            <img src="/assets/rooms/Investigation_Wide_Artwork.png" width="1916" height="821" alt="" draggable={false} />
          </picture>
        </div>
        {/* The complete room has replaceable 2D planes; Camera V3 and hotspots stay unchanged. */}
        <div className="exploration-room-layers" aria-hidden="true">
          {INVESTIGATION_ROOM_LAYERS.map(layer => (
            <img key={layer.assetId}
              src={layer.path} width={1920} height={824}
              className={'exploration-room-layer exploration-room-' + layer.depth}
              alt="" decoding="async" draggable={false} />
          ))}
        </div>
        <div className="exploration-atmospheric-glow" aria-hidden="true" />
        <div className="exploration-dust" aria-hidden="true">
          <i/><i/><i/><i/><i/><i/><i/><i/>
        </div>
        <div className="exploration-surfaces" aria-label="Objects you can investigate">
          <button type="button" className="object-hotspot object-files" data-object-id="mission-files" aria-label="Approach mission files" onClick={event => select('mission-files', event.detail === 0)}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">MISSION FILES</span>
          </button>
          <button type="button" className="object-hotspot object-evidence" data-object-id="evidence-board" aria-label="Approach evidence board" onClick={event => select('evidence-board', event.detail === 0)}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">EVIDENCE BOARD</span>
          </button>
          <button type="button" className="object-hotspot object-desk" data-object-id="desk-terminal" aria-label="Approach investigation desk" onClick={event => select('desk-terminal', event.detail === 0)}>
            <span className="hotspot-reticle"><span/></span><span className="object-tag">DESK TERMINAL</span>
          </button>
          <button type="button" className="object-hotspot object-door" data-object-id="door" aria-label="Enter the Archive Room" onClick={event => select('door', event.detail === 0)}>
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

      {locked && <div className={'exploration-aim' + (aimed ? ' has-target' : '')} aria-hidden="true">
        <span className="aim-ring" />
        {aimed && <span className="aim-label">{aimed.replaceAll('-', ' ').toUpperCase()}</span>}
      </div>}
      <div className="exploration-top-note" aria-hidden="true">CAMERA / INVESTIGATION <span>◆</span> PRESENT TIME</div>

      <button type="button" className="exploration-help-button" aria-label="How to explore" aria-expanded={showInfo}
        onClick={() => { if (document.pointerLockElement === frameRef.current) document.exitPointerLock(); setShowInfo(v => !v) }}>?</button>

      {!disabled && !focus && !locked && <button type="button" className="exploration-look-toggle"
        onClick={activateLook}>ENABLE MOUSE LOOK <small>Click once · Move to explore</small></button>}
      {guide && <div className="exploration-guide" role="status"><span className="desktop-note">ACTIVATE MOUSE LOOK · AIM AND CLICK · ESC TO RELEASE</span><span className="touch-note">SWIPE TO LOOK AROUND · TAP AN OBJECT</span></div>}
      {lockIssue && !locked && !disabled && <div className="exploration-lock-fallback" role="status">Pointer Lock unavailable. Move the cursor to look, or use A / D.</div>}

      {showInfo && <section className="exploration-help" aria-label="Camera controls">
        <button type="button" onClick={() => setShowInfo(false)} aria-label="Close controls">×</button>
        <strong>EXPLORE THE ROOM</strong>
        <p>Desktop: choose Enable Mouse Look once, move the mouse to look and aim, then click a lit object. Escape or Tab releases the pointer for menus; re-enable after returning from inspection. Without Pointer Lock the cursor still moves the view. Touch: swipe to look and tap an object. Keyboard: A / D or ← / →, Home to center.</p>
        <small>Prototype: layered 2.5D camera, not a free-roaming 3D environment.</small>
      </section>}

      {focus && <span className="exploration-focus-state" aria-live="polite">
        {focus === 'door' ? 'APPROACHING THE ARCHIVE…' : 'MOVING IN FOR A CLOSER LOOK…'}
      </span>}
    </div>
  )
}
