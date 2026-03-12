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
 * ISA 5.1 Blower — circle housing with two curved centrifugal fan blades.
 * Axial inlet, tangential discharge.
 */
const Blower: React.FC<SymbolProps> = ({
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
        {/* Inlet — axial from left */}
        <line x1="0" y1="24" x2="11" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="11" y1="20" x2="11" y2="28" stroke={fill} strokeWidth="1.5" />
        {/* Inlet arrow */}
        <polygon points="5,22 9,24 5,26" fill={fill} fillOpacity="0.4" />

        {/* Discharge — tangential upward-right */}
        <line x1="34" y1="12" x2="44" y2="4" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="44" y1="4" x2="48" y2="4" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Volute housing — spiral-shaped casing (snail shell) */}
        <circle cx="24" cy="24" r="13" fill="none" stroke={fill} strokeWidth="2.5" />
        {/* Volute scroll — tangential outlet transition */}
        <path
          d="M 33 14 Q 38 10 36 12"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Two curved centrifugal fan blades */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="0.6s"
              repeatCount="indefinite"
            />
          )}
          {/* Blade 1 — curved S-shape */}
          <path
            d="M 24 24 Q 18 18 16 14"
            fill="none"
            stroke={fill}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 24 24 Q 28 18 32 16"
            fill="none"
            stroke={fill}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Blade 2 — curved S-shape (180 deg offset) */}
          <path
            d="M 24 24 Q 30 30 32 34"
            fill="none"
            stroke={fill}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 24 24 Q 20 30 16 32"
            fill="none"
            stroke={fill}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Additional blades for fullness */}
          <path d="M 24 24 Q 16 24 13 20" fill="none" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 24 24 Q 32 24 35 28" fill="none" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />

          {/* Hub */}
          <circle cx="24" cy="24" r="3" fill={fill} fillOpacity="0.25" stroke={fill} strokeWidth="1.5" />
          <circle cx="24" cy="24" r="1.2" fill={fill} />
        </g>

        {/* Motor connection — bottom shaft */}
        <line x1="24" y1="37" x2="24" y2="44" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="20" y="42" width="8" height="5" rx="1" fill="none" stroke={fill} strokeWidth="1.2" />
        <text x="24" y="46" textAnchor="middle" fill={fill} fontSize="3.5" fontFamily="Arial, sans-serif" fontWeight="bold">M</text>
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

export default Blower;
