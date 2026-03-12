import { useState, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  Droplets,
  ScanLine,
  RefreshCw,
  Gauge,
} from 'lucide-react';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import KPICard from '@/components/scada/KPICard';

// ── Types ───────────────────────────────────────────────────────────────────
type PmType = 'Inspection' | 'Lubrication' | 'Replacement' | 'Calibration';
type PmStatus = 'Scheduled' | 'Completed' | 'Overdue';

interface PmTask {
  id: string;
  equipment: string;
  description: string;
  type: PmType;
  frequency: string;
  lastDone: string;
  nextDue: string;
  day: number; // day of month
  status: PmStatus;
  checklist: string[];
}

// ── Config ──────────────────────────────────────────────────────────────────
const typeConfig: Record<PmType, { color: string; bgColor: string; borderColor: string; dotColor: string; icon: LucideIcon }> = {
  Inspection: { color: 'text-status-maintenance', bgColor: 'bg-status-maintenance/15', borderColor: 'border-status-maintenance/30', dotColor: 'bg-status-maintenance', icon: ScanLine },
  Lubrication: { color: 'text-status-running', bgColor: 'bg-status-running/15', borderColor: 'border-status-running/30', dotColor: 'bg-status-running', icon: Droplets },
  Replacement: { color: 'text-nexaproc-orange', bgColor: 'bg-nexaproc-orange/15', borderColor: 'border-nexaproc-orange/30', dotColor: 'bg-nexaproc-orange', icon: RefreshCw },
  Calibration: { color: 'text-[#a78bfa]', bgColor: 'bg-[#a78bfa]/15', borderColor: 'border-[#a78bfa]/30', dotColor: 'bg-[#a78bfa]', icon: Gauge },
};

// ── Mock PM Tasks (20) ──────────────────────────────────────────────────────
const pmTasks: PmTask[] = [
  { id: 'PM-001', equipment: 'Reactor R-101', description: 'Pressure transmitter calibration', type: 'Calibration', frequency: 'Quarterly', lastDone: '2025-12-18', nextDue: '2026-03-18', day: 18, status: 'Scheduled', checklist: ['Isolate transmitter', 'Apply known pressures (0, 25, 50, 75, 100%)', 'Record as-found / as-left', 'Verify 4-20mA output', 'Remove isolation and verify live reading'] },
  { id: 'PM-002', equipment: 'Reactor R-102', description: 'Safety valve annual test', type: 'Inspection', frequency: 'Annual', lastDone: '2025-03-20', nextDue: '2026-03-20', day: 20, status: 'Scheduled', checklist: ['Verify set pressure', 'Check for leaks', 'Inspect seat condition', 'Document test results'] },
  { id: 'PM-003', equipment: 'Pump P-201', description: 'Vibration analysis', type: 'Inspection', frequency: 'Monthly', lastDone: '2026-02-15', nextDue: '2026-03-15', day: 15, status: 'Scheduled', checklist: ['Mount accelerometer', 'Record axial/radial/tangential', 'Compare to baseline', 'Flag if > 4.5 mm/s'] },
  { id: 'PM-004', equipment: 'Pump P-202', description: 'Mechanical seal inspection', type: 'Inspection', frequency: 'Quarterly', lastDone: '2025-12-10', nextDue: '2026-03-10', day: 10, status: 'Overdue', checklist: ['Check for visible leakage', 'Inspect seal faces', 'Verify flush system', 'Record findings'] },
  { id: 'PM-005', equipment: 'Compressor C-301', description: 'Belt tension check', type: 'Inspection', frequency: 'Monthly', lastDone: '2026-02-14', nextDue: '2026-03-14', day: 14, status: 'Scheduled', checklist: ['Check belt tension', 'Inspect for cracks/wear', 'Verify alignment', 'Adjust if needed'] },
  { id: 'PM-006', equipment: 'Compressor C-302', description: 'Oil change', type: 'Replacement', frequency: 'Quarterly', lastDone: '2025-12-22', nextDue: '2026-03-22', day: 22, status: 'Scheduled', checklist: ['Drain old oil', 'Replace filter element', 'Fill with ISO-46 compressor oil', 'Run and check for leaks'] },
  { id: 'PM-007', equipment: 'Heat Exchanger HX-401', description: 'Tube fouling check', type: 'Inspection', frequency: 'Monthly', lastDone: '2026-02-08', nextDue: '2026-03-08', day: 8, status: 'Completed', checklist: ['Measure differential pressure', 'Compare to clean baseline', 'Visual inspection of header', 'Schedule cleaning if dP > 1.5 bar'] },
  { id: 'PM-008', equipment: 'Heat Exchanger HX-402', description: 'Gasket replacement', type: 'Replacement', frequency: 'Annual', lastDone: '2025-03-25', nextDue: '2026-03-25', day: 25, status: 'Scheduled', checklist: ['Isolate and depressurize', 'Remove old gaskets', 'Inspect flange faces', 'Install new gaskets', 'Torque to spec'] },
  { id: 'PM-009', equipment: 'Agitator AG-501', description: 'Gearbox oil change', type: 'Replacement', frequency: 'Semi-annual', lastDone: '2025-09-19', nextDue: '2026-03-19', day: 19, status: 'Scheduled', checklist: ['Drain gearbox oil', 'Inspect magnetic plug for debris', 'Fill with ISO-220 gear oil', 'Check oil level window'] },
  { id: 'PM-010', equipment: 'Conveyor CV-601', description: 'Belt alignment check', type: 'Inspection', frequency: 'Monthly', lastDone: '2026-02-05', nextDue: '2026-03-05', day: 5, status: 'Completed', checklist: ['Check belt tracking', 'Inspect rollers', 'Verify tension', 'Inspect for wear/damage'] },
  { id: 'PM-011', equipment: 'Blender BL-701', description: 'Blade wear inspection', type: 'Inspection', frequency: 'Monthly', lastDone: '2026-02-21', nextDue: '2026-03-21', day: 21, status: 'Scheduled', checklist: ['Inspect blade edges', 'Measure blade thickness', 'Check discharge valve', 'Lubricate bearings'] },
  { id: 'PM-012', equipment: 'Centrifuge CF-801', description: 'Bearing lubrication', type: 'Lubrication', frequency: 'Monthly', lastDone: '2026-02-12', nextDue: '2026-03-12', day: 12, status: 'Scheduled', checklist: ['Apply grease to main bearings', 'Check for abnormal noise', 'Verify temperature post-lube'] },
  { id: 'PM-013', equipment: 'Dryer DR-901', description: 'Drive chain lubrication', type: 'Lubrication', frequency: 'Weekly', lastDone: '2026-03-05', nextDue: '2026-03-12', day: 12, status: 'Scheduled', checklist: ['Clean chain', 'Apply chain lubricant', 'Check tension', 'Inspect sprockets'] },
  { id: 'PM-014', equipment: 'Filter FL-1001', description: 'Differential pressure transmitter cal', type: 'Calibration', frequency: 'Quarterly', lastDone: '2025-12-16', nextDue: '2026-03-16', day: 16, status: 'Scheduled', checklist: ['Apply zero and span checks', 'Record as-found values', 'Adjust if deviation > 0.5%', 'Document as-left values'] },
  { id: 'PM-015', equipment: 'Valve V-1101', description: 'Stroke test & calibration', type: 'Calibration', frequency: 'Quarterly', lastDone: '2025-12-15', nextDue: '2026-03-15', day: 15, status: 'Scheduled', checklist: ['Full stroke open/close', 'Check response time', 'Calibrate positioner 4-20mA', 'Check air supply'] },
  { id: 'PM-016', equipment: 'Motor M-1201', description: 'Thermography scan', type: 'Inspection', frequency: 'Quarterly', lastDone: '2025-12-10', nextDue: '2026-03-10', day: 10, status: 'Overdue', checklist: ['Scan motor terminals', 'Scan cable connections', 'Scan VFD if applicable', 'Document thermal images'] },
  { id: 'PM-017', equipment: 'Reactor R-101', description: 'Agitator seal lubrication', type: 'Lubrication', frequency: 'Monthly', lastDone: '2026-02-07', nextDue: '2026-03-07', day: 7, status: 'Completed', checklist: ['Apply barrier fluid', 'Check seal flush rate', 'Verify pressure'] },
  { id: 'PM-018', equipment: 'Pump P-201', description: 'Coupling alignment check', type: 'Inspection', frequency: 'Quarterly', lastDone: '2025-12-13', nextDue: '2026-03-13', day: 13, status: 'Scheduled', checklist: ['Mount dial indicator', 'Check angular misalignment', 'Check parallel misalignment', 'Shim if > 0.05mm'] },
  { id: 'PM-019', equipment: 'Compressor C-301', description: 'Air filter replacement', type: 'Replacement', frequency: 'Monthly', lastDone: '2026-02-28', nextDue: '2026-03-28', day: 28, status: 'Scheduled', checklist: ['Remove old filter', 'Inspect housing', 'Install new filter', 'Reset hour counter'] },
  { id: 'PM-020', equipment: 'Centrifuge CF-801', description: 'Temperature sensor calibration', type: 'Calibration', frequency: 'Semi-annual', lastDone: '2025-09-24', nextDue: '2026-03-24', day: 24, status: 'Scheduled', checklist: ['Compare to reference thermometer', 'Check at 3 points', 'Adjust offset if needed', 'Document results'] },
];

// ── Calendar Helpers ────────────────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function PmSchedulePage() {
  const [year] = useState(2026);
  const [month] = useState(2); // March (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<PmTask | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // Tasks grouped by day
  const tasksByDay = useMemo(() => {
    const map: Record<number, PmTask[]> = {};
    pmTasks.forEach((t) => {
      if (!map[t.day]) map[t.day] = [];
      map[t.day].push(t);
    });
    return map;
  }, []);

  const dayTasks = selectedDay ? tasksByDay[selectedDay] || [] : [];

  // PM Compliance
  const completed = pmTasks.filter((t) => t.status === 'Completed').length;
  const overdue = pmTasks.filter((t) => t.status === 'Overdue').length;
  const compliance = Math.round(((completed) / (completed + overdue || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarClock size={24} className="text-nexaproc-amber" />
        <h1 className="text-2xl font-bold text-white">Preventive Maintenance Schedule</h1>
      </div>

      {/* PM Compliance KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPICard
          title="PM Compliance"
          value={`${compliance}`}
          unit="%"
          trend="up"
          trendValue={2.1}
          icon={<CheckCircle2 size={22} />}
          color="#4ade80"
        />
        <div className="rounded-lg border border-scada-border bg-scada-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-status-maintenance/10 flex items-center justify-center">
            <CalendarClock size={20} className="text-status-maintenance" />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase">Total Tasks</p>
            <p className="text-xl font-bold text-white">{pmTasks.length}</p>
          </div>
        </div>
        <div className="rounded-lg border border-scada-border bg-scada-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-status-running/10 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-status-running" />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase">Completed</p>
            <p className="text-xl font-bold text-status-running">{completed}</p>
          </div>
        </div>
        <div className="rounded-lg border border-scada-border bg-scada-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-status-fault/10 flex items-center justify-center">
            <Clock size={20} className="text-status-fault" />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase">Overdue</p>
            <p className="text-xl font-bold text-status-fault">{overdue}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {(Object.entries(typeConfig) as [PmType, typeof typeConfig[PmType]][]).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={clsx('w-2.5 h-2.5 rounded-full', cfg.dotColor)} />
            <span className="text-[11px] text-white/50">{type}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card
            title={`${MONTH_NAMES[month]} ${year}`}
            subtitle="Click a day to see scheduled tasks"
          >
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-white/30 uppercase py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} className="h-20" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const tasks = tasksByDay[day] || [];
                const isToday = day === 12; // March 12 2026
                const isSelected = day === selectedDay;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={clsx(
                      'h-20 rounded-lg border p-1.5 cursor-pointer transition-all',
                      isSelected
                        ? 'border-nexaproc-amber/60 bg-nexaproc-amber/5'
                        : isToday
                        ? 'border-nexaproc-green/40 bg-nexaproc-green/5'
                        : 'border-scada-border/50 hover:border-scada-border-hover bg-scada-dark/20',
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={clsx(
                          'text-[11px] font-mono',
                          isToday ? 'text-nexaproc-green font-bold' : 'text-white/50',
                        )}
                      >
                        {day}
                      </span>
                      {isToday && (
                        <span className="text-[8px] font-bold text-nexaproc-green bg-nexaproc-green/10 rounded px-1">
                          TODAY
                        </span>
                      )}
                    </div>
                    {/* Task dots/pills */}
                    <div className="flex flex-wrap gap-0.5">
                      {tasks.map((t) => {
                        const cfg = typeConfig[t.type];
                        return (
                          <div
                            key={t.id}
                            className={clsx(
                              'rounded-full px-1.5 py-0 text-[8px] font-bold truncate max-w-full',
                              cfg.bgColor,
                              cfg.color,
                              t.status === 'Overdue' && 'ring-1 ring-status-fault/50',
                              t.status === 'Completed' && 'opacity-50',
                            )}
                            title={`${t.equipment}: ${t.description}`}
                          >
                            {t.equipment.split(' ')[1] || t.equipment.slice(0, 6)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Task Detail Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Day Task List */}
          <Card
            title={selectedDay ? `March ${selectedDay}, ${year}` : 'Select a Day'}
            subtitle={selectedDay ? `${dayTasks.length} task(s) scheduled` : 'Click a calendar day'}
          >
            {dayTasks.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-8">
                {selectedDay ? 'No tasks on this day' : 'Select a day to view tasks'}
              </p>
            ) : (
              <div className="space-y-2">
                {dayTasks.map((task) => {
                  const cfg = typeConfig[task.type];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={clsx(
                        'rounded-lg border p-3 cursor-pointer transition-all hover:brightness-110',
                        cfg.borderColor,
                        selectedTask?.id === task.id ? cfg.bgColor : 'bg-scada-dark/40',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={14} className={cfg.color} />
                        <span className="text-xs font-bold text-white">{task.equipment}</span>
                        {task.status === 'Completed' && <CheckCircle2 size={12} className="text-status-running" />}
                        {task.status === 'Overdue' && <Clock size={12} className="text-status-fault" />}
                      </div>
                      <p className="text-[11px] text-white/50">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={task.status === 'Completed' ? 'success' : task.status === 'Overdue' ? 'danger' : 'info'}>
                          {task.status}
                        </Badge>
                        <Badge variant={task.type === 'Inspection' ? 'info' : task.type === 'Lubrication' ? 'success' : task.type === 'Replacement' ? 'warning' : 'neutral'}>
                          {task.type}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Selected Task Detail */}
          {selectedTask && (
            <Card title={`${selectedTask.id} — Details`}>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-white/40 uppercase mb-0.5">Equipment</p>
                    <p className="text-white font-semibold">{selectedTask.equipment}</p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase mb-0.5">Type</p>
                    <Badge variant={selectedTask.type === 'Inspection' ? 'info' : selectedTask.type === 'Lubrication' ? 'success' : selectedTask.type === 'Replacement' ? 'warning' : 'neutral'}>
                      {selectedTask.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase mb-0.5">Frequency</p>
                    <p className="text-white">{selectedTask.frequency}</p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase mb-0.5">Status</p>
                    <Badge variant={selectedTask.status === 'Completed' ? 'success' : selectedTask.status === 'Overdue' ? 'danger' : 'info'}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase mb-0.5">Last Done</p>
                    <p className="text-white font-mono">{selectedTask.lastDone}</p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase mb-0.5">Next Due</p>
                    <p className="text-white font-mono">{selectedTask.nextDue}</p>
                  </div>
                </div>

                <div>
                  <p className="text-white/40 uppercase mb-0.5">Description</p>
                  <p className="text-white/70">{selectedTask.description}</p>
                </div>

                <div>
                  <p className="text-white/40 uppercase mb-2">Checklist</p>
                  <div className="space-y-1">
                    {selectedTask.checklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className={clsx(
                          'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5',
                          selectedTask.status === 'Completed'
                            ? 'border-status-running/50 bg-status-running/10'
                            : 'border-scada-border',
                        )}>
                          {selectedTask.status === 'Completed' && (
                            <CheckCircle2 size={10} className="text-status-running" />
                          )}
                        </div>
                        <span className={clsx(
                          'text-[11px]',
                          selectedTask.status === 'Completed' ? 'text-white/40 line-through' : 'text-white/70',
                        )}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
