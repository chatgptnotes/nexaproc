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
 * ISA 5.1 Diesel Engine — rectangle body with "DE" text, exhaust stack,
 * fuel inlet, and shaft output. Shows cylinder head detail.
 */
const DieselEngine: React.FC<SymbolProps> = ({
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
        {/* Exhaust stack */}
        <rect x="10" y="2" width="4" height="10" fill="none" stroke={fill} strokeWidth="1.5" rx="0.5" />
        {/* Exhaust smoke when running */}
        {isRunning && (
          <g>
            <circle cx="12" cy="2" r="1.5" fill={fill} fillOpacity="0.2">
              <animate attributeName="cy" values="2;-4" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="fillOpacity" values="0.3;0" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="r" values="1.5;3" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="14" cy="0" r="1" fill={fill} fillOpacity="0.15">
              <animate attributeName="cy" values="0;-5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="fillOpacity" values="0.2;0" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;2.5" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Main engine body — rectangle */}
        <rect
          x="6"
          y="12"
          width="32"
          height="24"
          rx="2"
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
        />

        {/* Cylinder head detail — internal lines */}
        <line x1="6" y1="18" x2="38" y2="18" stroke={fill} strokeWidth="1" strokeOpacity="0.4" />
        {/* Cylinder bores */}
        <rect x="10" y="13" width="6" height="5" rx="1" fill="none" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />
        <rect x="18" y="13" width="6" height="5" rx="1" fill="none" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />
        <rect x="26" y="13" width="6" height="5" rx="1" fill="none" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />

        {/* "DE" text */}
        <text
          x="22"
          y="30"
          textAnchor="middle"
          fill={fill}
          fontSize="11"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          DE
        </text>

        {/* Fuel inlet — left side */}
        <line x1="0" y1="28" x2="6" y2="28" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="2,26.5 5,28 2,29.5" fill={fill} fillOpacity="0.4" />

        {/* Shaft output — right side */}
        <line x1="38" y1="24" x2="46" y2="24" stroke={fill} strokeWidth="3" strokeLinecap="round" />
        {/* Flywheel indicator */}
        <circle cx="40" cy="24" r="3" fill="none" stroke={fill} strokeWidth="1.5" />
        <circle cx="40" cy="24" r="1" fill={fill} />

        {/* Mounting base */}
        <line x1="4" y1="38" x2="40" y2="38" stroke={fill} strokeWidth="2" />
        {/* Mounting bolts */}
        <line x1="8" y1="36" x2="8" y2="40" stroke={fill} strokeWidth="1.5" />
        <line x1="20" y1="36" x2="20" y2="40" stroke={fill} strokeWidth="1.5" />
        <line x1="32" y1="36" x2="32" y2="40" stroke={fill} strokeWidth="1.5" />

        {/* Vibration indicator when running */}
        {isRunning && (
          <g>
            <rect x="6" y="12" width="32" height="24" rx="2" fill="none" stroke={fill} strokeWidth="0.5" strokeOpacity="0.3">
              <animate attributeName="x" values="6;5.5;6;6.5;6" dur="0.15s" repeatCount="indefinite" />
            </rect>
          </g>
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

export default DieselEngine;
