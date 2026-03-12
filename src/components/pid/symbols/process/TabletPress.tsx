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
 * Tablet Press — Upper and lower punch with die cavity.
 * Shows compression action with punches converging on die.
 */
const TabletPress: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-tablet-press ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidPunchDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        @keyframes pidPunchUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Die table/frame */}
        <rect x="8" y="18" width="32" height="12" fill="none" stroke={fill} strokeWidth="2" rx="1" />

        {/* Die cavity */}
        <rect x="18" y="18" width="12" height="12" fill={fill} opacity="0.15" stroke={fill} strokeWidth="1" />

        {/* Upper punch */}
        <g style={animated ? { animation: 'pidPunchDown 0.8s ease-in-out infinite' } : undefined}>
          <rect x="20" y="4" width="8" height="14" fill={fill} opacity="0.25"
            stroke={fill} strokeWidth="1.5" rx="1" />
          {/* Punch tip */}
          <rect x="20" y="16" width="8" height="2" fill={fill} opacity="0.5" />
          {/* Stem */}
          <line x1="24" y1="0" x2="24" y2="4" stroke={fill} strokeWidth="2" />
        </g>

        {/* Lower punch */}
        <g style={animated ? { animation: 'pidPunchUp 0.8s ease-in-out infinite' } : undefined}>
          <rect x="20" y="30" width="8" height="14" fill={fill} opacity="0.25"
            stroke={fill} strokeWidth="1.5" rx="1" />
          {/* Punch tip */}
          <rect x="20" y="30" width="8" height="2" fill={fill} opacity="0.5" />
          {/* Stem */}
          <line x1="24" y1="44" x2="24" y2="48" stroke={fill} strokeWidth="2" />
        </g>

        {/* Powder fill indicator */}
        <rect x="19" y="22" width="10" height="4" fill={fill} opacity="0.2" />

        {/* Feed hopper */}
        <path d="M 38,10 L 42,10 L 40,18 L 36,18" fill="none" stroke={fill} strokeWidth="1" opacity="0.5" />

        {/* Tablet ejection chute */}
        <path d="M 8,24 L 2,28" fill="none" stroke={fill} strokeWidth="1" opacity="0.5" />
        {/* Ejected tablet */}
        <ellipse cx="2" cy="30" rx="2" ry="1.2" fill={fill} opacity="0.4" />

        {/* Force arrows */}
        <polygon points="22,2 24,0 26,2" fill={fill} opacity="0.4" />
        <polygon points="22,46 24,48 26,46" fill={fill} opacity="0.4" />
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

export default TabletPress;
