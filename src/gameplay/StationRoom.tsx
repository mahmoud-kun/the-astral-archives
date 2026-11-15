import { useEffect, useRef, useState } from 'react'
import archiveManifest from '../../public/assets/rooms/archive/layers/original/manifest.json'
import signalManifest from '../../public/assets/rooms/signal/layers/original/manifest.json'
import recordingsManifest from '../../public/assets/rooms/recordings/layers/original/manifest.json'
import { navigateGame } from '../gameNavigation'
import { findEvidence } from '../archive/evidenceRecords'
import { playGameSound } from '../audio/gameAudio'
import NadirPuzzle from './NadirPuzzle'
import EvidenceGlyph from './EvidenceGlyph'
import { useArchiveSave, useNadirSave } from './gameSave'
import { NADIR_ROOM, stationLabel, stationRoute, type NadirRecord, type StationId } from './nadirEngine'
import './stationRoom.css'

type OtherStation = Exclude<StationId, 'investigation'>
type RoomManifest = typeof archiveManifest | typeof signalManifest | typeof recordingsManifest
type Scene = {
  manifest: RoomManifest
  asset: string
  description: string
  evidence: Readonly<Record<string, NadirRecord>>
  context: Readonly<Record<string, string>>
}

/** The Codex asset target is the physical object; the stable NAD-* ID owns the puzzle/save. */
const ROOM_SCENES: Record<OtherStation, Scene> = {
  signal: {
    manifest: signalManifest,
    asset: '/assets/optimized/room-signal.webp',
    description: 'Telemetry and communication analysis',
    evidence: {
      main_signal_display: 'NAD-01',
      receiver_rack: 'NAD-02',
    },
    context: {
      telemetry_console_left: 'The left telemetry station is a supporting instrument. Nadir navigation evidence is collected at the main signal display and receiver rack; this workstation has no separate collectible yet.',
      telemetry_console_right: 'The right telemetry station is a supporting instrument. No independent evidence recording or analysis puzzle has been approved for this workstation.',
    },
  },
  archive: {
    manifest: archiveManifest,
    asset: '/assets/optimized/room-archive.webp',
    description: 'Mission records, interface contracts and systems history',
    evidence: {
      archive_main_terminal: 'NAD-03',
      archive_processing_desk: 'NAD-04',
      archive_filing_drawers: 'NAD-08',
    },
    context: {
      archive_shelving: 'The shelving holds the wider mission collection. Use Mission Folders to inspect and file evidence you have already collected; this shelving overlay does not create a new record.',
    },
  },
  recordings: {
    manifest: recordingsManifest,
    asset: '/assets/optimized/room-recordings.webp',
    description: 'Recovered communications and review chronology',
    evidence: {
      main_video_display: 'NAD-05',
      recording_equipment_rack: 'NAD-07',
    },
    context: {
      audio_analysis_terminal: 'This audio terminal is a supporting source-art object. It has no separately authored or verified clip; inspect the recording rack for the optional Nadir review memory.',
      video_playback_console: 'Playback controls are represented in the source artwork. The authored Nadir chronology evidence is available on the main video display; no independent clip is connected to this console.',
      headphones_dock: 'The headphones are an inspectable art prop. No independent recording is attached to this object.',
    },
  },
}

type MaskPixels = { width: number; height: number; rgba: Uint8ClampedArray }

/** Resolve native mask pixels instead of using the entire overlapping rectangular crop as a hit area. */
export default function StationRoom({ station }: { station: OtherStation }) {
  const scene = ROOM_SCENES[station]
  const stageRef = useRef<HTMLElement>(null)
  const maskCache = useRef<Record<string, MaskPixels>>({})
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<NadirRecord | null>(null)
  const [inspecting, setInspecting] = useState<string | null>(null)
  const [plateSrc, setPlateSrc] = useState(scene.asset)
  const archive = useArchiveSave()
  const research = useNadirSave()

  useEffect(() => {
    setSelected(null)
    setInspecting(null)
    setHovered(null)
    setPlateSrc(scene.asset)
    maskCache.current = {}
    let live = true
    const images = scene.manifest.objects.map(object => {
      const img = new Image()
      img.onload = () => {
        if (!live) return
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        try {
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
          maskCache.current[object.id] = {
            width: pixels.width, height: pixels.height, rgba: pixels.data,
          }
        } catch {
          // The native crop remains keyboard-accessible and uses rectangle fallback.
        }
      }
      img.src = object.interaction.mask
      return img
    })
    return () => {
      live = false
      images.forEach(img => { img.onload = null })
      maskCache.current = {}
    }
  }, [station, scene])

  useEffect(() => {
    if (!selected && !inspecting) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setSelected(null); setInspecting(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, inspecting])

  function objectAt(clientX: number, clientY: number): string | null {
    const bounds = stageRef.current?.getBoundingClientRect()
    if (!bounds || bounds.width === 0 || bounds.height === 0) return null
    const nativeX = (clientX - bounds.left) * scene.manifest.coordinateSystem.width / bounds.width
    const nativeY = (clientY - bounds.top) * scene.manifest.coordinateSystem.height / bounds.height
    const objects = [...scene.manifest.objects].sort((a, b) => b.zIndex - a.zIndex)
    for (const object of objects) {
      const { x, y, width, height } = object.position
      if (nativeX < x || nativeY < y || nativeX >= x + width || nativeY >= y + height) continue
      const mask = maskCache.current[object.id]
      if (!mask) return object.id // transparent fallback until masks load, including on touch
      const px = Math.floor((nativeX - x) * mask.width / width)
      const py = Math.floor((nativeY - y) * mask.height / height)
      if (px < 0 || py < 0 || px >= mask.width || py >= mask.height) continue
      // Codex masks are opaque grayscale PNGs: read luminance, not alpha.
      if (mask.rgba[(py * mask.width + px) * 4] > 40) return object.id
    }
    return null
  }

  function openObject(objectId: string) {
    const id = scene.evidence[objectId]
    if (id) { setInspecting(null); setSelected(id) }
    else { setSelected(null); setInspecting(objectId) }
  }

  const inspectedObject = scene.manifest.objects.find(object => object.id === inspecting)
  return <main className="sr-root" aria-label={stationLabel(station) + ' Room'}>
    <div className="sr-space" aria-hidden="true"/>
    <section ref={stageRef}
      className={'sr-stage' + (hovered ? ' sr-stage-interactive' : '')}
      aria-label={scene.description}
      onPointerMove={event => {
        if (event.pointerType !== 'touch') {
          const next = objectAt(event.clientX, event.clientY)
          setHovered(previous => previous === next ? previous : next)
        }
      }}
      onPointerLeave={() => setHovered(null)}
      onClick={event => {
        // Keyboard activation is handled by the focused button below.
        if (event.detail === 0) return
        const id = objectAt(event.clientX, event.clientY)
        if (id) { playGameSound('scanner'); openObject(id) }
      }}>
      <img className="sr-plate" src={plateSrc} fetchPriority="high" loading="eager"
        alt={stationLabel(station) + ' space station room with interactive equipment'}
        decoding="async" onError={() => {
          if (plateSrc !== scene.manifest.sourceArt) setPlateSrc(scene.manifest.sourceArt)
        }}/>
      {scene.manifest.objects.map(object => {
        const id = scene.evidence[object.id]
        const record = id ? findEvidence(id) : undefined
        const collected = id ? archive.discovered.includes(id) : false
        const solved = id ? research.solved.includes(id) : false
        const { x, y, width, height } = object.position
        const style = {
          left: x / scene.manifest.coordinateSystem.width * 100 + '%',
          top: y / scene.manifest.coordinateSystem.height * 100 + '%',
          width: width / scene.manifest.coordinateSystem.width * 100 + '%',
          height: height / scene.manifest.coordinateSystem.height * 100 + '%',
          zIndex: object.zIndex,
        }
        return <button type="button" key={object.id} style={style}
          data-object-id={object.id}
          data-evidence-id={id} data-sfx="scanner"
          className={'sr-hotspot sr-layer-target' +
            (hovered === object.id ? ' sr-lit' : '') +
            (collected ? ' sr-collected' : '')}
          title={object.interaction.label}
          aria-label={object.interaction.label + (record ? ': ' + record.title : ': equipment inspection only') +
            (collected ? ', evidence collected' : solved ? ', analyzed' : '')}
          onFocus={() => setHovered(object.id)}
          onBlur={() => setHovered(null)}
          onClick={event => { if (event.detail === 0) openObject(object.id) }}>
          {'screen' in object.assets && typeof object.assets.screen === 'string' &&
            <img className="sr-layer-screen" src={object.assets.screen} alt="" draggable={false}/>}
          <img className="sr-layer-glow" src={object.assets.glow} alt="" draggable={false}/>
          {id && <span className="sr-beacon">
            <EvidenceGlyph kind={record?.kind ?? 'document'}/>
          </span>}
          <span className="sr-hotspot-label">
            {record?.title ?? object.interaction.label}
            {collected ? ' · COLLECTED' : solved ? ' · READY TO COLLECT' : ''}
          </span>
        </button>
      })}
    </section>
    <header className="sr-head">
      <button className="sr-back" data-sfx="doorClose"
        onClick={() => navigateGame(stationRoute('investigation'))}>← INVESTIGATION</button>
      <div className="sr-heading">
        <small>STATION / PRESENT TIMELINE / {stationLabel(station).toUpperCase()}</small>
        <strong>{stationLabel(station).toUpperCase()} ROOM</strong>
      </div>
      <nav className="sr-nav" aria-label="Station rooms">
        {(['investigation', 'archive', 'signal', 'recordings'] as const).map(item =>
          <button key={item} className={station === item ? 'current' : ''}
            data-sfx="doorOpen" disabled={station === item}
            onClick={() => navigateGame(stationRoute(item))}>{stationLabel(item)}</button>)}
      </nav>
    </header>
    <div className="sr-instruction">
      <strong>HOVER / TAP THE EQUIPMENT</strong>
      <span>Investigative tools · all records are fictional training simulations</span>
    </div>
    <footer className="sr-foot">
      <span>NADIR / EVIDENCE INVESTIGATION</span>
      <span>INSPECT → ANALYZE → MANUALLY COLLECT → FILE</span>
    </footer>
    {inspectedObject && <div className="sr-inspection-shade" role="presentation">
      <section className="sr-inspection-note" role="dialog" aria-modal="true"
        aria-label={inspectedObject.interaction.label}>
        <small>STATION EQUIPMENT / NO SEPARATE EVIDENCE</small>
        <h2>{inspectedObject.interaction.label}</h2>
        <p>{scene.context[inspectedObject.id] ?? 'No additional verified case record is connected to this equipment.'}</p>
        <div className="sr-inspection-actions">
          {inspectedObject.id === 'archive_shelving' &&
            <button onClick={() => navigateGame('/?folder-lab=1&return=archive')}>
              OPEN MISSION FOLDERS
            </button>}
          <button autoFocus onClick={() => setInspecting(null)}>CLOSE</button>
        </div>
      </section>
    </div>}
    {selected && NADIR_ROOM[selected] === station &&
      <NadirPuzzle key={selected} id={selected} onClose={() => setSelected(null)}/>}
  </main>
}
