import { diagnosisIsSupported, rescueIsReady } from '../archive/archiveState'
import { findEvidence, type ArchiveCaseId } from '../archive/evidenceRecords'
import { navigateGame } from '../gameNavigation'
import { readArchive, readNadir } from '../gameplay/gameSave'
import { readOtherProgress } from '../gameplay/caseSave'
import { otherRescueCompleted } from '../gameplay/caseRescueEngine'
import { caseIntroCinematic, evidenceContextCinematic, verifiedCaseOutcomeCinematic } from '../media/caseCinematicCatalog'
import { requestCinematicFlow } from '../media/cinematicFlow'

/** Main's release-content hold, separate from Chat B's hard scientific AST ban.
 * Kestrel's delivered Phase-A clips depict completed/assembly-stage hardware;
 * do not imply an authentic early design mission scene before art/story sign-off.
 */
export const KESTREL_FOOTAGE_PENDING_APPROVAL = true

/** Read again at click AND post-cinematic completion to prevent save/refile bypasses. */
export function enterRescueThroughPortal(caseId: ArchiveCaseId): boolean {
 return requestCinematicFlow('portalPast', {
  canStart: () => rescueIsReady(readArchive(), caseId),
  onAdvance: () => {
   if(rescueIsReady(readArchive(), caseId))navigateGame('/?rescue='+caseId)
  },
 })
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
 const archive=readArchive()
 if(caseId==='NAD'){
  const nadir=readNadir()
  return rescueIsReady(archive,'NAD')&&diagnosisIsSupported(archive,'NAD')&&
   nadir.rescue.submitted&&nadir.rescue.rerunPassed
 }
 return otherRescueCompleted(archive,readOtherProgress(),caseId)
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
