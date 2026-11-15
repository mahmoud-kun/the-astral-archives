/**
 * Designer video manifest. Every registered MP4 is source-SHA-verified by
 * cinematicManifest.test.mjs; game playback still requires Main scene wiring.
 * Always serve versioned local paths, never Google Drive URLs.
 */
export const CINEMATIC_REQUEST_EVENT = 'astral:cinematic-request'
export const CINEMATIC_FINISHED_EVENT = 'astral:cinematic-finished'
export const CINEMATICS = {
 opening: {
  title:'The Astral Archives — Opening',path:'/assets/video/designer-game-opening-v1.mp4',
  source:'game opening.mp4',driveId:'1v78asR91IGBbnAWqenY4v2aZfTTN_u0m',
  duration:10.005,bytes:12567554,mixGain:.9,
 },
 case1Intro: {
  title:'Case 01 — Kestrel / Mission Introduction',caseId:'KES',path:'/assets/video/designer-case-1-intro-v1.mp4',
  source:'case 1 intro .mp4',driveId:'1UO5sYEbzf2UFFupybPieoa_2I4gjii2z',
  duration:7.125,bytes:6436608,mixGain:.7,
 },
 portalPast: {
  title:'Portal — Journey to the Past',path:'/assets/video/designer-time-travel-past-v1.mp4',
  source:'time travel to the past .mp4',driveId:'1tugUeTk3RcMtVrWfEAta6C6iOt35R0Xh',
  duration:8,bytes:10181404,mixGain:.3,
 },
 case1Outcome: {
  title:'Case 01 — Kestrel / Rescue Outcome',caseId:'KES',path:'/assets/video/designer-case-1-outcome-v1.mp4',
  source:'case 1 outcome.mp4',driveId:'1vjDCZCYOquFkJhRb63ND_Lddied3OyTp',
  duration:5.97,bytes:4375281,mixGain:.8,
 },

 case1Evidence: {
  title:'Case 01 — Kestrel / Launch Schedule Context',caseId:'KES',mediaRole:'evidence-context',recordContext:'KES-02',
  path:'/assets/video/designer-case-1-evidence-v1.mp4',
  source:'case 1 evidence.mp4',driveId:'1aeFKVcvfglWRYOQf3u_DgaxJOtYUyfU6',
  duration:10,bytes:6481903,mixGain:.7,
 },
 case2Intro: {
  title:'Case 02 — Nadir / Mission Introduction',caseId:'NAD',mediaRole:'cinematic',
  path:'/assets/video/designer-case-2-intro-v1.mp4',
  source:'case 2 intro.mp4',driveId:'14GhVxCpyjSiclmxe6GAo-rK2sieSUNTz',
  duration:7,bytes:4228560,mixGain:.35,
 },
 case2EmailEvidence: {
  title:'Case 02 — Nadir / Open Anomaly Email',caseId:'NAD',mediaRole:'evidence-context',recordContext:'NAD-05',
  path:'/assets/video/designer-case-2-email-evidence-v1.mp4',
  source:'case 2 email evidence .mp4',driveId:'15oDkj50S1dYHeZ1M92wDvo8LAHfhADWE',
  duration:7,bytes:4092994,mixGain:.7,
 },
 case2UnitsMismatchEvidence: {
  title:'Case 02 — Nadir / Units Mismatch Context',caseId:'NAD',mediaRole:'evidence-context',recordContext:'NAD-02',
  path:'/assets/video/designer-case-2-units-mismatch-evidence-v1.mp4',
  source:'case 2 units mismatch evidence.mp4',driveId:'1XVpZaqmhtGtO5R-ZXBUAurl5BAtFwjmP',
  duration:10,bytes:5971124,mixGain:.5,
 },
 case2Outcome: {
  title:'Case 02 — Nadir / Verified Rescue Outcome',caseId:'NAD',mediaRole:'cinematic',
  path:'/assets/video/designer-case-2-outcome-v1.mp4',
  source:'case 2 outcome.mp4',driveId:'1BVg5wPA2_2fIjrpgoGi7YGRgRskqT5nA',
  duration:5.25,bytes:4886242,mixGain:.7,
 },
 case3Intro: {
  title:'Case 03 — Lumen / Mission Introduction',caseId:'LUM',mediaRole:'cinematic',
  path:'/assets/video/designer-case-3-intro-v1.mp4',
  source:'case 3 intro.mp4',driveId:'1u-ZP3m3W5YUW2nm9J_fHxK4DIJNRleCm',
  duration:7,bytes:3323996,mixGain:.8,
 },
 case3ApprovalEvidence: {
  title:'Case 03 — Lumen / Optical Test Context',caseId:'LUM',mediaRole:'evidence-context',recordContext:'LUM-05',
  path:'/assets/video/designer-case-3-approval-evidence-v1.mp4',
  source:'case 3 approval evidence.mp4',driveId:'1VdFCysk4vb09q4tdRmFcGla0mQNB1D1_',
  duration:6.25,bytes:5720883,mixGain:.8,
 },
 case3Outcome: {
  title:'Case 03 — Lumen / Verified Rescue Outcome',caseId:'LUM',mediaRole:'cinematic',
  path:'/assets/video/designer-case-3-outcome-v1.mp4',
  source:'case 3 outcome.mp4',driveId:'1e2P5Sy-VbuVVciKvIR06IEw8qIhBnWaT',
  duration:7,bytes:5161082,mixGain:.9,
 },
 case4Intro: {
  title:'Case 04 — Oriole / Mission Introduction',caseId:'ORI',mediaRole:'cinematic',
  path:'/assets/video/designer-case-4-intro-v1.mp4',
  source:'case 4 intro.mp4',driveId:'1m26-oAVSeoUcjjHdQl5yGs8eiIRByaJF',
  duration:5.97,bytes:2690338,mixGain:.35,
 },
 case4TestingEvidence: {
  title:'Case 04 — Oriole / Omitted Landing Test Context',caseId:'ORI',mediaRole:'evidence-context',recordContext:'ORI-05',
  path:'/assets/video/designer-case-4-testing-evidence-v1.mp4',
  source:'case 4 testing evidence.mp4',driveId:'1vRnALp59GC4dmjy6M_J8E-UOiMU_KaCZ',
  duration:6.083333,bytes:5860199,mixGain:.8,
 },
 case4Outcome: {
  title:'Case 04 — Oriole / Verified Rescue Outcome',caseId:'ORI',mediaRole:'cinematic',
  path:'/assets/video/designer-case-4-outcome-v1.mp4',
  source:'case 4 outcome.mp4',driveId:'1EwYPPQ3krHm9qAV26jwt57-8xBoy0OXX',
  duration:5.97,bytes:3792082,mixGain:.3,
 },
 case5Intro: {
  title:'Case 05 — Asterion / Mission Introduction',caseId:'AST',mediaRole:'cinematic',
  path:'/assets/video/designer-case-5-intro-v1.mp4',
  source:'case 5 intro .mp4',driveId:'1MbdBmI2Xd2nZBNDiUh0u6dO07EYTwt5r',
  duration:7.93,bytes:5027110,mixGain:.8,
 },
 case5Outcome: {
  title:'Case 05 — Asterion / Verified Rescue Outcome',caseId:'AST',mediaRole:'cinematic',
  path:'/assets/video/designer-case-5-outcome-v1.mp4',
  source:'case 5 outcome.mp4',driveId:'1nRPdau6afLiszCLV43HqYN3GSj0-MF09',
  duration:7.93,bytes:5404764,mixGain:.8,
 },
} as const
export type CinematicId=keyof typeof CINEMATICS
export const CINEMATIC_LIVE_HOLDS={
 case5Outcome:'Designer film shows 472 W verified, but the current Asterion rescue requires 450 W replay and target <=460 W. Preview only pending correction.',
} as const
export function isLiveCinematicAllowed(id:CinematicId):boolean{
 return !Object.prototype.hasOwnProperty.call(CINEMATIC_LIVE_HOLDS,id)
}

export type CinematicOutcome='completed'|'skipped'|'returned'|'unavailable'
export type CinematicFinished={id:CinematicId;outcome:CinematicOutcome}
export function isCinematicId(id:unknown):id is CinematicId{
 return typeof id==='string'&&Object.prototype.hasOwnProperty.call(CINEMATICS,id)
}
/** Playback gain is perceptually balanced at the 40% default instead of
 * attenuating quiet source dialogue twice. Preserve quieter portal/outcomes
 * and the user's explicit zero/mute. Exact source MP4 files remain unmodified.
 */
export function cinematicVolume(id:CinematicId,masterVolume:number):number{
 const master=Number.isFinite(masterVolume)?Math.max(0,Math.min(100,masterVolume)):0
 const sourceMix=CINEMATICS[id].mixGain
 return Number(Math.min(.94,master/40*(.27+.55*sourceMix)).toFixed(4))
}
/** Request only; evidence/route/rescue state remain controlled by Main. */
export function requestCinematic(id:CinematicId):void{
 // Silent deny for unapproved outcomes, even if a caller bypasses the catalog.
 if(!isLiveCinematicAllowed(id))return
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent(CINEMATIC_REQUEST_EVENT,{detail:{id}}))
}
export function dispatchCinematicFinished(result:CinematicFinished):void{
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent(CINEMATIC_FINISHED_EVENT,{detail:result}))
}
