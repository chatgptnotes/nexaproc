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
 * ISA 5.1 Screw Pump — elongated body with spiral/helix indicator.
 * Wider than standard pump to show screw geometry.
 */
const ScrewPump: React.FC<SymbolProps> = ({
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
        <line x1="0" y1="24" x2="6" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="6" y1="20" x2="6" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Discharge pipe */}
        <line x1="42" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="20" x2="42" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Elongated pump body — rounded rectangle */}
        <rect
          x="6"
          y="14"
          width="36"
          height="20"
          rx="10"
          ry="10"
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
        />

        {/* Helical screw inside — sinusoidal wave pattern */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;4,0;0,0"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
          {/* Screw flight curves — elliptical cross-sections */}
          <ellipse cx="14" cy="24" rx="2" ry="6" fill="none" stroke={fill} strokeWidth="1.2" />
          <ellipse cx="20" cy="24" rx="2" ry="6" fill="none" stroke={fill} strokeWidth="1.2" />
          <ellipse cx="26" cy="24" rx="2" ry="6" fill="none" stroke={fill} strokeWidth="1.2" />
          <ellipse cx="32" cy="24" rx="2" ry="6" fill="none" stroke={fill} strokeWidth="1.2" />
          <ellipse cx="38" cy="24" rx="2" ry="6" fill="none" stroke={fill} strokeWidth="1.2" />

          {/* Central shaft */}
          <line x1="8" y1="24" x2="40" y2="24" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Screw thread connecting line — top spiral path */}
        <path
          d="M 12 18 Q 14 15 16 18 Q 18 15 20 18 Q 22 15 24 18 Q 26 15 28 18 Q 30 15 32 18 Q 34 15 36 18"
          fill="none"
          stroke={fill}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        {/* Bottom spiral path */}
        <path
          d="M 12 30 Q 14 33 16 30 Q 18 33 20 30 Q 22 33 24 30 Q 26 33 28 30 Q 30 33 32 30 Q 34 33 36 30"
          fill="none"
          stroke={fill}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
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

export default ScrewPump;
