import { useState } from 'react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const reelSegments = [
  { end: 8.8667, task: 'Tongs transfer', detail: 'Rollout 01 · retrieve tool → transfer carrot', speed: '3.5×' },
  { end: 17.6667, task: 'Tongs transfer', detail: 'Rollout 05 · retrieve tool → transfer carrot', speed: '3.3×' },
  { end: 25.1667, task: 'Bottle disposal', detail: 'Rollout 01 · grasp bottle → place in bin', speed: '2.8×' },
  { end: 32.8333, task: 'Bottle disposal', detail: 'Rollout 02 · grasp bottle → place in bin', speed: '3.0×' },
  { end: 40.1667, task: 'Dual-object transfer', detail: 'Rollout 01 · collect both objects → dispose', speed: '3.0×' },
  { end: 47.6667, task: 'Dual-object transfer', detail: 'Rollout 04 · collect both objects → dispose', speed: '3.2×' },
  { end: 54.9333, task: 'Toast preparation', detail: 'Rollout 01 · pick up bread → insert in toaster', speed: '5.5×' },
  { end: 62.0333, task: 'Toast preparation', detail: 'Rollout 02 · pick up bread → insert in toaster', speed: '4.5×' },
  { end: 69.7, task: 'Binder filing', detail: 'Rollout 02 · pick up paper → punch holes', speed: '6.0×' },
  { end: 77.2, task: 'Binder filing', detail: 'Rollout 02 · open binder → file paper', speed: '6.0×' },
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
          poster={asset('media/hero-action-cut-poster.jpg?v=4')}
          onTimeUpdate={(event) => {
            const nextIndex = reelSegments.findIndex((item) => event.currentTarget.currentTime < item.end)
            setSegmentIndex(nextIndex === -1 ? reelSegments.length - 1 : nextIndex)
          }}
        >
          <source src={asset('media/hero-action-cut.mp4?v=4')} type="video/mp4" />
        </video>
        <div className="hero-reel-label" key={`${segment.task}-${segment.detail}`}>
          <span>{String(segmentIndex + 1).padStart(2, '0')} / {reelSegments.length} · {segment.detail}</span>
          <p>{segment.task}<strong>{segment.speed}</strong></p>
        </div>
      </div>
    </figure>
  )
}
