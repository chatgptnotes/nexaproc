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
 * ISA 5.1 Screw Conveyor (Auger) — U-shaped trough with helical screw inside.
 * Motor drives one end, material moves from inlet hopper to discharge.
 */
const ScrewConveyor: React.FC<SymbolProps> = ({
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
        {/* U-shaped trough */}
        <path
          d="M 4 16 L 4 30 Q 4 36 10 36 L 38 36 Q 44 36 44 30 L 44 16"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Trough cover/top (partial — showing open section) */}
        <line x1="4" y1="16" x2="14" y2="16" stroke={fill} strokeWidth="2" />
        <line x1="22" y1="16" x2="44" y2="16" stroke={fill} strokeWidth="2" />

        {/* Feed hopper opening */}
        <path
          d="M 14 16 L 12 8 L 24 8 L 22 16"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Material indication in hopper */}
        <line x1="14" y1="11" x2="22" y2="11" stroke={fill} strokeWidth="1" strokeOpacity="0.4" />

        {/* Central shaft */}
        <line x1="6" y1="26" x2="42" y2="26" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />

        {/* Helical screw flights */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;5,0;0,0"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
          {/* Screw flights — ellipses along the shaft */}
          <ellipse cx="10" cy="26" rx="1.5" ry="7" fill="none" stroke={fill} strokeWidth="1.2" />
          <ellipse cx="16" cy="26" rx="1.5" ry="7" fill="none" stroke={fill} strokeWidth="1.2" />
          <ellipse cx="22" cy="26" rx="1.5" ry="7" fill="none" stroke={fill} strokeWidth="1.2" />
          <ellipse cx="28" cy="26" rx="1.5" ry="7" fill="none" stroke={fill} strokeWidth="1.2" />
          <ellipse cx="34" cy="26" rx="1.5" ry="7" fill="none" stroke={fill} strokeWidth="1.2" />
          <ellipse cx="40" cy="26" rx="1.5" ry="7" fill="none" stroke={fill} strokeWidth="1.2" />

          {/* Helical connecting lines (top) */}
          <path
            d="M 10 19 L 16 19 M 16 19 L 22 19 M 22 19 L 28 19 M 28 19 L 34 19 M 34 19 L 40 19"
            fill="none"
            stroke={fill}
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
        </g>

        {/* Discharge chute — right end bottom */}
        <path
          d="M 40 36 L 42 42 L 48 42"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <polygon points="44,40 46,42 44,44" fill={fill} fillOpacity="0.4" />

        {/* Motor drive — left end */}
        <line x1="4" y1="26" x2="0" y2="26" stroke={fill} strokeWidth="1.5" />
        <circle cx="-3" cy="26" r="3.5" fill="none" stroke={fill} strokeWidth="1.2" />
        <text x="-3" y="28" textAnchor="middle" fill={fill} fontSize="3.5" fontFamily="Arial, sans-serif" fontWeight="bold">M</text>

        {/* Bearing housings at ends */}
        <rect x="3" y="23" width="3" height="6" rx="0.5" fill={fill} fillOpacity="0.15" stroke={fill} strokeWidth="0.8" />
        <rect x="42" y="23" width="3" height="6" rx="0.5" fill={fill} fillOpacity="0.15" stroke={fill} strokeWidth="0.8" />

        {/* Support legs */}
        <line x1="12" y1="36" x2="12" y2="44" stroke={fill} strokeWidth="1.5" />
        <line x1="36" y1="36" x2="36" y2="44" stroke={fill} strokeWidth="1.5" />
        <line x1="8" y1="44" x2="16" y2="44" stroke={fill} strokeWidth="1.5" />
        <line x1="32" y1="44" x2="40" y2="44" stroke={fill} strokeWidth="1.5" />
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

export default ScrewConveyor;
