import { useState, useMemo } from 'react';
import {
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import GaugeWidget from '@/components/scada/GaugeWidget';
import TrendChart from '@/components/scada/TrendChart';
import KPICard from '@/components/scada/KPICard';

// ── Production Lines ────────────────────────────────────────────────────────
const productionLines = [
  { value: 'line-1', label: 'Line 1 — Reactor Train A' },
  { value: 'line-2', label: 'Line 2 — Reactor Train B' },
  { value: 'line-3', label: 'Line 3 — Packaging' },
  { value: 'line-4', label: 'Line 4 — Blending' },
];

// ── OEE Trend (7 days) ─────────────────────────────────────────────────────
const oeeTrendData = [
  { time: 'Mon', oee: 91.5, availability: 96.2, performance: 97.1, quality: 97.9 },
  { time: 'Tue', oee: 92.8, availability: 96.8, performance: 97.5, quality: 98.3 },
  { time: 'Wed', oee: 89.4, availability: 94.1, performance: 96.8, quality: 98.1 },
  { time: 'Thu', oee: 93.6, availability: 97.0, performance: 98.0, quality: 98.5 },
  { time: 'Fri', oee: 94.2, availability: 97.1, performance: 98.3, quality: 98.8 },
  { time: 'Sat', oee: 95.1, availability: 97.5, performance: 98.6, quality: 98.9 },
  { time: 'Sun', oee: 94.2, availability: 97.1, performance: 98.3, quality: 98.8 },
];

const trendSeries = [
  { key: 'oee', label: 'OEE', color: '#fbbf24' },
  { key: 'availability', label: 'Availability', color: '#4ade80' },
  { key: 'performance', label: 'Performance', color: '#3b82f6' },
  { key: 'quality', label: 'Quality', color: '#a78bfa' },
];

// ── Loss Waterfall ──────────────────────────────────────────────────────────
const waterfallData = [
  { name: 'Ideal\n100%', value: 100, loss: 0, color: '#4ade80' },
  { name: 'Planned\nDowntime', value: 97.1, loss: 2.9, color: '#6b7280' },
  { name: 'Unplanned\nDowntime', value: 95.3, loss: 1.8, color: '#ef4444' },
  { name: 'Speed\nLoss', value: 94.0, loss: 1.3, color: '#f97316' },
  { name: 'Minor\nStops', value: 93.2, loss: 0.8, color: '#fbbf24' },
  { name: 'Defects', value: 92.6, loss: 0.6, color: '#a78bfa' },
  { name: 'Rework', value: 94.2, loss: -1.6, color: '#3b82f6' },
];

// Stacked waterfall: for each bar, show "remaining" as transparent and "loss" as colored
const waterfallStacked = waterfallData.map((d, i) => ({
  name: d.name,
  remaining: i === 0 ? 100 : waterfallData[i - 1].value - d.loss,
  loss: i === 0 ? 0 : d.loss,
  color: d.color,
  total: d.value,
}));

// ── Top 5 Losses ────────────────────────────────────────────────────────────
interface LossRow {
  category: string;
  duration: number;
  impact: number;
  rootCause: string;
}

const top5Losses: LossRow[] = [
  { category: 'Planned Downtime', duration: 4.2, impact: 2.9, rootCause: 'Scheduled CIP cleaning cycle' },
  { category: 'Unplanned Downtime', duration: 2.6, impact: 1.8, rootCause: 'Pump P-201 bearing failure' },
  { category: 'Speed Loss', duration: 1.9, impact: 1.3, rootCause: 'Viscosity variation in feed stream' },
  { category: 'Minor Stops', duration: 1.2, impact: 0.8, rootCause: 'Conveyor belt alignment sensor trips' },
  { category: 'Defects / Scrap', duration: 0.9, impact: 0.6, rootCause: 'Off-spec pH in batch B-2024-047' },
];

const lossColumns = [
  { key: 'category', header: 'Loss Category', sortable: true },
  {
    key: 'duration',
    header: 'Duration (hrs)',
    sortable: true,
    render: (r: LossRow) => (
      <span className="font-mono text-nexaproc-amber">{r.duration.toFixed(1)}</span>
    ),
  },
  {
    key: 'impact',
    header: 'Impact (%)',
    sortable: true,
    render: (r: LossRow) => (
      <span className="font-mono text-alarm-critical">{r.impact.toFixed(1)}%</span>
    ),
  },
  { key: 'rootCause', header: 'Root Cause' },
];

// ── Waterfall Tooltip ───────────────────────────────────────────────────────
const WaterfallTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) => {
  if (!active || !payload) return null;
  const loss = payload.find((p) => p.name === 'loss');
  return (
    <div className="bg-scada-dark border border-scada-border rounded-md px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400 mb-1">{label?.replace('\n', ' ')}</p>
      {loss && loss.value > 0 && (
        <p className="text-alarm-critical font-mono">Loss: {loss.value.toFixed(1)}%</p>
      )}
    </div>
  );
};

export default function OeePage() {
  const [selectedLine, setSelectedLine] = useState('line-1');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Gauge size={24} className="text-nexaproc-amber" />
          <h1 className="text-2xl font-bold text-white">OEE Dashboard</h1>
        </div>
        <Select
          options={productionLines}
          value={selectedLine}
          onChange={setSelectedLine}
          className="w-64"
        />
      </div>

      {/* Large OEE Gauge + 3 Sub-KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <GaugeWidget
            value={94.2}
            min={0}
            max={100}
            unit="%"
            label="Overall Equipment Effectiveness"
            thresholds={{ lolo: 60, low: 75, high: 90, hihi: 98 }}
          />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard
            title="Availability"
            value="97.1"
            unit="%"
            trend="up"
            trendValue={0.8}
            icon={<Activity size={22} />}
            color="#4ade80"
          />
          <KPICard
            title="Performance"
            value="98.3"
            unit="%"
            trend="up"
            trendValue={0.5}
            icon={<Zap size={22} />}
            color="#3b82f6"
          />
          <KPICard
            title="Quality"
            value="98.8"
            unit="%"
            trend="flat"
            trendValue={0.1}
            icon={<ShieldCheck size={22} />}
            color="#a78bfa"
          />
        </div>
      </div>

      {/* OEE Trend Chart */}
      <Card title="OEE Trend — Last 7 Days" subtitle="All factors plotted">
        <TrendChart data={oeeTrendData} series={trendSeries} height={300} />
      </Card>

      {/* Loss Waterfall */}
      <Card title="Loss Waterfall Analysis" subtitle="Breakdown from 100% ideal to actual OEE">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={waterfallStacked}
              margin={{ top: 16, right: 16, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                tickLine={{ stroke: '#374151' }}
                interval={0}
              />
              <YAxis
                domain={[80, 100]}
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<WaterfallTooltip />} />
              <Bar dataKey="remaining" stackId="a" fill="transparent" />
              <Bar dataKey="loss" stackId="a" radius={[4, 4, 0, 0]}>
                {waterfallStacked.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top 5 Losses Table */}
      <Card title="Top 5 Losses" subtitle="Ranked by OEE impact">
        <Table columns={lossColumns} data={top5Losses} />
      </Card>
    </div>
  );
}
