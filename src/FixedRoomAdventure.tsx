import { useEffect, useState, type CSSProperties } from 'react'
import { INVESTIGATION_FAITHFUL_LAYERS } from './investigationFaithfulLayers'
import { CASES } from './rescueEngine'
import { progressFor, moveEvidence, type SaveData, type EvidenceId } from './fixedRoomEvidence'
import './fixedRoomAdventure.css'

type RoomId = 'investigation' | 'archive' | 'recordings' | 'signal'
type Focus = 'files' | 'board' | 'desk' | 'rescue' | 'door' | 'room-console' | null
const STORAGE = 'astral-fixed-room-evidence-demo-v1'
const VALID_IDS: EvidenceId[] = ['echo-signal', 'echo-power']
const REQUIRED: EvidenceId[] = ['echo-signal', 'echo-power']

const ROOM_INFO: Record<RoomId, { title: string; image?: string; description: string }> = {
  investigation: { title: 'Investigation Room', description: 'The heart of the Astral Archives.' },
  archive: { title: 'Archive Room', image: '/assets/optimized/room-archive.webp', description: 'Mission records and hardware histories.' },
  recordings: { title: 'Recordings Room', image: '/assets/optimized/room-recordings.webp', description: 'Transcripts, audio and media evidence.' },
  signal: { title: 'Signal Room', image: '/assets/optimized/room-signal.webp', description: 'Telemetry and communications.' },
}

const EVIDENCE: Record<EvidenceId, { title: string; category: string; code: string; description: string }> = {
  'echo-signal': {
    title: 'Relay signal trace', category: 'SIGNAL RECORD', code: 'DEMO-COM-01',
    description: 'A recurring transmission drop was isolated in the fictional relay spectrum. The anomaly points toward the communications path.',
  },
  'echo-power': {
    title: 'Power bus diagnostic', category: 'ENGINEERING RECORD', code: 'DEMO-ENG-02',
    description: 'A fictional equipment log showing the electrical budget of the relay before the signal failed.',
  },
}

function loadSave(): SaveData {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE) || '{}') as Partial<SaveData>
    const collected = Array.isArray(value.collected) ? VALID_IDS.filter(id => value.collected?.includes(id)) : []
    const filed: SaveData['filed'] = {}
    for (const id of VALID_IDS) if (collected.includes(id) && typeof value.filed?.[id] === 'string' && CASES.some(c => c.id === value.filed?.[id])) filed[id] = value.filed[id]
    return { collected, filed }
  } catch { return { collected: [], filed: {} } }
}

function MiniIcon({ name }: { name: 'scan' | 'files' | 'desk' | 'rescue' | 'door' | 'close' | 'back' }) {
  const paths = {
    scan: <><circle cx="12" cy="12" r="7"/><path d="M2 12h20M12 2v20"/></>,
    files: <><path d="M3 6h7l2 3h9v11H3z"/><path d="M3 9h18"/></>,
    desk: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M9 21h6M12 17v4"/></>,
    rescue: <><path d="M5 20v-5l6-9 8-3-3 8-9 6H5z"/><circle cx="13" cy="11" r="2"/><path d="m7 17-3 3"/></>,
    door: <><path d="M4 3h12v18H4zM16 12h5M18 9l3 3-3 3"/><circle cx="13" cy="12" r=".6" fill="currentColor"/></>,
    close: <path d="M5 5l14 14M19 5L5 19"/>,
    back: <path d="M20 12H4m7-7-7 7 7 7"/>,
  }
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function SignalGraphic({ scan }: { scan: number }) {
  const trace = [49,47,46,51,44,48,53,46,50,45,49,50,46,47,51,52,41,60,34,65,28,69,31,62,44,49,50,47,53,50,48,51,47,50,49,48,52]
  const points = trace.map((y, i) => `${26 + i * (506 / (trace.length - 1))},${48 + y * 1.7}`).join(' ')
  const x = 26 + scan / 100 * 506
  const locked = scan >= 60 && scan <= 78
  return <svg viewBox="0 0 560 250" width="100%" role="img" aria-label="Illustrated demo signal trace with moveable frequency scan cursor">
    <defs>
      <linearGradient id="fr-scan-bg" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#17334c"/><stop offset="1" stopColor="#091b2d"/></linearGradient>
    </defs>
    <rect width="560" height="250" rx="9" fill="url(#fr-scan-bg)"/>
    {Array.from({ length: 10 }, (_,i) => <path key={'v'+i} d={`M${26+i*56} 23V219`} stroke="#42607a" opacity=".34"/>)}
    {Array.from({ length: 5 }, (_,i) => <path key={'h'+i} d={`M26 ${28+i*47}H534`} stroke="#42607a" opacity=".34"/>)}
    <rect x="330" y="24" width="91" height="195" fill="#f3b579" opacity=".08"/>
    <polyline points={points} stroke="#83e0ef" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
    <path d={`M${x} 22V218`} stroke={locked ? '#8de4c6' : '#e7ab72'} strokeWidth="2" strokeDasharray="6 5"/>
    <circle cx={x} cy="140" r="8" fill={locked ? '#8de4c6' : '#e7ab72'} opacity=".88"/>
    <text x="26" y="17" fontSize="11" fill="#aac7db" letterSpacing="1.8">RELAY / SPECTRUM READOUT</text>
    <text x="530" y="239" fontSize="10" fill="#b4cddd" textAnchor="end">FREQUENCY WINDOW {scan}%</text>
  </svg>
}

function PowerGraphic() {
  return <svg viewBox="0 0 560 250" width="100%" role="img" aria-label="Illustrated fictional power distribution schematic">
    <rect width="560" height="250" rx="9" fill="#0a1d30"/>
    <g stroke="#54718b" fill="none" strokeWidth="2">
      <path d="M119 126H240M319 126H442M280 85V40M280 166V215"/>
      <rect x="23" y="82" width="100" height="88" rx="7"/>
      <rect x="240" y="81" width="80" height="90" rx="7"/>
      <rect x="436" y="82" width="100" height="88" rx="7"/>
    </g>
    <g fill="#c4dce9" fontSize="13" fontWeight="600" textAnchor="middle">
      <text x="73" y="116">BATTERY</text><text x="73" y="139" fill="#87dfc6">75 W</text>
      <text x="280" y="120">POWER</text><text x="280" y="142">BUS</text>
      <text x="486" y="116">RADIO</text><text x="486" y="139" fill="#efb77e">46 W</text>
      <text x="280" y="29" fill="#8bdbef">TELEMETRY</text><text x="280" y="239" fill="#8bdbef">SUBSYSTEMS</text>
    </g>
    <circle cx="280" cy="126" r="43" stroke="#83c6d2" strokeWidth="2" fill="none" opacity=".35"/>
    <circle cx="280" cy="126" r="5" fill="#8bdbef"/>
  </svg>
}

export default function FixedRoomAdventure() {
  const [room, setRoom] = useState<RoomId>('investigation')
  const [focus, setFocus] = useState<Focus>(null)
  const [save, setSave] = useState<SaveData>(loadSave)
  const [scan, setScan] = useState(36)
  const [deskTab, setDeskTab] = useState<'overview' | 'diagnostic'>('overview')
  const [selectedFolder, setSelectedFolder] = useState(CASES[0].id)
  const [guide, setGuide] = useState(true)
  const [showLocations, setShowLocations] = useState(false)
  const progress = progressFor(save.filed, CASES[0].id, REQUIRED)
  const ready = progress === REQUIRED.length
  const current = ROOM_INFO[room]
  const locked = scan >= 60 && scan <= 78

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(save)) } catch { /* Storage may be unavailable. */ }
  }, [save])
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (focus) setFocus(null)
      else if (showLocations) setShowLocations(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [focus, showLocations])

  function collect(id: EvidenceId) {
    setSave(previous => ({
      collected: previous.collected.includes(id) ? previous.collected : [...previous.collected, id],
      filed: previous.filed,
    }))
  }
  function fileEvidence(id: EvidenceId, missionId: string) {
    setSave(previous => moveEvidence(previous, id, missionId))
  }
  function enterRoom(next: RoomId) {
    setRoom(next); setFocus(null); setShowLocations(false); setGuide(false)
  }
  function open(f: Focus) {
    setFocus(f); setShowLocations(false); setGuide(false)
  }

  return <main className="fr-root">
    <div className="fr-stars" aria-hidden="true"/>
    <header className="fr-header">
      <a className="fr-brand" href="/" aria-label="The Astral Archives main menu"><span className="fr-brand-symbol">✦</span><span>THE ASTRAL <b>ARCHIVES</b><small>INTERACTIVE INVESTIGATION</small></span></a>
      <div className="fr-head-right"><span className="fr-demo-label">FICTIONAL CONTENT · DEVELOPMENT DEMO</span><a className="fr-back-link" href="/">Main Menu</a></div>
    </header>

    <section className="fr-content" aria-label="Astral Archives investigation game">
      <div className="fr-topline">
        <div className="fr-room-heading"><span className="fr-eyebrow">PRESENT TIMELINE / STATION 01</span><h1>{current.title}</h1><p>{room === 'investigation' ? 'Explore the room. Inspect the objects. Solve the case.' : current.description}</p></div>
        <div className="fr-case-counter"><small>ACTIVE CASE / ECHO RELAY</small><strong>{progress} / {REQUIRED.length} evidence filed</strong><div className="fr-progress"><span style={{width:(progress/REQUIRED.length*100)+'%'}}/></div></div>
      </div>

      <div className="fr-stage-wrap">
        <div className="fr-scene-frame">
          <div className={'fr-scene'+(room !== 'investigation' ? ' fr-scene-secondary' : '')}>
            {room === 'investigation' ? <>
              <div className="fr-room-art" role="img" aria-label="Wide static view of the investigation room with space window, mission console, evidence board, desk, portal and archive equipment">
                {INVESTIGATION_FAITHFUL_LAYERS.map(layer => <img key={layer.assetId} src={layer.path} alt="" aria-hidden="true" decoding="async" draggable={false}/>)}
              </div>
              <div className="fr-hotspots" aria-label="Interact with objects in the room">
                <button style={{left:'18%',top:'55%'} as CSSProperties} className="fr-point fr-point-files" onClick={()=>open('files')} aria-label="Inspect Mission Files"><MiniIcon name="files"/><span>Mission Files</span></button>
                <button style={{left:'40%',top:'42%'} as CSSProperties} className="fr-point fr-point-board" onClick={()=>open('board')} aria-label="Inspect Evidence Board"><MiniIcon name="scan"/><span>Evidence Board</span></button>
                <button style={{left:'53%',top:'71%'} as CSSProperties} className="fr-point fr-point-desk" onClick={()=>open('desk')} aria-label="Inspect Desk Terminal"><MiniIcon name="desk"/><span>Desk Terminal</span></button>
                <button style={{left:'83%',top:'73%'} as CSSProperties} className="fr-point fr-point-rescue" onClick={()=>open('rescue')} aria-label="Open Rescue Console"><MiniIcon name="rescue"/><span>Rescue Console</span></button>
                <button style={{left:'84%',top:'43%'} as CSSProperties} className="fr-point fr-point-door" onClick={()=>open('door')} aria-label="Use Archive Portal"><MiniIcon name="door"/><span>Station Doors</span></button>
              </div>
            </> : <>
              <img className="fr-scene-image" src={current.image} alt={current.title + ' provisional room artwork'}/>
              <button className="fr-secondary-hotspot" onClick={()=>open('room-console')}><MiniIcon name="desk"/> Inspect {current.title} terminal</button>
              <span className="fr-preview-chip">ROOM ART PREVIEW · INTERACTIONS NEXT STAGE</span>
            </>}
          </div>
        </div>
        <div className="fr-stage-toolbar">
          <span><i className="fr-status-dot"/> {room === 'investigation' ? 'ROOM IN VIEW · CLICK AN OBJECT TO INSPECT' : 'ROOM PREVIEW'}</span>
          <button onClick={()=>setShowLocations(v=>!v)} aria-expanded={showLocations}><MiniIcon name="door"/> Change room</button>
        </div>
      </div>

      {showLocations && <nav className="fr-room-menu" aria-label="Select station room">
        {(Object.keys(ROOM_INFO) as RoomId[]).map((id,index) => <button key={id} className={room===id?'fr-room-active':''} onClick={()=>enterRoom(id)}><small>0{index+1} / 04</small><strong>{ROOM_INFO[id].title}</strong><span>{id==='investigation'?'INTERACTIVE NOW':'PREVIEW'}</span></button>)}
      </nav>}

      {guide && room === 'investigation' && <div className="fr-guide"><span>HOW TO PLAY</span><strong>The whole room is yours to explore.</strong><p>Start with the Evidence Board, then examine the Desk Terminal. File what you find in Mission Files.</p><button onClick={()=>setGuide(false)}>GOT IT</button></div>}

      <nav className="fr-quick-actions" aria-label="Quick object navigation">
        <button onClick={()=>open('board')}><MiniIcon name="scan"/><span>Evidence Board</span>{save.collected.includes('echo-signal')&&<b>✓</b>}</button>
        <button onClick={()=>open('desk')}><MiniIcon name="desk"/><span>Desk Terminal</span>{save.collected.includes('echo-power')&&<b>✓</b>}</button>
        <button onClick={()=>open('files')}><MiniIcon name="files"/><span>Mission Files</span><b>{save.collected.length}/2</b></button>
        <button onClick={()=>open('rescue')} className={ready?'fr-action-ready':''}><MiniIcon name="rescue"/><span>Rescue Console</span><b>{ready?'READY':'LOCKED'}</b></button>
      </nav>
      <footer className="fr-footer"><span>THE ASTRAL ARCHIVES · FIXED-ROOM POINT-AND-CLICK PROTOTYPE</span><span>NO CAMERA ROTATION · NO POINTER LOCK · ALL DATA FICTIONAL</span></footer>
    </section>

    {focus && <div className="fr-closeup-backdrop" onMouseDown={event=>{if(event.currentTarget===event.target)setFocus(null)}}>
      <section className="fr-closeup" role="dialog" aria-modal="true" aria-label={focus==='files'?'Mission files':focus==='board'?'Evidence board':focus==='desk'?'Desk terminal':focus==='rescue'?'Rescue console':focus==='door'?'Room navigation':'Room console'}>
        <header className="fr-closeup-head"><div><small>INTERACTIVE CLOSE-UP / STATION</small><strong>{focus==='files'?'MISSION FILES':focus==='board'?'EVIDENCE BOARD':focus==='desk'?'DESK TERMINAL':focus==='rescue'?'RESCUE CONSOLE':focus==='door'?'STATION DIRECTORY':'ROOM TERMINAL'}</strong></div><button onClick={()=>setFocus(null)} aria-label="Return to room"><MiniIcon name="close"/> Return to room</button></header>

        {focus==='board' && <div className="fr-closeup-body">
          <div className="fr-art-panel"><div className="fr-art-top"><span>COMMS ANALYZER</span><span>DEMO-COM-01</span></div><SignalGraphic scan={scan}/><div className="fr-monitor-base"><i/><i/><i/><span>ARCHIVE SIGNAL ANALYSIS / SYNTHETIC</span></div></div>
          <div className="fr-interaction-panel"><span className="fr-eyebrow">STEP 01 / INVESTIGATE</span><h2>Find the missing signal.</h2><p>Drag the frequency scanner across the trace. Locate the unstable burst in the highlighted band.</p>
            <div className="fr-scan-readout"><label htmlFor="fr-scan">Frequency scanner</label><strong>{scan}%</strong></div>
            <input type="range" id="fr-scan" min="0" max="100" value={scan} onChange={event=>setScan(Number(event.target.value))} aria-label="Move the signal scanner"/>
            <div className={'fr-diagnostic-status'+(locked?' fr-diagnostic-done':'')}><span className="fr-status-dot"/>{locked?'PATTERN ISOLATED · ANALYSIS AVAILABLE':'SEARCHING FOR SIGNAL PATTERN'}</div>
            <div className="fr-clue-preview"><small>DETECTED RECORD</small><strong>{locked?EVIDENCE['echo-signal'].title:'Unknown transmission pattern'}</strong><p>{locked?EVIDENCE['echo-signal'].description:'Move the scan marker onto the burst to inspect its recording.'}</p></div>
            <button className="fr-primary" disabled={!locked||save.collected.includes('echo-signal')} onClick={()=>collect('echo-signal')}>{save.collected.includes('echo-signal')?'✓ EVIDENCE COLLECTED':locked?'COLLECT SIGNAL RECORD →':'ISOLATE SIGNAL FIRST'}</button>
          </div>
        </div>}

        {focus==='desk' && <div className="fr-closeup-body">
          <div className="fr-art-panel"><div className="fr-art-top"><span>ENGINEERING TERMINAL</span><span>DEMO-ENG-02</span></div><PowerGraphic/><div className="fr-monitor-base"><i/><i/><i/><span>POWER BUS ANALYZER / SYNTHETIC</span></div></div>
          <div className="fr-interaction-panel"><span className="fr-eyebrow">STEP 02 / INSPECT</span><h2>Read the bus diagnostic.</h2><p>Switch from the overview to the diagnostic log to retrieve the equipment record.</p>
            <div className="fr-tab-row" role="group" aria-label="Desk terminal view"><button className={deskTab==='overview'?'fr-tab-active':''} onClick={()=>setDeskTab('overview')}>Overview</button><button className={deskTab==='diagnostic'?'fr-tab-active':''} onClick={()=>setDeskTab('diagnostic')}>Diagnostic log</button></div>
            {deskTab==='overview'?<div className="fr-terminal-reading"><small>SYSTEM SUMMARY</small><strong>Communications bus / intermittent</strong><p>The power trace alone does not identify the failure. Open the diagnostic record.</p></div>:<div className="fr-terminal-reading"><small>RECORD FOUND · {EVIDENCE['echo-power'].code}</small><strong>{EVIDENCE['echo-power'].title}</strong><p>{EVIDENCE['echo-power'].description}</p><div className="fr-code"><span>AVAILABLE CAPACITY</span><b>75 W</b><span>RADIO DEMAND</span><b>46 W</b></div></div>}
            <button className="fr-primary" disabled={deskTab!=='diagnostic'||save.collected.includes('echo-power')} onClick={()=>collect('echo-power')}>{save.collected.includes('echo-power')?'✓ EVIDENCE COLLECTED':deskTab==='diagnostic'?'COLLECT ENGINEERING LOG →':'OPEN DIAGNOSTIC LOG FIRST'}</button>
          </div>
        </div>}

        {focus==='files' && <div className="fr-closeup-body fr-files-body">
          <div className="fr-folder-column"><span className="fr-eyebrow">FIVE MISSION FOLDERS</span><h2>Mission archive</h2><p>Select a folder. Place any collected evidence inside it — evidence can be moved later.</p>
            <div className="fr-folder-list">{CASES.map(c=><button key={c.id} onClick={()=>setSelectedFolder(c.id)} className={selectedFolder===c.id?'fr-folder-selected':''}><span>▣</span><span><small>FILE {c.code}</small><strong>{c.name}</strong></span><em>{c.id==='demo-01'?progress+'/2':'DEMO'}</em></button>)}</div>
          </div>
          <div className="fr-folder-content"><div className="fr-folder-title"><small>OPEN DOSSIER</small><h3>{CASES.find(c=>c.id===selectedFolder)?.name}</h3><p>{selectedFolder===CASES[0].id?'Your current investigation. File the two collected records to prepare its rescue.':'A fictional case placeholder; full evidence content will be connected in a later production stage.'}</p></div>
            <div className="fr-folder-progress"><span>INVESTIGATION PROGRESS</span><strong>{selectedFolder===CASES[0].id?progress+' / 2':'NOT POPULATED'}</strong><div className="fr-progress"><span style={{width:selectedFolder===CASES[0].id?progress/2*100+'%':'0%'}}/></div></div>
            <h4>Collected evidence</h4>
            {save.collected.length===0?<div className="fr-empty-evidence"><p>No evidence collected yet.</p><button onClick={()=>setFocus('board')}>Inspect Evidence Board →</button></div>:<div className="fr-evidence-list">{save.collected.map(id=><div className="fr-evidence-item" key={id}><div><small>{EVIDENCE[id].code} · {EVIDENCE[id].category}</small><strong>{EVIDENCE[id].title}</strong><p>{EVIDENCE[id].description}</p></div><label>FILE IN<select value={save.filed[id]||''} onChange={event=>fileEvidence(id,event.target.value)} aria-label={'File '+EVIDENCE[id].title+' in a mission folder'}><option value="">Unfiled</option>{CASES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>)}</div>}
            <div className="fr-evidence-note">A record filed in the wrong mission is still saved. The archive does not tell you whether your filing choice is correct.</div>
            {ready&&<button className="fr-primary" onClick={()=>setFocus('rescue')}>RESCUE UNLOCKED · OPEN CONSOLE →</button>}
          </div>
        </div>}

        {focus==='rescue'&&<div className="fr-closeup-body">
          <div className="fr-art-panel fr-rescue-art"><div className="fr-portal-illustration"><div className="fr-portal-ring"><span>✦</span></div><div className="fr-portal-line">ALTERNATE HISTORY LINK</div></div></div>
          <div className="fr-interaction-panel"><span className="fr-eyebrow">STEP 04 / RESCUE MISSION</span><h2>{ready?'Rescue authorization granted.':'Rescue console locked.'}</h2><p>{ready?'Two required fictional evidence records were filed in the Echo Relay dossier. Your engineering rescue is ready.':'Collect the required clues and file them in the correct mission folder before accessing the engineering workbench.'}</p>
            <div className="fr-unlock-status"><span>INVESTIGATION EVIDENCE</span><strong>{progress} / 2</strong><div className="fr-progress"><span style={{width:progress/2*100+'%'}}/></div></div>
            {ready?<button className="fr-primary" onClick={()=>window.location.assign('/?workbench=1')}>ENTER ENGINEERING BLUEPRINT →</button>:<button className="fr-primary" onClick={()=>setFocus('files')}>OPEN MISSION FILES →</button>}
            <div className="fr-evidence-note">The Rescue Workbench uses five independent fictional engineering cases. This scene unlocks the first case as a gameplay demonstration, not a NASA reenactment.</div>
          </div>
        </div>}

        {focus==='door'&&<div className="fr-location-content"><span className="fr-eyebrow">STATION / PRESENT TIMELINE</span><h2>Where do you want to go?</h2><p>Investigation Room is the fully interactive prototype in this production stage. Other rooms are visual previews while their close-ups are being built.</p><div className="fr-location-grid">{(Object.keys(ROOM_INFO) as RoomId[]).map((id,index)=><button key={id} onClick={()=>enterRoom(id)}><span>0{index+1}</span><strong>{ROOM_INFO[id].title}</strong><small>{id==='investigation'?'FULL INTERACTIVE ROOM':'VISUAL PREVIEW'}</small></button>)}</div></div>}

        {focus==='room-console'&&<div className="fr-location-content"><span className="fr-eyebrow">ROOM SYSTEMS / NEXT STAGE</span><h2>{current.title} terminal</h2><p>This room is connected for navigation, but its detailed interactions are not included in the Investigation Room V1 milestone yet.</p><button className="fr-primary" onClick={()=>enterRoom('investigation')}>RETURN TO INVESTIGATION ROOM →</button></div>}
      </section>
    </div>}
  </main>
}
