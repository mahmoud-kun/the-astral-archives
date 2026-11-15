import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { buildInvestigationRoom, type InvestigationTarget } from './investigation360/buildRoom'
import './investigation360.css'

type Props = {
  disabled?: boolean
  onInspect: (id: Exclude<InvestigationTarget, 'door'>) => void
  onExit: () => void
  onFallback: () => void
}

const LABELS: Record<InvestigationTarget, string> = {
  'mission-files': 'MISSION FILES',
  'evidence-board': 'EVIDENCE BOARD',
  'desk-terminal': 'DESK TERMINAL',
  'door': 'ARCHIVE DOOR',
}
const TARGETS: InvestigationTarget[] = ['mission-files', 'evidence-board', 'desk-terminal', 'door']
const SENSITIVITY = 0.00245
const VERTICAL_LIMIT = 1.32 // ~76°, horizontal yaw is intentionally unrestricted

/** First-person seated camera: look in all directions, NEVER translate position. */
export default function Investigation360({
  disabled = false, onInspect, onExit, onFallback,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const callbacksRef = useRef({ onInspect, onExit })
  const disabledRef = useRef(disabled)
  const actionRef = useRef<((id: InvestigationTarget) => void) | null>(null)
  const [locked, setLocked] = useState(false)
  const [hovered, setHovered] = useState<InvestigationTarget | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [pointerIssue, setPointerIssue] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [ready, setReady] = useState(false)

  callbacksRef.current = { onInspect, onExit }
  disabledRef.current = disabled

  useEffect(() => {
    if (disabled && document.pointerLockElement === canvasRef.current) {
      document.exitPointerLock()
    }
  }, [disabled])

  useEffect(() => {
    const host = containerRef.current
    if (!host) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true, alpha: false, powerPreference: 'low-power',
      })
    } catch {
      setUnavailable(true)
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const canvas = renderer.domElement
    canvas.className = 'investigation360-canvas'
    canvas.setAttribute('aria-label', '360 degree seated Investigation Room. Activate mouse look to rotate. No walking or movement.')
    canvas.style.touchAction = 'none'
    canvasRef.current = canvas
    host.appendChild(canvas)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x061526)
    scene.fog = new THREE.Fog(0x061526, 12, 22)
    // Low-intensity studio reflection map makes metallic PBR read as metal
    // without loading a remote HDR asset. Fall back to direct lights if needed.
    let reflectionMap: THREE.Texture | null = null
    try {
      const environment = new RoomEnvironment()
      const generator = new THREE.PMREMGenerator(renderer)
      try {
        reflectionMap = generator.fromScene(environment).texture
        scene.environment = reflectionMap
        scene.environmentIntensity = .48
      } finally {
        environment.dispose()
        generator.dispose()
      }
    } catch {
      // A graphics driver may reject the extra reflection pass.
      reflectionMap?.dispose()
      reflectionMap = null
      scene.environment = null
    }
    const camera = new THREE.PerspectiveCamera(74, 1, 0.08, 55)
    camera.position.set(0, 1.63, 2.45) // chair / seated eye point: IMMUTABLE
    camera.rotation.order = 'YXZ'
    const room = buildInvestigationRoom(scene)
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const keys = new Set<string>()
    let yaw = 0
    let pitch = -0.055
    let raf = 0
    let last = 0
    let lookTarget: InvestigationTarget | null = null
    let disposed = false
    let contextLost = false
    let recentAction = 0
    let drag: { id: number; x: number; y: number; distance: number } | null = null
    let suppressClick = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function syncCamera() {
      // The translation never changes. Only Euler angles change.
      camera.rotation.set(pitch, yaw, 0, 'YXZ')
    }
    function resize() {
      if (disposed) return
      const bounds = host!.getBoundingClientRect()
      const width = Math.max(1, Math.floor(bounds.width))
      const height = Math.max(1, Math.floor(bounds.height))
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    ro?.observe(host)
    window.addEventListener('resize', resize)
    resize()

    function pick(x: number, y: number): InvestigationTarget | null {
      pointer.set(x, y)
      raycaster.setFromCamera(pointer, camera)
      const closest = raycaster.intersectObjects(room.targets, false)[0]
      const name = closest?.object.userData.target
      return TARGETS.includes(name as InvestigationTarget) ? name as InvestigationTarget : null
    }
    function syncHover(next: InvestigationTarget | null) {
      if (lookTarget !== next) {
        lookTarget = next
        setHovered(next)
      }
    }
    function select(id: InvestigationTarget) {
      if (disabledRef.current || disposed || performance.now() - recentAction < 320) return
      recentAction = performance.now()
      if (document.pointerLockElement === canvas) document.exitPointerLock()
      if (id === 'door') callbacksRef.current.onExit()
      else callbacksRef.current.onInspect(id)
    }
    actionRef.current = select

    function changeLook(dx: number, dy: number) {
      yaw -= dx * SENSITIVITY
      pitch = THREE.MathUtils.clamp(pitch - dy * SENSITIVITY, -VERTICAL_LIMIT, VERTICAL_LIMIT)
      syncCamera()
      syncHover(pick(0, 0))
    }
    function onMove(e: MouseEvent) {
      if (disabledRef.current || !renderer) return
      if (document.pointerLockElement === canvas) {
        changeLook(e.movementX, e.movementY)
      } else if (!drag) {
        // Normal pointer can aim at props without starting mouse look.
        const b = canvas.getBoundingClientRect()
        if (b.width && b.height) syncHover(pick(
          ((e.clientX - b.left) / b.width) * 2 - 1,
          1 - ((e.clientY - b.top) / b.height) * 2
        ))
      }
    }
    function onDown(e: PointerEvent) {
      if (disabledRef.current || document.pointerLockElement === canvas) return
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, distance: 0 }
      suppressClick = false
      try { canvas.setPointerCapture(e.pointerId) } catch { /* browser dependent */ }
    }
    function onPointerMove(e: PointerEvent) {
      if (disabledRef.current || !drag || drag.id !== e.pointerId) return
      if (document.pointerLockElement === canvas) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      drag.x = e.clientX
      drag.y = e.clientY
      drag.distance += Math.abs(dx) + Math.abs(dy)
      if (drag.distance > 8) {
        suppressClick = true
        changeLook(dx, dy)
      }
    }
    function onUp(e: PointerEvent) {
      if (!drag || drag.id !== e.pointerId) return
      const wasDrag = drag.distance > 8
      drag = null
      if (disabledRef.current || wasDrag) return
      const b = canvas.getBoundingClientRect()
      if (b.width === 0 || b.height === 0) return
      const target = pick(
        ((e.clientX - b.left) / b.width) * 2 - 1,
        1 - ((e.clientY - b.top) / b.height) * 2
      )
      if (target) select(target)
    }
    function onClick() {
      if (disabledRef.current || suppressClick) { suppressClick = false; return }
      if (document.pointerLockElement === canvas) {
        const target = pick(0, 0)
        if (target) select(target)
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (disabledRef.current || e.altKey || e.metaKey || e.ctrlKey) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const k = e.key.toLowerCase()
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's', 'home'].includes(k)) {
        e.preventDefault()
      }
      keys.add(k)
      if (k === 'home') {
        yaw = 0
        pitch = -0.055
        syncCamera()
      }
      if (k === 'tab' && document.pointerLockElement === canvas) document.exitPointerLock()
      const digit = ['1', '2', '3', '4'].indexOf(k)
      if (digit >= 0 && !e.repeat) select(TARGETS[digit])
    }
    function onKeyUp(e: KeyboardEvent) { keys.delete(e.key.toLowerCase()) }
    function onBlur() { keys.clear() }
    function lockSync() {
      const isLocked = document.pointerLockElement === canvas
      setLocked(isLocked)
      if (isLocked) {
        setPointerIssue(false)
        setShowHelp(false)
      }
    }
    function onLockError() { setPointerIssue(true) }
    function onContextLost(e: Event) {
      e.preventDefault()
      contextLost = true
      setUnavailable(true)
      if (document.pointerLockElement === canvas) document.exitPointerLock()
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('pointerlockchange', lockSync)
    document.addEventListener('pointerlockerror', onLockError)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('webglcontextlost', onContextLost)
    syncCamera()
    setReady(true)

    function frame(now: number) {
      if (disposed) return
      const dt = Math.min(0.06, Math.max(0, (now - (last || now)) / 1000))
      last = now
      if (!disabledRef.current && !document.hidden) {
        const speed = (reducedMotion ? 0.7 : 1.15) * dt
        if (keys.has('arrowleft') || keys.has('a')) yaw += speed
        if (keys.has('arrowright') || keys.has('d')) yaw -= speed
        if (keys.has('arrowup') || keys.has('w')) pitch += speed
        if (keys.has('arrowdown') || keys.has('s')) pitch -= speed
        pitch = THREE.MathUtils.clamp(pitch, -VERTICAL_LIMIT, VERTICAL_LIMIT)
        syncCamera()
        if (document.pointerLockElement === canvas || keys.size > 0) {
          syncHover(pick(0, 0))
        }
      }
      if (!contextLost && !document.hidden) renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      disposed = true
      actionRef.current = null
      if (document.pointerLockElement === canvas) document.exitPointerLock()
      cancelAnimationFrame(raf)
      ro?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerlockchange', lockSync)
      document.removeEventListener('pointerlockerror', onLockError)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      room.dispose()
      reflectionMap?.dispose()
      renderer.dispose()
      canvas.remove()
      canvasRef.current = null
    }
  }, [])

  function enableMouseLook() {
    if (disabled) return
    const canvas = canvasRef.current
    if (!canvas || !canvas.requestPointerLock) {
      setPointerIssue(true)
      return
    }
    try {
      // Must occur synchronously in this genuine button activation.
      void Promise.resolve(canvas.requestPointerLock()).catch(() => setPointerIssue(true))
    } catch {
      setPointerIssue(true)
    }
  }

  return <div className="investigation360" role="region" aria-label="Seated 360 degree Investigation Room. Rotate to investigate.">
    <div ref={containerRef} className="investigation360-renderer" />
    {unavailable ? <div className="investigation360-unavailable" role="alert">
      <strong>3D preview unavailable on this device</strong>
      <p>WebGL is required for the immersive camera. The previous 2.5D room remains available.</p>
      <button onClick={onFallback}>Return to 2.5D room</button>
    </div> : <>
      <div className={'investigation360-reticle' + (hovered ? ' is-target' : '') + (locked ? ' is-locked' : '')} aria-hidden="true">
        <span />
        {hovered && <small>{LABELS[hovered]} · CLICK</small>}
      </div>
      <div className="investigation360-meta" aria-hidden="true">SEATED INVESTIGATION <b>•</b> 360° LOOK <b>•</b> NO WALKING</div>
      {!disabled && ready && !locked && <button className="investigation360-enable" onClick={enableMouseLook}>
        ENABLE 360° MOUSE LOOK <small>Click once · Move freely · ESC to release</small>
      </button>}
      {pointerIssue && !locked && <p className="investigation360-pointer-note" role="status">
        Pointer Lock unavailable here. Drag the scene, use touch, or A/D/W/S.
      </p>}
      <button className="investigation360-help-trigger" aria-expanded={showHelp} onClick={() => {
        if (document.pointerLockElement === canvasRef.current) document.exitPointerLock()
        setShowHelp(v => !v)
      }}>?</button>
      {showHelp && <aside className="investigation360-help">
        <button aria-label="Close camera help" onClick={() => setShowHelp(false)}>×</button>
        <strong>SEATED 360° INVESTIGATION</strong>
        <p>Mouse: Enable 360° Mouse Look, move left/right and up/down. Aim at a console or board and click. Press Esc to release the pointer.</p>
        <p>Touch: swipe in any direction, tap to inspect. Keyboard: A/D and left/right rotate, W/S and up/down look vertically, Home resets view. Use 1–4 to open objects.</p>
        <p>The camera is fixed at the investigator's chair; there is no walking.</p>
      </aside>}
      <nav className="investigation360-actions" aria-label="Investigation object shortcuts">
        {TARGETS.map((id, i) => <button type="button" key={id}
          disabled={disabled} onClick={() => actionRef.current?.(id)}>
          <span>{i + 1}</span>{LABELS[id]}
        </button>)}
      </nav>
    </>}
  </div>
}
