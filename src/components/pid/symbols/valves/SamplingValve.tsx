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
 * Sampling Valve — ISA 5.1 Standard
 * Small valve body (compact bowtie) with a sample port indicator:
 * a short branch pipe ending in a small circle (sample connection point).
 * Used to draw process samples for analysis.
 */
const SamplingValve: React.FC<SymbolProps> = ({
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
      className={`pid-valve pid-sampling-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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
        {/* Horizontal pipe lines — main process line */}
        <line x1="0" y1="24" x2="12" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Compact left triangle */}
        <polygon
          points="12,17 24,24 12,31"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Compact right triangle */}
        <polygon
          points="36,17 24,24 36,31"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Sample port branch — vertical line going down from valve body */}
        <line x1="24" y1="24" x2="24" y2="38" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Sample collection point — circle at end of branch */}
        <circle
          cx="24"
          cy="40"
          r="3"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
        />

        {/* "S" inside sample point */}
        <text
          x="24"
          y="43"
          textAnchor="middle"
          fontSize="5"
          fontFamily="'Inter', 'Segoe UI', sans-serif"
          fill={fill}
          fontWeight="700"
        >
          S
        </text>

        {/* Stem going up with small handle */}
        <line x1="24" y1="24" x2="24" y2="14" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="14" x2="28" y2="14" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Small drip indicator below sample port */}
        <line x1="24" y1="43" x2="24" y2="46" stroke={fill} strokeWidth="1" strokeLinecap="round" />
        <circle cx="24" cy="47" r="0.8" fill={fill} />
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

export default SamplingValve;
