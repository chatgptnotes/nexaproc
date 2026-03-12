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
 * Plug Valve — ISA 5.1 Standard
 * Rectangular / trapezoidal body between pipe connections representing
 * the plug element. A filled rectangle indicates the plug inside.
 * Quarter-turn operation.
 */
const PlugValve: React.FC<SymbolProps> = ({
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
      className={`pid-valve pid-plug-valve ${isFault ? 'pid-fault-flash' : ''} ${isTransit ? 'pid-transit-pulse' : ''} ${className}`}
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
        <line x1="0" y1="24" x2="12" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Valve body — outer rectangle (tapered/trapezoidal) */}
        <polygon
          points="12,14 36,14 36,34 12,34"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Plug element — inner filled rectangle */}
        <rect
          x="18"
          y="17"
          width="12"
          height="14"
          fill={state === 'closed' ? fill : 'none'}
          stroke={fill}
          strokeWidth="1.5"
          rx="1"
        />

        {/* Port openings on plug (when open) */}
        {state !== 'closed' && (
          <>
            <line x1="18" y1="24" x2="12" y2="24" stroke={fill} strokeWidth="1.5" />
            <line x1="30" y1="24" x2="36" y2="24" stroke={fill} strokeWidth="1.5" />
          </>
        )}

        {/* Stem */}
        <line x1="24" y1="14" x2="24" y2="8" stroke={fill} strokeWidth="2" strokeLinecap="round" />

        {/* Quarter-turn handle */}
        <line x1="24" y1="8" x2="32" y2="8" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
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

export default PlugValve;
