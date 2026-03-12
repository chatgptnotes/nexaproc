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
 * ISA 5.1 Compressor — circle with single triangle pointing inward (toward center).
 * This distinguishes it from a pump where the triangle points outward.
 * Inlet on left, discharge on right with higher pressure indicator.
 */
const Compressor: React.FC<SymbolProps> = ({
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
        {/* Suction inlet pipe — left */}
        <line x1="0" y1="24" x2="10" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="20" x2="10" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Discharge pipe — right */}
        <line x1="38" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="20" x2="38" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Main compressor body — circle */}
        <circle cx="24" cy="24" r="13" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* Triangle pointing INWARD (toward center) — distinguishing compressor feature */}
        <polygon
          points="11,14 11,34 26,24"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Internal compression indicator — converging lines */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}
          {/* Rotor blades */}
          <line x1="24" y1="16" x2="24" y2="32" stroke={fill} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="16.1" y1="19.4" x2="31.9" y2="28.6" stroke={fill} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="16.1" y1="28.6" x2="31.9" y2="19.4" stroke={fill} strokeWidth="1.2" strokeLinecap="round" />
          {/* Hub */}
          <circle cx="24" cy="24" r="2.5" fill={fill} fillOpacity="0.3" stroke={fill} strokeWidth="1" />
        </g>

        {/* Pressure arrows — showing compression */}
        <polygon points="35,21 37,24 35,27" fill={fill} fillOpacity="0.4" />

        {/* Motor connection on top */}
        <line x1="24" y1="11" x2="24" y2="5" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <rect x="20" y="2" width="8" height="4" rx="1" fill="none" stroke={fill} strokeWidth="1.2" />
        <text
          x="24"
          y="5.5"
          textAnchor="middle"
          fill={fill}
          fontSize="3.5"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          M
        </text>

        {/* Running pulse */}
        {isRunning && (
          <circle cx="24" cy="24" r="14.5" fill="none" stroke={fill} strokeWidth="0.6" strokeOpacity="0.3">
            <animate
              attributeName="r"
              values="14.5;16;14.5"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              values="0.3;0;0.3"
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

export default Compressor;
