import React, { useState } from 'react';
import clsx from 'clsx';
import { Shield, ShieldAlert, ShieldOff, AlertTriangle, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table } from '@/components/ui/Table';

type InterlockStatus = 'Active' | 'Bypassed' | 'Tripped';

interface Interlock {
  id: string;
  name: string;
  condition: string;
  status: InterlockStatus;
  tripCount: number;
  lastTripTime: string;
  equipment: string;
  priority: 'critical' | 'high' | 'medium';
}

const initialInterlocks: Interlock[] = [
  { id: 'ILK-001', name: 'High Temperature Trip R-101', condition: 'TT-101 > 75\u00b0C', status: 'Active', tripCount: 2, lastTripTime: '2026-03-10 14:22', equipment: 'R-101', priority: 'critical' },
  { id: 'ILK-002', name: 'Low Level Trip T-101', condition: 'LT-301 < 5%', status: 'Active', tripCount: 0, lastTripTime: 'Never', equipment: 'MV-101', priority: 'high' },
  { id: 'ILK-003', name: 'Emergency Shutdown', condition: 'ESD Button OR Smoke Detect', status: 'Active', tripCount: 1, lastTripTime: '2026-02-15 09:45', equipment: 'Plant-wide', priority: 'critical' },
  { id: 'ILK-004', name: 'High Pressure Trip Autoclave', condition: 'PT-302 > 2.5 bar', status: 'Tripped', tripCount: 3, lastTripTime: '2026-03-12 07:55', equipment: 'AC-201', priority: 'critical' },
  { id: 'ILK-005', name: 'Overspeed Trip Tablet Press', condition: 'ST-102 > 105 RPM', status: 'Active', tripCount: 1, lastTripTime: '2026-03-05 16:30', equipment: 'TP-101', priority: 'high' },
  { id: 'ILK-006', name: 'Loss of Flow \u2014 Spray Pump', condition: 'FT-101 < 1 L/min for 10s', status: 'Bypassed', tripCount: 5, lastTripTime: '2026-03-11 11:20', equipment: 'P-101', priority: 'medium' },
  { id: 'ILK-007', name: 'High pH Fermentation', condition: 'AT-101 > 5.5 pH', status: 'Active', tripCount: 0, lastTripTime: 'Never', equipment: 'FV-101', priority: 'high' },
  { id: 'ILK-008', name: 'Low Pasteurization Temp', condition: 'TT-402 < 72\u00b0C for 15s', status: 'Active', tripCount: 4, lastTripTime: '2026-03-09 03:12', equipment: 'HX-201', priority: 'critical' },
  { id: 'ILK-009', name: 'Motor Overload M-101', condition: 'M-101 current > 20A', status: 'Active', tripCount: 0, lastTripTime: 'Never', equipment: 'M-101', priority: 'high' },
  { id: 'ILK-010', name: 'High Diff Pressure Filter', condition: 'PT-301 > 2.5 bar', status: 'Active', tripCount: 1, lastTripTime: '2026-03-01 22:10', equipment: 'FL-101', priority: 'medium' },
  { id: 'ILK-011', name: 'Loom AJL-103 Zero Speed', condition: 'ST-603 = 0 for 5s while Running', status: 'Tripped', tripCount: 8, lastTripTime: '2026-03-12 06:15', equipment: 'AJL-103', priority: 'critical' },
  { id: 'ILK-012', name: 'Carbonation Overpressure', condition: 'PIC-301 > 5.5 bar', status: 'Active', tripCount: 2, lastTripTime: '2026-02-28 13:45', equipment: 'CU-201', priority: 'high' },
];

function statusBadge(status: InterlockStatus) {
  if (status === 'Active') return <Badge variant="success" dot>Active</Badge>;
  if (status === 'Bypassed') return <Badge variant="warning" dot pulse>Bypassed</Badge>;
  return <Badge variant="danger" dot pulse>Tripped</Badge>;
}

function priorityBadge(p: string) {
  if (p === 'critical') return <Badge variant="critical">Critical</Badge>;
  if (p === 'high') return <Badge variant="high">High</Badge>;
  return <Badge variant="medium">Medium</Badge>;
}

export default function InterlockStatusPage() {
  const [interlocks, setInterlocks] = useState<Interlock[]>(initialInterlocks);
  const [search, setSearch] = useState('');
  const [bypassModal, setBypassModal] = useState<Interlock | null>(null);

  const filtered = interlocks.filter(
    (ilk) => ilk.name.toLowerCase().includes(search.toLowerCase()) || ilk.equipment.toLowerCase().includes(search.toLowerCase()) || ilk.condition.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBypass = () => {
    if (!bypassModal) return;
    setInterlocks((prev) => prev.map((ilk) => (ilk.id === bypassModal.id ? { ...ilk, status: 'Bypassed' as InterlockStatus } : ilk)));
    setBypassModal(null);
  };

  const trippedCount = interlocks.filter((i) => i.status === 'Tripped').length;
  const bypassedCount = interlocks.filter((i) => i.status === 'Bypassed').length;

  const columns = [
    { key: 'statusIcon', header: '', width: '40px', render: (row: Interlock) => { if (row.status === 'Active') return <Shield size={16} className="text-status-running" />; if (row.status === 'Bypassed') return <ShieldOff size={16} className="text-status-warning" />; return <ShieldAlert size={16} className="text-alarm-critical animate-pulse" />; } },
    { key: 'name', header: 'Interlock', sortable: true },
    { key: 'condition', header: 'Condition', render: (row: Interlock) => <span className="font-mono text-xs">{row.condition}</span> },
    { key: 'status', header: 'Status', width: '120px', sortable: true, render: (row: Interlock) => statusBadge(row.status) },
    { key: 'priority', header: 'Priority', width: '100px', render: (row: Interlock) => priorityBadge(row.priority) },
    { key: 'tripCount', header: 'Trips', width: '70px', sortable: true, render: (row: Interlock) => <span className={clsx('font-mono', row.tripCount > 3 && 'text-alarm-high font-bold')}>{row.tripCount}</span> },
    { key: 'lastTripTime', header: 'Last Trip', width: '140px', render: (row: Interlock) => <span className="text-xs font-mono text-white/50">{row.lastTripTime}</span> },
    { key: 'actions', header: '', width: '90px', render: (row: Interlock) => <Button variant="ghost" size="sm" disabled={row.status === 'Bypassed'} onClick={(e: React.MouseEvent) => { e.stopPropagation(); setBypassModal(row); }}>Bypass</Button> },
  ];

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Interlock Status</h1>
          <p className="text-sm text-white/50">Safety interlock monitoring and management</p>
        </div>
        <Shield size={20} className="text-nexaproc-green" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-scada-border bg-scada-panel p-4"><p className="text-xs text-white/40 uppercase tracking-wider">Total</p><p className="text-2xl font-bold text-white">{interlocks.length}</p></div>
        <div className="rounded-lg border border-status-running/30 bg-status-running/5 p-4"><p className="text-xs text-status-running/60 uppercase tracking-wider">Active</p><p className="text-2xl font-bold text-status-running">{interlocks.filter((i) => i.status === 'Active').length}</p></div>
        <div className="rounded-lg border border-status-warning/30 bg-status-warning/5 p-4"><p className="text-xs text-status-warning/60 uppercase tracking-wider">Bypassed</p><p className="text-2xl font-bold text-status-warning">{bypassedCount}</p></div>
        <div className="rounded-lg border border-alarm-critical/30 bg-alarm-critical/5 p-4"><p className="text-xs text-alarm-critical/60 uppercase tracking-wider">Tripped</p><p className="text-2xl font-bold text-alarm-critical">{trippedCount}</p></div>
      </div>

      {bypassedCount > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-alarm-high/40 bg-alarm-high/10 px-4 py-3">
          <AlertTriangle size={18} className="text-alarm-high flex-shrink-0" />
          <p className="text-sm text-alarm-high"><span className="font-bold">{bypassedCount}</span> interlock{bypassedCount > 1 ? 's are' : ' is'} currently bypassed. Reduced safety protection in effect.</p>
        </div>
      )}

      <Input icon={<Search size={16} />} placeholder="Search interlocks..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card noPadding><Table columns={columns} data={filtered} /></Card>

      <Modal open={!!bypassModal} onClose={() => setBypassModal(null)} title="Bypass Interlock Request" footer={<><Button variant="ghost" size="sm" onClick={() => setBypassModal(null)}>Cancel</Button><Button variant="danger" size="sm" onClick={handleBypass}>Confirm Bypass</Button></>}>
        {bypassModal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-alarm-critical/30 bg-alarm-critical/10 p-3">
              <AlertTriangle size={20} className="text-alarm-critical flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-alarm-critical">Safety Warning</p>
                <p className="text-xs text-alarm-critical/70 mt-0.5">Bypassing this interlock removes safety protection. Ensure all necessary precautions are in place.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-white/40 text-xs">Interlock</span><p className="text-white">{bypassModal.name}</p></div>
              <div><span className="text-white/40 text-xs">Equipment</span><p className="text-white font-mono">{bypassModal.equipment}</p></div>
              <div><span className="text-white/40 text-xs">Condition</span><p className="text-white font-mono text-xs">{bypassModal.condition}</p></div>
              <div><span className="text-white/40 text-xs">Priority</span><p>{priorityBadge(bypassModal.priority)}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
