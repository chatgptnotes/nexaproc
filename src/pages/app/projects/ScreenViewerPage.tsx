import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import type { Node, Edge, NodeTypes, EdgeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PidSymbolNode } from '@/components/pid/nodes/PidSymbolNode';
import type { PidSymbolNodeData } from '@/components/pid/nodes/PidSymbolNode';
import { PipeConnectionEdge } from '@/components/pid/nodes/PipeConnectionEdge';
import { CATEGORIES } from '@/components/pid/PidSymbolPalette';
import { useScreenStore } from '@/stores/useScreenStore';
import { Button } from '@/components/ui';

// ─── Node & Edge Types (MUST be outside component to avoid re-registration) ──
const nodeTypes: NodeTypes = { pidSymbol: PidSymbolNode };
const edgeTypes: EdgeTypes = { pipe: PipeConnectionEdge };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lookupSymbolComponent(categoryKey: string, symbolIndex: number) {
  const category = CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return undefined;
  const entry = category.symbols[symbolIndex];
  return entry?.component;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ScreenViewerPage() {
  const { projectId, screenId } = useParams<{
    projectId: string;
    screenId: string;
  }>();
  const navigate = useNavigate();
  const getScreen = useScreenStore((s) => s.getScreen);

  const screen = screenId ? getScreen(screenId) : undefined;

  // ── Convert store data to React Flow nodes ──────────────────────────────

  const initialNodes = useMemo<Node[]>(() => {
    if (!screen) return [];
    return screen.elements.map((el) => {
      const symbolComponent = lookupSymbolComponent(
        el.categoryKey,
        el.symbolIndex,
      );
      const data: PidSymbolNodeData = {
        symbolComponent: symbolComponent!,
        symbolName: el.symbolName,
        categoryKey: el.categoryKey,
        symbolIndex: el.symbolIndex,
        size: el.size,
        rotation: el.rotation,
        state: el.state,
        animated: el.animated,
        fillLevel: el.fillLevel,
        label: el.label,
      };
      return {
        id: el.id,
        type: 'pidSymbol',
        position: el.position,
        data,
      };
    });
  }, [screen]);

  const edges = useMemo<Edge[]>(() => {
    if (!screen) return [];
    return screen.connections.map((conn) => ({
      id: conn.id,
      source: conn.sourceId,
      target: conn.targetId,
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      type: 'pipe',
      animated: conn.animated,
      data: {
        pipeType: conn.type,
        pipeAnimated: conn.animated,
        color: conn.color,
      },
    }));
  }, [screen]);

  // ── Live state ──────────────────────────────────────────────────────────

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync nodes when initialNodes changes (e.g. screen load)
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  // ── Live clock (updates every second) ──────────────────────────────────

  useEffect(() => {
    const tick = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // ── Live data simulation (every 2 seconds) ─────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => {
          const data = node.data as PidSymbolNodeData;

          // For vessels: vary fill level with drift
          if (
            data.categoryKey === 'vessels' &&
            data.fillLevel !== undefined
          ) {
            const delta = (Math.random() - 0.5) * 10;
            const newFill = Math.max(
              10,
              Math.min(95, (data.fillLevel || 50) + delta),
            );
            return {
              ...node,
              data: { ...data, fillLevel: Math.round(newFill) },
            };
          }

          // For valves: occasionally toggle state
          if (data.categoryKey === 'valves' && Math.random() < 0.08) {
            const newState = data.state === 'open' ? 'closed' : 'open';
            return {
              ...node,
              data: { ...data, state: newState },
            };
          }

          // For pumps: ensure they stay animated (running)
          if (data.categoryKey === 'pumps' && !data.animated) {
            return {
              ...node,
              data: { ...data, animated: true, state: 'running' },
            };
          }

          return node;
        }),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // ── Fullscreen toggle ───────────────────────────────────────────────────

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Fullscreen not supported or blocked
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  }, []);

  // Track fullscreen changes from Escape key etc.
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ── Navigation helpers ──────────────────────────────────────────────────

  const handleGoToEditor = useCallback(() => {
    navigate(`/app/projects/${projectId}/screens/${screenId}/edit`);
  }, [navigate, projectId, screenId]);

  const handleBackToScreens = useCallback(() => {
    navigate(`/app/projects/${projectId}/screens`);
  }, [navigate, projectId]);

  // ── Not found state ─────────────────────────────────────────────────────

  if (!screen) {
    return (
      <div
        style={{
          background: '#0a0f0a',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            color: '#ef4444',
            fontSize: 48,
            fontWeight: 700,
            fontFamily: 'monospace',
          }}
        >
          404
        </div>
        <div style={{ color: '#94a3b8', fontSize: 14 }}>
          Screen not found or has been deleted.
        </div>
        <button
          onClick={() => navigate('/app/projects')}
          style={{
            marginTop: 8,
            padding: '8px 20px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 8,
            color: '#e2e8f0',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Back to Projects
        </button>
      </div>
    );
  }

  // ── Computed stats ──────────────────────────────────────────────────────

  const elementCount = nodes.length;
  const connectionCount = edges.length;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div style={{ background: '#0a0f0a', width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        defaultViewport={screen.viewport}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#0a0f0a' }}
      >
        {/* ── Grid Background ──────────────────────────────────────────── */}
        <Background
          variant={BackgroundVariant.Dots}
          color="#1a2e1a"
          gap={screen.gridSize}
          size={1}
        />

        {/* ── Controls ─────────────────────────────────────────────────── */}
        <Controls
          showInteractive={false}
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid rgba(74,222,128,0.15)',
          }}
        />

        {/* ── MiniMap ──────────────────────────────────────────────────── */}
        <MiniMap
          nodeColor={() => '#4ade80'}
          maskColor="rgba(10,15,10,0.85)"
          style={{
            background: '#0f1a0f',
            borderRadius: 8,
            border: '1px solid rgba(74,222,128,0.15)',
          }}
          pannable
          zoomable
        />

        {/* ── Top Toolbar ──────────────────────────────────────────────── */}
        <Panel position="top-center">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 20px',
              background: 'rgba(10,15,10,0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Live indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 20,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e, 0 0 16px rgba(34,197,94,0.4)',
                  animation: 'livePulse 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#22c55e',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Live
              </span>
            </div>

            {/* Separator */}
            <div
              style={{
                width: 1,
                height: 24,
                background: 'rgba(74,222,128,0.15)',
              }}
            />

            {/* Screen name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#e2e8f0',
                  whiteSpace: 'nowrap',
                }}
              >
                {screen.name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: '#64748b',
                  letterSpacing: '0.04em',
                }}
              >
                Runtime Viewer
              </span>
            </div>

            {/* Separator */}
            <div
              style={{
                width: 1,
                height: 24,
                background: 'rgba(74,222,128,0.15)',
              }}
            />

            {/* Clock */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                  color: '#4ade80',
                  letterSpacing: '0.05em',
                }}
              >
                {formatTime(currentTime)}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: '#64748b',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              >
                {formatDate(currentTime)}
              </span>
            </div>

            {/* Separator */}
            <div
              style={{
                width: 1,
                height: 24,
                background: 'rgba(74,222,128,0.15)',
              }}
            />

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={handleBackToScreens}
                style={{
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94a3b8',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: 4 }}
                >
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                Screens
              </button>

              <button
                onClick={handleGoToEditor}
                style={{
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#0a0f0a',
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 4px 16px rgba(34,197,94,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(34,197,94,0.3)';
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: 4 }}
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                Edit
              </button>

              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                style={{
                  padding: '6px 8px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94a3b8',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                {isFullscreen ? (
                  // Minimize icon
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                ) : (
                  // Maximize icon
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </Panel>

        {/* ── Bottom Info Bar ──────────────────────────────────────────── */}
        <Panel position="bottom-left">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '8px 16px',
              background: 'rgba(10,15,10,0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(74,222,128,0.12)',
              borderRadius: 10,
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            {/* Element count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              <span
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                }}
              >
                <span style={{ color: '#e2e8f0', fontWeight: 600, fontFamily: 'monospace' }}>
                  {elementCount}
                </span>{' '}
                elements
              </span>
            </div>

            {/* Separator dot */}
            <span style={{ color: '#334155', fontSize: 8 }}>&#9679;</span>

            {/* Connection count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                }}
              >
                <span style={{ color: '#e2e8f0', fontWeight: 600, fontFamily: 'monospace' }}>
                  {connectionCount}
                </span>{' '}
                connections
              </span>
            </div>

            {/* Description (if present) */}
            {screen.description && (
              <>
                <span style={{ color: '#334155', fontSize: 8 }}>&#9679;</span>
                <span
                  style={{
                    fontSize: 11,
                    color: '#64748b',
                    maxWidth: 360,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {screen.description}
                </span>
              </>
            )}
          </div>
        </Panel>

        {/* ── Bottom Right: Update Timestamp ───────────────────────────── */}
        <Panel position="bottom-right">
          <div
            style={{
              padding: '6px 12px',
              background: 'rgba(10,15,10,0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(74,222,128,0.12)',
              borderRadius: 8,
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: '#475569',
                fontFamily: 'monospace',
              }}
            >
              Last saved:{' '}
              {new Date(screen.updatedAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </Panel>
      </ReactFlow>

      {/* ── Keyframe animation for live pulse ──────────────────────────── */}
      <style>{`
        @keyframes livePulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 8px #22c55e, 0 0 16px rgba(34,197,94,0.4);
          }
          50% {
            opacity: 0.4;
            box-shadow: 0 0 4px #22c55e, 0 0 8px rgba(34,197,94,0.2);
          }
        }

        @keyframes flowDash {
          to {
            stroke-dashoffset: -12;
          }
        }

        /* Override React Flow default styles for dark theme */
        .react-flow__controls {
          background: rgba(10, 15, 10, 0.9) !important;
          border: 1px solid rgba(74, 222, 128, 0.15) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4) !important;
        }
        .react-flow__controls-button {
          background: transparent !important;
          border-bottom: 1px solid rgba(74, 222, 128, 0.08) !important;
          fill: #94a3b8 !important;
          color: #94a3b8 !important;
        }
        .react-flow__controls-button:hover {
          background: rgba(74, 222, 128, 0.08) !important;
          fill: #4ade80 !important;
        }
        .react-flow__controls-button svg {
          fill: currentColor !important;
        }

        /* Hide handles in viewer mode */
        .react-flow__handle {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* MiniMap dark theme */
        .react-flow__minimap {
          background: #0f1a0f !important;
        }
      `}</style>
    </div>
  );
}
