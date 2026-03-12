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
 * Dryer — Rotary drum dryer with heat input.
 * Horizontal cylinder with flights inside, heat source arrow.
 */
const Dryer: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-dryer ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Drum body */}
        <rect x="6" y="12" width="36" height="18" rx="3" fill={fill} opacity="0.1"
          stroke={fill} strokeWidth="2" />

        {/* End caps */}
        <ellipse cx="6" cy="21" rx="2" ry="9" fill="none" stroke={fill} strokeWidth="1.5" />
        <ellipse cx="42" cy="21" rx="2" ry="9" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Internal flights/lifters */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 21"
              to="360 24 21"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
          <line x1="12" y1="14" x2="14" y2="18" stroke={fill} strokeWidth="0.8" opacity="0.4" />
          <line x1="20" y1="14" x2="22" y2="18" stroke={fill} strokeWidth="0.8" opacity="0.4" />
          <line x1="28" y1="14" x2="30" y2="18" stroke={fill} strokeWidth="0.8" opacity="0.4" />
          <line x1="36" y1="14" x2="38" y2="18" stroke={fill} strokeWidth="0.8" opacity="0.4" />
          <line x1="12" y1="28" x2="14" y2="24" stroke={fill} strokeWidth="0.8" opacity="0.4" />
          <line x1="20" y1="28" x2="22" y2="24" stroke={fill} strokeWidth="0.8" opacity="0.4" />
          <line x1="28" y1="28" x2="30" y2="24" stroke={fill} strokeWidth="0.8" opacity="0.4" />
          <line x1="36" y1="28" x2="38" y2="24" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        </g>

        {/* Feed inlet — left */}
        <line x1="0" y1="21" x2="6" y2="21" stroke={fill} strokeWidth="2" />
        <polygon points="0,19 4,21 0,23" fill={fill} opacity="0.5" />

        {/* Discharge — right */}
        <line x1="42" y1="21" x2="48" y2="21" stroke={fill} strokeWidth="2" />

        {/* Heat input — zigzag below drum */}
        <path
          d="M 14,34 L 16,36 L 18,34 L 20,36 L 22,34 L 24,36 L 26,34 L 28,36 L 30,34 L 32,36 L 34,34"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Heat arrow */}
        <polygon points="22,38 24,42 26,38" fill={fill} opacity="0.4" />
        <text x="24" y="46" textAnchor="middle" fontSize="5" fill={fill} opacity="0.4"
          fontFamily="'Inter', sans-serif">Q</text>

        {/* Support rollers */}
        <circle cx="14" cy="32" r="2" fill="none" stroke={fill} strokeWidth="1" />
        <circle cx="34" cy="32" r="2" fill="none" stroke={fill} strokeWidth="1" />
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

export default Dryer;
