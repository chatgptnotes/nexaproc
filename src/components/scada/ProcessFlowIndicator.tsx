import React from 'react';
import clsx from 'clsx';

export type FlowDirection = 'left' | 'right' | 'up' | 'down';

export interface ProcessFlowIndicatorProps {
  flowRate: number;
  unit: string;
  direction: FlowDirection;
  active: boolean;
}

/**
 * Animated SVG pipe/flow indicator.
 * Shows dashed lines animating in the given flow direction.
 */
const ProcessFlowIndicator: React.FC<ProcessFlowIndicatorProps> = ({
  flowRate,
  unit,
  direction,
  active,
}) => {
  const isHorizontal = direction === 'left' || direction === 'right';
  const width = isHorizontal ? 180 : 60;
  const height = isHorizontal ? 60 : 140;

  // Pipe geometry
  const pipeThickness = 20;

  // Flow line positions (3 parallel dashed lines inside the pipe)
  const flowLines = isHorizontal
    ? [
        { x1: 10, y1: height / 2 - 4, x2: width - 10, y2: height / 2 - 4 },
        { x1: 10, y1: height / 2, x2: width - 10, y2: height / 2 },
        { x1: 10, y1: height / 2 + 4, x2: width - 10, y2: height / 2 + 4 },
      ]
    : [
        { x1: width / 2 - 4, y1: 10, x2: width / 2 - 4, y2: height - 10 },
        { x1: width / 2, y1: 10, x2: width / 2, y2: height - 10 },
        { x1: width / 2 + 4, y1: 10, x2: width / 2 + 4, y2: height - 10 },
      ];

  // Determine animation direction: strokeDashoffset goes positive or negative
  const getAnimationStyle = (): React.CSSProperties => {
    if (!active) return {};
    // Speed is inversely proportional to flow rate (faster flow = faster animation)
    const duration = Math.max(0.3, 2 - (flowRate / 1000) * 1.5);

    let keyframeName: string;
    switch (direction) {
      case 'right':
        keyframeName = 'flow-right';
        break;
      case 'left':
        keyframeName = 'flow-left';
        break;
      case 'down':
        keyframeName = 'flow-down';
        break;
      case 'up':
        keyframeName = 'flow-up';
        break;
    }

    return {
      animation: `${keyframeName} ${duration}s linear infinite`,
    };
  };

  // Pipe outline
  const pipeRect = isHorizontal
    ? { x: 4, y: (height - pipeThickness) / 2, w: width - 8, h: pipeThickness, rx: 4 }
    : { x: (width - pipeThickness) / 2, y: 4, w: pipeThickness, h: height - 8, rx: 4 };

  // Arrow at the end
  const arrowPoints = (): string => {
    const arrowSize = 6;
    switch (direction) {
      case 'right':
        return `${width - 16},${height / 2 - arrowSize} ${width - 8},${height / 2} ${width - 16},${height / 2 + arrowSize}`;
      case 'left':
        return `${16},${height / 2 - arrowSize} ${8},${height / 2} ${16},${height / 2 + arrowSize}`;
      case 'down':
        return `${width / 2 - arrowSize},${height - 16} ${width / 2},${height - 8} ${width / 2 + arrowSize},${height - 16}`;
      case 'up':
        return `${width / 2 - arrowSize},${16} ${width / 2},${8} ${width / 2 + arrowSize},${16}`;
    }
  };

  const animStyle = getAnimationStyle();

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <style>{`
        @keyframes flow-right {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes flow-left {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 20; }
        }
        @keyframes flow-down {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes flow-up {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 20; }
        }
      `}</style>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pipe body */}
        <rect
          x={pipeRect.x}
          y={pipeRect.y}
          width={pipeRect.w}
          height={pipeRect.h}
          rx={pipeRect.rx}
          fill="#0d2416"
          stroke={active ? 'rgba(74,222,128,0.3)' : 'rgba(107,114,128,0.3)'}
          strokeWidth={1.5}
        />

        {/* Flow lines (animated dashes) */}
        {flowLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={active ? '#4ade80' : '#374151'}
            strokeWidth={1}
            strokeDasharray="6 4"
            opacity={active ? 0.6 - i * 0.1 : 0.2}
            style={animStyle}
          />
        ))}

        {/* Arrow indicator */}
        {active && (
          <polygon
            points={arrowPoints()}
            fill="#4ade80"
            opacity={0.7}
          />
        )}
      </svg>

      {/* Flow rate label */}
      <span
        className={clsx(
          'text-xs font-mono',
          active ? 'text-nexaproc-green' : 'text-gray-600',
        )}
      >
        {active ? flowRate.toFixed(1) : '0.0'} {unit}
      </span>
    </div>
  );
};

export default ProcessFlowIndicator;
