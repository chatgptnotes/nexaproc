import { BaseEdge, getSmoothStepPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

const PIPE_COLORS: Record<string, string> = {
  pipe: '#4ade80',
  signal: '#fbbf24',
  electrical: '#ef4444',
  pneumatic: '#60a5fa',
};

const PIPE_DASH: Record<string, string | undefined> = {
  pipe: undefined,
  signal: '6 3',
  electrical: '2 3',
  pneumatic: '8 4 2 4',
};

export function PipeConnectionEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
}: EdgeProps) {
  const pipeType = (data?.pipeType as string) || 'pipe';
  const pipeAnimated = data?.pipeAnimated as boolean;
  const pipeColor = (data?.color as string) || PIPE_COLORS[pipeType] || PIPE_COLORS.pipe;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: pipeColor,
        strokeWidth: 2.5,
        strokeDasharray: pipeAnimated ? '8 4' : PIPE_DASH[pipeType],
        animation: pipeAnimated ? 'flowDash 1s linear infinite' : undefined,
      }}
    />
  );
}
