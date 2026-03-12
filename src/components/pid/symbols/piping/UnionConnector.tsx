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
 * Union Connector — Two half-coupling rings meeting at center.
 * Represented as two semicircular halves with a gap at the joint.
 */
const UnionConnector: React.FC<SymbolProps> = ({
  size = 48,
  state = 'active',
  color,
  label,
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
      className={`pid-pipe pid-union ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Left pipe */}
        <line x1="0" y1="21" x2="14" y2="21" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="27" x2="14" y2="27" stroke={fill} strokeWidth="2" />

        {/* Left half-coupling — semicircle facing right */}
        <path
          d="M 14,14 A 10,10 0 0,1 14,34"
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
        />
        {/* Left coupling ring */}
        <ellipse cx="18" cy="24" rx="3" ry="10" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Center gap line */}
        <line x1="23" y1="14" x2="23" y2="34" stroke={fill} strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />

        {/* Right half-coupling — semicircle facing left */}
        <path
          d="M 34,14 A 10,10 0 0,0 34,34"
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
        />
        {/* Right coupling ring */}
        <ellipse cx="30" cy="24" rx="3" ry="10" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Nut indicator at center */}
        <polygon
          points="21,18 27,18 29,24 27,30 21,30 19,24"
          fill="none"
          stroke={fill}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Right pipe */}
        <line x1="34" y1="21" x2="48" y2="21" stroke={fill} strokeWidth="2" />
        <line x1="34" y1="27" x2="48" y2="27" stroke={fill} strokeWidth="2" />
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

export default UnionConnector;
