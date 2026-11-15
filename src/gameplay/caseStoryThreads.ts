import type {ArchiveCaseId} from '../archive/evidenceRecords'

/** Narrative connective tissue for the existing records. Every relationship
 * is supported by source content and is revealed only after both documents
 * are collected. Never implies a real NASA cover-up or human guilt.
 */
export type StoryLink={
 ids:readonly [string,string]
 label:string
 reveal:string
 tension:string
}
export type StoryArc={title:string;opening:string;stakes:string;links:readonly StoryLink[]}
export const CASE_STORY_ARCS:Record<ArchiveCaseId,StoryArc>={
 KES:{
  title:'A brilliant concept. A launch that never fit.',
  opening:'The scientists wanted to study rare meteoroid events. A promising proposal moved forward — while the spacecraft and launch plan were telling a different story.',
  stakes:'Can the mission keep its essential science without pretending the original plan was feasible?',
  links:[
   {ids:['KES-01','KES-08'],label:'A promising proposal',reveal:'Science merit was strong. Feasibility, however, was only conditional. Winning approval did not mean the spacecraft could already launch.',tension:'Scientific ambition and engineering readiness were never the same thing.'},
   {ids:['KES-03','KES-04'],label:'Three limits, one spacecraft',reveal:'The mass exceeded its ceiling, and power and projected cost also crossed their limits. Fixing one constraint could still leave the mission infeasible.',tension:'The numbers reveal a deeper architecture problem.'},
   {ids:['KES-02','KES-05'],label:'The warning before the signature',reveal:'The preferred slot was unavailable. An analyst raised the alternate-window and cruise problem before the review package was signed.',tension:'The concern was known before approval.'},
   {ids:['KES-06','KES-07'],label:'The reassuring stamp',reveal:'The later summary claimed no mission impact, yet its supporting alternate-window study was absent. A memory recalls pressure to use the old schedule, but cannot identify who spoke.',tension:'A stamped conclusion is not a substitute for evidence.'},
  ],
 },
 NAD:{
  title:'One number. Two meanings. A drifting spacecraft.',
  opening:'Two navigation models predicted different paths. Deep in the interface records, a number quietly changed meaning between two teams.',
  stakes:'What can reconcile the trajectory before an unsupported sign-off sends the error forward?',
  links:[
   {ids:['NAD-01','NAD-02'],label:'The split trajectories',reveal:'The same written 12 represented lbf·s at the source and N·s at the receiver. These are physically different impulses, so the paths could not agree.',tension:'The problem is not the number; it is the unit attached to it.'},
   {ids:['NAD-03','NAD-04'],label:'The blank contract',reveal:'The interface document named neither a canonical unit nor a conversion owner. The producer and consumer compiled different expectations.',tension:'Nobody changed the export number; the boundary remained ambiguous.'},
   {ids:['NAD-05','NAD-06'],label:'An objection closed without a rerun',reveal:'A navigation engineer asked for a unit check and a rerun. The later closure had no attached simulation despite its verified stamp.',tension:'The inquiry was closed before the calculation was reproduced.'},
   {ids:['NAD-07','NAD-08'],label:'The explanation that needed proof',reveal:'The reviewer memory says the mismatch could be explained later. The unit reference explains how — but recollection alone cannot validate the trajectory.',tension:'Only a versioned interface and independent rerun can restore trust.'},
  ],
 },
 LUM:{
  title:'The perfect report. The imperfect mirror test.',
  opening:'Lumen’s optics were marked nominal, but an independent lab record suggested the setup was physically different from the approved drawing.',
  stakes:'Can the team restore the measurement chain before trusting the image it produces?',
  links:[
   {ids:['LUM-01','LUM-02'],label:'A measurement that should match',reveal:'The reference calls for 100.0 mm. The raw fixture read 100.8 mm. Even a small dimensional mismatch matters when optics are calibrated.',tension:'The raw measurement and the drawing disagree.'},
   {ids:['LUM-03','LUM-04'],label:'The clean exported report',reveal:'The instrument still used the old 100.8 mm preset, but the released report printed nominal 100.0 mm and omitted its raw column.',tension:'The polished summary hid the condition of the physical test.'},
   {ids:['LUM-05','LUM-08'],label:'The blur beneath compensation',reveal:'Enabled optical compensation could hide the fixture error. The fictional comparison shows a distorted spot until the setup is corrected and checked independently.',tension:'A sharp-looking summary image does not establish a sound calibration.'},
   {ids:['LUM-06','LUM-07'],label:'A waived inspection',reveal:'The raw-data check was formally waived. A technician remembers being directed to use the export, but the memory does not establish the speaker’s identity.',tension:'A waiver can speed a report; it cannot recreate missing measurements.'},
  ],
 },
 ORI:{
  title:'A touchdown signal forty meters too soon.',
  opening:'The lander’s controller believed it had touched down and cut its engine. The other sensors were still showing descent.',
  stakes:'How can the vehicle distinguish a contact transient from a real, stable landing?',
  links:[
   {ids:['ORI-01','ORI-02'],label:'A contact pulse in midair',reveal:'The leg sensor latched an 80 ms pulse while radar still measured roughly 40 m of altitude and ongoing descent.',tension:'Two sensors described different physical events.'},
   {ids:['ORI-03','ORI-04'],label:'The dangerous shortcut',reveal:'The engine timeline showed premature cutoff. The autonomy rule treated any touchdown flag as sufficient, with no independent corroboration.',tension:'One brittle software condition turned an electrical transient into an engine command.'},
   {ids:['ORI-05','ORI-08'],label:'The rehearsal that never happened',reveal:'The deployment-pulse test was deferred. An engineer remembers the spike, but only the ticket establishes that the fault scenario was not executed.',tension:'The failure was imaginable before flight, but the test was skipped.'},
   {ids:['ORI-06','ORI-07'],label:'Too late for a message from Earth',reveal:'Ground operators heard the contradiction after the autonomous sequence had already run. A terminal descent cannot depend on immediate Earth intervention.',tension:'The fix must live onboard, before the decision is needed.'},
  ],
 },
 AST:{
  title:'The green status over a red power trace.',
  opening:'A power risk was marked closed even though the underlying thermal test recorded a load beyond the spacecraft’s planned limit.',
  stakes:'Can a revised power schedule and a traceable review give the mission a real way forward?',
  links:[
   {ids:['AST-01','AST-02'],label:'The measurement beneath the green label',reveal:'The predicted peak was 430 W, but the fictional raw test reached 520 W against a 480 W cap. The CLOSED register had no attached proof.',tension:'A status label does not change a wattmeter.'},
   {ids:['AST-03','AST-04'],label:'A familiar review pattern',reveal:'A revision removed the raw trace from a previously OPEN risk. The cross-case stamp log shows a broader pattern of warnings being marked resolved.',tension:'This is a process pattern, not proof of a malicious conspiracy.'},
   {ids:['AST-05','AST-07'],label:'The unanswered engineers',reveal:'A dissent memo asked for identical-condition testing before closure; a review recording said a green status is not a closure artifact.',tension:'Multiple voices demanded evidence rather than reassurance.'},
   {ids:['AST-06','AST-08'],label:'A new way to power the mission',reveal:'Instruments and the heater were operating at once. A staggered fictional schedule targets 450 W at the cost of less simultaneous science, pending an independent rerun.',tension:'A viable trade requires a fresh, documented measurement.'},
  ],
 },
}
export function getRevealedConnections(caseId:ArchiveCaseId,ids:readonly string[]):StoryLink[]{
 const found=new Set(ids)
 return CASE_STORY_ARCS[caseId].links.filter(link=>link.ids.every(id=>found.has(id)))
}
export function focusStoryConnections(caseId:ArchiveCaseId,id:string,ids:readonly string[]):StoryLink[]{
 return getRevealedConnections(caseId,ids).filter(link=>link.ids.includes(id))
}
