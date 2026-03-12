import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'active' | 'inactive' | 'fault' | 'offline';
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

const STATE_COLORS: Record<string, string> = {
  active: '#4ade80',
  inactive: '#6b7280',
  fault: '#ef4444',
  offline: '#374151',
};

/**
 * Pasteurizer — Plate heat exchanger section with temperature/timer indicator.
 * Stacked plates with product and heating medium channels.
 */
const Pasteurizer: React.FC<SymbolProps> = ({
  size = 48,
  state = 'active',
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const fill = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const isFault = state === 'fault';

  return (
    <svg
      width={size}
      height={label ? size + 16 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-process pid-pasteurizer ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Frame/press plates */}
        <rect x="6" y="8" width="4" height="28" fill={fill} opacity="0.3" stroke={fill} strokeWidth="1.5" rx="1" />
        <rect x="38" y="8" width="4" height="28" fill={fill} opacity="0.3" stroke={fill} strokeWidth="1.5" rx="1" />

        {/* Heat exchanger plates */}
        {[12, 16, 20, 24, 28, 32, 36].map((x) => (
          <line key={x} x1={x} y1="10" x2={x} y2="34" stroke={fill} strokeWidth="1.2" opacity="0.5" />
        ))}

        {/* Tie rods (top and bottom) */}
        <line x1="8" y1="9" x2="40" y2="9" stroke={fill} strokeWidth="1.5" />
        <line x1="8" y1="35" x2="40" y2="35" stroke={fill} strokeWidth="1.5" />

        {/* Product inlet — bottom left */}
        <line x1="0" y1="30" x2="6" y2="30" stroke={fill} strokeWidth="1.5" />
        <polygon points="0,28 4,30 0,32" fill={fill} opacity="0.4" />

        {/* Product outlet — top right */}
        <line x1="42" y1="14" x2="48" y2="14" stroke={fill} strokeWidth="1.5" />
        <polygon points="44,12 48,14 44,16" fill={fill} opacity="0.4" />

        {/* Heating medium inlet — top left */}
        <line x1="0" y1="14" x2="6" y2="14" stroke={fill} strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />

        {/* Heating medium outlet — bottom right */}
        <line x1="42" y1="30" x2="48" y2="30" stroke={fill} strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />

        {/* Temperature indicator — thermometer symbol */}
        <circle cx="24" cy="4" r="3" fill="none" stroke={fill} strokeWidth="1" />
        <text x="24" y="6" textAnchor="middle" fontSize="4" fill={fill}
          fontFamily="'Inter', sans-serif" fontWeight="600">T</text>

        {/* Timer/hold indicator */}
        <circle cx="24" cy="42" r="3" fill="none" stroke={fill} strokeWidth="1" />
        <line x1="24" y1="40" x2="24" y2="42" stroke={fill} strokeWidth="0.8" />
        <line x1="24" y1="42" x2="26" y2="43" stroke={fill} strokeWidth="0.8" />

        {/* Flow animation */}
        {animated && (
          <circle r="1.5" fill={fill} opacity="0.5">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M 0,30 L 10,30 L 10,14 L 48,14"
            />
          </circle>
        )}
      </g>
      {label && (
        <text x="24" y="58" textAnchor="middle" fontSize="7"
          fontFamily="'Inter', 'Segoe UI', sans-serif" fill={fill} fontWeight="600">
          {label}
        </text>
      )}
    </svg>
  );
};

export default Pasteurizer;
