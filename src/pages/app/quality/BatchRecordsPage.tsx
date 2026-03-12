import { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  PenLine,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

// ── Types ───────────────────────────────────────────────────────────────────
interface BatchRecord {
  id: string;
  recipe: string;
  product: string;
  startTime: string;
  endTime: string;
  status: 'Complete' | 'In Review' | 'Approved' | 'Rejected';
  operator: string;
  yield: number;
}

interface BatchPhase {
  name: string;
  duration: string;
  status: 'Complete' | 'Running' | 'Pending';
}

interface CriticalParam {
  parameter: string;
  setpoint: number;
  actual: number;
  deviation: number;
  unit: string;
  withinSpec: boolean;
}

// ── Mock Data ───────────────────────────────────────────────────────────────
const batchRecords: BatchRecord[] = [
  { id: 'B-2026-001', recipe: 'RX-POLY-A3', product: 'Polyethylene Resin Grade A', startTime: '2026-03-10 06:00', endTime: '2026-03-10 14:32', status: 'Approved', operator: 'J. Martinez', yield: 98.4 },
  { id: 'B-2026-002', recipe: 'RX-POLY-B1', product: 'Polyethylene Resin Grade B', startTime: '2026-03-10 08:15', endTime: '2026-03-10 16:48', status: 'Complete', operator: 'S. Chen', yield: 97.1 },
  { id: 'B-2026-003', recipe: 'RX-CATA-01', product: 'Catalyst Blend C-12', startTime: '2026-03-10 10:00', endTime: '2026-03-10 18:20', status: 'In Review', operator: 'M. Thompson', yield: 95.8 },
  { id: 'B-2026-004', recipe: 'RX-SOLV-D2', product: 'Solvent Recovery D', startTime: '2026-03-10 14:00', endTime: '2026-03-10 22:15', status: 'Rejected', operator: 'A. Patel', yield: 89.2 },
  { id: 'B-2026-005', recipe: 'RX-POLY-A3', product: 'Polyethylene Resin Grade A', startTime: '2026-03-11 06:00', endTime: '2026-03-11 14:10', status: 'Approved', operator: 'J. Martinez', yield: 99.1 },
  { id: 'B-2026-006', recipe: 'RX-EMUL-E1', product: 'Emulsion Polymer E-1', startTime: '2026-03-11 07:30', endTime: '2026-03-11 15:45', status: 'In Review', operator: 'K. Nakamura', yield: 96.5 },
  { id: 'B-2026-007', recipe: 'RX-CATA-01', product: 'Catalyst Blend C-12', startTime: '2026-03-11 10:00', endTime: '2026-03-11 18:30', status: 'Complete', operator: 'R. Johnson', yield: 97.8 },
  { id: 'B-2026-008', recipe: 'RX-ADDI-F3', product: 'Additive Compound F-3', startTime: '2026-03-11 12:00', endTime: '2026-03-11 19:55', status: 'Approved', operator: 'S. Chen', yield: 98.9 },
  { id: 'B-2026-009', recipe: 'RX-POLY-B1', product: 'Polyethylene Resin Grade B', startTime: '2026-03-12 06:00', endTime: '2026-03-12 14:20', status: 'In Review', operator: 'L. Garcia', yield: 94.7 },
  { id: 'B-2026-010', recipe: 'RX-SOLV-D2', product: 'Solvent Recovery D', startTime: '2026-03-12 08:00', endTime: '2026-03-12 16:40', status: 'Complete', operator: 'A. Patel', yield: 96.3 },
];

const statusVariant: Record<BatchRecord['status'], 'success' | 'warning' | 'info' | 'danger'> = {
  Complete: 'info',
  'In Review': 'warning',
  Approved: 'success',
  Rejected: 'danger',
};

// Detail mock data
const batchPhases: BatchPhase[] = [
  { name: 'Charge Raw Materials', duration: '45 min', status: 'Complete' },
  { name: 'Heat to Reaction Temp', duration: '30 min', status: 'Complete' },
  { name: 'Reaction Hold', duration: '4 hrs 15 min', status: 'Complete' },
  { name: 'Cooling & Quench', duration: '1 hr 20 min', status: 'Complete' },
  { name: 'Discharge & Transfer', duration: '35 min', status: 'Complete' },
  { name: 'CIP Cleaning', duration: '50 min', status: 'Complete' },
];

const criticalParams: CriticalParam[] = [
  { parameter: 'Reaction Temperature', setpoint: 185.0, actual: 184.7, deviation: -0.3, unit: '\u00B0C', withinSpec: true },
  { parameter: 'Reactor Pressure', setpoint: 12.5, actual: 12.6, deviation: 0.1, unit: 'bar', withinSpec: true },
  { parameter: 'Agitator Speed', setpoint: 450, actual: 448, deviation: -2, unit: 'RPM', withinSpec: true },
  { parameter: 'Feed Flow Rate', setpoint: 2.40, actual: 2.38, deviation: -0.02, unit: 'L/min', withinSpec: true },
  { parameter: 'pH Level', setpoint: 7.2, actual: 6.8, deviation: -0.4, unit: '', withinSpec: false },
  { parameter: 'Dissolved O2', setpoint: 0.5, actual: 0.48, deviation: -0.02, unit: 'ppm', withinSpec: true },
];

// ── Columns ─────────────────────────────────────────────────────────────────
const columns = [
  { key: 'id', header: 'Batch ID', sortable: true, render: (r: BatchRecord) => <span className="font-mono text-nexaproc-amber">{r.id}</span> },
  { key: 'recipe', header: 'Recipe', sortable: true },
  { key: 'product', header: 'Product', sortable: true },
  { key: 'startTime', header: 'Start Time', sortable: true, render: (r: BatchRecord) => <span className="font-mono text-xs">{r.startTime}</span> },
  { key: 'endTime', header: 'End Time', sortable: true, render: (r: BatchRecord) => <span className="font-mono text-xs">{r.endTime}</span> },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (r: BatchRecord) => (
      <Badge variant={statusVariant[r.status]} dot>
        {r.status}
      </Badge>
    ),
  },
  { key: 'operator', header: 'Operator', sortable: true },
  {
    key: 'yield',
    header: 'Yield (%)',
    sortable: true,
    render: (r: BatchRecord) => (
      <span className={`font-mono font-semibold ${r.yield >= 96 ? 'text-status-running' : r.yield >= 92 ? 'text-status-warning' : 'text-status-fault'}`}>
        {r.yield.toFixed(1)}%
      </span>
    ),
  },
];

export default function BatchRecordsPage() {
  const [selected, setSelected] = useState<BatchRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-nexaproc-amber" />
        <h1 className="text-2xl font-bold text-white">Electronic Batch Records</h1>
      </div>

      {/* FDA Compliance Banner */}
      <div className="flex items-center gap-3 rounded-lg border border-nexaproc-teal/30 bg-nexaproc-teal/5 px-4 py-3">
        <ShieldAlert size={20} className="text-nexaproc-teal flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-nexaproc-teal">FDA 21 CFR Part 11 Compliant</p>
          <p className="text-xs text-white/50">
            All batch records are electronically signed, audit-trailed, and tamper-evident per regulatory requirements.
          </p>
        </div>
      </div>

      {/* Batch Table */}
      <Card title="Batch Records" subtitle="Click a row to view details">
        <Table columns={columns} data={batchRecords} onRowClick={setSelected} />
      </Card>

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Batch ${selected?.id ?? ''} — ${selected?.product ?? ''}`}
        size="lg"
        footer={
          selected?.status === 'In Review' ? (
            <>
              <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => setSelected(null)}>
                Reject
              </Button>
              <Button variant="primary" size="sm" icon={<CheckCircle2 size={14} />} onClick={() => setSelected(null)}>
                Approve
              </Button>
            </>
          ) : undefined
        }
      >
        {selected && (
          <div className="space-y-6">
            {/* Overview Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-white/40 uppercase mb-0.5">Recipe</p>
                <p className="font-mono text-white">{selected.recipe}</p>
              </div>
              <div>
                <p className="text-white/40 uppercase mb-0.5">Operator</p>
                <p className="text-white">{selected.operator}</p>
              </div>
              <div>
                <p className="text-white/40 uppercase mb-0.5">Status</p>
                <Badge variant={statusVariant[selected.status]} dot>{selected.status}</Badge>
              </div>
              <div>
                <p className="text-white/40 uppercase mb-0.5">Yield</p>
                <p className="font-mono font-semibold text-nexaproc-green">{selected.yield.toFixed(1)}%</p>
              </div>
            </div>

            {/* Batch Timeline */}
            <div>
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Batch Timeline</h4>
              <div className="space-y-0">
                {batchPhases.map((phase, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {/* Timeline dot + connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        phase.status === 'Complete' ? 'border-nexaproc-green bg-nexaproc-green/30' :
                        phase.status === 'Running' ? 'border-nexaproc-amber bg-nexaproc-amber/30' :
                        'border-gray-600 bg-gray-600/30'
                      }`} />
                      {i < batchPhases.length - 1 && <div className="w-0.5 h-6 bg-scada-border" />}
                    </div>
                    <div className="flex-1 flex items-center justify-between py-1">
                      <span className="text-xs text-white/80">{phase.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40 font-mono">{phase.duration}</span>
                        {phase.status === 'Complete' && <CheckCircle2 size={12} className="text-nexaproc-green" />}
                        {phase.status === 'Running' && <Clock size={12} className="text-nexaproc-amber animate-pulse" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Parameters */}
            <div>
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Critical Parameters</h4>
              <div className="overflow-x-auto rounded-lg border border-scada-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-scada-border bg-scada-dark/60">
                      <th className="px-3 py-2 text-left text-white/50 uppercase">Parameter</th>
                      <th className="px-3 py-2 text-right text-white/50 uppercase">Setpoint</th>
                      <th className="px-3 py-2 text-right text-white/50 uppercase">Actual</th>
                      <th className="px-3 py-2 text-right text-white/50 uppercase">Deviation</th>
                      <th className="px-3 py-2 text-center text-white/50 uppercase">Spec</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalParams.map((p, i) => (
                      <tr key={i} className="border-b border-scada-border/50">
                        <td className="px-3 py-2 text-white/80">{p.parameter}</td>
                        <td className="px-3 py-2 text-right font-mono text-white/60">{p.setpoint} {p.unit}</td>
                        <td className="px-3 py-2 text-right font-mono text-white">{p.actual} {p.unit}</td>
                        <td className={`px-3 py-2 text-right font-mono ${Math.abs(p.deviation) > 0.3 ? 'text-alarm-critical' : 'text-white/50'}`}>
                          {p.deviation > 0 ? '+' : ''}{p.deviation} {p.unit}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {p.withinSpec ? (
                            <Badge variant="success">Pass</Badge>
                          ) : (
                            <Badge variant="danger">Fail</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Electronic Signatures */}
            <div>
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Electronic Signatures</h4>
              <div className="space-y-2">
                {[
                  { role: 'Operator', name: selected.operator, time: selected.endTime, signed: true },
                  { role: 'QA Reviewer', name: 'D. Williams', time: '2026-03-11 09:15', signed: selected.status === 'Approved' || selected.status === 'Rejected' },
                  { role: 'QA Approver', name: 'H. Rodriguez', time: '2026-03-11 10:30', signed: selected.status === 'Approved' },
                ].map((sig, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-scada-border/50 bg-scada-dark/40 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-white/30" />
                      <div>
                        <p className="text-xs text-white/80">{sig.role}</p>
                        <p className="text-[11px] text-white/40">{sig.name}</p>
                      </div>
                    </div>
                    {sig.signed ? (
                      <div className="flex items-center gap-1.5">
                        <PenLine size={12} className="text-nexaproc-green" />
                        <span className="text-[11px] font-mono text-white/40">{sig.time}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-white/30 italic">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
