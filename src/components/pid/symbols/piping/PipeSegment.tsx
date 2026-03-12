import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'active' | 'inactive' | 'fault' | 'offline';
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

export interface PipeSegmentProps extends SymbolProps {
  flowDirection?: 'left' | 'right' | 'none';
  fluid?: 'liquid' | 'gas' | 'steam' | 'slurry';
}

const STATE_COLORS: Record<string, string> = {
  active: '#4ade80',
  inactive: '#6b7280',
  fault: '#ef4444',
  offline: '#374151',
};

const FLUID_DASH: Record<string, string> = {
  liquid: 'none',
  gas: '6 3',
  steam: '8 3 2 3',
  slurry: '4 2',
};

/**
 * Pipe Segment — Horizontal pipe with double lines and fill.
 * Flow direction indicated by animated chevrons.
 * Fluid type shown by line style: solid (liquid), dashed (gas),
 * dash-dot (steam), short dash (slurry).
 */
const PipeSegment: React.FC<PipeSegmentProps> = ({
  size = 48,
  state = 'active',
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
  flowDirection = 'right',
  fluid = 'liquid',
}) => {
  const fill = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const isFault = state === 'fault';
  const dash = FLUID_DASH[fluid] || 'none';

  return (
    <svg
      width={size}
      height={label ? size + 16 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-pipe pid-pipe-segment ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes pidFlowRight {
          from { transform: translateX(-12px); }
          to { transform: translateX(0px); }
        }
        @keyframes pidFlowLeft {
          from { transform: translateX(12px); }
          to { transform: translateX(0px); }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Pipe wall — upper line */}
        <line
          x1="0" y1="18" x2="48" y2="18"
          stroke={fill}
          strokeWidth="2"
          strokeDasharray={dash}
          strokeLinecap="round"
        />
        {/* Pipe wall — lower line */}
        <line
          x1="0" y1="30" x2="48" y2="30"
          stroke={fill}
          strokeWidth="2"
          strokeDasharray={dash}
          strokeLinecap="round"
        />
        {/* Pipe fill */}
        <rect
          x="0" y="19" width="48" height="10"
          fill={fill}
          opacity="0.15"
        />
        {/* Flow direction chevrons */}
        {flowDirection !== 'none' && (
          <g
            clipPath="url(#pipeClip)"
            style={animated ? {
              animation: flowDirection === 'right'
                ? 'pidFlowRight 0.8s linear infinite'
                : 'pidFlowLeft 0.8s linear infinite',
            } : undefined}
          >
            <defs>
              <clipPath id="pipeClip">
                <rect x="1" y="19" width="46" height="10" />
              </clipPath>
            </defs>
            {[0, 12, 24, 36, 48].map((x) => (
              <polyline
                key={x}
                points={
                  flowDirection === 'right'
                    ? `${x - 3},21 ${x + 3},24 ${x - 3},27`
                    : `${x + 3},21 ${x - 3},24 ${x + 3},27`
                }
                fill="none"
                stroke={fill}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />
            ))}
          </g>
        )}
      </g>
      {label && (
        <text x="24" y="58" textAnchor="middle" fontSize="7"
          fontFamily="'Inter', 'Segoe UI', sans-serif" fill={fill} fontWeight="600">
          {label}
        </text>
      )}
    </svg>
  );
};

export default PipeSegment;
