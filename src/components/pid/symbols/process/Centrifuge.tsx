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
 * Centrifuge — Circle with internal spinner/rotor.
 * Feed inlet at center top, heavy phase outlet at bottom,
 * light phase outlet at periphery.
 */
const Centrifuge: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-centrifuge ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Outer housing */}
        <circle cx="24" cy="24" r="16" fill={fill} opacity="0.08" stroke={fill} strokeWidth="2" />

        {/* Inner rotor/bowl */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
          <circle cx="24" cy="24" r="10" fill="none" stroke={fill} strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Spinner vanes */}
          <line x1="24" y1="14" x2="24" y2="34" stroke={fill} strokeWidth="1" opacity="0.5" />
          <line x1="14" y1="24" x2="34" y2="24" stroke={fill} strokeWidth="1" opacity="0.5" />
          {/* Hub */}
          <circle cx="24" cy="24" r="3" fill={fill} opacity="0.3" />
        </g>

        {/* Feed inlet — top center */}
        <line x1="24" y1="0" x2="24" y2="8" stroke={fill} strokeWidth="2" />
        <polygon points="22,2 24,0 26,2" fill={fill} opacity="0.5" />

        {/* Light phase outlet — right */}
        <line x1="40" y1="18" x2="48" y2="18" stroke={fill} strokeWidth="1.5" />
        <text x="46" y="16" fontSize="5" fill={fill} opacity="0.5" fontFamily="'Inter', sans-serif">L</text>

        {/* Heavy phase outlet — bottom */}
        <line x1="24" y1="40" x2="24" y2="48" stroke={fill} strokeWidth="1.5" />
        <text x="28" y="47" fontSize="5" fill={fill} opacity="0.5" fontFamily="'Inter', sans-serif">H</text>

        {/* Support base */}
        <line x1="14" y1="42" x2="34" y2="42" stroke={fill} strokeWidth="1" opacity="0.4" />
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

export default Centrifuge;
