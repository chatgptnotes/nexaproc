import React, { useState } from 'react';
import clsx from 'clsx';
import { Building2, ChevronRight, ChevronDown, Plus, Edit3, Factory, Layers, Box } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface CellNode { id: string; name: string; status: string; }
interface ZoneNode { id: string; name: string; cells: CellNode[]; }
interface LineNode { id: string; name: string; status: string; zones: ZoneNode[]; }
interface PlantNode { id: string; name: string; code: string; status: string; address: string; lines: LineNode[]; }

type SelectedNode = { type: 'plant'; data: PlantNode } | { type: 'line'; data: LineNode; plantId: string } | { type: 'zone'; data: ZoneNode; lineId: string } | { type: 'cell'; data: CellNode; zoneId: string };

let nextNodeId = 500;

const initialPlants: PlantNode[] = [
  {
    id: 'plant-001', name: 'Pharma Plant Alpha', code: 'PPA', status: 'online', address: '1200 Innovation Drive, NC',
    lines: [
      { id: 'line-ppa-01', name: 'Oral Solid Dosage', status: 'running', zones: [
        { id: 'zone-ppa-01-01', name: 'Granulation', cells: [{ id: 'c-01', name: 'High-Shear Granulator', status: 'active' }, { id: 'c-02', name: 'Fluid Bed Dryer', status: 'active' }, { id: 'c-03', name: 'Milling Unit', status: 'idle' }] },
        { id: 'zone-ppa-01-02', name: 'Compression', cells: [{ id: 'c-04', name: 'Tablet Press A', status: 'active' }, { id: 'c-05', name: 'Tablet Press B', status: 'maintenance' }] },
        { id: 'zone-ppa-01-03', name: 'Coating', cells: [{ id: 'c-06', name: 'Film Coating Pan', status: 'active' }] },
      ]},
      { id: 'line-ppa-02', name: 'Injectable Line', status: 'running', zones: [
        { id: 'zone-ppa-02-01', name: 'Preparation', cells: [{ id: 'c-07', name: 'Mixing Vessel MV-101', status: 'active' }] },
        { id: 'zone-ppa-02-02', name: 'Filling & Stoppering', cells: [{ id: 'c-08', name: 'Vial Filling Machine', status: 'active' }] },
      ]},
    ],
  },
  {
    id: 'plant-002', name: 'Food Processing Beta', code: 'FPB', status: 'online', address: '3400 Midwest Blvd, OH',
    lines: [
      { id: 'line-fpb-01', name: 'Dairy Processing', status: 'running', zones: [
        { id: 'zone-fpb-01-01', name: 'Reception & Pasteurization', cells: [{ id: 'c-09', name: 'Raw Milk Silo S-101', status: 'active' }, { id: 'c-10', name: 'HTST Pasteurizer', status: 'active' }] },
        { id: 'zone-fpb-01-02', name: 'Fermentation', cells: [{ id: 'c-11', name: 'Fermentation Vessel FV-101', status: 'active' }] },
      ]},
      { id: 'line-fpb-02', name: 'Beverage Line', status: 'running', zones: [
        { id: 'zone-fpb-02-01', name: 'Syrup Preparation', cells: [{ id: 'c-12', name: 'Sugar Dissolving Tank', status: 'active' }] },
      ]},
    ],
  },
  {
    id: 'plant-003', name: 'Textile Mill Gamma', code: 'TMG', status: 'partial', address: '780 Cotton Mill Rd, SC',
    lines: [
      { id: 'line-tmg-01', name: 'Weaving', status: 'running', zones: [
        { id: 'zone-tmg-01-01', name: 'Warping', cells: [{ id: 'c-13', name: 'Warping Machine WM-101', status: 'active' }] },
        { id: 'zone-tmg-01-02', name: 'Loom Floor', cells: [{ id: 'c-14', name: 'AJL-101', status: 'active' }, { id: 'c-15', name: 'AJL-103', status: 'fault' }] },
      ]},
      { id: 'line-tmg-02', name: 'Dyeing & Finishing', status: 'stopped', zones: [
        { id: 'zone-tmg-02-01', name: 'Dyeing', cells: [{ id: 'c-16', name: 'Jet Dyeing JD-201', status: 'maintenance' }] },
      ]},
    ],
  },
];

const statusVariant: Record<string, 'success' | 'neutral' | 'danger' | 'warning' | 'info'> = {
  online: 'success', running: 'success', active: 'success', offline: 'neutral', stopped: 'neutral', idle: 'neutral', partial: 'warning', maintenance: 'info', fault: 'danger', changeover: 'warning',
};

export default function PlantConfigPage() {
  const [plants, setPlants] = useState<PlantNode[]>(initialPlants);
  const [expanded, setExpanded] = useState<Set<string>>(new Set([initialPlants[0].id]));
  const [selected, setSelected] = useState<SelectedNode | null>(null);
  const [addModal, setAddModal] = useState<{ parentType: string; parentId: string } | null>(null);
  const [newName, setNewName] = useState('');

  const toggle = (id: string) => {
    setExpanded((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const addChild = () => {
    if (!addModal || !newName.trim()) return;
    const id = `node-${++nextNodeId}`;
    setPlants((prev) => prev.map((p) => {
      if (addModal.parentType === 'plant' && p.id === addModal.parentId) {
        return { ...p, lines: [...p.lines, { id, name: newName, status: 'stopped', zones: [] }] };
      }
      return {
        ...p,
        lines: p.lines.map((l) => {
          if (addModal.parentType === 'line' && l.id === addModal.parentId) {
            return { ...l, zones: [...l.zones, { id, name: newName, cells: [] }] };
          }
          return {
            ...l,
            zones: l.zones.map((z) => {
              if (addModal.parentType === 'zone' && z.id === addModal.parentId) {
                return { ...z, cells: [...z.cells, { id, name: newName, status: 'idle' }] };
              }
              return z;
            }),
          };
        }),
      };
    }));
    setAddModal(null);
    setNewName('');
  };

  const TreeItem: React.FC<{ icon: React.ReactNode; label: string; status?: string; level: number; hasChildren: boolean; isExpanded: boolean; onToggle: () => void; onClick: () => void; onAdd?: () => void }> = ({ icon, label, status, level, hasChildren, isExpanded, onToggle, onClick, onAdd }) => (
    <div className={clsx('flex items-center gap-1 py-1 px-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group')} style={{ paddingLeft: `${level * 16 + 8}px` }}>
      {hasChildren ? (
        <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="p-0.5 text-white/30 hover:text-white/60">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      ) : <span className="w-5" />}
      <button onClick={onClick} className="flex items-center gap-2 flex-1 min-w-0 text-left">
        <span className="text-nexaproc-green/60">{icon}</span>
        <span className="text-sm text-white/80 truncate">{label}</span>
        {status && <Badge variant={statusVariant[status] ?? 'neutral'}>{status}</Badge>}
      </button>
      {onAdd && <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="opacity-0 group-hover:opacity-100 p-0.5 text-white/30 hover:text-nexaproc-amber transition-all"><Plus size={14} /></button>}
    </div>
  );

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Plant Configuration</h1><p className="text-sm text-white/50">Plant hierarchy editor</p></div>
        <Building2 size={20} className="text-nexaproc-amber" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tree */}
        <div className="col-span-12 lg:col-span-5">
          <Card title="Plant Hierarchy" subtitle="Plants \u2192 Lines \u2192 Zones \u2192 Cells">
            <div className="space-y-0.5 max-h-[600px] overflow-y-auto">
              {plants.map((plant) => (
                <div key={plant.id}>
                  <TreeItem icon={<Building2 size={14} />} label={plant.name} status={plant.status} level={0} hasChildren={plant.lines.length > 0} isExpanded={expanded.has(plant.id)} onToggle={() => toggle(plant.id)} onClick={() => setSelected({ type: 'plant', data: plant })} onAdd={() => { setAddModal({ parentType: 'plant', parentId: plant.id }); setNewName(''); }} />
                  {expanded.has(plant.id) && plant.lines.map((line) => (
                    <div key={line.id}>
                      <TreeItem icon={<Factory size={14} />} label={line.name} status={line.status} level={1} hasChildren={line.zones.length > 0} isExpanded={expanded.has(line.id)} onToggle={() => toggle(line.id)} onClick={() => setSelected({ type: 'line', data: line, plantId: plant.id })} onAdd={() => { setAddModal({ parentType: 'line', parentId: line.id }); setNewName(''); }} />
                      {expanded.has(line.id) && line.zones.map((zone) => (
                        <div key={zone.id}>
                          <TreeItem icon={<Layers size={14} />} label={zone.name} level={2} hasChildren={zone.cells.length > 0} isExpanded={expanded.has(zone.id)} onToggle={() => toggle(zone.id)} onClick={() => setSelected({ type: 'zone', data: zone, lineId: line.id })} onAdd={() => { setAddModal({ parentType: 'zone', parentId: zone.id }); setNewName(''); }} />
                          {expanded.has(zone.id) && zone.cells.map((cell) => (
                            <TreeItem key={cell.id} icon={<Box size={14} />} label={cell.name} status={cell.status} level={3} hasChildren={false} isExpanded={false} onToggle={() => {}} onClick={() => setSelected({ type: 'cell', data: cell, zoneId: zone.id })} />
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Properties */}
        <div className="col-span-12 lg:col-span-7">
          <Card title="Properties" subtitle={selected ? `${selected.type.charAt(0).toUpperCase() + selected.type.slice(1)} properties` : 'Select a node'}>
            {!selected ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-sm text-white/30">Select a node from the tree to view properties</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-[10px] text-white/40 uppercase tracking-wider">Type</span><p className="text-white mt-0.5">{selected.type.charAt(0).toUpperCase() + selected.type.slice(1)}</p></div>
                  <div><span className="text-[10px] text-white/40 uppercase tracking-wider">ID</span><p className="text-white font-mono mt-0.5">{selected.data.id}</p></div>
                  <div><span className="text-[10px] text-white/40 uppercase tracking-wider">Name</span><p className="text-white mt-0.5">{selected.data.name}</p></div>
                  {'status' in selected.data && (
                    <div><span className="text-[10px] text-white/40 uppercase tracking-wider">Status</span><p className="mt-0.5"><Badge variant={statusVariant[selected.data.status as string] ?? 'neutral'}>{selected.data.status as string}</Badge></p></div>
                  )}
                  {selected.type === 'plant' && (
                    <>
                      <div><span className="text-[10px] text-white/40 uppercase tracking-wider">Code</span><p className="text-white font-mono mt-0.5">{(selected.data as PlantNode).code}</p></div>
                      <div><span className="text-[10px] text-white/40 uppercase tracking-wider">Address</span><p className="text-white text-xs mt-0.5">{(selected.data as PlantNode).address}</p></div>
                    </>
                  )}
                </div>
                {selected.type === 'plant' && (
                  <div><span className="text-[10px] text-white/40 uppercase tracking-wider">Production Lines</span><p className="text-white mt-0.5">{(selected.data as PlantNode).lines.length} lines</p></div>
                )}
                {selected.type === 'line' && (
                  <div><span className="text-[10px] text-white/40 uppercase tracking-wider">Process Zones</span><p className="text-white mt-0.5">{(selected.data as LineNode).zones.length} zones</p></div>
                )}
                {selected.type === 'zone' && (
                  <div><span className="text-[10px] text-white/40 uppercase tracking-wider">Process Cells</span><p className="text-white mt-0.5">{(selected.data as ZoneNode).cells.length} cells</p></div>
                )}
                <Button variant="secondary" size="sm" icon={<Edit3 size={14} />}>Edit Properties</Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal open={!!addModal} onClose={() => setAddModal(null)} title={addModal ? `Add ${addModal.parentType === 'plant' ? 'Production Line' : addModal.parentType === 'line' ? 'Process Zone' : 'Process Cell'}` : ''} footer={<><Button variant="ghost" size="sm" onClick={() => setAddModal(null)}>Cancel</Button><Button variant="primary" size="sm" onClick={addChild} disabled={!newName.trim()}>Add</Button></>}>
        <Input label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter name..." />
      </Modal>
    </div>
  );
}
