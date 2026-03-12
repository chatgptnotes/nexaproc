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
 * Blind Flange — Solid flange cap (blank) at pipe end.
 * ISA: pipe terminating into a solid vertical bar with bolt extensions.
 */
const BlindFlange: React.FC<SymbolProps> = ({
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
      className={`pid-pipe pid-blind-flange ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Pipe section */}
        <line x1="0" y1="20" x2="28" y2="20" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="28" x2="28" y2="28" stroke={fill} strokeWidth="2" />
        <rect x="0" y="21" width="28" height="6" fill={fill} opacity="0.12" />

        {/* Flange face with bolts */}
        <line x1="28" y1="12" x2="28" y2="36" stroke={fill} strokeWidth="2.5" />
        <line x1="25" y1="14" x2="28" y2="14" stroke={fill} strokeWidth="2" />
        <line x1="25" y1="34" x2="28" y2="34" stroke={fill} strokeWidth="2" />

        {/* Solid blind plate — thick bar */}
        <rect x="30" y="10" width="5" height="28" fill={fill} opacity="0.3" stroke={fill} strokeWidth="1.5" rx="1" />

        {/* Cross-hatch on blind to indicate solid */}
        <line x1="31" y1="14" x2="34" y2="18" stroke={fill} strokeWidth="0.8" opacity="0.5" />
        <line x1="31" y1="20" x2="34" y2="24" stroke={fill} strokeWidth="0.8" opacity="0.5" />
        <line x1="31" y1="26" x2="34" y2="30" stroke={fill} strokeWidth="0.8" opacity="0.5" />
        <line x1="31" y1="32" x2="34" y2="36" stroke={fill} strokeWidth="0.8" opacity="0.5" />
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

export default BlindFlange;
