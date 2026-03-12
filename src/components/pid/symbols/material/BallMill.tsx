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
 * Ball Mill — Horizontal rotating cylinder with grinding balls inside.
 * Supported on trunnion bearings, drive gear on one end.
 */
const BallMill: React.FC<SymbolProps> = ({
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
      className={`pid-material pid-ball-mill ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Cylinder body */}
        <rect x="6" y="12" width="36" height="20" rx="3" fill={fill} opacity="0.1" stroke={fill} strokeWidth="2" />

        {/* End plates */}
        <ellipse cx="6" cy="22" rx="2" ry="10" fill="none" stroke={fill} strokeWidth="1.5" />
        <ellipse cx="42" cy="22" rx="2" ry="10" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Grinding balls inside */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 22"
              to="360 24 22"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
          <circle cx="16" cy="26" r="2" fill={fill} opacity="0.5" />
          <circle cx="21" cy="28" r="1.8" fill={fill} opacity="0.5" />
          <circle cx="26" cy="27" r="2.2" fill={fill} opacity="0.5" />
          <circle cx="31" cy="26" r="1.5" fill={fill} opacity="0.5" />
          <circle cx="18" cy="22" r="1.8" fill={fill} opacity="0.4" />
          <circle cx="28" cy="23" r="2" fill={fill} opacity="0.4" />
          <circle cx="34" cy="24" r="1.6" fill={fill} opacity="0.4" />
        </g>

        {/* Feed inlet (left trunnion) */}
        <line x1="0" y1="22" x2="6" y2="22" stroke={fill} strokeWidth="2" />
        <polygon points="0,20 4,22 0,24" fill={fill} opacity="0.4" />

        {/* Discharge (right trunnion) */}
        <line x1="42" y1="22" x2="48" y2="22" stroke={fill} strokeWidth="2" />
        <polygon points="44,20 48,22 44,24" fill={fill} opacity="0.4" />

        {/* Support bearings */}
        <path d="M 12,32 L 10,40 L 14,40 Z" fill="none" stroke={fill} strokeWidth="1.5" />
        <path d="M 36,32 L 34,40 L 38,40 Z" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Drive gear ring */}
        <ellipse cx="10" cy="22" rx="1" ry="12" fill="none" stroke={fill} strokeWidth="1" strokeDasharray="2 1" opacity="0.5" />

        {/* Base line */}
        <line x1="6" y1="40" x2="42" y2="40" stroke={fill} strokeWidth="1" opacity="0.5" />
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

export default BallMill;
