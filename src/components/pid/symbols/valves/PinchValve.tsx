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
 * Pinch Valve — ISA 5.1 Standard
 * Two curved lines pinching together at the center, representing
 * the flexible sleeve that is squeezed to control flow.
 * The pinch profile narrows in the middle.
 */
const PinchValve: React.FC<SymbolProps> = ({
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

  // When closed, pinch is tighter
  const pinchY = state === 'closed' ? 24 : 22;
  const pinchYBottom = state === 'closed' ? 24 : 26;

  return (
    <svg
      width={size}
      height={label ? size + 16 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-valve pid-pinch-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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
        <line x1="0" y1="24" x2="8" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Upper sleeve profile — curves inward to pinch point */}
        <path
          d={`M8,16 Q16,16 24,${pinchY} Q32,16 40,16`}
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Lower sleeve profile — curves inward to pinch point */}
        <path
          d={`M8,32 Q16,32 24,${pinchYBottom} Q32,32 40,32`}
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Left end cap */}
        <line x1="8" y1="16" x2="8" y2="32" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Right end cap */}
        <line x1="40" y1="16" x2="40" y2="32" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Pinch mechanism — arrows from top and bottom squeezing */}
        <line x1="24" y1="6" x2="24" y2="14" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="22,14 24,17 26,14" fill={fill} />

        <line x1="24" y1="42" x2="24" y2="34" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="22,34 24,31 26,34" fill={fill} />

        {/* Actuator stem top */}
        <line x1="20" y1="6" x2="28" y2="6" stroke={fill} strokeWidth="2" strokeLinecap="round" />
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

export default PinchValve;
