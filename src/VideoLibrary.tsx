import { useState } from 'react'
import { videoTasks } from './projectData'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export default function VideoLibrary() {
  const [taskIndex, setTaskIndex] = useState(0)
  const task = videoTasks[taskIndex]

  return (
    <div className="video-library">
      <div className="task-selector" role="tablist" aria-label="NestDex task video">
        {videoTasks.map((item, index) => (
          <button
            aria-controls="selected-task-video"
            aria-selected={index === taskIndex}
            className={index === taskIndex ? 'is-active' : ''}
            key={item.slug}
            onClick={() => setTaskIndex(index)}
            role="tab"
            type="button"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.title}
            <small>{item.kind}</small>
          </button>
        ))}
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
        <video key={task.video} controls muted playsInline preload="metadata" poster={asset(task.poster)}>
          <source src={asset(task.video)} type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
