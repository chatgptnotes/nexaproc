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
 * Steam Trap — ISA standard: inverted bucket / inverted triangle
 * with inlet and outlet pipe connections. The triangle points downward
 * to represent the trap mechanism.
 */
const SteamTrap: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-steam-trap ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Inlet pipe */}
        <line x1="0" y1="20" x2="12" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="28" x2="12" y2="28" stroke={fill} strokeWidth="2" />

        {/* Inverted bucket body — inverted triangle pointing down */}
        <polygon
          points="12,16 36,16 24,38"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Internal bucket indicator */}
        <path
          d="M 18,22 Q 24,28 30,22"
          fill="none"
          stroke={fill}
          strokeWidth="1.2"
          opacity="0.5"
        />

        {/* Horizontal bar at top (cap) */}
        <line x1="10" y1="16" x2="38" y2="16" stroke={fill} strokeWidth="2.5" />

        {/* Outlet pipe */}
        <line x1="36" y1="20" x2="48" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="36" y1="28" x2="48" y2="28" stroke={fill} strokeWidth="2" />

        {/* Steam wisps when active and animated */}
        {animated && state === 'active' && (
          <g opacity="0.5">
            <path d="M 22,38 Q 20,42 22,46" fill="none" stroke={fill} strokeWidth="1">
              <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d="M 26,38 Q 28,42 26,46" fill="none" stroke={fill} strokeWidth="1">
              <animate attributeName="opacity" values="0;0.5;0" dur="1.5s" repeatCount="indefinite" />
            </path>
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

export default SteamTrap;
