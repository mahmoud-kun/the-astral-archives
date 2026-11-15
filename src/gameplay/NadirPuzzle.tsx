import {useEffect} from 'react'
import {NADIR_CHALLENGES,inspectNadir,type NadirRecord} from './nadirEngine'
import {updateNadir} from './gameSave'
import SimpleEvidenceInspector from './SimpleEvidenceInspector'

/** Historical name retained for existing room/board imports; no puzzle appears. */
export default function NadirPuzzle({id,onClose}:{id:NadirRecord;onClose:()=>void}){
 useEffect(()=>{updateNadir(current=>inspectNadir(current,id))},[id])
 const source=NADIR_CHALLENGES[id]
 return <SimpleEvidenceInspector id={id} scene={source.objective} fragments={source.fragments} onClose={onClose}/>
}
