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
 * ISA 5.1 Agitator — motor on top with vertical shaft and impeller blades
 * at bottom. Shows motor circle, shaft, bearing, and pitched impeller blades.
 */
const Agitator: React.FC<SymbolProps> = ({
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
        {/* Motor circle at top */}
        <circle cx="24" cy="9" r="7" fill="none" stroke={fill} strokeWidth="2" />
        <text
          x="24"
          y="12"
          textAnchor="middle"
          fill={fill}
          fontSize="7"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          M
        </text>

        {/* Terminal box */}
        <rect x="20" y="0" width="8" height="3" rx="0.5" fill="none" stroke={fill} strokeWidth="1" />
        <line x1="22" y1="0" x2="22" y2="-1" stroke={fill} strokeWidth="0.8" />
        <line x1="24" y1="0" x2="24" y2="-1" stroke={fill} strokeWidth="0.8" />
        <line x1="26" y1="0" x2="26" y2="-1" stroke={fill} strokeWidth="0.8" />

        {/* Bearing housing — between motor and shaft */}
        <rect x="21" y="16" width="6" height="4" rx="1" fill={fill} fillOpacity="0.15" stroke={fill} strokeWidth="1.2" />

        {/* Vertical shaft */}
        <line x1="24" y1="16" x2="24" y2="38" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Seal/stuffing box indicator */}
        <line x1="20" y1="22" x2="28" y2="22" stroke={fill} strokeWidth="1" strokeOpacity="0.5" />

        {/* Impeller blades at bottom — pitched blade turbine */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 38"
              to="360 24 38"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
          {/* 4 pitched blades */}
          {/* Blade 1 — right */}
          <path
            d="M 24 38 L 34 35 L 36 38 L 24 38"
            fill={fill}
            fillOpacity="0.2"
            stroke={fill}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Blade 2 — left */}
          <path
            d="M 24 38 L 14 35 L 12 38 L 24 38"
            fill={fill}
            fillOpacity="0.2"
            stroke={fill}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Blade 3 — front-right (angled) */}
          <path
            d="M 24 38 L 32 41 L 34 38 L 24 38"
            fill={fill}
            fillOpacity="0.15"
            stroke={fill}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Blade 4 — front-left (angled) */}
          <path
            d="M 24 38 L 16 41 L 14 38 L 24 38"
            fill={fill}
            fillOpacity="0.15"
            stroke={fill}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Hub */}
          <circle cx="24" cy="38" r="2" fill={fill} fillOpacity="0.4" stroke={fill} strokeWidth="1" />
        </g>

        {/* Vessel outline indicator (dashed) — showing context */}
        <path
          d="M 10 22 L 10 44 L 38 44 L 38 22"
          fill="none"
          stroke={fill}
          strokeWidth="0.8"
          strokeDasharray="3,2"
          strokeOpacity="0.3"
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

export default Agitator;
