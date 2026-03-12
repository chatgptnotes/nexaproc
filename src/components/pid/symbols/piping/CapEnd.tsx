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
 * Cap End — Welded cap on pipe end.
 * Pipe terminating in a rounded cap (semicircle/dome).
 */
const CapEnd: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-cap-end ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Pipe section */}
        <line x1="0" y1="18" x2="30" y2="18" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="30" x2="30" y2="30" stroke={fill} strokeWidth="2" />
        <rect x="0" y="19" width="30" height="10" fill={fill} opacity="0.12" />

        {/* Welded cap — rounded dome */}
        <path
          d="M 30,18 Q 40,18 40,24 Q 40,30 30,30"
          fill={fill}
          opacity="0.2"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Weld symbol — small zigzag at joint */}
        <path
          d="M 30,18 L 31,20 L 29,22 L 31,24 L 29,26 L 31,28 L 30,30"
          fill="none"
          stroke={fill}
          strokeWidth="1"
          opacity="0.6"
        />
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

export default CapEnd;
