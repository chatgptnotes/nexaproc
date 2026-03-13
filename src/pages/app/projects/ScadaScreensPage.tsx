import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Monitor,
  Edit3,
  Trash2,
  Copy,
  ArrowLeft,
  Eye,
  Pencil,
  LayoutGrid,
  Cable,
  MoreVertical,
  Clock,
} from 'lucide-react';
import { Card, Button, Badge, Modal, Input } from '@/components/ui';
import { useScreenStore } from '@/stores/useScreenStore';

/* ------------------------------------------------------------------ */
/*  Project-name lookup (mock)                                         */
/* ------------------------------------------------------------------ */
const PROJECT_NAMES: Record<string, string> = {
  'proj-001': 'Pharma Plant Alpha',
  'proj-002': 'Food Processing Beta',
  'proj-003': 'Textile Mill Gamma',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ', ' + d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ScadaScreensPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const getScreensByProject = useScreenStore((s) => s.getScreensByProject);
  const addScreen = useScreenStore((s) => s.addScreen);
  const deleteScreen = useScreenStore((s) => s.deleteScreen);
  const duplicateScreen = useScreenStore((s) => s.duplicateScreen);

  const screens = getScreensByProject(projectId ?? '');
  const projectName = PROJECT_NAMES[projectId ?? ''] ?? 'Project';

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Context menu
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────
  const openCreateModal = () => {
    setNewName('');
    setNewDescription('');
    setCreateOpen(true);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const now = new Date().toISOString();
    addScreen({
      id: `screen-${Date.now()}`,
      projectId: projectId ?? '',
      name: newName.trim(),
      description: newDescription.trim(),
      elements: [],
      connections: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      gridSize: 20,
      snapToGrid: true,
      createdAt: now,
      updatedAt: now,
    });
    setCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteScreen(id);
    setMenuOpen(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateScreen(id);
    setMenuOpen(null);
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/projects')}
            className="flex items-center gap-1.5 rounded-lg border border-scada-border bg-scada-panel px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Projects
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Monitor className="w-7 h-7 text-nexaproc-amber" />
              SCADA Screens
            </h1>
            <p className="mt-1 text-sm text-white/50">
              {projectName} &mdash; visual process screens
            </p>
          </div>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={openCreateModal}>
          New Screen
        </Button>
      </div>

      {/* ── Stats Bar ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-5 text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <LayoutGrid size={12} />
          {screens.length} screen{screens.length !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1.5">
          <Pencil size={12} />
          {screens.reduce((acc, s) => acc + s.elements.length, 0)} total elements
        </span>
        <span className="flex items-center gap-1.5">
          <Cable size={12} />
          {screens.reduce((acc, s) => acc + s.connections.length, 0)} total connections
        </span>
      </div>

      {/* ── Screen Cards Grid ───────────────────────────────────────── */}
      {screens.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-scada-border bg-scada-panel/30 py-20 px-8">
          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/15 flex items-center justify-center mb-6">
            <Monitor size={36} className="text-white/15" />
          </div>
          <h3 className="text-lg font-bold text-white/60 mb-2">No screens yet</h3>
          <p className="text-sm text-white/30 mb-6 max-w-md text-center">
            Create your first SCADA screen to start visualizing your process. Add P&ID symbols, connect equipment, and bind live tags for real-time monitoring.
          </p>
          <Button variant="primary" icon={<Plus size={16} />} onClick={openCreateModal}>
            Create your first SCADA screen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* ── Dashed "Create New Screen" card ──────────────────────── */}
          <button
            onClick={openCreateModal}
            className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-scada-border hover:border-nexaproc-amber/40 bg-transparent hover:bg-nexaproc-amber/5 p-8 transition-all min-h-[260px]"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 group-hover:border-nexaproc-amber/50 flex items-center justify-center transition-colors">
              <Plus size={24} className="text-white/30 group-hover:text-nexaproc-amber transition-colors" />
            </div>
            <span className="text-sm font-semibold text-white/40 group-hover:text-nexaproc-amber transition-colors">
              Create New Screen
            </span>
            <span className="text-xs text-white/20 group-hover:text-white/40 transition-colors">
              Add a new process visualization
            </span>
          </button>

          {/* ── Screen Cards ────────────────────────────────────────── */}
          {screens.map((screen) => (
            <div
              key={screen.id}
              className="group relative rounded-xl border border-scada-border bg-scada-panel hover:border-nexaproc-amber/30 transition-all overflow-hidden"
            >
              {/* Amber accent stripe */}
              <div className="h-1 bg-gradient-to-r from-nexaproc-amber/60 to-nexaproc-green/40" />

              <div className="p-5">
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-nexaproc-amber/10 flex items-center justify-center shrink-0">
                      <Monitor size={20} className="text-nexaproc-amber" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white leading-tight truncate">
                        {screen.name}
                      </h3>
                      <span className="text-[10px] font-mono text-white/35">{screen.id}</span>
                    </div>
                  </div>

                  {/* Context menu trigger */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setMenuOpen(menuOpen === screen.id ? null : screen.id)}
                      className="p-1 text-white/30 hover:text-white/60 rounded transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === screen.id && (
                      <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-scada-border bg-scada-panel shadow-xl py-1">
                        <button
                          onClick={() => handleDuplicate(screen.id)}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
                        >
                          <Copy size={13} /> Duplicate
                        </button>
                        <div className="border-t border-scada-border my-1" />
                        <button
                          onClick={() => handleDelete(screen.id)}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-white/40 line-clamp-2 mb-4 min-h-[2rem]">
                  {screen.description || 'No description'}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 rounded-lg bg-scada-dark/60 border border-scada-border/50 px-3 py-2">
                    <LayoutGrid size={14} className="text-nexaproc-amber/70" />
                    <div>
                      <div className="text-sm font-bold text-white">{screen.elements.length}</div>
                      <div className="text-[10px] text-white/30">Elements</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-scada-dark/60 border border-scada-border/50 px-3 py-2">
                    <Cable size={14} className="text-nexaproc-green/70" />
                    <div>
                      <div className="text-sm font-bold text-white">{screen.connections.length}</div>
                      <div className="text-[10px] text-white/30">Connections</div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Pencil size={13} />}
                    onClick={() =>
                      navigate(`/app/projects/${projectId}/screens/${screen.id}/edit`)
                    }
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye size={13} />}
                    onClick={() =>
                      navigate(`/app/projects/${projectId}/screens/${screen.id}/view`)
                    }
                    className="flex-1 border border-scada-border hover:border-white/20"
                  >
                    View
                  </Button>
                </div>

                {/* Timestamps */}
                <div className="flex items-center justify-between pt-3 border-t border-scada-border/50">
                  <div className="flex items-center gap-1 text-[10px] text-white/20">
                    <Clock size={10} />
                    Created {formatTimestamp(screen.createdAt)}
                  </div>
                  <div className="text-[10px] text-white/20">
                    Updated {formatTimestamp(screen.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create New Screen Modal ─────────────────────────────────── */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New SCADA Screen"
        footer={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={handleCreate}
              disabled={!newName.trim()}
            >
              Create Screen
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-white/50">
            A new screen will be created in <span className="text-nexaproc-amber font-medium">{projectName}</span>. You can add P&ID symbols, connections, and tag bindings in the screen editor.
          </p>
          <Input
            label="Screen Name *"
            placeholder="e.g., Main Reactor P&ID"
            icon={<Monitor size={14} />}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Brief description of this process screen..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-scada-dark border border-scada-border px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-nexaproc-amber/50 resize-none"
            />
          </div>

          {/* Hint */}
          <div className="rounded-lg border border-nexaproc-amber/20 bg-nexaproc-amber/5 px-4 py-3">
            <p className="text-xs text-nexaproc-amber/80">
              After creation, open the screen editor to place symbols from the library, draw pipe and signal connections, and bind tags for live data.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
