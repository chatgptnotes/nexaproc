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
 * Crusher — Two jaw plates converging toward each other (jaw crusher).
 * Material enters from top, crushed material exits bottom.
 */
const Crusher: React.FC<SymbolProps> = ({
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
      className={`pid-material pid-crusher ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidCrush {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(2px); }
        }
        @keyframes pidCrushR {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-2px); }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Feed hopper at top */}
        <path d="M 14,4 L 10,12 L 38,12 L 34,4" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Left jaw plate — angled inward */}
        <g style={animated ? { animation: 'pidCrush 0.5s ease-in-out infinite' } : undefined}>
          <path
            d="M 8,12 L 8,38 L 20,42"
            fill="none"
            stroke={fill}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Jaw teeth */}
          <path d="M 8,16 L 12,18 L 8,20 L 12,22 L 8,24 L 12,26 L 8,28 L 12,30 L 8,32 L 12,34 L 8,36"
            fill="none" stroke={fill} strokeWidth="1" opacity="0.6" />
        </g>

        {/* Right jaw plate — angled inward */}
        <g style={animated ? { animation: 'pidCrushR 0.5s ease-in-out infinite' } : undefined}>
          <path
            d="M 40,12 L 40,38 L 28,42"
            fill="none"
            stroke={fill}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Jaw teeth */}
          <path d="M 40,16 L 36,18 L 40,20 L 36,22 L 40,24 L 36,26 L 40,28 L 36,30 L 40,32 L 36,34 L 40,36"
            fill="none" stroke={fill} strokeWidth="1" opacity="0.6" />
        </g>

        {/* Discharge opening at bottom */}
        <line x1="20" y1="42" x2="20" y2="46" stroke={fill} strokeWidth="1.5" />
        <line x1="28" y1="42" x2="28" y2="46" stroke={fill} strokeWidth="1.5" />

        {/* Material particles */}
        <circle cx="22" cy="16" r="1.5" fill={fill} opacity="0.3" />
        <circle cx="26" cy="18" r="1" fill={fill} opacity="0.3" />
        <circle cx="24" cy="14" r="1.2" fill={fill} opacity="0.3" />

        {/* Flywheel/eccentric on side */}
        <circle cx="44" cy="20" r="3" fill="none" stroke={fill} strokeWidth="1.5" />
        <line x1="40" y1="20" x2="44" y2="20" stroke={fill} strokeWidth="1" />
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

export default Crusher;
