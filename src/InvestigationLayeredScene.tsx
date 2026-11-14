import { useEffect, useRef, useState } from 'react'
import wideManifest from '../public/assets/rooms/investigation/layers/wide/manifest.json'
import originalManifest from '../public/assets/rooms/investigation/layers/original/manifest.json'
import './investigationLayeredScene.css'

export type RoomObjectTarget = 'cases' | 'evidence' | 'briefing' | 'door' | 'rescue'
type SceneManifest = typeof wideManifest
type LayeredObjectData = SceneManifest['objects'][number]

/** Every file lives under public/assets, and is replaceable without changing the room JSX. */
function LayeredObject({
  object, coordinateSystem, onOpen,
}: {
  object: LayeredObjectData
  coordinateSystem: SceneManifest['coordinateSystem']
  onOpen: (target: RoomObjectTarget) => void
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pixelsRef = useRef<ImageData | null>(null)

  useEffect(() => {
    pixelsRef.current = null
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      try { pixelsRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height) }
      catch { pixelsRef.current = null }
    }
    img.src = object.assets.mask
    return () => { img.onload = null; pixelsRef.current = null }
  }, [object.assets.mask])

  function hitAt(clientX: number, clientY: number) {
    const node = buttonRef.current
    const pixels = pixelsRef.current
    if (!node || !pixels) return true // still accessible while a mask is loading
    const bounds = node.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) return false
    const x = Math.floor((clientX - bounds.left) / bounds.width * pixels.width)
    const y = Math.floor((clientY - bounds.top) / bounds.height * pixels.height)
    if (x < 0 || y < 0 || x >= pixels.width || y >= pixels.height) return false
    // Masks supplied by Codex are grayscale PNGs: sample luminance, not alpha (which is 255 everywhere).
    return pixels.data[(y * pixels.width + x) * 4] > 40
  }

  const { x, y, width, height } = object.position
  const style = {
    left: (100 * x / coordinateSystem.width) + '%',
    top: (100 * y / coordinateSystem.height) + '%',
    width: (100 * width / coordinateSystem.width) + '%',
    height: (100 * height / coordinateSystem.height) + '%',
    zIndex: object.zIndex,
  }

  return <button ref={buttonRef} type="button" className="idr-layer-object"
    style={style} aria-label={object.interaction.label} title={object.interaction.label}
    onPointerMove={event => {
      if (event.pointerType !== 'touch') buttonRef.current?.classList.toggle('idr-layer-object-lit', hitAt(event.clientX, event.clientY))
    }}
    onPointerLeave={() => buttonRef.current?.classList.remove('idr-layer-object-lit')}
    onPointerDown={event => buttonRef.current?.classList.toggle('idr-layer-object-lit', hitAt(event.clientX, event.clientY))}
    onClick={event => {
      if (event.detail === 0 || hitAt(event.clientX, event.clientY)) {
        onOpen(object.interaction.target as RoomObjectTarget)
      }
    }}>
    <img className="idr-layer-art" src={object.assets.base} draggable={false} alt=""/>
    {'screen' in object.assets && <img className="idr-layer-art" src={object.assets.screen} draggable={false} alt=""/>}
    {'foreground' in object.assets && <img className="idr-layer-art" src={object.assets.foreground} draggable={false} alt=""/>}
    <img className="idr-layer-glow" src={object.assets.glow} draggable={false} alt=""/>
  </button>
}

function Variant({ manifest, onOpen }: { manifest: SceneManifest; onOpen: (target: RoomObjectTarget) => void }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  return <div className={'idr-layered-scene idr-layered-' + manifest.variant + (status === 'ready' ? ' idr-layered-ready' : '')}>
    <img className="idr-layered-plate"
      src={status === 'error' ? manifest.sourceArt : manifest.background}
      alt="Space-station investigation room, featuring interactive mission records, terminals, an evidence board and station access"
      decoding="async" fetchPriority="high"
      onLoad={() => { if (status !== 'error') setStatus('ready') }}
      onError={() => setStatus('error')}/>
    {status === 'ready' && manifest.objects.map(object =>
      <LayeredObject key={object.id} object={object} coordinateSystem={manifest.coordinateSystem} onOpen={onOpen}/>)}
  </div>
}

/** Fixed first-person scene: both art variants use Codex V3 clean plate plus actual cutout layers. */
export default function InvestigationLayeredScene({ onOpen }: { onOpen: (target: RoomObjectTarget) => void }) {
  return <>
    <Variant manifest={wideManifest} onOpen={onOpen}/>
    <Variant manifest={originalManifest} onOpen={onOpen}/>
  </>
}
