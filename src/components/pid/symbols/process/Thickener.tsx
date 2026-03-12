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
 * Thickener — Large flat-bottom circular tank with rotating rake arm.
 * Feedwell in center, overflow weir, underflow discharge, rake mechanism.
 */
const Thickener: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-thickener ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Tank — wide shallow cross-section */}
        <rect x="4" y="14" width="40" height="22" fill={fill} opacity="0.08"
          stroke={fill} strokeWidth="2" />

        {/* Liquid level */}
        <line x1="4" y1="18" x2="44" y2="18" stroke={fill} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.3" />
        {/* Clarified zone (top) */}
        <rect x="5" y="15" width="38" height="8" fill={fill} opacity="0.05" />
        {/* Sludge zone (bottom) */}
        <rect x="5" y="28" width="38" height="7" fill={fill} opacity="0.15" />

        {/* Center column */}
        <line x1="24" y1="6" x2="24" y2="36" stroke={fill} strokeWidth="2" />

        {/* Feedwell */}
        <rect x="20" y="14" width="8" height="8" fill="none" stroke={fill} strokeWidth="1" />

        {/* Rake arm */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 32"
              to="360 24 32"
              dur="8s"
              repeatCount="indefinite"
            />
          )}
          <line x1="24" y1="32" x2="42" y2="34" stroke={fill} strokeWidth="1.5" />
          {/* Rake blades */}
          <line x1="30" y1="32" x2="30" y2="35" stroke={fill} strokeWidth="1" opacity="0.5" />
          <line x1="35" y1="33" x2="35" y2="36" stroke={fill} strokeWidth="1" opacity="0.5" />
          <line x1="40" y1="34" x2="40" y2="36" stroke={fill} strokeWidth="1" opacity="0.5" />
        </g>

        {/* Drive mechanism on top */}
        <rect x="20" y="6" width="8" height="4" fill={fill} opacity="0.2" stroke={fill} strokeWidth="1" rx="1" />

        {/* Feed inlet */}
        <line x1="24" y1="0" x2="24" y2="6" stroke={fill} strokeWidth="1.5" />
        <polygon points="22,2 24,0 26,2" fill={fill} opacity="0.4" />

        {/* Overflow weir — right side */}
        <path d="M 44,16 L 46,16 L 46,20 L 48,20" fill="none" stroke={fill} strokeWidth="1.5" />
        <text x="47" y="24" fontSize="3.5" fill={fill} opacity="0.4" fontFamily="'Inter', sans-serif">OVF</text>

        {/* Underflow — bottom center */}
        <line x1="22" y1="36" x2="22" y2="42" stroke={fill} strokeWidth="1.5" />
        <line x1="26" y1="36" x2="26" y2="42" stroke={fill} strokeWidth="1.5" />
        <text x="24" y="46" textAnchor="middle" fontSize="3.5" fill={fill} opacity="0.4"
          fontFamily="'Inter', sans-serif">UF</text>

        {/* Support legs */}
        <line x1="8" y1="36" x2="8" y2="42" stroke={fill} strokeWidth="1.5" />
        <line x1="40" y1="36" x2="40" y2="42" stroke={fill} strokeWidth="1.5" />
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

export default Thickener;
