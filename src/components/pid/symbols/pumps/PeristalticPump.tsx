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
 * ISA 5.1 Peristaltic Pump — circle body with internal flexible tube
 * and roller mechanism. Rollers compress the tube to push fluid.
 */
const PeristalticPump: React.FC<SymbolProps> = ({
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
        <line x1="10" y1="21" x2="10" y2="27" stroke={fill} strokeWidth="1.5" />

        {/* Discharge pipe */}
        <line x1="38" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="21" x2="38" y2="27" stroke={fill} strokeWidth="1.5" />

        {/* Outer housing circle */}
        <circle cx="24" cy="24" r="13" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* Flexible tube — runs along the inside of the housing */}
        <path
          d="M 11 24 A 13 13 0 1 1 37 24"
          fill="none"
          stroke={fill}
          strokeWidth="3"
          strokeOpacity="0.25"
          strokeLinecap="round"
        />
        {/* Tube inner path */}
        <path
          d="M 11 24 A 13 13 0 1 1 37 24"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeLinecap="round"
        />

        {/* Roller assembly — 3 rollers on a rotor arm */}
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
          {/* Rotor hub */}
          <circle cx="24" cy="24" r="3" fill={fill} fillOpacity="0.3" stroke={fill} strokeWidth="1" />

          {/* Rotor arms */}
          <line x1="24" y1="24" x2="24" y2="14" stroke={fill} strokeWidth="1.2" />
          <line x1="24" y1="24" x2="32.66" y2="29" stroke={fill} strokeWidth="1.2" />
          <line x1="24" y1="24" x2="15.34" y2="29" stroke={fill} strokeWidth="1.2" />

          {/* Rollers at the end of each arm — pressing against tube */}
          <circle cx="24" cy="14" r="2.5" fill={fill} fillOpacity="0.4" stroke={fill} strokeWidth="1" />
          <circle cx="32.66" cy="29" r="2.5" fill={fill} fillOpacity="0.4" stroke={fill} strokeWidth="1" />
          <circle cx="15.34" cy="29" r="2.5" fill={fill} fillOpacity="0.4" stroke={fill} strokeWidth="1" />
        </g>

        {/* Tube connections at entry/exit points */}
        <circle cx="11" cy="24" r="1" fill={fill} />
        <circle cx="37" cy="24" r="1" fill={fill} />
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

export default PeristalticPump;
