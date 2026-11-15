import type {ArchiveCaseId} from '../archive/evidenceRecords'
import type {PastRoomId} from './pastTimeline'
import {INTERVENTIONS,type InterventionChoices} from './pastInterventions'

/** New, independent intervention save; never edits existing evidence or folder data.
 * Only valid authored options can be restored or persisted. Old saves remain intact.
 */
const KEY='astral-past-interventions-v1'
type Persisted={version:1;byCase:Partial<Record<ArchiveCaseId,InterventionChoices>>}
const CASES:readonly ArchiveCaseId[]=['KES','NAD','LUM','ORI','AST']
const ROOMS:readonly PastRoomId[]=['manufacturing','mission_target','data_analysis','resources_review']
function parseStore():Persisted{
 const empty:Persisted={version:1,byCase:{}}
 try{
  const raw=JSON.parse(localStorage.getItem(KEY)??'null') as Partial<Persisted>|null
  if(raw?.version!==1||!raw.byCase||typeof raw.byCase!=='object')return empty
  for(const caseId of CASES){
   const input=raw.byCase[caseId]
   if(!input||typeof input!=='object')continue
   const safe:InterventionChoices={}
   for(const room of ROOMS){
    const choice=input[room]
    if(typeof choice==='string'&&INTERVENTIONS[caseId][room].options.some(o=>o.id===choice))safe[room]=choice
   }
   empty.byCase[caseId]=safe
  }
 }catch{/* localStorage denied or corrupted: use clean, session-only state */}
 return empty
}
export function readPastChoices(caseId:ArchiveCaseId):InterventionChoices{
 return {...(parseStore().byCase[caseId]??{})}
}
export function savePastChoice(caseId:ArchiveCaseId,room:PastRoomId,optionId:string):InterventionChoices{
 if(!INTERVENTIONS[caseId][room].options.some(o=>o.id===optionId))return readPastChoices(caseId)
 const next=parseStore()
 next.byCase[caseId]={...(next.byCase[caseId]??{}),[room]:optionId}
 try{localStorage.setItem(KEY,JSON.stringify(next))}catch{/* keep app usable if storage is unavailable */}
 window.dispatchEvent(new Event('astral:past-intervention-changed'))
 return {...next.byCase[caseId]}
}
