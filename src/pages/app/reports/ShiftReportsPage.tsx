import React, { useState } from 'react';
import {
  Clock,
  User,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Send,
  FileText,
  Activity,
  Gauge,
  Timer,
} from 'lucide-react';

import { Card, Badge, Button } from '@/components/ui';
import { KPICard } from '@/components/scada';

/* ---------- Mock Data ---------- */

interface PendingAction {
  id: string;
  text: string;
  checked: boolean;
}

interface EquipmentChange {
  time: string;
  equipment: string;
  fromStatus: string;
  toStatus: string;
  reason: string;
}

interface PreviousShift {
  id: string;
  shift: string;
  date: string;
  operator: string;
  production: number;
  quality: string;
  status: 'Submitted' | 'Draft';
}

const equipmentChanges: EquipmentChange[] = [
  { time: '06:15', equipment: 'Pump P-102', fromStatus: 'Stopped', toStatus: 'Running', reason: 'Shift startup' },
  { time: '07:30', equipment: 'Compressor C-301', fromStatus: 'Running', toStatus: 'Maintenance', reason: 'Scheduled maintenance' },
  { time: '07:45', equipment: 'Compressor C-302', fromStatus: 'Standby', toStatus: 'Running', reason: 'Backup activated' },
  { time: '08:20', equipment: 'Motor M-105', fromStatus: 'Running', toStatus: 'Warning', reason: 'Vibration alarm triggered' },
  { time: '09:00', equipment: 'Motor M-105', fromStatus: 'Warning', toStatus: 'Running', reason: 'Vibration normalized' },
];

const previousShifts: PreviousShift[] = [
  { id: 'PS1', shift: 'Shift C', date: '11 Mar 22:00 - 12 Mar 06:00', operator: 'Raj Patel', production: 412, quality: '96.1%', status: 'Submitted' },
  { id: 'PS2', shift: 'Shift B', date: '11 Mar 14:00 - 22:00', operator: 'Priya Singh', production: 438, quality: '95.8%', status: 'Submitted' },
  { id: 'PS3', shift: 'Shift A', date: '11 Mar 06:00 - 14:00', operator: 'John Smith', production: 451, quality: '97.2%', status: 'Submitted' },
  { id: 'PS4', shift: 'Shift C', date: '10 Mar 22:00 - 11 Mar 06:00', operator: 'Raj Patel', production: 405, quality: '95.5%', status: 'Submitted' },
  { id: 'PS5', shift: 'Shift B', date: '10 Mar 14:00 - 22:00', operator: 'Priya Singh', production: 445, quality: '96.4%', status: 'Submitted' },
];

/* ---------- Component ---------- */

export default function ShiftReportsPage() {
  const [notes, setNotes] = useState(
    'All processes running within normal parameters. Minor vibration alarm on Motor M-105 at 08:20, resolved within 40 minutes. Compressor C-301 taken offline for scheduled maintenance, backup C-302 activated.',
  );
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([
    { id: 'PA1', text: 'Monitor Motor M-105 vibration levels closely', checked: false },
    { id: 'PA2', text: 'Follow up on Compressor C-301 maintenance ETA', checked: false },
    { id: 'PA3', text: 'Check cooling water chemistry results', checked: true },
    { id: 'PA4', text: 'Calibrate flow transmitter FT-205', checked: false },
  ]);
  const [newAction, setNewAction] = useState('');

  const toggleAction = (id: string) => {
    setPendingActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a)),
    );
  };

  const addAction = () => {
    if (!newAction.trim()) return;
    setPendingActions((prev) => [
      ...prev,
      { id: `PA-${Date.now()}`, text: newAction.trim(), checked: false },
    ]);
    setNewAction('');
  };

  const completedActions = pendingActions.filter((a) => a.checked).length;

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">Shift Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Shift handover documentation and history
            </p>
          </div>
        </div>
        <Button size="sm" icon={<Send className="w-4 h-4" />}>
          Submit Handover
        </Button>
      </div>

      {/* Current Shift Banner */}
      <div className="rounded-xl border border-nexaproc-amber/30 bg-nexaproc-amber/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-nexaproc-amber/15 flex items-center justify-center">
              <Clock className="w-6 h-6 text-nexaproc-amber" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Shift A</h2>
                <Badge variant="success" dot pulse>Active</Badge>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">06:00 - 14:00 IST</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Operator</p>
                <p className="text-sm text-white font-medium">John Smith</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Elapsed</p>
                <p className="text-sm text-white font-medium">2 hrs 15 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shift KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Production Count"
          value={187}
          unit="units"
          trend="up"
          trendValue={4.2}
          icon={<BarChart3 className="w-6 h-6" />}
          color="#4ade80"
        />
        <KPICard
          title="Quality Rate"
          value="97.5"
          unit="%"
          trend="up"
          trendValue={1.3}
          icon={<Gauge className="w-6 h-6" />}
          color="#fbbf24"
        />
        <KPICard
          title="Downtime"
          value="0.3"
          unit="hrs"
          trend="down"
          trendValue={60.0}
          icon={<Timer className="w-6 h-6" />}
          color="#0d9488"
        />
        <KPICard
          title="Alarms Handled"
          value={3}
          unit=""
          trend="down"
          trendValue={25.0}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="#f97316"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Events / Notes */}
        <Card title="Key Events During Shift" subtitle="Editable shift notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-scada-border bg-scada-dark/50 px-4 py-3 text-sm text-white/80 placeholder-white/30 outline-none transition-colors focus:border-nexaproc-amber/50 focus:ring-1 focus:ring-nexaproc-amber/30 resize-none"
            placeholder="Enter key events, observations, and notes for this shift..."
          />
          <p className="text-xs text-gray-600 mt-2">{notes.length} characters</p>
        </Card>

        {/* Pending Actions */}
        <Card
          title="Pending Actions for Next Shift"
          subtitle={`${completedActions}/${pendingActions.length} completed`}
        >
          <div className="space-y-2 mb-4">
            {pendingActions.map((action) => (
              <label
                key={action.id}
                className="flex items-start gap-3 rounded-lg bg-white/5 px-3 py-2.5 cursor-pointer hover:bg-white/8 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={action.checked}
                  onChange={() => toggleAction(action.id)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-scada-dark text-nexaproc-amber focus:ring-nexaproc-amber/30"
                />
                <span
                  className={`text-sm flex-1 ${
                    action.checked ? 'text-gray-500 line-through' : 'text-white/80'
                  }`}
                >
                  {action.text}
                </span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addAction()}
              placeholder="Add new action item..."
              className="flex-1 rounded-lg border border-scada-border bg-scada-dark/50 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-nexaproc-amber/50"
            />
            <Button size="sm" variant="secondary" onClick={addAction} icon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          </div>
        </Card>
      </div>

      {/* Equipment Status Changes */}
      <Card title="Equipment Status Changes" subtitle="Changes during current shift">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Time</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Equipment</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">From</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">To</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Reason</th>
              </tr>
            </thead>
            <tbody>
              {equipmentChanges.map((change, idx) => (
                <tr key={idx} className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors">
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{change.time}</td>
                  <td className="px-4 py-3 text-white/80 font-medium">{change.equipment}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        change.fromStatus === 'Running' ? 'success' :
                        change.fromStatus === 'Warning' ? 'warning' :
                        change.fromStatus === 'Stopped' ? 'neutral' : 'info'
                      }
                    >
                      {change.fromStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        change.toStatus === 'Running' ? 'success' :
                        change.toStatus === 'Warning' ? 'warning' :
                        change.toStatus === 'Maintenance' ? 'info' : 'neutral'
                      }
                    >
                      {change.toStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{change.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Previous Shift Reports */}
      <Card title="Previous Shift Reports" subtitle="Last 5 shift handover reports">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Shift</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Date/Time</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Operator</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Production</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Quality</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Action</th>
              </tr>
            </thead>
            <tbody>
              {previousShifts.map((ps) => (
                <tr key={ps.id} className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors">
                  <td className="px-4 py-3 text-white/80 font-medium">{ps.shift}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{ps.date}</td>
                  <td className="px-4 py-3 text-gray-400">{ps.operator}</td>
                  <td className="px-4 py-3 text-white/80 font-mono">{ps.production} units</td>
                  <td className="px-4 py-3 text-status-running font-mono">{ps.quality}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ps.status === 'Submitted' ? 'success' : 'warning'}>
                      {ps.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button className="inline-flex items-center gap-1 text-xs text-nexaproc-amber hover:text-nexaproc-amber/80 transition-colors">
                      <FileText className="w-3 h-3" /> View
                    </button>
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
