import { useEffect, useRef, useState } from 'react'
import Investigation25D from './Investigation25D'
import Investigation360 from './Investigation360'

type Screen = 'menu' | 'opening' | 'station'
type Overlay = 'settings' | 'archives' | 'rooms' | 'inspect' | null
type RoomId = 'investigation' | 'archive' | 'recordings' | 'signal'
type InspectionId = 'mission-files' | 'evidence-board' | 'desk-terminal' | 'archive-console' | 'recording-console' | 'signal-console'
type LayoutMode = 'auto' | 'portrait'
type DialogueKind = 'intro' | 'hint' | 'support' | null
type SceneId = 'menu' | RoomId
type IconName = 'search' | 'folder' | 'gear' | 'expand' | 'arrow' | 'close' | 'compass' | 'chevron' | 'eye' | 'back' | 'info' | 'signal'

const ROOMS: { id: RoomId; title: string; code: string; location: string }[] = [
  { id: 'investigation', title: 'Investigation Room', code: '01', location: 'Main Station • North Wing' },
  { id: 'archive', title: 'Archive Room', code: '02', location: 'Main Station • Records' },
  { id: 'recordings', title: 'Recordings Room', code: '03', location: 'Main Station • Media Vault' },
  { id: 'signal', title: 'Signal Room', code: '04', location: 'Main Station • Communications' },
]

const INSPECTIONS: Record<InspectionId, { title: string; eyebrow: string; description: string; detail: string }> = {
  'mission-files': {
    title: 'Mission Files',
    eyebrow: 'FILE CABINET / 01',
    description: 'Five folders, each holding a different unanswered mission.',
    detail: 'The individual mission dossiers will appear here once the content team delivers the verified case records.',
  },
  'evidence-board': {
    title: 'Evidence Board',
    eyebrow: 'INVESTIGATION / 02',
    description: 'A record of the evidence collected across the five missions.',
    detail: 'Evidence may be filed into any dossier and moved later. Only evidence filed under the correct mission contributes to its progress.',
  },
  'desk-terminal': {
    title: 'Investigation Desk',
    eyebrow: 'DESK TERMINAL / 03',
    description: 'The work surface is cleared. The investigation is only beginning.',
    detail: 'Mission briefings and the first verified evidence items will be connected here in the next gameplay batch.',
  },
  'archive-console': {
    title: 'Archive Console',
    eyebrow: 'ARCHIVE / RECORDS',
    description: 'A dedicated terminal for mission timelines, equipment and source records.',
    detail: 'Source-backed NASA case content will be integrated separately; there is no invented telemetry in this prototype.',
  },
  'recording-console': {
    title: 'Recording Station',
    eyebrow: 'MEDIA VAULT / REVIEW',
    description: 'An inspection interface reserved for approved mission audio and video records.',
    detail: 'The original recordings and verified transcripts have not been integrated yet. No sound assets are in this build.',
  },
  'signal-console': {
    title: 'Signal Monitor',
    eyebrow: 'COMMUNICATIONS / LIVE',
    description: 'A room for communication histories and mission signal analysis.',
    detail: 'Detailed signal datasets and evidence will be connected after source verification.',
  },
}

const MISSION_IDS = ['01', '02', '03', '04', '05']

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.65, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  const shapes = {
    search: <><circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.1 15.1 5.2 5.2"/></>,
    folder: <><path d="M3.3 6a2 2 0 0 1 2-2h5.2l2 2.2h6.2a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H5.3a2 2 0 0 1-2-2z"/><path d="M3.4 9.3h17"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="m12 2 .8 2.2 2 .7 2.2-1 2.1 2.1-1 2.2.7 2L21 12l-2.2.8-.7 2 1 2.2-2.1 2.1-2.2-1-2 .7L12 21l-.8-2.2-2-.7-2.2 1-2.1-2.1 1-2.2-.7-2L3 12l2.2-.8.7-2-1-2.2L7 4.9l2.2 1 2-.7z"/></>,
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>,
    arrow: <><path d="M4 12h15m-6-6 6 6-6 6"/></>,
    chevron: <path d="m9 5 7 7-7 7"/>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.9 8.1-2.5 5.3-5.3 2.5 2.5-5.3z"/></>,
    eye: <><path d="M2 12c2.5-4.1 5.9-6.2 10-6.2s7.5 2.1 10 6.2c-2.5 4.1-5.9 6.2-10 6.2S4.5 16.1 2 12z"/><circle cx="12" cy="12" r="2.6"/></>,
    back: <><path d="m10 5-7 7 7 7M3 12h18"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></>,
    signal: <><path d="M4 17v3m5-7v7m5-11v11m5-16v16"/></>,
  }
  return <svg {...common}>{shapes[name]}</svg>
}

function Emblem({ small = false }: { small?: boolean }) {
  return <div className={small ? 'emblem emblem-small' : 'emblem'} aria-hidden="true">
    <span className="emblem-orbit orbit-one"/><span className="emblem-orbit orbit-two"/>
    <span className="emblem-core">✦</span>
  </div>
}

const SCENES: Record<SceneId, { webp: string; mobile: string; fallback: string }> = {
  menu: { webp: '/assets/optimized/menu-archive.webp', mobile: '/assets/optimized/menu-archive-sm.webp', fallback: '/assets/rooms/Archive_Original_REFERENCE.png' },
  investigation: { webp: '/assets/optimized/investigation-panorama-hq.webp', mobile: '/assets/optimized/room-investigation-sm.webp', fallback: '/assets/rooms/Investigation_Wide_Artwork.png' },
  archive: { webp: '/assets/optimized/room-archive.webp', mobile: '/assets/optimized/room-archive-sm.webp', fallback: '/assets/rooms/Archive_Original_REFERENCE.png' },
  recordings: { webp: '/assets/optimized/room-recordings.webp', mobile: '/assets/optimized/room-recordings-sm.webp', fallback: '/assets/rooms/Recordings_Original_REFERENCE.png' },
  signal: { webp: '/assets/optimized/room-signal.webp', mobile: '/assets/optimized/room-signal-sm.webp', fallback: '/assets/rooms/Signal_Original_REFERENCE.png' },
}

function SceneVisual({ scene }: { scene: SceneId }) {
  const [fallback, setFallback] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const asset = SCENES[scene]
  return (
    <div className={scene === 'menu' ? 'menu-scene' : 'station-room-art'} aria-hidden="true">
      <img className={'scene-image' + (loaded ? ' is-loaded' : '')}
        src={fallback ? asset.fallback : asset.webp}
        srcSet={fallback ? undefined : asset.mobile + ' 960w, ' + asset.webp + ' 1920w'}
        sizes="100vw" decoding="async" loading="eager"
        fetchPriority={scene === 'menu' ? 'high' : 'auto'} alt=""
        onLoad={() => setLoaded(true)}
        onError={() => { if (!fallback) { setFallback(true); setLoaded(false) } }}
      />
    </div>
  )
}

function HendaPortrait() {
  const [fallback, setFallback] = useState(false)
  return <img
    src={fallback ? '/assets/optimized/henda-portrait-sm.webp' : '/assets/optimized/henda-portrait-alpha.webp'}
    srcSet={undefined}
    sizes="(max-width: 580px) 73px, (max-width: 800px) 90px, 119px"
    alt="Portrait of a glasses-wearing space investigator in an engineering suit"
    width="355" height="492" loading="eager" decoding="async"
    onError={() => { if (!fallback) setFallback(true) }}
  />
}

// Only the entered scene is fetched; the other three rooms are never bulk-loaded.
function preloadScene(scene: SceneId): Promise<void> {
  const asset = SCENES[scene]
  const width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2)
  const source = width <= 960 ? asset.mobile : asset.webp
  return new Promise(resolve => {
    const image = new Image()
    let resolved = false
    const finish = () => { if (!resolved) { resolved = true; resolve() } }
    image.onload = finish
    image.onerror = () => {
      const backup = new Image()
      backup.onload = finish
      backup.onerror = finish
      backup.src = asset.fallback
    }
    image.src = source
  })
}

function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('auto')
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [roomId, setRoomId] = useState<RoomId>('investigation')
  // Experiment only: preserve the approved 2.5D camera as a comparison fallback.
  const [roomRenderMode, setRoomRenderMode] = useState<'360' | '2.5d'>('360')
  const [inspectionId, setInspectionId] = useState<InspectionId>('mission-files')
  const [visited, setVisited] = useState<InspectionId[]>([])
  const [dialogue, setDialogue] = useState<DialogueKind>(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [activity, setActivity] = useState(0)
  const frameRef = useRef<HTMLDivElement>(null)
  const [openingMessage, setOpeningMessage] = useState('CONNECTING TO ARCHIVES')

  const room = ROOMS.find(item => item.id === roomId) ?? ROOMS[0]
  const revealIdentity = visited.length >= 2
  const inspection = INSPECTIONS[inspectionId]

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  useEffect(() => {
    if (screen !== 'opening') return
    let cancelled = false
    const minimum = new Promise<void>(resolve => window.setTimeout(resolve, 850))
    const timeout = new Promise<void>(resolve => window.setTimeout(resolve, 7000))
    setOpeningMessage('PREPARING INVESTIGATION ROOM')
    void Promise.all([minimum, Promise.race([preloadScene('investigation'), timeout])]).then(() => {
      if (cancelled) return
      setRoomId('investigation')
      setScreen('station')
      setDialogue('intro')
      setActivity(value => value + 1)
    })
    return () => { cancelled = true }
  }, [screen])

  useEffect(() => {
    if (!dialogue || screen !== 'station') return
    const timer = window.setTimeout(() => setDialogue(null), dialogue === 'intro' ? 8500 : 7300)
    return () => window.clearTimeout(timer)
  }, [dialogue, screen])

  useEffect(() => {
    if (screen !== 'station' || hintUsed || dialogue || overlay) return
    const timer = window.setTimeout(() => {
      setHintUsed(true)
      setDialogue('hint')
    }, 60000)
    return () => window.clearTimeout(timer)
  }, [screen, dialogue, overlay, hintUsed, activity])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (overlay) setOverlay(null)
      else if (dialogue) setDialogue(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [overlay, dialogue])

  function begin() {
    setVisited([])
    setHintUsed(false)
    setDialogue(null)
    setOverlay(null)
    setActivity(0)
    setScreen('opening')
  }

  function inspect(id: InspectionId) {
    setInspectionId(id)
    setVisited(items => items.includes(id) ? items : [...items, id])
    setDialogue(null)
    setOverlay('inspect')
    setActivity(value => value + 1)
  }

  function changeRoom(next: RoomId) {
    setRoomId(next)
    setOverlay(null)
    setDialogue(null)
    setActivity(value => value + 1)
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      // Browser permissions and embedded previews may disallow fullscreen.
    }
  }

  return (
    <div ref={frameRef} className={'experience layout-' + layoutMode + ' phase-' + screen}>
      {screen === 'menu' && <main className="menu-view">
        <SceneVisual scene="menu"/>
        <div className="menu-atmosphere" aria-hidden="true"/>
        <div className="menu-frame">
          <header className="menu-topbar">
            <div className="station-sign"><Emblem small/><span>TECHYON <i>/</i> INTERACTIVE ARCHIVE</span></div>
            <div className="topbar-status"><span className="status-led"/>INVESTIGATION SYSTEM <span className="status-divider">/</span> DEMO 01</div>
          </header>
          <section className="menu-content" aria-label="Main menu">
            <div className="menu-overline"><span className="line-segment"/>THE MISSION RECORDS <span className="serial">EST. 2026</span></div>
            <div className="menu-title">
              <span className="title-the">THE</span>
              <h1><span>ASTRAL</span><strong>ARCHIVES</strong></h1>
            </div>
            <p className="menu-description">Somewhere in these archives, every mission left an answer.<br/>Find what history could not explain.</p>
            <div className="menu-rule"><Emblem small/><span>INVESTIGATE <b>·</b> ANALYZE <b>·</b> REDESIGN <b>·</b> RESCUE</span></div>
            <nav className="menu-actions" aria-label="Choose an action">
              <button className="game-button game-button-primary" onClick={begin}><span className="button-symbol"><Icon name="search"/></span><span className="button-text"><strong>START INVESTIGATION</strong><small>ENTER THE STATION</small></span><Icon name="arrow" size={20}/></button>
              <button className="game-button" onClick={() => setOverlay('archives')}><span className="button-symbol"><Icon name="folder"/></span><span className="button-text"><strong>MISSION ARCHIVES</strong><small>FIVE UNRESOLVED FILES</small></span><Icon name="chevron" size={18}/></button>
              <button className="game-button game-button-compact" onClick={() => setOverlay('settings')}><span className="button-symbol"><Icon name="gear"/></span><span className="button-text"><strong>SETTINGS</strong></span><Icon name="chevron" size={18}/></button>
              <button className="game-button game-button-compact" onClick={toggleFullscreen}><span className="button-symbol"><Icon name="expand"/></span><span className="button-text"><strong>{fullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}</strong></span><Icon name="chevron" size={18}/></button>
            </nav>
          </section>
          <footer className="menu-footer"><span><span className="footer-diamond">◇</span> AN ARCHIVE OUTSIDE OF TIME</span><span className="menu-footer-number">001 / 005</span></footer>
        </div>
      </main>}

      {screen === 'opening' && <div className="opening-view" role="status" aria-label="Preparing investigation room"><Emblem/><span className="opening-kicker">INVESTIGATION CONNECTION</span><strong>{openingMessage}</strong><div className="opening-line"><span/></div><small>RETRIEVING STATION VISUALS</small></div>}

      {screen === 'station' && <main className={'station-view room-' + roomId}>
        {roomId === 'investigation'
          ? roomRenderMode === '360'
            ? <Investigation360 disabled={Boolean(overlay || dialogue)}
                onInspect={inspect} onExit={() => changeRoom('archive')}
                onFallback={() => setRoomRenderMode('2.5d')}/>
            : <Investigation25D disabled={Boolean(overlay || dialogue)} onInspect={inspect}
                onExit={() => changeRoom('archive')}/>
          : <SceneVisual key={roomId} scene={roomId}/>}
        {roomId === 'investigation' && !overlay && !dialogue && <button type="button"
          className="room-render-switch"
          onClick={() => setRoomRenderMode(mode => mode === '360' ? '2.5d' : '360')}>
          {roomRenderMode === '360' ? 'COMPARE 2.5D VIEW' : 'TRY SEATED 360° VIEW'}
        </button>}
        
        <div className="station-vignette" aria-hidden="true"/>
        <header className="station-topbar">
          <div className="room-identity"><Emblem small/><div><span className="room-kicker">STATION / PRESENT TIMELINE</span><strong>{room.title.toUpperCase()}</strong></div></div>
          <div className="station-tools">
            <button title="Rooms" aria-label="Navigate rooms" className="tool-button" onClick={() => setOverlay('rooms')}><Icon name="compass"/></button>
            <button title="Investigative guidance" aria-label="Ask for a hint" className="tool-button" onClick={() => { setOverlay(null); setDialogue('support'); setActivity(value => value + 1) }}><Icon name="info"/></button>
            <button title="Main menu" aria-label="Return to main menu" className="tool-button" onClick={() => { setDialogue(null); setScreen('menu') }}><Icon name="back"/></button>
          </div>
        </header>

        <div className="room-hotspots" aria-label="Objects in the room">
          {roomId === 'archive' && <button className="scene-hotspot scene-hotspot-console" onClick={() => inspect('archive-console')} aria-label="Inspect archive terminal"><span className="hotspot-ring"/><span className="hotspot-tooltip">ARCHIVE CONSOLE</span></button>}
          {roomId === 'recordings' && <button className="scene-hotspot scene-hotspot-console" onClick={() => inspect('recording-console')} aria-label="Inspect recording terminal"><span className="hotspot-ring"/><span className="hotspot-tooltip">RECORDING STATION</span></button>}
          {roomId === 'signal' && <button className="scene-hotspot scene-hotspot-console" onClick={() => inspect('signal-console')} aria-label="Inspect signal monitor"><span className="hotspot-ring"/><span className="hotspot-tooltip">SIGNAL MONITOR</span></button>}
        </div>
        <div className="station-footer"><span className="coordinate-mark">{room.location.toUpperCase()}</span><span className="coordinate-mark">ROOM {room.code} / 04</span></div>

        {dialogue && <aside className="dialogue-card" aria-live="polite">
          <div className="character-frame"><HendaPortrait/></div>
          <div className="dialogue-copy"><div className="dialogue-overline"><span className="voice-indicator"/>{revealIdentity ? 'HENDA / INVESTIGATION ENGINEER' : 'INCOMING VOICE / IDENTITY UNKNOWN'}</div>
            <p>{dialogue === 'intro' ? 'Five files. Five missions. We need to understand what went wrong.' : dialogue === 'hint' ? 'There must be something useful in the files. I wonder what the mission records tell us.' : 'If I wanted to understand this place, I would start with whatever the room was built to keep.'}</p>
            <span className="dialogue-subtitle">INTERCOM / TEXT CAPTION</span>
          </div>
          <button className="dialogue-dismiss" title="Dismiss" aria-label="Dismiss caption" onClick={() => setDialogue(null)}><Icon name="close" size={17}/></button>
        </aside>}
      </main>}

      {overlay && <div className="modal-scrim" onMouseDown={event => { if (event.target === event.currentTarget) setOverlay(null) }}>
        <section className="archive-panel" role="dialog" aria-modal="true" aria-label={overlay === 'settings' ? 'Settings' : overlay === 'archives' ? 'Mission Archives' : overlay === 'rooms' ? 'Room Navigation' : inspection.title}>
          <header className="panel-top"><div className="panel-corner-label"><span className="orange-diamond">◆</span> ASTRAL RECORD SYSTEM <span className="panel-slash">/</span> SECURE ACCESS</div><button className="panel-close" onClick={() => setOverlay(null)} aria-label="Close panel"><Icon name="close" size={20}/></button></header>
          {overlay === 'settings' && <>
            <span className="panel-eyebrow">PREFERENCES / 001</span>
            <h2>SETTINGS</h2>
            <p className="panel-description">Choose how the visual prototype is displayed. Audio production will be handled separately.</p>
            <div className="settings-row"><span>DISPLAY ORIENTATION<small>Adapt to your screen or use a portrait frame</small></span><div className="option-switch"><button aria-pressed={layoutMode === 'auto'} onClick={() => setLayoutMode('auto')}>AUTO</button><button aria-pressed={layoutMode === 'portrait'} onClick={() => setLayoutMode('portrait')}>PORTRAIT</button></div></div>
            <div className="settings-row"><span>FULLSCREEN<small>Expand the experience to fill your display</small></span><button className="panel-action" onClick={toggleFullscreen}>{fullscreen ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN'} <Icon name="expand" size={16}/></button></div>
          </>}
          {overlay === 'archives' && <>
            <span className="panel-eyebrow">CASE REGISTRY / 005</span>
            <h2>MISSION ARCHIVES</h2>
            <p className="panel-description">Five unfinished files. Their case names and verified evidence will be supplied by the content team.</p>
            <div className="dossier-grid">{MISSION_IDS.map(id => <div className="dossier-card" key={id}><span className="dossier-index">FILE / {id}</span><Icon name="folder" size={28}/><strong>UNASSIGNED DOSSIER</strong><small>AWAITING VERIFIED RECORDS</small></div>)}</div>
          </>}
          {overlay === 'rooms' && <>
            <span className="panel-eyebrow">STATION DIRECTORY / 004</span>
            <h2>CHOOSE A ROOM</h2>
            <p className="panel-description">The four spaces of the present-day station.</p>
            <div className="room-list">{ROOMS.map(item => <button key={item.id} className={'room-list-entry' + (roomId === item.id ? ' selected' : '')} onClick={() => changeRoom(item.id)}><span className="entry-number">{item.code}</span><span>{item.title}<small>{item.location}</small></span><Icon name="arrow" size={18}/></button>)}</div>
          </>}
          {overlay === 'inspect' && <>
            <span className="panel-eyebrow">{inspection.eyebrow}</span>
            <h2>{inspection.title.toUpperCase()}</h2>
            <div className="inspection-body"><div className="inspection-illustration"><Icon name="eye" size={42}/><span>OBJECT UNDER REVIEW</span></div><div><p className="inspection-lead">{inspection.description}</p><p className="panel-description">{inspection.detail}</p><div className="placeholder-label">PROTOTYPE CONTENT / NOT A NASA PRIMARY SOURCE</div></div></div>
            <button className="panel-action panel-back" onClick={() => setOverlay(null)}><Icon name="back" size={16}/> RETURN TO ROOM</button>
          </>}
          <footer className="panel-footer"><span>THE ASTRAL ARCHIVES</span><span>INVESTIGATION / EXPERIMENTAL BUILD</span></footer>
        </section>
      </div>}
    </div>
  )
}

export default App
