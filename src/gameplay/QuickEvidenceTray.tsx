import { useEffect, useState } from 'react'
import { EVIDENCE_RECORDS, type ArchiveEvidence } from '../archive/evidenceRecords'
import { navigateGame } from '../gameNavigation'
import { useLiveArchive } from './evidenceStore'
import type { NadirStation } from './nadirLogic'
import './quickEvidenceTray.css'

export function stationRoute(station: NadirStation): string {
  return station === 'investigation' ? '/?room=1' : '/?station=' + station
}
export function folderRoute(station: NadirStation): string {
  return '/?folder-lab=1&case=NAD&return=' + station
}

/** Accessible compact tray: inspect anywhere, file in the physical folders. */
export default function QuickEvidenceTray({ station }: { station: NadirStation }) {
  const archive = useLiveArchive()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'unfiled' | 'all'>('unfiled')
  const [inspected, setInspected] = useState<ArchiveEvidence | null>(null)

  const collected = EVIDENCE_RECORDS.filter(item => archive.discovered.includes(item.id))
  const unfiled = collected.filter(item => !archive.filed[item.id])
  const showing = tab === 'unfiled' ? unfiled : collected

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); setInspected(null) } }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [open])

  return <div className="qe-root">
    <button type="button" className="qe-toggle" aria-label={'Evidence tray, '+unfiled.length+' unfiled'} aria-expanded={open}
      onClick={() => { setOpen(v => !v); setInspected(null) }} title="Open collected evidence">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 7h16v13H4zM2 7l4-4h12l4 4M9 12h6v2H9"/></svg>
      <span className="qe-count">{unfiled.length}</span>
    </button>
    {open && <div className="qe-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
      <aside className="qe-panel" role="dialog" aria-modal="true" aria-label="Collected evidence tray">
        <header><div><small>FIELD EQUIPMENT / INVENTORY</small><strong>QUICK EVIDENCE TRAY</strong></div><button type="button" onClick={() => {setOpen(false);setInspected(null)}} aria-label="Close evidence tray">×</button></header>
        {inspected ? <div className="qe-inspection">
          <button type="button" onClick={()=>setInspected(null)}>← BACK TO EVIDENCE</button>
          <small>{inspected.id} / {inspected.room} / FICTIONAL SIMULATION</small>
          <h3>{inspected.title}</h3>
          <div>{inspected.content.split(';').map((text,index)=><p key={index}>{text.trim()}</p>)}</div>
          <p className="qe-inspection-status">{archive.filed[inspected.id] ? 'FILED IN '+archive.filed[inspected.id] : 'UNFILED — MOVE INTO A PHYSICAL MISSION FOLDER'}</p>
        </div> : <>
          <div className="qe-tabs" role="group" aria-label="Evidence view">
            <button type="button" aria-pressed={tab==='unfiled'} onClick={()=>setTab('unfiled')}>UNFILED / {unfiled.length}</button>
            <button type="button" aria-pressed={tab==='all'} onClick={()=>setTab('all')}>ALL COLLECTED / {collected.length}</button>
          </div>
          <div className="qe-entries">
            {showing.length===0 && <p className="qe-empty">{tab==='unfiled' ? 'No unfiled evidence. Inspect stations and collect records manually.' : 'Your inventory is empty. Find evidence in the station.'}</p>}
            {showing.map(item=><button type="button" key={item.id} onClick={()=>setInspected(item)} className="qe-record">
              <span>{item.id} / {item.room.toUpperCase()}</span><strong>{item.title}</strong><small>{archive.filed[item.id] ? 'FILED: '+archive.filed[item.id] : 'UNFILED'} · VIEW RECORD</small>
            </button>)}
          </div>
        </>}
        <footer>
          <button type="button" className="qe-open-folders" onClick={()=>navigateGame(folderRoute(station))}>
            OPEN MISSION FOLDERS <span aria-hidden="true">→</span>
          </button>
          <small>FILING ONLY HAPPENS IN THE PHYSICAL DOSSIERS. WRONG FILING IS NEVER PENALIZED.</small>
        </footer>
      </aside>
    </div>}
  </div>
}
