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
 * Angle Valve — ISA 5.1 Standard
 * 90-degree valve body forming an L-shaped flow path.
 * Inlet is horizontal (left), outlet is vertical (bottom).
 * Two triangles meeting at the corner of the L.
 */
const AngleValve: React.FC<SymbolProps> = ({
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
      className={`pid-valve pid-angle-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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
        {/* Horizontal inlet pipe — left */}
        <line x1="0" y1="20" x2="10" y2="20" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Vertical outlet pipe — bottom */}
        <line x1="24" y1="38" x2="24" y2="48" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Horizontal triangle — pointing right toward the junction */}
        <polygon
          points="10,12 24,20 10,28"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Vertical triangle — pointing down from the junction */}
        <polygon
          points="16,24 24,24 24,38 16,38"
          fill="none"
          stroke="none"
        />
        <polygon
          points="16,24 24,24 32,24 24,38"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Junction point */}
        <circle cx="24" cy="20" r="2" fill={fill} />

        {/* Globe circle at junction */}
        <circle
          cx="24"
          cy="22"
          r="4"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
        />

        {/* Stem — from junction going upper-right diagonally */}
        <line x1="24" y1="18" x2="24" y2="8" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Handwheel */}
        <line x1="19" y1="8" x2="29" y2="8" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
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

export default AngleValve;
