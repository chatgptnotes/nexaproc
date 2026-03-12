import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Activity,
  Brain,
  Clock,
  Zap,
  RefreshCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  Cell,
} from 'recharts';

import { Card, Badge } from '@/components/ui';
import { KPICard } from '@/components/scada';

/* ---------- Mock Data ---------- */

interface Anomaly {
  id: string;
  timestamp: string;
  tagName: string;
  expected: number;
  actual: number;
  deviation: number;
  severity: 'Low' | 'Medium' | 'High';
  unit: string;
}

const anomalies: Anomaly[] = [
  { id: 'A1', timestamp: '12:47:23', tagName: 'TT-101.PV', expected: 65.2, actual: 78.4, deviation: 20.2, severity: 'High', unit: '\u00b0C' },
  { id: 'A2', timestamp: '12:38:15', tagName: 'PT-203.PV', expected: 3.2, actual: 3.8, deviation: 18.7, severity: 'Medium', unit: 'bar' },
  { id: 'A3', timestamp: '12:31:02', tagName: 'VIB-M201.X', expected: 2.1, actual: 4.8, deviation: 128.6, severity: 'High', unit: 'mm/s' },
  { id: 'A4', timestamp: '12:22:44', tagName: 'FT-301.PV', expected: 120.0, actual: 108.5, deviation: -9.6, severity: 'Medium', unit: 'm\u00b3/h' },
  { id: 'A5', timestamp: '12:15:18', tagName: 'LT-102.PV', expected: 72.0, actual: 74.8, deviation: 3.9, severity: 'Low', unit: '%' },
  { id: 'A6', timestamp: '12:08:33', tagName: 'TT-204.PV', expected: 48.5, actual: 55.2, deviation: 13.8, severity: 'Medium', unit: '\u00b0C' },
  { id: 'A7', timestamp: '11:57:42', tagName: 'AT-101.pH', expected: 7.0, actual: 6.2, deviation: -11.4, severity: 'High', unit: 'pH' },
  { id: 'A8', timestamp: '11:45:19', tagName: 'VIB-P103.Z', expected: 1.5, actual: 2.8, deviation: 86.7, severity: 'High', unit: 'mm/s' },
  { id: 'A9', timestamp: '11:32:01', tagName: 'PT-105.PV', expected: 5.5, actual: 5.1, deviation: -7.3, severity: 'Low', unit: 'bar' },
  { id: 'A10', timestamp: '11:20:55', tagName: 'FT-102.PV', expected: 85.0, actual: 79.2, deviation: -6.8, severity: 'Low', unit: 'm\u00b3/h' },
];

interface ModelStatus {
  name: string;
  status: 'Active' | 'Training' | 'Error';
  accuracy: number;
  lastUpdated: string;
}

const models: ModelStatus[] = [
  { name: 'Temperature Model', status: 'Active', accuracy: 96.2, lastUpdated: '2 min ago' },
  { name: 'Vibration Model', status: 'Active', accuracy: 94.8, lastUpdated: '5 min ago' },
  { name: 'Process Model', status: 'Training', accuracy: 91.3, lastUpdated: '1 hr ago' },
];

// Scatter plot data: anomalies over 24 hours
const scatterData = (() => {
  const data: { hour: number; severity: number; tag: string; deviation: number }[] = [];
  const tags = ['TT-101', 'PT-203', 'VIB-M201', 'FT-301', 'LT-102', 'TT-204', 'AT-101'];
  for (let i = 0; i < 47; i++) {
    const hour = Math.random() * 24;
    const sev = Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1;
    data.push({
      hour: parseFloat(hour.toFixed(1)),
      severity: sev,
      tag: tags[Math.floor(Math.random() * tags.length)],
      deviation: parseFloat((Math.random() * 100 + 5).toFixed(1)),
    });
  }
  return data;
})();

/* ---------- Helpers ---------- */

function severityVariant(severity: Anomaly['severity']): 'high' | 'medium' | 'low' {
  switch (severity) {
    case 'High': return 'high';
    case 'Medium': return 'medium';
    case 'Low': return 'low';
  }
}

function severityColor(sev: number): string {
  if (sev === 3) return '#ef4444';
  if (sev === 2) return '#fbbf24';
  return '#4ade80';
}

function modelStatusBadge(status: ModelStatus['status']): 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'Active': return 'success';
    case 'Training': return 'warning';
    case 'Error': return 'danger';
  }
}

/* ---------- Custom Tooltip ---------- */

const ScatterTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ payload: { hour: number; severity: number; tag: string; deviation: number } }>;
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-scada-dark border border-scada-border rounded-md px-3 py-2 shadow-lg text-xs">
      <p className="text-white font-medium">{d.tag}</p>
      <p className="text-gray-400">
        Time: {Math.floor(d.hour).toString().padStart(2, '0')}:
        {Math.floor((d.hour % 1) * 60).toString().padStart(2, '0')}
      </p>
      <p className="text-gray-400">Deviation: {d.deviation}%</p>
      <p style={{ color: severityColor(d.severity) }}>
        Severity: {d.severity === 3 ? 'High' : d.severity === 2 ? 'Medium' : 'Low'}
      </p>
    </div>
  );
};

/* ---------- Component ---------- */

export default function AnomalyPage() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">Anomaly Detection</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Real-time AI anomaly detection across all process variables
            </p>
          </div>
        </div>
        <Badge variant="success" dot pulse>
          Live Monitoring
        </Badge>
      </div>

      {/* Detection Stats KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Total Detections Today"
          value={47}
          unit=""
          trend="up"
          trendValue={12.3}
          icon={<Zap className="w-6 h-6" />}
          color="#f97316"
        />
        <KPICard
          title="False Positive Rate"
          value="3.2"
          unit="%"
          trend="down"
          trendValue={0.8}
          icon={<Activity className="w-6 h-6" />}
          color="#4ade80"
        />
        <KPICard
          title="Avg Detection Time"
          value={12}
          unit="sec"
          trend="down"
          trendValue={2.1}
          icon={<Clock className="w-6 h-6" />}
          color="#0d9488"
        />
      </div>

      {/* Main content: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Anomaly Feed */}
        <div className="lg:col-span-2">
          <Card title="Live Anomaly Feed" subtitle="Last 10 detected anomalies">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-scada-border text-left">
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/50">Time</th>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/50">Tag</th>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/50">Expected</th>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/50">Actual</th>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/50">Deviation</th>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/50">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {anomalies.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAnomaly(selectedAnomaly === a.id ? null : a.id)}
                      className={`border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors cursor-pointer ${
                        selectedAnomaly === a.id ? 'bg-nexaproc-green/10' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 text-gray-500 font-mono text-xs">{a.timestamp}</td>
                      <td className="px-3 py-2.5 text-white/80 font-mono text-xs font-medium">{a.tagName}</td>
                      <td className="px-3 py-2.5 text-gray-400 font-mono text-xs">
                        {a.expected} {a.unit}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs font-medium" style={{ color: a.severity === 'High' ? '#ef4444' : a.severity === 'Medium' ? '#fbbf24' : '#4ade80' }}>
                        {a.actual} {a.unit}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs">
                        <span className={a.deviation > 0 ? 'text-alarm-high' : 'text-blue-400'}>
                          {a.deviation > 0 ? '+' : ''}{a.deviation.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={severityVariant(a.severity)} dot>
                          {a.severity}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Model Status Panel */}
        <div>
          <Card title="Model Status" subtitle="AI detection models">
            <div className="space-y-4">
              {models.map((m) => (
                <div key={m.name} className="rounded-lg bg-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-nexaproc-amber" />
                      <span className="text-sm text-white font-medium">{m.name}</span>
                    </div>
                    <Badge variant={modelStatusBadge(m.status)} dot pulse={m.status === 'Active'}>
                      {m.status}
                    </Badge>
                  </div>
                  {/* Accuracy bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Accuracy</span>
                      <span className="text-xs font-bold text-white">{m.accuracy}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full bg-status-running transition-all"
                        style={{ width: `${m.accuracy}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <RefreshCcw className="w-3 h-3" />
                    Updated {m.lastUpdated}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Anomaly Scatter Plot */}
      <Card title="Anomaly Distribution (24hr)" subtitle="Scatter plot by time and severity">
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(74,222,128,0.08)"
                vertical={false}
              />
              <XAxis
                type="number"
                dataKey="hour"
                name="Hour"
                domain={[0, 24]}
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
                tickFormatter={(v: number) => `${Math.floor(v).toString().padStart(2, '0')}:00`}
              />
              <YAxis
                type="number"
                dataKey="severity"
                name="Severity"
                domain={[0, 4]}
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
                ticks={[1, 2, 3]}
                tickFormatter={(v: number) => v === 1 ? 'Low' : v === 2 ? 'Med' : 'High'}
                width={50}
              />
              <ZAxis type="number" dataKey="deviation" range={[40, 200]} name="Deviation" />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter name="Anomalies" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell key={index} fill={severityColor(entry.severity)} fillOpacity={0.7} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
