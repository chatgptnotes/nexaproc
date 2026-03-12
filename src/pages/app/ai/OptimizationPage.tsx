import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Trash2,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { Card, Badge, Button, Modal } from '@/components/ui';

/* ---------- Mock Data ---------- */

interface ComparisonMetric {
  label: string;
  current: string;
  optimized: string;
  change: string;
  changeNum: number;
  icon: React.ReactNode;
  unit: string;
}

const comparisons: ComparisonMetric[] = [
  {
    label: 'Throughput',
    current: '847',
    optimized: '912',
    change: '+7.7%',
    changeNum: 7.7,
    icon: <BarChart3 className="w-5 h-5" />,
    unit: 'units/hr',
  },
  {
    label: 'Energy',
    current: '234',
    optimized: '198',
    change: '-15.4%',
    changeNum: -15.4,
    icon: <Zap className="w-5 h-5" />,
    unit: 'kWh/batch',
  },
  {
    label: 'Yield',
    current: '94.2',
    optimized: '96.8',
    change: '+2.6%',
    changeNum: 2.6,
    icon: <Target className="w-5 h-5" />,
    unit: '%',
  },
  {
    label: 'Waste',
    current: '5.8',
    optimized: '3.2',
    change: '-44.8%',
    changeNum: -44.8,
    icon: <Trash2 className="w-5 h-5" />,
    unit: '%',
  },
];

interface Recommendation {
  id: string;
  parameter: string;
  currentValue: string;
  recommendedValue: string;
  impact: string;
  confidence: number;
}

const recommendations: Recommendation[] = [
  { id: 'R1', parameter: 'Reactor Temperature', currentValue: '185\u00b0C', recommendedValue: '192\u00b0C', impact: 'Yield +1.2%', confidence: 94 },
  { id: 'R2', parameter: 'Feed Flow Rate', currentValue: '120 m\u00b3/h', recommendedValue: '132 m\u00b3/h', impact: 'Throughput +10%', confidence: 91 },
  { id: 'R3', parameter: 'Catalyst Ratio', currentValue: '1:4.2', recommendedValue: '1:4.5', impact: 'Waste -22%', confidence: 88 },
  { id: 'R4', parameter: 'Cooling Water Temp', currentValue: '28\u00b0C', recommendedValue: '24\u00b0C', impact: 'Energy -8%', confidence: 86 },
  { id: 'R5', parameter: 'Agitator Speed', currentValue: '450 RPM', recommendedValue: '480 RPM', impact: 'Yield +0.8%', confidence: 83 },
];

interface OptHistory {
  id: string;
  date: string;
  parameter: string;
  change: string;
  result: string;
  success: boolean;
}

const history: OptHistory[] = [
  { id: 'H1', date: '08 Mar', parameter: 'Feed Pressure', change: '3.2 \u2192 3.5 bar', result: 'Throughput +5.2%', success: true },
  { id: 'H2', date: '01 Mar', parameter: 'Reactor Temp', change: '180 \u2192 185\u00b0C', result: 'Yield +1.5%', success: true },
  { id: 'H3', date: '22 Feb', parameter: 'Catalyst Load', change: '1:4.0 \u2192 1:4.2', result: 'Waste -15%', success: true },
  { id: 'H4', date: '15 Feb', parameter: 'Cooling Flow', change: '45 \u2192 50 m\u00b3/h', result: 'Energy -6.3%', success: true },
  { id: 'H5', date: '08 Feb', parameter: 'Agitator Speed', change: '420 \u2192 450 RPM', result: 'No significant change', success: false },
];

// Before/After trend data
const trendData = (() => {
  const data: { hour: string; before: number; after: number }[] = [];
  let before = 82;
  let after = 82;
  for (let i = 0; i < 24; i++) {
    before += (Math.random() - 0.48) * 2;
    after += (Math.random() - 0.35) * 2;
    before = Math.max(76, Math.min(92, before));
    after = Math.max(80, Math.min(98, after));
    data.push({
      hour: `${i.toString().padStart(2, '0')}:00`,
      before: parseFloat(before.toFixed(1)),
      after: parseFloat(after.toFixed(1)),
    });
  }
  return data;
})();

/* ---------- Component ---------- */

export default function OptimizationPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">Process Optimization</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              AI-driven optimization recommendations for peak performance
            </p>
          </div>
        </div>
        <Badge variant="info" dot>
          5 Recommendations
        </Badge>
      </div>

      {/* Current vs Optimized Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {comparisons.map((c) => {
          const isPositive =
            (c.label === 'Energy' || c.label === 'Waste') ? c.changeNum < 0 : c.changeNum > 0;
          return (
            <Card key={c.label}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: isPositive ? 'rgba(74,222,128,0.12)' : 'rgba(239,68,68,0.12)',
                      color: isPositive ? '#4ade80' : '#ef4444',
                    }}
                  >
                    {c.icon}
                  </div>
                  <Badge variant={isPositive ? 'success' : 'danger'}>
                    {c.change}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{c.label}</p>
                <div className="flex items-center gap-2">
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold text-white/60">{c.current}</p>
                    <p className="text-[10px] text-gray-600">Current</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 shrink-0" />
                  <div className="text-center flex-1">
                    <p className="text-lg font-bold text-nexaproc-amber">{c.optimized}</p>
                    <p className="text-[10px] text-gray-600">Optimized</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 text-center">{c.unit}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recommendations Table */}
      <Card
        title="Optimization Recommendations"
        subtitle="AI-generated parameter adjustments"
        headerAction={
          <Button size="sm" onClick={() => setConfirmOpen(true)}>
            Apply Recommendations
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Parameter</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Current</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Recommended</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Expected Impact</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors"
                >
                  <td className="px-4 py-3 text-white/80 font-medium">{r.parameter}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{r.currentValue}</td>
                  <td className="px-4 py-3 text-nexaproc-amber font-mono text-xs font-medium">{r.recommendedValue}</td>
                  <td className="px-4 py-3">
                    <Badge variant="success">{r.impact}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-1.5 rounded-full bg-nexaproc-amber transition-all"
                          style={{ width: `${r.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{r.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Apply Optimization Recommendations"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setConfirmOpen(false)}>
              Confirm & Apply
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            You are about to apply {recommendations.length} AI-recommended parameter changes.
            This will adjust the following process setpoints:
          </p>
          <div className="space-y-2">
            {recommendations.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded bg-white/5 px-3 py-2 text-xs">
                <span className="text-white/80">{r.parameter}</span>
                <span className="font-mono text-gray-400">
                  {r.currentValue} <ArrowRight className="w-3 h-3 inline mx-1 text-nexaproc-amber" /> {r.recommendedValue}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Changes will be applied gradually over 15 minutes. All parameter movements are bounded by safety limits.
          </p>
        </div>
      </Modal>

      {/* Before/After Trend Chart */}
      <Card title="Production Efficiency Comparison" subtitle="Before vs After optimization (simulated)">
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(74,222,128,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
                interval={3}
              />
              <YAxis
                domain={[70, 100]}
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
                width={50}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1a12',
                  border: '1px solid rgba(74,222,128,0.28)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#e5e7eb',
                }}
                formatter={(value, name) => [`${value}%`, name === 'before' ? 'Before' : 'After']}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} iconType="line" iconSize={12} />
              <Line
                type="monotone"
                dataKey="before"
                name="Before Optimization"
                stroke="#6b7280"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="after"
                name="After Optimization"
                stroke="#4ade80"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Optimization History */}
      <Card title="Optimization History" subtitle="Last 5 applied optimizations">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Date</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Parameter</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Change</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Result</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr
                  key={h.id}
                  className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{h.date}</td>
                  <td className="px-4 py-3 text-white/80 font-medium">{h.parameter}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{h.change}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{h.result}</td>
                  <td className="px-4 py-3">
                    {h.success ? (
                      <span className="inline-flex items-center gap-1 text-status-running text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                        <TrendingDown className="w-3.5 h-3.5" /> No Impact
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
