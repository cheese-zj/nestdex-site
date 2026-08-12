#!/usr/bin/env python3
"""Export the Figure 9/10 bottle-grasp effort data for the project website."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

import numpy as np


def rounded(values: np.ndarray, digits: int = 4) -> list[float]:
    return [round(float(value), digits) for value in values]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tools", type=Path, required=True)
    parser.add_argument("--data-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    sys.path.insert(0, str(args.tools))
    import plot_effort_across_execution_conditions as effort  # noqa: PLC0415

    trials = effort.load_trials(args.data_root)
    summary = effort.summarise(trials)
    time_grid = np.arange(-2.0, 6.001, 0.04)

    payload = {
        "source": summary["source"],
        "trialCount": summary["trial_count"],
        "alignment": summary["alignment"],
        "holdWindowSec": summary["hold_window_sec"],
        "time": rounded(time_grid, 2),
        "conditions": [
            {
                "id": condition,
                "label": effort.DISPLAY_LABELS[condition],
                "trials": [
                    {
                        "episode": int(trial["episode"]),
                        "outcome": trial["outcome"],
                        "holdMedian": round(float(trial["hold_effort_median"]), 5),
                        "effort": rounded(
                            np.interp(time_grid, trial["t_aligned"], trial["effort_rms"]),
                            4,
                        ),
                    }
                    for trial in trials
                    if trial["condition"] == condition
                ],
                "comparison": next(
                    row
                    for row in summary["within_condition_success_failure"]
                    if row["condition"] == condition
                ),
            }
            for condition in effort.base.CONDITIONS
        ],
        "successfulBetweenConditions": summary["successful_between_conditions"],
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "trials": payload["trialCount"],
        "timePoints": len(payload["time"]),
        "bytes": args.output.stat().st_size,
    }))


if __name__ == "__main__":
    main()
