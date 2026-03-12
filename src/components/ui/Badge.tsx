import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  variant:
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'critical'
    | 'high'
    | 'medium'
    | 'low';
  children: React.ReactNode;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  success:
    'bg-status-running/15 text-status-running border-status-running/30',
  warning:
    'bg-status-warning/15 text-status-warning border-status-warning/30',
  danger:
    'bg-status-fault/15 text-status-fault border-status-fault/30',
  info:
    'bg-status-maintenance/15 text-status-maintenance border-status-maintenance/30',
  neutral:
    'bg-status-stopped/15 text-status-stopped border-status-stopped/30',
  critical:
    'bg-alarm-critical/15 text-alarm-critical border-alarm-critical/30',
  high:
    'bg-alarm-high/15 text-alarm-high border-alarm-high/30',
  medium:
    'bg-alarm-medium/15 text-alarm-medium border-alarm-medium/30',
  low:
    'bg-alarm-low/15 text-alarm-low border-alarm-low/30',
};

const dotColors: Record<BadgeProps['variant'], string> = {
  success: 'bg-status-running',
  warning: 'bg-status-warning',
  danger: 'bg-status-fault',
  info: 'bg-status-maintenance',
  neutral: 'bg-status-stopped',
  critical: 'bg-alarm-critical',
  high: 'bg-alarm-high',
  medium: 'bg-alarm-medium',
  low: 'bg-alarm-low',
};

export const Badge: React.FC<BadgeProps> = ({
  variant,
  children,
  dot = false,
  pulse = false,
  className,
}) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      variantClasses[variant],
      className,
    )}
  >
    {dot && (
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={clsx(
              'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
              dotColors[variant],
            )}
          />
        )}
        <span
          className={clsx(
            'relative inline-flex h-1.5 w-1.5 rounded-full',
            dotColors[variant],
          )}
        />
      </span>
    )}
    {children}
  </span>
);
