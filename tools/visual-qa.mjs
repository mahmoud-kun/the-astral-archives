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
// Headless Chromium can reject or defer audible playback without an output device.
// Assert that the real click invokes Audio.play() for the correct cue, then verify
// its served binary separately. This is not a substitute for human listening QA.
async function observeAudioAttempts(page) {
 await page.evaluate(() => {
  const nativePlay = HTMLMediaElement.prototype.play
  window.__astralAudioAttempts = []
  HTMLMediaElement.prototype.play = function(...args) {
   window.__astralAudioAttempts.push(new URL(this.src).pathname)
   return nativePlay.apply(this, args)
  }
 })
}
async function assertCueAndAsset(page, path, format) {
 await page.waitForFunction(expected =>
  (window.__astralAudioAttempts || []).includes(expected), path, {timeout:5000})
 const asset = await page.evaluate(async url => {
  const response = await fetch(url, {cache:'no-store'})
  const bytes = new Uint8Array(await response.arrayBuffer())
  const ascii = (start,end) => String.fromCharCode(...bytes.slice(start,end))
  return {status:response.status, size:bytes.length, riff:ascii(0,4), ftyp:ascii(4,8)}
 }, path)
 assert.equal(asset.status,200, path+' must be served successfully')
 assert.ok(asset.size>1500, path+' must contain nonempty audio')
 assert.equal(format==='wav'?asset.riff:asset.ftyp,format==='wav'?'RIFF':'ftyp',
  path+' must contain the expected audio container')
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
// User-reported fullscreen crop (1650x927): assert the rendered ARCHIVES word,
// not only the h1 box, remains inside the viewport after a real click.
for(const viewport of [{width:1650,height:927},{width:1920,height:1080}]){
 await check(viewport,'/','home-fullscreen',async page=>{
  await page.getByRole('button',{name:'Enter fullscreen'}).click()
  await page.waitForTimeout(180)
  assert.equal(await page.evaluate(()=>Boolean(document.fullscreenElement)),true,
    'Fullscreen must be entered with the Home Screen control')
  const title=await page.locator('.aa-home-title h1 strong').boundingBox()
  const heading=await page.locator('.aa-home-title h1').evaluate(el=>({
   scrollWidth:el.scrollWidth,clientWidth:el.clientWidth
  }))
  assert.ok(title&&title.x>=6&&title.x+title.width<=viewport.width-12,
    'Full-screen title ARCHIVES must not extend outside the visible screen')
  assert.ok(heading.scrollWidth<=heading.clientWidth+2,
    'Fullscreen title must not overflow its allocated copy column')
  for(const selector of ['.aa-home-cta','.aa-home-secondary','.aa-home-header-right']){
   const rect=await page.locator(selector).boundingBox()
   assert.ok(rect&&rect.x>=0&&rect.x+rect.width<=viewport.width&&rect.y>=0&&rect.y+rect.height<=viewport.height,
     selector+' must be fully visible in fullscreen')
  }
 })
}
// The inventory button is on the left ONLY in Investigation, strictly below
// the back/room bar and outside the Mission Files hotspot.
for(const viewport of [laptop,mobile,small]){
 await check(viewport,'/?room=1','inventory-left',async page=>{
  const trigger=page.locator('.et-trigger--investigation')
  await trigger.waitFor()
  const btn=await trigger.boundingBox()
  const back=await page.locator('.idr-home-button').boundingBox()
  assert.ok(btn&&back&&btn.x<viewport.width*.12,
    'Investigation inventory button must be against the left edge')
  assert.ok(btn.y>=back.y+back.height+5,
    'Inventory button must be below Back, without covering navigation')
  assert.ok(btn.x>=0&&btn.y+btn.height<=viewport.height,
    'Inventory button must be fully inside the viewport')
  await trigger.click()
  assert.equal(await page.locator('.et-panel').isVisible(),true)
  await page.getByRole('button',{name:'Close evidence tray'}).click()
 })
}
// Sound files must not load on the initial low-bandwidth Home visit.
// Audio begins only after a real gesture; mute and volume persist.
await check(mobile,'/','audio-settings',async page=>{
  const initial=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>new URL(r.name).pathname.startsWith('/assets/audio/')).length)
  assert.equal(initial,0,'Home must not preload any audio files')
  await observeAudioAttempts(page)
  await page.getByRole('button',{name:'SETTINGS'}).click()
  await assertCueAndAsset(page,'/assets/audio/sfx/panel_open.wav','wav')
  const fx=page.locator('.aa-home-setting-row input[type="checkbox"]').nth(0)
  const ambient=page.locator('.aa-home-setting-row input[type="checkbox"]').nth(1)
  assert.equal(await fx.isChecked(),true)
  assert.equal(await ambient.isChecked(),true)
  await fx.uncheck()
  await ambient.uncheck()
  await page.locator('.aa-home-audio-volume input').focus()
  await page.keyboard.press('End')
  const prefs=await page.evaluate(()=>JSON.parse(localStorage.getItem('astral-audio-settings-v1')||'null'))
  assert.deepEqual(prefs,{effects:false,ambient:false,volume:100})
  await page.reload({waitUntil:'networkidle'})
  await page.getByRole('button',{name:'SETTINGS'}).click()
  assert.equal(await page.locator('.aa-home-setting-row input[type="checkbox"]').nth(0).isChecked(),false)
  assert.equal(await page.locator('.aa-home-audio-volume input').inputValue(),'100')
  // Leave this isolated browser context muted; other QA contexts are unaffected.
})
// Low-bandwidth sound preview: no room images, no sound preloading, real file fetch.
await check(mobile,'/?audio-lab=1','audio-lab',async page=>{
  assert.equal(await page.locator('.al-cue').count(),19,'Sound Lab must expose all 19 source cues')
  assert.equal(await page.locator('.al-root img').count(),0,'Sound Lab must avoid heavy game images')
  const prefetched=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>
    new URL(r.name).pathname.startsWith('/assets/audio/')).length)
  assert.equal(prefetched,0,'Audio Lab must not automatically download clips')
  await observeAudioAttempts(page)
  await page.getByRole('button',{name:'Play Equipment Scanner'}).click()
  await assertCueAndAsset(page,'/assets/audio/kenney/computer-noise-002.m4a','m4a')
  await page.getByLabel('Ambient scene').selectOption('signal')
  assert.match(page.url(),/audio-lab=1.*station=signal/)
  // Route changes can suspend/re-render the lazy Sound Lab briefly.
  // Wait for its UI rather than observing a transient hidden/not-mounted state.
  await page.getByRole('button',{name:'Play Equipment Scanner'}).waitFor({state:'visible',timeout:7000})
  assert.equal(await page.locator('.al-cue').count(),19,'Sound Lab must retain all cues after scene switching')
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
