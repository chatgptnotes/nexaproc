import React, { useState } from 'react';
import { Search, Plus, Edit3, BellRing } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Table } from '@/components/ui/Table';

type AlarmType = 'HiHi' | 'Hi' | 'Lo' | 'LoLo';
type AlarmPriority = 'critical' | 'high' | 'medium' | 'low';

interface AlarmCfg {
  id: string;
  tag: string;
  alarmType: AlarmType;
  limitValue: number;
  priority: AlarmPriority;
  deadband: number;
  delay: number;
  enabled: boolean;
}

let nextAlmId = 100;

const initialAlarms: AlarmCfg[] = [
  { id: 'AC-001', tag: 'TT-101', alarmType: 'HiHi', limitValue: 75, priority: 'critical', deadband: 1.0, delay: 0, enabled: true },
  { id: 'AC-002', tag: 'TT-101', alarmType: 'Hi', limitValue: 65, priority: 'high', deadband: 1.0, delay: 5, enabled: true },
  { id: 'AC-003', tag: 'TT-101', alarmType: 'Lo', limitValue: 25, priority: 'medium', deadband: 1.0, delay: 10, enabled: true },
  { id: 'AC-004', tag: 'TT-101', alarmType: 'LoLo', limitValue: 15, priority: 'critical', deadband: 1.0, delay: 0, enabled: true },
  { id: 'AC-005', tag: 'PT-101', alarmType: 'HiHi', limitValue: 5.0, priority: 'critical', deadband: 0.1, delay: 0, enabled: true },
  { id: 'AC-006', tag: 'PT-101', alarmType: 'Hi', limitValue: 4.5, priority: 'high', deadband: 0.1, delay: 5, enabled: true },
  { id: 'AC-007', tag: 'FT-101', alarmType: 'LoLo', limitValue: 1.0, priority: 'critical', deadband: 0.5, delay: 10, enabled: true },
  { id: 'AC-008', tag: 'FT-101', alarmType: 'Lo', limitValue: 3.0, priority: 'medium', deadband: 0.5, delay: 10, enabled: true },
  { id: 'AC-009', tag: 'TT-302', alarmType: 'HiHi', limitValue: 130, priority: 'critical', deadband: 0.5, delay: 0, enabled: true },
  { id: 'AC-010', tag: 'TT-302', alarmType: 'Hi', limitValue: 125, priority: 'high', deadband: 0.5, delay: 5, enabled: true },
  { id: 'AC-011', tag: 'PT-302', alarmType: 'HiHi', limitValue: 2.5, priority: 'critical', deadband: 0.05, delay: 0, enabled: true },
  { id: 'AC-012', tag: 'PT-302', alarmType: 'Hi', limitValue: 2.2, priority: 'high', deadband: 0.05, delay: 3, enabled: true },
  { id: 'AC-013', tag: 'AT-101', alarmType: 'HiHi', limitValue: 5.5, priority: 'critical', deadband: 0.1, delay: 0, enabled: true },
  { id: 'AC-014', tag: 'AT-101', alarmType: 'Hi', limitValue: 5.0, priority: 'high', deadband: 0.1, delay: 5, enabled: true },
  { id: 'AC-015', tag: 'AT-101', alarmType: 'Lo', limitValue: 4.0, priority: 'medium', deadband: 0.1, delay: 10, enabled: true },
  { id: 'AC-016', tag: 'TT-402', alarmType: 'LoLo', limitValue: 70, priority: 'critical', deadband: 0.5, delay: 0, enabled: true },
  { id: 'AC-017', tag: 'TT-402', alarmType: 'Lo', limitValue: 72, priority: 'high', deadband: 0.5, delay: 15, enabled: true },
  { id: 'AC-018', tag: 'TT-402', alarmType: 'Hi', limitValue: 78, priority: 'medium', deadband: 0.5, delay: 5, enabled: true },
  { id: 'AC-019', tag: 'LT-301', alarmType: 'HiHi', limitValue: 95, priority: 'critical', deadband: 1.0, delay: 0, enabled: true },
  { id: 'AC-020', tag: 'LT-301', alarmType: 'LoLo', limitValue: 5, priority: 'high', deadband: 1.0, delay: 5, enabled: false },
];

const priorityVariant: Record<AlarmPriority, 'critical' | 'high' | 'medium' | 'low'> = {
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
};

const emptyForm: Omit<AlarmCfg, 'id'> = { tag: '', alarmType: 'Hi', limitValue: 0, priority: 'medium', deadband: 0.5, delay: 5, enabled: true };

export default function AlarmConfigPage() {
  const [alarms, setAlarms] = useState<AlarmCfg[]>(initialAlarms);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlm, setEditingAlm] = useState<AlarmCfg | null>(null);
  const [form, setForm] = useState<Omit<AlarmCfg, 'id'>>(emptyForm);

  const filtered = alarms.filter((a) => a.tag.toLowerCase().includes(search.toLowerCase()) || a.alarmType.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditingAlm(null); setForm({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (alm: AlarmCfg) => { setEditingAlm(alm); setForm({ tag: alm.tag, alarmType: alm.alarmType, limitValue: alm.limitValue, priority: alm.priority, deadband: alm.deadband, delay: alm.delay, enabled: alm.enabled }); setModalOpen(true); };

  const saveAlarm = () => {
    if (editingAlm) { setAlarms((prev) => prev.map((a) => (a.id === editingAlm.id ? { ...a, ...form } : a))); }
    else { setAlarms((prev) => [...prev, { id: `AC-${++nextAlmId}`, ...form }]); }
    setModalOpen(false);
  };

  const columns = [
    { key: 'tag', header: 'Tag', sortable: true, width: '90px', render: (row: AlarmCfg) => <span className="font-mono text-nexaproc-green">{row.tag}</span> },
    { key: 'alarmType', header: 'Alarm Type', sortable: true, width: '100px', render: (row: AlarmCfg) => <span className="font-mono font-semibold text-white">{row.alarmType}</span> },
    { key: 'limitValue', header: 'Limit', sortable: true, width: '80px', render: (row: AlarmCfg) => <span className="font-mono">{row.limitValue}</span> },
    { key: 'priority', header: 'Priority', width: '100px', render: (row: AlarmCfg) => <Badge variant={priorityVariant[row.priority]}>{row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}</Badge> },
    { key: 'deadband', header: 'Deadband', width: '90px', render: (row: AlarmCfg) => <span className="font-mono text-white/60">{row.deadband}</span> },
    { key: 'delay', header: 'Delay (s)', width: '80px', render: (row: AlarmCfg) => <span className="font-mono text-white/60">{row.delay}</span> },
    { key: 'enabled', header: 'Enabled', width: '80px', render: (row: AlarmCfg) => <Badge variant={row.enabled ? 'success' : 'neutral'} dot>{row.enabled ? 'Yes' : 'No'}</Badge> },
    { key: 'actions', header: '', width: '50px', render: (row: AlarmCfg) => <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEdit(row); }} className="p-1.5 rounded text-white/40 hover:text-nexaproc-amber hover:bg-nexaproc-amber/10 transition-colors"><Edit3 size={14} /></button> },
  ];

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Alarm Configuration</h1><p className="text-sm text-white/50">{alarms.length} alarm configs across {new Set(alarms.map((a) => a.tag)).size} tags</p></div>
        <div className="flex items-center gap-2">
          <BellRing size={18} className="text-nexaproc-amber" />
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openAdd}>Add Alarm</Button>
        </div>
      </div>

      <Input icon={<Search size={16} />} placeholder="Search by tag or alarm type..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card noPadding><Table columns={columns} data={filtered} /></Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingAlm ? `Edit Alarm \u2014 ${editingAlm.tag} ${editingAlm.alarmType}` : 'Add Alarm Config'} footer={<><Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" size="sm" onClick={saveAlarm} disabled={!form.tag.trim()}>{editingAlm ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Tag" value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} placeholder="e.g. TT-101" />
            <Select label="Alarm Type" value={form.alarmType} onChange={(v) => setForm((f) => ({ ...f, alarmType: v as AlarmType }))} options={[{ value: 'HiHi', label: 'HiHi' }, { value: 'Hi', label: 'Hi' }, { value: 'Lo', label: 'Lo' }, { value: 'LoLo', label: 'LoLo' }]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Limit Value" type="number" value={String(form.limitValue)} onChange={(e) => setForm((f) => ({ ...f, limitValue: Number(e.target.value) }))} />
            <Select label="Priority" value={form.priority} onChange={(v) => setForm((f) => ({ ...f, priority: v as AlarmPriority }))} options={[{ value: 'critical', label: 'Critical' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Deadband" type="number" value={String(form.deadband)} onChange={(e) => setForm((f) => ({ ...f, deadband: Number(e.target.value) }))} />
            <Input label="Delay (seconds)" type="number" value={String(form.delay)} onChange={(e) => setForm((f) => ({ ...f, delay: Number(e.target.value) }))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} className="w-4 h-4 rounded border-scada-border bg-scada-panel accent-nexaproc-green" />
            <span className="text-sm text-white/70">{form.enabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}
