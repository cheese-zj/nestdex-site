import { useState } from 'react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const reelSegments = [
  { end: 7.7667, mode: 'Autonomous outer policy', task: 'Tongs transfer', detail: 'Rollout 01 · retrieve tool → transfer carrot', speed: '4×' },
  { end: 17.4333, mode: 'Autonomous outer policy', task: 'Tongs transfer', detail: 'Rollout 05 · retrieve tool → transfer carrot', speed: '3×' },
  { end: 24.4333, mode: 'Autonomous outer policy', task: 'Bottle disposal', detail: 'Rollout 01 · grasp bottle → place in bin', speed: '3×' },
  { end: 31.7667, mode: 'Autonomous outer policy', task: 'Dual-object transfer', detail: 'Rollout 01 · wide setup → contact close-up → dispose', speed: '3×' },
  { end: 39.7667, mode: 'Autonomous outer policy', task: 'Dual-object transfer', detail: 'Rollout 04 · collect both objects → dispose', speed: '3×' },
  { end: 46.4333, mode: 'Copilot-assisted collection', task: 'Toast preparation', detail: 'Demonstration 01 · pick up bread → insert in toaster', speed: '6×' },
  { end: 56.4333, mode: 'Copilot-assisted collection', task: 'Toast preparation', detail: 'Demonstration 02 · press toaster lever → begin toasting', speed: '5×' },
  { end: 60.4333, mode: 'Copilot-assisted collection', task: 'Binder filing', detail: 'Demonstration 02 · pick up paper → align with hole punch', speed: '4×' },
  { end: 62.8333, mode: 'Copilot-assisted collection', task: 'Binder filing', detail: 'Demonstration 02 · feed paper into hole punch', speed: '5×' },
  { end: 68.333, mode: 'Copilot-assisted collection', task: 'Binder filing', detail: 'Demonstration 02 · press hole punch → holes complete', speed: '4×' },
]

export default function HeroReel() {
  const [segmentIndex, setSegmentIndex] = useState(0)
  const segment = reelSegments[segmentIndex]

  return (
    <figure className="hero-media hero-video-shell">
      <div className="hero-reel">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={asset('media/hero-action-cut-poster.jpg?v=10')}
          onTimeUpdate={(event) => {
            const nextIndex = reelSegments.findIndex((item) => event.currentTarget.currentTime < item.end)
            setSegmentIndex(nextIndex === -1 ? reelSegments.length - 1 : nextIndex)
          }}
        >
          <source src={asset('media/hero-action-cut.mp4?v=10')} type="video/mp4" />
        </video>
        <div className="hero-reel-label" key={`${segment.task}-${segment.detail}`}>
          <div className={`hero-reel-mode${segment.mode.startsWith('Copilot') ? ' is-assisted' : ''}`}>
            <strong>{segment.mode}</strong>
            <span>{String(segmentIndex + 1).padStart(2, '0')} / {reelSegments.length}</span>
          </div>
          <p>{segment.task}<strong>{segment.speed}</strong></p>
          <span>{segment.detail}</span>
        </div>
      </div>
    </figure>
  )
}
