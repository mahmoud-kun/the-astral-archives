import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const types = new Map([
  ['mission_files','cases'],
  ['evidence_board','evidence'],
  ['center_terminal','briefing'],
  ['station_door','door'],
  ['right_console','rescue'],
])

function pngInfo(file) {
  const data = readFileSync(file)
  const sig = '89504e470d0a1a0a'
  assert.equal(data.subarray(0,8).toString('hex'),sig,`PNG signature invalid: ${file}`)
  assert.equal(data.subarray(12,16).toString('ascii'),'IHDR')
  return { width:data.readUInt32BE(16),height:data.readUInt32BE(20),colorType:data[25],bytes:data.length }
}

test('Both room variants expose exactly five canonical clickable objects', () => {
  for (const variant of ['wide','original']) {
    const path = join('public','assets','rooms','investigation','layers',variant,'manifest.json')
    const manifest = JSON.parse(readFileSync(path,'utf8'))
    assert.equal(manifest.version,1)
    assert.equal(manifest.variant,variant)
    assert.equal(manifest.objects.length,5)
    const ids = new Set()
    for (const object of manifest.objects) {
      assert.equal(types.get(object.id),object.interaction.target,`Unexpected target on ${object.id}`)
      assert.ok(!ids.has(object.id),`Duplicate object ${object.id}`)
      ids.add(object.id)
    }
    assert.deepEqual([...ids].sort(),[...types.keys()].sort())
  }
})

test('Every layered room image exists, matches the manifest crop and preserves alpha', () => {
  for(const variant of ['wide','original']){
    const manifest = JSON.parse(readFileSync(join('public','assets','rooms','investigation','layers',variant,'manifest.json'),'utf8'))
    const bg = pngInfo('public'+manifest.background)
    assert.equal(bg.width,manifest.coordinateSystem.width)
    assert.equal(bg.height,manifest.coordinateSystem.height)
    assert.ok([2,6].includes(bg.colorType))
    for(const object of manifest.objects){
      const {x,y,width,height} = object.position
      assert.ok(x>=0 && y>=0 && width>0 && height>0)
      assert.ok(x+width<=bg.width && y+height<=bg.height)
      for (const [kind,asset] of Object.entries(object.assets)){
        const full = 'public'+asset
        assert.equal(existsSync(full),true,`Missing ${kind}: ${full}`)
        const info = pngInfo(full)
        assert.equal(info.width,width,`Bad width: ${full}`)
        assert.equal(info.height,height,`Bad height: ${full}`)
        if(kind === 'mask') assert.ok([0,4,6].includes(info.colorType),`Unsupported mask format: ${full}`)
        else assert.equal(info.colorType,6,`Visible sprite PNG must have an alpha channel: ${full}`)
        assert.ok(info.bytes>100)
      }
      assert.equal(object.interaction.mask,object.assets.mask)
      assert.ok(object.zIndex>=1)
    }
  }
})

test('Room source is layered but keeps the archive navigation and fullscreen-safe routing', () => {
  const room = readFileSync('src/InvestigationDesignerScene.tsx','utf8')
  const layer = readFileSync('src/InvestigationLayeredScene.tsx','utf8')
  assert.match(room,/<InvestigationLayeredScene onOpen=\{openObject\}\/>/)
  assert.match(room,/navigateGame\('\/\?folder-lab=1(?:&return=investigation)?'\)/)
  assert.match(room,/onGameLinkClick\(event, '\/'\)/)
  assert.doesNotMatch(room,/idr-foot-actions|idr-hotspot-layer/)
  assert.match(layer,/idr-layer-object/)
  assert.match(layer,/manifest\.background/)
  assert.match(layer,/object\.assets\.mask/)
})
