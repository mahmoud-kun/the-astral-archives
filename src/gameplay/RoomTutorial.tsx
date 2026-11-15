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
type TourKey='investigation'|'archive'|'signal'|'recordings'|'folders'|'past-manufacturing'|'past-mission_target'|'past-data_analysis'|'past-resources_review'
type TourSave={seen:TourKey[];skipAll:boolean}
type Tip={title:string;copy:string;target:string;label:string}
const obj=(id:string)=>'.idr-layer-object[data-tutorial-target="'+id+'"]'
const prop=(id:string)=>'.sr-anchor-target[data-object-id="'+id+'"]'
const past=(id:string)=>'.sr-past-target[data-object-id="'+id+'"]'
const TOURS:Record<Exclude<TourKey,`past-${string}`>,readonly Tip[]>={
 investigation:[
  {title:'YOUR FIRST ASSIGNMENT',label:'Center terminal',target:obj('center_terminal'),copy:'You are Henda. Your job is to uncover the science behind five fictional mission failures, then travel back and make engineering decisions that could change their outcomes.'},
  {title:'EXAMINE AND COLLECT',label:'Evidence board',target:obj('evidence_board'),copy:'Tap this board to open recovered case documents. Each source is a sheet you can read, play, or listen to. Press COLLECT EVIDENCE to keep it — no questions or calculations.'},
  {title:'SORT YOUR FINDINGS',label:'Mission file cabinet',target:obj('mission_files'),copy:'Every collected sheet can be filed or moved between Mission Folders. Wrong filing is reversible. Collecting any six of the eight records belonging to one case unlocks its Rescue.'},
  {title:'KNOW WHEN TO RESCUE',label:'Rescue console',target:obj('right_console'),copy:'This console opens the rescue when the case is ready. Before time travel you’ll see a short interactive recap of what you learned from your collected evidence.'},
  {title:'FOLLOW THE CLUES',label:'Station door',target:obj('station_door'),copy:'Explore Archive, Signal and Recordings. Evidence is spread across multiple real objects, not stored in one terminal. Follow the highlights to discover more.'},
 ],
 archive:[
  {title:'EXPLORE ARCHIVED FILES',label:'Archive shelves',target:prop('archive_shelving'),copy:'This shelf contains one set of physical case records. Pick a mission, inspect the sheets and collect them without solving a quiz.'},
  {title:'NOT EVERY SOURCE IS ON THE SAME DEVICE',label:'Archive main terminal',target:prop('archive_main_terminal'),copy:'Archive instruments can contain different records. The main terminal holds a Nadir record while the shelves host other missions. Try separate hotspots.'},
  {title:'RETURN WITH WHAT YOU FOUND',label:'Station navigation',target:'.sr-nav',copy:'You can visit the other rooms in any order. Collected evidence stays saved, and you can file it in a Mission Folder whenever you want.'},
 ],
 signal:[
  {title:'READ THE TELEMETRY',label:'Signal display',target:prop('main_signal_display'),copy:'Read the signal as part of the mission story, not a math exam. The first display holds one Nadir source.'},
  {title:'INSPECT INDEPENDENT SIGNALS',label:'Telemetry workstation',target:prop('telemetry_console_left'),copy:'The left workstation contains a separate set of other-case records. Open the recovered files and collect what you need.'},
  {title:'ANOTHER SIGNAL SOURCE',label:'Right telemetry workstation',target:prop('telemetry_console_right'),copy:'This second workstation has different source records. Look around the whole room rather than assuming all signals are in the first display.'},
 ],
 folders:[
  {title:'CHOOSE A CASE',label:'Mission folders',target:'.af-folder-choice',copy:'Each folder belongs to one fictional space mission. You can open them in any order and return to a case whenever you want.'},
  {title:'YOUR COLLECTED SHEETS',label:'Dossier contents',target:'.af-sheet-area',copy:'The sheets visible in the folder are the records you chose to file here. You can open any one to review it, and you can move a misplaced sheet later.'},
  {title:'FILE THE RECOVERED EVIDENCE',label:'Unfiled tray',target:'.af-bottom button',copy:'Use this tray to sort newly collected sheets. Filing is optional for the Rescue gate, and no filing mistake destroys a record.'},
  {title:'PREPARE FOR THE PAST',label:'Rescue status',target:'.af-status',copy:'When you collect six of this case’s eight records, Rescue unlocks. Press its button for an interactive summary of what you learned, then choose when to travel to the past.'},
 ],
 recordings:[
  {title:'WATCH THE CHRONOLOGY',label:'Video display',target:prop('main_video_display'),copy:'Inspect the recovered event sequence. When a video or voice clip is attached, use the player; listening is optional and never blocks collection.'},
  {title:'HEAR THE OTHER MISSIONS',label:'Audio terminal',target:prop('audio_analysis_terminal'),copy:'The audio terminal holds separate mission records. Play, pause or mute at your own pace, then collect the evidence directly.'},
  {title:'EXPLORE A SECOND PLAYBACK STATION',label:'Playback controls',target:prop('video_playback_console'),copy:'The video console has more recovered records that are not all listed at the audio terminal. Explore different objects to complete your case.'},
 ],
}
function currentTour(key:TourKey,caseId?:ArchiveCaseId|null):readonly Tip[]{
 if(!key.startsWith('past-'))return TOURS[key as keyof typeof TOURS]
 const room=key.slice(5) as PastRoomId
 const target=caseId?interventionFor(caseId,room):null
 const label=target?.system??'Engineering equipment'
 const anchor=target?.objectId??(room==='manufacturing'?'materials_structure':room==='mission_target'?'mission_constraints':room==='data_analysis'?'analysis_console':'resource_allocation')
 return [
  {title:'THE MISSION IS STILL IN YOUR HANDS',label,target:past(anchor),copy:'You are now before the fictional mission failure. Tap this system to change its configuration using the science you learned in the archive.'},
  {title:'EACH CHOICE HAS A TRADE-OFF',label,target:past(anchor),copy:'Different solutions can work and each changes the system in a different way. Read the consequence, and change your configuration again whenever you want.'},
  {title:'FOUR CONNECTED SYSTEMS',label:'Past room stages',target:'.pt-nav',copy:'Travel freely between the four Past rooms. Your design choices are saved, and the right plan is more than four unrelated clicks.'},
  {title:'REVIEW THE WHOLE MISSION',label:'Mission review console',target:'.pt-rescue',copy:'When ready, review your combined engineering plan. The report shows any remaining risks before you finalize the alternate Rescue.'},
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
 // The room may change before the first-visit effect resets the old step.
 const safeStep=Math.min(step,Math.max(steps.length-1,0))
 const targetSelector=steps[safeStep]?.target
 useEffect(()=>{
  setStep(0)
  if(!roomKey){setVisible(false);return}
  const state=read()
  if(state.skipAll||state.seen.includes(roomKey)){setVisible(false);return}
  save({...state,seen:[...state.seen,roomKey]})
  setVisible(true)
 },[roomKey])
 useEffect(()=>{
  const replay=()=>{
   if(!roomKey)return
   save({seen:[roomKey],skipAll:false})
   setStep(0);setPosition(null);setVisible(true)
  }
  window.addEventListener('astral:replay-tutorial',replay)
  return ()=>window.removeEventListener('astral:replay-tutorial',replay)
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
 },[visible,targetSelector,roomKey,safeStep])
 if(!roomKey||!visible)return null
 const tip=steps[safeStep]
 function next(){if(safeStep+1>=steps.length)setVisible(false);else{setStep(safeStep+1);setPosition(null)}}
 function skipAll(){const prior=read();save({...prior,skipAll:true});setVisible(false)}
 return <>
  {position&&<div className="rt-target-ring" aria-hidden="true" style={position.target}/>}
  <aside ref={cardRef} className={'rt-bubble rt-anchored'+(position?' rt-side-'+position.side:' rt-finding')}
    style={position?{left:position.left,top:position.top}:undefined}
    role="complementary" aria-label="Optional room tutorial">
   <header><small>GUIDED TOUR · {safeStep+1}/{steps.length}</small><button type="button" onClick={skipAll} aria-label="Skip all room tutorials">SKIP ALL</button></header>
   <span className="rt-target-label">FOCUS · {tip.label}</span>
   <h2>{tip.title}</h2><p>{tip.copy}</p>
   <footer><span>First visit only</span><button type="button" onClick={next}>{safeStep+1<steps.length?'NEXT':'START EXPLORING'} →</button></footer>
  </aside>
 </>
}
export type {TourKey}
