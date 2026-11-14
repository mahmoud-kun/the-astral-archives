import { useEffect, useState, type CSSProperties } from 'react'
import {
  CASES, PARTS, PROTOCOLS, SLOT_META, calculate, execute, getPart, limits, newPlan,
  type CaseFile, type Outcome, type Part, type Phase, type Plan, type Slot
} from './rescueEngine'
import './rescueWorkbench.css'

type RunState = { phase: Phase; plan: Plan; outcome?: Outcome }
type SavedRuns = Record<string, RunState>
const STORAGE_KEY = 'astral-rescue-blueprint-demo-v1'
const SLOTS: Slot[] = ['antenna', 'power', 'thermal']
const DEFAULT_RUN = (): RunState => ({ phase: 'brief', plan: newPlan() })

function loadRuns(): SavedRuns {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as { version?: number; runs?: SavedRuns }
    if (stored.version !== 1 || !stored.runs || typeof stored.runs !== 'object') return {}
    const valid: SavedRuns = {}
    for (const mission of CASES) {
      const run = stored.runs[mission.id]
      if (!run || !run.plan || !['brief', 'build', 'result'].includes(run.phase)) continue
      try {
        for (const slot of SLOTS) {
          const part = getPart(run.plan.parts?.[slot])
          if (part.slot !== slot) throw new Error('Wrong slot')
        }
        if (!['eco', 'balanced', 'burst'].includes(run.plan.protocol)) continue
        if (!Number.isFinite(run.plan.transmitter)) continue
        if (run.phase === 'result' && !run.outcome) continue
        valid[mission.id] = run
      } catch { /* Ignore invalid saved fixture data. */ }
    }
    return valid
  } catch { return {} }
}

const slotGlyph: Record<Slot, string> = { antenna: '⌁', power: 'ϟ', thermal: '❄' }

function StatusStat({ title, display, limit, value, good, kind }: {
  title: string; display: string; limit: string; value: number; good: boolean; kind: 'positive' | 'negative'
}) {
  const percent = Math.max(0, Math.min(100, Math.round(value * 100)))
  return <div className={'rb-stat' + (!good ? ' rb-stat-warning' : '')}>
    <div className="rb-stat-name"><span>{title}</span><span className="rb-stat-check">{good ? 'WITHIN SPEC' : kind === 'positive' ? 'BELOW TARGET' : 'OVER LIMIT'}</span></div>
    <div className="rb-stat-values"><strong>{display}</strong><span>{limit}</span></div>
    <div className="rb-meter" aria-hidden="true"><span style={{ width: percent + '%' }}/></div>
  </div>
}

function BlueprintArt({ chosen, plan, onChoose }: { chosen: Slot; plan: Plan; onChoose: (slot: Slot) => void }) {
  return <div className="rb-schematic">
    <svg viewBox="0 0 720 470" className="rb-schematic-art" role="img" aria-label="Stylized interactive orbital relay schematic showing power, antenna, and thermal equipment bays">
      <defs>
        <pattern id="rb-grid-minor" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#406176" strokeWidth=".5" opacity=".4"/></pattern>
        <pattern id="rb-grid-major" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M120 0H0V120" fill="none" stroke="#5e8294" strokeWidth="1" opacity=".32"/></pattern>
        <linearGradient id="rb-hull" x1="0" x2=".9" y1="0" y2="1"><stop stopColor="#688ea0"/><stop offset=".48" stopColor="#344c68"/><stop offset="1" stopColor="#192c49"/></linearGradient>
        <linearGradient id="rb-solar" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2b6280"/><stop offset=".5" stopColor="#152f54"/><stop offset="1" stopColor="#10233f"/></linearGradient>
        <radialGradient id="rb-halo"><stop stopColor="#54c5df" stopOpacity=".24"/><stop offset="1" stopColor="#54c5df" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="720" height="470" fill="#0d1c30"/>
      <rect width="720" height="470" fill="url(#rb-grid-minor)"/>
      <rect width="720" height="470" fill="url(#rb-grid-major)"/>
      <circle cx="358" cy="246" r="230" fill="url(#rb-halo)"/>
      <circle cx="358" cy="246" r="184" fill="none" stroke="#38607d" strokeWidth="1" strokeDasharray="5 11"/>
      <circle cx="358" cy="246" r="132" fill="none" stroke="#335c77" strokeWidth="1" opacity=".6"/>
      <path d="M358 35v38M358 419v28M110 245h38M568 245h38" stroke="#799caa" strokeWidth="1.1"/>
      <g opacity=".88">
        <path d="M325 235H166v-96h159M390 235h162v99H390" stroke="#829fad" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M150 130h118v113H150z" fill="url(#rb-solar)" stroke="#95cada" strokeWidth="2.5"/>
        <path d="M160 140h98v93H160zM183 140v93M209 140v93M236 140v93M160 165h98M160 186h98M160 209h98" stroke="#4e95b5" fill="none" strokeWidth="1.3"/>
        <path d="M445 263h118v113H445z" fill="url(#rb-solar)" stroke="#95cada" strokeWidth="2.5"/>
        <path d="M455 273h98v93H455zM480 273v93M505 273v93M530 273v93M455 294h98M455 319h98M455 341h98" stroke="#4e95b5" fill="none" strokeWidth="1.3"/>
      </g>
      <g>
        <path d="M316 166l42-30 42 30 29 57v87l-71 37-71-37v-87z" fill="url(#rb-hull)" stroke="#c8e8ec" strokeWidth="3"/>
        <path d="M316 166l42 34 42-34M287 223l71 38 71-38M358 200v147M287 310l71-49 71 49" fill="none" stroke="#aac3d4" strokeWidth="1.4"/>
        <path d="M326 215l32 18 32-18v55l-32 20-32-20z" fill="#102e49" stroke="#76a6bb" strokeWidth="1.5"/>
        <rect x="342" y="239" width="32" height="13" rx="3" fill="#6dd4e6" opacity=".8"/>
        <path d="M333 311h51m-45 8h39" stroke="#96bfd1" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="358" cy="250" r="68" fill="none" stroke="#59bed4" strokeWidth="1" strokeDasharray="4 7" opacity=".7" className="rb-orbit"/>
        <path d="M358 137v-38l-19-18M358 137l20-19" stroke="#a9c8da" strokeWidth="4" fill="none"/>
        <ellipse cx="352" cy="71" rx="37" ry="13" fill="#668ca4" stroke="#b5dce7" strokeWidth="2" transform="rotate(-20 352 71)"/>
        <path d="M320 68l67-17" stroke="#bfe6ef" strokeWidth="1.7"/>
        <circle cx="357" cy="70" r="4" fill="#efb47c"/>
      </g>
      <g fill="none" strokeWidth="1.2" strokeDasharray="5 6">
        <path d="M352 73L545 73L545 119" stroke="#70cfe6"/>
        <path d="M326 248L153 248L153 333" stroke="#edb57f"/>
        <path d="M394 283L578 283L578 339" stroke="#9bd9c8"/>
      </g>
      <g fontFamily="Segoe UI, Arial, sans-serif" fontSize="10" letterSpacing="2.2" fill="#9dc4d6">
        <text x="23" y="31">FIG. 04 / RESCUE RELAY SCHEMATIC</text>
        <text x="680" y="31" textAnchor="end">NOT TO SCALE</text>
        <text x="23" y="449">SELECT A MODULE TO RECONFIGURE ITS HARDWARE</text>
        <text x="680" y="449" textAnchor="end">MOCK ENGINEERING MODEL</text>
      </g>
      <path d="M24 45h60M635 45h60M24 422h60M635 422h60" stroke="#6793a7"/>
    </svg>
    <button type="button" className={'rb-node rb-node-antenna' + (chosen === 'antenna' ? ' rb-node-active' : '')} onClick={() => onChoose('antenna')} aria-pressed={chosen === 'antenna'}>
      <span className="rb-node-number">01 / COMMS</span><strong>{slotGlyph.antenna} Antenna</strong><small>{getPart(plan.parts.antenna).name}</small>
    </button>
    <button type="button" className={'rb-node rb-node-power' + (chosen === 'power' ? ' rb-node-active' : '')} onClick={() => onChoose('power')} aria-pressed={chosen === 'power'}>
      <span className="rb-node-number">02 / POWER</span><strong>{slotGlyph.power} Energy</strong><small>{getPart(plan.parts.power).name}</small>
    </button>
    <button type="button" className={'rb-node rb-node-thermal' + (chosen === 'thermal' ? ' rb-node-active' : '')} onClick={() => onChoose('thermal')} aria-pressed={chosen === 'thermal'}>
      <span className="rb-node-number">03 / THERMAL</span><strong>{slotGlyph.thermal} Cooling</strong><small>{getPart(plan.parts.thermal).name}</small>
    </button>
    <div className="rb-canvas-legend"><span className="rb-light-dot"/> CONNECTED MODULES <span className="rb-legend-divider"/> CLICK TO INSPECT</div>
  </div>
}

function PartOption({ part, current, pending, onSelect }: { part: Part; current: boolean; pending: boolean; onSelect: () => void }) {
  return <button type="button" onClick={onSelect} className={'rb-part' + (pending ? ' rb-part-preview' : '') + (current ? ' rb-part-installed' : '')} aria-pressed={pending}>
    <span className="rb-part-heading"><strong>{part.name}</strong><span>{current ? 'INSTALLED' : pending ? 'SELECTED' : part.tag}</span></span>
    <span className="rb-part-meta">MASS {part.mass} kg <span>·</span> {part.slot === 'power' ? 'SUPPLY ' + part.capacity + ' W' : part.slot === 'antenna' ? 'LINK +' + part.signal : 'HEAT ' + part.heat}</span>
    <small>{part.description}</small>
  </button>
}

function BriefGraphic() {
  return <svg viewBox="0 0 560 350" className="rb-brief-graphic" role="img" aria-label="Stylized futuristic rescue satellite within a signal field">
    <defs>
      <radialGradient id="rb-space-glow"><stop stopColor="#2f6382" stopOpacity=".56"/><stop offset="1" stopColor="#102035" stopOpacity="0"/></radialGradient>
      <linearGradient id="rb-plate" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#7795aa"/><stop offset="1" stopColor="#223c58"/></linearGradient>
    </defs>
    <circle cx="280" cy="176" r="170" fill="url(#rb-space-glow)"/>
    <circle cx="280" cy="176" r="121" stroke="#3b6884" strokeDasharray="3 12" fill="none"/>
    <circle cx="280" cy="176" r="163" stroke="#31516b" strokeDasharray="2 17" fill="none"/>
    <path d="M280 10v34M280 308v31M118 176h40M401 176h38" stroke="#7aafc8" strokeWidth="1"/>
    <g transform="translate(280 176) rotate(-27)">
      <path d="M-132 -48h96v96h-96zM36 -48h96v96H36z" fill="#214b71" stroke="#9ec9db" strokeWidth="2"/>
      <path d="M-130 -25h92M-130 0h92M-130 25h92M-110 -48v96M-83 -48v96M-57 -48v96M38 -25h92M38 0h92M38 25h92M58 -48v96M85 -48v96M109 -48v96" stroke="#66a3c3" strokeWidth="1"/>
      <rect x="-38" y="-64" width="76" height="128" rx="11" fill="url(#rb-plate)" stroke="#c2e4ed" strokeWidth="3"/>
      <path d="M-27 -46h54v92h-54z" fill="#18364e" stroke="#7fb9ce"/>
      <path d="M-18 -22h36M-18 -12h36M-18 -2h36" stroke="#68bdd1" strokeWidth="3" opacity=".7"/>
      <path d="M0 -64v-44l-26-19" stroke="#b8dce7" strokeWidth="3"/>
      <ellipse cx="-16" cy="-125" rx="36" ry="13" fill="#678ea5" stroke="#d4f2f5" strokeWidth="2"/>
      <circle cx="0" cy="0" r="7" fill="#f4b985"/>
    </g>
    <path d="M355 73q68 58 0 119M373 58q90 74 0 150" stroke="#77d8e7" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8"/>
    <text x="18" y="28" fontSize="10" fill="#9bc2d4" letterSpacing="3">REMOTE RESCUE LINK</text>
    <text x="542" y="328" fontSize="10" fill="#9bc2d4" letterSpacing="3" textAnchor="end">FICTIONAL CASE FILE</text>
  </svg>
}

export default function RescueWorkbench() {
  const [activeId, setActiveId] = useState(CASES[0].id)
  const [runs, setRuns] = useState<SavedRuns>(loadRuns)
  const [selectedSlot, setSelectedSlot] = useState<Slot>('antenna')
  const [pendingPart, setPendingPart] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const mission: CaseFile = CASES.find(item => item.id === activeId) ?? CASES[0]
  const run: RunState = runs[mission.id] ?? DEFAULT_RUN()
  const plan = run.plan
  const stats = calculate(plan)
  const checks = limits(mission, stats)
  const currentPart = getPart(plan.parts[selectedSlot])
  const currentOptions = PARTS.filter(part => part.slot === selectedSlot)
  const selectedCandidate = getPart(pendingPart && currentOptions.some(part => part.id === pendingPart) ? pendingPart : currentPart.id)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, runs })) } catch { /* Storage might be blocked. */ }
  }, [runs])

  function edit(update: (plan: Plan) => Plan) {
    setRuns(current => {
      const previous = current[mission.id] ?? DEFAULT_RUN()
      if (previous.phase === 'result') return current
      return { ...current, [mission.id]: { ...previous, plan: update(previous.plan) } }
    })
  }

  function phase(next: Phase) {
    setRuns(current => {
      const previous = current[mission.id] ?? DEFAULT_RUN()
      if (previous.phase === 'result') return current
      return { ...current, [mission.id]: { ...previous, phase: next } }
    })
  }

  function selectCase(id: string) {
    setActiveId(id)
    setSelectedSlot('antenna')
    setPendingPart(null)
    setShowConfirm(false)
  }

  function executePlan() {
    setRuns(current => {
      const previous = current[mission.id] ?? DEFAULT_RUN()
      if (previous.phase !== 'build') return current
      return { ...current, [mission.id]: { ...previous, phase: 'result', outcome: execute(mission, previous.plan) } }
    })
    setShowConfirm(false)
  }

  function restartMission() {
    if (!window.confirm('Start a new fictional demo run for this mission? This resets its previous one-attempt result.')) return
    setRuns(current => ({ ...current, [mission.id]: DEFAULT_RUN() }))
    setSelectedSlot('antenna')
    setPendingPart(null)
  }

  const accentStyle = { '--rb-accent': mission.accent } as CSSProperties

  return <div className="rb-page" style={accentStyle}>
    <div className="rb-background" aria-hidden="true"/>
    <header className="rb-topbar">
      <a className="rb-brand" href="/" aria-label="Return to The Astral Archives station"><span className="rb-brand-mark">✦</span><span><strong>THE ASTRAL ARCHIVES</strong><small>RESCUE ENGINEERING LAB</small></span></a>
      <span className="rb-demo-status"><span className="rb-pulse"/> FICTIONAL SYSTEMS DEMONSTRATION</span>
      <a className="rb-return" href="/?room=1">← Return to station</a>
    </header>

    <main className="rb-container">
      <div className="rb-introline">
        <div><span className="rb-eyebrow">RESCUE OPERATIONS / ENGINEERING DECK</span><h1>Redesign the mission.</h1><p>Diagnose the failure. Rebuild the system. Commit your rescue.</p></div>
        <button className="rb-help-trigger" onClick={() => setShowHelp(true)}>ⓘ How to play</button>
      </div>

      <div className="rb-missions" role="group" aria-label="Select a fictional mission">
        {CASES.map((item) => {
          const missionRun = runs[item.id]
          return <button type="button" key={item.id} className={'rb-mission-tab' + (activeId === item.id ? ' rb-mission-active' : '')} onClick={() => selectCase(item.id)} aria-pressed={activeId === item.id}>
            <span className="rb-mission-code">{item.code} / 05</span><strong>{item.name}</strong>
            <span className="rb-mission-state">{missionRun?.phase === 'result' ? (missionRun.outcome?.success ? 'RESCUED' : 'MISSION FAILED') : missionRun?.phase === 'build' ? 'IN PROGRESS' : 'UNRESOLVED'}</span>
          </button>
        })}
      </div>

      <section className="rb-mission-heading" aria-label="Current mission">
        <div><span className="rb-label">ACTIVE CASE / {mission.vehicle}</span><h2>{mission.name}</h2><p>{mission.distress}</p></div>
        <span className="rb-chip">SIMULATED · NOT NASA DATA</span>
      </section>

      {run.phase === 'brief' && <div className="rb-brief-layout">
        <div className="rb-brief-visual"><BriefGraphic/><div className="rb-brief-image-label"><span>◈</span> MISSION SIGNAL LOST <small>SIMULATED DISTRESS</small></div></div>
        <section className="rb-brief-content">
          <div className="rb-section-kicker">STEP 01 / INVESTIGATE THE FAILURE</div>
          <h3>What went wrong?</h3><p className="rb-muted">Read the incident report and choose the fault you believe needs attention. You can revise your diagnosis until you execute the rescue.</p>
          <div className="rb-objective"><small>MISSION OBJECTIVE</small><strong>{mission.objective}</strong></div>
          <div className="rb-problem-options">
            {mission.problems.map(problem => <button type="button" key={problem.id} className={'rb-problem' + (plan.problem === problem.id ? ' rb-problem-selected' : '')} aria-pressed={plan.problem === problem.id} onClick={() => edit(old => ({ ...old, problem: problem.id }))}>
              <span className="rb-choice-dot"/><span><strong>{problem.title}</strong><small>{problem.explanation}</small></span>
            </button>)}
          </div>
          <button className="rb-primary rb-wide" disabled={!plan.problem} onClick={() => phase('build')}>ENTER ENGINEERING WORKBENCH <span>→</span></button>
          <p className="rb-footnote">This scenario is fictional. The correct diagnosis is not revealed until the final rescue attempt.</p>
        </section>
      </div>}

      {run.phase === 'build' && <>
        <div className="rb-build-heading">
          <div><span className="rb-section-kicker">STEP 02 / RECONFIGURE THE SYSTEM</span><h3>Engineering workbench <span>— {SLOT_META[selectedSlot].title}</span></h3></div>
          <button className="rb-text-button" onClick={() => phase('brief')}>← Review diagnosis</button>
        </div>
        <div className="rb-workbench-grid">
          <aside className="rb-workbench-side rb-left-panel">
            <div className="rb-panel-title"><span>01</span><div><strong>COMPONENT LIBRARY</strong><small>Choose one compatible module</small></div></div>
            <div className="rb-slot-tabs" role="group" aria-label="Select equipment bay">
              {SLOTS.map(slot => <button key={slot} className={selectedSlot === slot ? 'rb-slot-tab-active' : ''} aria-pressed={slot === selectedSlot} onClick={() => { setSelectedSlot(slot); setPendingPart(null) }} title={SLOT_META[slot].title}>{slotGlyph[slot]}<span>{SLOT_META[slot].short}</span></button>)}
            </div>
            <div className="rb-part-list">{currentOptions.map(part => <PartOption key={part.id} part={part} current={part.id === currentPart.id} pending={part.id === selectedCandidate.id} onSelect={() => setPendingPart(part.id)}/>)}</div>
            <div className="rb-install-panel"><div className="rb-install-name"><span>SELECTED CONFIGURATION</span><strong>{selectedCandidate.name}</strong></div>
              {selectedCandidate.id !== currentPart.id ? <button className="rb-secondary rb-wide" onClick={() => { edit(old => ({ ...old, parts: { ...old.parts, [selectedSlot]: selectedCandidate.id } })); setPendingPart(null) }}>INSTALL MODULE <span>↗</span></button> : <span className="rb-installed-note">✓ This module is installed</span>}
            </div>
          </aside>

          <BlueprintArt chosen={selectedSlot} plan={plan} onChoose={slot => { setSelectedSlot(slot); setPendingPart(null) }}/>

          <aside className="rb-workbench-side rb-right-panel">
            <div className="rb-panel-title"><span>02</span><div><strong>ENGINEERING CONTROLS</strong><small>Adjust live system parameters</small></div></div>
            <div className="rb-selected-system"><span>{slotGlyph[selectedSlot]}</span><div><small>SELECTED EQUIPMENT</small><strong>{currentPart.name}</strong><p>{SLOT_META[selectedSlot].detail}</p></div></div>
            <div className="rb-control-block"><div className="rb-control-header"><label htmlFor="rb-transmitter">Transmitter output</label><strong>{plan.transmitter}%</strong></div>
              <input id="rb-transmitter" type="range" min="20" max="100" step="10" value={plan.transmitter} onChange={event => edit(old => ({ ...old, transmitter: Number(event.target.value) }))}/>
              <div className="rb-range-labels"><span>20% LOW</span><span>100% HIGH</span></div>
              <p>Higher output improves signal strength but increases power demand and heat.</p>
            </div>
            <div className="rb-control-block"><div className="rb-control-header"><label>Transmission protocol</label></div>
              <div className="rb-protocols" role="group" aria-label="Transmission protocol">
                {(Object.keys(PROTOCOLS) as Array<keyof typeof PROTOCOLS>).map(key => <button type="button" key={key} aria-pressed={plan.protocol === key} className={plan.protocol === key ? 'rb-protocol-active' : ''} onClick={() => edit(old => ({ ...old, protocol: key }))}>{PROTOCOLS[key].name}</button>)}
              </div>
              <p>{PROTOCOLS[plan.protocol].description}</p>
            </div>
            <div className="rb-diagnosis-review"><span>WORKING DIAGNOSIS</span><strong>{mission.problems.find(p => p.id === plan.problem)?.title}</strong><small>Change it from “Review diagnosis”</small></div>
            <button className="rb-primary rb-wide rb-execute" onClick={() => setShowConfirm(true)}>EXECUTE RESCUE <span>→</span></button>
            <p className="rb-footnote">ONE ATTEMPT PER RUN · An irreversible decision until you explicitly restart this demo mission.</p>
          </aside>
        </div>
        <div className="rb-stats-heading"><span>03</span><strong>LIVE ENGINEERING STATUS</strong><small>These are observable constraints, not a success prediction.</small></div>
        <div className="rb-stats">
          <StatusStat title="SIGNAL STRENGTH" display={stats.signal + ' / ' + mission.signalTarget} limit="TARGET MIN" value={stats.signal / mission.signalTarget} good={checks.signal} kind="positive"/>
          <StatusStat title="POWER DRAW" display={stats.power + ' W'} limit={stats.available + ' W AVAILABLE'} value={stats.power / stats.available} good={checks.power} kind="negative"/>
          <StatusStat title="MODULE MASS" display={stats.mass + ' kg'} limit={mission.massLimit + ' kg MAX'} value={stats.mass / mission.massLimit} good={checks.mass} kind="negative"/>
          <StatusStat title="THERMAL LOAD" display={stats.heat + ' °C'} limit={mission.heatLimit + ' °C MAX'} value={stats.heat / mission.heatLimit} good={checks.heat} kind="negative"/>
        </div>
      </>}

      {run.phase === 'result' && run.outcome && <section className={'rb-result rb-result-' + (run.outcome.success ? 'success' : 'failure')}>
        <div className="rb-result-art" aria-hidden="true"><div className="rb-result-rings"><span/><span/><span/></div><div className="rb-result-symbol">{run.outcome.success ? '✓' : '×'}</div></div>
        <div className="rb-result-copy"><span className="rb-section-kicker">STEP 03 / RESCUE EXECUTION REPORT</span>
          <h3>{run.outcome.success ? 'Signal restored.' : 'Rescue unsuccessful.'}</h3>
          <p>{run.outcome.explanation}</p>
          <div className="rb-result-readings"><span>LINK <b>{run.outcome.stats.signal}</b></span><span>POWER <b>{run.outcome.stats.power} W</b></span><span>MASS <b>{run.outcome.stats.mass} kg</b></span><span>HEAT <b>{run.outcome.stats.heat} °C</b></span></div>
          <div className="rb-result-note">FICTIONAL SIMULATION · Outcomes are computed using temporary test rules. No real NASA telemetry or historical claims are used.</div>
          <button className="rb-primary" onClick={restartMission}>RESTART THIS DEMO MISSION ↺</button>
        </div>
      </section>}

      <footer className="rb-footer"><span>THE ASTRAL ARCHIVES / EXPERIMENTAL WORKBENCH</span><span>5 SWAPPABLE MOCK CASE FILES · LOCAL SAVE ENABLED</span></footer>
    </main>

    {showConfirm && <div className="rb-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShowConfirm(false) }}>
      <section className="rb-modal" role="dialog" aria-modal="true" aria-labelledby="rb-confirm-title"><span className="rb-section-kicker">FINAL ENGINEERING DECISION</span><h2 id="rb-confirm-title">Execute this rescue?</h2>
        <p>This commits your current diagnosis and equipment configuration. The result will be revealed immediately. You will have one attempt in this demo run.</p>
        <div className="rb-modal-actions"><button className="rb-secondary" onClick={() => setShowConfirm(false)}>KEEP EDITING</button><button className="rb-primary" onClick={executePlan}>CONFIRM EXECUTION →</button></div>
      </section>
    </div>}

    {showHelp && <div className="rb-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShowHelp(false) }}>
      <section className="rb-modal" role="dialog" aria-modal="true" aria-labelledby="rb-help-title"><span className="rb-section-kicker">QUICK PLAY GUIDE</span><h2 id="rb-help-title">You are the engineer.</h2>
        <ol><li>Choose a fictional case and diagnose the most likely fault.</li><li>Select a glowing module on the blueprint.</li><li>Choose a replacement in Component Library and install it.</li><li>Adjust transmitter output and protocol. Watch Signal, Power, Mass and Heat respond instantly.</li><li>Execute your plan. Only then will you discover whether the full rescue succeeded.</li></ol>
        <p>This build is a reusable gameplay proof of concept, not an accurate NASA mission simulation.</p><button className="rb-primary" onClick={() => setShowHelp(false)}>UNDERSTOOD</button>
      </section>
    </div>}
  </div>
}
