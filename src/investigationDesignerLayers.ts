// Designer-fidelity layer experiment. Each region reuses the ORIGINAL artwork
// at the same fixed coordinates; no invented scene geometry is introduced.
// Existing camera and hotspot IDs are unchanged. Replacement with clean
// artist-exported transparent object layers remains the production goal.
export const INVESTIGATION_DESIGNER_LAYERS = [
  { assetId: 'investigation.original.mission-files-cutout', region: 'files', depth: 'mid' },
  { assetId: 'investigation.original.evidence-board-cutout', region: 'board', depth: 'mid' },
  { assetId: 'investigation.original.desk-cutout', region: 'desk', depth: 'near' },
  { assetId: 'investigation.original.archive-portal-cutout', region: 'portal', depth: 'mid' },
  { assetId: 'investigation.original.left-foreground-cutout', region: 'left-front', depth: 'front' },
  { assetId: 'investigation.original.right-foreground-cutout', region: 'right-front', depth: 'front' },
] as const
