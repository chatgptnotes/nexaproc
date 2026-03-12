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
 * Separator — Horizontal two-phase separator vessel.
 * Horizontal drum with weir plate, vapor outlet top, liquid outlet bottom.
 * Feed enters on one end, phases separate by gravity.
 */
const Separator: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-separator ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Vessel body — horizontal drum */}
        <rect x="6" y="12" width="36" height="22" fill={fill} opacity="0.08"
          stroke={fill} strokeWidth="2" rx="2" />

        {/* Dished ends */}
        <path d="M 6,12 Q 2,23 6,34" fill="none" stroke={fill} strokeWidth="2" />
        <path d="M 42,12 Q 46,23 42,34" fill="none" stroke={fill} strokeWidth="2" />

        {/* Liquid level line */}
        <line x1="6" y1="26" x2="42" y2="26" stroke={fill} strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        {/* Liquid fill */}
        <rect x="7" y="26" width="34" height="7" fill={fill} opacity="0.12" />

        {/* Weir plate inside vessel */}
        <line x1="32" y1="14" x2="32" y2="30" stroke={fill} strokeWidth="1.5" />

        {/* Feed inlet — left side */}
        <line x1="0" y1="20" x2="6" y2="20" stroke={fill} strokeWidth="2" />
        <polygon points="0,18 4,20 0,22" fill={fill} opacity="0.4" />

        {/* Vapor outlet — top center */}
        <line x1="20" y1="6" x2="20" y2="12" stroke={fill} strokeWidth="1.5" />
        <line x1="24" y1="6" x2="24" y2="12" stroke={fill} strokeWidth="1.5" />
        <text x="22" y="5" textAnchor="middle" fontSize="4" fill={fill} opacity="0.4"
          fontFamily="'Inter', sans-serif">V</text>

        {/* Liquid outlet — bottom right */}
        <line x1="36" y1="34" x2="36" y2="42" stroke={fill} strokeWidth="1.5" />
        <text x="40" y="40" fontSize="4" fill={fill} opacity="0.4"
          fontFamily="'Inter', sans-serif">L</text>

        {/* Level indicator */}
        <rect x="44" y="20" width="3" height="12" fill="none" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        <rect x="44.5" y="24" width="2" height="8" fill={fill} opacity="0.2" />

        {/* Inlet deflector baffle */}
        <path d="M 12,14 L 12,20 L 10,22" fill="none" stroke={fill} strokeWidth="1" opacity="0.4" />

        {/* Support saddles */}
        <path d="M 14,34 Q 14,38 10,40" fill="none" stroke={fill} strokeWidth="1.5" />
        <path d="M 34,34 Q 34,38 38,40" fill="none" stroke={fill} strokeWidth="1.5" />
        <line x1="6" y1="40" x2="42" y2="40" stroke={fill} strokeWidth="1" opacity="0.3" />

        {/* Flow animation */}
        {animated && (
          <circle r="1.5" fill={fill} opacity="0.5">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 0,20 L 24,20 L 24,26 L 36,26 L 36,42" />
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

export default Separator;
