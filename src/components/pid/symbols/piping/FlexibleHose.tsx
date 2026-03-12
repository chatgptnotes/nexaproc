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
 * Flexible Hose — Wavy/corrugated pipe section between two fittings.
 */
const FlexibleHose: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-flexible-hose ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Left fitting */}
        <line x1="0" y1="20" x2="8" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="28" x2="8" y2="28" stroke={fill} strokeWidth="2" />
        <line x1="8" y1="16" x2="8" y2="32" stroke={fill} strokeWidth="2.5" />

        {/* Wavy hose — upper wall */}
        <path
          d="M 8,18 C 14,12 18,12 20,18 C 22,24 26,12 28,18 C 30,24 34,12 36,18 C 38,24 40,18 40,18"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
        />
        {/* Wavy hose — lower wall */}
        <path
          d="M 8,30 C 14,36 18,36 20,30 C 22,24 26,36 28,30 C 30,24 34,36 36,30 C 38,24 40,30 40,30"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
        />

        {/* Right fitting */}
        <line x1="40" y1="16" x2="40" y2="32" stroke={fill} strokeWidth="2.5" />
        <line x1="40" y1="20" x2="48" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="40" y1="28" x2="48" y2="28" stroke={fill} strokeWidth="2" />

        {/* Animated flex movement */}
        {animated && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,1;0,0;0,-1;0,0"
            dur="2s"
            repeatCount="indefinite"
          />
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

export default FlexibleHose;
