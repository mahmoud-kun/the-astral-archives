import { useEffect, useState } from 'react'
import { navigateGame } from './gameNavigation'
import { getAudioSettings, setAudioSettings, playGameSound, type GameAudioSettings } from './audio/gameAudio'
import './homeScreen.css'

type Panel = 'files' | 'about' | 'settings' | null

const CASE_PREVIEWS = [
  { code: 'KES', name: 'Kestrel', title: 'The Mission That Outgrew Its Plan', phase: 'PRE-PHASE A / PHASE A', hook: 'An ambitious observatory proposal meets a mission plan that no longer fits its constraints.' },
  { code: 'NAD', name: 'Nadir', title: 'Two Numbers for One Interface', phase: 'PHASE B', hook: 'Two engineering teams cannot reconcile the same spacecraft navigation results.' },
  { code: 'LUM', name: 'Lumen', title: 'The Telescope That Passed', phase: 'PHASE C / D', hook: 'A telescope passes inspection, yet its first images raise difficult questions.' },
  { code: 'ORI', name: 'Oriole', title: 'The Landing Signal', phase: 'PHASE D / E', hook: 'The landing sequence ends with a signal that does not match the mission timeline.' },
  { code: 'AST', name: 'Asterion', title: 'The Stamp in the Archive', phase: 'CROSS-PHASE / ACTIVE', hook: 'A current mission faces an urgent review as unexpected changes appear in its archive.' },
] as const

function MiniSymbol({ kind, size = 20 }: { kind: 'play' | 'folder' | 'settings' | 'info' | 'close' | 'arrow' | 'expand' | 'back' | 'check'; size?: number }) {
  const shapes = {
    play: <path d="m9 5 11 7-11 7V5Z"/>,
    folder: <><path d="M3 6.5a2 2 0 0 1 2-2h5l2 2.2h7a2 2 0 0 1 2 2V19H3V6.5Z"/><path d="M3 10h18"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m12 2 .9 2.4 2 .7 2.2-1 2 2-1 2.2.7 2 2.3 1v2l-2.3 1-.7 2 1 2.2-2 2-2.2-1-2 .7L12 22l-.9-2.4-2-.7-2.2 1-2-2 1-2.2-.7-2-2.3-1v-2l2.3-1 .7-2-1-2.2 2-2 2.2 1 2-.7L12 2Z"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>,
    back: <path d="M20 12H4m7-7-7 7 7 7"/>,
    check: <path d="m4 12 5 5L20 6"/>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[kind]}</svg>
}

function ArchiveMark({ small = false }: { small?: boolean }) {
  return <div className={'home-emblem' + (small ? ' home-emblem-small' : '')} aria-hidden="true">
    <span className="home-emblem-orbit home-emblem-one"/>
    <span className="home-emblem-orbit home-emblem-two"/>
    <span className="home-emblem-center">✦</span>
  </div>
}

function getPreference(): boolean {
  try { return localStorage.getItem('astral-reduced-motion-v1') === 'true' } catch { return false }
}
function hasSavedInvestigation(): boolean {
  try {
    const archive = JSON.parse(localStorage.getItem('astral-archive-folder-v1') || 'null') as { discovered?: unknown } | null
    if (Array.isArray(archive?.discovered) && archive.discovered.length > 0) return true

    const legacy = JSON.parse(localStorage.getItem('astral-fixed-room-evidence-demo-v1') || 'null') as { collected?: unknown } | null
    return Array.isArray(legacy?.collected) && legacy.collected.length > 0
  } catch { return false }
}

export default function HomeScreen() {
  const [panel, setPanel] = useState<Panel>(null)
  const [activeCase, setActiveCase] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(getPreference)
  const [audioSettings,setAudioSettingsLocal] = useState(getAudioSettings)
  function changeAudio(patch:Partial<GameAudioSettings>){setAudioSettingsLocal(setAudioSettings(patch))}
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [hasSave] = useState(hasSavedInvestigation)
  const [fallbackArt, setFallbackArt] = useState(false)

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && panel) setPanel(null)
    }
    window.addEventListener('keydown', dismiss)
    return () => window.removeEventListener('keydown', dismiss)
  }, [panel])

  useEffect(() => {
    try { localStorage.setItem('astral-reduced-motion-v1', String(reduceMotion)) } catch { /* optional preference */ }
  }, [reduceMotion])

  function enterInvestigation() {
    navigateGame('/?room=1')
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { /* Browsers can deny fullscreen in embedded previews. */ }
  }

  return <main className={'aa-home' + (reduceMotion ? ' aa-home-still' : '')}>
    <div className="aa-home-art" aria-hidden="true">
      <picture>
        <img src={fallbackArt ? '/assets/optimized/menu-archive.webp' : '/assets/menu-archive-clean.webp'} alt="" loading="eager" fetchPriority="high" decoding="async" onError={() => setFallbackArt(true)}/>
      </picture>
    </div>
    <div className="aa-home-shade" aria-hidden="true"/>

    <header className="aa-home-header">
      <div className="aa-home-identity"><ArchiveMark small/><span><strong>THE ASTRAL ARCHIVES</strong><small>TECHYON / INTERACTIVE EXPERIENCE</small></span></div>
      <div className="aa-home-header-right"><span className="aa-home-prototype"><i/> PROTOTYPE · 01</span><button type="button" className="aa-home-icon-button" title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={toggleFullscreen}><MiniSymbol kind="expand"/></button></div>
    </header>

    <section className="aa-home-hero">
      <div className="aa-home-hero-copy">
        <p className="aa-home-overline"><span/> AN ARCHIVE OUTSIDE OF TIME <span className="aa-home-index">/ 2026</span></p>
        <ArchiveMark/>
        <div className="aa-home-title">
          <span>THE</span>
          <h1>ASTRAL<br/><strong>ARCHIVES</strong></h1>
        </div>
        <p className="aa-home-tagline">Every mission leaves a trace.</p>
        <p className="aa-home-description">Five cases. One unfolding mystery.<br/>Enter the station, examine the records, and uncover what the files don't say.</p>
        <div className="aa-home-actions">
          <button className="aa-home-cta" data-sfx="doorOpen" onClick={enterInvestigation}>
            <span className="aa-home-cta-symbol"><MiniSymbol kind="play" size={22}/></span>
            <span className="aa-home-cta-label"><strong>{hasSave ? 'CONTINUE INVESTIGATION' : 'START INVESTIGATION'}</strong><small>ENTER THE STATION</small></span>
            <MiniSymbol kind="arrow" size={23}/>
          </button>
          <button className="aa-home-secondary" data-sfx="panelOpen" onClick={() => { setActiveCase(0); setPanel('files') }}>
            <MiniSymbol kind="folder" size={20}/><span>MISSION ARCHIVES</span><span className="aa-home-secondary-tail">05</span>
          </button>
          <div className="aa-home-minor-actions">
            <button data-sfx="panelOpen" onClick={() => setPanel('settings')}><MiniSymbol kind="settings" size={17}/> SETTINGS</button>
            <span aria-hidden="true"/>
            <button data-sfx="panelOpen" onClick={() => setPanel('about')}><MiniSymbol kind="info" size={17}/> ABOUT</button>
          </div>
        </div>
      </div>
      <div className="aa-home-hero-space" aria-hidden="true"/>
    </section>

    <footer className="aa-home-footer">
      <span><i className="aa-home-footer-diamond"/> INVESTIGATE <b>·</b> ANALYZE <b>·</b> RESCUE</span>
      <span>FICTIONAL CASES · INSPIRED BY NASA ENGINEERING LESSONS</span>
      <span>CASE FILES / 001—005</span>
    </footer>

    {panel && <div className="aa-home-scrim" onMouseDown={event => { if (event.currentTarget === event.target) setPanel(null) }}>
      <section className="aa-home-dialog" role="dialog" aria-modal="true" aria-label={panel === 'files' ? 'Mission Archives' : panel === 'settings' ? 'Settings' : 'About the game'}>
        <header className="aa-home-dialog-head">
          <span>ASTRAL RECORDS <i>/</i> {panel === 'files' ? 'CASE REGISTRY 005' : panel === 'settings' ? 'PREFERENCES' : 'ABOUT THE EXPERIENCE'}</span>
          <button type="button" data-sfx="panelClose" aria-label="Close panel" onClick={() => setPanel(null)}><MiniSymbol kind="close"/></button>
        </header>
        {panel === 'files' && <div className="aa-home-files-content">
          <div className="aa-home-files-heading"><p className="aa-home-overline"><span/> CLASSIFIED RECORDS</p><h2>MISSION ARCHIVES</h2><p>Five investigations are waiting inside the station. Select a file for a spoiler-free briefing.</p></div>
          <div className="aa-home-files-columns">
            <div className="aa-home-case-list" aria-label="Select a mission file">
              {CASE_PREVIEWS.map((item, index) => <button key={item.code} className={index === activeCase ? 'is-selected' : ''} onClick={() => setActiveCase(index)} aria-pressed={index === activeCase}>
                <span>0{index + 1}</span><strong>{item.name}</strong><small>{item.code}</small>
              </button>)}
            </div>
            <div className="aa-home-case-preview">
              <div className="aa-home-case-preview-head"><span>FILE / {CASE_PREVIEWS[activeCase].code}</span><span>FICTIONAL MISSION</span></div>
              <div className="aa-home-case-orbit" aria-hidden="true"><span>✦</span></div>
              <span className="aa-home-case-phase">{CASE_PREVIEWS[activeCase].phase}</span>
              <h3>{CASE_PREVIEWS[activeCase].name}</h3>
              <h4>{CASE_PREVIEWS[activeCase].title}</h4>
              <p>{CASE_PREVIEWS[activeCase].hook}</p>
              <div className="aa-home-case-bottom"><span>FULL BRIEFING AVAILABLE INSIDE THE STATION</span><button onClick={enterInvestigation}>ENTER INVESTIGATION <MiniSymbol kind="arrow" size={18}/></button></div>
            </div>
          </div>
        </div>}
        {panel === 'settings' && <div className="aa-home-simple-panel">
          <p className="aa-home-overline"><span/> EXPERIENCE SETTINGS</p><h2>SETTINGS</h2><p>Adjust sound, station atmosphere and display preferences. Audio begins after your first interaction and never requires a paid service.</p>

          <label className="aa-home-setting-row"><span><strong>Sound effects</strong><small>Buttons, evidence, scanning and investigation feedback.</small></span><input type="checkbox" checked={audioSettings.effects} onChange={event=>changeAudio({effects:event.target.checked})}/></label>
          <label className="aa-home-setting-row"><span><strong>Station ambience</strong><small>Quiet mechanical room atmosphere; no music or autoplay.</small></span><input type="checkbox" checked={audioSettings.ambient} onChange={event=>changeAudio({ambient:event.target.checked})}/></label>
          <label className="aa-home-setting-row aa-home-audio-volume"><span><strong>Master volume · {audioSettings.volume}%</strong><small>Shared level for all sounds; preference is saved.</small></span><input type="range" min="0" max="100" step="5" value={audioSettings.volume} onChange={event=>changeAudio({volume:Number(event.target.value)})} aria-label="Master audio volume"/></label>
          <div className="aa-home-audio-actions">
            <button type="button" className="aa-home-preview-sound" data-sfx="none" onClick={()=>playGameSound('panelOpen')}>TEST SOUND EFFECT</button>
            <button type="button" className="aa-home-preview-sound" data-sfx="doorOpen" onClick={()=>navigateGame('/?audio-lab=1')}>OPEN SOUND LAB · 19 CUES</button>
          </div>
          <label className="aa-home-setting-row"><span><strong>Reduce ambient motion</strong><small>Disable decorative background movement and animated transitions.</small></span><input type="checkbox" checked={reduceMotion} onChange={event => setReduceMotion(event.target.checked)}/></label>
          <div className="aa-home-setting-row"><span><strong>Fullscreen display</strong><small>Use the available screen area when supported by your browser.</small></span><button onClick={toggleFullscreen}>{fullscreen ? 'EXIT FULLSCREEN' : 'ENTER FULLSCREEN'}</button></div>
        </div>}
        {panel === 'about' && <div className="aa-home-simple-panel">
          <p className="aa-home-overline"><span/> AN INTERACTIVE INVESTIGATION</p><h2>ABOUT THE ASTRAL ARCHIVES</h2>
          <p>Step into a futuristic investigation station as Henda, an aerospace engineer uncovering the lessons hidden in five fictional mission files. Explore evidence, understand the engineering trade-offs and attempt alternate-history rescue scenarios.</p>
          <div className="aa-home-about-grid"><div><small>EXPERIENCE</small><strong>First-person point-and-click</strong></div><div><small>PRODUCTION</small><strong>TECHYON · 2026</strong></div></div>
          <p className="aa-home-disclaimer">The cases are fictional educational scenarios inspired by publicly documented NASA engineering lessons. NASA does not endorse this game. Numerical examples and mission records are simulated and must not be confused with authentic NASA telemetry.</p>
        </div>}
        <footer className="aa-home-dialog-footer"><span>THE ASTRAL ARCHIVES</span><span>PROTOTYPE DESIGN REVIEW / V1</span></footer>
      </section>
    </div>}
  </main>
}
