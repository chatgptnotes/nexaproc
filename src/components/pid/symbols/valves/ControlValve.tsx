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
 * Control Valve — ISA 5.1 Standard (Most important SCADA valve)
 * Globe valve body (two triangles + circle) with a diaphragm actuator
 * on top represented as a larger circle on the stem. This is the primary
 * automated throttling valve in process control systems.
 */
const ControlValve: React.FC<SymbolProps> = ({
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
      className={`pid-valve pid-control-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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
        <line x1="0" y1="28" x2="10" y2="28" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="28" x2="48" y2="28" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Left triangle — pointing right */}
        <polygon
          points="10,18 24,28 10,38"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right triangle — pointing left */}
        <polygon
          points="38,18 24,28 38,38"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Globe circle at valve body center */}
        <circle
          cx="24"
          cy="28"
          r="4"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
        />

        {/* Stem — from valve body up to actuator */}
        <line x1="24" y1="24" x2="24" y2="14" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Diaphragm actuator — circle on top of stem */}
        <circle
          cx="24"
          cy="8"
          r="6"
          fill="none"
          stroke={fill}
          strokeWidth="2"
        />

        {/* Actuator center dot — indicating pneumatic/signal connection */}
        <circle cx="24" cy="8" r="1.5" fill={fill} />
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

export default ControlValve;
