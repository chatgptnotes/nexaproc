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
 * Pneumatic Valve — ISA 5.1 Standard
 * Standard valve body (bowtie) with a double-acting pneumatic cylinder
 * actuator on top. The actuator is drawn as a rectangle with a piston
 * line inside, plus air supply connections.
 */
const PneumaticValve: React.FC<SymbolProps> = ({
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
      className={`pid-valve pid-pneumatic-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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
        <line x1="0" y1="32" x2="10" y2="32" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="32" x2="48" y2="32" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Left triangle */}
        <polygon
          points="10,22 24,32 10,42"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Right triangle */}
        <polygon
          points="38,22 24,32 38,42"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Stem from valve body to actuator */}
        <line x1="24" y1="32" x2="24" y2="20" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Pneumatic cylinder body — rectangle */}
        <rect
          x="14"
          y="4"
          width="20"
          height="16"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          rx="1"
        />

        {/* Piston rod — vertical line inside cylinder */}
        <line x1="24" y1="20" x2="24" y2="10" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />

        {/* Piston head — horizontal line across cylinder */}
        <line x1="16" y1="10" x2="32" y2="10" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Air supply port — left */}
        <line x1="10" y1="7" x2="14" y2="7" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="10,5.5 10,8.5 8,7" fill={fill} />

        {/* Air supply port — right */}
        <line x1="34" y1="15" x2="38" y2="15" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="38,13.5 38,16.5 40,15" fill={fill} />
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

export default PneumaticValve;
