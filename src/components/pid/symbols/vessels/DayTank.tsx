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
 * Day Tank — P&ID Standard
 * Small elevated tank with level indicator. Used for daily chemical
 * dosing or fuel supply. Shown elevated on a stand/platform with
 * a prominent level gauge on the side.
 */
const DayTank: React.FC<SymbolProps> = ({
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

  // Small tank body (elevated)
  const tL = 12;
  const tR = 36;
  const tW = tR - tL;
  const tTop = 4;
  const tBot = 26;
  const tH = tBot - tTop;
  const liquidY = tBot - (tH * level) / 100;

  // Stand/platform
  const standTop = tBot;
  const standBot = 46;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-day-tank ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`dayTankClip-${size}`}>
          <rect x={tL} y={tTop} width={tW} height={tH} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#dayTankClip-${size})`}>
            <rect
              x={tL}
              y={liquidY}
              width={tW}
              height={tBot - liquidY}
              fill={liquidColor}
            />
            {isRunning ? (
              <path
                d={`M${tL},${liquidY} Q24,${liquidY - 1} ${tR},${liquidY}`}
                stroke={stroke}
                strokeWidth="0.5"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values={`M${tL},${liquidY} Q24,${liquidY - 1} ${tR},${liquidY};M${tL},${liquidY} Q24,${liquidY + 1} ${tR},${liquidY};M${tL},${liquidY} Q24,${liquidY - 1} ${tR},${liquidY}`}
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </path>
            ) : (
              <line x1={tL} y1={liquidY} x2={tR} y2={liquidY} stroke={stroke} strokeWidth="0.5" />
            )}
          </g>
        )}

        {/* Tank body */}
        <rect
          x={tL}
          y={tTop}
          width={tW}
          height={tH}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Top plate */}
        <line x1={tL - 1} y1={tTop} x2={tR + 1} y2={tTop} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Bottom plate */}
        <line x1={tL - 1} y1={tBot} x2={tR + 1} y2={tBot} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Level indicator / sight glass (right side) */}
        <rect x={tR + 2} y={tTop + 2} width={3} height={tH - 4} rx={1} fill="none" stroke={stroke} strokeWidth="0.8" />
        {/* Level indication inside gauge */}
        {level > 0 && (
          <rect
            x={tR + 2.5}
            y={tBot - 2 - ((tH - 4) * level) / 100}
            width={2}
            height={((tH - 4) * level) / 100}
            rx={0.5}
            fill={liquidColor}
            stroke={stroke}
            strokeWidth="0.3"
          />
        )}
        {/* Level gauge connection lines */}
        <line x1={tR} y1={tTop + 3} x2={tR + 2} y2={tTop + 3} stroke={stroke} strokeWidth="0.5" />
        <line x1={tR} y1={tBot - 3} x2={tR + 2} y2={tBot - 3} stroke={stroke} strokeWidth="0.5" />

        {/* Graduation marks on level gauge */}
        {[0.25, 0.5, 0.75].map((frac, i) => {
          const gy = tBot - 2 - (tH - 4) * frac;
          return (
            <line key={i} x1={tR + 5} y1={gy} x2={tR + 6.5} y2={gy} stroke={stroke} strokeWidth="0.4" />
          );
        })}

        {/* Fill inlet (top) */}
        <line x1={20} y1={tTop} x2={20} y2={0} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={20} cy={1} r="1" fill={stroke} />

        {/* Vent */}
        <line x1={28} y1={tTop} x2={28} y2={1} stroke={stroke} strokeWidth="0.8" strokeLinecap="round" />
        <line x1={26.5} y1={1} x2={29.5} y2={1} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Outlet (bottom) */}
        <line x1={24} y1={tBot} x2={24} y2={standTop + 2} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Elevated stand / platform */}
        {/* Left leg */}
        <line x1={tL + 2} y1={standTop} x2={tL} y2={standBot} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        {/* Right leg */}
        <line x1={tR - 2} y1={standTop} x2={tR} y2={standBot} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        {/* Cross brace */}
        <line x1={tL + 1} y1={36} x2={tR - 1} y2={36} stroke={stroke} strokeWidth="0.8" />
        {/* Diagonal bracing */}
        <line x1={tL + 1} y1={36} x2={24} y2={standTop + 1} stroke={stroke} strokeWidth="0.5" />
        <line x1={tR - 1} y1={36} x2={24} y2={standTop + 1} stroke={stroke} strokeWidth="0.5" />

        {/* Base feet */}
        <line x1={tL - 2} y1={standBot} x2={tL + 2} y2={standBot} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={tR - 2} y1={standBot} x2={tR + 2} y2={standBot} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Outlet pipe running down the stand */}
        <path
          d={`M24,${standTop + 2} L24,${standBot - 2} L${tR + 4},${standBot - 2}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={tR + 4} cy={standBot - 2} r="1" fill={stroke} />
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

export default DayTank;
