import React from 'react';
import clsx from 'clsx';
import { Activity, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';

export type TagQuality = 'good' | 'bad' | 'uncertain';
export type AlarmState = 'normal' | 'high' | 'hihi' | 'low' | 'lolo';

export interface TagDisplayProps {
  tagId: string;
  label: string;
  unit: string;
  value: number;
  quality: TagQuality;
  timestamp: Date | string;
  precision?: number;
  alarmState?: AlarmState;
}

const qualityConfig: Record<TagQuality, { icon: React.ReactNode; label: string; color: string }> = {
  good: {
    icon: <Activity className="w-3 h-3" />,
    label: 'Good',
    color: 'text-status-running',
  },
  bad: {
    icon: <XCircle className="w-3 h-3" />,
    label: 'Bad',
    color: 'text-status-fault',
  },
  uncertain: {
    icon: <HelpCircle className="w-3 h-3" />,
    label: 'Uncertain',
    color: 'text-status-warning',
  },
};

const alarmConfig: Record<AlarmState, { bg: string; border: string; text: string; label: string }> = {
  normal: {
    bg: 'bg-scada-panel',
    border: 'border-scada-border',
    text: 'text-nexaproc-green',
    label: 'Normal',
  },
  high: {
    bg: 'bg-alarm-medium/10',
    border: 'border-alarm-medium/40',
    text: 'text-alarm-medium',
    label: 'HIGH',
  },
  hihi: {
    bg: 'bg-alarm-critical/15',
    border: 'border-alarm-critical/50',
    text: 'text-alarm-critical',
    label: 'HI-HI',
  },
  low: {
    bg: 'bg-alarm-medium/10',
    border: 'border-alarm-medium/40',
    text: 'text-alarm-medium',
    label: 'LOW',
  },
  lolo: {
    bg: 'bg-alarm-critical/15',
    border: 'border-alarm-critical/50',
    text: 'text-alarm-critical',
    label: 'LO-LO',
  },
};

const TagDisplay: React.FC<TagDisplayProps> = ({
  tagId,
  label,
  unit,
  value,
  quality,
  timestamp,
  precision = 2,
  alarmState = 'normal',
}) => {
  const q = qualityConfig[quality];
  const a = alarmConfig[alarmState];
  const ts =
    typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const isAlarmed = alarmState !== 'normal';

  return (
    <div
      className={clsx(
        'rounded-lg border p-4 transition-all duration-300',
        a.bg,
        a.border,
        isAlarmed && alarmState === 'hihi' && 'animate-alarm-flash',
        isAlarmed && alarmState === 'lolo' && 'animate-alarm-flash',
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-gray-500 tracking-wider">
          {tagId}
        </span>
        {isAlarmed && (
          <span
            className={clsx(
              'text-[10px] font-bold px-1.5 py-0.5 rounded',
              alarmState === 'high' || alarmState === 'low'
                ? 'bg-alarm-medium/20 text-alarm-medium'
                : 'bg-alarm-critical/20 text-alarm-critical',
            )}
          >
            <AlertTriangle className="w-3 h-3 inline mr-0.5 -mt-0.5" />
            {a.label}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-sm text-gray-400 mb-1 truncate">{label}</p>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className={clsx('text-3xl font-bold tabular-nums', a.text)}>
          {quality === 'bad' ? '---' : value.toFixed(precision)}
        </span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between text-[11px]">
        <span className={clsx('flex items-center gap-1', q.color)}>
          {q.icon}
          {q.label}
        </span>
        <span className="text-gray-600 font-mono">
          {format(ts, 'HH:mm:ss')}
        </span>
      </div>
    </div>
  );
};

export default TagDisplay;
