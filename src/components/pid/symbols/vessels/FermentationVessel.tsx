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
 * Fermentation Vessel — P&ID Standard
 * Jacketed vessel with fermenter-specific features: sparger ring at bottom
 * for aeration, exhaust/vent at top with condenser, agitator, temperature
 * probe, and sample port. Dished top and bottom heads.
 */
const FermentationVessel: React.FC<SymbolProps> = ({
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

  // Vessel dimensions
  const vL = 13;
  const vR = 35;
  const vW = vR - vL;
  const vTop = 8;
  const vBot = 40;
  const vH = vBot - vTop;
  const headRy = 3.5;

  const totalBot = vBot + headRy;
  const totalTop = vTop - headRy;
  const totalH = totalBot - totalTop;
  const liquidY = totalBot - (totalH * level) / 100;

  // Vessel path with dished top and bottom
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
      className={`pid-vessel pid-fermentation-vessel ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`fermClip-${size}`}>
          <path d={vesselPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#fermClip-${size})`}>
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

        {/* Cooling jacket (dashed outer wall) */}
        <path
          d={`M ${vL - 2.5},${vTop + 2} L ${vL - 2.5},${vBot - 1} A ${(vW + 5) / 2},${headRy + 1.2} 0 0,1 ${vR + 2.5},${vBot - 1} L ${vR + 2.5},${vTop + 2}`}
          fill="none"
          stroke={stroke}
          strokeWidth="0.8"
          strokeDasharray="2,1.5"
        />

        {/* Vessel body */}
        <path d={vesselPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Agitator motor */}
        <rect x={20} y={0} width={8} height={4.5} rx={1} fill="none" stroke={stroke} strokeWidth="1.2" />
        <text x="24" y="3.5" textAnchor="middle" fontSize="3.5" fontFamily="'Inter', sans-serif" fill={stroke} fontWeight="700">M</text>

        {/* Agitator shaft */}
        <line x1={24} y1={4.5} x2={24} y2={36} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Impeller blades */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 28"
              to="360 24 28"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          <line x1={18} y1={28} x2={30} y2={28} stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
          <line x1={18} y1={27} x2={18} y2={29} stroke={stroke} strokeWidth="1" />
          <line x1={30} y1={27} x2={30} y2={29} stroke={stroke} strokeWidth="1" />
        </g>

        {/* Sparger ring at bottom (aeration) */}
        <g clipPath={`url(#fermClip-${size})`}>
          <ellipse cx={24} cy={38} rx={6} ry={1.5} fill="none" stroke={stroke} strokeWidth="0.8" strokeDasharray="1.5,1" />
          {/* Sparger holes (small dots) */}
          {[18, 21, 24, 27, 30].map((x, i) => (
            <circle key={`sp-${i}`} cx={x} cy={38} r="0.4" fill={stroke} opacity="0.6" />
          ))}
          {/* Air bubbles from sparger */}
          {isRunning && (
            <>
              {[19, 22, 24, 26, 29].map((x, i) => (
                <circle key={`ab-${i}`} cx={x} cy={37} r="0.5" fill={stroke} opacity="0.3">
                  <animate
                    attributeName="cy"
                    values={`37;${vTop + 2}`}
                    dur={`${1.8 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0"
                    dur={`${1.8 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="0.5;1"
                    dur={`${1.8 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </>
          )}
        </g>

        {/* Air/gas inlet to sparger (bottom) */}
        <line x1={4} y1={38} x2={vL - 2.5} y2={38} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <circle cx={4} cy={38} r="0.8" fill={stroke} />
        <text x={3} y={36} fontSize="3" fill={stroke} fontFamily="'Inter', sans-serif">Air</text>

        {/* Exhaust/vent at top */}
        <line x1={30} y1={vTop - headRy} x2={30} y2={1} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <polygon points="29,2 30,0 31,2" fill={stroke} />
        <text x={33} y={3} fontSize="3" fill={stroke} fontFamily="'Inter', sans-serif">EX</text>

        {/* Feed inlet (left) */}
        <line x1={4} y1={14} x2={vL} y2={14} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={4} cy={14} r="1" fill={stroke} />

        {/* Harvest outlet (right bottom) */}
        <line x1={vR} y1={36} x2={44} y2={36} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={44} cy={36} r="1" fill={stroke} />

        {/* Sample port (right middle) */}
        <line x1={vR} y1={24} x2={40} y2={24} stroke={stroke} strokeWidth="0.8" strokeLinecap="round" />
        <circle cx={40} cy={24} r="1.2" fill="none" stroke={stroke} strokeWidth="0.6" />
        <text x={42} y={23} fontSize="2.5" fill={stroke} fontFamily="'Inter', sans-serif">S</text>

        {/* Temperature probe (left) */}
        <line x1={vL} y1={24} x2={vL + 4} y2={24} stroke={stroke} strokeWidth="0.8" />
        <line x1={5} y1={24} x2={vL} y2={24} stroke={stroke} strokeWidth="0.8" strokeLinecap="round" />
        <circle cx={5} cy={24} r="1" fill="none" stroke={stroke} strokeWidth="0.6" />
        <text x={4} y={22} fontSize="2.5" fill={stroke} fontFamily="'Inter', sans-serif">T</text>

        {/* Jacket connections */}
        <line x1={4} y1={32} x2={vL - 2.5} y2={32} stroke={stroke} strokeWidth="0.8" />
        <line x1={vR + 2.5} y1={18} x2={44} y2={18} stroke={stroke} strokeWidth="0.8" />

        {/* Support legs */}
        <line x1={vL + 1} y1={totalBot} x2={vL - 1} y2={47} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <line x1={vR - 1} y1={totalBot} x2={vR + 1} y2={47} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
      </g>

      {label && (
        <text
          x="24"
          y="58"
          textAnchor="middle"
          fontSize="6"
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

export default FermentationVessel;
