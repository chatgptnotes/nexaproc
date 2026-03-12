import React from 'react';
import clsx from 'clsx';

interface StatusIndicatorProps {
  status: 'running' | 'stopped' | 'fault' | 'warning' | 'maintenance';
  label?: string;
  className?: string;
}

const statusColors: Record<StatusIndicatorProps['status'], string> = {
  running: 'bg-status-running',
  stopped: 'bg-status-stopped',
  fault: 'bg-status-fault',
  warning: 'bg-status-warning',
  maintenance: 'bg-status-maintenance',
};

const statusLabels: Record<StatusIndicatorProps['status'], string> = {
  running: 'Running',
  stopped: 'Stopped',
  fault: 'Fault',
  warning: 'Warning',
  maintenance: 'Maintenance',
};

const pulseStatuses = new Set<string>(['running', 'fault', 'warning']);

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className,
}) => {
  const shouldPulse = pulseStatuses.has(status);

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <span className="relative flex h-2 w-2">
        {shouldPulse && (
          <span
            className={clsx(
              'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
              statusColors[status],
            )}
          />
        )}
        <span
          className={clsx(
            'relative inline-flex h-2 w-2 rounded-full',
            statusColors[status],
          )}
        />
      </span>
      {label !== undefined ? (
        <span className="text-sm text-white/70">{label}</span>
      ) : (
        <span className="text-sm text-white/70">{statusLabels[status]}</span>
      )}
    </div>
  );
};
