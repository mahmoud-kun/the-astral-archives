import { useEffect, useRef, useState } from 'react'

type Screen = 'menu' | 'transition' | 'office'
type MenuPanel = 'settings' | 'archives' | null
type DisplayMode = 'landscape' | 'portrait'

const title = 'THE ASTRAL ARCHIVES'
const hints = [
  "Five files. Five missions. We need to understand what went wrong.",
  "Something in these records deserves another look.",
  "The archive usually keeps a record of what the systems missed.",
]
const caseLabels = ['DOSSIER 01', 'DOSSIER 02', 'DOSSIER 03', 'DOSSIER 04', 'DOSSIER 05']

function Icon({ kind }: { kind: 'search' | 'folder' | 'settings' | 'expand' | 'close' }) {
  const items = {
    search: <><circle cx="10.6" cy="10.6" r="6.3" /><path d="m15.4 15.4 5 5" /></>,
    folder: <path d="M3 7V5.5A2 2 0 0 1 5 3.5h5l2.2 2.2H20a1 1 0 0 1 1 1V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    settings: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2v2.3m0 15.4V22M2 12h2.3m15.4 0H22M4.9 4.9l1.6 1.6m11 11 1.6 1.6m0-14.2-1.6 1.6m-11 11-1.6 1.6" /></>,
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{items[kind]}</svg>
}

function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [panel, setPanel] = useState<MenuPanel>(null)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('landscape')
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement))
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [visited, setVisited] = useState<string[]>([])
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const hintTimer = useRef<number | null>(null)
  const sessionStartedAt = useRef<number>(0)
  const hotspotCount = visited.length

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', handleFullscreen)
    return () => document.removeEventListener('fullscreenchange', handleFullscreen)
  }, [])

  useEffect(() => {
    if (screen !== 'transition') return
    const handle = window.setTimeout(() => {
      sessionStartedAt.current = Date.now()
      setScreen('office')
      setShowDialogue(true)
      setCurrentLine(0)
    }, 1200)
    return () => clearTimeout(handle)
  }, [screen])

  useEffect(() => {
    if (screen !== 'office') return
    if (hotspotCount > 0 || activeHotspot || showDialogue) {
      if (hintTimer.current !== null) window.clearTimeout(hintTimer.current)
      return
    }
    const elapsed = Date.now() - sessionStartedAt.current
    hintTimer.current = window.setTimeout(() => {
      setCurrentLine(1)
      setShowDialogue(true)
    }, Math.max(0, 60000 - elapsed))
    return () => { if (hintTimer.current !== null) window.clearTimeout(hintTimer.current) }
  }, [screen, hotspotCount, activeHotspot, showDialogue])

  function start() {
    setPanel(null); setShowDialogue(false); setVisited([]); setActiveHotspot(null)
    setCurrentLine(0); setScreen('transition')
  }

  function inspect(id: string) {
    setActiveHotspot(id)
    setVisited(previous => previous.includes(id) ? previous : [...previous, id])
    setShowDialogue(false)
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { /* Fullscreen is user-gesture/browser dependent; native view remains usable. */ }
  }

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (activeHotspot) setActiveHotspot(null)
      else if (panel) setPanel(null)
      else if (showDialogue) setShowDialogue(false)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [activeHotspot, panel, showDialogue])

  return (
    <div className={`game mode-${displayMode} screen-${screen}`}>
      <div className="backdrop" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      {screen === 'menu' && <>
        <header className="brand">
          <div className="brand-line">THE</div><h1>ASTRAL<br/><span>ARCHIVES</span></h1>
          <div className="brand-symbol" aria-hidden="true"><span>◇</span></div>
          <p>INVESTIGATE <b>•</b> ANALYZE <b>•</b> REDESIGN <b>•</b> RESCUE</p>
        </header>
        <main className="menu" aria-label="Main menu">
          <button className="menu-action primary" onClick={start}><Icon kind="search"/><span>START INVESTIGATION</span><strong>›</strong></button>
          <button className="menu-action" onClick={() => setPanel('archives')}><Icon kind="folder"/><span>MISSION ARCHIVES</span><strong>›</strong></button>
          <button className="menu-action" onClick={() => setPanel('settings')}><Icon kind="settings"/><span>SETTINGS</span><strong>›</strong></button>
          <button className="menu-action" onClick={toggleFullscreen}><Icon kind="expand"/><span>{isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}</span><strong>›</strong></button>
        </main>
        <div className="menu-caption">INVESTIGATION DIVISION <span>•</span> PROTOTYPE</div>
      </>}
      {screen === 'transition' && <div className="transition" role="status">OPENING THE ARCHIVES<span>...</span></div>}
      {screen === 'office' && <>
        <header className="room-heading"><span>INVESTIGATION ROOM</span><button onClick={() => setScreen('menu')}>MAIN MENU</button></header>
        <div className="room-label">THE ARCHIVES ARE WAITING</div>
        <div className="hotspots" aria-label="Investigation room interactable areas">
          <button className="hotspot hotspot-files" onClick={() => inspect('mission-files')}>EXAMINE MISSION FILES</button>
          <button className="hotspot hotspot-desk" onClick={() => inspect('briefing-desk')}>INSPECT BRIEFING DESK</button>
          <button className="hotspot hotspot-board" onClick={() => inspect('evidence-board')}>REVIEW EVIDENCE BOARD</button>
        </div>
        {showDialogue && <aside className="dialogue" aria-live="polite"><div className="speaker-avatar">H</div><div className="speech"><div className="speaker-label">HENDA <span>— INTERNAL MONOLOGUE</span></div><p>{hints[currentLine]}</p></div><button aria-label="Dismiss dialogue" onClick={() => setShowDialogue(false)}>×</button></aside>}
        {activeHotspot && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveHotspot(null) }}><section className="panel" role="dialog" aria-modal="true" aria-label="Inspection"><button className="panel-close" aria-label="Close inspection" onClick={() => setActiveHotspot(null)}><Icon kind="close"/></button><div className="eyebrow">INVESTIGATION / INSPECT</div><h2>{activeHotspot.replaceAll('-', ' ').toUpperCase()}</h2><p>Inspection is available in this prototype. Mission-specific records and verified NASA evidence will be added after content handoff.</p><button className="subtle-button" onClick={() => setActiveHotspot(null)}>RETURN TO ROOM</button></section></div>}
      </>}
      {panel && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPanel(null) }}>
        <section className="panel" role="dialog" aria-modal="true" aria-label={panel === 'settings' ? 'Settings' : 'Mission Archives'}>
          <button className="panel-close" aria-label="Close" onClick={() => setPanel(null)}><Icon kind="close"/></button>
          <div className="eyebrow">THE ASTRAL ARCHIVES</div>
          {panel === 'settings' ? <><h2>SETTINGS</h2><p>Display options for the visual prototype. Music, effects and voice-over assets are intentionally deferred.</p><fieldset><legend>DISPLAY LAYOUT</legend><div className="segmented"><button aria-pressed={displayMode==='landscape'} onClick={() => setDisplayMode('landscape')}>WIDE</button><button aria-pressed={displayMode==='portrait'} onClick={() => setDisplayMode('portrait')}>PORTRAIT</button></div></fieldset><button className="subtle-button" onClick={toggleFullscreen}>{isFullscreen ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN'}</button></> : <><h2>MISSION ARCHIVES</h2><p>Five mission dossiers. Detailed missions and evidence will be populated from the approved content package.</p><div className="dossiers">{caseLabels.map(label => <div className="dossier" key={label}><span>{label}</span><small>AWAITING RECORDS</small></div>)}</div></>}
        </section>
      </div>}
      <div className="corner-mark">EXPERIMENTAL EXPERIENCE • AUDIO ASSETS DEFERRED</div>
    </div>
  )
}
export default App
