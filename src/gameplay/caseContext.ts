import { OTHER_CASE_IDS, type OtherCaseId } from './caseEvidenceEngine.ts'

/** UI-only active dossier preference. Not a science result, Rescue gate or evidence save. */
export const ACTIVE_CASE_KEY='astral-active-mission-v1'
export const ACTIVE_CASE_EVENT='astral:active-mission-changed'

export function isOtherCaseId(value:unknown):value is OtherCaseId{
 return typeof value==='string'&&OTHER_CASE_IDS.some(code=>code===value)
}
export function readActiveCase():OtherCaseId|null{
 if(typeof window==='undefined')return null
 try{
  const code=window.localStorage.getItem(ACTIVE_CASE_KEY)
  return isOtherCaseId(code)?code:null
 }catch{return null}
}
export function setActiveCase(code:OtherCaseId):void{
 if(!isOtherCaseId(code)||typeof window==='undefined')return
 try{window.localStorage.setItem(ACTIVE_CASE_KEY,code)}catch{/* Private storage optional. */}
 window.dispatchEvent(new Event(ACTIVE_CASE_EVENT))
}
