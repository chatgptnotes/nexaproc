import React, { useState } from 'react';
import clsx from 'clsx';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Thermometer,
  Gauge,
  RotateCcw,
  ChevronRight,
  Save,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */
interface RecipePhaseLocal {
  id: string;
  name: string;
  duration: number;
  temperature: number;
  pressure: number;
  agitationSpeed: number;
}

interface RecipeLocal {
  id: string;
  name: string;
  version: string;
  product: string;
  description: string;
  phases: RecipePhaseLocal[];
}

let nextPhaseId = 100;

const initialRecipes: RecipeLocal[] = [
  {
    id: 'RCP-001',
    name: 'Tablet Coating',
    version: '3.2',
    product: 'Ibuprofen 200mg Coated',
    description: 'Aqueous film coating for oral solid dosage tablets',
    phases: [
      { id: 'ph-01', name: 'Pre-Heat', duration: 25, temperature: 50, pressure: 1.0, agitationSpeed: 8 },
      { id: 'ph-02', name: 'Spray Application', duration: 45, temperature: 42, pressure: 2.5, agitationSpeed: 12 },
      { id: 'ph-03', name: 'Drying', duration: 30, temperature: 55, pressure: 1.0, agitationSpeed: 10 },
      { id: 'ph-04', name: 'Cooling', duration: 20, temperature: 25, pressure: 1.0, agitationSpeed: 6 },
      { id: 'ph-05', name: 'Discharge', duration: 5, temperature: 25, pressure: 0.0, agitationSpeed: 0 },
    ],
  },
  {
    id: 'RCP-002',
    name: 'Fermentation Batch',
    version: '2.1',
    product: 'Yoghurt Culture YC-44',
    description: 'Controlled fermentation with pH and temperature ramps',
    phases: [
      { id: 'ph-06', name: 'Inoculation', duration: 60, temperature: 37, pressure: 0.5, agitationSpeed: 30 },
      { id: 'ph-07', name: 'Growth Phase', duration: 360, temperature: 43, pressure: 0.5, agitationSpeed: 20 },
      { id: 'ph-08', name: 'Harvest', duration: 45, temperature: 10, pressure: 0.2, agitationSpeed: 5 },
      { id: 'ph-09', name: 'CIP', duration: 30, temperature: 80, pressure: 2.0, agitationSpeed: 0 },
    ],
  },
  {
    id: 'RCP-003',
    name: 'CIP Cycle',
    version: '1.5',
    product: 'N/A \u2014 Cleaning',
    description: 'Standard Clean-In-Place cycle for production vessels',
    phases: [
      { id: 'ph-10', name: 'Pre-Rinse', duration: 15, temperature: 60, pressure: 2.0, agitationSpeed: 0 },
      { id: 'ph-11', name: 'Caustic Wash', duration: 30, temperature: 80, pressure: 3.0, agitationSpeed: 0 },
      { id: 'ph-12', name: 'Acid Wash', duration: 25, temperature: 70, pressure: 2.5, agitationSpeed: 0 },
      { id: 'ph-13', name: 'Final Rinse', duration: 20, temperature: 50, pressure: 2.0, agitationSpeed: 0 },
    ],
  },
  {
    id: 'RCP-004',
    name: 'Pasteurization',
    version: '4.0',
    product: 'Whole Milk 3.5%',
    description: 'HTST pasteurization at 72\u00b0C for 15 seconds hold time',
    phases: [
      { id: 'ph-14', name: 'Pre-Heat', duration: 10, temperature: 55, pressure: 3.0, agitationSpeed: 0 },
      { id: 'ph-15', name: 'Heating', duration: 5, temperature: 72, pressure: 3.5, agitationSpeed: 0 },
      { id: 'ph-16', name: 'Holding', duration: 1, temperature: 72, pressure: 3.5, agitationSpeed: 0 },
      { id: 'ph-17', name: 'Cooling', duration: 8, temperature: 4, pressure: 3.0, agitationSpeed: 0 },
    ],
  },
  {
    id: 'RCP-005',
    name: 'Mixing Protocol',
    version: '1.8',
    product: 'Granulation Blend GB-12',
    description: 'High-shear wet granulation mixing sequence',
    phases: [
      { id: 'ph-18', name: 'Dry Mix', duration: 10, temperature: 25, pressure: 0.0, agitationSpeed: 200 },
      { id: 'ph-19', name: 'Binder Addition', duration: 15, temperature: 30, pressure: 1.5, agitationSpeed: 400 },
      { id: 'ph-20', name: 'Wet Granulation', duration: 20, temperature: 35, pressure: 2.0, agitationSpeed: 800 },
      { id: 'ph-21', name: 'End-Point Check', duration: 5, temperature: 35, pressure: 1.0, agitationSpeed: 100 },
    ],
  },
];

const emptyPhase: Omit<RecipePhaseLocal, 'id'> = {
  name: '',
  duration: 10,
  temperature: 25,
  pressure: 1.0,
  agitationSpeed: 0,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeLocal[]>(initialRecipes);
  const [selectedId, setSelectedId] = useState<string>(initialRecipes[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<RecipePhaseLocal | null>(null);
  const [phaseForm, setPhaseForm] = useState<Omit<RecipePhaseLocal, 'id'>>(emptyPhase);

  const selected = recipes.find((r) => r.id === selectedId) ?? recipes[0];

  const openAddPhase = () => {
    setEditingPhase(null);
    setPhaseForm({ ...emptyPhase });
    setModalOpen(true);
  };

  const openEditPhase = (phase: RecipePhaseLocal) => {
    setEditingPhase(phase);
    setPhaseForm({
      name: phase.name,
      duration: phase.duration,
      temperature: phase.temperature,
      pressure: phase.pressure,
      agitationSpeed: phase.agitationSpeed,
    });
    setModalOpen(true);
  };

  const savePhase = () => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== selectedId) return r;
        if (editingPhase) {
          return { ...r, phases: r.phases.map((p) => (p.id === editingPhase.id ? { ...p, ...phaseForm } : p)) };
        }
        return { ...r, phases: [...r.phases, { id: `ph-gen-${++nextPhaseId}`, ...phaseForm }] };
      }),
    );
    setModalOpen(false);
  };

  const deletePhase = (phaseId: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id !== selectedId ? r : { ...r, phases: r.phases.filter((p) => p.id !== phaseId) })),
    );
  };

  const totalDuration = selected.phases.reduce((s, p) => s + p.duration, 0);

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Recipe Editor</h1>
          <p className="text-sm text-white/50">ISA-88 recipe management</p>
        </div>
        <Button variant="primary" size="sm" icon={<Save size={14} />}>Save All</Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: recipe list */}
        <div className="col-span-12 lg:col-span-4">
          <Card title="Recipes" subtitle={`${recipes.length} recipes`}>
            <div className="space-y-2">
              {recipes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={clsx(
                    'w-full text-left rounded-lg border p-3 transition-all',
                    r.id === selectedId
                      ? 'border-nexaproc-amber/50 bg-nexaproc-amber/5'
                      : 'border-scada-border bg-scada-dark/40 hover:border-scada-border-hover',
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{r.name}</span>
                    <ChevronRight size={14} className="text-white/30" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="font-mono">v{r.version}</span>
                    <span>{r.phases.length} phases</span>
                  </div>
                  <p className="text-xs text-white/30 mt-1 truncate">{r.product}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: recipe detail */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-nexaproc-amber" />
                  <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                  <span className="text-xs font-mono text-white/40 bg-scada-dark/60 rounded px-2 py-0.5">v{selected.version}</span>
                </div>
                <p className="text-sm text-white/50 mt-1">{selected.description}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Clock size={14} />
                <span className="font-mono">{totalDuration} min</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-scada-border bg-scada-dark/40 p-3">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Product</span>
                <p className="text-white mt-0.5">{selected.product}</p>
              </div>
              <div className="rounded-lg border border-scada-border bg-scada-dark/40 p-3">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Recipe ID</span>
                <p className="text-white font-mono mt-0.5">{selected.id}</p>
              </div>
            </div>
          </Card>

          <Card
            title="Phase Timeline"
            subtitle={`${selected.phases.length} phases`}
            headerAction={
              <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={openAddPhase}>Add Phase</Button>
            }
          >
            <div className="relative ml-4 border-l-2 border-scada-border space-y-0">
              {selected.phases.map((phase, idx) => (
                <div key={phase.id} className="relative pl-8 pb-6 last:pb-0 group">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-nexaproc-green bg-scada-dark flex items-center justify-center">
                    <span className="text-[8px] font-bold text-nexaproc-green">{idx + 1}</span>
                  </div>
                  <div className="rounded-lg border border-scada-border bg-scada-dark/40 p-4 transition-colors hover:border-scada-border-hover">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white">{phase.name}</h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditPhase(phase)} className="p-1 rounded text-white/40 hover:text-nexaproc-amber hover:bg-nexaproc-amber/10 transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => deletePhase(phase.id)} className="p-1 rounded text-white/40 hover:text-alarm-critical hover:bg-alarm-critical/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-white/60">
                        <Clock size={12} className="text-nexaproc-amber" />
                        <span>{phase.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/60">
                        <Thermometer size={12} className="text-alarm-critical" />
                        <span>{phase.temperature} \u00b0C</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/60">
                        <Gauge size={12} className="text-status-maintenance" />
                        <span>{phase.pressure} bar</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/60">
                        <RotateCcw size={12} className="text-nexaproc-green" />
                        <span>{phase.agitationSpeed} RPM</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPhase ? 'Edit Phase' : 'Add Phase'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={savePhase} disabled={!phaseForm.name.trim()}>
              {editingPhase ? 'Update' : 'Add'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Phase Name" value={phaseForm.name} onChange={(e) => setPhaseForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Heating Ramp" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Duration (min)" type="number" value={String(phaseForm.duration)} onChange={(e) => setPhaseForm((f) => ({ ...f, duration: Number(e.target.value) }))} />
            <Input label="Temperature (\u00b0C)" type="number" value={String(phaseForm.temperature)} onChange={(e) => setPhaseForm((f) => ({ ...f, temperature: Number(e.target.value) }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Pressure (bar)" type="number" value={String(phaseForm.pressure)} onChange={(e) => setPhaseForm((f) => ({ ...f, pressure: Number(e.target.value) }))} />
            <Input label="Agitation (RPM)" type="number" value={String(phaseForm.agitationSpeed)} onChange={(e) => setPhaseForm((f) => ({ ...f, agitationSpeed: Number(e.target.value) }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
