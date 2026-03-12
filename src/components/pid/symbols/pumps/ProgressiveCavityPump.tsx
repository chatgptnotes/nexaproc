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
 * ISA 5.1 Progressive Cavity Pump (Moineau) — elongated helical body.
 * Shows the stator with internal helical rotor. Distinct from screw pump
 * by showing the single helical rotor within a double-helix stator.
 */
const ProgressiveCavityPump: React.FC<SymbolProps> = ({
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
        <line x1="0" y1="24" x2="5" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="5" y1="20" x2="5" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Discharge pipe */}
        <line x1="43" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="43" y1="20" x2="43" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Elongated stator body — tapered shape */}
        <path
          d="M 5 18 L 10 14 L 38 14 L 43 18 L 43 30 L 38 34 L 10 34 L 5 30 Z"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Double-helix stator cavities — sinusoidal walls */}
        <path
          d="M 10 17 Q 14 14 18 17 Q 22 20 26 17 Q 30 14 34 17 Q 38 20 40 17"
          fill="none"
          stroke={fill}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <path
          d="M 10 31 Q 14 34 18 31 Q 22 28 26 31 Q 30 34 34 31 Q 38 28 40 31"
          fill="none"
          stroke={fill}
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Helical rotor — single helix with eccentric rotation */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;2,1;0,0;-2,-1;0,0"
              dur="0.6s"
              repeatCount="indefinite"
            />
          )}
          {/* Rotor body — sinusoidal shape */}
          <path
            d="M 10 22 Q 15 18 20 24 Q 25 30 30 24 Q 35 18 40 22"
            fill="none"
            stroke={fill}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 10 26 Q 15 30 20 24 Q 25 18 30 24 Q 35 30 40 26"
            fill="none"
            stroke={fill}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Rotor lobe fills — cavity volumes */}
          <path
            d="M 10 22 Q 15 18 20 24 Q 15 30 10 26 Z"
            fill={fill}
            fillOpacity="0.12"
          />
          <path
            d="M 20 24 Q 25 18 30 24 Q 25 30 20 24 Z"
            fill={fill}
            fillOpacity="0.12"
          />
          <path
            d="M 30 24 Q 35 18 40 22 L 40 26 Q 35 30 30 24 Z"
            fill={fill}
            fillOpacity="0.12"
          />
        </g>

        {/* Drive shaft connection on inlet side */}
        <rect x="5" y="22" width="5" height="4" rx="1" fill={fill} fillOpacity="0.3" stroke={fill} strokeWidth="0.8" />

        {/* Flow direction arrow */}
        <polygon points="42,22 44,24 42,26" fill={fill} fillOpacity="0.5" />
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

export default ProgressiveCavityPump;
