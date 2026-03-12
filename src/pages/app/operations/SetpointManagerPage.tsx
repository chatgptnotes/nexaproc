import React, { useState } from 'react';
import clsx from 'clsx';
import { Target, Edit3, Search, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Table } from '@/components/ui/Table';

interface Setpoint {
  id: string;
  tag: string;
  description: string;
  currentValue: number;
  setpointValue: number;
  unit: string;
  mode: 'Auto' | 'Manual';
  status: 'Normal' | 'Deviation';
  min: number;
  max: number;
}

const initialSetpoints: Setpoint[] = [
  { id: 'SP-001', tag: 'TIC-101', description: 'Granulator Jacket Temperature', currentValue: 52.3, setpointValue: 50.0, unit: '\u00b0C', mode: 'Auto', status: 'Normal', min: 20, max: 80 },
  { id: 'SP-002', tag: 'TIC-102', description: 'Fluid Bed Dryer Inlet Temp', currentValue: 68.7, setpointValue: 65.0, unit: '\u00b0C', mode: 'Auto', status: 'Deviation', min: 30, max: 95 },
  { id: 'SP-003', tag: 'TIC-201', description: 'Coating Pan Temperature', currentValue: 42.8, setpointValue: 42.0, unit: '\u00b0C', mode: 'Auto', status: 'Normal', min: 25, max: 60 },
  { id: 'SP-004', tag: 'TIC-301', description: 'Mixing Vessel MV-101 Temp', currentValue: 22.1, setpointValue: 22.0, unit: '\u00b0C', mode: 'Auto', status: 'Normal', min: 15, max: 40 },
  { id: 'SP-005', tag: 'TIC-302', description: 'Autoclave Chamber Temperature', currentValue: 121.3, setpointValue: 121.0, unit: '\u00b0C', mode: 'Auto', status: 'Normal', min: 100, max: 140 },
  { id: 'SP-006', tag: 'PIC-101', description: 'Granulator Internal Pressure', currentValue: 2.4, setpointValue: 2.5, unit: 'bar', mode: 'Auto', status: 'Normal', min: 0, max: 6 },
  { id: 'SP-007', tag: 'PIC-301', description: 'Filtration Differential Pressure', currentValue: 0.85, setpointValue: 0.80, unit: 'bar', mode: 'Auto', status: 'Normal', min: 0, max: 3 },
  { id: 'SP-008', tag: 'PIC-302', description: 'Autoclave Chamber Pressure', currentValue: 1.5, setpointValue: 1.5, unit: 'bar', mode: 'Auto', status: 'Normal', min: 0, max: 3 },
  { id: 'SP-009', tag: 'PIC-401', description: 'Carbonation Pressure', currentValue: 3.4, setpointValue: 3.5, unit: 'bar', mode: 'Manual', status: 'Normal', min: 1, max: 6 },
  { id: 'SP-010', tag: 'FIC-101', description: 'Granulation Spray Flow', currentValue: 12.8, setpointValue: 12.0, unit: 'L/min', mode: 'Auto', status: 'Deviation', min: 0, max: 30 },
  { id: 'SP-011', tag: 'FIC-201', description: 'Syrup Flow Controller', currentValue: 85.6, setpointValue: 85.0, unit: 'L/min', mode: 'Auto', status: 'Normal', min: 0, max: 200 },
  { id: 'SP-012', tag: 'FIC-301', description: 'Vial Filling Rate', currentValue: 320, setpointValue: 300, unit: 'vials/min', mode: 'Auto', status: 'Deviation', min: 100, max: 500 },
  { id: 'SP-013', tag: 'SIC-101', description: 'Granulator Impeller Speed', currentValue: 1450, setpointValue: 1500, unit: 'RPM', mode: 'Auto', status: 'Normal', min: 0, max: 2500 },
  { id: 'SP-014', tag: 'TIC-401', description: 'Pasteurizer Holding Temp', currentValue: 74.9, setpointValue: 72.0, unit: '\u00b0C', mode: 'Auto', status: 'Deviation', min: 60, max: 85 },
  { id: 'SP-015', tag: 'TIC-501', description: 'Sugar Dissolving Tank Temp', currentValue: 72.4, setpointValue: 70.0, unit: '\u00b0C', mode: 'Manual', status: 'Normal', min: 50, max: 95 },
];

function hasDeviation(sp: Setpoint): boolean {
  if (sp.setpointValue === 0) return false;
  return Math.abs((sp.currentValue - sp.setpointValue) / sp.setpointValue) * 100 > 10;
}

export default function SetpointManagerPage() {
  const [setpoints, setSetpoints] = useState<Setpoint[]>(initialSetpoints);
  const [search, setSearch] = useState('');
  const [editingSp, setEditingSp] = useState<Setpoint | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');

  const filtered = setpoints.filter(
    (sp) => sp.tag.toLowerCase().includes(search.toLowerCase()) || sp.description.toLowerCase().includes(search.toLowerCase()),
  );

  const openEdit = (sp: Setpoint) => {
    setEditingSp(sp);
    setEditValue(String(sp.setpointValue));
    setEditError('');
  };

  const saveEdit = () => {
    if (!editingSp) return;
    const val = parseFloat(editValue);
    if (isNaN(val)) { setEditError('Invalid number'); return; }
    if (val < editingSp.min || val > editingSp.max) { setEditError(`Value must be between ${editingSp.min} and ${editingSp.max}`); return; }
    setSetpoints((prev) => prev.map((sp) => {
      if (sp.id !== editingSp.id) return sp;
      const updated = { ...sp, setpointValue: val };
      updated.status = hasDeviation(updated) ? 'Deviation' : 'Normal';
      return updated;
    }));
    setEditingSp(null);
  };

  const deviationCount = setpoints.filter(hasDeviation).length;

  const columns = [
    { key: 'tag', header: 'Tag', sortable: true, width: '100px' },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'currentValue', header: 'Current', sortable: true, width: '100px', render: (row: Setpoint) => <span className={clsx('font-mono', hasDeviation(row) && 'text-alarm-high font-bold')}>{row.currentValue.toFixed(1)}</span> },
    { key: 'setpointValue', header: 'Setpoint', sortable: true, width: '100px', render: (row: Setpoint) => <span className="font-mono text-nexaproc-green">{row.setpointValue.toFixed(1)}</span> },
    { key: 'unit', header: 'Unit', width: '80px' },
    { key: 'mode', header: 'Mode', width: '90px', render: (row: Setpoint) => <Badge variant={row.mode === 'Auto' ? 'success' : 'warning'}>{row.mode}</Badge> },
    { key: 'status', header: 'Status', width: '110px', render: (row: Setpoint) => { const dev = hasDeviation(row); return <Badge variant={dev ? 'danger' : 'success'} dot pulse={dev}>{dev ? 'Deviation' : 'Normal'}</Badge>; } },
    { key: 'actions', header: '', width: '50px', render: (row: Setpoint) => <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEdit(row); }} className="p-1.5 rounded text-white/40 hover:text-nexaproc-amber hover:bg-nexaproc-amber/10 transition-colors"><Edit3 size={14} /></button> },
  ];

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Setpoint Manager</h1>
          <p className="text-sm text-white/50">View and modify process setpoints</p>
        </div>
        <div className="flex items-center gap-3">
          {deviationCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-alarm-high/30 bg-alarm-high/10 px-3 py-1.5">
              <AlertTriangle size={14} className="text-alarm-high" />
              <span className="text-xs font-semibold text-alarm-high">{deviationCount} deviation{deviationCount > 1 ? 's' : ''}</span>
            </div>
          )}
          <Target size={18} className="text-nexaproc-amber" />
        </div>
      </div>

      <Input icon={<Search size={16} />} placeholder="Search by tag or description..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card noPadding>
        <Table columns={columns} data={filtered} />
      </Card>

      <Modal open={!!editingSp} onClose={() => setEditingSp(null)} title={editingSp ? `Edit Setpoint \u2014 ${editingSp.tag}` : ''} footer={<><Button variant="ghost" size="sm" onClick={() => setEditingSp(null)}>Cancel</Button><Button variant="primary" size="sm" onClick={saveEdit}>Update</Button></>}>
        {editingSp && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-white/40 text-xs">Tag</span><p className="text-white font-mono">{editingSp.tag}</p></div>
              <div><span className="text-white/40 text-xs">Current Value</span><p className="text-white font-mono">{editingSp.currentValue} {editingSp.unit}</p></div>
            </div>
            <Input label={`New Setpoint (${editingSp.unit})`} type="number" value={editValue} onChange={(e) => { setEditValue(e.target.value); setEditError(''); }} error={editError} />
            <p className="text-xs text-white/40">Valid range: {editingSp.min} \u2014 {editingSp.max} {editingSp.unit}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
