import * as THREE from 'three'

export type InvestigationTarget = 'mission-files' | 'evidence-board' | 'desk-terminal' | 'door'

const NAVY = 0x0c2538
const STEEL = 0x24485c
const TRIM = 0x365c6d
const CYAN = 0x35e3e9
const AMBER = 0xffa65b
const CREAM = 0xe8dcc3

export type RoomScene = {
  targets: THREE.Object3D[]
  dispose: () => void
}

/**
 * A lightweight original prototype scene. It follows the designer's left,
 * center and right room composition but does not import, crop or render
 * the reference panorama. All equipment is a replaceable 3D object group.
 *
 * Coordinates: room front -Z, back +Z; stationary observer sits at
 * (0, 1.63, 2.45), behind the center investigation desk.
 */
export function buildInvestigationRoom(scene: THREE.Scene): RoomScene {
  const mats: THREE.Material[] = []
  const geos: THREE.BufferGeometry[] = []
  const textures: THREE.Texture[] = []
  const targets: THREE.Object3D[] = []

  function mat(color: number, glow = 0, metallic = 0.34): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      color, metalness: metallic, roughness: 0.58,
      emissive: glow || 0x000000, emissiveIntensity: glow ? 0.43 : 0,
    })
    mats.push(material)
    return material
  }
  function lightMat(color: number): THREE.MeshBasicMaterial {
    const m = new THREE.MeshBasicMaterial({ color, toneMapped: false })
    mats.push(m)
    return m
  }
  const wall = mat(NAVY)
  const dark = mat(0x071827)
  const floorMat = mat(0x102c40, 0, 0.2)
  const metal = mat(STEEL)
  const border = mat(TRIM)
  const black = mat(0x061320)
  const glass = mat(0x123c54, 0x08394f, 0.12)
  const cyan = lightMat(CYAN)
  const amber = lightMat(AMBER)
  const paper = mat(CREAM, 0, 0.02)
  const brass = mat(0xb77a44, 0, 0.55)

  function box(w: number, h: number, d: number, x: number, y: number, z: number,
    material: THREE.Material = metal, parent: THREE.Object3D = scene): THREE.Mesh {
    const geo = new THREE.BoxGeometry(w, h, d)
    geos.push(geo)
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.set(x, y, z)
    parent.add(mesh)
    return mesh
  }
  function cylinder(radius: number, height: number, x: number, y: number, z: number,
    material: THREE.Material, segments = 16): THREE.Mesh {
    const geo = new THREE.CylinderGeometry(radius, radius, height, segments)
    geos.push(geo)
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.set(x, y, z)
    scene.add(mesh)
    return mesh
  }
  function beam(a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material): THREE.Mesh {
    const dir = new THREE.Vector3().subVectors(b, a)
    const geo = new THREE.CylinderGeometry(radius, radius, dir.length(), 7)
    geos.push(geo)
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.copy(a).add(b).multiplyScalar(0.5)
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    scene.add(mesh)
    return mesh
  }
  function torus(radius: number, tube: number, x: number, y: number, z: number,
    material: THREE.Material, horizontal = false): THREE.Mesh {
    const geo = new THREE.TorusGeometry(radius, tube, 8, 40)
    geos.push(geo)
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.set(x, y, z)
    if (horizontal) mesh.rotation.x = Math.PI / 2
    scene.add(mesh)
    return mesh
  }
  function labelTexture(title: string, kind: 'files'|'board'|'terminal'|'status'|'window' = 'terminal'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const fill = ctx.createLinearGradient(0, 0, 512, 256)
      fill.addColorStop(0, '#103c52')
      fill.addColorStop(1, '#041827')
      ctx.fillStyle = fill
      ctx.fillRect(0, 0, 512, 256)
      ctx.strokeStyle = '#38ddeb'
      ctx.lineWidth = 5
      ctx.strokeRect(16, 16, 480, 224)
      ctx.fillStyle = '#dcefe8'
      ctx.font = 'bold 23px monospace'
      ctx.fillText(title, 40, 62)
      ctx.strokeStyle = '#30cfe1'
      ctx.lineWidth = 2
      if (kind === 'files') {
        for (let i = 0; i < 5; i++) {
          const x = 43 + i * 89
          ctx.strokeRect(x, 104, 72, 55)
          ctx.fillStyle = '#e2aa72'
          ctx.font = '16px monospace'
          ctx.fillText('0' + (i + 1), x + 23, 194)
          ctx.fillStyle = '#dcefe8'
        }
      } else if (kind === 'board') {
        for (let i = 0; i < 4; i++) {
          ctx.strokeStyle = i % 2 ? '#f2a36f' : '#3be3e8'
          ctx.strokeRect(52 + i * 110, 99 + (i % 2) * 23, 76, 70)
        }
        ctx.strokeStyle = '#e5a467'
        ctx.beginPath()
        ctx.moveTo(76, 184)
        ctx.lineTo(164, 199)
        ctx.lineTo(273, 185)
        ctx.lineTo(397, 210)
        ctx.stroke()
      } else if (kind === 'window') {
        const stars = Array.from({ length: 55 }, (_, i) => ({
          x: (i * 233 + 47) % 512, y: (i * 113 + 19) % 256
        }))
        ctx.fillStyle = '#b0dbef'
        stars.forEach(s => ctx.fillRect(s.x, s.y, 2, 2))
        ctx.fillStyle = '#2e7da2'
        ctx.beginPath()
        ctx.ellipse(140, 304, 250, 143, -0.15, Math.PI, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#b7d1ce'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.ellipse(140, 304, 250, 143, -0.15, Math.PI, Math.PI * 2)
        ctx.stroke()
      } else {
        ctx.strokeStyle = '#5ce4e7'
        ctx.beginPath()
        for (let i = 0; i < 12; i++) {
          const x = 43 + i * 36
          const y = 146 + Math.sin(i * 0.9) * 34
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.fillStyle = '#f2a56c'
        ctx.font = '15px monospace'
        ctx.fillText(kind === 'status' ? 'STATION / PRESENT' : 'RECORDS / READY', 42, 211)
      }
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    textures.push(tex)
    return tex
  }
  function display(w: number, h: number, x: number, y: number, z: number,
    title: string, kind: 'files'|'board'|'terminal'|'status'|'window' = 'terminal',
    rotY = 0): THREE.Mesh {
    box(w + 0.19, h + 0.19, 0.11, x, y, z - 0.09, border).rotation.y = rotY
    const geo = new THREE.PlaneGeometry(w, h)
    geos.push(geo)
    const material = new THREE.MeshBasicMaterial({ map: labelTexture(title, kind), side: THREE.DoubleSide })
    mats.push(material)
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.set(x, y, z + 0.02)
    mesh.rotation.y = rotY
    scene.add(mesh)
    return mesh
  }
  function hotspot(id: InvestigationTarget, x: number, y: number, z: number,
    w: number, h: number, rotY = 0): void {
    const geo = new THREE.PlaneGeometry(w, h)
    geos.push(geo)
    const invisible = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0, depthWrite: false,
      side: THREE.DoubleSide, colorWrite: false
    })
    mats.push(invisible)
    const area = new THREE.Mesh(geo, invisible)
    area.position.set(x, y, z)
    area.rotation.y = rotY
    area.userData.target = id
    scene.add(area)
    targets.push(area)
  }
  function shelf(x: number, y: number, z: number, count: number): void {
    box(1.4, 2.2, 0.49, x, y, z, dark)
    for (let j = 0; j < 4; j++) {
      box(1.47, 0.07, 0.54, x, y - 1.0 + j * 0.68, z + 0.06, border)
    }
    const colors = [mat(0x3d6274), mat(0x98714c), mat(0x50707a)]
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / 8)
      const col = i % 8
      box(0.10, 0.27 + (i % 3) * 0.09, 0.32,
        x - 0.55 + col * 0.15,
        y - 0.81 + row * 0.69,
        z + 0.19, colors[i % 3])
    }
  }

  // Real volume and occlusion, visible from every facing direction.
  box(16.2, 0.24, 12.2, 0, -0.13, 0, floorMat)
  box(16.2, 0.26, 12.2, 0, 4.76, 0, dark)
  box(16.2, 4.75, 0.19, 0, 2.36, -6.06, wall)
  box(16.2, 4.75, 0.19, 0, 2.36, 6.06, wall)
  box(0.19, 4.75, 12.2, -8.06, 2.36, 0, wall)
  box(0.19, 4.75, 12.2, 8.06, 2.36, 0, wall)

  // Surface grid and the designer's continuous cyan/amber station language.
  for (let i = -7; i <= 7; i++) {
    box(0.019, 0.015, 12, i, 0.006, 0, border)
  }
  for (let z = -5; z <= 5; z += 1.2) {
    box(16, 0.018, 0.018, 0, 0.007, z, border)
  }
  for (const x of [-6.9, -3.5, 0, 3.5, 6.9]) {
    box(0.18, 4.65, 0.33, x, 2.4, -5.91, metal)
    box(0.055, 3.5, 0.36, x + 0.14, 2.35, -5.65, cyan)
  }
  for (const z of [-4.6, -2.25, 0.1, 2.45, 4.75]) {
    box(0.2, 4.65, 0.39, -7.85, 2.4, z, metal)
    box(0.2, 4.65, 0.39, 7.85, 2.4, z, metal)
    box(15.9, 0.17, 0.32, 0, 4.48, z, STEEL_MAT())
  }
  function STEEL_MAT(): THREE.Material { return metal }
  for (const z of [-3.6, -0.4, 2.8]) {
    box(15.75, 0.10, 0.10, 0, 4.29, z, cyan)
    box(15.75, 0.09, 0.12, 0, 4.40, z + 0.17, amber)
  }
  for (const y of [0.35, 4.1]) {
    box(16.0, 0.07, 0.15, 0, y, -5.85, amber)
    box(0.14, 0.06, 11.6, -7.86, y, 0, cyan)
    box(0.14, 0.06, 11.6, 7.86, y, 0, cyan)
  }
  torus(1.53, 0.11, 0, 4.53, -0.9, metal, true)
  torus(1.33, 0.07, 0, 4.51, -0.9, cyan, true)
  torus(1.10, 0.045, 0, 4.49, -0.9, amber, true)

  // Observation window on the LEFT wall, not a flat full-room illustration.
  const leftWindow = display(4.1, 2.2, -7.89, 2.50, -1.65, 'OBSERVATION DECK', 'window', Math.PI / 2)
  leftWindow.material.depthWrite = false
  for (const z of [-3.4, -1.5, 0.4]) {
    box(0.23, 2.42, 0.12, -7.72, 2.49, z, border)
  }

  // Mission Files console stays left of the evidence board.
  box(2.5, 2.20, 0.63, -5.45, 1.43, -5.32, metal)
  display(2.05, 1.10, -5.45, 2.03, -4.94, 'MISSION FILES', 'files')
  for (let i = 0; i < 3; i++) {
    box(2.16, 0.20, 0.68, -5.45, 0.66 + i * 0.29, -4.96, dark)
    box(0.52, 0.045, 0.04, -5.45, 0.67 + i * 0.29, -4.57, cyan)
  }
  hotspot('mission-files', -5.45, 1.82, -4.52, 2.35, 2.35)

  // Evidence board, center banner, research books.
  display(2.55, 1.45, -1.88, 2.58, -5.85, 'EVIDENCE / REVIEW', 'board')
  hotspot('evidence-board', -1.88, 2.54, -5.53, 2.67, 1.67)
  box(0.72, 1.98, 0.16, 0.49, 3.01, -5.80, dark)
  box(0.14, 0.62, 0.20, 0.49, 3.17, -5.68, amber)
  display(0.48, 0.56, 0.49, 3.31, -5.67, 'ASTRAL', 'status')
  shelf(2.63, 1.92, -5.55, 24)
  shelf(6.48, 1.95, -5.50, 24)

  // Octagonal entrance at the RIGHT side of the far wall.
  const cx = 5.02, cy = 2.02
  box(2.54, 3.20, 0.16, cx, cy, -5.68, black)
  function octagon(radius: number, z: number, material: THREE.Material, thickness: number): void {
    for (let i = 0; i < 8; i++) {
      const a = Math.PI / 8 + i * Math.PI / 4
      const b = Math.PI / 8 + (i + 1) * Math.PI / 4
      beam(new THREE.Vector3(cx + Math.sin(a) * radius, cy + Math.cos(a) * radius, z),
        new THREE.Vector3(cx + Math.sin(b) * radius, cy + Math.cos(b) * radius, z),
        thickness, material)
    }
  }
  octagon(1.76, -5.28, metal, 0.18)
  octagon(1.47, -5.10, cyan, 0.06)
  octagon(1.28, -5.00, amber, 0.038)
  for (let i = 0; i < 4; i++) {
    const f = 1 - i * 0.15
    box(2.8 * f, 0.08, 0.40, cx, 0.05 + i * 0.08, -4.60 + i * 0.39, i % 2 ? amber : metal)
  }
  display(0.72, 0.50, 6.93, 1.42, -4.1, 'ARCHIVE', 'status', -0.4)
  box(0.64, 1.20, 0.5, 6.93, 0.61, -4.1, metal)
  hotspot('door', cx, 2.04, -4.80, 2.8, 3.30)

  // A desk in FRONT of the seated investigator, not a viewed stage.
  box(4.32, 0.16, 1.75, 0, 0.90, 0.44, metal)
  box(4.45, 0.035, 1.82, 0, 1.00, 0.44, brass)
  for (const x of [-1.88, 1.88]) {
    for (const z of [-0.26, 1.13]) box(0.18, 0.83, 0.20, x, 0.43, z, dark)
  }
  box(3.5, 0.10, 0.16, 0, 0.72, -0.25, cyan)
  // Monitor faces the seated player.
  box(1.2, 0.95, 0.13, 0.72, 1.70, -0.11, black)
  display(1.08, 0.75, 0.72, 1.70, 0.005, 'DESK TERMINAL', 'terminal')
  box(0.10, 0.34, 0.10, 0.72, 1.12, 0, border)
  box(0.60, 0.05, 0.30, 0.72, 1.01, 0.05, border)
  box(1.28, 0.035, 0.37, 0.56, 1.04, 0.99, dark)
  for (let i = 0; i < 11; i++) box(0.06, 0.011, 0.19, 0.04 + i * 0.105, 1.066, 1.0, border)
  // Lamp, cup and 5 case folders along the table.
  cylinder(0.18, 0.045, -1.30, 1.07, 0.25, black)
  beam(new THREE.Vector3(-1.30, 1.07, 0.25), new THREE.Vector3(-1.04, 1.74, 0.0), 0.033, brass)
  beam(new THREE.Vector3(-1.04, 1.74, 0.0), new THREE.Vector3(-0.65, 1.91, -0.21), 0.029, brass)
  box(0.38, 0.16, 0.30, -0.65, 1.91, -0.21, amber)
  cylinder(0.105, 0.20, 1.48, 1.12, 0.89, paper)
  for (let i = 0; i < 5; i++) {
    const g = box(0.41, 0.023, 0.62, -1.32 + i * 0.29, 1.06 + i * 0.006, 0.83, i % 2 ? border : brass)
    g.rotation.y = 0.07 * (i - 2)
  }
  hotspot('desk-terminal', 0.65, 1.61, 0.15, 1.42, 1.27)

  // Two side cabinets and storage behind the observer, so 360° has content.
  shelf(-5.77, 1.66, 5.65, 16)
  shelf(5.55, 1.66, 5.65, 16)
  display(3.1, 1.25, 0.10, 2.53, 5.85, 'STATION / PRESENT', 'status', Math.PI)
  for (const x of [-2.0, 2.0]) {
    box(0.12, 3.9, 0.22, x, 2.4, 5.79, metal)
    box(0.045, 3.5, 0.24, x + 0.12, 2.3, 5.62, amber)
  }
  // Hardware and non-interactive cabinets on the right flank.
  for (let i = 0; i < 3; i++) {
    const z = -2.4 + i * 2.4
    box(0.7, 1.45, 1.6, 7.51, 1.15, z, metal)
    box(0.05, 0.11, 0.64, 7.12, 1.45, z, cyan)
  }
  // Left/rear utility storage near the room entrance.
  for (let i = 0; i < 3; i++) {
    box(1.0, 0.63, 0.68, -6.4, 0.36 + i * 0.63, 3.20, i % 2 ? border : metal)
  }

  scene.add(new THREE.AmbientLight(0x6f98b0, 0.8))
  scene.add(new THREE.HemisphereLight(0xa0d3df, 0x142131, 1.2))
  const main = new THREE.PointLight(0x4ce4ed, 17, 12)
  main.position.set(0, 4.13, -0.9)
  scene.add(main)
  const warm = new THREE.PointLight(0xff994c, 10, 8)
  warm.position.set(-1.0, 3.9, -3)
  scene.add(warm)
  const doorGlow = new THREE.PointLight(0x1ccee4, 10, 6)
  doorGlow.position.set(5, 2.4, -4.6)
  scene.add(doorGlow)

  return {
    targets,
    dispose: () => {
      for (const texture of textures) texture.dispose()
      for (const geo of geos) geo.dispose()
      for (const material of mats) material.dispose()
      scene.clear()
    },
  }
}
