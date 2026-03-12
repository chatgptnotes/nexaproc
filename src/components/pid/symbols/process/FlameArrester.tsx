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
 * Flame Arrester — Pipe section with internal grid/mesh element.
 * ISA standard: pipe with crimped metal ribbon or mesh element
 * indicated by cross-hatching between flanges.
 */
const FlameArrester: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-flame-arrester ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Left pipe */}
        <line x1="0" y1="20" x2="14" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="28" x2="14" y2="28" stroke={fill} strokeWidth="2" />

        {/* Left flange */}
        <line x1="14" y1="12" x2="14" y2="36" stroke={fill} strokeWidth="2" />

        {/* Flame arrester body — enlarged section */}
        <rect x="14" y="10" width="20" height="28" fill={fill} opacity="0.06"
          stroke={fill} strokeWidth="2" rx="1" />

        {/* Internal mesh/grid — cross-hatch pattern */}
        {/* Diagonal lines one direction */}
        <line x1="16" y1="12" x2="22" y2="36" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        <line x1="20" y1="12" x2="26" y2="36" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        <line x1="24" y1="12" x2="30" y2="36" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        <line x1="28" y1="12" x2="32" y2="30" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        {/* Diagonal lines other direction */}
        <line x1="16" y1="36" x2="22" y2="12" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        <line x1="20" y1="36" x2="26" y2="12" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        <line x1="24" y1="36" x2="30" y2="12" stroke={fill} strokeWidth="0.8" opacity="0.4" />
        <line x1="28" y1="36" x2="32" y2="18" stroke={fill} strokeWidth="0.8" opacity="0.4" />

        {/* Right flange */}
        <line x1="34" y1="12" x2="34" y2="36" stroke={fill} strokeWidth="2" />

        {/* Right pipe */}
        <line x1="34" y1="20" x2="48" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="34" y1="28" x2="48" y2="28" stroke={fill} strokeWidth="2" />

        {/* Flame symbol on left side (protected side) */}
        <path d="M 6,14 Q 8,10 7,8 Q 9,10 10,8 Q 9,12 8,14" fill={fill} opacity="0.3" />

        {/* No-flame on right side (safe side) */}
        <circle cx="42" cy="12" r="3" fill="none" stroke={fill} strokeWidth="0.8" opacity="0.3" />
        <line x1="40" y1="10" x2="44" y2="14" stroke={fill} strokeWidth="0.8" opacity="0.3" />

        {/* Tag */}
        <text x="24" y="44" textAnchor="middle" fontSize="5" fill={fill} opacity="0.5"
          fontFamily="'Inter', sans-serif" fontWeight="600">FA</text>
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

export default FlameArrester;
