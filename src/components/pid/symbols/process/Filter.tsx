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
 * Filter — ISA filter symbol: rectangle with diagonal lines (filter media).
 * Inlet on left, filtrate outlet on right, drain at bottom.
 */
const Filter: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-filter ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Filter housing — rectangle */}
        <rect x="10" y="10" width="28" height="28" fill={fill} opacity="0.08"
          stroke={fill} strokeWidth="2" rx="1" />

        {/* Diagonal filter media lines */}
        <line x1="14" y1="34" x2="34" y2="14" stroke={fill} strokeWidth="1.2" opacity="0.5" />
        <line x1="10" y1="30" x2="30" y2="10" stroke={fill} strokeWidth="1.2" opacity="0.5" />
        <line x1="18" y1="38" x2="38" y2="18" stroke={fill} strokeWidth="1.2" opacity="0.5" />
        <line x1="10" y1="22" x2="22" y2="10" stroke={fill} strokeWidth="1.2" opacity="0.5" />
        <line x1="26" y1="38" x2="38" y2="26" stroke={fill} strokeWidth="1.2" opacity="0.5" />

        {/* Inlet pipe — left */}
        <line x1="0" y1="20" x2="10" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="26" x2="10" y2="26" stroke={fill} strokeWidth="2" />
        <polygon points="2,18 8,23 2,28" fill={fill} opacity="0.4" />

        {/* Filtrate outlet — right */}
        <line x1="38" y1="20" x2="48" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="38" y1="26" x2="48" y2="26" stroke={fill} strokeWidth="2" />
        <polygon points="42,18 48,23 42,28" fill={fill} opacity="0.4" />

        {/* Drain — bottom center */}
        <line x1="22" y1="38" x2="22" y2="44" stroke={fill} strokeWidth="1.5" />
        <line x1="26" y1="38" x2="26" y2="44" stroke={fill} strokeWidth="1.5" />

        {/* Flow animation */}
        {animated && (
          <circle r="2" fill={fill} opacity="0.6">
            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0,23 L 48,23" />
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

export default Filter;
