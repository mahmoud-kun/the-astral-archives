/** Main acceptance: real UI journeys through all four newly produced cases.
 * Clean profiles, no debug=1, no direct programmatic save mutations.
 * The exported correct answers are test fixtures; each is entered through
 * the actual visible evidence/puzzle controls before manual collection.
 * Run with node --experimental-strip-types in a Chrome-capable CI runner.
 */
import {chromium} from 'playwright'
import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {EVIDENCE_RECORDS,CASE_META} from '../src/archive/evidenceRecords.ts'
import {CASE_EVIDENCE_TASKS,OTHER_CASE_IDS} from '../src/gameplay/caseEvidenceEngine.ts'
import {DIAGNOSIS_PROMPTS} from '../src/archive/archiveState.ts'
import {CASE_RESCUE_COPY} from '../src/gameplay/caseRescueEngine.ts'

const origin=process.env.VISUAL_QA_URL??'http://127.0.0.1:4173'
const selected=(process.env.CASE_E2E_IDS?.split(',').map(x=>x.trim().toUpperCase())??[...OTHER_CASE_IDS])
assert.ok(selected.length&&selected.every(id=>OTHER_CASE_IDS.includes(id)),'Allowed case IDs only')
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']})
const report={version:1,mode:'no-debug-user-interface',started:new Date().toISOString(),cases:[]}
const rooms={Archive:['/?station=archive','archive_shelving'],Signal:['/?station=signal','telemetry_console_left'],Recordings:['/?station=recordings','audio_analysis_terminal'],Investigation:['/?room=1',null]}
const happy={
 KES:{architecture:'descope',window:'replanned',slotEvidence:'verified',trajectory:'recalculated',science:'acknowledged',decision:'conditional'},
 LUM:{fixture:'100.0',reference:'independent',report:'raw',compensation:'disabled',opticalTest:'independent',decision:'rework'},
 ORI:{debounce:'300',contact:'independent',altitude:'near',fallback:'recheck',decision:'conditional'},
 AST:{mode:'stagger',retest:'independent',risk:'reopened',audit:'versioned',baseline:'revised',decision:'conditional'},
}
await mkdir('qa-artifacts',{recursive:true})

function requiredOrder(caseId){
 const pending=EVIDENCE_RECORDS.filter(x=>x.caseId===caseId&&x.required).map(x=>x.id)
 const result=[]
 while(pending.length){
  const index=pending.findIndex(id=>CASE_EVIDENCE_TASKS[id].requires.every(dep=>result.includes(dep)))
  assert.ok(index>=0,'Impossible dependency graph for '+caseId+': '+pending.join(','))
  result.push(pending.splice(index,1)[0])
 }
 assert.equal(result.length,6)
 return result
}
async function visitSourceDesk(page,caseId,room){
 const [url,prop]=rooms[room]
 await page.goto(origin+url,{waitUntil:'domcontentloaded'})
 if(room==='Investigation'){
  const desk=page.getByRole('button',{name:'Read Mission Briefing at center terminal'})
  await desk.waitFor()
  await desk.focus()
  await page.keyboard.press('Enter')
  await page.getByRole('button',{name:'OPEN CASE SOURCE INDEX'}).click()
 }else{
  await page.locator('.sr-prop-target[data-object-id="'+prop+'"]').click()
  await page.getByRole('button',{name:'OPEN MISSION SOURCE INDEX'}).click()
 }
 await page.locator('.cw-desk').waitFor({state:'visible'})
 await page.locator('.cw-case-tabs button').filter({hasText:caseId}).click()
}
async function inspectVerifyCollect(page,id){
 const task=CASE_EVIDENCE_TASKS[id]
 await page.locator('.cw-desk-record').filter({hasText:id}).click()
 await page.locator('.np-dialog').waitFor({state:'visible'})
 await page.locator('.np-source-drawer summary').first().click()
 await page.waitForFunction(()=>!!document.querySelector('.np-source-drawer[open]'),null,{timeout:5000})
 const form=page.locator('form[id="cw-analyze-'+id+'"]')
 let choiceIndex=0,numberIndex=0
 for(const field of task.fields){
  if(field.kind==='choice'){
   await form.locator('select').nth(choiceIndex++).selectOption(String(field.correct))
  }else{
   await form.locator('input[type="number"]').nth(numberIndex++).fill(String(field.correct))
  }
 }
 await form.getByRole('button',{name:'VERIFY RECONSTRUCTION'}).click()
 await page.locator('.np-success').waitFor({state:'visible'})
 assert.equal(await page.getByRole('button',{name:'COLLECT EVIDENCE · '+id}).count(),1)
 await page.getByRole('button',{name:'COLLECT EVIDENCE · '+id}).click()
 await page.waitForFunction(evidenceId=>{
  try{return JSON.parse(localStorage.getItem('astral-archive-folder-v1')||'{}').discovered?.includes(evidenceId)}catch{return false}
 },id)
 await page.getByRole('button',{name:'Close evidence analyzer'}).click()
 await page.locator('.np-dialog').waitFor({state:'detached'})
}
async function fileOne(page,id,target){
 await page.locator('.af-intake-items button').filter({hasText:id}).click()
 await page.locator('.af-document-modal').waitFor({state:'visible'})
 await page.locator('.af-file-select select').selectOption(target)
 await page.locator('.af-document-modal .af-primary').click()
 await page.locator('.af-document-modal').waitFor({state:'detached'})
}
async function chooseFolder(page,id){
 await page.locator('.af-folder-choice').filter({hasText:'CASE / '+id}).click()
}
async function fileSix(page,caseId,ids){
 await page.goto(origin+'/?folder-lab=1&return=investigation',{waitUntil:'domcontentloaded'})
 await chooseFolder(page,caseId)
 await page.locator('.af-bottom button').click()
 const before=await page.locator('.af-meter').getAttribute('aria-valuenow')
 assert.equal(before,'0','No evidence may auto-file before deliberate folder placement')
 // Deliberately make one reversible incorrect filing into Nadir.
 await fileOne(page,ids[0],'NAD')
 assert.equal(await page.locator('.af-meter').getAttribute('aria-valuenow'),'0','Wrong folder must be neutral')
 await chooseFolder(page,'NAD')
 await fileOne(page,ids[0],caseId)
 await chooseFolder(page,caseId)
 for(const id of ids.slice(1))await fileOne(page,id,caseId)
 assert.equal(await page.locator('.af-meter').getAttribute('aria-valuenow'),'6')
 await page.reload({waitUntil:'domcontentloaded'})
 await chooseFolder(page,caseId)
 assert.equal(await page.locator('.af-meter').getAttribute('aria-valuenow'),'6','All six filings must survive full reload')
 await page.getByRole('button',{name:'ENTER '+CASE_META[caseId].name.toUpperCase()+' RESCUE →'}).click()
 await page.locator('.cm-video').waitFor({state:'visible'})
 assert.equal(await page.locator('.cm-video').getAttribute('src'),'/assets/video/designer-time-travel-past-v1.mp4')
 await page.locator('.cm-actions .cm-primary').click()
 await page.locator('.pt-root').waitFor({state:'visible'})
 assert.match(page.url(),new RegExp('past=manufacturing.*case='+caseId))
 assert.equal(await page.locator('.pt-nav button').count(),4)
 await page.getByRole('button',{name:'ENTER RESCUE CONSOLE →'}).click()
 await page.locator('.cw-rescue').waitFor({state:'visible'})
 assert.match(page.url(),new RegExp('rescue='+caseId))
}
async function diagnose(page,caseId){
 const fields=page.locator('.nr-work').first().locator('fieldset')
 assert.equal(await fields.count(),3)
 for(const [i,part] of ['technical','process','consequence'].entries()){
  const entry=DIAGNOSIS_PROMPTS[caseId][part]
  await fields.nth(i).locator('select').nth(0).selectOption(entry.correct)
  await fields.nth(i).locator('select').nth(1).selectOption(entry.supports[0])
 }
 await page.getByRole('button',{name:'SUBMIT EVIDENCE-BACKED DIAGNOSIS'}).click()
 await page.locator('.nr-success').first().waitFor({state:'visible'})
}
async function engineer(page,caseId){
 const plan=happy[caseId]
 for(const field of CASE_RESCUE_COPY[caseId].fields){
  const value=String(plan[field.key])
  assert.notEqual(value,'undefined',caseId+' missing test fixture '+field.key)
  if(caseId==='KES'&&field.key==='architecture'){
   await page.getByRole('button',{name:/DEFER DETAIL IMAGER/}).click()
  }else if(caseId==='AST'&&field.key==='mode'){
   await page.getByRole('button',{name:/STAGGER MODES/}).click()
  }else if(caseId==='LUM'&&field.key==='fixture'){
   await page.locator('.cw-adjuster input[type="number"]').fill(value)
  }else if(caseId==='ORI'&&field.key==='debounce'){
   const slider=page.locator('.cw-control-board input[type="range"]')
   await slider.focus()
   await slider.press('Home')
   for(let i=0;i<25;i++)await slider.press('ArrowRight')
   assert.match(await page.locator('.cw-filter-stats strong').textContent(),/300/)
  }else{
   const control=page.locator('.cw-control-field').filter({hasText:field.label})
   if(field.kind==='number')await control.locator('input').fill(value)
   else await control.locator('select').selectOption(value)
  }
 }
 const simulate=page.getByRole('button',{name:'RUN FULL ENGINEERING TEST SUITE'})
 assert.equal(await simulate.isEnabled(),true)
 await simulate.click()
 assert.ok(await page.locator('.cw-test-result.passed').count()>=5,'Engineering must report independent passing checks')
 assert.equal(await page.locator('.cw-test-result.failed').count(),0)
 await page.getByRole('button',{name:'SUBMIT ENGINEERING REVIEW DECISION'}).click()
 await page.locator('.cw-outcome').waitFor({state:'visible'})
 assert.match(await page.locator('.cw-outcome').textContent(),/VERIFIED IN SIMULATION/)
 await page.reload({waitUntil:'domcontentloaded'})
 await page.locator('.cw-outcome').waitFor({state:'visible'})
 // A successful rescue can replay only its correctly mapped and allowed film.
 if(caseId==='LUM'||caseId==='ORI'){
  await page.getByRole('button',{name:'WATCH VERIFIED '+caseId+' OUTCOME'}).click()
  await page.locator('.cm-backdrop').waitFor({state:'visible'})
  await page.locator('.cm-actions .cm-primary').click()
  await page.locator('.cw-outcome').waitFor({state:'visible'})
 }else{
  assert.equal(await page.getByRole('button',{name:'WATCH VERIFIED '+caseId+' OUTCOME'}).count(),0,
   'Blocked KES and AST outcome video must not be presented as verified')
 }
}
async function testCase(caseId){
 const context=await browser.newContext({viewport:{width:1366,height:768},colorScheme:'dark'})
 const page=await context.newPage()
 page.setDefaultTimeout(13000)
 const entry={caseId,name:CASE_META[caseId].name,steps:[],status:'PENDING'}
 const failures=[]
 page.on('pageerror',e=>failures.push('JS '+e.message))
 page.on('console',m=>{if(m.type()==='error')failures.push('Console '+m.text())})
 try{
  const six=requiredOrder(caseId)
  let room=''
  for(const id of six){
   const next=CASE_EVIDENCE_TASKS[id].room
   if(room!==next){await visitSourceDesk(page,caseId,next);room=next}
   await inspectVerifyCollect(page,id)
   entry.steps.push('INSPECT → ANALYZE → MANUAL COLLECT '+id+' @ '+room)
  }
  await fileSix(page,caseId,six)
  entry.steps.push('WRONG FILING → MOVE → 6/6 → RELOAD → PORTAL → PAST → RESCUE')
  await diagnose(page,caseId)
  entry.steps.push('EVIDENCE-BACKED CAUSAL REVIEW')
  await engineer(page,caseId)
  entry.steps.push('INDEPENDENT TESTS → SIGN → OUTCOME → RELOAD')
  assert.deepEqual(failures,[],'Unexpected browser errors on complete '+caseId+' journey')
  entry.status='PASS'
  console.log('[CASE-E2E] '+caseId+' PASS '+entry.steps.length+' stages')
 }catch(e){
  entry.status='FAIL';entry.error=String(e);entry.console=failures.slice(0,12)
  console.error('[CASE-E2E] '+caseId+' FAIL '+entry.error)
  try{await page.screenshot({path:'qa-artifacts/e2e-failed-'+caseId.toLowerCase()+'.png',animations:'disabled',fullPage:true})}catch{}
 }finally{
  report.cases.push(entry)
  await context.close()
 }
}
for(const id of selected)await testCase(id)
report.finished=new Date().toISOString()
report.passed=report.cases.filter(c=>c.status==='PASS').length
await writeFile('qa-artifacts/four-case-e2e-report.json',JSON.stringify(report,null,2))
await browser.close()
console.log('[CASE-E2E] Summary '+JSON.stringify({passed:report.passed,total:report.cases.length}))
assert.equal(report.passed,report.cases.length,'All four cases must pass genuine no-debug UI gameplay')
