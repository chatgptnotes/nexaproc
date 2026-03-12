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
 * Ejector — Converging-diverging nozzle (Venturi/steam ejector).
 * Motive fluid enters from left, suction from top, mixed discharge right.
 */
const Ejector: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-ejector ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Motive nozzle — converging from left */}
        <path
          d="M 0,16 L 14,20 L 14,28 L 0,32"
          fill={fill}
          opacity="0.08"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Suction chamber — cylindrical section around nozzle tip */}
        <rect x="14" y="12" width="10" height="24" fill={fill} opacity="0.06"
          stroke={fill} strokeWidth="1.5" />

        {/* Throat (converging-diverging) */}
        <path
          d="M 24,12 L 28,20 L 28,28 L 24,36"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Diffuser — diverging section */}
        <path
          d="M 28,20 L 48,16 M 28,28 L 48,32"
          fill="none"
          stroke={fill}
          strokeWidth="2"
        />
        {/* Diffuser fill */}
        <path
          d="M 28,20 L 48,16 L 48,32 L 28,28 Z"
          fill={fill}
          opacity="0.06"
        />

        {/* Suction inlet — top */}
        <line x1="18" y1="0" x2="18" y2="12" stroke={fill} strokeWidth="1.5" />
        <line x1="22" y1="0" x2="22" y2="12" stroke={fill} strokeWidth="1.5" />
        <polygon points="18,4 20,0 22,4" fill={fill} opacity="0.4" />

        {/* Motive nozzle tip inside chamber */}
        <path d="M 14,22 L 18,24 L 14,26" fill={fill} opacity="0.3" stroke={fill} strokeWidth="1" />

        {/* Throat marking */}
        <circle cx="28" cy="24" r="1" fill={fill} opacity="0.4" />

        {/* Flow arrows */}
        <polygon points="4,20 10,24 4,28" fill={fill} opacity="0.3" />
        <polygon points="38,18 44,24 38,30" fill={fill} opacity="0.3" />

        {/* Flow animation */}
        {animated && (
          <>
            <circle r="1.5" fill={fill} opacity="0.5">
              <animateMotion dur="1s" repeatCount="indefinite" path="M 0,24 L 48,24" />
            </circle>
            <circle r="1" fill={fill} opacity="0.4">
              <animateMotion dur="1.2s" repeatCount="indefinite" path="M 20,0 L 20,24 L 48,24" />
            </circle>
          </>
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

export default Ejector;
