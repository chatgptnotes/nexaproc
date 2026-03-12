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
 * ISA 5.1 Positive Displacement Pump — circle with internal crescent.
 * The crescent shape indicates the positive displacement mechanism.
 */
const PositiveDisplacementPump: React.FC<SymbolProps> = ({
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
        {/* Inlet flange */}
        <line x1="10" y1="20" x2="10" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Discharge pipe */}
        <line x1="38" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        {/* Discharge flange */}
        <line x1="38" y1="20" x2="38" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Discharge triangle */}
        <polygon
          points="34,17 42,24 34,31"
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Main pump body circle */}
        <circle
          cx="24"
          cy="24"
          r="13"
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
        />

        {/* Internal crescent — two overlapping arcs for PD mechanism */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          {/* Outer rotor arc */}
          <path
            d="M 20 16 A 10 10 0 0 1 28 16"
            fill="none"
            stroke={fill}
            strokeWidth="1.5"
          />
          {/* Inner crescent shape */}
          <path
            d="M 18 24 A 8 8 0 0 1 30 24 A 5 5 0 0 0 18 24 Z"
            fill={fill}
            fillOpacity="0.25"
            stroke={fill}
            strokeWidth="1.2"
          />
          {/* Displacement chamber arcs */}
          <path
            d="M 20 32 A 10 10 0 0 1 28 32"
            fill="none"
            stroke={fill}
            strokeWidth="1.5"
          />
          {/* Center shaft */}
          <circle cx="24" cy="24" r="2" fill={fill} />
        </g>

        {/* PD label inside */}
        <text
          x="24"
          y="40"
          textAnchor="middle"
          fill={fill}
          fontSize="5"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fillOpacity="0.6"
        >
          PD
        </text>
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

export default PositiveDisplacementPump;
