import React, { useState, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import {
  AlertTriangle,
  AlertCircle,
  Bell,
  BellOff,
  CheckCircle2,
  Info,
  Volume2,
  VolumeX,
  CheckCheck,
} from 'lucide-react';
import { format } from 'date-fns';

import { Card, Badge, Button, Tabs } from '@/components/ui';
import { AlarmBanner } from '@/components/scada';
import { alarms as mockAlarms, getAlarmCounts } from '@/mocks';
import type { Alarm, AlarmPriority } from '@/mocks';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const priorityConfig: Record<AlarmPriority, { variant: 'critical' | 'high' | 'medium' | 'low'; icon: React.ReactNode; label: string }> = {
  critical: { variant: 'critical', icon: <AlertCircle className="w-3.5 h-3.5" />, label: 'Critical' },
  high: { variant: 'high', icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'High' },
  medium: { variant: 'medium', icon: <Bell className="w-3.5 h-3.5" />, label: 'Medium' },
  low: { variant: 'low', icon: <Info className="w-3.5 h-3.5" />, label: 'Low' },
};

const stateConfig: Record<string, { variant: 'danger' | 'warning' | 'success' | 'neutral'; label: string }> = {
  active: { variant: 'danger', label: 'Active' },
  acknowledged: { variant: 'warning', label: 'Acknowledged' },
  cleared: { variant: 'success', label: 'Cleared' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AlarmMonitorPage() {
  // Local alarm state (copy of mocks so we can mutate)
  const [alarmList, setAlarmList] = useState<Alarm[]>(() => [...mockAlarms]);
  const [activeTab, setActiveTab] = useState('all');
  const [silencedIds, setSilencedIds] = useState<Set<string>>(new Set());

  // Counts
  const counts = useMemo(() => getAlarmCounts(alarmList), [alarmList]);

  // Tab definitions
  const tabDefs = useMemo(
    () => [
      { id: 'all', label: `All (${alarmList.filter((a) => a.state !== 'cleared').length})` },
      { id: 'critical', label: `Critical (${counts.critical})`, icon: <AlertCircle className="w-3.5 h-3.5 text-alarm-critical" /> },
      { id: 'high', label: `High (${counts.high})`, icon: <AlertTriangle className="w-3.5 h-3.5 text-alarm-high" /> },
      { id: 'medium', label: `Medium (${counts.medium})`, icon: <Bell className="w-3.5 h-3.5 text-alarm-medium" /> },
      { id: 'low', label: `Low (${counts.low})`, icon: <Info className="w-3.5 h-3.5 text-alarm-low" /> },
    ],
    [alarmList, counts],
  );

  // Filtered alarms
  const filteredAlarms = useMemo(() => {
    let data = alarmList.filter((a) => a.state !== 'cleared');
    if (activeTab !== 'all') {
      data = data.filter((a) => a.priority === activeTab);
    }
    // Sort: active first, then by timestamp desc
    return data.sort((a, b) => {
      if (a.state === 'active' && b.state !== 'active') return -1;
      if (b.state === 'active' && a.state !== 'active') return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [alarmList, activeTab]);

  // Acknowledge single alarm
  const handleAcknowledge = useCallback((alarmId: string) => {
    setAlarmList((prev) =>
      prev.map((a) =>
        a.id === alarmId && a.state === 'active'
          ? {
              ...a,
              state: 'acknowledged' as const,
              acknowledgedAt: new Date().toISOString(),
              acknowledgedBy: 'ops_current',
            }
          : a,
      ),
    );
  }, []);

  // Silence single alarm
  const handleSilence = useCallback((alarmId: string) => {
    setSilencedIds((prev) => {
      const next = new Set(prev);
      if (next.has(alarmId)) {
        next.delete(alarmId);
      } else {
        next.add(alarmId);
      }
      return next;
    });
  }, []);

  // Bulk acknowledge all active alarms
  const handleBulkAcknowledge = useCallback(() => {
    const now = new Date().toISOString();
    setAlarmList((prev) =>
      prev.map((a) =>
        a.state === 'active'
          ? {
              ...a,
              state: 'acknowledged' as const,
              acknowledgedAt: now,
              acknowledgedBy: 'ops_current',
            }
          : a,
      ),
    );
  }, []);

  const activeCount = alarmList.filter((a) => a.state === 'active').length;

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Alarm Monitor</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Active alarm management and acknowledgement
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={<CheckCheck className="w-4 h-4" />}
              onClick={handleBulkAcknowledge}
            >
              Acknowledge All ({activeCount})
            </Button>
          )}
        </div>
      </div>

      {/* Alarm Banner */}
      <AlarmBanner
        critical={counts.critical}
        high={counts.high}
        medium={counts.medium}
        low={counts.low}
      />

      {/* Filter tabs */}
      <Tabs tabs={tabDefs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Alarm table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border bg-scada-dark/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Tag</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">State</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Operator</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50 w-48">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlarms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-white/40">
                    No alarms match the selected filter
                  </td>
                </tr>
              ) : (
                filteredAlarms.map((alarm) => {
                  const pc = priorityConfig[alarm.priority];
                  const sc = stateConfig[alarm.state];
                  const isSilenced = silencedIds.has(alarm.id);
                  const isUnackedCritical = alarm.priority === 'critical' && alarm.state === 'active';

                  return (
                    <tr
                      key={alarm.id}
                      className={clsx(
                        'border-b border-scada-border/50 transition-colors',
                        'hover:bg-nexaproc-green/5',
                        isUnackedCritical && !isSilenced && 'animate-alarm-flash',
                      )}
                    >
                      {/* Priority */}
                      <td className="px-4 py-3">
                        <Badge
                          variant={pc.variant}
                          dot
                          pulse={alarm.state === 'active' && (alarm.priority === 'critical' || alarm.priority === 'high')}
                        >
                          {pc.icon}
                          <span className="ml-1">{pc.label}</span>
                        </Badge>
                      </td>

                      {/* Tag */}
                      <td className="px-4 py-3 font-mono text-xs text-gray-300 font-bold">
                        {alarm.tagId}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-sm">
                        <p className="truncate">{alarm.description}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{alarm.area}</p>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3">
                        {alarm.value !== undefined ? (
                          <span className="font-mono text-xs text-white">
                            {typeof alarm.value === 'number' ? alarm.value.toFixed(1) : String(alarm.value)}
                            {alarm.engineeringUnit && (
                              <span className="text-gray-600 ml-1">{alarm.engineeringUnit}</span>
                            )}
                            {alarm.limit !== undefined && (
                              <span className="text-gray-600 ml-1">
                                / {typeof alarm.limit === 'number' ? alarm.limit.toFixed(1) : String(alarm.limit)}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-600">--</span>
                        )}
                      </td>

                      {/* State */}
                      <td className="px-4 py-3">
                        <Badge variant={sc.variant}>
                          {sc.label}
                        </Badge>
                      </td>

                      {/* Time */}
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">
                        {format(new Date(alarm.timestamp), 'HH:mm:ss')}
                        <span className="block text-[10px] text-gray-600">
                          {format(new Date(alarm.timestamp), 'dd MMM')}
                        </span>
                      </td>

                      {/* Operator */}
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {alarm.acknowledgedBy ?? '--'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {alarm.state === 'active' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                              onClick={() => handleAcknowledge(alarm.id)}
                            >
                              Ack
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={
                              isSilenced ? (
                                <VolumeX className="w-3.5 h-3.5 text-gray-500" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )
                            }
                            onClick={() => handleSilence(alarm.id)}
                          >
                            {isSilenced ? 'Unmute' : 'Silence'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-2">
        <span>
          Showing {filteredAlarms.length} alarm{filteredAlarms.length !== 1 ? 's' : ''} ({activeCount} unacknowledged)
        </span>
        <span>
          {silencedIds.size > 0 && (
            <span className="text-gray-400">
              <BellOff className="w-3 h-3 inline mr-1" />
              {silencedIds.size} silenced
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
