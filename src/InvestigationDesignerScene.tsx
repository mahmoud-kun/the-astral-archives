import { useEffect, useRef, useState } from 'react'
import {
  INVESTIGATION_CASES, INVESTIGATION_ACTIVE_CASE_KEY, isInvestigationCode,
  type InvestigationCode
} from './investigationCases'
import './investigationDesignerScene.css'
import wideManifest from '../public/assets/rooms/investigation/layers/wide/manifest.json'
import originalManifest from '../public/assets/rooms/investigation/layers/original/manifest.json'

type Interaction = 'cases' | 'briefing' | 'evidence' | 'door' | 'rescue' | 'help'
type Panel = Interaction | null

const INTERACTIONS: {
  id: Interaction; name: string; clue: string
}[] = [
  { id: 'cases', name: 'Mission Files', clue: 'REVIEW CASES' },
  { id: 'briefing', name: 'Mission Briefing', clue: 'YOUR ASSIGNMENT' },
  { id: 'evidence', name: 'Evidence Board', clue: 'INVESTIGATION' },
  { id: 'door', name: 'Station Door', clue: 'EXPLORE STATION' },
  { id: 'rescue', name: 'Rescue Console', clue: 'ENGINEERING' },
  { id: 'help', name: 'Controls', clue: 'HOW TO PLAY' },
]

function getStoredCase(): InvestigationCode | null {
  try {
    const saved = localStorage.getItem(INVESTIGATION_ACTIVE_CASE_KEY)
    return isInvestigationCode(saved) ? saved : null
  } catch {
    return null
  }
}

function SmallIcon({ type, size = 18 }: { type: 'back' | 'close' | 'folder' | 'help' | 'arrow' | 'check' | 'door' | 'eye'; size?: number }) {
  const shapes = {
    back: <path d="m10 5-7 7 7 7M3 12h18"/>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    folder: <><path d="M3 6.5h7l2.5 2H21v12H3z"/><path d="M3 9h18"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.2 9a3.3 3.3 0 1 1 5.3 2.7c-1.4 1-2.5 1.3-2.5 3.1M12 18h.01"/></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
    check: <path d="m4 12 5 5L20 6"/>,
    door: <><path d="M5 3h12v18H5zM17 12h4m-3-3 3 3-3 3"/><circle cx="14" cy="12" r=".7" fill="currentColor"/></>,
    eye: <><path d="M2 12c2.5-4 5.9-6 10-6s7.5 2 10 6c-2.5 4-5.9 6-10 6S4.5 16 2 12Z"/><circle cx="12" cy="12" r="2.6"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[type]}</svg>
}

type RoomObject = (typeof wideManifest.objects)[number]

function LayeredObject({ object, scene, onOpen }: { object: RoomObject; scene: { width: number; height: number }; onOpen: (target: Interaction) => void }) {
  const button = useRef<HTMLButtonElement>(null)
  const pixels = useRef<ImageData | null>(null)
  useEffect(() => {
    const image = new Image()
    image.src = object.assets.mask
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return
      context.drawImage(image, 0, 0)
      pixels.current = context.getImageData(0, 0, canvas.width, canvas.height)
    }
    return () => { image.onload = null }
  }, [object.assets.mask])

  function inside(event: { clientX: number; clientY: number }) {
    const node = button.current
    const data = pixels.current
    if (!node || !data) return true
    const rect = node.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / rect.width * data.width)
    const y = Math.floor((event.clientY - rect.top) / rect.height * data.height)
    if (x < 0 || y < 0 || x >= data.width || y >= data.height) return false
    return data.data[(y * data.width + x) * 4] > 40
  }

  const { x, y, width, height } = object.position
  const style = { left: `${x / scene.width * 100}%`, top: `${y / scene.height * 100}%`,
    width: `${width / scene.width * 100}%`, height: `${height / scene.height * 100}%`, zIndex: object.zIndex }
  return <button ref={button} className="idr-object" style={style} aria-label={object.interaction.label}
    onPointerMove={event => button.current?.classList.toggle('idr-object-lit', inside(event))}
    onPointerLeave={() => button.current?.classList.remove('idr-object-lit')}
    onPointerDown={event => button.current?.classList.toggle('idr-object-lit', inside(event))}
    onClick={event => {
      if (event.detail === 0 || inside(event)) onOpen(object.interaction.target as Interaction)
    }}>
    <img className="idr-object-art" src={object.assets.base} alt="" draggable={false}/>
    {'screen' in object.assets && <img className="idr-object-art" src={object.assets.screen} alt="" draggable={false}/>}
    {'foreground' in object.assets && <img className="idr-object-art" src={object.assets.foreground} alt="" draggable={false}/>}
    <img className="idr-object-glow" src={object.assets.glow} alt="" draggable={false}/>
  </button>
}

function RoomBackdrop({ onOpen }: { onOpen: (target: Interaction) => void }) {
  return <>
    <RoomVariant manifest={wideManifest} onOpen={onOpen}/>
    <RoomVariant manifest={originalManifest} onOpen={onOpen}/>
  </>
}

function RoomVariant({ manifest, onOpen }: { manifest: typeof wideManifest; onOpen: (target: Interaction) => void }) {
  const [ready, setReady] = useState(false)
  return <div className={'idr-layered-scene idr-layered-' + manifest.variant + (ready ? ' idr-scene-ready' : '')}>
    <img className="idr-scene-image" src={manifest.background} alt="Designer artwork of the station investigation room"
      decoding="async" fetchPriority="high" onLoad={() => setReady(true)}/>
    {manifest.objects.map(object => <LayeredObject key={object.id} object={object} scene={manifest.coordinateSystem} onOpen={onOpen}/>)}
  </div>
}

export default function InvestigationDesignerScene() {
  const [panel, setPanel] = useState<Panel>(null)
  const [selected, setSelected] = useState<InvestigationCode>(() => getStoredCase() ?? 'KES')
  const [tracked, setTracked] = useState<InvestigationCode | null>(getStoredCase)
  const selectedCase = INVESTIGATION_CASES.find(item => item.code === selected) ?? INVESTIGATION_CASES[0]
  const currentCase = INVESTIGATION_CASES.find(item => item.code === tracked)

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (panel) setPanel(null)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [panel])

  function open(target: Interaction) {
    setPanel(target)
  }

  function trackCase() {
    setTracked(selected)
    try { localStorage.setItem(INVESTIGATION_ACTIVE_CASE_KEY, selected) } catch { /* Session-only if storage is unavailable */ }
  }

  return <main className="idr-root" aria-label="The Astral Archives — Investigation Room">
    <div className="idr-background" aria-hidden="true"/>
    <div className="idr-dark-edges" aria-hidden="true"/>
    <section className="idr-stage" aria-label="Full investigation room scene">
      <RoomBackdrop onOpen={open}/>
    </section>

    <header className="idr-head">
      <div className="idr-head-left">
        <a href="/" className="idr-home-button" aria-label="Return to Home Screen"><SmallIcon type="back" size={20}/></a>
        <div className="idr-room-name"><span>STATION / PRESENT TIMELINE</span><strong>INVESTIGATION ROOM</strong></div>
      </div>
      <div className="idr-head-right">
        <span className="idr-case-current"><i/> {currentCase ? 'TRACKING / ' + currentCase.name.toUpperCase() : 'FIVE CASES AVAILABLE'}</span>
        <button onClick={() => open('help')} aria-label="How to explore the room" className="idr-utility"><SmallIcon type="help"/></button>
      </div>
    </header>


    {panel && <div className="idr-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setPanel(null) }}>
      <div className={'idr-inspection idr-inspection-' + panel} role="dialog" aria-modal="true" aria-label={INTERACTIONS.find(item => item.id === panel)?.name ?? 'Station console'}>
        <div className={'idr-inspection-back idr-inspection-back-' + panel} aria-hidden="true"/>
        <header className="idr-inspection-head">
          <span>THE ASTRAL ARCHIVES <b>/</b> {panel === 'cases' ? 'MISSION FILES' : panel === 'briefing' ? 'DESK TERMINAL' : panel === 'door' ? 'STATION DIRECTORY' : panel === 'evidence' ? 'EVIDENCE BOARD' : panel === 'rescue' ? 'RESCUE CONSOLE' : 'INVESTIGATOR HELP'}</span>
          <button onClick={() => setPanel(null)}><SmallIcon type="close"/> <span>BACK TO ROOM</span></button>
        </header>

        {panel === 'cases' && <div className="idr-case-view">
          <div className="idr-case-sidebar">
            <span className="idr-eyebrow">ARCHIVE ACCESS / 005</span>
            <h2>CASE FILES</h2>
            <p>Five missions. Choose a file to examine its briefing.</p>
            <div className="idr-case-tabs">
              {INVESTIGATION_CASES.map((item, index) =>
                <button key={item.code} onClick={() => setSelected(item.code)}
                  className={selected === item.code ? 'idr-case-tab-current' : ''}
                  aria-pressed={selected === item.code}>
                  <span>0{index+1}</span>
                  <strong>{item.name}</strong>
                  {tracked === item.code && <span className="idr-case-followed" aria-label="Tracked case"><SmallIcon type="check" size={14}/></span>}
                </button>
              )}
            </div>
          </div>
          <div className="idr-case-details">
            <div className="idr-case-data-head"><span>MISSION / {selectedCase.code}</span><span>FICTIONAL RESEARCH CASE</span></div>
            <span className="idr-case-badge">{selectedCase.phase}</span>
            <h3>{selectedCase.name}</h3>
            <p className="idr-case-subtitle">{selectedCase.title}</p>
            <p className="idr-case-desc">{selectedCase.description}</p>
            <div className="idr-case-objective"><span>YOUR OBJECTIVE</span><p>{selectedCase.objective}</p></div>
            <div className="idr-case-data-bottom"><div><span>REQUIRED EVIDENCE</span><strong>6 RECORDS</strong><small>Collection & sorting will be connected in a later stage</small></div><div><span>FIRST PLACE TO INVESTIGATE</span><strong>{selectedCase.leadRoom}</strong><small>Available when room navigation is implemented</small></div></div>
            <div className="idr-case-controls">
              <button className="idr-primary" onClick={trackCase}>
                <SmallIcon type={tracked === selected ? 'check' : 'folder'} size={18}/>
                {tracked === selected ? 'CURRENT CASE SELECTED' : 'TRACK THIS CASE'}
              </button>
              <button className="idr-secondary" onClick={() => setPanel(null)}>RETURN TO ROOM <SmallIcon type="arrow"/></button>
            </div>
          </div>
        </div>}

        {panel === 'briefing' && <div className="idr-single-view">
          <span className="idr-eyebrow">STATION TERMINAL / NEW INVESTIGATOR</span>
          <h2>YOUR ASSIGNMENT</h2>
          <p className="idr-lead">Five mission records have been reopened for independent investigation.</p>
          <p>You are Henda, an aerospace engineer and investigator. Explore the station, examine each mission's records, and separate evidence from assumptions before attempting a rescue.</p>
          <div className="idr-briefing-steps">
            <div><span>01</span><strong>REVIEW</strong><small>Open a mission file to understand what happened and what remains unexplained.</small></div>
            <div><span>02</span><strong>INVESTIGATE</strong><small>Inspect records, recordings and signal data in the station's rooms.</small></div>
            <div><span>03</span><strong>RESCUE</strong><small>Once the required evidence is filed, choose engineering changes in a separate simulation.</small></div>
          </div>
          <button className="idr-primary" onClick={() => open('cases')}>OPEN MISSION FILES <SmallIcon type="arrow"/></button>
        </div>}

        {panel === 'evidence' && <div className="idr-single-view">
          <span className="idr-eyebrow">EVIDENCE STORAGE / PRESENT TIMELINE</span>
          <h2>THE EVIDENCE BOARD</h2>
          <p className="idr-lead">Keep the evidence. Follow the question.</p>
          <p>You'll collect records across the station and place them in the five mission folders. An incorrect filing is saved without a warning, and you can move an item later.</p>
          <div className="idr-interface-message"><span>INTEGRATION STATUS</span><strong>EVIDENCE INTERACTIONS: NEXT GAMEPLAY STAGE</strong><small>The 40 authored case records are available in the content bible; none are displayed as collected or verified here yet.</small></div>
          <button className="idr-primary" onClick={() => open('cases')}>VIEW MISSION FILES <SmallIcon type="arrow"/></button>
        </div>}

        {panel === 'door' && <div className="idr-single-view">
          <span className="idr-eyebrow">STATION / ROOM DIRECTORY</span>
          <h2>STATION ACCESS</h2>
          <p className="idr-lead">Four rooms. One investigation.</p>
          <div className="idr-door-grid">
            <div className="idr-door-active"><small>01 / CURRENT ROOM</small><strong>Investigation</strong><span>Mission hub and case files</span></div>
            <div><small>02 / NEXT STAGE</small><strong>Archive</strong><span>Mission documents and equipment</span></div>
            <div><small>03 / NEXT STAGE</small><strong>Recordings</strong><span>Audio records and memory fragments</span></div>
            <div><small>04 / NEXT STAGE</small><strong>Signal</strong><span>Telemetry and technical traces</span></div>
          </div>
          <p className="idr-integrity-note">The other rooms will be activated one by one after the Investigation Room visuals are approved.</p>
        </div>}

        {panel === 'rescue' && <div className="idr-single-view">
          <span className="idr-eyebrow">ENGINEERING / RESCUE CONSOLE</span>
          <h2>THE RESCUE CONSOLE</h2>
          <p className="idr-lead">Understand the mission before changing its future.</p>
          <p>Each mission's rescue will become available after its required evidence has been collected and correctly filed. Engineering decisions and outcomes will be built in the dedicated Rescue gameplay stage.</p>
          <div className="idr-interface-message"><span>ACCESS STATUS</span><strong>AWAITING CASE EVIDENCE INTEGRATION</strong><small>This stage focuses only on the Investigation Room environment and controls.</small></div>
        </div>}

        {panel === 'help' && <div className="idr-single-view">
          <span className="idr-eyebrow">PLAYER ASSISTANT / CONTROLS</span>
          <h2>HOW TO EXPLORE</h2>
          <p className="idr-lead">The entire room is in front of you.</p>
          <p>Click the glowing points on the furniture or use INTERACT at the bottom of the screen. A focused close-up opens for that object. Select BACK TO ROOM or press Escape to return. No camera rotation or scrolling is required.</p>
          <button className="idr-primary" onClick={() => open('cases')}>START WITH MISSION FILES <SmallIcon type="arrow"/></button>
        </div>}
        <footer className="idr-inspection-foot"><span>STATION / INVESTIGATION 01</span><span>FICTIONAL CASES — NO NASA TELEMETRY PRESENTED</span></footer>
      </div>
    </div>}
  </main>
}
