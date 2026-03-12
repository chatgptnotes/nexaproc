import React, { useState } from 'react';
import { Search, Edit3, Cable } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Table } from '@/components/ui/Table';

interface IOMapping {
  id: string;
  plcName: string;
  channel: string;
  ioType: 'AI' | 'AO' | 'DI' | 'DO';
  scadaTag: string;
  signalType: string;
  scaling: string;
  enabled: boolean;
}

const initialMappings: IOMapping[] = [
  { id: 'IO-001', plcName: 'PLC-01', channel: 'AI Ch 1', ioType: 'AI', scadaTag: 'TT-101', signalType: '4-20 mA', scaling: '0-200 \u00b0C', enabled: true },
  { id: 'IO-002', plcName: 'PLC-01', channel: 'AI Ch 2', ioType: 'AI', scadaTag: 'TT-102', signalType: '4-20 mA', scaling: '0-200 \u00b0C', enabled: true },
  { id: 'IO-003', plcName: 'PLC-01', channel: 'AI Ch 3', ioType: 'AI', scadaTag: 'PT-101', signalType: '4-20 mA', scaling: '0-10 bar', enabled: true },
  { id: 'IO-004', plcName: 'PLC-01', channel: 'AI Ch 4', ioType: 'AI', scadaTag: 'FT-101', signalType: '4-20 mA', scaling: '0-50 L/min', enabled: true },
  { id: 'IO-005', plcName: 'PLC-01', channel: 'DO Ch 5', ioType: 'DO', scadaTag: 'XV-101', signalType: '24V DC', scaling: '0/1', enabled: true },
  { id: 'IO-006', plcName: 'PLC-01', channel: 'DI Ch 6', ioType: 'DI', scadaTag: 'XV-102', signalType: '24V DC', scaling: '0/1', enabled: true },
  { id: 'IO-007', plcName: 'PLC-01', channel: 'AO Ch 1', ioType: 'AO', scadaTag: 'TIC-201', signalType: '4-20 mA', scaling: '0-100 \u00b0C', enabled: true },
  { id: 'IO-008', plcName: 'PLC-01', channel: 'DO Ch 7', ioType: 'DO', scadaTag: 'HS-101', signalType: '24V DC', scaling: '0/1', enabled: true },
  { id: 'IO-009', plcName: 'PLC-02', channel: 'AI Ch 1', ioType: 'AI', scadaTag: 'TT-301', signalType: '4-20 mA', scaling: '0-150 \u00b0C', enabled: true },
  { id: 'IO-010', plcName: 'PLC-02', channel: 'AI Ch 2', ioType: 'AI', scadaTag: 'PT-301', signalType: '4-20 mA', scaling: '0-5 bar', enabled: true },
  { id: 'IO-011', plcName: 'PLC-02', channel: 'AI Ch 3', ioType: 'AI', scadaTag: 'FT-301', signalType: '4-20 mA', scaling: '0-600 vials/min', enabled: true },
  { id: 'IO-012', plcName: 'PLC-02', channel: 'AI Ch 4', ioType: 'AI', scadaTag: 'LT-301', signalType: '4-20 mA', scaling: '0-100 %', enabled: true },
  { id: 'IO-013', plcName: 'PLC-03', channel: 'AI Ch 1', ioType: 'AI', scadaTag: 'TT-402', signalType: 'Pt100 RTD', scaling: '0-100 \u00b0C', enabled: true },
  { id: 'IO-014', plcName: 'PLC-03', channel: 'AI Ch 2', ioType: 'AI', scadaTag: 'FT-401', signalType: '4-20 mA', scaling: '0-1000 L/min', enabled: true },
  { id: 'IO-015', plcName: 'PLC-03', channel: 'AI Ch 3', ioType: 'AI', scadaTag: 'PT-401', signalType: '4-20 mA', scaling: '0-300 bar', enabled: true },
  { id: 'IO-016', plcName: 'PLC-03', channel: 'AO Ch 1', ioType: 'AO', scadaTag: 'FIC-201', signalType: '4-20 mA', scaling: '0-200 L/min', enabled: true },
  { id: 'IO-017', plcName: 'PLC-03', channel: 'AO Ch 2', ioType: 'AO', scadaTag: 'PIC-301', signalType: '4-20 mA', scaling: '0-10 bar', enabled: true },
  { id: 'IO-018', plcName: 'PLC-03', channel: 'DO Ch 1', ioType: 'DO', scadaTag: 'HS-201', signalType: '24V DC', scaling: '0/1', enabled: false },
  { id: 'IO-019', plcName: 'PLC-04', channel: 'AI Ch 1', ioType: 'AI', scadaTag: 'TT-701', signalType: 'Thermocouple K', scaling: '0-150 \u00b0C', enabled: true },
  { id: 'IO-020', plcName: 'PLC-04', channel: 'AI Ch 2', ioType: 'AI', scadaTag: 'ST-601', signalType: 'Pulse', scaling: '0-1200 picks/min', enabled: true },
];

const ioTypeVariant: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = { AI: 'success', AO: 'info', DI: 'warning', DO: 'neutral' };

export default function IoMappingPage() {
  const [mappings, setMappings] = useState<IOMapping[]>(initialMappings);
  const [search, setSearch] = useState('');
  const [filterPlc, setFilterPlc] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editMapping, setEditMapping] = useState<IOMapping | null>(null);
  const [form, setForm] = useState<Partial<IOMapping>>({});

  const plcs = Array.from(new Set(mappings.map((m) => m.plcName)));
  const ioTypes = Array.from(new Set(mappings.map((m) => m.ioType)));

  const filtered = mappings.filter((m) => {
    if (filterPlc && m.plcName !== filterPlc) return false;
    if (filterType && m.ioType !== filterType) return false;
    const q = search.toLowerCase();
    return m.scadaTag.toLowerCase().includes(q) || m.channel.toLowerCase().includes(q) || m.plcName.toLowerCase().includes(q);
  });

  const openEdit = (m: IOMapping) => {
    setEditMapping(m);
    setForm({ scadaTag: m.scadaTag, signalType: m.signalType, scaling: m.scaling, enabled: m.enabled });
  };

  const saveMapping = () => {
    if (!editMapping) return;
    setMappings((prev) => prev.map((m) => (m.id === editMapping.id ? { ...m, ...form } : m)));
    setEditMapping(null);
  };

  const columns = [
    { key: 'plcName', header: 'PLC', sortable: true, width: '80px', render: (row: IOMapping) => <span className="font-mono text-nexaproc-amber">{row.plcName}</span> },
    { key: 'channel', header: 'Channel', sortable: true, width: '100px', render: (row: IOMapping) => <span className="font-mono">{row.channel}</span> },
    { key: 'ioType', header: 'I/O Type', width: '80px', render: (row: IOMapping) => <Badge variant={ioTypeVariant[row.ioType]}>{row.ioType}</Badge> },
    { key: 'scadaTag', header: 'SCADA Tag', sortable: true, width: '100px', render: (row: IOMapping) => <span className="font-mono text-nexaproc-green">{row.scadaTag}</span> },
    { key: 'signalType', header: 'Signal Type', width: '120px', render: (row: IOMapping) => <span className="text-xs">{row.signalType}</span> },
    { key: 'scaling', header: 'Scaling', render: (row: IOMapping) => <span className="font-mono text-xs text-white/60">{row.scaling}</span> },
    { key: 'enabled', header: 'Enabled', width: '80px', render: (row: IOMapping) => <Badge variant={row.enabled ? 'success' : 'neutral'} dot>{row.enabled ? 'Yes' : 'No'}</Badge> },
    { key: 'actions', header: '', width: '50px', render: (row: IOMapping) => <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEdit(row); }} className="p-1.5 rounded text-white/40 hover:text-nexaproc-amber hover:bg-nexaproc-amber/10 transition-colors"><Edit3 size={14} /></button> },
  ];

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">I/O Mapping Configuration</h1>
          <p className="text-sm text-white/50">{mappings.length} I/O mappings across {plcs.length} PLCs</p>
        </div>
        <Cable size={20} className="text-nexaproc-amber" />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]"><Input icon={<Search size={16} />} placeholder="Search by tag, channel, or PLC..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="w-40"><Select label="Filter by PLC" placeholder="All PLCs" options={[{ value: '', label: 'All PLCs' }, ...plcs.map((p) => ({ value: p, label: p }))]} value={filterPlc} onChange={setFilterPlc} /></div>
        <div className="w-36"><Select label="I/O Type" placeholder="All Types" options={[{ value: '', label: 'All Types' }, ...ioTypes.map((t) => ({ value: t, label: t }))]} value={filterType} onChange={setFilterType} /></div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {plcs.map((plc) => {
          const count = mappings.filter((m) => m.plcName === plc).length;
          return (
            <div key={plc} className="rounded-lg border border-scada-border bg-scada-panel p-3">
              <p className="text-xs text-white/40 uppercase tracking-wider">{plc}</p>
              <p className="text-lg font-bold text-white">{count} <span className="text-xs text-white/40 font-normal">channels</span></p>
            </div>
          );
        })}
      </div>

      <Card noPadding><Table columns={columns} data={filtered} /></Card>

      <Modal open={!!editMapping} onClose={() => setEditMapping(null)} title={editMapping ? `Edit Mapping \u2014 ${editMapping.plcName} ${editMapping.channel}` : ''} footer={<><Button variant="ghost" size="sm" onClick={() => setEditMapping(null)}>Cancel</Button><Button variant="primary" size="sm" onClick={saveMapping}>Update</Button></>}>
        {editMapping && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-white/40 text-xs">PLC</span><p className="text-white font-mono">{editMapping.plcName}</p></div>
              <div><span className="text-white/40 text-xs">Channel</span><p className="text-white font-mono">{editMapping.channel}</p></div>
              <div><span className="text-white/40 text-xs">I/O Type</span><p><Badge variant={ioTypeVariant[editMapping.ioType]}>{editMapping.ioType}</Badge></p></div>
            </div>
            <Input label="SCADA Tag" value={form.scadaTag ?? ''} onChange={(e) => setForm((f) => ({ ...f, scadaTag: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Signal Type" value={form.signalType ?? ''} onChange={(e) => setForm((f) => ({ ...f, signalType: e.target.value }))} />
              <Input label="Scaling" value={form.scaling ?? ''} onChange={(e) => setForm((f) => ({ ...f, scaling: e.target.value }))} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.enabled ?? true} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} className="w-4 h-4 rounded border-scada-border bg-scada-panel accent-nexaproc-green" />
              <span className="text-sm text-white/70">{form.enabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>
        )}
      </Modal>
    </div>
  );
}
