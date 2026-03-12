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
 * Rupture Disc — Thin membrane (disc) between two flanges.
 * ISA standard: two flanges with a curved dome membrane between them.
 */
const RuptureDisc: React.FC<SymbolProps> = ({
  size = 48,
  state = 'active',
  color,
  label,
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
      className={`pid-process pid-rupture-disc ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Left pipe */}
        <line x1="0" y1="21" x2="18" y2="21" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="27" x2="18" y2="27" stroke={fill} strokeWidth="2" />

        {/* Left flange */}
        <line x1="18" y1="12" x2="18" y2="36" stroke={fill} strokeWidth="2.5" />

        {/* Rupture disc membrane — curved dome facing right (pressure side) */}
        <path
          d="M 22,12 Q 28,24 22,36"
          fill="none"
          stroke={fill}
          strokeWidth="2"
        />

        {/* Burst indicator — X mark on membrane */}
        {state === 'fault' && (
          <g>
            <line x1="22" y1="20" x2="26" y2="28" stroke={fill} strokeWidth="1.5" />
            <line x1="26" y1="20" x2="22" y2="28" stroke={fill} strokeWidth="1.5" />
          </g>
        )}

        {/* Right flange */}
        <line x1="28" y1="12" x2="28" y2="36" stroke={fill} strokeWidth="2.5" />

        {/* Right pipe */}
        <line x1="28" y1="21" x2="48" y2="21" stroke={fill} strokeWidth="2" />
        <line x1="28" y1="27" x2="48" y2="27" stroke={fill} strokeWidth="2" />

        {/* Bolt indicators */}
        <line x1="16" y1="14" x2="18" y2="14" stroke={fill} strokeWidth="1.5" />
        <line x1="16" y1="34" x2="18" y2="34" stroke={fill} strokeWidth="1.5" />
        <line x1="28" y1="14" x2="30" y2="14" stroke={fill} strokeWidth="1.5" />
        <line x1="28" y1="34" x2="30" y2="34" stroke={fill} strokeWidth="1.5" />

        {/* Pressure direction arrow */}
        <polygon points="8,22 14,24 8,26" fill={fill} opacity="0.3" />

        {/* Tag label "RD" */}
        <text x="23" y="42" textAnchor="middle" fontSize="5" fill={fill} opacity="0.5"
          fontFamily="'Inter', sans-serif" fontWeight="600">RD</text>
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

export default RuptureDisc;
