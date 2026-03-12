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
 * Strainer — Y-strainer shape: horizontal pipe with angled mesh pocket.
 * ISA standard Y-strainer with basket screen indicated by hatching.
 */
const Strainer: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-strainer ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Inlet pipe */}
        <line x1="0" y1="20" x2="14" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="28" x2="14" y2="28" stroke={fill} strokeWidth="2" />

        {/* Main body — horizontal section */}
        <line x1="14" y1="20" x2="34" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="14" y1="28" x2="34" y2="28" stroke={fill} strokeWidth="2" />

        {/* Y-branch pocket going downward at 45 degrees */}
        <line x1="20" y1="28" x2="28" y2="42" stroke={fill} strokeWidth="2" />
        <line x1="28" y1="28" x2="36" y2="42" stroke={fill} strokeWidth="2" />
        {/* Bottom cap of Y-pocket */}
        <line x1="28" y1="42" x2="36" y2="42" stroke={fill} strokeWidth="2" />

        {/* Screen mesh inside Y-pocket — diagonal hatching */}
        <line x1="22" y1="30" x2="30" y2="38" stroke={fill} strokeWidth="0.8" opacity="0.5" />
        <line x1="24" y1="28" x2="34" y2="38" stroke={fill} strokeWidth="0.8" opacity="0.5" />
        <line x1="26" y1="28" x2="35" y2="37" stroke={fill} strokeWidth="0.8" opacity="0.5" />

        {/* Drain plug at bottom */}
        <circle cx="32" cy="44" r="2" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Outlet pipe */}
        <line x1="34" y1="20" x2="48" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="34" y1="28" x2="48" y2="28" stroke={fill} strokeWidth="2" />

        {/* Fill */}
        <rect x="0" y="21" width="48" height="6" fill={fill} opacity="0.1" />

        {animated && (
          <circle r="2" fill={fill} opacity="0.7">
            <animateMotion dur="1.2s" repeatCount="indefinite" path="M 0,24 L 48,24" />
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

export default Strainer;
