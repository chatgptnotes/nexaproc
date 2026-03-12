import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'running' | 'stopped' | 'fault' | 'maintenance' | 'standby' | 'offline';
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

const STATE_COLORS: Record<string, string> = {
  running: '#4ade80',
  stopped: '#6b7280',
  fault: '#ef4444',
  maintenance: '#38bdf8',
  standby: '#fbbf24',
  offline: '#374151',
};

/**
 * ISA 5.1 Diaphragm Pump — circle body with curved diaphragm membrane inside.
 * Two check valve indicators at inlet/outlet. Diaphragm flexes when animated.
 */
const DiaphragmPump: React.FC<SymbolProps> = ({
  size = 48,
  state = 'stopped',
  color,
  label,
  animated = false,
  rotation = 0,
  className,
  onClick,
}) => {
  const fill = color ?? STATE_COLORS[state] ?? STATE_COLORS.stopped;
  const isRunning = animated && state === 'running';

  return (
    <svg
      width={size}
      height={label ? size * 1.35 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Inlet pipe */}
        <line x1="0" y1="24" x2="10" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="20" x2="10" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Discharge pipe */}
        <line x1="38" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="20" x2="38" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Discharge triangle */}
        <polygon
          points="34,18 41,24 34,30"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Main body circle */}
        <circle cx="24" cy="24" r="13" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* Diaphragm membrane — curved line dividing the circle */}
        <path
          d={isRunning ? undefined : 'M 14 24 Q 24 17 34 24'}
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
        >
          {isRunning && (
            <animate
              attributeName="d"
              values="M 14 24 Q 24 17 34 24;M 14 24 Q 24 31 34 24;M 14 24 Q 24 17 34 24"
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}
          {!isRunning && null}
        </path>
        {/* Static path when not animating — rendered only if not running */}

        {/* Check valve indicators — small triangles at inlet and outlet */}
        {/* Inlet check valve */}
        <polygon
          points="15,21 18,24 15,27"
          fill={fill}
          fillOpacity="0.4"
          stroke={fill}
          strokeWidth="0.8"
        />
        {/* Outlet check valve */}
        <polygon
          points="33,21 30,24 33,27"
          fill={fill}
          fillOpacity="0.4"
          stroke={fill}
          strokeWidth="0.8"
        />

        {/* Diaphragm mount points */}
        <circle cx="14" cy="24" r="1" fill={fill} />
        <circle cx="34" cy="24" r="1" fill={fill} />

        {/* Pressure chamber shading — upper half */}
        <path
          d="M 14 24 A 13 13 0 0 1 34 24"
          fill={fill}
          fillOpacity="0.06"
          stroke="none"
        />
      </g>

      {label && (
        <text
          x="24"
          y="56"
          textAnchor="middle"
          fill={fill}
          fontSize="7"
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export default DiaphragmPump;
