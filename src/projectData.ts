export type VideoClip = {
  label: string
  video: string
  poster: string
}

export type VideoSet = {
  label: string
  clips: VideoClip[]
}

export type VideoTask = {
  slug: string
  title: string
  kind: string
  description: string
  detail: string
  sets: VideoSet[]
}

const clip = (folder: string, index: number, label: string): VideoClip => {
  const file = String(index).padStart(2, '0')
  return {
    label,
    video: `videos/${folder}/${file}.mp4`,
    poster: `videos/${folder}/${file}.webp`,
  }
}

const pairedSets = (folder: string, total: number, noun: string): VideoSet[] => {
  const sets: VideoSet[] = []
  for (let start = 1; start <= total; start += 2) {
    const end = Math.min(start + 1, total)
    const clips = [clip(folder, start, `${noun} ${String(start).padStart(2, '0')}`)]
    if (end !== start) clips.push(clip(folder, end, `${noun} ${String(end).padStart(2, '0')}`))
    sets.push({
      label: end === start
        ? `${noun} ${String(start).padStart(2, '0')}`
        : `${noun}s ${String(start).padStart(2, '0')}–${String(end).padStart(2, '0')}`,
      clips,
    })
  }
  return sets
}

export const videoTasks: VideoTask[] = [
  {
    slug: 'tongs-transfer',
    title: 'Tongs Transfer',
    kind: 'Autonomous outer policy',
    description: 'Extract the tongs, grasp the wooden carrot, and transfer it to the pan.',
    detail: '11 rollouts · single arm · tool use',
    sets: pairedSets('tongs', 11, 'Rollout'),
  },
  {
    slug: 'bottle-disposal',
    title: 'Bottle Disposal',
    kind: 'Autonomous outer policy',
    description: 'Open the bin lid, grasp the bottle, and place it inside.',
    detail: '2 rollouts · single arm · articulated environment',
    sets: pairedSets('bottle', 2, 'Rollout'),
  },
  {
    slug: 'dual-object-transfer',
    title: 'Dual-Object Transfer',
    kind: 'Autonomous outer policy',
    description: 'Coordinate separate finger groups to grasp two blocks and move both into the bin.',
    detail: '6 rollouts · single hand · multi-object grasp',
    sets: pairedSets('dual-object', 6, 'Rollout'),
  },
  {
    slug: 'toast-preparation',
    title: 'Toast Preparation',
    kind: 'Copilot-assisted collection',
    description: 'Complete dual-arm demonstrations spanning tongs grasp, toaster operation, plate positioning and return transfer.',
    detail: '5 demonstrations · dual arm · four skill stages',
    sets: pairedSets('toast', 5, 'Demo'),
  },
  {
    slug: 'binder-filing',
    title: 'Binder Filing',
    kind: 'Copilot-assisted collection',
    description: 'Remove paper, operate the hole punch, file the sheet and close the binder rings.',
    detail: '3 demonstrations · dual arm · three reusable hand skills',
    sets: pairedSets('binder', 3, 'Demo'),
  },
]
