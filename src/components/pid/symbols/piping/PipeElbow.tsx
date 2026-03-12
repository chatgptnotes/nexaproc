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
 * Pipe Elbow — 90-degree bend with proper radius.
 * Outer and inner arcs with fill between them.
 */
const PipeElbow: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-pipe-elbow ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Horizontal inlet segment */}
        <line x1="0" y1="18" x2="12" y2="18" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="30" x2="6" y2="30" stroke={fill} strokeWidth="2" />

        {/* Outer arc (larger radius) */}
        <path
          d="M 12,18 A 18,18 0 0,1 30,36"
          fill="none"
          stroke={fill}
          strokeWidth="2"
        />
        {/* Inner arc (smaller radius) */}
        <path
          d="M 6,30 A 6,6 0 0,0 18,36"
          fill="none"
          stroke={fill}
          strokeWidth="2"
        />
        {/* Fill between arcs */}
        <path
          d="M 12,18 A 18,18 0 0,1 30,36 L 18,36 A 6,6 0 0,0 6,30 L 6,30 L 0,30 L 0,18 Z"
          fill={fill}
          opacity="0.12"
        />

        {/* Vertical outlet segment */}
        <line x1="18" y1="36" x2="18" y2="48" stroke={fill} strokeWidth="2" />
        <line x1="30" y1="36" x2="30" y2="48" stroke={fill} strokeWidth="2" />

        {/* Flow indicator */}
        {animated && (
          <circle r="2" fill={fill} opacity="0.7">
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M 0,24 L 9,24 A 12,12 0 0,1 24,39 L 24,48"
            />
          </circle>
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

export default PipeElbow;
