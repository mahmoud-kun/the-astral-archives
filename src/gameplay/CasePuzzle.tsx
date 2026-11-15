import {useEffect} from 'react'
import {CASE_EVIDENCE_TASKS,inspectOther,type OtherRecordId} from './caseEvidenceEngine'
import {updateOtherProgress} from './caseSave'
import SimpleEvidenceInspector from './SimpleEvidenceInspector'

/** Preserve source-index entrypoint, but remove every question and verification. */
export default function CasePuzzle({id,onClose}:{id:OtherRecordId;onClose:()=>void}){
 useEffect(()=>{updateOtherProgress(current=>inspectOther(current,id))},[id])
 const source=CASE_EVIDENCE_TASKS[id]
 return <SimpleEvidenceInspector id={id} scene={source.scene} fragments={source.fragments} onClose={onClose}/>
}
