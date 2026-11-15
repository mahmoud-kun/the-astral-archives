/** Main acceptance: original Nadir case, physical-room UI only, no debug.
 * Tests its distinct NAV-042, timeline ordering, unit conversion, replay,
 * interface chips, six manual collections, folder filing and engineering rerun.
 */
import {chromium} from 'playwright'
import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {NADIR_CHALLENGES} from '../src/gameplay/nadirEngine.ts'

const origin=process.env.VISUAL_QA_URL??'http://127.0.0.1:4173'
await mkdir('qa-artifacts',{recursive:true})
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']})
const context=await browser.newContext({viewport:{width:1366,height:768},colorScheme:'dark'})
const page=await context.newPage()
page.setDefaultTimeout(16000)
const result={caseId:'NAD',status:'PENDING',steps:[],started:new Date().toISOString()}
const errors=[]
page.on('pageerror',e=>errors.push('JS '+e.message))
page.on('console',m=>{if(m.type()==='error')errors.push('Console '+m.text())})
const order=['NAD-06','NAD-05','NAD-02','NAD-01','NAD-04','NAD-03']
const correct={
 'NAD-06':{proof:'rerun',risk:'administrative'},
 'NAD-05':{first:'export',second:'residual',third:'email',fourth:'closure'},
 'NAD-02':{source:'lbfs',target:'ns',converted:'53.37865938'},
 'NAD-01':{hypothesis:'units',rerun:'53.37865938',comparison:'same'},
 'NAD-04':{producer:'lbfs',consumer:'ns',failure:'contract'},
 'NAD-03':{canonical:'ns',owner:'producer',verification:'rerun'},
}
const station={
 'NAD-05':'/?station=recordings',
 'NAD-02':'/?station=signal',
 'NAD-01':'/?station=signal',
 'NAD-04':'/?station=archive',
 'NAD-03':'/?station=archive',
}
async function reorderTimeline(){
 const labels=['Impulse packet exported','Navigation residual observed','Engineer requests a cross-check','NAV-042 ticket marked closed']
 for(let target=0;target<labels.length;target++){
  let current=await page.locator('.np-timeline-event span').allTextContents()
  let at=current.findIndex(x=>x.trim()===labels[target])
  assert.ok(at>=target,'Timeline event not found '+labels[target])
  while(at>target){
   await page.getByRole('button',{name:'Move '+labels[target]+' earlier'}).click()
   at--
  }
 }
 assert.deepEqual((await page.locator('.np-timeline-event span').allTextContents()).map(x=>x.trim()),labels)
}
async function setNadirAnswer(id){
 const answer=correct[id]
 if(id==='NAD-05'){await reorderTimeline();return}
 const controlled=new Set(id==='NAD-04'?['producer','consumer']:id==='NAD-03'?['owner','canonical']:[])
 for(const field of NADIR_CHALLENGES[id].fields){
  if(controlled.has(field.key))continue
  const row=page.locator('.np-workbench .np-field').filter({hasText:field.label})
  if(field.type==='number')await row.locator('input').fill(answer[field.key])
  else await row.locator('select').selectOption(answer[field.key])
 }
 if(id==='NAD-04'){
  await page.locator('.em-module').filter({hasText:'PRODUCER UNIT'}).getByRole('button',{name:'lbf·s'}).click()
  await page.locator('.em-module').filter({hasText:'PARSER ASSUMPTION'}).getByRole('button',{name:'N·s'}).click()
 }
 if(id==='NAD-03'){
  await page.locator('.em-module').filter({hasText:'CONVERSION OWNER'}).getByRole('button',{name:'Producer'}).click()
  await page.locator('.em-module').filter({hasText:'CANONICAL UNIT'}).getByRole('button',{name:'N·s'}).click()
 }
 if(id==='NAD-01'){
  await page.getByRole('button',{name:'RUN BASELINE MODEL'}).click()
  await page.getByRole('button',{name:'RUN MODEL WITH MY IMPULSE'}).click()
  assert.match(await page.locator('.np-replay small').textContent(),/converge/i)
 }
}
async function visitEvidence(id){
 await page.goto(origin+(station[id]??'/?room=1'),{waitUntil:'domcontentloaded'})
 if(id==='NAD-06'){
  const button=page.getByRole('button',{name:'Inspect Evidence Board'})
  await button.waitFor()
  await button.focus()
  await page.keyboard.press('Enter')
  await page.getByRole('button',{name:/EXAMINE NAV-042/}).click()
 }else await page.locator('.sr-hotspot[data-evidence-id="'+id+'"]').click()
 await page.locator('.np-dialog').waitFor({state:'visible'})
 assert.match(await page.locator('.np-head').textContent(),new RegExp(id))
 await setNadirAnswer(id)
 await page.getByRole('button',{name:'VERIFY ANALYSIS',exact:true}).first().click()
 await page.locator('.np-success').waitFor({state:'visible'})
 await page.getByRole('button',{name:'COLLECT EVIDENCE · '+id}).click()
 await page.waitForFunction(evidenceId=>{
  try{return JSON.parse(localStorage.getItem('astral-archive-folder-v1')||'{}').discovered?.includes(evidenceId)}catch{return false}
 },id)
 await page.getByRole('button',{name:'Close evidence analyzer'}).click()
 result.steps.push('SOLVE → MANUAL COLLECT '+id)
}
async function chooseFolder(id){
 await page.locator('.af-folder-choice').filter({hasText:'CASE / '+id}).click()
}
async function file(id,destination){
 await page.locator('.af-intake-items button').filter({hasText:id}).click()
 await page.locator('.af-file-select select').selectOption(destination)
 await page.locator('.af-document-modal .af-primary').click()
 await page.locator('.af-document-modal').waitFor({state:'detached'})
}
async function verifyFolderAndPortal(){
 await page.goto(origin+'/?folder-lab=1&return=investigation',{waitUntil:'domcontentloaded'})
 await chooseFolder('NAD')
 await page.locator('.af-bottom button').click()
 assert.equal(await page.locator('.af-meter').getAttribute('aria-valuenow'),'0')
 await file(order[0],'KES')
 assert.equal(await page.locator('.af-meter').getAttribute('aria-valuenow'),'0')
 await chooseFolder('KES')
 await file(order[0],'NAD')
 await chooseFolder('NAD')
 for(const id of order.slice(1))await file(id,'NAD')
 assert.equal(await page.locator('.af-meter').getAttribute('aria-valuenow'),'6')
 await page.reload({waitUntil:'domcontentloaded'})
 await chooseFolder('NAD')
 assert.equal(await page.locator('.af-meter').getAttribute('aria-valuenow'),'6')
 await page.getByRole('button',{name:'ENTER NADIR RESCUE →'}).click()
 await page.locator('.cm-video').waitFor({state:'visible'})
 assert.equal(await page.locator('.cm-video').getAttribute('src'),'/assets/video/designer-time-travel-past-v1.mp4')
 await page.locator('.cm-actions .cm-primary').click()
 await page.locator('.pt-root').waitFor({state:'visible'})
 assert.match(page.url(),/past=manufacturing&case=NAD/)
 await page.getByRole('button',{name:'ENTER RESCUE CONSOLE →'}).click()
 await page.locator('.nr-root').waitFor({state:'visible'})
 assert.match(page.url(),/rescue=NAD/)
 result.steps.push('WRONG FOLDER → CORRECT FOLDER → 6/6 → RELOAD → PORTAL → PAST → RESCUE')
}
async function verifyNadirEngineering(){
 const answers={
  technical:['units','NAD-02'],
  process:['no-rerun','NAD-06'],
  consequence:['divergence','NAD-01'],
 }
 const form=page.locator('.nr-work').first()
 for(const [i,p] of ['technical','process','consequence'].entries()){
  const sels=form.locator('fieldset').nth(i).locator('select')
  await sels.nth(0).selectOption(answers[p][0])
  await sels.nth(1).selectOption(answers[p][1])
 }
 await page.getByRole('button',{name:'VERIFY THREE-STEP CAUSAL CHAIN'}).click()
 await form.locator('.nr-success').waitFor({state:'visible'})
 const controls=page.locator('.nr-work').nth(1)
 await controls.locator('.nr-two select').nth(0).selectOption('ns')
 await controls.locator('.nr-two select').nth(1).selectOption('producer')
 await controls.getByLabel('Interface acceptance requirement').selectOption('automated')
 await controls.locator('.nr-test-inputs input').nth(0).fill('53.37865938')
 await controls.locator('.nr-test-inputs input').nth(1).fill('3.55857729')
 await page.getByRole('button',{name:'RUN INDEPENDENT NAVIGATION RECHECK'}).click()
 await controls.getByText('RESCUE SIMULATION VERIFIED',{exact:false}).waitFor({state:'visible'})
 await page.reload({waitUntil:'domcontentloaded'})
 await page.getByText('RESCUE SIMULATION VERIFIED',{exact:false}).waitFor({state:'visible'})
 await page.getByRole('button',{name:'WATCH VERIFIED NADIR OUTCOME'}).click()
 await page.locator('.cm-backdrop').waitFor({state:'visible'})
 assert.equal(await page.locator('.cm-video').getAttribute('src'),'/assets/video/designer-case-2-outcome-v1.mp4')
 await page.locator('.cm-actions .cm-primary').click()
 await page.getByText('RESCUE SIMULATION VERIFIED',{exact:false}).waitFor({state:'visible'})
 result.steps.push('CAUSAL REVIEW → INDEPENDENT UNIT RERUN → SUCCESS → RELOAD → VIDEO')
}
try{
 for(const id of order)await visitEvidence(id)
 await verifyFolderAndPortal()
 await verifyNadirEngineering()
 assert.deepEqual(errors,[],'Nadir UI journey must not produce console/page errors')
 result.status='PASS'
 console.log('[NADIR-E2E] PASSED '+result.steps.join(' / '))
}catch(e){
 result.status='FAIL';result.error=String(e);result.console=errors.slice(0,12)
 console.error('[NADIR-E2E] FAILED '+result.error)
 try{await page.screenshot({path:'qa-artifacts/e2e-failed-nadir.png',animations:'disabled'})}catch{}
}finally{
 result.finished=new Date().toISOString()
 await writeFile('qa-artifacts/nadir-e2e-report.json',JSON.stringify(result,null,2))
 await context.close()
 await browser.close()
}
assert.equal(result.status,'PASS','Nadir must pass its full physical GUI journey without debug')
