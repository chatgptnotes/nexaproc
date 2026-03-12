import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'open' | 'closed' | 'transit' | 'fault' | 'manual' | 'offline';
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

const STATE_COLORS: Record<string, string> = {
  open: '#4ade80',
  closed: '#ef4444',
  transit: '#fbbf24',
  fault: '#f97316',
  manual: '#38bdf8',
  offline: '#6b7280',
};

/**
 * Relief / Safety Valve — ISA 5.1 Standard
 * Angled valve body (triangle pointing up with outlet angled) with a
 * spring symbol on top. Relieves excess pressure automatically.
 * The body is oriented vertically with inlet at bottom and
 * discharge angled to the side.
 */
const ReliefValve: React.FC<SymbolProps> = ({
  size = 48,
  state = 'open',
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const fill = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const isFault = state === 'fault';
  const isTransit = state === 'transit' && animated;

  return (
    <svg
      width={size}
      height={label ? size + 16 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-valve pid-relief-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        .pid-transit-pulse { animation: pidTransitPulse 1.2s ease-in-out infinite; }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes pidTransitPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Inlet pipe — bottom */}
        <line x1="24" y1="48" x2="24" y2="38" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Valve body — triangle pointing upward */}
        <polygon
          points="14,38 24,24 34,38"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Seat line */}
        <line x1="14" y1="38" x2="34" y2="38" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Stem from valve to spring */}
        <line x1="24" y1="24" x2="24" y2="18" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Spring symbol — zigzag */}
        <polyline
          points="24,18 20,16 28,14 20,12 28,10 20,8 28,6 24,4"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Spring top cap */}
        <line x1="20" y1="4" x2="28" y2="4" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Discharge arrow — angled to right */}
        <line x1="24" y1="30" x2="40" y2="22" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <polyline
          points="36,19 40,22 36,25"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {label && (
        <text
          x="24"
          y="58"
          textAnchor="middle"
          fontSize="8"
          fontFamily="'Inter', 'Segoe UI', sans-serif"
          fill={fill}
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export default ReliefValve;
