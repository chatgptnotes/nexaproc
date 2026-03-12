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

const LIQUID_COLORS: Record<string, string> = {
  running: '#4ade8040',
  stopped: '#ef444440',
  fault: '#f9731640',
  maintenance: '#fbbf2440',
  standby: '#38bdf840',
  offline: '#6b728040',
};

/**
 * Boiler — P&ID Standard
 * Large rectangular body with fire tube indicators inside, steam outlet
 * at top, feedwater inlet, blowdown at bottom, and flame/burner symbol.
 */
const Boiler: React.FC<SymbolProps> = ({
  size = 48,
  state = 'stopped',
  fillLevel = 0,
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const stroke = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const liquidColor = color ? `${color}40` : LIQUID_COLORS[state] || LIQUID_COLORS.offline;
  const isFault = state === 'fault';
  const isRunning = state === 'running' && animated;
  const level = Math.max(0, Math.min(100, fillLevel));

  const bL = 6;
  const bR = 42;
  const bT = 8;
  const bB = 38;
  const bW = bR - bL;
  const bH = bB - bT;

  const liquidY = bB - (bH * level) / 100;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-exchanger pid-boiler ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
      <defs>
        <clipPath id={`boilerClip-${size}`}>
          <rect x={bL} y={bT} width={bW} height={bH} rx={2} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Water fill */}
        {level > 0 && (
          <g clipPath={`url(#boilerClip-${size})`}>
            <rect
              x={bL}
              y={liquidY}
              width={bW}
              height={bB - liquidY}
              fill={liquidColor}
            />
            {/* Water level line */}
            <line x1={bL} y1={liquidY} x2={bR} y2={liquidY} stroke={stroke} strokeWidth="0.6" />
            {/* Normal water level indicator */}
            <text x={bR + 1} y={liquidY + 2} fontSize="2.5" fill={stroke} fontFamily="'Inter', sans-serif">NWL</text>
          </g>
        )}

        {/* Boiler body */}
        <rect
          x={bL}
          y={bT}
          width={bW}
          height={bH}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          rx={2}
        />

        {/* Fire tubes (horizontal lines inside lower section) */}
        <g clipPath={`url(#boilerClip-${size})`}>
          {[bB - 6, bB - 10, bB - 14].map((y, i) => (
            <g key={i}>
              <line x1={bL + 4} y1={y} x2={bR - 4} y2={y} stroke={stroke} strokeWidth="0.8" opacity="0.4" />
              {/* Tube ends (circles at each end) */}
              <circle cx={bL + 4} cy={y} r="1" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.4" />
              <circle cx={bR - 4} cy={y} r="1" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.4" />
            </g>
          ))}
        </g>

        {/* Flame / burner at bottom */}
        <g>
          <path
            d={`M22,${bB + 2} Q21,${bB - 2} 23,${bB - 4} Q24,${bB - 2} 24,${bB - 4} Q26,${bB - 2} 26,${bB + 2}`}
            fill="none"
            stroke={stroke}
            strokeWidth="0.8"
          />
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.05;1"
              dur="0.6s"
              repeatCount="indefinite"
              additive="sum"
            />
          )}
        </g>

        {/* Fuel inlet (bottom) */}
        <line x1={24} y1={bB} x2={24} y2={46} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={24} cy={46} r="0.8" fill={stroke} />

        {/* Steam outlet (top center — larger pipe) */}
        <line x1={24} y1={bT} x2={24} y2={2} stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <circle cx={24} cy={2} r="1.2" fill={stroke} />
        {/* Steam wiggles */}
        {isRunning && (
          <g>
            <path d="M22,4 Q23,2 22,0" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d="M26,4 Q25,2 26,0" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
            </path>
          </g>
        )}

        {/* Feedwater inlet (left) */}
        <line x1={0} y1={24} x2={bL} y2={24} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={1} cy={24} r="1" fill={stroke} />
        <text x={0} y={22} fontSize="2.5" fill={stroke} fontFamily="'Inter', sans-serif">FW</text>

        {/* Blowdown (bottom right) */}
        <line x1={34} y1={bB} x2={34} y2={44} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <line x1={34} y1={44} x2={46} y2={44} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <text x={37} y={43} fontSize="2.5" fill={stroke} fontFamily="'Inter', sans-serif">BD</text>

        {/* Pressure relief (top right) */}
        <line x1={34} y1={bT} x2={34} y2={4} stroke={stroke} strokeWidth="0.8" strokeLinecap="round" />
        <polygon points="33,5 34,3 35,5" fill={stroke} opacity="0.6" />

        {/* Level gauge glass (right side) */}
        <rect x={bR + 1} y={bT + 6} width={2.5} height={bH - 12} rx={0.8} fill="none" stroke={stroke} strokeWidth="0.6" />
        <line x1={bR} y1={bT + 7} x2={bR + 1} y2={bT + 7} stroke={stroke} strokeWidth="0.4" />
        <line x1={bR} y1={bB - 7} x2={bR + 1} y2={bB - 7} stroke={stroke} strokeWidth="0.4" />
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

export default Boiler;
