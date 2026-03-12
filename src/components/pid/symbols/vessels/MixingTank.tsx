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
 * Mixing Tank — P&ID Standard
 * Tank with top-entry agitator and internal baffles visible.
 * Motor on top, shaft running through center, impeller at bottom,
 * and vertical baffle plates on the walls.
 */
const MixingTank: React.FC<SymbolProps> = ({
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

  const tL = 10;
  const tR = 38;
  const tW = tR - tL;
  const tTop = 10;
  const tBot = 42;
  const tH = tBot - tTop;
  const headRy = 3;

  const totalBot = tBot + headRy;
  const totalH = totalBot - tTop;
  const liquidY = totalBot - (totalH * level) / 100;

  // Tank path with dished bottom
  const tankPath = `
    M ${tL},${tTop}
    L ${tL},${tBot}
    A ${tW / 2},${headRy} 0 0,0 ${tR},${tBot}
    L ${tR},${tTop}
    Z
  `;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-mixing-tank ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`mixClip-${size}`}>
          <path d={tankPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#mixClip-${size})`}>
            <rect
              x={tL - 1}
              y={liquidY}
              width={tW + 2}
              height={totalBot - liquidY + 1}
              fill={liquidColor}
            />
            {isRunning ? (
              <path
                d={`M${tL},${liquidY} Q${24 - 5},${liquidY - 2} 24,${liquidY} Q${24 + 5},${liquidY + 2} ${tR},${liquidY}`}
                stroke={stroke}
                strokeWidth="0.6"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values={`M${tL},${liquidY} Q${24 - 5},${liquidY - 2} 24,${liquidY} Q${24 + 5},${liquidY + 2} ${tR},${liquidY};M${tL},${liquidY} Q${24 - 5},${liquidY + 2} 24,${liquidY} Q${24 + 5},${liquidY - 2} ${tR},${liquidY};M${tL},${liquidY} Q${24 - 5},${liquidY - 2} 24,${liquidY} Q${24 + 5},${liquidY + 2} ${tR},${liquidY}`}
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
            ) : (
              <line x1={tL} y1={liquidY} x2={tR} y2={liquidY} stroke={stroke} strokeWidth="0.6" />
            )}
          </g>
        )}

        {/* Tank body */}
        <path d={tankPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Top plate */}
        <line x1={tL - 1} y1={tTop} x2={tR + 1} y2={tTop} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Internal baffles (vertical plates on tank walls) */}
        <g clipPath={`url(#mixClip-${size})`}>
          {/* Left baffle */}
          <line x1={tL + 1} y1={tTop + 3} x2={tL + 1} y2={tBot - 2} stroke={stroke} strokeWidth="1" />
          <line x1={tL + 1} y1={tTop + 3} x2={tL + 3.5} y2={tTop + 3} stroke={stroke} strokeWidth="0.8" />
          {/* Right baffle */}
          <line x1={tR - 1} y1={tTop + 3} x2={tR - 1} y2={tBot - 2} stroke={stroke} strokeWidth="1" />
          <line x1={tR - 1} y1={tTop + 3} x2={tR - 3.5} y2={tTop + 3} stroke={stroke} strokeWidth="0.8" />
          {/* Front baffle (left of center) */}
          <line x1={tL + 5} y1={tTop + 5} x2={tL + 5} y2={tBot - 3} stroke={stroke} strokeWidth="0.6" strokeDasharray="2,2" />
          {/* Back baffle (right of center) */}
          <line x1={tR - 5} y1={tTop + 5} x2={tR - 5} y2={tBot - 3} stroke={stroke} strokeWidth="0.6" strokeDasharray="2,2" />
        </g>

        {/* Motor housing */}
        <rect x={20} y={2} width={8} height={5} rx={1} fill="none" stroke={stroke} strokeWidth="1.5" />
        <text x="24" y="6" textAnchor="middle" fontSize="4" fontFamily="'Inter', sans-serif" fill={stroke} fontWeight="700">M</text>

        {/* Agitator shaft */}
        <line x1={24} y1={7} x2={24} y2={38} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />

        {/* Impeller (Rushton turbine style) */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 34"
              to="360 24 34"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
          {/* Disc */}
          <line x1={19} y1={34} x2={29} y2={34} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          {/* Blades */}
          <line x1={18} y1={32} x2={18} y2={36} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          <line x1={30} y1={32} x2={30} y2={36} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Inlet nozzle (left upper) */}
        <line x1={2} y1={16} x2={tL} y2={16} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={2} cy={16} r="1" fill={stroke} />

        {/* Outlet nozzle (right lower) */}
        <line x1={tR} y1={38} x2={46} y2={38} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={46} cy={38} r="1" fill={stroke} />

        {/* Bottom drain */}
        <line x1={24} y1={totalBot} x2={24} y2={47} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
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

export default MixingTank;
