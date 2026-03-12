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
 * Electrical Line — Dash-dot pattern for electrical connections.
 * ISA standard: alternating long dash and dot.
 */
const ElectricalLine: React.FC<SymbolProps> = ({
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
      className={`pid-line pid-electrical-line ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidDashDotFlow {
          from { stroke-dashoffset: 18; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Dash-dot pattern: long dash (10), gap (3), dot (2), gap (3) = 18 total */}
        <line
          x1="0" y1="24" x2="48" y2="24"
          stroke={fill}
          strokeWidth="1.5"
          strokeDasharray="10 3 2 3"
          strokeLinecap="round"
          style={animated ? { animation: 'pidDashDotFlow 1s linear infinite' } : undefined}
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

export default ElectricalLine;
