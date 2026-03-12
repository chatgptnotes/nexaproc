import React from 'react';
import clsx from 'clsx';
import {
  Cog,
  Flame,
  Droplets,
  Wind,
  Gauge,
  Box,
  Wrench,
  CircleDot,
  Cylinder,
  Heater,
  Container,
  Filter,
} from 'lucide-react';

export type EquipmentState = 'running' | 'stopped' | 'fault' | 'maintenance' | 'standby';

export interface EquipmentTagValue {
  label: string;
  value: string | number;
  unit: string;
}

export interface EquipmentCardProps {
  name: string;
  type: string;
  state: EquipmentState;
  runtime: number;
  tags?: EquipmentTagValue[];
}

const stateConfig: Record<
  EquipmentState,
  { label: string; dot: string; bg: string; text: string }
> = {
  running: {
    label: 'Running',
    dot: 'bg-status-running',
    bg: 'bg-status-running/8',
    text: 'text-status-running',
  },
  stopped: {
    label: 'Stopped',
    dot: 'bg-status-stopped',
    bg: 'bg-status-stopped/8',
    text: 'text-status-stopped',
  },
  fault: {
    label: 'Fault',
    dot: 'bg-status-fault',
    bg: 'bg-status-fault/10',
    text: 'text-status-fault',
  },
  maintenance: {
    label: 'Maintenance',
    dot: 'bg-status-maintenance',
    bg: 'bg-status-maintenance/8',
    text: 'text-status-maintenance',
  },
  standby: {
    label: 'Standby',
    dot: 'bg-status-warning',
    bg: 'bg-status-warning/8',
    text: 'text-status-warning',
  },
};

function getEquipmentIcon(type: string): React.ReactNode {
  const lcType = type.toLowerCase();
  const cls = 'w-6 h-6';
  if (lcType.includes('reactor') || lcType.includes('vessel'))
    return <Cylinder className={cls} />;
  if (lcType.includes('heat') || lcType.includes('exchanger'))
    return <Heater className={cls} />;
  if (lcType.includes('pump'))
    return <Droplets className={cls} />;
  if (lcType.includes('valve'))
    return <CircleDot className={cls} />;
  if (lcType.includes('motor'))
    return <Cog className={cls} />;
  if (lcType.includes('mixer') || lcType.includes('agitator'))
    return <Cog className={cls} />;
  if (lcType.includes('conveyor'))
    return <Box className={cls} />;
  if (lcType.includes('compressor'))
    return <Wind className={cls} />;
  if (lcType.includes('boiler'))
    return <Flame className={cls} />;
  if (lcType.includes('filter'))
    return <Filter className={cls} />;
  if (lcType.includes('press'))
    return <Gauge className={cls} />;
  if (lcType.includes('filling') || lcType.includes('filler'))
    return <Container className={cls} />;
  return <Wrench className={cls} />;
}

function formatRuntime(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours.toFixed(1)} hrs`;
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return `${days}d ${rem.toFixed(0)}h`;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({
  name,
  type,
  state,
  runtime,
  tags = [],
}) => {
  const cfg = stateConfig[state];

  return (
    <div
      className={clsx(
        'rounded-lg border border-scada-border bg-scada-panel p-4 transition-colors hover:border-scada-border-hover',
        state === 'fault' && 'border-status-fault/30',
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Icon */}
        <div
          className={clsx(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            cfg.bg,
            cfg.text,
          )}
        >
          {getEquipmentIcon(type)}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-200 truncate">
            {name}
          </h4>
          <p className="text-xs text-gray-500 truncate">{type}</p>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={clsx(
              'w-2 h-2 rounded-full',
              cfg.dot,
              state === 'running' && 'animate-pulse-glow',
              state === 'fault' && 'animate-alarm-flash',
            )}
          />
          <span className={clsx('text-xs font-medium', cfg.text)}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Runtime */}
      <div className="text-[11px] text-gray-500 mb-3">
        Runtime: <span className="text-gray-400 font-mono">{formatRuntime(runtime)}</span>
      </div>

      {/* Tag values */}
      {tags.length > 0 && (
        <div className="border-t border-scada-border pt-2.5 space-y-1.5">
          {tags.map((tag, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-gray-500 truncate mr-2">{tag.label}</span>
              <span className="text-gray-300 font-mono flex-shrink-0">
                {typeof tag.value === 'number' ? tag.value.toFixed(1) : tag.value}
                <span className="text-gray-600 ml-1">{tag.unit}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentCard;
