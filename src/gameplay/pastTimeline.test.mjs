import {test} from 'node:test'
import assert from 'node:assert/strict'
import {PAST_CASES,PAST_STAGES,isPastCaseId,isPastRoomId,pastRoute} from './pastTimeline.ts'
test('Past room IDs are stable and unknown room routes are rejected',()=>{
 assert.deepEqual(PAST_STAGES.map(x=>x.id),['manufacturing','mission_target','data_analysis','resources_review'])
 for(const x of PAST_STAGES)assert.equal(isPastRoomId(x.id),true)
 for(const x of ['',null,'archives','../manufacturing','manufacturing&debug=1'])assert.equal(isPastRoomId(x),false)
})
test('Five case IDs are allowlisted and route construction adds no debug access',()=>{
 assert.deepEqual([...PAST_CASES],['KES','NAD','LUM','ORI','AST'])
 for(const c of PAST_CASES)for(const stage of PAST_STAGES){
  assert.equal(isPastCaseId(c),true)
  const url=new URL(pastRoute(c,stage.id),'https://example.test/')
  assert.equal(url.searchParams.get('case'),c)
  assert.equal(url.searchParams.get('past'),stage.id)
  assert.equal(url.searchParams.get('rescue'),null)
  assert.equal(url.searchParams.get('debug'),null)
 }
 for(const x of ['',null,'NADX','nad','KES?debug=1'])assert.equal(isPastCaseId(x),false)
})
