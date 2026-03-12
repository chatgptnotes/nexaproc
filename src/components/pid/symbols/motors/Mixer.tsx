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
 * ISA 5.1 Mixer — motor on top of vessel with paddle blades inside.
 * Shows vessel outline, motor, shaft, gearbox, and flat paddle blades.
 */
const Mixer: React.FC<SymbolProps> = ({
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
        {/* Motor — small circle at top */}
        <circle cx="24" cy="5" r="4.5" fill="none" stroke={fill} strokeWidth="1.8" />
        <text x="24" y="7.5" textAnchor="middle" fill={fill} fontSize="5" fontFamily="Arial, sans-serif" fontWeight="bold">M</text>

        {/* Terminal leads */}
        <line x1="22" y1="0.5" x2="22" y2="-1" stroke={fill} strokeWidth="0.8" />
        <line x1="26" y1="0.5" x2="26" y2="-1" stroke={fill} strokeWidth="0.8" />

        {/* Gearbox — between motor and shaft */}
        <rect x="20" y="10" width="8" height="5" rx="1" fill="none" stroke={fill} strokeWidth="1.5" />
        {/* Gear indicator inside gearbox */}
        <circle cx="24" cy="12.5" r="1.5" fill="none" stroke={fill} strokeWidth="0.8" />

        {/* Vessel body — tapered */}
        <path
          d="M 8 16 L 8 40 Q 8 46 14 46 L 34 46 Q 40 46 40 40 L 40 16"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Vessel top flange */}
        <line x1="6" y1="16" x2="42" y2="16" stroke={fill} strokeWidth="2" />

        {/* Shaft through vessel */}
        <line x1="24" y1="15" x2="24" y2="40" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Seal at vessel entry */}
        <rect x="22" y="15" width="4" height="3" fill={fill} fillOpacity="0.15" stroke={fill} strokeWidth="0.8" />

        {/* Paddle blades — flat paddles at two levels */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 30"
              to="360 24 30"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
          {/* Upper paddle set */}
          <line x1="12" y1="28" x2="36" y2="28" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
          {/* Paddle blade faces */}
          <rect x="11" y="26" width="5" height="4" rx="0.5" fill={fill} fillOpacity="0.2" stroke={fill} strokeWidth="0.8" />
          <rect x="32" y="26" width="5" height="4" rx="0.5" fill={fill} fillOpacity="0.2" stroke={fill} strokeWidth="0.8" />

          {/* Lower paddle set — rotated 90 degrees */}
          <line x1="16" y1="36" x2="32" y2="36" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          <rect x="14" y="34" width="5" height="4" rx="0.5" fill={fill} fillOpacity="0.15" stroke={fill} strokeWidth="0.8" />
          <rect x="29" y="34" width="5" height="4" rx="0.5" fill={fill} fillOpacity="0.15" stroke={fill} strokeWidth="0.8" />
        </g>

        {/* Baffles on vessel walls */}
        <line x1="10" y1="20" x2="10" y2="38" stroke={fill} strokeWidth="1" strokeOpacity="0.3" />
        <line x1="38" y1="20" x2="38" y2="38" stroke={fill} strokeWidth="1" strokeOpacity="0.3" />

        {/* Inlet/outlet nozzles */}
        <line x1="0" y1="22" x2="8" y2="22" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="40" y1="42" x2="48" y2="42" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
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

export default Mixer;
