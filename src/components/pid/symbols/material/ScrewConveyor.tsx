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
 * Screw Conveyor — U-shaped trough with helical screw (auger) inside.
 * ISA representation with helical flight pattern.
 */
const ScrewConveyor: React.FC<SymbolProps> = ({
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
      className={`pid-material pid-screw-conveyor ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidScrewRotate {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -16; }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Trough — U-shape */}
        <path
          d="M 4,18 L 4,32 Q 4,38 10,38 L 38,38 Q 44,38 44,32 L 44,18"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Trough top flanges */}
        <line x1="2" y1="18" x2="8" y2="18" stroke={fill} strokeWidth="2" />
        <line x1="40" y1="18" x2="46" y2="18" stroke={fill} strokeWidth="2" />

        {/* Central shaft */}
        <line x1="4" y1="28" x2="44" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Helical screw flights — sinusoidal pattern */}
        <path
          d="M 8,22 Q 12,34 16,28 Q 20,22 24,28 Q 28,34 32,28 Q 36,22 40,28"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          style={animated ? { animation: 'pidScrewRotate 0.8s linear infinite' } : undefined}
          strokeDasharray="8 8"
        />

        {/* Drive motor indicator (left end) */}
        <rect x="0" y="22" width="4" height="12" fill={fill} opacity="0.3" stroke={fill} strokeWidth="1" rx="1" />

        {/* Inlet hopper opening */}
        <path d="M 10,12 L 14,18 L 22,18 L 26,12" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Discharge opening */}
        <line x1="38" y1="38" x2="38" y2="44" stroke={fill} strokeWidth="1.5" />
        <line x1="42" y1="38" x2="42" y2="44" stroke={fill} strokeWidth="1.5" />
        <polyline points="36,44 40,46 44,44" fill="none" stroke={fill} strokeWidth="1" />
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

export default ScrewConveyor;
