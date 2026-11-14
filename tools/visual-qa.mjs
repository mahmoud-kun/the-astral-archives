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
