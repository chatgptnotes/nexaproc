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
 * ISA 5.1 Variable Speed Drive (VSD/VFD) — motor circle with "VSD" text,
 * lightning bolt power symbol, and frequency control indicator.
 */
const VariableSpeedDrive: React.FC<SymbolProps> = ({
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
        {/* Power input leads — top */}
        <line x1="18" y1="0" x2="18" y2="5" stroke={fill} strokeWidth="1.2" />
        <line x1="24" y1="0" x2="24" y2="5" stroke={fill} strokeWidth="1.2" />
        <line x1="30" y1="0" x2="30" y2="5" stroke={fill} strokeWidth="1.2" />

        {/* Drive enclosure — rectangle above motor */}
        <rect
          x="12"
          y="5"
          width="24"
          height="10"
          rx="1.5"
          fill="none"
          stroke={fill}
          strokeWidth="2"
        />

        {/* Lightning bolt inside drive enclosure */}
        <polygon
          points="22,7 20,11 23,10 21,14 26,9 23,10 25,7"
          fill={fill}
          fillOpacity="0.6"
          stroke={fill}
          strokeWidth="0.5"
        />

        {/* Sine wave indicator — variable frequency */}
        <path
          d="M 28 8 Q 30 6 32 8 Q 34 10 32 12"
          fill="none"
          stroke={fill}
          strokeWidth="1"
          strokeOpacity="0.6"
        >
          {isRunning && (
            <animate
              attributeName="stroke-opacity"
              values="0.3;0.9;0.3"
              dur="0.5s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* Connection from drive to motor */}
        <line x1="24" y1="15" x2="24" y2="17" stroke={fill} strokeWidth="1.5" />

        {/* Main motor body circle */}
        <circle cx="24" cy="30" r="13" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* "VSD" text inside motor */}
        <text
          x="24"
          y="29"
          textAnchor="middle"
          fill={fill}
          fontSize="8"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          VSD
        </text>

        {/* "M" subscript */}
        <text
          x="24"
          y="37"
          textAnchor="middle"
          fill={fill}
          fontSize="6"
          fontFamily="Arial, sans-serif"
          fontWeight="600"
          fillOpacity="0.7"
        >
          M
        </text>

        {/* Shaft output — right side */}
        <line x1="37" y1="30" x2="46" y2="30" stroke={fill} strokeWidth="3" strokeLinecap="round" />
        <rect x="42" y="28.5" width="4" height="3" fill={fill} fillOpacity="0.3" stroke={fill} strokeWidth="0.8" rx="0.5" />

        {/* Mounting feet */}
        <line x1="14" y1="43" x2="14" y2="46" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <line x1="34" y1="43" x2="34" y2="46" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="46" x2="18" y2="46" stroke={fill} strokeWidth="1.5" />
        <line x1="30" y1="46" x2="38" y2="46" stroke={fill} strokeWidth="1.5" />

        {/* Running indicator */}
        {isRunning && (
          <circle cx="24" cy="30" r="14.5" fill="none" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4">
            <animate
              attributeName="stroke-opacity"
              values="0.4;0.8;0.4"
              dur="0.8s"
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

export default VariableSpeedDrive;
