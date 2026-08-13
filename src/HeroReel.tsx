import { useState } from 'react'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const reelSegments = [
  { end: 2.8667, task: 'Tongs transfer', detail: 'Rollout 01', speed: '2.8×' },
  { end: 5.6667, task: 'Tongs transfer', detail: 'Rollout 05', speed: '3.2×' },
  { end: 8.4667, task: 'Bottle disposal', detail: 'Rollout 01', speed: '3.2×' },
  { end: 11.4333, task: 'Bottle disposal', detail: 'Rollout 02', speed: '4.4×' },
  { end: 14.2333, task: 'Dual-object transfer', detail: 'Rollout 01', speed: '5.0×' },
  { end: 17.2333, task: 'Dual-object transfer', detail: 'Rollout 04', speed: '6.0×' },
  { end: 20.4, task: 'Toast preparation', detail: 'Rollout 01 · insert bread', speed: '2.2×' },
  { end: 23.4, task: 'Toast preparation', detail: 'Rollout 02 · insert bread', speed: '4.0×' },
  { end: 26.4, task: 'Binder filing', detail: 'Rollout 02 · punch paper', speed: '10.0×' },
  { end: 29.4, task: 'Binder filing', detail: 'Rollout 02 · file paper', speed: '10.0×' },
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
          poster={asset('media/hero-action-cut-poster.jpg?v=3')}
          onTimeUpdate={(event) => {
            const nextIndex = reelSegments.findIndex((item) => event.currentTarget.currentTime < item.end)
            setSegmentIndex(nextIndex === -1 ? reelSegments.length - 1 : nextIndex)
          }}
        >
          <source src={asset('media/hero-action-cut.mp4?v=3')} type="video/mp4" />
        </video>
        <div className="hero-reel-label" key={`${segment.task}-${segment.detail}`}>
          <span>{String(segmentIndex + 1).padStart(2, '0')} / {reelSegments.length} · {segment.detail}</span>
          <p>{segment.task}<strong>{segment.speed}</strong></p>
        </div>
      </div>
      <figcaption><span>Ten highlights from distinct task moments</span><span>Each segment shows its individual playback rate</span></figcaption>
    </figure>
  )
}
