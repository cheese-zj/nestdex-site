import { useState } from 'react'
import { videoTasks } from './projectData'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export default function VideoLibrary() {
  const [taskIndex, setTaskIndex] = useState(0)
  const [setIndex, setSetIndex] = useState(0)
  const task = videoTasks[taskIndex]
  const selectedSet = task.sets[setIndex]

  const selectTask = (index: number) => {
    setTaskIndex(index)
    setSetIndex(0)
  }

  return (
    <div className="video-library">
      <div className="task-selector" role="tablist" aria-label="NestDex task">
        {videoTasks.map((item, index) => {
          const itemClipCount = item.sets.reduce((count, set) => count + set.clips.length, 0)
          return (
            <button
              aria-controls="selected-task-video"
              aria-selected={index === taskIndex}
              className={index === taskIndex ? 'is-active' : ''}
              key={item.slug}
              onClick={() => selectTask(index)}
              role="tab"
              type="button"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.title}
              <small>{itemClipCount} videos · {item.kind}</small>
            </button>
          )
        })}
      </div>

      <div className="video-stage" id="selected-task-video" role="tabpanel">
        <div className="video-stage-heading">
          <div>
            <p>{task.kind}</p>
            <h3>{task.title}</h3>
          </div>
          <div>
            <p>{task.description}</p>
            <span>{task.detail}</span>
          </div>
        </div>

        <div className="recording-tabs" role="tablist" aria-label={`${task.title} recording group`}>
          {task.sets.map((set, index) => (
            <button
              aria-selected={index === setIndex}
              className={index === setIndex ? 'is-active' : ''}
              key={set.label}
              onClick={() => setSetIndex(index)}
              role="tab"
              type="button"
            >
              {set.label}
            </button>
          ))}
        </div>

        <div className={`recording-grid${selectedSet.clips.length === 1 ? ' is-single' : ''}`} key={`${task.slug}-${setIndex}`}>
          {selectedSet.clips.map((item) => (
            <figure className="recording-panel" key={item.video}>
              <video controls muted playsInline preload="metadata" poster={asset(item.poster)}>
                <source src={asset(item.video)} type="video/mp4" />
              </video>
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
