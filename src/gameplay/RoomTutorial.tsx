import {useEffect,useState} from 'react'
import './roomTutorial.css'

/** Short, dismissible first-visit tips. Skip All permanently stops new tips;
 * no tutorial blocks the game, alters evidence, or repeats on revisits.
 */
const STORE='astral-room-tutorial-v2'
type TourKey='investigation'|'archive'|'signal'|'recordings'|'past-manufacturing'|'past-mission_target'|'past-data_analysis'|'past-resources_review'
type TourSave={seen:TourKey[];skipAll:boolean}
const TOURS:Record<TourKey,readonly {title:string;copy:string}[]>={
 investigation:[
  {title:'WELCOME, INVESTIGATOR HENDA',copy:'Five fictional space missions need your help. Explore the Astral Archives, recover their lost evidence, sort the records, then travel into the past to change their stories.'},
  {title:'THE EVIDENCE BOARD',copy:'Tap the Evidence Board to inspect the first record. Read, listen or watch, then press COLLECT EVIDENCE. There are no quizzes, calculations or wrong answers.'},
  {title:'YOUR MISSION FOLDERS',copy:'Explore Archive, Recordings and Signal for more evidence. File recovered records in their Mission Folders if you want to organize them. Collect any six of the mission’s eight records to unlock RESCUE MISSION; no specific papers or filing are required.'},
 ],
 archive:[{title:'ARCHIVE ROOM',copy:'Open the archive shelves and records. Tap a file, read its story and collect it directly. Use Mission Folders to organize the clues.'}],
 signal:[{title:'SIGNAL ROOM',copy:'The signal displays contain recovered mission records. Inspect and collect any evidence you find; no calculations or technical tests are needed.'}],
 recordings:[{title:'RECORDINGS ROOM',copy:'Explore recovered communications. Open a record to play its video or voice recording when available, then collect the sheet. Audio and video controls are optional.'}],
 'past-manufacturing':[{title:'YOU HAVE RETURNED TO THE PAST',copy:'You are seeing the mission before its fictional failure. The clues you collected reveal what went wrong. Explore these past rooms and enter RESCUE when you are ready to change its future.'}],
 'past-mission_target':[{title:'MISSION TARGET · PAST',copy:'Explore the destination, mission goals and design constraints. Your evidence is already saved; you do not need to solve anything here.'}],
 'past-data_analysis':[{title:'DATA ANALYSIS · PAST',copy:'These are the mission records before the outcome changed. Explore the room and continue toward Rescue when you are ready.'}],
 'past-resources_review':[{title:'RESOURCES REVIEW · PAST',copy:'Review materials, power and logistics in the mission timeline. When ready, enter the Rescue story and see the alternate outcome.'}],
}
function read():TourSave{
 try{
  const data=JSON.parse(localStorage.getItem(STORE)??'null') as Partial<TourSave>|null
  if(data&&Array.isArray(data.seen))return {seen:data.seen.filter((x):x is TourKey=>typeof x==='string'&&x in TOURS),skipAll:data.skipAll===true}
 }catch{/* Disabled local storage */}
 return {seen:[],skipAll:false}
}
function save(next:TourSave){try{localStorage.setItem(STORE,JSON.stringify(next))}catch{/* Optional tutorial progress */}}
export default function RoomTutorial({roomKey}:{roomKey:TourKey|null}){
 const [step,setStep]=useState(0)
 const [visible,setVisible]=useState(false)
 useEffect(()=>{
  setStep(0)
  if(!roomKey){setVisible(false);return}
  const state=read()
  if(state.skipAll||state.seen.includes(roomKey)){setVisible(false);return}
  // Mark the entry as visited immediately; leave the tutorial skippable.
  save({...state,seen:[...state.seen,roomKey]})
  setVisible(true)
 },[roomKey])
 if(!roomKey||!visible)return null
 const steps=TOURS[roomKey]
 function next(){if(step+1>=steps.length)setVisible(false);else setStep(n=>n+1)}
 function skipAll(){const prior=read();save({...prior,skipAll:true});setVisible(false)}
 return <aside className={'rt-bubble rt-'+(roomKey.startsWith('past-')?'past':roomKey)} role="complementary" aria-label="Optional room tutorial">
  <header><small>GUIDED TOUR · {step+1}/{steps.length}</small><button type="button" onClick={skipAll} aria-label="Skip all room tutorials">SKIP ALL</button></header>
  <h2>{steps[step].title}</h2><p>{steps[step].copy}</p>
  <footer><span>Only shown on your first visit</span><button type="button" onClick={next}>{step+1<steps.length?'NEXT':'START EXPLORING'} →</button></footer>
 </aside>
}
export type {TourKey}
