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
 * Regulating Valve (Self-Actuated) — ISA 5.1 Standard
 * Control valve body with a self-actuated regulator: a globe valve
 * body with a diaphragm chamber on top connected to a sensing line.
 * The regulator adjusts automatically based on process conditions.
 * Distinguished by a filled diaphragm and a sensing line arrow.
 */
const RegulatingValve: React.FC<SymbolProps> = ({
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
      className={`pid-valve pid-regulating-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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

        {/* Globe circle at valve body */}
        <circle cx="24" cy="30" r="4" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Stem to regulator body */}
        <line x1="24" y1="26" x2="24" y2="16" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Regulator diaphragm chamber — larger dome */}
        <path
          d="M14,16 Q14,4 24,4 Q34,4 34,16 Z"
          fill="none"
          stroke={fill}
          strokeWidth="2"
        />

        {/* Diaphragm line across chamber */}
        <line x1="14" y1="16" x2="34" y2="16" stroke={fill} strokeWidth="1.5" />

        {/* Sensing line — dashed line from downstream pipe to regulator */}
        <path
          d="M38,34 L42,40 L42,46 L30,46 L30,16 L34,16"
          fill="none"
          stroke={fill}
          strokeWidth="1.2"
          strokeDasharray="2,2"
        />

        {/* Sensing arrow */}
        <polygon points="32,16 34,14 34,18" fill={fill} />
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

export default RegulatingValve;
