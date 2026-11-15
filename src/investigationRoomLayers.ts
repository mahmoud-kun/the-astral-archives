// Camera V3-compatible experimental full-room art. All IDs are stable
// placeholders for designer handoff; files are separate SVGs, not one panorama.
// Draw order: opaque architecture, wall structure, midground furniture,
// nearer props, foreground edge, and soft lighting. No NASA data in artwork.
export const INVESTIGATION_ROOM_LAYERS = [
  { assetId: 'investigation.room.environment.v2', path: '/assets/experiments/investigation-room-v2/environment.svg', depth: 'far' },
  { assetId: 'investigation.room.structure.v2', path: '/assets/experiments/investigation-room-v2/structure.svg', depth: 'far' },
  { assetId: 'investigation.room.cabinet.v2', path: '/assets/experiments/investigation-room-v2/cabinet.svg', depth: 'mid' },
  { assetId: 'investigation.room.folders.v2', path: '/assets/experiments/investigation-room-v2/folders.svg', depth: 'near' },
  { assetId: 'investigation.room.board.v2', path: '/assets/experiments/investigation-room-v2/evidence-board.svg', depth: 'mid' },
  { assetId: 'investigation.room.desk.v2', path: '/assets/experiments/investigation-room-v2/desk-terminal.svg', depth: 'near' },
  { assetId: 'investigation.room.door.v2', path: '/assets/experiments/investigation-room-v2/archive-door.svg', depth: 'mid' },
  { assetId: 'investigation.room.foreground.v2', path: '/assets/experiments/investigation-room-v2/foreground.svg', depth: 'foreground' },
  { assetId: 'investigation.room.lighting.v2', path: '/assets/experiments/investigation-room-v2/lighting.svg', depth: 'light' },
] as const
