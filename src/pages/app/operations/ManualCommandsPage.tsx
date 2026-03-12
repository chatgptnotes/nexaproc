import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { AlertTriangle, Power, Zap, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
interface EquipmentItem {
  id: string;
  name: string;
  type: 'valve' | 'motor' | 'pump';
  state: string;
  tags: { label: string; value: string; unit: string }[];
}

const equipmentList: EquipmentItem[] = [
  { id: 'XV-101', name: 'Granulator Discharge Valve', type: 'valve', state: 'Closed', tags: [{ label: 'Position', value: '0', unit: '%' }, { label: 'Feedback', value: 'Closed', unit: '' }, { label: 'Interlock', value: 'Clear', unit: '' }] },
  { id: 'XV-102', name: 'Coating Pan Inlet Valve', type: 'valve', state: 'Open', tags: [{ label: 'Position', value: '100', unit: '%' }, { label: 'Feedback', value: 'Open', unit: '' }, { label: 'Interlock', value: 'Clear', unit: '' }] },
  { id: 'XV-201', name: 'CIP Return Valve', type: 'valve', state: 'Closed', tags: [{ label: 'Position', value: '0', unit: '%' }, { label: 'Feedback', value: 'Closed', unit: '' }, { label: 'Interlock', value: 'Clear', unit: '' }] },
  { id: 'M-101', name: 'Granulator Impeller Motor', type: 'motor', state: 'Running', tags: [{ label: 'Speed', value: '1450', unit: 'RPM' }, { label: 'Current', value: '12.8', unit: 'A' }, { label: 'Run Hours', value: '4820', unit: 'h' }] },
  { id: 'M-102', name: 'Tablet Press Main Motor', type: 'motor', state: 'Running', tags: [{ label: 'Speed', value: '62', unit: 'RPM' }, { label: 'Current', value: '45.2', unit: 'A' }, { label: 'Run Hours', value: '3600', unit: 'h' }] },
  { id: 'P-101', name: 'Granulation Spray Pump', type: 'pump', state: 'Running', tags: [{ label: 'Flow', value: '12.8', unit: 'L/min' }, { label: 'Discharge Press.', value: '2.4', unit: 'bar' }, { label: 'Run Hours', value: '3150', unit: 'h' }] },
  { id: 'P-108', name: 'CIP Return Pump', type: 'pump', state: 'Stopped', tags: [{ label: 'Flow', value: '0', unit: 'L/min' }, { label: 'Discharge Press.', value: '0', unit: 'bar' }, { label: 'Run Hours', value: '3800', unit: 'h' }] },
];

interface CommandLogEntry {
  id: number;
  timestamp: string;
  equipment: string;
  command: string;
  operator: string;
  result: 'success' | 'failed';
}

const fmtNow = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

const initialLog: CommandLogEntry[] = [
  { id: 10, timestamp: '08:12:45', equipment: 'XV-102', command: 'OPEN', operator: 'ops_johnson', result: 'success' },
  { id: 9, timestamp: '08:10:22', equipment: 'M-101', command: 'START', operator: 'ops_johnson', result: 'success' },
  { id: 8, timestamp: '07:55:01', equipment: 'P-101', command: 'START', operator: 'ops_johnson', result: 'success' },
  { id: 7, timestamp: '07:50:33', equipment: 'XV-101', command: 'CLOSE', operator: 'ops_martinez', result: 'success' },
  { id: 6, timestamp: '07:45:10', equipment: 'P-108', command: 'START', operator: 'ops_chen', result: 'failed' },
  { id: 5, timestamp: '07:30:08', equipment: 'M-102', command: 'START', operator: 'ops_johnson', result: 'success' },
];

export default function ManualCommandsPage() {
  const [selectedEquipId, setSelectedEquipId] = useState<string>(equipmentList[0].id);
  const [commandLog, setCommandLog] = useState<CommandLogEntry[]>(initialLog);
  const [confirmModal, setConfirmModal] = useState<{ command: string; equip: EquipmentItem } | null>(null);
  const [nextId, setNextId] = useState(11);

  const selectedEquip = equipmentList.find((e) => e.id === selectedEquipId) ?? equipmentList[0];

  const executeCommand = useCallback(() => {
    if (!confirmModal) return;
    const entry: CommandLogEntry = {
      id: nextId,
      timestamp: fmtNow(),
      equipment: confirmModal.equip.id,
      command: confirmModal.command,
      operator: 'ops_johnson',
      result: 'success',
    };
    setCommandLog((prev) => [entry, ...prev].slice(0, 10));
    setNextId((n) => n + 1);
    setConfirmModal(null);
  }, [confirmModal, nextId]);

  const commands = selectedEquip.type === 'valve' ? ['OPEN', 'CLOSE'] : ['START', 'STOP'];

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Safety warning */}
      <div className="flex items-center gap-3 rounded-lg border border-alarm-high/40 bg-alarm-high/10 px-4 py-3">
        <AlertTriangle size={20} className="text-alarm-high flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-alarm-high">Manual Command Mode</p>
          <p className="text-xs text-alarm-high/70">Manual commands bypass automatic control. Ensure equipment is safe to operate before issuing commands.</p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-bold text-white">Manual Command</h1>
        <p className="text-sm text-white/50">Direct equipment control interface</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Card title="Equipment Selection">
            <Select
              label="Select Equipment"
              options={equipmentList.map((e) => ({ value: e.id, label: `${e.id} \u2014 ${e.name}` }))}
              value={selectedEquipId}
              onChange={(v) => setSelectedEquipId(v)}
            />
          </Card>

          <Card title={`${selectedEquip.id} \u2014 ${selectedEquip.name}`} subtitle={`Type: ${selectedEquip.type.charAt(0).toUpperCase() + selectedEquip.type.slice(1)}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-white/50">Current State:</span>
              <Badge variant={selectedEquip.state === 'Running' || selectedEquip.state === 'Open' ? 'success' : 'neutral'} dot pulse={selectedEquip.state === 'Running'}>
                {selectedEquip.state}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {selectedEquip.tags.map((tag) => (
                <div key={tag.label} className="rounded-lg border border-scada-border bg-scada-dark/40 p-3">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{tag.label}</p>
                  <p className="text-lg font-bold font-mono text-white mt-1">
                    {tag.value}
                    {tag.unit && <span className="text-xs text-white/40 ml-1">{tag.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Command Panel">
            <div className="flex flex-wrap gap-3">
              {commands.map((cmd) => {
                const isDanger = cmd === 'STOP' || cmd === 'CLOSE';
                return (
                  <Button key={cmd} variant={isDanger ? 'danger' : 'secondary'} size="lg" icon={cmd === 'START' || cmd === 'OPEN' ? <Power size={18} /> : <Zap size={18} />} onClick={() => setConfirmModal({ command: cmd, equip: selectedEquip })}>
                    {cmd}
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <Card title="Command History" subtitle="Last 10 commands">
            <div className="space-y-2">
              {commandLog.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 rounded-lg border border-scada-border/50 bg-scada-dark/30 p-2.5">
                  <div className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', entry.result === 'success' ? 'bg-status-running' : 'bg-alarm-critical')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-white">{entry.equipment} \u2014 {entry.command}</span>
                      <Badge variant={entry.result === 'success' ? 'success' : 'danger'}>{entry.result}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/40">
                      <Clock size={10} />
                      <span className="font-mono">{entry.timestamp}</span>
                      <span>by {entry.operator}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={!!confirmModal} onClose={() => setConfirmModal(null)} title="Confirm Manual Command" footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setConfirmModal(null)}>Cancel</Button>
          <Button variant={confirmModal?.command === 'STOP' || confirmModal?.command === 'CLOSE' ? 'danger' : 'primary'} size="sm" onClick={executeCommand}>
            Confirm {confirmModal?.command}
          </Button>
        </>
      }>
        {confirmModal && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-alarm-high/30 bg-alarm-high/10 p-3">
              <AlertTriangle size={18} className="text-alarm-high" />
              <p className="text-sm text-alarm-high">This action will {confirmModal.command.toLowerCase()} equipment in manual mode.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-white/40 text-xs">Equipment</span><p className="text-white font-mono">{confirmModal.equip.id}</p></div>
              <div><span className="text-white/40 text-xs">Command</span><p className="text-white font-semibold">{confirmModal.command}</p></div>
              <div><span className="text-white/40 text-xs">Name</span><p className="text-white">{confirmModal.equip.name}</p></div>
              <div><span className="text-white/40 text-xs">Operator</span><p className="text-white">ops_johnson</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
