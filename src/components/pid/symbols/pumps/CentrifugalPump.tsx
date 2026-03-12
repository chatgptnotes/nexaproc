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
 * ISA 5.1 Centrifugal Pump — circle with tangential triangle outlet.
 * Inlet on left, discharge on top-right via triangle.
 */
const CentrifugalPump: React.FC<SymbolProps> = ({
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
        {/* Inlet pipe — horizontal line from left to circle */}
        <line x1="0" y1="24" x2="10" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Discharge pipe — vertical line from top of triangle upward */}
        <line x1="36" y1="6" x2="36" y2="0" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="0" x2="48" y2="0" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Main pump body — circle */}
        <circle
          cx="24"
          cy="24"
          r="13"
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
        />

        {/* Tangential triangle (discharge nozzle) — pointing upward-right */}
        <polygon
          points="24,11 36,6 36,16"
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Impeller vanes inside circle (3 curved vanes) */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
          <line x1="24" y1="24" x2="24" y2="14" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="24" x2="32.66" y2="29" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="24" x2="15.34" y2="29" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
          {/* Small hub circle */}
          <circle cx="24" cy="24" r="2" fill={fill} />
        </g>

        {/* Inlet flange tick marks */}
        <line x1="10" y1="21" x2="10" y2="27" stroke={fill} strokeWidth="1.5" />
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

export default CentrifugalPump;
