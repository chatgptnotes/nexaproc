import React, { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Upload, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Table } from '@/components/ui/Table';

interface TagConfig {
  id: string;
  name: string;
  description: string;
  type: 'analog_input' | 'analog_output' | 'digital_input' | 'digital_output';
  unit: string;
  minRange: number;
  maxRange: number;
  scanRate: number;
  enabled: boolean;
}

const typeLabels: Record<string, string> = { analog_input: 'AI', analog_output: 'AO', digital_input: 'DI', digital_output: 'DO' };
let nextTagNum = 100;

const initialTags: TagConfig[] = [
  { id: 'TT-101', name: 'TT-101', description: 'Granulator Jacket Temperature', type: 'analog_input', unit: '\u00b0C', minRange: 0, maxRange: 200, scanRate: 1000, enabled: true },
  { id: 'TT-102', name: 'TT-102', description: 'Fluid Bed Dryer Inlet Temperature', type: 'analog_input', unit: '\u00b0C', minRange: 0, maxRange: 200, scanRate: 1000, enabled: true },
  { id: 'PT-101', name: 'PT-101', description: 'Granulator Internal Pressure', type: 'analog_input', unit: 'bar', minRange: 0, maxRange: 10, scanRate: 500, enabled: true },
  { id: 'FT-101', name: 'FT-101', description: 'Granulation Spray Flow Rate', type: 'analog_input', unit: 'L/min', minRange: 0, maxRange: 50, scanRate: 500, enabled: true },
  { id: 'ST-101', name: 'ST-101', description: 'Granulator Impeller Speed', type: 'analog_input', unit: 'RPM', minRange: 0, maxRange: 3000, scanRate: 250, enabled: true },
  { id: 'TIC-201', name: 'TIC-201', description: 'Coating Pan Temperature Controller', type: 'analog_output', unit: '\u00b0C', minRange: 0, maxRange: 100, scanRate: 1000, enabled: true },
  { id: 'TT-301', name: 'TT-301', description: 'Mixing Vessel MV-101 Temperature', type: 'analog_input', unit: '\u00b0C', minRange: 0, maxRange: 150, scanRate: 1000, enabled: true },
  { id: 'PT-301', name: 'PT-301', description: 'Filtration Skid Differential Pressure', type: 'analog_input', unit: 'bar', minRange: 0, maxRange: 5, scanRate: 500, enabled: true },
  { id: 'FT-301', name: 'FT-301', description: 'Vial Filling Rate', type: 'analog_input', unit: 'vials/min', minRange: 0, maxRange: 600, scanRate: 1000, enabled: true },
  { id: 'LT-301', name: 'LT-301', description: 'Mixing Vessel MV-101 Level', type: 'analog_input', unit: '%', minRange: 0, maxRange: 100, scanRate: 2000, enabled: true },
  { id: 'TT-402', name: 'TT-402', description: 'HTST Pasteurizer Holding Tube Temp', type: 'analog_input', unit: '\u00b0C', minRange: 0, maxRange: 100, scanRate: 500, enabled: true },
  { id: 'FT-401', name: 'FT-401', description: 'Raw Milk Intake Flow', type: 'analog_input', unit: 'L/min', minRange: 0, maxRange: 1000, scanRate: 1000, enabled: true },
  { id: 'XV-101', name: 'XV-101', description: 'Granulator Discharge Valve', type: 'digital_input', unit: '', minRange: 0, maxRange: 1, scanRate: 100, enabled: true },
  { id: 'XV-102', name: 'XV-102', description: 'Coating Pan Inlet Valve', type: 'digital_input', unit: '', minRange: 0, maxRange: 1, scanRate: 100, enabled: true },
  { id: 'HS-101', name: 'HS-101', description: 'Granulator Motor Start/Stop', type: 'digital_output', unit: '', minRange: 0, maxRange: 1, scanRate: 100, enabled: true },
  { id: 'FIC-201', name: 'FIC-201', description: 'Syrup Flow Controller', type: 'analog_output', unit: 'L/min', minRange: 0, maxRange: 200, scanRate: 1000, enabled: true },
  { id: 'PIC-301', name: 'PIC-301', description: 'Carbonation Pressure Controller', type: 'analog_output', unit: 'bar', minRange: 0, maxRange: 10, scanRate: 500, enabled: true },
  { id: 'HS-201', name: 'HS-201', description: 'Pasteurizer Pump Start/Stop', type: 'digital_output', unit: '', minRange: 0, maxRange: 1, scanRate: 100, enabled: false },
  { id: 'AT-101', name: 'AT-101', description: 'Fermentation Vessel FV-101 pH', type: 'analog_input', unit: 'pH', minRange: 0, maxRange: 14, scanRate: 2000, enabled: true },
  { id: 'TT-701', name: 'TT-701', description: 'Jet Dyeing Machine JD-201 Temperature', type: 'analog_input', unit: '\u00b0C', minRange: 0, maxRange: 150, scanRate: 1000, enabled: true },
];

const emptyTag: Omit<TagConfig, 'id'> = { name: '', description: '', type: 'analog_input', unit: '\u00b0C', minRange: 0, maxRange: 100, scanRate: 1000, enabled: true };

export default function TagConfigPage() {
  const [tags, setTags] = useState<TagConfig[]>(initialTags);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagConfig | null>(null);
  const [form, setForm] = useState<Omit<TagConfig, 'id'>>(emptyTag);

  const filtered = tags.filter((t) => t.id.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditingTag(null); setForm({ ...emptyTag }); setModalOpen(true); };
  const openEdit = (tag: TagConfig) => { setEditingTag(tag); setForm({ name: tag.name, description: tag.description, type: tag.type, unit: tag.unit, minRange: tag.minRange, maxRange: tag.maxRange, scanRate: tag.scanRate, enabled: tag.enabled }); setModalOpen(true); };

  const saveTag = () => {
    if (editingTag) { setTags((prev) => prev.map((t) => (t.id === editingTag.id ? { ...t, ...form } : t))); }
    else { setTags((prev) => [...prev, { id: `TAG-${++nextTagNum}`, ...form }]); }
    setModalOpen(false);
  };

  const deleteTag = (id: string) => { setTags((prev) => prev.filter((t) => t.id !== id)); };

  const columns = [
    { key: 'id', header: 'Tag ID', sortable: true, width: '90px', render: (row: TagConfig) => <span className="font-mono text-nexaproc-green">{row.id}</span> },
    { key: 'name', header: 'Name', sortable: true, width: '90px' },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'type', header: 'Type', width: '70px', render: (row: TagConfig) => <Badge variant={row.type.includes('output') ? 'info' : 'neutral'}>{typeLabels[row.type]}</Badge> },
    { key: 'unit', header: 'Unit', width: '70px' },
    { key: 'minRange', header: 'Min', width: '60px', render: (row: TagConfig) => <span className="font-mono">{row.minRange}</span> },
    { key: 'maxRange', header: 'Max', width: '60px', render: (row: TagConfig) => <span className="font-mono">{row.maxRange}</span> },
    { key: 'scanRate', header: 'Scan (ms)', width: '80px', sortable: true, render: (row: TagConfig) => <span className="font-mono">{row.scanRate}</span> },
    { key: 'enabled', header: 'Enabled', width: '80px', render: (row: TagConfig) => <Badge variant={row.enabled ? 'success' : 'neutral'} dot>{row.enabled ? 'Yes' : 'No'}</Badge> },
    { key: 'actions', header: '', width: '80px', render: (row: TagConfig) => (
      <div className="flex items-center gap-1">
        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEdit(row); }} className="p-1 rounded text-white/40 hover:text-nexaproc-amber hover:bg-nexaproc-amber/10 transition-colors"><Edit3 size={14} /></button>
        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteTag(row.id); }} className="p-1 rounded text-white/40 hover:text-alarm-critical hover:bg-alarm-critical/10 transition-colors"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Tag Configuration</h1><p className="text-sm text-white/50">Tag database management \u2014 {tags.length} tags</p></div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Upload size={14} />}>Import</Button>
          <Button variant="ghost" size="sm" icon={<Download size={14} />}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openAdd}>Add Tag</Button>
        </div>
      </div>

      <Input icon={<Search size={16} />} placeholder="Search tags by ID, name, or description..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card noPadding><Table columns={columns} data={filtered} /></Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingTag ? `Edit Tag \u2014 ${editingTag.id}` : 'Add New Tag'} size="lg" footer={<><Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" size="sm" onClick={saveTag} disabled={!form.name.trim()}>{editingTag ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Tag Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. TT-901" />
            <Select label="Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v as TagConfig['type'] }))} options={[{ value: 'analog_input', label: 'Analog Input (AI)' }, { value: 'analog_output', label: 'Analog Output (AO)' }, { value: 'digital_input', label: 'Digital Input (DI)' }, { value: 'digital_output', label: 'Digital Output (DO)' }]} />
          </div>
          <Input label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="e.g. Reactor jacket temperature" />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Unit" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} />
            <Input label="Min Range" type="number" value={String(form.minRange)} onChange={(e) => setForm((f) => ({ ...f, minRange: Number(e.target.value) }))} />
            <Input label="Max Range" type="number" value={String(form.maxRange)} onChange={(e) => setForm((f) => ({ ...f, maxRange: Number(e.target.value) }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Scan Rate (ms)" type="number" value={String(form.scanRate)} onChange={(e) => setForm((f) => ({ ...f, scanRate: Number(e.target.value) }))} />
            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">Enabled</span>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" checked={form.enabled} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} className="w-4 h-4 rounded border-scada-border bg-scada-panel accent-nexaproc-green" />
                <span className="text-sm text-white/70">{form.enabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
