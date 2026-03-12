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
 * Eccentric Reducer — Flat bottom with top taper only.
 * Larger pipe on left, smaller on right, bottom stays aligned.
 */
const EccentricReducer: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-eccentric-reducer ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Large pipe section */}
        <line x1="0" y1="14" x2="14" y2="14" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="34" x2="14" y2="34" stroke={fill} strokeWidth="2" />

        {/* Taper section — eccentric: flat bottom, tapered top */}
        <line x1="14" y1="14" x2="34" y2="22" stroke={fill} strokeWidth="2" />
        {/* Bottom stays flat */}
        <line x1="14" y1="34" x2="34" y2="34" stroke={fill} strokeWidth="2" />

        {/* Small pipe section */}
        <line x1="34" y1="22" x2="48" y2="22" stroke={fill} strokeWidth="2" />
        <line x1="34" y1="34" x2="48" y2="34" stroke={fill} strokeWidth="2" />

        {/* Fill */}
        <path
          d="M 0,14 L 14,14 L 34,22 L 48,22 L 48,34 L 0,34 Z"
          fill={fill}
          opacity="0.12"
        />

        {/* BOP (bottom of pipe) indicator — small flat line */}
        <text x="24" y="40" textAnchor="middle" fontSize="5"
          fontFamily="'Inter', 'Segoe UI', sans-serif" fill={fill} opacity="0.5">
          BOP
        </text>

        {animated && (
          <circle r="2" fill={fill} opacity="0.7">
            <animateMotion dur="1.2s" repeatCount="indefinite" path="M 0,28 L 48,28" />
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

export default EccentricReducer;
