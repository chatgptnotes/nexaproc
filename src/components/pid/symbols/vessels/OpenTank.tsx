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
 * Open Tank — P&ID Standard
 * Rectangular tank without top cover (atmospheric, open top).
 * Shows as a U-shaped container with no lid. Used for sumps,
 * mixing basins, open reservoirs.
 */
const OpenTank: React.FC<SymbolProps> = ({
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

  const tL = 8;
  const tR = 40;
  const tTop = 8;
  const tBot = 40;
  const tH = tBot - tTop;
  const liquidY = tBot - (tH * level) / 100;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-open-tank ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`openTankClip-${size}`}>
          <rect x={tL} y={tTop} width={tR - tL} height={tH} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#openTankClip-${size})`}>
            <rect
              x={tL}
              y={liquidY}
              width={tR - tL}
              height={tBot - liquidY}
              fill={liquidColor}
            />
            {/* Liquid surface */}
            {isRunning ? (
              <path
                d={`M${tL},${liquidY} Q${24 - 4},${liquidY - 1.5} ${24},${liquidY} Q${24 + 4},${liquidY + 1.5} ${tR},${liquidY}`}
                stroke={stroke}
                strokeWidth="0.7"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values={`M${tL},${liquidY} Q${24 - 4},${liquidY - 1.5} 24,${liquidY} Q${24 + 4},${liquidY + 1.5} ${tR},${liquidY};M${tL},${liquidY} Q${24 - 4},${liquidY + 1.5} 24,${liquidY} Q${24 + 4},${liquidY - 1.5} ${tR},${liquidY};M${tL},${liquidY} Q${24 - 4},${liquidY - 1.5} 24,${liquidY} Q${24 + 4},${liquidY + 1.5} ${tR},${liquidY}`}
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </path>
            ) : (
              <line x1={tL} y1={liquidY} x2={tR} y2={liquidY} stroke={stroke} strokeWidth="0.7" />
            )}
          </g>
        )}

        {/* Tank body — U-shape (no top cover) */}
        <path
          d={`M ${tL},${tTop} L ${tL},${tBot} L ${tR},${tBot} L ${tR},${tTop}`}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Open top indicator — dashed lines showing no cover */}
        <line x1={tL - 2} y1={tTop} x2={tL + 3} y2={tTop} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={tR - 3} y1={tTop} x2={tR + 2} y2={tTop} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Atmospheric vent symbol */}
        <line x1={24} y1={tTop - 1} x2={24} y2={tTop - 4} stroke={stroke} strokeWidth="0.8" />
        <line x1={22} y1={tTop - 4} x2={26} y2={tTop - 4} stroke={stroke} strokeWidth="0.8" />
        <line x1={22.5} y1={tTop - 5.5} x2={25.5} y2={tTop - 5.5} stroke={stroke} strokeWidth="0.6" />
        <line x1={23} y1={tTop - 7} x2={25} y2={tTop - 7} stroke={stroke} strokeWidth="0.4" />

        {/* Inlet nozzle (left upper) */}
        <line x1={2} y1={16} x2={tL} y2={16} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={2} cy={16} r="1" fill={stroke} />

        {/* Outlet nozzle (right lower) */}
        <line x1={tR} y1={36} x2={46} y2={36} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={46} cy={36} r="1" fill={stroke} />

        {/* Drain (bottom center) */}
        <line x1={24} y1={tBot} x2={24} y2={46} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Bottom base plate */}
        <line x1={tL - 2} y1={tBot} x2={tR + 2} y2={tBot} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
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

export default OpenTank;
