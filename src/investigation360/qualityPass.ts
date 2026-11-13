import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

/**
 * Non-destructive V1 art-quality layer for the 360° seated room. These are
 * individually modeled, original meshes; no reference bitmap or unlicensed kit.
 * A designer model can replace any group without changing controls/hotspots.
 */
export function installVisualQuality(scene: THREE.Scene): { dispose: () => void } {
  const geometries: THREE.BufferGeometry[] = []
  const materials: THREE.Material[] = []
  const textures: THREE.Texture[] = []
  const detail = new THREE.Group()
  detail.name = 'VisualQualityPassV1'
  scene.add(detail)

  const material = (
    name: string, color: number, metalness: number, roughness: number,
    clearcoat = 0, emissive = 0,
  ): THREE.MeshPhysicalMaterial => {
    const m = new THREE.MeshPhysicalMaterial({
      color, metalness, roughness, clearcoat,
      clearcoatRoughness: 0.26, emissive,
      emissiveIntensity: emissive ? 0.35 : 0,
    })
    m.name = name
    materials.push(m)
    return m
  }
  const anodized = material('Anodized blue steel', 0x27475a, .78, .29, .22)
  const rimMetal = material('Machined brushed edges', 0x7897a2, .76, .25, .25)
  const darkAlloy = material('Powder-coated alloy', 0x0d273b, .63, .4, .13)
  const graphite = material('Textured dark rubber', 0x172633, .03, .92)
  const platedCopper = material('Warm brushed brass', 0x99714e, .75, .3, .25)
  const paper = material('Paper and document stock', 0xd7d1bf, 0, .93)
  const glass = material('Smoked console glass', 0x163b51, .12, .18, .86)
  const ceramic = material('Ceramic drinking mug', 0xbbbebc, .04, .22, .78)
  const dimBlue = material('Low-output cyan lamp bezel', 0x177487, .36, .26, .25, 0x036c7f)
  const dimOrange = material('Warm status lamp bezel', 0xad6936, .3, .26, .18, 0x622500)

  const emissive = (name: string, color: number): THREE.MeshBasicMaterial => {
    const m = new THREE.MeshBasicMaterial({ color, toneMapped: false })
    m.name = name
    materials.push(m)
    return m
  }
  const cyan = emissive('Cyan phosphor', 0x31dce7)
  const warm = emissive('Tungsten indicators', 0xf1a66b)
  const pale = emissive('Pale display microtext', 0x97ced0)

  const mesh = (
    geometry: THREE.BufferGeometry, m: THREE.Material,
    x: number, y: number, z: number,
    shadow = true,
  ): THREE.Mesh => {
    geometries.push(geometry)
    const obj = new THREE.Mesh(geometry, m)
    obj.position.set(x, y, z)
    obj.castShadow = shadow && !(m instanceof THREE.MeshBasicMaterial)
    obj.receiveShadow = shadow
    detail.add(obj)
    return obj
  }
  const rounded = (
    w: number, h: number, d: number,
    x: number, y: number, z: number,
    m: THREE.Material, radius = .045,
  ): THREE.Mesh => mesh(
    new RoundedBoxGeometry(w, h, d, 2, Math.min(radius, w * .48, h * .48, d * .48)),
    m, x, y, z,
  )
  const smallBox = (
    w: number, h: number, d: number,
    x: number, y: number, z: number, m: THREE.Material,
    casts = true,
  ): THREE.Mesh => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, casts)
  const rod = (a: THREE.Vector3, b: THREE.Vector3, r: number, m: THREE.Material): THREE.Mesh => {
    const delta = b.clone().sub(a)
    const obj = mesh(new THREE.CylinderGeometry(r, r, delta.length(), 10), m,
      (a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
    obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize())
    return obj
  }
  const ball = (r: number, x: number, y: number, z: number, m: THREE.Material): THREE.Mesh =>
    mesh(new THREE.SphereGeometry(r, 9, 7), m, x, y, z, false)
  const torus = (
    radius: number, tube: number, x: number, y: number, z: number,
    m: THREE.Material, axis: 'x' | 'y' | 'z' = 'z',
  ): THREE.Mesh => {
    const obj = mesh(new THREE.TorusGeometry(radius, tube, 8, 36), m, x, y, z, false)
    if (axis === 'x') obj.rotation.y = Math.PI / 2
    if (axis === 'y') obj.rotation.x = Math.PI / 2
    return obj
  }
  const badge = (x: number, y: number, z: number, lit: THREE.Material): void => {
    smallBox(.18, .035, .018, x, y, z, darkAlloy, false)
    smallBox(.115, .012, .02, x, y, z + .012, lit, false)
  }
  const rivet = (x: number, y: number, z: number): void => {
    ball(.027, x, y, z, rimMetal)
  }

  // 1. Material differentiation / subtle procedural texture: floor is no
  // longer a uniform plastic panel. Generated deterministically at runtime.
  const grain = document.createElement('canvas')
  grain.width = grain.height = 128
  const ctx = grain.getContext('2d')
  if (ctx) {
    const img = ctx.createImageData(128, 128)
    for (let y = 0; y < 128; y++) {
      for (let x = 0; x < 128; x++) {
        const i = (y * 128 + x) * 4
        const randomish = (Math.sin(x * 47.31 + y * 91.7) * 43758.5453) % 1
        const brushed = Math.round(144 + (randomish - Math.floor(randomish) - .5) * 26
          + Math.sin(x * .31) * 6)
        img.data[i] = brushed
        img.data[i + 1] = brushed
        img.data[i + 2] = brushed
        img.data[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
  }
  const roughnessTexture = new THREE.CanvasTexture(grain)
  roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping
  roughnessTexture.repeat.set(7, 5)
  textures.push(roughnessTexture)

  scene.traverse(object => {
    if (!(object instanceof THREE.Mesh) || object.userData.target) return
    if (object.material instanceof THREE.MeshBasicMaterial) return
    const geometry = object.geometry
    if (geometry instanceof THREE.BoxGeometry) {
      const { width, height, depth } = geometry.parameters
      if (width >= 15 && depth >= 10 && height < 0.5) {
        // Floor surface: preserve designer palette but add roughness grain.
        object.receiveShadow = true
        object.castShadow = false
        if (object.material instanceof THREE.MeshStandardMaterial) {
          object.material.roughnessMap = roughnessTexture
          object.material.roughness = .7
          object.material.needsUpdate = true
        }
        return
      }
      if ((width > 10 || depth > 10) && height > 2) {
        // Avoid giant wall/roof objects blocking an interior shadow light.
        object.receiveShadow = true
        object.castShadow = false
        return
      }
      // Exclude small neon strips and sub-centimetre keys from shadow draw.
      const volume = width * height * depth
      object.castShadow = volume >= .019 && width < 6 && height < 3
      object.receiveShadow = true
    } else {
      object.castShadow = false
      object.receiveShadow = true
    }
  })

  // 2. Real key/fill lighting with soft shadows and bounded camera frustum.
  const shadowLight = new THREE.DirectionalLight(0xeaf8ff, 1.9)
  shadowLight.position.set(-2.0, 6.6, 2.8)
  shadowLight.target.position.set(0, 1.2, -2.0)
  shadowLight.castShadow = true
  shadowLight.shadow.mapSize.set(1024, 1024)
  shadowLight.shadow.camera.left = -9
  shadowLight.shadow.camera.right = 9
  shadowLight.shadow.camera.top = 8
  shadowLight.shadow.camera.bottom = -8
  shadowLight.shadow.camera.near = .5
  shadowLight.shadow.camera.far = 23
  shadowLight.shadow.bias = -.00012
  shadowLight.shadow.normalBias = .032
  shadowLight.shadow.radius = 3.5
  scene.add(shadowLight, shadowLight.target)

  const deskPool = new THREE.PointLight(0xffba7c, 2.6, 3.4, 2)
  deskPool.position.set(-.65, 1.76, -.15)
  scene.add(deskPool)
  const windowRim = new THREE.PointLight(0x68c9ea, 3.3, 5.3, 2)
  windowRim.position.set(-6.7, 2.9, -1.1)
  scene.add(windowRim)

  // Shared alpha texture for inexpensive localized contact shadowing.
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = shadowCanvas.height = 128
  const shCtx = shadowCanvas.getContext('2d')
  if (shCtx) {
    const radial = shCtx.createRadialGradient(64, 64, 9, 64, 64, 63)
    radial.addColorStop(0, 'rgba(0,0,0,.55)')
    radial.addColorStop(.48, 'rgba(0,0,0,.23)')
    radial.addColorStop(1, 'rgba(0,0,0,0)')
    shCtx.fillStyle = radial
    shCtx.fillRect(0, 0, 128, 128)
  }
  const shadowTex = new THREE.CanvasTexture(shadowCanvas)
  textures.push(shadowTex)
  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: shadowTex, transparent: true, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -1, toneMapped: false,
  })
  materials.push(shadowMaterial)
  function contactShadow(x: number, z: number, w: number, d: number): void {
    const plane = mesh(new THREE.PlaneGeometry(w, d), shadowMaterial, x, .025, z, false)
    plane.rotation.x = -Math.PI / 2
    plane.renderOrder = 1
  }
  contactShadow(0, .42, 5.7, 3.0)
  contactShadow(-5.43, -5.12, 3.8, 1.8)
  contactShadow(5.02, -4.65, 3.6, 2.0)
  contactShadow(2.63, -5.35, 2.7, 1.1)
  contactShadow(6.48, -5.34, 2.7, 1.1)

  // 3. Hero prop: desk housing, beveled alloy edge, precision fasteners and
  // inset keyboard keys. The eye starts next to this desk, so it receives
  // the highest modelling detail budget.
  rounded(4.53, .12, 1.88, 0, 1.06, .44, anodized, .04)
  rounded(4.34, .035, 1.70, 0, 1.126, .43, darkAlloy, .014)
  smallBox(4.24, .028, .022, 0, 1.085, 1.385, rimMetal)
  smallBox(3.8, .019, .022, 0, 1.086, 1.413, cyan, false)
  for (const x of [-2.11, 2.11]) {
    for (const z of [-.33, 1.16]) {
      rivet(x, 1.113, z)
      rounded(.18, .51, .17, x, .42, z, darkAlloy, .02)
    }
  }
  rounded(1.39, .048, .49, .55, 1.16, .96, darkAlloy, .026)
  // A single InstancedMesh keeps keyboard draw calls independent of key count.
  const keyGeo = new RoundedBoxGeometry(.082, .025, .07, 1, .008)
  geometries.push(keyGeo)
  const keyCount = 45
  const keys = new THREE.InstancedMesh(keyGeo, graphite, keyCount)
  const dummy = new THREE.Object3D()
  for (let i = 0; i < keyCount; i++) {
    dummy.position.set(-.035 + (i % 15) * .085, 1.202, .835 + Math.floor(i / 15) * .092)
    dummy.updateMatrix()
    keys.setMatrixAt(i, dummy.matrix)
  }
  keys.castShadow = false
  detail.add(keys)
  rounded(1.33, .88, .105, .72, 1.70, -.165, anodized, .045)
  for (const xx of [.075, 1.365]) {
    smallBox(.035, .82, .022, xx, 1.70, -.059, rimMetal, false)
  }
  for (const yy of [1.28, 2.11]) {
    smallBox(1.34, .028, .022, .72, yy, -.06, rimMetal, false)
  }
  badge(.72, 1.242, -.03, cyan)
  for (const dx of [-.57, -.50, -.43]) {
    ball(.014, .72 + dx, 1.244, -.04, warm)
  }
  // Animated-looking but static status bar (no false telemetry).
  for (let i = 0; i < 7; i++) {
    smallBox(.06, .012, .018, .34 + i * .125, 2.108, -.037, i === 5 ? warm : dimBlue, false)
  }
  // Machined mug with actual cylindrical rim and readable handle.
  const mugBody = mesh(new THREE.CylinderGeometry(.117, .10, .20, 20, 1), ceramic, 1.48, 1.205, .88)
  mugBody.castShadow = true
  torus(.11, .018, 1.48, 1.312, .88, rimMetal, 'y')
  torus(.085, .020, 1.62, 1.213, .88, ceramic, 'x')
  mesh(new THREE.CylinderGeometry(.089, .089, .006, 20), graphite, 1.48, 1.306, .88, false)
  // Desk document binder spines and five physical tabs.
  for (let i = 0; i < 5; i++) {
    rounded(.31, .022, .43, -1.38 + i * .31, 1.151, .88,
      i % 2 ? paper : platedCopper, .008)
    smallBox(.085, .009, .045, -1.46 + i * .31, 1.169, .61, warm, false)
  }
  // More convincing articulated task lamp shade and a warm cast pool.
  const lampShade = mesh(new THREE.CylinderGeometry(.14, .23, .22, 18, 1), anodized,
    -.65, 1.94, -.21)
  lampShade.rotation.z = -.17
  mesh(new THREE.CylinderGeometry(.128, .128, .014, 18), warm, -.65, 1.829, -.21, false)
  rod(new THREE.Vector3(-1.32, 1.09, .25), new THREE.Vector3(-1.06, 1.75, .00), .045, rimMetal)
  rod(new THREE.Vector3(-1.06, 1.75, .00), new THREE.Vector3(-.66, 1.94, -.21), .042, darkAlloy)

  // 4. Mission Files: multilayer display frame, visible drawers, fasteners,
  // status lamps and structural fins. Keep its existing raycast target intact.
  rounded(2.67, 2.41, .14, -5.45, 1.48, -5.07, anodized, .06)
  rounded(2.36, 1.27, .09, -5.45, 2.06, -4.67, darkAlloy, .045)
  for (const x of [-6.61, -4.29]) {
    smallBox(.06, 1.21, .05, x, 2.07, -4.58, rimMetal)
  }
  for (const y of [1.467, 2.67]) {
    smallBox(2.39, .04, .05, -5.45, y, -4.58, rimMetal)
  }
  for (let i = 0; i < 3; i++) {
    const y = .67 + i * .29
    rounded(2.21, .23, .08, -5.45, y, -4.535, darkAlloy, .023)
    rounded(.55, .032, .042, -5.45, y, -4.475, rimMetal, .01)
    badge(-6.38, y, -4.468, i === 0 ? warm : cyan)
  }
  for (const x of [-6.65, -4.25]) {
    for (const y of [.29, 2.63]) {
      rivet(x, y, -4.535)
    }
  }
  for (const y of [1.05, 1.77, 2.43]) {
    smallBox(.023, .33, .035, -6.83, y, -5.06, platedCopper, false)
    smallBox(.023, .33, .035, -4.06, y, -5.06, platedCopper, false)
  }

  // 5. Evidence board: exposed industrial bracket, pins, segmented framing
  // and thin cable routing (the content remains fictional/placeholder).
  rounded(2.76, 1.62, .13, -1.88, 2.57, -5.96, anodized, .055)
  for (const y of [1.83, 3.32]) {
    rounded(2.78, .045, .10, -1.88, y, -5.71, rimMetal, .014)
  }
  for (const x of [-3.19, -.57]) {
    smallBox(.052, 1.55, .08, x, 2.575, -5.69, rimMetal)
  }
  for (const x of [-3.10, -.68]) {
    for (const y of [1.92, 3.25]) rivet(x, y, -5.605)
  }
  for (const x of [-2.85, -2.32, -1.77, -1.24]) {
    ball(.026, x, 2.79 + Math.sin(x) * .09, -5.61, warm)
  }
  for (let i = 0; i < 4; i++) {
    smallBox(.10, .016, .017, -2.8 + i * .37, 1.97, -5.60, i % 2 ? warm : cyan, false)
  }

  // 6. Octagonal archive door: nested metal brace and structural corner bolts.
  // No additional interactable surfaces; user still clicks the original hitbox.
  const centre = new THREE.Vector3(5.02, 2.02, -5.29)
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + i * Math.PI / 4
    const b = Math.PI / 8 + (i + 1) * Math.PI / 4
    const pa = new THREE.Vector3(
      centre.x + Math.sin(a) * 1.69, centre.y + Math.cos(a) * 1.69, centre.z + .14)
    const pb = new THREE.Vector3(
      centre.x + Math.sin(b) * 1.69, centre.y + Math.cos(b) * 1.69, centre.z + .14)
    rod(pa, pb, .050, rimMetal)
    const d = new THREE.Vector3(
      centre.x + Math.sin(a) * 1.72, centre.y + Math.cos(a) * 1.72, centre.z + .20)
    ball(.043, d.x, d.y, d.z, platedCopper)
  }
  rounded(.88, .14, .65, 6.93, .36, -4.1, darkAlloy, .05)
  rounded(.78, .04, .56, 6.93, .45, -4.1, rimMetal, .02)
  for (let i = 0; i < 5; i++) {
    smallBox(.065, .024, .02, 6.62 + i * .14, .96, -3.82, i === 3 ? warm : cyan, false)
  }
  // Slim readable floor-guide strips at the threshold.
  for (const z of [-4.27, -3.94, -3.61]) {
    rounded(2.45, .021, .045, 5.03, .06, z, warm, .006)
  }

  // 7. Ceiling ring: machined outer sleeve and discrete caged accents.
  torus(1.59, .048, 0, 4.50, -.9, rimMetal, 'y')
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6
    ball(.046, Math.cos(a) * 1.54, 4.49, -.9 + Math.sin(a) * 1.54,
      i % 3 === 0 ? platedCopper : anodized)
    if (i % 2 === 0) {
      const a2 = a + Math.PI / 22
      rod(
        new THREE.Vector3(Math.cos(a2) * 1.56, 4.55, -.9 + Math.sin(a2) * 1.56),
        new THREE.Vector3(Math.cos(a2) * 1.98, 4.58, -.9 + Math.sin(a2) * 1.98),
        .028, darkAlloy)
    }
  }

  // 8. Architectural texture and wall module panel lines, not a new room
  // layout. Stay within the designer's existing navy/cyan/amber language.
  for (const x of [-7.34, -3.86, 0.95, 3.92, 7.33]) {
    for (const y of [1.05, 2.06, 3.08]) {
      smallBox(.22, .075, .035, x, y, -5.92, darkAlloy, false)
      smallBox(.13, .010, .038, x, y, -5.89, y > 3 ? warm : dimBlue, false)
    }
  }
  for (const z of [-4.8, -2.6, -.4, 1.8, 4.0]) {
    for (const x of [-7.83, 7.83]) {
      smallBox(.07, .45, .44, x, 2.6, z, anodized)
      ball(.027, x + (x > 0 ? -.05 : .05), 2.58, z, platedCopper)
    }
  }

  // Environmental "lived-in" props, kept secondary to actual interactive
  // objects and bounded so the room doesn't become a cluttered sci-fi catalog.
  for (const [x, z] of [[-4.94, -5.17], [2.18, -5.28], [6.55, -5.18]]) {
    const handle = rounded(.42, .038, .24, x, .69, z + .31, graphite, .012)
    handle.rotation.y = .03
    badge(x, .73, z + .455, cyan)
  }
  for (let i = 0; i < 3; i++) {
    const x = 2.21 + i * .34
    rounded(.29, .04, .21, x, .63, -5.2, i === 1 ? paper : darkAlloy, .011)
  }

  return {
    dispose: () => {
      detail.removeFromParent()
      scene.remove(shadowLight, shadowLight.target, deskPool, windowRim)
      for (const texture of textures) texture.dispose()
      for (const geometry of geometries) geometry.dispose()
      for (const mat of materials) mat.dispose()
    },
  }
}
