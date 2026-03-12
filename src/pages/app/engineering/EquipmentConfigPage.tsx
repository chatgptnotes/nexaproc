import React, { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Cog, Cylinder, Droplets, CircleDot, Wind, Heater, Box, Filter as FilterIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Table } from '@/components/ui/Table';

interface EquipConfig {
  id: string;
  name: string;
  type: string;
  plant: string;
  zone: string;
  status: 'Running' | 'Stopped' | 'Fault' | 'Maintenance' | 'Standby';
  manufacturer: string;
  model: string;
}

const statusVariant: Record<string, 'success' | 'neutral' | 'danger' | 'info' | 'warning'> = {
  Running: 'success', Stopped: 'neutral', Fault: 'danger', Maintenance: 'info', Standby: 'warning',
};

function getTypeIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes('reactor') || t.includes('vessel')) return <Cylinder size={14} />;
  if (t.includes('pump')) return <Droplets size={14} />;
  if (t.includes('valve')) return <CircleDot size={14} />;
  if (t.includes('motor')) return <Cog size={14} />;
  if (t.includes('compressor')) return <Wind size={14} />;
  if (t.includes('heat') || t.includes('exchanger')) return <Heater size={14} />;
  if (t.includes('conveyor')) return <Box size={14} />;
  if (t.includes('filter')) return <FilterIcon size={14} />;
  return <Cog size={14} />;
}

let nextId = 100;

const initialEquip: EquipConfig[] = [
  { id: 'R-101', name: 'High-Shear Granulator R-101', type: 'Reactor', plant: 'Pharma Plant Alpha', zone: 'Granulation', status: 'Running', manufacturer: 'GEA Group', model: 'PMA-1200' },
  { id: 'R-201', name: 'Mixing Vessel MV-101', type: 'Reactor', plant: 'Pharma Plant Alpha', zone: 'Preparation', status: 'Running', manufacturer: 'Pfaudler', model: 'AE-2000' },
  { id: 'HX-101', name: 'Granulator Jacket HE', type: 'Heat Exchanger', plant: 'Pharma Plant Alpha', zone: 'Granulation', status: 'Running', manufacturer: 'Alfa Laval', model: 'M10-BW' },
  { id: 'HX-201', name: 'HTST Plate HE', type: 'Heat Exchanger', plant: 'Food Processing Beta', zone: 'Reception', status: 'Running', manufacturer: 'Alfa Laval', model: 'T25-MFG' },
  { id: 'P-101', name: 'Granulation Spray Pump', type: 'Pump', plant: 'Pharma Plant Alpha', zone: 'Granulation', status: 'Running', manufacturer: 'Grundfos', model: 'CR-15' },
  { id: 'P-104', name: 'Raw Milk Intake Pump', type: 'Pump', plant: 'Food Processing Beta', zone: 'Reception', status: 'Running', manufacturer: 'APV', model: 'WS-55' },
  { id: 'P-108', name: 'CIP Return Pump', type: 'Pump', plant: 'Food Processing Beta', zone: 'Carbonation', status: 'Stopped', manufacturer: 'Grundfos', model: 'CRN-20' },
  { id: 'M-101', name: 'Granulator Impeller Motor', type: 'Motor', plant: 'Pharma Plant Alpha', zone: 'Granulation', status: 'Running', manufacturer: 'Siemens', model: '1LE1501' },
  { id: 'M-104', name: 'Loom AJL-103 Drive Motor', type: 'Motor', plant: 'Textile Mill Gamma', zone: 'Loom Floor', status: 'Fault', manufacturer: 'ABB', model: 'M3BP-200' },
  { id: 'XV-101', name: 'Granulator Discharge Valve', type: 'Valve', plant: 'Pharma Plant Alpha', zone: 'Granulation', status: 'Stopped', manufacturer: 'Samson', model: '3241-7' },
  { id: 'TP-101', name: 'Rotary Tablet Press TP-101', type: 'Tablet Press', plant: 'Pharma Plant Alpha', zone: 'Compression', status: 'Running', manufacturer: 'Fette', model: 'P2090' },
  { id: 'CP-101', name: 'Compressed Air Compressor', type: 'Compressor', plant: 'Textile Mill Gamma', zone: 'Loom Floor', status: 'Running', manufacturer: 'Atlas Copco', model: 'GA-55' },
  { id: 'FL-101', name: 'Sterile Filtration Unit', type: 'Filter', plant: 'Pharma Plant Alpha', zone: 'Preparation', status: 'Running', manufacturer: 'Pall', model: 'Supor-EX' },
  { id: 'JD-201', name: 'Jet Dyeing Machine JD-201', type: 'Reactor', plant: 'Textile Mill Gamma', zone: 'Dyeing', status: 'Maintenance', manufacturer: 'Thies', model: 'iMaster-H' },
  { id: 'CV-101', name: 'Tablet Press Output Conveyor', type: 'Conveyor', plant: 'Pharma Plant Alpha', zone: 'Compression', status: 'Running', manufacturer: 'Dorner', model: '2200-Series' },
];

const emptyForm: Omit<EquipConfig, 'id'> = { name: '', type: 'Reactor', plant: 'Pharma Plant Alpha', zone: '', status: 'Stopped', manufacturer: '', model: '' };

export default function EquipmentConfigPage() {
  const [equip, setEquip] = useState<EquipConfig[]>(initialEquip);
  const [search, setSearch] = useState('');
  const [filterPlant, setFilterPlant] = useState('');
  const [filterType, setFilterType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEquip, setEditingEquip] = useState<EquipConfig | null>(null);
  const [form, setForm] = useState<Omit<EquipConfig, 'id'>>(emptyForm);

  const plants = Array.from(new Set(equip.map((e) => e.plant)));
  const types = Array.from(new Set(equip.map((e) => e.type)));

  const filtered = equip.filter((e) => {
    if (filterPlant && e.plant !== filterPlant) return false;
    if (filterType && e.type !== filterType) return false;
    const q = search.toLowerCase();
    return e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.manufacturer.toLowerCase().includes(q);
  });

  const openAdd = () => { setEditingEquip(null); setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (eq: EquipConfig) => { setEditingEquip(eq); setForm({ name: eq.name, type: eq.type, plant: eq.plant, zone: eq.zone, status: eq.status, manufacturer: eq.manufacturer, model: eq.model }); setModalOpen(true); };

  const saveEquip = () => {
    if (editingEquip) { setEquip((prev) => prev.map((e) => (e.id === editingEquip.id ? { ...e, ...form } : e))); }
    else { setEquip((prev) => [...prev, { id: `EQ-${++nextId}`, ...form }]); }
    setModalOpen(false);
  };

  const deleteEquip = (id: string) => { setEquip((prev) => prev.filter((e) => e.id !== id)); };

  const columns = [
    { key: 'id', header: 'ID', sortable: true, width: '80px', render: (row: EquipConfig) => <span className="font-mono text-nexaproc-green">{row.id}</span> },
    { key: 'typeIcon', header: '', width: '40px', render: (row: EquipConfig) => <span className="text-white/40">{getTypeIcon(row.type)}</span> },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type', sortable: true, width: '120px' },
    { key: 'plant', header: 'Plant', width: '150px', render: (row: EquipConfig) => <span className="text-xs text-white/60">{row.plant}</span> },
    { key: 'zone', header: 'Zone', width: '120px', render: (row: EquipConfig) => <span className="text-xs text-white/60">{row.zone}</span> },
    { key: 'status', header: 'Status', width: '110px', render: (row: EquipConfig) => <Badge variant={statusVariant[row.status]} dot>{row.status}</Badge> },
    { key: 'manufacturer', header: 'Manufacturer', width: '110px', render: (row: EquipConfig) => <span className="text-xs">{row.manufacturer}</span> },
    { key: 'model', header: 'Model', width: '100px', render: (row: EquipConfig) => <span className="text-xs font-mono">{row.model}</span> },
    { key: 'actions', header: '', width: '80px', render: (row: EquipConfig) => (
      <div className="flex items-center gap-1">
        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEdit(row); }} className="p-1 rounded text-white/40 hover:text-nexaproc-amber hover:bg-nexaproc-amber/10 transition-colors"><Edit3 size={14} /></button>
        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteEquip(row.id); }} className="p-1 rounded text-white/40 hover:text-alarm-critical hover:bg-alarm-critical/10 transition-colors"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Equipment Configuration</h1><p className="text-sm text-white/50">{equip.length} equipment items</p></div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openAdd}>Add Equipment</Button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]"><Input icon={<Search size={16} />} placeholder="Search equipment..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="w-48"><Select label="Filter by Plant" placeholder="All Plants" options={[{ value: '', label: 'All Plants' }, ...plants.map((p) => ({ value: p, label: p }))]} value={filterPlant} onChange={setFilterPlant} /></div>
        <div className="w-40"><Select label="Filter by Type" placeholder="All Types" options={[{ value: '', label: 'All Types' }, ...types.map((t) => ({ value: t, label: t }))]} value={filterType} onChange={setFilterType} /></div>
      </div>

      <Card noPadding><Table columns={columns} data={filtered} /></Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingEquip ? `Edit \u2014 ${editingEquip.id}` : 'Add Equipment'} size="lg" footer={<><Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" size="sm" onClick={saveEquip} disabled={!form.name.trim()}>{editingEquip ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Feed Pump P-201" />
            <Input label="Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="e.g. Pump" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Plant" value={form.plant} onChange={(e) => setForm((f) => ({ ...f, plant: e.target.value }))} />
            <Input label="Zone" value={form.zone} onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Select label="Status" value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v as EquipConfig['status'] }))} options={['Running', 'Stopped', 'Fault', 'Maintenance', 'Standby'].map((s) => ({ value: s, label: s }))} />
            <Input label="Manufacturer" value={form.manufacturer} onChange={(e) => setForm((f) => ({ ...f, manufacturer: e.target.value }))} />
            <Input label="Model" value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
