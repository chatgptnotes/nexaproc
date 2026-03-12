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
 * Spray Dryer — Conical vessel with atomizer nozzle at top.
 * Cylindrical top section transitioning to cone, hot air inlet,
 * product collection at bottom.
 */
const SprayDryer: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-spray-dryer ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Cylindrical upper section */}
        <path
          d="M 8,6 L 8,22 L 40,22 L 40,6"
          fill={fill}
          opacity="0.08"
          stroke={fill}
          strokeWidth="2"
        />
        {/* Dome top */}
        <path d="M 8,6 Q 24,0 40,6" fill="none" stroke={fill} strokeWidth="2" />

        {/* Conical lower section */}
        <path
          d="M 8,22 L 20,42 L 28,42 L 40,22"
          fill={fill}
          opacity="0.08"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Atomizer nozzle at top center */}
        <line x1="24" y1="0" x2="24" y2="10" stroke={fill} strokeWidth="2" />
        <polygon points="20,10 24,14 28,10" fill={fill} opacity="0.5" stroke={fill} strokeWidth="1" />

        {/* Spray pattern */}
        {animated ? (
          <g opacity="0.3">
            <line x1="24" y1="14" x2="16" y2="20" stroke={fill} strokeWidth="0.8">
              <animate attributeName="opacity" values="0.1;0.5;0.1" dur="0.8s" repeatCount="indefinite" />
            </line>
            <line x1="24" y1="14" x2="20" y2="20" stroke={fill} strokeWidth="0.8">
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.7s" repeatCount="indefinite" />
            </line>
            <line x1="24" y1="14" x2="28" y2="20" stroke={fill} strokeWidth="0.8">
              <animate attributeName="opacity" values="0.5;0.1;0.5" dur="0.9s" repeatCount="indefinite" />
            </line>
            <line x1="24" y1="14" x2="32" y2="20" stroke={fill} strokeWidth="0.8">
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="0.6s" repeatCount="indefinite" />
            </line>
            {/* Spray droplets */}
            <circle cx="18" cy="18" r="0.8" fill={fill}>
              <animate attributeName="cy" values="16;20" dur="0.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="30" cy="18" r="0.8" fill={fill}>
              <animate attributeName="cy" values="15;19" dur="0.5s" repeatCount="indefinite" />
            </circle>
          </g>
        ) : (
          <g opacity="0.2">
            <line x1="24" y1="14" x2="16" y2="20" stroke={fill} strokeWidth="0.8" />
            <line x1="24" y1="14" x2="32" y2="20" stroke={fill} strokeWidth="0.8" />
            <line x1="24" y1="14" x2="20" y2="20" stroke={fill} strokeWidth="0.8" />
            <line x1="24" y1="14" x2="28" y2="20" stroke={fill} strokeWidth="0.8" />
          </g>
        )}

        {/* Hot air inlet — side */}
        <line x1="40" y1="12" x2="48" y2="12" stroke={fill} strokeWidth="1.5" />
        <text x="46" y="10" fontSize="4" fill={fill} opacity="0.4" fontFamily="'Inter', sans-serif">HA</text>

        {/* Exhaust outlet — top side */}
        <line x1="0" y1="8" x2="8" y2="8" stroke={fill} strokeWidth="1.5" />

        {/* Product discharge — bottom */}
        <line x1="22" y1="42" x2="22" y2="48" stroke={fill} strokeWidth="1.5" />
        <line x1="26" y1="42" x2="26" y2="48" stroke={fill} strokeWidth="1.5" />
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

export default SprayDryer;
