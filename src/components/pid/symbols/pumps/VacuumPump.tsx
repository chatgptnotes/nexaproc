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
 * ISA 5.1 Vacuum Pump — standard pump circle with "V" indicator and
 * suction arrow pointing inward. Exhaust pipe on outlet side.
 */
const VacuumPump: React.FC<SymbolProps> = ({
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
        {/* Suction inlet pipe */}
        <line x1="0" y1="24" x2="10" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="20" x2="10" y2="28" stroke={fill} strokeWidth="1.5" />
        {/* Suction arrow pointing inward */}
        <polygon points="5,22 9,24 5,26" fill={fill} />

        {/* Exhaust outlet pipe */}
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

        {/* Main pump body circle */}
        <circle cx="24" cy="24" r="13" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* Rotating vanes inside */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
          {/* Four vanes */}
          <line x1="24" y1="15" x2="24" y2="33" stroke={fill} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="15" y1="24" x2="33" y2="24" stroke={fill} strokeWidth="1.2" strokeLinecap="round" />
          {/* Hub */}
          <circle cx="24" cy="24" r="2.5" fill={fill} fillOpacity="0.3" stroke={fill} strokeWidth="1.2" />
        </g>

        {/* "V" indicator — prominent */}
        <text
          x="24"
          y="42"
          textAnchor="middle"
          fill={fill}
          fontSize="8"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          V
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

export default VacuumPump;
