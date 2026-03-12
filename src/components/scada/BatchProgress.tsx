import React from 'react';
import clsx from 'clsx';
import { Play, Pause, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export type BatchState = 'running' | 'paused' | 'complete' | 'aborted';

export interface BatchProgressProps {
  batchId: string;
  recipeName: string;
  currentPhase: number;
  totalPhases: number;
  phaseNames: string[];
  progress: number;
  state: BatchState;
  startTime: Date | string;
  estimatedEnd?: Date | string;
}

const stateConfig: Record<
  BatchState,
  { icon: React.FC<{ className?: string }>; label: string; barColor: string; textColor: string; bgColor: string }
> = {
  running: {
    icon: Play,
    label: 'Running',
    barColor: 'bg-nexaproc-green',
    textColor: 'text-status-running',
    bgColor: 'bg-status-running/10',
  },
  paused: {
    icon: Pause,
    label: 'Paused',
    barColor: 'bg-status-warning',
    textColor: 'text-status-warning',
    bgColor: 'bg-status-warning/10',
  },
  complete: {
    icon: CheckCircle2,
    label: 'Complete',
    barColor: 'bg-nexaproc-teal',
    textColor: 'text-nexaproc-teal',
    bgColor: 'bg-nexaproc-teal/10',
  },
  aborted: {
    icon: XCircle,
    label: 'Aborted',
    barColor: 'bg-status-fault',
    textColor: 'text-status-fault',
    bgColor: 'bg-status-fault/10',
  },
};

const BatchProgress: React.FC<BatchProgressProps> = ({
  batchId,
  recipeName,
  currentPhase,
  totalPhases,
  phaseNames,
  progress,
  state,
  startTime,
  estimatedEnd,
}) => {
  const cfg = stateConfig[state];
  const StateIcon = cfg.icon;
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const end = estimatedEnd
    ? typeof estimatedEnd === 'string'
      ? new Date(estimatedEnd)
      : estimatedEnd
    : null;

  return (
    <div className="rounded-lg border border-scada-border bg-scada-panel p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-200 mb-0.5">
            {recipeName}
          </h3>
          <p className="text-xs text-gray-500 font-mono">{batchId}</p>
        </div>
        <span
          className={clsx(
            'flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full',
            cfg.textColor,
            cfg.bgColor,
          )}
        >
          <StateIcon className="w-3.5 h-3.5" />
          {cfg.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-400">
            Phase {currentPhase}/{totalPhases}
            {phaseNames[currentPhase - 1] && (
              <span className="text-gray-500 ml-1.5">
                — {phaseNames[currentPhase - 1]}
              </span>
            )}
          </span>
          <span className={clsx('font-mono font-medium', cfg.textColor)}>
            {progress}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-700 ease-out',
              cfg.barColor,
              state === 'running' && 'animate-pulse-glow',
            )}
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Phase indicators */}
      <div className="flex gap-1 mb-4">
        {phaseNames.map((name, idx) => {
          const phaseNum = idx + 1;
          const isComplete = phaseNum < currentPhase || state === 'complete';
          const isCurrent = phaseNum === currentPhase && state !== 'complete';
          const isAborted = state === 'aborted' && phaseNum >= currentPhase;
          return (
            <div
              key={idx}
              className="flex-1 group relative"
              title={name}
            >
              <div
                className={clsx(
                  'h-1.5 rounded-full transition-colors',
                  isComplete && 'bg-nexaproc-teal',
                  isCurrent && cfg.barColor,
                  isAborted && 'bg-status-fault/30',
                  !isComplete && !isCurrent && !isAborted && 'bg-gray-800',
                )}
              />
              <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-scada-dark text-gray-300 px-1.5 py-0.5 rounded border border-scada-border z-10">
                {name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timestamps */}
      <div className="flex items-center gap-4 text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Start: {format(start, 'HH:mm')}
        </span>
        {end && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Est. End: {format(end, 'HH:mm')}
          </span>
        )}
      </div>
    </div>
  );
};

export default BatchProgress;
