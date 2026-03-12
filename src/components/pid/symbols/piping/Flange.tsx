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
 * Flange — Two bolted raised-face flanges meeting at center.
 * ISA representation: two parallel vertical lines with short horizontal
 * extensions (bolt flanges) and connecting pipe on each side.
 */
const Flange: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-flange ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Left pipe */}
        <line x1="0" y1="20" x2="20" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="28" x2="20" y2="28" stroke={fill} strokeWidth="2" />
        <rect x="0" y="21" width="20" height="6" fill={fill} opacity="0.12" />

        {/* Left flange face — vertical bar with bolt extensions */}
        <line x1="20" y1="12" x2="20" y2="36" stroke={fill} strokeWidth="2.5" />
        {/* Left bolt heads */}
        <line x1="17" y1="14" x2="20" y2="14" stroke={fill} strokeWidth="2" />
        <line x1="17" y1="34" x2="20" y2="34" stroke={fill} strokeWidth="2" />

        {/* Gasket gap */}
        <line x1="23" y1="14" x2="23" y2="34" stroke={fill} strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />

        {/* Right flange face */}
        <line x1="26" y1="12" x2="26" y2="36" stroke={fill} strokeWidth="2.5" />
        {/* Right bolt heads */}
        <line x1="26" y1="14" x2="29" y2="14" stroke={fill} strokeWidth="2" />
        <line x1="26" y1="34" x2="29" y2="34" stroke={fill} strokeWidth="2" />

        {/* Right pipe */}
        <line x1="26" y1="20" x2="48" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="26" y1="28" x2="48" y2="28" stroke={fill} strokeWidth="2" />
        <rect x="26" y="21" width="22" height="6" fill={fill} opacity="0.12" />
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

export default Flange;
