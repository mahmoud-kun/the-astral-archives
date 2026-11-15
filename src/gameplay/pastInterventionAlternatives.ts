import type {ArchiveCaseId} from '../archive/evidenceRecords'
import type {PastRoomId} from './pastTimeline'
import type {InterventionOption} from './pastInterventions'

/** Additional defensible intervention paths and partial mitigations.
 * Multiple methods can address one system, with distinct costs, scientific
 * losses and verification needs. Values are fictional design simulations.
 */
export const ALTERNATE_PLANS:Record<ArchiveCaseId,Record<PastRoomId,readonly InterventionOption[]>>={
 KES:{
  manufacturing:[
   {id:'modular',action:'Retain essential sensors and shift follow-up to a lean modular package',consequence:'A smaller science core reduces power and structure demand. The optional high-resolution follow-up is deferred; a qualified modular design still needs its own resource review.',readout:'PRIMARY INSTRUMENTS RETAINED · FOLLOW-UP DEFERRED',restores:true},
   {id:'materials',action:'Switch structure materials only, leaving instruments unchanged',consequence:'Procurement may cost less, but an unverified structural change alone cannot erase the original mass and simultaneous power exceedance.',readout:'STRUCTURE COST UNDER REVIEW · POWER STILL CONSTRAINED',restores:false},
  ],
  mission_target:[
   {id:'focused',action:'Keep the primary spectra; reduce the optional imaging cadence',consequence:'Primary event detection and spectroscopy are protected while secondary imaging takes a lower-duty role. The new observation plan needs sign-off.',readout:'CORE SCIENCE PRESERVED · IMAGE CADENCE REDUCED',restores:true},
  ],
  data_analysis:[
   {id:'independent',action:'Commission an independent resource and feasibility review',consequence:'A new team checks the reduced payload against the power, mass and cost envelope rather than relying on the earlier stamp. The design remains conditional until allocation.',readout:'INDEPENDENT DESIGN REVIEW DOCUMENTED',restores:true},
  ],
  resources_review:[
   {id:'rideshare',action:'Investigate a compatible shared-launch opportunity with revised procurement',consequence:'A hypothetical rideshare study could provide a new route and lower procurement costs, but imposes interfaces and schedule constraints that still need review.',readout:'ALTERNATE ALLOCATION · NEW INTERFACE REVIEW',restores:true},
  ],
 },
 NAD:{
  manufacturing:[
   {id:'receiver',action:'Accept labeled lbf·s at the receiver and convert it to N·s there',consequence:'A versioned receiver adapter converts the original impulse once and gives the simulator a consistent physical value. This requires the interface contract to assign ownership to the receiver.',readout:'RECEIVER CONVERSION REVISED · UNIT METADATA EXPLICIT',restores:true},
  ],
  mission_target:[
   {id:'schema',action:'Publish a versioned schema allowing either conversion owner',consequence:'The teams agree on canonical N·s at the navigation input, and explicitly record which adapter owns conversion for each release.',readout:'CANONICAL NAVIGATION UNIT DOCUMENTED',restores:true},
  ],
  data_analysis:[
   {id:'dual',action:'Cross-check corrected trajectory with an independent second model',consequence:'Two independently implemented fictional navigation calculations agree after the unit interface is corrected. This needs more engineering effort than one rerun.',readout:'INDEPENDENT NAVIGATION MODELS COMPARED',restores:true},
  ],
  resources_review:[
   {id:'hold',action:'Place an engineering hold until independent rerun evidence is attached',consequence:'Launch readiness is delayed but the actual unit discrepancy and its reproduced resolution are linked to the release decision.',readout:'RELEASE HOLD RESOLVED WITH TEST EVIDENCE',restores:true},
   {id:'memo',action:'Add an engineering memo to the closed ticket without reopening it',consequence:'The explanation can be useful, but closing NAV-042 without a versioned rerun leaves no defensible independent verification.',readout:'MEMO FILED · VERIFICATION TRAIL INCOMPLETE',restores:false},
  ],
 },
 LUM:{
  manufacturing:[
   {id:'remachine',action:'Re-machine and independently survey the fixture before testing',consequence:'A physical survey restores the 100.0 mm design reference instead of compensating for the 100.8 mm as-built mismatch. It costs fabrication time.',readout:'FIXTURE DIMENSION CONTROL RESTORED',restores:true},
  ],
  mission_target:[
   {id:'quarantine',action:'Quarantine the original PASS and require raw optical acceptance',consequence:'The nominal summary is withheld until traceable, uncompensated measurements support the corrected setup. Schedule slips but data trust improves.',readout:'ACCEPTANCE HELD FOR RAW DATA',restores:true},
  ],
  data_analysis:[
   {id:'interferometry',action:'Use a second optical test method alongside the raw star image',consequence:'Independent instrument comparisons provide a stronger fictional check of the revised fixture, without claiming a real flight tolerance.',readout:'MULTI-METHOD OPTICAL CHECKS RECORDED',restores:true},
   {id:'quicklook',action:'Inspect a quick-look compensated image to expedite release',consequence:'The image is easier to obtain, but it does not isolate the hidden fixture offset and cannot certify uncorrected optical performance.',readout:'QUICK-LOOK IMAGE AVAILABLE · RAW CHECK MISSING',restores:false},
  ],
  resources_review:[
   {id:'defer',action:'Defer acceptance pending an independent metrology sign-off',consequence:'The schedule is protected from a false PASS by carrying the unresolved flight qualification transparently into the next review.',readout:'QA RELEASE CONDITIONAL ON INDEPENDENT CHECK',restores:true},
  ],
 },
 ORI:{
  manufacturing:[
   {id:'inhibit',action:'Inhibit leg-deployment pulses and require a second touchdown channel',consequence:'The detector treats deployment as its own phase and requires corroborated contact before cutoff, with an additional onboard logic state.',readout:'DEPLOYMENT TRANSIENT SEPARATED FROM CONTACT',restores:true},
  ],
  mission_target:[
   {id:'states',action:'Build an onboard descent state machine using contact and radar',consequence:'Flight software uses the descent phase, speed and radar estimate to guard cutoff. It is more complex but avoids a delayed Earth decision.',readout:'DESCENT STATE MACHINE CONSTRAINS CUTOFF',restores:true},
   {id:'groundReview',action:'Ask ground operators to cross-check each cutoff signal',consequence:'Extra ground oversight is useful for earlier mission phases, but cannot react in real time during terminal descent.',readout:'GROUND OVERSIGHT ADDED · FINAL DESCENT DELAY REMAINS',restores:false},
  ],
  data_analysis:[
   {id:'hil',action:'Use hardware-in-the-loop fault injection across the landing sequence',consequence:'The simulated transient, sensor loss and real touchdown are all replayed against actual onboard logic, improving coverage at added test cost.',readout:'HARDWARE-IN-LOOP EDGE CASES REVIEWED',restores:true},
  ],
  resources_review:[
   {id:'testhold',action:'Hold flight readiness for a witnessed autonomy fault-injection test',consequence:'A delayed test campaign independently checks the landing guard and records the acceptance boundaries before release.',readout:'INDEPENDENT AUTONOMY FAULT TEST ATTACHED',restores:true},
  ],
 },
 AST:{
  manufacturing:[
   {id:'interlock',action:'Install a power-aware interlock that staggers competing loads',consequence:'A scheduler prevents simultaneous peaks and targets a fictional 450 W revised mode; it also limits concurrent observation opportunities.',readout:'POWER INTERLOCK PLAN · REVISED DUTY CYCLE',restores:true},
   {id:'radiator',action:'Improve radiator efficiency but retain all electrical loads in parallel',consequence:'Thermal rejection may improve, yet a better radiator alone does not solve the measured electrical peak above the bus cap.',readout:'THERMAL CHANGE PROPOSED · ELECTRICAL DRAW UNCHANGED',restores:false},
  ],
  mission_target:[
   {id:'reduced',action:'Reduce secondary exposure time to protect essential observing modes',consequence:'Science priorities survive within a staggered duty plan, although some secondary observing time is lost.',readout:'SCIENCE PLAN REBALANCED · CONCURRENT DUTY REDUCED',restores:true},
  ],
  data_analysis:[
   {id:'tvac',action:'Repeat thermal-vac power tests across the revised duty schedule',consequence:'A second independent fictional test confirms 450 W under the 460 W review target, with the earlier 520 W anomaly retained in the record.',readout:'REPEAT THERMAL-VAC CHECK · 450 W FICTIONAL',restores:true},
  ],
  resources_review:[
   {id:'audit',action:'Reopen the change record and appoint an independent power reviewer',consequence:'The original failed trace, reduced-duty schedule and new test are versioned together instead of replacing the evidence.',readout:'POWER RISK REOPENED · TRAIL VERIFIED',restores:true},
  ],
 },
}
