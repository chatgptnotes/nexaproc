import React, { useState, useMemo } from 'react';
import { format, subDays, subMinutes } from 'date-fns';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
  Cell,
} from 'recharts';
import { AlertTriangle, Clock, Hash, TrendingUp } from 'lucide-react';
import { Card, Input, Badge, Table } from '@/components/ui';
import KPICard from '@/components/scada/KPICard';

type AlarmPriority = 'Critical' | 'High' | 'Medium' | 'Low';

interface AlarmRecord {
  id: number;
  timestamp: Date;
  tag: string;
  description: string;
  priority: AlarmPriority;
  durationMin: number;
  operator: string;
}

const ALARM_TAGS = [
  { tag: 'TT-101', desc: 'Reactor Temp HiHi' },
  { tag: 'TT-101', desc: 'Reactor Temp Hi' },
  { tag: 'PT-201', desc: 'Header Pressure Hi' },
  { tag: 'PT-201', desc: 'Header Pressure Lo' },
  { tag: 'FT-301', desc: 'Feed Flow Hi' },
  { tag: 'FT-301', desc: 'Feed Flow Lo' },
  { tag: 'LT-401', desc: 'Tank Level HiHi' },
  { tag: 'LT-401', desc: 'Tank Level Hi' },
  { tag: 'LT-401', desc: 'Tank Level Lo' },
  { tag: 'AT-501', desc: 'pH Hi' },
  { tag: 'AT-501', desc: 'pH Lo' },
  { tag: 'TT-102', desc: 'Coolant Temp Hi' },
  { tag: 'VIB-601', desc: 'Pump Vibration Hi' },
  { tag: 'XV-201', desc: 'Valve Fail to Open' },
  { tag: 'COMM-01', desc: 'PLC-01 Comm Failure' },
];

const PRIORITIES: AlarmPriority[] = ['Critical', 'High', 'Medium', 'Low'];
const OPERATORS = ['operator1', 'operator2', 'supervisor', 'engineer'];

const PRIORITY_BADGE: Record<AlarmPriority, 'critical' | 'high' | 'medium' | 'low'> = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
};

function generateAlarms(count: number): AlarmRecord[] {
  const now = new Date();
  const alarms: AlarmRecord[] = [];
  for (let i = 0; i < count; i++) {
    const template = ALARM_TAGS[Math.floor(Math.random() * ALARM_TAGS.length)];
    const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
    alarms.push({
      id: i + 1,
      timestamp: subMinutes(now, Math.floor(Math.random() * 10080)),
      tag: template.tag,
      description: template.desc,
      priority,
      durationMin: Math.round((Math.random() * 120 + 1) * 10) / 10,
      operator: OPERATORS[Math.floor(Math.random() * OPERATORS.length)],
    });
  }
  return alarms.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

const PARETO_COLORS = [
  '#ef4444', '#f97316', '#fbbf24', '#a3e635', '#4ade80',
  '#34d399', '#22d3ee', '#38bdf8', '#818cf8', '#a78bfa',
];

export default function AlarmHistoryPage() {
  const [alarms] = useState<AlarmRecord[]>(() => generateAlarms(50));
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const filteredAlarms = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return alarms.filter((a) => a.timestamp >= start && a.timestamp <= end);
  }, [alarms, startDate, endDate]);

  // Pareto data: top 10 most frequent alarm descriptions
  const paretoData = useMemo(() => {
    const freq: Record<string, number> = {};
    filteredAlarms.forEach((a) => {
      const key = `${a.tag} ${a.description}`;
      freq[key] = (freq[key] || 0) + 1;
    });
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    let cumulative = 0;
    const total = sorted.reduce((sum, [, c]) => sum + c, 0);
    return sorted.map(([name, count]) => {
      cumulative += count;
      return {
        name,
        count,
        cumPct: total > 0 ? Math.round((cumulative / total) * 100) : 0,
      };
    });
  }, [filteredAlarms]);

  // Frequency by hour
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      count: 0,
    }));
    filteredAlarms.forEach((a) => {
      const h = a.timestamp.getHours();
      hours[h].count++;
    });
    return hours;
  }, [filteredAlarms]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAlarms.length;
    const avgDuration =
      total > 0
        ? filteredAlarms.reduce((s, a) => s + a.durationMin, 0) / total
        : 0;
    const tagFreq: Record<string, number> = {};
    filteredAlarms.forEach((a) => {
      tagFreq[a.tag] = (tagFreq[a.tag] || 0) + 1;
    });
    const mostFreqTag = Object.entries(tagFreq).sort((a, b) => b[1] - a[1])[0];
    return {
      total,
      avgDuration: Math.round(avgDuration * 10) / 10,
      mostFreqTag: mostFreqTag ? mostFreqTag[0] : 'N/A',
      mostFreqCount: mostFreqTag ? mostFreqTag[1] : 0,
    };
  }, [filteredAlarms]);

  const columns = [
    {
      key: 'timestamp',
      header: 'Time',
      sortable: true,
      width: '170px',
      render: (row: AlarmRecord) => (
        <span className="font-mono text-xs text-white/70">
          {format(row.timestamp, 'yyyy-MM-dd HH:mm:ss')}
        </span>
      ),
    },
    { key: 'tag', header: 'Tag', sortable: true, width: '100px' },
    { key: 'description', header: 'Description', sortable: true },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      width: '100px',
      render: (row: AlarmRecord) => (
        <Badge variant={PRIORITY_BADGE[row.priority]}>{row.priority}</Badge>
      ),
    },
    {
      key: 'durationMin',
      header: 'Duration',
      sortable: true,
      width: '100px',
      render: (row: AlarmRecord) => (
        <span className="font-mono text-xs text-white/70">{row.durationMin} min</span>
      ),
    },
    { key: 'operator', header: 'Operator', sortable: true, width: '110px' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-nexaproc-amber" />
            Alarm History
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Historical alarm analytics and records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-white/40 text-sm">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total Alarms"
          value={stats.total}
          unit="alarms"
          trend={stats.total > 40 ? 'up' : 'down'}
          trendValue={stats.total > 40 ? 12.5 : 8.3}
          icon={<Hash className="w-5 h-5" />}
          color="#ef4444"
        />
        <KPICard
          title="Avg Duration"
          value={stats.avgDuration}
          unit="min"
          trend="down"
          trendValue={5.2}
          icon={<Clock className="w-5 h-5" />}
          color="#fbbf24"
        />
        <KPICard
          title="Most Frequent Tag"
          value={stats.mostFreqTag}
          unit={`${stats.mostFreqCount}x`}
          trend="up"
          trendValue={15.0}
          icon={<TrendingUp className="w-5 h-5" />}
          color="#f97316"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pareto Chart */}
        <Card title="Top 10 Most Frequent Alarms" subtitle="Pareto analysis">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={paretoData}
                margin={{ top: 8, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(74,222,128,0.08)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 9 }}
                  stroke="#374151"
                  angle={-35}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis
                  yAxisId="count"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  stroke="#374151"
                  width={40}
                />
                <YAxis
                  yAxisId="pct"
                  orientation="right"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  stroke="#374151"
                  width={40}
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1a12',
                    border: '1px solid rgba(74,222,128,0.28)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#e5e7eb',
                  }}
                />
                <Bar yAxisId="count" dataKey="count" radius={[4, 4, 0, 0]}>
                  {paretoData.map((_, i) => (
                    <Cell key={i} fill={PARETO_COLORS[i % PARETO_COLORS.length]} />
                  ))}
                </Bar>
                <Line
                  yAxisId="pct"
                  type="monotone"
                  dataKey="cumPct"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#fbbf24' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hourly Frequency */}
        <Card title="Alarm Frequency by Hour" subtitle="24-hour distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyData}
                margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(74,222,128,0.08)"
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  stroke="#374151"
                  interval={2}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  stroke="#374151"
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1a12',
                    border: '1px solid rgba(74,222,128,0.28)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#e5e7eb',
                  }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Alarm History Table */}
      <Card title="Alarm Records" subtitle={`${filteredAlarms.length} records`} noPadding>
        <Table<AlarmRecord>
          columns={columns}
          data={filteredAlarms}
          emptyMessage="No alarms in selected date range"
        />
      </Card>
    </div>
  );
}
