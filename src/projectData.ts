export type VideoTask = {
  slug: string
  title: string
  kind: string
  description: string
  detail: string
  video: string
  poster: string
}

export const videoTasks: VideoTask[] = [
  {
    slug: 'tongs-transfer',
    title: 'Tongs Transfer',
    kind: 'Autonomous outer policy',
    description: 'Extract the tongs, grasp the wooden carrot, and transfer it to the pan.',
    detail: 'Single arm · tool use',
    video: 'videos/tongs-transfer.mp4',
    poster: 'videos/tongs-transfer.webp',
  },
  {
    slug: 'bottle-disposal',
    title: 'Bottle Disposal',
    kind: 'Autonomous outer policy',
    description: 'Open the bin lid, grasp the bottle, and place it inside.',
    detail: 'Single arm · articulated environment',
    video: 'videos/bottle-disposal.mp4',
    poster: 'videos/bottle-disposal.webp',
  },
  {
    slug: 'dual-object-transfer',
    title: 'Dual-Object Transfer',
    kind: 'Autonomous outer policy',
    description: 'Coordinate separate finger groups to grasp two blocks and move both into the bin.',
    detail: 'Single hand · multi-object grasp',
    video: 'videos/dual-object-transfer.mp4',
    poster: 'videos/dual-object-transfer.webp',
  },
  {
    slug: 'toast-preparation',
    title: 'Toast Preparation',
    kind: 'Copilot-assisted collection',
    description: 'A complete dual-arm demonstration spanning tongs grasp, toaster operation, plate positioning and return transfer.',
    detail: 'Dual arm · four skill stages',
    video: 'videos/toast-preparation.mp4',
    poster: 'videos/toast-preparation.webp',
  },
  {
    slug: 'binder-filing',
    title: 'Binder Filing',
    kind: 'Copilot-assisted collection',
    description: 'Remove paper, operate the hole punch, file the sheet and close the binder rings.',
    detail: 'Dual arm · three reusable hand skills',
    video: 'videos/binder-filing.mp4',
    poster: 'videos/binder-filing.webp',
  },
]
