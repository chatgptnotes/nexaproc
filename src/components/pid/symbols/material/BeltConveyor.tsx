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
 * Belt Conveyor — Two end rollers with belt stretched between them.
 * Direction arrow on top surface. Rollers rotate when animated.
 */
const BeltConveyor: React.FC<SymbolProps> = ({
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
      className={`pid-material pid-belt-conveyor ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Left roller */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 10 28"
              to="360 10 28"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
          <circle cx="10" cy="28" r="6" fill="none" stroke={fill} strokeWidth="2" />
          <circle cx="10" cy="28" r="1.5" fill={fill} />
          {/* Roller spokes */}
          <line x1="10" y1="22" x2="10" y2="34" stroke={fill} strokeWidth="0.8" opacity="0.4" />
          <line x1="4" y1="28" x2="16" y2="28" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        </g>

        {/* Right roller */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 38 28"
              to="360 38 28"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
          <circle cx="38" cy="28" r="6" fill="none" stroke={fill} strokeWidth="2" />
          <circle cx="38" cy="28" r="1.5" fill={fill} />
          <line x1="38" y1="22" x2="38" y2="34" stroke={fill} strokeWidth="0.8" opacity="0.4" />
          <line x1="32" y1="28" x2="44" y2="28" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        </g>

        {/* Belt — top run */}
        <line x1="10" y1="22" x2="38" y2="22" stroke={fill} strokeWidth="2" />
        {/* Belt — bottom return */}
        <line x1="10" y1="34" x2="38" y2="34" stroke={fill} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />

        {/* Direction arrow on belt top */}
        <polygon points="28,19 34,22 28,25" fill={fill} opacity="0.6" />

        {/* Support legs */}
        <line x1="14" y1="34" x2="12" y2="42" stroke={fill} strokeWidth="1.5" />
        <line x1="34" y1="34" x2="36" y2="42" stroke={fill} strokeWidth="1.5" />
        <line x1="10" y1="42" x2="38" y2="42" stroke={fill} strokeWidth="1" opacity="0.4" />
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

export default BeltConveyor;
