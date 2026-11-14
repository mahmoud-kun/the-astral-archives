import { useEffect, useState } from 'react'
import { navigateGame, onGameLinkClick } from './gameNavigation'
import './investigationDesignerScene.css'

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

function RoomBackdrop() {
  return <picture className="idr-scene-image">
    <source media="(orientation: portrait)" srcSet="/assets/rooms/Investigation_Original_REFERENCE.png" />
    <img src="/assets/rooms/Investigation_Wide_Artwork.png"
      alt="Designer artwork of the full station investigation room: mission files on the left, evidence board and desk in the center, station door and archive console on the right."
      decoding="async" loading="eager"/>
  </picture>
}

export default function InvestigationDesignerScene() {
  const [panel, setPanel] = useState<Panel>(null)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (panel) setPanel(null)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [panel])

  function openCaseLibrary() {
    navigateGame('/?folder-lab=1')
  }

  function open(target: Interaction) {
    setShowHint(false)
    setPanel(target)
  }

  return <main className="idr-root" aria-label="The Astral Archives — Investigation Room">
    <div className="idr-background" aria-hidden="true"/>
    <div className="idr-dark-edges" aria-hidden="true"/>
    <section className="idr-stage" aria-label="Full investigation room scene">
      <RoomBackdrop/>
      <div className="idr-hotspot-layer" aria-label="Interactive objects in the room">
        <button className="idr-hotspot idr-hotspot-files" aria-label="Open the Case Library and all five mission folders" onClick={openCaseLibrary}>
          <span className="idr-hotspot-point"/><span className="idr-hotspot-name">MISSION FILES</span>
        </button>
        <button className="idr-hotspot idr-hotspot-evidence" aria-label="Inspect Evidence Board" onClick={() => open('evidence')}>
          <span className="idr-hotspot-point"/><span className="idr-hotspot-name">EVIDENCE BOARD</span>
        </button>
        <button className="idr-hotspot idr-hotspot-desk" aria-label="Read Mission Briefing on desk terminal" onClick={() => open('briefing')}>
          <span className="idr-hotspot-point"/><span className="idr-hotspot-name">MISSION BRIEFING</span>
        </button>
        <button className="idr-hotspot idr-hotspot-door" aria-label="Open Station Door directory" onClick={() => open('door')}>
          <span className="idr-hotspot-point"/><span className="idr-hotspot-name">STATION DOOR</span>
        </button>
        <button className="idr-hotspot idr-hotspot-rescue" aria-label="Inspect Rescue Console" onClick={() => open('rescue')}>
          <span className="idr-hotspot-point"/><span className="idr-hotspot-name">RESCUE CONSOLE</span>
        </button>
      </div>
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
          <button onClick={() => setPanel(null)}><SmallIcon type="close"/> <span>BACK TO ROOM</span></button>
        </header>

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
          <button className="idr-primary" onClick={openCaseLibrary}>OPEN MISSION FILES <SmallIcon type="arrow"/></button>
        </div>}

        {panel === 'evidence' && <div className="idr-single-view">
          <span className="idr-eyebrow">EVIDENCE STORAGE / PRESENT TIMELINE</span>
          <h2>THE EVIDENCE BOARD</h2>
          <p className="idr-lead">Keep the evidence. Follow the question.</p>
          <p>You'll collect records across the station and place them in the five mission folders. An incorrect filing is saved without a warning, and you can move an item later.</p>
          <div className="idr-interface-message"><span>INTEGRATION STATUS</span><strong>EVIDENCE INTERACTIONS: NEXT GAMEPLAY STAGE</strong><small>The 40 authored case records are available in the content bible; none are displayed as collected or verified here yet.</small></div>
          <button className="idr-primary" onClick={openCaseLibrary}>VIEW MISSION FILES <SmallIcon type="arrow"/></button>
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
          <p>Move the cursor over an object to reveal its illuminated outline, then click to inspect it. On a touchscreen, tap an object directly. Choose BACK TO ROOM or press Escape to return. The view stays fixed; no walking or camera controls are needed.</p>
          <button className="idr-primary" onClick={openCaseLibrary}>START WITH MISSION FILES <SmallIcon type="arrow"/></button>
        </div>}
        <footer className="idr-inspection-foot"><span>STATION / INVESTIGATION 01</span><span>FICTIONAL CASES — NO NASA TELEMETRY PRESENTED</span></footer>
      </div>
    </div>}
  </main>
}
