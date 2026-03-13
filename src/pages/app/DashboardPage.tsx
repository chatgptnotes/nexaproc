import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Gauge, BarChart3, Clock, Plus, FolderKanban } from 'lucide-react';
import { format } from 'date-fns';

import { Card, Badge, Button } from '@/components/ui';
import {
  KPICard,
  AlarmBanner,
  TrendChart,
  GaugeWidget,
  EquipmentCard,
} from '@/components/scada';
import type { TrendDataPoint } from '@/components/scada';
import { tags } from '@/mocks';
import { alarms, getAlarmCounts } from '@/mocks';
import { equipment } from '@/mocks';

// ---------------------------------------------------------------------------
// Mock trend data (30 points over the last hour)
// ---------------------------------------------------------------------------
function generateTrendData(count: number): TrendDataPoint[] {
  const now = Date.now();
  const interval = (60 * 60 * 1000) / count;
  const data: TrendDataPoint[] = [];
  let temp = 52;
  let pressure = 2.4;
  for (let i = 0; i < count; i++) {
    temp += (Math.random() - 0.48) * 1.2;
    pressure += (Math.random() - 0.48) * 0.12;
    temp = Math.max(40, Math.min(75, temp));
    pressure = Math.max(0.5, Math.min(5, pressure));
    data.push({
      time: now - (count - 1 - i) * interval,
      temperature: parseFloat(temp.toFixed(2)),
      pressure: parseFloat(pressure.toFixed(2)),
    });
  }
  return data;
}

// ---------------------------------------------------------------------------
// Priority badge helper
// ---------------------------------------------------------------------------
const priorityBadge: Record<string, { variant: 'critical' | 'high' | 'medium' | 'low'; label: string }> = {
  critical: { variant: 'critical', label: 'Critical' },
  high: { variant: 'high', label: 'High' },
  medium: { variant: 'medium', label: 'Medium' },
  low: { variant: 'low', label: 'Low' },
};

const stateBadge: Record<string, { variant: 'danger' | 'warning' | 'success'; label: string }> = {
  active: { variant: 'danger', label: 'Active' },
  acknowledged: { variant: 'warning', label: 'Ack' },
  cleared: { variant: 'success', label: 'Cleared' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const navigate = useNavigate();
  const alarmCounts = useMemo(() => getAlarmCounts(), []);
  const trendData = useMemo(() => generateTrendData(30), []);
  const recentAlarms = useMemo(() => [...alarms].slice(0, 5), []);
  const topEquipment = useMemo(() => equipment.slice(0, 6), []);
  const totalTags = tags.length;
  const activeAlarmCount = alarmCounts.critical + alarmCounts.high + alarmCounts.medium + alarmCounts.low;

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SCADA Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time plant overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<FolderKanban size={14} />}
            onClick={() => navigate('/app/projects')}
          >
            Projects
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => navigate('/app/projects')}
          >
            New Project
          </Button>
          <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
            <Clock className="w-3.5 h-3.5" />
            {format(new Date(), 'dd MMM yyyy HH:mm:ss')}
          </div>
        </div>
      </div>

      {/* KPI cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Tags"
          value={totalTags}
          unit="tags"
          trend="up"
          trendValue={2.3}
          icon={<Activity className="w-6 h-6" />}
          color="#4ade80"
        />
        <KPICard
          title="Active Alarms"
          value={activeAlarmCount}
          unit=""
          trend={activeAlarmCount > 10 ? 'up' : 'down'}
          trendValue={5.1}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="#ef4444"
        />
        <KPICard
          title="OEE"
          value="94.2"
          unit="%"
          trend="up"
          trendValue={1.8}
          icon={<Gauge className="w-6 h-6" />}
          color="#fbbf24"
        />
        <KPICard
          title="Production Rate"
          value={847}
          unit="units/hr"
          trend="up"
          trendValue={3.2}
          icon={<BarChart3 className="w-6 h-6" />}
          color="#0d9488"
        />
      </div>

      {/* Alarm banner */}
      <AlarmBanner
        critical={alarmCounts.critical}
        high={alarmCounts.high}
        medium={alarmCounts.medium}
        low={alarmCounts.low}
      />

      {/* Two-column: Trend Chart + Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Temperature & Pressure Trend" subtitle="Last 60 minutes">
            <TrendChart
              data={trendData}
              series={[
                { key: 'temperature', label: 'Temperature', color: '#f97316', yAxisId: 'left' },
                { key: 'pressure', label: 'Pressure', color: '#4ade80', yAxisId: 'right' },
              ]}
              height={340}
              showLegend
            />
          </Card>
        </div>
        <div>
          <Card title="Overall Equipment Effectiveness" subtitle="Current shift">
            <div className="flex items-center justify-center py-4">
              <GaugeWidget
                value={94.2}
                min={0}
                max={100}
                unit="%"
                label="OEE"
                thresholds={{ lolo: 50, low: 70, high: 95, hihi: 99 }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Equipment status grid */}
      <Card title="Equipment Status" subtitle="Top 6 monitored assets">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topEquipment.map((eq) => (
            <EquipmentCard
              key={eq.id}
              name={eq.name}
              type={eq.type}
              state={eq.state}
              runtime={eq.runtimeHours}
              tags={eq.tags.map((t) => ({
                label: t.label,
                value: t.value,
                unit: t.unit,
              }))}
            />
          ))}
        </div>
      </Card>

      {/* Recent alarms table */}
      <Card title="Recent Alarms" subtitle="Last 5 events">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Priority</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Tag</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Description</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">State</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentAlarms.map((alarm) => {
                const pb = priorityBadge[alarm.priority];
                const sb = stateBadge[alarm.state];
                return (
                  <tr
                    key={alarm.id}
                    className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Badge variant={pb.variant} dot pulse={alarm.priority === 'critical' && alarm.state === 'active'}>
                        {pb.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-300">{alarm.tagId}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{alarm.description}</td>
                    <td className="px-4 py-3">
                      <Badge variant={sb.variant}>{sb.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono whitespace-nowrap">
                      {format(new Date(alarm.timestamp), 'HH:mm:ss')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
