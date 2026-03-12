import { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Plus,
  Filter,
  Calendar,
  User,
  Wrench,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

// ── Types ───────────────────────────────────────────────────────────────────
type WoStatus = 'Open' | 'In Progress' | 'Waiting Parts' | 'Completed';
type WoType = 'Corrective' | 'Preventive' | 'Predictive';
type WoPriority = 'Critical' | 'High' | 'Medium' | 'Low';

interface WorkOrder {
  id: string;
  equipment: string;
  description: string;
  type: WoType;
  priority: WoPriority;
  assignee: string;
  dueDate: string;
  status: WoStatus;
  partsNeeded: string[];
  laborHours: number;
  history: string[];
}

// ── Mock Work Orders ────────────────────────────────────────────────────────
const allWorkOrders: WorkOrder[] = [
  { id: 'WO-2026-001', equipment: 'Pump P-201', description: 'Replace main shaft bearing — excessive vibration detected by online monitoring system.', type: 'Corrective', priority: 'Critical', assignee: 'J. Martinez', dueDate: '2026-03-13', status: 'In Progress', partsNeeded: ['Bearing SKF-6208', 'Mechanical Seal CR-102', 'Gasket Set P-201G'], laborHours: 6.5, history: ['Created 2026-03-10 by M. Thompson', 'Assigned to J. Martinez 2026-03-10', 'Parts ordered 2026-03-11', 'Work started 2026-03-12'] },
  { id: 'WO-2026-002', equipment: 'Compressor C-301', description: 'Belt tension adjustment and alignment check. Squealing noise on startup.', type: 'Corrective', priority: 'High', assignee: 'S. Chen', dueDate: '2026-03-14', status: 'Open', partsNeeded: ['V-Belt B-68'], laborHours: 2.0, history: ['Created 2026-03-11 by K. Nakamura'] },
  { id: 'WO-2026-003', equipment: 'Reactor R-101', description: 'Quarterly pressure transmitter calibration per PM schedule.', type: 'Preventive', priority: 'Medium', assignee: 'R. Johnson', dueDate: '2026-03-18', status: 'Open', partsNeeded: [], laborHours: 1.5, history: ['Auto-generated from PM schedule'] },
  { id: 'WO-2026-004', equipment: 'Heat Exchanger HX-402', description: 'Inspect tube bundle for fouling. Performance degradation observed.', type: 'Predictive', priority: 'High', assignee: 'A. Patel', dueDate: '2026-03-15', status: 'Waiting Parts', partsNeeded: ['Tube Gasket Set HX-402G', 'Cleaning Chemical CL-50'], laborHours: 8.0, history: ['Created 2026-03-09 from AI anomaly alert', 'Parts on order — ETA 2026-03-14'] },
  { id: 'WO-2026-005', equipment: 'Dryer DR-901', description: 'Lubricate drive chain and check tension. Routine PM task.', type: 'Preventive', priority: 'Low', assignee: 'L. Garcia', dueDate: '2026-03-16', status: 'Open', partsNeeded: ['Chain Lube CL-100'], laborHours: 1.0, history: ['Auto-generated from PM schedule'] },
  { id: 'WO-2026-006', equipment: 'Conveyor CV-601', description: 'Motor replacement — motor burned out during night shift.', type: 'Corrective', priority: 'Critical', assignee: 'J. Martinez', dueDate: '2026-03-13', status: 'Waiting Parts', partsNeeded: ['Motor ABB-M3AA-5.5kW', 'Coupling Insert CR-10'], laborHours: 4.0, history: ['Created 2026-03-12 emergency', 'Motor on express order — ETA 2026-03-13'] },
  { id: 'WO-2026-007', equipment: 'Agitator AG-501', description: 'Gearbox oil change — 2000-hour service interval reached.', type: 'Preventive', priority: 'Medium', assignee: 'S. Chen', dueDate: '2026-03-19', status: 'Open', partsNeeded: ['Gearbox Oil ISO-220 (20L)'], laborHours: 2.0, history: ['Auto-generated from PM schedule'] },
  { id: 'WO-2026-008', equipment: 'Filter FL-1001', description: 'Replace filter cartridges — differential pressure alarm triggered.', type: 'Corrective', priority: 'High', assignee: 'R. Johnson', dueDate: '2026-03-14', status: 'In Progress', partsNeeded: ['Filter Cartridge FC-10 x6'], laborHours: 1.5, history: ['Created 2026-03-11 from alarm', 'Work started 2026-03-12'] },
  { id: 'WO-2026-009', equipment: 'Reactor R-102', description: 'Annual safety valve testing and certification.', type: 'Preventive', priority: 'High', assignee: 'A. Patel', dueDate: '2026-03-20', status: 'Open', partsNeeded: [], laborHours: 3.0, history: ['Auto-generated from PM schedule'] },
  { id: 'WO-2026-010', equipment: 'Centrifuge CF-801', description: 'Vibration trending shows gradual increase — predictive bearing check.', type: 'Predictive', priority: 'Medium', assignee: 'K. Nakamura', dueDate: '2026-03-17', status: 'In Progress', partsNeeded: [], laborHours: 2.0, history: ['Created 2026-03-10 from predictive analytics', 'Work started 2026-03-12'] },
  { id: 'WO-2026-011', equipment: 'Pump P-202', description: 'Seal replacement — minor leak detected during rounds.', type: 'Corrective', priority: 'Medium', assignee: 'L. Garcia', dueDate: '2026-03-16', status: 'Waiting Parts', partsNeeded: ['Mechanical Seal CR-102'], laborHours: 3.0, history: ['Created 2026-03-11 by operator rounds'] },
  { id: 'WO-2026-012', equipment: 'Blender BL-701', description: 'Monthly inspection — check blade wear and discharge valve.', type: 'Preventive', priority: 'Low', assignee: 'J. Martinez', dueDate: '2026-03-21', status: 'Completed', partsNeeded: [], laborHours: 1.0, history: ['Completed 2026-03-11 by J. Martinez'] },
  { id: 'WO-2026-013', equipment: 'Motor M-1201', description: 'Thermography scan — quarterly electrical inspection.', type: 'Preventive', priority: 'Low', assignee: 'S. Chen', dueDate: '2026-03-22', status: 'Completed', partsNeeded: [], laborHours: 0.5, history: ['Completed 2026-03-10 by S. Chen'] },
  { id: 'WO-2026-014', equipment: 'Valve V-1101', description: 'Actuator stroke test and calibration.', type: 'Preventive', priority: 'Medium', assignee: 'R. Johnson', dueDate: '2026-03-15', status: 'Completed', partsNeeded: [], laborHours: 1.0, history: ['Completed 2026-03-12 by R. Johnson'] },
  { id: 'WO-2026-015', equipment: 'Compressor C-302', description: 'Oil analysis revealed elevated iron content — inspect internals.', type: 'Predictive', priority: 'High', assignee: 'A. Patel', dueDate: '2026-03-14', status: 'Open', partsNeeded: [], laborHours: 4.0, history: ['Created 2026-03-12 from oil analysis results'] },
];

// ── Config ──────────────────────────────────────────────────────────────────
const statusColumns: WoStatus[] = ['Open', 'In Progress', 'Waiting Parts', 'Completed'];

const statusBg: Record<WoStatus, string> = {
  Open: 'border-status-maintenance/30',
  'In Progress': 'border-nexaproc-amber/30',
  'Waiting Parts': 'border-status-warning/30',
  Completed: 'border-status-running/30',
};

const statusHeadBg: Record<WoStatus, string> = {
  Open: 'bg-status-maintenance/10',
  'In Progress': 'bg-nexaproc-amber/10',
  'Waiting Parts': 'bg-status-warning/10',
  Completed: 'bg-status-running/10',
};

const statusHeadText: Record<WoStatus, string> = {
  Open: 'text-status-maintenance',
  'In Progress': 'text-nexaproc-amber',
  'Waiting Parts': 'text-status-warning',
  Completed: 'text-status-running',
};

const typeBadge: Record<WoType, 'info' | 'success' | 'warning'> = {
  Corrective: 'info',
  Preventive: 'success',
  Predictive: 'warning',
};

const priorityBadge: Record<WoPriority, 'critical' | 'high' | 'medium' | 'low'> = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
};

const assignees = [
  { value: '', label: 'All Assignees' },
  { value: 'J. Martinez', label: 'J. Martinez' },
  { value: 'S. Chen', label: 'S. Chen' },
  { value: 'R. Johnson', label: 'R. Johnson' },
  { value: 'A. Patel', label: 'A. Patel' },
  { value: 'K. Nakamura', label: 'K. Nakamura' },
  { value: 'L. Garcia', label: 'L. Garcia' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'Corrective', label: 'Corrective' },
  { value: 'Preventive', label: 'Preventive' },
  { value: 'Predictive', label: 'Predictive' },
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'Critical', label: 'Critical' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

export default function WorkOrdersPage() {
  const [selectedWo, setSelectedWo] = useState<WorkOrder | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');

  const filtered = useMemo(() => {
    return allWorkOrders.filter((wo) => {
      if (filterType && wo.type !== filterType) return false;
      if (filterPriority && wo.priority !== filterPriority) return false;
      if (filterAssignee && wo.assignee !== filterAssignee) return false;
      return true;
    });
  }, [filterType, filterPriority, filterAssignee]);

  const byStatus = useMemo(() => {
    const map: Record<WoStatus, WorkOrder[]> = { Open: [], 'In Progress': [], 'Waiting Parts': [], Completed: [] };
    filtered.forEach((wo) => map[wo.status].push(wo));
    return map;
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={24} className="text-nexaproc-amber" />
          <h1 className="text-2xl font-bold text-white">Work Orders</h1>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowCreate(true)}>
          Create Work Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <Filter size={16} className="text-white/30 mb-2" />
        <Select options={typeOptions} value={filterType} onChange={setFilterType} label="Type" className="w-40" />
        <Select options={priorityOptions} value={filterPriority} onChange={setFilterPriority} label="Priority" className="w-40" />
        <Select options={assignees} value={filterAssignee} onChange={setFilterAssignee} label="Assignee" className="w-44" />
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusColumns.map((status) => (
          <div key={status} className="flex flex-col">
            {/* Column Header */}
            <div className={clsx('rounded-t-lg px-4 py-2.5 flex items-center justify-between', statusHeadBg[status])}>
              <span className={clsx('text-xs font-bold uppercase tracking-wider', statusHeadText[status])}>
                {status}
              </span>
              <span className={clsx('text-xs font-mono', statusHeadText[status])}>
                {byStatus[status].length}
              </span>
            </div>

            {/* Cards */}
            <div className={clsx('border border-t-0 rounded-b-lg p-2 space-y-2 min-h-[200px] bg-scada-dark/40', statusBg[status])}>
              {byStatus[status].length === 0 && (
                <p className="text-[11px] text-white/20 text-center py-8">No work orders</p>
              )}
              {byStatus[status].map((wo) => (
                <div
                  key={wo.id}
                  onClick={() => setSelectedWo(wo)}
                  className="rounded-lg border border-scada-border bg-scada-panel p-3 cursor-pointer hover:border-scada-border-hover transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-nexaproc-amber">{wo.id}</span>
                    <Badge variant={priorityBadge[wo.priority]}>{wo.priority}</Badge>
                  </div>
                  <p className="text-xs font-semibold text-white/80 mb-1 truncate">{wo.equipment}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <Badge variant={typeBadge[wo.type]}>{wo.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/30">
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      {wo.assignee}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {wo.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!selectedWo}
        onClose={() => setSelectedWo(null)}
        title={`${selectedWo?.id ?? ''} — ${selectedWo?.equipment ?? ''}`}
        size="lg"
      >
        {selectedWo && (
          <div className="space-y-5">
            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-white/40 uppercase mb-0.5">Type</p>
                <Badge variant={typeBadge[selectedWo.type]}>{selectedWo.type}</Badge>
              </div>
              <div>
                <p className="text-white/40 uppercase mb-0.5">Priority</p>
                <Badge variant={priorityBadge[selectedWo.priority]}>{selectedWo.priority}</Badge>
              </div>
              <div>
                <p className="text-white/40 uppercase mb-0.5">Assignee</p>
                <p className="text-white">{selectedWo.assignee}</p>
              </div>
              <div>
                <p className="text-white/40 uppercase mb-0.5">Due Date</p>
                <p className="font-mono text-white">{selectedWo.dueDate}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-xs text-white/70 leading-relaxed">{selectedWo.description}</p>
            </div>

            {/* Parts Needed */}
            <div>
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Parts Needed</h4>
              {selectedWo.partsNeeded.length === 0 ? (
                <p className="text-xs text-white/30 italic">No parts required</p>
              ) : (
                <ul className="space-y-1">
                  {selectedWo.partsNeeded.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/60">
                      <Wrench size={10} className="text-nexaproc-amber" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Labor Hours */}
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-white/40" />
              <span className="text-xs text-white/60">Estimated labor:</span>
              <span className="text-xs font-mono font-bold text-white">{selectedWo.laborHours} hrs</span>
            </div>

            {/* History */}
            <div>
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">History</h4>
              <div className="space-y-1.5">
                {selectedWo.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-nexaproc-green/50 mt-1.5 flex-shrink-0" />
                    <p className="text-[11px] text-white/50">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Work Order Modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Work Order"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreate(false)}>Create</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Equipment" placeholder="e.g. Pump P-201" />
          <Input label="Description" placeholder="Describe the work to be done..." />
          <div className="grid grid-cols-2 gap-4">
            <Select
              options={typeOptions.filter((o) => o.value !== '')}
              value="Corrective"
              onChange={() => {}}
              label="Type"
            />
            <Select
              options={priorityOptions.filter((o) => o.value !== '')}
              value="Medium"
              onChange={() => {}}
              label="Priority"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              options={assignees.filter((o) => o.value !== '')}
              value="J. Martinez"
              onChange={() => {}}
              label="Assignee"
            />
            <Input label="Due Date" type="date" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
