import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type KPITrend = 'up' | 'down' | 'flat';

export interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend: KPITrend;
  trendValue: number;
  icon: React.ReactNode;
  color?: string;
}

const trendConfig: Record<
  KPITrend,
  { icon: React.FC<{ className?: string }>; text: string; sign: string }
> = {
  up: { icon: TrendingUp, text: 'text-status-running', sign: '+' },
  down: { icon: TrendingDown, text: 'text-alarm-critical', sign: '-' },
  flat: { icon: Minus, text: 'text-gray-400', sign: '' },
};

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = '#4ade80',
}) => {
  const t = trendConfig[trend];
  const TrendIcon = t.icon;

  return (
    <div className="rounded-lg border border-scada-border bg-scada-panel p-5 flex items-start gap-4 transition-colors hover:border-scada-border-hover">
      {/* Icon circle */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 truncate">
          {title}
        </p>

        {/* Value row */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-3xl font-bold text-gray-100 tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-sm text-gray-500">{unit}</span>
          )}
        </div>

        {/* Trend */}
        <div className={clsx('flex items-center gap-1 text-xs', t.text)}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span className="font-medium">
            {t.sign}
            {Math.abs(trendValue).toFixed(1)}%
          </span>
          <span className="text-gray-600 ml-1">vs last shift</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
