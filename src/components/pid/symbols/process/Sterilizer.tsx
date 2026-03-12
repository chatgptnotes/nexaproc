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
 * Sterilizer (Autoclave) — Pressure vessel with pressure/temperature indicator.
 * Horizontal cylindrical vessel with dished ends, door, and instrument connections.
 */
const Sterilizer: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-sterilizer ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Vessel body — horizontal cylinder */}
        <rect x="8" y="12" width="32" height="20" fill={fill} opacity="0.08"
          stroke={fill} strokeWidth="2" rx="2" />

        {/* Dished ends */}
        <path d="M 8,12 Q 4,22 8,32" fill="none" stroke={fill} strokeWidth="2" />
        <path d="M 40,12 Q 44,22 40,32" fill="none" stroke={fill} strokeWidth="2" />

        {/* Door on right end — heavy circle */}
        <circle cx="42" cy="22" r="8" fill="none" stroke={fill} strokeWidth="1.5" />
        {/* Door handle */}
        <line x1="42" y1="18" x2="42" y2="26" stroke={fill} strokeWidth="1.5" />
        {/* Door seal */}
        <circle cx="42" cy="22" r="6" fill="none" stroke={fill} strokeWidth="0.5" strokeDasharray="2 1" opacity="0.3" />

        {/* Steam inlet — top */}
        <line x1="18" y1="6" x2="18" y2="12" stroke={fill} strokeWidth="1.5" />
        <line x1="22" y1="6" x2="22" y2="12" stroke={fill} strokeWidth="1.5" />
        <polygon points="18,8 20,4 22,8" fill={fill} opacity="0.4" />

        {/* Pressure gauge — top right */}
        <circle cx="30" cy="6" r="3.5" fill="none" stroke={fill} strokeWidth="1" />
        <text x="30" y="8" textAnchor="middle" fontSize="4" fill={fill}
          fontFamily="'Inter', sans-serif" fontWeight="600">P</text>
        <line x1="30" y1="9.5" x2="30" y2="12" stroke={fill} strokeWidth="1" />

        {/* Temperature indicator */}
        <circle cx="12" cy="6" r="3.5" fill="none" stroke={fill} strokeWidth="1" />
        <text x="12" y="8" textAnchor="middle" fontSize="4" fill={fill}
          fontFamily="'Inter', sans-serif" fontWeight="600">T</text>
        <line x1="12" y1="9.5" x2="12" y2="12" stroke={fill} strokeWidth="1" />

        {/* Drain — bottom */}
        <line x1="24" y1="32" x2="24" y2="38" stroke={fill} strokeWidth="1.5" />

        {/* Support legs */}
        <line x1="14" y1="32" x2="12" y2="40" stroke={fill} strokeWidth="1.5" />
        <line x1="34" y1="32" x2="36" y2="40" stroke={fill} strokeWidth="1.5" />
        <line x1="8" y1="40" x2="40" y2="40" stroke={fill} strokeWidth="1" opacity="0.4" />

        {/* Steam animation */}
        {animated && (
          <g opacity="0.3">
            <path d="M 16,4 Q 15,1 16,-2" fill="none" stroke={fill} strokeWidth="0.8">
              <animate attributeName="opacity" values="0;0.5;0" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d="M 20,4 Q 21,1 20,-2" fill="none" stroke={fill} strokeWidth="0.8">
              <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
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

export default Sterilizer;
