/**
 * Actual designer deliveries, not proof that binary media have been deployed.
 * Paths become playable after Main verifies and installs the original MP4s.
 * Never stream private Google Drive URLs directly from the game.
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
} as const
export type CinematicId=keyof typeof CINEMATICS
export type CinematicOutcome='completed'|'skipped'|'returned'|'unavailable'
export type CinematicFinished={id:CinematicId;outcome:CinematicOutcome}
export function isCinematicId(id:unknown):id is CinematicId{
 return typeof id==='string'&&Object.prototype.hasOwnProperty.call(CINEMATICS,id)
}
/** Clamped video gain; portal has a deliberately lower mix, no file transcoding. */
export function cinematicVolume(id:CinematicId,masterVolume:number):number{
 const master=Number.isFinite(masterVolume)?Math.max(0,Math.min(100,masterVolume)):0
 return Number((master/100*CINEMATICS[id].mixGain).toFixed(4))
}
/** Request only; evidence/route/rescue state remain controlled by Main. */
export function requestCinematic(id:CinematicId):void{
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent(CINEMATIC_REQUEST_EVENT,{detail:{id}}))
}
export function dispatchCinematicFinished(result:CinematicFinished):void{
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent(CINEMATIC_FINISHED_EVENT,{detail:result}))
}
