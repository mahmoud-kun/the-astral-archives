import { lazy, Suspense, useEffect, useState } from 'react'
import { navigateGame, onGameLinkClick } from './gameNavigation'
import { playGameSound } from './audio/gameAudio'
import InvestigationLayeredScene, { type RoomObjectTarget } from './InvestigationLayeredScene'
import NadirPuzzle from './gameplay/NadirPuzzle'
import { stationRoute, type NadirRecord } from './gameplay/nadirEngine'
import { useArchiveSave } from './gameplay/gameSave'
import { countCaseCollectedEvidence, rescueIsReady } from './archive/archiveState'
import { enterRescueThroughPortal } from './integration/gameMediaActions'
import './investigationDesignerScene.css'

const CaseStationDesk = lazy(() => import('./gameplay/CaseStationDesk'))

type Interaction = 'briefing' | 'evidence' | 'door' | 'rescue' | 'help'
type Panel = Interaction | null

const INTERACTIONS: { id: Interaction; name: string }[] = [
  { id: 'briefing', name: 'Mission Briefing' },
  { id: 'evidence', name: 'Evidence Board' },
  { id: 'door', name: 'Station Door' },
  { id: 'rescue', name: 'Rescue Console' },
  { id: 'help', name: 'Controls' },
]

function SmallIcon({ type, size = 18 }: { type: 'back' | 'close' | 'help' | 'arrow'; size?: number }) {
  const shapes = {
    back: <path d="m10 5-7 7 7 7M3 12h18"/>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.2 9a3.3 3.3 0 1 1 5.3 2.7c-1.4 1-2.5 1.3-2.5 3.1M12 18h.01"/></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[type]}</svg>
}

export default function InvestigationDesignerScene() {
  const [panel, setPanel] = useState<Panel>(null)
  const [showHint, setShowHint] = useState(false)
  const [puzzleId,setPuzzleId] = useState<NadirRecord|null>(null)
  const [caseSourceOpen,setCaseSourceOpen] = useState(false)
  const [sourceObjectId,setSourceObjectId] = useState('center_terminal')
  const archive = useArchiveSave()
  const nadirCollected = countCaseCollectedEvidence(archive,'NAD')
  const nadirReady = rescueIsReady(archive,'NAD')

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || document.querySelector('.cm-backdrop')) return
      if (panel) setPanel(null)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [panel])

  function openCaseLibrary() {
    navigateGame('/?folder-lab=1&return=investigation')
  }
  function openCaseSources(objectId:'center_terminal'|'evidence_board') {
    setSourceObjectId(objectId)
    setPanel(null)
    setCaseSourceOpen(true)
  }

  function open(target: Interaction) {
    setShowHint(false)
    playGameSound('panelOpen')
    setPanel(target)
  }

  function openObject(target: RoomObjectTarget) {
    setShowHint(false)
    if (target === 'cases') openCaseLibrary()
    else open(target)
  }

  return <main className="idr-root" aria-label="The Astral Archives — Investigation Room">
    <div className="idr-background" aria-hidden="true"/>
    <div className="idr-dark-edges" aria-hidden="true"/>
    <section className="idr-stage" aria-label="Full investigation room scene">
      <InvestigationLayeredScene onOpen={openObject}/>
    </section>

    <header className="idr-head">
      <div className="idr-head-left">
        <a href="/" onClick={event => onGameLinkClick(event, '/')} className="idr-home-button" aria-label="Return to Home Screen"><SmallIcon type="back" size={20}/></a>
        <div className="idr-room-name"><span>STATION / PRESENT TIMELINE</span><strong>INVESTIGATION ROOM</strong></div>
      </div>
      <div className="idr-head-right">
        <span className="idr-case-current"><i/> FIVE MISSION DOSSIERS AVAILABLE</span>
        <button onClick={() => open('help')} aria-label="How to explore the room" className="idr-utility"><SmallIcon type="help"/></button>
      </div>
    </header>

    {showHint && <div className="idr-hint" role="status">
      <span className="idr-pulse"/> <span>HOVER OR TAP AN OBJECT TO INSPECT</span>
      <button onClick={() => setShowHint(false)} aria-label="Dismiss tip"><SmallIcon type="close" size={14}/></button>
    </div>}

    <footer className="idr-foot">
      <div className="idr-foot-status"><span className="idr-foot-diamond"/> STATION 01 / 04 <b>·</b> INVESTIGATION HUB</div>
      <div className="idr-foot-instruction">
        <span className="idr-foot-instruction-desktop">HOVER TO REVEAL · CLICK TO INSPECT</span>
        <span className="idr-foot-instruction-mobile">TAP AN OBJECT TO INSPECT</span>
      </div>
    </footer>

    {panel && <div className="idr-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setPanel(null) }}>
      <div className={'idr-inspection idr-inspection-' + panel} role="dialog" aria-modal="true" aria-label={INTERACTIONS.find(item => item.id === panel)?.name ?? 'Station console'}>
        <div className={'idr-inspection-back idr-inspection-back-' + panel} aria-hidden="true"/>
        <header className="idr-inspection-head">
          <span>THE ASTRAL ARCHIVES <b>/</b> {panel === 'briefing' ? 'DESK TERMINAL' : panel === 'door' ? 'STATION DIRECTORY' : panel === 'evidence' ? 'EVIDENCE BOARD' : panel === 'rescue' ? 'RESCUE CONSOLE' : 'INVESTIGATOR HELP'}</span>
          <button data-sfx="panelClose" onClick={() => setPanel(null)}><SmallIcon type="close"/> <span>BACK TO ROOM</span></button>
        </header>

        {panel === 'briefing' && <div className="idr-single-view">
          <span className="idr-eyebrow">STATION TERMINAL / NEW INVESTIGATOR</span>
          <h2>YOUR ASSIGNMENT</h2>
          <p className="idr-lead">Five mission records have been reopened for independent investigation.</p>
          <p>You are Henda, an aerospace engineer and investigator. Explore the station, examine each mission's records, and separate evidence from assumptions before attempting a rescue.</p>
          <div className="idr-briefing-steps">
            <div><span>01</span><strong>REVIEW</strong><small>Open a mission file to understand what happened and what remains unexplained.</small></div>
            <div><span>02</span><strong>INVESTIGATE</strong><small>Inspect records, recordings and signal data in the station's rooms.</small></div>
            <div><span>03</span><strong>RESCUE</strong><small>Collect any six of a mission’s eight evidence records, then travel into the past to follow its Rescue story.</small></div>
          </div>
          <button className="idr-primary" onClick={openCaseLibrary}>OPEN MISSION FILES <SmallIcon type="arrow"/></button>
          <button className="idr-primary" onClick={()=>openCaseSources('center_terminal')}>OPEN RECOVERED TERMINAL FILES <SmallIcon type="arrow"/></button>
        </div>}

        {panel === 'evidence' && <div className="idr-single-view">
          <span className="idr-eyebrow">EVIDENCE STORAGE / PRESENT TIMELINE</span>
          <h2>THE EVIDENCE BOARD</h2>
          <p className="idr-lead">Recover the evidence. Restore the story.</p>
          <p>You'll collect records across the station and place them in the five mission folders. An incorrect filing is saved without a warning, and you can move an item later.</p>
          <div className="idr-interface-message"><span>OPEN INVESTIGATION / CASE NADIR</span><strong>NAV-042 CLOSED WITHOUT A DOCUMENTED RERUN</strong><small>Read the recovered ticket and collect it. You do not have to solve a question.</small></div>
          <button className="idr-primary" onClick={()=>{setPanel(null);setPuzzleId('NAD-06')}}>EXAMINE NAV-042 · NAD-06 <SmallIcon type="arrow"/></button>
          <button className="idr-primary" onClick={openCaseLibrary}>VIEW MISSION FILES <SmallIcon type="arrow"/></button>
          <button className="idr-primary" onClick={()=>openCaseSources('evidence_board')}>INSPECT OTHER RECOVERED BOARD FILES <SmallIcon type="arrow"/></button>
        </div>}

        {panel === 'door' && <div className="idr-single-view">
          <span className="idr-eyebrow">STATION / ROOM DIRECTORY</span>
          <h2>STATION ACCESS</h2>
          <p className="idr-lead">Four rooms. One investigation.</p>
          <div className="idr-door-grid">
            <div className="idr-door-active"><small>01 / CURRENT ROOM</small><strong>Investigation</strong><span>Mission hub and NAV-042</span></div>
            <button className="idr-door-room" onClick={()=>navigateGame(stationRoute('archive'))}><small>02 / ENTER ROOM</small><strong>Archive</strong><span>Interface contracts and records</span></button>
            <button className="idr-door-room" onClick={()=>navigateGame(stationRoute('recordings'))}><small>03 / ENTER ROOM</small><strong>Recordings</strong><span>Escalations and chronology</span></button>
            <button className="idr-door-room" onClick={()=>navigateGame(stationRoute('signal'))}><small>04 / ENTER ROOM</small><strong>Signal</strong><span>Telemetry and unit analysis</span></button>
          </div>
          <p className="idr-integrity-note">Return here from any station room. Your collected evidence and folder progress are saved automatically.</p>
        </div>}

        {panel === 'rescue' && <div className="idr-single-view">
          <span className="idr-eyebrow">ENGINEERING / RESCUE CONSOLE</span>
          <h2>THE RESCUE CONSOLE</h2>
          <p className="idr-lead">Understand the mission before changing its future.</p>
          <p>For Nadir, collecting any six of its eight records unlocks Rescue. Travel into the past and see the alternate story — no quizzes, calculations or mandatory filing.</p>
          <div className="idr-interface-message"><span>CASE NAD / ACCESS STATUS</span><strong>{nadirReady?'RESCUE UNLOCKED':'RESCUE LOCKED · '+nadirCollected+'/6 COLLECTED'}</strong><small>Collect any six Nadir records to unlock. The Mission Folders are still available for sorting, but filing never blocks Rescue.</small></div>
          {nadirReady?<button className="idr-primary" onClick={()=>enterRescueThroughPortal('NAD')}>ENTER NADIR RESCUE <SmallIcon type="arrow"/></button>
            :<button className="idr-primary" onClick={openCaseLibrary}>REVIEW MISSION FOLDERS <SmallIcon type="arrow"/></button>}
        </div>}

        {panel === 'help' && <div className="idr-single-view">
          <span className="idr-eyebrow">PLAYER ASSISTANT / CONTROLS</span>
          <h2>HOW TO EXPLORE</h2>
          <p className="idr-lead">The entire room is in front of you.</p>
          <p>Hover or tap an object to find recovered evidence, then collect it directly. The Station Door leads to Archive, Signal and Recordings. Open each recovered record and press COLLECT EVIDENCE directly. No answers or puzzles are required. The Quick Evidence Tray follows you between rooms and opens the physical Mission Folders directly. Wrong filing is saved silently. Escape closes the active inspector.</p>
          <button className="idr-primary" onClick={()=>{setPanel(null);window.dispatchEvent(new Event('astral:replay-tutorial'))}}>REPLAY INTERACTIVE ROOM GUIDE <SmallIcon type="arrow"/></button>
          <button className="idr-primary" onClick={openCaseLibrary}>START WITH MISSION FILES <SmallIcon type="arrow"/></button>
        </div>}
        <footer className="idr-inspection-foot"><span>STATION / INVESTIGATION 01</span><span>FICTIONAL CASES — NO NASA TELEMETRY PRESENTED</span></footer>
      </div>
    </div>}
    {puzzleId && <NadirPuzzle id={puzzleId} onClose={()=>setPuzzleId(null)}/>}
    {caseSourceOpen && <Suspense fallback={<div className="aa-route-loading" role="status">ACCESSING CASE SOURCES…</div>}>
      <CaseStationDesk station="investigation" sourceObjectId={sourceObjectId} onClose={()=>setCaseSourceOpen(false)}/>
    </Suspense>}
  </main>
}
