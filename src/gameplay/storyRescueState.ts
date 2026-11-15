import type {ArchiveCaseId} from '../archive/evidenceRecords'
import {rescueIsReady} from '../archive/archiveState'
import {readArchive} from './gameSave'

/** Independent story completion save. Never forges the retired engineering tests,
 * NASA telemetry, a technical sign-off, or any evidence/folder progress.
 */
const KEY='astral-story-rescue-v1'
type StorySave={version:1;completed:ArchiveCaseId[]}
const CASES:readonly ArchiveCaseId[]=['KES','NAD','LUM','ORI','AST']
function read():StorySave{
 try{
  const raw=JSON.parse(window.localStorage.getItem(KEY)??'null') as Partial<StorySave>|null
  if(raw?.version===1&&Array.isArray(raw.completed)){
   return {version:1,completed:[...new Set(raw.completed.filter((c):c is ArchiveCaseId=>CASES.includes(c as ArchiveCaseId)))]}
  }
 }catch{/* Private storage / malformed previous save. */}
 return {version:1,completed:[]}
}
export function isStoryRescueComplete(id:ArchiveCaseId):boolean{
 return read().completed.includes(id)&&rescueIsReady(readArchive(),id)
}
export function completeStoryRescue(id:ArchiveCaseId):boolean{
 // Check any six distinct collected records of this case at the exact final action.
 if(!rescueIsReady(readArchive(),id))return false
 const save=read()
 if(!save.completed.includes(id)){
  try{window.localStorage.setItem(KEY,JSON.stringify({version:1,completed:[...save.completed,id]}))}catch{/* Visible completion survives current session. */}
  window.dispatchEvent(new Event('astral:story-rescue-change'))
 }
 return true
}
