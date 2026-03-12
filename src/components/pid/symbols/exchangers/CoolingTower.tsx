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
 * Cooling Tower — P&ID Standard
 * Hyperbolic tower shape (hourglass profile) with water distribution
 * at top, fill/packing inside, air inlet at bottom, and basin at base.
 * Water flow down, air flow up (countercurrent).
 */
const CoolingTower: React.FC<SymbolProps> = ({
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

  // Hyperbolic tower profile
  const towerPath = `
    M 10,44
    L 10,40
    Q 10,28 16,22
    Q 18,20 18,16
    Q 18,8 14,4
    L 34,4
    Q 30,8 30,16
    Q 30,20 32,22
    Q 38,28 38,40
    L 38,44
    Z
  `;

  // Basin at bottom
  const basinTop = 40;
  const basinBot = 46;
  const basinL = 8;
  const basinR = 40;
  const basinH = basinBot - basinTop;
  const basinLiquidY = basinBot - (basinH * level) / 100;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-exchanger pid-cooling-tower ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`ctBasinClip-${size}`}>
          <rect x={basinL} y={basinTop} width={basinR - basinL} height={basinH} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Tower body (hyperbolic profile) */}
        <path d={towerPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Fill/packing section (cross-hatch) */}
        <g>
          {[26, 30, 34].map((y, i) => (
            <g key={i}>
              <line x1={12 + (44 - y) * 0.2} y1={y} x2={36 - (44 - y) * 0.2} y2={y} stroke={stroke} strokeWidth="0.5" opacity="0.4" />
            </g>
          ))}
          {/* Cross pattern in fill */}
          <line x1={18} y1={24} x2={24} y2={36} stroke={stroke} strokeWidth="0.4" opacity="0.3" />
          <line x1={24} y1={24} x2={30} y2={36} stroke={stroke} strokeWidth="0.4" opacity="0.3" />
          <line x1={30} y1={24} x2={24} y2={36} stroke={stroke} strokeWidth="0.4" opacity="0.3" />
          <line x1={24} y1={24} x2={18} y2={36} stroke={stroke} strokeWidth="0.4" opacity="0.3" />
        </g>

        {/* Water distribution at top (spray nozzles) */}
        <line x1={18} y1={12} x2={30} y2={12} stroke={stroke} strokeWidth="0.8" />
        {[20, 24, 28].map((x, i) => (
          <g key={`spray-${i}`}>
            <line x1={x} y1={12} x2={x} y2={14} stroke={stroke} strokeWidth="0.4" />
            {isRunning && (
              <>
                <line x1={x - 1} y1={14} x2={x + 1} y2={16} stroke={stroke} strokeWidth="0.3" opacity="0.4" />
                <line x1={x + 1} y1={14} x2={x - 1} y2={16} stroke={stroke} strokeWidth="0.3" opacity="0.4" />
              </>
            )}
          </g>
        ))}

        {/* Hot water inlet (top — to distribution) */}
        <line x1={4} y1={12} x2={18} y2={12} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={4} cy={12} r="1" fill={stroke} />

        {/* Vapor/steam plume at top */}
        {isRunning && (
          <g>
            {[20, 24, 28].map((x, i) => (
              <path
                key={`plume-${i}`}
                d={`M${x},4 Q${x - 1},2 ${x},0`}
                fill="none"
                stroke={stroke}
                strokeWidth="0.5"
                opacity="0.3"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;0;0.3"
                  dur={`${1.5 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </path>
            ))}
          </g>
        )}

        {/* Air inlet arrows (bottom sides) */}
        <polygon points="8,38 5,40 8,42" fill={stroke} opacity="0.5" />
        <polygon points="40,38 43,40 40,42" fill={stroke} opacity="0.5" />

        {/* Basin (cold water collection) */}
        <rect
          x={basinL}
          y={basinTop}
          width={basinR - basinL}
          height={basinH}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
        />

        {/* Basin water level */}
        {level > 0 && (
          <g clipPath={`url(#ctBasinClip-${size})`}>
            <rect
              x={basinL}
              y={basinLiquidY}
              width={basinR - basinL}
              height={basinBot - basinLiquidY}
              fill={liquidColor}
            />
          </g>
        )}

        {/* Cold water outlet (from basin) */}
        <line x1={basinR} y1={44} x2={46} y2={44} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={46} cy={44} r="1" fill={stroke} />

        {/* Water falling animation (droplets inside tower) */}
        {isRunning && (
          <>
            {[18, 22, 26, 30].map((x, i) => (
              <line
                key={`drop-${i}`}
                x1={x}
                y1={16}
                x2={x}
                y2={18}
                stroke={stroke}
                strokeWidth="0.5"
                opacity="0.3"
              >
                <animate
                  attributeName="y1"
                  values="16;36"
                  dur={`${1 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="18;38"
                  dur={`${1 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.1"
                  dur={`${1 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </line>
            ))}
          </>
        )}
      </g>

      {label && (
        <text
          x="24"
          y="58"
          textAnchor="middle"
          fontSize="6.5"
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

export default CoolingTower;
