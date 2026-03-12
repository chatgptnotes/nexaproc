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
 * Three-Way Valve — ISA 5.1 Standard
 * T-shaped three-port valve body with triangles on all three ports.
 * Used for mixing or diverting flow between three connections.
 * Horizontal flow (left/right) plus a vertical branch (bottom).
 */
const ThreeWayValve: React.FC<SymbolProps> = ({
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
      className={`pid-valve pid-three-way-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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
        {/* Horizontal pipe lines — left and right ports */}
        <line x1="0" y1="20" x2="8" y2="20" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="20" x2="48" y2="20" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Bottom port pipe */}
        <line x1="24" y1="36" x2="24" y2="44" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Left triangle — pointing right to center */}
        <polygon
          points="8,12 24,20 8,28"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right triangle — pointing left to center */}
        <polygon
          points="40,12 24,20 40,28"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Bottom triangle — pointing up to center */}
        <polygon
          points="16,36 24,20 32,36"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Center junction dot */}
        <circle cx="24" cy="20" r="2" fill={fill} />

        {/* Stem upward */}
        <line x1="24" y1="20" x2="24" y2="8" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Handle crossbar */}
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

export default ThreeWayValve;
