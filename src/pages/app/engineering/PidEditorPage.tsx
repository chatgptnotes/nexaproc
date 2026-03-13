import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import type { Node, Edge, Connection, NodeTypes, EdgeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { PidSymbolNode } from '@/components/pid/nodes/PidSymbolNode';
import type { PidSymbolNodeData } from '@/components/pid/nodes/PidSymbolNode';
import { PipeConnectionEdge } from '@/components/pid/nodes/PipeConnectionEdge';
import { CATEGORIES } from '@/components/pid/PidSymbolPalette';
import { Button } from '@/components/ui/Button';
import { Save, Eye, EyeOff, Trash2 } from 'lucide-react';

// ─── Node & Edge types (outside component) ──────────────────────────────────
const nodeTypes: NodeTypes = { pidSymbol: PidSymbolNode };
const edgeTypes: EdgeTypes = { pipe: PipeConnectionEdge };

const ROTATIONS = [0, 90, 180, 270] as const;

// ─── Symbol Palette ──────────────────────────────────────────────────────────

function SymbolPalette({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (key: string) =>
    setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const onDragStart = (
    e: React.DragEvent,
    categoryKey: string,
    symbolIndex: number,
  ) => {
    e.dataTransfer.setData('application/pid-category', categoryKey);
    e.dataTransfer.setData('application/pid-index', String(symbolIndex));
    e.dataTransfer.effectAllowed = 'move';
  };

  const q = search.toLowerCase().trim();

  return (
    <div className="w-48 shrink-0 flex flex-col border-r border-scada-border bg-scada-panel overflow-hidden">
      <div className="px-2 pt-2 pb-1">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full px-2 py-1.5 rounded bg-scada-dark border border-scada-border text-xs text-white
                     placeholder-white/25 focus:outline-none focus:border-cyan-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-1 pb-2 space-y-0.5 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const symbols = q
            ? cat.symbols
                .map((s, idx) => ({ ...s, idx }))
                .filter((s) => s.name.toLowerCase().includes(q))
            : cat.symbols.map((s, idx) => ({ ...s, idx }));

          if (q && symbols.length === 0) return null;
          const isCollapsed = collapsed[cat.key] && !q;

          return (
            <div key={cat.key}>
              <button
                onClick={() => toggle(cat.key)}
                className="w-full flex items-center justify-between px-2 py-1 rounded text-[10px] font-bold
                           text-white/60 hover:text-white hover:bg-white/5 uppercase tracking-wider"
              >
                <span>
                  {cat.label} <span className="text-white/25 font-normal">({symbols.length})</span>
                </span>
                <span className="text-white/25 text-xs">{isCollapsed ? '+' : '\u2212'}</span>
              </button>
              {!isCollapsed && (
                <div className="space-y-px mt-px">
                  {symbols.map((sym) => {
                    const Comp = sym.component;
                    return (
                      <div
                        key={`${cat.key}-${sym.idx}`}
                        draggable
                        onDragStart={(e) => onDragStart(e, cat.key, sym.idx)}
                        className="flex items-center gap-1.5 px-1.5 py-1 rounded cursor-grab
                                   hover:bg-white/5 active:bg-cyan-500/10 group"
                      >
                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                          <Comp size={24} state={cat.states[0]} />
                        </div>
                        <span className="text-[10px] text-white/40 group-hover:text-white/70 truncate leading-tight">
                          {sym.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Properties Panel ────────────────────────────────────────────────────────

function PropertiesPanel({
  node,
  onUpdate,
  onDelete,
  onMove,
}: {
  node: Node | null;
  onUpdate: (id: string, data: Partial<PidSymbolNodeData>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
}) {
  if (!node) {
    return (
      <div className="w-52 shrink-0 flex items-center justify-center border-l border-scada-border bg-scada-panel">
        <p className="text-white/25 text-[10px] text-center px-3">
          Select a node to edit properties
        </p>
      </div>
    );
  }

  const d = node.data as PidSymbolNodeData;
  const category = CATEGORIES.find((c) => c.key === d.categoryKey);
  const states = category?.states ?? [];
  const hasFillLevel = category?.hasFillLevel ?? false;

  return (
    <div className="w-52 shrink-0 flex flex-col border-l border-scada-border bg-scada-panel overflow-y-auto scrollbar-thin">
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="pb-2 border-b border-scada-border">
          <h3 className="text-xs font-semibold text-white truncate">{d.symbolName}</h3>
          <p className="text-[9px] text-white/25 uppercase tracking-wider">{category?.label}</p>
        </div>

        {/* Position X/Y */}
        <div>
          <label className="block text-[9px] font-medium text-white/40 uppercase tracking-wider mb-1">Position</label>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-white/30 w-3">X</span>
              <input
                type="number"
                value={Math.round(node.position.x)}
                onChange={(e) => onMove(node.id, { x: Number(e.target.value), y: node.position.y })}
                className="w-full px-1.5 py-0.5 rounded bg-scada-dark border border-scada-border text-[10px] font-mono text-white
                           focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-white/30 w-3">Y</span>
              <input
                type="number"
                value={Math.round(node.position.y)}
                onChange={(e) => onMove(node.id, { x: node.position.x, y: Number(e.target.value) })}
                className="w-full px-1.5 py-0.5 rounded bg-scada-dark border border-scada-border text-[10px] font-mono text-white
                           focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <p className="text-[8px] text-white/20 mt-1">Arrow keys: 1px | +Shift: 10px | +Ctrl: 20px</p>
        </div>

        {/* Label */}
        <div>
          <label className="block text-[9px] font-medium text-white/40 uppercase tracking-wider mb-1">Label</label>
          <input
            type="text"
            value={d.label ?? ''}
            onChange={(e) => onUpdate(node.id, { label: e.target.value })}
            placeholder="e.g. TI-101"
            className="w-full px-2 py-1 rounded bg-scada-dark border border-scada-border text-xs text-white
                       placeholder-white/20 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Size */}
        <div>
          <label className="block text-[9px] font-medium text-white/40 uppercase tracking-wider mb-1">
            Size: {d.size ?? 64}px
          </label>
          <input
            type="range" min={24} max={120} value={d.size ?? 64}
            onChange={(e) => onUpdate(node.id, { size: Number(e.target.value) })}
            className="w-full accent-cyan-500 h-1"
          />
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-[9px] font-medium text-white/40 uppercase tracking-wider mb-1">Rotation</label>
          <div className="grid grid-cols-4 gap-0.5">
            {ROTATIONS.map((r) => (
              <button
                key={r}
                onClick={() => onUpdate(node.id, { rotation: r })}
                className={`py-1 rounded text-[9px] font-medium ${
                  (d.rotation ?? 0) === r
                    ? 'bg-cyan-600 text-white'
                    : 'bg-scada-dark text-white/35 hover:text-white/60'
                }`}
              >
                {r}&deg;
              </button>
            ))}
          </div>
        </div>

        {/* State */}
        {states.length > 0 && (
          <div>
            <label className="block text-[9px] font-medium text-white/40 uppercase tracking-wider mb-1">State</label>
            <select
              value={d.state ?? states[0]}
              onChange={(e) => onUpdate(node.id, { state: e.target.value })}
              className="w-full px-2 py-1 rounded bg-scada-dark border border-scada-border text-xs text-white
                         focus:outline-none focus:border-cyan-500 capitalize"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Animated */}
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-medium text-white/40 uppercase tracking-wider">Animated</label>
          <button
            onClick={() => onUpdate(node.id, { animated: !d.animated })}
            className={`w-8 h-4 rounded-full transition-colors relative ${
              d.animated ? 'bg-cyan-600' : 'bg-gray-600'
            }`}
          >
            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
              d.animated ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Fill level */}
        {hasFillLevel && (
          <div>
            <label className="block text-[9px] font-medium text-white/40 uppercase tracking-wider mb-1">
              Fill: {d.fillLevel ?? 50}%
            </label>
            <input
              type="range" min={0} max={100} value={d.fillLevel ?? 50}
              onChange={(e) => onUpdate(node.id, { fillLevel: Number(e.target.value) })}
              className="w-full accent-cyan-500 h-1"
            />
          </div>
        )}

        {/* Delete */}
        <button
          onClick={() => onDelete(node.id)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-red-500/10 border border-red-500/20
                     text-red-400 text-[10px] font-medium hover:bg-red-500/20 transition-colors mt-2"
        >
          <Trash2 size={11} /> Delete Element
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PidEditorPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([] as Edge[]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [saveFlash, setSaveFlash] = useState(false);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  // Connect
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          { ...connection, type: 'pipe', data: { pipeType: 'pipe', pipeAnimated: false } },
          eds,
        ),
      );
    },
    [setEdges],
  );

  // Selection
  const onSelectionChange = useCallback(
    ({ nodes: sel }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNodeId(sel.length === 1 ? sel[0].id : null);
    },
    [],
  );

  // Drop
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const categoryKey = e.dataTransfer.getData('application/pid-category');
      const symbolIndexStr = e.dataTransfer.getData('application/pid-index');
      if (!categoryKey || symbolIndexStr === '') return;

      const symbolIndex = parseInt(symbolIndexStr, 10);
      const category = CATEGORIES.find((c) => c.key === categoryKey);
      const symbol = category?.symbols[symbolIndex];
      if (!category || !symbol) return;

      let position = { x: e.clientX, y: e.clientY };
      if (reactFlowInstance?.screenToFlowPosition) {
        position = reactFlowInstance.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      } else {
        const bounds = reactFlowWrapper.current?.getBoundingClientRect();
        if (bounds) {
          position = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
        }
      }
      position = { x: Math.round(position.x / 20) * 20, y: Math.round(position.y / 20) * 20 };

      const newNode: Node = {
        id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'pidSymbol',
        position,
        data: {
          symbolComponent: symbol.component,
          symbolName: symbol.name,
          categoryKey,
          symbolIndex,
          size: 64,
          rotation: 0,
          state: category.states[0] ?? 'running',
          animated: false,
          fillLevel: category.hasFillLevel ? 50 : undefined,
          label: '',
        } satisfies PidSymbolNodeData,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes],
  );

  // Property update
  const onPropertyUpdate = useCallback(
    (nodeId: string, updates: Partial<PidSymbolNodeData>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n)),
      );
    },
    [setNodes],
  );

  // Move node to exact position
  const onMoveNode = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, position } : n)),
      );
    },
    [setNodes],
  );

  // Delete node
  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId(null);
    },
    [setNodes, setEdges],
  );

  // Save (placeholder)
  const handleSave = useCallback(() => {
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  }, []);

  // Arrow key nudging — 1px default, 10px with Shift, snap-to-grid with Ctrl
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedNodeId) return;
      // Don't intercept if user is typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const arrowKeys: Record<string, { dx: number; dy: number }> = {
        ArrowUp: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
        ArrowLeft: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 },
      };
      const dir = arrowKeys[e.key];
      if (!dir) return;

      e.preventDefault();
      const step = e.ctrlKey || e.metaKey ? 20 : e.shiftKey ? 10 : 1;

      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNodeId
            ? {
                ...n,
                position: {
                  x: n.position.x + dir.dx * step,
                  y: n.position.y + dir.dy * step,
                },
              }
            : n,
        ),
      );
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNodeId, setNodes]);

  // Ctrl+S save shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)]">
      {/* Left: Compact Symbol Palette */}
      <SymbolPalette search={search} onSearchChange={setSearch} />

      {/* Center: React Flow Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapToGrid
          snapGrid={[20, 20]}
          defaultEdgeOptions={{ type: 'pipe' }}
          fitView
          style={{ background: '#0a0f0a' }}
          deleteKeyCode={['Backspace', 'Delete']}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} color="#1e2e1e" gap={20} />
          <Controls />
          {showMiniMap && (
            <MiniMap
              nodeColor={(n) => {
                const cat = (n.data as PidSymbolNodeData)?.categoryKey;
                const colors: Record<string, string> = {
                  valves: '#4ade80', pumps: '#60a5fa', motors: '#f59e0b', vessels: '#8b5cf6',
                  exchangers: '#ef4444', instruments: '#06b6d4', piping: '#6b7280',
                  material: '#d97706', process: '#ec4899',
                };
                return colors[cat] ?? '#4ade80';
              }}
              maskColor="rgba(0,0,0,0.7)"
              style={{ background: '#0a0f0a' }}
            />
          )}

          {/* Top toolbar */}
          <Panel position="top-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-scada-panel/90 border border-scada-border backdrop-blur-sm shadow-lg">
              <span className="text-sm font-semibold text-white">P&ID Editor</span>
              <div className="w-px h-4 bg-scada-border" />
              <span className="text-[10px] text-white/30">
                {nodes.length} elements &middot; {edges.length} connections
              </span>
              <div className="w-px h-4 bg-scada-border" />
              <button
                onClick={() => setShowMiniMap((v) => !v)}
                className="p-1 rounded text-white/40 hover:text-white/70 transition-colors"
                title={showMiniMap ? 'Hide minimap' : 'Show minimap'}
              >
                {showMiniMap ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              <Button
                size="sm"
                variant="primary"
                icon={<Save size={12} />}
                onClick={handleSave}
                className={`text-[11px] ${saveFlash ? '!bg-green-600' : ''}`}
              >
                {saveFlash ? 'Saved!' : 'Save'}
              </Button>
            </div>
          </Panel>

          {/* Selection hint */}
          {selectedNodeId && (
            <Panel position="bottom-center">
              <div className="px-3 py-1 rounded bg-scada-panel/80 border border-scada-border text-[10px] text-white/40">
                Arrow keys: nudge 1px &middot; Shift+Arrow: 10px &middot; Ctrl+Arrow: 20px (grid)
              </div>
            </Panel>
          )}

          {/* Empty state hint */}
          {nodes.length === 0 && (
            <Panel position="top-left" className="!top-16 !left-4">
              <div className="px-3 py-2 rounded-lg bg-nexaproc-amber/10 border border-nexaproc-amber/20 max-w-[220px]">
                <p className="text-[11px] text-nexaproc-amber/80 leading-relaxed">
                  Drag symbols from the palette on the left and drop them onto the canvas to start building your P&ID diagram.
                </p>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* Right: Properties Panel */}
      <PropertiesPanel
        node={selectedNode}
        onUpdate={onPropertyUpdate}
        onDelete={onDeleteNode}
        onMove={onMoveNode}
      />
    </div>
  );
}
