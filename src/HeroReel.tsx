import { useState } from 'react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const reelSegments = [
  { end: 8.8667, mode: 'Autonomous outer policy', task: 'Tongs transfer', detail: 'Rollout 01 · retrieve tool → transfer carrot', speed: '3.5×' },
  { end: 17.6667, mode: 'Autonomous outer policy', task: 'Tongs transfer', detail: 'Rollout 05 · retrieve tool → transfer carrot', speed: '3.3×' },
  { end: 25.1667, mode: 'Autonomous outer policy', task: 'Bottle disposal', detail: 'Rollout 01 · grasp bottle → place in bin', speed: '2.8×' },
  { end: 32.8333, mode: 'Autonomous outer policy', task: 'Bottle disposal', detail: 'Rollout 02 · grasp bottle → place in bin', speed: '3.0×' },
  { end: 40.1667, mode: 'Autonomous outer policy', task: 'Dual-object transfer', detail: 'Rollout 01 · collect both objects → dispose', speed: '3.0×' },
  { end: 47.6667, mode: 'Autonomous outer policy', task: 'Dual-object transfer', detail: 'Rollout 04 · collect both objects → dispose', speed: '3.2×' },
  { end: 54.9333, mode: 'Copilot-assisted collection', task: 'Toast preparation', detail: 'Demonstration 01 · pick up bread → insert in toaster', speed: '5.5×' },
  { end: 62.0333, mode: 'Copilot-assisted collection', task: 'Toast preparation', detail: 'Demonstration 02 · pick up bread → insert in toaster', speed: '4.5×' },
  { end: 67.5333, mode: 'Copilot-assisted collection', task: 'Binder filing', detail: 'Demonstration 02 · pick up paper → feed into hole punch', speed: '4.0×' },
  { end: 72.8667, mode: 'Copilot-assisted collection', task: 'Binder filing', detail: 'Demonstration 02 · press hole punch → holes complete', speed: '4.5×' },
  { end: 80.366, mode: 'Copilot-assisted collection', task: 'Binder filing', detail: 'Demonstration 02 · open binder → file paper', speed: '6.0×' },
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
          poster={asset('media/hero-action-cut-poster.jpg?v=5')}
          onTimeUpdate={(event) => {
            const nextIndex = reelSegments.findIndex((item) => event.currentTarget.currentTime < item.end)
            setSegmentIndex(nextIndex === -1 ? reelSegments.length - 1 : nextIndex)
          }}
        >
          <source src={asset('media/hero-action-cut.mp4?v=5')} type="video/mp4" />
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
