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
 * Drum — ISA P&ID Standard
 * Horizontal cylindrical vessel with dished ends. Used for flash drums,
 * knock-out drums, and phase separators. fillLevel shows liquid inside.
 */
const Drum: React.FC<SymbolProps> = ({
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

  // Horizontal drum dimensions
  const drumTop = 14;
  const drumBot = 34;
  const drumH = drumBot - drumTop;
  const bodyLeft = 8;
  const bodyRight = 40;
  const headRx = 4;
  const headRy = drumH / 2;

  // Liquid fills from bottom up in horizontal drum
  const liquidTop = drumBot - (drumH * level) / 100;

  // Drum outline path
  const drumPath = `
    M ${bodyLeft},${drumTop}
    A ${headRx},${headRy} 0 0,0 ${bodyLeft},${drumBot}
    L ${bodyRight},${drumBot}
    A ${headRx},${headRy} 0 0,0 ${bodyRight},${drumTop}
    Z
  `;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-drum ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`drumClip-${size}`}>
          <path d={drumPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#drumClip-${size})`}>
            <rect
              x={bodyLeft - headRx - 1}
              y={liquidTop}
              width={bodyRight - bodyLeft + 2 * headRx + 2}
              height={drumBot - liquidTop + 1}
              fill={liquidColor}
            />
            {/* Liquid level line */}
            {isRunning ? (
              <path
                d={`M${bodyLeft - headRx},${liquidTop} Q${24},${liquidTop - 1} ${bodyRight + headRx},${liquidTop}`}
                stroke={stroke}
                strokeWidth="0.6"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values={`M${bodyLeft - headRx},${liquidTop} Q${24},${liquidTop - 1} ${bodyRight + headRx},${liquidTop};M${bodyLeft - headRx},${liquidTop} Q${24},${liquidTop + 1} ${bodyRight + headRx},${liquidTop};M${bodyLeft - headRx},${liquidTop} Q${24},${liquidTop - 1} ${bodyRight + headRx},${liquidTop}`}
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </path>
            ) : (
              <line x1={bodyLeft - headRx} y1={liquidTop} x2={bodyRight + headRx} y2={liquidTop} stroke={stroke} strokeWidth="0.6" />
            )}
          </g>
        )}

        {/* Drum body outline */}
        <path d={drumPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Inlet nozzle (top left — vapor/liquid feed) */}
        <line x1={14} y1={8} x2={14} y2={drumTop} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={14} cy={8} r="1" fill={stroke} />

        {/* Vapor outlet (top right) */}
        <line x1={34} y1={drumTop} x2={34} y2={8} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points="33,9 34,7 35,9" fill={stroke} />

        {/* Liquid outlet (bottom center) */}
        <line x1={24} y1={drumBot} x2={24} y2={42} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={24} cy={42} r="1" fill={stroke} />

        {/* Level indicator (right side) */}
        <line x1={bodyRight + headRx + 1} y1={drumTop + 2} x2={bodyRight + headRx + 1} y2={drumBot - 2} stroke={stroke} strokeWidth="0.6" />
        <line x1={bodyRight + headRx} y1={drumTop + 2} x2={bodyRight + headRx + 2} y2={drumTop + 2} stroke={stroke} strokeWidth="0.5" />
        <line x1={bodyRight + headRx} y1={drumBot - 2} x2={bodyRight + headRx + 2} y2={drumBot - 2} stroke={stroke} strokeWidth="0.5" />

        {/* Support saddles */}
        <path d={`M14,${drumBot} L12,${drumBot + 4} L16,${drumBot + 4} Z`} fill="none" stroke={stroke} strokeWidth="1" />
        <path d={`M34,${drumBot} L32,${drumBot + 4} L36,${drumBot + 4} Z`} fill="none" stroke={stroke} strokeWidth="1" />
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

export default Drum;
