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
 * Flow Arrow — Arrow indicating flow direction.
 * Animated pulsing/movement when active and animated=true.
 */
const FlowArrow: React.FC<SymbolProps> = ({
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
  const isActive = animated && state === 'active';

  return (
    <svg
      width={size}
      height={label ? size + 16 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-pipe pid-flow-arrow ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidFlowPulse {
          0% { transform: translateX(-4px); opacity: 0.4; }
          50% { transform: translateX(0px); opacity: 1; }
          100% { transform: translateX(4px); opacity: 0.4; }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        <g style={isActive ? { animation: 'pidFlowPulse 1s ease-in-out infinite' } : undefined}>
          {/* Arrow shaft */}
          <line x1="6" y1="24" x2="32" y2="24" stroke={fill} strokeWidth="3" strokeLinecap="round" />

          {/* Arrow head — filled triangle */}
          <polygon
            points="30,16 42,24 30,32"
            fill={fill}
            stroke={fill}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
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

export default FlowArrow;
