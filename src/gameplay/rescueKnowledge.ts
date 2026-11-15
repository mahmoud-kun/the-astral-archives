import type {ArchiveCaseId} from '../archive/evidenceRecords'

/** Author-edited interpretations of fictional recovered mission sources.
 * The recap component hides sections with no recovered source document.
 * These are educational takeaways, not things the player typed or NASA results.
 */
export type KnowledgeSection={
 title:string
 takeaway:string
 reasoning:string
 pastApplication:string
 sourceIds:readonly string[]
}
export type CaseKnowledge={opening:string;goal:string;sections:readonly KnowledgeSection[]}
export const CASE_KNOWLEDGE:Record<ArchiveCaseId,CaseKnowledge>={
 KES:{
  opening:'A proposed science mission passed into planning even though its resources and launch assumptions were inconsistent.',
  goal:'Protect the essential science while redesigning what does not fit.',
  sections:[
   {title:'Science must have priorities',takeaway:'The primary detection science matters more than every optional instrument.',reasoning:'The original scientific objectives and the later proposal scoring separate essential observations from additional follow-up capability.',pastApplication:'You can protect the core detector and reduce or defer secondary imaging, accepting a smaller science return.',sourceIds:['KES-01','KES-08']},
   {title:'The mission must fit its limits',takeaway:'Mass, power and cost are linked constraints, not independent checkboxes.',reasoning:'The fictional original concept weighs 1,010 kg against 900 kg, needs 690 W against 600 W and costs $278m against $240m.',pastApplication:'Reconsider the payload and qualified structural choices, then recheck the combined resource budget. A cheap material alone is not automatically safe.',sourceIds:['KES-03','KES-04']},
   {title:'A stamped launch plan is not an allocation',takeaway:'The original launch opportunity is unavailable and the replacement requires a new study.',reasoning:'The availability notice and engineering review history disagree with the later approved transition summary.',pastApplication:'Replan the launcher and cruise study, with transparent schedule and procurement trade-offs rather than trusting the old stamp.',sourceIds:['KES-02','KES-05','KES-06','KES-07']},
  ],
 },
 NAD:{
  opening:'A small unit mismatch spread across a navigation software interface before a documented independent rerun took place.',
  goal:'Restore a consistent impulse interface and independently verify the trajectory.',
  sections:[
   {title:'Numbers require explicit units',takeaway:'A value of 12 lbf·s is not the same as 12 N·s.',reasoning:'The recorded impulse is about 53 N·s when converted to the receiving navigation unit, so a silent interpretation changes the flight model.',pastApplication:'Assign conversion clearly at one interface boundary and ensure producer and consumer agree.',sourceIds:['NAD-01','NAD-02','NAD-08']},
   {title:'Both systems must follow the same contract',takeaway:'A conversion fix needs a versioned interface agreement, not just a display label.',reasoning:'The interface revision and export log point to an unowned or undocumented unit conversion.',pastApplication:'Set a canonical unit, conversion owner and version, and update both ends together.',sourceIds:['NAD-03','NAD-04']},
   {title:'Closing a ticket is not verification',takeaway:'The anomaly requires an independent reproduced navigation check.',reasoning:'The anomaly discussion and closed ticket lacked a fresh trajectory rerun before sign-off.',pastApplication:'Repeat navigation testing with the corrected contract and attach the result to the engineering release.',sourceIds:['NAD-05','NAD-06','NAD-07']},
  ],
 },
 LUM:{
  opening:'An apparently nominal optical report hid an uncorrected physical test setup difference.',
  goal:'Restore trustworthy calibration and optical acceptance without masking the raw data.',
  sections:[
   {title:'Calibration begins with the physical setup',takeaway:'The fictional fixture reference is 100.0 mm while the observed setup is 100.8 mm.',reasoning:'The design drawing and raw metrology record describe different conditions.',pastApplication:'Correct and calibrate the fixture before assessing optical performance.',sourceIds:['LUM-01','LUM-02']},
   {title:'A clean report can hide a real error',takeaway:'Software compensation and nominal exports cannot replace raw optical measurements.',reasoning:'The configuration log and inspection export document how the mismatch was masked.',pastApplication:'Disable the masking compensation, compare raw outputs and repeat the end-to-end optical test.',sourceIds:['LUM-03','LUM-04','LUM-05','LUM-08']},
   {title:'An exception waiver is not independent evidence',takeaway:'The missing raw-data check keeps final flight qualification uncertain.',reasoning:'A raw inspection was waived while concerns remained in the technician record.',pastApplication:'Require independent metrology and an honest conditional release, rather than repeating the old PASS.',sourceIds:['LUM-06','LUM-07']},
  ],
 },
 ORI:{
  opening:'A transient contact signal was mistaken for a successful landing while the craft was still descending.',
  goal:'Repair touchdown detection and verify autonomous landing behavior.',
  sections:[
   {title:'One sensor pulse is not touchdown',takeaway:'A short 80 ms contact pulse can be triggered before the craft reaches the surface.',reasoning:'The trace records a transient while simulated altitude remained around 40 m.',pastApplication:'Separate leg deployment from ground contact and require sustained, corroborated touchdown.',sourceIds:['ORI-01','ORI-08']},
   {title:'Flight state matters',takeaway:'Altitude, velocity and engine state must agree with the contact signal.',reasoning:'The radar and engine-state timelines show why a contact bit alone is ambiguous.',pastApplication:'Use independent radar/velocity confirmation and a bounded onboard descent state machine.',sourceIds:['ORI-02','ORI-03','ORI-04']},
   {title:'Test the failure, not just the nominal landing',takeaway:'A skipped transient or sensor-failure test leaves the landing guard unverified.',reasoning:'The test ticket and operational notes show incomplete coverage before approval.',pastApplication:'Run simulated spurious-pulse, real-touchdown and sensor-loss scenarios before release.',sourceIds:['ORI-05','ORI-06','ORI-07']},
  ],
 },
 AST:{
  opening:'A fictional development-stage power-risk sign-off did not reflect the actual simultaneous instrument load.',
  goal:'Design a viable power schedule and restore the raw engineering review trail.',
  sections:[
   {title:'The measured peak overrides the forecast',takeaway:'A predicted 430 W is not proof when the raw fictional test reached 520 W.',reasoning:'The power-risk register and thermal trace disagree; the measured peak exceeds the 480 W cap.',pastApplication:'Revise the operating modes and measure the changed configuration, rather than approving the forecast.',sourceIds:['AST-01','AST-02']},
   {title:'System modes can be traded for power margin',takeaway:'Staggering high-draw instruments can reduce simultaneous demand.',reasoning:'The original test configuration and draft rebaseline reveal the conflict between concurrent operation and the available bus.',pastApplication:'Schedule instruments in stages and explicitly accept less concurrent science; the fictional independent retest target is 450 W.',sourceIds:['AST-06','AST-08']},
   {title:'A risk record must remain auditable',takeaway:'A signature cannot replace the dissent memo, failed trace or version history.',reasoning:'Review records and engineer comments show that earlier warnings were closed or removed without a defensible rerun.',pastApplication:'Reopen the risk, restore the original trace and attach an independent test before a conditional decision.',sourceIds:['AST-03','AST-04','AST-05','AST-07']},
  ],
 },
}
