import { findEvidence } from '../archive/evidenceRecords'
import EvidenceVoicePlayer from '../audio/EvidenceVoicePlayer'
import { isEvidenceVoiceId } from '../audio/evidenceVoiceManifest'
import { evidenceContextCinematic } from '../media/caseCinematicCatalog'
import { playEvidenceContext } from './gameMediaActions'
import './evidenceMediaPanel.css'

/** Mount inside the ONE real evidence inspector. Media cannot collect or verify
 * evidence; all analysis, manual collection and folder permissions remain intact.
 */
export default function EvidenceMediaPanel({evidenceId}:{evidenceId:string}) {
 const record=findEvidence(evidenceId)
 if(!record)return null
 const voice=record.room==='Recordings'&&isEvidenceVoiceId(record.id)?record.id:null
 const video=evidenceContextCinematic(record.id)
 if(!voice&&!video)return null

 return <section className="im-evidence-media" aria-label={'Optional source media for '+record.id}>
  <div className="im-media-heading">
   <strong>RECOVERED MEDIA · {record.id}</strong>
   <small>Optional context · fictional source · not a verified science result</small>
  </div>
  {voice&&<EvidenceVoicePlayer key={voice} id={voice}/>}
  {video&&<div className="im-media-video">
   <p>Inspect the accompanying designer reconstruction; use the original record and interactive analyzer to draw conclusions.</p>
   <button type="button" data-sfx="none" onClick={()=>playEvidenceContext(record.id)}>
    PLAY EVIDENCE CONTEXT VIDEO
   </button>
  </div>}
  <small>Watching or listening never files, solves, collects, or unlocks any evidence.</small>
 </section>
}
