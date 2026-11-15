import {CINEMATICS,type CinematicId} from './cinematicManifest.ts'
import type {ArchiveCaseId} from '../archive/evidenceRecords.ts'

/**
 * Read-only case -> delivered media map for Main's case/room wiring.
 * These identifiers cannot collect evidence, file evidence, make a diagnosis,
 * verify a rescue, or authorize a transition. Main must re-check game state.
 */
export type CaseCinematicCatalogEntry={
  intro:CinematicId
  outcome:CinematicId
  evidence:Readonly<Record<string,CinematicId>>
}
export const CASE_CINEMATIC_CATALOG={
 KES:{intro:'case1Intro',outcome:'case1Outcome',evidence:{'KES-02':'case1Evidence'}},
 NAD:{intro:'case2Intro',outcome:'case2Outcome',evidence:{'NAD-02':'case2UnitsMismatchEvidence','NAD-05':'case2EmailEvidence'}},
 LUM:{intro:'case3Intro',outcome:'case3Outcome',evidence:{'LUM-05':'case3ApprovalEvidence'}},
 ORI:{intro:'case4Intro',outcome:'case4Outcome',evidence:{'ORI-05':'case4TestingEvidence'}},
 AST:{intro:'case5Intro',outcome:'case5Outcome',evidence:{}},
} as const satisfies Record<ArchiveCaseId,CaseCinematicCatalogEntry>

export function caseIntroCinematic(caseId:ArchiveCaseId):CinematicId{
 return CASE_CINEMATIC_CATALOG[caseId].intro
}
/** Active scientific story hold: the delivered AST outcome says 472 W as
 * verified, but AST rescue requires an independent 450 W retest (target <=460 W).
 * Keep the original in the designer review lab, never emit in live story.
 */
export const CASE_OUTCOME_REVIEW_HOLDS={
 AST:'Designer outcome displays 472 W verified; rescue engine requires 450 W (target <=460 W). Correct scene before release.',
} as const

export function verifiedCaseOutcomeCinematic(caseId:ArchiveCaseId):CinematicId|null{
 // This only selects a clip. Caller MUST independently prove verified rescue.
 // An unapproved clip must NEVER play as the canonical verified outcome.
 if(Object.prototype.hasOwnProperty.call(CASE_OUTCOME_REVIEW_HOLDS,caseId))return null
 return CASE_CINEMATIC_CATALOG[caseId].outcome
}
export function evidenceContextCinematic(evidenceId:string):CinematicId|null{
 const caseId=evidenceId.slice(0,3) as ArchiveCaseId
 const group=CASE_CINEMATIC_CATALOG[caseId] as CaseCinematicCatalogEntry|undefined
 return group?.evidence[evidenceId] ?? null
}
export function caseCinematicMediaInfo(id:CinematicId){return CINEMATICS[id]}
