import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const origin = process.env.VISUAL_QA_URL ?? 'http://127.0.0.1:5173'
const output = 'qa-artifacts'
await mkdir(output, {recursive:true})
// Branded Chrome supports licensed H.264/AAC designer MP4s; bundled Chromium
// headless shell may report MEDIA_ERR_SRC_NOT_SUPPORTED for valid films.
const browserChannel=process.env.VISUAL_QA_BROWSER_CHANNEL || 'chrome'
console.log('[VISUAL-QA] Browser channel '+browserChannel)
const browser = await chromium.launch({channel:browserChannel,headless:true, args:['--no-sandbox']})
const report = {version:1,origin,started:new Date().toISOString(),pages:[],errors:[]}

async function check(viewport, route, label, action){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:viewport.width<1000,hasTouch:viewport.width<1000,colorScheme:'dark'})
 const page=await context.newPage()
 const faults=[]
 const responses=[]
 page.on('pageerror', e=>faults.push('pageerror: '+e.message))
 page.on('console',m=>{if(m.type()==='error')faults.push('console: '+m.text()+' @ '+m.location().url)})
 page.on('response',r=>{const u=new URL(r.url());if(r.status()>=400)console.log('[VISUAL-QA-HTTP] '+label+' '+r.status()+' '+u.origin+u.pathname);if(/\.(png|webp|jpe?g|svg)$/i.test(u.pathname))responses.push({path:u.pathname,bytes:Number(r.headers()['content-length']||0),status:r.status()})})
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
   if(faults.length)console.log('[VISUAL-QA-FAULT] '+label+' '+JSON.stringify(faults.slice(0,5)))
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
// Main integration: exercise the newly mounted four-case screens, not just
// historical Nadir routes. All contexts start with an empty player save.
async function openCaseSourceIndex(page) {
 const terminal=page.getByRole('button',{name:'Read Mission Briefing at center terminal'})
 await terminal.waitFor({state:'visible'})
 await terminal.focus()
 await page.keyboard.press('Enter')
 await page.getByRole('button',{name:'OPEN CASE SOURCE INDEX'}).click()
 await page.locator('.cw-desk').waitFor({state:'visible'})
 assert.equal(await page.locator('.cw-case-tabs button').count(),4)
}
await check(laptop,'/?room=1','case-source-index',async page=>{
 await openCaseSourceIndex(page)
 assert.ok((await page.locator('.cw-desk').textContent()).includes('KES'))
})
await check(mobile,'/?room=1','case-source-index',async page=>{
 await openCaseSourceIndex(page)
 assert.ok(await page.locator('.cw-desk-record').count()>0,'Investigation terminal must host at least one KES source')
})
await check(mobile,'/?room=1','case-puzzle',async page=>{
 await openCaseSourceIndex(page)
 await page.locator('.cw-desk-record').first().click()
 await page.locator('.np-dialog').waitFor({state:'visible'})
 assert.equal(await page.getByRole('button',{name:/COLLECT EVIDENCE · KES-/}).count(),0,
  'Unsolved other-case puzzles must never show collection')
 await page.locator('.np-source-drawer summary').first().click()
 await page.locator('.np-mobile-steps button').nth(1).click()
 assert.equal(await page.locator('.np-workbench').isVisible(),true)
})
for(const id of ['KES','LUM','ORI','AST']){
 await check(mobile,'/?rescue='+id,'case-rescue-'+id.toLowerCase(),async page=>{
  await page.locator('.cw-rescue').waitFor({state:'visible'})
  assert.match(await page.locator('.cw-rescue').textContent(),/RESCUE LOCKED/)
  assert.equal(await page.locator('.cw-outcome').count(),0,
   'A direct rescue URL must not bypass six correctly filed records')
 })
}
// A URL query flag is not authorization to bulk-collect unseen evidence.
await check(mobile,'/?folder-lab=1&debug=1','production-debug-guard',async page=>{
 await page.locator('.af-bottom button').click()
 assert.equal(await page.locator('.af-intake-items button').filter({hasText:'DEBUG COLLECT'}).count(),0)
 assert.equal(await page.locator('.af-reset').count(),0)
 assert.ok(await page.locator('.af-intake').isVisible())
})
// Real Main media wiring: these checks exercise UI entry points, not only
// Chat B's standalone Sound Lab. They do not certify human-audible output.
await check(mobile,'/','opening-to-investigation',async page=>{
 await page.locator('.aa-home-cta').click()
 await page.locator('.cm-backdrop').waitFor({state:'visible',timeout:7000})
 assert.match(await page.locator('.cm-panel').textContent(),/The Astral Archives — Opening/)
 const src=await page.locator('.cm-video').getAttribute('src')
 assert.equal(src,'/assets/video/designer-game-opening-v1.mp4')
 const head=await page.evaluate(async path=>{
  const r=await fetch(path,{method:'HEAD'})
  return {status:r.status,type:r.headers.get('content-type')}
 },src)
 assert.equal(head.status,200,'Opening video must be served')
 assert.ok(head.type?.includes('video/mp4'),'Opening video MIME type must be MP4')
 const browserCodec=await page.locator('.cm-video').evaluate(video=>({
  mp4:video.canPlayType('video/mp4'),
  h264:video.canPlayType('video/mp4; codecs="avc1.640028, mp4a.40.2"'),
  mediaError:video.error?.code??null,
  mediaMessage:video.error?.message??null,
  networkState:video.networkState,
  readyState:video.readyState,
 }))
 console.log('[MEDIA-CODEC-QA] opening '+JSON.stringify(browserCodec))
 await page.waitForFunction(()=>{
  const v=document.querySelector('.cm-video')
  return !!v&&(v.readyState>=2||!!v.error)
 },null,{timeout:18000})
 const playback=await page.locator('.cm-video').evaluate(video=>({
  errorCode:video.error?.code??null,
  errorText:video.error?.message??null,
  ready:video.readyState,
  width:video.videoWidth,height:video.videoHeight,
 }))
 assert.equal(playback.errorCode,null,'Branded Chrome must decode the authored H.264/AAC opening '+JSON.stringify(playback))
 assert.ok(playback.ready>=2&&playback.width>0&&playback.height>0,
  'Opening must expose decoded video frames in Chrome: '+JSON.stringify(playback))
 await page.screenshot({path:`${output}/cinematic-opening-active-915x412.png`,animations:'disabled'})
 // The 10s opening may already have ended by the time the HTTP HEAD check finishes.
 // Either SKIP & CONTINUE or CONTINUE must advance to Investigation.
 await page.locator('.cm-actions .cm-primary').click()
 await page.locator('.idr-root').waitFor({state:'visible'})
 assert.equal(await page.locator('.cm-backdrop').count(),0)
})
for(const [station,object] of [
 ['archive','archive_shelving'],
 ['signal','telemetry_console_left'],
 ['recordings','audio_analysis_terminal'],
]){
 await check(mobile,'/?station='+station,'source-desk-'+station,async page=>{
  await page.locator('.sr-prop-target[data-object-id="'+object+'"]').click()
  await page.getByRole('button',{name:'OPEN MISSION SOURCE INDEX'}).click()
  await page.locator('.cw-desk').waitFor({state:'visible'})
  assert.equal(await page.locator('.cw-case-tabs button').count(),4)
 })
}
await check(mobile,'/?station=recordings','nadir-voice-inspector',async page=>{
 await page.locator('.sr-hotspot[data-evidence-id="NAD-07"]').click()
 await page.locator('.np-dialog').waitFor({state:'visible'})
 assert.match(await page.locator('.im-evidence-media audio').getAttribute('src'),/designer-nad-07-engineer-review-v1.mp3/)
 assert.equal(await page.locator('.im-evidence-media audio').getAttribute('preload'),'none')
 assert.equal(await page.getByRole('button',{name:/COLLECT EVIDENCE · NAD-07/}).count(),0)
})
await check(mobile,'/?station=recordings','kestrel-voice-inspector',async page=>{
 await page.locator('.sr-prop-target[data-object-id="audio_analysis_terminal"]').click()
 await page.getByRole('button',{name:'OPEN MISSION SOURCE INDEX'}).click()
 await page.locator('.cw-desk-record').filter({hasText:'KES-05'}).click()
 await page.locator('.np-dialog').waitFor({state:'visible'})
 assert.match(await page.locator('.im-evidence-media audio').getAttribute('src'),/designer-kes-05-analyst-review-v1.mp3/)
 assert.equal(await page.getByRole('button',{name:/COLLECT EVIDENCE · KES-05/}).count(),0)
})
await check(mobile,'/?station=signal','nadir-evidence-video',async page=>{
 await page.locator('.sr-hotspot[data-evidence-id="NAD-02"]').click()
 await page.locator('.np-dialog').waitFor({state:'visible'})
 await page.locator('.im-media-video button').click()
 await page.locator('.cm-backdrop').waitFor({state:'visible'})
 assert.equal(await page.locator('.cm-video').getAttribute('src'),'/assets/video/designer-case-2-units-mismatch-evidence-v1.mp4')
 await page.locator('.cm-actions .cm-primary').click()
 await page.locator('.np-dialog').waitFor({state:'visible'})
 assert.equal(await page.getByRole('button',{name:/COLLECT EVIDENCE · NAD-02/}).count(),0,
  'Skipping the film must never grant collection before analysis')
})
await check(mobile,'/?folder-lab=1','lumen-briefing-film',async page=>{
 await page.locator('.af-folder-choice').filter({hasText:'Lumen'}).click()
 await page.getByRole('button',{name:'PLAY LUMEN INTRO'}).click()
 await page.locator('.cm-backdrop').waitFor({state:'visible'})
 assert.equal(await page.locator('.cm-video').getAttribute('src'),'/assets/video/designer-case-3-intro-v1.mp4')
 await page.screenshot({path:`${output}/cinematic-lumen-intro-915x412.png`,animations:'disabled'})
 await page.getByRole('button',{name:'RETURN',exact:true}).click()
 assert.match(page.url(),/folder-lab=1/)
 assert.match(await page.locator('.af-workhead h1').textContent(),/LUMEN/)
})
await check(mobile,'/?folder-lab=1','kestrel-film-content-hold',async page=>{
 await page.locator('.af-folder-choice').filter({hasText:'Kestrel'}).click()
 assert.equal(await page.getByRole('button',{name:'PLAY KESTREL INTRO'}).count(),0)
 assert.match(await page.locator('.af-status').textContent(),/awaits the approved visual/)
})
// Past visual integration acceptance: use an isolated, valid six-record QA save
// in each disposable browser context. This is NOT player-facing debug intake.
const pastQaSave={version:1,
 discovered:['NAD-01','NAD-02','NAD-03','NAD-04','NAD-05','NAD-06'],
 filed:{'NAD-01':'NAD','NAD-02':'NAD','NAD-03':'NAD','NAD-04':'NAD','NAD-05':'NAD','NAD-06':'NAD'},
 diagnosis:{},submitted:[]}
async function seedPastQaSave(page){
 await page.evaluate(value=>localStorage.setItem('astral-archive-folder-v1',JSON.stringify(value)),pastQaSave)
 await page.reload({waitUntil:'networkidle'})
}
await check(mobile,'/?past=manufacturing&case=NAD','past-direct-route-locked',async page=>{
 await page.locator('.pt-locked').waitFor({state:'visible'})
 assert.equal(await page.locator('.sr-past-background').count(),0,
  'A direct Past URL cannot bypass missing evidence')
 assert.match(await page.locator('.pt-locked').textContent(),/0\/6/)
})
for(const [room,count] of [['manufacturing',3],['mission_target',4],['data_analysis',3],['resources_review',5]]){
 await check(mobile,'/?past='+room+'&case=NAD','past-'+room+'-unlocked',async page=>{
  await seedPastQaSave(page)
  await page.locator('.pt-root').waitFor({state:'visible'})
  const image=page.locator('.sr-past-background')
  await image.waitFor({state:'visible'})
  const dims=await image.evaluate(img=>({w:img.naturalWidth,h:img.naturalHeight,complete:img.complete}))
  assert.deepEqual(dims,{w:1920,h:1080,complete:true})
  assert.equal(await page.locator('.sr-past-target').count(),count,
   'All 15 stable hotspots must be distributed across four Past rooms')
  await page.locator('.sr-past-target').first().click()
  assert.ok((await page.locator('.pt-inspection strong').textContent()||'').trim().length>0)
  assert.equal(await page.locator('.pt-rescue').isEnabled(),true)
 })
}
for(const viewport of [laptop,phone]){
 await check(viewport,'/?past=resources_review&case=NAD','past-resources-responsive',async page=>{
  await seedPastQaSave(page)
  await page.locator('.sr-past-background').waitFor({state:'visible'})
  assert.equal(await page.locator('.sr-past-target').count(),5)
  const controls=await page.locator('.pt-bottom button').evaluateAll(nodes=>nodes.map(node=>{
   const r=node.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}
  }))
  for(const bounds of controls)assert.ok(bounds.left>=-2&&bounds.right<=viewport.width+2&&
   bounds.top>=-2&&bounds.bottom<=viewport.height+2,'Past footer must fit the landscape viewport')
 })
}
await check(mobile,'/?folder-lab=1','past-portal-to-rescue',async page=>{
 await seedPastQaSave(page)
 await page.locator('.af-folder-choice').filter({hasText:'Nadir'}).click()
 await page.getByRole('button',{name:/ENTER NADIR RESCUE/}).click()
 await page.locator('.cm-backdrop').waitFor({state:'visible'})
 assert.match(await page.locator('.cm-panel').textContent(),/Journey to the Past/)
 await page.locator('.cm-actions .cm-primary').click()
 await page.locator('.pt-root').waitFor({state:'visible'})
 assert.match(page.url(),/past=manufacturing/)
 await page.locator('.pt-nav button').filter({hasText:'RESOURCES'}).click()
 await page.locator('.sr-past-target[data-object-id="resource_allocation"]').click()
 await page.locator('.pt-rescue').click()
 await page.locator('.nr-root').waitFor({state:'visible'})
 assert.match(page.url(),/rescue=NAD/)
 assert.match(await page.locator('.nr-progress').textContent(),/6\/6/)
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
