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
 * Decanter — Horizontal bowl with internal scroll conveyor.
 * Decanter centrifuge: rotating bowl with Archimedean screw inside.
 */
const Decanter: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-decanter ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidScrollRotate {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -16; }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Bowl body — tapered horizontal cylinder */}
        <path
          d="M 6,14 L 6,30 Q 6,34 10,34 L 34,34 L 42,28 L 42,16 L 34,10 L 10,10 Q 6,10 6,14 Z"
          fill={fill}
          opacity="0.08"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Conical beach section (right end tapers) */}
        <line x1="34" y1="10" x2="42" y2="16" stroke={fill} strokeWidth="1.5" opacity="0.5" />
        <line x1="34" y1="34" x2="42" y2="28" stroke={fill} strokeWidth="1.5" opacity="0.5" />

        {/* Internal scroll conveyor */}
        <path
          d="M 10,16 Q 14,28 18,22 Q 22,16 26,22 Q 30,28 34,22 Q 36,18 40,22"
          fill="none"
          stroke={fill}
          strokeWidth="1.2"
          strokeDasharray="4 4"
          style={animated ? { animation: 'pidScrollRotate 1s linear infinite' } : undefined}
        />
        {/* Central shaft */}
        <line x1="4" y1="22" x2="44" y2="22" stroke={fill} strokeWidth="1.5" />

        {/* Feed inlet — top center */}
        <line x1="20" y1="2" x2="20" y2="10" stroke={fill} strokeWidth="1.5" />
        <line x1="24" y1="2" x2="24" y2="10" stroke={fill} strokeWidth="1.5" />
        <polygon points="20,4 22,0 24,4" fill={fill} opacity="0.4" />

        {/* Liquid (centrate) outlet — left end */}
        <line x1="0" y1="22" x2="6" y2="22" stroke={fill} strokeWidth="1.5" />
        <text x="1" y="20" fontSize="4" fill={fill} opacity="0.4" fontFamily="'Inter', sans-serif">L</text>

        {/* Solids outlet — right (beach) end */}
        <line x1="42" y1="28" x2="46" y2="34" stroke={fill} strokeWidth="1.5" />
        <text x="44" y="38" fontSize="4" fill={fill} opacity="0.4" fontFamily="'Inter', sans-serif">S</text>

        {/* Drive motor (left end) */}
        <rect x="0" y="16" width="4" height="12" fill={fill} opacity="0.2" stroke={fill} strokeWidth="1" rx="1" />

        {/* Support bearings */}
        <path d="M 12,34 L 10,40 L 14,40 Z" fill="none" stroke={fill} strokeWidth="1" />
        <path d="M 36,34 L 34,40 L 38,40 Z" fill="none" stroke={fill} strokeWidth="1" />
        <line x1="6" y1="40" x2="42" y2="40" stroke={fill} strokeWidth="1" opacity="0.3" />
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

export default Decanter;
