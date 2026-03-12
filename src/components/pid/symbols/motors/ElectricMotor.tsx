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
 * ISA 5.1 Electric Motor — circle with "M" text, terminal box on top,
 * and shaft output on right side. Standard motor symbol.
 */
const ElectricMotor: React.FC<SymbolProps> = ({
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
        {/* Terminal box on top */}
        <rect
          x="18"
          y="4"
          width="12"
          height="7"
          rx="1"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
        />
        {/* Terminal connection leads */}
        <line x1="21" y1="4" x2="21" y2="1" stroke={fill} strokeWidth="1.2" />
        <line x1="24" y1="4" x2="24" y2="1" stroke={fill} strokeWidth="1.2" />
        <line x1="27" y1="4" x2="27" y2="1" stroke={fill} strokeWidth="1.2" />
        {/* Connection from terminal box to motor body */}
        <line x1="24" y1="11" x2="24" y2="13" stroke={fill} strokeWidth="1.5" />

        {/* Main motor body circle */}
        <circle cx="24" cy="26" r="13" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* "M" letter inside */}
        <text
          x="24"
          y="31"
          textAnchor="middle"
          fill={fill}
          fontSize="14"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          M
        </text>

        {/* Shaft output — right side */}
        <line x1="37" y1="26" x2="46" y2="26" stroke={fill} strokeWidth="3" strokeLinecap="round" />
        {/* Shaft keyway */}
        <rect x="42" y="24.5" width="4" height="3" fill={fill} fillOpacity="0.3" stroke={fill} strokeWidth="0.8" rx="0.5" />

        {/* Mounting feet */}
        <line x1="14" y1="39" x2="14" y2="44" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <line x1="34" y1="39" x2="34" y2="44" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="44" x2="18" y2="44" stroke={fill} strokeWidth="2" />
        <line x1="30" y1="44" x2="38" y2="44" stroke={fill} strokeWidth="2" />

        {/* Running indicator — subtle rotation glow */}
        {isRunning && (
          <circle cx="24" cy="26" r="14.5" fill="none" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4">
            <animate
              attributeName="stroke-opacity"
              values="0.4;0.8;0.4"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        )}
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

export default ElectricMotor;
