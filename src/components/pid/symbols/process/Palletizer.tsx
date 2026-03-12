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
 * Palletizer — Stacking arm with boxes on a pallet.
 * Robotic/mechanical arm placing boxes onto pallet stack.
 */
const Palletizer: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-palletizer ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidArmSwing {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Pallet base */}
        <rect x="22" y="42" width="22" height="3" fill={fill} opacity="0.3" stroke={fill} strokeWidth="1" />
        <line x1="26" y1="45" x2="26" y2="47" stroke={fill} strokeWidth="1.5" />
        <line x1="36" y1="45" x2="36" y2="47" stroke={fill} strokeWidth="1.5" />

        {/* Stacked boxes on pallet */}
        <rect x="24" y="34" width="8" height="8" fill={fill} opacity="0.15" stroke={fill} strokeWidth="1" />
        <rect x="33" y="34" width="8" height="8" fill={fill} opacity="0.15" stroke={fill} strokeWidth="1" />
        <rect x="28" y="26" width="8" height="8" fill={fill} opacity="0.15" stroke={fill} strokeWidth="1" />

        {/* Robot arm base/column */}
        <rect x="4" y="30" width="6" height="16" fill={fill} opacity="0.2" stroke={fill} strokeWidth="1.5" rx="1" />

        {/* Articulated arm */}
        <g style={animated ? { animation: 'pidArmSwing 2s ease-in-out infinite', transformOrigin: '7px 30px' } : undefined}>
          {/* Upper arm */}
          <line x1="7" y1="30" x2="7" y2="14" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
          {/* Elbow joint */}
          <circle cx="7" cy="14" r="2" fill={fill} opacity="0.4" />
          {/* Forearm */}
          <line x1="7" y1="14" x2="22" y2="14" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          {/* Gripper */}
          <path d="M 22,11 L 22,17 M 20,11 L 24,11 M 20,17 L 24,17" stroke={fill} strokeWidth="1.5" />
          {/* Box being carried */}
          <rect x="18" y="18" width="8" height="6" fill={fill} opacity="0.15" stroke={fill} strokeWidth="1" strokeDasharray="2 1" />
        </g>

        {/* Shoulder joint */}
        <circle cx="7" cy="30" r="2.5" fill={fill} opacity="0.4" stroke={fill} strokeWidth="1" />

        {/* Base plate */}
        <line x1="0" y1="47" x2="46" y2="47" stroke={fill} strokeWidth="1" opacity="0.4" />
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

export default Palletizer;
