import React, { useMemo } from 'react';
import {
  Zap,
  DollarSign,
  Gauge,
  Leaf,
  Lightbulb,
  AlertTriangle,
  Fan,
  Flame,
  Settings,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { Card, Badge } from '@/components/ui';
import { KPICard } from '@/components/scada';

/* ---------- Mock Data ---------- */

// Stacked bar chart: energy by area over 7 days
const areaEnergyData = [
  { day: 'Mon', Production: 680, Utilities: 420, Packaging: 310, Storage: 180, Office: 95 },
  { day: 'Tue', Production: 720, Utilities: 410, Packaging: 290, Storage: 175, Office: 90 },
  { day: 'Wed', Production: 695, Utilities: 445, Packaging: 320, Storage: 190, Office: 92 },
  { day: 'Thu', Production: 710, Utilities: 430, Packaging: 300, Storage: 185, Office: 88 },
  { day: 'Fri', Production: 740, Utilities: 460, Packaging: 330, Storage: 195, Office: 94 },
  { day: 'Sat', Production: 520, Utilities: 380, Packaging: 210, Storage: 160, Office: 45 },
  { day: 'Sun', Production: 480, Utilities: 350, Packaging: 190, Storage: 150, Office: 40 },
];

const areaColors: Record<string, string> = {
  Production: '#f97316',
  Utilities: '#0d9488',
  Packaging: '#fbbf24',
  Storage: '#8b5cf6',
  Office: '#6b7280',
};

// Real-time power trend (24 hours)
const powerTrend = (() => {
  const data: { hour: string; power: number }[] = [];
  let power = 380;
  for (let i = 0; i < 24; i++) {
    power += (Math.random() - 0.45) * 40;
    power = Math.max(200, Math.min(550, power));
    if (i >= 8 && i <= 18) power = Math.max(power, 350); // daytime higher
    if (i >= 22 || i <= 5) power = Math.min(power, 320); // nighttime lower
    data.push({
      hour: `${i.toString().padStart(2, '0')}:00`,
      power: parseFloat(power.toFixed(0)),
    });
  }
  return data;
})();

// Pie chart data
const costBreakdown = [
  { name: 'Heating', value: 35, color: '#ef4444' },
  { name: 'Motors', value: 28, color: '#f97316' },
  { name: 'Lighting', value: 12, color: '#fbbf24' },
  { name: 'HVAC', value: 15, color: '#0d9488' },
  { name: 'Other', value: 10, color: '#6b7280' },
];

// Peak demand alerts
const peakAlerts = [
  { time: '09:45', demand: 520, threshold: 500, area: 'Production', duration: '12 min' },
  { time: '11:20', demand: 535, threshold: 500, area: 'Production', duration: '8 min' },
  { time: '14:05', demand: 512, threshold: 500, area: 'Utilities', duration: '5 min' },
  { time: '16:30', demand: 548, threshold: 500, area: 'Packaging', duration: '15 min' },
];

// Saving opportunities
const opportunities = [
  {
    title: 'Motor VFD Optimization',
    description: 'Install variable frequency drives on 3 constant-speed motors to reduce energy during partial loads.',
    savings: '₹8,500/month',
    payback: '6 months',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    title: 'Heat Recovery System',
    description: 'Recover waste heat from compressors to pre-heat boiler feed water, reducing heating energy by 18%.',
    savings: '₹12,000/month',
    payback: '14 months',
    icon: <Flame className="w-5 h-5" />,
  },
  {
    title: 'HVAC Scheduling Update',
    description: 'Implement occupancy-based HVAC scheduling for warehouse and office areas during off-hours.',
    savings: '₹4,200/month',
    payback: '2 months',
    icon: <Fan className="w-5 h-5" />,
  },
];

/* ---------- Custom Tooltip ---------- */

const PieTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-scada-dark border border-scada-border rounded-md px-3 py-2 shadow-lg text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
        <span className="text-white">{payload[0].name}</span>
      </div>
      <p className="text-gray-400 mt-0.5">{payload[0].value}%</p>
    </div>
  );
};

/* ---------- Component ---------- */

export default function EnergyPage() {
  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">Energy Analytics</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Comprehensive energy consumption monitoring and optimization
            </p>
          </div>
        </div>
        <Badge variant="info" dot>
          Real-Time
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Consumption"
          value="2,847"
          unit="kWh"
          trend="down"
          trendValue={3.2}
          icon={<Zap className="w-6 h-6" />}
          color="#f97316"
        />
        <KPICard
          title="Cost Today"
          value="₹42,705"
          unit=""
          trend="down"
          trendValue={5.1}
          icon={<DollarSign className="w-6 h-6" />}
          color="#fbbf24"
        />
        <KPICard
          title="PUE"
          value="1.34"
          unit=""
          trend="down"
          trendValue={2.8}
          icon={<Gauge className="w-6 h-6" />}
          color="#4ade80"
        />
        <KPICard
          title="Carbon Footprint"
          value="1.2"
          unit="tons CO2"
          trend="down"
          trendValue={4.5}
          icon={<Leaf className="w-6 h-6" />}
          color="#0d9488"
        />
      </div>

      {/* Charts Row 1: Stacked Bar + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stacked Bar: Energy by area */}
        <div className="lg:col-span-2">
          <Card title="Energy Consumption by Area" subtitle="Last 7 days (kWh)">
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaEnergyData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(74,222,128,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#374151"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={{ stroke: '#374151' }}
                  />
                  <YAxis
                    stroke="#374151"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={{ stroke: '#374151' }}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1a12',
                      border: '1px solid rgba(74,222,128,0.28)',
                      borderRadius: 8,
                      fontSize: 12,
                      color: '#e5e7eb',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} iconSize={10} />
                  {Object.keys(areaColors).map((area) => (
                    <Bar
                      key={area}
                      dataKey={area}
                      stackId="a"
                      fill={areaColors[area]}
                      radius={area === 'Office' ? [3, 3, 0, 0] : undefined}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Pie: Cost breakdown */}
        <div>
          <Card title="Cost Breakdown" subtitle="By category (%)">
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, color: '#9ca3af' }}
                    iconType="circle"
                    iconSize={8}
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Real-time Power Trend */}
      <Card title="Real-Time Power Trend" subtitle="24-hour kW consumption">
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={powerTrend} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
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
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
                width={50}
                unit=" kW"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1a12',
                  border: '1px solid rgba(74,222,128,0.28)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#e5e7eb',
                }}
                formatter={(value) => [`${value} kW`, 'Power']}
              />
              {/* Threshold reference line */}
              <Line
                type="monotone"
                dataKey="power"
                name="Power"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#fbbf24', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom Row: Peak Alerts + Saving Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Demand Alerts */}
        <Card title="Peak Demand Alerts" subtitle="When demand exceeded 500 kW threshold">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-scada-border text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Time</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Demand (kW)</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Area</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Duration</th>
                </tr>
              </thead>
              <tbody>
                {peakAlerts.map((a, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{a.time}</td>
                    <td className="px-4 py-3">
                      <span className="text-alarm-high font-mono text-xs font-bold">{a.demand}</span>
                      <span className="text-gray-600 text-xs ml-1">/ {a.threshold}</span>
                    </td>
                    <td className="px-4 py-3 text-white/80 text-xs">{a.area}</td>
                    <td className="px-4 py-3">
                      <Badge variant="warning">{a.duration}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Energy Saving Opportunities */}
        <Card title="Energy Saving Opportunities" subtitle="AI-recommended improvements">
          <div className="space-y-4">
            {opportunities.map((opp, idx) => (
              <div key={idx} className="rounded-lg bg-white/5 p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-nexaproc-amber/10 text-nexaproc-amber flex items-center justify-center shrink-0">
                    {opp.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white">{opp.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{opp.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs">
                        <DollarSign className="w-3 h-3 text-status-running" />
                        <span className="text-status-running font-semibold">{opp.savings}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Lightbulb className="w-3 h-3" />
                        Payback: {opp.payback}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
