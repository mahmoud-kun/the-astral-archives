/** Experimental original geometric redraw inspired by the designer room.
 * Every image is a separately exported, transparent SVG layer (except the
 * architecture backdrop). The designer's original WebP/PNG is NOT rendered.
 * Stable IDs allow replacement with final designer-authorized art.
 */
export const INVESTIGATION_FAITHFUL_LAYERS = [
  { assetId: 'investigation.v2.2.architecture', path: '/assets/experiments/investigation-room-v2-2/architecture.svg', depth: 'back' },
  { assetId: 'investigation.v2.2.window', path: '/assets/experiments/investigation-room-v2-2/window-observation.svg', depth: 'far' },
  { assetId: 'investigation.v2.2.ceiling', path: '/assets/experiments/investigation-room-v2-2/ceiling-ring.svg', depth: 'far' },
  { assetId: 'investigation.v2.2.banner', path: '/assets/experiments/investigation-room-v2-2/station-banner.svg', depth: 'far' },
  { assetId: 'investigation.v2.2.rug', path: '/assets/experiments/investigation-room-v2-2/floor-rug.svg', depth: 'mid' },
  { assetId: 'investigation.v2.2.board', path: '/assets/experiments/investigation-room-v2-2/evidence-board.svg', depth: 'mid' },
  { assetId: 'investigation.v2.2.shelves', path: '/assets/experiments/investigation-room-v2-2/center-shelves.svg', depth: 'mid' },
  { assetId: 'investigation.v2.2.right-shelves', path: '/assets/experiments/investigation-room-v2-2/right-archive-shelves.svg', depth: 'mid' },
  { assetId: 'investigation.v2.2.portal', path: '/assets/experiments/investigation-room-v2-2/archive-portal.svg', depth: 'mid' },
  { assetId: 'investigation.v2.2.mission-terminal', path: '/assets/experiments/investigation-room-v2-2/mission-files-terminal.svg', depth: 'mid' },
  { assetId: 'investigation.v2.2.left-workbench', path: '/assets/experiments/investigation-room-v2-2/left-workbench.svg', depth: 'mid' },
  { assetId: 'investigation.v2.2.lounge-chair', path: '/assets/experiments/investigation-room-v2-2/lounge-chair.svg', depth: 'mid' },
  { assetId: 'investigation.v2.2.plants', path: '/assets/experiments/investigation-room-v2-2/plants.svg', depth: 'near' },
  { assetId: 'investigation.v2.2.desk', path: '/assets/experiments/investigation-room-v2-2/investigation-desk.svg', depth: 'near' },
  { assetId: 'investigation.v2.2.desk-props', path: '/assets/experiments/investigation-room-v2-2/desk-accessories.svg', depth: 'near' },
  { assetId: 'investigation.v2.2.desk-chair', path: '/assets/experiments/investigation-room-v2-2/investigator-chair.svg', depth: 'front' },
  { assetId: 'investigation.v2.2.portal-console', path: '/assets/experiments/investigation-room-v2-2/portal-console.svg', depth: 'near' },
  { assetId: 'investigation.v2.2.right-workstation', path: '/assets/experiments/investigation-room-v2-2/right-workstation.svg', depth: 'near' },
  { assetId: 'investigation.v2.2.foreground', path: '/assets/experiments/investigation-room-v2-2/foreground-cases.svg', depth: 'front' },
  { assetId: 'investigation.v2.2.lighting', path: '/assets/experiments/investigation-room-v2-2/station-lighting.svg', depth: 'light' },
] as const
