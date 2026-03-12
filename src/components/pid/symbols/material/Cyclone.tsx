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
 * Cyclone Separator — ISA 5.1 standard cyclone.
 * Conical body with tangential inlet on upper cylindrical section,
 * overflow (vortex finder) out the top, underflow out the bottom cone.
 * Very important P&ID symbol for process engineers.
 */
const Cyclone: React.FC<SymbolProps> = ({
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
      className={`pid-material pid-cyclone ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
          d="M 12,6 L 12,18 L 36,18 L 36,6"
          fill={fill}
          opacity="0.08"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Top plate */}
        <line x1="12" y1="6" x2="36" y2="6" stroke={fill} strokeWidth="2" />

        {/* Conical lower section */}
        <path
          d="M 12,18 L 24,44 L 36,18"
          fill={fill}
          opacity="0.08"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Tangential inlet — enters from right side at top of cylinder */}
        <line x1="36" y1="10" x2="46" y2="10" stroke={fill} strokeWidth="2" />
        <line x1="36" y1="14" x2="46" y2="14" stroke={fill} strokeWidth="2" />
        {/* Inlet arrow */}
        <polygon points="40,8 36,12 40,16" fill={fill} opacity="0.5" />

        {/* Vortex finder — overflow pipe out the top center */}
        <line x1="22" y1="0" x2="22" y2="14" stroke={fill} strokeWidth="1.5" />
        <line x1="26" y1="0" x2="26" y2="14" stroke={fill} strokeWidth="1.5" />
        {/* Overflow exit pipe to the left */}
        <line x1="4" y1="0" x2="22" y2="0" stroke={fill} strokeWidth="1.5" />
        <line x1="4" y1="4" x2="22" y2="4" stroke={fill} strokeWidth="1.5" />
        <line x1="22" y1="0" x2="22" y2="4" stroke={fill} strokeWidth="1.5" />
        {/* Overflow arrow */}
        <polygon points="8,0 4,2 8,4" fill={fill} opacity="0.5" />

        {/* Underflow discharge — bottom of cone */}
        <line x1="22" y1="44" x2="22" y2="48" stroke={fill} strokeWidth="1.5" />
        <line x1="26" y1="44" x2="26" y2="48" stroke={fill} strokeWidth="1.5" />
        {/* Underflow arrow */}
        <polygon points="22,46 24,48 26,46" fill={fill} opacity="0.5" />

        {/* Internal vortex spiral when animated */}
        {animated && (
          <g opacity="0.3">
            <path
              d="M 30,14 C 28,20 20,20 18,14 C 16,8 28,8 30,14"
              fill="none"
              stroke={fill}
              strokeWidth="1"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 24 18"
                to="360 24 18"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M 28,24 C 26,28 22,28 20,24"
              fill="none"
              stroke={fill}
              strokeWidth="0.8"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 24 26"
                to="360 24 26"
                dur="1.2s"
                repeatCount="indefinite"
              />
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

export default Cyclone;
