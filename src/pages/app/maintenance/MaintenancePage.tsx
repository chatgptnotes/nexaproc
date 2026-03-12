import {
  Hammer,
  Clock,
  Wrench,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import KPICard from '@/components/scada/KPICard';

// ── Equipment Health Heatmap ────────────────────────────────────────────────
type HealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';

interface EquipmentHealth {
  name: string;
  tag: string;
  status: HealthStatus;
  score: number;
}

const healthColors: Record<HealthStatus, { bg: string; text: string; border: string; label: string }> = {
  healthy: { bg: 'bg-status-running/15', text: 'text-status-running', border: 'border-status-running/30', label: 'Healthy' },
  warning: { bg: 'bg-status-warning/15', text: 'text-status-warning', border: 'border-status-warning/30', label: 'Warning' },
  critical: { bg: 'bg-status-fault/15', text: 'text-status-fault', border: 'border-status-fault/30', label: 'Critical' },
  offline: { bg: 'bg-gray-600/15', text: 'text-gray-500', border: 'border-gray-600/30', label: 'Offline' },
};

const equipmentGrid: EquipmentHealth[] = [
  { name: 'Reactor R-101', tag: 'R-101', status: 'healthy', score: 95 },
  { name: 'Reactor R-102', tag: 'R-102', status: 'healthy', score: 92 },
  { name: 'Pump P-201', tag: 'P-201', status: 'critical', score: 42 },
  { name: 'Pump P-202', tag: 'P-202', status: 'healthy', score: 88 },
  { name: 'Compressor C-301', tag: 'C-301', status: 'warning', score: 68 },
  { name: 'Compressor C-302', tag: 'C-302', status: 'healthy', score: 91 },
  { name: 'Heat Exchanger HX-401', tag: 'HX-401', status: 'healthy', score: 89 },
  { name: 'Heat Exchanger HX-402', tag: 'HX-402', status: 'warning', score: 72 },
  { name: 'Agitator AG-501', tag: 'AG-501', status: 'healthy', score: 94 },
  { name: 'Conveyor CV-601', tag: 'CV-601', status: 'offline', score: 0 },
  { name: 'Blender BL-701', tag: 'BL-701', status: 'healthy', score: 97 },
  { name: 'Centrifuge CF-801', tag: 'CF-801', status: 'healthy', score: 86 },
  { name: 'Dryer DR-901', tag: 'DR-901', status: 'warning', score: 65 },
  { name: 'Filter FL-1001', tag: 'FL-1001', status: 'healthy', score: 93 },
  { name: 'Valve V-1101', tag: 'V-1101', status: 'healthy', score: 99 },
  { name: 'Motor M-1201', tag: 'M-1201', status: 'healthy', score: 90 },
];

// ── Upcoming Maintenance ────────────────────────────────────────────────────
interface UpcomingPM {
  equipment: string;
  task: string;
  dueDate: string;
  type: 'Inspection' | 'Lubrication' | 'Replacement' | 'Calibration';
  priority: 'High' | 'Medium' | 'Low';
}

const upcomingMaintenance: UpcomingPM[] = [
  { equipment: 'Pump P-201', task: 'Bearing replacement & alignment', dueDate: '2026-03-13', type: 'Replacement', priority: 'High' },
  { equipment: 'Compressor C-301', task: 'Vibration analysis & belt inspection', dueDate: '2026-03-14', type: 'Inspection', priority: 'High' },
  { equipment: 'Heat Exchanger HX-402', task: 'Tube fouling inspection', dueDate: '2026-03-15', type: 'Inspection', priority: 'Medium' },
  { equipment: 'Dryer DR-901', task: 'Lubrication of drive chain', dueDate: '2026-03-16', type: 'Lubrication', priority: 'Medium' },
  { equipment: 'Reactor R-101', task: 'Pressure transmitter calibration', dueDate: '2026-03-18', type: 'Calibration', priority: 'Low' },
];

const pmTypeColor: Record<UpcomingPM['type'], string> = {
  Inspection: 'text-status-maintenance',
  Lubrication: 'text-status-running',
  Replacement: 'text-nexaproc-orange',
  Calibration: 'text-[#a78bfa]',
};

// ── Failure Trend (6 months) ────────────────────────────────────────────────
const failureTrend = [
  { month: 'Oct', failures: 8 },
  { month: 'Nov', failures: 12 },
  { month: 'Dec', failures: 6 },
  { month: 'Jan', failures: 9 },
  { month: 'Feb', failures: 5 },
  { month: 'Mar', failures: 3 },
];

// ── Work Orders by Priority ─────────────────────────────────────────────────
const woPriority = [
  { name: 'Critical', value: 2, color: '#ef4444' },
  { name: 'High', value: 4, color: '#f97316' },
  { name: 'Medium', value: 5, color: '#fbbf24' },
  { name: 'Low', value: 3, color: '#3b82f6' },
];

// ── Custom Tooltips ─────────────────────────────────────────────────────────
const BarTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-scada-dark border border-scada-border rounded-md px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400">{label}</p>
      <p className="font-mono text-alarm-critical">{payload[0].value} failures</p>
    </div>
  );
};

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-scada-dark border border-scada-border rounded-md px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400">{payload[0].name}</p>
      <p className="font-mono text-white">{payload[0].value} work orders</p>
    </div>
  );
};

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Hammer size={24} className="text-nexaproc-amber" />
        <h1 className="text-2xl font-bold text-white">Maintenance Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="MTBF"
          value="720"
          unit="hrs"
          trend="up"
          trendValue={3.2}
          icon={<Clock size={22} />}
          color="#4ade80"
        />
        <KPICard
          title="MTTR"
          value="2.4"
          unit="hrs"
          trend="down"
          trendValue={0.8}
          icon={<Wrench size={22} />}
          color="#3b82f6"
        />
        <KPICard
          title="Pending Work Orders"
          value="12"
          unit=""
          trend="down"
          trendValue={2.0}
          icon={<ClipboardList size={22} />}
          color="#fbbf24"
        />
        <KPICard
          title="PM Compliance"
          value="94"
          unit="%"
          trend="up"
          trendValue={1.5}
          icon={<CheckCircle2 size={22} />}
          color="#a78bfa"
        />
      </div>

      {/* Equipment Health Heatmap */}
      <Card title="Equipment Health Heatmap" subtitle="Real-time condition monitoring scores">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {equipmentGrid.map((eq) => {
            const cfg = healthColors[eq.status];
            return (
              <div
                key={eq.tag}
                className={clsx(
                  'rounded-lg border p-3 transition-all hover:brightness-110',
                  cfg.bg,
                  cfg.border,
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-white/40">{eq.tag}</span>
                  <span className={clsx('text-xs font-bold font-mono', cfg.text)}>
                    {eq.status === 'offline' ? '—' : `${eq.score}%`}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white/80 truncate">{eq.name}</p>
                {/* Health bar */}
                <div className="mt-2 w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all',
                      eq.status === 'healthy' && 'bg-status-running',
                      eq.status === 'warning' && 'bg-status-warning',
                      eq.status === 'critical' && 'bg-status-fault',
                      eq.status === 'offline' && 'bg-gray-600',
                    )}
                    style={{ width: `${eq.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-scada-border">
          {Object.entries(healthColors).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={clsx('w-2.5 h-2.5 rounded-full', cfg.bg, 'border', cfg.border)} />
              <span className="text-[10px] text-white/40">{cfg.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Two-column: Schedule + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Maintenance */}
        <Card title="Upcoming Maintenance" subtitle="Next 5 scheduled items">
          <div className="space-y-2">
            {upcomingMaintenance.map((pm, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-scada-border/50 bg-scada-dark/40 px-4 py-3"
              >
                <Calendar size={16} className={clsx('flex-shrink-0 mt-0.5', pmTypeColor[pm.type])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-white truncate">{pm.equipment}</span>
                    <Badge variant={pm.priority === 'High' ? 'danger' : pm.priority === 'Medium' ? 'warning' : 'info'}>
                      {pm.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-white/50">{pm.task}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-white/30">{pm.dueDate}</span>
                    <Badge variant={pm.type === 'Replacement' ? 'warning' : pm.type === 'Inspection' ? 'info' : pm.type === 'Calibration' ? 'neutral' : 'success'}>
                      {pm.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Failure Trend */}
        <Card title="Failure Trend" subtitle="Monthly failures — last 6 months">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureTrend} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={{ stroke: '#374151' }} />
                <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={{ stroke: '#374151' }} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="failures" radius={[4, 4, 0, 0]}>
                  {failureTrend.map((entry, i) => (
                    <Cell key={i} fill={entry.failures >= 10 ? '#ef4444' : entry.failures >= 6 ? '#fbbf24' : '#4ade80'} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Work Orders by Priority */}
      <Card title="Open Work Orders by Priority" subtitle="Distribution of 14 open work orders">
        <div className="h-[280px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={woPriority}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {woPriority.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                formatter={(value: string) => <span className="text-xs text-white/60">{value}</span>}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
