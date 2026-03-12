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
 * Baghouse — Rectangular housing with internal bag filters (tubes).
 * Dirty gas inlet on one side, clean gas outlet on top,
 * collected dust discharge at bottom.
 */
const Baghouse: React.FC<SymbolProps> = ({
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
      className={`pid-material pid-baghouse ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Main housing */}
        <rect x="8" y="6" width="32" height="32" fill={fill} opacity="0.08"
          stroke={fill} strokeWidth="2" rx="1" />

        {/* Internal bag filters — vertical tubes */}
        {[14, 20, 26, 32].map((x) => (
          <g key={x}>
            <line x1={x} y1="10" x2={x} y2="32" stroke={fill} strokeWidth="1.2" opacity="0.5" />
            {/* Bag bottom (closed, rounded) */}
            <path d={`M ${x - 1.5},32 Q ${x},34 ${x + 1.5},32`} fill="none" stroke={fill} strokeWidth="1" opacity="0.5" />
            {/* Top mounting */}
            <line x1={x - 2} y1="10" x2={x + 2} y2="10" stroke={fill} strokeWidth="1" opacity="0.4" />
          </g>
        ))}

        {/* Tube sheet divider (separates clean/dirty side) */}
        <line x1="8" y1="10" x2="40" y2="10" stroke={fill} strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />

        {/* Dirty gas inlet — left side */}
        <line x1="0" y1="26" x2="8" y2="26" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="30" x2="8" y2="30" stroke={fill} strokeWidth="2" />
        <polygon points="2,24 8,28 2,32" fill={fill} opacity="0.4" />

        {/* Clean gas outlet — top center */}
        <line x1="22" y1="0" x2="22" y2="6" stroke={fill} strokeWidth="2" />
        <line x1="26" y1="0" x2="26" y2="6" stroke={fill} strokeWidth="2" />
        <polygon points="22,2 24,0 26,2" fill={fill} opacity="0.4" />

        {/* Dust hopper at bottom */}
        <path d="M 8,38 L 20,44 L 28,44 L 40,38" fill="none" stroke={fill} strokeWidth="1.5" />
        {/* Dust discharge */}
        <line x1="22" y1="44" x2="22" y2="48" stroke={fill} strokeWidth="1.5" />
        <line x1="26" y1="44" x2="26" y2="48" stroke={fill} strokeWidth="1.5" />

        {/* Pulse-jet cleaning indicators when animated */}
        {animated && (
          <g opacity="0.4">
            {[14, 20, 26, 32].map((x, i) => (
              <line key={x} x1={x} y1="8" x2={x} y2="10" stroke={fill} strokeWidth="2">
                <animate
                  attributeName="opacity"
                  values={i % 2 === 0 ? '0.8;0;0.8' : '0;0.8;0'}
                  dur="1s"
                  repeatCount="indefinite"
                />
              </line>
            ))}
          </g>
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

export default Baghouse;
