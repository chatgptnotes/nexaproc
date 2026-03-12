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
 * Furnace / Fired Heater — P&ID Standard
 * Box (firebox) with flame symbol inside, stack/chimney on top,
 * process coil shown as serpentine inside, fuel inlet at bottom.
 */
const Furnace: React.FC<SymbolProps> = ({
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

  const bL = 8;
  const bR = 38;
  const bT = 14;
  const bB = 42;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-exchanger pid-furnace ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        {/* Firebox body */}
        <rect
          x={bL}
          y={bT}
          width={bR - bL}
          height={bB - bT}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          rx={1}
        />

        {/* Stack / chimney on top */}
        <rect x={20} y={2} width={8} height={12} fill="none" stroke={stroke} strokeWidth="1.5" />
        {/* Stack cap */}
        <line x1={18} y1={2} x2={30} y2={2} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Smoke/flue gas from stack */}
        {isRunning && (
          <g>
            <path d="M23,2 Q22,0 23,-2" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M25,2 Q26,0 25,-2" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2.2s" repeatCount="indefinite" />
            </path>
          </g>
        )}

        {/* Flame symbol inside firebox */}
        <g>
          {/* Center flame */}
          <path
            d={`M 23,${bB - 4} Q 20,${bB - 12} 23,${bB - 16} Q 24,${bB - 12} 23,${bB - 10} Q 26,${bB - 14} 25,${bB - 16} Q 28,${bB - 12} 25,${bB - 4}`}
            fill="none"
            stroke={stroke}
            strokeWidth="1"
            strokeLinecap="round"
          />
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.05;1;0.95;1"
              dur="0.8s"
              repeatCount="indefinite"
              additive="sum"
            />
          )}
        </g>

        {/* Secondary flame symbols */}
        <path
          d={`M 15,${bB - 4} Q 14,${bB - 8} 16,${bB - 10} Q 17,${bB - 8} 17,${bB - 4}`}
          fill="none"
          stroke={stroke}
          strokeWidth="0.8"
          opacity="0.6"
        />
        <path
          d={`M 31,${bB - 4} Q 30,${bB - 8} 32,${bB - 10} Q 33,${bB - 8} 33,${bB - 4}`}
          fill="none"
          stroke={stroke}
          strokeWidth="0.8"
          opacity="0.6"
        />

        {/* Process coil (serpentine tube inside firebox, upper section = convection) */}
        <path
          d={`M ${bL},${bT + 5} L ${bR - 4},${bT + 5} L ${bR - 4},${bT + 8} L ${bL + 4},${bT + 8} L ${bL + 4},${bT + 11} L ${bR - 4},${bT + 11}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Process inlet (left, into coil) */}
        <line x1={2} y1={bT + 5} x2={bL} y2={bT + 5} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={2} cy={bT + 5} r="1" fill={stroke} />

        {/* Process outlet (right, from coil) */}
        <line x1={bR - 4} y1={bT + 11} x2={44} y2={bT + 11} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={44} cy={bT + 11} r="1" fill={stroke} />

        {/* Fuel gas inlet (bottom center) */}
        <line x1={24} y1={bB} x2={24} y2={46} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={24} cy={46} r="1" fill={stroke} />
        <text x={27} y={46} fontSize="3" fill={stroke} fontFamily="'Inter', sans-serif">FG</text>

        {/* Combustion air inlet (bottom left) */}
        <line x1={14} y1={bB} x2={14} y2={46} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <polygon points="13,45 14,47 15,45" fill={stroke} opacity="0.5" />
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

export default Furnace;
