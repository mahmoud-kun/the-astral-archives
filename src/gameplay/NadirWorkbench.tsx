import { useState } from 'react'
import { findEvidence } from '../archive/evidenceRecords'
import { collectEvidenceManually, useLiveArchive, completeNadirPuzzle, useNadirProgress } from './evidenceStore'
import { verifyNadirPuzzle, type PuzzleAnswers, type NadirPuzzleId } from './nadirLogic'
import './nadirWorkbench.css'

type Choice = { id: string; label: string }
type Field = { key: string; label: string; choices?: Choice[]; placeholder?: string }
type PuzzleSpec = { heading: string; task: string; fields: Field[]; hints: [string,string,string]; records: string[] }
const unitOptions = [{id:'lbf-s',label:'lbf·s (pound-force seconds)'},{id:'N-s',label:'N·s (newton seconds)'},{id:'kg-m-s',label:'kg·m/s² (force)'},{id:'lbf',label:'lbf (force, not impulse)'}]
const yesNo = [{id:'yes',label:'Yes'},{id:'no',label:'No'}]
const puzzle: Record<NadirPuzzleId,PuzzleSpec> = {
  'NAD-02': {
    heading:'IMPULSE UNIT RECONCILIATION',
    task:'Decode the export, identify the unit contract, and calculate the numerical impulse the consumer should receive. You must demonstrate the conversion; guessing the cause is not enough.',
    records:['PRODUCER EXPORT / MESSAGE 0038','source_value = 12','source_unit = lbf·s','consumer_value = 12','assumed_unit = N·s','UNIT REFERENCE: 1 lbf = 4.448221615 N. Impulse = force × seconds.'],
    fields:[
      {key:'sourceUnit',label:'Unit actually emitted by the producer',choices:unitOptions},
      {key:'consumerUnit',label:'Unit the navigation parser expects',choices:unitOptions},
      {key:'correctedImpulse',label:'Calculate the corrected impulse in N·s (two decimals accepted)',placeholder:'Enter your computed value'},
    ],
    hints:[
      'Compare dimensions, not just the two matching numerals in the packet.',
      'Both fields are impulse, but they come from two unit systems. Check the conversion reference shown in the packet.',
      'Multiply the source numeric impulse by the pound-force-to-newton conversion factor; retain seconds.'
    ]
  },
  'NAD-01': {
    heading:'TRAJECTORY DIVERGENCE ANALYSIS',
    task:'Run the original prediction and the corrected one; overlay their tracks. Interpret why the residual shrinks. A corrected trajectory cannot be replayed until NAD-02 has been collected.',
    records:['GROUND NAVIGATION / PREDICTED COURSE COMPARISON','MODEL A: impulse interpreted as N·s','MODEL B: source impulse emitted in lbf·s','QUESTION: is the divergence physical thruster failure, deliberate alteration, or interface interpretation?'],
    fields:[
      {key:'residual',label:'What happens to the model residual after a unit-correct replay?',choices:[{id:'diverges',label:'The residual increases continuously'},{id:'converges',label:'The predicted tracks converge under the common unit'},{id:'unchanged',label:'No material change from original replay'}]},
      {key:'rootCause',label:'Which explanation is supported by the replay?',choices:[{id:'thruster-failure',label:'Flight thruster malfunction'},{id:'unit-interpretation',label:'Incompatible interpretation of the same impulse numeral'},{id:'tampering',label:'Intentional alteration of logged source values'}]},
    ],
    hints:[
      'The same input numeral need not represent the same physical impulse.',
      'Compare raw and corrected traces before choosing a failure mechanism.',
      'Check whether the residual disappears when both models receive physically equivalent impulses.'
    ]
  },
  'NAD-03': {
    heading:'INTERFACE CONTROL DOCUMENT REPAIR',
    task:'Patch revision B with a canonical unit, accountable conversion owner, and verification artifact. This is an engineering contract, not a spelling exercise.',
    records:['ICD-07 / REVISION B','FIELD: attitude_impulse','UNIT_CONVENTION: [MISSING]','CONVERSION_OWNER: [MISSING]','ACCEPTANCE EVIDENCE: [NOT ATTACHED]','PRODUCER: component V3 / CONSUMER: parser V2'],
    fields:[
      {key:'interfaceUnit',label:'Canonical navigation-interface unit',choices:unitOptions},
      {key:'conversionOwner',label:'Who converts the produced impulse before export?',choices:[{id:'consumer',label:'Consumer silently guesses the unit'},{id:'producer',label:'Producer adapter with explicit conversion and contract'},{id:'reviewer',label:'Review board converts values by hand'}]},
      {key:'verification',label:'Evidence required for a defensible fix',choices:[{id:'verbal-approval',label:'Verbal signoff at the next meeting'},{id:'mark-ticket',label:'Close ticket without attachments'},{id:'rerun-with-documented-units',label:'Documented integration test + rerun using the specified units'}]},
    ],
    hints:[
      'Select one declared unit on the interface. Avoid implicit units at runtime.',
      'Make responsibility explicit at a boundary you control, rather than relying on reinterpretation downstream.',
      'A revised interface is not verified until the full producer–consumer chain is exercised and documented.'
    ]
  },
  'NAD-04': {
    heading:'PRODUCER / CONSUMER AUDIT',
    task:'Trace the complete software handoff, identify its two incompatible interface versions, and classify the failure from evidence rather than suspicion.',
    records:['PRODUCER BUILD: component V3','ACTUAL OUTPUT: lbf·s impulse','CONSUMER BUILD: navigation parser V2','INTERPRETATION: numeric value read as N·s','AUDIT: no recorded modification of the raw impulse numerals'],
    fields:[
      {key:'producer',label:'Producer version + unit',choices:[{id:'V3:lbf-s',label:'Component V3 → lbf·s'},{id:'V2:N-s',label:'Component V2 → N·s'},{id:'V3:N-s',label:'Component V3 → N·s'}]},
      {key:'consumer',label:'Consumer version + assumed unit',choices:[{id:'V2:N-s',label:'Parser V2 → N·s'},{id:'V3:lbf-s',label:'Parser V3 → lbf·s'},{id:'V2:lbf-s',label:'Parser V2 → lbf·s'}]},
      {key:'failureMode',label:'Best supported engineering failure classification',choices:[{id:'tamper',label:'Source log altered after export'},{id:'contract-mismatch',label:'Undeclared unit conversion at an interface boundary'},{id:'mechanical',label:'Propulsion hardware failure'}]},
    ],
    hints:[
      'The build note distinguishes software output from parser expectations.',
      'Keep producer and consumer versions separate. Do not assume later component version means newer parser.',
      'A matching source numeral with mismatching physical meaning is a contract problem, not evidence of tampering.'
    ]
  },
  'NAD-05': {
    heading:'RECONSTRUCT THE ESCALATION TIMELINE',
    task:'Place the known events in causal order and infer whether the anomaly was actually resolved before closure.',
    records:['EVENT W / Engineering discrepancy escalation: units cross-check requested','EVENT R / Meeting: verbally verified, no repeat simulation attached','EVENT C / NAV-042 closure: state CLOSED, attachment count 0','AUDIT NOTE: the escalation request predates closure approval'],
    fields:[
      {key:'first',label:'First event in the evidence timeline',choices:[{id:'closure',label:'NAV-042 closure'},{id:'review',label:'Verbal meeting review'},{id:'warning',label:'Engineer escalation warning'}]},
      {key:'second',label:'Second event',choices:[{id:'closure',label:'NAV-042 closure'},{id:'review',label:'Verbal meeting review'},{id:'warning',label:'Engineer escalation warning'}]},
      {key:'third',label:'Final event',choices:[{id:'closure',label:'NAV-042 closure'},{id:'review',label:'Verbal meeting review'},{id:'warning',label:'Engineer escalation warning'}]},
      {key:'conclusion',label:'Defensible conclusion',choices:[{id:'resolved',label:'The issue was independently resolved before closure'},{id:'unresolved-at-closure',label:'An open concern was closed without the requested rerun'},{id:'never-reported',label:'No written escalation existed'}]},
    ],
    hints:[
      'An escalation recorded before closure cannot be evidence that the issue was solved.',
      'The review is verbal. Look for the independently reproducible test artifact.',
      'Build the timeline: engineer raises concern → team verbally reviews → ticket is marked closed.'
    ]
  },
  'NAD-06': {
    heading:'CLOSURE EVIDENCE AUDIT',
    task:'Inspect NAV-042 and decide whether its “VERIFIED” stamp is technically defensible. Record the missing engineering evidence, not just the ticket color.',
    records:['TICKET NAV-042 / CLOSED','RESOLUTION: verbally verified at team meeting','ATTACHMENTS: 0','REPRODUCED SIMULATION: NO','TRANSITION STAMP: verification complete'],
    fields:[
      {key:'attachmentCount',label:'How many rerun attachments can an independent reviewer inspect?',choices:[{id:'2',label:'2'},{id:'1',label:'1'},{id:'0',label:'0'}]},
      {key:'rerun',label:'Was the contradiction reproduced and cleared?',choices:yesNo},
      {key:'auditDecision',label:'Your audit decision',choices:[{id:'valid-closure',label:'Accept: verbal verification is sufficient'},{id:'unsupported-closure',label:'Flag: verification has no reproducible evidence'},{id:'hardware-proof',label:'Declare mechanical failure without tests'}]},
    ],
    hints:[
      'A status label reports an administrative decision, not a technical measurement.',
      'The missing attachment and the missing repeat simulation are independent warning signs.',
      'Choose the decision that distinguishes a claimed resolution from a verified, reproducible fix.'
    ]
  },
}

function SelectAnswer({ field, value, onChange }: { field: Field; value: string; onChange:(s:string)=>void }) {
  return <label className="nw-field"><span>{field.label}</span>
    {field.choices
      ? <select value={value} onChange={event=>onChange(event.target.value)}>
          <option value="">SELECT FROM THE RECORD</option>
          {field.choices.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      : <input type="number" inputMode="decimal" step="0.01" value={value} placeholder={field.placeholder ?? ''}
          onChange={event=>onChange(event.target.value)} />}
  </label>
}

function EvidenceCurve({ mode }: {mode: 'raw'|'corrected'}) {
  return <svg viewBox="0 0 460 140" role="img" aria-label={mode==='raw'?'Mismatched model paths diverge':'After unit correction the two paths nearly overlap'}>
    <path d="M20 14V124H440" fill="none" stroke="#528797" strokeWidth="2"/>
    <path d="M22 108Q150 107 238 74T439 26" fill="none" stroke="#e2ba83" strokeWidth="3"/>
    <path d={mode==='raw'?'M22 108Q150 104 238 97T439 106':'M22 108Q150 108 238 76T439 29'}
      fill="none" stroke="#60dbe4" strokeWidth="3" strokeDasharray="7 4"/>
    <text x="22" y="10" fontSize="10" fill="#94c6d1">SIMULATED TRACK COMPARISON / {mode.toUpperCase()}</text>
    <text x="335" y="128" fontSize="10" fill="#b0d4da">TIME →</text>
  </svg>
}

export default function NadirWorkbench({ id, onClose }: {id:string; onClose:()=>void}) {
  const record = findEvidence(id)
  const archive = useLiveArchive()
  const progress = useNadirProgress()
  const [answers,setAnswers] = useState<PuzzleAnswers>({})
  const [hints,setHints] = useState(0)
  const [feedback,setFeedback] = useState('')
  const [reviewed,setReviewed] = useState(false)
  const [replay,setReplay] = useState<'none'|'raw'|'corrected'>('none')
  const [collectedNow,setCollectedNow] = useState(false)

  if (!record || record.caseId!=='NAD') return null
  const puzzleId = record.required ? id as NadirPuzzleId : null
  const spec = puzzleId ? puzzle[puzzleId] : null
  const verified = puzzleId ? progress.solved.includes(puzzleId) : reviewed
  const collected = archive.discovered.includes(record.id) || collectedNow
  const mayCollect = verified && !collected
  const setField = (key:string,value:string) => { setAnswers(previous=>({...previous,[key]:value}));setFeedback('') }

  function verify(){
    if (!puzzleId || !spec) return
    const complete = spec.fields.every(f=>Boolean(answers[f.key]))
      && (puzzleId!=='NAD-01' || (answers.originalViewed==='yes' && answers.correctedViewed==='yes'))
    if(!complete){setFeedback('ANALYSIS INCOMPLETE — review every field and required simulation run.');return}
    if(verifyNadirPuzzle(puzzleId,answers)){
      completeNadirPuzzle(puzzleId)
      setFeedback('FINDING VERIFIED — you can now collect this record manually.')
    }else setFeedback('EVIDENCE DOES NOT SUPPORT THIS CONCLUSION. Re-examine the raw records; no penalty.')
  }
  function collect(){
    if(!mayCollect) return
    if(collectEvidenceManually(record.id)) { setCollectedNow(true);setFeedback('EVIDENCE COLLECTED — added to Unfiled in your Quick Evidence Tray.')}
    else setFeedback('Unable to save evidence. Check browser storage permissions.')
  }
  function runReplay(mode:'raw'|'corrected'){
    if(mode==='corrected' && !archive.discovered.includes('NAD-02')){
      setFeedback('REPLAY LOCKED — collect the corrected impulse evidence (NAD-02) first.')
      return
    }
    setReplay(mode)
    setField(mode==='raw'?'originalViewed':'correctedViewed','yes')
  }

  return <div className="nw-shade" role="presentation" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}>
    <section className="nw-modal" role="dialog" aria-modal="true" aria-label={'Inspect '+record.title}>
      <header className="nw-head">
        <div><small>NADIR / {record.room.toUpperCase()} / FICTIONAL ENGINEERING SIMULATION</small><strong>{record.id} — {record.title}</strong></div>
        <button type="button" onClick={onClose} aria-label="Close analysis">BACK TO ROOM ×</button>
      </header>
      <div className="nw-content">
        <div className="nw-brief">
          <span>{spec ? 'ANALYTICAL EVIDENCE · TEST REQUIRED' : 'OPTIONAL ARCHIVAL REFERENCE'}</span>
          <h2>{spec?.heading ?? record.title.toUpperCase()}</h2>
          <p>{spec?.task ?? 'Read this subjective or reference material critically. It can support an investigation, but it does not substitute for reproducible technical evidence.'}</p>
        </div>
        <div className="nw-workgrid">
          <article className="nw-source">
            <h3>RAW SOURCE MATERIAL</h3>
            {(spec?.records ?? record.content.split(';')).map((line,i)=><p key={i}><span>{String(i+1).padStart(2,'0')}</span> {line.trim()}</p>)}
            <small>Training records are fictional and are not sourced NASA mission telemetry.</small>
          </article>
          <section className="nw-analysis" aria-label="Evidence analysis">
            {puzzleId==='NAD-01'&& <div className="nw-graph">
              {replay==='none'?<p>REPLAY REQUIRED — select a test below to compare the predicted tracks.</p>:<EvidenceCurve mode={replay}/>}
              <div><button onClick={()=>runReplay('raw')}>RUN RAW MODEL</button>
                <button onClick={()=>runReplay('corrected')} disabled={!archive.discovered.includes('NAD-02')}>RUN UNIT-CORRECT MODEL</button></div>
              {replay==='corrected'&&<small>Corrected run: both models receive equivalent physical impulse.</small>}
            </div>}
            {spec ? <>
              <h3>ENGINEERING ANALYSIS</h3>
              <div className="nw-fields">{spec.fields.map(field=><SelectAnswer key={field.key} field={field}
                value={answers[field.key]??''} onChange={value=>setField(field.key,value)}/>)}</div>
              {!verified&&<button type="button" className="nw-verify" onClick={verify}>VERIFY MY ANALYSIS</button>}
            </>:<>
              <h3>OPTIONAL CONTEXT / SOURCE CAUTION</h3>
              <p>{record.inspectAction}</p>
              <label className="nw-confirm"><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/>
                I inspected this record and understand that it is context, not independent proof.</label>
            </>}
            {spec && hints>0 && <div className="nw-hint"><strong>ANALYST NOTE {hints}/3</strong><p>{spec.hints[hints-1]}</p></div>}
            {spec && !verified && <button type="button" className="nw-hint-button" disabled={hints>=3}
              onClick={()=>setHints(h=>Math.min(3,h+1))}>REQUEST {hints===0?'CONCEPTUAL':hints===1?'TECHNICAL':'FINAL'} HINT ({hints}/3)</button>}
            {feedback&&<p className="nw-feedback" role="status">{feedback}</p>}
            {verified && <div className="nw-success"><strong>{collected?'RECORD COLLECTED':'FINDING VERIFIED'}</strong>
              <p>{collected?'Record is in your Quick Evidence Tray; filing is a separate decision.':'Your reasoning passed the source checks. Decide whether to collect this evidence.'}</p>
              {mayCollect&&<button type="button" className="nw-collect" onClick={collect}>COLLECT EVIDENCE / {record.id}</button>}
            </div>}
          </section>
        </div>
      </div>
    </section>
  </div>
}
