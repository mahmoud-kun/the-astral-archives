import type { OtherCaseId } from './caseEvidenceEngine'

const cap=(value:number,max:number)=>Math.min(100,Math.max(0,value/max*100))
function Meter({name,value,limit,unit,max}:{name:string;value:number;limit:number;unit:string;max:number}){
 const over=value>limit
 return <div className="cw-meter">
  <div className="cw-meter-head"><strong>{name}</strong><span>{value} {unit} <small>/ {limit} {unit}</small></span></div>
  <div className="cw-meter-track" role="img" aria-label={name+': '+value+' '+unit+', limit '+limit+' '+unit}>
   <i className={over?'cw-over':''} style={{width:cap(value,max)+'%'}}/>
   <b style={{left:cap(limit,max)+'%'}}/>
  </div>
 </div>
}
export default function CaseInstrument({caseId,plan={}}:{caseId:OtherCaseId;plan?:Record<string,string>}){
 if(caseId==='KES'){
  const descope=plan.architecture==='descope'
  const heavy=plan.architecture==='heavy'
  const values=descope?[890,590,239]:heavy?[1010,690,316]:[1010,690,278]
  return <div className="cw-instrument" aria-label="Fictional Kestrel architecture resource limits">
   <div className="cw-instrument-head"><b>ARCHITECTURE FEASIBILITY</b><small>{descope?'REDUCED SCIENCE OPTION':heavy?'LATER HEAVY-LAUNCH OPTION':'ORIGINAL CANDIDATE'} / SIMULATED</small></div>
   <Meter name="PAYLOAD" value={values[0]} limit={900} max={1200} unit="kg"/>
   <Meter name="POWER" value={values[1]} limit={600} max={850} unit="W"/>
   <Meter name="COST" value={values[2]} limit={240} max={360} unit="$m"/>
   <p>LAUNCH WINDOW: {plan.window==='replanned'?'REPLAN SELECTED · verification still required':'ORIGINAL WINDOW · UNAVAILABLE'}</p>
  </div>
 }
 if(caseId==='LUM'){
  const selected=plan.fixture&&Number.isFinite(Number(plan.fixture))?Number(plan.fixture):100.8
  const px=cap(selected-99.5,2.0)
  return <div className="cw-instrument" aria-label="Fictional optical fixture comparison">
   <div className="cw-instrument-head"><b>OPTICAL METROLOGY</b><small>TRAINING FIXTURE · NOT FLIGHT TOLERANCE</small></div>
   <div className="cw-optic-readings"><span>DRAWING<strong>100.0 mm</strong></span><span>RAW FILE<strong>100.8 mm</strong></span><span>CANDIDATE<strong>{Number.isFinite(selected)?selected.toFixed(1):'—'} mm</strong></span></div>
   <div className="cw-optic-axis" role="img" aria-label={'Nominal 100.0 mm, original measured 100.8 mm, entered configuration '+selected+' mm'}>
    <b className="cw-nominal" style={{left:'25%'}}/><b className="cw-original" style={{left:'65%'}}/><i style={{left:px+'%'}}/>
   </div>
   <small>AXIS IS A SCHEMATIC MEASUREMENT COMPARISON. The initial green PASS came from an exported nominal field.</small>
  </div>
 }
 if(caseId==='ORI')return <div className="cw-instrument" aria-label="Fictional Oriole leg signal and descent timeline">
  <div className="cw-instrument-head"><b>DESCENT TELEMETRY</b><small>EVENT RECONSTRUCTION · SYNTHETIC</small></div>
  <svg viewBox="0 0 520 138" role="img" aria-label="Fictional 80 millisecond contact pulse during leg deployment, at 40 metres while descending">
   <path d="M30 12V109H506M30 36H506M30 73H506" stroke="#4b7387" fill="none" strokeWidth="1"/>
   <path d="M30 87H171V36H236V87H506" fill="none" stroke="#e8a76e" strokeWidth="3"/>
   <path d="M30 101L505 101" stroke="#78ccdb" strokeWidth="2.5"/>
   <path d="M30 15H506" stroke="#8f6571" strokeDasharray="4 7"/>
   <g fill="#c9e5e9" fontSize="11" fontFamily="monospace">
    <text x="38" y="29">CONTACT PULSE</text><text x="175" y="29">80 ms</text><text x="300" y="61">ALTITUDE: 40 m</text><text x="311" y="94">DESCENDING</text><text x="33" y="128">LEG DEPLOY</text><text x="385" y="128">ENGINE_OFF? →</text>
   </g>
  </svg>
  <p>ONE RAW BIT ≠ CONFIRMED TOUCHDOWN. {plan.debounce?'Candidate debounce: '+plan.debounce+' ms':'Replay the event and construct a guarded state transition.'}</p>
 </div>
 const stagger=plan.mode==='stagger'
 return <div className="cw-instrument" aria-label="Fictional Asterion thermal-vac power discrepancy">
  <div className="cw-instrument-head"><b>THERMAL-VAC / BUS CAP</b><small>VERSIONED POWER-REVIEW MODEL</small></div>
  <Meter name="PREDICTED (OLD)" value={430} limit={480} max={570} unit="W"/>
  <Meter name="OBSERVED (OLD)" value={520} limit={480} max={570} unit="W"/>
  <Meter name="CANDIDATE REPLAY" value={stagger?450:520} limit={480} max={570} unit="W"/>
  <p>{stagger?'STAGGERED MODES / lower observing duty':'CONCURRENT HIGH-DRAW MODES'} · Target is 460 W with margin. A draft forecast is not a signed test.</p>
 </div>
}
