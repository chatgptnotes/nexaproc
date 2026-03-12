import React from 'react';
import clsx from 'clsx';
import { AlertTriangle, AlertCircle, Info, Bell } from 'lucide-react';

export interface AlarmBannerProps {
  critical: number;
  high: number;
  medium: number;
  low: number;
  onCriticalClick?: () => void;
  onHighClick?: () => void;
  onMediumClick?: () => void;
  onLowClick?: () => void;
}

interface PillConfig {
  label: string;
  count: number;
  bg: string;
  text: string;
  border: string;
  icon: React.ReactNode;
  onClick?: () => void;
  pulse: boolean;
}

const AlarmBanner: React.FC<AlarmBannerProps> = ({
  critical,
  high,
  medium,
  low,
  onCriticalClick,
  onHighClick,
  onMediumClick,
  onLowClick,
}) => {
  const pills: PillConfig[] = [
    {
      label: 'Critical',
      count: critical,
      bg: 'bg-alarm-critical/15',
      text: 'text-alarm-critical',
      border: 'border-alarm-critical/40',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      onClick: onCriticalClick,
      pulse: critical > 0,
    },
    {
      label: 'High',
      count: high,
      bg: 'bg-alarm-high/15',
      text: 'text-alarm-high',
      border: 'border-alarm-high/40',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      onClick: onHighClick,
      pulse: false,
    },
    {
      label: 'Medium',
      count: medium,
      bg: 'bg-alarm-medium/15',
      text: 'text-alarm-medium',
      border: 'border-alarm-medium/40',
      icon: <Bell className="w-3.5 h-3.5" />,
      onClick: onMediumClick,
      pulse: false,
    },
    {
      label: 'Low',
      count: low,
      bg: 'bg-alarm-low/15',
      text: 'text-alarm-low',
      border: 'border-alarm-low/40',
      icon: <Info className="w-3.5 h-3.5" />,
      onClick: onLowClick,
      pulse: false,
    },
  ];

  const total = critical + high + medium + low;

  return (
    <div className="rounded-lg border border-scada-border bg-scada-panel px-4 py-3 flex items-center gap-3 overflow-x-auto">
      {/* Total */}
      <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium mr-1 flex-shrink-0">
        <Bell className="w-4 h-4" />
        <span>{total}</span>
        <span className="text-gray-600 hidden sm:inline">Active</span>
      </div>

      <div className="w-px h-6 bg-scada-border flex-shrink-0" />

      {/* Pill badges */}
      {pills.map((pill) => (
        <button
          key={pill.label}
          onClick={pill.onClick}
          disabled={!pill.onClick}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all flex-shrink-0',
            pill.bg,
            pill.text,
            pill.border,
            pill.pulse && 'animate-alarm-flash',
            pill.onClick
              ? 'cursor-pointer hover:brightness-125 active:scale-95'
              : 'cursor-default',
          )}
        >
          {pill.icon}
          <span>{pill.label}</span>
          <span
            className={clsx(
              'ml-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[11px] font-bold',
              pill.count > 0
                ? `${pill.bg} ${pill.text}`
                : 'bg-gray-800 text-gray-600',
            )}
          >
            {pill.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default AlarmBanner;
