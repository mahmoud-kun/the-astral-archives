import {useEffect,useState} from 'react'
import type {ArchiveCaseId} from '../archive/evidenceRecords'
import {CASE_STORY_ARCS,focusStoryConnections,getRevealedConnections} from './caseStoryThreads'
import './evidenceStoryThread.css'

/** Story relations are *revealed* by collecting related evidence, never
 * represented as an answer key or an additional collection requirement.
 */
export default function EvidenceStoryThread({caseId,discovered,focusId,compact=false}:{
 caseId:ArchiveCaseId;discovered:readonly string[];focusId?:string;compact?:boolean
}){
 const [expanded,setExpanded]=useState(false)
 const [current,setCurrent]=useState(0)
 const arc=CASE_STORY_ARCS[caseId]
 const revealed=getRevealedConnections(caseId,discovered)
 const focused=focusId?focusStoryConnections(caseId,focusId,discovered):[]
 const caseFound=discovered.filter(id=>id.startsWith(caseId+'-')).length
 const visible=compact&&!expanded?revealed.slice(-2):revealed
 const active=visible[Math.min(current,Math.max(visible.length-1,0))]
 useEffect(()=>{setCurrent(0);setExpanded(false)},[caseId])
 if(caseFound===0&&!focusId)return null
 return <section className={'est-root'+(compact?' est-compact':'')+(focused.length?' est-connected':'')}
  aria-label={'Investigative story connections for '+caseId}>
  <div className="est-heading">
   <div><small>INVESTIGATION THREAD · CASE {caseId}</small><strong>{arc.title}</strong></div>
   <span className="est-count">{revealed.length}/4 LINKS</span>
  </div>
  {!compact&&<p className="est-opening">{arc.opening}</p>}
  {focused.length>0&&<div className="est-discovery" role="status">
    <span className="est-signal" aria-hidden="true"/>
    <div><strong>NEW CONNECTION ESTABLISHED</strong><p>{focused[0].tension}</p></div>
   </div>}
  {!revealed.length?
    <p className="est-pending">{caseFound} record{caseFound===1?'':'s'} recovered. Each sheet carries part of the story. When two related records are recovered, their connection appears here — no specific evidence order is required.</p>:
    <div className="est-links">
      {visible.map((link,index)=><article key={link.ids.join('|')} className={'est-link '+(index===Math.min(current,visible.length-1)?'est-current':'')}>
       <div className="est-link-heading"><span className="est-node" aria-hidden="true"/><div><small>LINKED RECORDS · {link.ids.join(' + ')}</small><strong>{link.label}</strong></div></div>
       <p>{link.reveal}</p><em>{link.tension}</em>
      </article>)}
    </div>}
  <footer className="est-footer">
   <span>Links appear only from documents you have already collected.</span>
   {compact&&revealed.length>2&&<button type="button" onClick={()=>setExpanded(v=>!v)}>{expanded?'SHOW LATEST LINKS':'SHOW ALL CONNECTIONS'} →</button>}
  </footer>
 </section>
}
