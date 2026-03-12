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
 * ISA 5.1 Submersible Pump — pump symbol submerged in liquid.
 * Wavy line at top indicates liquid surface. Pump body below with
 * discharge pipe rising through liquid surface.
 */
const SubmersiblePump: React.FC<SymbolProps> = ({
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
        {/* Liquid surface — wavy line near top */}
        <path
          d="M 4 12 Q 8 9 12 12 Q 16 15 20 12 Q 24 9 28 12 Q 32 15 36 12 Q 40 9 44 12"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeOpacity="0.6"
        >
          {isRunning && (
            <animate
              attributeName="d"
              values="M 4 12 Q 8 9 12 12 Q 16 15 20 12 Q 24 9 28 12 Q 32 15 36 12 Q 40 9 44 12;M 4 12 Q 8 15 12 12 Q 16 9 20 12 Q 24 15 28 12 Q 32 9 36 12 Q 40 15 44 12;M 4 12 Q 8 9 12 12 Q 16 15 20 12 Q 24 9 28 12 Q 32 15 36 12 Q 40 9 44 12"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Liquid fill area (subtle shading below wave) */}
        <rect x="4" y="12" width="40" height="34" fill={fill} fillOpacity="0.05" rx="2" />

        {/* Discharge pipe — rising from pump through liquid surface */}
        <line x1="30" y1="0" x2="30" y2="20" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="0" x2="44" y2="0" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Main pump body circle — positioned in lower half (submerged) */}
        <circle cx="22" cy="30" r="11" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* Tangential triangle discharge pointing to pipe */}
        <polygon
          points="22,19 30,16 30,22"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Internal impeller */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 22 30"
              to="360 22 30"
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}
          <line x1="22" y1="23" x2="22" y2="37" stroke={fill} strokeWidth="1.2" />
          <line x1="15.9" y1="26.5" x2="28.1" y2="33.5" stroke={fill} strokeWidth="1.2" />
          <line x1="28.1" y1="26.5" x2="15.9" y2="33.5" stroke={fill} strokeWidth="1.2" />
          <circle cx="22" cy="30" r="2" fill={fill} />
        </g>

        {/* Motor/cable line going up from pump */}
        <line x1="22" y1="19" x2="22" y2="4" stroke={fill} strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.5" />

        {/* Inlet opening at bottom */}
        <line x1="16" y1="40" x2="28" y2="40" stroke={fill} strokeWidth="1.5" />
        <polygon points="20,42 22,40 24,42" fill={fill} fillOpacity="0.5" />
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

export default SubmersiblePump;
