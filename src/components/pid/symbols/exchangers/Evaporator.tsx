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
 * Evaporator — P&ID Standard
 * Vessel with heating element at the bottom and vapor outlet at top.
 * Shows a vertical vessel with internal heating coil/element, liquid
 * inlet, concentrate outlet, and vapor disengagement space at top.
 */
const Evaporator: React.FC<SymbolProps> = ({
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

  const vL = 12;
  const vR = 36;
  const vW = vR - vL;
  const vTop = 6;
  const vBot = 42;
  const headRy = 3;

  const totalBot = vBot + headRy;
  const totalTop = vTop - headRy;
  const totalH = totalBot - totalTop;
  const liquidY = totalBot - (totalH * level) / 100;

  const vesselPath = `
    M ${vL},${vTop}
    A ${vW / 2},${headRy} 0 0,1 ${vR},${vTop}
    L ${vR},${vBot}
    A ${vW / 2},${headRy} 0 0,1 ${vL},${vBot}
    Z
  `;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-exchanger pid-evaporator ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`evapClip-${size}`}>
          <path d={vesselPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#evapClip-${size})`}>
            <rect
              x={vL - 1}
              y={liquidY}
              width={vW + 2}
              height={totalBot - liquidY + 1}
              fill={liquidColor}
            />
            <line x1={vL} y1={liquidY} x2={vR} y2={liquidY} stroke={stroke} strokeWidth="0.5" />
          </g>
        )}

        {/* Vessel body */}
        <path d={vesselPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Internal heating element (zigzag coil at bottom) */}
        <g clipPath={`url(#evapClip-${size})`}>
          <path
            d={`M ${vL + 3},${vBot - 6} L ${vL + 6},${vBot - 10} L ${vL + 10},${vBot - 6} L ${vL + 14},${vBot - 10} L ${vL + 18},${vBot - 6} L ${vL + 22},${vBot - 10}`}
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Steam supply to heating element */}
        <line x1={4} y1={vBot - 8} x2={vL} y2={vBot - 8} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={4} cy={vBot - 8} r="0.8" fill={stroke} />
        <text x={2} y={vBot - 10} fontSize="3" fill={stroke} fontFamily="'Inter', sans-serif">S</text>

        {/* Condensate return from element */}
        <line x1={vR} y1={vBot - 4} x2={44} y2={vBot - 4} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Feed inlet (left middle) */}
        <line x1={4} y1={24} x2={vL} y2={24} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={4} cy={24} r="1" fill={stroke} />

        {/* Concentrate outlet (bottom) */}
        <line x1={24} y1={totalBot} x2={24} y2={47} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={24} cy={47} r="1" fill={stroke} />

        {/* Vapor outlet (top) */}
        <line x1={24} y1={totalTop} x2={24} y2={0} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <polygon points="23,1 24,0 25,1" fill={stroke} />

        {/* Vapor rising animation (bubbles) */}
        {isRunning && (
          <g clipPath={`url(#evapClip-${size})`}>
            {[18, 22, 26, 30].map((x, i) => (
              <circle key={i} cx={x} cy={vBot - 4} r="0.7" fill={stroke} opacity="0.3">
                <animate
                  attributeName="cy"
                  values={`${vBot - 4};${vTop + 2}`}
                  dur={`${1.5 + i * 0.25}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0"
                  dur={`${1.5 + i * 0.25}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="0.7;1.2"
                  dur={`${1.5 + i * 0.25}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}

        {/* Demister pad (mesh at top) */}
        <g clipPath={`url(#evapClip-${size})`}>
          <line x1={vL + 2} y1={vTop + 4} x2={vR - 2} y2={vTop + 4} stroke={stroke} strokeWidth="0.5" strokeDasharray="1,1" />
          <line x1={vL + 2} y1={vTop + 5.5} x2={vR - 2} y2={vTop + 5.5} stroke={stroke} strokeWidth="0.5" strokeDasharray="1,1" />
        </g>
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

export default Evaporator;
