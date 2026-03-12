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
 * Expansion Joint — Bellows shape between pipe sections.
 * ISA representation: zigzag/accordion bellows between two pipe ends.
 */
const ExpansionJoint: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-expansion-joint ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Left pipe */}
        <line x1="0" y1="20" x2="10" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="28" x2="10" y2="28" stroke={fill} strokeWidth="2" />
        {/* Left flange */}
        <line x1="10" y1="14" x2="10" y2="34" stroke={fill} strokeWidth="2" />

        {/* Bellows — zigzag upper convolution */}
        <polyline
          points="10,14 14,10 18,14 22,10 26,14 30,10 34,14 38,10 38,14"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Bellows — zigzag lower convolution */}
        <polyline
          points="10,34 14,38 18,34 22,38 26,34 30,38 34,34 38,38 38,34"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Bellows side walls */}
        <line x1="14" y1="10" x2="14" y2="38" stroke={fill} strokeWidth="0.5" opacity="0.3" />
        <line x1="22" y1="10" x2="22" y2="38" stroke={fill} strokeWidth="0.5" opacity="0.3" />
        <line x1="30" y1="10" x2="30" y2="38" stroke={fill} strokeWidth="0.5" opacity="0.3" />

        {/* Right flange */}
        <line x1="38" y1="14" x2="38" y2="34" stroke={fill} strokeWidth="2" />
        {/* Right pipe */}
        <line x1="38" y1="20" x2="48" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="38" y1="28" x2="48" y2="28" stroke={fill} strokeWidth="2" />

        {/* Expansion animation — slight horizontal oscillation */}
        {animated && (
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;1,0;0,0;-1,0;0,0"
              dur="2s"
              repeatCount="indefinite"
            />
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

export default ExpansionJoint;
