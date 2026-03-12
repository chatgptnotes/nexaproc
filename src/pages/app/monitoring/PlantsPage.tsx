import React, { useMemo } from 'react';
import {
  Factory,
  MapPin,
  Layers,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from 'lucide-react';
import clsx from 'clsx';

import { Badge } from '@/components/ui';
import { plants } from '@/mocks';
import { equipment } from '@/mocks';
import { alarms, getAlarmCounts } from '@/mocks';
import type { Plant, ProductionLine } from '@/mocks';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const statusConfig: Record<Plant['status'], { variant: 'success' | 'danger' | 'warning'; label: string }> = {
  online: { variant: 'success', label: 'Online' },
  offline: { variant: 'danger', label: 'Offline' },
  partial: { variant: 'warning', label: 'Partial' },
};

const lineStatusConfig: Record<ProductionLine['status'], { icon: React.ReactNode; color: string; label: string }> = {
  running: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-status-running', label: 'Running' },
  stopped: { icon: <XCircle className="w-3.5 h-3.5" />, color: 'text-status-stopped', label: 'Stopped' },
  changeover: { icon: <MinusCircle className="w-3.5 h-3.5" />, color: 'text-status-warning', label: 'Changeover' },
};

function getPlantEquipmentStats(plantId: string) {
  const eqs = equipment.filter((e) => e.plantId === plantId);
  const running = eqs.filter((e) => e.state === 'running').length;
  return { total: eqs.length, running };
}

function getPlantAlarmCount(plantId: string): number {
  return alarms.filter((a) => a.plantId === plantId && a.state !== 'cleared').length;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PlantsPage() {
  const globalCounts = useMemo(() => getAlarmCounts(), []);

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Plant Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            All production facilities at a glance
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{plants.length} plants</span>
          <span className="w-px h-4 bg-scada-border" />
          <span className="text-alarm-critical">{globalCounts.critical} critical</span>
          <span className="text-alarm-high">{globalCounts.high} high</span>
        </div>
      </div>

      {/* Plant cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {plants.map((plant) => {
          const sc = statusConfig[plant.status];
          const eqStats = getPlantEquipmentStats(plant.id);
          const alarmCount = getPlantAlarmCount(plant.id);

          return (
            <div
              key={plant.id}
              onClick={() => console.log('Drill down to plant:', plant.id, plant.name)}
              className={clsx(
                'rounded-xl border border-scada-border bg-scada-panel/75 backdrop-blur-sm p-5 transition-all duration-200 cursor-pointer',
                'hover:border-nexaproc-green/40 hover:shadow-lg hover:shadow-nexaproc-green/5',
                plant.status === 'offline' && 'opacity-70',
              )}
            >
              {/* Plant header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-nexaproc-green/10 text-nexaproc-green flex items-center justify-center">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{plant.name}</h3>
                    <span className="text-xs font-mono text-gray-500">{plant.code}</span>
                  </div>
                </div>
                <Badge variant={sc.variant} dot pulse={plant.status === 'online'}>
                  {sc.label}
                </Badge>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{plant.address}</span>
              </div>

              {/* Production lines */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Production Lines ({plant.productionLines.length})
                </p>
                <div className="space-y-1.5">
                  {plant.productionLines.map((line) => {
                    const ls = lineStatusConfig[line.status];
                    return (
                      <div
                        key={line.id}
                        className="flex items-center justify-between rounded-md bg-scada-dark/40 px-3 py-2"
                      >
                        <span className="text-xs text-gray-300 truncate mr-2">{line.name}</span>
                        <div className={clsx('flex items-center gap-1 text-[11px] font-medium flex-shrink-0', ls.color)}>
                          {ls.icon}
                          <span>{ls.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key metrics bar */}
              <div className="border-t border-scada-border pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Wrench className="w-3.5 h-3.5 text-gray-500" />
                  <span>
                    <span className="text-white font-semibold">{eqStats.running}</span>
                    <span className="text-gray-600"> / {eqStats.total} running</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Layers className="w-3.5 h-3.5 text-gray-500" />
                  <span>{plant.productionLines.reduce((acc, l) => acc + l.zones.length, 0)} zones</span>
                </div>
                <div className={clsx('flex items-center gap-1.5 text-xs', alarmCount > 0 ? 'text-alarm-critical' : 'text-gray-500')}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="font-semibold">{alarmCount}</span>
                  <span className="hidden sm:inline">alarms</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
