import { useEffect, useState, type CSSProperties } from 'react'
import { CASE_CODES, CASE_META, EVIDENCE_RECORDS, findEvidence, type ArchiveCaseId, type ArchiveEvidence } from './evidenceRecords'
import { ARCHIVE_SAVE_KEY, countInFolder, countCaseCollectedEvidence, discoverEvidence, emptyArchiveState, fileEvidence, rescueIsReady, restoreArchiveState, type ArchiveState } from './archiveState'
import { navigateGame, onGameLinkClick } from '../gameNavigation'
import { playGameSound } from '../audio/gameAudio'
import { ARCHIVE_PROGRESS_EVENT, stationRoute, type StationId } from '../gameplay/nadirEngine'
import { isOtherCaseId, readActiveCase, setActiveCase } from '../gameplay/caseContext'
import { enterRescueThroughPortal, playCaseIntroduction, KESTREL_FOOTAGE_PENDING_APPROVAL } from '../integration/gameMediaActions'
import {isStoryRescueComplete} from '../gameplay/storyRescueState'
import './archiveFolderLab.css'

function initialState(): ArchiveState {
  try { return restoreArchiveState(localStorage.getItem(ARCHIVE_SAVE_KEY)) }
  catch { return emptyArchiveState() }
}
function PaperGraphic({ kind }: { kind: ArchiveEvidence['kind'] }) {
  if (kind === 'telemetry') return <svg className="af-mini-graph" viewBox="0 0 200 75" aria-hidden="true">
    <path d="M5 5V70H197" stroke="#687a75" strokeWidth="1.5" fill="none"/>
    <path d="M5 55L27 46 43 56 61 27 82 43 99 17 121 36 147 20 174 37 195 12" stroke="#823e32" strokeWidth="2.8" fill="none"/>
    <path d="M5 55L27 48 43 49 61 44 82 41 99 38 121 36 147 33 174 30 195 27" stroke="#3e8390" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
  </svg>
  if (kind === 'recording') return <div className="af-mini-wave" aria-hidden="true">{Array.from({length:22},(_,i)=><i key={i} style={{height:(15+(i*17)%70)+'%'}}/>)}</div>
  if (kind === 'blueprint') return <svg className="af-mini-blueprint" viewBox="0 0 200 80" aria-hidden="true"><path d="M22 40h155M45 30l22-15h68l20 15v20l-20 14H67L45 50ZM82 15v49m39-49v49" stroke="currentColor" fill="none" strokeWidth="2"/><circle cx="102" cy="40" r="19" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
  return <div className="af-mini-lines" aria-hidden="true"><i/><i/><i/><i/><i/></div>
}
function DossierSheet({ record, index, onClick }: { record: ArchiveEvidence; index: number; onClick: () => void }) {
  const slot = index % 7
  const style: CSSProperties = { left:(14+slot*5.5)+'%', top:(9+(slot%3)*7)+'%', transform:'rotate('+[-8,5,-5,7,-3,4,-7][slot]+'deg)', zIndex:10+index }
  return <button className={'af-dossier-sheet af-sheet-'+record.kind} style={style} onClick={onClick} aria-label={'Inspect '+record.id+' '+record.title}>
    <span className="af-sheet-id">{record.id} / {record.room.toUpperCase()}</span><strong>{record.title}</strong>
    <PaperGraphic kind={record.kind}/><span className="af-sheet-footer">ARCHIVE / {record.id}</span><em>REVIEW COPY</em>
  </button>
}
function DocumentViewer({ record, archive, onDiscover, onFile, onClose }: {record: ArchiveEvidence; archive: ArchiveState; onDiscover:(id:string)=>void; onFile:(id:string, folder:ArchiveCaseId|null)=>void; onClose:()=>void }) {
  const found = archive.discovered.includes(record.id)
  const [destination,setDestination] = useState<string>(archive.filed[record.id]??'')
  useEffect(() => {
    const onKey = (event:KeyboardEvent) => { if (event.key==='Escape') onClose() }
    document.addEventListener('keydown',onKey)
    return ()=>document.removeEventListener('keydown',onKey)
  },[onClose])
  return <div className="af-dialog-shade" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
    <section className="af-document-modal" role="dialog" aria-modal="true" aria-labelledby="af-document-title">
      <div className="af-modal-bar"><span>DOCUMENT INSPECTION / {record.id}</span><button onClick={onClose}>CLOSE ×</button></div>
      <div className="af-document-scroll"><article className="af-document-paper">
        <div className="af-document-letterhead"><span>THE ASTRAL ARCHIVES / {record.room.toUpperCase()}</span><span>{record.id} / ARCHIVED COPY</span></div>
        <span className="af-document-kind">{record.kind.toUpperCase()} / FICTIONAL RECORD</span>
        <h2 id="af-document-title">{record.title}</h2>
        <div className="af-hero-graphic"><PaperGraphic kind={record.kind}/></div>
        <div className="af-document-copy">{record.content.split(';').filter(Boolean).map((segment,i)=><p key={i}>{segment.trim()}</p>)}</div>
        <div className="af-document-annotation"><strong>YOUR NEXT STEP</strong><p>Collect this record if you haven’t already, then choose the Mission Folder it belongs to. No puzzles or technical questions are required.</p></div>
        <p className="af-source-mark">FICTIONAL SIMULATION — NOT ORIGINAL NASA FLIGHT DATA</p>
      </article></div>
      <div className="af-modal-footer">
        {found
          ? <><label className="af-file-select">CHOOSE MISSION FOLDER
              <select value={destination} onChange={event=>setDestination(event.target.value)}>
                <option value="">UNFILED INVENTORY</option>{CASE_CODES.map(code=><option key={code} value={code}>{code} — {CASE_META[code].name}</option>)}
              </select>
            </label><button className="af-primary" data-sfx="none" onClick={()=>onFile(record.id,destination?destination as ArchiveCaseId:null)} disabled={destination===(archive.filed[record.id]??'')}>{destination?'FILE HERE':'MOVE TO UNFILED'}</button></>
          : <button className="af-primary" onClick={()=>onDiscover(record.id)}>COLLECT EVIDENCE</button>}
        <span>{found?'SELECT & FILE / MOVE WITHOUT PENALTY':'DEVELOPMENT MODE ONLY'}</span>
      </div>
    </section>
  </div>
}
export default function ArchiveFolderLab() {
  const [archive,setArchive]=useState<ArchiveState>(initialState)
  const [caseId,setCaseId]=useState<ArchiveCaseId>(()=>readActiveCase()??'NAD')
  const [open,setOpen]=useState(true)
  const [inspectedId,setInspectedId]=useState<string|null>(null)
  const [intake,setIntake]=useState(false)
  const locationParam = new URLSearchParams(window.location.search)
  const from = locationParam.get('return')
  const origin:StationId = from==='signal'||from==='archive'||from==='recordings'?from:'investigation'
  // URL flags are user-controlled: development shortcuts must never ship to production.
  const debug = import.meta.env.DEV && locationParam.get('debug')==='1'
  const meta=CASE_META[caseId], inspected=inspectedId?findEvidence(inspectedId):undefined
  const filed=EVIDENCE_RECORDS.filter(record=>archive.filed[record.id]===caseId)
  const collectedCount=countCaseCollectedEvidence(archive,caseId)
  // Any six distinct collected records of the current mission unlock Rescue.
  // Sorting remains editable and optional for unlocking.
  const uncollected=EVIDENCE_RECORDS.filter(record=>record.caseId===caseId&&!archive.discovered.includes(record.id))
  const ready=rescueIsReady(archive,caseId)
  const storyComplete=isStoryRescueComplete(caseId)
  const unseen=EVIDENCE_RECORDS.filter(record=>record.caseId===caseId&&!archive.discovered.includes(record.id))
  const unfiled=EVIDENCE_RECORDS.filter(record=>archive.discovered.includes(record.id)&&!archive.filed[record.id])
  useEffect(()=>{try{localStorage.setItem(ARCHIVE_SAVE_KEY,JSON.stringify(archive))}catch{/* session-only fallback */}
    window.dispatchEvent(new Event(ARCHIVE_PROGRESS_EVENT))
  },[archive])
  function chooseCase(code:ArchiveCaseId){
    setCaseId(code);setOpen(true)
    if(isOtherCaseId(code))setActiveCase(code)
  }
  function file(id:string,target:ArchiveCaseId|null){
    const next=fileEvidence(archive,id,target)
    if(next!==archive){
      // A mistaken filing makes the SAME sound as a correct one; no answer leakage.
      playGameSound(target?'file':'folderMove')
    }
    setArchive(next)
    setInspectedId(null)
  }
  function reset(){
    if(window.confirm('Clear this standalone archive preview save? Other gameplay saves will not be affected.')){
      setArchive(emptyArchiveState())
    }
  }
  return <main className="af-app">
    <header className="af-header">
      <div className="af-brand"><span>THE ASTRAL ARCHIVES</span><strong>ARCHIVAL EVIDENCE / LIVING DOSSIERS</strong></div>
      <div className="af-header-end"><span>PHYSICAL CASE DOSSIERS</span><a href={stationRoute(origin)} onClick={event => onGameLinkClick(event,stationRoute(origin))}>RETURN TO {origin.toUpperCase()} ROOM</a></div>
    </header>
    <div className="af-grid">
      <aside className="af-sidebar" aria-label="Mission archive">
        <h2>MISSION ARCHIVE <small>05 DOSSIERS</small></h2>
        <div className="af-closed-list">{CASE_CODES.map(code=><button key={code} className={'af-folder-choice '+(caseId===code?'af-selected':'')} onClick={()=>chooseCase(code)} aria-pressed={caseId===code}>
          <img src="/assets/archive/folder-closed.svg" alt=""/><span className="af-choice-label"><small>CASE / {code}</small><strong>{CASE_META[code].name}</strong><em>{countInFolder(archive,code)} sheets</em></span>
        </button>)}</div>
      </aside>
      <section className="af-main">
        <div className="af-workhead"><div><span>CASE {caseId} / {meta.phase}</span><h1>{meta.name.toUpperCase()}</h1><p>{meta.subtitle}</p></div><button onClick={()=>setOpen(current=>!current)}>{open?'CLOSE FOLDER':'OPEN FOLDER'}</button></div>
        <div className="af-desk">
          {open ? <div className="af-open-dossier" aria-label={'Open '+meta.name+' folder'}>
            <img className="af-open-base" src="/assets/archive/folder-open.svg" alt=""/>
            <div className="af-inner-cover"><small>THE ASTRAL ARCHIVES / {caseId}</small><h2>{meta.name}</h2><em>{meta.subtitle}</em>
              <div className="af-cover-stamp"><strong>CASE FILE</strong><span>{filed.length} ATTACHMENTS REGISTERED</span><span>{meta.phase}</span></div>
              <div className="af-cover-note"><strong>INVESTIGATOR NOTES</strong><p>Collect recovered documents and arrange them in the right Mission Folder.</p></div>
            </div>
            <div className="af-sheet-area">
              {filed.length===0&&<div className="af-empty"><strong>NO RECORDS FILED</strong><span>Collected evidence will form a visible stack here.</span></div>}
              {filed.slice(-7).map((record,i)=><DossierSheet key={record.id} record={record} index={i} onClick={()=>setInspectedId(record.id)}/>)}
              {filed.length>7&&<span className="af-overflow">+{filed.length-7} MORE FILED RECORDS</span>}
            </div>
            <div className="af-front-flap" aria-hidden="true"/><span className="af-tab">{caseId} / EVIDENCE</span>
          </div> : <div className="af-large-closed"><img src="/assets/archive/folder-closed.svg" alt=""/><div><small>MISSION FILE</small><h2>{meta.name}</h2><p>{filed.length} ATTACHMENTS</p></div></div>}
        </div>
        <div className="af-bottom"><div><small>ARCHIVED MATERIAL</small><strong>{filed.length} FILED SHEETS</strong></div><div><small>RESCUE PROGRESS</small><strong>{Math.min(collectedCount,6)}/6 COLLECTED</strong></div><button onClick={()=>setIntake(value=>!value)}>{intake?'CLOSE UNFILED TRAY':'OPEN UNFILED EVIDENCE'} ({unfiled.length})</button></div>
        {intake&&<section className="af-intake"><div className="af-intake-head"><strong>{debug?'DEBUG RECORD INTAKE':'UNFILED EVIDENCE / SELECT & FILE'}</strong><button onClick={()=>setIntake(false)} aria-label="Close intake">×</button></div>
          <p>Evidence must be discovered and manually collected in station rooms before it can be filed. Select a collected record, then choose its mission folder.</p>
          <div className="af-intake-items">
            {debug&&unseen.map(record=><button key={record.id} onClick={()=>setInspectedId(record.id)}><small>{record.id} / {record.room}</small><strong>{record.title}</strong><span>DEBUG COLLECT</span></button>)}
            {unfiled.map(record=><button key={record.id} onClick={()=>setInspectedId(record.id)}><small>{record.id} / COLLECTED</small><strong>{record.title}</strong><span>FILE INTO A MISSION</span></button>)}
            {filed.map(record=><button key={'filed-'+record.id} onClick={()=>setInspectedId(record.id)}><small>{record.id} / FILED IN {caseId}</small><strong>{record.title}</strong><span>INSPECT / MOVE SHEET</span></button>)}
          </div>
        </section>}
      </section>
      <aside className="af-status" aria-label="Case investigation status">
        <h2>CASE STATUS <small>{caseId} / INVESTIGATION</small></h2>
        <div className="af-status-section"><span>EVIDENCE COLLECTED · ANY SIX OF EIGHT</span><div className="af-count"><strong>{Math.min(collectedCount,6)}</strong><em>/ 06 TO UNLOCK</em></div><div className="af-meter" role="progressbar" aria-label="Distinct mission evidence collected toward Rescue" aria-valuemin={0} aria-valuemax={6} aria-valuenow={Math.min(collectedCount,6)}><i style={{width:(Math.min(collectedCount,6)/6*100)+'%'}}/></div><small>{collectedCount} of 8 collected · Folders are for optional organization</small></div>
        {!ready&&<div className="af-status-section af-missing-required" aria-label="Mission evidence not yet collected">
          <span>FIND MORE EVIDENCE TO UNLOCK</span>
          <p>Collect <strong>{6-collectedCount}</strong> more evidence sheet{6-collectedCount===1?'':'s'} from this mission. <strong>Any 6 of the 8</strong> unlock Rescue immediately; filing and refiling do not affect progress.</p>
          <div className="af-missing-list">
            {uncollected.map(record=>{
              const location=record.room.toLowerCase() as StationId
              return <div className="af-missing-item" key={record.id}>
                <strong>{record.id} · {record.title}</strong>
                <small>NOT YET COLLECTED · {record.room.toUpperCase()} ROOM · {record.required?'CORE':'BONUS'} RECORD</small>
                <button type="button" onClick={()=>navigateGame(stationRoute(location))}>
                  GO TO {record.room.toUpperCase()} ROOM →
                </button>
              </div>
            })}
          </div>
          <small>Collect any six of the eight case records. No questions, answers or correct folder placements are needed.</small>
        </div>}
        <div className="af-status-section"><span>MISSION BRIEFING FILM</span>{caseId==='KES'&&KESTREL_FOOTAGE_PENDING_APPROVAL
          ? <small>PROJECT BRIEF / Early-phase design trade: the original payload, power and cost no longer fit the mission plan. Investigate the actual source records; no launch or assembly footage is represented as historical proof.</small>
          : <button className="af-side-action" type="button" data-sfx="none" onClick={()=>playCaseIntroduction(caseId)}>PLAY {meta.name.toUpperCase()} INTRO</button>}</div>
        <div className="af-status-section"><span>YOUR MISSION</span><strong>{storyComplete?'RESCUED IN THE STORY':'COLLECT ANY SIX OF EIGHT'}</strong><p>Explore the station and collect six distinct documents from this case. Filing them into Mission Folders is optional and can be corrected later.</p></div>
        <div className="af-status-section"><span>RESCUE MISSION</span><strong className={ready?'af-ready':''}>{ready?'UNLOCKED':'LOCKED'}</strong><p>{ready?'Six case records collected! Travel into the past and rescue the mission.':'Collect any six of this mission’s eight records to unlock. Filing is optional.'}</p>{caseId==='NAD'&&ready&&<button className="af-side-action" onClick={()=>enterRescueThroughPortal('NAD')}>ENTER NADIR RESCUE →</button>}{isOtherCaseId(caseId)&&ready&&<button className="af-side-action" onClick={()=>enterRescueThroughPortal(caseId)}>ENTER {meta.name.toUpperCase()} RESCUE →</button>}</div>
        <div className="af-status-source">FICTIONAL CASE RECORDS. NOT AUTHENTIC NASA TELEMETRY.</div>
        {debug&&<button className="af-reset" onClick={reset}>RESET DEBUG PREVIEW</button>}
      </aside>
    </div>
    {inspected&&<DocumentViewer key={inspected.id} record={inspected} archive={archive} onDiscover={id=>setArchive(current=>discoverEvidence(current,id))} onFile={file} onClose={()=>setInspectedId(null)}/>}
  </main>
}
