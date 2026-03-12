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
 * Reactor (CSTR) — Continuous Stirred Tank Reactor
 * Vessel with dished bottom, motor on top, shaft through center,
 * impeller blades, and cooling jacket (double wall).
 */
const ReactorCSTR: React.FC<SymbolProps> = ({
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

  // Vessel body
  const vL = 13;
  const vR = 35;
  const vW = vR - vL;
  const vTop = 12;
  const vBot = 40;
  const vH = vBot - vTop;
  const headRy = 3.5;

  const totalBot = vBot + headRy;
  const totalTop = vTop;
  const totalH = totalBot - totalTop;
  const liquidY = totalBot - (totalH * level) / 100;

  // Vessel path with dished bottom
  const vesselPath = `
    M ${vL},${vTop}
    L ${vL},${vBot}
    A ${vW / 2},${headRy} 0 0,0 ${vR},${vBot}
    L ${vR},${vTop}
    L ${vL},${vTop}
    Z
  `;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-reactor-cstr ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`cstrClip-${size}`}>
          <path d={vesselPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#cstrClip-${size})`}>
            <rect
              x={vL - 1}
              y={liquidY}
              width={vW + 2}
              height={totalBot - liquidY + 1}
              fill={liquidColor}
            />
            <line x1={vL} y1={liquidY} x2={vR} y2={liquidY} stroke={stroke} strokeWidth="0.6" />
          </g>
        )}

        {/* Cooling jacket (double wall) */}
        <path
          d={`M ${vL - 2.5},${vTop + 3} L ${vL - 2.5},${vBot - 1} A ${vW / 2 + 2.5},${headRy + 1} 0 0,0 ${vR + 2.5},${vBot - 1} L ${vR + 2.5},${vTop + 3}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeDasharray="2,1.5"
        />

        {/* Vessel body outline */}
        <path d={vesselPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Flat top plate */}
        <line x1={vL - 1} y1={vTop} x2={vR + 1} y2={vTop} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Motor housing on top */}
        <rect x={20} y={2} width={8} height={6} rx={1} fill="none" stroke={stroke} strokeWidth="1.5" />
        {/* Motor symbol M */}
        <text x="24" y="7" textAnchor="middle" fontSize="5" fontFamily="'Inter', sans-serif" fill={stroke} fontWeight="700">M</text>

        {/* Agitator shaft */}
        <line x1={24} y1={8} x2={24} y2={36} stroke={stroke} strokeWidth="1.2" strokeLinecap="round">
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </line>

        {/* Impeller blades */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 30"
              to="360 24 30"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          <line x1={18} y1={30} x2={24} y2={28} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={24} y1={28} x2={30} y2={30} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={18} y1={32} x2={24} y2={34} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={24} y1={34} x2={30} y2={32} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Feed inlet (left) */}
        <line x1={4} y1={16} x2={vL} y2={16} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={4} cy={16} r="1" fill={stroke} />

        {/* Product outlet (right bottom) */}
        <line x1={vR} y1={36} x2={44} y2={36} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={44} cy={36} r="1" fill={stroke} />

        {/* Jacket connections */}
        <line x1={4} y1={24} x2={vL - 2.5} y2={24} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <line x1={vR + 2.5} y1={32} x2={44} y2={32} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
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

export default ReactorCSTR;
