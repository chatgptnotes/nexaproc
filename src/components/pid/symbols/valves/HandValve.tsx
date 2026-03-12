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
 * Hand Valve — ISA 5.1 Standard
 * Manual hand-operated valve with a prominent handwheel symbol on top.
 * The handwheel is drawn as a circle with spokes (like a ship's wheel).
 * Standard bowtie valve body below.
 */
const HandValve: React.FC<SymbolProps> = ({
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

  // Handwheel center and radius
  const hwCx = 24;
  const hwCy = 9;
  const hwR = 7;

  return (
    <svg
      width={size}
      height={label ? size + 16 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-valve pid-hand-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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
        {/* Horizontal pipe lines */}
        <line x1="0" y1="30" x2="10" y2="30" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="30" x2="48" y2="30" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Left triangle */}
        <polygon
          points="10,20 24,30 10,40"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right triangle */}
        <polygon
          points="38,20 24,30 38,40"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Stem from valve body to handwheel */}
        <line x1="24" y1="30" x2="24" y2="16" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Handwheel — outer circle */}
        <circle
          cx={hwCx}
          cy={hwCy}
          r={hwR}
          fill="none"
          stroke={fill}
          strokeWidth="2"
        />

        {/* Handwheel center hub */}
        <circle cx={hwCx} cy={hwCy} r="2" fill={fill} />

        {/* Handwheel spokes — 4 spokes at 45-degree intervals */}
        <line
          x1={hwCx - 2}
          y1={hwCy}
          x2={hwCx - hwR}
          y2={hwCy}
          stroke={fill}
          strokeWidth="1.5"
        />
        <line
          x1={hwCx + 2}
          y1={hwCy}
          x2={hwCx + hwR}
          y2={hwCy}
          stroke={fill}
          strokeWidth="1.5"
        />
        <line
          x1={hwCx}
          y1={hwCy - 2}
          x2={hwCx}
          y2={hwCy - hwR}
          stroke={fill}
          strokeWidth="1.5"
        />
        <line
          x1={hwCx}
          y1={hwCy + 2}
          x2={hwCx}
          y2={hwCy + hwR}
          stroke={fill}
          strokeWidth="1.5"
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

export default HandValve;
