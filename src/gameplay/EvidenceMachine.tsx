import { useState } from 'react'
import type { NadirAnswer, NadirRecord } from './nadirEngine'
import './evidenceMachine.css'

function Symbol({type}:{type:'pulse'|'arrow'|'file'|'alert'|'chip'|'clock'|'wave'|'units'|'check'}){
 const art={
  pulse:<><path d="M2 12h4l2-7 4 14 3-9 2 2h5"/></>,
  arrow:<><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  file:<><path d="M6 2h9l5 5v15H6zM15 2v6h5M9 12h8m-8 4h6"/></>,
  alert:<><path d="M12 3 2 21h20L12 3ZM12 9v5m0 4v.01"/></>,
  chip:<><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/></>,
  clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
  wave:<><path d="M2 12h2l2-5 3 11 3-14 3 16 3-11 2 3h2"/></>,
  units:<><path d="M3 7h18M3 17h18m-9-14v18M6 12h12"/></>,
  check:<><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
 }
 return <svg className="em-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{art[type]}</svg>
}

function Oscilloscope({compact=false}:{compact?:boolean}){
 return <svg className={'em-oscillo'+(compact?' em-oscillo-compact':'')} viewBox="0 0 450 88" aria-hidden="true">
  <defs><pattern id="em-grid" width="30" height="22" patternUnits="userSpaceOnUse"><path d="M30 0H0V22" fill="none" stroke="#436578" strokeWidth=".8" opacity=".65"/></pattern></defs>
  <rect x="0" y="0" width="450" height="88" rx="5" fill="#071a28"/>
  <rect x="0" y="0" width="450" height="88" fill="url(#em-grid)"/>
  <path d="M0 44H450" stroke="#3f99ac" opacity=".35"/>
  {Array.from({length:45},(_,i)=>{const x=i*10+4,h=(Math.sin(i*2.15)*Math.cos(i*.63)*23)+(Math.sin(i*.77)*9);
   return <path key={i} d={`M${x} 44V${44-h}`} stroke={i%4===0?'#f3ba7a':'#74e8f1'} strokeWidth={i%6===0?3:1.7} opacity={.5+(i%5)*.08}/>;
  })}
  <path d="M3 42h444" stroke="#63f0ff" strokeWidth=".6" opacity=".6"/>
 </svg>
}

function EvidenceTicket(){
 const [revealed,setRevealed]=useState(false)
 return <div className="em-ticket">
  <div className="em-ticket-top"><span>RECORD NAV-042 / REVIEW</span><b>CLOSED</b></div>
  <div className="em-ticket-main">
   <div className="em-ticket-symbol"><Symbol type="file"/></div>
   <div><small>VERIFICATION RECORD</small><strong>ATTACHMENT AUDIT</strong></div>
  </div>
  <div className="em-ticket-ledger">
   <span>STATUS</span><b>ADMINISTRATIVE CLOSE</b><span>RERUN OUTPUT</span><b className="em-missing">0 FILES</b>
   <span>REPRODUCED CHECK</span><b className="em-missing">NOT DOCUMENTED</b>
  </div>
  <button className="em-detect" type="button" onClick={()=>setRevealed(s=>!s)}>
   <Symbol type="alert"/> {revealed?'HIDE VERIFICATION GAP':'INSPECT VERIFICATION STAMP'}
  </button>
  {revealed&&<div className="em-reveal" role="status">The CLOSED stamp only records a workflow decision. It does not provide independent evidence that the discrepancy was resolved.</div>}
 </div>
}

function ChainVisual({id,answer,onChange,disabled}:{id:NadirRecord;answer:NadirAnswer;onChange:(key:string,value:string)=>void;disabled:boolean}){
 const isRepair=id==='NAD-03'
 const producer=answer.producer||answer.owner||''
 const consumer=answer.consumer||answer.canonical||''
 const opts=isRepair?[{key:'owner',name:'CONVERSION OWNER',variants:[['producer','Producer'],['both','Both'],['none','No owner']]},{key:'canonical',name:'CANONICAL UNIT',variants:[['ns','N·s'],['lbfs','lbf·s'],['n','N']]}] as const:
 [{key:'producer',name:'PRODUCER UNIT',variants:[['lbfs','lbf·s'],['ns','N·s']]},{key:'consumer',name:'PARSER ASSUMPTION',variants:[['lbfs','lbf·s'],['ns','N·s']]}] as const
 return <div className="em-chain">
  <div className="em-chain-line">
   <div className="em-node"><Symbol type="chip"/><span>EXPORTER</span><strong>ATTITUDE V3</strong></div>
   <div className="em-link"><Symbol type="arrow"/><small>ICD-07</small></div>
   <div className="em-node em-node-mid"><Symbol type="alert"/><span>INTERFACE</span><strong>{isRepair?'REPAIR CONTRACT':'REV B · FIELD'}</strong></div>
   <div className="em-link"><Symbol type="arrow"/><small>DATA</small></div>
   <div className="em-node"><Symbol type="chip"/><span>CONSUMER</span><strong>NAV PARSER V2</strong></div>
  </div>
  <div className="em-module-choices">
   {opts.map(item=><div className="em-module" key={item.key}>
    <small>{item.name}</small>
    <div className="em-choice-cards">{item.variants.map(([value,label])=><button type="button" key={value} disabled={disabled} aria-pressed={answer[item.key]===value} onClick={()=>onChange(item.key,value)} className={answer[item.key]===value?'em-selected':''}>{label}</button>)}</div>
   </div>)}
  </div>
  <div className="em-chain-note"><Symbol type="wave"/><span>{producer&&consumer?'Compare both sides: are the interface assumptions consistent?':'Select the interface fields using the physical chips.'}</span></div>
 </div>
}

function ImpulseVisual({id,answer}:{id:NadirRecord;answer:NadirAnswer}){
 const candidate=Number(answer.converted??answer.rerun??'')
 const hasValue=String(answer.converted??answer.rerun??'').trim()!==''&&Number.isFinite(candidate)
 const pct=hasValue?Math.max(0,Math.min(100,candidate/65*100)):0
 return <div className="em-impulse">
  <div className="em-impulse-readouts">
   <div className="em-value"><span><Symbol type="pulse"/> RAW EXPORT</span><strong>12</strong><small>lbf·s</small></div>
   <div className="em-small-arrow"><Symbol type="arrow"/></div>
   <div className="em-value em-value-target"><span><Symbol type="chip"/> PARSER INPUT</span><strong>{hasValue?candidate.toFixed(2):'--.--'}</strong><small>N·s</small></div>
  </div>
  <div className="em-scope"><span>CALIBRATED IMPULSE SCOPE / 0–65 N·s</span>
   <div className="em-track"><i style={{width:pct+'%'}}/><b style={{left:pct+'%'}}/></div>
   <div className="em-axis"><small>0</small><small>16.25</small><small>32.5</small><small>48.75</small><small>65</small></div>
   <p>{hasValue?'The scope reflects your candidate input. A valid model requires dimensional consistency.':'Enter a conversion in the workbench to drive the scope.'}</p>
  </div>
  <div className="em-factor"><Symbol type="units"/><span>REFERENCE CALIBRATION</span><strong>1 lbf = 4.448221615 N</strong></div>
 </div>
}

function ClockVisual(){
 return <div className="em-clock">
  <div className="em-clock-badge"><Symbol type="clock"/><span>RECOVERED REVIEW TIMELINE</span></div>
  <div className="em-clock-steps">{['EXPORT','RESIDUAL','ESCALATION','CLOSURE'].map((v,i)=><div key={v}><span>{String(i+1).padStart(2,'0')}</span><strong>{v}</strong><i/></div>)}</div>
  <p>Those events are not yet in chronological order in the recovered queue. Rearrange the event cards in the workbench.</p>
 </div>
}

export default function EvidenceMachine({id,answer,onChange,disabled}:{id:NadirRecord;answer:NadirAnswer;onChange:(key:string,value:string)=>void;disabled:boolean}){
 return <section className="em-machine" aria-label={'Visual evidence instrument for '+id}>
  <header><div><span className="em-light"/><b>INSTRUMENT {id}</b></div><small>STATION SYSTEM / FICTIONAL</small></header>
  {(id==='NAD-02'||id==='NAD-01')&&<ImpulseVisual id={id} answer={answer}/>}
  {(id==='NAD-04'||id==='NAD-03')&&<ChainVisual id={id} answer={answer} onChange={onChange} disabled={disabled}/>}
  {id==='NAD-06'&&<EvidenceTicket/>}
  {id==='NAD-05'&&<ClockVisual/>}
  {id==='NAD-07'&&<div className="em-audio"><div className="em-audio-head"><Symbol type="wave"/><span>UNVERIFIED MEMORY / AUDIO TRACE</span></div><Oscilloscope/><p>This trace does not establish the speaker's identity or their intent. Distinguish an allegation from an auditable test record.</p></div>}
  {id==='NAD-08'&&<div className="em-dimension"><Symbol type="units"/><span>IMPULSE</span><strong>FORCE × TIME</strong><div><b>lbf × s</b><Symbol type="arrow"/><b>N × s</b></div><p>The dimensional structure must be preserved when converting between unit systems.</p></div>}
 </section>
}
