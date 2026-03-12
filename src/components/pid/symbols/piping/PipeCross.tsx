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
 * Pipe Cross — 4-way crossing (horizontal + vertical pipe intersection).
 */
const PipeCross: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-pipe-cross ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Cross-shaped fill */}
        <path
          d="M 18,0 L 30,0 L 30,18 L 48,18 L 48,30 L 30,30 L 30,48 L 18,48 L 18,30 L 0,30 L 0,18 L 18,18 Z"
          fill={fill}
          opacity="0.12"
        />

        {/* Horizontal run — upper wall */}
        <line x1="0" y1="18" x2="18" y2="18" stroke={fill} strokeWidth="2" />
        <line x1="30" y1="18" x2="48" y2="18" stroke={fill} strokeWidth="2" />
        {/* Horizontal run — lower wall */}
        <line x1="0" y1="30" x2="18" y2="30" stroke={fill} strokeWidth="2" />
        <line x1="30" y1="30" x2="48" y2="30" stroke={fill} strokeWidth="2" />

        {/* Vertical run — left wall */}
        <line x1="18" y1="0" x2="18" y2="18" stroke={fill} strokeWidth="2" />
        <line x1="18" y1="30" x2="18" y2="48" stroke={fill} strokeWidth="2" />
        {/* Vertical run — right wall */}
        <line x1="30" y1="0" x2="30" y2="18" stroke={fill} strokeWidth="2" />
        <line x1="30" y1="30" x2="30" y2="48" stroke={fill} strokeWidth="2" />

        {/* Flow dots */}
        {animated && (
          <>
            <circle r="2" fill={fill} opacity="0.7">
              <animateMotion dur="1.2s" repeatCount="indefinite" path="M 0,24 L 48,24" />
            </circle>
            <circle r="2" fill={fill} opacity="0.7">
              <animateMotion dur="1.2s" repeatCount="indefinite" path="M 24,0 L 24,48" />
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

export default PipeCross;
