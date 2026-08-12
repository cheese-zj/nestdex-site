import { useEffect, useMemo, useState } from 'react'

type Outcome = 'success' | 'failure'

type Trial = {
  episode: number
  outcome: Outcome
  holdMedian: number
  effort: number[]
}

type Condition = {
  id: string
  label: string
  trials: Trial[]
  comparison: {
    success_n: number
    failure_n: number
    success_median: number
    failure_median: number
    exact_mann_whitney_two_sided_p: number
  }
}

type EffortData = {
  source: string
  trialCount: number
  alignment: string
  holdWindowSec: [number, number]
  time: number[]
  conditions: Condition[]
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
const SUCCESS = '#167d78'
const FAILURE = '#d45b73'
const INK = '#30332f'
const MUTED = '#797e79'
const GRID = '#d8dbd5'
const PAPER_WINDOW: [number, number] = [0.5, 5.5]

const quantile = (values: number[], amount: number) => {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const position = (sorted.length - 1) * amount
  const lower = Math.floor(position)
  const upper = Math.ceil(position)
  if (lower === upper) return sorted[lower]
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower)
}

const linePath = (
  points: number[],
  x: (index: number) => number,
  y: (value: number) => number,
) => points.map((value, index) => `${index === 0 ? 'M' : 'L'}${x(index).toFixed(2)},${y(value).toFixed(2)}`).join(' ')

const medianCurve = (trials: Trial[], pointCount: number) => Array.from(
  { length: pointCount },
  (_, index) => quantile(trials.map((trial) => trial.effort[index]), 0.5),
)

const conditionShortLabel = (label: string) => label
  .replace('Fixed-command replay', 'Fixed replay')
  .replace('Closed-loop, temporal ensemble', 'Temporal ensemble')
  .replace('Closed-loop, no ensemble', 'No ensemble')

function EffortCurves({
  data,
  condition,
  outcomes,
  selectedEpisode,
  onSelectEpisode,
  window,
}: {
  data: EffortData
  condition: Condition
  outcomes: Set<Outcome>
  selectedEpisode: number | null
  onSelectEpisode: (episode: number | null) => void
  window: [number, number]
}) {
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const width = 920
  const height = 390
  const margin = { left: 66, right: 24, top: 24, bottom: 55 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom
  const xScale = (time: number) => margin.left + ((time + 2) / 8) * chartWidth
  const yScale = (value: number) => margin.top + (1 - value) * chartHeight
  const indexX = (index: number) => xScale(data.time[index])
  const shownTrials = condition.trials.filter((trial) => outcomes.has(trial.outcome))
  const groups = (['failure', 'success'] as Outcome[])
    .map((outcome) => ({ outcome, trials: shownTrials.filter((trial) => trial.outcome === outcome) }))
    .filter((group) => group.trials.length)
  const hoverIndex = hoverTime === null
    ? null
    : data.time.reduce((best, time, index) => Math.abs(time - hoverTime) < Math.abs(data.time[best] - hoverTime) ? index : best, 0)
  const selectedTrial = condition.trials.find((trial) => trial.episode === selectedEpisode)

  return (
    <div className="effort-curve-wrap">
      <svg className="effort-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${condition.label} closure-aligned whole-hand effort curves`}>
        <defs><clipPath id="effort-plot-clip"><rect x={margin.left} y={margin.top} width={chartWidth} height={chartHeight} /></clipPath></defs>
        <rect x={margin.left} y={margin.top} width={chartWidth} height={chartHeight} fill="#fbfbf8" />
        <rect
          x={xScale(window[0])}
          y={margin.top}
          width={xScale(window[1]) - xScale(window[0])}
          height={chartHeight}
          fill="#167d78"
          opacity="0.055"
        />
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <g key={tick}>
            <line x1={margin.left} x2={width - margin.right} y1={yScale(tick)} y2={yScale(tick)} stroke={GRID} strokeWidth="1" />
            <text x={margin.left - 12} y={yScale(tick) + 4} textAnchor="end">{tick.toFixed(2)}</text>
          </g>
        ))}
        {[-2, 0, 2, 4, 6].map((tick) => (
          <g key={tick}>
            <line x1={xScale(tick)} x2={xScale(tick)} y1={margin.top} y2={height - margin.bottom} stroke={tick === 0 ? MUTED : GRID} strokeDasharray={tick === 0 ? '6 5' : undefined} />
            <text x={xScale(tick)} y={height - margin.bottom + 24} textAnchor="middle">{tick}</text>
          </g>
        ))}

        {shownTrials.map((trial) => (
          <path
            className={selectedEpisode === trial.episode ? 'trial-line is-selected' : 'trial-line'}
            d={linePath(trial.effort, indexX, yScale)}
            key={trial.episode}
            fill="none"
            stroke={trial.outcome === 'success' ? SUCCESS : FAILURE}
            strokeWidth={selectedEpisode === trial.episode ? 3.2 : 1.1}
            opacity={selectedEpisode === null || selectedEpisode === trial.episode ? 0.26 : 0.07}
            clipPath="url(#effort-plot-clip)"
          />
        ))}
        {groups.map((group) => {
          const median = medianCurve(group.trials, data.time.length)
          return (
            <path
              d={linePath(median, indexX, yScale)}
              key={group.outcome}
              fill="none"
              stroke={group.outcome === 'success' ? SUCCESS : FAILURE}
              strokeWidth="3.2"
              clipPath="url(#effort-plot-clip)"
            />
          )
        })}
        {hoverIndex !== null && (
          <g className="effort-crosshair" clipPath="url(#effort-plot-clip)">
            <line x1={indexX(hoverIndex)} x2={indexX(hoverIndex)} y1={margin.top} y2={height - margin.bottom} stroke={INK} strokeDasharray="3 4" />
            {groups.map((group) => {
              const value = medianCurve(group.trials, data.time.length)[hoverIndex]
              return <circle key={group.outcome} cx={indexX(hoverIndex)} cy={yScale(value)} r="5" fill={group.outcome === 'success' ? SUCCESS : FAILURE} stroke="white" strokeWidth="2" />
            })}
            {selectedTrial && outcomes.has(selectedTrial.outcome) && (
              <circle cx={indexX(hoverIndex)} cy={yScale(selectedTrial.effort[hoverIndex])} r="6" fill="white" stroke={INK} strokeWidth="2" />
            )}
          </g>
        )}
        <rect
          x={margin.left}
          y={margin.top}
          width={chartWidth}
          height={chartHeight}
          fill="transparent"
          onMouseLeave={() => setHoverTime(null)}
          onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect()
            const local = ((event.clientX - bounds.left) / bounds.width) * chartWidth
            setHoverTime(Math.max(-2, Math.min(6, (local / chartWidth) * 8 - 2)))
          }}
        />
        <text className="axis-title" x={margin.left + chartWidth / 2} y={height - 10} textAnchor="middle">Time from full closure (s)</text>
        <text className="axis-title" transform={`translate(17 ${margin.top + chartHeight / 2}) rotate(-90)`} textAnchor="middle">Whole-hand effort RMS</text>
      </svg>

      <div className="curve-readout" aria-live="polite">
        {hoverIndex === null ? (
          <p>Move across the chart to inspect group medians at each time step.</p>
        ) : (
          <>
            <strong>{data.time[hoverIndex].toFixed(2)} s</strong>
            {groups.map((group) => (
              <span key={group.outcome} style={{ color: group.outcome === 'success' ? SUCCESS : FAILURE }}>
                {group.outcome}: {medianCurve(group.trials, data.time.length)[hoverIndex].toFixed(3)}
              </span>
            ))}
            {selectedTrial && outcomes.has(selectedTrial.outcome) && <span>episode {selectedTrial.episode}: {selectedTrial.effort[hoverIndex].toFixed(3)}</span>}
          </>
        )}
      </div>

      <div className="trial-chips" aria-label="Highlight an individual trial">
        <button className={selectedEpisode === null ? 'is-active' : ''} onClick={() => onSelectEpisode(null)} type="button">All trials</button>
        {condition.trials.map((trial) => (
          <button
            className={selectedEpisode === trial.episode ? `is-active ${trial.outcome}` : trial.outcome}
            key={trial.episode}
            onClick={() => onSelectEpisode(trial.episode)}
            type="button"
          >
            E{String(trial.episode).padStart(3, '0')}
          </button>
        ))}
      </div>
    </div>
  )
}

function TrialDistribution({
  data,
  window,
  selectedEpisode,
  onSelect,
}: {
  data: EffortData
  window: [number, number]
  selectedEpisode: number | null
  onSelect: (condition: string, episode: number) => void
}) {
  const width = 920
  const height = 350
  const margin = { left: 210, right: 35, top: 28, bottom: 48 }
  const chartWidth = width - margin.left - margin.right
  const xScale = (value: number) => margin.left + value * chartWidth
  const rowGap = 92
  const paperWindow = window[0] === PAPER_WINDOW[0] && window[1] === PAPER_WINDOW[1]
  const startIndex = data.time.findIndex((time) => time >= window[0])
  const endIndex = data.time.reduce((last, time, index) => time <= window[1] ? index : last, startIndex)
  const valueFor = (trial: Trial) => paperWindow
    ? trial.holdMedian
    : quantile(trial.effort.slice(startIndex, endIndex + 1), 0.5)

  return (
    <svg className="effort-svg distribution-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trial-level post-closure effort across execution conditions">
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
        <g key={tick}>
          <line x1={xScale(tick)} x2={xScale(tick)} y1={margin.top} y2={height - margin.bottom} stroke={GRID} />
          <text x={xScale(tick)} y={height - 18} textAnchor="middle">{tick.toFixed(2)}</text>
        </g>
      ))}
      {data.conditions.map((condition, conditionIndex) => {
        const baseY = margin.top + 45 + conditionIndex * rowGap
        return (
          <g key={condition.id}>
            <text className="condition-row-label" x={margin.left - 20} y={baseY + 5} textAnchor="end">{conditionShortLabel(condition.label)}</text>
            {(['failure', 'success'] as Outcome[]).map((outcome) => {
              const trials = condition.trials.filter((trial) => trial.outcome === outcome)
              const values = trials.map(valueFor)
              const rowY = baseY + (outcome === 'success' ? -13 : 13)
              const median = quantile(values, 0.5)
              return (
                <g key={outcome}>
                  <line x1={xScale(median)} x2={xScale(median)} y1={rowY - 10} y2={rowY + 10} stroke={INK} strokeWidth="3" />
                  {trials.map((trial) => {
                    const jitter = ((trial.episode * 17) % 11 - 5) * 1.25
                    const value = valueFor(trial)
                    return (
                      <circle
                        className="distribution-point"
                        cx={xScale(value)}
                        cy={rowY + jitter}
                        fill={outcome === 'success' ? SUCCESS : FAILURE}
                        key={trial.episode}
                        onClick={() => onSelect(condition.id, trial.episode)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') onSelect(condition.id, trial.episode)
                        }}
                        r={selectedEpisode === trial.episode ? 8 : 6}
                        stroke={selectedEpisode === trial.episode ? INK : 'white'}
                        strokeWidth={selectedEpisode === trial.episode ? 3 : 1.5}
                        tabIndex={0}
                      >
                        <title>{`Episode ${trial.episode} · ${outcome} · median ${value.toFixed(3)}`}</title>
                      </circle>
                    )
                  })}
                </g>
              )
            })}
          </g>
        )
      })}
      <text className="axis-title" x={margin.left + chartWidth / 2} y={height - 2} textAnchor="middle">Median whole-hand effort RMS in selected window</text>
    </svg>
  )
}

export default function InteractiveEffort() {
  const [data, setData] = useState<EffortData | null>(null)
  const [conditionId, setConditionId] = useState('online_no_rtc')
  const [outcomes, setOutcomes] = useState<Set<Outcome>>(new Set(['success', 'failure']))
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null)
  const [window, setWindow] = useState<[number, number]>(PAPER_WINDOW)

  useEffect(() => {
    fetch(asset('data/inner-policy-effort.json'))
      .then((response) => response.json())
      .then((payload: EffortData) => setData(payload))
  }, [])

  const condition = useMemo(
    () => data?.conditions.find((item) => item.id === conditionId) ?? null,
    [conditionId, data],
  )

  if (!data || !condition) return <div className="interactive-loading">Loading trial data…</div>

  const paperWindow = window[0] === PAPER_WINDOW[0] && window[1] === PAPER_WINDOW[1]
  const toggleOutcome = (outcome: Outcome) => {
    const next = new Set(outcomes)
    if (next.has(outcome) && next.size > 1) next.delete(outcome)
    else next.add(outcome)
    setOutcomes(next)
  }

  return (
    <div className="interactive-effort">
      <article className="interactive-figure" aria-labelledby="interactive-fig9-title">
        <div className="interactive-figure-heading">
          <div><span>Interactive Figure 9</span><h3 id="interactive-fig9-title">Effort through contact and hold.</h3></div>
          <p>Choose an execution condition, separate successes from failures, or highlight one trial. Time zero marks full closure; the tinted band is the Figure 10 summary window.</p>
        </div>

        <div className="figure-controls">
          <div className="segmented-control" role="tablist" aria-label="Execution condition">
            {data.conditions.map((item) => (
              <button
                aria-selected={conditionId === item.id}
                className={conditionId === item.id ? 'is-active' : ''}
                key={item.id}
                onClick={() => { setConditionId(item.id); setSelectedEpisode(null) }}
                role="tab"
                type="button"
              >
                {conditionShortLabel(item.label)}
              </button>
            ))}
          </div>
          <div className="outcome-control" aria-label="Visible outcomes">
            {(['success', 'failure'] as Outcome[]).map((outcome) => (
              <button className={outcomes.has(outcome) ? `is-active ${outcome}` : outcome} key={outcome} onClick={() => toggleOutcome(outcome)} type="button">
                <i />{outcome}
              </button>
            ))}
          </div>
        </div>

        <EffortCurves
          condition={condition}
          data={data}
          onSelectEpisode={setSelectedEpisode}
          outcomes={outcomes}
          selectedEpisode={selectedEpisode}
          window={window}
        />
        <div className="paper-stat-line">
          <span>Paper comparison · 0.5–5.5 s</span>
          <strong>success median {condition.comparison.success_median.toFixed(3)}</strong>
          <strong>failure median {condition.comparison.failure_median.toFixed(3)}</strong>
          <strong>exact p = {condition.comparison.exact_mann_whitney_two_sided_p.toFixed(3)}</strong>
        </div>
      </article>

      <article className="interactive-figure distribution-figure" aria-labelledby="interactive-fig10-title">
        <div className="interactive-figure-heading">
          <div><span>Interactive Figure 10</span><h3 id="interactive-fig10-title">Every trial, one comparable number.</h3></div>
          <p>Each point is one trial median. Adjust the post-closure window to explore how the distribution changes, then select a point to inspect that episode in Figure 9.</p>
        </div>

        <div className="window-control">
          <div>
            <label>Window start <strong>{window[0].toFixed(2)} s</strong></label>
            <input
              aria-label="Post-closure window start"
              max="5.25"
              min="0"
              onInput={(event) => setWindow([Math.min(Number(event.currentTarget.value), window[1] - 0.25), window[1]])}
              step="0.25"
              type="range"
              value={window[0]}
            />
          </div>
          <div>
            <label>Window end <strong>{window[1].toFixed(2)} s</strong></label>
            <input
              aria-label="Post-closure window end"
              max="6"
              min="0.25"
              onInput={(event) => setWindow([window[0], Math.max(Number(event.currentTarget.value), window[0] + 0.25)])}
              step="0.25"
              type="range"
              value={window[1]}
            />
          </div>
          <button disabled={paperWindow} onClick={() => setWindow(PAPER_WINDOW)} type="button">Reset to paper window</button>
        </div>

        <div className="distribution-legend"><span className="success"><i />Success</span><span className="failure"><i />Failure</span><span><b />Group median</span></div>
        <TrialDistribution
          data={data}
          onSelect={(nextCondition, episode) => {
            setConditionId(nextCondition)
            setSelectedEpisode(episode)
          }}
          selectedEpisode={selectedEpisode}
          window={window}
        />
        <p className="interactive-note">
          {paperWindow
            ? 'This is the paper’s prespecified 0.5–5.5 s post-closure window; medians match Figure 10.'
            : 'Exploratory window selected. The paper’s reported statistics apply only to the 0.5–5.5 s window.'}
        </p>
      </article>
    </div>
  )
}
