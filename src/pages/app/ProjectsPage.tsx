import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Factory,
  MapPin,
  Clock,
  MoreVertical,
  Trash2,
  Edit3,
  Copy,
  FolderOpen,
  Search,
  LayoutGrid,
  List,
  FlaskConical,
  Wheat,
  Shirt,
  Car,
  Pill,
  Droplets,
  Zap,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Card, Button, Input, Modal, Badge, Select } from '@/components/ui';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Project {
  id: string;
  name: string;
  code: string;
  industry: string;
  description: string;
  location: string;
  status: 'active' | 'setup' | 'archived' | 'offline';
  createdAt: string;
  updatedAt: string;
  linesCount: number;
  tagsCount: number;
  equipmentCount: number;
  oee: number | null;
  thumbnail: string;
}

const INDUSTRY_OPTIONS = [
  { value: 'pharma', label: 'Pharmaceutical & Biotech' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'textile', label: 'Textile & Apparel' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'chemical', label: 'Chemical Processing' },
  { value: 'water', label: 'Water & Wastewater' },
  { value: 'energy', label: 'Energy & Power' },
  { value: 'general', label: 'General Manufacturing' },
];

const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  pharma: <FlaskConical size={20} />,
  food: <Wheat size={20} />,
  textile: <Shirt size={20} />,
  automotive: <Car size={20} />,
  chemical: <Droplets size={20} />,
  water: <Droplets size={20} />,
  energy: <Zap size={20} />,
  general: <Factory size={20} />,
};

const INDUSTRY_COLORS: Record<string, string> = {
  pharma: '#8b5cf6',
  food: '#f59e0b',
  textile: '#ec4899',
  automotive: '#3b82f6',
  chemical: '#06b6d4',
  water: '#0ea5e9',
  energy: '#eab308',
  general: '#4ade80',
};

const TEMPLATES = [
  { id: 'blank', name: 'Blank Project', description: 'Start from scratch', icon: <Plus size={24} /> },
  { id: 'pharma-osd', name: 'Pharma — Oral Solid Dosage', description: 'Granulation, compression, coating, packaging', icon: <Pill size={24} /> },
  { id: 'pharma-inject', name: 'Pharma — Injectable Line', description: 'Preparation, filling, lyophilization, inspection', icon: <FlaskConical size={24} /> },
  { id: 'food-dairy', name: 'Food — Dairy Processing', description: 'Reception, pasteurization, fermentation, packaging', icon: <Wheat size={24} /> },
  { id: 'food-beverage', name: 'Food — Beverage Line', description: 'Syrup prep, mixing, carbonation, filling', icon: <Droplets size={24} /> },
  { id: 'textile-weave', name: 'Textile — Weaving Mill', description: 'Warping, sizing, weaving, inspection', icon: <Shirt size={24} /> },
  { id: 'auto-assembly', name: 'Automotive — Assembly', description: 'Body shop, paint, assembly, quality gates', icon: <Car size={24} /> },
  { id: 'water-treatment', name: 'Water Treatment Plant', description: 'Intake, treatment, storage, distribution', icon: <Droplets size={24} /> },
];

/* ------------------------------------------------------------------ */
/*  Mock projects                                                      */
/* ------------------------------------------------------------------ */
const initialProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Pharma Plant Alpha',
    code: 'PPA',
    industry: 'pharma',
    description: 'FDA-compliant pharmaceutical manufacturing facility with OSD and injectable lines',
    location: 'Hyderabad, India',
    status: 'active',
    createdAt: '2025-08-15',
    updatedAt: '2026-03-12',
    linesCount: 3,
    tagsCount: 1247,
    equipmentCount: 86,
    oee: 94.2,
    thumbnail: '',
  },
  {
    id: 'proj-002',
    name: 'Food Processing Beta',
    code: 'FPB',
    industry: 'food',
    description: 'FSMA-compliant dairy processing and beverage manufacturing',
    location: 'Pune, India',
    status: 'active',
    createdAt: '2025-11-02',
    updatedAt: '2026-03-11',
    linesCount: 2,
    tagsCount: 834,
    equipmentCount: 52,
    oee: 91.7,
    thumbnail: '',
  },
  {
    id: 'proj-003',
    name: 'Textile Mill Gamma',
    code: 'TMG',
    industry: 'textile',
    description: 'Integrated weaving and dyeing & finishing operations',
    location: 'Coimbatore, India',
    status: 'setup',
    createdAt: '2026-02-20',
    updatedAt: '2026-03-10',
    linesCount: 2,
    tagsCount: 312,
    equipmentCount: 28,
    oee: null,
    thumbnail: '',
  },
];

/* ------------------------------------------------------------------ */
/*  Wizard Steps                                                       */
/* ------------------------------------------------------------------ */
type WizardStep = 'template' | 'details' | 'confirm';

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  active: 'success',
  setup: 'warning',
  archived: 'neutral',
  offline: 'danger',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [newProject, setNewProject] = useState({
    name: '',
    code: '',
    industry: 'general',
    description: '',
    location: '',
  });

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.industry.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()),
  );

  const openWizard = () => {
    setWizardStep('template');
    setSelectedTemplate('blank');
    setNewProject({ name: '', code: '', industry: 'general', description: '', location: '' });
    setWizardOpen(true);
  };

  const createProject = () => {
    const id = `proj-${Date.now()}`;
    const tpl = TEMPLATES.find((t) => t.id === selectedTemplate);
    const now = new Date().toISOString().split('T')[0];
    const proj: Project = {
      id,
      name: newProject.name,
      code: newProject.code.toUpperCase(),
      industry: newProject.industry,
      description: newProject.description || (tpl?.description ?? ''),
      location: newProject.location,
      status: 'setup',
      createdAt: now,
      updatedAt: now,
      linesCount: 0,
      tagsCount: 0,
      equipmentCount: 0,
      oee: null,
      thumbnail: '',
    };
    setProjects((prev) => [proj, ...prev]);
    setWizardOpen(false);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setMenuOpen(null);
  };

  const duplicateProject = (p: Project) => {
    const id = `proj-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    setProjects((prev) => [
      { ...p, id, name: `${p.name} (Copy)`, code: `${p.code}2`, status: 'setup', createdAt: now, updatedAt: now, oee: null },
      ...prev,
    ]);
    setMenuOpen(null);
  };

  const openProject = (id: string) => {
    navigate(`/app/projects/${id}/screens`);
  };

  const canProceedDetails = newProject.name.trim().length >= 2 && newProject.code.trim().length >= 2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Factory className="w-7 h-7 text-nexaproc-amber" />
            Projects
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Create and manage your plant SCADA projects
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={openWizard}>
          New Project
        </Button>
      </div>

      {/* Search & View Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search projects..."
            icon={<Search size={15} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center border border-scada-border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-nexaproc-amber/15 text-nexaproc-amber' : 'text-white/40 hover:text-white/70'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-nexaproc-amber/15 text-nexaproc-amber' : 'text-white/40 hover:text-white/70'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Project Count */}
      <div className="flex items-center gap-4 text-xs text-white/40">
        <span>{filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
        <span>{projects.filter((p) => p.status === 'active').length} active</span>
        <span>{projects.filter((p) => p.status === 'setup').length} in setup</span>
      </div>

      {/* Grid / List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Create New Project Card */}
          <button
            onClick={openWizard}
            className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-scada-border hover:border-nexaproc-amber/40 bg-transparent hover:bg-nexaproc-amber/5 p-8 transition-all min-h-[240px]"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 group-hover:border-nexaproc-amber/50 flex items-center justify-center transition-colors">
              <Plus size={24} className="text-white/30 group-hover:text-nexaproc-amber transition-colors" />
            </div>
            <span className="text-sm font-semibold text-white/40 group-hover:text-nexaproc-amber transition-colors">
              Create New Project
            </span>
            <span className="text-xs text-white/20 group-hover:text-white/40 transition-colors">
              Set up a new plant or factory
            </span>
          </button>

          {/* Project Cards */}
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-xl border border-scada-border bg-scada-panel hover:border-nexaproc-amber/30 transition-all overflow-hidden"
            >
              {/* Color stripe */}
              <div
                className="h-1.5"
                style={{ backgroundColor: INDUSTRY_COLORS[project.industry] || '#4ade80' }}
              />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${INDUSTRY_COLORS[project.industry]}20`,
                        color: INDUSTRY_COLORS[project.industry],
                      }}
                    >
                      {INDUSTRY_ICONS[project.industry] || <Factory size={20} />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{project.name}</h3>
                      <span className="text-[10px] font-mono text-white/40">{project.code}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === project.id ? null : project.id)}
                      className="p-1 text-white/30 hover:text-white/60 rounded transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === project.id && (
                      <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-scada-border bg-scada-panel shadow-xl py-1">
                        <button
                          onClick={() => { openProject(project.id); setMenuOpen(null); }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
                        >
                          <FolderOpen size={13} /> Open Project
                        </button>
                        <button
                          onClick={() => { setMenuOpen(null); }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
                        >
                          <Edit3 size={13} /> Edit Details
                        </button>
                        <button
                          onClick={() => duplicateProject(project)}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
                        >
                          <Copy size={13} /> Duplicate
                        </button>
                        <div className="border-t border-scada-border my-1" />
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-white/40 line-clamp-2 mb-3 min-h-[2rem]">
                  {project.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-white/35 mb-4">
                  <MapPin size={12} />
                  <span>{project.location}</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'Lines', value: project.linesCount },
                    { label: 'Tags', value: project.tagsCount.toLocaleString() },
                    { label: 'Equip', value: project.equipmentCount },
                    { label: 'OEE', value: project.oee ? `${project.oee}%` : '—' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-sm font-bold text-white">{s.value}</div>
                      <div className="text-[10px] text-white/30">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-scada-border/50">
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_BADGE[project.status]} dot>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  <button
                    onClick={() => openProject(project.id)}
                    className="flex items-center gap-1 text-xs font-medium text-nexaproc-amber hover:text-nexaproc-gold transition-colors"
                  >
                    Open <ChevronRight size={14} />
                  </button>
                </div>

                {/* Updated time */}
                <div className="flex items-center gap-1 text-[10px] text-white/20 mt-2">
                  <Clock size={10} />
                  Updated {project.updatedAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-scada-border text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Project</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Industry</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Location</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Lines</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Tags</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">OEE</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Updated</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 cursor-pointer transition-colors"
                    onClick={() => openProject(p.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${INDUSTRY_COLORS[p.industry]}20`,
                            color: INDUSTRY_COLORS[p.industry],
                          }}
                        >
                          {INDUSTRY_ICONS[p.industry] || <Factory size={16} />}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-[10px] font-mono text-white/35">{p.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60 capitalize">{p.industry}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{p.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[p.status]} dot>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-white/70 font-mono">{p.linesCount}</td>
                    <td className="px-4 py-3 text-white/70 font-mono">{p.tagsCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-white/70 font-mono">{p.oee ? `${p.oee}%` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-white/40">{p.updatedAt}</td>
                    <td className="px-4 py-3">
                      <ArrowRight size={14} className="text-white/30" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Create Project Wizard Modal ─────────────────────────────── */}
      <Modal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Create New Project"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs text-white/30">
              {(['template', 'details', 'confirm'] as WizardStep[]).map((step, i) => (
                <React.Fragment key={step}>
                  <span
                    className={`flex items-center gap-1 ${
                      step === wizardStep
                        ? 'text-nexaproc-amber font-semibold'
                        : i < ['template', 'details', 'confirm'].indexOf(wizardStep)
                          ? 'text-nexaproc-green'
                          : ''
                    }`}
                  >
                    {i < ['template', 'details', 'confirm'].indexOf(wizardStep) ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                    )}
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                  {i < 2 && <ChevronRight size={12} className="text-white/15" />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {wizardStep !== 'template' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setWizardStep(wizardStep === 'confirm' ? 'details' : 'template')
                  }
                >
                  Back
                </Button>
              )}
              {wizardStep === 'template' && (
                <Button variant="primary" size="sm" onClick={() => setWizardStep('details')}>
                  Next
                </Button>
              )}
              {wizardStep === 'details' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setWizardStep('confirm')}
                  disabled={!canProceedDetails}
                >
                  Next
                </Button>
              )}
              {wizardStep === 'confirm' && (
                <Button variant="primary" size="sm" onClick={createProject}>
                  Create Project
                </Button>
              )}
            </div>
          </div>
        }
      >
        {/* Step 1: Template */}
        {wizardStep === 'template' && (
          <div className="space-y-4">
            <p className="text-sm text-white/50">
              Choose a template to pre-configure your project with industry-standard production lines, zones, and equipment.
            </p>
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplate(tpl.id);
                    // Auto-fill industry from template
                    if (tpl.id.startsWith('pharma')) setNewProject((p) => ({ ...p, industry: 'pharma' }));
                    else if (tpl.id.startsWith('food')) setNewProject((p) => ({ ...p, industry: 'food' }));
                    else if (tpl.id.startsWith('textile')) setNewProject((p) => ({ ...p, industry: 'textile' }));
                    else if (tpl.id.startsWith('auto')) setNewProject((p) => ({ ...p, industry: 'automotive' }));
                    else if (tpl.id.startsWith('water')) setNewProject((p) => ({ ...p, industry: 'water' }));
                  }}
                  className={`flex flex-col items-start gap-2 p-4 rounded-lg border text-left transition-all ${
                    selectedTemplate === tpl.id
                      ? 'border-nexaproc-amber bg-nexaproc-amber/10'
                      : 'border-scada-border hover:border-white/20 bg-transparent'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedTemplate === tpl.id
                        ? 'bg-nexaproc-amber/20 text-nexaproc-amber'
                        : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {tpl.icon}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${selectedTemplate === tpl.id ? 'text-nexaproc-amber' : 'text-white/80'}`}>
                      {tpl.name}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">{tpl.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {wizardStep === 'details' && (
          <div className="space-y-4">
            <p className="text-sm text-white/50">
              Enter your project details. You can update these later in project settings.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Project Name *"
                placeholder="e.g., Pharma Plant Alpha"
                value={newProject.name}
                onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
              />
              <Input
                label="Project Code *"
                placeholder="e.g., PPA"
                value={newProject.code}
                onChange={(e) => setNewProject((p) => ({ ...p, code: e.target.value.toUpperCase().slice(0, 6) }))}
              />
            </div>
            <Select
              label="Industry"
              options={INDUSTRY_OPTIONS}
              value={newProject.industry}
              onChange={(v) => setNewProject((p) => ({ ...p, industry: v }))}
            />
            <Input
              label="Location"
              placeholder="e.g., Hyderabad, India"
              icon={<MapPin size={14} />}
              value={newProject.location}
              onChange={(e) => setNewProject((p) => ({ ...p, location: e.target.value }))}
            />
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Description</label>
              <textarea
                placeholder="Brief description of this plant/project..."
                value={newProject.description}
                onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full rounded-lg bg-scada-dark border border-scada-border px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-nexaproc-amber/50 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {wizardStep === 'confirm' && (
          <div className="space-y-5">
            <p className="text-sm text-white/50">
              Review your project details before creating.
            </p>
            <div className="rounded-lg border border-scada-border bg-scada-dark p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${INDUSTRY_COLORS[newProject.industry]}20`,
                    color: INDUSTRY_COLORS[newProject.industry],
                  }}
                >
                  {INDUSTRY_ICONS[newProject.industry] || <Factory size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{newProject.name || 'Untitled'}</h3>
                  <span className="text-xs font-mono text-white/40">{newProject.code || '—'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Industry</span>
                  <p className="text-white mt-0.5 capitalize">{newProject.industry}</p>
                </div>
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Location</span>
                  <p className="text-white mt-0.5">{newProject.location || '—'}</p>
                </div>
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Template</span>
                  <p className="text-white mt-0.5">
                    {TEMPLATES.find((t) => t.id === selectedTemplate)?.name || 'Blank'}
                  </p>
                </div>
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Status</span>
                  <p className="mt-0.5">
                    <Badge variant="warning" dot>Setup</Badge>
                  </p>
                </div>
              </div>

              {newProject.description && (
                <div className="text-xs">
                  <span className="text-white/40 uppercase tracking-wider">Description</span>
                  <p className="text-white/60 mt-0.5">{newProject.description}</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-nexaproc-amber/20 bg-nexaproc-amber/5 px-4 py-3">
              <p className="text-xs text-nexaproc-amber/80">
                After creation, you'll be taken to the project setup wizard where you can configure production lines, process zones, equipment, and tags.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
