import {test} from 'node:test'
import assert from 'node:assert/strict'
import {EVIDENCE_RECORDS,CASE_CODES} from '../archive/evidenceRecords.ts'
import {CASE_STORY_ARCS,getRevealedConnections,focusStoryConnections} from './caseStoryThreads.ts'

test('Each of the five cases has eight unique source-grounded clues joined into four narrative links',()=>{
 const known=new Map(EVIDENCE_RECORDS.map(r=>[r.id,r]))
 assert.deepEqual(Object.keys(CASE_STORY_ARCS),[...CASE_CODES])
 for(const code of CASE_CODES){
  const arc=CASE_STORY_ARCS[code]
  assert.ok(arc.title.length>10&&arc.opening.length>40&&arc.stakes.length>20)
  assert.equal(arc.links.length,4,code)
  const ids=arc.links.flatMap(link=>link.ids)
  assert.equal(new Set(ids).size,8,code+' evidence must be uniquely paired')
  assert.deepEqual([...ids].sort(),EVIDENCE_RECORDS.filter(r=>r.caseId===code).map(r=>r.id).sort())
  for(const link of arc.links){
   assert.ok(link.reveal.length>40&&link.tension.length>25)
   for(const id of link.ids)assert.equal(known.get(id)?.caseId,code)
  }
 }
})

test('No undiscovered record title or link is leaked; collection order never matters',()=>{
 for(const code of CASE_CODES){
  const arc=CASE_STORY_ARCS[code]
  const first=arc.links[0].ids
  assert.equal(getRevealedConnections(code,[]).length,0)
  assert.equal(getRevealedConnections(code,[first[0]]).length,0)
  assert.equal(getRevealedConnections(code,[first[1]]).length,0)
  assert.equal(getRevealedConnections(code,[...first]).length,1)
  assert.deepEqual(getRevealedConnections(code,[first[1],first[0]]).map(x=>x.label),[arc.links[0].label])
  assert.equal(focusStoryConnections(code,first[0],[...first]).length,1)
  assert.equal(focusStoryConnections(code,first[0],[first[0]]).length,0)
 }
})

test('Any six of eight case records reveal at least two story connections without adding any rescue gate',()=>{
 for(const code of CASE_CODES){
  const eight=EVIDENCE_RECORDS.filter(r=>r.caseId===code).map(r=>r.id)
  for(let excluded=0;excluded<8;excluded++){
   for(let other=excluded+1;other<8;other++){
    const six=eight.filter((_,i)=>i!==excluded&&i!==other)
    assert.ok(getRevealedConnections(code,six).length>=2,code+' '+excluded+','+other)
   }
  }
 }
})
