import type { OtherCaseId } from './caseEvidenceEngine'
import type { RescueInputField } from './caseRescueEngine'

const architecture=[
 {id:'original',name:'KEEP ORIGINAL',stats:'1,010 kg · 690 W · $278m',note:'Full high-detail science; exceeds original limits'},
 {id:'descope',name:'DEFER DETAIL IMAGER',stats:'890 kg · 590 W · $239m',note:'Preserve event science; reduce follow-up detail'},
 {id:'heavy',name:'LATER HEAVY LAUNCH',stats:'1,010 kg · 690 W · $316m',note:'New launch study, higher cost and later window'},
] as const
const duty=[
 {id:'parallel',name:'CONCURRENT MODES',watts:'520 W observed',note:'Original tested combination exceeds the 480 W bus cap'},
 {id:'stagger',name:'STAGGER MODES',watts:'450 W synthetic rerun',note:'Reduced observation duty; new independent test required'},
] as const

export default function CaseRescueControl({caseId,field,value,disabled,onChange}:{
 caseId:OtherCaseId;field:RescueInputField;value:string;disabled:boolean;onChange:(next:string)=>void
}){
 if(caseId==='KES'&&field.key==='architecture'){
  return <fieldset className="cw-control-board" disabled={disabled}><legend>SPACECRAFT OPTION CARDS</legend>
   <div className="cw-option-cards">{architecture.map(o=><button type="button" key={o.id} aria-pressed={value===o.id} onClick={()=>onChange(o.id)} disabled={disabled}>
    <strong>{o.name}</strong><b>{o.stats}</b><small>{o.note}</small></button>)}</div>
   <p>The real trade includes launcher availability and science coverage; these cards alone do not clear the review gate.</p>
  </fieldset>
 }
 if(caseId==='AST'&&field.key==='mode'){
  return <fieldset className="cw-control-board" disabled={disabled}><legend>POWER BUS MODE SCHEDULER</legend>
   <div className="cw-option-cards">{duty.map(o=><button type="button" key={o.id} aria-pressed={value===o.id} onClick={()=>onChange(o.id)} disabled={disabled}>
    <strong>{o.name}</strong><b>{o.watts}</b><small>{o.note}</small></button>)}</div>
   <p>Both values are fictional model/test figures. A mode change must be verified separately from the forecast.</p>
  </fieldset>
 }
 if(caseId==='LUM'&&field.key==='fixture'){
  const numeric=value.trim()&&Number.isFinite(Number(value))?Number(value):100.8
  const minus=()=>onChange((Math.round((numeric-0.1)*10)/10).toFixed(1))
  const plus=()=>onChange((Math.round((numeric+0.1)*10)/10).toFixed(1))
  return <fieldset className="cw-control-board" disabled={disabled}><legend>CALIBRATION MICROMETER</legend>
   <p>RAW: 100.8 mm · DESIGN: 100.0 mm. Adjust the training fixture; this is not a certified flight tolerance.</p>
   <div className="cw-adjuster"><button type="button" disabled={disabled} onClick={minus} aria-label="Decrease fictional fixture spacing by 0.1 millimetre">−</button>
    <label>Fixture setting (mm)<input type="number" inputMode="decimal" step=".1" disabled={disabled} value={value||'100.8'} onChange={e=>onChange(e.target.value)}/></label>
    <button type="button" disabled={disabled} onClick={plus} aria-label="Increase fictional fixture spacing by 0.1 millimetre">+</button></div>
  </fieldset>
 }
 if(caseId==='ORI'&&field.key==='debounce'){
  return <fieldset className="cw-control-board" disabled={disabled}><legend>TOUCHDOWN SIGNAL FILTER</legend>
   <label>{field.label}<input type="range" min="50" max="600" step="10" disabled={disabled} value={value||'80'} onChange={e=>onChange(e.target.value)} aria-label={field.label}/></label>
   <div className="cw-filter-stats"><strong>{value||'80'} ms</strong><span>LEG PULSE: 80 ms</span><span>NOMINAL CONTACT: 450 ms</span></div>
   <p>Filter persistence alone is insufficient. Test contact corroboration, radar and missing-sensor recovery.</p>
  </fieldset>
 }
 return <label className="cw-control-field">{field.label}
  {field.kind==='number'
   ?<input type="number" inputMode="decimal" step="any" disabled={disabled} value={value} onChange={e=>onChange(e.target.value)} aria-label={field.label+(field.unit?' ('+field.unit+')':'')}/>
   :<select disabled={disabled} value={value} onChange={e=>onChange(e.target.value)}>
    {field.options?.map(([v,name])=><option key={v||'empty'} value={v}>{name}</option>)}</select>}
 </label>
}
