import { rescueIsReady } from '../archive/archiveState'
import { findEvidence, type ArchiveCaseId } from '../archive/evidenceRecords'
import { navigateGame } from '../gameNavigation'
import { readArchive } from '../gameplay/gameSave'
import { isStoryRescueComplete } from '../gameplay/storyRescueState'
import { caseIntroCinematic, evidenceContextCinematic, verifiedCaseOutcomeCinematic } from '../media/caseCinematicCatalog'
import { requestCinematicFlow } from '../media/cinematicFlow'

/** Main's release-content hold, separate from Chat B's hard scientific AST ban.
 * Kestrel's delivered Phase-A clips depict completed/assembly-stage hardware;
 * do not imply an authentic early design mission scene before art/story sign-off.
 */
export const KESTREL_FOOTAGE_PENDING_APPROVAL = true

/** Read again at click AND post-cinematic completion to prevent save/refile bypasses. */
export function enterRescueThroughPortal(caseId: ArchiveCaseId): boolean {
 if(!rescueIsReady(readArchive(),caseId))return false
 const destination='/?past=manufacturing&case='+encodeURIComponent(caseId)
 const started=requestCinematicFlow('portalPast',{
  canStart:()=>rescueIsReady(readArchive(),caseId),
  onAdvance:()=>{
   // Skip, completion and source-unavailable all reach the same verified Past route.
   if(rescueIsReady(readArchive(),caseId))navigateGame(destination)
  },
 })
 if(started)return true
 // An unavailable movie/controller must never permanently block the story.
 // An active video should be finished or skipped by the player instead.
 if(typeof document!=='undefined'&&!document.querySelector('.cm-backdrop')){
  navigateGame(destination)
  return true
 }
 return false
}

/** An intro is a voluntary visual briefing; it never opens gates or records evidence. */
export function playCaseIntroduction(caseId: ArchiveCaseId): boolean {
 if(caseId==='KES'&&KESTREL_FOOTAGE_PENDING_APPROVAL)return false
 return requestCinematicFlow(caseIntroCinematic(caseId),{
  canStart:()=>true,
  onAdvance:()=>{},
 })
}

/** Record-context film: references an already opened physical evidence inspector. */
export function playEvidenceContext(evidenceId:string):boolean {
 const record=findEvidence(evidenceId)
 const id=record?.id
 const film=id?evidenceContextCinematic(id):null
 if(!film||!id)return false
 return requestCinematicFlow(film,{
  canStart:()=>!!findEvidence(id),
  onAdvance:()=>{},
 })
}

/** Only the real engineering state may authorize a verified alternate outcome. */
export function verifiedRescueState(caseId:ArchiveCaseId):boolean {
 // Only the real six-evidence gate and four repaired Past systems authorize
 // a fictional outcome; legacy quiz/test saves never bypass the new path.
 return isStoryRescueComplete(caseId)
}

/** The UI may display a verified-outcome film action only when its content is releasable. */
export function isVerifiedOutcomeFilmAvailable(caseId:ArchiveCaseId):boolean {
 return !(caseId==='KES'&&KESTREL_FOOTAGE_PENDING_APPROVAL)&&
  verifiedCaseOutcomeCinematic(caseId)!==null
}

/** No Asterion false-success 472 W film; no premature Kestrel Phase-A footage. */
export function playVerifiedRescueOutcome(caseId:ArchiveCaseId):boolean {
 if(caseId==='KES'&&KESTREL_FOOTAGE_PENDING_APPROVAL)return false
 const film=verifiedCaseOutcomeCinematic(caseId)
 if(!film)return false
 return requestCinematicFlow(film,{
  canStart:()=>verifiedRescueState(caseId),
  onAdvance:()=>{}, // Remain on the verified rescue report after Skip/Continue.
 })
}
