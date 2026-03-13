import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import type { CategoryDef, SymbolEntry } from '@/components/pid/PidSymbolPalette';
import { useScreenStore } from '@/stores/useScreenStore';
import { Button } from '@/components/ui';
import type { ScreenElement, ScreenConnection } from '@/types/screen';

// ─── Node & Edge type registries (MUST be outside the component) ─────────────

const nodeTypes: NodeTypes = { pidSymbol: PidSymbolNode };
const edgeTypes: EdgeTypes = { pipe: PipeConnectionEdge };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function elementsToNodes(elements: ScreenElement[]): Node[] {
  return elements.flatMap((el) => {
    const category = CATEGORIES.find((c) => c.key === el.categoryKey);
    const symbol = category?.symbols[el.symbolIndex];
    if (!symbol) return [];
    return [{
      id: el.id,
      type: 'pidSymbol' as const,
      position: el.position,
      data: {
        symbolComponent: symbol.component,
        symbolName: el.symbolName,
        categoryKey: el.categoryKey,
        symbolIndex: el.symbolIndex,
        size: el.size,
        rotation: el.rotation,
        state: el.state,
        animated: el.animated,
        fillLevel: el.fillLevel,
        label: el.label,
      } satisfies PidSymbolNodeData,
    }];
  });
}

function connectionsToEdges(connections: ScreenConnection[]): Edge[] {
  return connections.map((conn) => ({
    id: conn.id,
    source: conn.sourceId,
    target: conn.targetId,
    sourceHandle: conn.sourceHandle,
    targetHandle: conn.targetHandle,
    type: 'pipe' as const,
    data: {
      pipeType: conn.type,
      pipeAnimated: conn.animated,
      color: conn.color,
    },
  }));
}

function nodesToElements(nodes: Node[]): ScreenElement[] {
  return nodes.map((node) => {
    const d = node.data as PidSymbolNodeData;
    return {
      id: node.id,
      symbolIndex: d.symbolIndex ?? 0,
      categoryKey: d.categoryKey ?? '',
      symbolName: d.symbolName ?? '',
      position: node.position,
      size: d.size ?? 64,
      rotation: d.rotation ?? 0,
      state: d.state ?? 'running',
      animated: d.animated ?? false,
      fillLevel: d.fillLevel,
      label: d.label,
      tagBindings: [],
    };
  });
}

function edgesToConnections(edges: Edge[]): ScreenConnection[] {
  return edges.map((edge) => ({
    id: edge.id,
    sourceId: edge.source,
    targetId: edge.target,
    sourceHandle: edge.sourceHandle ?? undefined,
    targetHandle: edge.targetHandle ?? undefined,
    type: ((edge.data as Record<string, unknown>)?.pipeType as ScreenConnection['type']) ?? 'pipe',
    animated: ((edge.data as Record<string, unknown>)?.pipeAnimated as boolean) ?? false,
    color: (edge.data as Record<string, unknown>)?.color as string | undefined,
  }));
}

// ─── Symbol Palette (left sidebar) ───────────────────────────────────────────

interface SymbolPaletteProps {
  search: string;
  onSearchChange: (v: string) => void;
}

function SymbolPalette({ search, onSearchChange }: SymbolPaletteProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

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
    <div className="w-60 shrink-0 flex flex-col bg-scada-panel border-r border-scada-border overflow-hidden">
      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search symbols..."
          className="w-full px-3 py-2 rounded-md bg-scada-dark border border-scada-border text-sm text-white
                     placeholder-white/30 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
        />
      </div>

      {/* Category sections */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
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
                className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-semibold
                           text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
              >
                <span>
                  {cat.label}{' '}
                  <span className="text-white/30 normal-case">({symbols.length})</span>
                </span>
                <span className="text-white/30">{isCollapsed ? '+' : '-'}</span>
              </button>

              {!isCollapsed && (
                <div className="grid grid-cols-1 gap-0.5 mt-0.5">
                  {symbols.map((sym) => {
                    const Comp = sym.component;
                    return (
                      <div
                        key={`${cat.key}-${sym.idx}`}
                        draggable
                        onDragStart={(e) => onDragStart(e, cat.key, sym.idx)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded cursor-grab
                                   hover:bg-white/5 active:bg-cyan-500/10 transition-colors group"
                      >
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                          <Comp size={32} state={cat.states[0]} />
                        </div>
                        <span className="text-[11px] text-white/50 group-hover:text-white/80 truncate">
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

// ─── Properties Panel (right sidebar) ────────────────────────────────────────

interface PropertiesPanelProps {
  node: Node | null;
  onUpdate: (id: string, data: Partial<PidSymbolNodeData>) => void;
}

const ROTATIONS = [0, 90, 180, 270] as const;

function PropertiesPanel({ node, onUpdate }: PropertiesPanelProps) {
  if (!node) {
    return (
      <div className="w-[260px] shrink-0 flex items-center justify-center bg-scada-panel border-l border-scada-border">
        <p className="text-white/30 text-xs text-center px-4">
          Select a node on the canvas to edit its properties
        </p>
      </div>
    );
  }

  const d = node.data as PidSymbolNodeData;
  const category = CATEGORIES.find((c) => c.key === d.categoryKey);
  const states = category?.states ?? [];
  const hasFillLevel = category?.hasFillLevel ?? false;

  return (
    <div className="w-[260px] shrink-0 flex flex-col bg-scada-panel border-l border-scada-border overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pb-3 border-b border-scada-border">
          <h3 className="text-sm font-semibold text-white">{d.symbolName}</h3>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">
            {category?.label ?? d.categoryKey}
          </p>
        </div>

        {/* Label */}
        <div>
          <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1.5">
            Label
          </label>
          <input
            type="text"
            value={d.label ?? ''}
            onChange={(e) => onUpdate(node.id, { label: e.target.value })}
            placeholder="e.g. TI-101"
            className="w-full px-3 py-1.5 rounded-md bg-scada-dark border border-scada-border text-sm text-white
                       placeholder-white/20 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Size slider */}
        <div>
          <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1.5">
            Size: {d.size ?? 64}px
          </label>
          <input
            type="range"
            min={32}
            max={128}
            value={d.size ?? 64}
            onChange={(e) => onUpdate(node.id, { size: Number(e.target.value) })}
            className="w-full accent-cyan-500"
          />
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1.5">
            Rotation: {d.rotation ?? 0}&deg;
          </label>
          <div className="grid grid-cols-4 gap-1">
            {ROTATIONS.map((r) => (
              <button
                key={r}
                onClick={() => onUpdate(node.id, { rotation: r })}
                className={`py-1.5 rounded text-[10px] font-medium transition-colors ${
                  (d.rotation ?? 0) === r
                    ? 'bg-cyan-600 text-white'
                    : 'bg-scada-dark text-white/40 hover:text-white/70'
                }`}
              >
                {r}&deg;
              </button>
            ))}
          </div>
        </div>

        {/* State dropdown */}
        {states.length > 0 && (
          <div>
            <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1.5">
              State
            </label>
            <select
              value={d.state ?? states[0]}
              onChange={(e) => onUpdate(node.id, { state: e.target.value })}
              className="w-full px-3 py-1.5 rounded-md bg-scada-dark border border-scada-border text-sm text-white
                         focus:outline-none focus:border-cyan-500 capitalize"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Animated toggle */}
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
            Animated
          </label>
          <button
            onClick={() => onUpdate(node.id, { animated: !d.animated })}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              d.animated ? 'bg-cyan-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                d.animated ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Fill level (vessels/exchangers) */}
        {hasFillLevel && (
          <div>
            <label className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-1.5">
              Fill Level: {d.fillLevel ?? 50}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={d.fillLevel ?? 50}
              onChange={(e) => onUpdate(node.id, { fillLevel: Number(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ScreenEditorPage() {
  const { projectId, screenId } = useParams<{ projectId: string; screenId: string }>();
  const navigate = useNavigate();
  const { getScreen, updateScreen } = useScreenStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReturnType<typeof Object> | null>(null);

  // ── Load screen data ────────────────────────────────────────────────────
  const screen = getScreen(screenId ?? '');
  const [screenName, setScreenName] = useState(screen?.name ?? 'Untitled Screen');

  const initialNodes = useMemo(
    () => (screen ? elementsToNodes(screen.elements) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenId],
  );
  const initialEdges = useMemo(
    () => (screen ? connectionsToEdges(screen.connections) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenId],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saveFlash, setSaveFlash] = useState(false);

  // Re-initialize when screenId changes
  useEffect(() => {
    const s = getScreen(screenId ?? '');
    if (s) {
      setNodes(elementsToNodes(s.elements));
      setEdges(connectionsToEdges(s.connections));
      setScreenName(s.name);
    }
  }, [screenId, getScreen, setNodes, setEdges]);

  // ── Selected node reference ─────────────────────────────────────────────
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  // ── Connection handler ──────────────────────────────────────────────────
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'pipe',
            data: { pipeType: 'pipe', pipeAnimated: false },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  // ── Selection handler ──────────────────────────────────────────────────
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[]; edges: Edge[] }) => {
      if (selectedNodes.length === 1) {
        setSelectedNodeId(selectedNodes[0].id);
      } else {
        setSelectedNodeId(null);
      }
    },
    [],
  );

  // ── Drop handler ───────────────────────────────────────────────────────
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
      if (!category) return;
      const symbol = category.symbols[symbolIndex];
      if (!symbol) return;

      // Get drop position in flow coordinates
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      // Use the reactFlowInstance to convert screen coords to flow coords
      let position = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
      if (reactFlowInstance && typeof (reactFlowInstance as any).screenToFlowPosition === 'function') {
        position = (reactFlowInstance as any).screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }

      // Snap to grid
      position = {
        x: Math.round(position.x / 20) * 20,
        y: Math.round(position.y / 20) * 20,
      };

      const newNode: Node = {
        id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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

  // ── Property update handler ────────────────────────────────────────────
  const onPropertyUpdate = useCallback(
    (nodeId: string, updates: Partial<PidSymbolNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, ...updates } }
            : n,
        ),
      );
    },
    [setNodes],
  );

  // ── Save handler ───────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    if (!screenId) return;

    const elements = nodesToElements(nodes);
    const connections = edgesToConnections(edges);

    updateScreen(screenId, {
      name: screenName,
      elements,
      connections,
    });

    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  }, [screenId, nodes, edges, screenName, updateScreen]);

  // ── Keyboard shortcut: Ctrl+S ──────────────────────────────────────────
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

  // ── Not found ──────────────────────────────────────────────────────────
  if (!screen) {
    return (
      <div className="flex items-center justify-center h-screen bg-scada-dark text-white">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Screen not found</h2>
          <p className="text-white/50 text-sm">
            The screen you are looking for does not exist or has been deleted.
          </p>
          <Button onClick={() => navigate(`/app/projects/${projectId}/screens`)}>
            Back to Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-scada-dark">
      {/* ── Left: Symbol Palette ──────────────────────────────────────── */}
      <SymbolPalette search={search} onSearchChange={setSearch} />

      {/* ── Center: React Flow Canvas ─────────────────────────────────── */}
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
          onInit={setReactFlowInstance as any}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapToGrid
          snapGrid={[20, 20]}
          defaultEdgeOptions={{ type: 'pipe' }}
          fitView
          style={{ background: '#0a0f0a' }}
          deleteKeyCode={['Backspace', 'Delete']}
          multiSelectionKeyCode="Shift"
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} color="#1e2e1e" gap={20} />
          <Controls
            className="!bg-scada-panel !border-scada-border !shadow-lg"
            style={{ button: { backgroundColor: '#121a12', color: '#fff' } } as any}
          />
          <MiniMap
            nodeColor={(n) => {
              const cat = (n.data as PidSymbolNodeData)?.categoryKey;
              const colors: Record<string, string> = {
                valves: '#4ade80',
                pumps: '#60a5fa',
                motors: '#f59e0b',
                vessels: '#8b5cf6',
                exchangers: '#ef4444',
                instruments: '#06b6d4',
                piping: '#6b7280',
                material: '#d97706',
                process: '#ec4899',
              };
              return colors[cat] ?? '#4ade80';
            }}
            maskColor="rgba(0,0,0,0.7)"
            style={{ background: '#0a0f0a' }}
          />

          {/* ── Toolbar Panel ─────────────────────────────────────────── */}
          <Panel position="top-center">
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-scada-panel/90 border border-scada-border
                         backdrop-blur-sm shadow-lg"
            >
              {/* Back */}
              <button
                onClick={() => navigate(`/app/projects/${projectId}/screens`)}
                className="px-2 py-1 text-xs text-white/50 hover:text-white transition-colors"
                title="Back to screens"
              >
                &larr; Back
              </button>

              <div className="w-px h-5 bg-scada-border" />

              {/* Editable screen name */}
              <input
                type="text"
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white border-none outline-none
                           focus:ring-1 focus:ring-cyan-500/40 rounded px-2 py-0.5 w-52"
                title="Screen name"
              />

              <div className="w-px h-5 bg-scada-border" />

              {/* Save */}
              <Button
                onClick={handleSave}
                className={`text-xs transition-colors ${
                  saveFlash
                    ? '!bg-green-600 !text-white'
                    : ''
                }`}
              >
                {saveFlash ? 'Saved!' : 'Save'}
              </Button>

              {/* View */}
              <button
                onClick={() =>
                  navigate(
                    `/app/projects/${projectId}/screens/${screenId}/view`,
                  )
                }
                className="px-3 py-1.5 rounded-md text-xs text-white/60 hover:text-white
                           bg-scada-dark border border-scada-border hover:border-white/20 transition-colors"
              >
                View
              </button>
            </div>
          </Panel>

          {/* ── Node count indicator ──────────────────────────────────── */}
          <Panel position="bottom-center">
            <div className="px-3 py-1 rounded bg-scada-panel/80 border border-scada-border text-[10px] text-white/40">
              {nodes.length} node{nodes.length !== 1 ? 's' : ''} &middot;{' '}
              {edges.length} connection{edges.length !== 1 ? 's' : ''}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* ── Right: Properties Panel ───────────────────────────────────── */}
      <PropertiesPanel node={selectedNode} onUpdate={onPropertyUpdate} />
    </div>
  );
}
