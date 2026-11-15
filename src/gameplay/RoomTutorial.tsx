import {useEffect,useRef,useState,type CSSProperties} from 'react'
import type {ArchiveCaseId} from '../archive/evidenceRecords'
import {interventionFor} from './pastInterventions'
import type {PastRoomId} from './pastTimeline'
import './roomTutorial.css'

/** First-visit, skippable walkthrough. Each tip is anchored to an actual
 * clickable scene object, not to a fixed screen position.
 */
const STORE='astral-room-tutorial-v3'
const PREVIOUS='astral-room-tutorial-v2'
type TourKey='investigation'|'archive'|'signal'|'recordings'|'past-manufacturing'|'past-mission_target'|'past-data_analysis'|'past-resources_review'
type TourSave={seen:TourKey[];skipAll:boolean}
type Tip={title:string;copy:string;target:string;label:string}
const obj=(id:string)=>'.idr-layer-object[data-tutorial-target="'+id+'"]'
const prop=(id:string)=>'.sr-anchor-target[data-object-id="'+id+'"]'
const past=(id:string)=>'.sr-past-target[data-object-id="'+id+'"]'
const TOURS:Record<Exclude<TourKey,`past-${string}`>,readonly Tip[]>={
 investigation:[
  {title:'YOUR FIRST ASSIGNMENT',label:'Center terminal',target:obj('center_terminal'),copy:'You are Henda, an aerospace investigator. Open this terminal to learn why five missions need your help.'},
  {title:'EVIDENCE BOARD',label:'Evidence board',target:obj('evidence_board'),copy:'Inspect this board to recover a real case document from the fictional archive. Read it, listen or watch if media is available, then collect it immediately.'},
  {title:'MISSION FILES',label:'Mission file cabinet',target:obj('mission_files'),copy:'Use the folders to organize collected sheets. The locations of undiscovered clues remain secret. Collect any six of a case’s eight records to unlock its Rescue.'},
  {title:'EXPLORE THE STATION',label:'Station door',target:obj('station_door'),copy:'The door leads to Archive, Signal and Recordings. Each room contains clues to uncover. You can skip every tutorial at any time.'},
 ],
 archive:[
  {title:'MISSION ARCHIVE',label:'Archive shelves',target:prop('archive_shelving'),copy:'This shelving holds recovered mission documents. Open the source index and collect the records directly. There are no quizzes.'},
  {title:'ARCHIVE TERMINAL',label:'Archive main terminal',target:prop('archive_main_terminal'),copy:'This terminal also contains a Nadir record. Inspect equipment to learn the story, then return to the station whenever you want.'},
 ],
 signal:[
  {title:'SIGNAL RECORDS',label:'Signal display',target:prop('main_signal_display'),copy:'The display contains technical signals. Read the context and collect the document; no calculations or numerical answers.'},
  {title:'MISSION SIGNAL INDEX',label:'Telemetry workstation',target:prop('telemetry_console_left'),copy:'The left workstation contains signal files from other missions. Follow the room hotspots to inspect and collect more evidence.'},
 ],
 recordings:[
  {title:'PLAYBACK ARCHIVE',label:'Video display',target:prop('main_video_display'),copy:'The display contains recovered event records. Play video or audio if attached and collect the sheet when ready.'},
  {title:'AUDIO ANALYSIS TERMINAL',label:'Audio terminal',target:prop('audio_analysis_terminal'),copy:'Use the audio terminal to browse other mission recordings. Mute, replay and skip controls are optional; collection is immediate.'},
 ],
}
function currentTour(key:TourKey,caseId?:ArchiveCaseId|null):readonly Tip[]{
 if(!key.startsWith('past-'))return TOURS[key as keyof typeof TOURS]
 const room=key.slice(5) as PastRoomId
 const target=caseId?interventionFor(caseId,room):null
 const label=target?.system??'Engineering equipment'
 const anchor=target?.objectId??(room==='manufacturing'?'materials_structure':room==='mission_target'?'mission_constraints':room==='data_analysis'?'analysis_console':'resource_allocation')
 return [
  {title:'BACK BEFORE THE FAILURE',label,target:past(anchor),copy:'You have traveled into the mission’s past. Instead of answering a quiz, operate the equipment highlighted here and make an engineering change based on what you learned.'},
  {title:'DECISIONS HAVE CONSEQUENCES',label,target:past(anchor),copy:'Each configuration has advantages and risks. Try a plan, observe the system response, and revisit other rooms. You can change decisions freely before reviewing the complete rescue.'},
 ]
}
function read():TourSave{
 try{
  const data=JSON.parse(localStorage.getItem(STORE)??'null') as Partial<TourSave>|null
  if(data&&Array.isArray(data.seen))return {seen:data.seen.filter((x):x is TourKey=>typeof x==='string'),skipAll:data.skipAll===true}
  // Previous Skip All was a deliberate choice: respect it, but otherwise offer
  // the newly redesigned, anchored walkthrough to existing players once.
  const old=JSON.parse(localStorage.getItem(PREVIOUS)??'null') as Partial<TourSave>|null
  if(old?.skipAll)return {seen:[],skipAll:true}
 }catch{/* disabled storage */}
 return {seen:[],skipAll:false}
}
function save(next:TourSave){try{localStorage.setItem(STORE,JSON.stringify(next))}catch{/* optional UI state */}}
type Position={left:number;top:number;side:'top'|'bottom'|'right'|'left';target:CSSProperties}
export default function RoomTutorial({roomKey,caseId}:{roomKey:TourKey|null;caseId?:ArchiveCaseId|null}){
 const [step,setStep]=useState(0)
 const [visible,setVisible]=useState(false)
 const [position,setPosition]=useState<Position|null>(null)
 const cardRef=useRef<HTMLElement>(null)
 const steps=roomKey?currentTour(roomKey,caseId):[]
 const targetSelector=steps[step]?.target
 useEffect(()=>{
  setStep(0)
  if(!roomKey){setVisible(false);return}
  const state=read()
  if(state.skipAll||state.seen.includes(roomKey)){setVisible(false);return}
  save({...state,seen:[...state.seen,roomKey]})
  setVisible(true)
 },[roomKey])
 useEffect(()=>{
  if(!visible||!targetSelector){setPosition(null);return}
  let frame=0
  let target:HTMLElement|null=null
  let observer:ResizeObserver|null=null
  const place=()=>{
   const element=document.querySelector<HTMLElement>(targetSelector)
   if(element!==target){
    observer?.disconnect();target=element
    if(element&&typeof ResizeObserver!=='undefined'){
     observer=new ResizeObserver(schedule);observer.observe(element)
    }
   }
   if(!element){setPosition(null);return}
   const r=element.getBoundingClientRect()
   if(r.width<5||r.height<5){setPosition(null);return}
   const vw=window.innerWidth,vh=window.innerHeight
   const w=Math.min(340,vw-20)
   const h=cardRef.current?.getBoundingClientRect().height??174
   const gap=15
   const centerX=r.left+r.width/2,centerY=r.top+r.height/2
   let left=Math.max(10,Math.min(vw-w-10,centerX-w/2))
   let top=0,side:Position['side']='top'
   if(r.top>=h+gap+10){top=r.top-h-gap}
   else if(r.bottom+h+gap<=vh-8){top=r.bottom+gap;side='bottom'}
   else if(r.right+w+gap<=vw-10){left=r.right+gap;top=Math.max(10,Math.min(vh-h-10,centerY-h/2));side='right'}
   else if(r.left>=w+gap+10){left=r.left-w-gap;top=Math.max(10,Math.min(vh-h-10,centerY-h/2));side='left'}
   else{top=Math.max(8,Math.min(vh-h-8,r.top-h-gap));side='top'}
   setPosition({left:Math.round(left),top:Math.round(top),side,
    target:{left:r.left-4,top:r.top-4,width:r.width+8,height:r.height+8}})
  }
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(place)}
  const mutations=new MutationObserver(schedule)
  mutations.observe(document.getElementById('root')??document.body,{childList:true,subtree:true})
  window.addEventListener('resize',schedule)
  window.addEventListener('scroll',schedule,true)
  window.visualViewport?.addEventListener('resize',schedule)
  schedule()
  return ()=>{
   cancelAnimationFrame(frame);mutations.disconnect();observer?.disconnect()
   window.removeEventListener('resize',schedule);window.removeEventListener('scroll',schedule,true)
   window.visualViewport?.removeEventListener('resize',schedule)
  }
 },[visible,targetSelector,roomKey,step])
 if(!roomKey||!visible)return null
 const tip=steps[step]
 function next(){if(step+1>=steps.length)setVisible(false);else{setStep(n=>n+1);setPosition(null)}}
 function skipAll(){const prior=read();save({...prior,skipAll:true});setVisible(false)}
 return <>
  {position&&<div className="rt-target-ring" aria-hidden="true" style={position.target}/>}
  <aside ref={cardRef} className={'rt-bubble rt-anchored'+(position?' rt-side-'+position.side:' rt-finding')}
    style={position?{left:position.left,top:position.top}:undefined}
    role="complementary" aria-label="Optional room tutorial">
   <header><small>GUIDED TOUR · {step+1}/{steps.length}</small><button type="button" onClick={skipAll} aria-label="Skip all room tutorials">SKIP ALL</button></header>
   <span className="rt-target-label">FOCUS · {tip.label}</span>
   <h2>{tip.title}</h2><p>{tip.copy}</p>
   <footer><span>First visit only</span><button type="button" onClick={next}>{step+1<steps.length?'NEXT':'START EXPLORING'} →</button></footer>
  </aside>
 </>
}
export type {TourKey}
