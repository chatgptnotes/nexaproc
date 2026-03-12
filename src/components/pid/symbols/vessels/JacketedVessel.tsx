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
 * Jacketed Vessel — P&ID Standard
 * Vessel with double-wall jacket shown as outer wall with gap.
 * Inner vessel holds process fluid; jacket carries heating/cooling medium.
 */
const JacketedVessel: React.FC<SymbolProps> = ({
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

  // Inner vessel dimensions
  const iL = 14;
  const iR = 34;
  const iW = iR - iL;
  const iTop = 8;
  const iBot = 38;
  const iH = iBot - iTop;
  const headRy = 3;

  // Jacket (outer wall) — gap of ~3px
  const jGap = 3;
  const jL = iL - jGap;
  const jR = iR + jGap;

  const totalBot = iBot + headRy;
  const totalTop = iTop;
  const totalH = totalBot - totalTop;
  const liquidY = totalBot - (totalH * level) / 100;

  // Inner vessel path with dished bottom
  const innerPath = `
    M ${iL},${iTop}
    L ${iL},${iBot}
    A ${iW / 2},${headRy} 0 0,0 ${iR},${iBot}
    L ${iR},${iTop}
    Z
  `;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-jacketed-vessel ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`jvClip-${size}`}>
          <path d={innerPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill inside inner vessel */}
        {level > 0 && (
          <g clipPath={`url(#jvClip-${size})`}>
            <rect
              x={iL - 1}
              y={liquidY}
              width={iW + 2}
              height={totalBot - liquidY + 1}
              fill={liquidColor}
            />
            {isRunning ? (
              <path
                d={`M${iL},${liquidY} Q24,${liquidY - 1.2} ${iR},${liquidY}`}
                stroke={stroke}
                strokeWidth="0.6"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values={`M${iL},${liquidY} Q24,${liquidY - 1.2} ${iR},${liquidY};M${iL},${liquidY} Q24,${liquidY + 1.2} ${iR},${liquidY};M${iL},${liquidY} Q24,${liquidY - 1.2} ${iR},${liquidY}`}
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </path>
            ) : (
              <line x1={iL} y1={liquidY} x2={iR} y2={liquidY} stroke={stroke} strokeWidth="0.6" />
            )}
          </g>
        )}

        {/* Outer jacket wall — dashed to show it's a separate shell */}
        <path
          d={`M ${jL},${iTop + 2} L ${jL},${iBot - 1} A ${(iW + 2 * jGap) / 2},${headRy + 1.5} 0 0,0 ${jR},${iBot - 1} L ${jR},${iTop + 2}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.2"
          strokeDasharray="3,2"
        />

        {/* Inner vessel body outline */}
        <path d={innerPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Top plate */}
        <line x1={iL - 1} y1={iTop} x2={iR + 1} y2={iTop} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Jacket inlet (bottom left) */}
        <line x1={4} y1={iBot - 4} x2={jL} y2={iBot - 4} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <circle cx={4} cy={iBot - 4} r="0.8" fill={stroke} />
        <text x={3} y={iBot - 6} fontSize="3.5" fill={stroke} fontFamily="'Inter', sans-serif">J</text>

        {/* Jacket outlet (top right) */}
        <line x1={jR} y1={iTop + 6} x2={44} y2={iTop + 6} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <circle cx={44} cy={iTop + 6} r="0.8" fill={stroke} />
        <text x={43} y={iTop + 4} fontSize="3.5" fill={stroke} fontFamily="'Inter', sans-serif">J</text>

        {/* Process inlet (top left on vessel) */}
        <line x1={6} y1={14} x2={iL} y2={14} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={6} cy={14} r="1" fill={stroke} />

        {/* Process outlet (bottom right on vessel) */}
        <line x1={iR} y1={36} x2={42} y2={36} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={42} cy={36} r="1" fill={stroke} />

        {/* Vent / top nozzle */}
        <line x1={24} y1={iTop} x2={24} y2={3} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Drain nozzle (bottom) */}
        <line x1={24} y1={iBot + headRy} x2={24} y2={46} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Support legs */}
        <line x1={iL + 1} y1={iBot + headRy} x2={iL - 1} y2={46} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <line x1={iR - 1} y1={iBot + headRy} x2={iR + 1} y2={46} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
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

export default JacketedVessel;
