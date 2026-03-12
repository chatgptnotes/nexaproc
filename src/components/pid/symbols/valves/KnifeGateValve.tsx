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
 * Knife Gate Valve — ISA 5.1 Standard
 * Similar to gate valve (bowtie) but with a blade/knife indicator:
 * a narrow vertical rectangle descending from the stem through the
 * center of the valve body, representing the sharp-edged gate.
 */
const KnifeGateValve: React.FC<SymbolProps> = ({
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
      className={`pid-valve pid-knife-gate-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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
        <line x1="0" y1="24" x2="10" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Left triangle */}
        <polygon
          points="10,14 24,24 10,34"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right triangle */}
        <polygon
          points="38,14 24,24 38,34"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Blade/knife — narrow filled rectangle through center */}
        <rect
          x="22.5"
          y={state === 'closed' ? 8 : 8}
          width="3"
          height={state === 'closed' ? 26 : 16}
          fill={fill}
          stroke={fill}
          strokeWidth="0.5"
          rx="0.5"
        />

        {/* Blade tip — pointed bottom (sharp edge) */}
        {state === 'closed' && (
          <polygon
            points="22.5,34 24,37 25.5,34"
            fill={fill}
          />
        )}

        {/* Stem above blade */}
        <line x1="24" y1="8" x2="24" y2="4" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Handle crossbar */}
        <line x1="19" y1="4" x2="29" y2="4" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
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

export default KnifeGateValve;
