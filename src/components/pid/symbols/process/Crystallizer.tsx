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
 * Crystallizer — Vessel with crystal formation indicators.
 * Vertical vessel with cooling coils and crystal shapes inside.
 */
const Crystallizer: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-crystallizer ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Vessel body */}
        <path
          d="M 12,6 L 12,36 Q 12,42 18,42 L 30,42 Q 36,42 36,36 L 36,6"
          fill={fill}
          opacity="0.08"
          stroke={fill}
          strokeWidth="2"
        />
        {/* Top plate */}
        <line x1="10" y1="6" x2="38" y2="6" stroke={fill} strokeWidth="2" />

        {/* Agitator shaft */}
        <line x1="24" y1="2" x2="24" y2="36" stroke={fill} strokeWidth="1.5" />
        {/* Agitator impeller */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 28"
              to="360 24 28"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          <line x1="18" y1="28" x2="30" y2="28" stroke={fill} strokeWidth="2" />
          <line x1="18" y1="28" x2="20" y2="26" stroke={fill} strokeWidth="1.5" />
          <line x1="30" y1="28" x2="28" y2="26" stroke={fill} strokeWidth="1.5" />
        </g>

        {/* Motor on top */}
        <rect x="20" y="0" width="8" height="4" fill={fill} opacity="0.3" stroke={fill} strokeWidth="1" rx="1" />

        {/* Crystal shapes inside vessel */}
        <polygon points="16,34 18,30 20,34" fill="none" stroke={fill} strokeWidth="0.8" opacity="0.5" />
        <polygon points="26,36 28,32 30,36" fill="none" stroke={fill} strokeWidth="0.8" opacity="0.5" />
        <polygon points="20,38 22,35 24,38" fill="none" stroke={fill} strokeWidth="0.8" opacity="0.5" />
        <rect x="30" y="34" width="3" height="3" fill="none" stroke={fill} strokeWidth="0.8" opacity="0.4"
          transform="rotate(45 31.5 35.5)" />

        {/* Feed inlet */}
        <line x1="0" y1="12" x2="12" y2="12" stroke={fill} strokeWidth="1.5" />
        <polygon points="2,10 8,12 2,14" fill={fill} opacity="0.4" />

        {/* Product outlet */}
        <line x1="36" y1="38" x2="48" y2="38" stroke={fill} strokeWidth="1.5" />

        {/* Cooling jacket indicator */}
        <path d="M 10,14 L 8,14 L 8,34 L 10,34" fill="none" stroke={fill} strokeWidth="1" opacity="0.4" />
        <path d="M 38,14 L 40,14 L 40,34 L 38,34" fill="none" stroke={fill} strokeWidth="1" opacity="0.4" />
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

export default Crystallizer;
