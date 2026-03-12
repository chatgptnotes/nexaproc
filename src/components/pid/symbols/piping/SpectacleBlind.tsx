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

export interface SpectacleBlindProps extends SymbolProps {
  position?: 'open' | 'closed';
}

const STATE_COLORS: Record<string, string> = {
  active: '#4ade80',
  inactive: '#6b7280',
  fault: '#ef4444',
  offline: '#374151',
};

/**
 * Spectacle Blind — Figure-8 (spec blind) with open/closed positions.
 * Open position: ring with hole. Closed position: solid disc.
 * Two circles joined by a bar, resembling spectacles/figure-8.
 */
const SpectacleBlind: React.FC<SpectacleBlindProps> = ({
  size = 48,
  state = 'active',
  color,
  label,
  rotation = 0,
  className = '',
  onClick,
  position = 'open',
}) => {
  const fill = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const isFault = state === 'fault';

  return (
    <svg
      width={size}
      height={label ? size + 16 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-pipe pid-spectacle-blind ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Left pipe stub */}
        <line x1="0" y1="21" x2="8" y2="21" stroke={fill} strokeWidth="2" />
        <line x1="0" y1="27" x2="8" y2="27" stroke={fill} strokeWidth="2" />

        {/* Open ring (left circle) */}
        <circle cx="16" cy="24" r="8" fill="none" stroke={fill} strokeWidth="2" />
        {position === 'open' && (
          <circle cx="16" cy="24" r="4" fill="none" stroke={fill} strokeWidth="1" strokeDasharray="2 1" opacity="0.4" />
        )}

        {/* Connecting bar between the two circles */}
        <line x1="24" y1="22" x2="24" y2="26" stroke={fill} strokeWidth="3" />

        {/* Blind disc (right circle) — solid when closed is active */}
        <circle cx="32" cy="24" r="8" fill={position === 'closed' ? fill : 'none'}
          stroke={fill} strokeWidth="2" opacity={position === 'closed' ? 0.3 : 1} />
        <circle cx="32" cy="24" r="8" fill="none" stroke={fill} strokeWidth="2" />
        {position === 'closed' && (
          <>
            <line x1="28" y1="20" x2="36" y2="28" stroke={fill} strokeWidth="1" opacity="0.5" />
            <line x1="28" y1="28" x2="36" y2="20" stroke={fill} strokeWidth="1" opacity="0.5" />
          </>
        )}

        {/* Right pipe stub */}
        <line x1="40" y1="21" x2="48" y2="21" stroke={fill} strokeWidth="2" />
        <line x1="40" y1="27" x2="48" y2="27" stroke={fill} strokeWidth="2" />

        {/* Position indicator */}
        <circle
          cx={position === 'open' ? 16 : 32}
          cy="24"
          r="2"
          fill={fill}
          opacity="0.8"
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

export default SpectacleBlind;
