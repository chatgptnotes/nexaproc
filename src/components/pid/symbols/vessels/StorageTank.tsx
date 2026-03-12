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
 * Storage Tank — ISA 5.1 / PIP Standard
 * Flat-bottom cylindrical tank: rectangle with flat top, nozzle connections
 * on sides. fillLevel renders as colored liquid inside.
 */
const StorageTank: React.FC<SymbolProps> = ({
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

  // Tank body dimensions
  const tankLeft = 10;
  const tankRight = 38;
  const tankTop = 6;
  const tankBottom = 40;
  const tankHeight = tankBottom - tankTop;
  const liquidTop = tankBottom - (tankHeight * level) / 100;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-storage-tank ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .pid-liquid-wave { animation: pidLiquidWave 3s ease-in-out infinite; }
        @keyframes pidLiquidWave {
          0%, 100% { d: path(var(--wave-path-1)); }
          50% { d: path(var(--wave-path-2)); }
        }
      `}</style>
      <defs>
        <clipPath id={`storageTankClip-${size}`}>
          <rect x={tankLeft} y={tankTop} width={tankRight - tankLeft} height={tankHeight} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#storageTankClip-${size})`}>
            <rect
              x={tankLeft}
              y={liquidTop}
              width={tankRight - tankLeft}
              height={tankBottom - liquidTop}
              fill={liquidColor}
            />
            {/* Liquid surface line */}
            {isRunning ? (
              <path
                d={`M${tankLeft},${liquidTop} Q${(tankLeft + tankRight) / 2 - 3},${liquidTop - 1.5} ${(tankLeft + tankRight) / 2},${liquidTop} Q${(tankLeft + tankRight) / 2 + 3},${liquidTop + 1.5} ${tankRight},${liquidTop}`}
                stroke={stroke}
                strokeWidth="0.8"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values={`M${tankLeft},${liquidTop} Q${(tankLeft + tankRight) / 2 - 3},${liquidTop - 1.5} ${(tankLeft + tankRight) / 2},${liquidTop} Q${(tankLeft + tankRight) / 2 + 3},${liquidTop + 1.5} ${tankRight},${liquidTop};M${tankLeft},${liquidTop} Q${(tankLeft + tankRight) / 2 - 3},${liquidTop + 1.5} ${(tankLeft + tankRight) / 2},${liquidTop} Q${(tankLeft + tankRight) / 2 + 3},${liquidTop - 1.5} ${tankRight},${liquidTop};M${tankLeft},${liquidTop} Q${(tankLeft + tankRight) / 2 - 3},${liquidTop - 1.5} ${(tankLeft + tankRight) / 2},${liquidTop} Q${(tankLeft + tankRight) / 2 + 3},${liquidTop + 1.5} ${tankRight},${liquidTop}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
            ) : (
              <line
                x1={tankLeft}
                y1={liquidTop}
                x2={tankRight}
                y2={liquidTop}
                stroke={stroke}
                strokeWidth="0.8"
              />
            )}
          </g>
        )}

        {/* Tank body — flat-bottom rectangular (cylindrical representation) */}
        <rect
          x={tankLeft}
          y={tankTop}
          width={tankRight - tankLeft}
          height={tankHeight}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Flat top plate */}
        <line x1={tankLeft - 2} y1={tankTop} x2={tankRight + 2} y2={tankTop} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />

        {/* Bottom plate / support */}
        <line x1={tankLeft - 2} y1={tankBottom} x2={tankRight + 2} y2={tankBottom} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />

        {/* Left nozzle connection (inlet) */}
        <line x1={2} y1={14} x2={tankLeft} y2={14} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={2} cy={14} r="1.2" fill={stroke} />

        {/* Right nozzle connection (outlet) */}
        <line x1={tankRight} y1={34} x2={46} y2={34} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={46} cy={34} r="1.2" fill={stroke} />

        {/* Vent on top */}
        <line x1={24} y1={tankTop} x2={24} y2={2} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <line x1={22} y1={2} x2={26} y2={2} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Support legs */}
        <line x1={14} y1={tankBottom} x2={12} y2={46} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={34} y1={tankBottom} x2={36} y2={46} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
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

export default StorageTank;
