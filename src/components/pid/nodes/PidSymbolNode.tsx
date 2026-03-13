import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { SymbolComponent } from '../PidSymbolPalette';

export interface PidSymbolNodeData {
  symbolComponent: SymbolComponent;
  symbolName: string;
  categoryKey: string;
  symbolIndex: number;
  size: number;
  rotation: number;
  state: string;
  animated: boolean;
  fillLevel?: number;
  label?: string;
  [key: string]: unknown;
}

export type PidSymbolNodeType = Node<PidSymbolNodeData, 'pidSymbol'>;

const handleStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  background: '#4ade80',
  border: '2px solid #0a0f0a',
  borderRadius: '50%',
};

function PidSymbolNodeComponent({ data, selected }: NodeProps<PidSymbolNodeType>) {
  const {
    symbolComponent: SymbolComp,
    size = 64,
    rotation = 0,
    state = 'running',
    animated = false,
    fillLevel,
    label,
  } = data;

  return (
    <div
      className={`relative group ${selected ? 'ring-2 ring-cyan-400/60 rounded-lg' : ''}`}
      style={{ padding: 4 }}
    >
      {/* Handles — connection points on all 4 sides */}
      <Handle type="target" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />

      {/* Symbol */}
      {React.createElement(SymbolComp, {
        size,
        state,
        animated,
        rotation,
        label,
        ...(fillLevel !== undefined ? { fillLevel: fillLevel / 100 } : {}),
      })}
    </div>
  );
}

export const PidSymbolNode = memo(PidSymbolNodeComponent);
