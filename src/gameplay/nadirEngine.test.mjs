import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVIDENCE_RECORDS } from '../archive/evidenceRecords.ts'
import {
 NADIR_IDS, NADIR_CHALLENGES, NADIR_ROOM, REQUIRED_NADIR, emptyNadir,
 restoreNadir, inspectNadir, hintNadir, solveNadir, stationRoute, verifyRescuePlan
} from './nadirEngine.ts'

const impulse={source:'lbfs',target:'ns',converted:'53.38'}
const transcript={first:'export',second:'residual',third:'email',fourth:'closure'}

test('Nadir uses all eight exact authored records and the four defined station rooms',()=>{
 assert.equal(NADIR_IDS.length,8)
 assert.equal(REQUIRED_NADIR.length,6)
 assert.deepEqual([...new Set(NADIR_IDS)].sort(),NADIR_IDS.slice().sort())
 for(const id of NADIR_IDS){
  assert.ok(EVIDENCE_RECORDS.some(x=>x.id===id))
  assert.equal(NADIR_CHALLENGES[id].id,id)
  assert.ok(['investigation','archive','signal','recordings'].includes(NADIR_ROOM[id]))
 }
 assert.equal(stationRoute('investigation'),'/?room=1')
 assert.equal(stationRoute('signal'),'/?station=signal')
})

test('inspection and hints do not automatically collect or solve any record',()=>{
 const empty=emptyNadir()
 const next=inspectNadir(empty,'NAD-02')
 assert.deepEqual(next.inspected,['NAD-02'])
 assert.deepEqual(next.solved,[])
 const hint=hintNadir(hintNadir(hintNadir(empty,'NAD-02'),'NAD-02'),'NAD-02')
 assert.equal(hint.hints['NAD-02'],2)
 assert.equal(hint.solved.length,0)
})

test('impulse requires proper dimensional conversion, not numeric copy or wrong units',()=>{
 let r=solveNadir(emptyNadir(),'NAD-02',{source:'lbfs',target:'ns',converted:'12'})
 assert.equal(r.ok,false)
 assert.equal(r.next.attempts['NAD-02'],1)
 r=solveNadir(r.next,'NAD-02',{source:'lbfs',target:'lbfs',converted:'53.37865938'})
 assert.equal(r.ok,false)
 r=solveNadir(r.next,'NAD-02',impulse)
 assert.equal(r.ok,true)
 assert.deepEqual(r.next.solved,['NAD-02'])
 assert.equal(solveNadir(r.next,'NAD-02',{}).next,r.next)
})

test('trajectory reconciliation is locked until conversion and rejects mechanical-failure shortcut',()=>{
 const a=solveNadir(emptyNadir(),'NAD-01',{hypothesis:'units',rerun:'53.38',comparison:'same'})
 assert.equal(a.ok,false)
 assert.equal(a.next.attempts['NAD-01'],undefined)
 const converted=solveNadir(emptyNadir(),'NAD-02',impulse).next
 const wrong=solveNadir(converted,'NAD-01',{hypothesis:'thruster',rerun:'53.38',comparison:'same'})
 assert.equal(wrong.ok,false)
 const right=solveNadir(wrong.next,'NAD-01',{hypothesis:'units',rerun:'53.38',comparison:'same'})
 assert.equal(right.ok,true)
})

test('interface contract requires prior producer/consumer chain and automated verification',()=>{
 const premature=solveNadir(emptyNadir(),'NAD-03',{canonical:'ns',owner:'producer',verification:'rerun'})
 assert.equal(premature.ok,false)
 const traced=solveNadir(emptyNadir(),'NAD-04',{producer:'lbfs',consumer:'ns',failure:'contract'}).next
 assert.deepEqual(traced.solved,['NAD-04'])
 assert.equal(solveNadir(traced,'NAD-03',{canonical:'ns',owner:'both',verification:'rerun'}).ok,false)
 assert.equal(solveNadir(traced,'NAD-03',{canonical:'ns',owner:'producer',verification:'rerun'}).ok,true)
})

test('chronology requires NAV-042 audit and honors the engineer warning before closure',()=>{
 const blocked=solveNadir(emptyNadir(),'NAD-05',transcript)
 assert.equal(blocked.ok,false)
 const audited=solveNadir(emptyNadir(),'NAD-06',{proof:'rerun',risk:'administrative'}).next
 const wrong=solveNadir(audited,'NAD-05',{...transcript,third:'closure',fourth:'email'})
 assert.equal(wrong.ok,false)
 const done=solveNadir(wrong.next,'NAD-05',transcript)
 assert.equal(done.ok,true)
})

test('independent rescue vectors and interface ownership must all pass',()=>{
 const valid={canonical:'ns',converter:'producer',guard:'automated',first:'53.3787',second:'3.5586'}
 assert.equal(verifyRescuePlan(valid).passed,true)
 assert.equal(verifyRescuePlan({...valid,first:'12'}).passed,false)
 assert.equal(verifyRescuePlan({...valid,second:'0.8'}).passed,false)
 assert.equal(verifyRescuePlan({...valid,converter:'both'}).passed,false)
 assert.equal(verifyRescuePlan({...valid,guard:'meeting'}).passed,false)
 assert.equal(verifyRescuePlan({...valid,canonical:'n'}).passed,false)
})

test('saved investigation is constrained to known ids, valid hints and booleans',()=>{
 assert.deepEqual(restoreNadir('invalid'),emptyNadir())
 assert.deepEqual(restoreNadir('{"version":9}'),emptyNadir())
 const x=restoreNadir(JSON.stringify({
  version:1,inspected:['NAD-05','wrong'],solved:['NAD-02','NAD-02','bogus'],
  attempts:{'NAD-02':2,'NAD-03':-1},hints:{'NAD-02':8,'NAD-04':2},
  rescue:{submitted:'true',rerunPassed:true},
 }))
 assert.deepEqual(x.inspected,['NAD-05','NAD-02'])
 assert.deepEqual(x.solved,['NAD-02'])
 assert.equal(x.attempts['NAD-02'],2)
 assert.equal(x.attempts['NAD-03'],undefined)
 assert.equal(x.hints['NAD-02'],undefined)
 assert.equal(x.hints['NAD-04'],2)
 assert.equal(x.rescue.submitted,false)
 assert.equal(x.rescue.rerunPassed,true)
})
