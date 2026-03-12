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
 * ISA 5.1 Reciprocating Pump — circle with piston/plunger indicator inside.
 * Shows cylinder bore and piston with connecting rod.
 */
const ReciprocatingPump: React.FC<SymbolProps> = ({
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

        {/* Cylinder bore — rectangle inside circle */}
        <rect
          x="16"
          y="19"
          width="16"
          height="10"
          rx="1"
          fill="none"
          stroke={fill}
          strokeWidth="1.2"
        />

        {/* Piston — vertical bar that moves left-right */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;5,0;0,0;-5,0;0,0"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
          {/* Piston head */}
          <rect
            x="22"
            y="19.5"
            width="3"
            height="9"
            fill={fill}
            fillOpacity="0.35"
            stroke={fill}
            strokeWidth="1"
            rx="0.5"
          />
          {/* Piston rod */}
          <line x1="23.5" y1="19" x2="23.5" y2="14" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
          {/* Connecting rod */}
          <line x1="23.5" y1="14" x2="28" y2="14" stroke={fill} strokeWidth="1.2" strokeLinecap="round" />
          {/* Crank pin */}
          <circle cx="28" cy="14" r="1.2" fill={fill} />
        </g>

        {/* Check valve indicators */}
        {/* Inlet check valve */}
        <polygon points="16,22 14,24 16,26" fill={fill} fillOpacity="0.5" />
        {/* Outlet check valve */}
        <polygon points="32,22 34,24 32,26" fill={fill} fillOpacity="0.5" />

        {/* Crosshead guide */}
        <line x1="20" y1="14" x2="32" y2="14" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />
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

export default ReciprocatingPump;
