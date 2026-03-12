import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'running' | 'stopped' | 'fault' | 'maintenance' | 'standby' | 'offline';
  fillLevel?: number;
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

const STATE_COLORS: Record<string, string> = {
  running: '#4ade80',
  stopped: '#ef4444',
  fault: '#f97316',
  maintenance: '#fbbf24',
  standby: '#38bdf8',
  offline: '#6b7280',
};

/**
 * Plate Heat Exchanger — P&ID Standard
 * Rectangular body with chevron/zigzag pattern inside representing
 * corrugated plates. Four nozzle connections at corners.
 */
const PlateHX: React.FC<SymbolProps> = ({
  size = 48,
  state = 'stopped',
  fillLevel: _fillLevel = 0,
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const stroke = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const isFault = state === 'fault';
  const isRunning = state === 'running' && animated;

  const bL = 12;
  const bR = 36;
  const bT = 10;
  const bB = 38;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-exchanger pid-plate-hx ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Body — rectangular frame with thick end plates */}
        <rect
          x={bL}
          y={bT}
          width={bR - bL}
          height={bB - bT}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          rx={1}
        />

        {/* End plates (thicker lines at left and right) */}
        <line x1={bL} y1={bT} x2={bL} y2={bB} stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        <line x1={bR} y1={bT} x2={bR} y2={bB} stroke={stroke} strokeWidth="3" strokeLinecap="round" />

        {/* Chevron/zigzag pattern inside (corrugated plates) */}
        {[16, 20, 24, 28, 32].map((x, i) => (
          <path
            key={i}
            d={`M${x},${bT + 2} L${x + 2},${bT + 6} L${x - 2},${bT + 10} L${x + 2},${bT + 14} L${x - 2},${bT + 18} L${x + 2},${bT + 22} L${x},${bT + 26}`}
            fill="none"
            stroke={stroke}
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}

        {/* Hot side inlet (top left) */}
        <line x1={bL + 4} y1={bT} x2={bL + 4} y2={4} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={bL + 4} cy={4} r="1" fill={stroke} />

        {/* Hot side outlet (bottom right) */}
        <line x1={bR - 4} y1={bB} x2={bR - 4} y2={44} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={bR - 4} cy={44} r="1" fill={stroke} />

        {/* Cold side inlet (bottom left) */}
        <line x1={bL + 4} y1={bB} x2={bL + 4} y2={44} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points={`${bL + 3},${43} ${bL + 4},${41} ${bL + 5},${43}`} fill={stroke} />

        {/* Cold side outlet (top right) */}
        <line x1={bR - 4} y1={bT} x2={bR - 4} y2={4} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points={`${bR - 5},${5} ${bR - 4},${3} ${bR - 3},${5}`} fill={stroke} />

        {/* Flow animation */}
        {isRunning && (
          <>
            <circle cx={bL + 4} cy={bT + 4} r="0.8" fill={stroke} opacity="0.5">
              <animate attributeName="cy" values={`${bT + 4};${bB - 4}`} dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={bR - 4} cy={bB - 4} r="0.8" fill={stroke} opacity="0.5">
              <animate attributeName="cy" values={`${bB - 4};${bT + 4}`} dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.1" dur="2s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </g>

      {label && (
        <text
          x="24"
          y="58"
          textAnchor="middle"
          fontSize="7"
          fontFamily="'Inter', 'Segoe UI', sans-serif"
          fill={stroke}
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export default PlateHX;
