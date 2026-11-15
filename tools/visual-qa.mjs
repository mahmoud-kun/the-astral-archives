import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const origin = process.env.VISUAL_QA_URL ?? 'http://127.0.0.1:5173'
const output = 'qa-artifacts'
await mkdir(output, {recursive:true})
const browser = await chromium.launch({headless:true, args:['--no-sandbox']})
const report = {version:1,origin,started:new Date().toISOString(),pages:[],errors:[]}

async function check(viewport, route, label, action){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:viewport.width<1000,hasTouch:viewport.width<1000,colorScheme:'dark'})
 const page=await context.newPage()
 const faults=[]
 const responses=[]
 page.on('pageerror', e=>faults.push('pageerror: '+e.message))
 page.on('console',m=>{if(m.type()==='error')faults.push('console: '+m.text())})
 page.on('response',r=>{const u=new URL(r.url());if(/\.(png|webp|jpe?g|svg)$/i.test(u.pathname))responses.push({path:u.pathname,bytes:Number(r.headers()['content-length']||0),status:r.status()})})
 try{
   await page.goto(origin+route,{waitUntil:'networkidle',timeout:45000})
   await page.waitForTimeout(400)
   if(action)await action(page)
   await page.waitForTimeout(250)
   const metrics=await page.evaluate(()=>{
    const visible=(el)=>{
     const s=getComputedStyle(el),r=el.getBoundingClientRect()
     return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0
    }
    const clip=(el)=>{
      const r=el.getBoundingClientRect()
      return {element:el.tagName.toLowerCase(),aria:el.getAttribute('aria-label')||el.textContent?.trim().slice(0,65)||'',left:Math.round(r.left),right:Math.round(r.right),top:Math.round(r.top),bottom:Math.round(r.bottom),vw:innerWidth,vh:innerHeight}
    }
    const fixedControls=[...document.querySelectorAll('.aa-home-cta,.aa-home-secondary,.sr-head button,.et-trigger,.np-head button,.np-foot button,.idr-home-button,.idr-utility,.af-header a')].filter(visible)
    const clippedControls=fixedControls.map(clip).filter(r=>r.left < -2 || r.right > r.vw + 2 || r.top < -2 || r.bottom > r.vh + 2)
    const images=[...document.images].filter(visible).map(img=>({src:new URL(img.currentSrc||img.src).pathname,ok:img.complete&&img.naturalWidth>0,width:img.naturalWidth}))
    const overflow=[...document.querySelectorAll('.sr-nav,.np-foot,.et-header,.et-tabs,.np-head')].filter(visible).map(el=>({selector:el.className,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth})).filter(x=>x.scrollWidth>x.clientWidth+2)
    return {pageWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,viewport:[innerWidth,innerHeight],clippedControls,overflow,images}
   })
   await page.screenshot({path:`${output}/${label}-${viewport.width}x${viewport.height}.png`,animations:'disabled'})
   const item={label,viewport,route,metrics,faults,imagesRequested:responses}
   report.pages.push(item)
   console.log(`[VISUAL-QA] ${label} ${viewport.width}x${viewport.height}: broken=${metrics.images.filter(x=>!x.ok).length} clipped=${metrics.clippedControls.length} overflow=${metrics.overflow.length} console=${faults.length} imageBytes=${responses.reduce((n,x)=>n+x.bytes,0)}`)
 }catch(e){const err={label,viewport,error:String(e),faults};report.errors.push(err);console.error(err)}
 finally{await context.close()}
}
const laptop={width:1366,height:768}
const mobile={width:915,height:412}
const phone={width:800,height:360}
const small={width:740,height:360}
for(const viewport of [laptop,mobile,phone,small]){
 await check(viewport,'/','home')
 await check(viewport,'/?room=1','investigation')
 await check(viewport,'/?station=signal','signal')
 await check(viewport,'/?station=archive','archive')
 await check(viewport,'/?station=recordings','recordings')
 await check(viewport,'/?station=signal','nadir-puzzle',async page=>{
  await page.locator('.sr-hotspot').nth(1).click()
  await page.locator('.np-dialog').waitFor()
 })
 await check(viewport,'/?station=signal','tray-open',async page=>{
  await page.locator('.et-trigger').click()
  await page.locator('.et-panel').waitFor()
 })
 await check(viewport,'/?folder-lab=1&return=signal','folder')
}
// A screenshot with the real mobile workbench open verifies that the
// second step is usable rather than merely present in the DOM.
for(const viewport of [mobile,phone,small]){
 await check(viewport,'/?station=signal','nadir-analysis',async page=>{
  await page.locator('.sr-hotspot').nth(1).click()
  await page.locator('.np-scroll').evaluate(el=>{el.scrollTop=120})
  await page.locator('.np-mobile-steps button').nth(1).click()
  assert.equal(await page.locator('.np-scroll').evaluate(el=>el.scrollTop),0)
  assert.equal(await page.locator('.np-workbench').isVisible(),true)
  assert.equal(await page.locator('.np-sources').isVisible(),false)
  assert.equal(await page.locator('.np-mobile-verify').isVisible(),true)
  const verifyRect=await page.locator('.np-mobile-verify').boundingBox()
  assert.ok(verifyRect && verifyRect.y>=0 && verifyRect.y+verifyRect.height<=viewport.height,
    'Mobile Verify Analysis must be fully visible in the viewport')
  assert.equal(await page.locator('.np-mobile-steps button').nth(1).getAttribute('aria-current'),'step')
 })
}

// Exercise a complete discovery -> analytical puzzle -> explicit collection ->
// Quick Tray -> manual folder filing -> return-to-origin journey. A document
// reload would erase the in-memory sentinel set before changing routes.
await check(mobile,'/?station=signal','nadir-collect-and-file',async page=>{
 await page.evaluate(()=>{window.__astralRouteSentinel='same-document'})
 await page.locator('.sr-hotspot').nth(1).click()
 await page.locator('.np-mobile-steps button').nth(1).click()
 await page.locator('.np-field select').nth(0).selectOption('lbfs')
 await page.locator('.np-field select').nth(1).selectOption('ns')
 await page.locator('.np-field input').fill('53.38')
 await page.getByRole('button',{name:'VERIFY ANALYSIS'}).click()
 await page.getByRole('button',{name:/COLLECT EVIDENCE/}).click()
 await page.getByRole('button',{name:'Close evidence analyzer'}).click()
 assert.equal((await page.locator('.et-trigger span').textContent()).trim(),'1')
 await page.locator('.et-trigger').click()
 await page.locator('.et-footer button').click()
 assert.match(page.url(),/folder-lab=1/)
 assert.equal(await page.evaluate(()=>window.__astralRouteSentinel),'same-document')
 await page.locator('.af-folder-choice').nth(1).click()
 await page.locator('.af-bottom button').click()
 await page.locator('.af-intake-items button').filter({hasText:'NAD-02'}).click()
 await page.locator('.af-file-select select').selectOption('NAD')
 await page.locator('.af-document-modal .af-primary').click()
 assert.match((await page.locator('.af-bottom').textContent()).replace(/\s/g,''),/1\/6/)
 await page.screenshot({path:`${output}/nadir-filed-folder-915x412.png`,animations:'disabled'})
 await page.locator('.af-header-end a').click()
 assert.match(page.url(),/station=signal/)
 assert.equal(await page.evaluate(()=>window.__astralRouteSentinel),'same-document')
 assert.equal((await page.locator('.et-trigger span').textContent()).trim(),'0')
})
await check({width:390,height:844},'/','portrait-guard')
await writeFile(`${output}/report.json`, JSON.stringify(report,null,2))
await browser.close()
const broken=report.pages.flatMap(p=>p.metrics.images.filter(x=>!x.ok).map(x=>({page:p.label,src:x.src})))
const clipped=report.pages.flatMap(p=>p.metrics.clippedControls.map(c=>({page:p.label,viewport:p.viewport,...c})))
const faults=report.pages.flatMap(p=>p.faults)
console.log('[VISUAL-QA] Report summary',JSON.stringify({screenshots:report.pages.length,broken:broken.length,clipped:clipped.length,errors:report.errors.length,console:faults.length}))
assert.equal(report.errors.length,0,'Visual-QA scenarios must render')
assert.equal(broken.length,0,'Visible scene images must load')
assert.equal(faults.length,0,'No browser errors')
assert.equal(clipped.length,0,'Fixed primary controls must remain on screen')
